import { UntypedFormGroup } from '@angular/forms';
import { AuctionLedCardService } from '@shared/components/common-tabs/auction-led-card/auction-led-card.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuctionService } from '@app/modules/auction/auction.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import {
  NameValuePair,
  Document,
  DocumentDeedGroup,
  AccountDocumentsResponse,
  AccountDocFollowup,
  ReviewInfo,
  DocumentTemplateDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';
import { AuctionHeaderConfig } from '../auction-header/auction-header.component';
import {
  AccDocScenario,
  ChequeIssuerConstants,
  TaskInitiationType,
  notSpecifiedDocumentsDict,
  specifiedDocumentsDict,
} from './auction-follow-account-doc.const';
import { Subscription } from 'rxjs';
import { RouterService } from '@app/shared/services/router.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';

interface ExtendAccountDocFollowup extends AccountDocFollowup {
  auctionHeaderConfig?: AuctionHeaderConfig;
  convertedDocs?: IUploadMultiFile[];
  latestReviewInfo?: ReviewInfo | null;
  formGroup?: UntypedFormGroup;
  displayOnRequest?: boolean;
}
@Component({
  selector: 'app-auction-follow-account-doc',
  templateUrl: './auction-follow-account-doc.component.html',
  styleUrls: ['./auction-follow-account-doc.component.scss'],
})
export class AuctionFollowAccountDocComponent implements OnInit, OnDestroy {
  public CertifyAccountWarrantStatus = AccountDocFollowup.CertifyAccountWarrantStatusEnum;
  public CertifyAccountWarrantType = AccountDocFollowup.CertifyAccountWarrantTypeEnum;
  public AccountDocVerifyResult = AccountDocFollowup.AccountDocVerifyResultEnum;
  public AccountDocVerifyStatus = AccountDocFollowup.AccountDocVerifyStatusEnum;
  public AccountDocReceiveStatus = AccountDocFollowup.AccountDocReceiveStatusEnum;
  private TaskInitiationType = TaskInitiationType;

  @Input() isEditMode: boolean = false;
  @Input() defaultExpand: boolean = false;
  @Input() isOpened: boolean = false;

  public uploadMultiInfo: IUploadMultiInfo = {
    cif: this.lawsuitService.currentLitigation?.customerId || '',
    litigationId: this.lawsuitService.currentLitigation?.litigationId || '',
  };

  /* form attrs */
  private dataForm!: UntypedFormGroup;

  getControl(name: string) {
    return this.dataForm?.get(name);
  }

  private accountDocumentsResponse!: AccountDocumentsResponse | undefined;
  public accountDocFollowups!: ExtendAccountDocFollowup[];
  public docColumn = ['documentName', 'uploadDate'];
  private configMultiDropdown: DropDownConfig = {
    iconName: '', // icon-Filter
    searchPlaceHolder: '',
    isMultiple: true,
    labelPlaceHolder: 'COMMON.LABEL_LITIGATION_ID',
  };
  private commonDDConfig: DropDownConfig = {
    iconName: '',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.LAWYER',
  };
  public bankDDConfig: DropDownConfig = {
    ...this.commonDDConfig,
    labelPlaceHolder: 'AUCTION_DETAIL.ACCOUNT_DOCUMENT.BANK', // ธนาคาร
  };
  public accountDocDeedGroupConfig = {
    ...this.configMultiDropdown,
    displayWith: 'fsubbidnum',
    // valueField: 'deedGroupId',
    labelPlaceHolder: 'AUCTION_DETAIL.ACCOUNT_DOCUMENT.ACCOUNT_DOC_DEED_GROUPS_LABEL', // รายการชุดทรัพย์
  };
  public accountDocDeedGroupOptions: DocumentDeedGroup[] = [];
  public chequeBankOptions: NameValuePair[] = [];
  private formSubscription!: Subscription;
  private activatedAccDocFollowupNumber: number = -1;
  private currentAccDocScenario!: AccDocScenario.AccDocScenarioEnum | null;
  private responstUnitCode: string =
    this.litigationCaseService.litigationCaseShortDetail?.amdResponseUnitCode ||
    this.litigationCaseService.litigationCaseShortDetail?.responseUnitCode ||
    '';
  private responstUnitName: string =
    this.litigationCaseService?.litigationCaseShortDetail?.amdResponseUnitName ||
    this.litigationCaseService?.litigationCaseShortDetail?.responseUnitName ||
    '';
  public isShowErrorMsg = false; // fix LEX2-27722 errorMsg aren't required in story.
  public isDisableCertifyAccountWarrantType: boolean = false;
  public isDisableAccountDocVerifyStatus: boolean = false;
  public isDisableAccountDocVerifyResult: boolean = false;
  public isDisableCertifyAccountWarrantStatus: boolean = false;
  public isDisableCertifyAccountWarrantDate: boolean = false;
  public isDisableAccountDocReceiveStatus: boolean = false;

  constructor(
    private translate: TranslateService,
    private lawsuitService: LawsuitService,
    private auctionService: AuctionService,
    private auctionLedCardService: AuctionLedCardService,
    private masterDataService: MasterDataService,
    private routerService: RouterService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService
  ) {}

  async ngOnInit() {
    this.uploadMultiInfo = {
      cif:
        this.taskService.taskDetail?.customerId ||
        this.lawsuitService.currentLitigation?.customerId ||
        this.litigationCaseService.litigationCaseShortDetail?.cifNo ||
        '',
      litigationId:
        this.taskService.taskDetail?.litigationId || this.lawsuitService.currentLitigation?.litigationId || '',
    };

    /* main data */
    this.accountDocumentsResponse = this.auctionService.accountDocumentsResponse;

    const aucRef = this.accountDocumentsResponse?.publicAuctionAnnounce?.aucRef || this.auctionService.aucRef || -1;
    await this.setFilteredDeedGroupOptions(aucRef);

    /* Dropdown options */
    this.chequeBankOptions = await this.masterDataService.financialInstitutions(
      ChequeIssuerConstants.LED_CHEQUE_ISSUER
    );

    this.initAuctionFollowAccData();

    /* subscription */
    this.formSubscription = this.dataForm?.valueChanges.subscribe((/*newValues*/) => {
      this.auctionService.accountDocFollowupForm = this.dataForm;

      let i = this.activatedAccDocFollowupNumber;

      const nowAccFollowDocScenario = this.accFollowDocScenario;
      if (this.currentAccDocScenario === nowAccFollowDocScenario) return; // if scenario is still the same, skip "get ConvertedDocs"
      this.currentAccDocScenario = nowAccFollowDocScenario;
      if (!this.currentAccDocScenario) return;

      this.accountDocFollowups[i].convertedDocs = this.getUploadMultiFilesFromMainDto(
        this.accountDocFollowups[i],
        this.currentAccDocScenario,
        true
      );

      this.setDataFormFiles([...(this.accountDocFollowups[i].convertedDocs || [])]);
    });
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  private async setFilteredDeedGroupOptions(aucRef: number) {
    const result = await this.auctionLedCardService.getAccountDocumentDeedGroupsByAucRef(aucRef);

    /* find chosen deedGroupIds from inactive dto */
    const chosenDeedGroupIds = (this.accountDocumentsResponse?.accountDocFollowups || [])
      .filter(dto => !dto.activeFlag)
      .map(dto => (dto.accountDocDeedGroups ?? []).map(dto2 => dto2.deedGroupId || -1))
      .reduce((a: number[], b: number[]) => (a = [...a, ...b]), []);
    /* filter chosen deedGroupIds out of response */
    result.accountDocDeedGroups = (result.accountDocDeedGroups || []).filter(
      dto => !chosenDeedGroupIds.includes(dto.deedGroupId || -1)
    );
    /* sort options */
    result.accountDocDeedGroups.sort((a, b) => Number(a.fsubbidnum) - Number(b.fsubbidnum));
    /* convert response to options */
    this.accountDocDeedGroupOptions = (result.accountDocDeedGroups || []).map(({ fsubbidnum, deedGroupId }) => ({
      fsubbidnum: this.translate.instant('AUCTION_DETAIL.ACCOUNT_DOCUMENT.ASSET_GROUPS') + fsubbidnum, // ชุดทรัพย์ที่
      deedGroupId,
    }));
  }

  initAuctionFollowAccData() {
    this.dataForm = this.auctionService.accountDocFollowupForm;
    this.setSelectedDeepGroupsToForm();

    this.accountDocFollowups = this.accountDocumentsResponse?.accountDocFollowups || [];

    for (let i in this.accountDocFollowups) {
      this.accountDocFollowups[i].auctionHeaderConfig = this.getAccDocFollowHeader(this.accountDocFollowups[i]);
      this.accountDocFollowups[i].latestReviewInfo = this.getLatestReviewInfo(this.accountDocFollowups[i]);
      this.accountDocFollowups[i].displayOnRequest = this.accountDocFollowups[i].initType === this.TaskInitiationType.M;

      /* if activeFlag === true, then documents -> convertedDocs -> this.dataForm?.get('files'); else documents -> convertedDocs */
      if (this.accountDocFollowups[i].activeFlag) {
        if (this.accFollowDocScenario) {
          this.accountDocFollowups[i].convertedDocs = this.getUploadMultiFilesFromMainDto(
            this.accountDocFollowups[i],
            this.accFollowDocScenario,
            false
          );
        }

        this.setDataFormFiles([...(this.accountDocFollowups[i].convertedDocs || [])]);

        if (this.accountDocFollowups[i].displayOnRequest) {
          this.dataForm?.get('certifyAccountWarrantStatus')?.patchValue(this.CertifyAccountWarrantStatus.Receive);
          this.dataForm?.get('accountDocReceiveStatus')?.patchValue(this.AccountDocReceiveStatus.Receive);
        }

        /*fix LEX2-27631 */
        if (!this.accountDocFollowups[i].creditNoteInfo?.recipientDeptCode) {
          this.accountDocFollowups[i].creditNoteInfo = {
            ...this.accountDocFollowups[i].creditNoteInfo,
            recipientDeptCode: this.responstUnitCode,
            recipientDeptName: this.responstUnitName,
          };
          this.dataForm?.get('recipientDeptCode')?.patchValue(this.responstUnitCode);
          this.dataForm?.get('recipientDeptName')?.patchValue(this.responstUnitName);
        }

        this.activatedAccDocFollowupNumber = Number(i);
        this.currentAccDocScenario = this.accFollowDocScenario;
        this.accountDocFollowups[i].formGroup = this.dataForm;

        this.isDisableCertifyAccountWarrantType =
          this.dataForm?.get('certifyAccountWarrantType')?.value === this.CertifyAccountWarrantType.ValidWarrant;
        this.isDisableAccountDocVerifyStatus =
          this.dataForm?.get('accountDocVerifyStatus')?.value === this.AccountDocVerifyStatus.Verified;
        this.isDisableAccountDocVerifyResult =
          this.dataForm?.get('accountDocVerifyResult')?.value === this.AccountDocVerifyResult.ValidData;
        this.isDisableCertifyAccountWarrantStatus =
          this.dataForm?.get('certifyAccountWarrantStatus')?.value === this.CertifyAccountWarrantStatus.Receive;
        this.isDisableCertifyAccountWarrantDate = !!this.dataForm?.get('certifyAccountWarrantDate')?.value;
        this.isDisableAccountDocReceiveStatus =
          this.dataForm?.get('accountDocReceiveStatus')?.value === this.AccountDocReceiveStatus.Receive;
      } else {
        const tempFormGroup = this.auctionService.generateAuctionFollowAccDocFormNoRequiredMode(
          this.accountDocFollowups[i] || {}
        );
        this.accountDocFollowups[i].formGroup = tempFormGroup;
        if (tempFormGroup instanceof UntypedFormGroup) {
          const scenario = this.auctionService.getAuctionFollowAccDocScenario(tempFormGroup);
          this.auctionService.getAuctionFollowAccDocScenario(tempFormGroup);

          if (scenario) {
            this.accountDocFollowups[i].convertedDocs = this.getUploadMultiFilesFromMainDto(
              this.accountDocFollowups[i],
              scenario,
              false
            );
          }
        }
      }
    }

    this.dataForm?.markAsPristine();
  }

  private get accFollowDocScenario(): AccDocScenario.AccDocScenarioEnum | null {
    return this.auctionService.getAuctionFollowAccDocScenario(this.dataForm);
  }

  onClickLink(documentDeedGroup: DocumentDeedGroup) {
    const destination = this.auctionService.routeCorrection('property-detail');
    this.routerService.navigateTo(destination, {
      fsubbidnum: documentDeedGroup.fsubbidnum,
      aucRef: this.auctionService.aucRef || '1',
    });
  }

  onUploadFileEvent(event: IUploadMultiFile[] | null) {
    const fileList = event?.filter(e => e.isUpload);
    this.setDataFormFiles(fileList);
  }

  private setDataFormFiles(event: IUploadMultiFile[] | undefined) {
    this.getControl('files')?.patchValue(event);
    this.getControl('isFilesValid')?.patchValue(true);
  }

  // Work-around for the issue where selected data doesn't apply to a multi-selector (Dropdown)
  private setSelectedDeepGroupsToForm() {
    const selectedDeedGroupIds = ((this.getControl('accountDocDeedGroups')?.value || []) as DocumentDeedGroup[]).map(
      dto => dto.deedGroupId || -1
    );
    const selectedDeedGroups: DocumentDeedGroup[] = this.accountDocDeedGroupOptions.filter(dto =>
      selectedDeedGroupIds.includes(dto.deedGroupId || -1)
    );
    this.getControl('accountDocDeedGroups')?.setValue(selectedDeedGroups);
  }

  // fix LEX2-27643 selector bug
  onSelectedDeedGroups($event: any) {
    this.getControl('accountDocDeedGroups')?.setValue($event?.filter((select: any) => select !== 'selectall'));
  }

  private getAccDocFollowHeader(accountDocFollowup: ExtendAccountDocFollowup): AuctionHeaderConfig {
    return {
      title: `${this.translate.instant('AUCTION_DETAIL.ACCOUNT_DOCUMENT.ROUNDS')} ${accountDocFollowup?.roundNo}`,
      isMain: false,
      details: [
        {
          name: this.translate.instant('AUCTION_DETAIL.AUCTION_PAYMENT.RESULT'), // ผลการติดตาม
          value: accountDocFollowup?.followupResult || '-',
        },
        {
          name: this.translate.instant('AUCTION_DETAIL.ACCOUNT_DOCUMENT.STATUS'), // สถานะ
          value: accountDocFollowup?.followupStatus || '-',
        },
      ],
      isOpened: !!accountDocFollowup.activeFlag || accountDocFollowup.followupStatus === 'กำลังดำเนินการ',
      ready: accountDocFollowup?.followupStatus === this.translate.instant('TASK_CODE_STATUS.COMPLETE'), // เสร็จสิ้น
      showIcon: true,
      isMainSub: true,
      isExceptionalIcons: true,
      forFollowAccDoc: true,
    };
  }

  private getLatestReviewInfo(accountDocFollowup: ExtendAccountDocFollowup): ReviewInfo | null {
    /* Find the latest reviewInfo by reviewTimestamp */
    return (accountDocFollowup?.reviewInfo || []).reduce((latest: ReviewInfo | null, current: ReviewInfo) => {
      if (!latest || new Date(current.reviewTimestamp || '') > new Date(latest.reviewTimestamp || '')) {
        return current;
      }
      return latest;
    }, null);
  }

  private getUploadMultiFilesFromMainDto(
    accountDocFollowup: ExtendAccountDocFollowup,
    scenario: AccDocScenario.AccDocScenarioEnum,
    isSetFormImages: boolean = false /* True => update uploaded images recently to "convertedDoc" */
  ): IUploadMultiFile[] {
    /* uses variables => this.dataForm, accountDocFollowup, isSetFormImages */
    /* Process convert Documents to IMultiFiles */
    const specifiedDocuments = specifiedDocumentsDict[scenario];
    const notSpecifiedDocuments = notSpecifiedDocumentsDict[scenario];

    let tempDocuments = accountDocFollowup.documents || [];
    let requiredDocs = tempDocuments.filter(dto =>
      (specifiedDocuments as string[]).includes(dto.documentTemplate?.documentTemplateId || '')
    );
    let optionalDocs = tempDocuments.filter(
      dto =>
        !([...specifiedDocuments, ...notSpecifiedDocuments] as string[]).includes(
          dto.documentTemplate?.documentTemplateId || ''
        )
    );
    tempDocuments = [...requiredDocs, ...optionalDocs];

    let convertedDocs = tempDocuments.map(dto => this.getUploadMultiFile(dto, specifiedDocuments));

    if (!isSetFormImages) return convertedDocs;

    // find new imageId to apply if the file has been uploaded recently.
    const files: IUploadMultiFile[] = this.dataForm?.get('files')?.value || [];
    if (files.length === 0) return convertedDocs;
    for (let j in convertedDocs) {
      let matchedDoc = (files || []).find(
        file => file.isUpload && file.documentTemplateId === convertedDocs[j].documentTemplateId
      );
      if (!matchedDoc) continue;
      convertedDocs[j].imageId = matchedDoc.imageId;
      convertedDocs[j].uploadDate = matchedDoc.uploadDate;
      convertedDocs[j].isUpload = true;
    }

    return convertedDocs;
  }

  private getUploadMultiFile(document: Document, specifiedDocuments: string[]): IUploadMultiFile {
    return {
      documentTemplateId: document.documentTemplate?.documentTemplateId,
      documentTemplate: document.documentTemplate as DocumentTemplateDto,
      imageId: document?.imageId,
      uploadDate: document?.uploadTimestamp,
      isUpload: !!document?.imageId,
      removeDocument: true,
      uploadRequired: specifiedDocuments.includes(document.documentTemplate?.documentTemplateId || ''),
    };
  }

  onRadioChange(value: string) {
    switch (value) {
      case this.AccountDocVerifyStatus.Verified:
        this.dataForm?.get('accountDocVerifyResult')?.patchValue(this.AccountDocVerifyResult.ValidData);
        break;
    }
  }
}
