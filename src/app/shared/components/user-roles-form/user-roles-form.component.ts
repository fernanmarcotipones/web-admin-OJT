import { Component, OnInit, OnChanges, Input, Output, EventEmitter, group } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
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
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from '@angular/cdk/overlay/typings/overlay-directives';

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
  public isRegional = false;
  public isProvincial = false;
  public isMunicipal = false;

  public enableRegional = false;
  public enableProvincial = false;
  public enableMunicipal = false;

  // Select Box Validators
  validators = [Validators.required, UserRolesFormValidators.validateNoNull];

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
      role: new FormControl('', this.validators),
      access: new FormControl('', this.validators),
      cso: new FormControl('', this.validators),
      region: new FormControl('', []),
      province: new FormControl('', []),
      municipality: new FormControl('', []),
      status: new FormControl('', [])
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
    console.log(this.provinceService.getByRegionCode('REGION I').then(data => data));
  }

  fetchDropdownOptions() {
    this.allUserRoles();
    this.allAccessLevels();
    this.allCSOGroups();
    this.allRegions();
    this.allProvinces();
    this.allMunicipalities();
  }

  onAccessFieldChange() {
    const controls = this.userRolesForm.controls;
    const accessValue = controls.access.value.name;

    this.resetBooleans();
    this.resetValidators();
    switch (accessValue) {
      case 'National':
        this.isNational = true;
        break;
      case '':
        break;
      default:
        this.enableRegional = true;
        switch (accessValue) {
          case 'Regional':
            this.isRegional = true;
            this.insertValidators(controls.region);
            break;
          case 'Provincial':
            this.isProvincial = true;
            break;
          case 'Municipal' || 'Barangay':
            this.isMunicipal = true;
            break;
        }
        break;
    }
  }

  onRegionalFieldChange() {
    const controls = this.userRolesForm.controls;
    const regionValue = controls.region.value.name;
    const notNull = this.isNotNull(regionValue);

    if (!(this.isNational || this.isRegional)) {
      if (notNull) {
        this.enableProvincial = true;
      }
    }
  }

  onProvincialFieldChange() {
    const controls = this.userRolesForm.controls;
    const provinceValue = controls.province.value.name;
    const notNull = this.isNotNull(provinceValue);

    if (!(this.isNational || this.isRegional || this.isProvincial)) {
      if (notNull) {
        this.enableMunicipal = true;
      }
    }
  }

  resetBooleans() {
    this.isNational = false;
    this.isRegional = false;
    this.isProvincial = false;
    this.isMunicipal = false;
    this.enableRegional = false;
    this.enableProvincial = false;
    this.enableMunicipal = false;
  }

  insertValidators(...controls: AbstractControl[]) {
    for (const control of controls) {
      control.setValidators(this.validators);
    }
  }

  resetValidators() {
    const controls = this.userRolesForm.controls;
    controls.region.setValidators([]);
    controls.province.setValidators([]);
    controls.municipality.setValidators([]);
  }

  isNotNull (val) {
    if (typeof(val) === 'string') {
      return val != null || val !== '';
    } else {
      return val != null;
    }
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
