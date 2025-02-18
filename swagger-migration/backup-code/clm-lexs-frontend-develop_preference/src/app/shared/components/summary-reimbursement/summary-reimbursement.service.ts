import { Injectable } from '@angular/core';
import { AdvanceService } from '@app/modules/finance/services/advance.service';
import { ExpenseService } from '@app/modules/finance/services/expense.service';
import { ReceiptService } from '@app/modules/finance/services/receipt.service';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  AdvancePayTransferResponse,
  CourtReceiveOrderDto,
  ExpenseDetailDto,
  ExpenseTransactionDto,
  FinancialControllerService,
  FinancialCustomerRequest,
  FinancialCustomerSummaryDto,
  FinancialMemoRequest,
  FinancialSummaryTransactionDto,
  FinancialTransactionRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SummaryReimbursementService {
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private financialControllerService: FinancialControllerService,
    private expenseService: ExpenseService,
    private routerService: RouterService,
    private receiptService: ReceiptService,
    private advanceService: AdvanceService,
    private logger: LoggerService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  // API หน้ารายการเงินของ LG
  async getFinancialLitigationTransactionSummary(litigationId: string, request: FinancialTransactionRequest) {
    // this.logger.logAPIRequest('transferExpenseTask ~ request :: ', request)
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.getFinancialLitigationTransactionSummary(litigationId, request))
    );
  }

  // API หน้ารายการเงินของลูกหนี้ tab รายการ
  // getFinancialCustomerTransactionSummaryUsingGET
  async getFinancialCustomerTransactionSummary(
    customerId: string,
    request: FinancialTransactionRequest
  ): Promise<FinancialCustomerSummaryDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.getFinancialCustomerTransactionSummary(customerId, request))
    );
  }

  // API หน้ารายการเงินของลูกหนี้ tab สรุปรายลูกหนี้
  // getFinancialCustomerSummaryUsingGET
  async getFinancialCustomerSummary(
    customerId: string,
    request: FinancialCustomerRequest
  ): Promise<FinancialCustomerSummaryDto> {
    // this.logger.logAPIRequest('transferExpenseTask ~ request :: ', request)

    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.getFinancialCustomerSummary(customerId, request))
    );
  }

  // API part ของ Credit note
  // getCreditNoteSummaryUsingGET
  async getCreditNoteSummary(customerId?: string, litigationId?: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.getCreditNoteSummary(customerId, litigationId))
    );
  }

  async getMemoTransactionSummary(transactionIdList: Array<number>) {
    const req: FinancialMemoRequest = { transactionIdList: transactionIdList };
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.getFinancialMemoSummary(req))
    );
  }

  async findDataForTest(element: FinancialSummaryTransactionDto) {
    let res: ExpenseDetailDto = await this.expenseService.getExpenseDetail(element.referenceId || '-');
    if (res.whtRate == undefined) {
      res.whtRate = 0;
    }
    const isShowTaxInfo = Number(res?.whtRate) !== 0 && res?.whtRate != null;
    if (isShowTaxInfo) alert('yes');
  }

  async onHandleClickItem(element: FinancialSummaryTransactionDto, index: number) {
    // console.log('onClickItem ::', element);
    /* Summary Reimburse - LG ID - AdvancePaymentCreateByUser */
    /* Summary Reimburse - LG ID - AdvancePaymentfromEfilling */
    /* Create Reimburse - Reimburse Detail - E82 */
    /* Refund Information - WashAccount Detail - Approver */
    /* Refund Information - TransferMain - View Mode */
    switch (element.referenceObjectType) {
      case 'EXPENSE':
        if (!element.referenceId) {
          this.logger.error('NO_DATA_EXPENSE_NO', {
            referenceId: element.referenceId,
            referenceTransactionId: element.referenceTransactionId,
          });
          this.showNoDataForViewingBar('NO_DATA_EXPENSE_NO');
          return;
        }
        const res: ExpenseDetailDto = await this.expenseService.getExpenseDetail(element.referenceId || '-');
        const detail = res;
        const expenseStatusCode = detail.expenseStatusCode || '';

        const transaction: ExpenseTransactionDto = await this.expenseService.getLitigationDetail(
          element.referenceTransactionId || 0
        );

        this.expenseService.navigateToExpenseDetailViewModeView(index, transaction, expenseStatusCode, detail);
        break;
      case 'RECEIVE':
        if (!element.referenceId || !element.referenceTransactionId) {
          this.logger.warn({
            element,
            referenceId: element.referenceId,
            referenceTransactionId: element.referenceTransactionId,
          });
          this.showNoDataForViewingBar('NO_DATA_RECEIVE_NO');
          return;
        }
        const res2: CourtReceiveOrderDto = await this.receiptService.getCourtReceiveOrder(element.referenceId);

        this.routerService.navigateTo('/main/finance/receipt/detail', {
          type:
            res2.receiveType && ['SUSPENSE_COURT', 'AUTO_CLEARING'].includes(res2.receiveType) ? 'KCORP' : undefined,
          receiveNo: res2.receiveNo || '',
          receiptStatus: res2.receiveStatus,
          receiveType: res2.receiveType,
          kcorpView: res2.receiveType && res2.receiveType === 'SUSPENSE_COURT' ? 'REFUND_INFO' : undefined,
        });
        break;
      case 'ADVANCE_RECEIVE':
        if (!element.referenceId) {
          this.showNoDataForViewingBar('NO_DATA_ADVANCE_RECEIVE_NO');
          return;
        }
        const res3: AdvancePayTransferResponse = await this.advanceService.getAdvanceReceiveOrder(element.referenceId);
        // console.log('res3', res3);

        // AdvanceDetailComponent
        this.advanceService.advance = res3;
        this.routerService.navigateTo('/main/finance/advance/detail', {
          advancePaymentNo: res3.advanceReceiveNo,
          isCreate: false,
        });

        break;
      default:
        this.logger.warn(`referenceObjectType doesn't match an cases, `, {
          element,
          referenceObjectType: element.referenceObjectType,
        });
        break;
    }
  }

  showNoDataForViewingBar(noDataKey: string) {
    this.notificationService.openSnackbarError(this.translate.instant('SUMMARY_RIEMBURSEMENT.MSG_ERROR.' + noDataKey));
  }
}
