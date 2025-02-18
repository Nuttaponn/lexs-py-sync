import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ConfigurationService } from '@app/modules/configuration/configuration.service';
import { CourtResolver } from '@app/modules/court/court.resolver';
import { CourtService } from '@app/modules/court/court.service';
import { defermentState } from '@app/modules/deferment/deferment.model';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { CreatePaymentBookComponent } from '@app/modules/finance/expense/create-payment-book/create-payment-book.component';
import { AdvanceService } from '@app/modules/finance/services/advance.service';
import { ExpenseService } from '@app/modules/finance/services/expense.service';
import { SuitService } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { SubButtonModel } from '@app/shared/components/action-bar/action-bar.component';
import { RejectDialogComponent } from '@app/shared/components/common-dialogs/reject-dialog/reject-dialog.component';
import { AuditLogService } from '@app/shared/components/common-tabs/audit-log/audit-log.service';
import { TrialService } from '@app/shared/components/common-tabs/trial/trial.service';
import { DebtRelatedInfoTabService } from '@app/shared/components/debt-related-info-tab/debt-related-info-tab.service';
import { WithdrawLawsuitDefendantDialogComponent } from '@app/shared/components/debt-related-info-tab/debt-related-info-tab/withdraw-lawsuit-defendant-dialog/withdraw-lawsuit-defendant-dialog.component';
import { DocumentAccountService } from '@app/shared/components/document-preparation/document-account.service';
import { DocumentPreparationComponent } from '@app/shared/components/document-preparation/document-preparation/document-preparation.component';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DownloadCopyDialogComponent } from '@app/shared/components/document-preparation/download-copy-dialog/download-copy-dialog.component';
import { COURT_FEE_STATUS, DOC_TEMPLATE } from '@app/shared/constant';
import {
  ActionBar,
  ApprovalFlowTaskCode,
  ForceApprovalFlowTaskCode,
  IMessageBanner,
  TMode,
  TaskCodeDecree,
  TaskCodeFinance,
  TaskCodeFinanceEdit,
  TaskCodeMemorandumCourt,
  TaskMode,
  statusCode,
  taskCode,
  taskCodeList,
} from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils';
import {
  AccountInfo,
  CollateralInfo,
  CourtAppealDto,
  CourtDecreeDto,
  CourtResultDto,
  CourtTrialUpdateResponse,
  CourtVerdictDto,
  CreateAdvanceReceivePayTransferDetail,
  CreateAdvanceReceivePayTransferRequest,
  CreateLitigationSubCaseRequest,
  CustomerDetailDto,
  CustomerLitigationCaseDto,
  DefermentExecDto,
  DefermentExecItem,
  DefermentInfo,
  DefermentItem,
  DefermentLitigationInfo,
  DocumentDto,
  HeirInfoRequest,
  LitigationCaseDto,
  LitigationCaseGroupDto,
  LitigationCaseRequest,
  LitigationCloseInfo,
  LitigationDetailDto,
  MeLexsUserDto,
  NewsAnnouncementRequest,
  PersonDto,
  PersonInfoRequest,
  PersonRequest,
  SaveDefermentExecRequest,
  SaveDefermentExecResponse,
  SaveDefermentRequest,
  SaveDefermentResponse,
  TaskDetailDto,
  TransferOrderRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe, DialogOptions } from '@spig/core';
import { SubSink } from 'subsink';
import { TaskDetailService } from '../services/task-detail.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  providers: [BuddhistEraPipe],
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  @ViewChild(DocumentPreparationComponent) docprep!: DocumentPreparationComponent;
  @ViewChild('createPaymentBook') createPaymentBook: CreatePaymentBookComponent | undefined;

  public forceStatusNormal: (taskCode | string)[] = ['RECORD_OF_SUPREME_COURT_ACKNOWLEDGE'];
  public forceStatusPending: (taskCode | string)[] = [
    'RECORD_OF_SUPREME_COURT',
    'RECORD_DIAGNOSIS_DATE',
    'UPLOAD_E_FILING',
  ];

  public accessPermissions = this.sessionService.accessPermissions();

  public TASK_CODE = taskCode;
  public tabIndex: number = 0;
  public subTabIndex: number = 0;
  public underSubTabIndex: number = 0;
  public taskMode!: TaskMode;
  public taskCode!: taskCode;
  public actionBar: ActionBar = {
    hasCancel: false,
    hasSave: false,
    hasReject: false,
    hasPrimary: false,
    saveText: 'COMMON.BUTTON_SAVE',
  };
  public subButtonList: Array<SubButtonModel> = [];
  public maxSubButton: number = 3;
  public auditTabLabel: string = '';
  public flowType!: string;
  public taskId!: number;
  private taskCreatedBy: string = '';

  public customerDetail!: CustomerDetailDto;
  public litigationDetail!: LitigationDetailDto;
  public litigationCloseInfo!: LitigationCloseInfo;
  public litigationCase!: Array<LitigationCaseDto>;
  public taskDetail: TaskDetailDto = {};
  public accountInfo!: AccountInfo;
  public collateralInfo!: CollateralInfo;
  public cases: Array<CustomerLitigationCaseDto> = [];

  public TASK_CODE_LIST = taskCodeList;
  public blackCaseNo: string = '';
  public isBannerSuccess: boolean = false;
  public messageBannerMapper = this.taskDetailService.getMsgDefaultBannerMapper();

  public hasApprovalFlow: taskCode[] = ApprovalFlowTaskCode;
  public forceApprovalFlowTaskCode: taskCode[] = ForceApprovalFlowTaskCode;
  public statusCode!: statusCode;
  private subs = new SubSink();
  public defermentType = DefermentInfo.DefermentTypeEnum;
  public indictmentForm!: UntypedFormGroup;
  public defermentForm!: UntypedFormGroup;
  public litigationCaseGroupDto!: LitigationCaseGroupDto[];
  public defermentMsgBanner: IMessageBanner = {};
  public documentUpload: Array<any> = [];

  private nextRouting: string = '';
  public defermentState?: defermentState;
  public _currentLitigation: LitigationDetailDto = this.lawsuitService.currentLitigation;
  public cessationMsgBanner: IMessageBanner = {};
  public cessationState?: defermentState;
  private isDuplicate = false;
  public supportKlawSecretary = false;
  public hasAutoCreate!: string;
  public consAppealCtrl: UntypedFormGroup = this.fb.group({});
  public courtResults: Array<CourtResultDto> | undefined = undefined;
  public currentUser?: MeLexsUserDto;
  public dataForm!: UntypedFormGroup;
  suitMode!: TMode | null;
  suitCourtLevel!: LitigationCaseDto.CourtLevelEnum | null;
  suitLitigationCaseId!: number | null;
  public isSubmit: boolean = false;
  public paymentBookForm!: UntypedFormGroup;
  public currentAssigneeId = '';
  public currentAssigneeName = '';
  public expenseObjectId = '';
  public objectId = '';
  public taskAndFinanceTaskCode = TaskCodeFinance;
  public taskAndFinanceEditTaskCode = TaskCodeFinanceEdit;
  public isRecordNoSuccess!: boolean;
  public paymentMode = this.expenseService.getExpenseMode(this.taskDetail.statusCode!);
  public actionBarEventName = this.expenseService.actionBarEventName;
  public title: string = '';
  public isShowErrorMsgBanner = false;
  private indictmentDateInvalid = false;

  constructor(
    private routerService: RouterService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private translate: TranslateService,
    private sessionService: SessionService,
    private lawsuitService: LawsuitService,
    private suitService: SuitService,
    private documentService: DocumentService,
    private documentAccountService: DocumentAccountService,
    private auditLogService: AuditLogService,
    private router: Router,
    private defermentService: DefermentService,
    private buddhistEraPipe: BuddhistEraPipe,
    private trialService: TrialService,
    private courtService: CourtService,
    private configurationService: ConfigurationService,
    private fb: UntypedFormBuilder,
    private courtResolver: CourtResolver,
    private taskDetailService: TaskDetailService,
    private expenseService: ExpenseService,
    private logger: LoggerService,
    private advanceService: AdvanceService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService
  ) {
    this.subs.add(
      this.route.queryParams.subscribe(value => {
        if (value) {
          this.taskId = value['taskId'] || -1;
          this.flowType = value['flowType'] || '';
          this.taskCreatedBy = value['createdBy'] || '';
          this.expenseObjectId = value['expenseObjectId'] || '';
          this.currentAssigneeId = value['currentAssigneeId'] || '';
          this.currentAssigneeName = value['currentAssigneeName'] || '';
          this.objectId = value['objectId'] || '';
        }
      }),
      this.router.events.subscribe(val => {
        if (val instanceof NavigationStart) this.nextRouting = val.url;
      })
    );
  }

  ngOnInit() {
    this.currentUser = this.sessionService.currentUser;
    this.supportKlawSecretary = JSON.parse(
      this.sessionService.currentUser?.attributes?.find(item => item.name === 'taskSupportRole')?.value || 'false'
    );
    this.callProcessNgOnInit();
    this.getCurrentTab();
    this.getCurrentSubTab();
    this.courtResults = this.courtService.courtResult;
    this.courtService.courtResultSubject.subscribe(event => {
      if (!!event) {
        this.courtResults = event;
        this.callProcessNgOnInit();
      }
    });

    this.title = 'TASK_DETAIL.TITLE_' + this.taskDetail.statusCode + '_' + this.taskCode;
    if (this.taskCode === 'R2E07-01-A' && this.defermentService.deferment.deferment?.extendDeferment) {
      this.title = 'LAWSUIT.DEFERMENT.EXTEND_DURATION_EXEC';
    }

    if (TaskCodeFinance.includes(this.taskCode) || TaskCodeFinanceEdit.includes(this.taskCode)) {
      this.paymentBookForm = this.expenseService.generateApproveForm(this.expenseService.expenseDetail);
    }
  }

  private getCurrentTab() {
    this.tabIndex = this.taskService.currentTab ?? 0;
    this.taskService.currentTab = this.tabIndex;
  }

  private getCurrentSubTab() {
    this.subTabIndex = this.taskService.currentSubTab ?? 0;
    this.taskService.currentSubTab = this.subTabIndex;
  }

  async refreshTaskDetail(newTaskId: any) {
    this.taskService.taskDetail = await this.taskService.inquiryTaskDetails(Number(newTaskId));
    this.taskId = this.taskService.taskDetail.id || -1;
    await this.callProcessNgOnInit();
  }

  async callProcessNgOnInit() {
    this.taskMode = this.route.snapshot.data['taskMode'];
    this.tabIndex = this.taskMode?.tabIndex || 0;
    this.taskService.currentTab = this.tabIndex; // Set tabIndex to currentTab
    this.subTabIndex = this.taskMode?.subTabIndex || 0;
    this.taskService.currentSubTab = this.subTabIndex; // Set subTabIndex to currentSubTab
    this.underSubTabIndex = this.taskMode?.underSubTabIndex || 0;
    this.taskDetail = this.taskService.taskDetail;
    this.taskCode = (this.taskDetail.taskCode as taskCode) || '';
    this.statusCode = this.taskDetail.statusCode as statusCode;
    this.isDuplicate = this.taskDetail.isHold || false;
    this.accessPermissions = this.sessionService.accessPermissions();
    this.actionBar = this.taskDetailService.initActionBar(
      this.defermentService.deferment,
      this.taskCode,
      this.statusCode as statusCode,
      this.flowType,
      this.accessPermissions,
      this.isDuplicate,
      this.isRecordNoSuccess
    );
    if (this.taskMode?.mode === 'LITIGATION') {
      this.initTaskModeLitigation();
    } else if (this.taskMode?.mode === 'FINANCE_EXPENSE') {
      this.actionBar = this.taskDetailService.initFinanceActionBar(this.taskCode);
    } else if (this.taskMode?.mode === 'CUSTOMER') {
      await this.initTaskModeCustomer();
    }

    if (this.taskCode === 'RECEIVE_ADVANCE_PAYMENT') {
      this.taskMode = { mode: 'FINANCE_ADVANCE' };
      this.initFinanceAdvance();
      this.isRecordNoSuccess = this.dataForm.get('advanceReceivePaymentStatusCode')?.value === 'RECORD_NO_SUCCESS';
      /* FIX: LEX2-22394 - move code to "this.taskDetailService.initActionBar"
      this.actionBar = this.taskDetailService.initAdvanceActionBar(this.statusCode === 'PENDING_APPROVAL' ? true : false, this.isRecordNoSuccess)
      */
    }

    if (TaskCodeMemorandumCourt.includes(this.taskCode) && this.statusCode === 'PENDING_CORRECTION') {
      this.actionBar = {
        hasCancel: false,
        hasSave: true,
        saveText: 'COMMON.BUTTON_SAVE',
        hasReject: false,
        hasPrimary: true,
        primaryText: 'COMMON.BUTTON_COMPLETE',
      } as ActionBar;
    }

    // decree auto finish
    if (TaskCodeDecree.includes(this.taskCode) && (this.statusCode === 'AWAITING' || this.statusCode === 'FINISHED')) {
      const currentDecree = this.courtService.findActiveDecree(parseInt(this.taskDetail.litigationCaseId || '0'));
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: currentDecree
          ? this.taskDetailService.getDecreeAutoFinishButtonText(currentDecree) !== null
          : false,
        primaryTextString: currentDecree
          ? this.taskDetailService.getDecreeAutoFinishButtonText(currentDecree)
          : this.actionBar.primaryTextString,
        displayPrimaryTextString: true,
        disabledPrimaryButton: true,
      };
    }
  }

  private findActiveCases(litigationCase: LitigationCaseGroupDto[]): LitigationCaseDto | null {
    for (const caseGroup of litigationCase) {
      if (caseGroup.cases) {
        for (const individualCase of caseGroup.cases) {
          if (individualCase.actionFlag === true) {
            return individualCase;
          }
        }
      }
    }

    return null;
  }

  private initTaskModeLitigation() {
    this.litigationDetail = this.taskService.litigationDetail || {};
    this.litigationCloseInfo = this.litigationDetail?.litigationCloseInfo || {};
    this.collateralInfo = (this.taskService.litigationDetail?.collateralInfo as CollateralInfo) || {};
    this.auditTabLabel = this.translate.instant('TASK.DETAIL_TAB_AUDIT_LOG');
    this.litigationCase = (this.taskService.litigationDetail?.cases as Array<LitigationCaseDto>) || [];
    this.accountInfo = this.taskService.litigationDetail.accountInfo || {};
    const _attr = this.taskService.taskDetail.attributes || '{}';
    !!_attr.startsWith('{') && !!_attr.endsWith('}');
    const taskDetailAttributes = !!_attr.startsWith('{') && !!_attr.endsWith('}') ? JSON.parse(_attr) : _attr;

    switch (this.taskCode) {
      case 'CHANGE_RELATED_PERSON':
        this.messageBannerMapper.set(
          'CHANGE_RELATED_PERSON',
          this.taskDetailService.getMsgChangeRelatedPerson(this.litigationDetail.personInfo?.additionalPersons)
        );
        break;
      case 'EDIT_MORTGAGE_ASSETS':
        this.messageBannerMapper.set('EDIT_MORTGAGE_ASSETS', this.taskDetailService.getMsgEditMortgageAsset());
        break;
      case 'COLLECT_LG_ID':
        this.messageBannerMapper.set(
          'COLLECT_LG_ID',
          this.taskDetailService.getMsgCollectLgId(this.litigationDetail, this.taskCreatedBy)
        );
        break;
      case 'ADD_SUB_ACCOUNT':
        this.messageBannerMapper.set('ADD_SUB_ACCOUNT', this.taskDetailService.getMsgAddSubAccount(this.taskCreatedBy));
        break;
      case 'INDICTMENT_RECORD':
        const returnReason = taskDetailAttributes?.returnReason;
        const statusCodeMsg = this.taskDetailService.getMsgIndictmentRecord(this.statusCode as statusCode);
        const translatedMsg = this.translate.instant(statusCodeMsg, {
          RETURN_REASON: returnReason || 'ใส่ข้อมูลไม่ครบถ้วน',
        });

        this.messageBannerMapper.set(this.taskCode, translatedMsg);

        this.indictmentForm = this.suitService.generateLitigationCaseForm(this.suitService.litigationCaseDetail); // Init form data Indictment
        /* Enhance LEX2-39408-39409 */
        if (this.statusCode === 'PENDING_APPROVAL') {
          const activeCase = this.findActiveCases(this.suitService.litigationCase);
          if (activeCase && activeCase.id?.toString() === this.suitService.litigationCaseDetail.id?.toString()) {
            this.suitService.litigationCaseDetail.overCaseDateFlag = activeCase.overCaseDateFlag;
          }
          this.indictmentDateInvalid = this.suitService.litigationCaseDetail?.overCaseDateFlag ?? false;
          if (this.indictmentDateInvalid) {
            this.actionBar = {
              ...this.actionBar,
              hasReject: false,
              hasPrimary: false,
              hasEdit: true,
              editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
              editIcon: 'icon-Arrow-Revert',
            };

            this.isShowErrorMsgBanner = true;

            this.messageBannerMapper.set(
              'INDICTMENT_RECORD',
              this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.INDICTMENT_RECORD_DATE_EXPIRED')
            );
          } else {
            if (!this.actionBar.hasCancel && !this.actionBar.hasReject && !this.actionBar.hasPrimary) {
              // MAKER wants to see a detail
              this.messageBannerMapper.set(
                'INDICTMENT_RECORD',
                this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.INDICTMENT_RECORD_PENDING_APPROVED')
              );
            } else if (this.actionBar.hasPrimary && this.actionBar.hasReject) {
              // APPROVER enters in task
              this.messageBannerMapper.set(
                'INDICTMENT_RECORD',
                this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.INDICTMENT_RECORD_PENDING_APPROVED_ACTION')
              );
            }
          }
        }
        break;
      case 'RECEIPT_ORIGINAL_DOCUMENT':
        this.actionBar.saveText = 'COMMON.BUTTON_SAVE_DARFT';
        break;
      case 'CONFIRM_COURT_FEES_PAYMENT':
        this.initLitigationTaskConfirmCourtFeesPayment();
        break;
      case 'UPLOAD_COURT_FEES_RECEIPT':
        this.checkBannerUploadCourtFeesReceipt();
        this.suitCourtLevel = 'CIVIL';
        this.suitLitigationCaseId = Number(this.taskDetail?.litigationCaseId ?? 0);
        this.suitService.statusCodeFromTask = this.statusCode;
        this.suitService.taskCodeFromTask = this.taskCode;
        break;
      case 'REQUEST_DEFERMENT':
      case 'EXTEND_DEFERMENT':
      case 'REQUEST_CESSATION':
      case 'AUTO_CREATE_DRAFT_CESSATION':
      case 'AUTO_CREATE_DRAFT_DEFERMENT':
      case 'REQUEST_REVISE_DEFERMENT':
      case 'REQUEST_REVISE_CESSATION':
      case 'SAVE_DRAFT_DEFERMENT':
      case 'SAVE_DRAFT_CESSATION':
      case 'R2E07-01-A':
      case 'R2E07-02-B':
      case 'R2E07-03-C':
      case 'R2E07-04-D':
      case 'R2E07-05-E':
        this.initLitigationTaskDeferment();
        break;
      case 'CONSIDER_REMAINING_COSTS':
        this.messageBannerMapper.set(
          'CONSIDER_REMAINING_COSTS',
          this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.CONSIDER_REMAINING_COSTS', {
            LG_ID: this.litigationCloseInfo?.litigationId,
          })
        );
        break;
      case 'CONSIDER_APPROVE_CLOSE_LG':
        this.messageBannerMapper.set(
          'CONSIDER_APPROVE_CLOSE_LG',
          this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.CONSIDER_APPROVE_CLOSE_LG', {
            LG_ID: this.litigationCloseInfo?.litigationId,
            CREATED_BY: this.litigationCloseInfo?.createdBy,
            CREATED_BY_NAME: this.litigationCloseInfo?.createdByName,
            CREATED_DATE: this.buddhistEraPipe.transform(this.litigationCloseInfo?.createdDate, 'DD/MM/YYYY HH:mm:ss'),
          })
        );
        break;
      case 'MEMORANDUM_COURT_FIRST_INSTANCE':
      case 'MEMORANDUM_COURT_APPEAL':
      case 'MEMORANDUM_SUPREME_COURT':
        this.initLitigationTaskMemoCourt();
        break;
      case 'CONSIDER_APPEAL':
      case 'CONSIDER_SUPREME_COURT':
        this.initConsiderAppealSupremeMsgBanner();
        break;
      case 'CHANGE_RELATED_PERSON_BLACK_CASE':
      case 'CHANGE_RELATED_PERSON_LITIGATION_CASE':
        switch (this.statusCode) {
          case statusCode.PENDING_APPROVAL:
            this.messageBannerMapper.set(
              this.taskCode,
              this.taskDetailService.getMsgChangeRelatedPersonBlackCase(this.litigationDetail)
            );
            break;
          default:
            break;
        }
        break;
      case 'DECREASE_RELATED_PERSON_LITIGATION_CASE':
        switch (this.statusCode) {
          case statusCode.PENDING_APPROVAL:
            this.messageBannerMapper.set(
              this.taskCode,
              this.taskDetailService.getMsgChangeRelatedPersonBlackCase(this.litigationDetail)
            );
            break;
          case statusCode.PENDING:
            this.initWithdrawLawsuitDefendant();
            break;
          default:
            break;
        }
        break;
      case 'RECORD_DIAGNOSIS_DATE':
        this.actionBar = {
          hasCancel: true,
          hasSave: true,
          hasReject: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_COMPLETE',
        };
        break;
      case 'RECORD_OF_APPEAL':
        this.messageBannerMapper.set(
          'RECORD_OF_APPEAL',
          `TASK_DETAIL.MESSAGE_BANNER.${this.statusCode}_${this.taskCode}`
        );
        this.suitCourtLevel = 'APPEAL';
        this.suitLitigationCaseId = Number(this.taskDetail?.litigationCaseId ?? 0);
        this.suitService.statusCodeFromTask = this.statusCode;
        this.suitService.taskCodeFromTask = this.taskCode;
        switch (this.statusCode) {
          case 'PENDING':
            this.suitMode = 'ADD';
            break;
          case 'IN_PROGRESS':
            this.suitMode = 'EDIT';
            break;
          default:
            this.suitMode = null;
            this.suitLitigationCaseId = null;
            this.suitCourtLevel = null;
            break;
        }
        break;
      case 'RECORD_OF_SUPREME_COURT':
        this.messageBannerMapper.set(
          'RECORD_OF_SUPREME_COURT',
          this.translate.instant(`TASK_DETAIL.MESSAGE_BANNER.${this.statusCode}_${this.taskCode}`)
        );
        this.suitCourtLevel = 'SUPREME';
        this.suitLitigationCaseId = Number(this.taskDetail?.litigationCaseId ?? 0);
        this.suitService.statusCodeFromTask = this.statusCode;
        this.suitService.taskCodeFromTask = this.taskCode;
        switch (this.statusCode) {
          case 'PENDING':
          case 'AWAITING':
            this.suitMode = 'ADD';
            break;
          case 'IN_PROGRESS':
            this.suitMode = 'EDIT';
            break;
          default:
            this.suitMode = null;
            this.suitLitigationCaseId = null;
            this.suitCourtLevel = null;
            break;
        }
        break;
      case 'UPLOAD_E_FILING':
        this.suitCourtLevel = this.suitService.litigationCaseDetail?.courtLevel ?? 'CIVIL';
        this.suitLitigationCaseId = Number(this.taskDetail?.litigationCaseId ?? 0);
        this.suitService.statusCodeFromTask = this.statusCode;
        this.suitService.taskCodeFromTask = this.taskCode;
        switch (this.statusCode) {
          case 'PENDING':
            this.suitMode = 'ADD';
            break;
          case 'IN_PROGRESS':
            this.suitMode = 'EDIT';
            break;
          default:
            this.suitMode = null;
            this.suitLitigationCaseId = null;
            this.suitCourtLevel = null;
            break;
        }
        this.setBannerUploadEFiling();
        break;
      case 'DECREE_OF_FIRST_INSTANCE':
      case 'DECREE_OF_APPEAL':
      case 'DECREE_OF_SUPREME_COURT':
        switch (this.statusCode) {
          case 'PENDING':
            this.messageBannerMapper.set(this.taskCode, 'TASK_DETAIL.MESSAGE_BANNER.PENDING_DECREE');
            break;
          case 'PENDING_APPROVAL':
            this.messageBannerMapper.set(
              this.taskCode,
              this.taskDetailService.getMsgPendingApprovalDecree(this.taskDetail, this.courtService.courtResult)
            );
            break;
          case 'AWAITING':
            this.messageBannerMapper.set(this.taskCode, 'TASK_DETAIL.MESSAGE_BANNER.AWAITING_DECREE');
            break;
        }
        break;
      case 'APPROVE_APPEAL':
      case 'APPROVE_SUPREME_COURT':
        this.messageBannerMapper.set(this.taskCode, 'TASK_DETAIL.MESSAGE_BANNER.PENDING_APPROVAL_CONSIDER_APPEAL');
        break;
      case 'INVESTIGATE_HEIR_OR_TRUSTEE':
      case 'PROCESS_NOT_PROSECUTE_1':
      case 'PROCESS_NOT_PROSECUTE_2':
        const deceasePersonId = taskDetailAttributes?.deceasePersonId;
        const debtorNameCaseAddHeir =
          this.litigationDetail?.personInfo?.persons?.find(obj => obj.personId === deceasePersonId)?.name || '';
        this.messageBannerMapper.set(
          this.taskCode,
          this.taskDetailService.getMsgInvestigateHeir(this.taskCode, this.statusCode, debtorNameCaseAddHeir)
        );
        break;
    }
  }

  private initLitigationTaskMemoCourt() {
    this.actionBar.hasSave = false;
    /* Set Banner in case MEMORANDUM_COURT_FIRST_INSTANCE */
    switch (this.statusCode) {
      case 'PENDING_APPROVAL':
        this.messageBannerMapper.set(
          'MEMORANDUM_COURT_FIRST_INSTANCE',
          'TASK_DETAIL.MESSAGE_BANNER.PENDING_APPROVAL_MEMORANDUM_COURT_FIRST_INSTANCE'
        );
        break;
      case 'AWAITING':
        this.messageBannerMapper.set(
          'MEMORANDUM_COURT_FIRST_INSTANCE',
          'TASK_DETAIL.MESSAGE_BANNER.AWAITING_MEMORANDUM_COURT_FIRST_INSTANCE'
        );
        /* Set KTB Acknowledge ActionBar */
        this.actionBar.primaryIcon = 'icon-Selected';
        this.actionBar.primaryText = 'COMMON.BUTTON_ACKNOWLEDGE';
        break;
      case 'PENDING_CORRECTION':
        const reasonCorrection = this.courtService.courtVerdictDetail?.rejectReason || '';
        const msgReason = this.translate.instant(`TASK_DETAIL.MESSAGE_BANNER.PENDING_CORRECTION_${this.taskCode}`, {
          REASON: reasonCorrection,
        });
        this.messageBannerMapper.set(this.taskCode, msgReason);
        break;
      default:
        this.messageBannerMapper.set(
          'MEMORANDUM_COURT_FIRST_INSTANCE',
          'TASK_DETAIL.MESSAGE_BANNER.MEMORANDUM_COURT_FIRST_INSTANCE'
        );
        break;
    }
  }

  private initConsiderAppealSupremeMsgBanner() {
    /* Set Banner in case CONSIDER_APPEAL and case CONSIDER_SUPREME_COURT */
    switch (this.statusCode) {
      case 'PENDING_APPROVAL':
        this.messageBannerMapper.set(this.taskCode, `TASK_DETAIL.MESSAGE_BANNER.PENDING_APPROVAL_${this.taskCode}`);
        /* Set Reject ActionBar */
        this.actionBar.rejectText = 'COMMON.BUTTON_SEND_BACK_EDIT';
        this.actionBar.rejectIcon = 'icon-Reset';
        break;
      case 'IN_PROGRESS':
        const rejectReasonl =
          (this.courtService.courtResult &&
            this.courtService.courtResult.find(item => item.courtAppeal?.rejectReason)?.courtAppeal?.rejectReason) ||
          '';
        this.messageBannerMapper.set(
          this.taskCode,
          this.translate.instant(`TASK_DETAIL.MESSAGE_BANNER.IN_PROGRESS_${this.taskCode}`, { REMARK: rejectReasonl })
        );
        break;
      default:
        this.messageBannerMapper.set(this.taskCode, `TASK_DETAIL.MESSAGE_BANNER.${this.taskCode}`);
        break;
    }
  }

  private initLitigationTaskDeferment() {
    this.documentService.customer = this.lawsuitService?.currentLitigation;
    this.documentUpload = this.defermentService.formatDocs(
      this.defermentService?.deferment?.deferment?.documents,
      true
    );
    // Init form data deferment
    this.defermentForm = this.defermentService.generateDefermentForm(
      this.defermentService.deferment.deferment,
      this.hasAutoCreate === 'AUTO_CREATE_DRAFT_CESSATION' ? true : false
    );
    // get message banner for task detail component
    this.messageBannerMapper.set(
      this.taskCode,
      this.taskDetailService.getMsgDefermentTasks(this.taskCode, this.defermentService.deferment, this.litigationDetail)
    );
    // get message banner for deferment component
    if (
      this.taskCode === 'R2E07-01-A' ||
      this.taskCode === 'R2E07-02-B' ||
      this.taskCode === 'R2E07-04-D' ||
      this.taskCode === 'R2E07-03-C'
    ) {
      const msgBanner = this.taskDetailService.getMsgDeferExecution(
        this.lawsuitService?.currentLitigation,
        this.taskCode,
        this.defermentService.deferment.deferment as DefermentExecItem
      );
      this.messageBannerMapper.set(this.taskCode, msgBanner || '');
      const defermentMessageBanner = this.taskDetailService.getDefermentMsgBanner(this.litigationDetail);
      this.defermentState = this.taskDetailService.defermentState;
      if (this.taskCode === 'R2E07-01-A') {
        this.defermentMsgBanner = defermentMessageBanner;
      }
    } else {
      const msgBanner = this.taskDetailService.getDefermentMsgBanner(this.litigationDetail);
      if (this.taskDetailService.defermentState?.includes('CESSATION')) {
        this.cessationState = this.taskDetailService.defermentState;
        this.cessationMsgBanner =
          this.taskDetailService.defermentState === defermentState.CESSATION_PENDING_APPROVED
            ? msgBanner
            : ({} as IMessageBanner);
        // DEFERMENT && Approved
        if (
          this.lawsuitService.currentLitigation.defermentInfo?.approved &&
          !!this.litigationDetail.defermentInfo?.defermentId
        ) {
          this.defermentState = defermentState.DEFERMENT;
        }
      } else {
        this.defermentState = this.taskDetailService.defermentState;
        this.defermentMsgBanner = msgBanner;
      }
      if (this.taskCode === 'AUTO_CREATE_DRAFT_CESSATION' || this.taskCode === 'AUTO_CREATE_DRAFT_DEFERMENT') {
        this.hasAutoCreate = this.taskCode;
        this.isBannerSuccess = false;
      }
    }

    // [LEX2-1234] [LEX2-5332]
    const checkTaskCodePermission = this.taskDetailService.checkTaskCodePermission(
      this.statusCode as statusCode,
      this.accessPermissions,
      this.isDuplicate
    );
    if (checkTaskCodePermission) {
      if (['REQUEST_DEFERMENT', 'EXTEND_DEFERMENT', 'REQUEST_CESSATION'].includes(this.taskCode)) {
        if (
          ['NORMAL_PENDING_APPROVED', 'DEFERMENT_PENDING_APPROVED', 'CESSATION_PENDING_APPROVED'].includes(
            this.taskDetailService.defermentState
          )
        ) {
          if (this.taskDetailService.defermentState === 'NORMAL_PENDING_APPROVED') {
            this.actionBar = { hasBack: true, hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false };
            const deferment = this.defermentService?.deferment?.deferment;
            let rejectText = 'COMMON.BUTTON_NOT_APPROVE';
            let approveText = 'COMMON.LABEL_APPROVE';
            switch (deferment?.currentApproveActor) {
              case DefermentItem.CurrentApproveActorEnum.Faction: // Actor ฝ่าย
                if (deferment.defermentApproverCode === '2') {
                  // อำนาจอนุมัติสาย
                  rejectText = 'COMMON.BUTTON_NOT_AGREE';
                  approveText = 'COMMON.BUTTON_AGREE_AS_PROPOSED';
                }
                break;
              case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม
                if (deferment.defermentApproverCode === '2') {
                  // อำนาจอนุมัติสาย
                  rejectText = 'COMMON.BUTTON_NOT_AGREE';
                  approveText = 'COMMON.BUTTON_AGREE_AS_PROPOSED';
                }
                break;
              default:
                break;
            }
            this.subButtonList = [
              {
                name: 'save_case',
                class: '',
                icon: 'icon-Arrow-Revert',
                text: 'COMMON.BUTTON_SEND_BACK_EDIT',
                disabled: false,
              },
              {
                name: 'revert_case',
                class: 'primary-button negative',
                icon: 'icon-Dismiss-Square',
                text: rejectText,
                disabled: false,
              },
              {
                name: 'approve_case',
                class: 'primary-button positive',
                icon: 'icon-Check-Square',
                text: approveText,
                disabled: false,
              },
            ];
          } else if (this.taskDetailService.defermentState === 'DEFERMENT_PENDING_APPROVED') {
            this.actionBar = { hasBack: true, hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false };
            const deferment = this.defermentService?.deferment?.deferment;
            let rejectText = 'COMMON.BUTTON_NOT_APPROVE';
            let approveText = 'COMMON.LABEL_APPROVE';
            switch (deferment?.currentApproveActor) {
              case DefermentItem.CurrentApproveActorEnum.Faction: // Actor ฝ่าย
                if (deferment.defermentApproverCode === '2') {
                  // อำนาจอนุมัติสาย
                  rejectText = 'COMMON.BUTTON_NOT_AGREE';
                  approveText = 'COMMON.BUTTON_AGREE_AS_PROPOSED';
                }
                break;
              case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม
                if (deferment.defermentApproverCode === '2') {
                  // อำนาจอนุมัติสาย
                  rejectText = 'COMMON.BUTTON_NOT_AGREE';
                  approveText = 'COMMON.BUTTON_AGREE_AS_PROPOSED';
                }
                break;
              default:
                break;
            }
            this.subButtonList = [
              {
                name: 'save_case',
                class: '',
                icon: 'icon-Arrow-Revert',
                text: 'COMMON.BUTTON_SEND_BACK_EDIT',
                disabled: false,
              },
              {
                name: 'revert_case',
                class: 'primary-button negative',
                icon: 'icon-Dismiss-Square',
                text: rejectText,
                disabled: false,
              },
              {
                name: 'approve_case',
                class: 'primary-button positive',
                icon: 'icon-Check-Square',
                text: approveText,
                disabled: false,
              },
            ];
          } else if (this.taskDetailService.defermentState === 'CESSATION_PENDING_APPROVED') {
            this.actionBar = { hasBack: true, hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false };
            this.subButtonList = [
              {
                name: 'save_case',
                class: '',
                icon: 'icon-Arrow-Revert',
                text: 'COMMON.BUTTON_SEND_BACK_EDIT',
                disabled: false,
              },
              {
                name: 'revert_case',
                class: 'primary-button negative',
                icon: 'icon-Dismiss-Square',
                text: 'COMMON.LABEL_NOT_APPROVE',
                disabled: false,
              },
              {
                name: 'approve_case',
                class: 'primary-button positive',
                icon: 'icon-Check-Square',
                text: 'COMMON.BUTTON_APPROVE',
                disabled: false,
              },
            ];
          }
        }
      } else if (['R2E07-02-B', 'R2E07-04-D', 'R2E07-03-C'].includes(this.taskCode)) {
        if (
          (this.taskCode === 'R2E07-02-B' || this.taskCode === 'R2E07-03-C') &&
          this.sessionService.isUserApprover()
        ) {
          let rejectText = 'COMMON.BUTTON_NOT_APPROVE';
          let approveText = 'COMMON.BUTTON_APPROVE';
          const deferment = this.defermentService?.deferment?.deferment;
          switch (deferment?.currentApproveActor) {
            case DefermentItem.CurrentApproveActorEnum.Faction:
            case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม, ฝ่าย
              if (deferment.defermentApproverCode === '1') {
                rejectText = 'COMMON.BUTTON_NOT_AGREE';
                approveText = 'COMMON.BUTTON_AGREE_AS_PROPOSED';
              }
              break;
            default:
              break;
          }
          this.actionBar = { hasBack: true, hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false };
          this.subButtonList = [
            {
              name: 'save_case',
              class: '',
              icon: 'icon-Arrow-Revert',
              text: 'COMMON.BUTTON_SEND_BACK_EDIT',
              disabled: false,
            },
            {
              name: 'revert_case',
              class: 'primary-button negative',
              icon: 'icon-Dismiss-Square',
              text: rejectText,
              disabled: false,
            },
            {
              name: 'approve_case',
              class: 'primary-button positive',
              icon: 'icon-Check-Square',
              text: approveText,
              disabled: false,
            },
          ];
        } else if (this.taskCode === 'R2E07-04-D' /** EDIT DEFERMENT EXECUTION */) {
          this.actionBar = {
            hasBack: true,
            hasCancel: false,
            hasSave: true,
            hasReject: false,
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_FINISH',
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
          };
        }
      } else if (this.taskCode === 'R2E07-01-A') {
        this.actionBar = {
          hasBack: true,
          hasCancel: false,
          hasSave: true,
          hasReject: true,
          hasPrimary: true,
          primaryText: this.defermentService.deferment.deferment?.extendDeferment
            ? 'LAWSUIT.DEFERMENT.CONFIRM_EXTEND_DURATION_EXEC'
            : 'LAWSUIT.DEFERMENT.SAVE_EXECUTION_DEFERMENT',
          saveText: 'COMMON.BUTTON_SAVE_DARFT',
          rejectText: 'COMMON.BUTTON_DELTE',
          rejectIcon: 'icon-Bin',
        };
      } else if (this.taskCode === 'R2E07-05-E' && this.statusCode === 'PENDING') {
        this.actionBar = {
          hasBack: true,
          hasCancel: false,
          hasReject: false,
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE',
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
        };
      } else {
        this.cessationMsgBanner = { message: '', type: '' } as IMessageBanner;
        this.defermentMsgBanner = { message: '', type: '' } as IMessageBanner;
        this.defermentState = undefined;
        this.cessationState = undefined;
      }
    } else {
      this.actionBar = { hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false };
    }
  }

  private initLitigationTaskConfirmCourtFeesPayment() {
    let confirmCourtFeesPayment = false;
    this.suitService.litigationCase.forEach(it => {
      if (
        it.cases &&
        it.cases?.length > 0 &&
        it.cases.find(
          (item: any) =>
            !!item.actionFlag && item.courtFeeStatus === COURT_FEE_STATUS.TRANSFERRED && item.confirmImageId
        )
      ) {
        confirmCourtFeesPayment = true;
        return;
      }
    });
    if (confirmCourtFeesPayment) {
      const msgBanner = this.taskDetailService.getMsgConfirmCourtFeesPayment(
        this.messageBannerMapper.get('CONFIRM_COURT_FEES_PAYMENT') || '',
        !!this.suitService.paymentConfirmRequest
      );
      this.messageBannerMapper.set('CONFIRM_COURT_FEES_PAYMENT', msgBanner?.message || '');
      this.isBannerSuccess = msgBanner?.type === 'success' || false;
    }
  }

  private async initTaskModeCustomer() {
    this.documentService.customer = this.taskService.customerDetail;
    this.customerDetail = this.taskService.customerDetail || {};
    this.collateralInfo = (this.taskService.customerDetail?.collateralInfo as CollateralInfo) || {};
    this.accountInfo = this.customerDetail?.accountInfo || {};
    if (!!this.documentService.customer) {
      this.taskDetailService.initDocumentData();
      await this.taskDetailService.initDocumentAuditLog();
    }
  }

  checkBannerUploadCourtFeesReceipt() {
    let uploadedRecipt = false;
    uploadedRecipt = !!this.suitService.payCourtFeeReceiptRequest;
    if (uploadedRecipt) {
      const msgBanner = this.taskDetailService.getMsgUploadCourtFeesReceipt(
        this.messageBannerMapper.get('UPLOAD_COURT_FEES_RECEIPT') || ''
      );
      this.messageBannerMapper.set('UPLOAD_COURT_FEES_RECEIPT', msgBanner?.message || '');
      this.isBannerSuccess = msgBanner?.type === 'success' || false;
    }
  }

  setBannerUploadEFiling() {
    if (this.taskCode === 'UPLOAD_COURT_FEES_RECEIPT') {
      this.checkBannerUploadCourtFeesReceipt();
      return;
    }
    if (this.taskCode === 'CONFIRM_COURT_FEES_PAYMENT') {
      this.initLitigationTaskConfirmCourtFeesPayment();
      return;
    }
    if (this.taskCode !== 'UPLOAD_E_FILING') return;
    if (this.statusCode === 'PENDING_APPROVAL') {
      this.isBannerSuccess = false;
      this.messageBannerMapper.set('UPLOAD_E_FILING', `TASK_DETAIL.MESSAGE_BANNER.PENDING_APPROVAL_UPLOAD_E_FILING`);
      return;
    }
    if (!this.suitService.updateLitigationCaseDetail) {
      this.isBannerSuccess = false;
      this.messageBannerMapper.set(
        'UPLOAD_E_FILING',
        `TASK_DETAIL.MESSAGE_BANNER.${this.statusCode}_UPLOAD_E_FILING_0`
      );
      return;
    }
    this.messageBannerMapper.set('UPLOAD_E_FILING', `TASK_DETAIL.MESSAGE_BANNER.${this.statusCode}_UPLOAD_E_FILING_1`);
    this.isBannerSuccess = true;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setTabIndex(tabIndex: number) {
    this.tabIndex = tabIndex;
  }

  setSubTabIndex(tabIndex: number) {
    this.subTabIndex = tabIndex;
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    this.saveCurrentTab(event.index);
    if (event.tab.textLabel === this.auditTabLabel) {
      this.auditLogService.refreshLogType.next(this.taskMode.mode === 'CUSTOMER' ? 'CUSTOMER' : 'LITIGATION');
    }
  }

  onSubTabChanged(event: MatTabChangeEvent) {
    this.subTabIndex = event.index;
    this.saveCurrentSubTab(event.index);
  }

  private saveCurrentTab(tabIndex: number) {
    this.taskService.currentTab = tabIndex;
  }

  private saveCurrentSubTab(tabIndex: number) {
    this.taskService.currentSubTab = tabIndex;
  }

  async canDeactivate() {
    this.logger.warn('taskDetail canDeactivate');
    if (this.taskDetailService.verifyCanDeactivate(this.nextRouting)) {
      // after navigate out of task detail reset firstTime and stroeIndictment
      this.suitService.clearStroeIndictment();
      return true;
    } else {
      // check for hasEdit of the services for tasks that navigate outside of task module
      const isUnHoldPageSession =
        this.supportKlawSecretary || ['APPROVER', 'MAKER'].includes(this.accessPermissions.subRoleCode);
      if (
        this.documentService.hasEdit ||
        this.lawsuitService.hasEdit ||
        this.suitService.hasEdit ||
        this.courtService.hasEdit ||
        this.advanceService.hasEdit ||
        this.trialService.hasEdit ||
        this.defermentForm?.dirty ||
        this.paymentBookForm?.dirty
      ) {
        if (await this.sessionService.confirmExitWithoutSave()) {
          this.taskDetailService.clearAllData();
          this.defermentService.clearDataExec();
          if (isUnHoldPageSession) {
            await this.taskService.unHoldPageSession(this.taskId);
          }
          // after navigate out of task detail reset firstTime and stroeIndictment
          this.suitService.clearStroeIndictment();
          return true;
        }
        this.routerService.currentStack.push(this.routerService.nextUrl);
        return false;
      } else {
        this.taskDetailService.clearAllData();
        this.defermentService.clearDataExec();
        if (isUnHoldPageSession) {
          await this.taskService.unHoldPageSession(this.taskId);
        }
        // after navigate out of task detail reset firstTime and stroeIndictment
        this.suitService.clearStroeIndictment();
        return true;
      }
    }
  }

  subButtonHandler(event: any) {
    switch (event.name) {
      case 'cancel':
        this.onCancel();
        break;
      case 'revert_case':
        this.onReject();
        break;
      case 'approve_case':
        this.onSubmit();
        break;
      case 'save_case':
        this.onSave();
        break;
      default:
        break;
    }
  }

  onBack() {
    this.routerService.back();
  }

  onCancel() {
    this.onBack();
  }

  async onReject(isFromOnSubmit: boolean = false, customContext = {}) {
    if (
      [
        taskCode.PAY_EXECUTION_FEE_FIRST_INSTANCE,
        taskCode.PAY_EXECUTION_FEE_APPEAL,
        taskCode.PAY_EXECUTION_FEE_SUPREME,
      ].includes(this.taskCode)
    ) {
      // const activeDecree = this.courtService.findActiveDecree(this.taskDetail.litigationCaseId! as unknown as number)
      try {
        const res = await this.courtService.processNotDecree(this.taskId, {
          personIds: this.suitService.litigationCaseDetail?.persons?.map(d => d.personId || '') || [],
          headerFlag: 'SUBMIT',
        });
        const lgid = this.litigationDetail?.litigationId || '';
        this.notificationService.openSnackbarSuccess(`เลขที่กฎหมาย: ${lgid} ไม่ออกคำบังคับ`);
        this.onBack();
      } catch (e) {
        this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    } else {
      let advanceRequest!: CreateAdvanceReceivePayTransferRequest;
      if (this.taskCode === 'RECEIVE_ADVANCE_PAYMENT') {
        let data = {
          ...this.dataForm.getRawValue(),
          createAdvancePayTransferInfo: (this.dataForm.get('createAdvancePayTransferInfo') as UntypedFormArray).value
            .value,
        };
        advanceRequest = Object.assign({ headerFlag: 'REJECT' }, data);
      }
      const context = {
        taskId: this.taskId,
        taskCode: this.taskCode,
        mode: this.taskMode.mode,
        advanceReceiveNo: 'string',
        cancelReason: 'string',
        cancelReasonOther: 'string',
        action:
          (this.taskCode === 'RECEIVE_ADVANCE_PAYMENT' &&
            (this.statusCode === 'PENDING_APPROVAL' || this.isRecordNoSuccess)) ||
          (this.taskCode === 'EXPENSE_CLAIM_PAYMENT_APPROVAL' && this.statusCode === 'PENDING')
            ? 'REJECT'
            : 'CANCEL',
        customerId:
          this.taskMode.mode === 'LITIGATION'
            ? this.litigationDetail?.customerId || ''
            : this.customerDetail?.customerId || '',
        litigationId: this.litigationDetail?.litigationId || '',
        litigationCaseId: this.taskService.taskDetail.litigationCaseId,
        expenseObjectId: this.expenseObjectId,
        expenseTransactions: this.paymentBookForm?.getRawValue()?.expenseTransactionDto || undefined,
        advanceRequest: this.taskCode === 'RECEIVE_ADVANCE_PAYMENT' ? advanceRequest : undefined,
        maxTextArea:
          (this.taskCode === 'RECEIVE_ADVANCE_PAYMENT' &&
            (this.statusCode === 'PENDING_APPROVAL' || this.isRecordNoSuccess)) ||
          (this.taskCode === 'EXPENSE_CLAIM_PAYMENT_APPROVAL' && this.statusCode === 'PENDING')
            ? 1000
            : 500,
        ...customContext,
      };
      const rejectBack = ['CONSIDER_APPEAL', 'APPROVE_APPEAL', 'CONSIDER_SUPREME_COURT', 'APPROVE_SUPREME_COURT'];
      const isInvalidIndictmentRecord = this.taskCode === 'INDICTMENT_RECORD' && this.indictmentDateInvalid;
      if (isInvalidIndictmentRecord) rejectBack.push('INDICTMENT_RECORD');

      const dialogSetting: DialogOptions = {
        component: RejectDialogComponent,
        title: rejectBack.includes(this.taskCode) ? 'COMMON.BUTTON_SEND_BACK_EDIT' : 'COMMON.LABEL_NOT_APPROVE',
        iconName: rejectBack.includes(this.taskCode) ? 'icon-Reset' : 'icon-Dismiss-Square',
        rightButtonLabel: rejectBack.includes(this.taskCode)
          ? 'TASK.REJECT_DIALOG.BTN_CONFIRM_SEND_BACK'
          : 'TASK.REJECT_DIALOG.BTN_CONFIRM',
        rightButtonClass: 'mat-warn long-button',
        buttonIconName: rejectBack.includes(this.taskCode) ? 'icon-Reset' : 'icon-Dismiss-Square',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        context: context,
      };
      if (
        this.taskCode === 'UPLOAD_E_FILING' ||
        (['APPROVE_APPEAL', 'APPROVE_SUPREME_COURT'].includes(this.taskCode) &&
          this.statusCode === 'PENDING_APPROVAL') ||
        isInvalidIndictmentRecord
      ) {
        dialogSetting.title = 'COMMON.BUTTON_SEND_BACK_EDIT';
        dialogSetting.iconName = 'icon-Reset';
        dialogSetting.rightButtonLabel = 'COMMON.CONFIRM_SEND_BACK_EDIT';
        dialogSetting.buttonIconName = 'icon-Reset';

        if (isInvalidIndictmentRecord) {
          const lawyerId = (this.suitService.litigationCaseDetail?.lawyerId || '').trim();
          const lawyerName = (this.suitService.litigationCaseDetail?.lawyerName || '').trim();
          dialogSetting.context = {
            ...dialogSetting.context,
            showFieldContent: true,
            showMsgContent: true,
            fieldContentText: this.translate.instant('FINANCE.MAKER'), // 'ผู้ทำรายการ',
            fieldContentValue: `${lawyerId} - ${lawyerName}`,
            titleFieldContent: this.translate.instant('COMMON.SEND_BACK_TO'), // 'งานจะถูกส่งกลับให้',
            placeholderTxtArea: this.translate.instant(
              'AUCTION_DETAIL.SEND_BACK_EDIT_DIALOG.REMARKS_FOR_CONSIDERATION'
            ), // 'กรุณาระบุหมายเหตุการพิจารณา',
            cdkAutosizeMinRows: 7,
            action: 'REVISE',
          };
        }
      } else if (this.taskCode === 'RECEIVE_ADVANCE_PAYMENT') {
        dialogSetting.iconName =
          this.taskCode === 'RECEIVE_ADVANCE_PAYMENT' &&
          (this.statusCode === 'PENDING_APPROVAL' || this.isRecordNoSuccess)
            ? 'icon-Arrow-Revert'
            : 'icon-Dismiss-Square';
        dialogSetting.title =
          this.taskCode === 'RECEIVE_ADVANCE_PAYMENT' &&
          (this.statusCode === 'PENDING_APPROVAL' || this.isRecordNoSuccess)
            ? 'ส่งกลับแก้ไข'
            : 'ยกเลิกรายการ';
        dialogSetting.leftButtonLabel = 'COMMON.BUTTON_CANCEL';
        dialogSetting.rightButtonLabel =
          'RECEIVE_ADVANCE_PAYMENT' && (this.statusCode === 'PENDING_APPROVAL' || this.isRecordNoSuccess)
            ? 'ยืนยันส่งกลับแก้ไข'
            : 'ยืนยันยกเลิกรายการ';
        dialogSetting.buttonIconName =
          'RECEIVE_ADVANCE_PAYMENT' && (this.statusCode === 'PENDING_APPROVAL' || this.isRecordNoSuccess)
            ? 'icon-Arrow-Revert'
            : 'icon-Dismiss-Square';
        dialogSetting.rightButtonClass = 'long-button mat-warn';
      } else if (this.taskCode === 'INVESTIGATE_HEIR_OR_TRUSTEE' || this.taskCode === 'PROCESS_NOT_PROSECUTE_2') {
        //onReject()

        if (this.taskCode === 'INVESTIGATE_HEIR_OR_TRUSTEE' && this.statusCode == 'PENDING') {
          let taskDetailAttributes;
          if (typeof this.taskService.taskDetail.attributes !== 'string') {
            taskDetailAttributes = JSON.parse(this.taskService.taskDetail.attributes || '{}');
          } else {
            taskDetailAttributes = this.taskService.taskDetail.attributes;
          }
          const deceasePersonId = taskDetailAttributes?.deceasePersonId;
          const litigationId = this.litigationDetail?.litigationId || '';
          const result = await this.debtRelatedInfoTabService.openDialogResonReject(
            String(litigationId),
            deceasePersonId,
            this.taskCode
          );
          if (!!result) {
            let heirInfoRequest: HeirInfoRequest = {
              approvalStatus: HeirInfoRequest.ApprovalStatusEnum.Reject,
              litigationId: litigationId,
              document: result?.documentUpload[0],
              reason: result?.reason,
            };
            this.debtRelatedInfoTabService.processHeir(this.taskId, heirInfoRequest);
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${
                this.litigationDetail?.litigationId
              } ${this.translate.instant('DEBT_RELATED_INFO_TAB.SNACKBAR_ADD_DEBT_RELATED_SEND_APPROVED')}`
            );
            this.onBack();
          }
          return;
        } else {
          dialogSetting.iconName = 'icon-Dismiss-Square';
          dialogSetting.leftButtonLabel = 'COMMON.BUTTON_CANCEL';
          dialogSetting.buttonIconName = 'icon-Dismiss-Square';
          if (this.taskCode === 'INVESTIGATE_HEIR_OR_TRUSTEE' && this.statusCode == 'PENDING_APPROVAL') {
            dialogSetting.title = 'COMMON.BUTTON_NOT_APPROVE';
            dialogSetting.rightButtonLabel = 'LAWSUIT.CLOSE.BTN_CONFIRM_REJECT';
          } else if (this.taskCode === 'PROCESS_NOT_PROSECUTE_2') {
            if (this.statusCode == 'PENDING') {
              // popup ktb-amd maker confirm reject
              dialogSetting.title = isFromOnSubmit
                ? 'COMMON.BUTTON_AGREE_AS_PROPOSED'
                : 'COMMON.BUTTON_NOT_AGREE_AS_PROPOSED';
              dialogSetting.rightButtonLabel = isFromOnSubmit
                ? 'COMMON.BUTTON_AGREE_AS_PROPOSED'
                : 'COMMON.BUTTON_NOT_AGREE_AS_PROPOSED';
              dialogSetting.iconName = isFromOnSubmit ? 'icon-Selected' : dialogSetting.iconName;
              dialogSetting.buttonIconName = isFromOnSubmit ? 'icon-Selected' : dialogSetting.buttonIconName;
              dialogSetting.rightButtonClass = isFromOnSubmit ? 'primary long-button' : dialogSetting.rightButtonClass;
            } else if (this.statusCode == 'PENDING_APPROVAL') {
              // popup ktb-amd approver confirm reject
              dialogSetting.title = isFromOnSubmit
                ? 'COMMON.BUTTON_APPROVE_AS_PROPOSED'
                : 'COMMON.BUTTON_NOT_APPROVE_AS_PROPOSED';
              dialogSetting.rightButtonLabel = isFromOnSubmit
                ? 'COMMON.BUTTON_APPROVE_AS_PROPOSED'
                : 'COMMON.BUTTON_NOT_APPROVE_AS_PROPOSED';
              dialogSetting.iconName = isFromOnSubmit ? 'icon-Selected' : dialogSetting.iconName;
              dialogSetting.buttonIconName = isFromOnSubmit ? 'icon-Selected' : dialogSetting.buttonIconName;
              dialogSetting.rightButtonClass = isFromOnSubmit ? 'primary long-button' : dialogSetting.rightButtonClass;
            }
          }
        }
      } else if (this.taskCode === 'REQUEST_DEFERMENT' || this.taskCode === 'EXTEND_DEFERMENT') {
        const deferment = this.defermentService?.deferment?.deferment;
        let title = 'COMMON.LABEL_NOT_APPROVE';
        let rightButtonLabel = 'LAWSUIT.CLOSE.BTN_CONFIRM_REJECT';
        let msgContentText = this.translate.instant('LAWSUIT.DEFERMENT.NOT_APPROVE_MSG_CONTENT');
        switch (deferment?.currentApproveActor) {
          case DefermentItem.CurrentApproveActorEnum.Faction:
          case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม, ฝ่าย
            if (deferment.defermentApproverCode === '2') {
              // อำนาจอนุมัติสาย
              title = 'COMMON.BUTTON_NOT_AGREE';
              rightButtonLabel = 'COMMON.BUTTON_NOT_AGREE';
              msgContentText = this.translate.instant('LAWSUIT.DEFERMENT.NOT_AGREE_MSG_CONTENT');
            }
            break;
          default:
            break;
        }
        dialogSetting.title = title;
        dialogSetting.rightButtonLabel = rightButtonLabel;
        dialogSetting.context = {
          ...context,
          showMsgContent: true,
          showFieldContent: true,
          msgContentText: msgContentText,
          fieldContentText: this.translate.instant('LAWSUIT.DEFERMENT.REQUESTER'),
          fieldContentValue: deferment?.createdByName,
          maxTextArea: 500,
        };
      } else if (this.taskCode === 'REQUEST_CESSATION') {
        dialogSetting.context = {
          ...context,
          maxTextArea: 500,
        };
      } else if (this.taskCode === 'AUTO_CREATE_DRAFT_DEFERMENT' || this.taskCode === 'AUTO_CREATE_DRAFT_CESSATION') {
        dialogSetting.title = 'COMMON.BUTTON_REJECT';
        dialogSetting.iconName = 'icon-Dismiss-Square';
        dialogSetting.rightButtonLabel = 'COMMON.BUTTON_REJECT_CONFIRM';
        dialogSetting.buttonIconName = 'icon-Dismiss-Square';
      } else if (this.taskCode === 'SAVE_DRAFT_DEFERMENT' || this.taskCode === 'SAVE_DRAFT_CESSATION') {
        try {
          const isContinue = await this.notificationService.warningDialog(
            'LAWSUIT.DEFERMENT.DELETE_DEFERMENT_LIST_TITLE',
            'LAWSUIT.DEFERMENT.DELETE_DEFERMENT_LIST_MSG',
            'LAWSUIT.DEFERMENT.DELETE_DEFERMENT_LIST_BTN',
            'icon-Bin',
            'long-button mat-warn'
          );
          if (isContinue) {
            await this.saveDeferment(
              this.taskCode === 'SAVE_DRAFT_DEFERMENT'
                ? SaveDefermentRequest.DefermentTypeEnum.Deferment
                : SaveDefermentRequest.DefermentTypeEnum.Cessation,
              SaveDefermentRequest.HeaderFlagEnum.Delete
            );
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${
                this.litigationDetail?.litigationId
              } ${this.translate.instant('TASK.REJECT_DIALOG.DELETE_DEFERMENT_LIST_SUCCESS')}`
            );
            this.onBack();
          }
        } catch (e) {
          this.logger.catchError(this.taskCode, e);
        }
        return;
      } else if (this.taskCode === 'R2E07-01-A') {
        try {
          const isContinue = await this.notificationService.warningDialog(
            'LAWSUIT.DEFERMENT.DELETE_DEFERMENT_LIST_TITLE',
            'LAWSUIT.DEFERMENT.DELETE_DEFERMENT_LIST_MSG',
            'LAWSUIT.DEFERMENT.DELETE_DEFERMENT_LIST_BTN',
            'icon-Bin',
            'long-button mat-warn'
          );
          if (isContinue) {
            let request: SaveDefermentExecRequest = {
              customerId: this.lawsuitService.currentLitigation.customerId || '',
              defermentExecItem: {
                ...this.defermentForm.value,
                collaterals: this.defermentService.getSelectedCollaterals.collaterals,
                collateralDeedGroups: this.defermentService.getSelectedCollaterals.collateralDeedGroups,
                collateralNoAnnounceAuctions: this.defermentService.getSelectedCollaterals.collateralNoAnnounceAuctions,
              },
              headerFlag: SaveDefermentRequest.HeaderFlagEnum.Delete,
              taskId: this.taskId,
              litigationId: this.lawsuitService.currentLitigation.litigationId,
            };
            await this.defermentService.saveCustomerDefermentExec(request);
            this.clearConfirmExitWithoutSave();
            this.notificationService.openSnackbarSuccess(
              this.translate.instant('TASK.REJECT_DIALOG.DELETE_DEFERMENT_LIST_SUCCESS')
            );
            this.onBack();
          }
        } catch (e) {
          this.logger.catchError(this.taskCode, e);
        }
        return;
      } else if (this.taskCode === 'R2E07-02-B' || this.taskCode === 'R2E07-03-C') {
        const deferment = this.defermentService?.deferment?.deferment;

        let title = 'COMMON.BUTTON_NOT_APPROVE';
        let rightButtonLabel = 'COMMON.BUTTON_NOT_APPROVE';
        let msg = this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_REJECT_MSG');
        switch (deferment?.currentApproveActor) {
          case DefermentItem.CurrentApproveActorEnum.Faction: // Actor ฝ่าย
            if (deferment.defermentApproverCode === '1') {
              // อำนาจอนุมัติ DLA
              title = 'COMMON.BUTTON_NOT_AGREE';
              rightButtonLabel = 'COMMON.BUTTON_NOT_AGREE';
              msg = this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_NOT_AGREE_GROUP_MSG');
            }
            break;
          case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม
            if (deferment.defermentApproverCode === '1') {
              // อำนาจอนุมัติ DLA
              title = 'COMMON.BUTTON_NOT_AGREE';
              rightButtonLabel = 'COMMON.BUTTON_NOT_AGREE';
              msg = this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_NOT_AGREE_ORG_MSG');
            }
            break;
          default:
            break;
        }

        dialogSetting.title = title;
        (dialogSetting.rightButtonLabel = rightButtonLabel), (dialogSetting.iconName = 'icon-Dismiss-Square');
        dialogSetting.context = {
          ...context,
          showFieldContent: true,
          fieldContentText: this.translate.instant('LAWSUIT.DEFERMENT.REQUESTER'),
          fieldContentValue: deferment?.createdByName,
          showMsgContent: true,
          action: 'REJECT',
          msgContentText: msg,
        };
      } else if (
        this.taskCode === 'EXPENSE_CLAIM_CORRECTION' ||
        this.taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD' ||
        this.taskCode === 'EXPENSE_CLAIM_VERIFICATION' ||
        this.taskCode === 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT' ||
        this.taskCode === 'REVERSE_EXPENSE_CLAIM_OTHER'
      ) {
        this.expenseService.onReject(
          this.taskCode,
          this.taskId,
          this.taskService.taskDetail.statusCode || '',
          this.paymentBookForm
        );
        this.actionBarEventName = this.expenseService.actionBarEventName;
        return;
      } else if (
        (this.taskCode === 'MEMORANDUM_COURT_FIRST_INSTANCE' ||
          this.taskCode === 'MEMORANDUM_COURT_APPEAL' ||
          this.taskCode === 'MEMORANDUM_SUPREME_COURT') &&
        this.statusCode == 'PENDING_APPROVAL'
      ) {
        dialogSetting.context = {
          ...context,
          action: 'REJECT',
          showFieldContent: true,
          fieldContentText: this.translate.instant('COMMON.LABEL_TASK_MAKER'),
          fieldContentValue: `${this.litigationDetail?.lawyerId} - ${this.litigationDetail?.lawyerName}`,
          titleFieldContent: this.translate.instant('COMMON.SEND_BACK_TO'),
        };
        dialogSetting.title = 'COMMON.BUTTON_SEND_BACK_EDIT';
        dialogSetting.rightButtonLabel = 'COMMON.CONFIRM_SEND_BACK_EDIT';
        dialogSetting.iconName = 'icon-Arrow-Revert';
        dialogSetting.buttonIconName = 'icon-Arrow-Revert';
      }
      // clear value for check confirmExitWithoutSave
      this.clearConfirmExitWithoutSave();
      await this.notificationService.showCustomDialog(dialogSetting);
    }
  }

  async onSave() {
    this.logger.info('onSave for :: ', this.taskMode.mode, ' :: taskCode :: ', this.taskCode);

    if (this.taskMode.mode === 'CUSTOMER') {
      switch (this.taskCode) {
        case 'VERIFY_INFO_AND_DOCUMENT':
          const payloadDocInfo = this.taskDetailService.getPayloadDocumentInfoRequest('SAVE');
          let responseUpdateDoc!: DocumentDto[];
          if (!!payloadDocInfo) {
            try {
              responseUpdateDoc = await this.documentService.updateDocumentsCustomer(payloadDocInfo);
              this.documentService.hasEdit = false;
              this.docprep.inquiryDocumentAuditLog(0);
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_CIF_NUMBER')}: ${
                  this.documentService?.customer?.customerId
                } ${this.translate.instant('TASK.LABEL_DRAFT_SAVED')}`
              );
            } catch (e) {
              this.logger.catchError(this.taskCode, e);
            }
          }
          // clear update flags and deleted documents for doc account
          if (responseUpdateDoc) {
            this.documentAccountService.remapDocsOnSaveDraft(responseUpdateDoc);
            this.documentAccountService.removeUpdateFlagsAndDeletedDocuments();
            this.documentAccountService.triggerOnSaveDraftEvent();
          }
          break;
        default:
          break;
      }
    } else if (this.taskMode.mode === 'FINANCE_EXPENSE') {
      if (this.taskCode === 'EXPENSE_CLAIM_CORRECTION' || this.taskCode === 'EXPENSE_CLAIM_VERIFICATION') {
        this.expenseService.onSave(
          this.taskCode,
          this.taskId,
          this.createPaymentBook?.paymentList,
          this.paymentBookForm
        );
        this.actionBarEventName = this.expenseService.actionBarEventName;
      } else {
        const request = this.expenseService.getExpenseApprovalRequest(
          {
            ...this.paymentBookForm.getRawValue(),
            expenseTransactionDto: this.expenseService.expenseTransactionRequest,
          },
          'DRAFT'
        );
        await this.expenseService.approve(this.taskId, request);
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('เลขที่หนังสือเบิกจ่ายเงิน')}: ${this.expenseObjectId} ${this.translate.instant(
            'บันทึกร่างสำเร็จแล้ว'
          )}`
        );
      }
    } else {
      const lg = this.litigationDetail?.litigationId || '';
      switch (this.taskCode) {
        case 'RECORD_NOTICE':
        case 'RECORD_NOTICE_GUARANTOR':
          this.lawsuitService.noticeLetterRequest = this.taskDetailService.getPayloadNoticeLetterRequest(
            'SAVE',
            this.taskId
          );
          try {
            await this.lawsuitService.updateNoticeLetter(lg, this.lawsuitService.noticeLetterRequest);
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${lg} ${this.translate.instant(
                'LAWSUIT.NOTICE.LETTER_SNANKBAR_SUB_CONTENT_SAVED'
              )}`
            );

            this.lawsuitService.hasEdit = false;
            // Reset litigationNotice data and Re-Calling for get litigationNotice API
            this.lawsuitService.litigationNotice = null;
            this.lawsuitService.litigationNotice = await this.lawsuitService.inquiryNotices(lg, this.taskId);
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'RECEIPT_ORIGINAL_DOCUMENT':
        case 'RECEIPT_REJECT_ORIGINAL_DOCUMENT':
          const documentInfo = this.documentService.getDocumentInfoRequest() as any;
          const payloadDocumentReceive = this.taskDetailService.getPayloadDocumentReceiveRequest(
            'SAVE',
            documentInfo,
            this.taskId
          );
          const responseReceiveDoc = await this.lawsuitService.receiveDocuments(lg, payloadDocumentReceive);
          if (responseReceiveDoc) {
            this.documentService.hasEdit = false;
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LG_ID_TEXT')}: ${lg} ${this.translate.instant(
                'TASK.LABEL_SAVED_DRAFT_RECEIPT_ORIGINAL_DOCUMENT_SUCCESS'
              )}`
            );
            this.documentService.updateDataAfterSave(documentInfo.receiveDocument);
          }
          // }
          break;
        case 'SUBMIT_ORIGINAL_DOCUMENT':
        case 'SUBMIT_REJECT_ORIGINAL_DOCUMENT':
          const reqInfoSend = this.documentService.getDocumentInfoRequest() as any;
          const requestSend = this.taskDetailService.getPayloadDocumentSendRequest('SAVE', reqInfoSend, this.taskId);
          const alertSend = await this.notificationService.warningDialog(
            'DOC_PREP.SENT_MSG_TITLE',
            'DOC_PREP.SENT_MSG',
            'DOC_PREP.SENT_MSG_BTN',
            'icon-Check-Square'
          );
          if (alertSend) {
            this.documentService.hasEdit = false;
            const responseSendDoc = await this.lawsuitService.sendDocuments(lg, requestSend);
            if (responseSendDoc) {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${lg} ${this.translate.instant('TASK.LABEL_SAVED')}`
              );
              this.documentService.updateDataAfterSave(reqInfoSend.sendDocument);
            }
          }
          break;
        case 'INDICTMENT_RECORD':
          const caseMapper = this.taskDetailService.getIndictmentRecordCaseMapper();
          const litigationCaseRequest = this.suitService.getLitigationCaseRequest('DRAFT', caseMapper);

          if (!(await this.validateLitigationCaseRequest(litigationCaseRequest))) return;

          try {
            const resp = await this.suitService.saveLitigationCase(this.taskId, litigationCaseRequest);
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${lg} ${this.translate.instant('TASK.LABEL_SAVED')}`
            );
            this.suitService.hasEdit = false;
            /**
             * after mark suitService hasEdit is false,
             * will be patch resposne data to this.suitService.litigationCase
             */
            this.suitService.litigationCaseDetail = resp;
            this.suitService.litigationCase.forEach(item => {
              item.cases = item.cases?.map((_case: any) => {
                if (_case.id === caseMapper.id) {
                  const _result = { ..._case, ...resp };
                  return _result;
                }
                return _case;
              });
            });
            this.litigationCaseGroupDto = [...this.suitService.litigationCase];
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'RECORD_DIAGNOSIS_DATE':
          try {
            const payloadCourtTrial = this.taskDetailService.getPayloadCourtTrial('SAVE', lg);
            let res: CourtTrialUpdateResponse = await this.trialService.updateCourtTrial(
              payloadCourtTrial,
              this.taskId
            );
            if (res.id === 0 && res.documentId === 0) {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${lg} ${this.translate.instant(
                  this.translate.instant('LAWSUIT.TRIAL.HEARING_DATE_SAVED_DRAFT')
                )}`
              );
              this.trialService.hasEdit = false;
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'RESPONSE_UNIT_MAPPING':
          try {
            const payloadResponseUnitMap = this.taskDetailService.getPayloadResponseUnitMap('SAVE', this.taskId);
            const res = await this.configurationService.postResponseUnitMapTasks(payloadResponseUnitMap);
            if (res) {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('CONFIGURATION.TOAST_SUCCESS_SAVE_DRAFT')}`
              ); // `${this.translate.instant('TASK.LABEL_SAVED')}`
              this.onBack();
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'RECORD_OF_APPEAL':
        case 'RECORD_OF_SUPREME_COURT':
        case 'UPLOAD_E_FILING':
          try {
            if (!!this.suitService.updateLitigationCaseDetail) {
              const request: CreateLitigationSubCaseRequest = {
                ...this.suitService.getCreateLitigationSubCaseRequest(
                  this.suitService.updateLitigationCaseDetail,
                  this.taskId
                ),
                headerFlag: LitigationCaseRequest.HeaderFlagEnum.Draft,
                isPlaintiff: this.statusCode === 'PENDING',
              };
              const mainLitigationCaseId = this.suitService.updateLitigationCaseDetail?.id ?? -1;
              const updatedSubCase =
                this.suitService.findEditableSubCase(this.suitService.updateLitigationCaseDetail) ?? {};

              if (this.taskCode === 'UPLOAD_E_FILING') {
                await this.suitService.updateLitigationReceipt(mainLitigationCaseId, updatedSubCase.id ?? -1, request);
              } else {
                await this.suitService.updateLitigationSubmitCourt(mainLitigationCaseId, request);
              }
            }
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${lg} ${this.translate.instant(
                `TASK.SUIT_EFILING.SUB_SUBMIT_SUCCESS_DRAFT_${this.statusCode}_${this.taskCode}`
              )}`
            );

            this.suitService.clearData();
            this.routerService.navigateTo('/main/task');
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'RECEIVE_ADVANCE_PAYMENT':
          try {
            this.dataForm = this.advanceService.generateAdvanceForm(this.advanceService.advance);
            this.dataForm.markAllAsTouched();
            this.dataForm.updateValueAndValidity();
            if (this.dataForm.valid) {
              [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map((element, index) => {
                for (let i = 0; i < element.length; i++) {
                  element[i].updateFlag = this.dataForm.get('advanceReceiveNo')?.value ? 'U' : 'A';
                }
              });
              let data = {
                ...this.dataForm.getRawValue(),
                createAdvancePayTransferInfo: (this.dataForm.get('createAdvancePayTransferInfo') as UntypedFormArray)
                  .value.value,
              };
              let request: CreateAdvanceReceivePayTransferRequest = Object.assign({ headerFlag: 'DRAFT' }, data);
              let res = await this.advanceService.createAdvanceReceive(this.taskId, request);
              if (res.success) {
                let litigationCaseIdList = JSON.parse(this.taskService.taskDetail.attributes || '') as string[];
                let advanceReceiveNo = this.dataForm.get('advanceReceiveNo')?.value
                  ? this.dataForm.get('advanceReceiveNo')?.value
                  : res.receiveNo || '';
                this.advanceService.advance = await this.advanceService.getAdvanceReceiveOrder(advanceReceiveNo);
                this.dataForm = this.advanceService.generateAdvanceForm(this.advanceService.advance);
                this.notificationService.openSnackbarSuccess(
                  `รายการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย ${advanceReceiveNo} บันทึกร่างสำเร็จแล้ว`
                );
                this.advanceService.hasEdit = false;
              }
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'CONSIDER_APPEAL':
          await this.courtService.saveDarftCourtAppeal(this.taskCode);
          break;
        case 'REQUEST_DEFERMENT':
        case 'EXTEND_DEFERMENT':
        case 'REQUEST_CESSATION':
          if (
            this.taskDetailService.defermentState === 'NORMAL_PENDING_APPROVED' ||
            this.taskDetailService.defermentState === 'DEFERMENT_PENDING_APPROVED' ||
            this.taskDetailService.defermentState === 'CESSATION_PENDING_APPROVED'
          ) {
            const context = {
              taskId: this.taskId,
              taskCode: this.taskCode,
              mode: this.taskMode.mode,
              advanceReceiveNo: 'string',
              cancelReason: 'string',
              cancelReasonOther: 'string',
              action: 'REVISE',
              customerId: this.litigationDetail?.customerId || '',
              litigationId: this.litigationDetail?.litigationId || '',
              litigationCaseId: this.taskService.taskDetail.litigationCaseId,
              showMsgContent: false,
              maxTextArea: 500,
              showFieldContent: true,
              fieldContentText: this.translate.instant('LAWSUIT.DEFERMENT.REQUESTER'),
              fieldContentValue: this.defermentService.deferment.deferment?.createdByName,
            };
            const dialogSetting: DialogOptions = {
              component: RejectDialogComponent,
              title: 'COMMON.BUTTON_SEND_BACK_EDIT',
              iconName: 'icon-Reset',
              rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
              rightButtonClass: 'mat-warn long-button',
              buttonIconName: 'icon-Reset',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              context: context,
            };
            await this.notificationService.showCustomDialog(dialogSetting);
          }
          break;
        case 'AUTO_CREATE_DRAFT_DEFERMENT':
        case 'AUTO_CREATE_DRAFT_CESSATION':
          try {
            if (this.taskCode === 'AUTO_CREATE_DRAFT_DEFERMENT') {
              if (!await this.checkDefermentValidity()) return;
            }
            await this.saveDeferment(
              this.taskCode === 'AUTO_CREATE_DRAFT_DEFERMENT'
                ? SaveDefermentRequest.DefermentTypeEnum.Deferment
                : SaveDefermentRequest.DefermentTypeEnum.Cessation,
              SaveDefermentRequest.HeaderFlagEnum.Draft
            );
            if (this.taskCode === 'AUTO_CREATE_DRAFT_DEFERMENT') {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${lg} ${this.translate.instant(
                  'TASK.REJECT_DIALOG.DEFERMENT_DRAFT_SAVED'
                )}`
              );
            } else {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${lg} ${this.translate.instant(
                  'TASK.REJECT_DIALOG.CESSATION_DRAFT_SAVED'
                )}`
              );
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'REQUEST_REVISE_CESSATION':
        case 'REQUEST_REVISE_DEFERMENT':
        case 'SAVE_DRAFT_DEFERMENT':
        case 'SAVE_DRAFT_CESSATION':
          try {
            if (['REQUEST_REVISE_DEFERMENT', 'SAVE_DRAFT_DEFERMENT'].includes(this.taskCode)) {
              if (!await this.checkDefermentValidity()) return;
            }
            await this.saveDeferment(
              this.taskCode === 'SAVE_DRAFT_DEFERMENT' || this.taskCode === 'REQUEST_REVISE_DEFERMENT'
                ? SaveDefermentRequest.DefermentTypeEnum.Deferment
                : SaveDefermentRequest.DefermentTypeEnum.Cessation,
              SaveDefermentRequest.HeaderFlagEnum.Draft
            );
            if (this.taskCode === 'SAVE_DRAFT_DEFERMENT') {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${lg} ${this.translate.instant(
                  'TASK.REJECT_DIALOG.DEFERMENT_DRAFT_SAVED'
                )}`
              );
            } else if (this.taskCode === 'SAVE_DRAFT_CESSATION') {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${lg} ${this.translate.instant(
                  'TASK.REJECT_DIALOG.CESSATION_DRAFT_SAVED'
                )}`
              );
            } else if (this.taskCode === 'REQUEST_REVISE_DEFERMENT') {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${lg} ${this.translate.instant(
                  'TASK.REJECT_DIALOG.DEFERMENT_DRAFT_SAVED'
                )}`
              );
            } else {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${lg} ${this.translate.instant(
                  'TASK.REJECT_DIALOG.REVISE_CESSATION_DRAFT_SAVED'
                )}`
              );
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'R2E07-02-B':
        case 'R2E07-03-C':
          // REVISE
          const deferment = this.defermentService?.deferment?.deferment;
          const context = {
            taskId: this.taskId,
            taskCode: this.taskCode,
            mode: this.taskMode.mode,
            advanceReceiveNo: 'string',
            cancelReason: 'string',
            cancelReasonOther: 'string',
            action: 'REVISE',
            customerId:
              this.taskMode.mode === 'LITIGATION'
                ? this.litigationDetail?.customerId || ''
                : this.customerDetail?.customerId || '',
            litigationId: this.litigationDetail?.litigationId || '',
            litigationCaseId: this.taskService.taskDetail.litigationCaseId,
            maxTextArea: 500,
            showFieldContent: true,
            fieldContentText: this.translate.instant('LAWSUIT.DEFERMENT.REQUESTER'),
            fieldContentValue: deferment?.createdByName,
          };
          const dialogSetting: DialogOptions = {
            component: RejectDialogComponent,
            title: 'COMMON.BUTTON_SEND_BACK_EDIT',
            iconName: 'icon-Reset',
            rightButtonLabel: 'TASK.REJECT_DIALOG.BTN_CONFIRM_REJECT_FOR_EDIT',
            rightButtonClass: 'mat-warn long-button',
            buttonIconName: 'icon-Reset',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            context: context,
          };
          await this.notificationService.showCustomDialog(dialogSetting);
          break;
        case 'R2E07-04-D':
        case 'R2E07-01-A':
          try {
            this.setDocumentToForm();
            let request: SaveDefermentExecRequest = {
              customerId: this.lawsuitService.currentLitigation.customerId || '',
              defermentExecItem: {
                ...this.defermentForm.value,
                collaterals: this.defermentService.getSelectedCollaterals.collaterals,
                collateralDeedGroups: this.defermentService.getSelectedCollaterals.collateralDeedGroups,
                collateralNoAnnounceAuctions: this.defermentService.getSelectedCollaterals.collateralNoAnnounceAuctions,
              },
              headerFlag: 'DRAFT',
              taskId: this.taskId,
              litigationId: this.lawsuitService.currentLitigation.litigationId,
            };
            if (this.defermentForm.value.extendDeferment && request.defermentExecItem) {
              request.defermentExecItem.extendDefermentId = this.defermentForm.value?.defermentId;
            }
            const res = await this.defermentService.saveCustomerDefermentExec(request);
            const msg = this.defermentService.deferment.deferment?.extendDeferment
              ? this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_EXTEND_SAVE_DRAFT_SUCCESS')
              : this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_SAVE_DRAFT_SUCCESS');
            this.notificationService.openSnackbarSuccess(msg);
            this.clearConfirmExitWithoutSave();
            const defermentExecInfo = this.lawsuitService.currentLitigation?.defermentExecInfo;
            const resInquiry = (await this.defermentService.inquiryDefermentExec({
              customerId: this.lawsuitService.currentLitigation.customerId || '',
              defermentId: res?.defermentId || '',
              defermentType: res?.defermentType as SaveDefermentExecResponse.DefermentTypeEnum,
              litigationId: this.lawsuitService.currentLitigation.litigationId,
              mode: 'EDIT',
              taskId: this.taskId,
            })) as DefermentExecDto;
            this.defermentService.deferment = resInquiry;
          } catch (e) {}
          break;
        case 'R2E07-05-E':
          try {
            this.setDocumentToForm();
            const res = await this.defermentService.saveAnnounceSuspendAuction({
              customerId: this.lawsuitService.currentLitigation.customerId || '',
              defermentExecItem: {
                ...this.defermentForm.value,
                collaterals: this.defermentService.selectedSeizureProperties,
              },
              headerFlag: 'DRAFT',
              taskId: this.taskId,
            });
            this.defermentForm.markAsPristine();
            this.defermentForm.updateValueAndValidity();
            this.notificationService.openSnackbarSuccess(
              this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_STATEMENT_DRAFT_SUCCESS')
            );
          } catch (e) {}
          break;
        default:
          break;
      }
    }
    this.taskDetailService.resetHasEdit();
  }

  get deceasePersonId() {
    const _attr = this.taskService.taskDetail.attributes || '{}';
    !!_attr.startsWith('{') && !!_attr.endsWith('}');
    const taskDetailAttributes = !!_attr.startsWith('{') && !!_attr.endsWith('}') ? JSON.parse(_attr) : _attr;
    const deceasePersonId: string = taskDetailAttributes?.deceasePersonId || '';
    return deceasePersonId;
  }

  get personObj() {
    const litigationDetail: LitigationDetailDto = this.taskService.litigationDetail || {};
    const personObj: PersonDto =
      litigationDetail && litigationDetail.personInfo
        ? litigationDetail.personInfo?.persons?.find(obj => obj.personId == this.deceasePersonId) || {}
        : {};
    return personObj;
  }

  async onSubmit() {
    this.logger.info('onSubmit for :: ', this.taskMode.mode, ' :: taskCode :: ', this.taskCode);

    if (!!!this.taskId) {
      this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      return;
    }
    // clear value for check confirmExitWithoutSave
    this.clearConfirmExitWithoutSave();

    if (this.taskMode.mode === 'CUSTOMER') {
      switch (this.taskCode) {
        case 'VERIFY_INFO_AND_DOCUMENT': // For DOCUMENT PREPARATION Flow
          const payloadDocInfo = this.taskDetailService.getPayloadDocumentInfoRequest('SUBMIT', this.taskId);
          if (!!payloadDocInfo) {
            try {
              await this.documentService.updateDocumentsCustomer(payloadDocInfo);
              this.routerService.navigateTo('/main/task');
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_CIF_NUMBER')}: ${
                  this.documentService?.customer?.customerId
                } ${this.translate.instant('TASK.LABEL_VERIFY_INFO_AND_DOCUMENT_SUCCESS')}`
              );
              this.documentService.clearData();
            } catch (e) {
              this.logger.catchError(this.taskCode, e);
            }
          }
          break;
        default:
          await this.submitApproveTask();
          break;
      }
    } else if (this.taskMode.mode === 'FINANCE_EXPENSE') {
      if (
        this.taskCode === 'EXPENSE_CLAIM_CORRECTION' ||
        this.taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD' ||
        this.taskCode === 'EXPENSE_CLAIM_VERIFICATION' ||
        this.taskCode === 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT' ||
        this.taskCode === 'REVERSE_EXPENSE_CLAIM_OTHER'
      ) {
        this.expenseService.onSubmit(
          this.taskCode,
          this.taskId,
          this.taskService.taskDetail.statusCode || '',
          this.createPaymentBook?.paymentList,
          this.paymentBookForm
        );
        this.actionBarEventName = this.expenseService.actionBarEventName;
      } else {
        const isContinue = await this.notificationService.warningDialog(
          'DIALOG_ALERT.TITLE_CONFIRM_SEND_INFO',
          'DIALOG_ALERT.MESSAGE_CONFIRM_SEND_INFO',
          'DIALOG.CONFIRM_BUTTON_CONFIRM',
          'icon-Selected'
        );
        if (isContinue) {
          const request = this.expenseService.getExpenseApprovalRequest(
            {
              ...this.paymentBookForm.getRawValue(),
              expenseTransactionDto: this.expenseService.expenseTransactionRequest,
            },
            'SUBMIT'
          );
          await this.expenseService.approve(this.taskId, request);
          let suffixBannerText = 'FINANCE.MESSAGE_SECCESS_SUBMIT_PAYMENT_LIST';
          if (this.statusCode === 'PENDING' && this.taskCode === 'EXPENSE_CLAIM_PAYMENT_APPROVAL') {
            suffixBannerText = 'FINANCE.APPROVE_BANNER_MSG_SUCCESS';
          }
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('เลขที่หนังสือเบิกจ่ายเงิน')}: ${this.expenseObjectId} ${this.translate.instant(
              suffixBannerText
            )}`
          );
          this.onBack();
        }
      }
    } else {
      const litigationDetail: LitigationDetailDto = this.taskService.litigationDetail || {};
      const litigationId = litigationDetail?.litigationId || '';
      const taskId = this.taskService.taskDetail?.id || 0;
      const deferment = this.defermentService?.deferment?.deferment;
      /* for approver role - Approve/Reject data modification on Persons or Assets (on Litigation detail screen) */
      /** taskCode >> CHANGE_RELATED_PERSON, EDIT_MORTGAGE_ASSETS */

      switch (this.taskCode) {
        case 'RECORD_NOTICE':
        case 'RECORD_NOTICE_GUARANTOR':
          if (this.lawsuitService.checkConditionUpdateNoticeLetter(this.lawsuitService.updateLitigationNoticeDtoList)) {
            this.lawsuitService.noticeLetterRequest = this.taskDetailService.getPayloadNoticeLetterRequest(
              'SUBMIT',
              this.taskId
            );
            try {
              await this.lawsuitService.updateNoticeLetter(litigationId, this.lawsuitService.noticeLetterRequest);
              const textSuccess =
                this.taskCode === 'RECORD_NOTICE_GUARANTOR'
                  ? 'LAWSUIT.NOTICE.LETTER_GUARANTOR_SNANKBAR_SUB_CONTENT_SAVED'
                  : 'LAWSUIT.NOTICE.LETTER_SNANKBAR_SUB_CONTENT_SAVED_2';
              this.notificationService.openSnackbarSuccess(
                `LG ID: ${litigationId} ${this.translate.instant(textSuccess)}`
              );
              this.lawsuitService.clearData();
              this.onBack();
            } catch (e) {
              this.logger.catchError(this.taskCode, e);
            }
          } else {
            //ตรวจสอบกรณีจำเลย ตาย หรือ ล้มละลาย จะไม่ยอมให้บันทึก
            this.lawsuitService.validateNoticeNoHeir();

            await this.notificationService.alertDialog(
              'LAWSUIT.NOTICE.LETTER_ALERT_DIALOG_TITLE',
              'LAWSUIT.NOTICE.LETTER_ALERT_DIALOG_CONTENT',
              'LAWSUIT.NOTICE.LETTER_ALERT_DIALOG_BACK',
              'icon-Refresh'
            );
          }
          break;
        case 'SEND_AND_TRACK_NOTICE':
        case 'SEND_AND_TRACK_NOTICE_GUARANTOR':
          const trackingReponse = await this.lawsuitService.updateTracking(this.lawsuitService.trackingRequest);
          if (trackingReponse.successCount || trackingReponse.successCount === 0) {
            this.notificationService.openSnackbarSuccess(
              trackingReponse.successCount +
                ' ' +
                this.translate.instant('TASK.SUBMIT_NOTICE_LETTER.UPDATE_MESSAGE_COMPLETED')
            );
            this.lawsuitService.clearData();
            this.onBack();
          } else {
            this.notificationService.openSnackbarError(
              this.translate.instant('TASK.SUBMIT_NOTICE_LETTER.UPDATE_MESSAGE_FAIL')
            );
          }
          break;
        case 'CONFIRM_NOTICE_LETTER':
          if (
            this.taskService.taskDetail.statusCode === 'PENDING' ||
            this.lawsuitService.checkConditionUpdateNoticeConfirmLetter(
              this.lawsuitService.updateLitigationNoticeDtoList
            )
          ) {
            try {
              if (this.lawsuitService.postalRequest?.notices?.length > 0) {
                await this.lawsuitService.updatePostal(litigationId, this.lawsuitService?.postalRequest);
              }
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${litigationId} ${this.translate.instant(
                  'LAWSUIT.NOTICE.CONFIRM_LETTER_SNANKBAR_SUB_CONTENT_SAVED'
                )}`
              );
              this.lawsuitService.clearData();
              this.onBack();
            } catch (e) {
              this.logger.catchError(this.taskCode, e);
            }
          } else {
            await this.notificationService.alertDialog(
              'LAWSUIT.NOTICE.CONFIRM_LETTER_ALERT_DIALOG_TITLE',
              'LAWSUIT.NOTICE.CONFIRM_LETTER_ALERT_DIALOG_CONTENT',
              'LAWSUIT.NOTICE.LETTER_ALERT_DIALOG_BACK',
              'icon-Refresh'
            );
          }
          break;
        case 'NEWSPAPER_ANNOUCEMENT':
          //ตรวจสอบกรณีจำเลย ตาย หรือ ล้มละลาย จะไม่ยอมให้บันทึก
          this.lawsuitService.validateNoticeNoHeir();

          if (this.taskDetail.statusCode === statusCode.FAILED) {
            // Step ส่งหนังสือบอกกล่าวไม่สำเร็จ
            try {
              this.lawsuitService.createNews(this.lawsuitService.createNewsRequest);
              this.lawsuitService.clearData();
              this.onBack();
            } catch (e) {
              this.logger.catchError(this.taskCode, e);
            }
          } else {
            try {
              this.lawsuitService.newsAnnouncementRequest = {
                notices: this.lawsuitService.newsAnnouncementRequest.notices,
                headerFlag: NewsAnnouncementRequest.HeaderFlagEnum.Submit,
                taskId: this.taskId,
              };

              if (this.lawsuitService.newsAnnouncementRequest?.notices?.length > 0) {
                await this.lawsuitService.updateNewsAnnouncement(
                  litigationId,
                  this.lawsuitService.newsAnnouncementRequest
                );
              }
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${litigationId} ${this.translate.instant(
                  'LAWSUIT.NOTICE.NEWS_SNANKBAR_SUB_CONTENT_SAVED'
                )}`
              );
              this.lawsuitService.clearData();
              this.onBack();
            } catch (e) {
              this.logger.catchError(this.taskCode, e);
            }
          }
          break;
        case 'RECEIPT_ORIGINAL_DOCUMENT':
        case 'RECEIPT_REJECT_ORIGINAL_DOCUMENT':
          const documentInfo = this.documentService.getDocumentInfoRequest(this.taskId) as any;
          const payloadDocumentReceive = this.taskDetailService.getPayloadDocumentReceiveRequest(
            'SUBMIT',
            documentInfo,
            this.taskId
          );
          if (
            this.taskCode === 'RECEIPT_REJECT_ORIGINAL_DOCUMENT' ||
            this.documentService.checkConditionReceivesent(this.taskCode, documentInfo)
          ) {
            this.documentService.hasEdit = false;
            const alertReceive = await this.notificationService.warningDialog(
              'DOC_PREP.RECIEVE_MSG_TITLE',
              'DOC_PREP.RECIEVE_MSG',
              'DOC_PREP.RECIEVE_MSG_BTN',
              'icon-Check-Square'
            );
            if (alertReceive) {
              const resReceive = await this.lawsuitService.receiveDocuments(litigationId, payloadDocumentReceive);
              if (resReceive?.taskStatus === 'FINISHED') {
                if (resReceive.hasLogisticDoc) {
                  const dialogSetting: DialogOptions = {
                    component: DownloadCopyDialogComponent,
                    title: 'ดาวน์โหลดใบปะหน้าเอกสารที่ส่งคืน DIMS',
                    iconName: 'icon-Download',
                    rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
                    rightButtonClass: 'long-button',
                    buttonIconName: 'icon-Selected',
                    context: {
                      data:
                        resReceive?.additionalDocuments ||
                        this.lawsuitService.currentLitigation.additionalDocuments ||
                        [],
                      litigationId: litigationId,
                    },
                  };
                  const confirm = await this.notificationService.showCustomDialog(dialogSetting);
                  if (!confirm) {
                    return;
                  }
                }
                this.onBack();
                this.notificationService.openSnackbarSuccess(
                  `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${litigationId} ${this.translate.instant(
                    'TASK.LABEL_RECEIPT_ORIGINAL_DOCUMENT_SUCCESS'
                  )}`
                );
                this.documentService.clearData();
              } else {
                this.notificationService.alertDialog(
                  'DOC_PREP.CANT_FINISH_TASK',
                  'DOC_PREP.RECIEVE_WARNING_MSG',
                  'COMMON.BUTTON_ACKNOWLEDGE',
                  'icon-Check-Square'
                );
              }
            }
          }
          break;
        case 'SUBMIT_ORIGINAL_DOCUMENT':
        case 'SUBMIT_REJECT_ORIGINAL_DOCUMENT':
          const reqInfoSend = this.documentService.getDocumentInfoRequest(this.taskId) as any;
          const requestSend = this.taskDetailService.getPayloadDocumentSendRequest('SUBMIT', reqInfoSend, this.taskId);
          if (
            this.taskCode === 'SUBMIT_REJECT_ORIGINAL_DOCUMENT' ||
            this.documentService.checkConditionReceivesent(this.taskCode, reqInfoSend)
          ) {
            this.documentService.hasEdit = false;
            const resSend = await this.lawsuitService.sendDocuments(litigationId, requestSend);
            if (resSend?.taskStatus === 'FINISHED') {
              this.routerService.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${litigationId} ${this.translate.instant(
                  'TASK.LABEL_SUBMIT_ORIGINAL_DOCUMENT_SUCCESS'
                )}`
              );
              this.documentService.clearData();
            } else {
              this.notificationService.alertDialog(
                'DOC_PREP.CANT_FINISH_TASK',
                'DOC_PREP.SENT_WARNING_MSG',
                'COMMON.BUTTON_ACKNOWLEDGE',
                'icon-Check-Square'
              );
            }
          }
          break;
        case 'INDICTMENT_RECORD':
          if (this.statusCode === 'PENDING_APPROVAL' && this.sessionService.isUserApprover()) {
            const _customerId = this.taskDetail.customerId || this.litigationDetail?.customerId || '';
            try {
              await this.suitService.litigationCaseApprove(this.taskId);
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_CIF_NO')}: ${_customerId} ${this.translate.instant(
                  'TASK.REJECT_DIALOG.APPROVED_SUCCESS'
                )}`
              );
              this.routerService.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
            } catch (error) {
              this.notificationService.openSnackbarError(
                this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_APPROVED')
              );
            }
          } else {
            const caseMapper = this.taskDetailService.getIndictmentRecordCaseMapper();
            const litigationCaseRequest = this.suitService.getLitigationCaseRequest('SUBMIT', caseMapper);

            if (!(await this.validateLitigationCaseRequest(litigationCaseRequest))) return;

            try {
              await this.suitService.saveLitigationCase(this.taskId, litigationCaseRequest);
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${litigationId} ${this.translate.instant(
                  'LAWSUIT.SUIT.INDICTMENT_RECORD_SUB_SAVED_1'
                )}`
              );
              this.suitService.hasEdit = false;
              this.onBack();
            } catch (e) {
              this.logger.catchError(this.taskCode, e);
            }
          }
          break;
        case 'CONFIRM_COURT_FEES_PAYMENT':
          // if (!this.suitService.isSubmitConfirmCourtFeesPayment(this.suitService.litigationCase)) {
          //   await this.notificationService.alertDialog(
          //     'LAWSUIT.SUIT.CONFIRM_COURT_FEES_PAYMENT_ALERT_DIALOG_TITLE',
          //     'LAWSUIT.SUIT.CONFIRM_COURT_FEES_PAYMENT_ALERT_DIALOG_CONTENT',
          //     'LAWSUIT.SUIT.UPLOAD_ALERT_DIALOG_BACK',
          //     'icon-Refresh');
          //   return;
          // }
          try {
            if (!this.suitService.paymentConfirmRequest) {
              await this.notificationService.alertDialog(
                'LAWSUIT.SUIT.CONFIRM_COURT_FEES_PAYMENT_ALERT_DIALOG_TITLE',
                'LAWSUIT.SUIT.CONFIRM_COURT_FEES_PAYMENT_ALERT_DIALOG_CONTENT',
                'LAWSUIT.SUIT.UPLOAD_ALERT_DIALOG_BACK',
                'icon-Refresh'
              );
              return;
            }
            this.suitService.paymentConfirmRequest.headerFlag = 'SUBMIT';
            await this.suitService.confirmPayment(this.taskId, this.suitService.paymentConfirmRequest);
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${litigationId} ${this.translate.instant(
                'LAWSUIT.SUIT.CONFIRM_COURT_FEES_PAYMENT_SUB_SAVED_1'
              )}`
            );
            this.suitService.clearData();
            this.onBack();
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'UPLOAD_COURT_FEES_RECEIPT':
          // if (!this.suitService.isSubmitUploadCourtFeesReceipt(this.suitService.litigationCase)) {
          //   await this.notificationService.alertDialog(
          //     'LAWSUIT.SUIT.UPLOAD_COURT_FEES_RECEIPT_ALERT_DIALOG_TITLE',
          //     'LAWSUIT.SUIT.UPLOAD_COURT_FEES_RECEIPT_ALERT_DIALOG_CONTENT',
          //     'LAWSUIT.SUIT.UPLOAD_ALERT_DIALOG_BACK',
          //     'icon-Refresh');
          //   return;
          // }
          try {
            if (!this.suitService.payCourtFeeReceiptRequest) {
              await this.notificationService.alertDialog(
                'LAWSUIT.SUIT.UPLOAD_COURT_FEES_RECEIPT_ALERT_DIALOG_TITLE',
                'LAWSUIT.SUIT.UPLOAD_COURT_FEES_RECEIPT_ALERT_DIALOG_CONTENT',
                'LAWSUIT.SUIT.UPLOAD_ALERT_DIALOG_BACK',
                'icon-Refresh'
              );
              return;
            }
            this.suitService.payCourtFeeReceiptRequest.headerFlag = 'SUBMIT';
            await this.suitService.updateReceipt(this.taskId, this.suitService.payCourtFeeReceiptRequest);
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${litigationId} ${this.translate.instant(
                'LAWSUIT.SUIT.UPLOAD_COURT_FEES_RECEIPT_SUB_SAVED_1'
              )}`
            );
            this.suitService.clearData();
            this.onBack();
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'CONSIDER_REMAINING_COSTS':
        case 'CONSIDER_APPROVE_CLOSE_LG':
          await this.submitApproveTask();
          break;
        case 'AUTO_CREATE_DRAFT_DEFERMENT':
          let isCommitmentAccountDeferment = this.defermentService.checkCommitmentAccount(this.defermentState);
          if (isCommitmentAccountDeferment) {
            let isDocumentValid = this.isDocumentValid();
            const body: SaveDefermentRequest = {
              customerId: this.litigationDetail?.customerId || '',
              defermentItem: this.defermentForm.value,
              defermentType: SaveDefermentRequest.DefermentTypeEnum.Deferment,
              headerFlag: SaveDefermentRequest.HeaderFlagEnum.Submit,
              taskId: this.taskId,
            };
            if (this.defermentForm.valid && isDocumentValid) {
              this.defermentForm.markAllAsTouched();
              this.defermentForm.updateValueAndValidity();
              try {
                this.setDocumentToForm();
                this.documentService.hasEdit = false;
                if (!await this.checkDefermentValidity()) return;

                await this.defermentService.saveCustomerDeferment(body);
                this.notificationService.openSnackbarSuccess(
                  `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${
                    this.litigationDetail?.litigationId
                  } ${this.translate.instant('TASK.REJECT_DIALOG.DEFERMENT_SUCCESS')}`
                );
                this.onBack();
              } catch (e) {
                this.logger.catchError('CATCH ERROR saveLitigationCase :: ', e);
              }
            }
          }
          break;
        case 'AUTO_CREATE_DRAFT_CESSATION':
          let isCommitmentAccountCessation = this.defermentService.checkCommitmentAccount(this.defermentState);
          if (isCommitmentAccountCessation) {
            let isDocumentValid = this.isDocumentValid();
            const body: SaveDefermentRequest = {
              customerId: this.litigationDetail?.customerId || '',
              defermentItem: this.defermentForm.value,
              defermentType: SaveDefermentRequest.DefermentTypeEnum.Cessation,
              headerFlag: SaveDefermentRequest.HeaderFlagEnum.Submit,
              taskId: this.taskId,
            };
            if (this.defermentForm.valid && isDocumentValid) {
              this.defermentForm.markAllAsTouched();
              this.defermentForm.updateValueAndValidity();
              try {
                this.setDocumentToForm();
                this.documentService.hasEdit = false;
                await this.defermentService.saveCustomerDeferment(body);
                this.notificationService.openSnackbarSuccess(
                  `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${
                    this.litigationDetail?.litigationId
                  } ${this.translate.instant('TASK.REJECT_DIALOG.CESSATION_SUCCESS')}`
                );
                this.onBack();
              } catch (e) {
                this.logger.catchError('CATCH ERROR saveLitigationCase :: ', e);
              }
            }
          }
          break;
        case 'RECORD_DIAGNOSIS_DATE':
          try {
            const payloadCourtTrial = this.taskDetailService.getPayloadCourtTrial('SUBMIT', litigationId);
            let res: CourtTrialUpdateResponse = await this.trialService.updateCourtTrial(
              payloadCourtTrial,
              this.taskId
            );
            if (res.id === 0 && res.documentId === 0) {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${litigationId} ${this.translate.instant(
                  'LAWSUIT.TRIAL.SAVED_HEARING_DATE'
                )}`
              );
              this.trialService.hasEdit = false;
              this.routerService.navigateTo('/main/task');
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'MEMORANDUM_COURT_FIRST_INSTANCE':
        case 'MEMORANDUM_COURT_APPEAL':
        case 'MEMORANDUM_SUPREME_COURT':
          if (this.statusCode === 'PENDING_APPROVAL' || this.statusCode === 'AWAITING') {
            if (this.statusCode === 'AWAITING') {
              if (this.courtService.courtVerdictForm.get('acknowledgement')?.value || this.taskCode) {
                await this.courtService.approve(this.taskId);
                this.notificationService.openSnackbarSuccess(
                  this.translate.instant('TASK.REJECT_DIALOG.ACKNOW_MEMO_COURT_FIRST_INSTANCE_SUCCESS', {
                    LG_ID: this.litigationDetail?.litigationId || '',
                  })
                );
                this.courtService.hasEdit = false;
                this.onBack();
              } else {
                this.courtService.courtVerdictForm.get('acknowledgement')?.markAllAsTouched();
                break;
              }
            } else {
              await this.courtService.approve(this.taskId);
              this.notificationService.openSnackbarSuccess(
                this.translate.instant('TASK.REJECT_DIALOG.APPROVED_MEMO_COURT_FIRST_INSTANCE_SUCCESS', {
                  LG_ID: this.litigationDetail?.litigationId || '',
                })
              );
              this.courtService.hasEdit = false;
              this.onBack();
            }
          } else {
            let updated = this.courtService.alreadyUpdateCourt();
            if (updated) {
              const warning = await this.notificationService.warningDialog(
                'COURT.COMFIRM_MSG_TITLE',
                'COURT.COMFIRM_MSG',
                'COURT.COMFIRM_BTN',
                'icon-Check-Square'
              );
              if (warning) {
                const req = this.courtService.getCourtVerdictoRequest();
                const request: CourtVerdictDto = {
                  ...req,
                  headerFlag: CourtVerdictDto.HeaderFlagEnum.Submit,
                };
                await this.courtService.updateCourtVerdict(request);
                this.courtService.hasEdit = false;
                this.notificationService.openSnackbarSuccess(
                  this.translate.instant('EXCEPTION_CONFIG.MESSAGE_LG_ID_REQUEST_APPROVE', { LG_ID: litigationId })
                );
                this.onBack();
              }
            } else {
              await this.notificationService.alertDialog(
                'ไม่สามารถเสร็จสิ้นบันทึกผลการดำเนินคดี',
                'กรุณากรอกข้อมูลผลการดำเนินคดีให้ครบถ้วน เพื่อดำเนินการต่อ',
                'COMMON.BUTTON_ACKNOWLEDGE',
                'icon-Check-Square'
              );
            }
          }
          break;
        case 'CONSIDER_APPEAL':
        case 'CONDITIONAL_APPEAL':
          if (this.statusCode === 'PENDING_APPROVAL') {
            await this.courtService.approve(this.taskId);
            this.notificationService.openSnackbarSuccess(
              this.translate.instant('TASK.REJECT_DIALOG.APPROVED_CONSIDER_APPEAL_SUCCESS', {
                LG_ID: this.litigationDetail?.litigationId || '',
              })
            );
            this.routerService.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
          } else {
            if (!!!this.courtService.courtAppealBundle) {
              const caseCourtAppeal = this.courtService.courtResult
                .filter(item => item.courtLevel === 'CIVIL')
                .find(court => !(!!court.courtAppeal?.finishedAppeal && !!court.courtAppeal?.appealPurpose));
              await this.courtResolver.initConsiderAppealData(
                caseCourtAppeal?.courtAppeal?.litigationCaseId || 0,
                caseCourtAppeal?.courtAppeal?.litigationId || '',
                this.taskId
              );
            }
            let courtAppealReq: CourtAppealDto = {
              ...this.courtService.courtAppealBundle?.courtAppeal,
              headerFlag: CourtVerdictDto.HeaderFlagEnum.Submit,
            };
            courtAppealReq.deductionForGuarantor = Number(courtAppealReq.deductionForGuarantor) === 0 ? true : false;
            courtAppealReq.courtAppealDocuments = courtAppealReq?.courtAppealDocuments?.filter(
              el => el.imageId && el.imageId !== ''
            );
            if (this.courtService.validateCourtAppeal(this.taskCode, courtAppealReq)) {
              const courtAppealRes = await this.courtService.updateCourtAppeal(courtAppealReq, this.taskId);
              if (courtAppealRes === null) {
                this.notificationService.openSnackbarSuccess(
                  this.translate.instant('EXCEPTION_CONFIG.MESSAGE_LG_ID_REQUEST_APPROVE', {
                    LG_ID: courtAppealReq.litigationId,
                  })
                );
                this.onBack();
              }
            } else {
              this.notificationService.alertDialog(
                `EXCEPTION_CONFIG.TITLE_ERROR_${this.taskCode}`,
                `EXCEPTION_CONFIG.MESSAGE_ERROR_${this.taskCode}`
              );
            }
          }
          break;
        case 'APPROVE_APPEAL':
        case 'APPROVE_SUPREME_COURT':
          if (this.statusCode === 'PENDING_APPROVAL') {
            if (!!!this.courtService.courtAppealBundle) {
              const caseCourtAppeal =
                this.taskCode === 'APPROVE_APPEAL'
                  ? this.courtService.courtResult
                      .filter((item: any) => item.courtLevel === 'CIVIL')
                      .find(
                        (court: any) => !(!!court.courtAppeal?.finishedAppeal && !!court.courtAppeal?.appealPurpose)
                      )
                  : this.courtService.courtResult
                      .filter((item: any) => item.courtLevel === 'APPEAL')
                      .find(
                        (court: any) => !(!!court.courtAppeal?.finishedAppeal && !!court.courtAppeal?.appealPurpose)
                      );
              if (!!!caseCourtAppeal) {
                this.notificationService.alertDialog(
                  `EXCEPTION_CONFIG.TITLE_ERROR_${this.taskCode}`,
                  `EXCEPTION_CONFIG.MESSAGE_ERROR_${this.taskCode}`
                );
                return;
              }
              await this.courtResolver.initConsiderAppealData(
                caseCourtAppeal?.courtAppeal?.litigationCaseId || 0,
                caseCourtAppeal?.courtAppeal?.litigationId || '',
                this.taskId
              );
            }
            let courtAppealReq: CourtAppealDto = {
              ...this.courtService.courtAppealBundle?.courtAppeal,
              headerFlag: CourtVerdictDto.HeaderFlagEnum.Submit,
            };
            if (typeof courtAppealReq.deductionForGuarantor !== 'boolean') {
              courtAppealReq.deductionForGuarantor = Number(courtAppealReq.deductionForGuarantor) === 0 ? true : false;
            } else {
              courtAppealReq.deductionForGuarantor = courtAppealReq.deductionForGuarantor;
            }
            courtAppealReq.courtAppealDocuments = courtAppealReq?.courtAppealDocuments?.filter(
              el => el.imageId && el.imageId !== ''
            );
            if (!!courtAppealReq && this.courtService.validateCourtAppeal(this.taskCode, courtAppealReq)) {
              await this.courtService.downloadOrderLetter(Number(this.taskDetail?.litigationCaseId || ''), this.taskId);
              await this.courtService.approveAppeal(this.taskId, courtAppealReq);
              this.notificationService.openSnackbarSuccess(
                this.translate.instant('TASK.REJECT_DIALOG.APPROVED_CONSIDER_APPEAL_SUCCESS', {
                  LG_ID: this.litigationDetail?.litigationId || '',
                })
              );
              this.routerService.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
            } else {
              this.notificationService.alertDialog(
                `EXCEPTION_CONFIG.TITLE_ERROR_${this.taskCode}`,
                `EXCEPTION_CONFIG.MESSAGE_ERROR_${this.taskCode}`
              );
            }
          }
          break;
        case 'CONSIDER_SUPREME_COURT':
        case 'CONDITIONAL_SUPREME_COURT':
          if (this.statusCode === 'PENDING_APPROVAL') {
            await this.courtService.approve(this.taskId);
            this.notificationService.openSnackbarSuccess(
              this.translate.instant('TASK.REJECT_DIALOG.APPROVED_CONSIDER_SUPREME_SUCCESS', {
                LG_ID: this.litigationDetail?.litigationId || '',
              })
            );
            this.routerService.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
          } else {
            if (!!!this.courtService.courtAppealBundle) {
              const caseCourtAppeal = this.courtService.courtResult
                .filter(item => item.courtLevel === 'CIVIL')
                .find(court => !(!!court.courtAppeal?.finishedAppeal && !!court.courtAppeal?.appealPurpose));
              await this.courtResolver.initConsiderAppealData(
                caseCourtAppeal?.courtAppeal?.litigationCaseId || 0,
                caseCourtAppeal?.courtAppeal?.litigationId || '',
                this.taskId
              );
            }
            let courtSupremeReq: CourtAppealDto = {
              ...this.courtService.courtAppealBundle?.courtAppeal,
              headerFlag: CourtVerdictDto.HeaderFlagEnum.Submit,
            };
            courtSupremeReq.deductionForGuarantor = Number(courtSupremeReq.deductionForGuarantor) === 0 ? true : false;
            courtSupremeReq.courtAppealDocuments = courtSupremeReq?.courtAppealDocuments?.filter(
              el => el.imageId && el.imageId !== ''
            );
            const courtSupremeRes = await this.courtService.updateCourtAppeal(courtSupremeReq, this.taskId);
            if (courtSupremeRes === null) {
              this.notificationService.openSnackbarSuccess(
                this.translate.instant('EXCEPTION_CONFIG.MESSAGE_LG_ID_REQUEST_APPROVE', {
                  LG_ID: courtSupremeReq.litigationId,
                })
              );
              this.onBack();
            }
          }
          break;
        case 'RESPONSE_UNIT_MAPPING':
          try {
            const payloadResponseUnitMap = this.taskDetailService.getPayloadResponseUnitMap('SUBMIT', this.taskId);
            let res = await this.configurationService.postResponseUnitMapTasks(payloadResponseUnitMap);
            if (res) {
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('CONFIGURATION.TOAST_SUCCESS_SAVE')}`
              ); // `${this.translate.instant('TASK.LABEL_SAVED')}`
              this.onBack();
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'CHANGE_RELATED_PERSON_LITIGATION_CASE':
        case 'CHANGE_RELATED_PERSON_BLACK_CASE':
          if (this.statusCode === statusCode.PENDING_APPROVAL) {
            await this.submitApproveTask();
          }
          break;
        case 'DECREASE_RELATED_PERSON_LITIGATION_CASE':
          switch (this.statusCode) {
            case statusCode.PENDING_APPROVAL:
              await this.submitApproveTask();
              break;
            case statusCode.PENDING:
              const result = await this.notificationService.showCustomDialog({
                component: WithdrawLawsuitDefendantDialogComponent,
                type: 'xsmall',
                iconName: 'icon-save-primary',
                title: 'DEBT_RELATED_INFO_TAB.WITHDRAW_LAWSUIT_DEFENDANT_DIALOG.TITLE',
                leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                rightButtonLabel: 'DEBT_RELATED_INFO_TAB.WITHDRAW_LAWSUIT_DEFENDANT_DIALOG.BTN_CONFIRM_SAVE',
                buttonIconName: 'icon-Selected',
                context: {
                  taskId: this.taskId,
                },
              });
              if (result) {
                this.notificationService.openSnackbarSuccess(
                  this.translate.instant('DEBT_RELATED_INFO_TAB.WITHDRAW_LAWSUIT_DEFENDANT_DIALOG.SNACKBAR_SAVED', {
                    LG_ID: this.litigationDetail?.litigationId || '',
                  })
                );
                this.onBack();
              }
              break;
            default:
              break;
          }
          break;
        case 'RECORD_OF_APPEAL':
        case 'RECORD_OF_SUPREME_COURT':
        case 'UPLOAD_E_FILING':
          try {
            if (!this.suitService.updateLitigationCaseDetail) {
              let disputeAppealId: number | undefined;
              if (
                ['RECORD_OF_SUPREME_COURT', 'RECORD_OF_APPEAL'].includes(this.taskCode) &&
                this.statusCode === 'IN_PROGRESS'
              ) {
                disputeAppealId = this.suitService.getDisputeAppealIdFromTask(this.taskDetail);
              }
              const tempLgCaseDetail = await this.suitService.setUpdateLitigationCaseDetailByTaskCaseId(
                [...this.suitService.litigationCase],
                this.suitLitigationCaseId ?? -1,
                this.taskId,
                disputeAppealId
              );

              /* validate */
              if (this.statusCode === 'AWAITING' && this.taskCode === 'RECORD_OF_SUPREME_COURT' && tempLgCaseDetail) {
                this.suitService.updateLitigationCaseDetail = this.suitService.isUpdateLitigationCaseDetailLegit(
                  this.suitService.updateLitigationCaseDetail,
                  this.taskId
                )
                  ? tempLgCaseDetail
                  : null;
              } else {
                this.suitService.updateLitigationCaseDetail = tempLgCaseDetail;
              }
            }
            if (this.taskCode === 'UPLOAD_E_FILING' && this.statusCode === 'PENDING_APPROVAL') {
              await this.suitService.paymentReceipt(this.taskId);
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant(`TASK.SUIT_EFILING.SUBMIT_SUCCESS_PENDING_APPROVAL_UPLOAD_E_FILING`, {
                  LG_ID: litigationId,
                })}`
              );

              this.suitService.clearData();
              this.onBack();
            } else if (this.suitService.updateLitigationCaseDetail) {
              const request: CreateLitigationSubCaseRequest = {
                ...this.suitService.getCreateLitigationSubCaseRequest(
                  this.suitService.updateLitigationCaseDetail,
                  this.taskId
                ),
                headerFlag: LitigationCaseRequest.HeaderFlagEnum.Submit,
                isPlaintiff: this.statusCode === 'PENDING',
              };
              const mainLitigationCaseId = this.suitService.updateLitigationCaseDetail?.id ?? -1;
              const updatedSubCase =
                this.suitService.findEditableSubCase(this.suitService.updateLitigationCaseDetail) ?? {};

              if (this.taskCode === 'UPLOAD_E_FILING') {
                await this.suitService.updateLitigationReceipt(mainLitigationCaseId, updatedSubCase.id ?? -1, request);
              } else {
                await this.suitService.updateLitigationSubmitCourt(mainLitigationCaseId, request);
              }
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${litigationId} ${this.translate.instant(
                  `TASK.SUIT_EFILING.SUB_SUBMIT_SUCCESS_${this.statusCode}_${this.taskCode}`
                )}`
              );

              this.suitService.clearData();
              this.onBack();
            } else {
              this.notificationService.alertDialog(
                'TASK.SUIT_EFILING.SUBMIT_ALERT_TITLE',
                `TASK.SUIT_EFILING.SUBMIT_ALERT_${this.statusCode}_${this.taskCode}`,
                'COMMON.BUTTON_ACKNOWLEDGE',
                'icon-Check-Square'
              );
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'DECREE_OF_FIRST_INSTANCE':
        case 'DECREE_OF_APPEAL':
        case 'DECREE_OF_SUPREME_COURT':
          if (
            this.statusCode !== 'PENDING_APPROVAL' &&
            this.statusCode !== 'AWAITING' &&
            this.statusCode !== 'FINISHED'
          ) {
            // PENDING & IN_PROGRESS
            const activeDecree = this.courtService.findActiveDecree(
              this.taskDetail.litigationCaseId! as unknown as number
            );
            try {
              const decree = {
                ...(this.courtService.savedDecree || activeDecree),
                headerFlag: 'SUBMIT',
                taskId: this.taskDetail.id,
              } as CourtDecreeDto;
              await this.courtService.updateCourtDecree(decree);
              this.courtService.hasEdit = false;
              this.onBack();
              if (this.statusCode === 'PENDING' || this.statusCode === 'IN_PROGRESS') {
                this.notificationService.openSnackbarSuccess(
                  `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${litigationId} ${this.translate.instant(
                    `TASK.LABEL_DECREE_RECORD_SUCCESS`
                  )}`
                );
              }
            } catch (e) {
              this.logger.catchError(this.taskCode, e);
            }
          } else if (this.statusCode !== 'AWAITING' && this.statusCode !== 'FINISHED') {
            this.submitApproveTask('COURT');
          }
          break;
        case 'PAY_EXECUTION_FEE_FIRST_INSTANCE':
        case 'PAY_EXECUTION_FEE_APPEAL':
        case 'PAY_EXECUTION_FEE_SUPREME':
          // do nothing
          break;
        case 'RECORD_OF_SUPREME_COURT_ACKNOWLEDGE':
          try {
            if (!this.suitService.updateLitigationCaseDetail) return;

            const request: CreateLitigationSubCaseRequest = {
              ...this.suitService.getCreateLitigationSubCaseRequest(
                this.suitService.updateLitigationCaseDetail,
                this.taskId
              ),
              headerFlag: LitigationCaseRequest.HeaderFlagEnum.Submit,
              isPlaintiff: this.statusCode === 'PENDING',
            };
            const mainLitigationCaseId = this.suitService.updateLitigationCaseDetail?.id ?? -1;
            // const updatedSubCase = this.suitService.findEditableSubCase(this.suitService.updateLitigationCaseDetail) ?? {};
            await this.suitService.acknowledge(mainLitigationCaseId, request);
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${litigationId} ${this.translate.instant(
                `TASK.SUIT_EFILING.SUB_SUBMIT_SUCCESS_${this.statusCode}_${this.taskCode}`
              )}`
            );

            this.suitService.clearData();
            this.routerService.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'RECEIVE_ADVANCE_PAYMENT':
          try {
            this.dataForm = this.advanceService.generateAdvanceForm(this.advanceService.advance);
            this.dataForm.markAllAsTouched();
            this.dataForm.updateValueAndValidity();
            this.isSubmit = true;
            const isContinue = await this.notificationService.warningDialog(
              'ยืนยันนำส่งข้อมูล',
              'กรุณาตรวจสอบความถูกต้องของข้อมูลและกดปุ่ม “ยืนยัน“เพื่อดำเนินงานต่อไป'
            );
            if (isContinue) {
              if (this.dataForm.valid && this.isPaymentTransferFilled() && this.isGroupPayTransferFilled()) {
                if (this.statusCode === 'PENDING_APPROVAL') {
                  [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map((element, index) => {
                    for (let i = 0; i < element.length; i++) {
                      element[i].updateFlag = this.dataForm.get('advanceReceiveNo')?.value ? 'U' : 'A';
                    }
                  });
                  let data = {
                    ...this.dataForm.getRawValue(),
                    createAdvancePayTransferInfo: (
                      this.dataForm.get('createAdvancePayTransferInfo') as UntypedFormArray
                    ).value.value,
                  };
                  let request: CreateAdvanceReceivePayTransferRequest = Object.assign({ headerFlag: 'APPROVE' }, data);
                  let res = await this.advanceService.createAdvanceReceive(this.taskId, request);
                  if (res.success) {
                    this.notificationService.openSnackbarSuccess(
                      `รายการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย ${res.receiveNo} อนุมัติสำเร็จแล้ว`
                    );
                    this.routerService.back();
                  } else {
                    let request: TransferOrderRequest;
                    let litigationCaseIdList;
                    if (typeof this.taskService.taskDetail.attributes !== 'string') {
                      litigationCaseIdList = JSON.parse(this.taskService.taskDetail.attributes || '');
                    } else {
                      litigationCaseIdList = this.taskService.taskDetail.attributes;
                    }
                    request = {
                      litigationCaseId: litigationCaseIdList.litigationCaseId, // array of litigationCaseId
                      mode: 'AUTO', // mode
                      objectId: this.dataForm.get('advanceReceiveNo')?.value,
                    };
                    this.advanceService.advance = await this.advanceService.advanceReceiveInfoDetail(request);
                    this.initFinanceAdvance();
                    this.notificationService.openSnackbarError('เกิดข้อผิดพลาด กรุณาตรวจสอบรายละเอียดในรายการโอนเงิน');
                  }
                } else {
                  [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map((element, index) => {
                    for (let i = 0; i < element.length; i++) {
                      element[i].updateFlag = this.dataForm.get('advanceReceiveNo')?.value ? 'U' : 'A';
                    }
                  });
                  let data = {
                    ...this.dataForm.getRawValue(),
                    createAdvancePayTransferInfo: (
                      this.dataForm.get('createAdvancePayTransferInfo') as UntypedFormArray
                    ).value.value,
                  };
                  let request: CreateAdvanceReceivePayTransferRequest = Object.assign({ headerFlag: 'SUBMIT' }, data);
                  let res = await this.advanceService.createAdvanceReceive(this.taskId, request);
                  if (res.success) {
                    this.notificationService.openSnackbarSuccess(
                      `รายการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย ${res.receiveNo} นำเสนอสำเร็จแล้ว`
                    );
                    this.routerService.back();
                  } else {
                    let request: TransferOrderRequest;
                    let litigationCaseIdList;
                    if (typeof this.taskService.taskDetail.attributes !== 'string') {
                      litigationCaseIdList = JSON.parse(this.taskService.taskDetail.attributes || '');
                    } else {
                      litigationCaseIdList = this.taskService.taskDetail.attributes;
                    }
                    request = {
                      litigationCaseId: litigationCaseIdList.litigationCaseId, // array of litigationCaseId
                      mode: 'AUTO', // mode
                      objectId: this.dataForm.get('advanceReceiveNo')?.value,
                    };
                    this.advanceService.advance = await this.advanceService.advanceReceiveInfoDetail(request);
                    this.initFinanceAdvance();
                    this.notificationService.openSnackbarError('เกิดข้อผิดพลาด กรุณาตรวจสอบรายละเอียดในรายการโอนเงิน');
                  }
                }
              }
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'INVESTIGATE_HEIR_OR_TRUSTEE': //onSubmit()
          if (this.personObj && this.statusCode == 'PENDING') {
            if (this.personObj.haveHeir) {
              // case บันทึกทายาทแล้ว

              let additionalPersons: Array<PersonRequest> = [];
              let personRequest: PersonRequest = {};
              const personObjforSave: PersonDto =
                litigationDetail.personInfo?.additionalPersons?.find(obj => !obj.personId) || {};
              personRequest.personId = personObjforSave.personId;
              personRequest.relation = personObjforSave.relation;
              personRequest.title = personObjforSave.title;
              personRequest.firstName = personObjforSave.firstName;
              personRequest.lastName = personObjforSave.lastName;
              personRequest.name = personObjforSave.name;
              personRequest.identificationNo = personObjforSave.identificationNo;
              personRequest.birthDate = personObjforSave.birthDate;
              personRequest.personType = personObjforSave.personType;
              personRequest.referencePersonId = personObjforSave.referencePersonId;
              personRequest.updateFlag = PersonDto.UpdateFlagEnum.A;
              additionalPersons.push(personRequest);

              const personInfoRequest: PersonInfoRequest = {
                additionalPersons: additionalPersons,
                taskId: this.taskId,
              };

              let heirInfoRequest: HeirInfoRequest = {
                approvalStatus: HeirInfoRequest.ApprovalStatusEnum.Approve,
                litigationId: litigationId,
              };

              try {
                await this.lawsuitService.updateAdditionalPersons(litigationId, personInfoRequest);
                await this.debtRelatedInfoTabService.processHeir(taskId, heirInfoRequest);
              } catch (error) {
                this.logger.catchError('updateAdditionalPersons and processHeir :: ', error);
              }

              this.notificationService.openSnackbarSuccess(
                `เลขที่กฎหมาย: ${litigationId} บันทึกทายาทหรือผู้จัดการมรดกแล้ว`
              );
              this.onBack();
            } else {
              // case invalid object บันทึกทายาทแล้ว
              this.notificationService.alertDialog(
                'ไม่สามารถเสร็จสิ้นสืบหาทายาทหรือผู้จัดการมรดก',
                'กรุณาบันทึกข้อมูลทายาทหรือผู้จัดการมรดกให้ครบถ้วน เพื่อดำเนินการต่อไป'
              );
            }
          } else {
            await this.submitApproveTask('LAWSUIT');
          }
          break;
        case 'PROCESS_NOT_PROSECUTE_1': //onSubmit()
          const heirInfoRequest: HeirInfoRequest = {
            approvalStatus: HeirInfoRequest.ApprovalStatusEnum.Approve,
            deceasePersonId: this.deceasePersonId || undefined,
            litigationId: litigationId,
          };
          await this.debtRelatedInfoTabService.processNotProsecute(this.taskId, heirInfoRequest);
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${litigationId} ${this.translate.instant(
              'DEBT_RELATED_INFO_TAB.APPROVAL_NOT_PROCEED_CASE_NO_EVIDENCE'
            )}`
          );
          this.onBack();
          break;
        case 'PROCESS_NOT_PROSECUTE_2': //onSubmit()
          await this.onReject(true, { action: 'APPROVE', deceasePersonId: this.deceasePersonId || undefined });
          break;
        case 'COLLECT_LG_ID': //onSubmit()
          await this.submitApproveTask();
          break;
        case 'REQUEST_DEFERMENT':
        case 'EXTEND_DEFERMENT':
          switch (deferment?.currentApproveActor) {
            case DefermentItem.CurrentApproveActorEnum.Faction: // Actor ฝ่าย
              if (deferment.defermentApproverCode === '2') {
                // อำนาจอนุมัติสาย
                const isApproveDeferment = await this.notificationService.warningDialog(
                  'COMMON.BUTTON_AGREE_AS_PROPOSED',
                  'LAWSUIT.DEFERMENT.SUBMIT_REQUEST_DEFERMENT_GROUP_MSG',
                  'COMMON.BUTTON_AGREE_AS_PROPOSED',
                  'icon-Selected'
                );
                isApproveDeferment && (await this.submitApproveTask());
              } else {
                // อำนาจอนุมัติฝ่าย
                await this.submitApproveTask();
              }
              break;
            case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม
              if (deferment.defermentApproverCode === '2') {
                // อำนาจอนุมัติสาย
                const isApproveDeferment = await this.notificationService.warningDialog(
                  'COMMON.BUTTON_AGREE_AS_PROPOSED',
                  'LAWSUIT.DEFERMENT.SUBMIT_REQUEST_DEFERMENT_ORGANIZATION_MSG',
                  'COMMON.BUTTON_AGREE_AS_PROPOSED',
                  'icon-Selected'
                );
                isApproveDeferment && (await this.submitApproveTask());
              }
              break;
            case DefermentItem.CurrentApproveActorEnum.Organization: // Actor สาย
              if (deferment.defermentApproverCode === '2') {
                // อำนาจอนุมัติสาย
                await this.submitApproveTask();
              }
              break;
            default:
              await this.submitApproveTask();
              break;
          }
          break;
        case 'REQUEST_REVISE_CESSATION':
        case 'REQUEST_REVISE_DEFERMENT':
          // validate select lgid
          const defermentLitigationInfos =
            (this.defermentForm.get('defermentLitigationInfos')?.value as DefermentLitigationInfo[] | null) || [];
          const litigationInfosEnable = defermentLitigationInfos.filter(e => e.enabled);
          if (!litigationInfosEnable.some(e => e.checked === true)) {
            if (this.taskCode === 'REQUEST_REVISE_CESSATION') {
              this.notificationService.alertDialog(
                'LAWSUIT.DEFERMENT.CAN_NOT_SUBMIT_CESSATION_TITLE',
                'LAWSUIT.DEFERMENT.INVALID_LITIGATION_CESSATION_MSG'
              );
            } else {
              this.notificationService.alertDialog(
                'LAWSUIT.DEFERMENT.CAN_NOT_SUBMIT_DEFERMENT_TITLE',
                'LAWSUIT.DEFERMENT.INVALID_LITIGATION_DEFERMENT_MSG'
              );
            }
            return;
          }
          if (this.taskCode === 'REQUEST_REVISE_DEFERMENT') {
            // validate onChange endDate
            let invalidDuration = false;
            const isReponseUnit =
              this.defermentService.responseUnitType === DefermentItem.ResponseUnitTypeEnum.ResponseUnit ? true : false;
            const defermentDuration = Utils.calculateDateDiff(
              this.defermentForm?.get('startDate')?.value,
              this.defermentForm?.get('endDate')?.value
            );
            const cumulativeDuration = isReponseUnit
              ? this.defermentService.deferment.totalDefermentDaysResponseUnit
              : this.defermentService.deferment.totalDefermentDaysAmdResponseUnit;
            switch (this.defermentService.deferment?.deferment?.defermentApproverCode) {
              case '1':
                if (defermentDuration > 30) invalidDuration = true;
                break;
              case '2':
                if (defermentDuration > 30 || defermentDuration + (cumulativeDuration || 0) > 180)
                  invalidDuration = true;
                break;
              default:
                break;
            }
            if (invalidDuration) {
              this.notificationService.alertDialog(
                'LAWSUIT.DEFERMENT.CAN_NOT_SUBMIT_DEFERMENT_TITLE',
                'LAWSUIT.DEFERMENT.FAIL_MESSAGE_DEFERMENT_MORE_THAN_30'
              );
              return;
            }
          }
          let isDocumentValid = this.isDocumentValid();
          if (!isDocumentValid) {
            if (this.taskCode === 'REQUEST_REVISE_CESSATION') {
              this.notificationService.alertDialog(
                'LAWSUIT.DEFERMENT.CAN_NOT_SUBMIT_CESSATION_TITLE',
                'LAWSUIT.DEFERMENT.INVALID_DOCUMENT_CESSATION_MSG'
              );
            } else {
              this.notificationService.alertDialog(
                'LAWSUIT.DEFERMENT.CAN_NOT_SUBMIT_DEFERMENT_TITLE',
                'LAWSUIT.DEFERMENT.INVALID_DOCUMENT_DEFERMENT_MSG'
              );
            }
            return;
          }
          try {
            if (this.taskCode === 'REQUEST_REVISE_CESSATION') {
              await this.saveDeferment(
                SaveDefermentRequest.DefermentTypeEnum.Cessation,
                SaveDefermentRequest.HeaderFlagEnum.Submit
              );
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${litigationId} ${this.translate.instant(
                  'TASK.REJECT_DIALOG.REVISE_CESSATION_SUBMIT_SUCCESS'
                )}`
              );
            } else {
              if (!await this.checkDefermentValidity()) return;

              await this.saveDeferment(
                SaveDefermentRequest.DefermentTypeEnum.Deferment,
                SaveDefermentRequest.HeaderFlagEnum.Submit
              );
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${litigationId} ${this.translate.instant(
                  'TASK.REJECT_DIALOG.REVISE_DEFERMENT_SUBMIT_SUCCESS'
                )}`
              );
            }
            this.onBack();
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;
        case 'SAVE_DRAFT_DEFERMENT':
        case 'SAVE_DRAFT_CESSATION':
          try {
            const hasCeased = this.taskCode === 'SAVE_DRAFT_CESSATION';
            const isConfirm = await this.notificationService.warningDialog(
              hasCeased
                ? 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_CESSATION_TITLE'
                : 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_DEFERMENT_TITLE',
              hasCeased
                ? 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_CESSATION_MSG'
                : 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_DEFERMENT_MSG',
              hasCeased
                ? 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_CESSATION_TITLE'
                : 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_DEFERMENT_TITLE',
              'icon-Selected'
            );
            if (isConfirm) {
              await this.lawsuitService.getLitigation(litigationId || this._currentLitigation.litigationId || '');
              const litigationClosed = this.lawsuitService.currentLitigation.litigationClosed ? true : false;
              if (litigationClosed) {
                const res = await this.notificationService.alertDialog(
                  'LAWSUIT.DEFERMENT.FAIL_HEADER',
                  'LAWSUIT.DEFERMENT.FAIL_MESSAGE_LITIGATION_CLOSED'
                );
                if (res) {
                  this.onBack();
                  return;
                }
              }
              let isCommitmentAccount = this.defermentService.checkCommitmentAccount(
                this.taskDetailService.defermentState
              );
              if (!isCommitmentAccount) return;
              let isDocumentValid = this.isDocumentValid();
              this.defermentForm.markAllAsTouched();
              this.defermentForm.updateValueAndValidity();
              if (this.defermentForm.valid) {
                if (isDocumentValid) {
                  this.defermentForm
                    .get('startDate')
                    ?.setValue(new Date(this.defermentForm.get('startDate')?.value).toISOString());
                  this.defermentForm.get('startDate')?.updateValueAndValidity();
                  this.defermentForm
                    .get('endDate')
                    ?.setValue(new Date(this.defermentForm.get('endDate')?.value).toISOString());
                  this.defermentForm.get('endDate')?.updateValueAndValidity();
                  this.defermentForm.get('responseUnitType')?.setValue(this.defermentService.responseUnitType);
                  this.defermentForm.get('responseUnitType')?.updateValueAndValidity();

                  // Deferment
                  if (isCommitmentAccount && !hasCeased) {
                    if (!await this.checkDefermentValidity()) return;

                    await this.saveDeferment(
                      SaveDefermentRequest.DefermentTypeEnum.Deferment,
                      SaveDefermentRequest.HeaderFlagEnum.Submit
                    );
                    this.notificationService.openSnackbarSuccess(
                      `${this.translate.instant(
                        'COMMON.LABEL_LITIGATION_ID'
                      )}: ${litigationId} ${this.translate.instant('LAWSUIT.DEFERMENT.REQUEST_DEFERMENT_SUCCESS')}`
                    );
                    this.onBack();
                  }
                  // Cessation
                  else if (isCommitmentAccount && hasCeased) {
                    if (this.defermentState === defermentState.DEFERMENT) {
                      const isCancelDeferment = await this.notificationService.warningDialog(
                        'LAWSUIT.DEFERMENT.WARNING_CANCEL_DEFERMENT',
                        'LAWSUIT.DEFERMENT.CANCEL_DEFERMENT_MSG',
                        'LAWSUIT.DEFERMENT.ACTION_CANCEL_DEFERMENT_BTN',
                        'icon-Selected'
                      );
                      if (isCancelDeferment) {
                        let prescriptionDate = this.defermentService.deferment.prescriptionDate || '';
                        let dateDiff = Utils.calculateDateDiff(
                          this.defermentForm.get('startDate')?.value,
                          prescriptionDate
                        );
                        if (dateDiff < 180) {
                          const isContinue = await this.notificationService.warningDialog(
                            'LAWSUIT.DEFERMENT.WARNING_DURATION',
                            'LAWSUIT.DEFERMENT.FAIL_MESSAGE_LESS_THAN_6_CONTINUE',
                            'COMMON.BUTTON_CONTINUE2'
                          );
                          if (isContinue) {
                            await this.saveDeferment(
                              SaveDefermentRequest.DefermentTypeEnum.Cessation,
                              SaveDefermentRequest.HeaderFlagEnum.Submit
                            );
                            this.notificationService.openSnackbarSuccess(
                              `${this.translate.instant(
                                'COMMON.LABEL_LITIGATION_ID'
                              )}: ${litigationId} ${this.translate.instant(
                                'LAWSUIT.DEFERMENT.REQUEST_CESSATION_SUCCESS'
                              )}`
                            );
                            this.onBack();
                          }
                        } else {
                          await this.saveDeferment(
                            SaveDefermentRequest.DefermentTypeEnum.Cessation,
                            SaveDefermentRequest.HeaderFlagEnum.Submit
                          );
                          this.notificationService.openSnackbarSuccess(
                            `${this.translate.instant(
                              'COMMON.LABEL_LITIGATION_ID'
                            )}: ${litigationId} ${this.translate.instant(
                              'LAWSUIT.DEFERMENT.REQUEST_CESSATION_SUCCESS'
                            )}`
                          );
                          this.onBack();
                        }
                      }
                    } else {
                      let prescriptionDate = this.defermentService.deferment.prescriptionDate || '';
                      let dateDiff = Utils.calculateDateDiff(
                        this.defermentForm.get('startDate')?.value,
                        prescriptionDate
                      );
                      if (dateDiff < 180) {
                        const isContinue = await this.notificationService.warningDialog(
                          'LAWSUIT.DEFERMENT.WARNING_DURATION',
                          'LAWSUIT.DEFERMENT.FAIL_MESSAGE_LESS_THAN_6_CONTINUE',
                          'COMMON.BUTTON_CONTINUE2'
                        );
                        if (isContinue) {
                          await this.saveDeferment(
                            SaveDefermentRequest.DefermentTypeEnum.Cessation,
                            SaveDefermentRequest.HeaderFlagEnum.Submit
                          );
                          this.notificationService.openSnackbarSuccess(
                            `${this.translate.instant(
                              'COMMON.LABEL_LITIGATION_ID'
                            )}: ${litigationId} ${this.translate.instant(
                              'LAWSUIT.DEFERMENT.REQUEST_CESSATION_SUCCESS'
                            )}`
                          );
                          this.onBack();
                        }
                      } else {
                        const res = await this.saveDeferment(
                          SaveDefermentRequest.DefermentTypeEnum.Cessation,
                          SaveDefermentRequest.HeaderFlagEnum.Submit
                        );
                        this.notificationService.openSnackbarSuccess(
                          `${this.translate.instant(
                            'COMMON.LABEL_LITIGATION_ID'
                          )}: ${litigationId} ${this.translate.instant('LAWSUIT.DEFERMENT.REQUEST_CESSATION_SUCCESS')}`
                        );
                        this.onBack();
                      }
                    }
                  }
                } else {
                  this.notificationService.alertDialog(
                    'LAWSUIT.DEFERMENT.FAIL_HEADER',
                    'LAWSUIT.DEFERMENT.FAIL_MESSAGE_UPLOAD'
                  );
                }
              }
            }
          } catch (e) {
            this.logger.catchError(this.taskCode, e);
          }
          break;

        case 'R2E07-02-B':
          let title = 'COMMON.BUTTON_APPROVE';
          let rightButtonLabel = 'COMMON.BUTTON_APPROVE';
          let msg = 'LAWSUIT.DEFERMENT.DEFER_EXEC_APPROVE_MSG';

          switch (deferment?.currentApproveActor) {
            case DefermentItem.CurrentApproveActorEnum.Faction: // Actor ฝ่าย
              if (deferment.defermentApproverCode === '1') {
                // ออำนาจอนุมัติ DLA
                title = 'LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_TITLE';
                rightButtonLabel = 'LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_BTN';
                msg = this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_GROUP_MSG');
              }
              break;
            case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม
              if (deferment.defermentApproverCode === '1') {
                // อำนาจอนุมัติ DLA
                title = 'LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_TITLE';
                rightButtonLabel = 'LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_BTN';
                msg = this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_ORG_MSG');
              }
              break;
            default:
              break;
          }

          const confirm = await this.notificationService.warningDialog(title, msg, rightButtonLabel, 'icon-Selected');
          if (confirm) {
            try {
              const res = await this.defermentService.approve(this.taskId);
              if (
                (deferment?.currentApproveActor === DefermentItem.CurrentApproveActorEnum.Faction ||
                  deferment?.currentApproveActor === DefermentItem.CurrentApproveActorEnum.Group) &&
                deferment.defermentApproverCode === '1'
              ) {
                this.notificationService.openSnackbarSuccess(
                  this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_SUCCESS', {
                    LG_ID: this.lawsuitService.currentLitigation.litigationId,
                  })
                );
              } else {
                this.notificationService.openSnackbarSuccess(
                  this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_APPROVE_SUCCESS', {
                    LG_ID: this.lawsuitService.currentLitigation.litigationId,
                  })
                );
              }
              this.routerService.navigateTo('/main/lawsuit/detail', {
                litigationId: this.lawsuitService.currentLitigation.litigationId,
                _tabIndex: 0,
                _subIndex: 0,
                _underSubIndex: 0,
              });
            } catch (e) {}
          }
          break;
        case 'R2E07-03-C':
          let titleC = 'COMMON.BUTTON_APPROVE';
          let rightButtonLabelC = 'COMMON.BUTTON_APPROVE';
          let msgC = 'LAWSUIT.DEFERMENT.DEFER_EXEC_APPROVE_MSG';

          switch (deferment?.currentApproveActor) {
            case DefermentItem.CurrentApproveActorEnum.Faction: // Actor ฝ่าย
              if (deferment.defermentApproverCode === '1') {
                // ออำนาจอนุมัติ DLA
                titleC = 'LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_TITLE';
                rightButtonLabelC = 'LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_BTN';
                msgC = this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_GROUP_MSG');
              }
              break;
            case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม
              if (deferment.defermentApproverCode === '1') {
                // อำนาจอนุมัติ DLA
                titleC = 'LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_TITLE';
                rightButtonLabelC = 'LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_BTN';
                msgC = this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_ORG_MSG');
              }
              break;
            default:
              break;
          }
          const confirmC = await this.notificationService.warningDialog(
            titleC,
            msgC,
            rightButtonLabelC,
            'icon-Selected'
          );
          if (confirmC) {
            await this.defermentService.approve(this.taskId);
            if (
              (deferment?.currentApproveActor === DefermentItem.CurrentApproveActorEnum.Faction ||
                deferment?.currentApproveActor === DefermentItem.CurrentApproveActorEnum.Group) &&
              deferment.defermentApproverCode === '1'
            ) {
              this.notificationService.openSnackbarSuccess(
                this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_AGREE_EXTEND_SUCCESS', {
                  LG_ID: this.lawsuitService.currentLitigation.litigationId,
                })
              );
            } else {
              this.notificationService.openSnackbarSuccess(
                this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_APPROVE_EXTEND_SUCCESS', {
                  LG_ID: this.lawsuitService.currentLitigation.litigationId,
                })
              );
            }
            this.onBack();
          }
          break;

        case 'R2E07-04-D':
        case 'R2E07-01-A':
          try {
            this.defermentForm.markAllAsTouched();
            if (
              (!this.defermentService.selectedSeizureProperties ||
                this.defermentService.selectedSeizureProperties?.length === 0) &&
              (!this.defermentService.selectedCollateralSets ||
                this.defermentService.selectedCollateralSets?.length === 0)
            ) {
              this.notificationService.alertDialog(
                'LAWSUIT.DEFERMENT.ALERT_MESSAGE_HEADER_SELECT_COLLATERAL',
                'LAWSUIT.DEFERMENT.ALERT_MESSAGE_TITLE_SELECT_COLLATERAL'
              );
              return;
            }
            const isReponseUnit =
              this.defermentService.responseUnitType === DefermentItem.ResponseUnitTypeEnum.ResponseUnit ? true : false;
            const defermentDuration = Utils.calculateDateDiff(
              this.defermentForm?.get('startDate')?.value,
              this.defermentForm?.get('endDate')?.value
            );
            const cumulativeDuration = isReponseUnit
              ? this.defermentService.deferment.totalDefermentDaysResponseUnit
              : this.defermentService.deferment.totalDefermentDaysAmdResponseUnit;
            // จำนวนวันชะลอเกินอำนาจอนุมัติ
            if (
              this.taskCode === 'R2E07-04-D' &&
              this.defermentService.deferment?.deferment?.defermentApproverCode === '1' &&
              (defermentDuration > 30 || defermentDuration + (cumulativeDuration || 0) > 180)
            ) {
              this.notificationService.alertDialog(
                'LAWSUIT.DEFERMENT.FAIL_HEADER_EXEC',
                'LAWSUIT.DEFERMENT.FAIL_MESSAGE_EXECUTION_MORE_THAN_30'
              );
              return;
            }
            if (
              this.defermentService.getSelectedCollaterals.collateralDeedGroups.length > 0 ||
              this.defermentService.getSelectedCollaterals.collateralNoAnnounceAuctions.length > 0
            ) {
              if (defermentDuration > 365) {
                const header = this.translate.instant('LAWSUIT.DEFERMENT.FAIL_HEADER_EXEC');
                const msg = header + ' ' + this.translate.instant('LAWSUIT.DEFERMENT.ALERT_MESSAGE_TITLE_OVER_YEAR');
                await this.notificationService.alertDialog(header, msg);
                return;
              }
              const isValidRelateDocs = this.defermentService.isValidSuspendAuctionDocuments(
                this.defermentForm?.get('suspendAuctionDocuments')?.value
              );
              if (!isValidRelateDocs) {
                this.defermentForm?.get('suspendAuctionDocuments')?.setErrors({ invalid: true });
                return;
              }
            }
            this.setDocumentToForm();
            const res = await this.defermentService.saveCustomerDefermentExec({
              customerId: this.lawsuitService.currentLitigation.customerId || '',
              defermentExecItem: {
                ...this.defermentForm.value,
                collaterals: this.defermentService.getSelectedCollaterals.collaterals,
                collateralDeedGroups: this.defermentService.getSelectedCollaterals.collateralDeedGroups,
                collateralNoAnnounceAuctions: this.defermentService.getSelectedCollaterals.collateralNoAnnounceAuctions,
              },
              headerFlag: 'SUBMIT',
              taskId: this.taskId,
            });
            this.clearConfirmExitWithoutSave();
            const msg = this.defermentService.deferment.deferment?.extendDeferment
              ? this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_EXTEND_SUBMIT_SUCCESS')
              : this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_SUBMIT_SUCCESS', {
                  LG_ID: this.lawsuitService.currentLitigation.litigationId,
                });
            this.notificationService.openSnackbarSuccess(msg);
            this.onBack();
          } catch (e) {}
          break;
        case 'R2E07-05-E':
          try {
            const isSuspendAuctionResultDocumentsValid = this.defermentForm.get('suspendAuctionResultDocuments')?.valid;
            if (!!isSuspendAuctionResultDocumentsValid) {
              this.setDocumentToForm();
              const res = await this.defermentService.saveAnnounceSuspendAuction({
                customerId: this.lawsuitService.currentLitigation.customerId || '',
                defermentExecItem: {
                  ...this.defermentForm.value,
                  collaterals: this.defermentService.selectedSeizureProperties,
                },
                headerFlag: 'SUBMIT',
                taskId: this.taskId,
              });
              this.defermentForm.markAsPristine();
              this.defermentForm.updateValueAndValidity();
              this.notificationService.openSnackbarSuccess(
                this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_STATEMENT_SUBMIT_SUCCESS', {
                  LG_ID: this.lawsuitService.currentLitigation.litigationId,
                })
              );
              this.onBack();
            } else {
              this.defermentForm.get('suspendAuctionResultDocuments')?.markAllAsTouched();
              this.defermentForm.get('suspendAuctionResultDocuments')?.updateValueAndValidity();
              this.notificationService.alertDialog(
                'LAWSUIT.DEFERMENT.DEFERMENT_STATEMENT_REQUIRED_UPLOAD_TITLE',
                'LAWSUIT.DEFERMENT.DEFERMENT_STATEMENT_REQUIRED_UPLOAD_MSG'
              );
            }
          } catch (e) {}
          break;
        default:
          if (this.defermentState === defermentState.DEFERMENT) {
            const isCancelDeferment = await this.notificationService.warningDialog(
              'LAWSUIT.DEFERMENT.SUBMIT_APPROVE_CESSATION_TITLE',
              'LAWSUIT.DEFERMENT.SUBMIT_APPROVE_CESSATION_MSG',
              'LAWSUIT.DEFERMENT.SUBMIT_APPROVE_CESSATION_BTN',
              'icon-Selected'
            );
            isCancelDeferment && (await this.submitApproveTask());
            break;
          } else {
            await this.submitApproveTask();
            break;
          }
      }
    }
  }

  private async submitApproveTask(service: 'LAWSUIT' | 'COURT' = 'LAWSUIT') {
    this.logger.info('Submit task to Approver');
    try {
      if (service === 'LAWSUIT') {
        await this.lawsuitService.approve(this.taskId);
      } else if (service === 'COURT') {
        await this.courtService.approve(this.taskId);
      }
      this.notificationService.openSnackbarSuccess(
        this.taskDetailService.getMsgSnackbarApproved(this.taskCode, this.litigationDetail)
      );
      this.routerService.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
    } catch (error) {
      this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_APPROVED'));
    }
  }

  private async validateLitigationCaseRequest(litigationCaseRequest: LitigationCaseRequest) {
    if (
      (litigationCaseRequest.litigationAllegations?.length || 0) === 0 ||
      typeof litigationCaseRequest.litigationAllegations !== 'object'
    ) {
      await this.notificationService.alertDialog(
        'LAWSUIT.SUIT.INDICTMENT_ALERT_DIALOG_TITLE',
        'LAWSUIT.SUIT.INDICTMENT_ALERT_DIALOG_CONTENT'
      );
      return false;
    }

    if ((litigationCaseRequest?.caseDate ?? '') < Utils.getCurrentDate()) {
      await this.notificationService.alertDialog(
        'LAWSUIT.SUIT.INDICTMENT_ALERT_DIALOG_INVALID_CASEDATE_TITLE',
        'LAWSUIT.SUIT.INDICTMENT_ALERT_DIALOG_INVALID_CASEDATE_CONTENT'
      );
      return false;
    }
    return true;
  }

  initWithdrawLawsuitDefendant() {
    this.actionBar.hasSave = false;
    this.actionBar.primaryIcon = 'icon-save-primary';
    this.actionBar.primaryText = 'DEBT_RELATED_INFO_TAB.WITHDRAW_LAWSUIT_DEFENDANT_DIALOG.TITLE';
    this.messageBannerMapper.set(
      taskCode.DECREASE_RELATED_PERSON_LITIGATION_CASE,
      'DEBT_RELATED_INFO_TAB.WITHDRAW_LAWSUIT_DEFENDANT_DIALOG.TASK_DETAIL_MESSAGE_BANNER'
    );
  }

  initFinanceAdvance() {
    this.dataForm = this.advanceService.generateAdvanceForm(this.advanceService.advance);
  }

  isPaymentTransferFilled() {
    if (
      (this.statusCode === 'PENDING_APPROVAL' || this.isRecordNoSuccess) &&
      this.taskCode === 'RECEIVE_ADVANCE_PAYMENT'
    )
      return true;
    let isPayTransferFilled!: boolean;
    [this.dataForm.get('createAdvancePayTransferInfo')?.value.value].map((element: any) => {
      for (let i = 0; i < element.length; i++) {
        let list = element[i].createAdvancePayTransferDetail as CreateAdvanceReceivePayTransferDetail[];
        isPayTransferFilled = list.every(item => item.payTransfer);
      }
    }) || [];

    return isPayTransferFilled;
  }

  isGroupPayTransferFilled() {
    if (
      (this.statusCode === 'PENDING_APPROVAL' || this.isRecordNoSuccess) &&
      this.taskCode === 'RECEIVE_ADVANCE_PAYMENT'
    )
      return true;
    let isGroupPayTransferFilled!: boolean;
    [this.dataForm.get('createAdvancePayTransferInfo')?.value.value].map((element: any) => {
      for (let i = 0; i < element.length; i++) {
        let list = element[i].createAdvancePayTransferDetail as CreateAdvanceReceivePayTransferDetail[];
        isGroupPayTransferFilled = list.every(item => item.groupPayTransferDesc);
      }
    }) || [];

    return isGroupPayTransferFilled;
  }

  setDocumentToForm(isClear: boolean = false) {
    let docForm = this.getFormDocuments();
    docForm.clear();
    for (let index = 0; index < this.defermentService.documents?.length; index++) {
      const element = this.defermentService.documents[index] as any;
      let isLEXSD016 = element.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSD016;
      let onlyFlagA = isLEXSD016 ? element?.updateFlag === 'A' : true;
      if (element.active && !isClear && onlyFlagA) {
        docForm.push(this.fb.control({ ...element }));
      }
      if (isClear && !element.isSubContract) {
        let clearE = {
          active: element.active,
          documentId: element.documentId,
          documentTemplateId: element.documentTemplateId,
          documentTemplate: {
            ...element.documentTemplate,
          },
          objectId: element.objectId,
          objectType: element.objectType,
        };
        docForm.push(this.fb.control({ ...clearE }));
      }
    }
  }

  getFormDocuments() {
    return this.defermentForm.get('documents') as UntypedFormArray;
  }

  isDocumentValid() {
    let contracts = this.defermentService.documents.filter(
      (it: any) => it?.documentTemplateId === DOC_TEMPLATE.LEXSD016
    );
    let isDocumentValid = this.defermentService.documents
      .filter((it: any) => {
        return (
          (contracts.length > 1 && it?.documentTemplateId === DOC_TEMPLATE.LEXSD016 ? it.isSubContract : true) &&
          it.documentTemplate &&
          it.documentTemplate.optional === false
        );
      })
      .every((doc: DocumentDto) => !!doc.imageId);

    return isDocumentValid;
  }

  async saveDeferment(
    defermentType: SaveDefermentRequest.DefermentTypeEnum,
    headerFlag: SaveDefermentRequest.HeaderFlagEnum
  ) {
    // clear dirty for check onBack
    this.defermentForm.markAsPristine();
    this.defermentForm.markAsUntouched();
    this.setDocumentToForm();
    if (['AUTO_CREATE_DRAFT_CESSATION', 'REQUEST_REVISE_CESSATION', 'SAVE_DRAFT_CESSATION'].includes(this.taskCode)) {
      this.defermentForm.get('startDate')?.patchValue(this.defermentForm.get('endDate')?.value);
    }

    const body: SaveDefermentRequest = {
      customerId: this.litigationDetail?.customerId || '',
      defermentItem: this.defermentForm.getRawValue(),
      defermentType: defermentType,
      headerFlag: headerFlag,
      taskId: this.taskId,
    };
    const saveDefermentResponse:SaveDefermentResponse = await this.defermentService.saveCustomerDeferment(body);

    //Enh backlog-LEX2-34934 Replace taskId and defermentId when save draft
    if(headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft && defermentType === SaveDefermentRequest.DefermentTypeEnum.Deferment){
      if(saveDefermentResponse.taskId)
        this.taskId = saveDefermentResponse.taskId
      if(saveDefermentResponse.defermentId)
        this.defermentForm.get('defermentId')?.setValue(saveDefermentResponse.defermentId);
    }
    return saveDefermentResponse;
  }

  clearConfirmExitWithoutSave() {
    this.taskDetailService.resetHasEdit();
    if (this.defermentForm) {
      this.defermentForm.markAsPristine();
      this.defermentForm.markAsUntouched();
    }
  }

  private async checkDefermentValidity(): Promise<boolean> {
    const endDateValue = this.defermentForm.get('endDate')?.value;
    const defermentInfos = this.defermentForm.get('defermentLitigationInfos')?.value;

    return await this.defermentService.isPrescriptionLessThanProperMonths(
        endDateValue,
        defermentInfos
    );
  }
}
