import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';

@Component({
  selector: 'app-auction-led-card-revoke-sale-dialog',
  templateUrl: './auction-led-card-revoke-sale-dialog.component.html',
  styleUrls: ['./auction-led-card-revoke-sale-dialog.component.scss'],
})
export class AuctionLedCardRevokeSaleDialogComponent {
  constructor() {}

  public collateralColumns: string[] = [
    'selectionMultiple',
    'orderNumber',
    'fsubbidnum',
    'noticeNumber',
    'deedno',
    'assettypedesc',
    'buyerType',
  ];

  public data: any[] = [];
  private selected: any[] = [];

  async dataContext(data: any) {
    if (data.collaterals) this.data = data.collaterals;
  }

  onUpdateSelectItem(event: SelectionModel<any[]>) {
    this.selected = event.selected;
  }

  public async onClose() {
    if (this.selected.length > 0) return true;
    return false;
  }

  get returnData() {
    if (this.selected.length > 0) {
      return {
        close: true,
        selected: this.data.filter(c => this.selected.includes(c.collateralId)),
      };
    } else {
      return false;
    }
  }
}
