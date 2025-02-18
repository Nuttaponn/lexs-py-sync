import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { LitigationCaseDto, Notification, PayCourtFeeDto } from '@lexs/lexs-client';

import { UploadFileContentConfirmationFormDto, taskCode } from '@app/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { IExtendConfirmationFormDto } from '../suit.model';
import { SuitService } from '../suit.service';
export interface PaymentErrorDto {
  courtFee: string | null;
  documentPreparationFee: string | null;
  deliveryFeeForPleadings: string | null;
  totalAmount: string | null;
}

interface UploadConfirmationDto extends PayCourtFeeDto {
  fileName?: string;
}

@Component({
  selector: 'app-suit-confirm-dialog-upload',
  templateUrl: './suit-confirm-dialog-upload.component.html',
  styleUrls: ['./suit-confirm-dialog-upload.component.scss'],
})
export class SuitConfirmDialogUploadComponent implements OnInit {
  payConfirmForm: UploadFileContentConfirmationFormDto = {};
  isSubmited = false;
  isRequired = true;
  labelAcceptFile = 'อัปโหลดใบยืนยัน (PDF, JPG, JPEG)*';
  ctx!: LitigationCaseDto; /** LitigationCaseGroupDto | LitigationCaseDto | null = null; */
  uploadInfo = { taskId: '', cif: '', documentTemplateId: '' };
  title: string = '';
  ErrMessage = '';
  isUploadError: boolean = true;
  financialId!: number;
  uploadFileData!: UploadConfirmationDto | undefined;
  paymentError!: PaymentErrorDto;
  isShowRemark = false;
  remark = new UntypedFormControl(null, [Validators.required]);
  ConfirmationForm!: UploadConfirmationDto;
  uploadBussinessErr!: string | null;
  isUploaded = false;
  initailizeData!: PayCourtFeeDto; // | ConfirmationFormDto
  /* added attrs for LEX2-3240 */
  subMessageUploadBussinessErr: string[] = [];
  isConfirmUpload = true;

  formControl = this.fb.group({}); /* for disable right-btn */

  notification!: Notification; /* Dto */

  taskCodeFromTask!: taskCode | null;
  private taskId!: number;

  isShowUploadBtn = true;
  isShowInfoMsg = false;
  uploadBussinessInfo: string = '';
  subMessageUploadBussinessInfo: string[] = [];
  isBlackTotalAmount: boolean = true;
  imageId: string = '';

  constructor(
    private translate: TranslateService,
    private suitService: SuitService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.title = 'LAWSUIT.SUIT.TITLE_UPLOAD_CF_PAYMENT_RECEIP';
    this.initValue();
  }

  initValue() {
    this.payConfirmForm = {
      appointmentDate: '',
      blackCaseNo: '',
      caseDate: '',
      confirmImageId: '',
      courtFee: 0,
      deliveryFeeForPleadings: 0,
      documentPreparationFee: 0,
      totalAmount: 0,
    };
    this.paymentError = {
      courtFee: null,
      deliveryFeeForPleadings: null,
      documentPreparationFee: null,
      totalAmount: null,
    };

    this.paymentError = {
      courtFee: '',
      deliveryFeeForPleadings: '',
      documentPreparationFee: '',
      totalAmount: '',
    };
  }

  onUploadError(errors: any) {
    this.subMessageUploadBussinessErr = [];
    this.uploadBussinessErr = null;

    console.log('errors ::', errors);
    if (errors?.length > 0) {
      console.error('onUploadError >> ', errors[0]);
      this.isUploadError = true;
      this.initValue();

      // this.uploadBussinessErr = 'startBlack70' + this.translate.instant('LAWSUIT.SUIT_CODE.' + errors[0].code) + 'endBlack70';

      // if (['F023'].includes(errors[0].code)) {
      //   let BE_RESPONSE = '';
      //   BE_RESPONSE = errors[0].description || '';
      //   // this.subMessageUploadBussinessErr = [BE_RESPONSE];
      //   this.subMessageUploadBussinessErr = [ ...BE_RESPONSE.split('|') ];
      // }
    }
  }
  onUploadSuccess(event: any): void {
    console.log('onUploadSuccess >> ', event);
    this.uploadFileData = event;
    this.isUploadError = false;
    /*
    this.validatePayment();
    */

    this.notification = {};
    this.isConfirmUpload = true;
    if (event?.notification) {
      this.uploadBussinessErr = this.getBlackStyleText(
        this.translate.instant('LAWSUIT.SUIT_CODE.' + event?.notification?.code)
      );

      this.isConfirmUpload = event?.notification?.isConfirmUpload;
      if (!!this.uploadFileData) this.imageId = this.uploadFileData.confirmImageId || '';
      if (['F002', 'F003'].includes(event?.notification?.code)) {
        let BE_RESPONSE = '';
        BE_RESPONSE = event?.notification?.message || '';
        this.subMessageUploadBussinessErr = [...BE_RESPONSE.split('|')];
      }
      if ((event?.notification?.code || '').startsWith('F')) {
        this.formControl.get('isDisableBtn')?.setValue('');
      } else {
        this.formControl.get('isDisableBtn')?.setValue('NO');
        this.notification = event?.notification as Notification;
      }

      this.payConfirmForm['courtFee'] = event.courtFee ?? 0;
      this.payConfirmForm['deliveryFeeForPleadings'] = event.deliveryFeeForPleadings ?? 0;
      this.payConfirmForm['documentPreparationFee'] = event.documentPreparationFee ?? 0;
      this.payConfirmForm['totalAmount'] = event.totalAmount ?? 0;
    }

    this.isUploaded = true;
  }

  private getBlackStyleText(ogText: string, number = 70) {
    return `startBlack${number}${ogText}endBlack${number}`;
  }

  async dataContext(dataCtx: any) {
    this.ctx = dataCtx;
    this.uploadInfo.taskId = dataCtx?.taskId;
    this.financialId = Number(dataCtx?.financialId);

    console.log('SuitConfirmDialogUploadComponent >> context ', this.ctx);

    if (this.financialId) {
      this.taskCodeFromTask = dataCtx.taskCodeFromTask;
      this.taskId = dataCtx.taskId || -1;

      const isTryConfirmCondition = this.taskCodeFromTask === 'TRY_CONFIRM_COURT_FEES_PAYMENT';
      if (isTryConfirmCondition) {
        this.uploadBussinessInfo = this.getBlackStyleText(
          this.translate.instant('LAWSUIT.SUIT.MANUAL_TRY_CONFIRM_INFO')
        );

        this.isShowInfoMsg = isTryConfirmCondition;
        this.isBlackTotalAmount = false;
      }
      this.isShowUploadBtn = !isTryConfirmCondition;
      this.initailizeData = isTryConfirmCondition
        ? await this.suitService.getConfirmPaymentManual(this.taskId)
        : await this.suitService.getPayCourtFee(this.financialId);

      this.payConfirmForm['courtFee'] = this.initailizeData?.courtFee ?? 0;
      this.payConfirmForm['deliveryFeeForPleadings'] = this.initailizeData?.deliveryFeeForPleadings ?? 0;
      this.payConfirmForm['documentPreparationFee'] = this.initailizeData?.documentPreparationFee ?? 0;
      this.payConfirmForm['totalAmount'] = this.initailizeData?.totalAmount ?? 0;

      if (this.initailizeData?.confirmImageId) {
        this.ConfirmationForm = this.initailizeData;
        this.uploadFileData = this.initailizeData;
        this.ConfirmationForm.fileName = this.initailizeData?.confirmImageName;
        this.title = 'ใบยินยัน';
        this.isUploaded = true;
        /*
        this.validatePayment()
        */
      }
    }

    if (dataCtx?.uploaded) {
      console.log(dataCtx?.uploaded);
      // /*
      this.ConfirmationForm = dataCtx?.uploaded as PayCourtFeeDto;
      this.uploadFileData = dataCtx?.uploaded as PayCourtFeeDto;
      // */
      // this.ConfirmationForm = { ...dataCtx?.uploaded } as UploadConfirmationDto
      // this.uploadFileData = { ...dataCtx?.uploaded } as UploadConfirmationDto

      /*
      this.validatePayment()
      */

      // this.payConfirmForm['fileName'] = dataCtx?.uploaded?.fileName || '';
      this.onUploadSuccess(dataCtx?.uploaded);

      // this.ConfirmationForm.fileName = this.initailizeData?.confirmImageName

      this.isUploaded = true;
    }

    this.formControl = dataCtx?.formControl || this.fb.group({ test: '' });
  }

  /*
  validatePayment() {
    console.log({ uploadFileData: this.uploadFileData, ConfirmationForm: this.ConfirmationForm, initailizeData: this.initailizeData })
    this.isShowRemark = false
    this.remark.disable()

    this.paymentError['courtFee'] = Number(this.uploadFileData?.courtFee) !== Number(this.ConfirmationForm?.courtFee || this.initailizeData?.courtFee) ? this.translate.instant('EXCEPTION_CONFIG.MESSAGE_F014') : null
    this.paymentError['documentPreparationFee'] = Number(this.uploadFileData?.documentPreparationFee) !== Number(this.ConfirmationForm?.documentPreparationFee || this.initailizeData?.documentPreparationFee) ? this.translate.instant('EXCEPTION_CONFIG.MESSAGE_F014') : null
    this.paymentError['deliveryFeeForPleadings'] = Number(this.uploadFileData?.deliveryFeeForPleadings) !== Number(this.ConfirmationForm?.deliveryFeeForPleadings || this.initailizeData?.deliveryFeeForPleadings) ? this.translate.instant('EXCEPTION_CONFIG.MESSAGE_F014') : null
    this.paymentError['totalAmount'] = Number(this.uploadFileData?.totalAmount) !== Number(this.ConfirmationForm?.totalAmount || this.initailizeData?.totalAmount) ? this.translate.instant('EXCEPTION_CONFIG.MESSAGE_F014') : null

    if (this.paymentError['courtFee'] && this.paymentError['documentPreparationFee']) {
      this.ErrMessage = `จำนวนเงินรวมในใบยืนยันการชำระเงินไม่ตรงกับใบแจ้งการชำระเงิน\n กรุณาตรวจสอบข้อมูลให้ถูกต้อง และดำเนินการอัปโหลดเอกสารใหม่`
      this.isShowRemark = true
      this.remark.enable()
      // edit mode
      if (this.ConfirmationForm?.confirmImageId && this.ConfirmationForm?.commentToAccounting && this.remark.enabled) {
        this.remark.patchValue(this.ConfirmationForm?.commentToAccounting)
      }

      this.remark.markAllAsTouched()
    }
    if (this.paymentError['totalAmount']) {
      this.ErrMessage = `กรุณาตรวจสอบใบยืนยันให้ถูกต้องและอัปโหลดใหม่ หรือระบุหมายเหตุ\n ถึงฝ่ายการเงิน และกด “ยืนยันชำระเงิน” เพื่อดำเนินการต่อ`
    }
    if (!this.paymentError['courtFee'] && !this.paymentError['documentPreparationFee'] && !this.paymentError['deliveryFeeForPleadings'] && !this.paymentError['totalAmount']) {
      this.ErrMessage = `จำนวนเงินรวมในใบยืนยันการชำระเงินไม่ตรงกับใบแจ้งการชำระเงิน\n กรุณาตรวจสอบข้อมูลให้ถูกต้อง และดำเนินการอัปโหลดเอกสารใหม่`
    }

    console.log({ remark: this.remark, isShowRemark: this.isShowRemark })
    console.log({
      totalAmount1: Number(this.uploadFileData?.totalAmount),
      totalAmount2: Number(this.ConfirmationForm?.totalAmount),
      summaryAmount: Number(this.uploadFileData?.totalAmount) === Number(this.ConfirmationForm?.totalAmount),
      totalAmountError: this.paymentError['totalAmount']
    })
  }
  */

  onClose() {
    this.isSubmited = !this.isUploaded;
    if (this.isSubmited) {
      return false;
    }
    /* TODO: remove "validatePayment" after if passed 2.1.1 FIX LEX2-21425: no need validate due to disabled confirm-btn dialog when invalid already
    this.validatePayment()

    if (this.paymentError['totalAmount']) {
      return false
    }
    if (this.isShowRemark && this.remark.invalid) {
      return false
    }
    */
    return true;
  }

  get isPaymentValid(): boolean {
    if (!this.paymentError['courtFee'] && !this.paymentError['documentPreparationFee']) {
      return true;
    } else {
      return false;
    }
  }

  get returnData() {
    const dataReturn: IExtendConfirmationFormDto = {
      ...this.uploadFileData,
      remark: this.isPaymentValid ? null : this.remark.value,
      notification: this.notification,
    };
    return dataReturn;
  }
}
