import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '@app/shared/services/router.service';
import { Utils } from '@app/shared/utils/util';
import {
  FinancialCustomerRequest,
  FinancialLitigationSummaryDto,
  FinancialMemoTransaction,
  FinancialTransactionRequest,
  NameValuePair,
} from '@lexs/lexs-client';
import {
  SummaryReimburseType1SearchConditionRequest,
  SummaryReimburseType2SearchConditionRequest,
} from '../search-controller/search-controller.model';
import { SummaryReimbursementTableComponent } from './summary-reimbursement-table/summary-reimbursement-table.component';
import {
  IFinancialCreditNote,
  IFinancialCreditNoteResponse,
  IFinancialCustomerSummaryDto,
  IFinancialLitigationSummaryDto,
  IFinancialSummaryTransactionDto,
} from './summary-reimbursement.model';
import { SummaryReimbursementService } from './summary-reimbursement.service';

@Component({
  selector: 'app-summary-reimbursement',
  templateUrl: './summary-reimbursement.component.html',
  styleUrls: ['./summary-reimbursement.component.scss'],
})
export class SummaryReimbursementComponent implements OnInit {
  @ViewChild('summaryReimbursementTableComponentTab0')
  summaryReimbursementTableComponentTab0!: SummaryReimbursementTableComponent;
  @ViewChild('summaryReimbursementTableComponentTab1_0')
  summaryReimbursementTableComponentTab1_0!: SummaryReimbursementTableComponent;

  @Input() litigationId!: string;
  private customerId!: string;
  public isShowActionBar = false;
  public debtSaleStatus: string = '';

  public myLgSearch: SummaryReimburseType1SearchConditionRequest = {};
  public myCustSearch: SummaryReimburseType1SearchConditionRequest = {};
  public myCust2Search: SummaryReimburseType2SearchConditionRequest = {};

  public financialLitigationSummaryData!: IFinancialLitigationSummaryDto | undefined;
  public financialCustomerSummaryTranData!: IFinancialCustomerSummaryDto | undefined;
  public financialCustomerSummaryData!: IFinancialCustomerSummaryDto | undefined;
  public financialCreditNoteResponse!: IFinancialCreditNoteResponse | undefined;

  public lgIdOptions: NameValuePair[] = [];

  public tabIndex = 0;
  public subTabIndex = 0;

  constructor(
    private summaryReimbursementService: SummaryReimbursementService,
    private route: ActivatedRoute,
    private routerService: RouterService
  ) {
    this.route.queryParams.subscribe(value => {
      if (value['litigationId']) {
        this.litigationId = value['litigationId'];
      }
      if (value['isShowActionBar']) {
        this.isShowActionBar = !!value['isShowActionBar'];
      }

      if (value['debtSaleStatus']) {
        this.debtSaleStatus = value['debtSaleStatus'];
      }
    });
  }

  async ngOnInit() {
    await this.getData(this.tabIndex);
    this.customerId = this.financialLitigationSummaryData?.customerId ?? '';
  }

  async onSearchResult(
    event: SummaryReimburseType1SearchConditionRequest | SummaryReimburseType2SearchConditionRequest,
    tabIndex: number
  ) {
    console.log('onSearchResult ::', event);
    switch (tabIndex) {
      case 0:
        this.myLgSearch = { ...event };
        break;
      case 1:
        this.myCustSearch = { ...event };
        break;
      case 2:
        this.myCust2Search = { ...event };
        break;
    }
    await this.getData(this.tabIndex, this.tabIndex === 1 ? this.subTabIndex : undefined);
  }

  async onTabChanged() {
    await this.getData(this.tabIndex, this.tabIndex === 1 ? this.subTabIndex : undefined);
  }

  async onSubTabChanged() {
    await this.getData(this.tabIndex, this.subTabIndex);
  }

  async getMemoByfinancialSummaryTransactionList(
    list: IFinancialSummaryTransactionDto[]
  ): Promise<FinancialMemoTransaction[]> {
    // map transactionIds -> get datas
    let transactionIds = (list || []).map(dto => dto.transactionId || -1);
    try {
      let result = await this.summaryReimbursementService.getMemoTransactionSummary(transactionIds);
      let memoTransactionList: FinancialMemoTransaction[] = [];
      if (result) {
        memoTransactionList = result.memoTransactionList || [];
      }
      return memoTransactionList;
    } catch (error) {
      console.log('getMemoByfinancialSummaryTransactionList error ::', error);
      return [];
    }
  }

  getNewFinancialLitigationSummaryDataSeqAndMemo(
    dto: IFinancialLitigationSummaryDto,
    memoTransactionList: FinancialMemoTransaction[]
  ) {
    // set seq all table
    if (dto && dto.litigationTransactionDashboard) {
      dto.litigationTransactionDashboard.financialSummaryTransactionList = (
        dto?.litigationTransactionDashboard?.financialSummaryTransactionList || []
      ).map((data, index) => {
        return {
          ...data,
          seq: index + 1,
          financialMemoTransaction:
            memoTransactionList.find(dto => dto.transactionId === data.transactionId) || undefined,
        };
      });
    }

    // set seq each table
    if (dto && dto.financialLitigationSummaryDetailList) {
      for (let index in dto.financialLitigationSummaryDetailList) {
        let list =
          dto.financialLitigationSummaryDetailList[Number(index)].litigationCaseTransactionDashboard
            ?.financialSummaryTransactionList;
        if (!list || !dto.financialLitigationSummaryDetailList[Number(index)].litigationCaseTransactionDashboard)
          continue;
        dto.financialLitigationSummaryDetailList[Number(index)].litigationCaseTransactionDashboard = {
          ...dto.financialLitigationSummaryDetailList[Number(index)].litigationCaseTransactionDashboard,
          financialSummaryTransactionList: list.map((data, index) => {
            return {
              ...data,
              seq: index + 1,
              financialMemoTransaction:
                memoTransactionList.find(dto => dto.transactionId === data.transactionId) || undefined,
            };
          }),
        };
      }
    }
    return dto;
  }

  getNewFinancialCustomerSummaryDataSeqAndMemo(
    dto: IFinancialCustomerSummaryDto,
    memoTransactionList: FinancialMemoTransaction[]
  ) {
    // set seq all table
    if (dto && dto.customerTransactionDashboard) {
      dto.customerTransactionDashboard.financialSummaryTransactionList = (
        dto?.customerTransactionDashboard?.financialSummaryTransactionList || []
      ).map((data, index) => {
        return {
          ...data,
          seq: index + 1,
          financialMemoTransaction:
            memoTransactionList.find(dto => dto.transactionId === data.transactionId) || undefined,
        };
      });
    }

    // set seq each table
    if (dto && dto.financialCustomerSummaryDetailList) {
      for (let index in dto.financialCustomerSummaryDetailList) {
        let list =
          dto.financialCustomerSummaryDetailList[Number(index)].litigationTransactionDashboard
            ?.financialSummaryTransactionList;
        if (!list || !dto.financialCustomerSummaryDetailList[Number(index)].litigationTransactionDashboard) continue;
        dto.financialCustomerSummaryDetailList[Number(index)].litigationTransactionDashboard = {
          ...dto.financialCustomerSummaryDetailList[Number(index)].litigationTransactionDashboard,
          financialSummaryTransactionList: list.map((data, index) => {
            return {
              ...data,
              seq: index + 1,
              financialMemoTransaction:
                memoTransactionList.find(dto => dto.transactionId === data.transactionId) || undefined,
            };
          }),
        };
      }
    }
    return dto;
  }

  getNewFinancialCreditNoteList(list: IFinancialCreditNote[]) {
    list = (list || []).map((data, index) => {
      return { ...data, seq: index + 1 };
    });
    return list;
  }

  getFinancialTransactionRequest(searchReq: SummaryReimburseType1SearchConditionRequest): FinancialTransactionRequest {
    const filteredFinancialAccountType = (searchReq.financialAccountType ?? [])
      .filter(dto => dto !== 'selectall')
      .map(dto => (typeof dto === 'string' ? dto : dto.value || ''));
    return {
      accountCode: searchReq.financialAccountCode !== 'N/A' ? searchReq.financialAccountCode : '',
      caseType: searchReq.caseType !== 'N/A' ? searchReq.caseType : '',
      endDate: searchReq.endDate,
      financialObjectType: searchReq.financialObjectType !== 'N/A' ? searchReq.financialObjectType : '',
      financialType:
        typeof searchReq.financialAccountType === 'string'
          ? [searchReq.financialAccountType]
          : filteredFinancialAccountType,
      maximumAmount: searchReq.maxAmount
        ? Utils.convertStringToNumber(searchReq.maxAmount.toString())
        : searchReq.maxAmount,
      minimumAmount: searchReq.minAmount
        ? Utils.convertStringToNumber(searchReq.minAmount.toString())
        : searchReq.minAmount,
      startDate: searchReq.startDate,
    };
  }

  back() {
    this.routerService.back();
  }

  private clearData(tabIndex: number) {
    // clear data เพราะ ค่าจะไม่อัพเดท บน html ถ้าไม่ clear ก่อน
    if (tabIndex === 0) this.financialLitigationSummaryData = undefined;
    this.financialCustomerSummaryTranData = undefined;
    this.financialCustomerSummaryData = undefined;
    this.financialCreditNoteResponse = undefined;
  }

  async getData(tabIndex: number, subTabIndex?: number) {
    this.clearData(tabIndex);

    switch (tabIndex) {
      case 0:
        const request = this.getFinancialTransactionRequest({ ...this.myLgSearch });
        try {
          let tempFinancialLitigationSummaryData;
          let tempFinancialCreditNoteResponse;
          tempFinancialLitigationSummaryData =
            await this.summaryReimbursementService.getFinancialLitigationTransactionSummary(this.litigationId, request);
          let memoTransactionList: FinancialMemoTransaction[] = [];
          if (
            (tempFinancialLitigationSummaryData?.litigationTransactionDashboard?.financialSummaryTransactionList
              ?.length || 0) > 0
          ) {
            memoTransactionList = await this.getMemoByfinancialSummaryTransactionList(
              tempFinancialLitigationSummaryData?.litigationTransactionDashboard?.financialSummaryTransactionList || []
            );
          }
          this.financialLitigationSummaryData = this.getNewFinancialLitigationSummaryDataSeqAndMemo(
            { ...tempFinancialLitigationSummaryData },
            [...memoTransactionList]
          );

          // credit-note part
          tempFinancialCreditNoteResponse = await this.summaryReimbursementService.getCreditNoteSummary(
            undefined,
            this.litigationId
          );
          tempFinancialCreditNoteResponse.financialCreditNoteList = this.getNewFinancialCreditNoteList([
            ...(tempFinancialCreditNoteResponse.financialCreditNoteList || []),
          ]);
          this.financialCreditNoteResponse = tempFinancialCreditNoteResponse;

          this.summaryReimbursementTableComponentTab0?.onHandleNgOnInit();
        } catch (error) {}
        break;
      case 1:
        switch (subTabIndex) {
          case 0:
            const request = this.getFinancialTransactionRequest({ ...this.myCustSearch });
            try {
              let tempFinancialCustomerSummaryTranData =
                await this.summaryReimbursementService.getFinancialCustomerTransactionSummary(this.customerId, request);
              let memoTransactionList: FinancialMemoTransaction[] = [];
              if (
                (
                  tempFinancialCustomerSummaryTranData?.customerTransactionDashboard?.financialSummaryTransactionList ||
                  []
                ).length > 0
              ) {
                memoTransactionList = await this.getMemoByfinancialSummaryTransactionList(
                  tempFinancialCustomerSummaryTranData?.customerTransactionDashboard?.financialSummaryTransactionList ||
                    []
                );
              }
              this.financialCustomerSummaryTranData = this.getNewFinancialCustomerSummaryDataSeqAndMemo(
                { ...tempFinancialCustomerSummaryTranData },
                [...memoTransactionList]
              );

              let tempFinancialCreditNoteResponse = await this.summaryReimbursementService.getCreditNoteSummary(
                this.customerId,
                undefined
              );
              tempFinancialCreditNoteResponse.financialCreditNoteList = this.getNewFinancialCreditNoteList([
                ...(tempFinancialCreditNoteResponse.financialCreditNoteList || []),
              ]);
              this.financialCreditNoteResponse = tempFinancialCreditNoteResponse;

              this.summaryReimbursementTableComponentTab1_0?.onHandleNgOnInit();
            } catch (error) {}
            break;
          case 1:
            try {
              const filterFinancialAccountTypeExpense = (this.myCust2Search.financialAccountTypeExpense ?? [])
                .filter(dto => dto !== 'selectall')
                .map(dto => (typeof dto === 'string' ? dto : dto.value || ''));
              const request: FinancialCustomerRequest = {
                accountCode:
                  this.myCust2Search.financialAccountCode !== 'N/A' ? this.myCust2Search.financialAccountCode : '',
                financialType:
                  typeof this.myCust2Search.financialAccountTypeExpense === 'string'
                    ? [this.myCust2Search.financialAccountTypeExpense]
                    : filterFinancialAccountTypeExpense,
                litigationId: this.myCust2Search.lgId !== 'N/A' ? this.myCust2Search.lgId : '',
              };
              let tempFinancialCustomerSummaryData = await this.summaryReimbursementService.getFinancialCustomerSummary(
                this.customerId,
                request
              );

              if (this.lgIdOptions.length === 0) {
                this.lgIdOptions = (tempFinancialCustomerSummaryData?.financialCustomerSummaryDetailList || []).map(
                  dto => {
                    return {
                      name: dto.litigationId,
                      value: dto.litigationId,
                    };
                  }
                );
              }

              this.financialCustomerSummaryData = this.getNewFinancialCustomerSummaryDataSeqAndMemo(
                { ...tempFinancialCustomerSummaryData },
                []
              );
            } catch (error) {}
            break;
        }
        break;
    }
  }
}
