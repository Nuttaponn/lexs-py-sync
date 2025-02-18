import { Component, Input, OnInit } from '@angular/core';
import { SuitService } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import {
  Mode,
  TMode,
  TaskCodeAppeal,
  TaskCodeDecree,
  TaskCodeMemorandumCourt,
  TaskCodePaymentExecutionFee,
  TaskCodeSupreme,
  TaskCodeUploadExecutionReceipt,
  statusCode,
  taskCode,
} from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  CourtDecreeDto,
  CourtDecreePersonDto,
  CourtResultDto,
  CourtVerdictDto,
  DefendantDto,
  DisputeAppealDto,
  ExecutionFeeDto,
  ExtendAppealDto,
  LitigationCaseGroupDto,
  TaskDetailDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { CourtService } from '../court.service';
import { ExecutionFeeDialogComponent } from '../execution-fee-dialog/execution-fee-dialog.component';
import { ExtendDialogComponent } from '../extend-dialog/extend-dialog.component';
import { DisplayCourtResult, LitigationCaseDownloadMap } from '../interface';

@Component({
  selector: 'app-court-verdict-detail',
  templateUrl: './court-verdict-detail.component.html',
  styleUrls: ['./court-verdict-detail.component.scss'],
})
export class CourtVerdictDetailComponent implements OnInit {
  @Input() courtResults!: DisplayCourtResult[];

  public appealTasks: taskCode[] = TaskCodeAppeal;
  public supremeTasks: taskCode[] = TaskCodeSupreme;
  public decreeTasks: taskCode[] = TaskCodeDecree;
  public paymentExecutionFee: taskCode[] = TaskCodePaymentExecutionFee;
  public uploadExecutionReceiptTasks: taskCode[] = TaskCodeUploadExecutionReceipt;
  @Input() litigationCaseDownloadMap: LitigationCaseDownloadMap = {};

  tabIndex: number = 0;
  isOpenedList: Array<boolean> = [];
  groupByCaseList: Array<LitigationCaseGroupDto> = [];

  actionOnScreen: any = {
    firstButton: true,
    secondButton: false,
  };

  textOnScreen: any = {
    titleTable: 'COURT.VERDICT_LIST',
    firstButtonText: 'COURT.EXTEND_APPEAL_PERIOD',
    secondButtonText: 'COURT.RECORD_COURT_FEE',
  };

  public verdictColumns: string[] = [
    'no',
    'caseNo',
    'courtName',
    'courtVerdictType',
    'courtVerdict',
    'courtVerdictDate',
    'firstVerdict',
    'lastVerdict',
    'status',
    'action',
  ];

  public decreeActionColumns: string[] = [
    'no',
    'requestDecreeDate',
    'defendantName',
    'sendStatus',
    'sendType',
    'acceptDecreeDate',
    'decreeDueDate',
    'saveStatus',
    'action',
  ];
  public decreeNoActionColumns: string[] = [
    'no',
    'requestDecreeDate',
    'defendantName',
    'sendStatus',
    'sendType',
    'acceptDecreeDate',
    'decreeDueDate',
    'saveStatus',
  ];
  public decreeColumns: string[] = [];

  sendStatusMap: { [key: string]: string } = {
    SEND: 'ส่งได้',
    NOT_SEND: 'ส่งไม่ได้',
  };
  sendTypeMap: { [key: string]: string } = {
    CLOSE: 'ปิดหมาย',
    SIGN: 'รับหมาย',
    ANNOUNCE: 'ประกาศทางสื่ออิเล็กทรอนิกส์สารสนเทศ',
    OTHER: 'อื่นๆ',
  };
  ignoreExtendBtn = [
    'PAY_EXECUTION_FEE_FIRST_INSTANCE',
    'PAY_EXECUTION_FEE_APPEAL',
    'PAY_EXECUTION_FEE_SUPREME',
    'DECREE_OF_FIRST_INSTANCE',
    'DECREE_OF_APPEAL',
    'DECREE_OF_SUPREME_COURT',
  ];

  public taskDetail!: TaskDetailDto;
  public taskCode!: taskCode;
  public statusCode!: statusCode;
  public litigationCaseId: number = 0;
  MODE = Mode;
  public isTaskOwner!: boolean;

  constructor(
    private routerService: RouterService,
    private translate: TranslateService,
    private taskService: TaskService,
    private courtService: CourtService,
    private lawsuitService: LawsuitService,
    private suitService: SuitService,
    private sessionService: SessionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.taskDetail = this.taskService.taskDetail;
    this.litigationCaseId = parseInt(this.taskService.taskDetail.litigationCaseId || '0');
    this.taskCode = (this.taskDetail.taskCode as taskCode) || '';
    this.statusCode = this.taskDetail.statusCode as statusCode;
    this.isTaskOwner = this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskDetail.enableTaskSupportRole
    );
    this.initCourtList();
    if (!this.taskCode || this.statusCode === 'FINISHED') {
      // not coming from task page
      this.decreeColumns = this.decreeNoActionColumns;
    } else {
      // from task page
      this.decreeColumns =
        this.taskDetail?.statusCode === 'PENDING_APPROVAL' ? this.decreeNoActionColumns : this.decreeActionColumns;
    }

    this.courtService.courtResultSubject.subscribe(event => {
      this.courtResults = event || [];
      this.initCourtList();
    });
  }

  getDisplayColumn(_court: DisplayCourtResult) {
    if (!this.taskCode || this.statusCode === 'FINISHED') {
      // not coming from task page
      let result =
        this.isKlawMakerApprover && _court.courtVerdicts?.some(i => i.testimonyStatus === 'FINISHED')
          ? this.verdictColumns
          : this.verdictColumns.slice(0, 9);
      return this.isTaskOwner ? result : result.filter(i => i !== 'action');
    } else {
      // from task page
      if (!TaskCodeMemorandumCourt.includes(this.taskCode)) {
        let result =
          this.isKlawMakerApprover && _court.courtVerdicts?.some(i => i.testimonyStatus === 'FINISHED')
            ? this.verdictColumns
            : this.verdictColumns.slice(0, 9);
        return this.isTaskOwner ? result : result.filter(i => i !== 'action');
      } else {
        return this.isTaskOwner ? this.verdictColumns : this.verdictColumns.filter(i => i !== 'action');
      }
    }
  }

  get isKlawMakerApprover() {
    const _currentUser = this.sessionService.currentUser;
    return (
      (_currentUser?.subRoleCode === 'MAKER' && _currentUser?.category === 'KLAW') ||
      (_currentUser?.subRoleCode === 'APPROVER' && _currentUser?.category === 'KLAW')
    );
  }

  get textButtonAction(){
    const isKlawUser = ['KLAW'].includes(this.sessionService.currentUser?.category || '');
    if(isKlawUser){
      return `${this.translate.instant('COMMON.BUTTON_SAVE')}`
    }else{
      return `${this.translate.instant('COMMON.BUTTON_ACKNOWLEDGE')}`
    }
  }

  // Data Initialization
  initCourtList() {
    this.isOpenedList = new Array(this.courtResults.length ?? 0).fill(true);
    this.initVisibility();
  }

  // Component Visibility
  initVisibility() {
    if (!this.taskService.taskDetail.id) {
      // not coming from the task page
      // dispute
      this.courtResults.forEach(result => {
        result.showDispute = this.courtService.isDisputeVisible(
          this.sessionService.currentUser!,
          this.lawsuitService.currentLitigation,
          result
        );
        result.notDecree = result.courtDecrees?.every(d => d.decreeUpdateStatus === 'NOT_DECREE');
      });
    }
  }

  getCommaSeparatedDefendantNames(defendants: DefendantDto[]) {
    const defendantNames = defendants.map(def => (def.title || '') + def.firstName + ' ' + def.lastName);
    return defendantNames.join(', ');
  }

  // Actions
  toggleExpand(index: number) {
    this.isOpenedList[index] = !this.isOpenedList[index];
  }

  onClickConsiderAppeal(mode: TMode, litigationCaseId?: number, isSaveCaseEnd: boolean = false) {
    this.routerService.navigateTo(`/main/${mode === 'VIEW' ? 'lawsuit' : 'task'}/court/court-detail`, {
      action: this.appealTasks.includes(this.taskCode) ? 'CONSIDER_APPEAL' : 'CONSIDER_SUPREME_COURT',
      mode:
        (this.taskCode === 'CONSIDER_APPEAL' || this.taskCode === 'CONSIDER_SUPREME_COURT') &&
        this.statusCode === 'PENDING_APPROVAL'
          ? this.MODE.VIEW
          : mode,
      litigationCaseId: litigationCaseId,
      isSaveCaseEnd: isSaveCaseEnd,
      prevLitigationCaseId: isSaveCaseEnd ? this.litigationCaseDownloadMap[litigationCaseId ?? -1] || -1 : undefined,
    });
  }

  goToDispute(dispute: DisputeAppealDto | null, courtResult: CourtResultDto, mode: TMode) {
    this.routerService.navigateTo(`/main/${mode === 'VIEW' ? 'lawsuit' : 'task'}/court/court-detail`, {
      action: 'DISPUTE_APPEAL',
      mode: this.MODE.VIEW, // court-result (the top card)
      disputeMode: mode,
      litigationCaseId: courtResult.litigationCaseId,
      disputeAppealId: dispute ? dispute.disputeAppealId : 0,
      cif: this.lawsuitService.currentLitigation.customerId,
    });
  }

  // LEXS2-1155
  async payExecutionFee(decree: CourtDecreeDto) {
    let executionFeeData: ExecutionFeeDto | undefined = undefined;
    if (decree.decreeUpdateStatus !== 'WAITING_PAY') {
      const infoRes = await this.courtService.getPayExecutionFee(this.taskDetail.id || 0);
      executionFeeData = infoRes;
    }

    const res = await this.notificationService.showCustomDialog({
      component: ExecutionFeeDialogComponent,
      title: 'COURT.DECREE.ACTION_PAY_EXECUTION_FEE',
      iconName: 'icon-Check',
      rightButtonLabel: executionFeeData ? 'COMMON.BUTTON_CONTINUE' : 'COMMON.BUTTON_CONFIRM_PAYMENT',
      buttonIconName: 'icon-Selected',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      type: 'small',
      autoWidth: false,
      context: {
        decree,
        defendants: this.suitService.litigationCaseDetail.persons || [],
        executionFeeData: executionFeeData || undefined,
        taskId: this.taskDetail.id,
      },
    });
    if (res.submitted) {
      this.routerService.back();
    }
  }

  uploadExecutionReceipt(decree: CourtDecreeDto, result: CourtResultDto) {
    this.courtService.currentDecree = decree;
    this.routerService.navigateTo(`/main/lawsuit/court/execution-receipt-upload`, {
      action: 'UPLOAD_EXECUTION_RECEIPT',
      litigationCaseId: decree.litigationCaseId,
      courtLevel: result.courtLevel,
    });
  }

  link(mode: TMode, courtResult: CourtVerdictDto) {
    if (
      this.taskCode === 'MEMORANDUM_COURT_APPEAL' ||
      this.taskCode === 'MEMORANDUM_COURT_FIRST_INSTANCE' ||
      this.taskCode === 'MEMORANDUM_SUPREME_COURT'
    ) {
      if (this.routerService.currentRoute.includes('/main/task')) {
        let isSaveCaseEnd = courtResult?.caseEnd || false;
        this.routerService.navigateTo(`/main/task/court/court-detail`, {
          mode: this.taskDetail.taskCode ? mode : Mode.VIEW,
          litigationCaseId: courtResult.litigationCaseId,
          taskCode: this.taskCode,
          id: this.taskDetail.id,
          statusCode: this.taskDetail.statusCode,
          litigationId: this.taskDetail.litigationId,
          customerId: this.lawsuitService.currentLitigation.customerId,
          isSaveCaseEnd: isSaveCaseEnd,
          prevLitigationCaseId: isSaveCaseEnd
            ? this.litigationCaseDownloadMap[courtResult.litigationCaseId ?? -1] || -1
            : undefined,
        });
      } else {
        this.routerService.navigateTo(`/main/lawsuit/court/court-detail`, {
          mode: this.taskDetail.taskCode ? mode : Mode.VIEW,
          litigationCaseId: courtResult.litigationCaseId,
        });
      }
    } else {
      this.onClickConsiderAppeal(
        this.MODE.VIEW,
        courtResult.litigationCaseId,
        courtResult.testimonyStatus === 'FINISHED'
      );
    }
  }

  goToDecreeDetail(courtResult: CourtResultDto, decree: CourtDecreeDto, mode: TMode, index: number) {
    const isFromTask = this.routerService.currentRoute.includes('/main/task');
    this.courtService.currentDecree = decree;
    this.routerService.navigateTo(isFromTask ? `/main/task/court/court-detail` : `/main/lawsuit/court/decree-detail`, {
      mode,
      action: 'SAVE_DECREE',
      litigationCaseId: decree.litigationCaseId || courtResult.litigationCaseId,
      courtDecreeId: decree.id,
      litigationId: this.taskDetail.litigationId,
      index,
    });
  }

  goToExecutionDetail(
    courtResult: CourtResultDto,
    defendant: CourtDecreePersonDto,
    decree: CourtDecreeDto,
    mode: TMode
  ) {
    const isFromTask = this.routerService.currentRoute.includes('/main/task');
    this.routerService.navigateTo(
      isFromTask ? `/main/task/court/execution-detail` : `/main/lawsuit/court/execution-detail`,
      {
        mode,
        action: 'SAVE_EXECUTION',
        litigationCaseId: decree.litigationCaseId || courtResult.litigationCaseId,
        courtDecreeId: decree.id,
        litigationId: this.taskDetail.litigationId,
        personId: defendant.personId,
      }
    );
  }

  async onClickFirstBtn(court: any, isDisabled: boolean = false) {
    if (isDisabled) return;
    const context = {
      litigationCaseId: court.litigationCaseId,
      courtLevel: court.courtLevel,
    };
    const res = await this.notificationService.showCustomDialog({
      component: ExtendDialogComponent,
      iconName: 'icon-Dismiss-Square',
      title: 'ยกเลิกรายการ',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'ยืนยันขยายระยะเวลาอุทธรณ์',
      buttonIconName: 'icon-Dismiss-Square',
      rightButtonClass: 'long-button',
      context: context,
    });
    if (res) {
      await this.extendAppeal(res);
      let msg =
        (court.courtLevel === 'CIVIL'
          ? `${this.translate.instant('COURT.EXTEND_APPEAL')}`
          : `${this.translate.instant('COURT.EXTEND_SUPREME')}`) + 'สำเร็จแล้ว';
      this.notificationService.openSnackbarSuccess(msg);
    }
  }

  async extendAppeal(extendAppeal: ExtendAppealDto) {
    return await this.courtService.extendAppeal(extendAppeal);
  }
}
