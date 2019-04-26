import { FormControl, Validators } from '@angular/forms';

// const mobileRegex = new RegExp(/^(9|09|\+639)\d{9}$/);
const alphabetRegex = new RegExp(/^[a-zA-Z ]*$/);

export class CsoGroupFormValidators extends Validators {
  // static validateMobileNumber(control: FormControl) {
  //   const mobileNumber = control.value;
  //   if (mobileNumber && mobileNumber.length > 0) {
  //     const isValid = mobileRegex.test(mobileNumber);
  //     return !isValid ? { isMobileInvalid: true } : null;
  //   } else {
  //     return null;
  //   }
  // }
  static validateLength(control: FormControl) {
    const value = control.value;
    if (value && value.length < 3) {
      return { isLengthShort: true };
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
