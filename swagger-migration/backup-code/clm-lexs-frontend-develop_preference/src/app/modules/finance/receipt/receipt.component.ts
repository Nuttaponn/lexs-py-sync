import { AfterViewChecked, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  ReceiptKcorpSearchConditionRequest,
  ReceiptSearchConditionRequest,
} from '@app/shared/components/search-controller/search-controller.model';
import { SearchControllerService } from '@app/shared/components/search-controller/search-controller.service';
import { FINANCE_RECEIPT_ROUTES } from '@app/shared/constant';
import { TMode, taskCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { ActionOnScreen, SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import { MeLexsUserDto, NameValuePair, PageOfReceiveDto, ReceiveDto, ReceiveKcorpDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { first } from 'rxjs/operators';
import { ReceiptService } from '../services/receipt.service';

interface ReceiveDtoMeta extends ReceiveDto {
  isCollapseBranch?: boolean;
}

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit, AfterViewChecked {
  @ViewChildren(MatTable) table!: QueryList<any>;

  /** Permission */
  public accessPermissions = this.sessionService.accessPermissions();
  public actionOnScreen: ActionOnScreen = {
    canAdd: this.accessPermissions.mode.includes('ADD'),
    canEdit: this.accessPermissions.mode.includes('EDIT'),
    canDelete: this.accessPermissions.mode.includes('DELETE'),
  };

  //  Common
  public trackBy = (_index: number, item: ReceiveDtoMeta) => {
    return `${_index}-${item.taskId}`;
  };
  private tasks: PageOfReceiveDto = {};
  private orderOptions = [
    { text: this.translate.instant('FINANCE.ORDER_BY_RECEIPT_CREATE_DATE_ASC'), value: '0_ASC' },
    { text: this.translate.instant('FINANCE.ORDER_BY_RECEIPT_CREATE_DATE_DESC'), value: '0_DESC' },
  ];
  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  public tabIndex = 0;
  private currentSortBy: string[] = ['receiveNo'];
  private sortByOptions: string[] = ['receiveNo'];
  private currentSortByKcorp: string[] = ['transferDate'];
  private sortByOptionsKcorp: string[] = ['transferDate'];
  private currentSortOrder: string = 'DESC';
  private receiptStatusFilter = ['CANCEL_RECORD', 'COMPLETED_SYSTEM', 'COMPLETED'];
  private receiptStatusOptionsClosed = [
    ...this.searchControllerService.receiptStatusOptions.filter(i => i.value && i.value === 'N/A'),
    ...this.searchControllerService.receiptStatusOptions.filter(
      i => i.value && this.receiptStatusFilter.includes(i.value)
    ),
  ];
  private receiptStatusOptionsNormal = this.searchControllerService.receiptStatusOptions.filter(
    i => i.value && !this.receiptStatusFilter.includes(i.value)
  );
  public receiptStatusOptions = this.receiptStatusOptionsNormal;
  public receiptNoOptions: NameValuePair[] = this.receiptService.receiptNoOptions;

  // myTask tab
  public isMyTask: boolean = false;
  public myTaskSearch: ReceiptSearchConditionRequest = {};
  public myTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public myTaskSortingConfig: DropDownConfig = this.configDropdown;
  public myTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public myTaskPageResultConfig!: PaginatorResultConfig;
  public myTaskPageActionConfig!: PaginatorActionConfig;
  private myCrrentPage: number = 0;
  public myTaskData: ReceiveDtoMeta[] = [];

  // Org task  tab
  public isOrgTask: boolean = false;
  public orgTaskSearch: ReceiptSearchConditionRequest = {};
  public orgTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public orgTaskSortingConfig: DropDownConfig = this.configDropdown;
  public orgTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public orgTaskPageResultConfig!: PaginatorResultConfig;
  public orgTaskPageActionConfig!: PaginatorActionConfig;
  private orgCrrentPage: number = 0;
  public orgTaskData: ReceiveDtoMeta[] = [];

  // org task tab
  public isKcorpTask: boolean = false;
  public kcorpTaskSearch: ReceiptSearchConditionRequest = {};
  public kcorpTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public kcorpTaskSortingConfig: DropDownConfig = this.configDropdown;
  public kcorpTaskSortingOptions: SimpleSelectOption[] = [
    { text: this.translate.instant('FINANCE.ORDER_BY_TRANSFER_DATE_ASC'), value: '0_ASC' },
    { text: this.translate.instant('FINANCE.ORDER_BY_TRANSFER_DATE_DESC'), value: '0_DESC' },
  ];
  public kcorpTaskPageResultConfig!: PaginatorResultConfig;
  public kcorpTaskPageActionConfig!: PaginatorActionConfig;
  private kcorpCrrentPage: number = 0;
  public kcorpTaskData: ReceiveKcorpDto[] = [];

  /** Closed Task tab */
  public isClosedTask: boolean = false;
  public closedTaskSearch: ReceiptSearchConditionRequest = {};
  public closedTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public closedTaskSortingConfig: DropDownConfig = this.configDropdown;
  public closedTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public closedTaskPageActionConfig!: PaginatorActionConfig;
  public closedTaskPageResultConfig!: PaginatorResultConfig;
  private closedCrrentPage: number = 0;
  public closedTaskData: ReceiveDtoMeta[] = [];

  public auditTabLabel: string = '';

  public reload = false;

  // display
  private closedDisplayedColumns: string[] = [
    'no',
    'receiptNo',
    'createDate',
    'payer',
    'branch',
    'paymentMethod',
    'amount',
    'refund',
    'daysSla',
    'responseUnit',
    'receiptStatus',
    'creditNote',
    'command',
    'auditLog',
  ];
  private normalDisplayedColumns: string[] = [
    'no',
    'receiptNo',
    'createDate',
    'payer',
    'branch',
    'paymentMethod',
    'amount',
    'refund',
    'daysSla',
    'responseUnit',
    'receiptStatus',
    'command',
    'auditLog',
  ];
  public kcorpDisplayedColumns: string[] = [
    'transferDate',
    'washAccount',
    'responseUnit',
    'totalTransferAmount',
    'totalTasks',
    'status',
    'detail',
  ];
  public displayedColumns: string[] = this.normalDisplayedColumns;
  private currentUser: MeLexsUserDto = {};
  public userId!: string;
  public hasCreate: boolean = false;

  constructor(
    private translate: TranslateService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private receiptService: ReceiptService,
    private searchControllerService: SearchControllerService
  ) {
    this.receiptService.receiptLandingTab.pipe(first()).subscribe(value => {
      if (value !== 0) {
        this.tabIndex = value;
      } else {
        this.tabIndex = 0;
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
    this.userId = this.currentUser?.userId || '';
    this.receiptService.currentTabIndex = this.tabIndex;
    // reload data
    this.reload = true;
    const requestTab = this.getSearchResultByTab(this.tabIndex);
    await this.inquiryTask(requestTab, false, true);
    this.reload = false;
    this.hasCreate =
      this.accessPermissions.permissions.includes(PCode.FINANCE_RECEIPT_CREATE_RECEIPT) &&
      this.currentUser.roleCode === 'FINANCIAL3' &&
      this.currentUser.subRoleCode !== 'APPROVER';
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  async onTabChanged(event: MatTabChangeEvent) {
    if (this.tabIndex === Number(event.tab.textLabel)) return;
    this.tabIndex = Number(event.tab.textLabel);
    this.receiptService.currentTabIndex = this.tabIndex;
    this.receiptStatusOptions = this.tabIndex === 3 ? this.receiptStatusOptionsClosed : this.receiptStatusOptionsNormal;
    this.tabIndex !== 2 && (await this.fetchReceiptOptions());
    await this.inquiryTask({ page: this.getCurrentPageTab(this.tabIndex) });
  }

  async fetchReceiptOptions() {
    let tab = this.receiptService.getReceiptOptionTab(this.tabIndex);
    const resopone = await this.receiptService.getReceiveNoList(tab);
    this.receiptService.receiptNoOptions =
      resopone.receiveNo?.map(item => {
        return { name: item, value: item } as NameValuePair;
      }) || [];
    this.receiptNoOptions = this.receiptService.receiptNoOptions;
  }

  getCurrentPageTab(tabIndex: number) {
    switch (tabIndex) {
      case 0:
        return this.myCrrentPage;
      case 1:
        return this.orgCrrentPage;
      case 2:
        return this.kcorpCrrentPage;
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
    if (this.tabIndex === 2 /* Kcorp */) {
      this.currentSortByKcorp[0] = this.sortByOptionsKcorp[_sortValue[0]];
      this.currentSortOrder = _sortValue[1];
    } else {
      this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
      this.currentSortOrder = _sortValue[1];
    }
    const request = this.getSearchResultByTab(this.tabIndex) as ReceiptSearchConditionRequest;
    await this.inquiryTask(request);
  }

  setPageInquiry() {
    return {
      size: 10,
      sortBy: this.tabIndex === 2 ? this.currentSortByKcorp : this.currentSortBy,
      sortOrder: this.currentSortOrder,
    } as ReceiptSearchConditionRequest;
  }

  async inquiryTask(
    request: ReceiptSearchConditionRequest | ReceiptKcorpSearchConditionRequest,
    isDownload: boolean = false,
    isInitial: boolean = false
  ) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = !isInitial ? this.getSearchResultByTab(this.tabIndex) : request;
    request = { ...request, ...resultTabs };
    if (isDownload) {
      const date = new Date();
      const dateFormat =
        date.getFullYear() +
        '' +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '' +
        date.getDate().toString().padStart(2, '0');
      if (this.tabIndex === 2) {
        await this.receiptService.inquiryReceiveKcorpDownload(
          request as ReceiptKcorpSearchConditionRequest,
          this.translate.instant(`FINANCE.RECEIPT_DONWLOAD_FILE_TAB_2`, { DATE_TIME: dateFormat }) + '.xls'
        );
      } else if (this.tabIndex === 3) {
        await this.receiptService.inquiryReceiveDownloadClosedTab(
          request,
          this.translate.instant(`FINANCE.RECEIPT_DONWLOAD_FILE_TAB_${this.tabIndex}`, { DATE_TIME: dateFormat }) +
            '.xls'
        );
      } else {
        await this.receiptService.inquiryReceiveDownload(
          request,
          this.translate.instant(`FINANCE.RECEIPT_DONWLOAD_FILE_TAB_${this.tabIndex}`, { DATE_TIME: dateFormat }) +
            '.xls'
        );
      }
    } else {
      if (this.tabIndex === 2) {
        this.tasks = await this.receiptService.inquiryReceiveKcorp(request as ReceiptKcorpSearchConditionRequest);
      } else {
        this.tasks = await this.receiptService.inquiryReceive(request);
      }
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

  // // Navigation
  onStartTask(element: ReceiveDto, isViewDetail?: boolean) {
    this.routerService.navigateTo('/main/finance/receipt/detail', {
      receiveNo: element.receiveNo || '',
      taskId: element.taskId,
      taskCode: element.taskCode as taskCode,
      currentAssigneeId: element.currentAssigneeId,
      statusCode: element.statusCode,
      receiptStatus: element.receiveStatus,
      receiveType: element.receiveType,
      payer: element.payer,
      mode: isViewDetail && 'VIEW',
    });
  }

  getSearchResultByTab(tabIndex: number): ReceiptSearchConditionRequest {
    switch (tabIndex) {
      case 0:
        this.myTaskSearch.tab = 'USER';
        this.myTaskSearch.sortBy = this.currentSortBy;
        this.myTaskSearch.sortOrder = this.currentSortOrder;
        return this.myTaskSearch;
      case 1:
        this.orgTaskSearch.tab = 'ORG';
        this.orgTaskSearch.sortBy = this.currentSortBy;
        this.orgTaskSearch.sortOrder = this.currentSortOrder;
        return this.orgTaskSearch;
      case 2:
        this.kcorpTaskSearch.sortBy = this.currentSortByKcorp;
        this.kcorpTaskSearch.sortOrder = this.currentSortOrder;
        return this.kcorpTaskSearch;
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
        this.orgCrrentPage = event - 1;
        break;
      case 2:
        this.kcorpCrrentPage = event - 1;
        break;
      case 3:
        this.closedCrrentPage = event - 1;
        break;
      default:
        this.myCrrentPage = event - 1;
        break;
    }
    let request = this.getSearchResultByTab(this.tabIndex) as ReceiptSearchConditionRequest;
    request.page = event - 1;
    await this.inquiryTask(request);
  }

  setPaginationContentByTab(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: ReceiveDto[]
  ) {
    switch (this.tabIndex) {
      case 1:
        this.displayedColumns = this.normalDisplayedColumns;
        this.orgTaskData = (content || []).map((item: ReceiveDtoMeta) => {
          if (item.receiverBranch?.length && item.receiverBranch.length > 2) {
            item.isCollapseBranch = true;
          } else {
            item.isCollapseBranch = false;
          }
          return item;
        });
        this.orgTaskPageResultConfig = resultConfig;
        this.orgTaskPageActionConfig = actionConfig;
        break;
      case 2:
        this.kcorpTaskData = content || [];
        this.kcorpTaskPageResultConfig = resultConfig;
        this.kcorpTaskPageActionConfig = actionConfig;
        break;
      case 3:
        this.displayedColumns = this.closedDisplayedColumns;
        this.closedTaskData = (content || []).map((item: ReceiveDtoMeta) => {
          if (item.receiverBranch?.length && item.receiverBranch.length > 2) {
            item.isCollapseBranch = true;
          } else {
            item.isCollapseBranch = false;
          }
          return item;
        });
        this.closedTaskPageResultConfig = resultConfig;
        this.closedTaskPageActionConfig = actionConfig;
        break;
      default:
        this.displayedColumns = this.normalDisplayedColumns;
        this.myTaskData = (content || []).map((item: ReceiveDtoMeta) => {
          if (item.receiverBranch?.length && item.receiverBranch.length > 2) {
            item.isCollapseBranch = true;
          } else {
            item.isCollapseBranch = false;
          }
          return item;
        });
        this.myTaskPageResultConfig = resultConfig;
        this.myTaskPageActionConfig = actionConfig;
        break;
    }
  }

  async onSearchResult(event: ReceiptSearchConditionRequest, tabIndex: number) {
    switch (tabIndex) {
      case 0:
        this.myTaskSearch = { ...event };
        await this.inquiryTask(this.myTaskSearch);
        break;
      case 1:
        this.orgTaskSearch = { ...event };
        await this.inquiryTask(this.orgTaskSearch);
        break;
      case 2:
        this.kcorpTaskSearch = { ...event };
        await this.inquiryTask(this.kcorpTaskSearch);
        break;
      case 3:
        this.closedTaskSearch = { ...event };
        await this.inquiryTask(this.closedTaskSearch);
        break;
    }
  }

  onExpand(index: number) {
    switch (this.tabIndex) {
      case 0:
        this.myTaskData[index].isCollapseBranch = !this.myTaskData[index].isCollapseBranch;
        break;
      case 1:
        this.orgTaskData[index].isCollapseBranch = !this.orgTaskData[index].isCollapseBranch;
        break;
      case 3:
        this.closedTaskData[index].isCollapseBranch = !this.closedTaskData[index].isCollapseBranch;
        break;
      default:
        break;
    }
  }

  createReceiptTask() {
    this.routerService.navigateTo(FINANCE_RECEIPT_ROUTES.DETAIL, { mode: TMode.ADD });
  }

  async downloadCreditNote(element: ReceiveDtoMeta) {
    await this.receiptService.downloadCreditNoteAll(element.receiveNo || '');
  }

  goToAuditLog(element: ReceiveDtoMeta) {
    this.routerService.navigateTo('/main/finance/receipt/audit-log', {
      financeMode: 'RECEIPT',
      financeId: element.receiveNo,
      statusName: element.receiveStatusName,
      status: element.receiveStatus,
    });
  }

  goToRefund(washAccountNo: any, createdDate: string) {
    this.routerService.navigateTo(FINANCE_RECEIPT_ROUTES.KCORP_DETAIL, {
      kcorpView: 'KCORP_DETAIL',
      washAccountNo,
      createdDate,
    });
  }
}
