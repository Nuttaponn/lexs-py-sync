import { Component, OnInit } from '@angular/core';
import { IPersonDto } from '@app/modules/customer/customer-detail/person.model';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { IUploadInfo, IUploadMultiFile } from '@app/shared/models';
import { Utils } from '@app/shared/utils/util';
import { DocumentDto, DocumentRequest, PersonLitigationInfo, PersonLitigationInfoRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DebtRelatedInfoTabService } from '../../debt-related-info-tab.service';

@Component({
  selector: 'app-withdraw-lawsuit-defendant-dialog',
  templateUrl: './withdraw-lawsuit-defendant-dialog.component.html',
  styleUrls: ['./withdraw-lawsuit-defendant-dialog.component.scss'],
})
export class WithdrawLawsuitDefendantDialogComponent implements OnInit {
  // ข้อมูลผู้เกี่ยวข้อง
  public relatePersonInfoList: Array<IPersonDto> = [];
  public relatePersonInfoHeader: string[] = ['no', 'name', 'relationDesc', 'identificationNo'];
  // เอกสารเพิ่มเติม
  public documents: Array<DocumentDto> = [];
  public documentHeader: string[] = ['no', 'documentName', 'documentDate'];
  /** for common upload document */
  public docColumn = ['documentName', 'uploadDate'];
  public docs: Array<IUploadMultiFile> = [];
  public uploadInfo!: IUploadInfo;
  public fileList?: Array<any>;
  public isSaveClicked: boolean = false;
  private personLitigation!: PersonLitigationInfo;
  // เหตุผลที่ลบ
  public reason: string = '';
  private taskId!: number;

  constructor(
    private translate: TranslateService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.initDocument();
    this.initData();
  }

  initDocument() {
    this.uploadInfo = {
      cif: this.debtRelatedInfoTabService.currentLitigation.customerId || '',
      litigationId: this.debtRelatedInfoTabService.litigationId || '',
      documentTemplateId: '',
    };
  }

  async initData() {
    this.personLitigation = await this.debtRelatedInfoTabService.getAdditionalPersonsRelation(
      this.debtRelatedInfoTabService.litigationId || '',
      'removePersonLitigation',
      this.taskId
    );
    // get document
    let documentAdditionalPerson = this.personLitigation.documentAdditionalPerson as IUploadMultiFile;
    if (documentAdditionalPerson?.documentTemplate)
      documentAdditionalPerson!.documentTemplate!.documentName =
        documentAdditionalPerson?.documentTemplate?.documentName ||
        this.translate.instant('DEBT_RELATED_INFO_TAB.WITHDRAW_LAWSUIT_DEFENDANT_DIALOG.DOC_PETITION_TITLE');
    this.docs = [documentAdditionalPerson];
    // relate person table
    this.relatePersonInfoList = this.personLitigation.additionalPersons!;
    let imageId = '';
    if (this.personLitigation.reason && this.personLitigation.reason?.length > 0) {
      this.reason = this.personLitigation.reason[0]?.reason || '';
      imageId = this.personLitigation.reason[0]?.imageId || '';
    }
    let file = this.personLitigation.documents?.find(e => e.imageId === imageId);
    let fileList = [];
    fileList.push({
      documentTemplate: {
        ...file?.documentTemplate,
        documentName:
          file?.documentTemplate?.documentName ||
          this.translate.instant('DEBT_RELATED_INFO_TAB.WITHDRAW_LAWSUIT_DEFENDANT_DIALOG.DOC_WITHDRAW_TITLE'),
      },
      documentDate: file?.documentDate,
      imageId: file?.imageId,
    });
    this.documents = fileList;
  }

  async dataContext(data: any) {
    this.taskId = data.taskId;
  }

  onUploadFileEvent(event: IUploadMultiFile[] | null) {
    const fileList = event?.filter(e => e.isUpload);
    this.fileList = fileList || [];
  }

  async onDownloadDocument(doc: DocumentDto) {
    const response: any = await this.documentService.getDocument(doc.imageId || '', DocumentDto.ImageSourceEnum.Lexs);
    const { type } = response;
    Utils.saveAsStrToBlobFile(response, doc?.documentTemplate?.documentName || 'file' + type, type);
  }

  get returnData() {
    return true;
  }

  public async onClose(): Promise<boolean> {
    this.isSaveClicked = true;
    if (this.fileList && this.fileList?.length > 0) {
      let documents: DocumentRequest = this.fileList[0];
      documents.updateFlag = DocumentRequest.UpdateFlagEnum.A;
      const request: PersonLitigationInfoRequest = {
        additionalPersons: this.personLitigation.additionalPersons,
        headerFlag: PersonLitigationInfoRequest.HeaderFlagEnum.Draft,
        litigationId: this.personLitigation.litigationId,
        reason: this.reason,
        documents: documents,
      };
      try {
        await this.debtRelatedInfoTabService.decreasePersonsBlackCase(request, this.taskId);
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }
}
