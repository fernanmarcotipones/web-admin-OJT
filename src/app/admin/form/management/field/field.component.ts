import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-admin-form-management-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],

})
export class FieldComponent implements OnInit {
  showProgramField: Boolean;
  formDetailsGroup = this.fb.group({
  source: ['', Validators.required],
  formTitle: ['', Validators.required],
  description: [''],
  selectedQuestionType: ['', Validators.required],
  selectedProgramType: ['', Validators.required],
  selectedProgramStatus: [''],
  selectedProjectStatus: [''],
  status: ['', Validators.required]
  })
  id: string
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) {

   }
   showProgramProjectStatus(selected) {
     console.log(selected)
    if (selected === 'Profile' || selected === 'Survey') {
      this.showProgramField = true;
      this.formDetailsGroup.controls['selectedProgramStatus'].setValidators([Validators.required])
      this.formDetailsGroup.controls['selectedProjectStatus'].setValidators([Validators.required])
    }
    else {
      this.showProgramField = false;
      this.formDetailsGroup.controls['selectedProgramStatus'].clearValidators()
      this.formDetailsGroup.controls['selectedProjectStatus'].clearValidators()
      this.formDetailsGroup.controls['selectedProgramStatus'].updateValueAndValidity()
      this.formDetailsGroup.controls['selectedProjectStatus'].updateValueAndValidity()
    }
  }
  isFieldInvalid(field: string) {
    return !this.formDetailsGroup.get(field).valid && this.formDetailsGroup.get(field).touched;
  }
  trimFormValues() {
    let values = {};

    Object.keys(this.formDetailsGroup.value).forEach(key => {
      if (typeof this.formDetailsGroup.value[key] === 'string') {
        values[key] = this.formDetailsGroup.value[key].trim();
      }
    });

    return values;
  }
  onFieldChange() {
    const value = this.trimFormValues();
    const data = {
      value: value,
      isFormInvalid: !this.formDetailsGroup.valid}

    // this.newUserAccountData.emit(data);
}
  getFormInformation() {
    this.setFormValues()
  }
  setFormValues() {
  Object.keys(this.formDetailsGroup.value).map(key => {
    this.formDetailsGroup.patchValue({[key] : 'Set Status'})
  })
  }
  
  ngOnInit() {
    this.activatedRoute.url.subscribe(data => {
      // console.log(data[2].parameters)
      // console.log(data)
      if (data[2].path === 'edit') {
        this.getFormInformation()
      }
    console.log(data)
    })
  }
}
