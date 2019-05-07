import { FormControl, Validators } from '@angular/forms';

export class UserRolesFormValidators extends Validators {
    static validateNoNull(control: FormControl) {
        const val = control.value;
        return val == null || val === '' ? { isValueInvalid: true } : null;
    }
}
