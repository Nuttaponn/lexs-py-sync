import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { SearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { MAIN_ROUTES } from '@app/shared/constant/routes.constant';
import { taskCode, taskCodeList } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils';
import { PageOfTaskDto, TaskDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { SubSink } from 'subsink';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-pool',
  templateUrl: './task-pool.component.html',
  styleUrls: ['./task-pool.component.scss'],
})
export class TaskPoolComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public reload: boolean = false;

  constructor(
    private taskService: TaskService,
    private translate: TranslateService,
    private sessionService: SessionService,
    private routerService: RouterService,
    private notificationService: NotificationService
  ) {
    this.subs.add(
      this.sessionService.viewAsFetchData.subscribe(async value => {
        value && (await this.fetchInquiryTask());
      }),
      this.routerService.onReloadUrl.subscribe(async value => {
        if (value === MAIN_ROUTES.TASK_POOL) {
          // reset search data
          this.myTaskSearch = {};
          this.myTaskSortingCtrl.setValue('0_ASC');
          this.myTaskSortingCtrl.updateValueAndValidity();
          // reload data
          this.reload = true;
          const request = {
            ...this.myTaskSearch,
            sortBy: this.currentSortBy,
            sortOrder: this.currentSortOrder,
          };
          await this.inquiryTask(request);
          this.reload = false;
        }
      })
    );
  }

  @ViewChild('taskTable') taskTable!: MatTable<TaskDto>;
  private tasks: PageOfTaskDto = {};

  public displayedColumns: string[] = [
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
  public trackBy = (_index: number, item: TaskDto) => {
    return `${_index}-${item.taskId}`;
  };

  private orderOptions = [
    // customerId
    { text: this.translate.instant('TASK.ORDER_BY_CUSTOMER_ID_ASC'), value: '0_ASC' },
    { text: this.translate.instant('TASK.ORDER_BY_CUSTOMER_ID_DESC'), value: '0_DESC' },
    // response unit
    { text: this.translate.instant('TASK.ORDER_BY_RESPONSE_UNIT_ASC'), value: '1_ASC' },
    { text: this.translate.instant('TASK.ORDER_BY_RESPONSE_UNIT_DESC'), value: '1_DESC' },
    // response amd unit
    { text: this.translate.instant('TASK.ORDER_BY_AMD_UNIT_ASC'), value: '2_ASC' },
    { text: this.translate.instant('TASK.ORDER_BY_AMD_UNIT_DESC'), value: '2_DESC' },
    // exp date
    { text: this.translate.instant('TASK.ORDER_BY_EXP_DATE_ASC'), value: '3_ASC' },
    { text: this.translate.instant('TASK.ORDER_BY_EXP_DATE_DESC'), value: '3_DESC' },
  ];
  private sortByOptions: string[] = ['customerId', 'responseUnit', 'amdUnit', 'prescriptionDate'];
  private currentSortBy: string[] = ['customerId'];
  private currentSortOrder: string = 'ASC';
  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };

  public myTaskSearch: SearchConditionRequest = {};
  public myTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public myTaskSortingConfig: DropDownConfig = this.configDropdown;
  public myTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private myCurrentPage: number = 0;
  public myTaskData: Array<TaskDto> = [];
  public myTaskPageResultConfig!: PaginatorResultConfig;
  public myTaskPageActionConfig!: PaginatorActionConfig;

  public TASK_CODE_LIST = taskCodeList;
  public hideDraftInfoTooltip: taskCode[] = ['DECREE_OF_FIRST_INSTANCE', 'DECREE_OF_APPEAL', 'DECREE_OF_SUPREME_COURT'];

  async ngOnInit(): Promise<void> {
    this.fetchInquiryTask();
    this.updateTaskPoolCount();
  }

  async ngOnDestroy(): Promise<void> {
    this.updateTaskPoolCount();
  }

  async updateTaskPoolCount() {
    try {
      const res = await this.taskService.countUnassignedTasks();
      if (res) this.taskService.taskPoolCountSubject.next(res);
    } catch (e) {}
  }

  async inquiryTask(request: SearchConditionRequest) {
    // inquire tasks
    this.tasks = await this.taskService.inquiryUnassignedTask(request);
    // set data and paginator for table
    const { resultConfig, actionConfig } = Utils.setPagination(
      this.tasks.pageable,
      this.tasks.numberOfElements,
      this.tasks.totalPages,
      this.tasks.totalElements
    );
    this.setPaginationContent(resultConfig, actionConfig, this.tasks.content);
  }

  async fetchInquiryTask() {
    const request = {
      ...this.myTaskSearch,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
    };
    await this.inquiryTask(request);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = {
      ...this.myTaskSearch,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
    };
    await this.inquiryTask(request);
  }

  async onSearchResult(event: SearchConditionRequest) {
    this.myTaskSearch = { ...event };
    await this.inquiryTask(this.myTaskSearch);
  }

  setPaginationContent(resultConfig: PaginatorResultConfig, actionConfig: PaginatorActionConfig, content?: TaskDto[]) {
    this.myTaskData = content || [];
    this.myTaskPageResultConfig = resultConfig;
    this.myTaskPageActionConfig = actionConfig;
  }

  async pageEvent(event: number) {
    this.myCurrentPage = event - 1;
    let request = {
      ...this.myTaskSearch,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
      page: event - 1,
    };
    await this.inquiryTask(request);
  }

  async onAcceptTask(task: TaskDto, index: number) {
    try {
      await this.taskService.selfAssignTask(task.taskId || 0);
      this.notificationService.openSnackbarSuccess(this.translate.instant('TASK.TASK_ASSIGN_SUCCESS'));
      this.fetchInquiryTask();
      this.updateTaskPoolCount();
    } catch (e) {}
  }

  navigateToCustomer(customerId: string) {
    this.routerService.navigateTo('/main/customer/detail', { customerId: customerId });
  }

  navigateToLitigation(lgId: string) {
    this.routerService.navigateTo('/main/lawsuit/detail', { lgId: lgId });
  }
}
