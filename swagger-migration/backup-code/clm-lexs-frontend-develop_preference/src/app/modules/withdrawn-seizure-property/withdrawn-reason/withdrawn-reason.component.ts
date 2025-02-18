import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';

@Component({
  selector: 'app-withdrawn-reason',
  templateUrl: './withdrawn-reason.component.html',
  styleUrls: ['./withdrawn-reason.component.scss'],
})
export class WithdrawnReasonComponent implements OnInit {
  private INPUT_WHITELIST = ['01', '02', '03', '04'];
  @Input() isViewMode: boolean = true;
  @Input() form!: UntypedFormGroup;

  @Output() formChange = new EventEmitter();

  get isShowInputForm() {
    return this.INPUT_WHITELIST.includes(this.form.get('reasonWithdrawSeizures')?.value) || this.isViewMode === true;
  }
  public isOpened: boolean = true;
  public classInput = 'input-s icon border-black-40';
  public dropDownReasonWithdrawnOption: SimpleSelectOption[] = [
    { value: '01', text: 'โอนทรัพย์ชำระหนี้' },
    { value: '02', text: 'ชำระหนี้เสร็จสิ้นทั้งหมด' },
    { value: '03', text: 'ชำระหนี้เสร็จสิ้นเฉพาะทรัพย์ที่ต้องการไถ่ถอน' },
    { value: '04', text: 'ขายทรัพย์ชำระหนี้' },
  ];
  public reasonWithdrawSeizures: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public debtPaidAmount: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public placeholder: string = 'WITHDRAWN_SEIZURE_PROPERTY.PAY_OFF_DEBT_AMOUNT';
  public reasonConfig: DropDownConfig = {
    labelPlaceHolder: 'COMMON.LABEL_REASON',
  };
  public hideDetail = true;

  constructor() {}

  ngOnInit(): void {
    if (this.isViewMode) {
      this.hideDetail = true;
    }
  }

  get reasonWithdrawSeizuresLabel(): string | null {
    const reasonVal = this.getControl('reasonWithdrawSeizures')?.value;
    const ddl = this.dropDownReasonWithdrawnOption.find(ddl => {
      return ddl.value === reasonVal ? ddl : '';
    });
    return ddl ? ddl.text : null;
  }
  getControl(name: string): UntypedFormControl {
    return this.form?.get(name) as UntypedFormControl;
  }

  onReasonWithdrawnDDLChange() {
    if (this.form.controls['reasonWithdrawSeizures'].value) {
      this.hideDetail = true;
    } else {
      this.hideDetail = false;
    }
  }
}
