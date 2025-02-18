import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewChecked, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AdvanceSearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { LexsUserPermissionCodes } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { ActionOnScreen, SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  AdvancePaymentDto,
  ExpenseDto,
  LitigationTransactionDto,
  MeLexsUserDto,
  NameValuePair,
  PageOfTaskDto,
  TransferOrderRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { AddLgDialogComponent } from '../receipt/receipt-detail/add-lg-dialog/add-lg-dialog.component';
import { AdvanceService } from './../services/advance.service';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss'],
})
export class AdvanceComponent implements OnInit, AfterViewChecked {
  @ViewChildren(MatTable) table!: QueryList<any>;

  /** Permission */
  public accessPermissions = this.sessionService.accessPermissions();
  public actionOnScreen: ActionOnScreen = {
    canAdd: this.accessPermissions.mode.includes('ADD'),
    canEdit: this.accessPermissions.mode.includes('EDIT'),
    canDelete: this.accessPermissions.mode.includes('DELETE'),
  };
  public hasTransferTask =
    (this.actionOnScreen.canEdit || this.accessPermissions.mode.includes('APPROVE')) &&
    this.accessPermissions.permissions.includes(LexsUserPermissionCodes.FINANCE_EXPENSE_TRANSFER_TASK);

  /** Selection */
  public selection = new SelectionModel<number>(true, []);

  //  Common
  private tasks: PageOfTaskDto = {};
  private orderOptions = [
    { text: this.translate.instant('FINANCE.ORDER_BY_ADVANCE_NO_ASC'), value: '0_ASC' },
    { text: this.translate.instant('FINANCE.ORDER_BY_ADVANCE_NO_DESC'), value: '0_DESC' },
  ];
  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  public tabIndex = 0;
  private currentSortBy: string[] = ['advancePaymentNo'];
  private sortByOptions: string[] = ['advancePaymentNo'];
  private currentSortOrder: string = 'DESC';
  public advancePaymentNoOptions: NameValuePair[] = this.advanceService.advancePaymentNoOptions;

  // inProgressTask tab
  public isInProgressTask: boolean = false;
  public inProgressTaskSearch: AdvanceSearchConditionRequest = {};
  public inProgressTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public inProgressTaskSortingConfig: DropDownConfig = this.configDropdown;
  public inProgressTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public inProgressTaskPageResultConfig!: PaginatorResultConfig;
  public inProgressTaskPageActionConfig!: PaginatorActionConfig;
  private inProgressTaskPage: number = 0;
  public inProgressTaskData: Array<any> = [];

  // completed task  tab
  public completedTask: boolean = false;
  public completedTaskSearch: AdvanceSearchConditionRequest = {};
  public completedTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public completedTaskSortingConfig: DropDownConfig = this.configDropdown;
  public completedTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public completedTaskPageResultConfig!: PaginatorResultConfig;
  public completedTaskPageActionConfig!: PaginatorActionConfig;
  private completedCrrentPage: number = 0;
  public completedTaskData: Array<any> = [];

  public auditTabLabel: string = '';

  public reload = false;

  // display
  public selectedColumns: string[] = ['no', 'booking', 'transferAmount', 'personInCharge', 'bookingStatus', 'auditLog'];
  public displayedColumns: string[] = [];
  public isAuditLog: boolean = false;
  private currentUser: MeLexsUserDto = {};
  public userId: any;

  constructor(
    private translate: TranslateService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private advanceService: AdvanceService,
    private notificationService: NotificationService
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
      });
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (this.tabIndex === Number(event.tab.textLabel)) return;
    this.tabIndex = Number(event.tab.textLabel);
    this.fetchAdvancePaymentNoOptions();
    this.inquiryTask({
      page: this.getCurrentPageTab(this.tabIndex),
    });
    this.selection.clear();
  }

  async fetchAdvancePaymentNoOptions() {
    const tab: string = this.tabIndex === 1 ? 'CLOSED' : 'ORG';
    const resopone = await this.advanceService.getAdvancePaymentNoList(tab);
    this.advanceService.advancePaymentNoOptions =
      resopone.advancePaymentNo?.map(item => {
        return { name: item, value: item } as NameValuePair;
      }) || [];
    this.advancePaymentNoOptions = this.advanceService.advancePaymentNoOptions;
  }

  getCurrentPageTab(tabIndex: number) {
    switch (tabIndex) {
      case 1:
        return this.completedCrrentPage;
      default:
        return this.inProgressTaskPage;
    }
  }

  async downloadExcel() {
    await this.inquiryTask({}, true);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = this.getSearchResultByTab(this.tabIndex) as AdvanceSearchConditionRequest;
    await this.inquiryTask(request);
  }

  isAllSelected() {
    switch (this.tabIndex) {
      case 1:
        return this.selection.selected.length === this.completedTaskData.length;
      default:
        return this.selection.selected.length === this.inProgressTaskData.length;
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
    } as AdvanceSearchConditionRequest;
  }

  setPaginationContentByTab(resultConfig: PaginatorResultConfig, actionConfig: PaginatorActionConfig) {
    switch (this.tabIndex) {
      case 1:
        this.completedTaskPageResultConfig = resultConfig;
        this.completedTaskPageActionConfig = actionConfig;
        break;
      default:
        this.inProgressTaskPageResultConfig = resultConfig;
        this.inProgressTaskPageActionConfig = actionConfig;
        break;
    }
  }

  async inquiryTask(request: AdvanceSearchConditionRequest, isDownload: boolean = false, isInitial: boolean = false) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = !isInitial ? this.getSearchResultByTab(this.tabIndex) : request;
    request = { ...request, ...resultTabs };
    if (isDownload) {
      let currentDate: Date = new Date();
      let currentTab = this.tabIndex === 0 ? 'รายการอยู่ระหว่างดำเนินการ' : 'รายการเสร็จสิ้น';
      let formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
      let fileName: any = currentTab + '_' + formattedDate;
      await this.advanceService.inquiryAdvanceDownload(request, fileName);
    } else {
      this.tasks = await this.advanceService.inquiryAdvance(request);
      this.tasks.content?.forEach((data: AdvancePaymentDto) => {
        const space = data.responseUser?.split(' ');
        Object.assign(data, { dateTime: space?.slice(-2).join(' : ') });
      });
    }
    // set data and paginator for table
    const { resultConfig, actionConfig } = Utils.setPagination(
      this.tasks.pageable,
      this.tasks.numberOfElements,
      this.tasks.totalPages,
      this.tasks.totalElements
    );
    this.displayedColumns = this.selectedColumns;
    this.setPaginationContentByTab(resultConfig, actionConfig);
    switch (this.tabIndex) {
      case 1:
        this.completedTaskData = this.tasks.content || [];
        break;
      default:
        this.inProgressTaskData = this.tasks.content || [];
        break;
    }
  }

  // // Navigation
  onStartTask(element?: any) {
    if (element) {
      this.routerService.navigateTo('/main/finance/advance/detail', {
        advancePaymentNo: element.advancePaymentNo || '-',
        taskId: element.taskId || '-',
        statusName: element.statusName || '-',
        statusCode: element.statusCode || '-',
        fromAdvancePaymentNo: true,
        currentAssigneeId: element.currentAssigneeId,
      });
    } else {
      this.routerService.navigateTo('/main/finance/advance/detail', {
        advancePaymentNo: '',
        taskId: '',
        statusName: '',
        statusCode: '',
        fromAdvancePaymentNo: true,
        isCreate: true,
      });
    }
  }

  toAuditLog(element: any) {
    this.routerService.navigateTo('/main/finance/expense/audit-log', {
      financeMode: 'ADVANCE',
      financeId: element.advancePaymentNo || 'บช6500123',
      statusName: element.advancePaymentStatusName || 'รอแก้ไขใบเสร็จ',
      status: element.advancePaymentStatus,
    });
  }

  getSearchResultByTab(tabIndex: number): AdvanceSearchConditionRequest {
    switch (tabIndex) {
      case 1:
        this.completedTaskSearch.tab = 'CLOSED';
        this.completedTaskSearch.sortBy = this.currentSortBy;
        this.completedTaskSearch.sortOrder = this.currentSortOrder;
        return this.completedTaskSearch;
      default:
        this.inProgressTaskSearch.tab = 'ORG';
        this.inProgressTaskSearch.sortBy = this.currentSortBy;
        this.inProgressTaskSearch.sortOrder = this.currentSortOrder;
        return this.inProgressTaskSearch;
    }
  }

  async pageEvent(event: number, tabIndex: number) {
    switch (tabIndex) {
      case 1:
        this.completedCrrentPage = event - 1;
        break;
      default:
        this.inProgressTaskPage = event - 1;
        break;
    }
    let request = this.getSearchResultByTab(this.tabIndex) as AdvanceSearchConditionRequest;
    request.page = event - 1;
    await this.inquiryTask(request);
  }

  async onSearchResult(event: AdvanceSearchConditionRequest, tabIndex: number) {
    switch (tabIndex) {
      case 1:
        this.completedTaskSearch = { ...event };
        await this.inquiryTask(this.completedTaskSearch);
        break;
      default:
        this.inProgressTaskSearch = { ...event };
        await this.inquiryTask(this.inProgressTaskSearch);
        break;
    }
    this.selection.clear();
  }

  get hasPermissionCreateBook(): boolean {
    const hasSubRole = ['MAKER'].includes(this.accessPermissions.subRoleCode);
    const isAMD = this.sessionService.currentUser?.roleCode === 'AMD_RESTRUCTURE' ? true : false;
    return hasSubRole && isAMD;
  }

  async addList() {
    const result = await this.notificationService.showCustomDialog({
      component: AddLgDialogComponent,
      type: 'xsmall',
      iconName: 'icon-Plus',
      title: 'FINANCE.ADD_PAYMENT_LIST_DIALOG.TITLE',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_CONTINUE2',
      buttonIconName: 'icon-Arrow-Right',
      context: { isAdvance: true, selectOneRow: true },
    });
    if (result) {
      let lgList = result.map((m: LitigationTransactionDto) => m.litigationCaseId?.toString()) || [];
      let request = {
        litigationCaseId: lgList, // array of litigationCaseId
        mode: TransferOrderRequest.ModeEnum.Normal, // mode
      };
      this.advanceService.advance = await this.advanceService.advanceReceiveInfoDetail(request);
      this.onStartTask();
    }
  }

  getPersonInCharge(element: any) {
    let splitString = (element.responseUser as string).split(' ');
    return splitString[0] + '-' + splitString[1] + ' ' + splitString[2] + ' ' + splitString[3];
  }
}
