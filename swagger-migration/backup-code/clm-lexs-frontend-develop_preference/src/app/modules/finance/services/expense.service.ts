import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ConfigurationService } from '@app/modules/configuration/configuration.service';
import { RejectDialogComponent } from '@app/shared/components/common-dialogs/reject-dialog/reject-dialog.component';
import { ExpenseSearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { BlobType, FileType, Mode, TMode, taskCode } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  CancelRequest,
  CollateralsAssetRequest,
  ExpenseApprovalRequest,
  ExpenseControllerService,
  ExpenseDetailDto,
  ExpenseRequest,
  ExpenseTaxDetailRequest,
  ExpenseTransactionDto,
  ExpenseTransactionNoteDto,
  ExpenseTransactionRequest,
  ReceiptRequest,
  RefundRequest,
  ReviseRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { IWithholdingTaxInfo, TActionBarEventName } from '../expense/create-payment-book/create-payment-book.component';
import { CHECK_BOX } from '../expense/expense.constant';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(
    private expenseControllerService: ExpenseControllerService,
    private errorHandlingService: ErrorHandlingService,
    private fb: UntypedFormBuilder,
    private configurationService: ConfigurationService,
    private logger: LoggerService,
    private routerService: RouterService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private sessionService: SessionService
  ) {}

  /** Clear data */
  clearDataPayment() {
    this.expenseDetail = {};
    this.paymentBookForm = null;
    this.expenseTransactionList = null;
    this.expenseTransactionRequest = null;
    this._hasVerify = false;
    this._hasEdit = false;
    this.receiptError = '';
    this.litigationDetailList = [];
    this.litigationDetailListStore = [];
    this.currentReceiptDocs = null;
    this._expenseTransactionDtoSubject.next([]);
  }

  /** Getter Setter Expense DTO */
  private _expenseDetail!: ExpenseDetailDto;
  public get expenseDetail(): ExpenseDetailDto {
    return this._expenseDetail;
  }
  public set expenseDetail(value: ExpenseDetailDto) {
    this._expenseDetail = value;
  }

  private _paymentBookForm!: any | null;
  public get paymentBookForm(): any | null {
    return this._paymentBookForm;
  }
  public set paymentBookForm(value: any | null) {
    this._paymentBookForm = value;
  }

  private _expenseTransactionList!: ExpenseTransactionDto[] | null;
  public get expenseTransactionList(): ExpenseTransactionDto[] | null {
    return this._expenseTransactionList;
  }
  public set expenseTransactionList(value: ExpenseTransactionDto[] | null) {
    this._expenseTransactionList = value;
  }

  private _currentReceiptDocs!: any[] | null;
  public get currentReceiptDocs(): any[] | null {
    return this._currentReceiptDocs;
  }
  public set currentReceiptDocs(value: any[] | null) {
    this._currentReceiptDocs = value;
  }

  private _litigationDetailListStore: ExpenseTransactionDto[] = [];
  public get litigationDetailListStore(): ExpenseTransactionDto[] {
    return this._litigationDetailListStore;
  }
  public set litigationDetailListStore(value: ExpenseTransactionDto[]) {
    this._litigationDetailListStore = value;
  }

  private _litigationDetailList: ExpenseTransactionDto[] = [];
  public get litigationDetailList(): ExpenseTransactionDto[] {
    return this._litigationDetailList;
  }
  public set litigationDetailList(value: ExpenseTransactionDto[]) {
    this._litigationDetailList = value;
  }

  private _expenseTransactionRequest!: ExpenseTransactionRequest[] | null;
  public get expenseTransactionRequest(): ExpenseTransactionRequest[] | null {
    return this._expenseTransactionRequest;
  }
  public set expenseTransactionRequest(value: ExpenseTransactionRequest[] | null) {
    this._expenseTransactionRequest = value;
  }

  private _checkbox: typeof CHECK_BOX = Utils.deepClone(CHECK_BOX);
  public get checkbox(): typeof CHECK_BOX {
    return this._checkbox;
  }
  public set checkbox(value: typeof CHECK_BOX) {
    this._checkbox = value;
  }
  private _receiptError!: string;
  public get receiptError(): string {
    return this._receiptError;
  }
  public set receiptError(value: string) {
    this._receiptError = value;
  }

  private _hasVerify: boolean = false;
  public set hasVerify(value: boolean) {
    this._hasVerify = value;
  }
  public get hasVerify() {
    return this._hasVerify;
  }

  private _tempFormCheck: any;
  public set tempFormCheck(value: any) {
    this._tempFormCheck = value;
  }
  public get tempFormCheck() {
    return this._tempFormCheck;
  }

  private _isFromDetail: boolean = false;
  public set isFromDetail(value: boolean) {
    this._isFromDetail = value;
  }
  public get isFromDetail() {
    return this._isFromDetail;
  }

  private _hasEdit: boolean = false;
  public set hasEdit(value: boolean) {
    this._hasEdit = value;
  }
  public get hasEdit() {
    return this._hasEdit;
  }

  private _actionBarEventName!: TActionBarEventName;
  public set actionBarEventName(value: TActionBarEventName) {
    this._actionBarEventName = value;
  }
  public get actionBarEventName() {
    return this._actionBarEventName;
  }

  private _expenseTransactionDtoSubject: BehaviorSubject<Array<ExpenseTransactionDto>> = new BehaviorSubject(
    [] as ExpenseTransactionDto[]
  );
  get expenseTransactionDtoSubject(): BehaviorSubject<Array<ExpenseTransactionDto>> {
    return this._expenseTransactionDtoSubject;
  }

  navigateToExpenseDetailViewModeView(
    transactionIndex: number | undefined,
    transaction: ExpenseTransactionDto,
    expenseStatusCode: string,
    expenseDetail: ExpenseDetailDto,
    seizureType?: string
  ) {
    const isAutoPay =
      expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION' ||
      expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL';

    this.routerService.navigateTo('/main/finance/expense/detail/expense-detail-view', {
      mode: TMode.VIEW,
      litigationId: transaction.lgId,
      litigationCaseId: transaction.litigationCaseId,
      transactionIndex: transactionIndex,
      transactionId: transaction.id,
      expenseRateId: expenseDetail.expenseRateId,
      expenseNo: expenseDetail.expenseNo,
      isAutoPay: isAutoPay,
      expenseGroup: expenseDetail.expenseGroup,
      transactionIdList: expenseDetail.expenseTransactionDto?.map(e => e.id).join(','),
      seizureObjectType: transaction.objectType,
      seizureType: seizureType || undefined,
      stepCode: expenseDetail.stepCode,
      orderId: (transactionIndex || 0) + 1,
    });
  }

  /** Form Generator */
  generatePaymentBookForm(_payment?: any | null) {
    const now = new Date();
    return this.fb.group({
      stepCode: [{ value: _payment?.stepCode || undefined, disabled: false }, Validators.required],
      stepSubCode: [{ value: _payment?.stepSubCode || undefined, disabled: false }, Validators.required],
      expenseTypeCode: [{ value: _payment?.expenseTypeCode || undefined, disabled: false }, Validators.required],
      expenseSubTypeCode: [{ value: _payment?.expenseSubTypeCode || undefined, disabled: false }, Validators.required],
      expenseRateId: [{ value: _payment?.expenseRateId || undefined, disabled: false }, Validators.required],
      note: [{ value: _payment?.note || undefined, disabled: false }],
      assigneeId: [{ value: _payment?.assigneeId || undefined, disabled: false }, Validators.required],
      receiptDate: [{ value: _payment?.receiptDate || now, disabled: false }],
      approverId: [{ value: _payment?.approverId || undefined, disabled: false }],
    });
  }

  generateApproveForm(expenseDetail: ExpenseDetailDto) {
    let validators: ValidatorFn[] = [];
    if (
      expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_CONSIDERATION' ||
      expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_APPROVAL_CONSIDERATION' ||
      expenseDetail?.expenseStatusCode === 'PENDING_AUTO_PAYMENT_VERIFICATION'
    ) {
      validators = [Validators.required];
    }
    let expenseTransaction: ExpenseTransactionDto[] = [];
    if (expenseDetail.expenseGroup === 1) {
      expenseDetail.mergedExpenseTransaction && expenseTransaction.push(expenseDetail.mergedExpenseTransaction);
    } else {
      expenseTransaction = expenseDetail.expenseTransactionDto || [];
    }
    return this.fb.group({
      stepCode: [{ value: expenseDetail.stepCode, disabled: false }],
      stepSubCode: [{ value: expenseDetail.stepSubCode, disabled: false }],
      expenseTypeCode: [{ value: expenseDetail.expenseTypeCode, disabled: false }],
      expenseSubTypeCode: [{ value: expenseDetail.expenseSubTypeCode, disabled: false }],
      assigneeId: [{ value: expenseDetail.defaultApproverId, disabled: false }, validators],
      cancelReason: [{ value: expenseDetail.cancelReason || '', disabled: false }],
      expenseNo: [{ value: expenseDetail.expenseNo || '', disabled: false }],
      expenseRateId: [{ value: expenseDetail.expenseRateId || '', disabled: false }],
      expenseStatus: [{ value: expenseDetail.expenseStatusCode || '', disabled: false }],
      expenseTransactionDto: this.getArrExpenseTransaction(expenseTransaction, expenseDetail?.expenseStatusCode) || [],
      headerFlag: [{ value: null, disabled: false }],
      isRequestKbm: [{ value: false, disabled: false }],
      note: [{ value: expenseDetail.note || '', disabled: false }],
      receiveDate: [
        { value: this.setValueReceiveDate(expenseDetail), disabled: false },
        this.validatorReceiveDate(expenseDetail?.expenseStatusCode),
      ],
      rejectReason: [{ value: expenseDetail.rejectReason || '', disabled: false }],
      requestKbmReason: [{ value: expenseDetail.requestKbmReason || '', disabled: false }],
    });
  }

  getArrExpenseTransaction(items: ExpenseTransactionDto[], expenseStatusCode?: string) {
    let arrCtrl = this.fb.array([]);
    items.forEach((el, i) => {
      arrCtrl.push(this.getExpenseTransactionDto(el, i, expenseStatusCode));
    });
    return arrCtrl;
  }

  getExpenseTransactionDto(el: ExpenseTransactionDto, index: number, expenseStatusCode?: string) {
    return this.fb.group({
      actualLed: el.actualLed,
      assetInspectionDate: el.assetInspectionDate,
      blackCaseNo: el.blackCaseNo,
      branchCode: el.branchCode,
      branchName: el.branchName,
      courtCode: el.courtCode,
      courtName: el.courtName,
      customerId: el.customerId,
      customerName: el.customerName,
      customerStatus: el.customerStatus,
      customerStatusName: el.customerStatusName,
      debtSaleStatus: el.debtSaleStatus,
      excludedVatAmount: el.excludedVatAmount,
      expenseAmount: el.expenseAmount,
      expenseDocumentDtoList: el.expenseDocumentDtoList,
      expenseRateId: el.expenseRateId,
      expenseSubTypeCode: el.expenseSubTypeCode,
      expenseSubTypeName: el.expenseSubTypeName,
      expenseTypeCode: el.expenseTypeCode,
      expenseTypeName: el.expenseTypeName,
      fieldName: el.fieldName,
      fieldValue: el.fieldValue,
      id: el.id,
      isApproved: expenseStatusCode === 'PENDING_ACCEPT_ORIGINAL_DOCUMENT' ? true : el.isApproved,
      lgId: el.lgId,
      litigationCaseId: el.litigationCaseId,
      litigationClosed: el.litigationClosed,
      litigationStatus: el.litigationStatus,
      note: el.note,
      mainLed: el.mainLed,
      orderId: el.orderId || index + 1,
      objectId: el.objectId,
      objectType: el.objectType,
      paymentDate: el.paymentDate,
      paymentMethod: el.paymentMethod,
      propertyType: el.propertyType,
      redCaseNo: el.redCaseNo,
      responseUnitCode: el.responseUnitCode,
      responseUnitName: el.responseUnitName,
      seizureId: el.seizureId,
      seizureLedId: el.seizureLedId,
      stepCode: el.stepCode,
      stepName: el.stepName,
      stepSubCode: el.stepSubCode,
      stepSubName: el.stepSubName,
      totalAmount: el.totalAmount,
      vatAmount: el.vatAmount,
      vatRate: el.vatRate,
      whtRate: el.whtRate,
      wtAmount: el.wtAmount,
    });
  }

  isFormChange(value: any): boolean {
    return Object.entries(this.tempFormCheck).toString() !== Object.entries(value).toString();
  }

  /** Model Mapper */
  mapExpenseTransaction(
    value: ExpenseTransactionDto | any,
    updateFlag?: ExpenseTransactionRequest.UpdateFlagEnum,
    order?: number,
    isExpenseAsset?: boolean
  ): ExpenseTransactionRequest {
    return {
      assetInspectionDate: value.assetInspectionDate,
      collaterals: isExpenseAsset ? value.collaterals || [] : undefined,
      documents: value.expenseDocumentDtoList || value.documents,
      excludedVatAmount: value.excludedVatAmount,
      expenseAmount: value.expenseAmount,
      expenseRateId: value.expenseRateId,
      fieldName: value.fieldName,
      fieldValue: value.fieldValue,
      id: updateFlag === 'A' ? undefined : value.id,
      isApproved: value.isApproved,
      lgId: value.lgId,
      litigationCaseId: value.litigationCaseId ? Number(value.litigationCaseId) : undefined,
      litigationClosed: value.litigationClosed,
      note: value.note,
      objectType: isExpenseAsset ? value.objectType : undefined,
      objectId: isExpenseAsset ? value.objectId : undefined,
      orderId: order || value.orderId,
      totalAmount: value.totalAmount,
      updateFlag: updateFlag || value.updateFlag,
      vatRate: value.vatRate,
      whtRate: value.whtRate,
      wtAmount: value.wtAmount,
    };
  }

  getExpenseApprovalRequest(rawValue: ExpenseApprovalRequest, headerFlag?: ExpenseApprovalRequest.HeaderFlagEnum) {
    const request: ExpenseApprovalRequest = {
      ...rawValue,
      receiveDate: !!rawValue.receiveDate ? Utils.dateFormat(rawValue.receiveDate, 'yyyy-MM-DD') : undefined,
      headerFlag: headerFlag || 'DRAFT',
    };
    return request;
  }

  hasNoEditExpenseTransaction(
    transactionDto: ExpenseTransactionDto[],
    transactionReq: ExpenseTransactionRequest[]
  ): boolean {
    let hasNoEdit = true;
    if (transactionDto !== null && transactionReq === null) {
      hasNoEdit = true;
    } else {
      transactionDto.forEach(e => {
        const objUpdate = transactionReq.find(f => f.id === e.id);
        const valueGet = this.mapExpenseTransaction(e);
        if (objUpdate) {
          hasNoEdit = Object.entries(objUpdate).toString() === Object.entries(valueGet).toString();
        } else {
          hasNoEdit = false;
          return;
        }
        if (!hasNoEdit) {
          hasNoEdit = false;
          return;
        }
      });
    }
    return hasNoEdit;
  }

  setValueReceiveDate(expenseDetail: ExpenseDetailDto): Date | null {
    if (expenseDetail.expenseStatusCode === 'PENDING_ACCEPT_ORIGINAL_DOCUMENT') {
      return expenseDetail.receiveDate ? new Date(expenseDetail.receiveDate) : new Date();
    }
    return expenseDetail.receiveDate ? new Date(expenseDetail.receiveDate) : null;
  }

  validatorReceiveDate(expenseStatusCode?: string): ValidatorFn[] {
    if (expenseStatusCode === 'PENDING_ACCEPT_ORIGINAL_DOCUMENT') {
      return [Validators.required];
    }
    return [];
  }

  // for task detail
  getExpenseMode(statusCode: string) {
    let mode = Mode.VIEW;
    if (statusCode === 'PENDING' || statusCode === 'PENDING_APPROVAL' || statusCode === 'FAILED') {
      mode = statusCode !== 'PENDING_APPROVAL' ? Mode.EDIT : Mode.APPROVE;
    } else {
      mode = Mode.VIEW;
    }
    return mode;
  }

  async onSave(taskCode: taskCode, taskId: number, paymentList: any, paymentBookForm: UntypedFormGroup) {
    if (this._expenseDetail?.expenseStatusCode === 'DRAFT' || taskCode === 'EXPENSE_CLAIM_CORRECTION') {
      paymentBookForm.markAllAsTouched();
      this._hasVerify = false;
      if (
        paymentBookForm.invalid ||
        paymentList?.data?.length === 0 ||
        this._expenseTransactionRequest?.length === 0 ||
        this._checkbox.some(e => e.checked === false)
      ) {
        this._hasVerify = true;
        return;
      }
      const expenseRequest: ExpenseRequest = {
        assigneeId: paymentBookForm.value?.assigneeId,
        expenseRateId: paymentBookForm.value?.expenseRateId,
        expenseTransactions: this._expenseTransactionRequest || undefined,
        headerFlag: ExpenseRequest.HeaderFlagEnum.Draft,
        note: paymentBookForm.value?.note,
      };
      if (this._expenseDetail?.expenseStatusCode === 'DRAFT' || taskCode === 'EXPENSE_CLAIM_CORRECTION') {
        expenseRequest.taskId = this._expenseDetail?.taskId ? Number(this._expenseDetail?.taskId) : taskId;
        expenseRequest.expenseNo = this._expenseDetail?.expenseNo;
      }
      const expense: ExpenseRequest = await this.saveExpense(expenseRequest);
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('FINANCE.MESSAGE_CREATE_PAYMENT_BOOK_DRAFT_SECCESS', {
          EXPENSE_NO: expense?.expenseNo,
        })
      );
    } else if (taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD') {
      const request: ReceiptRequest = this.getReceiptRequest('DRAFT', taskCode);
      await this.submitReceipt(taskId, request);
      this.notificationService.openSnackbarSuccess(
        `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
          this._expenseDetail?.expenseNo
        } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SAVE_DRAFT')}`
      );
    } else {
      const request = this.getExpenseApprovalRequest(
        {
          ...paymentBookForm.getRawValue(),
          expenseTransactionDto: this.expenseTransactionRequest,
        },
        'DRAFT'
      );
      await this.approve(taskId, request);
      this.notificationService.openSnackbarSuccess(
        `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
          this._expenseDetail?.expenseNo
        } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SAVE_DRAFT')}`
      );
    }
    this.actionBarEventName = 'SAVE';
  }

  async onReject(taskCode: taskCode, taskId: number, statusCode: string, paymentBookForm: UntypedFormGroup) {
    const _expenseStatusCode = this._expenseDetail?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum;
    const context = {
      taskId: taskId,
      taskCode: taskCode,
      mode: 'FINANCE_EXPENSE',
      action: 'REJECT',
      expenseObjectId: this._expenseDetail.expenseNo,
      expenseStatus: paymentBookForm.getRawValue().expenseStatus,
      expenseTransactions: this.expenseTransactionRequest || undefined,
      dataForm: _expenseStatusCode === 'PENDING_AUTO_PAYMENT_VERIFICATION' && paymentBookForm,
      statusCode: statusCode,
    };
    this.actionBarEventName = 'REJECT';
    switch (taskCode) {
      case 'EXPENSE_CLAIM_VERIFICATION':
        if (statusCode === 'PENDING') {
          this._hasVerify = false;
          const expenseTransactions = paymentBookForm.get('expenseTransactionDto')?.value as ExpenseTransactionDto[];
          const isNotVerifyAll = expenseTransactions?.some(e => e.isApproved == null);
          const isVerifyFalse = expenseTransactions?.some(e => e.isApproved === false);
          if (isNotVerifyAll || !isVerifyFalse) {
            this._hasVerify = true;
            return;
          }
          await this.notificationService.showCustomDialog({
            component: RejectDialogComponent,
            iconName: 'icon-Arrow-Revert',
            title: 'COMMON.BUTTON_SEND_BACK_EDIT',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            rightButtonLabel: 'FINANCE.REJECT_DIALOG.BUTTON_CONFIRM_SEND_BACK_EDIT',
            buttonIconName: 'icon-Arrow-Revert',
            rightButtonClass: 'long-button mat-warn',
            context: context,
          });
        }
        break;
      case 'EXPENSE_CLAIM_PAYMENT_APPROVAL':
        if (
          this._expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_CONSIDERATION' ||
          this._expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_APPROVAL_CONSIDERATION' ||
          this._expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_APPROVAL'
        ) {
          this._hasVerify = false;
          const expenseTransactions = paymentBookForm.get('expenseTransactionDto')?.value as ExpenseTransactionDto[];
          const isNotVerifyAll = expenseTransactions?.some(e => e.isApproved == null);
          const isVerifyFalse = expenseTransactions?.some(e => e.isApproved === false);
          if (isNotVerifyAll || !isVerifyFalse) {
            this._hasVerify = true;
            return;
          }
        }
        await this.notificationService.showCustomDialog({
          component: RejectDialogComponent,
          iconName: 'icon-Arrow-Revert',
          title: 'COMMON.BUTTON_SEND_BACK_EDIT',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          rightButtonLabel: 'FINANCE.REJECT_DIALOG.BUTTON_CONFIRM_SEND_BACK_EDIT',
          buttonIconName: 'icon-Arrow-Revert',
          rightButtonClass: 'long-button mat-warn',
          context: context,
        });
        break;
      case 'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION':
        await this.notificationService.showCustomDialog({
          component: RejectDialogComponent,
          iconName: 'icon-Dismiss-Square',
          title: 'COMMON.LABEL_NOT_APPROVE',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          rightButtonLabel: 'LAWSUIT.CLOSE.BTN_CONFIRM_REJECT',
          buttonIconName: 'icon-Dismiss-Square',
          rightButtonClass: 'long-button mat-warn',
          context: context,
        });
        break;
      case 'EXPENSE_CLAIM_CORRECTION':
        if (statusCode === 'FAILED') {
          this._receiptError = '';
          await this.notificationService.showCustomDialog({
            component: RejectDialogComponent,
            iconName: 'icon-Dismiss-Square',
            title: 'FINANCE.REJECT_DIALOG.TITLE_PAYMENT_BOOK_CANCEL',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            rightButtonLabel: 'FINANCE.REJECT_DIALOG.BUTTON_CONFIRM_PAYMENT_BOOK_CANCEL',
            buttonIconName: 'icon-Dismiss-Square',
            rightButtonClass: 'long-button mat-warn',
            context: { ...context, ...{ action: 'CANCEL' } },
          });
        } else if (_expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL') {
          await this.notificationService.showCustomDialog({
            component: RejectDialogComponent,
            iconName: 'icon-Arrow-Revert',
            title: 'COMMON.BUTTON_SEND_BACK_EDIT',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            rightButtonLabel: 'FINANCE.REJECT_DIALOG.BUTTON_CONFIRM_SEND_BACK_EDIT',
            buttonIconName: 'icon-Arrow-Revert',
            rightButtonClass: 'long-button mat-warn',
            context: context,
          });
        }
        break;
      case 'EXPENSE_CLAIM_RECEIPT_UPLOAD':
        if (statusCode === 'PENDING_APPROVAL') {
          const documentReceipt: any = this._expenseDetail?.klawReceipt;
          let receiptDate = new Date(documentReceipt.attributes['receiptDate']);
          let dateInvalid = false;
          if (this._expenseDetail.expenseGroup === 1) {
            // FOR Reject case auto payment receiptDate < today >> date is invalid LEX2-106
            dateInvalid = moment(moment(receiptDate).format('YYYY-MM-DD')).isBefore(
              moment().format('YYYY-MM-DD'),
              'day'
            );
          } else {
            // FOR Reject case mannual payment not validate LEX2-102
            dateInvalid = false;
          }
          if (!this._hasVerify) {
            this._receiptError = 'ERROR_VERIFY_RECEIPT';
          } else if (dateInvalid) {
            this._receiptError = 'ERROR_EXPENSE_DATE_INVALID';
          } else {
            this._receiptError = '';
            const expenseTransactions = context.expenseTransactions?.map((item: any) => {
              item.isApproved = true;
              return item;
            });
            context.expenseTransactions = expenseTransactions;
            await this.notificationService.showCustomDialog({
              component: RejectDialogComponent,
              iconName: 'icon-Arrow-Revert',
              title: 'COMMON.BUTTON_SEND_BACK_EDIT',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
              buttonIconName: 'icon-Arrow-Revert',
              rightButtonClass: 'long-button mat-warn',
              context: context,
            });
          }
        } else if (statusCode === 'FINISHED') {
          // LEX2-7148 statusCode === 'FINISHED'
          this._receiptError = '';
          await this.notificationService.showCustomDialog({
            component: RejectDialogComponent,
            iconName: 'icon-Dismiss-Square',
            title: 'FINANCE.BUTTON_CANCEL_LIST',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            rightButtonLabel: 'FINANCE.BUTTON_CANCEL_LIST_CONFIRM',
            buttonIconName: 'icon-Dismiss-Square',
            rightButtonClass: 'long-button mat-warn',
            context: context,
          });
        }
        break;
      case 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT':
      case 'REVERSE_EXPENSE_CLAIM_OTHER':
        if (statusCode === 'PENDING') {
          this._receiptError = '';
          await this.notificationService.showCustomDialog({
            component: RejectDialogComponent,
            iconName: 'icon-Dismiss-Square',
            title: 'FINANCE.BUTTON_REJECT_REFUND',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            rightButtonLabel: 'FINANCE.BUTTON_REJECT_REFUND_CONFIRM',
            buttonIconName: 'icon-Dismiss-Square',
            rightButtonClass: 'long-button mat-warn',
            context: context,
          });
        }
        break;
      case 'DECIDE_REVERSE_EXPENSE_CLAIM':
        if (statusCode === 'PENDING') {
          const contextReverse = {
            taskId: taskId,
            taskCode: taskCode,
            mode: 'FINANCE_EXPENSE',
            action: 'REJECT',
            expenseObjectId: this._expenseDetail.expenseNo,
            expenseStatus: paymentBookForm.getRawValue().expenseStatus,
            reverseExpenseAccept: false,
          };
          this._receiptError = '';
          await this.notificationService.showCustomDialog({
            component: RejectDialogComponent,
            iconName: 'icon-Dismiss-Square',
            title: 'FINANCE.BUTTON_REJECT_DECIDE_REFUND',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            rightButtonLabel: 'FINANCE.REJECT_DIALOG.BUTTON_CONFIRM_DECIDE_REFUND',
            buttonIconName: 'icon-Dismiss-Square',
            rightButtonClass: 'long-button mat-warn',
            context: contextReverse,
          });
        }
        break;
      default:
        break;
    }
  }

  async onSubmit(
    taskCode: taskCode,
    taskId: number,
    statusCode: string,
    paymentList: any,
    paymentBookForm: UntypedFormGroup
  ) {
    this.actionBarEventName = 'SUBMIT';
    const _expenseStatusCode = this._expenseDetail?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum;
    if (_expenseStatusCode === 'DRAFT' || taskCode === 'EXPENSE_CLAIM_CORRECTION') {
      paymentBookForm.markAllAsTouched();
      this._hasVerify = false;
      if (
        paymentBookForm.invalid ||
        paymentList?.data?.length === 0 ||
        this._expenseTransactionRequest?.length === 0 ||
        this._checkbox.some(e => e.checked === false)
      ) {
        this._hasVerify = true;
        return;
      }
      if (
        taskCode === 'EXPENSE_CLAIM_CORRECTION' &&
        _expenseStatusCode !== 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL'
      ) {
        if (_expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION') {
          this._hasVerify = false;
          if (!this._hasEdit) {
            this._hasVerify = true;
            return;
          }
        } else {
          // check has update
          this._hasVerify = false;
          const expenseTransactionDto = (this._expenseDetail?.expenseTransactionDto as ExpenseTransactionDto[]).filter(
            e => e.isApproved === false
          );
          const expenseTransactionRequest = this._expenseTransactionRequest as ExpenseTransactionRequest[];
          if (
            !!!expenseTransactionRequest ||
            this.hasNoEditExpenseTransaction(expenseTransactionDto, expenseTransactionRequest)
          ) {
            this._hasVerify = true;
            return;
          }
        }
      }
      const isContinue = await this.notificationService.warningDialog(
        'DIALOG_ALERT.TITLE_CONFIRM_SEND_INFO',
        'DIALOG_ALERT.MESSAGE_CONFIRM_SEND_INFO',
        'DIALOG.CONFIRM_BUTTON_CONFIRM',
        'icon-Selected'
      );
      if (isContinue) {
        const expenseRequest: ExpenseRequest = {
          assigneeId: paymentBookForm.value?.assigneeId,
          expenseNo: this._expenseDetail?.expenseNo || undefined,
          expenseRateId: paymentBookForm.value?.expenseRateId,
          expenseTransactions: this._expenseTransactionRequest || undefined,
          headerFlag: ExpenseRequest.HeaderFlagEnum.Submit,
          note: paymentBookForm.value?.note,
          taskId: taskId || undefined,
        };
        if (_expenseStatusCode === 'DRAFT' || taskCode === 'EXPENSE_CLAIM_CORRECTION') {
          expenseRequest.taskId = taskId;
          expenseRequest.expenseNo = this._expenseDetail?.expenseNo;
        }
        const expenseNo: any = await this.saveExpense(expenseRequest);
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('FINANCE.MESSAGE_CREATE_PAYMENT_BOOK_SUBMIT_SECCESS', {
            EXPENSE_NO: expenseNo?.expenseNo,
          })
        );
        this.routerService.back();
      }
    } else {
      switch (taskCode) {
        case 'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION':
          const expenseTransactions = paymentBookForm.get('expenseTransactionDto')?.value as ExpenseTransactionDto[];
          const isVerifyAll = expenseTransactions?.every(e => e.isApproved === true);
          if (!isVerifyAll) {
            this._hasVerify = true;
            break;
          }
          await this.warningContinueDialog(taskCode, taskId, statusCode, paymentBookForm);
          break;
        case 'EXPENSE_CLAIM_VERIFICATION':
          if (statusCode === 'PENDING') {
            this._hasVerify = false;
            const expenseTransactions = paymentBookForm.get('expenseTransactionDto')?.value as ExpenseTransactionDto[];
            const isVerifyAll = expenseTransactions?.every(e => e.isApproved === true);
            if (!isVerifyAll) {
              this._hasVerify = true;
              break;
            }
            await this.warningContinueDialog(taskCode, taskId, statusCode, paymentBookForm);
          }
          break;
        case 'EXPENSE_CLAIM_PAYMENT_APPROVAL':
        case 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL':
          if (_expenseStatusCode !== 'PENDING_PAYMENT_CONFIRMATION') {
            this.setValidateAssigneeId(taskCode, statusCode, paymentBookForm);
            this._hasVerify = false;
            const expenseTransactions = paymentBookForm.get('expenseTransactionDto')?.value as ExpenseTransactionDto[];
            if (!expenseTransactions?.every(e => e.isApproved === true)) {
              this._hasVerify = true;
              break;
            }
            if (paymentBookForm.get('assigneeId')?.invalid && _expenseStatusCode !== 'PENDING_PAYMENT_APPROVAL') break;
            await this.warningContinueDialog(taskCode, taskId, statusCode, paymentBookForm);
          } else {
            await this.warningContinueDialog(taskCode, taskId, statusCode, paymentBookForm);
          }
          break;
        case 'EXPENSE_CLAIM_RECEIPT_UPLOAD':
        case 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD':
          const documentReceipt: any =
            taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD'
              ? this._expenseDetail?.financialNewsReceipt
              : this._expenseDetail?.klawReceipt;
          if (statusCode === 'FAILED' || statusCode === 'PENDING') {
            if (!documentReceipt?.imageId || documentReceipt?.imageId === '') {
              this._receiptError = 'ERROR_REQUIRED';
            } else if (taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD' && !documentReceipt.attributes['receiptDate']) {
              this._receiptError = 'ERROR_DATE_INVALID';
            } else {
              this._receiptError = '';
              await this.warningContinueDialog(taskCode, taskId, statusCode, paymentBookForm);
            }
            if (this._receiptError) {
              this.autoScroll();
            }
          } else if (statusCode === 'PENDING_APPROVAL') {
            let receiptDate = new Date(documentReceipt.attributes['receiptDate']);

            let dateInvalid = false;
            if (this._expenseDetail.expenseGroup === 1) {
              // FOR Submit case auto payment receiptDate < today >> date is invalid LEX2-106
              dateInvalid = moment(moment(receiptDate).format('YYYY-MM-DD')).isBefore(
                moment().format('YYYY-MM-DD'),
                'day'
              );
            } else {
              // FOR Submit case auto payment receiptDate < today >> date is invalid LEX2-102
              dateInvalid = moment(moment(receiptDate).format('YYYY-MM-DD')).isBefore(
                moment().format('YYYY-MM-DD'),
                'day'
              );
            }

            if (!this._hasVerify) {
              this._receiptError = 'ERROR_VERIFY_RECEIPT';
            } else if (dateInvalid) {
              this._receiptError = 'ERROR_EXPENSE_DATE_INVALID';
            } else {
              this._receiptError = '';
              await this.warningContinueDialog(taskCode, taskId, statusCode, paymentBookForm);
            }
            if (this._receiptError) {
              this.autoScroll();
            }
          }
          break;
        case 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT':
        case 'REVERSE_EXPENSE_CLAIM_OTHER':
          if (statusCode === 'PENDING') {
            const isContinue = await this.notificationService.warningDialog(
              'DIALOG_ALERT.TITLE_CONFIRM_SEND_INFO',
              'DIALOG_ALERT.MESSAGE_CONFIRM_SEND_INFO',
              'DIALOG.CONFIRM_BUTTON_CONFIRM',
              'icon-Selected'
            );
            if (isContinue) {
              const _expenseTransactions: ExpenseTransactionDto[] =
                (this.paymentBookForm.getRawValue().expenseTransactionDto as ExpenseTransactionDto[]) || [];
              const _expenseTransactionNote: ExpenseTransactionNoteDto[] = _expenseTransactions.map(i => {
                return {
                  id: i.id,
                  note: i.note,
                } as ExpenseTransactionNoteDto;
              });
              const req: RefundRequest = {
                expenseTransactionNoteDtoList: _expenseTransactionNote,
                isAccept: true,
              };
              await this.refund(taskId, req);
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
                  this._expenseDetail?.expenseNo
                } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SUBMIT_REVERSE_EXPENSE')}`
              );
              this.routerService.back();
            }
          }
          break;
        case 'DECIDE_REVERSE_EXPENSE_CLAIM':
          if (statusCode === 'PENDING') {
            const contextReverse = {
              taskId: taskId,
              taskCode: taskCode,
              mode: 'FINANCE_EXPENSE',
              action: 'REJECT',
              expenseObjectId: this._expenseDetail.expenseNo,
              expenseStatus: paymentBookForm.getRawValue().expenseStatus,
              reverseExpenseAccept: true,
            };
            this._receiptError = '';
            await this.notificationService.showCustomDialog({
              component: RejectDialogComponent,
              iconName: 'icon-Selected',
              title: 'FINANCE.BUTTON_SUBMIT_DECIDE_REFUND',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              rightButtonLabel: 'FINANCE.BUTTON_CONFIRM_SUBMIT_DECIDE_REFUND',
              buttonIconName: 'icon-Selected',
              context: contextReverse,
            });
          }
          break;
        default:
          break;
      }
    }
  }

  setValidateAssigneeId(taskCode: taskCode, statusCode: string, paymentBookForm: UntypedFormGroup) {
    const _expenseStatusCode = this._expenseDetail?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum;
    if (
      (taskCode === 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL' && statusCode === 'PENDING') ||
      _expenseStatusCode === 'PENDING_PAYMENT_CONSIDERATION' ||
      _expenseStatusCode === 'PENDING_PAYMENT_APPROVAL_CONSIDERATION'
    ) {
      paymentBookForm.get('assigneeId')?.addValidators(Validators.required);
      paymentBookForm.get('assigneeId')?.markAsTouched();
      paymentBookForm.get('assigneeId')?.updateValueAndValidity();
    }
  }

  async warningContinueDialog(
    taskCode: taskCode,
    taskId: number,
    statusCode: string,
    paymentBookForm: UntypedFormGroup
  ) {
    const isContinue = await this.notificationService.warningDialog(
      'DIALOG_ALERT.TITLE_CONFIRM_SEND_INFO',
      'DIALOG_ALERT.MESSAGE_CONFIRM_SEND_INFO',
      'DIALOG.CONFIRM_BUTTON_CONFIRM',
      'icon-Selected'
    );
    if (isContinue) {
      if (
        this._receiptError === '' &&
        (taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD' || taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD')
      ) {
        if (statusCode === 'FAILED' || statusCode === 'PENDING') {
          const request: ReceiptRequest = this.getReceiptRequest('SUBMIT', taskCode);
          await this.submitReceipt(taskId, request);
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this._expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_RECEIPT_UPLOAD')}`
          );
          this.routerService.back();
        } else if (statusCode === 'PENDING_APPROVAL') {
          const request: ExpenseApprovalRequest = {
            headerFlag: 'SUBMIT',
            expenseStatus: this._expenseDetail.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum,
          };
          await this.approve(taskId, request);
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this._expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_APPROVE')}`
          );
          this.routerService.back();
        }
      } else if (taskCode === 'EXPENSE_CLAIM_SYSTEM_PAYMENT') {
        await this.retryPayment(taskId);
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
            this._expenseDetail?.expenseNo
          } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SUBMIT_DATA')}`
        );
        this.routerService.back();
      } else {
        const request = this.getExpenseApprovalRequest(
          {
            ...paymentBookForm.getRawValue(),
            expenseTransactionDto: this.expenseTransactionRequest,
          },
          'SUBMIT'
        );
        await this.approve(taskId, request);
        if (
          this._expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_APPROVAL_CONSIDERATION' ||
          this._expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_APPROVAL'
        ) {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this._expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_APPROVE')}`
          );
        } else if (this._expenseDetail?.expenseStatusCode === 'PENDING_ACCEPT_ORIGINAL_DOCUMENT') {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this._expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SUBMIT_RECEIVE_DATE')}`
          );
        } else {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this._expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SUBMIT_PAYMENT_LIST')}`
          );
        }
        this.routerService.back();
      }
    }
  }

  autoScroll() {
    window.scrollTo(0, 800);
  }

  /** Expense APIs Controller */
  async getExpenseNoList() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.getExpenseNoList())
    );
  }

  getRequestInquiryExpense(request: ExpenseSearchConditionRequest) {
    request.assigneeId = request.assigneeId;
    request.expenseNo = request.expenseNo === 'N/A' ? undefined : request.expenseNo;
    request.expenseStatus = request.expenseStatus === 'N/A' ? undefined : request.expenseStatus;
    request.litigationStatus = request.litigationStatus === 'N/A' ? undefined : request.litigationStatus;
    request.page = request.page || 0;
    request.searchString = request.searchString || '';
    request.size = request.size || 10;
    request.sortBy = request.sortBy || ['expenseNo'];
    request.sortOrder = request.sortOrder || 'DESC';
    request.tab = request.tab || 'USER';
    return request;
  }

  async inquiryExpense(request: ExpenseSearchConditionRequest) {
    const _request = this.getRequestInquiryExpense(request);
    this.logger.logAPIRequest('inquiryExpense ~ request :: ', _request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.expenseControllerService.inquiryExpense(
          _request.assigneeId,
          _request.createdBy,
          _request.expenseDashboard,
          _request.expenseNo,
          _request.expenseStatus,
          _request.litigationStatus,
          _request.page,
          _request.searchString,
          _request.size,
          _request.sortBy,
          _request.sortOrder,
          _request.successPaymentDate,
          _request.tab
        )
      )
    );
  }

  async inquiryExpenseDownload(request: ExpenseSearchConditionRequest, filename: string) {
    const _request = this.getRequestInquiryExpense(request);
    this.logger.logAPIRequest('inquiryExpenseDownload ~ request :: ', _request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.expenseControllerService.inquiryExpenseDownload(
          _request.assigneeId,
          _request.createdBy,
          _request.expenseDashboard,
          _request.expenseNo,
          _request.expenseStatus,
          _request.litigationStatus,
          _request.page,
          _request.searchString,
          _request.size,
          _request.sortBy,
          _request.sortOrder,
          _request.successPaymentDate,
          _request.tab
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'งานทั้งหมด' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async downloadExpenseReport(expenseNo: string, filename: string = 'หนังสือเบิกจ่าย') {
    this.logger.logAPIRequest('downloadExpenseReport ~ expenseNo :: ', expenseNo);
    const response: any = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.downloadExpenseReport(expenseNo))
    );
    Utils.saveAsStrToBlobFile(response, filename + FileType.PDF, BlobType.PDF);
  }

  getReceiptRequest(
    headerFlag: ReceiptRequest.HeaderFlagEnum,
    taskCode: taskCode,
    expenseTransactionNote?: Array<ExpenseTransactionNoteDto>
  ): ReceiptRequest {
    const documentReceipt: any =
      taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD'
        ? this.expenseDetail?.financialNewsReceipt
        : this.expenseDetail?.klawReceipt;
    const request: ReceiptRequest = {
      documentDto: {
        ...documentReceipt,
        attributes: {
          receiptDate: Utils.dateFormat(documentReceipt.attributes?.receiptDate || '', 'yyyy-MM-DD'),
        },
        receiveDate: Utils.dateFormat(documentReceipt?.attributes?.receiptDate || '', 'yyyy-MM-DD'),
      },
      expenseTransactionNoteDtoList: expenseTransactionNote,
      headerFlag: headerFlag,
    };

    return request;
  }

  async genWithholdingTaxInfo(expenseTypeCode: string, withholdingTaxInfo: IWithholdingTaxInfo, mode?: TMode) {
    if (mode && mode !== TMode.ADD && this.expenseDetail) {
      const detail = this.expenseDetail;
      return {
        receiverName: detail?.receiverName,
        expenseTaxname: detail?.accountName,
        expenseAccountno: detail?.accountNo,
        expenseType: detail?.type,
        expenseBusinessType: detail?.businessType,
        expenseTaxno: detail?.taxNo,
        expenseTel: detail?.telNo,
        addressLine: detail?.addressLine,
        districtName: detail?.districtName,
        postalCode: detail?.postalCode,
        provinceName: detail?.provinceName,
        subdistrictName: detail?.subDistrictName,
      };
    } else {
      const responseExpenseTypeCode = await this.configurationService.expenseTypeCode(expenseTypeCode);
      responseExpenseTypeCode.configs?.forEach(e => {
        switch (e.key) {
          case 'EXPENSE_TAXNO':
            withholdingTaxInfo.expenseTaxno = e.value;
            break;
          case 'EXPENSE_TEL':
            withholdingTaxInfo.expenseTel = e.value;
            break;
          case 'EXPENSE_TAXNAME':
            withholdingTaxInfo.expenseTaxname = e.value;
            break;
          case 'EXPENSE_ACCOUNTNO':
            withholdingTaxInfo.expenseAccountno = e.value;
            break;
          case 'EXPENSE_TYPE':
            withholdingTaxInfo.expenseType = e.value;
            break;
          case 'EXPENSE_BUSINESS_TYPE':
            withholdingTaxInfo.expenseBusinessType = e.value;
            break;
          default:
            break;
        }
      });
      return {
        ...withholdingTaxInfo,
        ...responseExpenseTypeCode.address,
      };
    }
  }

  async getExpenseDetail(expenseNo: string) {
    this.logger.logAPIRequest('getExpenseDetail ~ request :: ', expenseNo);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.getExpenseDetail(expenseNo))
    );
  }

  async getLitigationList(expenseRateId: string, page?: number, searchString?: string, size?: number) {
    this.logger.logAPIRequest('getLitigationList ~ request :: ', { page, searchString, size });
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.getLitigationList(expenseRateId, page, searchString, size))
    );
  }

  async approve(taskId: number, expenseApprovalRequest: ExpenseApprovalRequest) {
    this.logger.logAPIRequest('approve ~ request :: ', { taskId, expenseApprovalRequest });
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.approve(taskId, expenseApprovalRequest))
    );
  }

  async reject(taskId: number, request: ReviseRequest) {
    this.logger.logAPIRequest('reject ~ request :: ', { taskId, request });
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.reject(taskId, request))
    );
  }

  async cancel(taskId: number, request: CancelRequest) {
    this.logger.logAPIRequest('cancel ~ request :: ', { taskId, request });
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.cancel(taskId, request))
    );
  }

  async getMemo(expenseTransactionId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.getMemo(expenseTransactionId))
    );
  }

  async getInitialLitigationDetail(
    expenseRateId: string,
    litigationId: string,
    litigationCaseId?: number,
    objectId?: string,
    objectType?: string
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.expenseControllerService.getInitialLitigationDetail(
          expenseRateId,
          litigationId,
          litigationCaseId,
          objectId,
          objectType
        )
      )
    );
  }

  async saveExpense(expenseRequest: ExpenseRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.save(expenseRequest))
    );
  }

  async getExpenseTaxDetail(request: ExpenseTaxDetailRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.getExpenseTaxDetail(request))
    );
  }

  async submitReceipt(taskId: number, request: ReceiptRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.submitReceipt(taskId, request))
    );
  }

  async getLitigationDetail(expenseTransactionId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.getLitigationDetail(expenseTransactionId))
    );
  }

  async getApproverList(expenseStatus: ExpenseApprovalRequest.ExpenseStatusEnum, stepCode?: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.getApproverList(expenseStatus, stepCode))
    );
  }

  async retryPayment(taskId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.retryPayment(taskId))
    );
  }

  async getLitigationDetailList(expenseTransactionIds: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.getLitigationDetailList(expenseTransactionIds))
    );
  }

  async refund(taskId: number, request: RefundRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.refund(taskId, request))
    );
  }

  public isCaseExecutionSeizureAsset(_stepCode: string, _stepSubCode: string): boolean {
    const stepCode = _stepCode === 'EXECUTION';
    const stepSubCode = _stepSubCode === 'SEIZURE' || _stepSubCode === 'SEIZURE_NON_PLEDGE_ASSET';
    return stepCode && stepSubCode;
  }

  async validateCollateralsAssets(request: ExpenseRequest) {
    this.logger.logAPIRequest('validateCollateralsAssets ~ request :: ', request);
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.expenseControllerService.validateExpense(request)),
      {
        disableErrorDisplay: true,
      }
    );
  }

  async postExpenseCollateralsAssets(expenseRateId: string, request: CollateralsAssetRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.expenseControllerService.postExpenseCollateralsAssets(expenseRateId, request))
    );
  }

  async getExpenseLitigationCaseSeizure(originalLitigationCaseId: number, seizureType: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.expenseControllerService.getExpenseLitigationCaseSeizure(originalLitigationCaseId, seizureType)
      )
    );
  }

  updateExpenseTransactionRequest(
    index: number,
    element: ExpenseTransactionDto,
    newData?: ExpenseTransactionDto,
    _isCaseExecutionSeizure?: boolean
  ) {
    // update request/add to request if not added
    if (!this.expenseTransactionRequest) this.expenseTransactionRequest = [];
    const expenseRequestIndex = this.expenseTransactionRequest?.findIndex(req => req.orderId === element.orderId);
    if (expenseRequestIndex >= 0) {
      // already in request
      this.expenseTransactionRequest![expenseRequestIndex] = {
        ...this.expenseTransactionRequest![expenseRequestIndex],
        ...(newData || {}),
      };
      // An update flag should be added before-hand at this point. If not, add 'U'
      this.expenseTransactionRequest![expenseRequestIndex].updateFlag =
        this.expenseTransactionRequest![expenseRequestIndex].updateFlag || 'U';
    } else {
      // if it's not in the request, use flag U as it must come from edit mode
      this.expenseTransactionRequest!.push(
        this.mapExpenseTransaction({ ...element, ...(newData || {}) }, 'U', index + 1, _isCaseExecutionSeizure)
      );
    }
  }

  checkPermissionCanDownloadExpenseDoc(downloadDocument: boolean, isModeView: boolean) {
    return downloadDocument && this.sessionService.hasPermission(PCode.DOWNLOAD_EXPENSE_DOCUMENT) && isModeView;
  }

  getIsCopyWritingRefund(expenseStatusCode: ExpenseApprovalRequest.ExpenseStatusEnum) {
    const refundExpenseCodes = [
      'PENDING_AUTO_PAYMENT_VERIFICATION',
      'PENDING_AUTO_PAYMENT_APPROVAL',
      'PENDING_CONSIDER_REFUND',
    ];
    return refundExpenseCodes.includes(`${expenseStatusCode}`);
  }
}
