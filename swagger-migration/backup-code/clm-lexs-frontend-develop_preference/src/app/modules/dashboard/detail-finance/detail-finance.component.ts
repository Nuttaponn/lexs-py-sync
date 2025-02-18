import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from '@app/modules/finance/services/expense.service';
import { UserService } from '@app/modules/user/user.service';
import {
  ExpenseSearchConditionRequest,
  ExpenseSearchOption,
} from '@app/shared/components/search-controller/search-controller.model';
import { SearchControllerService } from '@app/shared/components/search-controller/search-controller.service';
import { Mode } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { RouterService } from '@app/shared/services/router.service';
import { Utils } from '@app/shared/utils/util';
import { ExpenseDto, PageOfExpenseDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { IDashboardTab } from '../dashboard-tab/dashboard-tab.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-detail-finance',
  templateUrl: './detail-finance.component.html',
  styleUrls: ['./detail-finance.component.scss'],
})
export class DetailFinanceComponent implements OnInit {
  @ViewChildren(MatTable) table!: QueryList<any>;
  public isEnableShadow: boolean = false;

  constructor(
    private routerService: RouterService,
    private expenseService: ExpenseService,
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private searchControllerService: SearchControllerService,
    private masterDataService: MasterDataService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  currentTab: number | null = null;
  tabInfo: IDashboardTab[] = [
    {
      label: 'รอตรวจสอบรายการเบิกเงินโดย KTBLAW',
      color: '#00A6E6',
      count: this.dashboardService.financeCount['pendingVerification'],
    },
    {
      label: 'รออนุมัติการจ่ายเงินโดย KTB',
      color: '#00446B',
      count: this.dashboardService.financeCount['pendingApproval'],
    },
    {
      label: 'รออัปโหลดใบเสร็จโดย KTB Law',
      color: '#868686',
      count: this.dashboardService.financeCount['pendingReceiptUpload'],
    },
    {
      label: 'รอตรวจสอบใบเสร็จโดย KTB',
      color: '#E3E3E3',
      count: this.dashboardService.financeCount['pendingReceiptVerification'],
    },
  ];

  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  private currentSortBy: string[] = ['expenseNo'];
  private sortByOptions: string[] = ['expenseNo', 'expenseStatus', 'daysSla'];
  private currentSortOrder: string = 'ASC';
  private orderOptions = [
    { text: this.translate.instant('FINANCE.ORDER_BY_EXPENSE_NO_ASC'), value: '0_ASC' },
    { text: this.translate.instant('FINANCE.ORDER_BY_EXPENSE_NO_DESC'), value: '0_DESC' },
    { text: this.translate.instant('FINANCE.ORDER_BY_EXPENSE_STATUS_ASC'), value: '1_ASC' },
    { text: this.translate.instant('FINANCE.ORDER_BY_EXPENSE_STATUS_DESC'), value: '1_DESC' },
    { text: this.translate.instant('FINANCE.ORDER_BY_SLA_ASC'), value: '2_ASC' },
    { text: this.translate.instant('FINANCE.ORDER_BY_SLA_DESC'), value: '2_DESC' },
  ];

  public reloadSearch: boolean = false;
  public expenseSearch: ExpenseSearchConditionRequest = {};
  public defaultSearch: ExpenseSearchConditionRequest = {};
  public sortingControl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public sortingConfig: DropDownConfig = this.configDropdown;
  public sortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  // private currentPage: number = 0;
  public data: Array<ExpenseDto> = [];
  public pageData: PageOfExpenseDto = {};
  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;

  public displayedColumns: Array<string> = [
    'no',
    'expenseRequestNo',
    'number',
    'requestedAmount',
    'daysSla',
    'taskDate',
    'personInCharge',
    'bookingStatus',
  ];

  public searchControllerOptions: ExpenseSearchOption | undefined;

  async ngOnInit(): Promise<void> {
    const initialTabIndex = this.route.snapshot.queryParams['tabIndex'];
    this.currentTab = initialTabIndex ? parseInt(initialTabIndex) : null;

    // init expense search options
    const res = await Promise.all([
      this.expenseService.getExpenseNoList(),
      this.masterDataService.expenseStatus(),
      this.userService.inquiryUserOptions(),
    ]);
    this.searchControllerOptions = {
      expenseNoOptions: res[0],
      expenseStatusOptions: res[1],
      userOptions: res[2],
    };
    this.masterDataService.expenseOptions = { ...this.searchControllerOptions };

    this.searchControllerService.initFinanceExpenseList();
    this.expenseSearch = { ...this.getSearchResult(), expenseDashboard: this.getTabName(this.currentTab) };
    await this.inquiryExpense(this.expenseSearch, false);
    const { resultConfig, actionConfig } = Utils.setPagination(
      this.pageData.pageable,
      this.pageData.numberOfElements,
      this.pageData.totalPages,
      this.pageData.totalElements
    );
    this.setPaginationContent(resultConfig, actionConfig, this.pageData.content);
    this.defaultSearch = { ...this.expenseSearch };
  }

  async onTabChange(index: number | null) {
    this.reloadSearch = true;
    if (index === this.currentTab && this.currentTab !== null) this.currentTab = null;
    else this.currentTab = index;
    this.clearSearch();
    const request: ExpenseSearchConditionRequest = {
      ...this.getSearchResult(),
      page: 0,
      expenseDashboard: this.getTabName(this.currentTab),
    };
    this.expenseSearch = request;
    await this.pageEvent(1);
    this.reloadSearch = false;
  }

  getTabName(index: number | null) {
    switch (index) {
      case null:
        return 'ALL';
      case 0:
        return 'PENDING_VERIFICATION';
      case 1:
        return 'PENDING_APPROVAL';
      case 2:
        return 'PENDING_RECEIPT_UPLOAD';
      case 3:
        return 'PENDING_RECEIPT_VERIFICATION';
      default:
        return 'ALL';
    }
  }

  async onSearchResult(event: ExpenseSearchConditionRequest) {
    this.expenseSearch = {
      ...this.expenseSearch,
      ...event,
      page: 0,
    };
    await this.inquiryExpense(this.expenseSearch, false);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = this.getSearchResult() as ExpenseSearchConditionRequest;
    this.expenseSearch = request;
    await this.inquiryExpense(request);
  }

  async inquiryExpense(request: ExpenseSearchConditionRequest, isDownload: boolean = false) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = this.getSearchResult();
    request = { ...request, ...resultTabs };
    if (isDownload) {
      await this.dashboardService.inquiryExpenseDashboardDownload(request, 'รายการเบิกเงินของ KTBLAW');
    } else {
      this.pageData = await this.expenseService.inquiryExpense(request);
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
    } as ExpenseSearchConditionRequest;
  }

  getSearchResult(): ExpenseSearchConditionRequest {
    this.expenseSearch.sortBy = this.currentSortBy;
    this.expenseSearch.sortOrder = this.currentSortOrder;
    this.expenseSearch.tab = 'DASHBOARD';
    return this.expenseSearch;
  }

  setPaginationContent(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: ExpenseDto[]
  ) {
    this.data = content || [];
    this.pageResultConfig = resultConfig;
    this.pageActionConfig = actionConfig;
  }

  async pageEvent(event: any) {
    let request = this.getSearchResult() as ExpenseSearchConditionRequest; /* Set new pageNumber to requestObj */
    request.page = event - 1;
    await this.inquiryExpense(request, false);
  }

  clearSearch() {
    this.currentSortBy = ['expenseNo'];
    this.currentSortOrder = 'ASC';
    this.expenseSearch = { ...this.defaultSearch };
  }

  async onSaveFile() {
    await this.inquiryExpense({}, true);
  }

  /** Table Actions */
  goToExpenseDetail(element: ExpenseDto) {
    this.routerService.navigateTo('/main/finance/expense/detail', {
      expenseObjectId: element.expenseNo,
      currentAssigneeId: element.currentAssigneeId,
      currentAssigneeName: element.currentAssigneeName,
      mode: Mode.VIEW,
      taskId: element.taskId,
      taskCode: element.taskCode,
      statusCode: element.statusCode,
    });
  }

  /** Action Bar */
  onBack() {
    this.routerService.back();
  }
}
