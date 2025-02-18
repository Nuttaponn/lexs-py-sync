import { Component } from '@angular/core';

@Component({
  selector: 'app-e-filing-to-receipt-dialog',
  templateUrl: './e-filing-to-receipt-dialog.component.html',
  styleUrls: ['./e-filing-to-receipt-dialog.component.scss'],
})
export class EFilingToReceiptDialogComponent {
  public message: string =
    'กรุณาดาวน์โหลด “ใบยืนยันการรับเอกสารและการรับเงิน” จาก e-Filing และอัปโหลดใบยืนยันการชำระเงินเพื่อดำเนินงานต่อไป';

  dataContext(data: any): void {
    this.message = data.message || this.message;
  }

  async onClose() {
    return true;
  }
}
