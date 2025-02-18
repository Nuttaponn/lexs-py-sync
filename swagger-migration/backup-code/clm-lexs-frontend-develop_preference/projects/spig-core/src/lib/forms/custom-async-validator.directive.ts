import { Directive, Input } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector:
    '[customAsyncValidator][formControlName],[customAsyncValidator][formControl],[customAsyncValidator][ngModel]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi: true }],
})
export class CustomAsyncValidatorDirective implements AsyncValidator {
  @Input()
  customAsyncValidator!: Record<string, (value: any) => Promise<boolean>>;

  async validate(control: AbstractControl): Promise<ValidationErrors> {
    const result: ValidationErrors = {};
    const keys = Object.keys(this.customAsyncValidator);
    for (const key of keys) {
      const valid = await this.customAsyncValidator[key](control.value);
      if (!valid) {
        result[key] = true;
      }
    }
    return result;
  }
}
