import { FormControl } from '@angular/forms';
import { Parse } from 'parse';

export class RegionValidators {
  public objId: any;
  public psgcCodeValue: string;
  public regionCodeValue: string;

  psgcCodeValidator(control: FormControl) {
    let psgcDebounceTime: any;
    if (control && (control.value !== null || control.value !== undefined)) {
      clearTimeout(psgcDebounceTime);
      return new Promise((resolve, reject) => {

        // validates if psgc is equal to region
        control.valueChanges.subscribe((psgcCode: string) => {
          const psgcSubstring = psgcCode ? psgcCode.substring(0, 2) : '';
          this.psgcCodeValue = psgcSubstring;
          if (this.regionCodeValue) {
            if (this.psgcCodeValue !== this.regionCodeValue) {
              return ({ regionAndPsgcCodeNotMatch: true })
            }
          }
        })
        psgcDebounceTime = setTimeout(async () => {
          const query = new Parse.Query('Region');

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
              console.log('taken')
              resolve({ psgcCodeTaken: true });
            } else {
              console.log('not taken')
              resolve(null);
            }
          }
        }, 1000);
      });
    }
  };


  regionValidator(control: FormControl) {
    let regionDebounceTime: any;
    if (control && (control.value !== null || control.value !== undefined)) {
      clearTimeout(regionDebounceTime);
      return new Promise((resolve, reject) => {

        // validates if region is equal to psgc
        control.valueChanges.subscribe((regionCode: string) => {
          this.regionCodeValue = regionCode;
          if (this.psgcCodeValue) {
            if (this.regionCodeValue !== this.psgcCodeValue) {
              resolve({ regionAndPsgcCodeNotMatch: true });
            }
          }
        })

        regionDebounceTime = setTimeout(async () => {
          const query = new Parse.Query('Region');

          // validates if value entered is "00"
          if (control.value === '00') {
            resolve({ invalidFormat: true });
          }

          // validates if region code is already taken
          query.equalTo('regionCode', control.value);
          const result = await query.first();
          const data = result ? true : false;
          if (result) {
            if ((data && !this.objId) || result.id !== this.objId.id) {
              resolve({ regionCodeTaken: true });
            } else {
              resolve(null);
            }
          }
        }, 1000);
      });
    }
  };

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
}
