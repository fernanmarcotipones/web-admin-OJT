import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { DynamicFormControlBase } from './dynamic-form-control/dynamic-form-control-base';

@Component({
  selector: 'app-dynamic-form-item',
  templateUrl: './dynamic-form-item.component.html',
  styleUrls: ['./dynamic-form-display.component.scss']
})
export class DynamicFormItemComponent implements OnInit {
  @Input() item: DynamicFormControlBase<any>;
  @Input() form: FormGroup;
  @Input() currentUser: any;
  @Input() isLockedForReporter: any;
  @Input() isLockedForValidator: any;
  @Input() flaggedReport: any;
  @Input() readOnly: any;

  get isValid() { return this.form.controls[this.item.fieldId].valid; }

 constructor() {

 }

  ngOnInit() {

  }

}
