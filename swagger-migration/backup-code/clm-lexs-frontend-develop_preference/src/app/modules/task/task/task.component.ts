import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { TransferDialogComponent } from '@app/shared/components/common-dialogs/transfer-dialog/transfer-dialog.component';
import { TransferReasonDialogComponent } from '@app/shared/components/common-dialogs/transfer-reason-dialog/transfer-reason-dialog.component';
import { MAIN_ROUTES, TaskRoutingMapper } from '@app/shared/constant';
import {
  Mode,
  TaskCodeFinance,
  TaskCodeFinanceEdit,
  TaskCodeStatusMapper,
  taskCode,
  taskCodeList,
} from '@app/shared/models';
import { ActionOnScreen, SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import { MeLexsUserDto, PageOfTaskDto, TaskDto, TaskUserRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import {
  AdvanceSearchOption,
  SearchConditionRequest,
} from '@shared/components/search-controller/search-controller.model';
import { MasterDataService } from '@shared/services/master-data.service';
import { NotificationService } from '@shared/services/notification.service';
import { RouterService } from '@shared/services/router.service';
import {
  DialogOptions,
  DropDownConfig,
  PaginatorActionConfig,
  PaginatorResultConfig,
  SimpleSelectOption,
} from '@spig/core';
import { SubSink } from 'subsink';
import { TaskService } from '../services/task.service';
import { SelectedInfo } from '../task.interface';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChildren(MatTable) table!: QueryList<any>;

  /** Common */
  private tasks: PageOfTaskDto = {};
  public tabIndex = 0;
  private orderOptions = [
    // customerId
    {
      text: this.translate.instant('TASK.ORDER_BY_CUSTOMER_ID_ASC'),
      value: '0_ASC',
    },
    {
      text: this.translate.instant('TASK.ORDER_BY_CUSTOMER_ID_DESC'),
      value: '0_DESC',
    },
    // response unit
    {
      text: this.translate.instant('TASK.ORDER_BY_RESPONSE_UNIT_ASC'),
      value: '1_ASC',
    },
    {
      text: this.translate.instant('TASK.ORDER_BY_RESPONSE_UNIT_DESC'),
      value: '1_DESC',
    },
    // response amd unit
    {
      text: this.translate.instant('TASK.ORDER_BY_AMD_UNIT_ASC'),
      value: '2_ASC',
    },
    {
      text: this.translate.instant('TASK.ORDER_BY_AMD_UNIT_DESC'),
      value: '2_DESC',
    },
    // exp date
    {
      text: this.translate.instant('TASK.ORDER_BY_EXP_DATE_ASC'),
      value: '3_ASC',
    },
    {
      text: this.translate.instant('TASK.ORDER_BY_EXP_DATE_DESC'),
      value: '3_DESC',
    },
    // sla
    {
      text: this.translate.instant('TASK.ORDER_BY_SLA_ASC'),
      value: '4_ASC',
    },
    {
      text: this.translate.instant('TASK.ORDER_BY_SLA_DESC'),
      value: '4_DESC',
    },
  ];
  private sortByOptions: string[] = ['customerId', 'responseUnit', 'amdUnit', 'prescriptionDate', 'daysExceedSla'];
  private currentSortBy: string[] = ['customerId'];
  private currentSortOrder: string = 'DESC';
  private configDropdown: DropDownConfig = {
    iconName: 'icon-Sorting',
    searchPlaceHolder: '',
  };

  /** Displayed Columns */
  public selectedColumns: string[] = [
    'selection',
    'cifId',
    'litigationId',
    'dpd',
    'displayCFinalAndStage',
    'prescriptionDate',
    'daysSla',
    'totalAmountInArrears',
    'deptAmountInArrears',
    'responseUnit',
    'responseAMDUnit',
    'taskOwner',
    'statusName',
    'action',
  ];
  public nonSelectedColumns: string[] = [
    'cifId',
    'litigationId',
    'dpd',
    'displayCFinalAndStage',
    'prescriptionDate',
    'daysSla',
    'totalAmountInArrears',
    'deptAmountInArrears',
    'responseUnit',
    'responseAMDUnit',
    'taskOwner',
    'statusName',
    'action',
  ];
  public displayedColumns: string[] = [];
  public trackBy = (_index: number, item: TaskDto) => {
    return `${_index}-${item.taskId}`;
  };

  /** Selection */
  public selection = new SelectionModel<number>(true, []);

  /** My Task tab */
  public isMyTask: boolean = false;
  public myTaskSearch: SearchConditionRequest = {};
  public myTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public myTaskSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ defaultValue: '0_DESC', searchWith: 'text' },
  };
  public myTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private myCrrentPage: number = 0;
  public myTaskData: Array<TaskDto> = [];
  public myTaskPageResultConfig!: PaginatorResultConfig;
  public myTaskPageActionConfig!: PaginatorActionConfig;

  /** Team Task tab */
  public isTeamTask: boolean = false;
  public teamTaskSearch: SearchConditionRequest = {};
  public teamTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public teamTaskSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ defaultValue: '0_DESC', searchWith: 'text' },
  };
  public teamTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private teamCrrentPage: number = 0;
  public teamTaskData: Array<TaskDto> = [];
  public teamTaskPageResultConfig!: PaginatorResultConfig;
  public teamTaskPageActionConfig!: PaginatorActionConfig;

  /** Org Task tab */
  public isOrgTask: boolean = false;
  public orgTaskSearch: SearchConditionRequest = {};
  public orgTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public orgTaskSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ defaultValue: '0_DESC', searchWith: 'text' },
  };
  public orgTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private orgCrrentPage: number = 0;
  public orgTaskData: Array<TaskDto> = [];
  public orgTaskPageResultConfig!: PaginatorResultConfig;
  public orgTaskPageActionConfig!: PaginatorActionConfig;

  /** Closed Task tab */
  public isClosedTask: boolean = false;
  public closedTaskSearch: SearchConditionRequest = {};
  public closedTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public closedTaskSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ defaultValue: '0_DESC', searchWith: 'text' },
  };
  public closedTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private closedCrrentPage: number = 0;
  public closedTaskData: Array<TaskDto> = [];
  public closedTaskPageResultConfig!: PaginatorResultConfig;
  public closedTaskPageActionConfig!: PaginatorActionConfig;

  /** Permission */
  public dataScopeCode: string = '';
  public currentUser?: MeLexsUserDto;
  public advanceOptions!: AdvanceSearchOption;
  public accessPermissions = this.sessionService.accessPermissions();
  public actionOnScreen: ActionOnScreen = {
    canAdd: this.accessPermissions.mode.includes('ADD'),
    canEdit: this.accessPermissions.mode.includes('EDIT'),
    canDelete: this.accessPermissions.mode.includes('DELETE'),
  };
  public showButtonPreference = this.accessPermissions.permissions.includes('START_PREFERENCE');
  public hasTransferTask =
    (this.actionOnScreen.canEdit || this.accessPermissions.mode.includes('APPROVE')) &&
    this.accessPermissions.permissions.includes('TRANSFER_TASK');
  public TASK_CODE = taskCode;
  public TASK_CODE_LIST = taskCodeList;

  public supportKlawSecretary = false;

  private queryStatusCode!: string;
  private subs = new SubSink();

  public reload = false;
  public forceStatusNormal: taskCode[] = ['RECORD_OF_SUPREME_COURT_ACKNOWLEDGE'];
  public forceStatusPending: taskCode[] = [
    'APPROVE_APPEAL',
    'RECORD_OF_SUPREME_COURT',
    'RECORD_DIAGNOSIS_DATE',
    'UPLOAD_E_FILING',
  ];
  public hideDraftInfoTooltip: taskCode[] = ['DECREE_OF_FIRST_INSTANCE', 'DECREE_OF_APPEAL', 'DECREE_OF_SUPREME_COURT'];
  private taskRoutingMapper = TaskRoutingMapper;
  public taskCodeStatusMapper = TaskCodeStatusMapper;

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private masterDataService: MasterDataService,
    private taskService: TaskService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private cdf: ChangeDetectorRef
  ) {
    this.subs.add(
      this.sessionService.viewAsFetchData.subscribe(async value => {
        value && (await this.fetchInquiryTask());
      }),
      this.route.queryParams.subscribe(value => {
        this.queryStatusCode = value['statusCode'];
      }),
      this.routerService.onReloadUrl.subscribe(async value => {
        if (value === MAIN_ROUTES.TASK) {
          // reset search data
          this.myTaskSearch = {};
          this.myTaskSortingCtrl.setValue('0_ASC');
          this.myTaskSortingCtrl.updateValueAndValidity();
          this.teamTaskSearch = {};
          this.teamTaskSortingCtrl.setValue('0_ASC');
          this.teamTaskSortingCtrl.updateValueAndValidity();
          this.orgTaskSearch = {};
          this.orgTaskSortingCtrl.setValue('0_ASC');
          this.orgTaskSortingCtrl.updateValueAndValidity();
          this.closedTaskSearch = {};
          this.closedTaskSortingCtrl.setValue('0_ASC');
          this.closedTaskSortingCtrl.updateValueAndValidity();
          // reload data
          this.tabIndex = 0;
          this.reload = true;
          const requestTab = this.getSearchResultByTab(this.tabIndex);
          await this.inquiryTask(requestTab, false, true);
          this.reload = false;
        }
      })
    );
  }

  async ngOnInit(): Promise<void> {
    this.supportKlawSecretary = JSON.parse(
      this.sessionService.currentUser?.attributes?.find(item => item.name === 'taskSupportRole')?.value || 'false'
    );
    this.advanceOptions = this.masterDataService.advanceOptions || {};
    this.currentUser = this.sessionService.currentUser;
    this.dataScopeCode = this.currentUser?.dataScopeCode || '';
    switch (this.dataScopeCode) {
      case 'SELF':
        this.isMyTask = true;
        this.isClosedTask = true;
        this.queryStatusCode === 'FINISHED' ? (this.tabIndex = 1) : (this.tabIndex = 0);
        break;
      case 'TEAM':
        this.isMyTask = true;
        this.isTeamTask = true;
        this.isClosedTask = true;
        this.queryStatusCode === 'FINISHED' ? (this.tabIndex = 2) : (this.tabIndex = 0);
        break;
      case 'ORGANIZATION':
        this.isMyTask = true;
        this.isTeamTask = true;
        this.isOrgTask = true;
        this.isClosedTask = true;
        this.queryStatusCode === 'FINISHED' ? (this.tabIndex = 3) : (this.tabIndex = 0);
        break;
    }
    let requestTab: SearchConditionRequest;
    if (this.queryStatusCode === 'FINISHED') {
      requestTab = this.getSearchResultByTab(3);
      this.tabIndex = 3;
    } else {
      requestTab = this.getSearchResultByTab(0);
    }
    await this.inquiryTask(requestTab, false, true);
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
        this.cdf.detectChanges();
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async fetchInquiryTask() {
    let requestTab: SearchConditionRequest;
    requestTab = this.getSearchResultByTab(this.tabIndex);
    await this.inquiryTask(requestTab, false, true);
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (this.tabIndex === Number(event.tab.textLabel)) return;
    this.tabIndex = Number(event.tab.textLabel);
    this.inquiryTask({
      page: this.getCurrentPageTab(this.tabIndex),
    });
    this.selection.clear();
  }

  async inquiryTask(request: SearchConditionRequest, isDownload: boolean = false, isInitial: boolean = false) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = !isInitial ? this.getSearchResultByTab(this.tabIndex) : request;
    request = { ...request, ...resultTabs };
    if (isDownload) {
      await this.taskService.inquiryTasksDownload(request, this.translate.instant('TASK.ALL_TASKS'));
    } else {
      this.tasks = await this.taskService.inquiryTasks(request);
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

  setPaginationContentByTab(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: TaskDto[]
  ) {
    switch (this.tabIndex) {
      case 1:
        this.displayedColumns = this.hasTransferTask ? this.selectedColumns : this.nonSelectedColumns;
        this.teamTaskData = content || [];
        this.teamTaskPageResultConfig = resultConfig;
        this.teamTaskPageActionConfig = actionConfig;
        break;
      case 2:
        this.displayedColumns = this.hasTransferTask ? this.selectedColumns : this.nonSelectedColumns;
        this.orgTaskData = content || [];
        this.orgTaskPageResultConfig = resultConfig;
        this.orgTaskPageActionConfig = actionConfig;
        break;
      case 3:
        this.displayedColumns = this.nonSelectedColumns.filter(e => e !== 'statusName');
        this.closedTaskData = content || [];
        this.closedTaskPageResultConfig = resultConfig;
        this.closedTaskPageActionConfig = actionConfig;
        break;
      default:
        this.displayedColumns = this.hasTransferTask ? this.selectedColumns : this.nonSelectedColumns;
        this.myTaskData = content || [];
        this.myTaskPageResultConfig = resultConfig;
        this.myTaskPageActionConfig = actionConfig;
        break;
    }
  }

  async onSearchResult(event: SearchConditionRequest, tabIndex: number) {
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

  getSearchResultByTab(tabIndex: number): SearchConditionRequest {
    switch (tabIndex) {
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

  getCurrentPageTab(tabIndex: number) {
    switch (tabIndex) {
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

  setPageInquiry() {
    return {
      size: 10,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
    } as SearchConditionRequest;
  }

  async pageEvent(event: number, tabIndex: number) {
    switch (tabIndex) {
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
    let request = this.getSearchResultByTab(this.tabIndex) as SearchConditionRequest;
    request.page = event - 1;
    await this.inquiryTask(request);
  }

  async downloadExcel() {
    await this.inquiryTask({}, true);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = this.getSearchResultByTab(this.tabIndex) as SearchConditionRequest;
    await this.inquiryTask(request);
  }

  onCheckboxChange(row: TaskDto) {
    row.taskId && this.selection.toggle(row.taskId);
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

  isAllSelected() {
    switch (this.tabIndex) {
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

  // Dialogs
  onTransferButtonClicked() {
    if (this.selection.selected.length < 1) {
      this.notificationService.alertDialog('TASK.NOTICE_CANNOT_TRANSFER_TASK', 'TASK.NOTICE_SELECT_AT_LEAST_ONE_TASK');
    } else {
      this.openTransferDialog();
    }
  }

  async showTransferDialog(context: any) {
    const _request: TaskUserRequest = {
      taskIds: context.taskSelected,
    };
    this.taskService.transferUserOption = await this.taskService.transferTaskUserOption(_request);
    const dialogSetting: DialogOptions = {
      component: TransferDialogComponent,
      title: 'TASK.TRANSFER_TASK',
      iconName: 'icon-Person-Swap',
      rightButtonLabel: 'TASK.BTN_NEXT',
      buttonIconName: 'icon-Arrow-Right',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: context,
      cancelEvent: true,
    };
    return this.notificationService.showCustomDialog(dialogSetting);
  }

  showTransferReasonDialog(context: any) {
    const dialogSetting: DialogOptions = {
      component: TransferReasonDialogComponent,
      title: 'TASK.TRANSFER_TASK',
      iconName: 'icon-Person-Swap',
      rightButtonLabel: 'TASK.TRANSFER_TASK',
      buttonIconName: 'icon-Person-Swap',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      backIconName: 'icon-Arrow-Left',
      contentCssClasses: ['space_between'],
      context: {
        menu: 'TASK',
        taskCount: context.taskCount,
        selectedUser: context.selectedUser,
        selectedInfo: context.selectedInfo as SelectedInfo,
      },
      backButtonLabel: 'COMMON.BUTTON_BACK',
      cancelEvent: true,
    };
    return this.notificationService.showCustomDialog(dialogSetting);
  }

  async openTransferDialog() {
    const myContext = {
      menu: 'TASK',
      taskSelected: this.selection.selected,
      taskCount: this.selection.selected.length,
    };

    await this.showTransferDialog(myContext).then(async transfer => {
      if (transfer && transfer.selectedUser && transfer.selectedUser.length > 0) {
        await this.showTransferReasonDialog({
          taskCount: myContext.taskCount,
          selectedUser: transfer.selectedUser,
          selectedInfo: transfer.selectedInfo as SelectedInfo,
        }).then(async response => {
          if (response.isBack) {
            // isBack
            this.notificationService.closeAll();
            this.onTransferButtonClicked();
          } else {
            if (response.isCancel) {
              this.notificationService.closeAll();
            } else {
              const transferTasksResponse = await this.taskService.transferTasks({
                note: response?.note || '',
                targetUserId: transfer.selectedUser[0],
                taskIds: this.selection.selected,
              });
              if (transferTasksResponse === null) {
                this.notificationService.openSnackbarSuccess(
                  `${myContext.taskCount} งานได้ถูกโอนแล้วให้ ${transfer.selectedInfo.title}${transfer.selectedInfo.name} ${transfer.selectedInfo.surname}`
                );
                this.selection.clear();
                this.inquiryTask({});
              }
            }
          }
        });
      }
    });
  }

  // Navigation
  async onStartTask(element: TaskDto) {
    this.taskService.taskOwner = element?.userId || '';
    let params = {
      taskId: element?.taskId,
      customerId: element?.customerId,
      flowType: element?.flowType,
      litigationId: element?.litigationId,
      createdBy:
        element.taskCode === 'COLLECT_LG_ID' || element.taskCode === 'ADD_SUB_ACCOUNT'
          ? `${element.createdBy} - ${element.createdByName}`
          : '',
      objectId: element?.objectId,
      mode: this.taskService.taskOwner === this.sessionService.currentUser?.userId ? Mode.EDIT : Mode.VIEW,
      defermentCategory: ['R2E07-02-B', 'R2E07-03-C', 'R2E07-04-D', 'R2E07-05-E'].includes(element?.taskCode || '')
        ? 'EXECUTION'
        : 'PROSECUTE',
      modeFromBtn: ['R2E07-02-B'].includes(element?.taskCode || '') ? 'APPROVE' : null
    };
    const getTaskRouting = element.taskCode ? this.taskRoutingMapper.get(<taskCode>element.taskCode) : undefined;

    if (getTaskRouting) {
      // IF Condition for MVP 2, MVP 3
      this.routerService.navigateTo(getTaskRouting, params);
    } else {
      // ELSE Condition for MVP 1
      if (
        element.taskCode &&
        (TaskCodeFinance.includes(element.taskCode as taskCode) ||
          TaskCodeFinanceEdit.includes(element.taskCode as taskCode))
      ) {
        params = {
          ...params,
          ...{
            expenseObjectId: element.objectId,
            currentAssigneeId: element?.userId,
            currentAssigneeName: element?.createdByName,
          },
        };
      }
      this.routerService.navigateTo('/main/task/detail', params);
    }
  }

  navigateToCustomer(customerId: string) {
    this.routerService.navigateTo('/main/customer/detail', {
      customerId: customerId,
    });
  }

  navigateToLitigation(litigationId: string) {
    this.routerService.navigateTo('/main/lawsuit/detail', { litigationId: litigationId });
  }

  onClickCommandPreference() {
    this.routerService.navigateTo('/main/preference/detail', {
      isOnRequest: true,
    });
  }
}
