import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { CourtService } from '@app/modules/court/court.service';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { AdvanceService } from '@app/modules/finance/services/advance.service';
import { ExpenseService } from '@app/modules/finance/services/expense.service';
import { SuitService } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { WithdrawnSeizurePropertyService } from '@app/modules/withdrawn-seizure-property/withdrawn-seizure-property.service';
import { WithdrawnWritExecutionService } from '@app/modules/withdrawn-writ-execution/withdrawn-writ-execution.service';
import { statusCode, taskCode, taskMode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  CancelAdvanceReceiveOrderRequest,
  CancelRequest,
  CommonResponse,
  CreateAdvanceReceivePayTransferRequest,
  DefermentItem,
  DefermentReviseRequest,
  ExpenseCancelReasonDto,
  ExpenseClaimDto,
  ExpenseReviseReasonDto,
  ExpenseTransactionNoteDto,
  HeirInfoRequest,
  NameValuePair,
  PostApprovalRequest,
  RefundRequest,
  RejectRequest,
  ReviseRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DebtRelatedInfoTabService } from '../../debt-related-info-tab/debt-related-info-tab.service';

@Component({
  selector: 'app-reject-dialog',
  templateUrl: './reject-dialog.component.html',
  styleUrls: ['./reject-dialog.component.scss'],
})
export class RejectDialogComponent implements OnInit {
  public reason = new UntypedFormControl('');
  public selectedReason = new UntypedFormControl('');
  private taskId!: number;
  private mode!: taskMode | 'WITHDRAWN_SEIZURE_PROPERTY' | 'WITHDRAWN_WRIT_EXECUTION' | 'DEFAULT' | 'SEIZURE';
  public taskCode!: taskCode;
  private customerId!: string;
  private litigationId!: string;
  private litigationCaseId!: string;
  private courtTaskCodes: taskCode[] = [
    'MEMORANDUM_COURT_FIRST_INSTANCE',
    'MEMORANDUM_COURT_APPEAL',
    'MEMORANDUM_SUPREME_COURT',
    'CONSIDER_APPEAL',
    'APPROVE_APPEAL',
    'CONDITIONAL_APPEAL',
    'CONSIDER_SUPREME_COURT',
    'APPROVE_SUPREME_COURT',
    'CONDITIONAL_SUPREME_COURT',
    'DECREE_OF_FIRST_INSTANCE',
    'DECREE_OF_APPEAL',
    'DECREE_OF_SUPREME_COURT',
  ];
  private appealReasonOptions = new Map<string, string>([
    ['APPEAL_REASON_0', 'อยู่ในอำนาจพิจารณาของ KTBLAW'],
    ['APPEAL_REASON_1', 'เอกสารไม่เพียงพอต่อการพิจารณา'],
    ['OTHER', ''],
  ]);
  private expenseObjectId!: string;
  private receiveNo!: string;
  public expenseStatus!: string;
  private expenseTransactions!: any;
  public placeholderTxtArea = this.translate.instant('COMMON.LABEL_REMARKS');
  public customPlaceholderTxtArea = '';
  private isCopyWritingRefund: boolean = false;

  private dataForm!: UntypedFormGroup;

  public configPayment = { labelPlaceHolder: 'กรุณาระบุเหตุผลยกเลิกรายการ', displayWith: 'name', valueField: 'value' };
  public optionsPayment: NameValuePair[] = [];

  // LEX2-7572: for expense tasks, use expenseStatus instead (in selectedReasonSubTasks)
  public selectedReasonTasks: taskCode[] = [
    /* 'EXPENSE_CLAIM_PAYMENT_APPROVAL', 'EXPENSE_CLAIM_SYSTEM_PAYMENT' */
  ];
  public selectedRadioTasks: taskCode[] = ['APPROVE_APPEAL', 'APPROVE_SUPREME_COURT'];
  public selectedReasonSubTasks: string[] = [
    'PENDING_PAYMENT_CONSIDERATION',
    'PENDING_PAYMENT_APPROVAL_CONSIDERATION',
    'PENDING_PAYMENT_APPROVAL',
    'PENDING_AUTO_PAYMENT_VERIFICATION',
    'PENDING_AUTO_PAYMENT_APPROVAL',
  ];
  public maxTextArea: number = 1000;
  public action: string = 'REJECT';
  private advanceReceiveNo!: string;
  private cancelReasonOther!: string;
  private advanceRequestObj!: CreateAdvanceReceivePayTransferRequest;
  private reverseExpenseAccept!: boolean;
  public showMsgContent: boolean = false;
  public showFieldContent: boolean = false;
  public msgContentText!: string;
  public fieldContentText!: string;
  public fieldContentValue!: string;
  public titleFieldContent!: string;
  private withdrawSeizureId!: number;
  private withdrawWritOfExecId!: number;

  private statusCode: string = '';
  private deceasePersonId: string = '';

  /**
   * Return data after closing dialog
   *
   * It helps you if you won't inject service into this (common) dialog
   * and let parent component handle the returned data.
   */
  private returnRawData: object | string = 'REJECTED';
  public cdkAutosizeMinRows: number = 13;
  constructor(
    private lawsuitService: LawsuitService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private suitService: SuitService,
    private routerService: RouterService,
    private courtService: CourtService,
    private expenseService: ExpenseService,
    private masterDataService: MasterDataService,
    private advanceService: AdvanceService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private defermentService: DefermentService,
    private withdrawnWritExecutionService: WithdrawnWritExecutionService,
    private logger: LoggerService
  ) {}

  get isCancelExpClaimAutoPay() {
    return this.taskCode === 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL' && this.action === 'CANCEL';
  }

  get isCancelExpClaimSysPay() {
    return this.taskCode === 'EXPENSE_CLAIM_SYSTEM_PAYMENT' && this.action === 'CANCEL';
  }

  async ngOnInit(): Promise<void> {
    if (
      this.selectedReasonTasks.includes(this.taskCode) ||
      this.selectedRadioTasks.includes(this.taskCode) ||
      this.selectedReasonSubTasks.includes(this.expenseStatus)
    ) {
      this.selectedReason.setValidators(Validators.required);
      this.selectedReason.updateValueAndValidity();
    }
    if (this.customPlaceholderTxtArea) {
      this.placeholderTxtArea = this.customPlaceholderTxtArea;
    } else if (this.expenseStatus === 'PENDING_AUTO_REVERSE_EXPENSE_CLAIM') {
      this.placeholderTxtArea = this.translate.instant('FINANCE.REJECT_DIALOG.TEXTAREA_PLACEHOLDER_REFUND');
    } else {
      this.placeholderTxtArea =
        this.mode === 'FINANCE_EXPENSE' ||
        this.mode === 'FINANCE_RECEIPT' ||
        this.mode === 'SEIZURE' ||
        this.mode == 'LITIGATION'
          ? 'กรุณาระบุหมายเหตุการพิจารณา'
          : this.mode === 'FINANCE_ADVANCE'
            ? 'กรุณาระบุหมายเหตุการพิจารณา'
            : this.translate.instant('COMMON.LABEL_REMARKS');
    }
    if (
      this.isCancelExpClaimAutoPay ||
      this.isCancelExpClaimSysPay ||
      this.selectedReasonTasks.includes(this.taskCode) ||
      this.selectedReasonSubTasks.includes(this.expenseStatus)
    ) {
      if (this.action === 'CANCEL') {
        const expenseCancelReason: ExpenseCancelReasonDto = await this.masterDataService.getExpenseCancelReason();
        this.optionsPayment = expenseCancelReason.cancelReason || [];
      } else {
        const expenseReviseReason: ExpenseReviseReasonDto = await this.masterDataService.getExpenseReviseReason();
        this.optionsPayment = expenseReviseReason.reviseReason || [];
      }
      this.selectedReason.setValidators(null);
      this.selectedReason.clearValidators();
    } else {
      this.reason.setValidators(Validators.required);
      this.reason.updateValueAndValidity();
    }

    if (this.action === 'REJECT') {
      this.configPayment = { ...this.configPayment, labelPlaceHolder: 'กรุณาระบุเหตุผลส่งกลับแก้ไข' };
    } else if (this.action === 'CANCEL') {
      let labelPlaceHolder = 'กรุณาระบุเหตุผลยกเลิกรายการ';

      if (this.isCopyWritingRefund) {
        labelPlaceHolder = 'กรุณาระบุเหตุผลการขอคืนเงิน';
      }

      this.configPayment = { ...this.configPayment, labelPlaceHolder };
    }
  }

  dataContext(data: any) {
    this.taskId = data.taskId;
    this.mode = data.mode;
    this.customerId = data.customerId;
    this.litigationId = data.litigationId;
    this.taskCode = data.taskCode;
    this.litigationCaseId = data.litigationCaseId;
    this.expenseObjectId = data.expenseObjectId;
    this.receiveNo = data.receiveNo;
    this.expenseStatus = data.expenseStatus;
    this.expenseTransactions = data.expenseTransactions;
    this.maxTextArea = data.maxTextArea || 1000;
    this.action = data.action || 'REJECT';
    this.advanceReceiveNo = data.advanceReceiveNo;
    this.cancelReasonOther = data.cancelReasonOther;
    this.advanceRequestObj = data.advanceRequest;
    this.reverseExpenseAccept = data.reverseExpenseAccept;
    if (this.expenseStatus === 'PENDING_AUTO_PAYMENT_VERIFICATION' || this.mode === 'FINANCE_RECEIPT') {
      this.dataForm = data.dataForm;
    }
    this.showMsgContent = data.showMsgContent;
    this.showFieldContent = data.showFieldContent;
    this.msgContentText = data.msgContentText;
    this.fieldContentText = data.fieldContentText;
    this.fieldContentValue = data.fieldContentValue;
    this.titleFieldContent = data.titleFieldContent;
    this.withdrawSeizureId = data.withdrawSeizureId;
    this.withdrawWritOfExecId = data.withdrawWritOfExecId;
    this.statusCode = data.statusCode;
    this.deceasePersonId = data.deceasePersonId;
    this.isCopyWritingRefund = !!data.isCopyWritingRefund;

    if (typeof data.placeholderTxtArea === 'string') this.customPlaceholderTxtArea = data.placeholderTxtArea;
    if (typeof data.cdkAutosizeMinRows === 'number') this.cdkAutosizeMinRows = data.cdkAutosizeMinRows;
  }

  onSelectedOption(event: any) {
    if (
      event === 'OTHER' ||
      (this.action !== 'CANCEL' && event === '6') ||
      (this.action !== 'CANCEL' && event === '7') ||
      (this.action === 'CANCEL' && event === '2') ||
      (this.action === 'CANCEL' && event === '3')
    ) {
      this.reason.setValidators(Validators.required);
    } else {
      if (this.mode === 'FINANCE_EXPENSE' && this.selectedReasonSubTasks.includes(this.expenseStatus)) {
        if (event === '7') {
          this.reason.setValidators(Validators.required);
        } else {
          this.reason.clearValidators();
        }
      } else {
        if (event === '6' || event === '7' || event === '3' || event === '2') {
          this.reason.setValidators(Validators.required);
        } else {
          this.reason.clearValidators();
        }
      }
    }

    this.reason.updateValueAndValidity();
  }

  onSelectedReason(event: MatRadioChange) {
    if (event.value !== 'OTHER') {
      this.reason.clearValidators();
    } else {
      this.reason.markAsUntouched();
      this.reason.setValidators(Validators.required);
    }
    this.reason.updateValueAndValidity();
  }

  private clearAllDataBeforeClose() {
    this.expenseService.clearDataPayment();
    this.advanceService.clearData();
  }

  private navigateTo(route: string, queryParams?: object) {
    this.clearAllDataBeforeClose();
    this.routerService.navigateTo(route, { ...queryParams });
  }

  public async onClose(): Promise<string | boolean> {
    if (this.selectedReason.valid && this.reason.valid) {
      // DEFAULT mode treats dialog behavior as normoal dialog (no service calling)
      if (this.mode === 'DEFAULT' || this.mode === 'SEIZURE') {
        this.returnRawData = { reason: this.reason.value };
        return true;
      } else if (this.mode === 'LITIGATION') {
        if (this.taskCode === 'INDICTMENT_RECORD' || this.taskCode === 'UPLOAD_E_FILING') {
          try {
            const response = await this.suitService.litigationCaseReject(
              this.taskId,
              this.reason.value,
              this.taskCode === 'INDICTMENT_RECORD' && this.action === 'REVISE' ? true : undefined
            );
            if (response === null) {
              this.alertSnackbar();
              this.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
              return 'REJECTED';
            }
          } catch (error) {
            this.notificationService.openSnackbarError(
              this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED')
            );
            return false;
          }
        } else if (this.courtTaskCodes.includes(this.taskCode)) {
          try {
            const _reason =
              this.taskCode === 'APPROVE_APPEAL' && this.selectedReason.value !== 'OTHER'
                ? this.appealReasonOptions.get(this.selectedReason.value)
                : this.reason.value;
            const response = await this.courtService.reject(this.taskId, { reason: _reason } as RejectRequest);
            if (response === null) {
              this.alertSnackbar();
              this.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
              return 'REJECTED';
            }
          } catch (error) {
            this.notificationService.openSnackbarError(
              this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED')
            );
            return false;
          }
        } else if (this.taskCode === 'PROCESS_NOT_PROSECUTE_1' || this.taskCode === 'PROCESS_NOT_PROSECUTE_2') {
          try {
            let heirInfoRequest: HeirInfoRequest = {
              approvalStatus:
                this.action === 'APPROVE'
                  ? HeirInfoRequest.ApprovalStatusEnum.Approve
                  : HeirInfoRequest.ApprovalStatusEnum.Reject,
              deceasePersonId: this.deceasePersonId,
              reason: this.reason.value || '',
            };
            await this.debtRelatedInfoTabService.processNotProsecute(this.taskId, heirInfoRequest);
            this.alertSnackbar();
            this.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
            return 'REJECTED';
          } catch (error) {
            this.notificationService.openSnackbarError(
              this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED')
            );
            return false;
          }
        } else if (
          this.action === 'REVISE' &&
          (this.taskCode === 'REQUEST_DEFERMENT' ||
            this.taskCode === 'EXTEND_DEFERMENT' ||
            this.taskCode === 'REQUEST_CESSATION')
        ) {
          try {
            let body: DefermentReviseRequest = {
              // approverId: this.taskService.taskDetail.approverId,
              // defermentId: this.defermentService.deferment.deferment?.defermentId,
              reason: this.reason.value,
              taskId: this.taskId,
            };
            const response = await this.defermentService.revise(body);
            if (response.success) {
              this.alertSnackbar();
              this.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
              return 'REVISE';
            }
          } catch (error) {
            this.notificationService.openSnackbarError(
              this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED')
            );
            return false;
          }
        } else if (this.taskCode === 'AUTO_CREATE_DRAFT_DEFERMENT' || this.taskCode === 'AUTO_CREATE_DRAFT_CESSATION') {
          try {
            await this.lawsuitService.reject(this.taskId, this.reason.value);
            this.alertSnackbar();
            this.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
            return 'REVISE';
          } catch (error) {
            this.notificationService.openSnackbarError(
              this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED')
            );
            return false;
          }
        } else if (this.taskCode === taskCode.R2E07_02_B || this.taskCode === taskCode.R2E07_03_C) {
          try {
            if (this.action === 'REVISE') {
              const response = await this.defermentService.reviseExec({
                reason: this.reason.value,
                taskId: this.taskId,
              });
              if (response.success) {
                this.alertSnackbar();
                this.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
                return 'REVISE';
              }
            } else {
              let req: RejectRequest = {
                reason: this.reason.value,
              };
              await this.defermentService.reject(this.taskId, req);
              this.alertSnackbar();
              this.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
              return 'REJECTED';
            }
          } catch (error) {
            this.notificationService.openSnackbarError(
              this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED')
            );
            return false;
          }
        } else {
          try {
            const response = await this.lawsuitService.reject(this.taskId, this.reason.value);
            if (response === null) {
              this.alertSnackbar();
              this.navigateTo('/main/task', { statusCode: statusCode.FINISHED });
              return 'REJECTED';
            }
          } catch (error) {
            this.notificationService.openSnackbarError(
              this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED')
            );
            return false;
          }
        }
      } else if (this.mode === 'FINANCE_EXPENSE') {
        const expenseClaimDto: ExpenseClaimDto[] = this.expenseTransactions?.map((m: any) => {
          return {
            expenseNo: this.expenseObjectId,
            isApproved: m.isApproved,
            litigationCaseId: m.litigationCaseId,
            litigationId: m.lgId,
            id: m.id,
            note: m.note,
          } as ExpenseClaimDto;
        });
        let rejectReason = '';
        if (
          (this.taskCode === 'EXPENSE_CLAIM_PAYMENT_APPROVAL' ||
            this.taskCode === 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL' ||
            this.taskCode === 'EXPENSE_CLAIM_SYSTEM_PAYMENT') &&
          this.selectedReasonSubTasks.includes(this.expenseStatus)
        ) {
          rejectReason = this.optionsPayment.find(item => item.value === this.selectedReason.value)?.name || '';
        } else if (this.taskCode === 'EXPENSE_CLAIM_VERIFICATION' || this.taskCode === 'EXPENSE_CLAIM_CORRECTION') {
          rejectReason = ''; // the reason will be in 'note' instead
        }
        try {
          let response;
          const requestObj: ReviseRequest = {
            expenseClaimDto: expenseClaimDto,
            rejectReason: rejectReason,
            note: this.reason.value,
            expenseStatus: this.expenseStatus as ReviseRequest.ExpenseStatusEnum,
          };
          if (
            this.action === 'CANCEL' &&
            (this.taskCode === 'EXPENSE_CLAIM_CORRECTION' || this.taskCode === 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL')
          ) {
            if (this.expenseStatus === 'PENDING_AUTO_PAYMENT_VERIFICATION') {
              let req = this.expenseService.getExpenseApprovalRequest(
                {
                  ...this.dataForm.getRawValue(),
                  expenseTransactionDto: this.expenseService.expenseTransactionRequest,
                },
                'SUBMIT'
              );
              req.cancelReason = this.optionsPayment.find(item => item.value === this.selectedReason.value)?.name;
              req.cancelReasonNote = this.reason.value;
              req.expenseStatus = this.expenseStatus as CancelRequest.ExpenseStatusEnum;
              response = await this.expenseService.approve(this.taskId, req);
            } else {
              const isApprovedTransaction =
                this.isCopyWritingRefund && this.expenseTransactions.length === 1
                  ? this.expenseTransactions[0].isApproved
                  : undefined; // LEX2-41886
              const req: CancelRequest = {
                cancelReason:
                  this.optionsPayment && this.optionsPayment.length > 0
                    ? this.optionsPayment.find(item => item.value === this.selectedReason.value)?.name
                    : '',
                expenseStatus: this.expenseStatus as CancelRequest.ExpenseStatusEnum,
                expenseTransactionNoteDtoList:
                  this.expenseTransactions && this.expenseTransactions.length > 0
                    ? this.expenseTransactions.map((m: any) => {
                        return {
                          id: m.id,
                          note: m.note,
                        } as ExpenseTransactionNoteDto;
                      })
                    : [],
                isApprovedTransaction,
                note: this.reason.value,
              };
              response = await this.expenseService.cancel(this.taskId, req);
            }
          } else if (
            this.taskCode === 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT' ||
            this.taskCode === 'REVERSE_EXPENSE_CLAIM_OTHER' ||
            this.taskCode === 'DECIDE_REVERSE_EXPENSE_CLAIM' ||
            this.expenseStatus === 'SUCCESS_AUTO_PAYMENT'
          ) {
            const req: RefundRequest = {
              expenseTransactionNoteDtoList:
                this.expenseTransactions?.map((m: any) => {
                  return {
                    id: m.id,
                    note: m.note,
                  } as ExpenseTransactionNoteDto;
                }) || [],
              isAccept:
                this.taskCode === 'DECIDE_REVERSE_EXPENSE_CLAIM'
                  ? this.reverseExpenseAccept
                  : this.expenseStatus === 'SUCCESS_AUTO_PAYMENT'
                    ? true
                    : false,
              note: this.reason.value,
            };
            response = await this.expenseService.refund(this.taskId, req);
          } else {
            let isCheckApprove = requestObj.expenseClaimDto?.filter(
              x => x.isApproved === null || x.isApproved === undefined
            );
            if (isCheckApprove !== undefined && isCheckApprove.length === 0) {
              response = await this.expenseService.reject(this.taskId, requestObj);
            } else {
              return false;
            }
          }
          if (response === null) {
            this.alertSnackbar();
            this.navigateTo('/main/finance/expense', { statusCode: statusCode.FINISHED });
            return 'REJECTED';
          }
        } catch (error) {
          this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED'));
          return false;
        }
      } else if (this.mode === 'FINANCE_RECEIPT') {
        try {
          const requestObj: RejectRequest = {
            reason: this.reason.value,
          };
          if (this.dataForm) {
            this.dataForm.get('rejectRequest.reason')?.setValue(this.reason.value);
          }
          return 'REJECTED';
        } catch (error) {
          this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED'));
          return false;
        }
      } else if (this.mode === 'FINANCE_ADVANCE' && this.action === 'CANCEL') {
        try {
          const requestObj: CancelAdvanceReceiveOrderRequest = {
            advanceReceiveNo: this.advanceReceiveNo,
            cancelReason: this.reason.value,
            cancelReasonOther: this.cancelReasonOther,
          };
          const response: CommonResponse = await this.advanceService.cancelAdvanceReceiveOrder(requestObj);
          if (response.success) {
            this.notificationService.openSnackbarSuccess(
              `รายการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย ${response.receiveNo} ยกเลิกรายการสำเร็จแล้ว`
            );
            this.navigateTo('/main/finance/advance');
            return 'REJECTED';
          }
        } catch (error) {
          this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED'));
          return false;
        }
      } else if (this.mode === 'FINANCE_ADVANCE' && this.action === 'REJECT') {
        try {
          const requestObj: CreateAdvanceReceivePayTransferRequest = {
            advanceReceiveNo: this.advanceRequestObj.advanceReceiveNo,
            createAdvancePayTransferInfo: this.advanceRequestObj.createAdvancePayTransferInfo,
            headerFlag: this.advanceRequestObj.headerFlag,
            reason: this.reason.value,
          };

          const response = await this.advanceService.createAdvanceReceive(this.taskId || 0, requestObj);
          if (response.success) {
            this.notificationService.openSnackbarSuccess(
              `รายการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย ${response.receiveNo} นำส่งกลับแก้ไขสำเร็จแล้ว`
            );
            this.advanceService.clearData();
            this.navigateTo('/main/finance/advance');
            return 'REJECTED';
          }
        } catch (error) {
          this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_ERROR_REJECTED'));
          return false;
        }
      } else if (this.mode === 'WITHDRAWN_SEIZURE_PROPERTY') {
        const request: PostApprovalRequest = {
          action:
            this.action === 'REJECT' ? PostApprovalRequest.ActionEnum.Reject : PostApprovalRequest.ActionEnum.Return,
          reason: this.reason.value,
        };
        try {
          await this.withdrawnSeizurePropertyService.postWithdrawSeizuresApproval(this.withdrawSeizureId, request);
          return this.action === 'REJECT' ? 'REJECTED' : 'RETURNED';
        } catch (error) {
          this.logger.catchError(error);
        }
      } else if (this.mode === 'WITHDRAWN_WRIT_EXECUTION') {
        const request: PostApprovalRequest = {
          action:
            this.action === 'REJECT' ? PostApprovalRequest.ActionEnum.Reject : PostApprovalRequest.ActionEnum.Return,
          litigationCaseId: Number(this.litigationCaseId),
          litigationId: this.litigationId,
          reason: this.reason.value,
        };
        try {
          await this.withdrawnWritExecutionService.postWithdrawWritOfExecApproval(
            this.taskId,
            this.withdrawWritOfExecId,
            request
          );
          return this.action === 'REJECT' ? 'REJECTED' : 'RETURNED';
        } catch (error) {
          this.logger.catchError(error);
        }
      }
    } else {
      if (this.mode === 'WITHDRAWN_SEIZURE_PROPERTY') {
        this.notificationService.openSnackbarError(`ไม่สามารถทำรายการส่งกลับแก้ไข โปรดลองอีกครั้งภายหลัง`);
      }
    }

    this.selectedReason.markAllAsTouched();
    this.reason.markAllAsTouched();
    return false;
  }

  alertSnackbar() {
    switch (this.taskCode) {
      case 'COLLECT_LG_ID':
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('TASK.REJECT_DIALOG.LG_ID_REJECTED_SUCCESS')
        );
        break;
      case 'REQUEST_DEFERMENT':
        if (this.action === 'REVISE') {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('TASK.REJECT_DIALOG.REQUEST_DEFERMENT_REVISED_SUCCESS', { LG_ID: this.litigationId })
          );
        } else {
          if (
            this.defermentService.deferment?.deferment?.defermentApproverCode === '2' &&
            (this.defermentService.deferment?.deferment?.currentApproveActor === 'FACTION' ||
              this.defermentService.deferment?.deferment?.currentApproveActor === 'GROUP')
          ) {
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
                'TASK.REJECT_DIALOG.REQUEST_DEFERMENT_NOT_AGREE_SUCCESS'
              )}`
            );
          } else {
            this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
                'TASK.REJECT_DIALOG.REQUEST_DEFERMENT_REJECTED_SUCCESS'
              )}`
            );
          }
        }
        break;
      case 'EXTEND_DEFERMENT':
        if (this.action === 'REVISE') {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('TASK.REJECT_DIALOG.EXTEND_DEFERMENT_REVISED_SUCCESS', { LG_ID: this.litigationId })
          );
        } else {
          if (
            this.defermentService.deferment?.deferment?.defermentApproverCode === '2' &&
            (this.defermentService.deferment?.deferment?.currentApproveActor === 'FACTION' ||
              this.defermentService.deferment?.deferment?.currentApproveActor === 'GROUP')
          ) {
            this.notificationService.openSnackbarSuccess(
              this.translate.instant('TASK.REJECT_DIALOG.EXTEND_DEFERMENT_NOT_AGREE_SUCCESS', {
                LG_ID: this.litigationId,
              })
            );
          } else {
            this.notificationService.openSnackbarSuccess(
              this.translate.instant('TASK.REJECT_DIALOG.EXTEND_DEFERMENT_REJECTED_SUCCESS', {
                LG_ID: this.litigationId,
              })
            );
          }
        }
        break;
      case 'AUTO_CREATE_DRAFT_DEFERMENT':
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
            'TASK.REJECT_DIALOG.DEFERMENT_REJECT'
          )}`
        );
        break;
      case 'AUTO_CREATE_DRAFT_CESSATION':
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
            'TASK.REJECT_DIALOG.CESSATION_REJECT'
          )}`
        );
        break;
      case 'MEMORANDUM_COURT_FIRST_INSTANCE':
      case 'MEMORANDUM_COURT_APPEAL':
      case 'MEMORANDUM_SUPREME_COURT':
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('TASK.REJECT_DIALOG.REJECTED_MEMO_COURT_FIRST_INSTANCE_SUCCESS', {
            LG_ID: this.litigationId,
          })
        );
        break;
      case 'CONSIDER_APPEAL':
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('TASK.REJECT_DIALOG.REJECTED_CONSIDER_APPEAL_SUCCESS', { LG_ID: this.litigationId })
        );
        break;
      case 'REQUEST_CESSATION':
        if (this.action === 'REVISE') {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('TASK.REJECT_DIALOG.REQUEST_CESSATION_REVISED_SUCCESS', { LG_ID: this.litigationId })
          );
        } else {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
              'TASK.REJECT_DIALOG.REQUEST_CESSATION_REJECTED_SUCCESS'
            )}`
          );
        }
        break;
      case 'CHANGE_RELATED_PERSON_LITIGATION_CASE':
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LAWSUIT.SNACKBAR_ADD_LAWSUIT_REJECTED', {
            BLACK_CASE: this.lawsuitService.findBlackCaseTaskDetail(Number(this.litigationCaseId)) || '',
          })
        );
        break;
      case 'CHANGE_RELATED_PERSON_BLACK_CASE':
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LEGAL.SNACKBAR_ADD_LEGAL_REJECTED', {
            LG_ID: this.litigationId || '',
          })
        );
        break;
      case 'DECREASE_RELATED_PERSON_LITIGATION_CASE':
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('DEBT_RELATED_INFO_TAB.REMOVE_RELATE_PERSON_LEGAL.SNACKBAR_REMOVE_LEGAL_REJECTED', {
            LG_ID: this.litigationId || '',
          })
        );
        break;
      case 'DECREE_OF_FIRST_INSTANCE':
      case 'DECREE_OF_APPEAL':
      case 'DECREE_OF_SUPREME_COURT':
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('TASK.REJECT_DIALOG.REJECT_DECREE_SUCCESS', {
            LG_ID: this.litigationId || '',
          })
        );
        break;
      case 'UPLOAD_E_FILING':
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('TASK.SUIT_EFILING.SUBMIT_REJECT_PENDING_APPROVAL_UPLOAD_E_FILING', {
            LG_ID: this.litigationId || '',
          })
        );
        break;
      case 'CONSIDER_APPROVE_CLOSE_LG':
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
            'LAWSUIT.CLOSE.MSG_REJECT_SUCCESS'
          )}`
        );
        break;
      case 'EXPENSE_CLAIM_VERIFICATION':
      case 'EXPENSE_CLAIM_PAYMENT_APPROVAL':
      case 'EXPENSE_CLAIM_SYSTEM_PAYMENT':
        let suffixBannerText = 'FINANCE.REJECT_BANNER_MSG_SUCCESS';
        if (this.expenseStatus === 'PENDING_PAYMENT_CONFIRMATION') {
          suffixBannerText = 'FINANCE.NOT_APPROVE_BANNER_MSG';
        }
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('FINANCE.REJECT_BANNER_MSG')}: ${this.expenseObjectId} ${this.translate.instant(
            suffixBannerText
          )}`
        );
        break;
      case 'EXPENSE_CLAIM_CORRECTION':
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('FINANCE.REJECT_BANNER_MSG')}: ${this.expenseObjectId} ${this.translate.instant(
            this.action === 'CANCEL' ? 'FINANCE.CANCEL_BANNER_MSG_SUCCESS' : 'FINANCE.REJECT_BANNER_MSG_SUCCESS'
          )}`
        );
        break;
      case 'RECEIVE_NORMAL_PAYMENT':
        this.notificationService.openSnackbarSuccess(`เลขที่หนังสือรับเงิน ${this.receiveNo} ส่งกลับแก้ไขสำเร็จแล้ว`);
        break;
      case 'RECEIVE_COURT_PAYMENT':
        this.notificationService.openSnackbarSuccess(`เลขที่หนังสือรับเงิน ${this.receiveNo} ส่งกลับแก้ไขสำเร็จแล้ว`);
        break;
      case 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL':
        if (this.action === 'CANCEL') {
          let suffixMsg = 'FINANCE.CANCEL_BANNER_MSG_SUCCESS';
          if (this.isCopyWritingRefund) suffixMsg = 'FINANCE.REFUND_BANNER_MSG_SUCCESS';
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${this.expenseObjectId} ${this.translate.instant(
              suffixMsg
            )}`
          );
        } else {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${this.expenseObjectId} ${this.translate.instant(
              'FINANCE.REJECT_BANNER_MSG_SUCCESS'
            )}`
          );
        }
        break;
      case 'EXPENSE_CLAIM_RECEIPT_UPLOAD':
        const message =
          this.statusCode === 'PENDING_APPROVAL'
            ? this.translate.instant('FINANCE.REJECT_BANNER_MSG_SUCCESS')
            : this.translate.instant('FINANCE.REVERSE_EXPENSE_CANCEL_BANNER_MSG_SUCCESS');
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${this.expenseObjectId} ${message}`
        );
        break;
      case 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT':
      case 'REVERSE_EXPENSE_CLAIM_OTHER':
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${this.expenseObjectId} ${this.translate.instant(
            'FINANCE.REVERSE_EXPENSE_REJECT_BANNER_MSG_SUCCESS'
          )}`
        );
        break;
      case 'DECIDE_REVERSE_EXPENSE_CLAIM':
        if (this.reverseExpenseAccept === true) {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${this.expenseObjectId} ${this.translate.instant(
              'FINANCE.MESSAGE_SECCESS_SUBMIT_DECIDE_REVERSE_EXPENSE'
            )}`
          );
        } else {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${this.expenseObjectId} ${this.translate.instant(
              'FINANCE.DECIDE_REVERSE_EXPENSE_REJECT_BANNER_MSG_SUCCESS'
            )}`
          );
        }
        break;
      case 'AUTO_CREATE_EXPENSE_CLAIM':
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${this.expenseObjectId} ${this.translate.instant(
            'FINANCE.REVERSE_EXPENSE_CANCEL_BANNER_MSG_SUCCESS'
          )}`
        );
        break;
      case 'INVESTIGATE_HEIR_OR_TRUSTEE':
      case 'PROCESS_NOT_PROSECUTE_1':
      case 'PROCESS_NOT_PROSECUTE_2':
        this.action === 'APPROVE'
          ? this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
                'DEBT_RELATED_INFO_TAB.APPROVAL_NOT_PROCEED_CASE_NO_EVIDENCE'
              )}`
            )
          : this.notificationService.openSnackbarSuccess(
              `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
                'DEBT_RELATED_INFO_TAB.INVESTIGATE_HEIR_REJECT_BANNER_MSG_SUCCESS'
              )}`
            );
        break;
      case 'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION':
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${this.expenseObjectId} ${this.translate.instant(
            'LAWSUIT.CLOSE.MSG_REJECT_SUCCESS'
          )}`
        );
        break;
      case taskCode.R2E07_02_B:
        if (this.action === 'REVISE') {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_SEND_FOR_REVISE_SUCCESS', { LG_ID: this.litigationId })
          );
        } else {
          const deferment = this.defermentService.deferment.deferment;
          let rejectText = 'LAWSUIT.DEFERMENT.DEFER_EXEC_REJECT_SUCCESS';
          switch (deferment?.currentApproveActor) {
            case DefermentItem.CurrentApproveActorEnum.Faction:
            case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม, ฝ่าย
              if (deferment.defermentApproverCode === '1') {
                rejectText = 'LAWSUIT.DEFERMENT.DEFER_EXEC_NOT_AGREE_SUCCESS';
              }
              break;
            default:
              break;
          }
          this.notificationService.openSnackbarSuccess(
            this.translate.instant(rejectText, { LG_ID: this.litigationId })
          );
        }
        break;
      case taskCode.R2E07_03_C:
        if (this.action === 'REVISE') {
          this.notificationService.openSnackbarSuccess(
            `ส่งกลับแก้ไขขยายระยะเวลาชะลอบังคับคดีในเลขที่กฎหมาย ${this.litigationId} แล้ว`
          );
        } else {
          const deferment = this.defermentService.deferment.deferment;
          let rejectText = 'ไม่อนุมัติให้เลขที่กฎหมาย';
          switch (deferment?.currentApproveActor) {
            case DefermentItem.CurrentApproveActorEnum.Faction:
            case DefermentItem.CurrentApproveActorEnum.Group: // Actor กลุ่ม, ฝ่าย
              if (deferment.defermentApproverCode === '1') {
                rejectText = 'ไม่เห็นชอบให้เลขที่กฎหมาย';
              }
              break;
            default:
              break;
          }
          this.notificationService.openSnackbarSuccess(`${rejectText} ${this.litigationId} ขยายระยะเวลาชะลอบังคับคดี`);
        }
        break;
      case 'INDICTMENT_RECORD':
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_CIF_NUMBER')}: ${this.customerId} ${this.translate.instant(
            'TASK.REJECT_DIALOG.SUFFIX_REJECTED_SUCCESS'
          )}`
        );
        break;
      default:
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_CIF_NUMBER')}: ${this.customerId} ${this.translate.instant(
            'TASK.REJECT_DIALOG.REJECTED_SUCCESS'
          )}`
        );
        break;
    }
  }

  get returnData() {
    return this.returnRawData;
  }
}
