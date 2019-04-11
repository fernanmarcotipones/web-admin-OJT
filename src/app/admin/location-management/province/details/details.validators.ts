import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Parse } from 'parse';

export class ProvinceValidators extends Validators {

  latitudeValidator(control: FormControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      if (control.value >= -90 && control.value <= 90) {
        return null;
      }
      return {
        isError: true,
      };
    }
  }

  longitudeValidator(control: FormControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      if (control.value >= -180 && control.value <= 180) {
        return null;
      }
      return {
        isError: true,
      };
    }
  }

  psgcCodeTaken(objId: any): ValidatorFn {
    return (control: FormControl): any => {
      let psgcDebounceTime: any;
      if (control && (control.value !== null || control.value !== undefined)) {
        clearTimeout(psgcDebounceTime);
        return new Promise((resolve, reject) => {
          psgcDebounceTime = setTimeout(async () => {
            const query = new Parse.Query('Province');
            if (control.value === '000000000') {
              resolve({ invalidFormat: true });
            }
            query.equalTo('psgcCode', control.value);
            const result = await query.first();
            const data = result ? true : false;
            if (result) {
              if ((data && !objId) || result.id !== objId) {
                resolve({ psgcCodeTaken: true });
              } else {
                resolve(null);
              }
            }
          }, 1000);
        });
      }
    };
  }

  provinceCodeTaken(objId: any): ValidatorFn {
    return (control: FormControl): any => {
      let provinceDebounceTime: any;
      if (control && (control.value !== null || control.value !== undefined)) {
        clearTimeout(provinceDebounceTime);
        return new Promise((resolve, reject) => {
          provinceDebounceTime = setTimeout(async () => {
            const query = new Parse.Query('Province');
            if (control.value === '0000') {
              resolve({ invalidFormat: true });
            }
            query.equalTo('provinceCode', control.value);
            const result = await query.first();
            const data = result ? true : false;
            if (result) {
              if ((data && !objId) || result.id !== objId) {
                resolve({ provinceCodeTaken: true });
              } else {
                resolve(null);
              }
            }
          }, 1000);
        });
      }
    };
  }
}

