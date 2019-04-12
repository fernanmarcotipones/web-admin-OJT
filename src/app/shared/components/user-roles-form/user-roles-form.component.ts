import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserRoleService } from 'app/core';

@Component({
  selector: 'app-user-roles-form',
  templateUrl: './user-roles-form.component.html',
  styleUrls: ['./user-roles-form.component.scss']
})
export class UserRolesFormComponent implements OnInit {
  @Input() userRolesData;
  @Output() newUserRolesData: EventEmitter<Object> = new EventEmitter<Object>();;

  userRolesForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public userRoleService: UserRoleService
  ) {
    this.userRolesForm = fb.group({
      role: new FormControl('', [Validators.required]),
      access: new FormControl('', [Validators.required]),
      cso: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      municipality: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    if (this.userRolesData) {
      this.setUserRolesForm(this.userRolesData);
    }
  }

  setUserRolesForm (data) {
    Object.keys(data).map(key => {
      if (this.userRolesForm.controls[key]) {
        this.userRolesForm.controls[key].patchValue(data[key]);
      }
    });
  }

  onFieldChange() {
    // const value = this.trimFormValues();
  }

  trimFormValues() {
    // const values = {};

    
  }

}
