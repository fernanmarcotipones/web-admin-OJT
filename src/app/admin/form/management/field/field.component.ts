import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'
import { FormService, ProgramService, ProjectStatusService, Project } from 'app/core';

import { Constants } from 'app/shared/constants';

@Component({
  selector: 'app-admin-form-management-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],

})
export class FieldComponent implements OnInit, OnChanges {
  @Input() currentUser

  public activeProgram: any;
  public formQuestionTypes = Constants.FORM_TYPES;
  public formStatuses = Constants.FORM_STATUSES;
  public programStatuses = [];
  public projectStatuses = [];
  public formDetailsGroup: any;
  public formAction: string;

  public showProgramField: boolean;
  public doneFetchingProgram: boolean;
  public doneFetchingProgramStatus: boolean;
  public doneFetchingProjectStatus: boolean;
  id: string
  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private programService: ProgramService,
    private projectStatusService: ProjectStatusService,
    private activatedRoute: ActivatedRoute) {

    this.formDetailsGroup = this.fb.group({
      source: ['', Validators.required],
      formTitle: ['', Validators.required],
      description: [''],
      selectedQuestionType: ['', Validators.required],
      selectedProgramType: [''],
      selectedProgramStatus: [''],
      selectedProjectStatus: [''],
      status: ['', Validators.required]
    })

  }
  async loadProgramStatuses() {
    this.programStatuses = await this.programService.getAllStatuses()
    this.doneFetchingProgramStatus = true;
  }

  async loadProjectStatuses() {
    this.projectStatuses = await this.projectStatusService.getByProgramCode(this.currentUser.activeUserProgramRole.program.programCode)
    this.doneFetchingProjectStatus = true;
  }
  showProgramProjectStatus(selected) {
    if (selected === 'PROFILE' || selected === 'SURVEY') {
      this.showProgramField = true;
      this.formDetailsGroup.controls['selectedProgramStatus'].setValidators([Validators.required])
      this.formDetailsGroup.controls['selectedProjectStatus'].setValidators([Validators.required])
      this.loadProgramStatuses()
      this.loadProjectStatuses()
    } else {
      this.showProgramField = false;
      this.formDetailsGroup.controls['selectedProgramStatus'].clearValidators()
      this.formDetailsGroup.controls['selectedProjectStatus'].clearValidators()
      this.formDetailsGroup.controls['selectedProgramStatus'].updateValueAndValidity()
      this.formDetailsGroup.controls['selectedProjectStatus'].updateValueAndValidity()
    }
  }
  isFieldInvalid(field: string) {
    return !this.formDetailsGroup.get(field).valid && this.formDetailsGroup.get(field).touched;
  }
  trimFormValues() {
    const values = {};

    Object.keys(this.formDetailsGroup.value).forEach(key => {
      if (typeof this.formDetailsGroup.value[key] === 'string') {
        values[key] = this.formDetailsGroup.value[key].trim();
      }
    });

    return values;
  }
  onFieldChange() {
    const value = this.trimFormValues();
    const data = {
      value: value,
      isFormInvalid: !this.formDetailsGroup.valid
    }

    // this.newUserAccountData.emit(data);
  }
  async getFormInformation(formId: String) {
    return await this.formService.getByObjectId(formId)
  }
  setFormValues(data) {
    // Object.keys(this.formDetailsGroup.value).map(key => {
    //   this.formDetailsGroup.patchValue({ [key]: 'Set Status' })
    // })
    this.formDetailsGroup.controls.source.patchValue(data.source, { emitEvent: false })
    this.formDetailsGroup.controls.formTitle.patchValue(data.title)
    data.description ? this.formDetailsGroup.controls.description.patchValue(data.description) : null
    this.formDetailsGroup.controls.selectedQuestionType.patchValue(data.questionType)
    this.formDetailsGroup.controls.selectedProgramStatus.patchValue(data.programStatus.name)
    this.formDetailsGroup.controls.selectedProjectStatus.patchValue(data.projectStatus.name)
    this.formDetailsGroup.controls.status.patchValue(data.status)
  }

  doneFetchingFormDependencies() { return this.doneFetchingProgram }

  ngOnInit() {
    this.activatedRoute.url.subscribe(data => {
      this.formAction = data[2].path
      if (data[2].path === 'edit') {
        this.getFormInformation(data[2].parameters.id).then(data => {
          this.setFormValues(data)
        })
      }
    })
  }
  ngOnChanges(changes) {
    if (changes.currentUser.currentValue) {
      this.activeProgram = this.currentUser.activeUserProgramRole.program.agencyCode +
        ' - ' + this.currentUser.activeUserProgramRole.program.name
      this.doneFetchingProgram = true;
    }
  }
}
