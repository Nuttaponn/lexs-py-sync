import { HttpErrorResponse } from '@angular/common/http';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DOC_TEMPLATE, eFiling3_LED } from '@app/shared/constant';
import { EFilingSuccessMsg } from '@app/shared/constant/e-filing-config';
import { taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { notEqualTo } from '@app/shared/validators';
import { AuctionExpenseRequest, AuctionInvoiceDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe } from '@spig/core';
import { AuctionEfilingDialogModel, AuctionUploadInvoiceForm } from '../interface/auction-efiling.model';
import { AuctionPaymentService } from '../service/auction-payment.service';
import { AuctionService } from '../../auction.service';

@Component({
  selector: 'app-auction-payment-efiling',
  templateUrl: './auction-payment-efiling.component.html',
  styleUrls: ['./auction-payment-efiling.component.scss'],
})
export class AuctionPaymentEfilingComponent implements OnInit {
  auctionPaymentTaskCode: taskCode = taskCode.R2E09_02_3B;
  auctionPaymentDialogConfig = AuctionEfilingDialogModel;
  auctionPaymentForm: AuctionInvoiceDto = AuctionUploadInvoiceForm;
  auctionExpenseId: number = 0;
  auctionPaymentFormControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
    notEqualTo('0.00'),
  ]);
  messageType: 'error' | 'success' | 'invalid' | 'paymentSuccess' | null = null;
  errorMsg: string = '';
  successMsg: string = EFilingSuccessMsg.get('AUCTION') || '';
  invalidMsg: string = 'ตัวเลขไม่ตรงกับจำนวนเงินที่ต้องชำระ\nกรุณาตรวจสอบข้อมูลก่อนยืนยัน';
  paymentSuccessMsg: string = 'TEST1';
  dataCtx: any;
  uploadableBtn: boolean = false;
  ctrl: UntypedFormControl = new UntypedFormControl();
  litigationId: string | number | null | undefined;

  constructor(
    private dialogRef: MatDialogRef<AuctionPaymentEfilingComponent>,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private auctionPaymentService: AuctionPaymentService,
    private buddhistEraPipe: BuddhistEraPipe,
    private auctionService: AuctionService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getInvoice();
    this.onCheckInvalidAmount();
    this.auctionPaymentDialogConfig.isSubmitted = false;
  }

  dataContext(data: any): void {
    this.auctionExpenseId = data.auctionExpenseId;
    this.ctrl = data.formControl;
    // wait LED-REF-INFO11
    // WAIT LED-REF-DATE
  }

  async getInvoice(): Promise<void> {
    this.auctionPaymentFormControl.setValue(null);
    this.auctionPaymentService.auctionInvoiceDto = await this.auctionPaymentService.getInvoice(this.auctionExpenseId);
    this.auctionPaymentForm = this.auctionPaymentService.auctionInvoiceDto;
    this.dataCtx = this.auctionPaymentService.auctionInvoiceDto;
    this.uploadableBtn = coerceBooleanProperty(this.auctionPaymentService.auctionInvoiceDto.uploadFlag);
    if (this.auctionPaymentForm) {
      this.auctionPaymentFormControl.setValue(this.auctionPaymentForm?.amount);
    }
  }

  private async findDocumentImageById(expenseType: string): Promise<string | undefined> {
    let docmentTempateId: string = '';
    if (expenseType === 'WRIT_OF_EXECUTE_E_FILING') {
      docmentTempateId = DOC_TEMPLATE.LEXSF134;
    } else if (expenseType === 'SUMMON_FOR_SURCHARGE_E_FILING') {
      docmentTempateId = DOC_TEMPLATE.LEXSF133;
    } else {
      return undefined;
    }
    const apiReload = await this.auctionService.getAuctionExpenseInfo(this.auctionExpenseId);
    const document = apiReload?.documents?.find(it => it.documentTemplate?.documentTemplateId === docmentTempateId);
    return document?.imageId;
  }

  async onClose() {
    if (this.messageType === 'invalid') {
      return false;
    }
    const formData = this.auctionPaymentService.paymentOrderFormGroup.getRawValue();
    const auctionExpenseType = formData.auctionExpenseType;
    formData.auctionExpenseDoc.uploadSessionId = await this.findDocumentImageById(auctionExpenseType);

    return await this.auctionPaymentService
      .submitAuctionExpense(formData as AuctionExpenseRequest)
      .then(async () => {
        const response = await this.auctionPaymentService.payment(this.auctionExpenseId);
        return (this.litigationId = response.litigationId), (this._returnData = response.litigationId);
      })
      .then(() => {
        this.notificationService.openSuccessBanner(
          `เลขที่กฎหมาย: ${this.litigationId} บันทึกใบแจ้งหนี้ค่าใช้จ่ายประกาศขายทอดตลาดแล้ว`,
          {
            buttonText: this.translateService.instant('COMMON.BUTTON_ACKNOWLEDGE'),
          }
        );
        this.uploadableBtn = false;
        this.auctionPaymentDialogConfig.isSubmitted = true;
        return this.returnData;
      })
      .catch((e: HttpErrorResponse) => {
        const err = e.error.errors[0];
        if (err.code !== 'F999') {
          if (['F033', 'F034', 'F035', 'F036', 'F038', 'F039'].includes(err.code)) {
            // disable btn
            this.handleErrorCode(err);
            this.ctrl.setValue(false);
            this.ctrl.updateValueAndValidity();
          } else {
            this.notificationService.openSnackbarError(
              this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_PAYMENT_ERROR'),
              { buttonText: 'COMMON.BUTTON_ACKNOWLEDGE' }
            );
          }
        } else {
          // FOR F999
          this.notificationService.openSnackbarError(
            this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'),
            { buttonText: 'COMMON.BUTTON_ACKNOWLEDGE' }
          );
        }
        this.uploadableBtn = !!!this.auctionPaymentService.auctionInvoiceDto?.uploadFlag;
        this.auctionPaymentDialogConfig.isSubmitted = true;
        this.auctionPaymentFormControl.markAllAsTouched();
        this.auctionPaymentFormControl.updateValueAndValidity();
        return false;
      });
  }

  public _returnData = true;
  get returnData() {
    return this._returnData;
  }

  onUploadError(errors: any): void {
    if (errors && errors.length > 0) {
      this.auctionPaymentForm = {};
      if (!this.auctionPaymentForm?.amount) {
        this.auctionPaymentFormControl.setValue(null);
        this.auctionPaymentFormControl.disable();
      }
      this.handleErrorCode(errors[0]);
    }
  }

  onUploadSuccess(event: any): void {
    if (event !== null) {
      this.messageType = 'success';
      this.dataCtx = event;
      this.auctionPaymentService.auctionInvoiceDto = event;
      this.auctionPaymentForm = event;
      this.auctionPaymentForm.imageId = event.imageId || '';
      this.auctionPaymentForm.amount = event.amount || '0.00';
      this.auctionPaymentFormControl.setValue(event.amount);
    } else {
      this.messageType = 'error';
      this.auctionPaymentFormControl.setValue('0.00');
      this.auctionPaymentFormControl.updateValueAndValidity();
    }
  }

  onCheckInvalidAmount(): void {
    this.auctionPaymentFormControl.valueChanges.subscribe(value => {
      if (this.dataCtx?.amount) {
        this.messageType =
          this.dataCtx.amount !== value ? 'invalid' : this.messageType !== 'error' ? 'success' : 'error';
      }
    });
  }

  handleErrorCode(error: any): void {
    const errorCode = error.code;
    this.messageType = 'error';
    switch (errorCode) {
      case 'A004':
        this.notificationService.openSnackbarError(
          this.translateService.instant('ไม่สามารถทำรายการต่อได้ในขณะนี้ กรุณาตรวจสอบข้อมูลและโปรดลองอีกครั้งหนึ่ง')
        );
        this.auctionPaymentFormControl.markAsTouched();
        this.auctionPaymentForm.imageId = '';
        break;
      case 'F015':
        this.notificationService.openSnackbarError(this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F015'));
        break;
      case 'F033':
        this.errorMsg = 'F033';
        this.notificationService.openSnackbarError(this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F033'));
        this.ctrl.setValue(false);
        this.ctrl.updateValueAndValidity();
        break;
      case 'F034':
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.AUCTION_MESSAGE_F034', {
          DATE_TIME: this.buddhistEraPipe.transform(
            !isNaN(Date.parse(error.message))
              ? error.message
              : this.auctionPaymentService.auctionInvoiceDto.invoiceDueDate,
            'DD/MM/YYYY HH:mm'
          ),
          LINK: `<a href="${eFiling3_LED}" target="_blank" class="bold fill-black-100">ไปที่เว็ปไซต์ e-Filing</a>`,
        });
        this.errorMsg =
          this.errorMsg.indexOf('startbold') !== -1 && this.errorMsg.indexOf('endbold') !== -1
            ? this.errorMsg.replace('startbold', '<span class="bold">').replace('endbold', '</span>')
            : this.errorMsg;
        this.auctionPaymentService.efilingError = { errorCode: 'F034' };
        break;
      case 'F035':
        this.ctrl.setValue(false);
        this.ctrl.updateValueAndValidity();
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.AUCTION_MESSAGE_F035', {
          buttonText: 'COMMON.BUTTON_ACKNOWLEDGE',
        });
        this.notificationService.openSnackbarError(
          this.translateService.instant('EXCEPTION_CONFIG.AUCTION_TOAST_MESSAGE_F035')
        );
        break;
      case 'F036':
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F036');
        break;
      case 'F038':
        // As per requirement, need to close this dialog and open a new one.
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F038');
        error.message = this.errorMsg;
        this.dialogRef.close({ error });
        break;
      case 'F039':
        // As per requirement, need to close this dialog and open error msg.
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F039');
        error.message = this.errorMsg;
        this.dialogRef.close({ error });
        break;
      default:
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR');
        break;
    }
  }
}
