import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { eFiling3_LED } from '@app/shared/constant';
import { taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { AuctionReceiptDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe } from '@spig/core';
import { AuctionEfilingOrderDialogModel, AuctionUploadReceiptForm } from '../interface/auction-efiling.model';
import { AuctionPaymentService } from '../service/auction-payment.service';
import { AuctionService } from '../../auction.service';

@Component({
  selector: 'app-auction-receipt-efiling',
  templateUrl: './auction-receipt-efiling.component.html',
  styleUrls: ['./auction-receipt-efiling.component.scss'],
})
export class AuctionReceiptEfilingComponent {
  auctionUploadReceiptTaskCode: taskCode = taskCode.R2E09_02_3B;
  auctionReceiptDialogConfig = AuctionEfilingOrderDialogModel;
  auctionReceiptForm: AuctionReceiptDto = AuctionUploadReceiptForm;
  auctionReceiptFormControl: UntypedFormControl = new UntypedFormControl();
  uploadFormControl: UntypedFormControl = new UntypedFormControl();
  receiptAmount: number = 0;
  auctionExpenseId: number = 0;
  messageType: 'error' | 'success' | null = null;
  errorMsg: string = '';
  successMsg: string =
    'กรุณาตรวจสอบใบเสร็จรับเงินให้ถูกต้องและตรงกับคดีความก่อนอัปโหลด หากชำระเงินเสร็จสิ้นแล้วจะไม่สามารถแก้ไขได้';
  invalidMsg: string = 'ใบเสร็จรับเงินไม่ตรงกับคดีที่ดำเนินการอยู่ \n กรุณาตรวจสอบข้อมูลและอัปโหลดใหม่อีกครั้งหนึ่ง';
  dataCtx: any;
  ctrl!: UntypedFormControl;
  auctionCaseTypeCode: string = '';

  constructor(
    private translateService: TranslateService,
    private auctionPaymentService: AuctionPaymentService,
    private buddhistEraPipe: BuddhistEraPipe,
    private notificationService: NotificationService,
    private auctionService: AuctionService
  ) {
    this.auctionCaseTypeCode = this.auctionService.auctionCaseTypeCode;
  }

  async onClose() {
    this.uploadFormControl.clearValidators();
    if (!!!this.uploadFormControl.value) {
      this.uploadFormControl.setValue(0);
    }
    this.uploadFormControl.setValidators([Validators.required, Validators.pattern(/[^0]+/)]);
    this.uploadFormControl.markAllAsTouched();
    this.uploadFormControl.updateValueAndValidity();
    return await this.auctionPaymentService
      .saveAuctionExpenseReceipt(this.auctionExpenseId, this.auctionReceiptForm)
      .then(() => {
        this.auctionReceiptDialogConfig.isSubmitted = true;
        this.notificationService.openSnackbarSuccess('อัปโหลดใบเสร็จเรียบร้อยแล้ว');
        return this.returnData;
      })
      .catch(() => {
        this.auctionReceiptDialogConfig.isSubmitted = true;
        return false;
      });
  }

  public _returnData = true;
  get returnData() {
    return this._returnData;
  }

  dataContext(data: any): void {
    this.auctionExpenseId = data.auctionExpenseId;
    this.auctionReceiptDialogConfig.isSubmitted = false;
    this.ctrl = data.formControl;
    if (this.auctionPaymentService?.auctionReceiptDto) {
      this.auctionReceiptForm = this.auctionPaymentService.auctionReceiptDto;
      this.uploadFormControl.setValue(this.auctionReceiptForm.amount);
      this.uploadFormControl.updateValueAndValidity();
    }
  }

  onUploadSuccess(event: any): void {
    if (event !== null) {
      this.messageType = 'success';
      this.dataCtx = event;
      this.auctionReceiptForm = event;
      this.auctionPaymentService.auctionReceiptDto = event;
      this.uploadFormControl.setValue(this.auctionReceiptForm.amount);
      this.uploadFormControl.updateValueAndValidity();
    }
  }

  onUploadError(errors: any): void {
    if (errors && errors.length > 0) {
      this.handleErrorCode(errors[0]);
    }
  }

  async handleErrorCode(error: any): Promise<void> {
    const errorCode = error.code;
    switch (errorCode) {
      case 'F033':
        this.errorMsg = 'F033';
        this.notificationService.openSnackbarError(this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F033'));
        this.ctrl.setValue(false);
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

        const latestData = await this.auctionPaymentService.inquiryAuctionExpenseInfo(this.auctionExpenseId);
        this.auctionPaymentService.paymentOrderFormGroup =
          this.auctionPaymentService.getPaymentDetailFormGroupWithApi(latestData);
        this.auctionPaymentService.formGroupUpdated.next(this.auctionPaymentService.paymentOrderFormGroup);
        break;
      case 'F035':
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F035');
        break;
      case 'F036':
        this.notificationService.openSnackbarError(
          this.translateService.instant('EXCEPTION_CONFIG.AUCTION_TOAST_MESSAGE_F036'),
          {
            buttonText: this.translateService.instant('COMMON.BUTTON_ACKNOWLEDGE'),
          }
        );
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F036');
        break;
      case 'F999':
        this.notificationService.openSnackbarError(
          this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'),
          {
            buttonText: this.translateService.instant('COMMON.BUTTON_ACKNOWLEDGE'),
          }
        );
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR');
        break;
    }
    this.messageType = 'error';
  }
}
