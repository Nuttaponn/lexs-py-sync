import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AdvanceService } from '@app/modules/finance/services/advance.service';
import { TaskCodeCustomer, TaskCodeLitigation, TaskMode, statusCode, taskCode, taskMapper } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { DefermentItem, PreferenceDetails } from '@lexs/lexs-client';
import { CourtResolver } from '../court/court.resolver';
import { CustomerService } from '../customer/customer.service';
import { DefermentResolver } from '../deferment/deferment.resolver';
import { DefermentService } from '../deferment/deferment.service';
import { ExpenseService } from '../finance/services/expense.service';
import { SuitResolver } from '../lawsuit/lawsuit-detail/suit/suit.resolver';
import { SuitService } from '../lawsuit/lawsuit-detail/suit/suit.service';
import { LawsuitService } from '../lawsuit/lawsuit.service';
import { UserService } from '../user/user.service';
import { AdvanceDetailResolver } from './../finance/advance/advance-detail/advance-detail.resolver';
import { TaskService } from './services/task.service';
import { AuctionService } from '../auction/auction.service';
import { AuctionPaymentService } from '../auction/auction-advance-payment/service/auction-payment.service';
import { PreferenceService } from '../preference/preference.service';
import { ScenarioPreferenceEnum } from '../preference/preference.model';

@Injectable({
  providedIn: 'root',
})
export class TaskResolver {
  private taskId!: string;
  private objectId!: string;
  private taskCode!: taskCode;
  private defermentTaskcode: taskCode[] = [
    'REQUEST_DEFERMENT',
    'EXTEND_DEFERMENT',
    'REQUEST_CESSATION',
    'AUTO_CREATE_DRAFT_DEFERMENT',
    'AUTO_CREATE_DRAFT_CESSATION',
    'AUTO_WHEN_MEET_CRITERIA_DEFERMENT',
    'AUTO_WHEN_MEET_CRITERIA_CESSATION',
    'REQUEST_REVISE_DEFERMENT',
    'REQUEST_REVISE_CESSATION',
    'SAVE_DRAFT_DEFERMENT',
    'SAVE_DRAFT_CESSATION',
    'R2E07-01-A',
    'R2E07-02-B',
    'R2E07-04-D',
    'R2E07-03-C',
    'R2E07-05-E',
  ];
  private courtTaskcode: taskCode[] = [
    'MEMORANDUM_COURT_FIRST_INSTANCE',
    'MEMORANDUM_COURT_APPEAL',
    'MEMORANDUM_SUPREME_COURT',
    'APPROVE_APPEAL',
    'CONSIDER_APPEAL',
  ];
  private expenseTaskcode: taskCode[] = [
    'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION',
    'EXPENSE_CLAIM_PAYMENT_APPROVAL',
    'CONSIDER_REMAINING_COSTS',
    'CONSIDER_APPROVE_CLOSE_LG',
    'EXPENSE_CLAIM_CORRECTION',
    'EXPENSE_CLAIM_RECEIPT_UPLOAD',
    'EXPENSE_CLAIM_VERIFICATION',
    'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT',
    'REVERSE_EXPENSE_CLAIM_OTHER',
  ];

  private preferenceTaskcode: taskCode[] = [
    'EXECUTE_PREFERENCE',
    'ASSIGN_LAWYER_PLAINTIFF_CASE',
    'PREPARE_PREFERENCE_DODUMENT',
  ];

  private advanceTaskcode: taskCode[] = ['RECEIVE_ADVANCE_PAYMENT'];
  private auctionExpenseNonEfilingTaskcode = [taskCode.R2E35_02_E09_01_7A, taskCode.R2E35_02_E09_02_7B];

  private isOnRequest!: boolean;
  private customerId!: string;

  constructor(
    private customerService: CustomerService,
    private taskService: TaskService,
    private lawsuitService: LawsuitService,
    private suitService: SuitService,
    private routerService: RouterService,
    private masterDataService: MasterDataService,
    private defermentService: DefermentService,
    private notificationService: NotificationService,
    private defermentResolver: DefermentResolver,
    private courtResolver: CourtResolver,
    private suitResolver: SuitResolver,
    private userService: UserService,
    private expenseService: ExpenseService,
    private logger: LoggerService,
    private advanceDetailResolver: AdvanceDetailResolver,
    private advanceService: AdvanceService,
    private auctionService: AuctionService,
    private auctionPaymentService: AuctionPaymentService,
    private preferenceService: PreferenceService,
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<TaskMode | null> {
    this.logger.logResolverStart('TaskResolver');
    // init data for task detail
    this.taskId = route.queryParams['taskId'];
    this.objectId = route.queryParams['objectId'];
    this.isOnRequest = route.queryParams['isOnRequest']; // for check OnRequest flow
    this.customerId = route.queryParams['customerId'];

    this.customerService.tempCustomerId = this.customerId;

    if (!this.isOnRequest) {
      this.taskService.taskDetail = await this.taskService.inquiryTaskDetails(Number(this.taskId));
    }
    console.log('this.taskService.taskDetail', this.taskService.taskDetail);
    console.log('isOnRequest', this.isOnRequest);
    if (this.taskService.taskDetail && this.taskService.taskDetail.id) {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
      if (!!!this.taskService.taskDetail.isHold) {
        // Resolve For Suit Task
        if (this.taskService.taskDetail.litigationCaseId) {
          await this.suitResolve(this.taskService.taskDetail.litigationCaseId, this.taskService.taskDetail.id);
          const _caseTypeCode = { caseTypeCode: this.suitService.litigationCaseDetail.caseType?.code }
          route.queryParams = { ...route.queryParams, ..._caseTypeCode }
        }
        // FYI: need "suitResolve" to execute first, before running "initTaskDetail"
        const resultTaskDetail = await this.initTaskDetail(this.taskId);
        // Resolve For Deferment Task
        if (this.defermentTaskcode.includes(this.taskCode)) {
          await this.defermentResolve(route, this.taskService.taskDetail.statusCode as statusCode);
        }
        // Resolve For Court Task
        if (this.courtTaskcode.includes(this.taskCode)) {
          await this.courtResolve(
            Number(this.taskService.taskDetail.litigationCaseId || 0),
            this.taskService.taskDetail.statusCode as statusCode
          );
        }
        // Resolve For Expense Task
        if (this.expenseTaskcode.includes(this.taskCode)) {
          await this.expenseResolve(route);
        }
        // Resolve For Advance Task
        if (this.advanceTaskcode.includes(this.taskCode)) {
          this.advanceService.objectId = this.objectId;
          await this.advanceResolve(route);
        }
        // Resolve For Auction Expense Non Efiling Task
        if (this.auctionExpenseNonEfilingTaskcode.includes(this.taskCode)) {
          await this.auctionExpenseNonEfilingResolve(route);
        }

        // Resolve For Preference Task
        if (this.preferenceTaskcode.includes(this.taskCode)) {
          // TODO: preference jobs
          await this.preferenceResolve(route);
          return resultTaskDetail;
        }
        this.logger.logResolverEnd('TaskResolver');
        return resultTaskDetail;
      } else {
        const warning = await this.notificationService.warningDialog(
          'TASK.WARNING_DUPLICATE_SESSION_TITLE',
          'TASK.WARNING_DUPLICATE_SESSION_MESSAGE',
          'TASK.BTN_NEXT',
          'icon-Arrow-Right'
        );
        if (warning) {
          // Resolve For Suit Task
          if (this.taskService.taskDetail.litigationCaseId) {
            await this.suitResolve(this.taskService.taskDetail.litigationCaseId, this.taskService.taskDetail.id);
            const _caseTypeCode = { caseTypeCode: this.suitService.litigationCaseDetail.caseType?.code }
            route.queryParams = { ...route.queryParams, ..._caseTypeCode }
          }
          // FYI: need "suitResolve" to execute first, before running "initTaskDetail"
          const resultTaskDetail = await this.initTaskDetail(this.taskId);
          // Resolve For Deferment Task
          if (this.defermentTaskcode.includes(this.taskCode)) {
            await this.defermentResolve(route);
          }
          // Resolve For Court Task
          if (this.courtTaskcode.includes(this.taskCode)) {
            await this.courtResolve(
              Number(this.taskService.taskDetail.litigationCaseId || 0),
              this.taskService.taskDetail.statusCode as statusCode
            );
          }
          // Resolve For Expense Task
          if (this.expenseTaskcode.includes(this.taskCode)) {
            await this.expenseResolve(route);
          }
          // Resolve For Advance Task
          if (this.advanceTaskcode.includes(this.taskCode)) {
            await this.advanceResolve(route);
          }
          this.logger.logResolverEnd('TaskResolver');
          return resultTaskDetail;
        } else {
          this.routerService.back();
          this.logger.logResolverEnd('TaskResolver');
          return null;
        }
      }
    } else {
      this.logger.logResolverEnd('TaskResolver');
      return null;
    }
  }

  async defermentResolve(_route: ActivatedRouteSnapshot, statusCode?: statusCode) {
    if (['REQUEST_DEFERMENT', 'EXTEND_DEFERMENT', 'REQUEST_CESSATION'].includes(this.taskCode as taskCode)) {
      _route.queryParams = {
        ..._route.queryParams,
        modeFromBtn: 'APPROVE',
        defermentId:
          this.taskService.litigationDetail.defermentInfo?.defermentId ||
          this.taskService.litigationDetail.cessationInfo?.defermentId,
        btnAction:
          this.taskCode === 'REQUEST_CESSATION'
            ? DefermentItem.DefermentTypeEnum.Cessation
            : DefermentItem.DefermentTypeEnum.Deferment,
      };
    }
    if (
      ['REQUEST_REVISE_CESSATION', 'SAVE_DRAFT_CESSATION', 'AUTO_CREATE_DRAFT_CESSATION'].includes(
        this.taskCode as taskCode
      )
    ) {
      _route.queryParams = {
        ..._route.queryParams,
        modeFromBtn: this.taskCode !== 'AUTO_CREATE_DRAFT_CESSATION' ? 'EDIT' : 'ADD',
        defermentCategory: 'PROSECUTE',
        defermentId: this.taskService.litigationDetail.cessationInfo?.defermentId,
        btnAction: DefermentItem.DefermentTypeEnum.Cessation,
      };
    }
    if (
      ['REQUEST_REVISE_DEFERMENT', 'SAVE_DRAFT_DEFERMENT', 'AUTO_CREATE_DRAFT_DEFERMENT'].includes(
        this.taskCode as taskCode
      )
    ) {
      _route.queryParams = {
        ..._route.queryParams,
        modeFromBtn: this.taskCode !== 'AUTO_CREATE_DRAFT_DEFERMENT' ? 'EDIT' : 'ADD',
        defermentCategory: 'PROSECUTE',
        defermentId: this.taskService.litigationDetail.defermentInfo?.defermentId,
        btnAction: DefermentItem.DefermentTypeEnum.Deferment,
      };
    }
    if (['R2E07-01-A', 'R2E07-04-D'].includes(this.taskCode as taskCode)) {
      _route.queryParams = {
        ..._route.queryParams,
        modeFromBtn: 'EDIT',
        defermentCategory: 'EXECUTION',
        defermentId: this.objectId,
      };
    }
    if (['R2E07-05-E'].includes(this.taskCode as taskCode)) {
      if (statusCode === 'PENDING') {
        _route.queryParams = {
          ..._route.queryParams,
          modeFromBtn: 'VIEW',
          mode: 'VIEW',
          defermentCategory: 'EXECUTION',
          defermentId: this.objectId,
          defermentType: this.taskService.litigationDetail.defermentExecInfo?.defermentType,
        };
      }
    }
    await this.defermentResolver.resolve(_route);
  }

  async advanceResolve(_route: ActivatedRouteSnapshot) {
    await this.advanceDetailResolver.resolve(_route);
  }

  async suitResolve(_litigationCaseId: string, _taskId?: number) {
    await this.suitResolver.resolveLitigationCase(_litigationCaseId, _taskId);
  }

  async courtResolve(_litigationCaseId: number, _statusCode: statusCode) {
    const _litigationId = this.taskService.litigationDetail.litigationId || '';
    if (this.taskCode === 'APPROVE_APPEAL' || this.taskCode === 'CONSIDER_APPEAL') {
      await this.courtResolver.initConsiderAppealData(_litigationCaseId, _litigationId, Number(this.taskId));
    } else {
      await this.courtResolver.initCourtVerdictDetailData(_litigationCaseId, _litigationId, Number(this.taskId));
    }
  }

  async expenseResolve(_route: ActivatedRouteSnapshot) {
    if (this.expenseTaskcode.includes(this.taskCode)) {
      const expenseObjectId = _route.queryParamMap.get('expenseObjectId') || '';
      if (expenseObjectId !== '') {
        this.expenseService.expenseDetail = await this.expenseService.getExpenseDetail(expenseObjectId);
      }
      // get user option
      const usersList: any = await this.userService.inquiryUserOptionsAndRoleCodeV2(
        'KLAW',
        ['KLAW_FINANCIAL'],
        undefined,
        ['APPROVER']
      );
      if (!!usersList) {
        this.userService.kFinanceApprvOptions = usersList;
      }
    } else if (['CONSIDER_REMAINING_COSTS', 'CONSIDER_APPROVE_CLOSE_LG'].includes(this.taskCode)) {
      this.lawsuitService.currentLitigation.expenseInfo = await this.lawsuitService.getExpenseInfo(
        this.taskService.taskDetail.litigationId || ''
      );
    }
  }

  async auctionExpenseNonEfilingResolve(_route: ActivatedRouteSnapshot) {
    const auctionExpenseId = Number(this.objectId);
    const response = await Promise.all([
      this.auctionService.getAuctionExpenseInfo(auctionExpenseId),
      this.auctionPaymentService.getUploadReceiptAuctionExpenseNonEFilling(auctionExpenseId),
    ]);
    this.auctionService.auctionExpenseInfo = response[0];
    this.auctionPaymentService.auctionExpenseNonEFilingInvoice = response[1];
    this.auctionService.auctionPaymentType = this.auctionService.auctionExpenseInfo?.auctionExpenseType || '';
    this.auctionService.litigationId = this.taskService.taskDetail.litigationId || '';
    this.auctionService.litigationCaseId = this.taskService.taskDetail.litigationCaseId || '';
    this.auctionService.auctionExpenseId = auctionExpenseId || '';
  }

  async preferenceResolve(_route: ActivatedRouteSnapshot) {
    let preferenceId = this.taskService.taskDetail.objectId?.toString() || '0';

    let mode: 'ADD' | 'VIEW' | 'EDIT' = 'VIEW';
    if(this.taskService.taskDetail.taskCode == taskCode.EXECUTE_PREFERENCE && this.taskService.taskDetail.statusCode === statusCode.CORRECT_PENDING){
      mode = 'EDIT';
    }
    const preferenceDetails : PreferenceDetails = await this.preferenceService.inquiryDetails(preferenceId, mode);
    this.preferenceService.preferenceDetail = preferenceDetails;
    this.preferenceService.preferenceDetailForm = this.preferenceService.createPreferenceDetailForm(preferenceDetails);
  }

  async initTaskDetail(_taskId: string) {
    const _taskCode = this.taskService.taskDetail.taskCode as taskCode;
    const _statusCode = this.taskService.taskDetail.statusCode as statusCode;
    const _litigationId = this.taskService.taskDetail.litigationId || '';
    const _customerId = this.taskService.taskDetail.customerId || this.customerId || '';
    if (_taskCode) {
      if (TaskCodeLitigation.includes(_taskCode)) {
        await Promise.all([
          this.masterDataService.court(),
          this.masterDataService.courtOrder(),
          this.masterDataService.suspensExecution(),
        ]);
        // TaskCodeLitigation is the list of permission which is now has 'CHANGE_RELATED_PERSON', 'EDIT_MORTGAGE_ASSETS'
        const litigationResponse = await this.lawsuitService.getLitigation(_litigationId, Number(_taskId));
        this.lawsuitService.currentLitigation = litigationResponse;
        if (
          _taskCode === 'CONFIRM_COURT_FEES_PAYMENT' ||
          _taskCode === 'UPLOAD_COURT_FEES_RECEIPT' ||
          _taskCode === 'RECORD_OF_APPEAL' ||
          _taskCode === 'RECORD_OF_SUPREME_COURT' ||
          _taskCode === 'UPLOAD_E_FILING' ||
          _taskCode === 'RECORD_OF_SUPREME_COURT_ACKNOWLEDGE' ||
          _taskCode === 'TRY_CONFIRM_COURT_FEES_PAYMENT' ||
          _taskCode === 'RECORD_DIAGNOSIS_DATE'
        ) {
          if (this.routerService.previousUrl.includes('task/detail/suit-indictment')) {
            this.suitService.litigationCase = this.suitService.litigationCase;
          } else {
            this.suitService.litigationCase =
              (await this.suitService.getLitigationCase(_litigationId, Number(_taskId))) ?? [];
          }
        }

        // getLitigationCaseDetail for taskCode INDICTMENT_RECORD
        if (_taskCode === 'INDICTMENT_RECORD') {
          const caseId = this.taskService.taskDetail.litigationCaseId;

          if (this.routerService.previousUrl.includes('task/detail/suit-indictment')) {
            this.suitService.litigationCase = this.suitService.litigationCase;
          } else {
            this.suitService.litigationCase = await this.suitService.getLitigationCase(_litigationId, Number(_taskId));
          }

          /** patch current data to this.suitService.litigationCase */
          this.suitService.litigationCase.forEach(item => {
            item.cases = item.cases?.map((_case: any) => {
              if (_case.id === Number(caseId)) {
                const _result = { ..._case, ...this.suitService.litigationCaseDetail };
                return _result;
              }
              return _case;
            });
          });
        } else if (_taskCode === 'RECORD_OF_SUPREME_COURT_ACKNOWLEDGE') {
          this.suitService.statusCodeFromTask = _statusCode;
          this.suitService.taskCodeFromTask = _taskCode;
          const suitLitigationCaseId = Number(this.taskService.taskDetail.litigationCaseId ?? -1);
          const taskId = this.taskService.taskDetail.id || -1;
          this.suitService.litigationCaseDetail =
            (await this.suitService.setUpdateLitigationCaseDetailByTaskCaseId(
              [...this.suitService.litigationCase],
              suitLitigationCaseId,
              taskId
            )) ?? {};
          this.suitService.updateLitigationCaseDetail = this.suitService.litigationCaseDetail;
        } else if (_taskCode === 'UPLOAD_E_FILING' && !this.suitService.updateLitigationCaseDetail) {
          /* ถ้ามี uploadDto อยู่แล้วจะไม่เซตใหม่เพราะมีการอมค่าอยู่ */
          this.suitService.statusCodeFromTask = _statusCode;
          this.suitService.taskCodeFromTask = _taskCode;
          const suitLitigationCaseId = Number(this.taskService.taskDetail.litigationCaseId ?? -1);
          const taskId = this.taskService.taskDetail.id || -1;
          const tempUpdateLgCaseDetail = await this.suitService.setUpdateLitigationCaseDetailByTaskCaseId(
            [...this.suitService.litigationCase],
            suitLitigationCaseId,
            taskId
          );
          this.suitService.updateLitigationCaseDetail = this.suitService.isUpdateLitigationCaseDetailLegit(
            tempUpdateLgCaseDetail,
            taskId,
            _statusCode,
            _taskCode
          )
            ? tempUpdateLgCaseDetail
            : null;
          if (_statusCode === 'PENDING_APPROVAL') {
            this.suitService.litigationCaseDetail = tempUpdateLgCaseDetail ?? {};
          }
        } else if (_taskCode === 'TRY_CONFIRM_COURT_FEES_PAYMENT') {
          this.suitService.taskCodeFromTask = _taskCode;
        }

        if (litigationResponse) {
          this.taskService.litigationDetail = litigationResponse;

          //LEX2-3379 check task INVESTIGATE_HEIR_OR_TRUSTEE ภายใต้ LG เดียวกัน ถ้ายังอยู่ระหว่างอนุมัติ จะเป็น mode view-only
          if (_taskCode === 'INVESTIGATE_HEIR_OR_TRUSTEE' && litigationResponse.checkStatusAddHeir) {
            const warning = await this.notificationService.warningDialog(
              'TASK.WARNING_HOLDTASK_ADDHEIR_TITLE',
              'TASK.WARNING_HOLDTASK_ADDHEIR_MESSAGE',
              'TASK.BTN_NEXT',
              'icon-Arrow-Right'
            );
            if (!warning) {
              this.routerService.back();
              this.logger.logResolverEnd('TaskResolver');
              return null;
            }
          } else if (_taskCode === 'R2E07-02-B' || _taskCode === 'R2E07-04-D' || _taskCode === 'R2E07-03-C') {
            // DEFERMENT OF EXECUTION
            const res = await this.defermentService.inquiryDefermentExec({
              customerId: _customerId,
              defermentId: this.objectId,
              litigationId: this.taskService.litigationDetail.litigationId,
              defermentType: this.taskService.litigationDetail.defermentExecInfo?.defermentType || 'DEFERMENT',
              mode: 'APPROVE',
              taskId: Number(this.taskId),
            });
            this.defermentService.deferment = res;
            this.defermentService.litigations =
              res?.deferment?.defermentLitigationInfos?.map(m => m?.litigationId) || [];
          }
          return { ...taskMapper.get(_taskCode) } as TaskMode;
        } else {
          return null;
        }
      } else if (TaskCodeCustomer.includes(_taskCode)) {
        // TaskCodeCustomer is the list of permission which is now has 'VERIFY_INFO_AND_DOCUMENT'
        const customerResponse = await this.customerService.getCustomer(_customerId);
        if (customerResponse) {
          this.taskService.customerDetail = customerResponse;
          return { ...taskMapper.get(_taskCode) } as TaskMode;
        } else {
          return null;
        }
      }
      // else if (
      //   TaskCodeConfiguration.includes(_taskCode) ||
      //   TaskCodeFinance.includes(_taskCode) ||
      //   TaskCodeFinanceEdit.includes(_taskCode)
      // ) {
      //   // TaskCodeConfiguration is the list of permission which is now has 'RESPONSE_UNIT_MAPPING'
      //   // TaskCodeFinance is the list of permission
      //   return { ...taskMapper.get(_taskCode) } as TaskMode;
      // } else if (TaskCodeLitigationExecution.includes(_taskCode)) {
      //   return { ...taskMapper.get(_taskCode) } as TaskMode;
      // } else if (TaskCodeLitigationSeizureProperty.includes(_taskCode)) {
      //   return { ...taskMapper.get(_taskCode) } as TaskMode;
      // }
      else {
        return ({ ...taskMapper.get(_taskCode) } as TaskMode) || null;
      }
    } else {
      return null;
    }
  }
}
