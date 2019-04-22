import { Component, OnInit, OnChanges, Input, Output, EventEmitter, group } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from 'app/shared/constants';

import { MatSlideToggleModule, MatCheckboxModule } from '@angular/material';
// import { SharedModule } from '@shared/shared.module';
import {
  CSOGroupService,
  FormService,
  MunicipalityService,
  ProgramAccessLevelService,
  ProgramService,
  ProvinceService,
  RegionService,
  UserService,
  UserProgramRole,
  UserProgramRoleService,
  UserRoleService,
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
  // public rows = new Array<UserProgramRole>();

  // public labels = ['Role', 'Access Level', 'CSO Group', 'Location', 'Status', 'Actions'];
  public roles;
  public csoGroups;
  public levels;
  public municipalities;
  public provinces;
  public regions;

  constructor(
    public fb: FormBuilder,
    public csoGroupService: CSOGroupService,
    public municipalityService: MunicipalityService,
    public programAccessLevelService: ProgramAccessLevelService,
    public programService: ProgramService,
    public provinceService: ProvinceService,
    public regionService: RegionService,
    public userService: UserService,
    public userProgramRoleService: UserProgramRoleService,
    public userRoleService: UserRoleService,
    private formService: FormService,
  ) {
    this.userRolesForm = fb.group({
      role: new FormControl('', [Validators.required]),
      access: new FormControl('', [Validators.required]),
      cso: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      municipality: new FormControl('', [Validators.required])
    });
    // this.page.pageNumber = Constants.DEFAULT_PAGE_NUMBER;
    // this.page.size = Constants.DEFAULT_PAGE_SIZE;
  }

  ngOnInit() {
    if (this.userRolesData) {
      this.setUserRolesForm(this.userRolesData);
    }
    this.setDropdowns();
  }

  ngOnChanges (changes) {
    this.setDropdowns();
  }

  setUserRolesForm(data) {
    Object.keys(data).map(key => {
      if (this.userRolesForm.controls[key]) {
        this.userRolesForm.controls[key].patchValue(data[key]);
      }
    });
  }

  setDropdowns() {
    this.allUserRoles();
    this.allAccessLevels();
    this.allCSOGroups();
    this.allRegions();
    this.allProvinces();
    this.allMunicipalities();
  }

  async allCSOGroups() {
    const csoList: any = await this.csoGroupService.getAllCSOGroup().then(data => data);
    console.log(csoList);
    this.csoGroups = csoList;
    return csoList;
  }

  async allMunicipalities() {
    const municipalityList: any = await this.municipalityService.getAll().then(data => data);
    console.log(municipalityList);
    this.municipalities = municipalityList;
    return municipalityList;
  }

  async allProvinces() {
    const provinceList: any = await this.provinceService.getAll().then(data => data);
    console.log(provinceList);
    this.provinces = provinceList;
    return provinceList;
  }

  async allRegions() {
    const regionList: any = await this.regionService.getAll().then(data => data);
    console.log(regionList);
    this.regions = regionList;
    return regionList;
  }

  async allUserRoles() {
    const roleList: any = await this.userRoleService.getAllUserRoles().then(data => data);
    console.log(roleList);
    this.roles = roleList;
    return roleList;
  }

  async allAccessLevels() {
    const levelList: any = await this.programAccessLevelService.getAll().then(data => data);
    console.log(levelList);
    this.levels = levelList;
    return levelList;
  }

  onFieldChange() {
    // const value = this.trimFormValues();
  }

  trimFormValues() {
    // const values = {};
  }

}
