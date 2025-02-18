import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ExpenseMemoDto } from '@lexs/lexs-client';
import { ExpenseService } from '../../services/expense.service';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-remarks-payment-dialog',
  templateUrl: './remarks-payment-dialog.component.html',
  styleUrls: ['./remarks-payment-dialog.component.scss'],
})
export class RemarksPaymentDialogComponent implements OnInit {
  public note = new UntypedFormControl('');
  private expenseTransactionId!: number;
  public remarksList: ExpenseMemoDto[] = [];
  public financeType!: 'RECEIPT' | 'EXPENSE' | 'ADVANCE';
  public isViewMode: boolean = false;
  constructor(
    private expenseService: ExpenseService,
    private receiptService: ReceiptService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.expenseTransactionId) {
      await this.getRemarksList();
    }
  }

  async getRemarksList() {
    if (this.financeType === 'EXPENSE') {
      this.remarksList = (await this.expenseService.getMemo(this.expenseTransactionId)) || [];
    } else {
      this.remarksList = (await this.receiptService.getMemo(this.expenseTransactionId)) || [];
    }
  }

  async dataContext(dataCtx: any) {
    this.expenseTransactionId = dataCtx?.id;
    this.note.setValue(dataCtx?.note);
    this.note.setValidators(Validators.required);
    this.note.updateValueAndValidity();
    this.financeType = dataCtx?.financeType ? dataCtx?.financeType : 'EXPENSE';
    if (this.financeType === 'ADVANCE') this.remarksList = dataCtx?.memoHistory || [];
    this.isViewMode = dataCtx?.isViewMode;
  }

  get returnData() {
    return {
      note: this.note.value,
    };
  }

  public async onClose(): Promise<boolean> {
    if (this.isViewMode) {
      return true;
    }
    this.note.markAllAsTouched();
    if (this.note.valid && this.note.value !== '') {
      return true;
    } else {
      this.note.setErrors({
        required: true,
      });
    }
    return false;
  }
}
