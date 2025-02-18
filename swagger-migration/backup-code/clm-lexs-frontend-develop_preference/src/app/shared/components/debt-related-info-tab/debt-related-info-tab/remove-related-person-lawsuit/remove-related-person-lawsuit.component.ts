import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { IPersonDto } from '@app/modules/customer/customer-detail/person.model';
import { IUploadInfo, IUploadMultiFile } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { DocumentRequest, PersonDto, PersonLitigationInfo, PersonLitigationInfoRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DebtRelatedInfoTabService } from '../../debt-related-info-tab.service';

@Component({
  selector: 'app-remove-related-person-lawsuit',
  templateUrl: './remove-related-person-lawsuit.component.html',
  styleUrls: ['./remove-related-person-lawsuit.component.scss'],
})
export class RemoveRelatedPersonLawsuitComponent implements OnInit {
  // ข้อมูลผู้รับชำระหนี้แทนและจำเลยร่วม
  public relatePersonInfoList: Array<IPersonDto> = [];
  public listHeader: string[] = ['selected', 'name', 'relationDesc', 'identificationNo'];
  public selection = new SelectionModel<any>(true, []);
  public reason: UntypedFormControl = new UntypedFormControl(null, Validators.required);
  public isSaveClicked: boolean = false;
  /** for common upload document */
  public docColumn = ['documentName', 'uploadDate'];
  public docs: Array<IUploadMultiFile> = [];
  public uploadInfo!: IUploadInfo;
  public fileList: UntypedFormControl = new UntypedFormControl(null, Validators.required);
  private personLitigationInfo!: PersonLitigationInfo;

  constructor(
    private translate: TranslateService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService,
    private notificationService: NotificationService
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
    this.personLitigationInfo = await this.debtRelatedInfoTabService.getAdditionalPersonsRelation(
      this.debtRelatedInfoTabService.litigationId || '',
      'removePersonLitigation'
    );
    // get document
    let documentAdditionalPerson = this.personLitigationInfo?.documentAdditionalPerson as IUploadMultiFile;
    if (documentAdditionalPerson?.documentTemplate)
      documentAdditionalPerson!.documentTemplate!.documentName =
        documentAdditionalPerson?.documentTemplate?.documentName ||
        this.translate.instant('DEBT_RELATED_INFO_TAB.REMOVE_RELATE_PERSON_LEGAL.DOC_UPLOAD_NAME');
    this.docs = [documentAdditionalPerson];
    // for table ข้อมูลผู้เกี่ยวข้อง
    this.relatePersonInfoList = (this.personLitigationInfo?.additionalPersons as Array<IPersonDto>) || [];
    // clear data service
    this.debtRelatedInfoTabService.updatePersonsBlackCase = [];
  }

  get isAllSelected() {
    return this.selection.selected.length === this.relatePersonInfoList.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected) {
      this.selection.clear();
      return;
    } else {
      this.selection.select(...this.relatePersonInfoList);
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.litigationId ?? '' + 1}`;
  }

  onUploadFileEvent(event: IUploadMultiFile[] | null) {
    const fileList = event?.filter(e => e.isUpload);
    this.fileList.patchValue(fileList || []);
  }

  get returnData() {
    return this.selection.selected;
  }

  public async onClose(): Promise<boolean> {
    this.isSaveClicked = true;
    this.reason.markAsTouched();
    this.fileList.markAsTouched();
    if (this.selection.selected.length === 0 || this.reason.invalid || this.fileList.invalid) {
      return false;
    }
    // check CMS Release
    const cmsCheck = this.selection.selected?.some(e => e.relationContractStatus === 'P');
    if (cmsCheck) {
      this.notificationService.alertDialog(
        'DEBT_RELATED_INFO_TAB.REMOVE_RELATE_PERSON_LEGAL.ALERT_MESSAGE_CMS',
        'DEBT_RELATED_INFO_TAB.REMOVE_RELATE_PERSON_LEGAL.ALERT_MESSAGE_DETAIL_CMS'
      );
      return false;
    }
    this.selection.selected?.map((e: IPersonDto) => (e.updateFlag = PersonDto.UpdateFlagEnum.D)); // for delete
    const fileList: DocumentRequest[] = this.fileList?.value;
    let documents: DocumentRequest = fileList[0];
    documents.updateFlag = DocumentRequest.UpdateFlagEnum.A;
    const request: PersonLitigationInfoRequest = {
      additionalPersons: this.selection.selected,
      documents: documents,
      headerFlag: PersonLitigationInfoRequest.HeaderFlagEnum.Draft,
      litigationId: this.debtRelatedInfoTabService.litigationId,
      reason: this.reason?.value,
    };
    try {
      await this.debtRelatedInfoTabService.decreasePersonsBlackCase(request);
      // for display dept relate info tab
      this.debtRelatedInfoTabService.updatePersonsBlackCase = request.additionalPersons as PersonDto[];
      return true;
    } catch (error) {
      return false;
    }
  }
}
