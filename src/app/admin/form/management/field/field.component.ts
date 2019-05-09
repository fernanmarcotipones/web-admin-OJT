import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder,Validators } from '@angular/forms';
import { FieldValidators } from './field.component.validators';

@Component({
  selector: 'app-admin-form-management-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  showProgramField: Boolean;
  formDetailsGroup = this.fb.group({
  source: ['',Validators.required],
  formTitle: ['',Validators.required],
  description: [''],
  selectedQuestionType: ['',Validators.required],
  selectedProgramType: ['',Validators.required],
  selectedProgramStatus: [''],
  selectedProjectStatus: [''],
  status: ['',Validators.required]
  })
  constructor(private fb: FormBuilder) {
   }
   showProgramProjectStatus(selected){
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
  ngOnInit() {
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
}

