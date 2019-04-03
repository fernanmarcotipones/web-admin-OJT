import { Injectable } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DynamicFormControlBase } from './dynamic-form-control-base';

@Injectable()
export class DynamicFormControlService {
  constructor() { }

  toFormGroup(items: DynamicFormControlBase<any>[]) {
    const group: any = {};
    const fb = new FormBuilder();
    items.forEach(item => {
      let control: any;
      if (item.type === 'GRID') {
        control = {};
        if (item.value && item.value instanceof Object) {
          Object.keys(item.value).forEach(key => {
            control[key] = new FormControl('');
          })
          control = fb.group(control);
        }
      } else if (item.type === 'CHECKBOX') {
        const choices: Array<any> = item['choices'];
        if (choices && choices.length > 0) {
          control = [];
          choices.forEach((valString, index) => {
            control.push(new FormControl(false));
          })

          control = fb.array(control);
        }
      } else {
        control =  new FormControl('');
      }
      group[ item.fieldId ] = control;

    });
    return new FormGroup(group);
  }
}
