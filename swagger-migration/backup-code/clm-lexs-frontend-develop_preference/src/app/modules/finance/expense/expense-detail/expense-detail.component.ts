import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { SubButtonModel } from '@app/shared/components/action-bar/action-bar.component';
import { RejectDialogComponent } from '@app/shared/components/common-dialogs/reject-dialog/reject-dialog.component';
import { ExpenseEditApproveTaskCode, TaskCodeExpensePaymentDetail } from '@app/shared/constant';
import { ActionBar, TMode, statusCode, taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  ExpenseApprovalRequest,
  ExpenseRequest,
  ExpenseTransactionDto,
  ExpenseTransactionNoteDto,
  ExpenseTransactionRequest,
  MeLexsUserDto,
  ReceiptRequest,
  RefundRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ExpenseService } from '../../services/expense.service';
import { CreatePaymentBookComponent, TActionBarEventName } from '../create-payment-book/create-payment-book.component';
import { RemarksPaymentDialogComponent } from '../remarks-payment-dialog/remarks-payment-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogOptions } from '@spig/core';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss'],
})
export class ExpenseDetailComponent implements OnInit {
  @ViewChild('createPaymentBook') createPaymentBook: CreatePaymentBookComponent | undefined;
  @Input() taskId!: number;
  @Input() expenseObjectId!: string;

  // Action Bar and Sub Action Bar
  public subButtonList: Array<SubButtonModel> = [];
  public actionBar!: ActionBar;

  // payment book
  public paymentMode!: TMode;
  public paymentBookForm!: UntypedFormGroup;
  public actionBarEventName!: TActionBarEventName;
  public currentAssigneeId!: string;
  public currentAssigneeName!: string;

  public statusCode!: statusCode;
  public taskCode!: taskCode;
  public statusName!: string;
  private currentUser: MeLexsUserDto = {};
  public userId: any;
  public title!: string;
  public expenseStatus!: any;
  public maxSubButton!: number;

  public taskCodeExpensePaymentDetail = TaskCodeExpensePaymentDetail;
  private nextRouting: string = '';
  private isLatestDraft: boolean = false;
  isCopyWritingRefund = false; // LEX2-27443

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private expenseService: ExpenseService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.route.queryParams.subscribe(value => {
      this.paymentMode = value['paymentMode'];
      this.taskCode = value['taskCode'];
      this.statusCode = value['statusCode'];
      this.taskId = value['taskId'];
      this.currentAssigneeId = value['currentAssigneeId'];
      this.currentAssigneeName = value['currentAssigneeName'];
      this.isLatestDraft = !!value['latestDraftBy'] || !!value['latestDraftTime'];
    });
    this.router.events.subscribe(val => {
      if (val instanceof NavigationStart) this.nextRouting = val.url;
    });
  }

  ngOnInit(): void {
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
    this.userId = this.currentUser?.userId;
    this.maxSubButton = 3;
    const _expenseStatusCode = this.expenseService.expenseDetail
      ?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum;
    this.isCopyWritingRefund = this.expenseService.getIsCopyWritingRefund(_expenseStatusCode);

    this.initActionBar();
    this.initPaymentBook();
    this.expenseStatus = this.expenseService.expenseDetail?.expenseStatusName || '';

    /** Add orderId to every variable */
    this.expenseService.expenseTransactionList =
      this.expenseService.expenseTransactionList?.map((tax, i) => ({
        ...tax,
        orderId: i + 1,
      })) || [];
    this.expenseService.expenseDetail.expenseTransactionDto =
      this.expenseService.expenseDetail.expenseTransactionDto?.map((tax, i) => {
        return {
          ...tax,
          ktbStatus: tax.ktbStatus,
          orderId: i + 1,
        } as ExpenseTransactionDto;
      }) || [];
  }

  async canDeactivate() {
    /* FIX LEX2-30850 */
    if (!this.expenseService?.paymentBookForm) {
      this.paymentBookForm.markAsPristine();
    }

    if (this.nextRouting.startsWith('/main/finance/expense/detail/expense-detail-view')) {
      return true;
    } else {
      if (this.paymentBookForm?.dirty || this.expenseService.hasVerify) {
        const confirm = await this.sessionService.confirmExitWithoutSave();
        if (!confirm) {
          // reverse url stack
          // this.routerService.currentStack.push(this.routerService.nextUrl);
          return false;
        }
      }
      if (!this.nextRouting.startsWith('/main/finance/expense/detail/expense-detail-view')) {
        this.expenseService.clearDataPayment();
      }
      return true;
    }
  }

  initActionBar() {
    this.title = 'TASK_DETAIL.TITLE_PENDING_APPROVAL_EXPENSE_CLAIM_PAYMENT_APPROVAL';
    if (this.paymentMode === TMode.ADD) {
      this.title = this.translate.instant('FINANCE.CREATE_INVOICE_BTN');
      this.actionBar = {
        hasCancel: false,
        hasSave: true,
        saveText: 'COMMON.BUTTON_SAVE_DARFT',
        hasReject: false,
        hasPrimary: true,
        primaryText: 'FINANCE.BUTTON_SUBMIT',
        primaryIcon: 'icon-Selected',
      };
    } else {
      if (this.userId === this.currentAssigneeId) {
        if (this.expenseService.expenseDetail?.expenseStatusCode === 'DRAFT') {
          this.actionBar = {
            hasCancel: false,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: false,
            hasPrimary: true,
            primaryText: 'FINANCE.BUTTON_SUBMIT',
            primaryIcon: 'icon-Selected',
          };
        } else if (
          (this.taskCode === 'EXPENSE_CLAIM_VERIFICATION' &&
            (this.statusCode === 'PENDING' || this.statusCode === 'PENDING_APPROVAL')) ||
          (this.taskCode === 'EXPENSE_CLAIM_PAYMENT_APPROVAL' &&
            (this.statusCode === 'PENDING' ||
              this.statusCode === 'PENDING_APPROVAL' ||
              this.statusCode === 'IN_PROGRESS' ||
              this.statusCode === 'AWAITING'))
        ) {
          this.actionBar = {
            hasCancel: false,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: true,
            rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
            rejectIcon: 'icon-Arrow-Revert',
            hasPrimary: true,
            primaryText:
              this.taskCode === 'EXPENSE_CLAIM_PAYMENT_APPROVAL'
                ? 'COMMON.LABEL_APPROVE'
                : 'FINANCE.BUTTON_SUBMIT_PAYMENT',
          };
          if (
            this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_CONSIDERATION' ||
            this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_APPROVAL_CONSIDERATION' ||
            this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_APPROVAL'
          ) {
            this.maxSubButton = 2;
            this.actionBar = { hasBack: true, hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false };
            this.subButtonList = [
              {
                name: 'revert_case',
                class: 'primary-button negative',
                icon: 'icon-Arrow-Revert',
                text: 'COMMON.BUTTON_SEND_BACK_EDIT',
                disabled: false,
              },
              {
                name: 'approve_case',
                class: 'primary-button positive',
                icon: 'icon-Check-Square',
                text:
                  this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_CONSIDERATION'
                    ? 'FINANCE.BUTTON_SUBMIT_PAYMENT'
                    : 'COMMON.LABEL_APPROVE',
                disabled: false,
              },
              {
                name: 'save_case',
                class: '',
                icon: 'icon-save-primary',
                text: 'COMMON.BUTTON_SAVE_DARFT',
                disabled: false,
              },
              {
                name: 'sent',
                class: 'color-primary',
                icon: 'icon-Send',
                text: 'FINANCE.REMARKS_PAYMENT_DIALOG.KMB_TITLE',
                disabled: false,
              },
            ];
          }
          //EXPENSE_CLAIM_VERIFICATION
          if (this.taskCode === 'EXPENSE_CLAIM_VERIFICATION') {
            this.actionBar = { hasBack: true, hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false };
            this.subButtonList = [
              {
                name: 'save_case',
                class: '',
                icon: 'icon-save-primary',
                text: 'COMMON.BUTTON_SAVE_DARFT',
                disabled: false,
              },
              {
                name: 'revert_case',
                class: 'primary-button negative',
                icon: 'icon-Arrow-Revert',
                text: 'COMMON.BUTTON_SEND_BACK_EDIT',
                disabled: false,
              },
              {
                name: 'approve_case',
                class: 'primary-button positive',
                icon: 'icon-Check-Square',
                text: 'FINANCE.BUTTON_SUBMIT_PAYMENT',
                disabled: false,
              },
            ];
          }
          if (this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_EXPENSE_CLAIM_VERIFICATION') {
            this.actionBar = {
              hasCancel: false,
              hasSave: true,
              saveText: 'COMMON.BUTTON_SAVE_DARFT',
              hasReject: true,
              rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
              rejectIcon: 'icon-Arrow-Revert',
              hasPrimary: true,
              primaryText: 'FINANCE.BUTTON_SUBMIT_PAYMENT',
            };
            this.subButtonList = [];
          } else if (this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_CONFIRMATION') {
            /* Enhance SP3: LEX2-38465 */
            this.actionBar = {
              ...this.actionBar,
              rejectText: 'COMMON.BUTTON_NOT_APPROVE',
              rejectIcon: 'icon-Dismiss-Square',
            };
          }
        } else if (this.taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD') {
          if (this.statusCode == 'PENDING_APPROVAL') {
            this.actionBar = {
              hasCancel: false,
              hasSave: false,
              saveText: 'COMMON.BUTTON_SAVE_DARFT',
              rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
              rejectIcon: 'icon-Arrow-Revert',
              hasReject: true,
              hasPrimary: true,
              primaryText: 'COMMON.LABEL_APPROVE',
            };
          } else {
            this.actionBar = {
              hasCancel: false,
              hasSave: true,
              saveText: 'COMMON.BUTTON_SAVE_DARFT',
              hasReject: false,
              hasPrimary: true,
              primaryText: 'COMMON.BUTTON_FINISH',
            };
          }
        } else if (this.taskCode === 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL') {
          if (this.expenseService.expenseDetail.expenseGroup === 1) {
            this.actionBar = { hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false };
            this.maxSubButton = 2;
            this.subButtonList = [
              {
                name: 'revert_case',
                class: 'primary-button negative',
                icon: 'icon-Arrow-Revert',
                text: 'COMMON.BUTTON_SEND_BACK_EDIT',
                disabled: false,
              },
              {
                name: 'approve_case',
                class: 'primary-button positive',
                icon: 'icon-Check-Square',
                text: this.statusCode === 'PENDING_APPROVAL' ? 'COMMON.LABEL_APPROVE' : 'FINANCE.BUTTON_CONFIRM',
                disabled: false,
              },
              {
                name: 'save_case',
                class: '',
                icon: 'icon-save-primary',
                text: 'COMMON.BUTTON_SAVE_DARFT',
                disabled: false,
              },
              {
                name: 'cancel_case',
                class: 'negative',
                icon: this.isCopyWritingRefund ? 'icon-Arrow-Counterclockwise' : 'icon-Dismiss-Square',
                text: this.isCopyWritingRefund ? 'FINANCE.BUTTON_REFUND' : 'FINANCE.BUTTON_CANCEL_LIST',
                disabled: false,
              },
            ];
          } else {
            this.actionBar = {
              hasCancel: false,
              hasSave: true,
              saveText: 'COMMON.BUTTON_SAVE_DARFT',
              hasReject: true,
              rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
              rejectIcon: 'icon-Arrow-Revert',
              hasPrimary: true,
              primaryText: this.statusCode === 'PENDING_APPROVAL' ? 'COMMON.LABEL_APPROVE' : 'FINANCE.BUTTON_CONFIRM',
            };
            this.subButtonList = [];
          }
        } else if (this.taskCode === 'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION') {
          this.actionBar = {
            hasCancel: false,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: true,
            rejectText: 'COMMON.LABEL_NOT_APPROVE',
            hasPrimary: true,
            primaryText: 'COMMON.LABEL_APPROVE',
          };
        } else if (this.taskCode === 'EXPENSE_CLAIM_CORRECTION') {
          this.actionBar = {
            hasCancel: false,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: true,
            rejectText: 'FINANCE.REJECT_DIALOG.TITLE_PAYMENT_BOOK_CANCEL',
            hasPrimary: true,
            primaryText: 'FINANCE.BUTTON_SUBMIT',
          };
          if (this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION') {
            this.actionBar = {
              hasCancel: false,
              hasSave: true,
              saveText: 'COMMON.BUTTON_SAVE_DARFT',
              hasReject: false,
              rejectText: 'FINANCE.REJECT_DIALOG.TITLE_PAYMENT_BOOK_CANCEL',
              hasPrimary: true,
              primaryText: 'FINANCE.BUTTON_SUBMIT',
            };
          } else if (
            this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL'
          ) {
            this.actionBar = {
              hasCancel: false,
              hasSave: false,
              saveText: 'COMMON.BUTTON_SAVE_DARFT',
              hasReject: true,
              rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
              rejectIcon: 'icon-Arrow-Revert',
              hasPrimary: true,
              primaryText: 'FINANCE.BUTTON_SUBMIT_PAYMENT',
            };
          }
        } else if (this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD') {
          this.actionBar = {
            hasCancel: false,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: false,
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_FINISH',
          };
        } else if (this.taskCode === 'EXPENSE_CLAIM_RECIEVE_ORIGINAL_DOCUMENT') {
          this.actionBar = {
            hasCancel: false,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: false,
            hasPrimary: true,
            primaryText: 'FINANCE.BUTTON_SUBMIT_DOCUMENT_RECIEVE',
          };
        } else if (this.taskCode === 'EXPENSE_CLAIM_SYSTEM_PAYMENT') {
          this.actionBar = {
            hasCancel: false,
            hasSave: false,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: false,
            hasPrimary: true,
            primaryText: 'FINANCE.BUTTON_SUBMIT_SENT_DATA',
          };
        } else if (
          this.taskCode === 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT' ||
          this.taskCode === 'REVERSE_EXPENSE_CLAIM_OTHER'
        ) {
          this.actionBar = {
            hasCancel: false,
            hasSave: false,
            hasReject: true,
            rejectText: 'FINANCE.BUTTON_REJECT_REFUND',
            hasPrimary: true,
            primaryText: 'FINANCE.BUTTON_SUBMIT_REFUND',
          };
        } else if (this.taskCode === 'DECIDE_REVERSE_EXPENSE_CLAIM') {
          this.actionBar = {
            hasCancel: false,
            hasSave: false,
            hasReject: true,
            rejectText: 'FINANCE.BUTTON_REJECT_DECIDE_REFUND',
            hasPrimary: true,
            primaryText: 'FINANCE.BUTTON_SUBMIT_DECIDE_REFUND',
          };
        } else {
          this.actionBar = {
            hasCancel: false,
            hasSave: false,
            hasReject: false,
            hasPrimary: false,
          };
        }
      } else if (
        this.userId === this.expenseService.expenseDetail?.financialBossUserId &&
        this.expenseService.expenseDetail?.expenseStatusCode === 'SUCCESS_AUTO_PAYMENT'
      ) {
        this.actionBar = {
          hasCancel: false,
          hasSave: false,
          hasReject: true,
          rejectText: 'FINANCE.BUTTON_CANCEL_LIST',
          hasPrimary: false,
        };
      } else {
        this.actionBar = {
          hasCancel: false,
          hasSave: false,
          hasReject: false,
          hasPrimary: false,
        };
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
      case 'cancel_case':
        this.onCancelCase();
        break;
      case 'sent':
        this.onSent();
        break;
      default:
        break;
    }
  }

  initPaymentBook() {
    if (ExpenseEditApproveTaskCode.includes(this.taskCode)) {
      this.paymentBookForm = this.expenseService.generateApproveForm({
        ...this.expenseService.expenseDetail,
        ...this.expenseService
          .paymentBookForm /** Persist any edited data when navigating to and from the detail page */,
      });
    } else {
      this.paymentBookForm = this.expenseService.generatePaymentBookForm();
    }
    if (this.expenseService.isFromDetail !== true) {
      this.expenseService.paymentBookForm = this.paymentBookForm.getRawValue();
      this.expenseService.tempFormCheck = this.paymentBookForm.getRawValue();
      if (
        ExpenseEditApproveTaskCode.includes(this.taskCode) &&
        this.taskCode !== 'EXPENSE_CLAIM_CORRECTION' &&
        this.paymentBookForm.getRawValue().expenseStatus !== 'DRAFT'
      ) {
        this.expenseService.expenseTransactionRequest = this.paymentBookForm.getRawValue().expenseTransactionDto;
      }
    }
    if (this.expenseService.isFromDetail) {
      const paymentBooks = this.paymentBookForm.getRawValue().expenseTransactionDto;
      this.expenseService.expenseDetail.expenseTransactionDto =
        this.expenseService.expenseDetail.expenseTransactionDto?.map(it => {
          const match = paymentBooks.find((m: any) => m.id === it.id);
          return { ...it, ...match };
        });
    }
  }

  async onBack() {
    /* FIX LEX-30689: remove commented code later if PASSED
    if (this.paymentBookForm?.dirty || this.expenseService.hasVerify) {
      let confirm = await this.notificationService.warningDialog(
        'COMMON.EXIT_WITHOUT_SAVE',
        'COMMON.MESSAGE_EXIT',
        'COMMON.EXIT_WITHOUT_SAVE',
        'icon-Reset'
      );
      if (confirm) {
        this.routerService.back();
      }
    } else {
      this.routerService.back();
    }
    */
    /** This logic is handled in canDeactivate */
    this.routerService.back();
  }

  onCancel() {
    this.onBack();
  }

  get needsValidation() {
    return !this.taskCodeExpensePaymentDetail.includes(this.taskCode) && this.isExpenseAsset();
  }

  isExpenseAsset() {
    return this.expenseService.isCaseExecutionSeizureAsset(
      this.paymentBookForm.get('stepCode')?.value || '',
      this.paymentBookForm.get('stepSubCode')?.value || ''
    );
  }

  async onSave() {
    this.actionBarEventName = 'SAVE';
    if (
      this.paymentMode === TMode.ADD ||
      this.expenseService.expenseDetail?.expenseStatusCode === 'DRAFT' ||
      this.taskCode === 'EXPENSE_CLAIM_CORRECTION'
    ) {
      this.paymentBookForm.markAllAsTouched();
      this.expenseService.hasVerify = false;
      if (
        this.paymentBookForm.invalid ||
        this.createPaymentBook?.paymentList?.data?.length === 0 ||
        // this.expenseService.expenseTransactionRequest?.length === 0 ||
        this.expenseService.checkbox.some(e => e.checked === false)
      ) {
        this.expenseService.hasVerify = true;
        return;
      }

      // const isExpenseAsset = this.isExpenseAsset()

      // every component in here updates only expenseTransactionRequest from the service, not paymentBookForm
      // const _expenseTransactionRequest =
      //   (this.paymentBookForm.get('expenseTransactionDto')?.value as ExpenseTransactionDto[])?.map(el => {
      //     return this.expenseService.mapExpenseTransaction(el, undefined, el.orderId, isExpenseAsset);
      //   }).filter(req => !!req.updateFlag) || [];

      const expenseRequest: ExpenseRequest = {
        assigneeId: this.paymentBookForm.value?.assigneeId,
        expenseRateId: this.paymentBookForm.value?.expenseRateId,
        expenseTransactions: this.expenseService.expenseTransactionRequest || [],
        headerFlag: ExpenseRequest.HeaderFlagEnum.Draft,
        note: this.paymentBookForm.value?.note,
      };

      if (
        this.expenseService.expenseDetail?.expenseStatusCode === 'DRAFT' ||
        this.taskCode === 'EXPENSE_CLAIM_CORRECTION'
      ) {
        expenseRequest.taskId = this.expenseService.expenseDetail?.taskId
          ? Number(this.expenseService.expenseDetail?.taskId)
          : this.taskId;
        expenseRequest.expenseNo = this.expenseService.expenseDetail?.expenseNo;
      }

      if (this.needsValidation) {
        const req = {
          taskId: this.expenseService.expenseDetail?.taskId,
          ...expenseRequest,
        };

        try {
          await this.expenseService.validateCollateralsAssets(req);
        } catch (err: unknown) {
          if (
            (err as HttpErrorResponse).error.errors?.length > 0 &&
            (err as HttpErrorResponse).error.errors[0].code === 'E013'
          ) {
            this.notificationService.openSnackbarError((err as HttpErrorResponse).error.errors[0].description);
          } else {
            this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
          }
          return;
        }
      }

      const expense: ExpenseRequest = await this.expenseService.saveExpense(expenseRequest);
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('FINANCE.MESSAGE_CREATE_PAYMENT_BOOK_DRAFT_SECCESS', {
          EXPENSE_NO: expense?.expenseNo,
        })
      );

      /* set ids of expenseTransactionDtos received from the backend after saving draft
      by replacing variables with the values from backend */
      this.taskId = expense.taskId || 0;

      const newExpenseTransactionList = [...(this.expenseService.expenseTransactionList || [])];
      newExpenseTransactionList.forEach(tax => {
        const resExpense = expense.expenseTransactions?.find(resTax => resTax.orderId === tax.orderId);
        if (resExpense) tax.id = resExpense.id;
      });

      this.expenseService.expenseTransactionRequest = []; // reset expenseTransactionRequest
      this.expenseService.expenseTransactionList = newExpenseTransactionList;
      this.expenseService.paymentBookForm.expenseTransactionDto = newExpenseTransactionList;
      this.paymentBookForm.get('expenseTransactionDto')?.setValue(newExpenseTransactionList);
      this.expenseService.expenseDetail = expense;
      // set table content in create-payment-book
      this.expenseService.expenseTransactionDtoSubject.next(newExpenseTransactionList);

      // do not show canDeactivate dialog
      this.paymentBookForm.markAsPristine();
      this.expenseService.hasVerify = false;
    } else if (
      this.taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD' ||
      this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD'
    ) {
      const _expenseTransactions: ExpenseTransactionDto[] =
        (this.paymentBookForm.getRawValue().expenseTransactionDto as ExpenseTransactionDto[]) || [];
      const _expenseTransactionNote: ExpenseTransactionNoteDto[] = _expenseTransactions.map(i => {
        return {
          id: i.id,
          note: i.note,
        } as ExpenseTransactionNoteDto;
      });
      const request: ReceiptRequest = this.expenseService.getReceiptRequest(
        'DRAFT',
        this.taskCode,
        _expenseTransactionNote
      );
      await this.expenseService.submitReceipt(this.taskId, request);
      this.notificationService.openSnackbarSuccess(
        `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
          this.expenseService?.expenseDetail?.expenseNo
        } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SAVE_DRAFT')}`
      );

      // do not show canDeactivate dialog
      this.paymentBookForm.markAsPristine();
      this.expenseService.hasVerify = false;
    } else {
      if (this.taskCode === 'EXPENSE_CLAIM_RECIEVE_ORIGINAL_DOCUMENT') {
        this.paymentBookForm.get('receiveDate')?.markAsTouched();
        this.paymentBookForm.get('receiveDate')?.updateValueAndValidity();
        const receiveDate = this.paymentBookForm.get('receiveDate');
        if (receiveDate?.invalid || isNaN(receiveDate?.value)) return;
      }
      const request = this.expenseService.getExpenseApprovalRequest(
        {
          ...this.paymentBookForm.getRawValue(),
          expenseTransactionDto: this.expenseService.expenseTransactionRequest || [],
        },
        'DRAFT'
      );
      await this.expenseService.approve(this.taskId, request);
      this.notificationService.openSnackbarSuccess(
        `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
          this.expenseService?.expenseDetail?.expenseNo
        } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SAVE_DRAFT')}`
      );

      // do not show canDeactivate dialog
      this.paymentBookForm.markAsPristine();
      this.expenseService.hasVerify = false;
    }
    this.paymentBookForm?.markAsPristine();
  }

  async onReject() {
    const _expenseStatusCode = this.expenseService.expenseDetail
      ?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum;
    const context = {
      taskId: this.taskId,
      taskCode: this.taskCode,
      mode: 'FINANCE_EXPENSE',
      action: 'REJECT',
      expenseObjectId: this.expenseService.expenseDetail.expenseNo,
      expenseStatus: this.paymentBookForm.getRawValue().expenseStatus,
      expenseTransactions: this.expenseService.expenseTransactionRequest || undefined,
      dataForm: _expenseStatusCode === 'PENDING_AUTO_PAYMENT_VERIFICATION' && this.paymentBookForm,
      statusCode: this.statusCode,
    };
    this.actionBarEventName = 'REJECT';
    switch (this.taskCode) {
      case 'EXPENSE_CLAIM_VERIFICATION':
        if (this.statusCode === 'PENDING') {
          this.expenseService.hasVerify = false;
          const expenseTransactions = this.expenseService.expenseTransactionRequest;
          const isNotVerifyAll = expenseTransactions?.some(e => e.isApproved == null);
          const isVerifyFalse = expenseTransactions?.some(e => e.isApproved === false);
          if (isNotVerifyAll || !isVerifyFalse) {
            this.expenseService.hasVerify = true;
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
          this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_CONSIDERATION' ||
          this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_APPROVAL_CONSIDERATION' ||
          this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_PAYMENT_APPROVAL'
        ) {
          this.expenseService.hasVerify = false;
          const expenseTransactions = this.expenseService.expenseTransactionRequest;
          const isNotVerifyAll = expenseTransactions?.some(e => e.isApproved == null);
          const isVerifyFalse = expenseTransactions?.some(e => e.isApproved === false);
          if (isNotVerifyAll || !isVerifyFalse) {
            this.expenseService.hasVerify = true;
            return;
          }
        }
        let options: DialogOptions = {
          component: RejectDialogComponent,
          iconName: 'icon-Arrow-Revert',
          title: 'COMMON.BUTTON_SEND_BACK_EDIT',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          rightButtonLabel: 'FINANCE.REJECT_DIALOG.BUTTON_CONFIRM_SEND_BACK_EDIT',
          buttonIconName: 'icon-Arrow-Revert',
          rightButtonClass: 'long-button mat-warn',
          context: context,
        };

        const labelNotApproveExpenseStatusCodes = ['PENDING_PAYMENT_CONFIRMATION'];

        if (labelNotApproveExpenseStatusCodes.includes(this.expenseService.expenseDetail?.expenseStatusCode ?? '')) {
          options = {
            ...options,
            iconName: 'icon-Dismiss-Square',
            title: 'COMMON.BUTTON_NOT_APPROVE',
            rightButtonLabel: 'COMMON.BUTTON_CONFIRM_NOT_APPROVE',
            buttonIconName: 'icon-Dismiss-Square',
          };
        }

        await this.notificationService.showCustomDialog(options);
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
      case 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL':
        if (_expenseStatusCode !== 'PENDING_PAYMENT_CONFIRMATION') {
          this.setValidateAssigneeId();
          this.expenseService.hasVerify = false;
          const expenseTransactions = this.expenseService.expenseTransactionRequest;
          if (!expenseTransactions?.some(e => e.isApproved === false)) {
            this.expenseService.hasVerify = true;
            break;
          }
          if (this.paymentBookForm.get('assigneeId')?.invalid && _expenseStatusCode !== 'PENDING_PAYMENT_APPROVAL')
            break;
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
        break;
      case 'EXPENSE_CLAIM_CORRECTION':
        if (this.statusCode === 'FAILED') {
          this.expenseService.receiptError = '';
          this.expenseService.hasVerify = false;
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
        if (this.statusCode === 'PENDING_APPROVAL') {
          const documentReceipt: any = this.expenseService?.expenseDetail?.klawReceipt;
          let receiptDate = new Date(documentReceipt.attributes['receiptDate']);
          let dateInvalid = false;
          if (this.expenseService.expenseDetail.expenseGroup === 1) {
            // FOR Reject case auto payment receiptDate < today >> date is invalid LEX2-106
            dateInvalid = moment(moment(receiptDate).format('YYYY-MM-DD')).isBefore(
              moment().format('YYYY-MM-DD'),
              'day'
            );
          } else {
            // FOR Reject case mannual payment not validate LEX2-102
            dateInvalid = false;
          }
          if (!this.expenseService?.hasVerify) {
            this.expenseService.receiptError = 'ERROR_VERIFY_RECEIPT';
          } else if (dateInvalid) {
            this.expenseService.receiptError = 'ERROR_EXPENSE_DATE_INVALID';
          } else {
            this.expenseService.receiptError = '';
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
        } else if (this.statusCode === 'FINISHED') {
          // LEX2-7148 statusCode === 'FINISHED'
          this.expenseService.receiptError = '';
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
      case 'EXPENSE_CLAIM_SYSTEM_PAYMENT':
        if (this.statusCode === 'FAILED') {
          this.expenseService.receiptError = '';
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
        break;
      case 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT':
      case 'REVERSE_EXPENSE_CLAIM_OTHER':
        if (this.statusCode === 'PENDING') {
          this.expenseService.receiptError = '';
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
        if (this.statusCode === 'PENDING') {
          const contextReverse = {
            taskId: this.taskId,
            taskCode: this.taskCode,
            mode: 'FINANCE_EXPENSE',
            action: 'REJECT',
            expenseObjectId: this.expenseService.expenseDetail.expenseNo,
            expenseStatus: this.paymentBookForm.getRawValue().expenseStatus,
            reverseExpenseAccept: false,
            expenseTransactions: this.expenseService.expenseTransactionRequest || undefined,
          };
          this.expenseService.receiptError = '';
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
      case 'AUTO_CREATE_EXPENSE_CLAIM':
        this.expenseService.receiptError = '';
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
        break;
      default:
        break;
    }
    setTimeout(() => {
      this.scrollToErrorMsg();
    }, 10);
  }

  setValidateAssigneeId() {
    const _expenseStatusCode = this.expenseService.expenseDetail
      ?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum;
    if (
      (this.taskCode === 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL' && this.statusCode === 'PENDING') ||
      _expenseStatusCode === 'PENDING_PAYMENT_CONSIDERATION' ||
      _expenseStatusCode === 'PENDING_PAYMENT_APPROVAL_CONSIDERATION'
    ) {
      this.paymentBookForm.get('assigneeId')?.addValidators(Validators.required);
      this.paymentBookForm.get('assigneeId')?.markAsTouched();
      this.paymentBookForm.get('assigneeId')?.updateValueAndValidity();
    }
  }

  async onSubmit() {
    this.actionBarEventName = 'SUBMIT';
    const _expenseStatusCode = this.expenseService.expenseDetail
      ?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum;
    if (
      this.paymentMode === TMode.ADD ||
      _expenseStatusCode === 'DRAFT' ||
      this.taskCode === 'EXPENSE_CLAIM_CORRECTION'
    ) {
      this.paymentBookForm.markAllAsTouched();
      this.expenseService.hasVerify = false;
      if (
        this.paymentBookForm.invalid ||
        this.createPaymentBook?.paymentList?.data?.length === 0 ||
        // this.expenseService.expenseTransactionRequest?.length === 0 || //request can be empty (the user just comes in from draft and clicks submit)
        this.expenseService.checkbox.some(e => e.checked === false)
      ) {
        this.expenseService.hasVerify = true;
        return;
      }
      if (
        this.taskCode === 'EXPENSE_CLAIM_CORRECTION' &&
        _expenseStatusCode !== 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL'
      ) {
        if (_expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION') {
          this.expenseService.hasVerify = false;
          if (!this.expenseService.hasEdit && !this.isLatestDraft) {
            this.expenseService.hasVerify = true;
            return;
          }
        } else {
          // check has update
          this.expenseService.hasVerify = false;
          const expenseTransactionDto = (
            this.expenseService.expenseDetail?.expenseTransactionDto as ExpenseTransactionDto[]
          ).filter(e => e.isApproved === false);
          const expenseTransactionRequest = this.expenseService
            .expenseTransactionRequest as ExpenseTransactionRequest[];
          if (
            !!!expenseTransactionRequest ||
            this.expenseService.hasNoEditExpenseTransaction(expenseTransactionDto, expenseTransactionRequest)
          ) {
            this.expenseService.hasVerify = true;
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
          assigneeId: this.paymentBookForm.value?.assigneeId,
          expenseNo: this.expenseService.expenseDetail?.expenseNo || undefined,
          expenseRateId: this.paymentBookForm.value?.expenseRateId,
          expenseTransactions: this.expenseService.expenseTransactionRequest || undefined,
          headerFlag: ExpenseRequest.HeaderFlagEnum.Submit,
          note: this.paymentBookForm.value?.note,
          taskId: this.taskId || undefined,
        };
        if (_expenseStatusCode === 'DRAFT' || this.taskCode === 'EXPENSE_CLAIM_CORRECTION') {
          expenseRequest.taskId = this.taskId;
          expenseRequest.expenseNo = this.expenseService.expenseDetail?.expenseNo;
        }
        if (this.needsValidation) {
          const req: ExpenseRequest = {
            taskId: this.expenseService.expenseDetail?.taskId,
            ...this.paymentBookForm.getRawValue(),
            ...expenseRequest,
          };
          try {
            await this.expenseService.validateCollateralsAssets(req);
          } catch (err: unknown) {
            if (
              (err as HttpErrorResponse).error.errors?.length > 0 &&
              (err as HttpErrorResponse).error.errors[0].code === 'E013'
            ) {
              this.notificationService.alertDialog(
                'ไม่สามารถดำเนินการต่อได้',
                (err as HttpErrorResponse).error.errors[0].description
              );
            } else {
              this.notificationService.openSnackbarError(
                this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR')
              );
            }
            return;
          }
        }

        const expense: ExpenseRequest = await this.expenseService.saveExpense(expenseRequest);
        if (_expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL') {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${expense?.expenseNo} ${this.translate.instant(
              'FINANCE.MESSAGE_SECCESS_SUBMIT_PAYMENT_LIST'
            )}`
          );
        } else if (
          _expenseStatusCode === 'PENDING_EXPENSE_CLAIM_CORRECTION' ||
          _expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION'
        ) {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('FINANCE.MESSAGE_CREATE_PAYMENT_BOOK_EDIT_SUCCESS', {
              EXPENSE_NO: expense?.expenseNo,
            })
          );
        } else {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('FINANCE.MESSAGE_CREATE_PAYMENT_BOOK_SUBMIT_SECCESS', {
              EXPENSE_NO: expense?.expenseNo,
            })
          );
        }
        this.navigateBackOnSuccess();
      }
    } else {
      switch (this.taskCode) {
        case 'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION':
          const expenseTransactions = this.expenseService.expenseTransactionRequest;
          const isVerifyAll = expenseTransactions?.every(e => e.isApproved === true);
          if (!isVerifyAll) {
            this.expenseService.hasVerify = true;
            break;
          }
          await this.warningContinueDialog();
          break;
        case 'EXPENSE_CLAIM_VERIFICATION':
          if (this.statusCode === 'PENDING') {
            this.expenseService.hasVerify = false;
            const expenseTransactions = this.expenseService.expenseTransactionRequest;
            const isVerifyAll = expenseTransactions?.every(e => e.isApproved === true);
            if (!isVerifyAll) {
              this.expenseService.hasVerify = true;
              break;
            }
            await this.warningContinueDialog();
          }
          break;
        case 'EXPENSE_CLAIM_PAYMENT_APPROVAL':
        case 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL':
          this.setValidateAssigneeId();
          this.expenseService.hasVerify = false;
          const expenseTransactionsPaymentApproval = this.expenseService.expenseTransactionRequest;
          if (!expenseTransactionsPaymentApproval?.every(e => e.isApproved === true)) {
            this.expenseService.hasVerify = true;
            break;
          }
          if (this.paymentBookForm.get('assigneeId')?.invalid && _expenseStatusCode !== 'PENDING_PAYMENT_APPROVAL')
            break;
          await this.warningContinueDialog();
          break;
        case 'EXPENSE_CLAIM_RECEIPT_UPLOAD':
        case 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD':
          const documentReceipt: any =
            this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD'
              ? this.expenseService?.expenseDetail?.financialNewsReceipt
              : this.expenseService?.expenseDetail?.klawReceipt;
          if (this.statusCode === 'FAILED' || this.statusCode === 'PENDING') {
            if (!documentReceipt?.imageId || documentReceipt?.imageId === '') {
              this.expenseService.receiptError = 'ERROR_REQUIRED';
            } else if (this.taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD' && !documentReceipt.attributes['receiptDate']) {
              this.expenseService.receiptError = 'ERROR_DATE_INVALID';
            } else {
              this.expenseService.receiptError = '';
              await this.warningContinueDialog();
            }
            if (this.expenseService.receiptError) {
              this.autoScroll();
            }
          } else if (this.statusCode === 'PENDING_APPROVAL') {
            let receiptDate = new Date(documentReceipt.attributes['receiptDate']);

            let dateInvalid = false;
            if (this.expenseService.expenseDetail.expenseGroup === 1) {
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

            if (!this.expenseService?.hasVerify) {
              this.expenseService.receiptError = 'ERROR_VERIFY_RECEIPT';
            } else if (dateInvalid) {
              this.expenseService.receiptError = 'ERROR_EXPENSE_DATE_INVALID';
            } else {
              this.expenseService.receiptError = '';
              await this.warningContinueDialog();
            }
            if (this.expenseService.receiptError) {
              this.autoScroll();
            }
          }
          break;
        case 'EXPENSE_CLAIM_RECIEVE_ORIGINAL_DOCUMENT':
          if (this.statusCode === 'PENDING') {
            this.paymentBookForm.get('receiveDate')?.markAsTouched();
            this.paymentBookForm.get('receiveDate')?.updateValueAndValidity();
            const receiveDate = this.paymentBookForm.get('receiveDate');
            if (receiveDate?.invalid || isNaN(receiveDate?.value)) break;
            await this.warningContinueDialog();
          }
          break;
        case 'EXPENSE_CLAIM_SYSTEM_PAYMENT':
          if (this.statusCode === 'FAILED') {
            await this.warningContinueDialog();
          }
          break;
        case 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT':
        case 'REVERSE_EXPENSE_CLAIM_OTHER':
          if (this.statusCode === 'PENDING') {
            const isContinue = await this.notificationService.warningDialog(
              'DIALOG_ALERT.TITLE_CONFIRM_SEND_INFO',
              'DIALOG_ALERT.MESSAGE_CONFIRM_SEND_INFO',
              'DIALOG.CONFIRM_BUTTON_CONFIRM',
              'icon-Selected'
            );
            if (isContinue) {
              const _expenseTransactions: ExpenseTransactionDto[] = this.expenseService.expenseTransactionRequest || [];
              const _expenseTransactionNote: ExpenseTransactionNoteDto[] = _expenseTransactions.map(i => {
                return {
                  id: i.id,
                  note: i.note,
                } as ExpenseTransactionNoteDto;
              });
              const req: RefundRequest = {
                isAccept: true,
                expenseTransactionNoteDtoList: _expenseTransactionNote,
              };
              await this.expenseService.refund(this.taskId, req);
              this.notificationService.openSnackbarSuccess(
                `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
                  this.expenseService?.expenseDetail?.expenseNo
                } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SUBMIT_REVERSE_EXPENSE')}`
              );
              this.navigateBackOnSuccess();
            }
          }
          break;
        case 'DECIDE_REVERSE_EXPENSE_CLAIM':
          if (this.statusCode === 'PENDING') {
            const contextReverse = {
              taskId: this.taskId,
              taskCode: this.taskCode,
              mode: 'FINANCE_EXPENSE',
              action: 'REJECT',
              expenseObjectId: this.expenseService.expenseDetail.expenseNo,
              expenseStatus: this.paymentBookForm.getRawValue().expenseStatus,
              reverseExpenseAccept: true,
            };
            this.expenseService.receiptError = '';
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

  autoScroll() {
    window.scrollTo(0, 800);
  }

  private async unableDownloadDocDialog() {
    await this.notificationService.alertDialog(
      'FINANCE.UNABLE_DOWNLOAD_DOC_DIALOG.TITLE',
      'FINANCE.UNABLE_DOWNLOAD_DOC_DIALOG.DETAIL'
    );
  }

  async warningContinueDialog() {
    const _expenseStatusCode = this.expenseService.expenseDetail?.expenseStatusCode || '';

    // LEX2-27434 main story(submission step)
    const downloadDocExpenseStatusCodes = [
      'PENDING_AUTO_PAYMENT_RECEIPT_UPLOAD', // LEX2-38458
      'PENDING_PAYMENT_RECEIPT_UPDATE_AUTO', // LEX2-38458
      'PENDING_EXPENSE_CLAIM_VERIFICATION', // LEX2-38460
      'PENDING_PAYMENT_RECEIPT_UPLOAD', // LEX2-38462
    ];
    const isDownloadDocChecking = downloadDocExpenseStatusCodes.includes(_expenseStatusCode);

    let buttonConfirmText = 'DIALOG.CONFIRM_BUTTON_CONFIRM';
    let isAllSuccess = true;

    if (isDownloadDocChecking) {
      buttonConfirmText = 'FINANCE.BUTTON_CONFIRM_AND_DOWNLOAD';
    }

    const isContinue = await this.notificationService.warningDialog(
      'DIALOG_ALERT.TITLE_CONFIRM_SEND_INFO',
      'DIALOG_ALERT.MESSAGE_CONFIRM_SEND_INFO',
      buttonConfirmText,
      'icon-Selected'
    );

    if (isContinue) {
      if (
        this.expenseService.receiptError === '' &&
        (this.taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD' || this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD')
      ) {
        if (this.statusCode === 'FAILED' || this.statusCode === 'PENDING') {
          const _expenseTransactions: ExpenseTransactionDto[] =
            (this.paymentBookForm.getRawValue().expenseTransactionDto as ExpenseTransactionDto[]) || [];
          const _expenseTransactionNote: ExpenseTransactionNoteDto[] = _expenseTransactions.map(i => {
            return {
              id: i.id,
              note: i.note,
            } as ExpenseTransactionNoteDto;
          });
          const request: ReceiptRequest = this.expenseService.getReceiptRequest(
            'SUBMIT',
            this.taskCode,
            _expenseTransactionNote
          );
          try {
            await this.expenseService.submitReceipt(this.taskId, request);
          } catch (error) {
            isAllSuccess = false;
          }
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this.expenseService?.expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_RECEIPT_UPLOAD')}`
          );
          /* Enhancement sprint3: LEX2-38458 */
          if (isAllSuccess && isDownloadDocChecking && this.expenseService?.expenseDetail?.expenseNo) {
            await this.expenseService.downloadExpenseReport(this.expenseService?.expenseDetail?.expenseNo);
          }
          isDownloadDocChecking && !isAllSuccess ? this.unableDownloadDocDialog() : this.navigateBackOnSuccess();
        } else if (this.statusCode === 'PENDING_APPROVAL') {
          // const _expenseTransactions: ExpenseTransactionDto[] =
          //   (this.paymentBookForm.getRawValue().expenseTransactionDto as ExpenseTransactionDto[]) || [];
          const request: ExpenseApprovalRequest = {
            headerFlag: 'SUBMIT',
            expenseTransactionDto: this.expenseService.expenseTransactionRequest || [],
            expenseStatus: this.expenseService.expenseDetail
              .expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum,
          };
          await this.expenseService.approve(this.taskId, request);
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this.expenseService?.expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_APPROVE')}`
          );
          this.navigateBackOnSuccess();
        }
      } else if (this.taskCode === 'EXPENSE_CLAIM_SYSTEM_PAYMENT') {
        await this.expenseService.retryPayment(this.taskId);
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
            this.expenseService?.expenseDetail?.expenseNo
          } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SUBMIT_DATA')}`
        );
        this.navigateBackOnSuccess();
      } else {
        const request = this.expenseService.getExpenseApprovalRequest(
          {
            ...this.paymentBookForm.getRawValue(),
            expenseTransactionDto: this.expenseService.expenseTransactionRequest,
          },
          'SUBMIT'
        );
        try {
          await this.expenseService.approve(this.taskId, request);
        } catch (error) {
          isAllSuccess = false;
        }
        if (
          [
            'PENDING_PAYMENT_APPROVAL_CONSIDERATION',
            'PENDING_PAYMENT_APPROVAL',
            'PENDING_AUTO_PAYMENT_APPROVAL',
          ].includes(_expenseStatusCode)
        ) {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this.expenseService?.expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_APPROVE')}`
          );
        } else if (_expenseStatusCode === 'PENDING_ACCEPT_ORIGINAL_DOCUMENT') {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this.expenseService?.expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SUBMIT_RECEIVE_DATE')}`
          );
        } else if (_expenseStatusCode === 'PENDING_PAYMENT_CONFIRMATION') {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this.expenseService?.expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.APPROVE_BANNER_MSG_SUCCESS')}`
          );
        } else if (_expenseStatusCode === 'PENDING_CONSIDER_REFUND') {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this.expenseService?.expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_APPROVED')}`
          );
        } else {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
              this.expenseService?.expenseDetail?.expenseNo
            } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SUBMIT_PAYMENT_LIST')}`
          );
        }
        /* Enhancement sprint3: LEX2-38460 */
        if (isAllSuccess && isDownloadDocChecking && this.expenseService?.expenseDetail?.expenseNo) {
          await this.expenseService.downloadExpenseReport(this.expenseService?.expenseDetail?.expenseNo);
        }
        isDownloadDocChecking && !isAllSuccess ? this.unableDownloadDocDialog() : this.navigateBackOnSuccess();
      }
    }
  }

  private navigateBackOnSuccess() {
    // clear data
    this.expenseService.clearDataPayment();

    this.routerService.back();
  }

  async onCancelCase() {
    const _expenseStatusCode = this.expenseService.expenseDetail
      ?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum;
    const context = {
      taskId: this.taskId,
      taskCode: this.taskCode,
      mode: 'FINANCE_EXPENSE',
      action: 'CANCEL',
      expenseObjectId: this.expenseService.expenseDetail.expenseNo,
      expenseStatus: this.paymentBookForm?.getRawValue()?.expenseStatus,
      expenseTransactions: this.paymentBookForm?.getRawValue()?.expenseTransactionDto || undefined,
      dataForm: _expenseStatusCode === 'PENDING_AUTO_PAYMENT_VERIFICATION' && this.paymentBookForm,
      isCopyWritingRefund: this.isCopyWritingRefund,
    };
    if (_expenseStatusCode === 'PENDING_AUTO_PAYMENT_VERIFICATION') {
      // Remark :: onCancelCase >> expenseStatusCode is PENDING_AUTO_PAYMENT_VERIFICATION as is Submit case
      this.actionBarEventName = 'CANCELCASE';
      this.setValidateAssigneeId();
    }

    // Validate assigneeId
    if (this.paymentBookForm.get('assigneeId')?.invalid) return;

    /* Default Cancel values */
    let iconName = 'icon-Dismiss-Square';
    let title = 'FINANCE.BUTTON_CANCEL_LIST';
    let rightButtonLabel = 'FINANCE.BUTTON_CANCEL_LIST_CONFIRM';
    let buttonIconName = 'icon-Dismiss-Square';

    /* Exceptional Case: Refund */
    if (this.isCopyWritingRefund) {
      iconName = 'icon-Arrow-Counterclockwise';
      title = 'FINANCE.TITLE_REFUND';
      rightButtonLabel = 'FINANCE.BUTTON_CONFIRM_REFUND';
      buttonIconName = 'icon-Arrow-Counterclockwise';
    }

    await this.notificationService.showCustomDialog({
      component: RejectDialogComponent,
      iconName,
      title,
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel,
      buttonIconName,
      rightButtonClass: 'long-button mat-warn',
      context: context,
    });
  }

  async onSent() {
    this.actionBarEventName = 'SENT';
    const _expenseStatusCode = this.expenseService.expenseDetail
      ?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum;
    if (_expenseStatusCode !== 'PENDING_PAYMENT_CONFIRMATION') {
      this.setValidateAssigneeId();
      const expenseTransactions = this.paymentBookForm.get('expenseTransactionDto')?.value as ExpenseTransactionDto[];
      const isNotVerifyAll = expenseTransactions?.some(e => e.isApproved == null);
      const assigneeId = this.paymentBookForm.get('assigneeId')?.value;
      this.expenseService.hasVerify = false;
      if (isNotVerifyAll) {
        this.expenseService.hasVerify = true;
        return;
      }
      if (!assigneeId && _expenseStatusCode !== 'PENDING_PAYMENT_APPROVAL') return;
      const result = await this.notificationService.showCustomDialog({
        component: RemarksPaymentDialogComponent,
        type: 'large',
        iconName: 'icon-Notepad',
        title: 'FINANCE.REMARKS_PAYMENT_DIALOG.KMB_TITLE',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        rightButtonLabel: 'FINANCE.REMARKS_PAYMENT_DIALOG.BUTTON_REMARKS_CONFIRM',
        buttonIconName: 'icon-save-primary',
        autoWidth: false,
      });
      if (result) {
        const paymentBookForm = this.paymentBookForm.getRawValue();
        const request: ExpenseApprovalRequest = {
          assigneeId: paymentBookForm.assigneeId,
          expenseStatus: _expenseStatusCode,
          expenseTransactionDto: paymentBookForm.expenseTransactionDto,
          headerFlag: 'SUBMIT',
          isRequestKbm: true,
          receiveDate: !!paymentBookForm.receiveDate
            ? Utils.dateFormat(paymentBookForm.receiveDate, 'yyyy-MM-DD')
            : undefined,
          requestKbmReason: result?.note,
        };
        await this.expenseService.approve(this.taskId, request);
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('FINANCE.EXPENSE_REQUEST_NO')}: ${
            this.expenseService?.expenseDetail?.expenseNo
          } ${this.translate.instant('FINANCE.MESSAGE_SECCESS_SUBMIT_REQUEST_KBM')}`
        );
        this.navigateBackOnSuccess();
      }
    }
  }

  private scrollToErrorMsg() {
    // Find the target element with the class name
    const targetElement = document.querySelector('.error-msg.ng-star-inserted');

    // Scroll to the target element
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
