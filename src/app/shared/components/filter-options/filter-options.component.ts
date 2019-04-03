import { Component, OnInit, OnChanges, Input, Output, EventEmitter, Renderer2, } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {
  RegionService,
  ProvinceService,
  MunicipalityService,
  BarangayService,
  FormService,
  ProgramMonitoringFormService,
  CSOGroupService,
  SearchFilterService,
  UserRoleService,
  APIService
} from 'app/core';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'app-filter-options',
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.scss']
})
export class FilterOptionsComponent implements OnInit, OnChanges {
  @Input() filterConfig;
  @Input() activeUserProgramRole;
  @Input() defaultFilterValues;
  @Input() csoGroup;

  @Output() filterValues: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() filterLoaded: EventEmitter<Object> = new EventEmitter<Object>();

  public filterForm: FormGroup;

  public isFilterLoaded = false;
  public fetchingFiscalYears = false;
  public fetchingProjectStatuses = false;
  public fetchingProjectType = false;
  public fetchingProjectSubType = false;
  public fetchingRegions = false;
  public fetchingProvinces = false;
  public fetchingMunicipalities = false;
  public fetchingBarangays = false;
  public fetchingProgramForm = false;
  public fetchingForm = false;
  public fetchingCSOGroups = false;
  public fetchingRoles = false;

  private disabledProgramField = false;
  private disabledRegionField = false;
  private disabledProvinceField = false;
  private disabledDistrictField = false;
  private disabledMunicipalityField = false;
  private disabledBarangayField = false;
  public disabledCSOGroupField: boolean;

  private projectTypes = [];
  private projectSubTypes = [];
  private projectStatuses = [];
  private regions = [];
  private provinces = [];
  private districtLevels = Constants.DISTRICT_LEVELS;
  private municipalities = [];
  private barangays = [];
  private fiscalYears = [];
  private programForms = [];
  private forms = [];
  private reportStatuses = Constants.CSO_REPORT_STATUSES;
  private feedbackStatuses = Constants.FEEDBACK_STATUSES;
  private hasFeedback = Constants.HAS_FEEDBACK;
  private userActivation = Constants.USER_ACTIVATION;
  private userVerification = Constants.USER_VERIFICATION;
  private csoGroups = [];
  private roles = [];
  private points = [];

  // NOTE: using this, onchange event on date range input has bug
  private dateRange: any[];

  constructor(
    private regionService: RegionService,
    private provinceService: ProvinceService,
    private municipalityService: MunicipalityService,
    private barangayService: BarangayService,
    private formService: FormService,
    private programMonitoringFormService: ProgramMonitoringFormService,
    private csoGroupService: CSOGroupService,
    private userRoleService: UserRoleService,
    public searchFilterService: SearchFilterService,
    public router: Router,
    private apiService: APIService,
    public renderer2: Renderer2,
  ) {
    if (!router.navigated) {
      this.apiService.clearCache();
    }
    this.filterForm = new FormGroup({
      referenceNumber: new FormControl(''),
      name: new FormControl(''),
      searchKey: new FormControl(''),
      userSearchKey: new FormControl(''),
      projectType: new FormControl(''),
      projectSubType: new FormControl(''),
      projectStatus: new FormControl(''),
      region: new FormControl(''),
      province: new FormControl(''),
      districtLevel: new FormControl(''),
      municipality: new FormControl(''),
      barangay: new FormControl(''),
      dateRange: new FormControl(''),
      fiscalYear: new FormControl(''),
      programForm: new FormControl(''),
      form: new FormControl(''),
      reportStatus: new FormControl(''),
      feedbackStatus: new FormControl(''),
      feedbackPoint: new FormControl(''),
      csoGroup: new FormControl(''),
      hasFeedback: new FormControl(''),
      userVerification: new FormControl(''),
      userActivation: new FormControl(''),
      role: new FormControl(''),
    });
  }

  ngOnInit() {

  }

  onBlurDateRange() {
    this.renderer2.removeStyle(document.body, 'overflow');
  }

  onFocusDateRange() {
    this.renderer2.setStyle(document.body, 'overflow', 'hidden');
  }

  setDefaultSearchFilterValues() {
    if (this.defaultFilterValues) {
      if (this.defaultFilterValues.program !== this.activeUserProgramRole['program'].objectId) {
        this.defaultFilterValues = {};
      } else {
        if (this.defaultFilterValues.referenceNumber) {
          this.filterForm.controls['referenceNumber'].setValue(this.defaultFilterValues.referenceNumber.trim())
        }
        if (this.defaultFilterValues.regionId && !this.disabledRegionField) {
          this.filterForm.controls['region'].setValue(this.defaultFilterValues.regionId)
          this.loadProvinces(this.defaultFilterValues.regionId);
        }
        if (this.defaultFilterValues.provinceId && !this.disabledProvinceField) {
          this.filterForm.controls['province'].setValue(this.defaultFilterValues.provinceId)
          this.loadMunicipalities(this.defaultFilterValues.provinceId);
        }
        if (this.defaultFilterValues.municipalityId && !this.disabledMunicipalityField) {
          this.filterForm.controls['municipality'].setValue(this.defaultFilterValues.municipalityId)
          this.loadBarangays(this.defaultFilterValues.municipalityId);
        }
        if (this.defaultFilterValues.districtLevel && !this.disabledDistrictField) {
          this.filterForm.controls['districtLevel'].setValue(this.defaultFilterValues.districtLevel)
        }
        if (this.defaultFilterValues.barangayId && !this.disabledBarangayField) {
          this.filterForm.controls['barangay'].setValue(this.defaultFilterValues.barangayId)
        }
        if (this.defaultFilterValues.fiscalYear) {
          this.filterForm.controls['fiscalYear'].setValue(this.defaultFilterValues.fiscalYear)
        }
        if (this.defaultFilterValues.programForm) {
          this.filterForm.controls['programForm'].setValue(this.defaultFilterValues.programForm)
        }
        if (this.defaultFilterValues.projectStatus) {
          this.filterForm.controls['projectStatus'].setValue(this.defaultFilterValues.projectStatus)
        }
        if (this.defaultFilterValues.form) {
          this.loadPoints(this.defaultFilterValues.form)
          this.filterForm.controls['form'].setValue(this.defaultFilterValues.form)
        }
        if (this.defaultFilterValues.reportStatus) {
          this.filterForm.controls['reportStatus'].setValue(this.defaultFilterValues.reportStatus)
        }
        if (this.defaultFilterValues.feedbackStatus) {
          this.filterForm.controls['feedbackStatus'].setValue(this.defaultFilterValues.feedbackStatus)
        }
        if (this.defaultFilterValues.feedbackPoint) {
          this.filterForm.controls['feedbackPoint'].setValue(this.defaultFilterValues.feedbackPoint)
        }
        if (this.defaultFilterValues.name) {
          this.filterForm.controls['name'].setValue(this.defaultFilterValues.name.trim())
        }
        if (this.defaultFilterValues.searchKey) {
          this.filterForm.controls['searchKey'].setValue(this.defaultFilterValues.searchKey.trim())
        }
        if (this.defaultFilterValues.csoGroup) {
          this.filterForm.controls['csoGroup'].setValue(this.defaultFilterValues.csoGroup)
        }
        if (this.defaultFilterValues.hasFeedback !== '') {
          this.filterForm.controls['hasFeedback'].setValue(this.defaultFilterValues.hasFeedback)
        }
        if (this.defaultFilterValues.userSearchKey) {
          this.filterForm.controls['userSearchKey'].setValue(this.defaultFilterValues.userSearchKey.trim())
        }
        if (this.defaultFilterValues.userActivation !== '') {
          this.filterForm.controls['userActivation'].setValue(this.defaultFilterValues.userActivation)
        }
        if (this.defaultFilterValues.userVerification !== '') {
          this.filterForm.controls['userVerification'].setValue(this.defaultFilterValues.userVerification)
        }
        if (this.defaultFilterValues.role !== '') {
          this.filterForm.controls['role'].setValue(this.defaultFilterValues.role)
        }
      }
    }
  }

  async loadProgramForm(programId) {
    if (this.filterConfig.programForm) {
      this.fetchingProgramForm = true;
      this.filterForm.controls['programForm'].setValue('');
      this.filterForm.controls['form'].setValue('');
      this.programForms = []
      this.programForms = await this.programMonitoringFormService.getByProgramObjectId(programId)
      this.fetchingProgramForm = false;
    }
  }

  // NOTE :
  // id represents programFormId if monitoringForm is true
  // id represents programId if feedbackForm is true
  async loadForm(id) {
    if (this.filterConfig.monitoringForm || this.filterConfig.feedbackForm) {
      this.fetchingForm = true;
      this.filterForm.controls['form'].setValue('');
      this.forms = [];

      if (this.filterConfig.monitoringForm) {
        const selectedProgramForm = this.programForms
          .filter(programForm => programForm.objectId === id);
        this.forms = selectedProgramForm[0] ? selectedProgramForm[0].forms : [];
      } else if (this.filterConfig.feedbackForm) {
        this.forms = await this.formService.getByProgramObjectId(id, 'FEEDBACK');
      }

      this.fetchingForm = false;
    }
    this.changeFilter();
  }

  async loadPoints(formId) {
    if (this.filterConfig.feedbackPoint) {
      this.filterForm.controls['feedbackPoint'].setValue('');
      const form = this.forms.filter(form => form.objectId === formId)[0]
      if (form && form.fields.metadata.maxPoint) {
        const maxPoint = form.fields.metadata.maxPoint + 1;
        this.points = Array(maxPoint).fill(0).map((x, i) => i);
      } else {
        this.points = [];
      }
    }
    this.changeFilter();
  }

  async loadCSOGroups() {
    if (this.filterConfig.csoGroup) {
      this.fetchingCSOGroups = true;
      this.filterForm.controls['csoGroup'].setValue('');
      this.csoGroups = [];
      this.csoGroups = await this.csoGroupService.getAllCSOGroup();
      this.fetchingCSOGroups = false;
      this.changeFilter();
    }
  }

  async loadRoles() {
    if (this.filterConfig.role) {
      this.fetchingRoles = true;
      this.filterForm.controls['role'].setValue('');
      this.roles = [];
      const roleId = this.activeUserProgramRole.role.objectId;
      this.roles = await this.userRoleService.getUserRolesByRoleId(roleId);
      this.fetchingRoles = false;
      this.changeFilter();
    }
  }

  async loadRegions() {
    if (this.filterConfig.region) {
      this.fetchingRegions = true;
      this.filterForm.controls['region'].setValue('');
      this.provinces = [];
      this.municipalities = [];
      this.barangays = [];

      this.regions = await this.regionService.getAll();
      this.fetchingRegions = false;
    }
  }

  async loadProvinces(objectId) {
    if (this.filterConfig.province) {
      this.fetchingProvinces = true;
      this.filterForm.controls['province'].setValue('');
      this.filterForm.controls['districtLevel'].setValue('');
      this.filterForm.controls['municipality'].setValue('');
      this.filterForm.controls['barangay'].setValue('');

      this.provinces = [];
      this.municipalities = [];
      this.barangays = [];
      this.provinces = await this.provinceService.getByRegionObjectId(objectId);
      this.fetchingProvinces = false;
    }
    this.changeFilter();
  }

  async loadByDistrict(level) {
    if (this.filterConfig.district) {
      this.changeFilter();
    }
  }

  async loadMunicipalities(objectId) {
    if (this.filterConfig.municipality) {
      this.fetchingMunicipalities = true;
      this.filterForm.controls['municipality'].setValue('');
      this.filterForm.controls['barangay'].setValue('');

      this.municipalities = [];
      this.barangays = [];
      this.municipalities = await this.municipalityService.getByProvinceObjectId(objectId);
      this.fetchingMunicipalities = false;
    }
    this.changeFilter();
  }

  async loadBarangays(objectId) {
    if (this.filterConfig.barangay) {
      this.fetchingBarangays = true;
      this.filterForm.controls['barangay'].setValue('');
      this.barangays = [];
      this.barangays = await this.barangayService.getByMunicipalityObjectId(objectId);
      this.fetchingBarangays = false;
    }
    this.changeFilter();
  }

  async loadProjectFiscalYears() {
    if (this.filterConfig.fiscalYear) {
      this.fetchingFiscalYears = true;
      // this.filterForm.controls['fiscalYear'].setValue('');
      this.fiscalYears = [2015, 2016, 2017, 2018];
      // TODO : Avoid getting objects which uses masterkey
      // this.fiscalYears = await this.projectService.getProjectFiscalYearByProgramId(
      //   this.activeUserProgramRole['program']['objectId']
      // );
      this.fetchingFiscalYears = false;
    }
  }

  setSearchFormBasedOnUserAccessLevel(): Promise<any> {
    this.setFilterLoaded(false);
    return new Promise(async (resolve, reject) => {
      try {
        const accessLevel = this.activeUserProgramRole ? this.activeUserProgramRole['level'] : {};
        this.enableFieldsBasedOnLevel(accessLevel);

        await this.loadRegions();
        await this.loadProjectFiscalYears();
        await this.loadCSOGroups();
        await this.loadRoles();

        if (this.activeUserProgramRole['program']) {
          if (this.filterConfig.monitoringForm) {
            await this.loadProgramForm(this.activeUserProgramRole['program']['objectId']);
          } else if (this.filterConfig.feedbackForm) {
            await this.loadForm(this.activeUserProgramRole['program']['objectId']);
          }
        }

        if (this.activeUserProgramRole['region']) {
          await this.loadProvinces(this.activeUserProgramRole['region']['objectId'])
          this.filterForm.controls['region'].setValue(this.activeUserProgramRole['region']['objectId']);
        }

        if (this.activeUserProgramRole['province']) {
          await this.loadMunicipalities(this.activeUserProgramRole['province']['objectId']);
          this.filterForm.controls['province'].setValue(this.activeUserProgramRole['province']['objectId']);
        }

        if (this.activeUserProgramRole['district'] || this.activeUserProgramRole['district'] === 0) {
          this.filterForm.controls['districtLevel'].setValue(this.activeUserProgramRole['district']);
        }

        if (this.activeUserProgramRole['municipality']) {
          await this.loadBarangays(this.activeUserProgramRole['municipality']['objectId']);
          this.filterForm.controls['municipality'].setValue(this.activeUserProgramRole['municipality']['objectId']);
        }

        if (this.activeUserProgramRole['barangay']) {
          this.filterForm.controls['barangay'].setValue(this.activeUserProgramRole['barangay']['objectId']);
        }
        if (this.activeUserProgramRole['csoGroup']) {
          this.disabledCSOGroupField = true;
          this.filterForm.controls['csoGroup'].setValue(this.activeUserProgramRole['csoGroup']['objectId']);
        }

        this.setDefaultSearchFilterValues();

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  enableFieldsBasedOnLevel(accessLevel) {
    this.disabledRegionField = false;
    this.disabledProvinceField = false;
    this.disabledDistrictField = false;
    this.disabledMunicipalityField = false;
    this.disabledBarangayField = false;

    if (accessLevel['name']) {
      switch (accessLevel['name']) {
        case Constants.NATIONAL_ACCESS_LEVEL:
          break;
        case Constants.REGIONAL_ACCESS_LEVEL:
          this.disabledRegionField = true;
          break;
        case Constants.PROVINCIAL_ACCESS_LEVEL:
          this.disabledRegionField = true;
          this.disabledProvinceField = true;
          break;
        case Constants.MUNICIPAL_ACCESS_LEVEL:
          this.disabledRegionField = true;
          this.disabledProvinceField = true;
          this.disabledDistrictField = true;
          this.disabledMunicipalityField = true;
          break;
        default:
          this.disabledRegionField = true;
          this.disabledProvinceField = true;
          this.disabledDistrictField = true;
          this.disabledMunicipalityField = true;
          this.disabledBarangayField = true;
          break;
      }
    }

  }

  getFilterValues(): any {
    const filterValue = {
      referenceNumber: this.filterForm.get('referenceNumber').value,
      program: this.activeUserProgramRole ? this.activeUserProgramRole['program']['objectId'] : null,
      regionId: this.filterForm.get('region').value,
      provinceId: this.filterForm.get('province').value,
      districtLevel: this.filterForm.get('districtLevel').value,
      municipalityId: this.filterForm.get('municipality').value,
      barangayId: this.filterForm.get('barangay').value,
      fiscalYear: this.filterForm.get('fiscalYear').value,
      projectType: this.filterForm.get('projectType').value,
      projectSubType: this.filterForm.get('projectSubType').value,
      projectStatus: this.filterForm.get('projectStatus').value,
      programForm: this.filterForm.get('programForm').value,
      form: this.filterForm.get('form').value,
      reportStatus: this.filterForm.get('reportStatus').value,
      feedbackStatus: this.filterForm.get('feedbackStatus').value,
      feedbackPoint: this.filterForm.get('feedbackPoint').value,
      name: this.filterForm.get('name').value,
      searchKey: this.filterForm.get('searchKey').value.trim(),
      userSearchKey: this.filterForm.get('userSearchKey').value.trim(),
      csoGroup: this.filterForm.get('csoGroup').value,
      dateRange: this.dateRange,
      hasFeedback: this.filterForm.get('hasFeedback').value,
      userActivation: this.filterForm.get('userActivation').value,
      userVerification: this.filterForm.get('userVerification').value,
      role: this.filterForm.get('role').value ? [this.filterForm.get('role').value] : this.roles.map(role => role.objectId),
    }
    return filterValue;
  }

  setFilterLoaded(value) {
    this.isFilterLoaded = value;
    this.filterLoaded.emit(value);
  }

  async ngOnChanges(changes) {
    for (const propName in changes) {
      if (propName === 'activeUserProgramRole') {
        this.clearFilterValues();
      }
    }

    if (this.isFilterLoaded || (this.activeUserProgramRole && this.activeUserProgramRole.program)) {
      this.dateRange = null;
      await this.setSearchFormBasedOnUserAccessLevel()
        .then(() => { this.setFilterLoaded(true); this.changeFilter(); });
    }
  }

  changeFilter() {
    if (this.isFilterLoaded) {
      const filterValues = this.getFilterValues();
      this.filterValues.emit(filterValues);
    }
  }

  clearFilterValues() {
    for (const property in this.filterForm.controls) {
      if (this.filterForm.controls[property]) {
        this.filterForm.controls[property].setValue('');
      }
    }
  }

}
