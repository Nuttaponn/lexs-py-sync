import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@app/modules/customer/customer.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { UserService } from '@app/modules/user/user.service';
import {
  AUDIT_CUSTOMER_ACTION_LOV,
  AUDIT_CUSTOMER_OBJECT_LOV,
  AUDIT_LAWSUIT_ACTION_LOV,
  AUDIT_LAWSUIT_OBJECT_LOV,
  LogType,
  MAIN_ROUTES,
} from '@app/shared/constant';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { RouterService } from '@app/shared/services/router.service';
import { Utils } from '@app/shared/utils/util';
import {
  PageOfCustomerAuditLogDto,
  PageOfExpenseAuditLogDto,
  PageOfLitigationAuditLogDto,
  Pageable,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { SubSink } from 'subsink';
import { AuditLogService } from './audit-log.service';

interface IExpenseFilter {
  userId: string;
  action: string;
  objectType: string;
}

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss'],
})
export class AuditLogComponent implements OnInit, OnDestroy {
  public customerAuditLogList: Array<any> = [];
  public auditLogColumns: string[] = ['seq', 'userId', 'action', 'objectType', 'details', 'timestamp'];
  public pageResultConfig: PaginatorResultConfig = { fromIndex: 0, toIndex: 0, totalElements: 0 };
  public pageActionConfig: PaginatorActionConfig = { totalPages: 0, currentPage: 1, fromPage: 1, toPage: 1 };
  filterConfig!: IExpenseFilter;
  pageSize = 10;

  public dropDownUserFilterOption: SimpleSelectOption[] = [];
  public dropDownActionFilterOption: SimpleSelectOption[] = [];
  public dropDownObjectFilterOption: SimpleSelectOption[] = [];
  public dropDownExpenseFilterOption: SimpleSelectOption[] = [];
  public defaultUserDropdownItem: SimpleSelectOption[] = [
    { text: this.translateService.instant('CUSTOMER.AUDIT_LOG.DROPDOWN_ALL_USER'), value: 'ALL' },
  ];
  public defaultActionDropdownItem: SimpleSelectOption[] = [
    { text: this.translateService.instant('CUSTOMER.AUDIT_LOG.DROPDOWN_ALL_ACTION'), value: 'ALL' },
  ];
  public defaultObjectDropdownItem: SimpleSelectOption[] = [
    { text: this.translateService.instant('CUSTOMER.AUDIT_LOG.DROPDOWN_ALL_OBJECT'), value: 'ALL' },
  ];
  public defaultExpenseDropdownItem: SimpleSelectOption[] = [
    { text: this.translateService.instant('CUSTOMER.AUDIT_LOG.DROPDOWN_ALL_OBJECT'), value: 'ALL' },
  ];
  public dropDownFilterConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    searchPlaceHolder: '',
  };
  public selectedUser: UntypedFormControl = new UntypedFormControl('');
  public selectedAction: UntypedFormControl = new UntypedFormControl('');
  public selectedObject: UntypedFormControl = new UntypedFormControl('');
  public selectedSortingExpense: UntypedFormControl = new UntypedFormControl('');
  public customerId!: string;
  public litigationId!: string;
  public expenseObjectId!: string;
  public logType!: LogType;
  public detail: PageOfCustomerAuditLogDto | PageOfLitigationAuditLogDto | PageOfExpenseAuditLogDto = {};
  public classInput = 'input-sm icon';

  private orderOptions = [
    // customerId
    { text: this.translateService.instant('CUSTOMER.AUDIT_LOG.SORT_DATE_TIME_ASC'), value: '0_ASC' },
    { text: this.translateService.instant('CUSTOMER.AUDIT_LOG.SORT_DATE_TIME_DESC'), value: '0_DESC' },
  ];
  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  public sortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public sortingConfig: DropDownConfig = this.configDropdown;
  public sortingOptions: SimpleSelectOption[] = [...this.orderOptions];

  private subs = new SubSink();

  constructor(
    private userService: UserService,
    private auditLogService: AuditLogService,
    private translateService: TranslateService,
    private routerService: RouterService,
    private customerService: CustomerService,
    private taskService: TaskService,
    private lawsuitService: LawsuitService,
    private route: ActivatedRoute,
    private masterDataService: MasterDataService
  ) {}

  async ngOnInit(): Promise<void> {
    // set default value
    this.selectedUser.setValue(this.defaultUserDropdownItem[0].value);
    this.selectedAction.setValue(this.defaultActionDropdownItem[0].value);
    this.selectedObject.setValue(this.defaultObjectDropdownItem[0].value);
    this.selectedSortingExpense.setValue(this.defaultExpenseDropdownItem[0].value);
    this.filterConfig = { userId: 'ALL', action: 'ALL', objectType: 'ALL' };

    await this.getMasterDataFilters();

    this.subs.add(
      this.route.queryParams.subscribe(value => {
        this.expenseObjectId = value['financeId'];
      }),
      this.auditLogService.refreshLogType.subscribe(async value => {
        if (value !== null) {
          this.logType = value;
          this.classInput =
            this.logType === 'FINANCE_EXPENSE' ||
            this.logType === 'FINANCE_RECEIPT' ||
            this.logType === 'FINANCE_ADVANCE'
              ? 'input-sm icon no-border'
              : 'input-sm icon';
          await this.filterAuditLog();
          this.auditLogService.refreshLogType.next(null);
        }
      })
    );
  }

  getDetail(detail: string) {
    // TODO: will be refactor again
    return detail
      ? detail.replace(new RegExp('<b>', 'g'), '<span class="bold">').replace(new RegExp('</b>', 'g'), '</span>')
      : '-';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async getMasterDataFilters() {
    let res = await this.userService.inquiryUserOptions();
    let userDropDown: any = res.map(res => {
      return {
        text: `${res.userId}-${res.title}${res.name} ${res.surname}`,
        value: res.userId,
      };
    });
    this.dropDownUserFilterOption = userDropDown;
    if (this.routerService.currentRoute.includes(MAIN_ROUTES.CUSTOMER)) {
      this.dropDownActionFilterOption = AUDIT_CUSTOMER_ACTION_LOV;
      this.dropDownObjectFilterOption = AUDIT_CUSTOMER_OBJECT_LOV;
    } else if (this.routerService.currentRoute.includes(MAIN_ROUTES.LAWSUIT)) {
      this.dropDownActionFilterOption = this.routerService.currentRoute.includes(MAIN_ROUTES.CUSTOMER)
        ? AUDIT_CUSTOMER_ACTION_LOV
        : AUDIT_LAWSUIT_ACTION_LOV;
      this.dropDownObjectFilterOption = this.routerService.currentRoute.includes(MAIN_ROUTES.CUSTOMER)
        ? AUDIT_CUSTOMER_OBJECT_LOV
        : AUDIT_LAWSUIT_OBJECT_LOV;
    } else if (this.routerService.currentRoute.includes(MAIN_ROUTES.FINANCE)) {
      this.dropDownActionFilterOption = ((await this.masterDataService.expenseAction()).expenseAction || []).map(
        element => {
          return {
            text: element.name,
            value: element.value,
          } as SimpleSelectOption;
        }
      );
      this.dropDownObjectFilterOption = ((await this.masterDataService.expenseObject()).expenseObject || []).map(
        element => {
          return {
            text: element.name,
            value: element.value,
          } as SimpleSelectOption;
        }
      );
    } else {
      this.dropDownActionFilterOption = Array.from(
        [...AUDIT_CUSTOMER_ACTION_LOV, ...AUDIT_LAWSUIT_ACTION_LOV]
          .reduce((m, o) => m.set(o.text, o), new Map())
          .values()
      );
      this.dropDownObjectFilterOption = Array.from(
        [...AUDIT_CUSTOMER_OBJECT_LOV, ...AUDIT_LAWSUIT_OBJECT_LOV]
          .reduce((m, o) => m.set(o.text, o), new Map())
          .values()
      );
    }

    this.dropDownUserFilterOption = [...this.defaultUserDropdownItem, ...this.dropDownUserFilterOption];
    this.dropDownActionFilterOption = [...this.defaultActionDropdownItem, ...this.dropDownActionFilterOption];
    this.dropDownObjectFilterOption = [...this.defaultObjectDropdownItem, ...this.dropDownObjectFilterOption];
    this.dropDownExpenseFilterOption = [...this.defaultObjectDropdownItem, ...this.dropDownExpenseFilterOption];
  }

  async getAuditLog(currentPage = 1) {
    const pageConfig: Pageable = {
      pageNumber: currentPage,
      pageSize: this.pageSize,
    };
    if (
      this.logType === 'FINANCE_EXPENSE' ||
      this.logType === 'FINANCE_RECEIPT' ||
      this.logType === 'FINANCE_ADVANCE'
    ) {
      const indexObject = this.dropDownObjectFilterOption.findIndex(
        item => item.value === this.filterConfig.objectType
      );
      const indexAction = this.dropDownActionFilterOption.findIndex(item => item.value === this.filterConfig.action);
      const filterRequset: IExpenseFilter = {
        objectType:
          indexObject === 0
            ? this.dropDownObjectFilterOption[0].value.toString()
            : this.dropDownObjectFilterOption[indexObject].text || '',
        action:
          indexAction === 0
            ? this.dropDownActionFilterOption[0].value.toString()
            : this.dropDownActionFilterOption[indexAction].text || '',
        userId: this.filterConfig.userId,
      };
      const expenseObjectType =
        this.logType === 'FINANCE_EXPENSE'
          ? 'EXPENSE'
          : this.logType === 'FINANCE_RECEIPT'
            ? 'RECEIVE'
            : 'ADVANCE_RECEIVE';
      const res: PageOfExpenseAuditLogDto = await this.auditLogService.getExpenseAuditLog(
        this.expenseObjectId,
        expenseObjectType,
        filterRequset,
        pageConfig
      );
      this.detail = res;
    } else if (this.logType === 'LITIGATION') {
      this.litigationId =
        this.taskService.taskDetail?.litigationId || this.lawsuitService.currentLitigation?.litigationId || '';
      const res: PageOfLitigationAuditLogDto = await this.auditLogService.getLitigationAuditLog(
        this.litigationId,
        this.filterConfig,
        pageConfig
      );
      this.detail = res;
    } else {
      this.customerId =
        this.taskService.taskDetail?.customerId || this.customerService.customerDetail?.customerId || '';
      const res: PageOfCustomerAuditLogDto = await this.auditLogService.getCustomerAuditLog(
        this.customerId,
        this.filterConfig,
        pageConfig
      );
      this.detail = res;
    }

    if (this.detail) {
      this.customerAuditLogList = this.detail.content ? this.detail.content : [];
      const { resultConfig, actionConfig } = Utils.setPagination(
        this.detail.pageable,
        this.detail.numberOfElements,
        this.detail.totalPages,
        this.detail.totalElements
      );
      this.pageResultConfig = resultConfig;
      this.pageActionConfig = actionConfig;
    } else {
      this.customerAuditLogList = [];
    }
  }

  pageEvent(pageNumber: number) {
    this.getAuditLog(pageNumber);
  }

  async filterAuditLog() {
    this.filterConfig = {
      userId: this.selectedUser.value,
      action: this.selectedAction.value,
      objectType: this.selectedObject.value,
    };
    await this.getAuditLog();
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    // pending BE change default pageNumber to 1
    let pageConfigExpense: Pageable = {
      pageNumber: 0,
      pageSize: this.pageSize,
    };
    const expenseObjectType =
      this.logType === 'FINANCE_EXPENSE'
        ? 'EXPENSE'
        : this.logType === 'FINANCE_RECEIPT'
          ? 'RECEIVE'
          : 'ADVANCE_RECEIVE';
    const res: PageOfExpenseAuditLogDto = await this.auditLogService.getExpenseAuditLog(
      this.expenseObjectId,
      expenseObjectType,
      this.filterConfig,
      pageConfigExpense,
      'timestamp',
      _sortValue[1]
    );
    this.detail = res;

    if (this.detail) {
      this.customerAuditLogList = this.detail.content ? this.detail.content : [];
      const { resultConfig, actionConfig } = Utils.setPagination(
        this.detail.pageable,
        this.detail.numberOfElements,
        this.detail.totalPages,
        this.detail.totalElements
      );
      this.pageResultConfig = resultConfig;
      this.pageActionConfig = actionConfig;
    } else {
      this.customerAuditLogList = [];
    }
  }
}
