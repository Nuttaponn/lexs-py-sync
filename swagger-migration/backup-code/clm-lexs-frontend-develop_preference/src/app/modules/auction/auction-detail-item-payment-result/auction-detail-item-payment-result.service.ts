import { Injectable } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  AnnounceDocument,
  AuctionControllerService,
  CollateralGroup,
  ExternalPaymentTrackingDeedGroupRequest,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';
import { ErrorHandlingService } from '@shared/services/error-handling.service';
import { DOC_TEMPLATE } from '@app/shared/constant';

@Injectable({
  providedIn: 'root',
})
export class AuctionDetailItemPaymentResultService {
  public collateralGroupForm!: UntypedFormGroup;
  public mode = '';
  public deedGroupId!: any;
  public aucBiddingId!: any;
  public aucRef!: any;
  getCollateralGroupForm(data?: CollateralGroup) {
    if (data) {
      return this.fb.group({
        paymentTrackingResult: [data?.paymentTrackingResult || '', Validators.required],
        remark: data?.remark || '',
        extendExpiredTimestamp: data?.extendExpiredTimestamp || '',
        extendRecordTimestamp: data?.extendRecordTimestamp || '',
        paymentCompleteTimestamp: data?.paymentCompleteTimestamp || '',
        notPayReason: data?.notPayReason || '',
        externalPaymentTrackingDocuments: [
          data?.externalPaymentTrackingDocuments || [],
          [Validators.required, this.uploadedDocumentValidator()],
        ],
        extendInfos: [data?.extendInfos || []],
        extendFIle: '',
      });
    } else {
      return this.fb.group({
        paymentTrackingResult: ['', Validators.required],
        remark: '',
        extendExpiredTimestamp: '',
        extendRecordTimestamp: '',
        paymentCompleteTimestamp: '',
        notPayReason: '',
        externalPaymentTrackingDocuments: '',
        extendInfos: '',
        extendFIle: '',
      });
    }
  }
  public collateralGroup!: CollateralGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private errorHandlingService: ErrorHandlingService,
    private auctionControllerService: AuctionControllerService
  ) {}

  async postExternalPaymentTrackingDeedGroup(
    externalPaymentTrackingDeedGroupId: number,
    request: ExternalPaymentTrackingDeedGroupRequest
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionControllerService.externalPaymentTrackingDeedGroup(externalPaymentTrackingDeedGroupId, request)
      )
    );
  }

  uploadedDocumentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value as AnnounceDocument[];

      if (!!files && files.length > 0) {
        const requireDocument = files.filter(it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF142);
        const isDocumentUploaded = requireDocument.every(file => file.imageId);
        return !isDocumentUploaded ? { uploadedDocumentCompletedError: true } : null;
      }
      return null;
    };
  }
}
