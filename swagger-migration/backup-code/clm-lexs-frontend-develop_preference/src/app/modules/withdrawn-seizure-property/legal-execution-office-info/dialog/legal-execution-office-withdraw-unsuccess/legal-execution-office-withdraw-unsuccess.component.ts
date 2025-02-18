import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { LegalExecutionList } from '@app/modules/withdrawn-seizure-property/withdrawn-seizure-property.constant';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';

@Component({
  selector: 'app-legal-execution-office-withdraw-unsuccess',
  templateUrl: './legal-execution-office-withdraw-unsuccess.component.html',
  styleUrls: ['./legal-execution-office-withdraw-unsuccess.component.scss'],
})
export class LegalExecutionOfficeWithdrawUnsuccessComponent {
  public legalExecutionRemarkFormControl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  public legalExecutionReasonFormControl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  public legalExecutionDropdownConfig: DropDownConfig = { iconName: 'icon-Filter' };
  public legalExecutionOptions: SimpleSelectOption[] = LegalExecutionList;

  constructor() {}

  dataContext(data: any) {}

  async onClose() {
    this.legalExecutionReasonFormControl.markAsTouched();
    if (this.legalExecutionReasonFormControl.value === '04') {
      this.legalExecutionRemarkFormControl.markAsTouched();
      if (this.legalExecutionRemarkFormControl.invalid) {
        return false;
      }
    } else {
      this.legalExecutionRemarkFormControl.clearValidators();
      this.legalExecutionRemarkFormControl.updateValueAndValidity();
    }
    return !this.legalExecutionReasonFormControl.invalid;
  }

  get returnData() {
    return {
      reason: this.legalExecutionReasonFormControl.value,
      remark: this.legalExecutionRemarkFormControl.value,
    };
  }
}
