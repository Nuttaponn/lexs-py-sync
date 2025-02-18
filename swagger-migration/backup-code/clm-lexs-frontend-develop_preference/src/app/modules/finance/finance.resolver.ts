import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '@app/modules/user/user.service';
import {
  AdvancePaymentSearchOption,
  ExpenseSearchOption,
  ReceiptSearchOption,
  SummaryRiemburstmentSearchOption,
} from '@app/shared/components/search-controller/search-controller.model';
import { SearchControllerService } from '@app/shared/components/search-controller/search-controller.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NameValuePair } from '@lexs/lexs-client';
import { first } from 'rxjs';
import { AdvanceService } from './services/advance.service';
import { ExpenseService } from './services/expense.service';
import { ReceiptService } from './services/receipt.service';

@Injectable({
  providedIn: 'root',
})
export class FinanceResolver {
  public receiptTabIndex = 0;

  constructor(
    private userService: UserService,
    private searchControllerService: SearchControllerService,
    private expenseService: ExpenseService,
    private masterDataService: MasterDataService,
    private receiptService: ReceiptService,
    private advanceService: AdvanceService,
    private logger: LoggerService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('FinanceResolver');
    const financeMode = route.data['financeMode'];
    if (financeMode === 'EXPENSE') {
      await this.initSearchMasterData(financeMode);
      this.searchControllerService.initFinanceExpenseList();
    } else if (financeMode === 'RECEIPT') {
      await this.initSearchMasterData(financeMode);
      this.searchControllerService.initFinanceReceiptList();
    } else if (financeMode === 'ADVANCE') {
      await this.initSearchMasterData(financeMode);
      this.searchControllerService.initFinanceAdvancePaymentList();
    } else if (financeMode === 'REIMBURSEMENT') {
      await this.initSearchMasterData(financeMode);
      this.searchControllerService.initSummaryRiembursementList();
    } else {
      this.logger.logResolverEnd('FinanceResolver');
      return true;
    }
    this.logger.logResolverEnd('FinanceResolver');
    return true;
  }

  async initSearchMasterData(financeMode: string) {
    if (financeMode === 'EXPENSE') {
      const resopone = await Promise.all([
        this.expenseService.getExpenseNoList(),
        this.masterDataService.expenseStatus(),
        this.userService.inquiryUserOptions(),
      ]);
      const result: ExpenseSearchOption = {
        expenseNoOptions: resopone[0],
        expenseStatusOptions: resopone[1],
        userOptions: resopone[2],
      };
      this.masterDataService.expenseOptions = { ...result };
    } else if (financeMode === 'RECEIPT') {
      this.receiptService.receiptLandingTab.pipe(first()).subscribe(value => {
        if (value !== 0) {
          this.receiptTabIndex = value;
        } else {
          this.receiptTabIndex = 0;
        }
      });

      let receiptOptionParam = this.receiptService.getReceiptOptionTab(this.receiptTabIndex);
      const resopone = await Promise.all([
        this.receiptService.getReceiveNoList(receiptOptionParam),
        this.masterDataService.receiveStatus(),
        this.masterDataService.receiveType(),
        this.receiptService.getWashAccountList(),
        this.masterDataService.kcorpTransferStatus(),
      ]);
      const result: ReceiptSearchOption = {
        receiveStatusOptions: resopone[1],
        receiveTypeOptions: resopone[2],
        washAccountOptions: resopone[3],
        transferStatusOptions: resopone[4],
      };
      this.receiptService.receiptNoOptions =
        resopone[0].receiveNo?.map(item => {
          return { name: item, value: item } as NameValuePair;
        }) || [];
      this.masterDataService.receiptOptions = { ...result };
    } else if (financeMode === 'ADVANCE') {
      const response = await Promise.all([
        this.advanceService.getAdvancePaymentNoList('ORG'),
        this.masterDataService.advancePaymentStatus(),
        this.userService.inquiryUserOptions(),
      ]);
      this.advanceService.advancePaymentNoOptions =
        response[0].advancePaymentNo?.map(item => {
          return { name: item, value: item } as NameValuePair;
        }) || [];
      const result: AdvancePaymentSearchOption = {
        advancePaymentStatusOptions: response[1],
        userOptions: response[2],
      };
      this.masterDataService.advancePaymentOptions = { ...result };
    } else if (financeMode === 'REIMBURSEMENT') {
      const response = await Promise.all([
        this.masterDataService.financialObjectType(),
        this.masterDataService.financialAccountType(''),
        this.masterDataService.expenseStepType(),
        this.masterDataService.financialAccountCode(),
        this.masterDataService.financialAccountType('EXPENSE'),
      ]);
      const result: SummaryRiemburstmentSearchOption = {
        financialObjectTypeDto: response[0],
        financialAccountTypeDto: response[1],
        expenseStepTypes: response[2],
        financialAccountCodeDto: response[3],
        financialAccountTypeExpenseDto: response[4],
      };
      this.logger.logResolverProcess('SummaryRiemburstmentSearchOption', result);
      this.masterDataService.summaryRiemburstmentSearchOption = { ...result };
    }
  }
}
