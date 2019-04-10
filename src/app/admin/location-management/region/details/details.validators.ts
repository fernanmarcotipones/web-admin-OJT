import { FormControl, ValidatorFn } from '@angular/forms';
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

  psgcCodeTaken(control: FormControl): any {
    let psgcDebounceTime: any;
    if (control && (control.value !== null || control.value !== undefined)) {
      clearTimeout(psgcDebounceTime);
      return new Promise((resolve, reject) => {
        psgcDebounceTime = setTimeout(async () => {
          const query = new Parse.Query('Region');
          if (control.value === '000000000') {
            resolve({ invalidFormat: true });
          }
          this.psgcControl = control;

          query.equalTo('psgcCode', control.value);
          let result = await query.first();
          let data = result ? true : false;
          if (data) {
            resolve({ psgcCodeTaken: true });
          } else {
            resolve(null);
          }
        }, 1000);
      });
    }
  }

  // isRegionMatch(control: FormControl) {
    // psgc to region checking
    // if (this.psgcControl && (this.psgcControl.value !== null || this.psgcControl.value !== undefined)) {
    //   let psgcValue = this.psgcControl.value;
    //   let psgcSubstring = psgcValue ? psgcValue.substring(0, 2) : '';
    //   console.log(control.errors)
    //   if (control.value !== psgcSubstring) {
    //     return { psgcCodeNotMatch: true }
    //   }
    //   return null;
    // }
  // }

  // isPsgcMatch(control: FormControl) {
    // region to psgc checking
    // if (this.regionControl &&(this.regionControl.value !== null || this.regionControl.value !== undefined)) {
    //   let regionValue = this.regionControl.value;
    //   let regionSubstring = regionValue ? regionValue.substring(0, 2) : '';
    //   if(control.value !== regionSubstring) {
    //     return { regionCodeNotMatch: true }
    //   }
    //   return null;
    // }
  // }

  isRegionMatch(psgcValue:string):ValidatorFn {
    // console.log('psgcVal',psgcValue)
    return (control: FormControl) => {
      // console.log('controlValue',control.value)
      return null;
    }
  }

  regionCodeTaken(control: FormControl): any {
    let regionDebounceTime: any;
    if (control && (control.value !== null || control.value !== undefined)) {
      clearTimeout(regionDebounceTime);
      return new Promise((resolve, reject) => {
        regionDebounceTime = setTimeout(async () => {
          const query = new Parse.Query('Region');
          if (control.value === '00') {
            resolve({ invalidFormat: true });
          }
          this.regionControl = control;
          query.equalTo('regionCode', control.value);
          const result = await query.first();
          const data = result ? true : false;
          if (data) {
            resolve({ regionCodeTaken: true });
          } else {
            resolve(null);
          }
        }, 1000);
      });
    }
  }

  
}
