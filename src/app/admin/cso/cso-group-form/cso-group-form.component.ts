import { Component, OnInit } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MatSlideToggleModule, MatCheckboxModule} from '@angular/material'
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cso-group-form',
  templateUrl: './cso-group-form.component.html',
  styleUrls: ['./cso-group-form.component.scss']
})
export class CsoGroupFormComponent implements OnInit {
  csoGroupForm = new FormGroup({
    csoGroupName: new FormControl(''),
    csoDescription: new FormControl(''),
    csoPrivacy: new FormControl(''),
    csoStatus: new FormControl(''),
  });

  csoGroupAccessLevel = new FormGroup({
    csoAgencyProgram: new FormControl(''),
    csoInterLevels: new FormControl(''),
    region: new FormControl(''),
    province: new FormControl(''),
    municipality: new FormControl(''),
    barangay:new FormControl('')
  });
  

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.csoGroupForm.value);
  }
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
