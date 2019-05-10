import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup} from '@angular/forms';

import { APIService } from '../../../core/services/api/api.service';
import { UserProgramRoleService } from '../../../core/services/dao/userProgramRole.service';

import { ITEMS_MODELS, DynamicFormControlGroup } from './dynamic-form-control/dynamic-form-controls';
import { DynamicFormControlBase } from './dynamic-form-control/dynamic-form-control-base';
import { DynamicFormControlService } from './dynamic-form-control/dynamic-form-control.service'

@Component({
  selector: 'app-dynamic-form-display',
  templateUrl: './dynamic-form-display.component.html',
  styleUrls: ['./dynamic-form-display.component.scss'],
  providers: [ DynamicFormControlService ]
})
export class DynamicFormDisplayComponent implements OnInit {
  @ViewChild(BsModalRef) confirmModalRef: BsModalRef;
  @ViewChild(BsModalRef) changeStatusModalService: BsModalRef;
  @Input() formDisplay: any;
  @Input() response: any;
  @Input() readOnly: boolean;

  @Output() formReady = new EventEmitter<FormGroup>()

  form: FormGroup;
  items = [];
  userProgramRole: any;

  constructor(
    protected parse: APIService,
    protected modalService: BsModalService,
    protected userProgramRoleService: UserProgramRoleService,
    protected formControlService: DynamicFormControlService,
  ) {
    this.userProgramRoleService.getSelectedProgramRole().then(role => {
      this.userProgramRole = role;
    });
  }

   buildForm(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const items: DynamicFormControlBase<any>[] = [];
        const itemsData = await this.formDisplay.fields.items;
        let order = 0;
        itemsData.forEach((item: DynamicFormControlGroup) => {
          // if (this.response && this.response.value) {
            // if (item.fieldId in this.response.value) {
              const type = item.type;
              let itemData;

              if (type !== 'SECTION_HEADER' && type !== 'PAGE_BREAK') {
                order++;
                item.order = order;
              }

              switch (type) {
                case 'TEXT':
                  itemData = new ITEMS_MODELS.textField(item);
                  break;
                case 'MULTIPLE_CHOICE':
                  itemData = new ITEMS_MODELS.radioButton(item);
                  break;
                case 'GRID':
                  itemData = new ITEMS_MODELS.radioGrid(item);
                  break;
                case 'LIST':
                  itemData = new ITEMS_MODELS.dropDown(item);
                  break;
                case 'CHECKBOX':
                  itemData = new ITEMS_MODELS.checkBox(item);
                  break;
                case 'CHECKBOX_GRID':
                  itemData = new ITEMS_MODELS.checkBoxGrid(item);
                  break;
                case 'FILE':
                  itemData = new ITEMS_MODELS.fileUpload(item);
                  break;
                case 'PARAGRAPH_TEXT':
                case 'TEXTAREA':
                  itemData = new ITEMS_MODELS.textArea(item);
                  break;
                case 'DATE':
                  itemData = new ITEMS_MODELS.date(item);
                  break;
              }

              if (item.type === 'SECTION_HEADER' || item.type === 'PAGE_BREAK') {
                itemData = item;
              }

              items.push(itemData);
            // }
          // }
        });
        this.items = items.sort((a, b) => a.index - b.index);
        this.form = this.formControlService.toFormGroup(this.items);
        if (this.response) {
          await this.loadFormValues(this.response.value);
        }
        resolve(true);
      } catch (err) {
        reject(err)
      }
    })
  }

  loadFormValues(formValues) {
    if (formValues) {
      Object.keys(formValues).forEach((key, val: any) => {
        const value = formValues[key];
        if (value instanceof Array) {
          value.forEach((subVal, index) => {
            if (subVal instanceof Object) {
              const control = this.form.get(index.toString() + '_' + index);
              if (control) {
                control.patchValue(subVal['value']);
              }
            } else {
              if (this.form.controls[key]) {
                this.form.controls[key]['controls'][index].patchValue(subVal);
              }
            }
          });
        } else {
          if (this.form.controls[key]) {
            this.form.controls[key].patchValue(value);
          }
        }
      });
      this.readOnly ? this.form.disable() : this.form.enable();
    }
  }

  ngOnInit() {
    this.buildForm();
    this.formReady.emit(this.form);
  }
}
