import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-form-management-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  optionValidate: Boolean;
  selectedQuestionType = new FormControl('');
  get showOptions(){
    this.optionValidate = (this.selectedQuestionType.value === 'Profile') || (this.selectedQuestionType.value === 'Survey')
    return this.optionValidate
  }
  constructor() { }

  ngOnInit() {
  }

}
