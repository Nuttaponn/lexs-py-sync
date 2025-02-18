import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@app/modules/customer/customer.service';
import { DefermentCategoryCode, PermissionExec } from '@app/modules/deferment/deferment.model';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  DefermentDto,
  DefermentExecItem,
  DefermentExecLitigationRedCaseDetailDto,
  DefermentInfo,
  DefermentItem,
  DefermentLitigationDebtInfo,
  DocumentDto,
  InquiryDefermentExecRequest,
  InquiryDefermentRequest,
  LitigationDetailDto,
  SaveDefermentExecRequest,
  SaveDefermentRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
@Component({
  selector: 'app-deferment-info',
  templateUrl: './deferment-info.component.html',
  styleUrls: ['./deferment-info.component.scss'],
})
export class DefermentInfoComponent implements OnInit, OnChanges {
  @Input() _btnAction!: string;
  @Input() defermentCategory!: DefermentCategoryCode;
  @Input() dataTable: Array<DefermentItem> = [];
  @Input() litigationId!: string;
  @Input() cusId!: string;
  @Input() hasCeased!: boolean;
  @Input() tabIndex!: number;
  @Input() initialDataTable: Array<DefermentItem> = [];
  @Input() dataForm!: UntypedFormGroup;
  @Output() detailView = new EventEmitter<DefermentItem>();
  public data!: DefermentDto;
  public defermentColumn: string[] = [
    'no',
    'defermentDate',
    'approveDate',
    'lgid',
    'defermentCancelDate',
    'defermentReason',
    'defermentDeadline',
    'defermentDuration',
    'document',
    'defermentBy',
    'status',
    'command',
  ];
  public defermentListColumn: string[] = [
    'no',
    'defermentDate',
    'approveDate',
    'lgid',
    'defermentCancelDate',
    'defermentReason',
    'defermentDeadline',
    'defermentDuration',
    'document',
    'defermentBy',
  ];
  public defermentHistoryColumn: string[] = [
    'no',
    'defermentDate',
    'approveDate',
    'lgid',
    'defermentCancelDate',
    'defermentReason',
    'defermentDeadline',
    'defermentDuration',
    'document',
    'defermentBy',
    'status',
  ];
  private configDropdown: DropDownConfig = {
    iconName: 'icon-Filter',
    searchPlaceHolder: '',
    labelPlaceHolder: 'COMMON.LABEL_LITIGATION_ID',
  };
  public lgidSortingCtrl: UntypedFormControl = new UntypedFormControl('');
  public lgidSortingConfig: DropDownConfig = this.configDropdown;
  public lgidSortingOptions!: SimpleSelectOption[];
  public litigationDetail: LitigationDetailDto = {};
  public defermentStatusEnum = DefermentItem.DefermentTaskStatusEnum;
  public defermentTypeMapper = new Map<string, string>([
    ['DEFERMENT_EXEC_SEIZURE', 'ยึดทรัพย์'],
    ['DEFERMENT_EXEC_SALE', 'ขายทอดตลาด'],
    ['DEFERMENT_EXEC_SEIZURE_SALE', 'ยึดทรัพย์-ขายทอดตลาด'],
  ]);
  public isExecution: boolean = false;
  public pExecution!: PermissionExec;
  constructor(
    private lawsuitService: LawsuitService,
    private routerService: RouterService,
    private notificationService: NotificationService,
    private defermentService: DefermentService,
    private documentService: DocumentService,
    private customerService: CustomerService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {
    this.route.queryParams.subscribe(value => {
      this.cusId = value['customerId'];
    });
  }

  async ngOnInit(): Promise<void> {
    this.pExecution = this.defermentService.hasPermissionExecution();

    await this.initData();
    this.initTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabIndex']) {
      this.lgidSortingCtrl.reset();
      if (this.isExecution) {
        this.mappingData(this.dataTable);
      }
    }
  }

  async initData() {
    this.isExecution = this.defermentCategory === 'EXECUTION';
    this.litigationDetail = this.lawsuitService.currentLitigation;
    // check cessation
    if (typeof this.hasCeased === 'string') this.hasCeased = this.hasCeased === 'true' ? true : false;
    let table: any[] = [];
    switch (this.tabIndex) {
      case 0:
        table =
          ((this.defermentService?.dashboard?.defermentPresents ||
            this.defermentService?.deferment?.defermentPresents) as Array<DefermentItem>) || [];
        break;
      case 1:
        table =
          ((this.defermentService?.dashboard?.defermentApproves ||
            this.defermentService?.deferment?.defermentApproves) as Array<DefermentItem>) || [];
        break;
      case 2:
        table =
          ((this.defermentService?.dashboard?.defermentHistories ||
            this.defermentService?.deferment?.defermentHistories) as Array<DefermentItem>) || [];
        break;
      default:
        break;
    }
    this.dataTable = this.defermentCategory === 'EXECUTION' ? this.mappingData(table) : table;
    this.initialDataTable = JSON.parse(JSON.stringify(this.dataTable)) as DefermentItem[];
    const customerId =
      this.lawsuitService.currentLitigation.customerId ||
      this.customerService.customerDetail.customerId ||
      this.defermentService.deferment.deferment?.customerId ||
      '';
    if (!this.isExecution) {
      try {
        this.lgidSortingOptions = (await this.defermentService.getLitigationIdByCustomerId(customerId || '')).map(
          lgid => {
            return {
              text: lgid,
              value: lgid,
            };
          }
        );
      } catch (e) {}
    }
    if (this.isExecution) {
      try {
        this.lgidSortingOptions = (await this.defermentService.getLitigationIdByCustomerIdExec(customerId || '')).map(
          lgid => {
            return {
              text: lgid,
              value: lgid,
            };
          }
        );
      } catch (e) {}
    }
    console.log('lgidSortingOptions :: ', this.lgidSortingOptions);
  }

  mappingData(dataTable: any) {
    return dataTable.map((f: any) => {
      f.litigationRedCaseI = f.litigationRedCaseDetail.map((m: any, i: number) => {
        return {
          title: i == 0 ? 'เลขที่กฎหมาย - คดีหมายเลขแดงศาลชั้นต้น' : '',
          content: m.lgRedCaseDisplay,
        };
      });
      return f;
    });
  }
  filterByLGID() {
    const lgIdFilter = [this.lgidSortingCtrl.value];
    if (this.initialDataTable && lgIdFilter && !this.isExecution) {
      this.dataTable = this.initialDataTable.filter(e => {
        return (
          e.defermentLitigationDebtInfos &&
          e.defermentLitigationDebtInfos.some(el => lgIdFilter.includes(el.litigationId!))
        );
      });
    }
    if (this.initialDataTable && lgIdFilter && this.isExecution) {
      this.dataTable = this.initialDataTable.filter((e: DefermentExecItem) => {
        return (
          e?.litigationRedCaseDetail &&
          e?.litigationRedCaseDetail.some((el: DefermentExecLitigationRedCaseDetailDto) =>
            lgIdFilter.includes(el.litigationId!)
          )
        );
      });
    }
  }

  initTable() {
    if (this.defermentCategory === 'EXECUTION') {
      this.defermentColumn = [
        'no',
        'defermentDate',
        'defermentDeadline',
        'approveDate',
        'defermentDuration',
        'type',
        'lgCount',
        'defermentCancelDate',
        'defermentReason',
        'document',
        'defermentBy',
        'status',
        'command',
      ];
      this.defermentListColumn = [
        'no',
        'defermentDate',
        'defermentDeadline',
        'approveDate',
        'defermentDuration',
        'type',
        'lgCount',
        'defermentCancelDate',
        'defermentReason',
        'document',
        'defermentBy',
      ];
      this.defermentHistoryColumn = [
        'no',
        'defermentDate',
        'defermentDeadline',
        'approveDate',
        'defermentDuration',
        'type',
        'lgCount',
        'defermentCancelDate',
        'defermentReason',
        'document',
        'defermentBy',
        'status',
      ];
    } else if (this._btnAction === 'CESSATION') {
      this.defermentColumn = [
        'no',
        'defermentDate',
        'approveDate',
        'lgid',
        'defermentCancelDate',
        'defermentReason',
        'document',
        'defermentBy',
        'status',
        'command',
      ];
      this.defermentListColumn = [
        'no',
        'defermentDate',
        'approveDate',
        'lgid',
        'defermentCancelDate',
        'defermentReason',
        'document',
        'defermentBy',
      ];
      this.defermentHistoryColumn = [
        'no',
        'defermentDate',
        'approveDate',
        'lgid',
        'defermentCancelDate',
        'defermentReason',
        'document',
        'defermentBy',
        'status',
      ];
    }
  }

  getLowestLGID(lgidList: Array<DefermentLitigationDebtInfo>) {
    const lgidListAsNumber = lgidList.map(element => {
      return Number(element.litigationId?.slice(2));
    });
    return lgidList.find(
      e =>
        e.litigationId?.slice(-3) ===
        Math.min(...lgidListAsNumber)
          .toString()
          .slice(-3)
    )?.litigationId;
  }

  getOtherLGID(lgidList: Array<DefermentLitigationDebtInfo>): string[] {
    const lowestLGID = this.getLowestLGID(lgidList);
    return lgidList.filter(e => e.litigationId !== lowestLGID).map(e => e.litigationId) as string[];
  }

  gotoDefermentMain() {
    const defermentExecInfo = this.litigationDetail?.defermentExecInfo || ('DEFERMENT_EXEC_SEIZURE' as any);
    if (this.defermentCategory === 'EXECUTION' && this._btnAction === 'CESSATION') {
      if (
        this.litigationDetail.defermentStatus === 'DEFERMENT' &&
        defermentExecInfo &&
        ['DEFERMENT_EXEC_SEIZURE_SALE', 'DEFERMENT_EXEC_SEIZURE', 'DEFERMENT_EXEC_SALE'].includes(
          defermentExecInfo?.defermentType || ''
        )
      ) {
        this.notificationService.alertDialog('ไม่สามารถยุติดำเนินคดีได้', 'เลขที่กฏหมายอยู่ระหว่างดำเนินการบังคับคดี');
      }
    } else {
      this.routerService.navigateTo(`/main/lawsuit/deferment/defer/main`, {
        _btnAction: this._btnAction,
        litigationId: this.litigationId || '',
        hasCeased: this.hasCeased,
        defermentCategory: this.defermentCategory,
        defermentType: this.defermentCategory === 'EXECUTION' ? defermentExecInfo?.defermentType : '',
        hasDetail: false,
        flagdeferment: true,
        modeFromBtn: 'ADD',
        state: 'INITIAL',
      });
    }
  }

  async toDeleteRecord(element: DefermentItem) {
    const isContinue = await this.notificationService.warningDialog(
      'ยืนยันลบรายการนำเสนอ',
      'รายการนำเสนอจะถูกลบจากระบบ คุณต้องการที่จะลบรายการนี้หรือไม่?',
      'ยืนยันลบรายการ',
      'icon-Bin',
      'long-button mat-warn'
    );
    if (this.defermentCategory === 'EXECUTION') {
      if (isContinue) {
        let request: SaveDefermentExecRequest = {
          customerId: element.customerId || '',
          defermentExecItem: element,
          headerFlag: SaveDefermentRequest.HeaderFlagEnum.Delete,
          taskId: element.taskId,
          litigationId: this.litigationId || '',
        };
        await this.defermentService.saveCustomerDefermentExec(request);
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
            'TASK.REJECT_DIALOG.DELETE_DEFERMENT_LIST_SUCCESS'
          )}`
        );
        this.fetchData();
      }
    } else {
      if (isContinue) {
        let request: SaveDefermentRequest = {
          customerId: element.customerId || '',
          defermentItem: element,
          defermentType: this.hasCeased
            ? SaveDefermentRequest.DefermentTypeEnum.Cessation
            : SaveDefermentRequest.DefermentTypeEnum.Deferment,
          headerFlag: SaveDefermentRequest.HeaderFlagEnum.Delete,
          taskId: element.taskId,
        };
        await this.defermentService.saveCustomerDeferment(request);
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
            'TASK.REJECT_DIALOG.DELETE_DEFERMENT_LIST_SUCCESS'
          )}`
        );
        this.fetchData();
      }
    }
  }

  toEditRecord(element: DefermentItem) {
    this.routerService.navigateTo(`/main/lawsuit/deferment/defer/main`, {
      flagEdit: true,
      flagdeferment: true,
      btnAction: this._btnAction,
      litigationId: this.litigationId || element.defermentLitigationDebtInfos![0].litigationId || '',
      hasCeased: this.hasCeased,
      modeFromBtn: 'EDIT',
      defermentId: element.defermentId,
      customerId: element.customerId,
      defermentCategory: this.defermentCategory,
      taskId: element.taskId,
      actionFlag: element.actionFlag,
      defermentType: element?.defermentType || '',
      state: 'MAIN',
    });
  }

  getTotalDefermentDays(array: Array<DefermentItem>) {
    if (array) {
      const total = array.reduce((accumulator, element) => {
        return accumulator + (element.defermentDays || 0);
      }, 0);

      return total;
    } else return 0;
  }

  async openDoc(ele: DocumentDto) {
    let res = await this.documentService.getDocument(ele.imageId || '', ele.documentTemplate?.searchType);
    if (res) {
      this.documentService.openPdf(res, ele.documentTemplate?.documentName);
    }
  }

  async goToDefermentDetail(item: DefermentItem, actionFlag: boolean, isDetailView: boolean) {
    if (actionFlag !== true || isDetailView === true) {
      if (isDetailView) {
        if (this.dataForm?.dirty) {
          const _confirm = await this.sessionService.confirmExitWithoutSave();
          if (!_confirm) return;
        }
        this.detailView.emit(item);
      }
      const params = {
        hasCeased: this.hasCeased,
        btnAction: item.defermentType as SaveDefermentRequest.DefermentTypeEnum,
        litigationId: this.litigationId,
        modeFromBtn: InquiryDefermentRequest.ModeEnum.View,
        defermentCategory: this.defermentCategory,
        defermentId: item.defermentId,
        defermentType: this.defermentCategory === 'EXECUTION' ? item?.defermentType : '',
        isDetailView: isDetailView,
        hasDetail: true,
        state: 'MAIN',
        isViewOnly: this.tabIndex === 1 || this.tabIndex === 2 ? true : false,
      };
      this.routerService.navigateTo('/main/lawsuit/deferment/defer/main', {
        ...params,
      });
      return;
    }
    switch (item.defermentTaskStatus) {
      case DefermentItem.DefermentTaskStatusEnum.Draft:
      case DefermentItem.DefermentTaskStatusEnum.WaitingApproveCessation:
      case DefermentItem.DefermentTaskStatusEnum.WaitingApproveDeferment:
      case DefermentItem.DefermentTaskStatusEnum.WaitingApproveDefermentExec:
      case DefermentItem.DefermentTaskStatusEnum.Revise:
        if (item.actionFlag) {
          this.toEditRecord(item);
        } else {
          this.routerService.navigateTo('/main/lawsuit/deferment/defer/main', {
            hasCeased: this.hasCeased,
            btnAction: item.defermentType as SaveDefermentRequest.DefermentTypeEnum,
            litigationId: this.litigationId,
            modeFromBtn: InquiryDefermentRequest.ModeEnum.View,
            defermentCategory: this.defermentCategory,
            defermentId: item.defermentId,
            state: 'MAIN',
          });
        }
        break;
      default:
        this.routerService.navigateTo('/main/lawsuit/deferment/defer/main', {
          hasCeased: this.hasCeased,
          btnAction: item.defermentType as SaveDefermentRequest.DefermentTypeEnum,
          litigationId: this.litigationId,
          modeFromBtn: InquiryDefermentRequest.ModeEnum.View,
          defermentCategory: this.defermentCategory,
          defermentId: item.defermentId,
          state: 'MAIN',
        });
        break;
    }
  }

  async fetchData() {
    const customerId =
      this.lawsuitService.currentLitigation.customerId ||
      this.customerService.customerDetail.customerId ||
      this.defermentService.deferment.deferment?.customerId ||
      '';
    if (this.defermentCategory === 'EXECUTION') {
      let query: InquiryDefermentExecRequest = {
        customerId: customerId || '',
        defermentId: '',
        defermentType: this.hasCeased
          ? DefermentInfo.DefermentTypeEnum.Cessation
          : DefermentInfo.DefermentTypeEnum.Deferment,
        litigationId: this.litigationId,
        mode: 'DASHBOARD',
      };
      this.data = await this.defermentService.inquiryDefermentExec(query);
      this.defermentService.dashboard = this.data;
      this.dataTable = this.defermentService.dashboard.defermentPresents as Array<DefermentItem>;
    } else {
      this.data = await this.defermentService.inquiryDeferment(
        customerId || '',
        '',
        this.hasCeased ? DefermentInfo.DefermentTypeEnum.Cessation : DefermentInfo.DefermentTypeEnum.Deferment,
        this.litigationId as string,
        'DASHBOARD'
      );
      this.defermentService.dashboard = this.data;
      this.dataTable = this.defermentService.dashboard.defermentPresents as Array<DefermentItem>;
    }
  }
}
