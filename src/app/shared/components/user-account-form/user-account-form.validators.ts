import { FormControl, Validators } from '@angular/forms';

export class UserAccountFormValidators extends Validators {
  static validateWhiteSpaceOnly(control: FormControl) {
    const value = control.value;
    if (value && value.length > 0) {
      return value.trim() ? null : { isWhiteSpaceOnly: true };
    } else {
      return null;
    }
  }

  // static validateEqual(control: FormControl) {
  //   const value = control.value;
  //   if (value && value.length > 0) {
  //     return value ? null : { isWhiteSpaceOnly: true };
  //   } else {
  //     return null;
  //   }
  // }
}
