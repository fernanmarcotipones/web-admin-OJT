import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {FormBase} from './form-base'
@Component({
  selector: 'app-form-management-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
})
export class FormPreviewComponent implements OnInit {
  public formPreviewThumbnail = '/assets/img/form-preview-placeholder.jpg';
  @Input() items: FormBase;
  @Input() formDetails: FormGroup;
  onSubmit() {
    console.log(JSON.stringify(this.formDetails.value));
  }
  constructor(private fb: FormBuilder) {
  }
  ngOnInit() {
  }

}
