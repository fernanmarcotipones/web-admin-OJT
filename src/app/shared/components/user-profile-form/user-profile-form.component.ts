import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserProfileService } from 'app/core';
import { UserProfileFormValidators } from './user-profile-form.validators';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss']
})
export class UserProfileFormComponent implements OnInit {
  @Input() userProfileData;
  @Output() newUserProfileData: EventEmitter<Object> = new EventEmitter<Object>();

  userProfileForm: FormGroup;
  public currentMobileNumber: number;

  constructor(
    public fb: FormBuilder,
    public userProfileService: UserProfileService,
  ) {
    this.userProfileForm = fb.group({
      firstName: new FormControl('', [Validators.required, UserProfileFormValidators.validateAlphabetOnly, UserProfileFormValidators.validateWhiteSpaceOnly]),
      lastName: new FormControl('', [Validators.required, UserProfileFormValidators.validateAlphabetOnly, UserProfileFormValidators.validateWhiteSpaceOnly]),
      middleName: new FormControl('', [UserProfileFormValidators.validateAlphabetOnly, UserProfileFormValidators.validateWhiteSpaceOnly]),
      occupation: new FormControl('', [Validators.required, UserProfileFormValidators.validateAlphabetOnly, UserProfileFormValidators.validateWhiteSpaceOnly]),
      mobileNumber: new FormControl('', [Validators.required, UserProfileFormValidators.validateMobileNumber], this.isMobileNumberTaken.bind(this)),
      streetName: new FormControl('', [Validators.required, UserProfileFormValidators.validateWhiteSpaceOnly]),
      streetNumber: new FormControl('', [Validators.required, UserProfileFormValidators.validateNumberOnly]),
      region: new FormControl('', [Validators.required, UserProfileFormValidators.validateAlphabetOnly, UserProfileFormValidators.validateWhiteSpaceOnly]),
      province: new FormControl('', [Validators.required, UserProfileFormValidators.validateAlphabetOnly, UserProfileFormValidators.validateWhiteSpaceOnly]),
      municipality: new FormControl('', [Validators.required, UserProfileFormValidators.validateAlphabetOnly, UserProfileFormValidators.validateWhiteSpaceOnly]),
    });
  }

  ngOnInit() {
    if (this.userProfileData) {
      this.setUserProfileForm(this.userProfileData);
    }
  }

  setUserProfileForm(data) {
    Object.keys(data).map(key => {
      if (this.userProfileForm.controls[key]) {
        this.userProfileForm.controls[key].patchValue(data[key]);
      }
    });
    this.currentMobileNumber = data['mobileNumber'];
  }

  isFieldInvalid(field: string) {
    return !this.userProfileForm.get(field).valid && this.userProfileForm.get(field).touched;
  }

  trimFormValues() {
    const values = {};

    Object.keys(this.userProfileForm.value).forEach(key => {
      if (typeof this.userProfileForm.value[key] === 'string') {
        values[key] = this.userProfileForm.value[key].trim();
      }
    });

    return values;
  }

  onFieldChange() {
    const value = this.trimFormValues()
    const data = {
      value: value,
      isFormInvalid: !this.userProfileForm.valid
    }
    this.newUserProfileData.emit(data);
  }

  isMobileNumberTaken(u: FormControl) {
    const mobileNumber = parseInt(this.getMobileNumberBody(u.value), 10);
    return this.userProfileService
    .isMobileNumberExist(mobileNumber)
    .then(res => {
      return res && this.currentMobileNumber !== mobileNumber ? { mobileNumberTaken: true } : null;
    })
  }

  getMobileNumberBody(mobileNumber) {
    let mobileBody = '';

    if (typeof mobileNumber !== 'string') {
      mobileNumber = mobileNumber.toString();
    }

    if (mobileNumber) {
      if (mobileNumber[0] === '+') {
        mobileBody = mobileNumber.substring(3);
      } else if (mobileNumber[0] === '0') {
        mobileBody = mobileNumber.substring(1);
      } else if (mobileNumber[0] === '9') {
        mobileBody = mobileNumber;
      }
    }

    return mobileBody;
  }
}
