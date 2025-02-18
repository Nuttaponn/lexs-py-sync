import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LitigationCaseGroupDto, PayCourtFeeDto, PayCourtFeeResponse } from '@lexs/lexs-client';

import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { SuitService } from '../suit.service';

@Component({
  selector: 'app-suit-dialog-upload',
  templateUrl: './suit-dialog-upload.component.html',
  styleUrls: ['./suit-dialog-upload.component.scss'],
})
export class SuitDialogUploadComponent implements OnInit {
  payCourtForm: UntypedFormGroup;
  isSubmited = false;
  isRequired = true;
  labelAcceptFile = `${this.translate.instant('LAWSUIT.SUIT.TITLE_UPLOAD_CF_PAYMENT_RECEIP')} *`;
  ctx: LitigationCaseGroupDto | null = null;
  uploadInfo = { taskId: '', cif: '', documentTemplateId: '' };
  title: string = '';
  PaymentRequest = {
    courtFee: '',
    deliveryFeeForPleadings: '',
    documentPreparationFee: '',
  };
  isUploadError = false;
  ErrMessage: string = this.translate.instant('LAWSUIT.SUIT.ERROR_MSG_DIALOG');
  wanringMessage = this.translate.instant('LAWSUIT.SUIT.WARNING_MSG_DIALOG');
  payFormDataResponse: any = {
    ...this.PaymentRequest,
    amount: 0,
    companyCode: '',
    paymentImageId: '',
    ref1: '',
    fileName: '',
  };
  dataSubmitResponse!: PayCourtFeeResponse;
  financialId!: number;
  initailizeData!: PayCourtFeeDto;
  isUploaded = false;
  isDisabledBtnUpload = false;

  constructor(
    private fb: UntypedFormBuilder,
    private translate: TranslateService,
    private suitService: SuitService,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService
  ) {
    this.payCourtForm = this.fb.group({
      courtFee: [null, [Validators.required]],
      deliveryFeeForPleadings: [null, [Validators.required]],
      documentPreparationFee: [null, [Validators.required]],
    });
    console.log(this.payCourtForm);
  }

  ngOnInit(): void {
    this.title = 'LAWSUIT.SUIT.LABEL_UPLOAD_PAYMENT_RECEIPT';
  }

  async dataContext(dataCtx: any) {
    this.ctx = dataCtx;
    this.uploadInfo.taskId = dataCtx?.taskId;
    this.financialId = Number(dataCtx?.financialId);
    console.log('context ', this.ctx, this.financialId);

    if (this.financialId) {
      const initData: PayCourtFeeDto = await this.suitService.getPayCourtFee(this.financialId);
      console.log({ initData });

      if (initData?.paymentImageId) {
        this.initailizeData = initData;
        this.payFormDataResponse = {
          amount: Number(initData?.totalAmount),
          companyCode: initData?.companyCode as string,
          paymentImageId: initData?.paymentImageId,
          ref1: initData?.ref1 as string,
          fileName: initData?.paymentImageName as string,
          courtFee: initData?.courtFee?.toString(),
          deliveryFeeForPleadings: initData?.deliveryFeeForPleadings?.toString(),
          documentPreparationFee: initData?.documentPreparationFee?.toString(),
        };
        this.isUploaded = true;
        this.isRequired = false;
        this.isSubmited = true;
        this.isDisabledBtnUpload = true;
        this.wanringMessage = this.translate.instant('LAWSUIT.SUIT.WARNING_MSG_DATA_CONTEXT');
      }
    }
  }

  onUploadError(errors: any) {
    if (errors?.length > 0) {
      console.log('onUploadError >> ', errors[0]);

      if (errors[0]?.code == 'F001') {
        this.isUploadError = true;
        this.ErrMessage = this.translate.instant('LAWSUIT.SUIT.ERROR_MSG_DIALOG') ?? '';
      }
    }

    console.log({ isUploadError: this.isUploadError, errMessage: this.ErrMessage });
  }
  onUploadSuccess(event: any): void {
    console.log(event);
    if (event !== null) {
      this.payFormDataResponse = event;
      this.isUploadError = false;
      this.title = 'LAWSUIT.SUIT.TITLE_PAYMENT_NOTICE';
    }
  }
  get isValidPayment(): boolean {
    const { courtFee = 0, deliveryFeeForPleadings = 0, documentPreparationFee = 0 } = this.payCourtForm.value;
    const { amount = 0 } = this.payFormDataResponse;
    return Number(amount) === Number(courtFee) + Number(deliveryFeeForPleadings) + Number(documentPreparationFee);
  }

  get mapRequestPayment() {
    const newReq = !this.initailizeData?.paymentImageId
      ? { ...this.payFormDataResponse, ...this.payCourtForm.value }
      : { ...this.payFormDataResponse };
    return newReq;
  }

  async onClose(): Promise<boolean> {
    // if (!this.payFormDataResponse?.paymentImageId) {
    //   this.payCourtForm.markAllAsTouched()
    //   if (this.payCourtForm.invalid || !this.isValidPayment) return false
    // }

    // if(this.payFormDataResponse?.paymentImageId){
    //   this.payCourtForm.markAllAsTouched()
    //   if (this.payCourtForm.invalid || !this.isValidPayment) return false
    // }

    if (!this.payCourtForm.disabled && !this.initailizeData?.paymentImageId) {
      this.payCourtForm.markAllAsTouched();
      if (this.payCourtForm.invalid || !this.isValidPayment) {
        this.notificationService.openSnackbarError(this.errorHandlingService.getMessageMapByKey('F014')?.message ?? ''); // payment invalid
        return false;
      }
    }
    return await this.postPayment();
  }
  async postPayment(): Promise<boolean> {
    try {
      const response: PayCourtFeeResponse = await this.suitService.postPaymentForm(
        Number(this.uploadInfo.taskId),
        this.mapRequestPayment
      );
      this.dataSubmitResponse = response;
      this.isUploadError = false;
    } catch (e: any) {
      const errors = e?.error?.errors as any[];

      if (errors[0]?.code === 'F014') {
        this.notificationService.openSnackbarError(
          this.errorHandlingService.getMessageMapByKey(errors[0]?.code)?.message ?? ''
        );
        return false;
      }

      // Bisiness Logic for close modal
      if (this.suitService.checkErrorCodeList(errors[0]?.code)) {
        this.dataSubmitResponse = {
          responseCode: errors[0]?.code,
          responseMessage: errors[0]?.message,
          taskId: null,
        } as any;
        return true;
      }
      // Handle Error

      this.dataSubmitResponse = {};

      // if (errors[0]?.code === 'F012') {
      //   this.isUploadError = true
      //   this.ErrMessage = this.suitService.getErrorMessageByCode(e?.error?.errors[0]?.code) ?? ''
      // }

      return false;
    }
    return true;
  }
  get returnData() {
    console.log('SuitDialogUploadComponent -> old taskId ::', this.uploadInfo.taskId);
    console.log('SuitDialogUploadComponent -> new taskId ::', this.dataSubmitResponse.taskId);
    const dataReturn = { ...this.dataSubmitResponse };
    return dataReturn;
  }
}
