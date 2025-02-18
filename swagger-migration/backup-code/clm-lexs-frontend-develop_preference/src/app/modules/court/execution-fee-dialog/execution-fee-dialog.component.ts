import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { CourtDecreeDto, DefendantDto, ExecutionFeeDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { CourtService } from '../court.service';

@Component({
  selector: 'app-execution-fee-dialog',
  templateUrl: './execution-fee-dialog.component.html',
  styleUrls: ['./execution-fee-dialog.component.scss'],
})
export class ExecutionFeeDialogComponent {
  constructor(
    private notificationService: NotificationService,
    private courtService: CourtService,
    private translate: TranslateService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  public decree!: CourtDecreeDto;
  public taskId!: number;

  executionFeeData: ExecutionFeeDto | undefined;
  defendantsData: DefendantDto[] = [];

  receiptAmount: string = '-';
  paymentImageId: string | undefined;
  companyCode: string | undefined;
  ref1: string | undefined;

  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  file: any = null;

  amountControl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  defendantsControl: UntypedFormControl = new UntypedFormControl([]);
  selectedDefendants: DefendantDto[] = [];
  dateControl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  fileControl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  today = new Date();

  submitted: boolean = false;

  defendantsEditable: boolean = true;

  async dataContext(data: any) {
    this.decree = data.decree;
    this.taskId = data.taskId;
    if (data.executionFeeData) {
      this.executionFeeData = data.executionFeeData;
      this.defendantsData = this.executionFeeData?.persons as DefendantDto[];

      this.defendantsControl.setValue(this.executionFeeData?.persons as DefendantDto[]);
      this.fileControl.setValue(this.executionFeeData?.documentDto?.imageId);
      this.amountControl.setValue(this.executionFeeData?.amount);
      this.defendantsEditable = false;
    } else {
      this.defendantsData = data.defendants;
      this.defendantsEditable = true;
    }
  }

  selectDocument() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = fileInput.files[index];
        this.uploadDocument(file);
      }
    };
    fileInput.click();
  }

  async uploadDocument(file: any) {
    if (!['application/pdf'].includes(file.type)) {
      this.notificationService.openSnackbarError(` ${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
      return;
    }
    try {
      const res = await this.courtService.readPaymentForm(this.taskId, file);
      this.file = file;
      this.receiptAmount = res.amount?.toString() || '-';
      this.paymentImageId = res.paymentImageId;
      this.ref1 = res.ref1;
      this.companyCode = res.companyCode;

      this.fileControl.setValue(file);
      this.fileControl.setErrors(null);
    } catch (e: any) {
      const errors = e?.error?.errors as any[];
      this.notificationService.openSnackbarError(
        this.errorHandlingService.getMessageMapByKey(errors[0]?.code)?.message ?? ''
      );
    }
  }

  onDefendantChange(event: DefendantDto[]) {
    this.selectedDefendants = event;
    this.defendantsControl.setValue(event);
    if (event.length > 0) this.defendantsControl.setErrors(null);
    else if (this.defendantsControl.touched) this.defendantsControl.setErrors({ invalid: true });
  }

  public async onClose(): Promise<boolean> {
    let defendantsError = false;
    if (this.defendantsEditable && (this.defendantsControl.value as Array<DefendantDto>).length === 0)
      defendantsError = true;
    if (defendantsError) this.defendantsControl.setErrors({ invalid: true });
    if (defendantsError || !this.fileControl.valid || !this.amountControl.valid) {
      this.fileControl.markAsTouched();
      this.amountControl.markAllAsTouched();
      this.defendantsControl.markAsTouched();
      return false;
    } else {
      if (!this.executionFeeData) {
        try {
          await this.courtService.savePayExecutionFee(this.taskId, {
            amount: parseFloat(this.receiptAmount),
            companyCode: this.companyCode,
            courtFee: undefined,
            deliveryFeeForPleadings: this.amountControl.value,
            documentPreparationFee: undefined,
            headerFlag: 'SUBMIT',
            paymentImageId: this.paymentImageId,
            personIds: (this.defendantsControl.value as Array<DefendantDto>).map(d => d.personId || ''),
            ref1: this.ref1,
          });
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('COURT.DECREE.SUCCESS_DIALOG_EXECUTION_FEE', {
              LG_ID: this.decree.litigationId,
            })
          );
          this.submitted = true;
          return true;
        } catch (e) {
          this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
          return false;
        }
      } else {
        try {
          await this.courtService.savePayExecutionFee(this.taskId, {
            amount: this.executionFeeData?.amount,
            // @ts-ignore: swagger
            companyCode: this.executionFeeData?.companyCode,
            courtFee: undefined,
            deliveryFeeForPleadings: this.executionFeeData?.deliveryFeeForPleadings,
            documentPreparationFee: undefined,
            headerFlag: 'SUBMIT',
            paymentImageId: this.executionFeeData?.documentDto?.imageId,
            personIds: (this.defendantsControl.value as Array<DefendantDto>).map(d => d.personId || ''),
            // @ts-ignore: swagger
            ref1: this.executionFeeData?.ref1,
          });
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('COURT.DECREE.SUCCESS_DIALOG_EXECUTION_FEE', {
              LG_ID: this.decree.litigationId,
            })
          );
          this.submitted = true;
          return true;
        } catch (e) {
          this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
          return false;
        }
      }
    }
  }

  get returnData() {
    return {
      submitted: this.submitted,
    };
  }
}
