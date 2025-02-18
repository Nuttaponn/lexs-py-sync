import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { AccountDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-add-sub-account',
  templateUrl: './add-sub-account.component.html',
  styleUrls: ['./add-sub-account.component.scss'],
})
export class AddSubAccountComponent {
  public addSubAccountHeader: string[] = [
    'select',
    'accountName',
    'billNo',
    'decidedCaseNo',
    'outstandingAccruedInterest',
    'interestNonBook',
    'lateChargeAmount',
  ];
  public accountList: AccountDto[] = [];
  public selection = new SelectionModel<AccountDto>(true, []);
  public isSubmited = false;

  dataContext(data: any) {
    this.accountList = data?.accountList;
  }

  get isAllSelected() {
    return this.selection.selected.length === this.accountList.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected) {
      this.selection.clear();
      return;
    } else {
      this.selection.select(...this.accountList);
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: AccountDto): string {
    if (!row) {
      return `${this.isAllSelected ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.litigationId ?? '' + 1}`;
  }

  public async onClose(): Promise<boolean> {
    if (this.selection.selected.length > 0) {
      return true;
    } else {
      this.isSubmited = true;
      return false;
    }
  }

  get returnData() {
    return this.selection.selected;
  }
}
