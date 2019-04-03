import { Component, OnInit } from '@angular/core';

import { APIService, UserService } from 'app/core';
import { Constants } from '../shared/constants';
import { NotificationToastrService } from 'app/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public email: string;
  public alerts: any = [];
  public loading = false;
  public disableSubmitButton = false;

  constructor(
    private apiService: APIService,
    public userService: UserService,
    public notification: NotificationToastrService,
    private location: Location,
  ) { }

  ngOnInit() {
  }

  async submit() {
    this.loading = true;
    this.disableSubmitButton = true;
    const isEmailExist = await this.userService.isEmailExist(this.email);
    if (isEmailExist) {
      this.sendForgotPasswordEmail();
    }else {
      this.notification.alert('error', 'Account with this email does not exist');
      this.loading = false;
      this.disableSubmitButton = false;
    }
  }

  sendForgotPasswordEmail() {
    this.apiService.Cloud.run('sendForgotPasswordEmail', {email: this.email}).then(res => {
      this.notification.alert('success', 'Sent! Check your email to reset your password');
      this.loading = false;
    }).catch(err => {
      this.notification.alert('error', err);
      this.loading = false;
    });
    setTimeout(() => {
      this.disableSubmitButton = false;
    }, Constants.FORGOT_PASSWORD_INTERVAL);
  }

  back() {
    this.location.back(); // <-- go back to previous location on cancel/back
  }

}
