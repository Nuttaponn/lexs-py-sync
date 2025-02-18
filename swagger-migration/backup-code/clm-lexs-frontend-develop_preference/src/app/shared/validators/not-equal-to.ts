import { AbstractControl, ValidatorFn } from '@angular/forms';

export function notEqualTo(value: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value === value) {
      return { minLength: true };
    }
    return null;
  };
  // TODO: if code on above doesn't work properly then try code below // private notEqualToZero(): ValidatorFn {
  // return (control: AbstractControl): { [key: string]: any } | null => {
  //   const value = control.value;
  //   if (value === 0 || value === '0.00') {
  //     return { notEqualToZero: true };
  //   }
  //   return null;
  // };
}
