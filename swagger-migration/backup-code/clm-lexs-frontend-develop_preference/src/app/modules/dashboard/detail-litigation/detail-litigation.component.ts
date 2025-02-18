import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { SearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { RouterService } from '@app/shared/services/router.service';
import { Utils } from '@app/shared/utils/util';
import { AccountDocumentStatusDto, LitigationDto, PageOfLitigationDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { IDashboardTab } from '../dashboard-tab/dashboard-tab.component';
import { DashboardService } from '../dashboard.service';
import { CIVIL_CASE_TAB_ROUTES, LAWSUIT_DETAIL_ROUTES } from '@app/shared/constant';
import { AuctionLedCardService } from '@app/shared/components/common-tabs/auction-led-card/auction-led-card.service';

@Component({
  selector: 'app-detail-litigation',
  templateUrl: './detail-litigation.component.html',
  styleUrls: ['./detail-litigation.component.scss'],
})
export class DetailLitigationComponent implements OnInit {
  @ViewChildren(MatTable) table!: QueryList<any>;
  public isEnableShadow: boolean = false;

  constructor(
    private translate: TranslateService,
    private routerService: RouterService,
    private lawsuitService: LawsuitService,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private auctionLedCardService: AuctionLedCardService
  ) {}

  currentTab: number | null = null;

  tabInfo: IDashboardTab[] = [];
  private statusTabInfo: IDashboardTab[] = [
    {
      label: 'อนุมัติดำเนินคดี',
      count: this.dashboardService.litigationStatusCount['approveLitigation'],
      color: '#68D6F5',
    },
    {
      label: 'บอกกล่าว',
      count: this.dashboardService.litigationStatusCount['noticeLitigation'],
      color: '#00A6E6',
    },
    {
      label: 'อยู่ระหว่างพิจารณาคดี',
      count: this.dashboardService.litigationStatusCount['litigationInProgress'],
      color: '#008EC4',
    },
    {
      label: 'มีคำพิพากษา',
      count: this.dashboardService.litigationStatusCount['adjudicationLitigation'],
      color: '#00446B',
    },
    {
      label: 'ออกหมายบังคับคดี',
      count: this.dashboardService.litigationStatusCount['writOfExecution'],
      color: '#F1B5C0',
    },
    {
      label: 'ยึดทรัพย์',
      count: this.dashboardService.litigationStatusCount['seizured'],
      color: '#E88496',
    },
    {
      label: 'ขายทอดตลาด',
      count: this.dashboardService.litigationStatusCount['auction'],
      color: '#D93956',
    },
    {
      label: 'ชะลอดำเนินคดี',
      count: this.dashboardService.litigationStatusCount['deferLitigation'],
      color: '#4A4A49',
    },
    {
      label: 'ชะลอบังคับคดี',
      count: this.dashboardService.litigationStatusCount['deferExecution'],
      color: '#BBBBBB',
    },
    {
      label: 'สืบทรัพย์',
      count: this.dashboardService.litigationStatusCount['assetInvestigation'],
      color: '#E3E3E3',
    },
  ];
  private deferTabInfo: IDashboardTab[] = [
    {
      label: 'อนุมัติดำเนินคดี',
      count: this.dashboardService.defermentCount['litigation'],
      color: '#D27601',
    },
    {
      label: 'บอกกล่าว',
      count: this.dashboardService.defermentCount['notice'],
      color: '#F49B00',
    },
  ];
  private deferExecutionTabInfo: IDashboardTab[] = [
    {
      label: 'ก่อนออกหมายบังคับคดี',
      count: this.dashboardService.defermentExecCount['deferExecWritOfExec'],
      color: '#D27601',
    },
    {
      label: 'อยู่ระหว่างยึดทรัพย์',
      count: this.dashboardService.defermentExecCount['deferExecSeizure'],
      color: '#F49B00',
    },
    {
      label: 'อยู่ระหว่างขายทอดตลาด',
      count: this.dashboardService.defermentExecCount['deferExecAuction'],
      color: '#FAB900',
    },
    {
      label: 'อื่นๆ',
      count: this.dashboardService.defermentExecCount['deferExecOther'],
      color: '#FFDC00',
    },
  ];
  private accountStatusTabInfo: IDashboardTab[] = [
    {
      label: 'อยู่ระหว่างติดตามบัญชีรับ-จ่าย',
      count: this.dashboardService.accountStatusCount['followUp'],
      color: '#00A6E6',
    },
    {
      label: 'อยู่ระหว่างตรวจรับรองบัญชีรับ-จ่าย',
      count: this.dashboardService.accountStatusCount['approval'],
      color: '#003154',
    },
    {
      label: 'อยู่ระหว่างตัดหักชำระหนี้',
      count: this.dashboardService.accountStatusCount['debtSettlement'],
      color: '#868686',
    },
  ];

  public mode: 'STATUS' | 'DEFER' | 'DEFER_EXECUTION' | 'ACCOUNT_STATUS' = 'STATUS';

  public reloadSearch: boolean = false;
  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  private statusSortByOptions: string[] = [
    'litigationId',
    'customerId',
    'responseUnit',
    'amdResponseUnit',
    'prescriptionDate',
    'litigationStatus',
  ];
  private defermentSortByOptions: string[] = [
    'litigationId',
    'customerId',
    'defermentBy',
    'branchCode',
    'kbdUserId',
    'defermentEndDate',
  ];
  private accountStatusSortByOptions: string[] = ['litigationId', 'accountDocumentRoundNo'];
  private sortByOptions: string[] = [];
  private currentSortBy: string[] = ['litigationId'];
  private currentSortOrder: string = 'ASC';
  private statusOrderOptions: SimpleSelectOption[] = [
    // lgid
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LG_ID_ASC_SHORTENED'), value: '0_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LG_ID_DESC_SHORTENED'), value: '0_DESC' },
    // customerId
    { text: this.translate.instant('CUSTOMER.ORDER_BY_CUSTOMER_ID_ASC_SHORTENED'), value: '1_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_CUSTOMER_ID_DESC_SHORTENED'), value: '1_DESC' },
    // response unit
    { text: this.translate.instant('CUSTOMER.ORDER_BY_RESPONSE_UNIT_ASC_SHORTENED'), value: '2_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_RESPONSE_UNIT_DESC_SHORTENED'), value: '2_DESC' },
    // response amd unit
    { text: this.translate.instant('CUSTOMER.ORDER_BY_AMD_UNIT_ASC_SHORTENED'), value: '3_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_AMD_UNIT_DESC_SHORTENED'), value: '3_DESC' },
    // exp date
    { text: this.translate.instant('CUSTOMER.ORDER_BY_EXP_DATE_ASC_SHORTENED'), value: '4_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_EXP_DATE_DESC_SHORTENED'), value: '4_DESC' },
    // litigation status
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LITIGATION_STATUS_ASC_SHORTENED'), value: '5_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LITIGATION_STATUS_DESC_SHORTENED'), value: '5_DESC' },
  ];
  private defermentOrderOptions: SimpleSelectOption[] = [
    // lgid
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LG_ID_ASC_SHORTENED'), value: '0_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LG_ID_DESC_SHORTENED'), value: '0_DESC' },
    // customerId
    { text: this.translate.instant('CUSTOMER.ORDER_BY_CUSTOMER_ID_ASC_SHORTENED'), value: '1_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_CUSTOMER_ID_DESC_SHORTENED'), value: '1_DESC' },
    // defer by
    { text: this.translate.instant('LAWSUIT.ORDER_BY_DEFER_BY_ASC_SHORTENED'), value: '2_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_DEFER_BY_DESC_SHORTENED'), value: '2_DESC' },
    // owner branch code
    { text: this.translate.instant('LAWSUIT.ORDER_BY_BRANCH_ASC_SHORTENED'), value: '3_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_BRANCH_DESC_SHORTENED'), value: '3_DESC' },
    // kdb/ao user id
    { text: this.translate.instant('LAWSUIT.ORDER_BY_KBD_AO_DESC_SHORTENED'), value: '4_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_KBD_AO_DESC_SHORTENED'), value: '4_DESC' },
    // deferment end date
    { text: this.translate.instant('LAWSUIT.ORDER_BY_DEFERMENT_END_DATE_ASC_SHORTENED'), value: '5_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_DEFERMENT_END_DATE_DESC_SHORTENED'), value: '5_DESC' },
  ];
  private accountStatusOrderOptions: SimpleSelectOption[] = [
    // lgid
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LG_ID_ASC_SHORTENED'), value: '0_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LG_ID_DESC_SHORTENED'), value: '0_DESC' },
    // accountTrackingCount
    { text: this.translate.instant('LAWSUIT.ORDER_BY_ACCOUNT_TRACKING_COUNT_ASC_SHORTENED'), value: '1_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_ACCOUNT_TRACKING_COUNT_DESC_SHORTENED'), value: '1_DESC' },
  ];

  public litigationSearch: SearchConditionRequest = {};
  public defaultSearch: SearchConditionRequest = {};
  public sortingControl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public sortingConfig: DropDownConfig = this.configDropdown;
  public sortingOptions: SimpleSelectOption[] = [];
  // private currentPage: number = 0;
  public data: Array<LitigationDto> = [];
  public pageData: PageOfLitigationDto = {};
  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;

  public displayedColumns: Array<string> = [];
  private displayedColumnsStatus: Array<string> = [
    'order',
    'lgId',
    'cifNo',
    'accountCount',
    'dpd',
    'duedate',
    'responseId',
    'amd',
    'status',
  ];
  private displayedColumnsDefer: Array<string> = [
    'order',
    'lgId',
    'cifNo',
    'dpd',
    'branch',
    'ao',
    'caseNo',
    'defermentEndDate',
    'deferStatus',
    'flag',
  ];
  private displayedColumnsDeferExecution: Array<string> = [
    'order',
    'lgId',
    'cifNo',
    'dpd',
    'branch',
    'ao',
    'caseNo',
    'defermentEndDate',
    'deferStatus',
    'flag',
  ];
  private displayedColumnsAccountStatus: Array<string> = [
    'order',
    'lgId',
    'cifNo',
    'caseNo',
    'ledName',
    'accountTrackingCount',
    'accountVerificationStatus',
    'status',
  ];

  public columnTexts: { [key: string]: string } = {
    order: 'COMMON.LABEL_NO',
    lgId: 'COMMON.LABEL_LITIGATION_ID',
    cifNo: 'LAWSUIT.HEAD_COLUMN_CIF_NO_W_NAME',
    accountCount: 'LAWSUIT.HEAD_COLUMN_ACCOUNT_COUNT',
    dueDate: 'LAWSUIT.HEAD_COLUMN_PRECRIPTION_DATE',
    dpd: 'COMMON.LABEL_DPD',
    branch: 'LAWSUIT.HEAD_COLUMN_BRANCH_RESPONSE_UNIT_3',
    ao: 'LAWSUIT.HEAD_COLUMN_KBD_AO_2',
    responseId: 'LAWSUIT.HEAD_COLUMN_RESPONSE_UNIT',
    amd: 'LAWSUIT.HEAD_COLUMN_RESPONSE_UNIT_AMD',
    caseNo: 'COMMON.LABEL_BLACK_CASE_NO_RED_CASE_NO',
    deferStatus: 'LAWSUIT.HEAD_COLUMN_LG_STATUS_ESCORT',
    defermentEndDate: 'LAWSUIT.HEAD_COLUMN_DEFERMENT_END_DATE',
    status: 'LAWSUIT.HEAD_COLUMN_LATEST_LG_STATUS',
    flag: 'LAWSUIT.HEAD_COLUMN_FLAG',
    ledName: 'LAWSUIT.HEAD_COLUMN_LED_NAME',
    accountTrackingCount: 'LAWSUIT.HEAD_COLUMN_ACCOUNT_TRACKING_COUNT',
    accountVerificationStatus: 'LAWSUIT.HEAD_COLUMN_ACCOUNT_VERIFICATION_STATUS',
  };

  public iconNames: { [key: string]: string } = {
    STATUS: 'icon-Customer',
    DEFER: 'icon-Pause',
    DEFER_EXECUTION: 'icon-Pause',
    ACCOUNT_STATUS: 'icon-File',
  };

  async ngOnInit(): Promise<void> {
    this.mode = this.route.snapshot.queryParams['mode'];

    const initialTabIndex = this.route.snapshot.queryParams['tabIndex'];
    this.currentTab = initialTabIndex ? parseInt(initialTabIndex) : null;

    this.setUpColumnTexts();

    if (this.mode === 'STATUS') {
      this.litigationSearch = { ...this.getSearchResult(), statusDashboard: this.getStatusTabName(this.currentTab) };
      this.tabInfo = this.statusTabInfo;
      this.displayedColumns = this.displayedColumnsStatus;
      this.sortingOptions = [...this.statusOrderOptions];
      this.sortByOptions = [...this.statusSortByOptions];
    } else if (this.mode === 'DEFER') {
      this.litigationSearch = { ...this.getSearchResult(), deferDashboard: this.getDeferTabName(this.currentTab) };
      this.tabInfo = this.deferTabInfo;
      this.displayedColumns = this.displayedColumnsDefer;
      this.sortingOptions = [...this.defermentOrderOptions];
      this.sortByOptions = [...this.defermentSortByOptions];
    } else if (this.mode === 'DEFER_EXECUTION') {
      this.litigationSearch = {
        ...this.getSearchResult(),
        deferExecDashboard: this.getDeferExecutionTabName(this.currentTab),
      };
      this.tabInfo = this.deferExecutionTabInfo;
      this.displayedColumns = this.displayedColumnsDeferExecution;
      this.sortingOptions = [...this.defermentOrderOptions];
      this.sortByOptions = [...this.defermentSortByOptions];
    } else if (this.mode === 'ACCOUNT_STATUS') {
      this.litigationSearch = {
        ...this.getSearchResult(),
        accountDocumentStatusDashboard: this.getAccountStatusTabName(this.currentTab),
      };
      this.tabInfo = this.accountStatusTabInfo;
      this.displayedColumns = this.displayedColumnsAccountStatus;
      this.sortingOptions = [...this.accountStatusOrderOptions];
      this.sortByOptions = [...this.accountStatusSortByOptions];
    }

    await this.inquiryLawsuits(this.litigationSearch, false);
    const { resultConfig, actionConfig } = Utils.setPagination(
      this.pageData.pageable,
      this.pageData.numberOfElements,
      this.pageData.totalPages,
      this.pageData.totalElements
    );
    this.setPaginationContent(resultConfig, actionConfig, this.pageData.content);
    this.defaultSearch = { ...this.litigationSearch };
  }

  async onTabChange(index: number | null) {
    this.reloadSearch = true;
    if (index === this.currentTab && this.currentTab !== null) this.currentTab = null;
    else this.currentTab = index;
    this.clearSearch();
    const request: SearchConditionRequest = {
      ...this.getSearchResult(),
      page: 0,
      statusDashboard: this.mode === 'STATUS' ? this.getStatusTabName(this.currentTab) : undefined,
      deferDashboard: this.mode === 'DEFER' ? this.getDeferTabName(this.currentTab) : undefined,
      deferExecDashboard: this.mode === 'DEFER_EXECUTION' ? this.getDeferExecutionTabName(this.currentTab) : undefined,
      accountDocumentStatusDashboard:
        this.mode === 'ACCOUNT_STATUS' ? this.getAccountStatusTabName(this.currentTab) : undefined,
    };
    this.litigationSearch = request;
    await this.pageEvent(1);
    this.reloadSearch = false;
  }

  getStatusTabName(index: number | null) {
    switch (index) {
      case null:
        return 'ALL';
      case 0:
        return 'STATUS_APPROVE';
      case 1:
        return 'STATUS_NOTICE';
      case 2:
        return 'STATUS_IN_PROGRESS';
      case 3:
        return 'STATUS_ADJUDICATION';
      case 4:
        return 'STATUS_WRIT_OF_EXECUTION';
      case 5:
        return 'STATUS_SEIZURED';
      case 6:
        return 'STATUS_AUCTION';
      case 7:
        return 'STATUS_DEFER';
      case 8:
        return 'STATUS_DEFER_EXECUTION';
      case 9:
        return 'STATUS_ASSET_INVESTIGATION';
      default:
        return 'ALL';
    }
  }
  getDeferTabName(index: number | null) {
    switch (index) {
      case null:
        return 'ALL_DEFERMENT';
      case 0:
        return 'DEFER_NONE_NOTICE';
      case 1:
        return 'DEFER_NOTICE';
      default:
        return 'ALL_DEFERMENT';
    }
  }
  getDeferExecutionTabName(index: number | null) {
    switch (index) {
      case null:
        return 'ALL_DEFERMENT_EXEC';
      case 0:
        return 'DEFER_EXEC_WRIT_OF_EXEC';
      case 1:
        return 'DEFER_EXEC_SEIZURE';
      case 2:
        return 'DEFER_EXEC_AUCTION';
      case 3:
        return 'DEFER_EXEC_OTHER';
      default:
        return 'ALL_DEFERMENT_EXEC';
    }
  }
  getAccountStatusTabName(index: number | null) {
    switch (index) {
      case null:
        return 'ALL_ACCOUNT_DOCUMENT_STATUS';
      case 0:
        return 'ACCOUNT_DOCUMENT_STATUS_FOLLOW_UP';
      case 1:
        return 'ACCOUNT_DOCUMENT_STATUS_APPROVAL';
      case 2:
        return 'ACCOUNT_DOCUMENT_STATUS_DEBT_SETTLEMENT';
      default:
        return 'ALL_ACCOUNT_DOCUMENT_STATUS';
    }
  }

  getFileName() {
    switch (this.mode) {
      case 'DEFER':
        return 'การชะลอดำเนินคดีแบ่งตามขั้นตอนดำเนินงาน';
      case 'STATUS':
        return 'ลูกหนี้ตามสถานะดำเนินคดี';
      case 'DEFER_EXECUTION':
        return 'การชะลอบังคับคดีแบ่งตามขั้นตอนดำเนินงาน';
      case 'ACCOUNT_STATUS':
        return 'ลูกหนี้แบ่งตามสถานะบัญชีรับ-จ่าย';
    }
  }

  async onSearchResult(event: SearchConditionRequest) {
    this.litigationSearch = {
      ...this.litigationSearch,
      ...event,
      page: 0,
    };
    await this.inquiryLawsuits(this.litigationSearch, false);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = this.getSearchResult() as SearchConditionRequest;
    this.litigationSearch = request;
    await this.inquiryLawsuits(request);
  }

  async inquiryLawsuits(request: SearchConditionRequest, isDownload: boolean = false) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = this.getSearchResult();
    request = { ...request, ...resultTabs };
    if (isDownload) {
      if (this.mode === 'DEFER' || this.mode === 'DEFER_EXECUTION') {
        await this.dashboardService.litigationDefermentDownloadExcel(request, this.getFileName());
      } else if (this.mode === 'STATUS') {
        await this.dashboardService.litigationStatusDownloadExcel(request, this.getFileName());
      } else if (this.mode === 'ACCOUNT_STATUS') {
        await this.dashboardService.downloadAccountDocumentStatus(request, this.getFileName());
      }
    } else {
      if (this.mode !== 'ACCOUNT_STATUS') {
        this.pageData = await this.lawsuitService.inquiryLawsuits(request);
      } else {
        this.pageData = await this.dashboardService.inquiryAccountDocumentStatus(request);
      }
      // set data for table
      const { resultConfig, actionConfig } = Utils.setPagination(
        this.pageData.pageable,
        this.pageData.numberOfElements,
        this.pageData.totalPages,
        this.pageData.totalElements
      );
      this.setPaginationContent(resultConfig, actionConfig, this.pageData.content);
    }
  }

  setPageInquiry() {
    return {
      size: 10,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
    } as SearchConditionRequest;
  }

  getSearchResult(): SearchConditionRequest {
    this.litigationSearch.sortBy = this.currentSortBy;
    this.litigationSearch.sortOrder = this.currentSortOrder;
    this.litigationSearch.tab = 'DASHBOARD';
    return this.litigationSearch;
  }

  setPaginationContent(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: LitigationDto[]
  ) {
    this.data = content || [];
    this.pageResultConfig = resultConfig;
    this.pageActionConfig = actionConfig;
  }

  async pageEvent(event: any) {
    let request = this.getSearchResult() as SearchConditionRequest; /* Set new pageNumber to requestObj */
    request.page = event - 1;
    await this.inquiryLawsuits(request, false);
  }

  clearSearch() {
    this.currentSortBy = ['litigationId'];
    this.currentSortOrder = 'ASC';
    this.litigationSearch = { ...this.defaultSearch };
  }

  async onSaveFile() {
    await this.inquiryLawsuits({}, true);
  }

  /** Table Events */
  onClickLG(element: LitigationDto | AccountDocumentStatusDto) {
    if (this.mode !== 'ACCOUNT_STATUS') {
      this.routerService.navigateTo('/main/lawsuit/detail', {
        litigationId: element.litigationId,
        blackCaseNo: element.blackCaseNo,
        _tabIndex: 0,
        _subIndex: 0,
        _underSubIndex: 0,
      });
    } else {
      this.auctionLedCardService.activeLedSubject.next({
        activeLedId: (element as AccountDocumentStatusDto).ledId,
        activeLedTab: 2,
        activeLedSubTab: 1,
      });
      this.routerService.pushStack(LAWSUIT_DETAIL_ROUTES.MAIN);
      this.routerService.navigateTo(CIVIL_CASE_TAB_ROUTES.AUCTION_LED_CARD_INFO_TAB, {
        litigationId: element.litigationId,
        _tabIndex: 2,
        _subIndex: 6,
      });
    }
  }
  onClickCIFNo(cif: number) {
    this.routerService.navigateTo('/main/customer/detail', { customerId: cif });
  }

  /** Action Bar */
  onBack() {
    this.routerService.back();
  }

  /** Column texts for different tables */
  setUpColumnTexts() {
    if (this.mode === 'DEFER_EXECUTION') {
      this.columnTexts = {
        ...this.columnTexts,
        caseNo: 'COMMON.LABEL_BLACK_CASE_NO_RED_CASE_NO',
        flag: 'LAWSUIT.HEAD_COLUMN_FLAG',
      };
    }
  }

  getAccountDocumentVerifyResultName(value: string) {
    switch (value) {
      case 'VALID_DATA':
        return 'ANNOUNCE_VERIFY_COLLATERAL.CORRECT_INFO';
      case 'INVALID_DATA':
        return 'ANNOUNCE_VERIFY_COLLATERAL.INCORRECT_INFO';
      default:
        return '-';
    }
  }
}
