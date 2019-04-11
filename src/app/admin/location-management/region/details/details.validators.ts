import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Parse } from 'parse';

export class RegionValidators {
  public regionControl: FormControl;
  public psgcControl: FormControl;

  latitudeValidator(control: FormControl) {
    return new Promise((resolve, reject) => {
      try {
        if (
          control &&
          (control.value !== null || control.value !== undefined)
        ) {
          if (control.value >= -90 && control.value <= 90) {
            resolve(null);
          }
          resolve({
            isError: true,
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  longitudeValidator(control: FormControl) {
    return new Promise((resolve, reject) => {
      try {
        if (
          control &&
          (control.value !== null || control.value !== undefined)
        ) {
          if (control.value >= -180 && control.value <= 180) {
            resolve(null);
          }
          resolve({
            isError: true,
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  psgcCodeTaken(objId: any): ValidatorFn {
    return (control: FormControl): any => {
      let psgcDebounceTime: any;
      if (control && (control.value !== null || control.value !== undefined)) {
        clearTimeout(psgcDebounceTime);
        return new Promise((resolve, reject) => {
          psgcDebounceTime = setTimeout(async () => {
            const query = new Parse.Query('Region');
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

  regionCodeTaken(objId: any): ValidatorFn {
    return (control: FormControl): any => {
      let regionDebounceTime: any;
      if (control && (control.value !== null || control.value !== undefined)) {
        clearTimeout(regionDebounceTime);
        return new Promise((resolve, reject) => {
          regionDebounceTime = setTimeout(async () => {
            const query = new Parse.Query('Region');
            if (control.value === '00') {
              resolve({ invalidFormat: true });
            }
            query.equalTo('regionCode', control.value);
            const result = await query.first();
            const data = result ? true : false;
            if (result) {
              if ((data && !objId) || result.id !== objId) {
                resolve({ regionCodeTaken: true });
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
