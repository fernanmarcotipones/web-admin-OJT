import { FormControl, Validators } from '@angular/forms';
import { Parse } from 'parse';

export class ProvinceValidators extends Validators {
  public objId: any;
  public psgcCodeValueChanges: string;
  public provinceCodeValueChanges: string;
  public regionPsgcCode: string;

  regionValidator(control: FormControl) {
    let regionCodeDebounceTime: any;
    return new Promise((resolve, reject) => {
      clearTimeout(regionCodeDebounceTime);
      regionCodeDebounceTime = setTimeout(async () => {
        try {
          const query = new Parse.Query('Region');
          query.equalTo('objectId', control.value);
          const result = await query.first();
          const psgcCode = result ? result.attributes.psgcCode : '';
          this.regionPsgcCode = psgcCode;
          console.log(this.regionPsgcCode)
          resolve(null);
        } catch (err) {
          reject(err);
        }
      }, 100)
    })
  }

  psgcCodeValidator(control: FormControl) {
    let psgcDebounceTime: any;
    if (control && (control.value !== null || control.value !== undefined)) {
      clearTimeout(psgcDebounceTime);
      return new Promise((resolve, reject) => {
        psgcDebounceTime = setTimeout(async () => {
          control.valueChanges.subscribe((psgcCode: string) => {
            const psgcSubstring = psgcCode ? psgcCode.substring(0, 4) : '';
            this.psgcCodeValueChanges = psgcSubstring;

            // validates if region is equal to psgc
            if (this.regionPsgcCode && psgcCode) {
              const psgcSubstr = psgcSubstring ? psgcSubstring.substring(0, 2) : '';
              const regionPsgcSubstring = this.regionPsgcCode ? this.regionPsgcCode.substring(0, 2) : '';
              if (regionPsgcSubstring !== psgcSubstr) {
                console.log('region and psgc not match!');
                resolve({ regionAndPsgcCodeNotMatch: true })
              }
            } // failed....

            // validates if psgc is equal to province
            if (this.provinceCodeValueChanges) {
              if (this.psgcCodeValueChanges !== this.provinceCodeValueChanges) {
                resolve({ provinceAndPsgcCodeNotMatch: true })
              }
            }
          })
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
        control.valueChanges.subscribe((provinceCode: string) => {
          this.provinceCodeValueChanges = provinceCode;
          // validates if region is equal to province code
          if (this.regionPsgcCode) {
            const regionProvinceSubstring = this.regionPsgcCode ? this.regionPsgcCode.substring(0, 2) : '';
            const provinceSubstring = this.provinceCodeValueChanges ? this.provinceCodeValueChanges.substring(0, 2) : '';
            if (provinceSubstring !== regionProvinceSubstring) {
              resolve({ regionAndProvinceCodeNotMatch: true })
            }
          }
          // validates if province is equal to psgc code
          if (this.psgcCodeValueChanges) {
            if (this.provinceCodeValueChanges !== this.psgcCodeValueChanges) {
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
      return { isError: true };
    }
  }

  longitudeValidator(control: FormControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      if (control.value >= -180 && control.value <= 180) {
        return null;
      }
      return { isError: true };
    }
  }
}
