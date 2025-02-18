import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { statusCode, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { ReceiptService } from '../services/receipt.service';

@Injectable({
  providedIn: 'root',
})
export class ReceiptResolver {
  private receiveNo: string = '';
  private taskCode!: taskCode;

  private receiptStatus!: string;
  private receiveType!: string;
  constructor(
    private logger: LoggerService,
    private receiptService: ReceiptService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('ReceiptResolver');
    this.logger.logResolverProcess('ReceiptResolver :: ', this.taskCode);
    const _kcorpView = route.queryParams['kcorpView'];
    this.taskCode = route.queryParams['taskCode'] as taskCode;
    this.receiptStatus = route.queryParams['receiptStatus'];
    this.receiveType = route.queryParams['receiveType'];
    this.receiptService.taskId = route.queryParams['taskId'];
    this.receiptService.currentAssigneeId = route.queryParams['currentAssigneeId'];
    this.receiptService.taskCode = this.taskCode;
    this.receiptService.statusCode = route.queryParams['statusCode'] as statusCode;

    if (!_kcorpView) {
      if (this.taskCode === 'RECEIVE_NORMAL_PAYMENT') {
        // NOT K-CORP
        this.receiveNo = route.queryParams['receiveNo'];
        this.receiptService.receiveType = this.receiveType;
        await this.receiptService.setReceiveOrder(this.receiveNo);
      } else {
        if (this.taskCode === 'RECEIVE_COURT_PAYMENT') {
          // K-CORP
          const _receiveNo = route.queryParams['receiveNo'];
          const res = await this.receiptService.getCourtReceiveOrder(_receiveNo);
          this.receiptService.receiveOrdersKcorp = res;
          this.receiptService.receiveStatus = res.receiveStatus;
          this.receiptService.receiveType = this.receiveType;
          if (res.outboundTransferTransaction && res.outboundTransferTransaction.length === 0) {
            this.receiptService.receiveOrdersKcorp.outboundTransferTransaction = [];
          }
        } else if (this.taskCode === 'RECEIVE_CREDIT_NOTE_PAYMENT') {
          if (this.receiveType === 'SUSPENSE_COURT' || this.receiveType === 'AUTO_CLEARING') {
            // K-CORP
            this.receiptService.receiveType = this.receiveType;
            const _receiveNo = route.queryParams['receiveNo'];
            const res = await this.receiptService.getCourtReceiveOrder(_receiveNo);
            this.receiptService.receiveOrdersKcorp = res;
            this.receiptService.receiveStatus = res.receiveStatus;
            if (res.outboundTransferTransaction && res.outboundTransferTransaction.length === 0) {
              this.receiptService.receiveOrdersKcorp.outboundTransferTransaction = [];
            }
          } else {
            // NOT K-CORP
            this.receiptService.receiveType = this.receiveType;
            this.receiveNo = route.queryParams['receiveNo'];
            await this.receiptService.setReceiveOrder(this.receiveNo);
          }
        } else if (!this.taskCode) {
          if (this.receiveType === 'SUSPENSE_COURT' || this.receiveType === 'AUTO_CLEARING') {
            // K-CORP
            this.receiptService.receiveType = this.receiveType;
            const _receiveNo = route.queryParams['receiveNo'];
            const res = await this.receiptService.getCourtReceiveOrder(_receiveNo);
            this.receiptService.receiveOrdersKcorp = res;
            this.receiptService.receiveStatus = res.receiveStatus;
            if (res.outboundTransferTransaction && res.outboundTransferTransaction.length === 0) {
              this.receiptService.receiveOrdersKcorp.outboundTransferTransaction = [];
            }
          } else {
            // NOT K-CORP
            this.receiptService.receiveType = this.receiveType;
            this.receiveNo = route.queryParams['receiveNo'];
            if (route.queryParams['mode'] === 'ADD') {
              this.receiptService.receiveOrders = {};
            } else if (route.queryParams['mode'] === 'VIEW') {
              await this.receiptService.setReceiveOrder(this.receiveNo);
            }
          }
        }

        if (this.receiptStatus && this.receiptStatus === 'COMPLETED_SYSTEM') {
          const _receiveNo = route.queryParams['receiveNo'];
          const res = await this.receiptService.getCourtReceiveOrder(_receiveNo);
          this.receiptService.receiveOrdersKcorp = res;
          this.receiptService.receiveStatus = res.receiveStatus;
          this.receiptService.receiveType = this.receiveType;
          if (res.outboundTransferTransaction && res.outboundTransferTransaction.length === 0) {
            this.receiptService.receiveOrdersKcorp.outboundTransferTransaction = [];
          }
        }
      }
    } else {
      // For KCORP
      this.receiptService.receiveType = this.receiveType;
      if (_kcorpView === 'KCORP_DETAIL') {
        const _washAccountNo = route.queryParams['washAccountNo'];
        const _createdDate = route.queryParams['createdDate'];
        const res = await this.receiptService.getRefundInfo(_createdDate || '', _washAccountNo || '');
        this.receiptService.receiveDetailKcorp = res;
      } else if (_kcorpView === 'REFERENCE_NO_DETAIL') {
        const _receiveNo = route.queryParams['receiveNo'];
        const _referenceNo = route.queryParams['referenceNo'];
        const res = await this.receiptService.getRefundInfoDetails(_receiveNo, _referenceNo);
        this.receiptService.referenceNoDetail = res;
      } else if (_kcorpView === 'REFUND_INFO') {
        const _receiveNo = route.queryParams['receiveNo'];
        const res = await this.receiptService.getCourtReceiveOrder(_receiveNo);
        this.receiptService.receiveOrdersKcorp = res;
        this.receiptService.receiveStatus = res.receiveStatus;
        this.receiptService.receiveType = res.receiveType;
        if (res.outboundTransferTransaction && res.outboundTransferTransaction.length === 0) {
          this.receiptService.receiveOrdersKcorp.outboundTransferTransaction = [];
        }
      } else if (_kcorpView === 'REFUND_ADD') {
        this.receiptService.receiveOrdersKcorp = {
          transferOrders: [],
          outboundTransferTransaction: [],
        };
      }
    }
    this.logger.logResolverEnd('ReceiptResolver');
    return true;
  }
}
