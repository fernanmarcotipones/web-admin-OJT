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
  municipalitySelected: string ='';
  accessLevelSelected: string ='';
  
  public regions = [];
  public provinces = [];
  public municipalities = [];
  public barangays = [];
  public accesslevels = [];

  saveds = SavedAccessLevels;


  csoGroupForm = new FormGroup({
    csoGroupName: new FormControl(''),
    csoDescription: new FormControl(''),
    csoPrivacy: new FormControl(''),
    csoStatus: new FormControl(false),
  });

  csoAccessLevelForm = new FormGroup({
    csoAgencyProgram: new FormControl(''),
    csoAccessLevel: new FormControl(''),
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
    // this.loadAgencies();
    this.loadAccessLevels();

  }
  selectedAccessLevel(selected: any){
    this.accessLevelSelected = selected;
    if(this.accessLevelSelected != "National"){ // Di na magloload region kapag national lang
      this.loadRegions();
    } 
  }

  selectedRegion(selected: any){
    this.regionSelected = selected; // get selected option
    console.log(this.regionSelected);
    this.csoAccessLevelForm.controls['province'].setValue('');
    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue('');
    this.loadProvinces();
  }
  selectedProvince(selected: any){
    this.provinceSelected = selected; // get selected option
    console.log(this.provinceSelected);
    this.loadMunicipalities();
    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue('');
  }
  selectedMunicipality(selected: any){
    this.municipalitySelected = selected; // get selected option
    this.loadBarangays();
    this.csoAccessLevelForm.controls['barangay'].setValue('');
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

  onAddAccessLevel(){
    this.csoAccessLevelForm.controls['csoAgencyProgram'].setValue('testing'); //for testing
    SavedAccessLevels.push(this.csoAccessLevelForm.value);
    this.csoAccessLevelForm.controls['csoAccessLevel'].setValue('');
    this.csoAccessLevelForm.controls['region'].setValue(null);
    this.csoAccessLevelForm.controls['province'].setValue('');
    this.csoAccessLevelForm.controls['municipality'].setValue('');
    this.csoAccessLevelForm.controls['barangay'].setValue('');
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    // console.log(this.csoGroupForm.value);
  }
  
 

}
