import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TaskService } from '@app/modules/task/services/task.service';
import { TransferReasonDialogComponent } from '@app/shared/components/common-dialogs/transfer-reason-dialog/transfer-reason-dialog.component';
import { ExpenseSearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { SearchControllerService } from '@app/shared/components/search-controller/search-controller.service';
import { LexsUserPermissionCodes, Mode, TMode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { ActionOnScreen, SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import { ExpenseDto, MeLexsUserDto, PageOfExpenseDto, TaskUserRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import {
  DialogOptions,
  DropDownConfig,
  PaginatorActionConfig,
  PaginatorResultConfig,
  SimpleSelectOption,
} from '@spig/core';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit, AfterViewChecked {
  @ViewChildren(MatTable) table!: QueryList<any>;

  /** Permission */
  public accessPermissions = this.sessionService.accessPermissions();
  public actionOnScreen: ActionOnScreen = {
    canAdd: this.accessPermissions.mode.includes('ADD'),
    canEdit: this.accessPermissions.mode.includes('EDIT'),
    canDelete: this.accessPermissions.mode.includes('DELETE'),
  };
  public hasTransferTask = this.accessPermissions.permissions.includes(
    LexsUserPermissionCodes.FINANCE_EXPENSE_TRANSFER_TASK
  );

  /** Selection */
  public selection = new SelectionModel<number>(true, []);

  //  Common
  private tasks: PageOfExpenseDto = {};
  private orderOptions = [
    { text: this.translate.instant('FINANCE.ORDER_BY_EXPENSE_NO_ASC'), value: '0_ASC' },
    { text: this.translate.instant('FINANCE.ORDER_BY_EXPENSE_NO_DESC'), value: '0_DESC' },
  ];
  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  public tabIndex = 0;
  private currentSortBy: string[] = ['expenseNo'];
  private sortByOptions: string[] = ['expenseNo'];
  private currentSortOrder: string = 'DESC';

  // myTask tab
  public isMyTask: boolean = false;
  public myTaskSearch: ExpenseSearchConditionRequest = {};
  public myTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public myTaskSortingConfig: DropDownConfig = this.configDropdown;
  public myTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public myTaskPageResultConfig!: PaginatorResultConfig;
  public myTaskPageActionConfig!: PaginatorActionConfig;
  private myCrrentPage: number = 0;
  public myTaskData: Array<any> = [];

  // Team task  tab
  public isTeamTask: boolean = false;
  public teamTaskSearch: ExpenseSearchConditionRequest = {};
  public teamTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public teamTaskSortingConfig: DropDownConfig = this.configDropdown;
  public teamTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public teamTaskPageResultConfig!: PaginatorResultConfig;
  public teamTaskPageActionConfig!: PaginatorActionConfig;
  private teamCrrentPage: number = 0;
  public teamTaskData: Array<any> = [];

  // org task tab
  public isOrgTask: boolean = false;
  public orgTaskSearch: ExpenseSearchConditionRequest = {};
  public orgTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public orgTaskSortingConfig: DropDownConfig = this.configDropdown;
  public orgTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public orgTaskPageResultConfig!: PaginatorResultConfig;
  public orgTaskPageActionConfig!: PaginatorActionConfig;
  private orgCrrentPage: number = 0;
  public orgTaskData: Array<any> = [];

  /** Closed Task tab */
  public isClosedTask: boolean = false;
  public closedTaskSearch: ExpenseSearchConditionRequest = {};
  public closedTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public closedTaskSortingConfig: DropDownConfig = this.configDropdown;
  public closedTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public closedTaskPageActionConfig!: PaginatorActionConfig;
  public closedTaskPageResultConfig!: PaginatorResultConfig;
  private closedCrrentPage: number = 0;
  public closedTaskData: Array<any> = [];

  public auditTabLabel: string = '';

  public reload = false;

  // display
  public selectedColumns: string[] = [
    'selection',
    'no',
    'expenseRequestNo',
    'referenceExpenseNo',
    'expenseType',
    'number',
    'requestedAmount',
    'deductedAmount',
    'netAmount',
    'daysSla',
    'personInCharge',
    'bookingStatus',
    'task',
    'auditLog',
  ];
  public nonSelectedColumns: string[] = [
    'no',
    'expenseRequestNo',
    'referenceExpenseNo',
    'expenseType',
    'number',
    'requestedAmount',
    'deductedAmount',
    'netAmount',
    'daysSla',
    'bookingStatus',
    'task',
    'auditLog',
  ];
  public displayedColumns: string[] = [];
  public isAuditLog: boolean = false;
  private currentUser: MeLexsUserDto = {};
  public userId: any;

  constructor(
    private translate: TranslateService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private expenseService: ExpenseService,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private searchControllerService: SearchControllerService,
    private cdf: ChangeDetectorRef
  ) {
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
    this.userId = this.currentUser?.userId;
  }

  async ngOnInit(): Promise<void> {
    // reload data
    this.tabIndex = 0;
    this.reload = true;
    const requestTab = this.getSearchResultByTab(this.tabIndex);
    await this.inquiryTask(requestTab, false, true);
    this.reload = false;
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
        this.cdf.detectChanges();
      });
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (this.tabIndex === Number(event.tab.textLabel)) return;
    this.tabIndex = Number(event.tab.textLabel);
    this.inquiryTask({
      page: this.getCurrentPageTab(this.tabIndex),
    });
    this.selection.clear();
  }

  getCurrentPageTab(tabIndex: number) {
    switch (tabIndex) {
      case 0:
        return this.myCrrentPage;
      case 1:
        return this.teamCrrentPage;
      case 2:
        return this.orgCrrentPage;
      case 3:
        return this.closedCrrentPage;
      default:
        return this.myCrrentPage;
    }
  }

  async downloadExcel() {
    await this.inquiryTask({}, true);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = this.getSearchResultByTab(this.tabIndex) as ExpenseSearchConditionRequest;
    await this.inquiryTask(request);
  }

  isAllSelected() {
    switch (this.tabIndex) {
      case 0:
        return this.selection.selected.length === this.myTaskData.length;
      case 1:
        return this.selection.selected.length === this.teamTaskData.length;
      case 2:
        return this.selection.selected.length === this.orgTaskData.length;
      case 3:
        return this.selection.selected.length === this.closedTaskData.length;
      default:
        return this.selection.selected.length === this.myTaskData.length;
    }
  }

  // Selection
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      switch (this.tabIndex) {
        case 1:
          const _mapperTeam = this.teamTaskData.map(m => {
            return m.taskId;
          }) as number[];
          this.selection.select(..._mapperTeam);
          break;
        case 2:
          const _mapperOrg = this.orgTaskData.map(m => {
            return m.taskId;
          }) as number[];
          this.selection.select(..._mapperOrg);
          break;
        case 3:
          const _mapperClosed = this.closedTaskData.map(m => {
            return m.taskId;
          }) as number[];
          this.selection.select(..._mapperClosed);
          break;
        default:
          const _mapperMyTask = this.myTaskData.map(m => {
            return m.taskId;
          }) as number[];
          this.selection.select(..._mapperMyTask);
          break;
      }
    }
  }

  onCheckboxChange(row: ExpenseDto) {
    row.taskId && this.selection.toggle(row.taskId);
  }

  setPageInquiry() {
    return {
      size: 10,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
    } as ExpenseSearchConditionRequest;
  }

  async inquiryTask(request: ExpenseSearchConditionRequest, isDownload: boolean = false, isInitial: boolean = false) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = !isInitial ? this.getSearchResultByTab(this.tabIndex) : request;
    request = { ...request, ...resultTabs };
    if (request.assigneeId?.length === this.searchControllerService.userOptions.length) {
      request.assigneeId = undefined;
    }
    if (isDownload) {
      await this.expenseService.inquiryExpenseDownload(request, 'รายการทั้งหมด');
    } else {
      const res: any = await this.expenseService.inquiryExpense(request);
      if (!!res) {
        this.tasks = res;
        // set data and paginator for table
        const { resultConfig, actionConfig } = Utils.setPagination(
          this.tasks.pageable,
          this.tasks.numberOfElements,
          this.tasks.totalPages,
          this.tasks.totalElements
        );
        this.setPaginationContentByTab(resultConfig, actionConfig, this.tasks.content);
      }
    }
  }

  setPaginationContentByTab(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: ExpenseDto[]
  ) {
    switch (this.tabIndex) {
      case 1:
        this.displayedColumns = this.selectedColumns;
        this.teamTaskData = content || [];
        this.teamTaskPageResultConfig = resultConfig;
        this.teamTaskPageActionConfig = actionConfig;
        break;
      case 2:
        this.displayedColumns = this.selectedColumns;
        this.orgTaskData = content || [];
        this.orgTaskPageResultConfig = resultConfig;
        this.orgTaskPageActionConfig = actionConfig;
        break;
      case 3:
        this.displayedColumns = this.nonSelectedColumns;
        this.closedTaskData = content || [];
        this.closedTaskPageResultConfig = resultConfig;
        this.closedTaskPageActionConfig = actionConfig;
        break;
      default:
        this.displayedColumns = this.selectedColumns;
        this.myTaskData = content || [];
        this.myTaskPageResultConfig = resultConfig;
        this.myTaskPageActionConfig = actionConfig;
        break;
    }
  }

  // // Navigation
  onStartTask(element: any) {
    let mode = Mode.VIEW;
    /**
     * assign mode by statusCode
     *   PENDING           - waiting for editing
     *   PENDING_APPROVAL  - waiting for editing
     *   FAILED            - rejected from approver -> waiting for fixing
     */
    if (
      element.statusCode === 'PENDING' ||
      element.statusCode === 'PENDING_APPROVAL' ||
      element.statusCode === 'FAILED'
    ) {
      mode = element.statusCode !== 'PENDING_APPROVAL' ? Mode.EDIT : Mode.APPROVE;
    } else {
      mode = Mode.VIEW;
    }
    this.routerService.navigateTo('/main/finance/expense/detail', {
      paymentMode: mode,
      taskId: element.taskId,
      expenseObjectId: element.expenseNo,
      taskCode: element.taskCode,
      statusCode: element.statusCode,
      currentAssigneeId: element.currentAssigneeId,
      currentAssigneeName: element.currentAssigneeName,
      latestDraftBy: element.latestDraftBy, // pls don't remove it, will use for tracking next step
      latestDraftTime: element.latestDraftTime, // pls don't remove it, will use for tracking next step
    });
  }

  toAuditLog(element: any) {
    this.routerService.navigateTo('/main/finance/expense/audit-log', {
      financeMode: 'EXPENSE',
      financeId: element.expenseNo,
      statusName: element.expenseStatusName,
      status: element.expenseStatus,
    });
  }

  getSearchResultByTab(tabIndex: number): ExpenseSearchConditionRequest {
    switch (tabIndex) {
      case 0:
        this.myTaskSearch.tab = 'USER';
        this.myTaskSearch.sortBy = this.currentSortBy;
        this.myTaskSearch.sortOrder = this.currentSortOrder;
        return this.myTaskSearch;
      case 1:
        this.teamTaskSearch.tab = 'TEAM';
        this.teamTaskSearch.sortBy = this.currentSortBy;
        this.teamTaskSearch.sortOrder = this.currentSortOrder;
        return this.teamTaskSearch;
      case 2:
        this.orgTaskSearch.tab = 'ORG';
        this.orgTaskSearch.sortBy = this.currentSortBy;
        this.orgTaskSearch.sortOrder = this.currentSortOrder;
        return this.orgTaskSearch;
      case 3:
        this.closedTaskSearch.tab = 'CLOSED';
        this.closedTaskSearch.sortBy = this.currentSortBy;
        this.closedTaskSearch.sortOrder = this.currentSortOrder;
        return this.closedTaskSearch;
      default:
        this.myTaskSearch.tab = 'USER';
        this.myTaskSearch.sortBy = this.currentSortBy;
        this.myTaskSearch.sortOrder = this.currentSortOrder;
        return this.myTaskSearch;
    }
  }

  async pageEvent(event: number, tabIndex: number) {
    switch (tabIndex) {
      case 0:
        this.myCrrentPage = event - 1;
        break;
      case 1:
        this.teamCrrentPage = event - 1;
        break;
      case 2:
        this.orgCrrentPage = event - 1;
        break;
      case 3:
        this.closedCrrentPage = event - 1;
        break;
      default:
        this.myCrrentPage = event - 1;
        break;
    }
    let request = this.getSearchResultByTab(this.tabIndex) as ExpenseSearchConditionRequest;
    request.page = event - 1;
    await this.inquiryTask(request);
  }

  async onSearchResult(event: ExpenseSearchConditionRequest, tabIndex: number) {
    switch (tabIndex) {
      case 0:
        this.myTaskSearch = { ...event };
        await this.inquiryTask(this.myTaskSearch);
        break;
      case 1:
        this.teamTaskSearch = { ...event };
        await this.inquiryTask(this.teamTaskSearch);
        break;
      case 2:
        this.orgTaskSearch = { ...event };
        await this.inquiryTask(this.orgTaskSearch);
        break;
      case 3:
        this.closedTaskSearch = { ...event };
        await this.inquiryTask(this.closedTaskSearch);
        break;
    }
    this.selection.clear();
  }

  get hasPermissionCreateBook(): boolean {
    const hasPermission = this.accessPermissions.permissions.includes(
      LexsUserPermissionCodes.FINANCE_EXPENSE_CREATE_PAYMENT_BOOK
    );
    return hasPermission;
  }

  createPaymentBook() {
    this.expenseService.clearDataPayment();
    this.routerService.navigateTo('/main/finance/expense/detail', { paymentMode: TMode.ADD });
  }

  async onTransferButtonClicked() {
    if (this.selection.selected.length < 1) {
      this.notificationService.alertDialog('TASK.NOTICE_CANNOT_TRANSFER_TASK', 'TASK.NOTICE_SELECT_AT_LEAST_ONE_TASK');
    } else {
      const taskSelected = this.selection.selected;
      const request: TaskUserRequest = {
        taskIds: taskSelected,
      };
      this.taskService.transferUserOption = (await this.taskService.transferTaskUserOption(request)) || [];
      const dialogSetting: DialogOptions = {
        component: TransferReasonDialogComponent,
        title: 'กำหนดผู้รับโอน',
        iconName: 'icon-Person-Swap',
        rightButtonLabel: 'ยืนยันโอนงาน',
        buttonIconName: 'icon-Check-Square',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        context: {
          menu: 'FINANCE_EXPENSE',
          taskCount: taskSelected.length,
          taskSelected: taskSelected,
        },
      };
      const dialogResult: string = await this.notificationService.showCustomDialog(dialogSetting);
      if (dialogResult) {
        this.notificationService.openSnackbarSuccess(
          `${taskSelected.length} รายการจ่ายถูกมอบหมายแล้วให้ ${dialogResult.split('-')[1].trim()}`
        );
        this.selection.clear();
        this.inquiryTask({});
      }
    }
  }
}
