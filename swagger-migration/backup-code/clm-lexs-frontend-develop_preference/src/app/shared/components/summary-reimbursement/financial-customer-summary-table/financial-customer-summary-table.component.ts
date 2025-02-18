import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { NameValuePair } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';
import {
  IFinancialCustomerSummaryDetailDto,
  IFinancialCustomerSummaryDto,
  IFinancialTransactionSummaryDashboard,
} from '../summary-reimbursement.model';
@Component({
  selector: 'app-financial-customer-summary-table',
  templateUrl: './financial-customer-summary-table.component.html',
  styleUrls: ['./financial-customer-summary-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FinancialCustomerSummaryTableComponent implements OnInit {
  public displayedColumns: string[] = [
    'sequence',
    'expenseType',
    'accountCode',
    'outstanding',
    'expenditure',
    'revenue',
    'cancelPayment',
    'adjustAmount',
    'cutOriginal',
    'becomeFold',
    'discountExemption',
    'terminateAsPer',
    'followUp',
  ];

  @Input()
  financialCustomerSummaryData!: IFinancialCustomerSummaryDto;
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
  // <!-- ราย LG ID, รวมทุก LG ID -->
  public showOptions: NameValuePair[] = [
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

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.onHandleNgOnInit();
  }

  onHandleNgOnInit() {
    if (this.financialCustomerSummaryData) {
      this.financialCustomerSummaryDetailList =
        this.financialCustomerSummaryData?.financialCustomerSummaryDetailList || [];
      this.sumLitigationTransactionDashboard = this.financialCustomerSummaryData.customerTransactionDashboard || {};
    }
  }

  toggleRow(element: { expanded: boolean }) {
    element.expanded = !element.expanded;
    this.isExpandedAllRows = false;
  }

  isExpandedAllRows = false;

  manageAllRows(flag: boolean) {
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
