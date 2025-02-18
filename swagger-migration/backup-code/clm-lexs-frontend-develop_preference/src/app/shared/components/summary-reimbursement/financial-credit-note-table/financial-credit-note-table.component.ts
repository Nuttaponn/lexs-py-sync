import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { ReceiptService } from '@app/modules/finance/services/receipt.service';
import { IFinancialCreditNote, IFinancialCreditNoteResponse } from '../summary-reimbursement.model';

@Component({
  selector: 'app-financial-credit-note-table',
  templateUrl: './financial-credit-note-table.component.html',
  styleUrls: ['./financial-credit-note-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FinancialCreditNoteTableComponent {
  public displayedColumns: string[] = [
    'order',
    'transactionDate',
    'receivingDepartmentForCreditNote',
    'refundAmountSent',
    'refBranchAC',
    'transferredBranch',
    'document',
    'status',
    'remark',
  ];
  public isExpandedAllRows = false;

  @Input()
  financialCreditNoteResponse!: IFinancialCreditNoteResponse;

  constructor(private receiptService: ReceiptService) {}

  toggleRow(element: { expanded: boolean }) {
    element.expanded = !element.expanded;
    this.isExpandedAllRows = false;
  }

  manageAllRows(flag: boolean) {
    (this.financialCreditNoteResponse?.financialCreditNoteList || []).forEach(row => {
      row.expanded = flag;
    });
    this.isExpandedAllRows = flag;
  }

  async onDownLoad(element: IFinancialCreditNote) {
    await this.receiptService.downloadCreditNote(
      element.litigationCaseId || -1,
      element.litigationId || '',
      element.receiveNo || ''
    );
  }
}
