import { Component } from '@angular/core';

@Component({
  selector: 'app-legal-execution-withdraw-confirmation-dialog',
  templateUrl: './legal-execution-withdraw-confirmation-dialog.component.html',
  styleUrls: ['./legal-execution-withdraw-confirmation-dialog.component.scss'],
})
export class LegalExecutionWithdrawConfirmationDialogComponent {
  public selectionLength: number = 0;
  public recordMessage: string = '';
  public bottomMessage: string = '';
  public onCheck: string = '';
  public collateralLength: number = 0;

  constructor() {}

  dataContext(data: any) {
    this.selectionLength = data.selectionLength;
    this.recordMessage = data.message;
    this.bottomMessage = data.bottomMessage;
    this.collateralLength = data.collateralLength;
    this.onCheck = data.onCheck;
  }

  async onClose() {
    return true;
  }

  get returnData() {
    return true;
  }
}
