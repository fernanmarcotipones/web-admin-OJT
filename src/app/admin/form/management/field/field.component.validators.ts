import { FormControl, Validators } from '@angular/forms';

const alphabetRegex = new RegExp(/^[a-zA-Z ]*$/);

export class FieldValidators extends Validators {

  static validateAlphabetOnly(control: FormControl) {
    const value = control.value;
    if (value && value.length > 0) {
      const isValid = alphabetRegex.test(value);
      return !isValid ? { isNotAlphabetOnly: true } : null;
    } else {
      return null;
    }
  }

  static validateWhiteSpaceOnly(control: FormControl) {
    const value = control.value;
    if (value && value.length > 0) {
      return value.trim() ? null : { isWhiteSpaceOnly: true };
    } else {
      return null;
    }
  }
}
