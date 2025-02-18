import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { CustomDialogContent, DropDownConfig, SimpleSelectOption } from '@spig/core';
import { reasonOption } from '../../models';

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.scss'],
})
export class ReasonComponent implements CustomDialogContent {
  public context: any = {};
  public form: UntypedFormGroup = new UntypedFormGroup({});
  public statusConfig: DropDownConfig = DEFAULT_DROPDOWN_CONFIG;
  public statusOptions: SimpleSelectOption[] = reasonOption;
  public requireRemark = false;

  get returnData() {
    return this.form.getRawValue();
  }

  get showRemarkError() {
    return this.form.controls['remark'].hasError('required');
  }

  constructor(private fb: UntypedFormBuilder) {
    this.form = this.fb.group({
      reason: [null, Validators.required],
      remark: [''],
    });
  }

  dataContext({ remark, reason }: any): void {
    if (reason) {
      this.form.controls['reason'].setValue(reason);
      this.onSelectedOption(reason);
    }

    if (remark) {
      this.form.controls['remark'].setValue(remark);
      this.requireRemark = true;
    }
  }

  async onClose() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  onSelectedOption(value: string) {
    if (value === '99') {
      this.form.controls['remark'].setValidators(Validators.required);
      this.requireRemark = true;
    } else {
      this.form.controls['remark'].reset();
      this.form.controls['remark'].clearValidators();
      this.requireRemark = false;
    }
    this.form.controls['remark'].updateValueAndValidity();
  }
}
