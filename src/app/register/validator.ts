import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** A hero's name can't match the hero's alter ego */
export const matchValuesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password1 = control.get('password');
  const password2 = control.get('confirmPassword');

  if (password1?.value !== password2?.value) {
    return { mismatch: true };
  }

  return null;
};
