import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DEFAULT_DROPDOWN_CONFIG, EFilingPaymentMethod } from '@app/shared/constant';
import { CustomDialogContent, DropDownConfig, SimpleSelectOption } from '@spig/core';
import { AddLegalExecutionDepartmentContext, AddLegalExecutionDepartmentResult } from '../../models';

@Component({
  selector: 'app-add-legal-execution-department',
  templateUrl: './add-legal-execution-department.component.html',
  styleUrls: ['./add-legal-execution-department.component.scss'],
})
export class AddLegalExecutionDepartmentComponent implements CustomDialogContent {
  public statusConfig: DropDownConfig = DEFAULT_DROPDOWN_CONFIG;
  public eFilingControl: UntypedFormControl = new UntypedFormControl(this.eFilingPaymentMethod.E_FILING);
  public statusOptions: SimpleSelectOption[] = [];
  public officeControl: UntypedFormControl = new UntypedFormControl();
  public returnData: any;

  constructor() {}

  get eFilingPaymentMethod() {
    return EFilingPaymentMethod;
  }

  dataContext(data: AddLegalExecutionDepartmentContext): void {
    if (data.offices) {
      this.statusOptions = <SimpleSelectOption[]>data.offices;
    }

    if (data.selectedOffice) {
      this.officeControl.setValue(data.selectedOffice);
    }

    if (data.forceSelectEFiling) {
      this.eFilingControl.disable();
    }

    if (data.selectedEFiling) {
      this.eFilingControl.setValue(data.selectedEFiling);
    }
  }

  onSelectedOption(value: string) {
    const selectedOption = this.statusOptions.find(it => it.value == value);
    const selectedEFiling = this.eFilingControl.value;
    this.returnData = <AddLegalExecutionDepartmentResult>{
      selectedOffice: selectedOption,
      selectedEFiling: selectedEFiling,
    };
  }
}
