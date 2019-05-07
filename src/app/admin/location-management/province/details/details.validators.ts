import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Parse } from 'parse';

export class ProvinceValidators extends Validators {
  public objId: any;
  public psgcCodeValue: string;
  public provinceCodeValue: string;

  psgcCodeValidator(control: FormControl) {
    let psgcDebounceTime: any;
    if (control && (control.value !== null || control.value !== undefined)) {
      clearTimeout(psgcDebounceTime);

      // validates if psgc is equal to region
      control.valueChanges.subscribe((psgcCode: string) => {
        const psgcSubstring = psgcCode ? psgcCode.substring(0, 4) : '';
        this.psgcCodeValue = psgcSubstring;
        if (this.provinceCodeValue) {
          if (this.psgcCodeValue !== this.provinceCodeValue) {
            return ({ provinceAndPsgcCodeNotMatch: true })
          }
        }
      })

      return new Promise((resolve, reject) => {
        psgcDebounceTime = setTimeout(async () => {
          const query = new Parse.Query('Province');

          // validates if value entered is "000000000"
          if (control.value === '000000000') {
            resolve({ invalidFormat: true });
          }

          // validates if psgc code is already taken
          query.equalTo('psgcCode', control.value);
          const result = await query.first();
          const data = result ? true : false;
          if (result) {
            if ((data && !this.objId) || result.id !== this.objId.id) {
              resolve({ psgcCodeTaken: true });
            } else {
              resolve(null);
            }
          }
        }, 1000);
      });
    }
  };


  provinceCodeValidator(control: FormControl) {
    let provinceDebounceTime: any;
    if (control && (control.value !== null || control.value !== undefined)) {
      clearTimeout(provinceDebounceTime);
      return new Promise((resolve, reject) => {

        // validates if region is equal to psgc
        control.valueChanges.subscribe((regionCode: string) => {
          this.provinceCodeValue = regionCode;
          if (this.psgcCodeValue) {
            if (this.provinceCodeValue !== this.psgcCodeValue) {
              resolve({ provinceAndPsgcCodeNotMatch: true });
            }
          }
        })

        provinceDebounceTime = setTimeout(async () => {
          const query = new Parse.Query('Province');

          // validates if value entered is "0000"
          if (control.value === '0000') {
            resolve({ invalidFormat: true });
          }

          // validates if province code is already taken
          query.equalTo('provinceCode', control.value);
          const result = await query.first();
          const data = result ? true : false;
          if (result) {
            if ((data && !this.objId) || result.id !== this.objId.id) {
              resolve({ provinceCodeTaken: true });
            } else {
              resolve(null);
            }
          }
        }, 1000);
      });
    }
  };


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
}

