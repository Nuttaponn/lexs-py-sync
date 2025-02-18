import { Component, Input, OnInit } from '@angular/core';
import { ExpenseDetailDto } from '@lexs/lexs-client';
import { ExpenseService } from '../../../modules/finance/services/expense.service';

@Component({
  selector: 'app-section-download-expense-report',
  templateUrl: './section-download-expense-report.component.html',
  styleUrls: ['./section-download-expense-report.component.scss'],
})
export class SectionDownloadExpenseReportComponent implements OnInit {
  @Input() detail!: ExpenseDetailDto;
  @Input() isViewMode!: boolean;

  public canDownloadExpenseDoc = false;

  constructor(public expenseService: ExpenseService) {}

  ngOnInit(): void {
    // Enhance LEX2-38456
    this.canDownloadExpenseDoc = this.expenseService.checkPermissionCanDownloadExpenseDoc(
      this.detail.downloadDocument || false,
      this.isViewMode
    );
  }

  /* Enhancement Spritn3: LEX2-38456 */
  async downloadExpenseDoc() {
    const expenseNo = this.detail?.expenseNo;
    if (!expenseNo) return;

    await this.expenseService.downloadExpenseReport(expenseNo);
  }
}
