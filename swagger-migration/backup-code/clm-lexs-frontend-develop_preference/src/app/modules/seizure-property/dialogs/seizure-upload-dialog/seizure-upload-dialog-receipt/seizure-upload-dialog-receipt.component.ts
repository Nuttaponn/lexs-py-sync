import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { eFiling3_LED } from '@app/shared/constant';
import { taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { SeizureReceiptDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe, DialogsService } from '@spig/core';
import { SeizureUploadReceiptDialogModel, SeizureUploadReceiptForm } from '../../../models';
import { SeizureUploadDialogService } from '../seizure-upload-dialog.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-seizure-upload-dialog-receipt',
  templateUrl: './seizure-upload-dialog-receipt.component.html',
  styleUrls: ['./seizure-upload-dialog-receipt.component.scss'],
})
export class SeizureUploadDialogReceiptComponent {
  receiptTaskCode: taskCode = taskCode.R2E05_03_4;
  seizureUploadReceiptDialogConfig = SeizureUploadReceiptDialogModel;
  seizureUploadReceiptForm: SeizureReceiptDto = SeizureUploadReceiptForm;
  uploadForm = new UntypedFormControl();
  receiptAmount: number = 0;
  messageType: 'error' | 'success' | null = null;
  errorMsg: string = '';
  successMsg: string =
    'กรุณาตรวจสอบใบเสร็จให้ถูกต้องและตรงกับคดีความก่อนอัปโหลด หากชำระเงินเสร็จสิ้นแล้วจะไม่สามารถแก้ไขได้';
  dataCtx: any;
  seizureLedIdValid = 0;
  ctrl!: UntypedFormControl;

  constructor(
    private seizureUploadDialogService: SeizureUploadDialogService,
    private translateService: TranslateService,
    private buddhistEraPipe: BuddhistEraPipe,
    private notificationService: NotificationService,
    private dialogService: DialogsService
  ) {}

  async onClose(): Promise<boolean> {
    this.uploadForm.clearValidators();
    if (!!!this.uploadForm.value) {
      this.uploadForm.setValue(0);
    }
    this.uploadForm.setValidators([Validators.required, Validators.pattern(/[^0]+/)]);
    this.uploadForm.markAllAsTouched();
    this.uploadForm.updateValueAndValidity();
    const result = await this.seizureUploadDialogService
      .saveSeizureFeeReceipt(this.seizureLedIdValid, this.seizureUploadReceiptForm)
      .then(() => {
        this.seizureUploadReceiptDialogConfig.isSubmitted = true;
        this.notificationService.openSnackbarSuccess('อัปโหลดใบเสร็จรับเงินเรียบร้อยแล้ว');
        return true;
      })
      .catch((e: HttpErrorResponse) => {
        if (e.error.errors && e.error.errors.length > 0) {
          const paymentNotCompleted = e.error.errors[0].code && e.error.errors[0].code === 'F054';
          if (paymentNotCompleted) {
            this.dialogService.closeAll();
            this.notificationService.alertDialog(
              'ไม่สามารถอัปโหลดได้',
              'กรุณาอัปโหลดเอกสารข้อ <span class="bold">(4) ใบแจ้งหนี้ค่าธรรมเนียมยึดทรัพย์</span> และชำระให้เสร็จสิ้น ก่อน',
              'COMMON.BUTTON_ACKNOWLEDGE'
            );
          }
        }
        this.seizureUploadReceiptDialogConfig.isSubmitted = true;
        return false;
      });
    return result;
  }

  dataContext(data: any): void {
    this.seizureLedIdValid = data.seizureLedId;
    this.seizureUploadReceiptDialogConfig.isSubmitted = false;
    this.ctrl = data.formControl;
  }

  onUploadSuccess(event: any): void {
    if (event !== null) {
      this.messageType = 'success';
      this.dataCtx = event;
      this.seizureUploadReceiptForm = event;
      this.uploadForm.setValue(this.seizureUploadReceiptForm.amount);
      this.uploadForm.updateValueAndValidity();
    }
  }

  onUploadError(errors: any): void {
    if (errors && errors.length > 0) {
      this.handleErrorCode(errors[0]);
    }
  }

  handleErrorCode(error: any): void {
    const errorCode = error.code;
    if (errorCode === 'F054') {
      this.dialogService.closeAll();
      this.notificationService.alertDialog(
        'ไม่สามารถอัปโหลดได้',
        'กรุณาอัปโหลดเอกสารข้อ <span class="bold">(4) ใบแจ้งหนี้ค่าธรรมเนียมยึดทรัพย์</span> และชำระให้เสร็จสิ้น ก่อน',
        'COMMON.BUTTON_ACKNOWLEDGE'
      );
    } else {
      switch (errorCode) {
        case 'F033':
          this.errorMsg = 'F033';
          this.notificationService.openSnackbarError(this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F033'));
          this.ctrl.setValue(false);
          break;
        case 'F034':
          this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F034', {
            DATE_TIME: this.buddhistEraPipe.transform(
              !isNaN(Date.parse(error.message))
                ? error.message
                : this.seizureUploadDialogService.seizureInvoiceDto.invoiceDueDate,
              'DD/MM/YYYY HH:mm'
            ),
            LINK: `<a href="${eFiling3_LED}" target="_blank" class="bold fill-black-100">ไปที่เว็ปไซต์ e-Filing</a>`,
          });
          this.errorMsg =
            this.errorMsg.indexOf('startbold') !== -1 && this.errorMsg.indexOf('endbold') !== -1
              ? this.errorMsg.replace('startbold', '<span class="bold">').replace('endbold', '</span>')
              : this.errorMsg;
          break;
        case 'F035':
          this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F035');
          break;
        case 'F036':
          this.ctrl.setValue(false);
          this.ctrl.updateValueAndValidity();
          this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F036');
          break;
        default:
          this.ctrl.setValue(true);
          this.ctrl.updateValueAndValidity();
      }
    }
    this.messageType = 'error';
  }
}
