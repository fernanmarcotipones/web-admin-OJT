import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'app/core';
import { UserAccountFormValidators } from './user-account-form.validators';

@Component({
  selector: 'app-user-account-form',
  templateUrl: './user-account-form.component.html',
  styleUrls: ['./user-account-form.component.scss']
})
export class UserAccountFormComponent implements OnInit {
  @Input() userData;
  @Input() isProjectAdmin;
  @Output() newUserAccountData: EventEmitter<Object> = new EventEmitter<Object>();

  public currentUsername: string;
  public currentEmail: string;
  userAccountForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public userService: UserService,
  ) {
    this.userAccountForm = fb.group({
      email: new FormControl('', [Validators.required, Validators.email], this.isEmailTaken.bind(this)),
      username: new FormControl('', [Validators.required, UserAccountFormValidators.validateWhiteSpaceOnly], this.isUsernameTaken.bind(this)),
      newPassword: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    if (this.userData) {
      this.setUserAccountForm(this.userData)
      this.currentUsername = this.userData.username;
      this.currentEmail = this.userData.email;
    }
  }

  setUserAccountForm(data) {
    Object.keys(data).map(key => {
      if (this.userAccountForm.controls[key]){
        this.userAccountForm.controls[key].patchValue(data[key]);
      }
    });
  }

  trimFormValues() {
    let values = {};

    Object.keys(this.userAccountForm.value).forEach(key => {
      if (typeof this.userAccountForm.value[key] === 'string') {
        values[key] = this.userAccountForm.value[key].trim();
      }
    });

    return values;
  }

  onFieldChange() {
    const value = this.trimFormValues();
    const data = {
      value: value,
      isFormInvalid: (!this.userAccountForm.valid || this.isPasswordInvalid())
    }
    this.newUserAccountData.emit(data);
  }
  
  isFieldInvalid(field: string) {
    return !this.userAccountForm.get(field).valid && this.userAccountForm.get(field).touched;
  }

  isPasswordInvalid() {
    return (this.userAccountForm.get('newPassword').touched && this.userAccountForm.get('newPassword').dirty)
     && (this.userAccountForm.get('newPassword').value !== this.userAccountForm.get('repeatPassword').value);
  }

  isUsernameTaken(u: FormControl) {
    const username = u.value;
    return this.userService
    .isUsernameExist(username)
    .then(res => {
      return res && this.currentUsername.toUpperCase() !== username.toUpperCase() ? { usernameTaken: true } : null;
    })
  }

  isEmailTaken(u: FormControl) {
    const email = u.value;
    return this.userService
    .isEmailExist(email)
    .then(res => {
      return res && this.currentEmail.toUpperCase() !== email.toUpperCase() ? { emailTaken: true } : null;
    })
  }

}
