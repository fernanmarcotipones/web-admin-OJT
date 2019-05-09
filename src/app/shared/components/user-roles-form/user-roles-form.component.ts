import { Component, OnInit, OnChanges, Input, Output, EventEmitter, group, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserRolesFormValidators } from './user-roles-form.validators'

import {
  CSOGroupService,
  MunicipalityService,
  ProgramAccessLevelService,
  ProgramService,
  ProvinceService,
  RegionService,
  UserService,
  UserProgramRoleService,
  UserRoleService,
  UserProgramRole
} from 'app/core';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-user-roles-form',
  templateUrl: './user-roles-form.component.html',
  styleUrls: ['./user-roles-form.component.scss']
})
export class UserRolesFormComponent implements OnInit, OnChanges {
  @Input() userRolesData;
  @Output() newUserRolesData: EventEmitter<Object> = new EventEmitter<Object>();

  userRolesForm: FormGroup;

  // Table Data
  public userProgramRoles: UserProgramRole[];

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

  @Input() public mainLoading = false;
  @Input() public rolesLoading = false;
  @Input() public levelLoading = false;
  @Input() public csoLoading = false;
  @Input() public regionLoading = false;
  @Input() public provinceLoading = false;
  @Input() public municipalLoading = false;

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
    public ref: ChangeDetectorRef
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
    this.fetchInitialOptions();
  }

  ngOnChanges (changes) {
    this.fetchInitialOptions();
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
    console.log('Pushed');
  }

  fetchInitialOptions() {
      this.fetchUserRoles();
      this.fetchAccessLevels();
      this.fetchCSOGroups();
      this.fetchRegions();
      this.fetchUserProgramRoles();
  }

  onAccessFieldChange() {
    const controls = this.userRolesForm.controls;
    const accessValue = controls.access.value.name;

    this.resetBooleans();
    this.resetValidators();

    switch(accessValue) {
      case 'National':
        this.isNational = true;
        break;
      case '' || null:
        break;
      default:
        this.enableRegional = true;
        this.insertValidators(this.userRolesForm.controls.region);
        this.resetFormControlValues(this.userRolesForm.controls.region);
        switch (accessValue) {
          case 'Regional':
            this.isRegional = true;
            break;
          case 'Provincial':
            this.isProvincial = true;
            this.enableProvincial = true;
            this.insertValidators(this.userRolesForm.controls.province);
            this.resetFormControlValues(this.userRolesForm.controls.province);
            break;
          case 'Municipal' || 'Barangay':
            this.isMunicipal = true;
            this.enableProvincial = true;
            this.enableMunicipal = true;
            this.insertValidators(
              this.userRolesForm.controls.province,
              this.userRolesForm.controls.municipality
            );
            this.resetFormControlValues(
              this.userRolesForm.controls.province,
              this.userRolesForm.controls.municipality
            );
            break;
        }
        break;
    }
  }

  onRegionalFieldChange() {
    const controls = this.userRolesForm.controls;
    const regionValue = controls.region.value;
    const notNull = this.isNotNull(regionValue.name);

    if (!(this.isNational || this.isRegional)) {
      if (notNull) {
        this.fetchProvinces(regionValue.regionCode);
      }
    }
  }

  onProvincialFieldChange() {
    const controls = this.userRolesForm.controls;
    const provinceValue = controls.province.value;
    const notNull = this.isNotNull(provinceValue.name);

    if (!(this.isNational || this.isRegional || this.isProvincial)) {
      if (notNull) {
        this.fetchMunicipalities(provinceValue.provinceCode);
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

  resetFormControlValues(...controls: AbstractControl[]) {
    for (const control of controls) {
      control.setValue('');
    }
  }

  fetchUserRoles(): Promise<void | any[]> {
    return new Promise(async (resolve) => {
      this.rolesLoading = true;
      const roleList: any =
        await this.userRoleService
                  .getAllUserRoles()
                  .then(data => this.roles = data);
      resolve(roleList);
    }).then(() => {
      this.rolesLoading = false;
      this.ref.detectChanges();
    });
  }

  fetchAccessLevels(): Promise<void | any[]> {
    return new Promise(async (resolve) => {
      this.levelLoading = true;
      const levelList: any =
        await this.programAccessLevelService
                  .getAll()
                  .then(data => this.levels = data);
      resolve(levelList);
    }).then(() => {
      this.levelLoading = false;
      this.ref.detectChanges();
    });
  }

  fetchCSOGroups(): Promise<void | any[]> {
    return new Promise(async (resolve) => {
      this.csoLoading = true;
      const csoList: any =
        await this.csoGroupService
                  .getAllCSOGroup()
                  .then(data => this.csoGroups = data);
      resolve(csoList);
    }).then(() => {
      this.csoLoading = false;
      this.ref.detectChanges();
    });
  }

  fetchRegions(): Promise<void | any[]> {
    return new Promise(async (resolve) => {
      this.regionLoading = true;
      const regionList: any =
        await this.regionService
                  .getAll()
                  .then(data => this.regions = data);
      resolve(regionList);
    }).then(() => {
      this.regionLoading = false;
      this.ref.detectChanges();
    });
  }

  fetchProvinces(regionCode): Promise<void | any[]> {
    return new Promise(async (resolve) => {
      this.provinceLoading = true;
      const provinceList: any =
        await this.provinceService
                  .getByRegionCode(regionCode)
                  .then(data => this.provinces = data);
      resolve(provinceList);
    }).then(() => {
      this.provinceLoading = false;
      this.ref.detectChanges();
    });
  }

  fetchMunicipalities(provinceCode): Promise<void | any[]> {
    return new Promise(async (resolve) => {
      this.municipalLoading = true;
      const municipalityList: any =
        await this.municipalityService
                  .getByProvinceCode(provinceCode)
                  .then(data => this.municipalities = data);
      resolve(municipalityList);
    }).then(() => {
      this.municipalLoading = false;
      this.ref.detectChanges();
    });
  }

  fetchUserProgramRoles(): Promise<void | UserProgramRole[]> {
    return new Promise(async (resolve) => {
      this.mainLoading = true;
      const programRoles: UserProgramRole[] =
        await this.userProgramRoleService
                  .getProgramRolesByCurrentUser()
                  .then(data => this.userProgramRoles = data);
      resolve(programRoles);
    }).then(() => {
      this.mainLoading = false;
      this.ref.detectChanges();
    });
  }

  isNotNull (val) {
    if (typeof(val) === 'string') {
      return val != null || val !== '';
    } else {
      return val != null;
    }
  }
}
