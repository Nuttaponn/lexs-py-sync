import { Component } from '@angular/core';

@Component({
  selector: 'app-withdrawn-seizure-property-confirm-dialog',
  templateUrl: './withdrawn-seizure-property-confirm-dialog.component.html',
  styleUrls: ['./withdrawn-seizure-property-confirm-dialog.component.scss'],
})
export class WithdrawnSeizurePropertyConfirmDialogComponent {
  public isShowWarning: boolean = false;
  public messageBanner: string = '';
  public confirmMessage: string = '';

  constructor() {}

  dataContext(data: any) {
    this.isShowWarning = data.isShowWarning;
    this.messageBanner = data.messageBanner;
    this.confirmMessage = data.confirmMessage;
  }

  public async onClose(): Promise<boolean> {
    return true;
  }

  get returnData() {
    return true;
  }
}
