import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IUploadMultiInfo, taskCode, IUploadMultiFile, TMode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import {
  AssetInvestigationDocument,
  AssetInvestigationLitigationInfoResponse,
  AssetInvestigationPersons,
  LitigationCaseShortDto,
} from '@lexs/lexs-client';
import { InvestigatePropertyService } from '../investigate-property.service';
import { DOC_TEMPLATE } from '@app/shared/constant';

interface InvestigatePropertyDocument extends AssetInvestigationPersons {
  isOpened: boolean;
  content?: string;
  useCIF?: boolean;
  documentUpload: IUploadMultiFile[];
}
@Component({
  selector: 'app-investigate-property-detail',
  templateUrl: './investigate-property-detail.component.html',
  styleUrls: ['./investigate-property-detail.component.scss'],
})
export class InvestigatePropertyDetailComponent implements OnInit {
  public tabIndex = 0;
  public litigationCaseShortDetail!: LitigationCaseShortDto;
  public caseDetailTitle = 'INVESTIGATE_PROPERTY.CASE_DETAIL';
  public processingDocument: any = [];
  public display: Array<any> = ['documentName', 'uploadDate'];
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public taskCode!: taskCode;
  public assetInvestigationInfo!: AssetInvestigationLitigationInfoResponse;

  private tooltipLEXSD002Title = 'เอกสารบุคคลธรรมดา';
  private tooltipLEXSD002Content = '1.สำเนาบัตรประชาชน/passport<br>2.สำเนาทะเบียนบ้าน<br>3.สำเนาใบทะเบียนสมรส';
  private tooltipLEXSD001Title = 'เอกสารนิติบุคคล';
  private tooltipLEXSD001Content =
    '1.หนังสือรับรองการจดทะเบียนเป็นนิติบุคคล<br>2.สำเนาบัตรประชาชน/passport  ของผู้มีอำนาจลงนาม';

  public litigationDocuments: InvestigatePropertyDocument[] = [];
  public dataList: InvestigatePropertyDocument[] = [];
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public mode!: TMode;
  public isSeleted = true;

  constructor(
    private litigationCaseService: LitigationCaseService,
    private investigatePropertyService: InvestigatePropertyService
  ) {}

  ngOnInit(): void {
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
    this.assetInvestigationInfo = this.investigatePropertyService.assetInvestigationInfo;
    const _litigationDocuments = this.assetInvestigationInfo.litigationDocuments?.filter(it => it.imageId) || [];
    const _litigationDocumentsUpload = this.initProcessingDocumentUpload(_litigationDocuments);
    this.litigationDocuments = [{ isOpened: true, documentUpload: _litigationDocumentsUpload }];
    const persons: any[] = this.assetInvestigationInfo.persons || [];
    const deathPersons = persons
      .filter(it => it.personStatus === 'DEATH')
      .sort((a, b) => a.personSeqNo - b.personSeqNo);
    const alivePersons = persons
      .filter(it => it.personStatus !== 'DEATH')
      .sort((a, b) => a.personSeqNo - b.personSeqNo);
    let newListPersons = [...alivePersons, ...deathPersons];
    if (this.assetInvestigationInfo.status !== 'PENDING') {
      newListPersons = newListPersons.filter(it => it.activeFlag);
    }
    this.dataList = newListPersons.map((m: AssetInvestigationPersons, index: any) => {
      const personId = m.cifNo ? m.cifNo : m.taxNo;
      const isDisplayCif = ['CO_BORROWER', 'MAIN_BORROWER', 'GUARANTOR'].includes(m.relation || '');
      return {
        ...m,
        isOpened: true,
        useCIF: isDisplayCif,
        documentUpload: this.initDocumentUpload(m.personDocuments?.filter(it => it.imageId) || [], personId),
        content:
          m.relatedLitigations && m.relatedLitigations?.length > 0
            ? m.relatedLitigations?.map(it => it.litigationId).join(',')
            : '',
      } as InvestigatePropertyDocument;
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = Number(event.tab.textLabel);
  }

  private initProcessingDocumentUpload(dataDoc: AssetInvestigationDocument[]) {
    const documentUpload =
      dataDoc && dataDoc.length > 0
        ? dataDoc.map((m: AssetInvestigationDocument, index: any) => {
            const isMultipleUploadDoc = [DOC_TEMPLATE.LEXSF193, DOC_TEMPLATE.LEXSF194, DOC_TEMPLATE.LEXSF195].includes(
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
                indexOnly: !isMultipleUploadDoc,
                active: false,
                removeDocument: true,
                multipleUpload: isMultipleUploadDoc,
                imageSource: m.imageSource,
              } as IUploadMultiFile;
            } else {
              return {
                ...m,
                imageId: m.imageId,
                documentTemplate: m.documentTemplate,
                documentTemplateId: m.documentTemplate?.documentTemplateId,
                uploadDate: m.uploadTimestamp,
                indexOnly: !isMultipleUploadDoc,
                active: false,
                removeDocument: true,
                multipleUpload: isMultipleUploadDoc,
                imageSource: m.imageSource,
              } as IUploadMultiFile;
            }
          })
        : [];
    return documentUpload;
  }

  private initDocumentUpload(dataDoc: AssetInvestigationDocument[], personId: any) {
    const originalFile = dataDoc.filter(it => it.originalDocument || !it.documentTemplate?.optional);
    const optionalFile = dataDoc.filter(it => !it.originalDocument && it.documentTemplate?.optional);
    dataDoc = originalFile.sort((a: any, b: any) => {
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
        const isMultipleUploadDoc = [DOC_TEMPLATE.LEXSD007, DOC_TEMPLATE.LEXSD008].includes(
          m.documentTemplate?.documentTemplateId || ''
        );
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
          indexOnly: !isMultipleUploadDoc || (isMultipleUploadDoc && m.originalDocument),
          active: false,
          removeDocument: true,
          multipleUpload: isMultipleUploadDoc,
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
}
