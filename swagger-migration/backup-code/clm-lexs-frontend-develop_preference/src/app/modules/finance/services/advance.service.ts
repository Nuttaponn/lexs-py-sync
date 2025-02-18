import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { AdvanceSearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { BlobType, FileType } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { Utils } from '@app/shared/utils/util';
import {
  AdvancePayTransferResponse,
  CancelAdvanceReceiveOrderRequest,
  CreateAdvanceReceivePayTransferInfo,
  CreateAdvanceReceivePayTransferRequest,
  NameValuePair,
  ReceiveControllerService,
  TransferOrderRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdvanceService {
  private _advance!: AdvancePayTransferResponse;

  public get advance(): AdvancePayTransferResponse {
    return this._advance;
  }
  public set advance(value: AdvancePayTransferResponse) {
    this._advance = value;
  }

  private _hasEdit: boolean = false;

  public get hasEdit(): boolean {
    return this._hasEdit;
  }
  public set hasEdit(value: boolean) {
    this._hasEdit = value;
  }

  private _objectId!: string;

  public get objectId(): string {
    return this._objectId;
  }
  public set objectId(value: string) {
    this._objectId = value;
  }

  constructor(
    private errorHandlingService: ErrorHandlingService,
    private logger: LoggerService,
    private receiveController: ReceiveControllerService,
    private fb: UntypedFormBuilder,
    private translate: TranslateService
  ) {}

  async inquiryAdvance(request: AdvanceSearchConditionRequest) {
    this.logger.logAPIRequest('inquiryAdvance ~ request :: ', request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.receiveController.inquiryAdvancePayment(
          request.advnancePaymentNo !== 'N/A' ? request.advnancePaymentNo : '',
          request.advancePaymentStatus !== 'N/A' ? request.advancePaymentStatus : '',
          request.page || 0,
          request.searchString || '',
          request.size || 10,
          request.sortBy || ['advancePaymentNo'],
          request.sortOrder || 'DESC',
          request.tab || 'USER',
          request.user || ''
        )
      )
    );
  }

  async inquiryAdvanceDownload(request: AdvanceSearchConditionRequest, filename: string) {
    this.logger.logAPIRequest('inquiryAdvance ~ request :: ', request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.receiveController.inquiryAdvancePaymentDownload(
          request.advnancePaymentNo !== 'N/A' ? request.advnancePaymentNo : '',
          request.advancePaymentStatus !== 'N/A' ? request.advancePaymentStatus : '',
          request.page || 0,
          request.searchString || '',
          request.size || 10,
          request.sortBy || ['advancePaymentNo'],
          request.sortOrder || 'DESC',
          request.tab || 'USER',
          request.user || ''
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'งานทั้งหมด' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  private _advancePaymentNoOptions: NameValuePair[] = [];
  public get advancePaymentNoOptions(): NameValuePair[] {
    return this._advancePaymentNoOptions;
  }
  public set advancePaymentNoOptions(value: NameValuePair[]) {
    this._advancePaymentNoOptions =
      value.findIndex(i => i.value === 'N/A') === -1
        ? (
            [
              { name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_ADVANCE_PAYMENT_NO'), value: 'N/A' },
            ] as NameValuePair[]
          ).concat(value)
        : value;
  }
  async getAdvancePaymentNoList(tab: string = 'ORG') {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveController.getAdvancePaymentList(tab))
    );
  }

  async advanceReceiveInfoDetail(request: TransferOrderRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveController.advanceReceiveInfoDetail(request))
    );
  }

  generateAdvanceForm(advance?: AdvancePayTransferResponse) {
    return this.fb.group({
      advanceReceiveNo: [{ value: advance?.advanceReceiveNo || '', disabled: false }],
      advanceReceivePaymentStatusCode: [{ value: advance?.advanceReceivePaymentStatusCode || '', disabled: false }],
      advanceReceivePaymentStatusDesc: [{ value: advance?.advanceReceivePaymentStatusDesc || '', disabled: false }],
      createAdvancePayTransferInfo: [
        { value: this.getAdvanceReceivePaymentNo(advance?.createAdvancePayTransferInfo), disabled: false },
      ],
      reason: [{ value: advance?.reason || '', disabled: false }],
    });
  }

  getAdvanceReceivePaymentNo(_data?: CreateAdvanceReceivePayTransferInfo[]) {
    if (_data && _data.length > 0) {
      return this.fb.array(_data);
    } else {
      return this.fb.array([]);
    }
  }

  async createAdvanceReceive(taskId: number, request: CreateAdvanceReceivePayTransferRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveController.createAdvanceReceive(request, taskId))
    );
  }

  async cancelAdvanceReceiveOrder(request: CancelAdvanceReceiveOrderRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveController.cancelAdvanceReceiveOrder(request))
    );
  }

  async getAdvanceReceiveOrder(advanceReceiveNo: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveController.getAdvanceReceiveOrder(advanceReceiveNo))
    );
  }

  clearData() {
    this.hasEdit = false;
    this._advance = {};
  }
}
