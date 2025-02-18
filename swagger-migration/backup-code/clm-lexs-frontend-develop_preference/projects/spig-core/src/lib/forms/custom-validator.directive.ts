import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[customValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true }],
})
export class CustomValidatorDirective implements Validator {
  @Input()
  customValidator!: Record<string, (value: any) => boolean>;

  validate(control: AbstractControl): ValidationErrors {
    const result: ValidationErrors = {};
    const keys = Object.keys(this.customValidator);
    for (const key of keys) {
      if (!this.customValidator[key](control.value)) {
        result[key] = true;
      }
    }
    return result;
  }
}
