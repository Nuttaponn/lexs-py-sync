import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';

@Component({
  selector: 'app-auction-expense-efiling-dialog',
  templateUrl: './auction-expense-efiling-dialog.component.html',
  styleUrls: ['./auction-expense-efiling-dialog.component.scss'],
})
export class AuctionExpenseEfilingDialogComponent {
  public selectedDropdownValue: UntypedFormControl = new UntypedFormControl(null, Validators.required);
  public auctionPaymentEfilingdropdownConfig: DropDownConfig = {};
  public auctionPaymentEfilingOptions: SimpleSelectOption[] = [
    {
      text: 'หมายเรียกวางเงินเพิ่ม - E-filing',
      value: 'SUMMON_FOR_SURCHARGE_E_FILING',
    },
    {
      text: 'หมายเรียกวางเงินเพิ่ม - แคชเชียร์เช็ค',
      value: 'SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE',
    },
    {
      text: 'คำสั่งเจ้าพนักงานบังคับคดี - E-filing',
      value: 'WRIT_OF_EXECUTE_E_FILING',
    },
    {
      text: 'คำสั่งเจ้าพนักงานบังคับคดี - แคชเชียร์เช็ค',
      value: 'WRIT_OF_EXECUTE_CASHIER_CHEQUE',
    },
  ];

  public messageBanner = 'หลังจากกดปุ่ม “ยืนยัน” แล้วจะไม่สามารถกลับมาแก้ไขประเภทค่าใช้จ่ายได้';

  constructor() {}

  async onClose(): Promise<boolean> {
    if (this.selectedDropdownValue.invalid) {
      this.selectedDropdownValue.markAsTouched();
      return false;
    }
    return true;
  }

  get returnData() {
    const selectedPaymentOptions = {
      type: this.selectedDropdownValue.value,
    };
    return selectedPaymentOptions;
  }
}
