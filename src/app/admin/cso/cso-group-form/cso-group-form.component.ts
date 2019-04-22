import { Component, OnInit  } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AccessLevel } from './access-level';
import { SavedAccessLevels } from './access-level-db';


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

  saveds = SavedAccessLevels;

  csoGroupForm = new FormGroup({
    csoGroupName: new FormControl(''),
    csoDescription: new FormControl(''),
    csoPrivacy: new FormControl(''),
    csoStatus: new FormControl(false),
  });

  csoAccessLevelForm = new FormGroup({
    csoAgencyProgram: new FormControl(''),
    csoAccessLevel: new FormControl('National'),
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
  selectedAccessLevel(selected: any){
    this.accessLevelSelected = selected;
    switch(this.accessLevelSelected){
      case "National":
      this.csoAccessLevelForm.controls['region'].setValue('');
      this.csoAccessLevelForm.controls['province'].setValue('');
      this.csoAccessLevelForm.controls['municipality'].setValue('');
      this.csoAccessLevelForm.controls['barangay'].setValue('');
      this.regions = []; //TO CLEAR THE ARRAYLIST TO AVOID BUGS(yung lumang sublocations nagshoshow pag nagpalitan yung location)
      this.provinces = [];
      this.municipalities = [];
      this.barangays = [];
      break;
      case "Regional":
        this.loadRegions();
        this.csoAccessLevelForm.controls['province'].setValue('');
        this.csoAccessLevelForm.controls['municipality'].setValue('');
        this.csoAccessLevelForm.controls['barangay'].setValue('');
        this.provinces = [];
        this.municipalities = [];
        this.barangays = [];
      break;
      case "Provincial":
       this.loadRegions();
        this.csoAccessLevelForm.controls['municipality'].setValue('');
        this.csoAccessLevelForm.controls['barangay'].setValue('');
        this.municipalities = [];
        this.barangays = [];
      break;
      case "Municipal":
        this.loadRegions();      
        this.csoAccessLevelForm.controls['barangay'].setValue('');
        this.barangays = [];
      break;
      case "Barangay":
        this.loadRegions();      
      break;
    } 
  }

  selectedRegion(selected: any){
    this.regionSelected = selected; // get selected option
    this.splittedRegion = this.regionSelected.split(','); // MAKE AN ARRAY USING THE VALUE OF OPTION
    this.csoAccessLevelForm.controls['province'].setValue('');
    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue('');
    this.loadProvinces();
  }
  selectedProvince(selected: any){
    this.provinceSelected = selected; // get selected option
    this.splittedProvince = this.provinceSelected.split(','); // MAKE AN ARRAY USING THE VALUE OF OPTION
    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue('');
    this.loadMunicipalities();  
  }
  selectedMunicipality(selected: any){
    this.municipalitySelected = selected; // get selected option
    this.splittedMunicipality = this.municipalitySelected.split(','); // MAKE AN ARRAY USING THE VALUE OF OPTION
    this.loadBarangays();
    this.csoAccessLevelForm.controls['barangay'].setValue('');
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

  onAddAccessLevel(){
    this.csoAccessLevelForm.controls['region'].setValue(this.splittedRegion); 
    this.csoAccessLevelForm.controls['province'].setValue(this.splittedProvince); 
    this.csoAccessLevelForm.controls['municipality'].setValue(this.splittedMunicipality); 
    this.csoAccessLevelForm.controls['barangay'].setValue(this.splittedBarangay); 
    this.csoAccessLevelForm.controls['csoAgencyProgram'].setValue('DPWH'); //for testing
    SavedAccessLevels.push(this.csoAccessLevelForm.value); //push data to database

    //to clear form
    this.csoAccessLevelForm.controls['csoAccessLevel'].setValue('');
    this.csoAccessLevelForm.controls['region'].setValue('');
    this.csoAccessLevelForm.controls['province'].setValue('');
    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue(''); 
    
    //to clear past value
    this.regions = [];
    this.provinces = [];
    this.municipalities = [];
    this.barangays = [];
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    // console.log(this.csoGroupForm.value);
  }
  
 

}
