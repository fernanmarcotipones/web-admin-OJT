import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-form-management-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  showProgramField: Boolean;
  formDetailsGroup = this.fb.group({
  source: [''],
  formTitle: [''],
  description: [''],
  selectedQuestionType: [''],
  selectedProgramType: [''],
  selectedProgramStatus: [''],
  selectedProjectStatus: [''],
  status: ['']
  })
  constructor(private fb: FormBuilder) {
   }
   showProgramProjectStatus(selected){
    if (selected === 'Profile' || selected === 'Survey') {
      this.showProgramField = true;
    }
    else {
      this.showProgramField = false;
    }
  }
  ngOnInit() {
  }
}

