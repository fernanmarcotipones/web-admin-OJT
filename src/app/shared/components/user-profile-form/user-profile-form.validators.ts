import { FormControl, Validators } from '@angular/forms';

const mobileRegex = new RegExp(/^(9|09|\+639)\d{9}$/);
const alphabetRegex = new RegExp(/^[a-zA-Z ]*$/);
const numberRegex = new RegExp(/^[0-9]*$/);

export class UserProfileFormValidators extends Validators {
  static validateMobileNumber(control: FormControl) {
    const mobileNumber = control.value;
    if (mobileNumber && mobileNumber.length > 0) {
      const isValid = mobileRegex.test(mobileNumber);
      return !isValid ? { isMobileInvalid: true } : null;
    } else {
      return null;
    }
  }

  static validateNumberOnly(control: FormControl) {
    const number = control.value;
    if (number && number.length > 0) {
      const isValied = numberRegex.test(number);
      return !isValied ? {isNotNumberOnly: true } : null;
    } else {
      return null;
    }
  }

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
