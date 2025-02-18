import { Component, OnInit } from '@angular/core';
import { SearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { RouterService } from '@app/shared/services/router.service';
import { Utils } from '@app/shared/utils';
import { CollateralDto, CollateralLexsStatusDto } from '@lexs/lexs-client';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { DashboardService } from '../dashboard.service';
import { TranslateService } from '@ngx-translate/core';
import { SearchControllerService } from '@app/shared/components/search-controller/search-controller.service';
import { ActivatedRoute } from '@angular/router';
import { IDashboardTab } from '../dashboard-tab/dashboard-tab.component';
import { UntypedFormControl } from '@angular/forms';
import { LAWSUIT_DETAIL_ROUTES, LITIGATION_PROCESS_INFO_TAB_ROUTES } from '@app/shared/constant';

@Component({
  selector: 'app-detail-collateral',
  templateUrl: './detail-collateral.component.html',
  styleUrls: ['./detail-collateral.component.scss'],
})
export class DetailCollateralComponent implements OnInit {
  constructor(
    private routerService: RouterService,
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private searchControllerService: SearchControllerService,
    private route: ActivatedRoute
  ) {}

  currentTab: number | null = null;
  tabInfo: IDashboardTab[] = [
    {
      label: 'ไม่ถูกอายัด/ยึด/ขาย',
      color: '#52A933',
      count: this.dashboardService.collateralStatusCount['pledge'],
    },
    {
      label: 'ยึดทรัพย์',
      color: '#175900',
      count: this.dashboardService.collateralStatusCount['seizured'],
    },
    {
      label: 'อยู่ระหว่างขายทอดตลาด',
      color: '#242424',
      count: this.dashboardService.collateralStatusCount['onSale'],
    },
    {
      label: 'รอประกาศขายทอดตลาดใหม่',
      color: '#868686',
      count: this.dashboardService.collateralStatusCount['pendingSale'],
    },
    {
      label: 'ขายทอดตลาดแล้ว',
      color: '#D3D3D3',
      count: this.dashboardService.collateralStatusCount['sold'],
    },
  ];

  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  private currentSortBy: string[] = ['litigationId'];
  private sortByOptions: string[] = ['litigationId'];
  private currentSortOrder: string = 'ASC';
  private orderOptions = [
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LG_ID_ASC_SHORTENED'), value: '0_ASC' },
    { text: this.translate.instant('LAWSUIT.ORDER_BY_LG_ID_DESC_SHORTENED'), value: '0_DESC' },
  ];

  public reloadSearch: boolean = false;
  public collateralSearch: SearchConditionRequest = {};
  public defaultSearch: SearchConditionRequest = {};
  public sortingControl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public sortingConfig: DropDownConfig = this.configDropdown;
  public sortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public data: Array<CollateralDto> = [];
  public pageData: any = {}; /** PageOfCollateralDto */
  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;

  public displayedColumns: Array<string> = [
    'no',
    'litigationId',
    'cifNo',
    'caseNo',
    'totalCollaterals',
    'appraisalPrice',
    'collateralStatus',
    'litigationStatus',
  ];

  public columnTexts: { [key: string]: string } = {
    no: 'COMMON.LABEL_NO',
    litigationId: 'COMMON.LABEL_LITIGATION_ID',
    cifNo: 'LAWSUIT.HEAD_COLUMN_CIF_NO_W_NAME',
    caseNo: 'COMMON.LABEL_BLACK_CASE_NO_RED_CASE_NO',
    totalCollaterals: 'LAWSUIT.AMOUNT_OF_PROPERTY',
    appraisalPrice: 'CUSTOMER.ESTIMATE_PRICE_BATH',
    collateralStatus: 'CUSTOMER.HEAD_COLUMN_COLLATERAL_LEXS_STATUS',
    litigationStatus: 'LAWSUIT.HEAD_COLUMN_LATEST_LG_STATUS',
  };

  async ngOnInit(): Promise<void> {
    const initialTabIndex = this.route.snapshot.queryParams['tabIndex'];
    this.currentTab = initialTabIndex ? parseInt(initialTabIndex) : null;

    this.searchControllerService.initFinanceExpenseList();
    this.collateralSearch = {
      ...this.getSearchResult(),
      collateralLexsStatusDashboard: this.getTabName(this.currentTab),
    };
    await this.inquiryCollateral(this.collateralSearch, false);
    const { resultConfig, actionConfig } = Utils.setPagination(
      this.pageData.pageable,
      this.pageData.numberOfElements,
      this.pageData.totalPages,
      this.pageData.totalElements
    );
    this.setPaginationContent(resultConfig, actionConfig, this.pageData.content);
    this.defaultSearch = { ...this.collateralSearch };
  }

  async onTabChange(index: number | null) {
    this.reloadSearch = true;
    if (index === this.currentTab && this.currentTab !== null) this.currentTab = null;
    else this.currentTab = index;
    this.clearSearch();
    const request: SearchConditionRequest = {
      ...this.getSearchResult(),
      collateralLexsStatusDashboard: this.getTabName(this.currentTab),
      page: 0,
    };
    this.collateralSearch = request;
    await this.pageEvent(1);
    this.reloadSearch = false;
  }

  getTabName(index: number | null) {
    switch (index) {
      case null:
        return 'ALL_COLLATERAL_LEXS_STATUS';
      case 0:
        return 'COLLATERAL_LEXS_STATUS_PLEDGE';
      case 1:
        return 'COLLATERAL_LEXS_STATUS_SEIZURED';
      case 2:
        return 'COLLATERAL_LEXS_STATUS_ON_SALE';
      case 3:
        return 'COLLATERAL_LEXS_STATUS_PENDING_SALE';
      case 4:
        return 'COLLATERAL_LEXS_STATUS_SOLD';
      default:
        return 'ALL_COLLATERAL_LEXS_STATUS';
    }
  }

  async onSearchResult(event: SearchConditionRequest) {
    this.collateralSearch = {
      ...this.collateralSearch,
      ...event,
      page: 0,
    };
    await this.inquiryCollateral(this.collateralSearch, false);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = this.getSearchResult() as SearchConditionRequest;
    this.collateralSearch = request;
    await this.inquiryCollateral(request);
  }

  async inquiryCollateral(request: SearchConditionRequest, isDownload: boolean = false) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = this.getSearchResult();
    request = { ...request, ...resultTabs };
    if (isDownload) {
      await this.dashboardService.downloadCollateralLexsStatus(request, 'ลูกหนี้ในชั้นบังคับคดีแบ่งตามสถานะหลักประกัน');
    } else {
      this.pageData = await this.dashboardService.inquiryCollateralLexsStatus(request);
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
    this.collateralSearch.sortBy = this.currentSortBy;
    this.collateralSearch.sortOrder = this.currentSortOrder;
    this.collateralSearch.tab = 'DASHBOARD';
    return this.collateralSearch;
  }

  setPaginationContent(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: CollateralDto[]
  ) {
    this.data = content || [];
    this.pageResultConfig = resultConfig;
    this.pageActionConfig = actionConfig;
  }

  async pageEvent(event: any) {
    let request = this.getSearchResult() as SearchConditionRequest; /* Set new pageNumber to requestObj */
    request.page = event - 1;
    await this.inquiryCollateral(request, false);
  }

  clearSearch() {
    this.currentSortBy = ['litigationId'];
    this.currentSortOrder = 'ASC';
    this.collateralSearch = { ...this.defaultSearch };
  }

  async onSaveFile() {
    await this.inquiryCollateral({}, true);
  }

  /** Table Actions */
  goToLitigationDetail(element: CollateralLexsStatusDto) {
    this.routerService.pushStack(LAWSUIT_DETAIL_ROUTES.MAIN);
    this.routerService.navigateTo(LITIGATION_PROCESS_INFO_TAB_ROUTES.COLLATERAL_INFO_TAB, {
      litigationId: element.litigationId,
      _tabIndex: 1,
      _subIndex: 2,
    });
  }

  goToCustomerDetail(element: CollateralLexsStatusDto) {
    this.routerService.navigateTo('/main/customer/detail', { customerId: element.customerId });
  }

  /** Action Bar */
  onBack() {
    this.routerService.back();
  }
}
