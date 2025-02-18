import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { ProfileDirectSearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  AccountDetailDto,
  AccountListReportDto,
  BatchDataDto,
  BatchDataRequest,
  CommonResponse,
  MeLexsUserDto,
  NameValuePair,
  PageOfBatchDataDto,
  ProfileDirectResponse,
  TfsOutstandingReportDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import {
  BuddhistEraPipe,
  DropDownConfig,
  ExtendNameValuePair,
  PaginatorActionConfig,
  PaginatorResultConfig,
} from '@spig/core';
import { accountDataTypeOptions, searchRealTime } from './profile-direct.const';
import { ProfileDirectService } from './profile-direct.service';

@Component({
  selector: 'app-profile-direct',
  templateUrl: './profile-direct.component.html',
  styleUrls: ['./profile-direct.component.scss'],
})
export class ProfileDirectComponent implements OnInit {
  isShowActionBar = true;

  profileDirectResponse!: ProfileDirectResponse;
  accountListReportDto!: AccountListReportDto;
  tfsOutstandingReportDto!: TfsOutstandingReportDto;
  accountDetailDto!: AccountDetailDto;

  pageOfBatchDataDto!: PageOfBatchDataDto;
  batchDataDtos!: BatchDataDto[];

  // ลำดับ, ประเภทข้อมูล, บัญชี, วันที่เริ่มต้น, วันที่สิ้นสุด, สร้างเมื่อ/\nสร้างโดย, สถานะรายการ, คำสั่ง
  displayedColumns3: string[] = ['seq', 'dataType', 'account', 'startDate', 'endDate', 'createdAt', 'status', 'action'];

  cifNo!: string;
  litigationId!: string | undefined;
  accountNoOptions!: ExtendNameValuePair[];
  accountNoOutstandingOptions!: ExtendNameValuePair[];

  public realTimeSearch: ProfileDirectSearchConditionRequest = {};
  showRealTimeNoData: boolean = true;

  public batchSearch: ProfileDirectSearchConditionRequest = {};

  tabIndex = 0;

  enableLookUpBtn: boolean = false;

  private currentUser: MeLexsUserDto = {};

  accountDataType: BatchDataDto.ProfileDirectTypeEnum = BatchDataDto.ProfileDirectTypeEnum.AccountList;
  realTimeDataTitle = accountDataTypeOptions[0].name;

  public custPageResultConfig: PaginatorResultConfig = { fromIndex: 0, toIndex: 0, totalElements: 0 };
  public custPageActionConfig: PaginatorActionConfig = { totalPages: 0, currentPage: 1, fromPage: 1, toPage: 1 };
  private myCrrentPage: number = 0;

  public realTimeAccountDataTypeOptions: NameValuePair[] = searchRealTime;

  public batchAccountDataTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    // 'ประเภทข้อมูล',
    labelPlaceHolder: 'PROFILE_DIRECT.DROPDOWN.DATA_TYPE',
  };
  public batchAccountDataTypeOptions: NameValuePair[] = accountDataTypeOptions?.filter(
    dto =>
      !(
        [BatchDataDto.ProfileDirectTypeEnum.AccountList, BatchDataDto.ProfileDirectTypeEnum.AccountOverview] as string[]
      ).includes(dto.value || '')
  );
  public batchAccountDataTypeModifiedOptions: NameValuePair[] = [
    {
      name: this.translate.instant('PROFILE_DIRECT.DROPDOWN.DATA_TYPE'),
      value: undefined,
    },
    ...this.batchAccountDataTypeOptions,
  ];

  batchAccountDataTypeValue: BatchDataDto.ProfileDirectTypeEnum | undefined = undefined;

  constructor(
    private routerService: RouterService,
    private profileDirectService: ProfileDirectService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private documentService: DocumentService,
    private buddhistEraPipe: BuddhistEraPipe,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.cifNo = this.route.snapshot.queryParams['cifNo'];
    this.litigationId = this.route.snapshot.queryParams['litigationId'] || undefined;
  }

  async ngOnInit() {
    this.initOptionsForPage();

    // check permission => Role = KLAW_USER and faction_code = LAW004
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
    this.enableLookUpBtn = this.currentUser.roleCode === 'KLAW_USER' && this.currentUser.factionCode === 'LAW004';

    await this.getData(this.tabIndex);
  }

  private async initOptionsForPage() {
    const accountDtos = await this.profileDirectService.inquiryAccount(this.cifNo, undefined, this.litigationId);
    this.accountNoOptions =
      accountDtos?.map(dto => {
        return {
          name: dto.accountId,
          value: dto.accountId,
          condition1: dto.accountType,
        };
      }) || [];

    const accountNoOutstandingDtos = await this.profileDirectService.inquiryAccount(
      this.cifNo,
      'OUTSTANDING_REPORT',
      this.litigationId
    );
    this.accountNoOutstandingOptions =
      accountNoOutstandingDtos?.map(dto => {
        return {
          name: dto.accountId,
          value: dto.accountId,
          condition1: dto.accountType,
        };
      }) || [];
  }

  async onTabChanged() {
    await this.getData(this.tabIndex);
  }

  async onSearchResult(event: any, tabIndex: number) {
    tabIndex === 0 ? (this.realTimeSearch = { ...event }) : (this.batchSearch = { ...event });

    await this.getData(this.tabIndex, true);
  }

  async pageEvent(event: number) {
    this.myCrrentPage = event - 1;

    await this.getData(this.tabIndex);
  }

  async onChangeAccountDataTypeOption() {
    await this.getData(this.tabIndex);
  }

  private convertDateToLegitFormat(date: string | undefined, format = 'DD MMMM yyyy HH:mm') {
    // หมายเหตุ: หลังบ้านแปลง format มาไม่ถูกเลยต้องมา convert เองใหม่
    if (!date) return '-';

    let newDate = this.convertDate(date);
    if (newDate.getFullYear() > 2500) {
      newDate.setFullYear(newDate.getFullYear() - 543);
    }

    return this.buddhistEraPipe.transform(newDate.toISOString(), format);
  }

  private convertDate(inputFormat: string): Date {
    // 'DD MMMM yyyy HH:mm'
    const parts = inputFormat.split(' ');
    const dateParts = parts[0].split('/');
    const timeParts = parts[1].split(':');

    // Note that months are 0-based in JavaScript
    return new Date(
      parseInt(dateParts[2]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[0]),
      parseInt(timeParts[0]),
      parseInt(timeParts[1])
    );
  }

  async getData(tabIndex: number, isClickLookUp = false) {
    switch (tabIndex) {
      case 0:
        switch (this.realTimeSearch.accountDataType) {
          case BatchDataDto.ProfileDirectTypeEnum.AccountList:
            this.profileDirectResponse = await this.profileDirectService.inquiryProfileDirect(
              this.realTimeSearch.accountDataType,
              this.cifNo,
              undefined,
              this.litigationId
            );
            break;
          case BatchDataDto.ProfileDirectTypeEnum.AccountOverview:
            this.profileDirectResponse = await this.profileDirectService.inquiryProfileDirect(
              this.realTimeSearch.accountDataType,
              this.cifNo,
              this.realTimeSearch.accountNo,
              this.litigationId
            );
            break;
          case BatchDataDto.ProfileDirectTypeEnum.OutstandingReport:
            this.profileDirectResponse = await this.profileDirectService.inquiryProfileDirect(
              this.realTimeSearch.accountDataType,
              this.cifNo,
              this.realTimeSearch.accountNo,
              this.litigationId
            );
            break;
          default:
            this.showRealTimeNoData = true;
            return;
        }
        this.showRealTimeNoData = false;
        this.setRealTimeDataTitle();

        this.accountListReportDto = {
          ...this.profileDirectResponse.accountListReportDto,
          dataDateTime: this.convertDateToLegitFormat(this.profileDirectResponse?.accountListReportDto?.dataDateTime),
        };
        this.accountDetailDto = {
          ...this.profileDirectResponse.accountDetailDto,
          dataDate: this.convertDateToLegitFormat(this.profileDirectResponse.accountDetailDto?.dataDate),
        };
        this.tfsOutstandingReportDto = {
          ...this.profileDirectResponse.tfsOutstandingReportDto,
          reportDate: this.convertDateToLegitFormat(this.profileDirectResponse.tfsOutstandingReportDto?.reportDate),
        };
        break;
      case 1:
        if (isClickLookUp && this.batchSearch.accountNo) {
          const req: BatchDataRequest = {
            accountNo: this.batchSearch.accountNo,
            fromDate: this.batchSearch.startDate,
            profileDirectType: this.batchSearch.accountDataType,
            toDate: this.batchSearch.endDate,
          };

          const batchExist: CommonResponse = await this.profileDirectService.validateSaveBatchData(req);

          if (!this.batchSearch.accountDataType) return;
          if (
            batchExist.existing &&
            !(await this.askConfirmRemoveAccountData(this.batchSearch.accountDataType, this.batchSearch.accountNo))
          )
            return;

          (await this.profileDirectService.saveBatchData(req)) || {};

          const accountDataTypeName: string = this.findAccountDataTypeName(this.batchSearch.accountDataType);

          this.notificationService.openSnackbarSuccess(
            this.getSaveBatchSuccessText(accountDataTypeName, this.batchSearch.accountDataType)
          );
        }

        this.pageOfBatchDataDto = await this.profileDirectService.inquiryBatchData(
          this.cifNo,
          this.litigationId,
          this.myCrrentPage,
          10,
          this.batchAccountDataTypeValue
        );
        const batchDataDtos = this.pageOfBatchDataDto.content || [];

        this.batchDataDtos = [
          ...(batchDataDtos || [])?.map(dto => {
            dto.index = (dto.index || 0) + (this.pageOfBatchDataDto.number || 0) * (this.pageOfBatchDataDto.size || 0);
            return dto;
          }),
        ];

        const { resultConfig, actionConfig } = Utils.setPagination(
          this.pageOfBatchDataDto.pageable,
          this.pageOfBatchDataDto.numberOfElements,
          this.pageOfBatchDataDto.totalPages,
          this.pageOfBatchDataDto.totalElements
        );
        this.custPageResultConfig = resultConfig;
        this.custPageActionConfig = actionConfig;

        break;
    }
  }

  private getSaveBatchSuccessText(accountDataTypeName: string, accountDataType: BatchDataDto.ProfileDirectTypeEnum) {
    return accountDataType === BatchDataDto.ProfileDirectTypeEnum.Statement
      ? 'PROFILE_DIRECT.NOTIFICATION.INQUIRE_STATEMENT_SUCCESS'
      : this.translate.instant('PROFILE_DIRECT.NOTIFICATION.CONTENT_DOWNLOAD_BATCH_ON_PENDING', {
          accountDataTypeName,
        });
  }

  private setRealTimeDataTitle() {
    if (!this.realTimeSearch.accountDataType) return;
    this.accountDataType = this.realTimeSearch.accountDataType;
    this.realTimeDataTitle = searchRealTime?.find(dto => dto.value === this.accountDataType)?.name;
  }

  async downloadBatch(element: BatchDataDto) {
    if (!element.profileDirectType) return;
    const accountDataTypeName: string = this.findAccountDataTypeName(element.profileDirectType);
    if (element.status === 'PENDING') {
      await this.notificationService.alertDialog(
        this.translate.instant('PROFILE_DIRECT.NOTIFICATION.TITLE_DOWNLOAD_BATCH_ON_PENDING', { accountDataTypeName }),
        this.getSaveBatchSuccessText(accountDataTypeName, element.profileDirectType),
        'COMMON.BUTTON_ACKNOWLEDGE',
        'icon-Selected'
      );
      return;
    }

    const response: any = await this.profileDirectService.download(
      element.profileDirectType || BatchDataDto.ProfileDirectTypeEnum.AccountHistory,
      this.cifNo,
      element.accountNo
    );

    // ชื่อไฟล์ = “Account History “ + account number + “ “ + วันที่ของข้อมูล (DD-MM-YYYY (from) - DD-MM-YYYY (to)) + “.pdf” (i.e. Account History 00000000000000 01-12-2565 - 31-12-2565.pdf)
    // ชื่อไฟล์ = “Interest change summary report “ + account number + “ “ + วันที่ของข้อมูล (DD-MM-YYYY (from) - DD-MM-YYYY (to)) + “.pdf” (i.e. Interest change summary report 00000000000000 01-12-2565 - 31-12-2565.pdf)
    let fileName =
      element.profileDirectType === 'ACCOUNT_HISTORY' ? 'Account History' : 'Interest change summary report';
    fileName =
      fileName +
      ` ${element.accountNo} ${this.buddhistEraPipe.transform(
        element.fromDate,
        'DD-MM-yyyy'
      )} - ${this.buddhistEraPipe.transform(element.toDate, 'DD-MM-yyyy')}`;
    this.openPdf(response, fileName);
  }

  private openPdf(response: any, fileName: string) {
    this.documentService.downloadDocument(response, `${fileName}.${response?.type.split('/')[1]}`);
  }

  async onDownloadRealTimeData() {
    let response: any;
    let fileName = '';
    switch (this.accountDataType) {
      case BatchDataDto.ProfileDirectTypeEnum.AccountList:
        response = await this.profileDirectService.download(this.accountDataType, this.cifNo);

        // ชื่อไฟล์ = “Account List “ + วันที่ของข้อมูล (DD-MM-YYYY) + “.pdf” (i.e. Account List 31-12-2565.pdf)
        fileName = `Account List ${this.profileDirectResponse.accountListReportDto?.dataDateTime?.split(' ')[0]}`;
        break;
      case BatchDataDto.ProfileDirectTypeEnum.AccountOverview:
        response = await this.profileDirectService.download(
          this.accountDataType,
          this.cifNo,
          this.realTimeSearch.accountNo
        );

        // ชื่อไฟล์ = “Account Overview “ + วันที่ของข้อมูล (DD-MM-YYYY) + “.pdf” (i.e. Account Overview 00000000000000 31-12-2565.pdf)
        fileName = `Account Overview ${
          this.realTimeSearch.accountNo
        } ${this.profileDirectResponse.accountDetailDto?.dataDate?.split(' ')[0]}`;
        break;
      case BatchDataDto.ProfileDirectTypeEnum.OutstandingReport:
        response = await this.profileDirectService.download(
          this.accountDataType,
          this.cifNo,
          this.realTimeSearch.accountNo
        );

        // ชื่อไฟล์ = “Outstanding Report “ + วันที่ของข้อมูล (DD-MM-YYYY) + “.pdf” (i.e. Account Overview 00000000000000 31-12-2565.pdf)
        fileName = `Outstanding Report ${
          this.realTimeSearch.accountNo
        } ${this.profileDirectResponse.tfsOutstandingReportDto?.reportDate?.split(' ')[0]}`;
        break;
    }
    this.openPdf(response, fileName);
  }

  async askConfirmRemoveAccountData(
    accountDataType: BatchDataDto.ProfileDirectTypeEnum,
    accountNo: string
  ): Promise<boolean> {
    const accountDataTypeName: string = this.findAccountDataTypeName(accountDataType);
    return await this.notificationService.warningDialog(
      this.translate.instant('PROFILE_DIRECT.NOTIFICATION.TITLE_CONFIRM_REMOVE_ACCOUNT_DATA', { accountDataTypeName }),
      this.translate.instant('PROFILE_DIRECT.NOTIFICATION.CONTENT_CONFIRM_REMOVE_ACCOUNT_DATA', {
        accountDataTypeName,
        account_no: accountNo,
      }),
      this.translate.instant('COMMON.CONTINUE'),
      'icon-Direction-Right'
    );
  }

  private findAccountDataTypeName(accountDataType: BatchDataDto.ProfileDirectTypeEnum) {
    return accountDataTypeOptions.find(opt => opt.value === accountDataType)?.name || '-';
  }

  back() {
    this.routerService.back();
  }
}
