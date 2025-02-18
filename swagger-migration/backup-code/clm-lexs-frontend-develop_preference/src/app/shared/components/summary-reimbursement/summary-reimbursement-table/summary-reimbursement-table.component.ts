import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FinancialSummaryTransactionDto, NameValuePair } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';
import {
  IFinancialCustomerSummaryDetailDto,
  IFinancialCustomerSummaryDto,
  IFinancialLitigationSummaryDetailDto,
  IFinancialLitigationSummaryDto,
  IFinancialTransactionSummaryDashboard,
} from '../summary-reimbursement.model';
import { SummaryReimbursementService } from '../summary-reimbursement.service';

enum DataType {
  litigation = 'litigation',
  customer = 'customer',
}

@Component({
  selector: 'app-summary-reimbursement-table',
  templateUrl: './summary-reimbursement-table.component.html',
  styleUrls: ['./summary-reimbursement-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SummaryReimbursementTableComponent implements OnInit {
  public displayedColumns: string[] = [
    'sequence',
    'item',
    'accountCode',
    'transactionDate',
    'pettyCashAccountNumber',
    'recordingAgency',
    'amount',
    'outstanding',
    'expense',
    'revenue',
    'cancelPayment',
    'adjustAmount',
    'folded',
    'reduceExempt',
    'ceaseAccordingTo',
    'followUp',
    'remark',
  ];

  @Input()
  financialLitigationSummaryData!: IFinancialLitigationSummaryDto;

  @Input()
  financialCustomerSummaryData!: IFinancialCustomerSummaryDto;

  public financialLitigationSummaryDetailList!: Array<IFinancialLitigationSummaryDetailDto>;
  public financialCustomerSummaryDetailList!: Array<IFinancialCustomerSummaryDetailDto>;

  public sumLitigationTransactionDashboard!: IFinancialTransactionSummaryDashboard;

  public showConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_EXPENSE_STATUS',
  };
  public showOptions: NameValuePair[] = [
    {
      name: this.translate.instant('SUMMARY_RIEMBURSEMENT.DROPDOWN_SHOW_OPTIONS.EACH'),
      value: 'each',
    },
    {
      name: this.translate.instant('SUMMARY_RIEMBURSEMENT.DROPDOWN_SHOW_OPTIONS.ALL'),
      value: 'all',
    },
  ];
  public showCustomerOptions: NameValuePair[] = [
    {
      name: this.translate.instant('SUMMARY_RIEMBURSEMENT.DROPDOWN_SHOW_OPTIONS.EACH_LG'),
      value: 'each',
    },
    {
      name: this.translate.instant('SUMMARY_RIEMBURSEMENT.DROPDOWN_SHOW_OPTIONS.ALL_LG'),
      value: 'all',
    },
  ];
  public selectedShow: string = this.showOptions[0].value || '';

  public DataType = DataType;
  public dataType!: DataType;

  constructor(
    private translate: TranslateService,
    private summaryReimbursementService: SummaryReimbursementService
  ) {}

  ngOnInit(): void {
    this.onHandleNgOnInit();
  }

  onHandleNgOnInit() {
    console.log('onHandleNgOnInit...');
    console.log(this.financialLitigationSummaryData);
    console.log(this.financialCustomerSummaryData);
    if (this.financialCustomerSummaryData || this.financialLitigationSummaryData)
      this.dataType = !!this.financialLitigationSummaryData ? DataType.litigation : DataType.customer;
    console.log('SummaryReimbursementTableComponent ngOnInit... ::', this.dataType || '-');

    if (this.financialLitigationSummaryData) {
      this.financialLitigationSummaryDetailList =
        this.financialLitigationSummaryData?.financialLitigationSummaryDetailList || [];
      this.sumLitigationTransactionDashboard = this.financialLitigationSummaryData.litigationTransactionDashboard || {};
    } else if (this.financialCustomerSummaryData) {
      this.financialCustomerSummaryDetailList =
        this.financialCustomerSummaryData?.financialCustomerSummaryDetailList || [];
      this.sumLitigationTransactionDashboard = this.financialCustomerSummaryData.customerTransactionDashboard || {};
    }
  }

  async onClickItem(element: FinancialSummaryTransactionDto, index: number) {
    await this.summaryReimbursementService.onHandleClickItem(element, index);
  }

  async findDataForTest(element: FinancialSummaryTransactionDto) {
    await this.summaryReimbursementService.findDataForTest(element);
  }

  toggleRow(element: { expanded: boolean }) {
    element.expanded = !element.expanded;
    this.isExpandedAllRows = false;
  }

  isExpandedAllRows = false;

  manageAllRows(flag: boolean) {
    (this.financialLitigationSummaryDetailList || []).forEach(row => {
      (row.litigationCaseTransactionDashboard?.financialSummaryTransactionList || []).forEach(row2 => {
        row2.expanded = flag;
      });
    });

    (this.financialCustomerSummaryDetailList || []).forEach(row => {
      (row.litigationTransactionDashboard?.financialSummaryTransactionList || []).forEach(row2 => {
        row2.expanded = flag;
      });
    });

    (this.sumLitigationTransactionDashboard?.financialSummaryTransactionList || []).forEach(row2 => {
      row2.expanded = flag;
    });
    this.isExpandedAllRows = flag;
  }
}
