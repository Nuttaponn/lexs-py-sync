import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { RouterService } from '@app/shared/services/router.service';
import { Utils } from '@app/shared/utils/util';
import { CustomerDocumentDto, PageOfCustomerDocumentDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { IDashboardTab } from '../dashboard-tab/dashboard-tab.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html',
  styleUrls: ['./detail-customer.component.scss'],
})
export class DetailCustomerComponent implements OnInit {
  @ViewChildren(MatTable) table!: QueryList<any>;
  public isEnableShadow: boolean = false;

  constructor(
    private routerService: RouterService,
    private translate: TranslateService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute
  ) {}

  tabInfo: IDashboardTab[] = [
    {
      label: 'ทั้งหมด',
      color: '#00A6E6',
      count:
        this.dashboardService.customerCount['allPendingNoticeDocuments'] +
        this.dashboardService.customerCount['allPendingLitigationDocuments'] +
        this.dashboardService.customerCount['allFinishedDocuments'],
      subTabs: [
        {
          label: 'เอกสารบอกกล่าวไม่ครบถ้วน',
          color: '#00A6E6',
          count: this.dashboardService.customerCount['allPendingNoticeDocuments'],
        },
        {
          label: 'เอกสารยื่นฟ้องไม่ครบถ้วน',
          color: '#00446B',
          count: this.dashboardService.customerCount['allPendingLitigationDocuments'],
        },
        {
          label: 'เอกสารทั้งหมดครบถ้วน',
          color: '#E3E3E3',
          count: this.dashboardService.customerCount['allFinishedDocuments'],
        },
      ],
    },
    {
      label:
        'ลูกหนี้ DPD ' +
        this.dashboardService.lexsDpd +
        '-' +
        this.dashboardService.litigationDpd +
        ' วัน\nที่รออนุมัติดำเนินคดี',
      color: '#279400',
      count:
        this.dashboardService.customerCount['lexsPendingNoticeDocuments'] +
        this.dashboardService.customerCount['lexsPendingLitigationDocuments'] +
        this.dashboardService.customerCount['lexsFinishedDocuments'],
      subTabs: [
        {
          label: 'เอกสารบอกกล่าวไม่ครบถ้วน',
          color: '#279400',
          count: this.dashboardService.customerCount['lexsPendingNoticeDocuments'],
        },
        {
          label: 'เอกสารยื่นฟ้องไม่ครบถ้วน',
          color: '#175900',
          count: this.dashboardService.customerCount['lexsPendingLitigationDocuments'],
        },
        {
          label: 'เอกสารทั้งหมดครบถ้วน',
          color: '#E3E3E3',
          count: this.dashboardService.customerCount['lexsFinishedDocuments'],
        },
      ],
    },
    {
      label:
        'ลูกหนี้ DPD>' + this.dashboardService.litigationDpd + ' วัน<br>หรือลูกหนี้ที่มีการเริ่มกระบวนการดำเนินคดี',
      color: '#F49B00',
      count:
        this.dashboardService.customerCount['litigationPendingNoticeDocuments'] +
        this.dashboardService.customerCount['litigationPendingLitigationDocuments'] +
        this.dashboardService.customerCount['litigationFinishedDocuments'],
      subTabs: [
        {
          label: 'เอกสารบอกกล่าวไม่ครบถ้วน',
          color: '#F49B00',
          count: this.dashboardService.customerCount['litigationPendingNoticeDocuments'],
        },
        {
          label: 'เอกสารยื่นฟ้องไม่ครบถ้วน',
          color: '#B75900',
          count: this.dashboardService.customerCount['litigationPendingLitigationDocuments'],
        },
        {
          label: 'เอกสารครบถ้วนรอสร้างเลขที่กฎหมาย',
          color: '#E3E3E3',
          count: this.dashboardService.customerCount['litigationFinishedDocuments'],
        },
      ],
    },
  ];

  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  private sortByOptions: string[] = ['customerId', 'responseUnit', 'amdUnit', 'prescriptionDate'];
  private currentSortBy: string[] = ['customerId'];
  private currentSortOrder: string = 'ASC';
  private orderOptions = [
    // customerId
    { text: this.translate.instant('CUSTOMER.ORDER_BY_CUSTOMER_ID_ASC_SHORTENED'), value: '0_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_CUSTOMER_ID_DESC_SHORTENED'), value: '0_DESC' },
    // response unit
    { text: this.translate.instant('CUSTOMER.ORDER_BY_RESPONSE_UNIT_ASC_SHORTENED'), value: '1_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_RESPONSE_UNIT_DESC_SHORTENED'), value: '1_DESC' },
    // response amd unit
    { text: this.translate.instant('CUSTOMER.ORDER_BY_AMD_UNIT_ASC_SHORTENED'), value: '2_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_AMD_UNIT_DESC_SHORTENED'), value: '2_DESC' },
    // exp date
    { text: this.translate.instant('CUSTOMER.ORDER_BY_EXP_DATE_ASC_SHORTENED'), value: '3_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_EXP_DATE_DESC_SHORTENED'), value: '3_DESC' },
  ];

  public reloadSearch: boolean = false;
  public customerSearch: SearchConditionRequest = {};
  public defaultSearch: SearchConditionRequest = {};
  public sortingControl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public sortingConfig: DropDownConfig = this.configDropdown;
  public sortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  // private currentPage: number = 0;
  public data: Array<CustomerDocumentDto> = [];
  public pageData: PageOfCustomerDocumentDto = {};
  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;

  public displayedColumns: string[] = [
    'no',
    'cifNo',
    'name',
    'noOfAccount',
    'dpd',
    'sla',
    'expireDate',
    'responseUnit',
    'responseAMDUnit',
  ];

  currentTab: number = 0;
  currentSubTab: number | null = null;
  currentTabName: string = 'ALL';

  async ngOnInit(): Promise<void> {
    const initialTabIndex = this.route.snapshot.queryParams['tabIndex'];
    const initialSubTabIndex = this.route.snapshot.queryParams['subTabIndex'];
    this.currentTab = parseInt(initialTabIndex || '0');
    this.currentSubTab = initialSubTabIndex ? parseInt(initialSubTabIndex) : null;

    this.customerSearch = {
      ...this.getSearchResult(),
      dashboard: this.getTabName(this.currentTab, this.currentSubTab),
      page: 0,
    };
    await this.inquiryCustomers(this.customerSearch, false);
    const { resultConfig, actionConfig } = Utils.setPagination(
      this.pageData.pageable,
      this.pageData.numberOfElements,
      this.pageData.totalPages,
      this.pageData.totalElements
    );
    this.setPaginationContent(resultConfig, actionConfig, this.pageData.content);
    this.defaultSearch = { ...this.customerSearch };
  }

  async tabChange(index: number) {
    this.reloadSearch = true;
    this.currentTab = index;
    this.currentSubTab = null;

    this.clearSearch();
    const request: SearchConditionRequest = {
      ...this.getSearchResult(),
      page: 0,
      dashboard: this.getTabName(index, this.currentSubTab),
    };
    this.customerSearch = request;
    await this.pageEvent(1);
    this.reloadSearch = false;
  }
  async onSubTabChange(index: number | null) {
    this.reloadSearch = true;
    if (index === this.currentSubTab && this.currentSubTab !== null) this.currentSubTab = null;
    else this.currentSubTab = index;

    this.clearSearch();
    const request: SearchConditionRequest = {
      ...this.getSearchResult(),
      page: 0,
      dashboard: this.getTabName(this.currentTab, this.currentSubTab),
    };
    this.customerSearch = request;
    await this.pageEvent(1);
    this.reloadSearch = false;
  }

  getTabName(tab: number, subTab: number | null) {
    if (tab === 0 && subTab === null) return 'ALL';
    else if (tab === 0 && subTab === 0) return 'ALL_PENDING_NOTICE';
    else if (tab === 0 && subTab === 1) return 'ALL_PENDING_LITIGATION';
    else if (tab === 0 && subTab === 2) return 'ALL_FINISHED_DOCUMENT';
    else if (tab === 1 && subTab === null) return 'LEXS_TOTAL_DOCUMENT';
    else if (tab === 1 && subTab === 0) return 'LEXS_PENDING_NOTICE';
    else if (tab === 1 && subTab === 1) return 'LEXS_PENDING_LITIGATION';
    else if (tab === 1 && subTab === 2) return 'LEXS_FINISHED_DOCUMENT';
    else if (tab === 2 && subTab === null) return 'LITIGATION_TOTAL_DOCUMENT';
    else if (tab === 2 && subTab === 0) return 'LITIGATION_PENDING_NOTICE';
    else if (tab === 2 && subTab === 1) return 'LITIGATION_PENDING_LITIGATION';
    else if (tab === 2 && subTab === 2) return 'LITIGATION_FINISHED_DOCUMENT';
    else return 'ALL';
  }

  async onSearchResult(event: SearchConditionRequest) {
    this.customerSearch = {
      ...this.customerSearch,
      ...event,
      page: 0,
    };
    await this.inquiryCustomers(this.customerSearch, false);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = this.getSearchResult() as SearchConditionRequest;
    this.customerSearch = request;
    await this.inquiryCustomers(request);
  }

  async inquiryCustomers(request: SearchConditionRequest, isDownload: boolean = false) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = this.getSearchResult();
    request = { ...request, ...resultTabs };
    if (isDownload) {
      await this.dashboardService.inquiryCustomerDashboardDownload(request, 'ลูกหนี้แบ่งตาม DPD และสถานะเอกสาร');
    } else {
      this.pageData = await this.dashboardService.inquiryCustomerDashboard(request);
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
    this.customerSearch.sortBy = this.currentSortBy;
    this.customerSearch.sortOrder = this.currentSortOrder;
    this.customerSearch.tab = 'DASHBOARD';
    return this.customerSearch;
  }

  setPaginationContent(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: CustomerDocumentDto[]
  ) {
    this.data = content || [];
    this.pageResultConfig = resultConfig;
    this.pageActionConfig = actionConfig;
  }

  async pageEvent(event: any) {
    let request = this.getSearchResult() as SearchConditionRequest; /* Set new pageNumber to requestObj */
    request.page = event - 1;
    await this.inquiryCustomers(request, false);
  }

  clearSearch() {
    this.currentSortBy = ['customerId'];
    this.currentSortOrder = 'ASC';
    this.customerSearch = { ...this.defaultSearch };
  }

  async onSaveFile() {
    await this.inquiryCustomers({}, true);
  }

  /* Table Events */
  onClickCIFNo(value: string) {
    this.routerService.navigateTo('/main/customer/detail', { customerId: value });
  }

  /** Action Bar */
  onBack() {
    this.routerService.back();
  }
}
