import { Component, OnInit, OnChanges, Input, Output, EventEmitter, group } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserRolesFormValidators } from './user-roles-form.validators'

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

  // Fetched Options Holder
  public roles;
  public csoGroups;
  public levels;
  public municipalities;
  public provinces;
  public regions;

  // Booleans
  public isNational = false;
  public enableRegional = false;
  public enableProvincial = false;
  public enableMunicipal = false;

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
      role: new FormControl('', [Validators.required, UserRolesFormValidators.validateNoNull]),
      access: new FormControl('', [Validators.required, UserRolesFormValidators.validateNoNull]),
      cso: new FormControl('', [Validators.required, UserRolesFormValidators.validateNoNull]),
      region: new FormControl('', [Validators.required, UserRolesFormValidators.validateNoNull]),
      province: new FormControl('', [Validators.required, UserRolesFormValidators.validateNoNull]),
      municipality: new FormControl('', [Validators.required, UserRolesFormValidators.validateNoNull]),
      status: new FormControl('', [Validators.required, UserRolesFormValidators.validateNoNull])
    });
  }

  ngOnInit() {
    if (this.userRolesData) {
      this.setUserRolesForm(this.userRolesData);
    }
    this.fetchDropdownOptions();
  }

  ngOnChanges (changes) {
    this.fetchDropdownOptions();
  }

  setUserRolesForm(data) {
    Object.keys(data).map(key => {
      if (this.userRolesForm.controls[key]) {
        this.userRolesForm.controls[key].patchValue(data[key]);
      }
    });
  }

  // TODO: Push Values
  public pushValues() {
    console.log(this.userRolesForm.controls.role.value);
  }

  fetchDropdownOptions() {
    this.allUserRoles();
    this.allAccessLevels();
    this.allCSOGroups();
    this.allRegions();
    this.allProvinces();
    this.allMunicipalities();
  }

  onFieldChange() {
    const accessValue = this.userRolesForm.controls.access.value.name;
    if (accessValue === 'National') {
      this.resetBooleans();
      this.isNational = true;
      console.log(this.userRolesForm.controls.access.value.name);
    } else if (accessValue === 'Regional') {
      this.resetBooleans();
      this.enableRegional = true;
    } else if (accessValue === 'Provincial') {
      this.resetBooleans();
      this.enableRegional = true;
      this.enableProvincial = true;
    } else if (accessValue === 'Municipal' || accessValue === 'Barangay') {
      this.resetBooleans();
      this.enableRegional = true;
      this.enableProvincial = true;
      this.enableMunicipal = true;
    } else {
      this.resetBooleans();
    }
  }

  resetBooleans() {
    this.isNational = false;
    this.enableRegional = false;
    this.enableProvincial = false;
    this.enableMunicipal = false;
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
}
