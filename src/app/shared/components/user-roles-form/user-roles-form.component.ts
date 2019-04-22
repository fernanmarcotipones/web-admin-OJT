import { Component, OnInit, OnChanges, Input, Output, EventEmitter, group } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from 'app/shared/constants';

import { MatSlideToggleModule, MatCheckboxModule } from '@angular/material';
// import { SharedModule } from '@shared/shared.module';
import {
  UserProgramRole,
  UserProgramRoleService,
  UserRoleService,
  FormService,
  Page,
  Form
} from 'app/core';

@Component({
  selector: 'app-user-roles-form',
  templateUrl: './user-roles-form.component.html',
  styleUrls: ['./user-roles-form.component.scss']
})
export class UserRolesFormComponent implements OnInit, OnChanges {
  @Input() userRolesData;
  @Output() newUserRolesData: EventEmitter<Object> = new EventEmitter<Object>();

  userRolesForm: FormGroup;
  public page = new Page();
  public rows = new Array<UserProgramRole>();

  constructor(
    public fb: FormBuilder,
    public userProgramRoleService: UserProgramRoleService,
    public userRoleService: UserRoleService,
    private formService: FormService,
  ) {
    this.userRolesForm = fb.group({
      programRoles: this.fb.group({
        role: new FormControl('', [Validators.required]),
        access: new FormControl('', [Validators.required]),
        cso: new FormControl('', [Validators.required]),
        region: new FormControl('', [Validators.required]),
        province: new FormControl('', [Validators.required]),
        municipality: new FormControl('', [Validators.required])
      }),
    });
    // this.page.pageNumber = Constants.DEFAULT_PAGE_NUMBER;
    // this.page.size = Constants.DEFAULT_PAGE_SIZE;
  }

  ngOnInit() {
    if (this.userRolesData) { 
      this.setUserRolesForm(this.userRolesData);
    }

    this.rows = [
      { role: 'Project Admin', level: 'National', csoGroup: 'N/A', region: 'N/A', isActive: true, objectId: '',
      program: '', user: '',  province: '', municipality: '', barangay: '', district: 1, selected: false, assign(){} },
      { role: 'CSO Admin', level: 'Regional', csoGroup: 'MAPAD', region: 'Region I', isActive: false, objectId: '',
      program: '', user: '',  province: '', municipality: '', barangay: '', district: 1, selected: false, assign() {}}
    ];
    console.log(this.userRoleService.getAllUserRoles());
    console.log(this.rows);
  }

  ngOnChanges (changes) {
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
