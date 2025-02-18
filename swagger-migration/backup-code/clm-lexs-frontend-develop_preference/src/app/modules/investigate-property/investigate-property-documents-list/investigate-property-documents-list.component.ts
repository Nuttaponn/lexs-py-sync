import { Component, Input, OnInit } from '@angular/core';
import { IUploadMultiFile, IUploadMultiInfo, TMode } from '@shared/models';
import { DocumentService } from '@shared/components/document-preparation/document.service';
import { TaskService } from '@modules/task/services/task.service';
import { LitigationCaseService } from '@shared/services/litigation-case.service';
import { InvestigatePropertyService } from '@modules/investigate-property/investigate-property.service';
import { DOC_TEMPLATE } from '@shared/constant';
import {
  AssetInvestigationDocument,
  AssetInvestigationLitigationCaseCreateInfoResponse,
  AssetInvestigationPersons,
  DocumentDto,
  PersonDto,
} from '@lexs/lexs-client';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

interface InvestigatePropertyDocument extends AssetInvestigationPersons {
  isOpened: boolean;
  content?: string;
  useCIF?: boolean;
  documentUpload: IUploadMultiFile[];
}

@Component({
  selector: 'app-investigate-property-documents-list',
  templateUrl: './investigate-property-documents-list.component.html',
  styleUrls: ['./investigate-property-documents-list.component.scss'],
})
export class InvestigatePropertyDocumentsListComponent implements OnInit {
  mainMessageBanner = 'INVESTIGATE_PROPERTY.DOCS_LIST.MAIN_MSG_BANNER';
  @Input() form!: UntypedFormGroup;
  @Input() isViewMode: boolean = false;
  @Input() data!: AssetInvestigationLitigationCaseCreateInfoResponse;
  @Input() defaultExpanded = true;

  public litigationDocuments: InvestigatePropertyDocument[] = [];
  public dataList: InvestigatePropertyDocument[] = [];
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public uploadMultiInfo: IUploadMultiInfo = { cif: '', litigationId: '' };
  public mode!: TMode;
  public isSeleted = true;

  private tooltipLEXSD002Title = 'เอกสารบุคคลธรรมดา';
  private tooltipLEXSD002Content = '1.สำเนาบัตรประชาชน/passport<br>2.สำเนาทะเบียนบ้าน<br>3.สำเนาใบทะเบียนสมรส';
  private tooltipLEXSD001Title = 'เอกสารนิติบุคคล';
  private tooltipLEXSD001Content =
    '1.หนังสือรับรองการจดทะเบียนเป็นนิติบุคคล<br>2.สำเนาบัตรประชาชน/passport  ของผู้มีอำนาจลงนาม';

  constructor(
    private documentService: DocumentService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService,
    private investigatePropertyService: InvestigatePropertyService
  ) {}

  ngOnInit(): void {
    console.log(this.form.getRawValue());
    const dataForm = this.form.getRawValue();
    const _litigationDocuments = dataForm.litigationDocuments || [];
    const _litigationDocumentsUpload = this.initProcessingDocumentUpload(_litigationDocuments);
    this.litigationDocuments = [{ isOpened: true, documentUpload: _litigationDocumentsUpload }];
    const persons: any[] = dataForm.persons || [];
    this.dataList = persons.map((m: AssetInvestigationPersons, index: any) => {
      const personId = m.cifNo ? m.cifNo : m.taxNo;
      const isAlive = m.personStatus !== PersonDto.PersonStatusEnum.Death;
      const isDisplayCif = ['CO_BORROWER', 'MAIN_BORROWER', 'GUARANTOR'].includes(m.relation || '');
      return {
        ...m,
        activeFlag: true,
        isOpened: isAlive,
        useCIF: isDisplayCif,
        documentUpload: this.initDocumentUpload(m.personDocuments || [], personId),
        content:
          m.relatedLitigations && m.relatedLitigations?.length > 0
            ? m.relatedLitigations?.map(it => it.litigationId).join(',')
            : '',
      } as InvestigatePropertyDocument;
    });
    this.uploadMultiInfo = {
      cif: this.taskService.taskDetail?.customerId
        ? this.taskService.taskDetail.customerId
        : this.litigationCaseService.litigationCaseShortDetail?.cifNo || '',
      litigationId: this.taskService.taskDetail.litigationId,
    };
  }

  getControl(index: number): AbstractControl {
    const persons = this.getSuspendAuctionResultDocumentsControls();
    return persons.at(index).get('personDocuments') as UntypedFormControl;
  }

  getSuspendAuctionResultDocumentsControls() {
    return this.form.get('persons') as UntypedFormArray;
  }

  private initProcessingDocumentUpload(dataDoc: AssetInvestigationDocument[]) {
    let originalFile = dataDoc.filter(it => it.originalDocument || !it.documentTemplate?.optional);
    const optionaHasImageFile = dataDoc.filter(
      it => !it.originalDocument && it.documentTemplate?.optional && it.imageId
    );
    const optionalFile = dataDoc.filter(it => !it.originalDocument && it.documentTemplate?.optional && !it.imageId);
    originalFile = originalFile.sort((a: any, b: any) => {
      const firstValue = a.documentTemplate?.documentSeqNo || '';
      const secondValue = b.documentTemplate?.documentSeqNo || '';
      const result = firstValue.localeCompare(secondValue, 'en');
      return result;
    });
    dataDoc = [...originalFile, ...optionaHasImageFile, ...optionalFile];
    const documentUpload =
      dataDoc && dataDoc.length > 0
        ? dataDoc.map((m: AssetInvestigationDocument, index: any) => {
            const isOptionalUploadDoc = [DOC_TEMPLATE.LEXSF193, DOC_TEMPLATE.LEXSF194, DOC_TEMPLATE.LEXSF195].includes(
              m.documentTemplate?.documentTemplateId || ''
            );
            const isMandatoryUploadDoc = [
              DOC_TEMPLATE.LEXSF018,
              DOC_TEMPLATE.LEXSF010,
              DOC_TEMPLATE.LEXSF008,
              DOC_TEMPLATE.LEXSF012,
              DOC_TEMPLATE.LEXSF052,
              DOC_TEMPLATE.LEXSF013,
            ].includes(m.documentTemplate?.documentTemplateId || '');
            if (m.originalDocument) {
              return {
                ...m,
                imageId: m.imageId,
                documentTemplate: m.documentTemplate,
                documentTemplateId: m.documentTemplate?.documentTemplateId,
                uploadDate: m.uploadTimestamp,
                uploadRequired: false,
                indexOnly: !isOptionalUploadDoc,
                active: false,
                removeDocument: true,
                multipleUpload: false,
                imageSource: m.imageSource,
              } as IUploadMultiFile;
            } else {
              return {
                ...m,
                imageId: m.imageId,
                documentTemplate: m.documentTemplate,
                documentTemplateId: m.documentTemplate?.documentTemplateId,
                uploadDate: m.uploadTimestamp,
                indexOnly: !isOptionalUploadDoc,
                active: isOptionalUploadDoc && m.imageId && !m.originalDocument,
                removeDocument: true,
                multipleUpload: false,
                imageSource: m.imageSource,
              } as IUploadMultiFile;
            }
          })
        : [];
    return documentUpload;
  }

  private initDocumentUpload(dataDoc: AssetInvestigationDocument[], personId: any) {
    let originalFile = dataDoc.filter(it => it.originalDocument || !it.documentTemplate?.optional);
    const optionalFile = dataDoc.filter(it => !it.originalDocument && it.documentTemplate?.optional);
    originalFile = originalFile.sort((a: any, b: any) => {
      const firstValue = a.documentTemplate?.documentTemplateId || '';
      const secondValue = b.documentTemplate?.documentTemplateId || '';
      const result = firstValue.localeCompare(secondValue, 'en');
      return result;
    });
    dataDoc = [...originalFile, ...optionalFile];
    let documentUpload: any[] = [];
    if (dataDoc && dataDoc.length > 0) {
      const hasLEXSD002_1 =
        dataDoc.filter(
          it =>
            [DOC_TEMPLATE.LEXSD002, DOC_TEMPLATE.LEXSD001, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD002_1].includes(
              it.documentTemplate?.documentTemplateId || ''
            ) && it.originalDocument === true
        ).length > 0;
      if (hasLEXSD002_1) {
        dataDoc = dataDoc.filter(
          it =>
            !(
              [DOC_TEMPLATE.LEXSD002, DOC_TEMPLATE.LEXSD001, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD002_1].includes(
                it.documentTemplate?.documentTemplateId || ''
              ) && it.originalDocument !== true
            )
        );
      }
      documentUpload = dataDoc.map((m: AssetInvestigationDocument, index: any) => {
        const multipleUpload = m.documentTemplate?.multipleUpload || false;
        const isTooltipDoc = [
          DOC_TEMPLATE.LEXSD002,
          DOC_TEMPLATE.LEXSD001,
          DOC_TEMPLATE.LEXSD002_2,
          DOC_TEMPLATE.LEXSD002_1,
        ].includes(m.documentTemplate?.documentTemplateId || '');
        let toolTipTitle = '';
        let toolTipContent = '';
        if ([DOC_TEMPLATE.LEXSD001].includes(m.documentTemplate?.documentTemplateId || '')) {
          toolTipTitle = this.tooltipLEXSD001Title;
          toolTipContent = this.tooltipLEXSD001Content;
        } else if (
          [DOC_TEMPLATE.LEXSD002, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD002_1].includes(
            m.documentTemplate?.documentTemplateId || ''
          )
        ) {
          toolTipTitle = this.tooltipLEXSD002Title;
          toolTipContent = this.tooltipLEXSD002Content;
        }
        let obj = {
          ...m,
          imageId: m.imageId,
          documentTemplate: m.documentTemplate,
          documentTemplateId: m.documentTemplate?.documentTemplateId,
          uploadDate: m.originalDocument && !m.documentTemplate?.optional ? '' : m.uploadTimestamp,
          uploadRequired: false,
          indexOnly: !multipleUpload || (multipleUpload && m.originalDocument),
          active: multipleUpload && m.imageId && !m.originalDocument,
          removeDocument: true,
          multipleUpload: multipleUpload,
          tooltip: isTooltipDoc,
          paramsMsg: [{ title: toolTipTitle, content: toolTipContent }],
          attributes: { id: personId },
          imageSource: m.imageSource,
        } as IUploadMultiFile;

        if (m.originalDocument) {
          obj = { ...obj, uploadRequired: false };
        } else if (
          [DOC_TEMPLATE.LEXSD002, DOC_TEMPLATE.LEXSD001, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD002_1].includes(
            m.documentTemplate?.documentTemplateId || ''
          )
        ) {
          obj = { ...obj, active: true };
        }
        return obj;
      });
    } else {
      documentUpload = [];
    }
    return documentUpload;
  }

  async uploadDocument(_file: File, documentTemplateId: string) {
    try {
      let response;

      response = await this.documentService.uploadDocument(
        this.uploadMultiInfo.cif || '',
        documentTemplateId,
        _file,
        this.uploadMultiInfo.litigationId || ''
      );
      return response ? response.uploadSessionId : null;
    } catch (error: any) {
      return null;
    }
  }

  uploadFileLitigationDocumentsEvent(event: any, index: number) {
    console.log('uploadFileLitigationDocumentsEvent', event);
    if (!event) return;
    this.litigationDocuments[index].documentUpload = event;
    const updateBackForm: Array<AssetInvestigationDocument> = event.map((it: any) => {
      return {
        documentId: it.documentId,
        documentSeqNo: it.documentSeqNo,
        documentTemplate: it.documentTemplate,
        imageId: it.imageId,
        imageName: it.imageName,
        imageSource: it.imageSource,
        originalDocument: it.originalDocument,
        uploadTimestamp: it.uploadDate,
      } as AssetInvestigationDocument;
    });
    this.form?.get('litigationDocuments')?.setValue(updateBackForm);
    this.form?.markAllAsTouched();
    this.investigatePropertyService?.assetInvestigationForm?.get('litigationDocuments')?.setValue(updateBackForm);
    this.investigatePropertyService?.assetInvestigationForm?.markAllAsTouched();
  }

  uploadFileEvent(event: any, index: number) {
    if (!event) return;
    this.dataList[index].documentUpload = event;
    let rawFormData = this.form.getRawValue();
    const rawPersons = rawFormData.persons as Array<AssetInvestigationPersons>;
    rawPersons.forEach(it => {
      const updateData = event.find((ev: any) => ev.attributes.id === it.cifNo || ev.attributes.id === it.taxNo);
      if (updateData) {
        const updateBackForm: Array<AssetInvestigationDocument> = event.map((it: any) => {
          return {
            documentId: it.documentId,
            documentSeqNo: it.documentSeqNo,
            documentTemplate: it.documentTemplate,
            imageId: it.imageId,
            imageName: it.imageName,
            imageSource: it.imageSource,
            originalDocument: it.originalDocument,
            uploadTimestamp: it.uploadDate,
          } as AssetInvestigationDocument;
        });
        it.personDocuments = updateBackForm;
      }
    });

    console.log('uploadFileEvent', rawPersons);
    rawFormData = { ...rawFormData, persons: rawPersons };
    this.investigatePropertyService.assetInvestigationForm =
      this.investigatePropertyService.getAssetInvestigationForm(rawFormData);
    this.form = this.investigatePropertyService.assetInvestigationForm;
    this.form?.markAllAsTouched();
    this.investigatePropertyService?.assetInvestigationForm?.markAllAsTouched();
  }

  async onViewDocument(ele: any) {
    const fileName = ele.imageName;
    let res: any = await this.documentService.getDocument(ele?.uploadSessionId, DocumentDto.ImageSourceEnum.Lexs);
    this.documentService.openPdf(res, `${fileName}.${res?.type.split('/')[1]}`);
  }

  get documentTouched() {
    return this.form?.get('documents') && this.form.get('documents')?.touched;
  }

  get documentErrors() {
    return this.form.get('documents')
      ? this.form?.get('documents')?.hasError('uploadedDocumentCompletedError') || null
      : null;
  }

  updateFlag(e: any, item: InvestigatePropertyDocument) {
    console.log(`${e.currentTarget.checked}-${item.personId}`);
    const rawFormData = this.form.getRawValue();
    const rawPersons = rawFormData.persons as Array<AssetInvestigationPersons>;
    rawPersons.forEach(it => {
      if (it.personId === item.personId) {
        it.activeFlag = e.currentTarget.checked;
      }
    });
    this.form?.get('persons')?.setValue(rawPersons);
    this.form?.markAllAsTouched();
  }
}
