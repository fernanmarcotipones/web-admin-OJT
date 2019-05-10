import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {FormBase} from './form-base'
import { Constants } from 'app/shared/constants';
@Component({
  selector: 'app-form-management-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
})
export class FormPreviewComponent implements OnInit, OnChanges {
  public formPreviewThumbnail = '/assets/img/form-preview-placeholder.jpg';
  @Input() items: FormBase;
  @Input() formDetails: FormGroup;
  @Input() sourceId;
  public form: any;
  public formReady: boolean;


  onSubmit() {
    console.log(JSON.stringify(this.formDetails.value));
  }
  constructor(private fb: FormBuilder) {
  }
  ngOnInit() {

  }

  ngOnChanges() {
  }
  async formToJson(sourceID) {
    this.formReady = false;
    const API = `${Constants.API_LINK}apiKey=${Constants.API_KEY}&operation=${Constants.API_OPERATION}&gformId=${sourceID}`;
    // await response of fetch call
    const response = await fetch(API)
    const data = await response.json();
    this.form = data.payload.items
    this.formReady = true;
  }


}
