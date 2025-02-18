import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '@app/modules/task/services/task.service';
import { eFiling3_LED } from '@app/shared/constant';
import { EFilingSuccessMsg } from '@app/shared/constant/e-filing-config';
import { taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { notEqualTo } from '@app/shared/validators';
import { SeizureInvoiceDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe, CustomDialogContent } from '@spig/core';
import { SeizureUploadDialogForm, SeizureUploadDialogModel } from '../../models';
import { SeizureUploadDialogService } from './seizure-upload-dialog.service';
import { LoggerService } from '@app/shared/services/logger.service';

@Component({
  selector: 'app-seizure-upload-dialog',
  templateUrl: './seizure-upload-dialog.component.html',
  styleUrls: ['./seizure-upload-dialog.component.scss'],
})
export class SeizureUploadDialogComponent implements OnInit, CustomDialogContent {
  seizureUploadDialogConfig = SeizureUploadDialogModel;
  seizureUploadFormControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
    notEqualTo('0.00'),
  ]);
  seizureUploadForm: SeizureInvoiceDto = SeizureUploadDialogForm;
  errorMsg: string = '';
  successMsg: string = EFilingSuccessMsg.get('SEIZURE_PROPERTY') || '';
  invalidMsg: string = 'ตัวเลขไม่ตรงกับจำนวนเงินที่ต้องชำระ\nกรุณาตรวจสอบข้อมูลก่อนยืนยัน';
  _taskCode: taskCode = taskCode.R2E05_03_4;
  dataCtx: any;
  messageType: 'error' | 'success' | 'invalid' | null = null;
  seizureLedIdValid = 0;
  uploadableBtn: boolean = false;

  public ledRefNo!: string;
  public ledRefNoDate!: string;

  ctrl!: UntypedFormControl;

  constructor(
    private dialogRef: MatDialogRef<SeizureUploadDialogComponent>,
    private seizureUploadDialogService: SeizureUploadDialogService,
    private translateService: TranslateService,
    private buddhistEraPipe: BuddhistEraPipe,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private logger: LoggerService
  ) {}

  dataContext(data: any): void {
    this.seizureLedIdValid = data.seizureLedId;
    this.ledRefNo = data.ledRefNo;
    this.ledRefNoDate = data.ledRefNoDate;
    this.ctrl = data.formControl;
  }

  returnData: any;

  ngOnInit(): void {
    this.getInvoice();
    this.onCheckInvalidAmount();
    this.seizureUploadDialogConfig.isSubmitted = false;
  }

  getInvoice(): void {
    this.seizureUploadForm = this.seizureUploadDialogService.seizureInvoiceDto;
    this.dataCtx = this.seizureUploadDialogService.seizureInvoiceDto;
    this.uploadableBtn = coerceBooleanProperty(this.seizureUploadDialogService.seizureInvoiceDto.uploadFlag);
    if (this.seizureUploadForm) {
      this.seizureUploadFormControl.setValue(this.seizureUploadForm.amount);
    }
  }

  async onClose() {
    if (this.messageType === 'invalid') {
      return false;
    }

    const result = await this.seizureUploadDialogService
      .payment(this.seizureLedIdValid)
      .then(() => {
        const litigationId = this.taskService.taskDetail.litigationId || '';
        this.notificationService.openSnackbarSuccess(
          `เลขที่กฎหมาย: ${litigationId} บันทึกใบแจ้งการชำระเงินค่าธรรมเนียมแล้ว`,
          { buttonText: 'COMMON.BUTTON_ACKNOWLEDGE' }
        );
        this.uploadableBtn = false;
        this.seizureUploadDialogConfig.isSubmitted = true;
        return true;
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
          this.logger.catchError(e);
          this.notificationService.openSnackbarError(
            this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'),
            { buttonText: 'COMMON.BUTTON_ACKNOWLEDGE' }
          );
        }
        // this.uploadableBtn = false;
        this.seizureUploadDialogConfig.isSubmitted = true;
        this.seizureUploadFormControl.markAllAsTouched();
        this.seizureUploadFormControl.updateValueAndValidity();
        return false;
      });
    return result;
  }

  onUploadSuccess(event: any): void {
    console.log(event);
    if (event !== null) {
      this.messageType = 'success';
      this.dataCtx = event;
      this.seizureUploadForm.amount = event.amount;
      this.seizureUploadFormControl.setValue(event.amount);
    } else {
      this.messageType = 'error';
      this.seizureUploadFormControl.setValue('0.00');
      this.seizureUploadFormControl.updateValueAndValidity();
    }
  }

  onUploadError(errors: any): void {
    if (errors && errors.length > 0) {
      this.seizureUploadForm = {};
      if (!this.seizureUploadForm.amount) {
        this.seizureUploadFormControl.setValue(null);
        this.seizureUploadFormControl.disable();
      }
      this.handleErrorCode(errors[0]);
    }
  }

  onCheckInvalidAmount(): void {
    this.seizureUploadFormControl.valueChanges.subscribe(value => {
      if (this.dataCtx.amount) {
        this.messageType =
          this.dataCtx.amount !== value ? 'invalid' : this.messageType !== 'error' ? 'success' : 'error';
      }
    });
  }

  handleErrorCode(error: any): void {
    const errorCode = error.code;
    this.messageType = 'error';
    switch (errorCode) {
      case 'F033':
        this.errorMsg = 'F033';
        this.notificationService.openSnackbarError(this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F033'));
        this.ctrl.setValue(false);
        this.ctrl.updateValueAndValidity();
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
        this.ctrl.setValue(false);
        this.ctrl.updateValueAndValidity();
        this.errorMsg = this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_F035', {
          buttonText: 'COMMON.BUTTON_ACKNOWLEDGE',
        });
        this.notificationService.openSnackbarError(
          this.translateService.instant('EXCEPTION_CONFIG.TOAST_MESSAGE_F035')
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
