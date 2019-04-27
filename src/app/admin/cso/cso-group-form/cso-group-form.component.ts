import { Component, OnInit  } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AccessLevel } from './access-level';
import { SavedAccessLevels } from './access-level-db';
import { CsoGroupFormValidators } from './cso-group-form.validators';



import { RegionService, ProvinceService, MunicipalityService, BarangayService, ProgramService, ProgramAccessLevelService } from 'app/core';

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

  splittedRegion = [];
  splittedProvince = [];
  splittedMunicipality = [];
  splittedBarangay = [];

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

  saveds = SavedAccessLevels;
 
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

  clearSplittedLocationArray(){
    //to clear past values (avoid bugs)
    this.splittedRegion = [];
    this.splittedProvince = [];
    this.splittedMunicipality = [];
    this.splittedBarangay = []; 
  }

  removeLocationValidators(){
    //to remove validators
    this.csoAccessLevelForm.controls['region'].setValidators([]);
    this.csoAccessLevelForm.controls['province'].setValidators([]);
    this.csoAccessLevelForm.controls['municipality'].setValidators([]);
    this.csoAccessLevelForm.controls['barangay'].setValidators([]);
  }

  selectedAccessLevel(selected: any){
    this.accessLevelSelected = selected;
    switch(this.accessLevelSelected){
      case "National":
      this.removeLocationValidators();

      this.resetSelectFields();
      
      this.csoAccessLevelForm.controls['csoAccessLevel'].setValue('National');
      this.setValueOfSelectToEmpty();
   
      this.clearLocationArray();
      this.clearSplittedLocationArray();

      this.showDivs = {
        showRegionDiv:false,
        showProvinceDiv:false,
        showMunicipalDiv:false,
        showBarangayDiv:false,
      }
      
      break;
      case "Regional":
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
      case "Provincial":
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
      case "Municipal":
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
      case "Barangay":
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
    this.splittedRegion = this.regionSelected.split(','); // MAKE AN ARRAY USING THE VALUE OF OPTION
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
    this.splittedProvince = this.provinceSelected.split(','); // MAKE AN ARRAY USING THE VALUE OF OPTION
    this.csoAccessLevelForm.controls['municipality'].reset();
    this.csoAccessLevelForm.controls['barangay'].reset();

    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue('');

    this.loadMunicipalities();  
  }
  selectedMunicipality(selected: any){
    this.municipalitySelected = selected; // get selected option
    this.splittedMunicipality = this.municipalitySelected.split(','); // MAKE AN ARRAY USING THE VALUE OF OPTION

    this.csoAccessLevelForm.controls['barangay'].reset();
    this.csoAccessLevelForm.controls['barangay'].setValue('');

    this.loadBarangays();
  }
  selectedBarangay(selected: any){
    this.barangaySelected = selected; // get selected option
    this.splittedBarangay = this.barangaySelected.split(','); // MAKE AN ARRAY USING THE VALUE OF OPTION
  }
  
  async loadAccessLevels() {
    this.accesslevels = await this.accessLevelService.getAll();
  }
  async loadRegions() {
    this.regions = await this.regionService.getAll();
  }
  async loadProvinces(){
    this.provinces = await this.provinceService.getByRegionObjectId(this.splittedRegion[0]);
  }
  async loadMunicipalities(){
    this.municipalities = await this.municipalityService.getByProvinceObjectId(this.splittedProvince[0]);
  }
  async loadBarangays(){
    this.barangays = await this.barangayService.getByMunicipalityObjectId(this.splittedMunicipality[0]);
  }

  //ADD ACCESS LEVEL BUTTON FUNCTION
  saveAccessLevel(){

    this.clearLocationArray();

    this.csoAccessLevelForm.controls['csoAccessLevel'].setValue(this.accessLevelSelected); 
    this.csoAccessLevelForm.controls['region'].setValue(this.splittedRegion); 
    this.csoAccessLevelForm.controls['province'].setValue(this.splittedProvince); 
    this.csoAccessLevelForm.controls['municipality'].setValue(this.splittedMunicipality); 
    this.csoAccessLevelForm.controls['barangay'].setValue(this.splittedBarangay); 
    SavedAccessLevels.push(this.csoAccessLevelForm.value); //push ^ data to database

    this.resetSelectFields();
    this.setValueOfSelectToEmpty();

    this.clearSplittedLocationArray();

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
    // console.log(this.csoGroupForm.value);
  }
  

}
