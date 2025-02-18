import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validateTaxId(control: AbstractControl): ValidationErrors | null {
  let checkDigit = new Map<string, string>();
  const taxId = control.value.replace(/-/g, '');
  let isTaxIdError = false;

  if (taxId === '' || taxId === null) return { require: true };
  for (let i = 0; i < 12; i++) {
    const digit = checkDigit.get(taxId.charAt(i));
    if (!digit) {
      checkDigit.set(taxId.charAt(i), taxId.charAt(i));
    }
  }

  // not allow repeating number
  if (checkDigit.size === 1) isTaxIdError = true;

  if (taxId.length < 13) isTaxIdError = true;

  if (isTaxIdError) {
    return { pattern: true };
  }
  return null;
}
