import { Component, OnInit  } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AccessLevel } from './access-level';
import { SavedAccessLevels } from './access-level-db';
import { CsoGroupFormValidators } from './cso-group-form.validators';
import { Observable, Subject} from 'rxjs/Rx';
import { RegionService, ProvinceService, MunicipalityService, BarangayService, ProgramService, ProgramAccessLevelService, Province } from 'app/core';


@Component({
  selector: 'app-cso-group-form',
  templateUrl: './cso-group-form.component.html',
  styleUrls: ['./cso-group-form.component.scss']
})
export class CsoGroupFormComponent implements OnInit {

  selectedAcessLevel: string = '';
  regionSelected: string = '';
  provinceSelected:string = '';
  barangaySelected:string = '';
  municipalitySelected: string ='';
  accessLevelSelected: string ='';

  public accessInfo = {};
  public accessLevelList = [];

  public accesslevels = [];
  public regions = [];
  public provinces = [];
  public municipalities = [];
  public barangays = [];

  public showDivs = {
    showRegionDiv:false,
    showProvinceDiv:false,
    showMunicipalDiv:false,
    showBarangayDiv:false,
  };

  public showTable = false;
 
  csoGroupForm = new FormGroup({
    csoGroupName: new FormControl('',[Validators.required,
      Validators.minLength(4), 
      CsoGroupFormValidators.validateAlphabetOnly, 
      CsoGroupFormValidators.validateWhiteSpaceOnly]),
    csoDescription: new FormControl('',Validators.required),
    csoPrivacy: new FormControl('',Validators.required),
    csoStatus: new FormControl(false),
  });

  csoAccessLevelForm = new FormGroup({
    csoAgencyProgram: new FormControl(''),
    csoAccessLevel: new FormControl('',Validators.required),
    region: new FormControl(''),
    province: new FormControl(''),
    municipality: new FormControl(''),
    barangay:new FormControl('')
  });

  constructor(private regionService: RegionService,  
    private provinceService: ProvinceService,
    private municipalityService: MunicipalityService, 
    private barangayService: BarangayService,
    private programService: ProgramService,
    private accessLevelService: ProgramAccessLevelService) {
   }


  ngOnInit() {
    this.loadAccessLevels();
  }


  isFieldInvalid(field: string) {
    return !this.csoGroupForm.get(field).valid && this.csoGroupForm.get(field).touched;
  }

  trimFormValues() {
    const values = {};

    Object.keys(this.csoGroupForm.value).forEach(key => {
      if (typeof this.csoGroupForm.value[key] === 'string') {
        values[key] = this.csoGroupForm.value[key].trim();
      }
    });

    return values;
  }
  
  onFieldChange() {
    const value = this.trimFormValues()
    const data = {
      value: value,
      isFormInvalid: !this.csoGroupForm.valid
    }
  }

  selectAccessLevel(selected: any){
    this.accessLevelSelected = selected;
    switch(this.accessLevelSelected){
      case "TJGbK1IUsC":
      this.removeLocationValidators();
      this.resetSelectFields();
      
      this.csoAccessLevelForm.controls['csoAccessLevel'].setValue(selected);
      this.setValueOfSelectToEmpty();
      this.clearLocationArray();

      this.showDivs = {
        showRegionDiv:false,
        showProvinceDiv:false,
        showMunicipalDiv:false,
        showBarangayDiv:false,
      }
      
      break;
      case "oJtwJdV48b":
        this.loadRegions();
        this.csoAccessLevelForm.controls['region'].setValidators([Validators.required]);
        this.csoAccessLevelForm.controls['province'].setValidators([]);
        this.csoAccessLevelForm.controls['municipality'].setValidators([]);
        this.csoAccessLevelForm.controls['barangay'].setValidators([]);

        this.csoAccessLevelForm.controls['province'].setValue('');
        this.csoAccessLevelForm.controls['municipality'].setValue('');
        this.csoAccessLevelForm.controls['barangay'].setValue('');
        this.provinces = [];
        this.municipalities = [];
        this.barangays = [];
        this.showDivs = {
          showRegionDiv:true,
          showProvinceDiv:false,
          showMunicipalDiv:false,
          showBarangayDiv:false,
        };

      break;
      case "R8Q4TEGbLo":
       this.loadRegions();
       this.csoAccessLevelForm.controls['region'].setValidators([Validators.required]);
       this.csoAccessLevelForm.controls['province'].setValidators([Validators.required]);
       this.csoAccessLevelForm.controls['municipality'].setValidators([]);
       this.csoAccessLevelForm.controls['barangay'].setValidators([]);

        this.csoAccessLevelForm.controls['municipality'].setValue('');
        this.csoAccessLevelForm.controls['barangay'].setValue('');
        this.municipalities = [];
        this.barangays = [];

        this.showDivs = {
          showRegionDiv:true,
          showProvinceDiv:true,
          showMunicipalDiv:false,
          showBarangayDiv:false,
        };


      break;
      case "o4E8odfV3e":
        this.loadRegions();
        this.csoAccessLevelForm.controls['region'].setValidators([Validators.required]);
        this.csoAccessLevelForm.controls['province'].setValidators([Validators.required]);
        this.csoAccessLevelForm.controls['municipality'].setValidators([Validators.required]);
        this.csoAccessLevelForm.controls['barangay'].setValidators([]);

        this.csoAccessLevelForm.controls['barangay'].setValue('');
        this.barangays = [];
        this.showDivs = {
          showRegionDiv:true,
          showProvinceDiv:true,
          showMunicipalDiv:true,
          showBarangayDiv:false,
        };
     
      break;
      case "nPH4A0oBzQ":
        this.loadRegions();

        this.csoAccessLevelForm.controls['region'].setValidators([Validators.required]);
        this.csoAccessLevelForm.controls['province'].setValidators([Validators.required]);
        this.csoAccessLevelForm.controls['municipality'].setValidators([Validators.required]);
        this.csoAccessLevelForm.controls['barangay'].setValidators([Validators.required]);

        this.showDivs = {
          showRegionDiv:true,
          showProvinceDiv:true,
          showMunicipalDiv:true,
          showBarangayDiv:true,
        };  
      break;
      default:
      this.setValueOfSelectToEmpty();
      break;
    } 
  }

  selectedRegion(selected: any){
    this.regionSelected = selected; // get selected option
    this.csoAccessLevelForm.controls['province'].reset();
    this.csoAccessLevelForm.controls['municipality'].reset();
    this.csoAccessLevelForm.controls['barangay'].reset();

    this.csoAccessLevelForm.controls['province'].setValue('');
    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue('');

    this.loadProvinces();
  }
  selectedProvince(selected: any){
    this.provinceSelected = selected; // get selected option
    this.csoAccessLevelForm.controls['municipality'].reset();
    this.csoAccessLevelForm.controls['barangay'].reset();

    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue('');

    this.loadMunicipalities();  
  }
  selectedMunicipality(selected: any){
    this.municipalitySelected = selected; // get selected option

    this.csoAccessLevelForm.controls['barangay'].reset();
    this.csoAccessLevelForm.controls['barangay'].setValue('');

    this.loadBarangays();
  }
  selectedBarangay(selected: any){
    this.barangaySelected = selected; // get selected option


  }
  
  async loadAccessLevels() {
    this.accesslevels = await this.accessLevelService.getAll();
  }
  async loadRegions() {
    this.regions = await this.regionService.getAll();
  }
  async loadProvinces(){
    this.provinces = await this.provinceService.getByRegionObjectId(this.regionSelected);
  }
  async loadMunicipalities(){
    this.municipalities = await this.municipalityService.getByProvinceObjectId(this.provinceSelected);
  }
  async loadBarangays(){
    this.barangays = await this.barangayService.getByMunicipalityObjectId(this.municipalitySelected);
  }

  clearLocationArray(){
    //to clear past values (avoid bugs)
    this.regions = [];
    this.provinces = [];
    this.municipalities = [];
    this.barangays = [];
  }

  resetSelectFields(){
    //para di agad bumubungad yung error message
    this.csoAccessLevelForm.controls['csoAccessLevel'].reset();
    this.csoAccessLevelForm.controls['region'].reset();
    this.csoAccessLevelForm.controls['province'].reset();
    this.csoAccessLevelForm.controls['municipality'].reset();
    this.csoAccessLevelForm.controls['barangay'].reset();
  }

  setValueOfSelectToEmpty(){
    //to clear form
    this.csoAccessLevelForm.controls['region'].setValue('');
    this.csoAccessLevelForm.controls['province'].setValue('');
    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue(''); 
  }


  removeLocationValidators(){
    //to remove validators
    this.csoAccessLevelForm.controls['region'].setValidators([]);
    this.csoAccessLevelForm.controls['province'].setValidators([]);
    this.csoAccessLevelForm.controls['municipality'].setValidators([]);
    this.csoAccessLevelForm.controls['barangay'].setValidators([]);
  }

  //ADD ACCESS LEVEL BUTTON FUNCTION
 async saveAccessLevel(){
    this.accessInfo = {}
   
    if (this.csoAccessLevelForm.value.csoAccessLevel) {
      this.accessInfo['level'] = await this.accessLevelService.getByObjectId(this.csoAccessLevelForm.value.csoAccessLevel)
    }
    if (this.csoAccessLevelForm.value.region) {
      await this.regionService.getById(this.csoAccessLevelForm.value.region).subscribe(async(res) => {
        this.accessInfo['region'] =  await res.result[0].toJSON();
      })
    }
    if (this.csoAccessLevelForm.value.province) {
      await  this.provinceService.getById(this.csoAccessLevelForm.value.province).subscribe(async(res) => {
       this. accessInfo['province'] = await res.result[0].toJSON();
      }) 
    }
    if (this.csoAccessLevelForm.value.municipality) {
      await this.municipalityService.getById(this.csoAccessLevelForm.value.municipality).subscribe(async(res) => {
        this.accessInfo['municipality'] = await res.result[0].toJSON();
      })
    }
    if (this.csoAccessLevelForm.value.barangay) {
      await this.barangayService.getById(this.csoAccessLevelForm.value.barangay).subscribe(async(res) => {
        this.accessInfo['barangay'] = await res.result[0].toJSON();
      })
    }
    
    this.csoAccessLevelForm.controls['csoAgencyProgram'].setValue('DPWH sample'); 
    this.accessLevelList.push(this.accessInfo); //push ^ data to database 

    this.resetSelectFields();
    this.clearLocationArray();
    this.setValueOfSelectToEmpty();

    this.showDivs = {
      showRegionDiv:false,
      showProvinceDiv:false,
      showMunicipalDiv:false,
      showBarangayDiv:false,
    };
    this.removeLocationValidators();

    this.loadAccessLevels();
  }

 
  onSubmit() {
    // TODO: Use EventEmitter with form value
  };
  

}
