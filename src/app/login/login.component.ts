import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, CurrentUserService, CurrentProgramConfigurationService} from 'app/core';


import { Constants } from '../shared/constants';

import { ParseErrorCodes } from '../shared/parse-error-codes';
import { async } from '@angular/core/testing';

declare let ga: Function;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;
  public alerts: any = [];
  public loading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private currentUserService: CurrentUserService,
    private currentProgramConfigurationService: CurrentProgramConfigurationService,
    private router: Router) {
  }

  ngOnInit() {
    this.authenticationService.isAuthorized().first().subscribe(isAuthorized => {
      this.goto();
    });
  }

  submit() {
    this.login();
  }

  login = async () => {
    this.loading = true;
    if (this.username === '' || this.password === '') {
      return;
    }

    this.authenticationService.login(this.username, this.password)
        .subscribe(async(user) => {
          await this.currentUserService.update();
          await this.currentProgramConfigurationService.update();
          this.goto();
        }


    // this.authenticationService.login(this.username, this.password).first().subscribe(user => {
    //   // this.gaService.set('userId', user.id);
    //   // this.gaService.set('dimension1', null);
    //   // this.gaService.set('dimension2', null);
    //   // this.gaService.set('dimension3', null);
    //   // this.gaService.set('dimension4', null);
    //   // this.gaService.set('dimension5', null);
    //   // this.gaService.set('dimension6', null);
    //   // this.gaService.set('dimension7', null);
    //   // this.gaService.set('dimension8', null);
    //   // this.gaService.set('dimension9', null);
    //   // this.gaService.set('dimension10', null);
    //   //  this.appProgramConfigurationService.onDataChange({'key': 'value'});
    //   this.goto();
    // }
    , error => {
      this.loading = false;
      // this.gaService.event.emit({
      //   category: 'Authentication',
      //   action: 'Login',
      //   label: 'Failed'
      // })
      switch (error.code) {
        case ParseErrorCodes.OBJECT_NOT_FOUND:
          this.alerts.push({
            type: 'danger',
            msg: `<strong> Warning! </strong> Invalid username/password.`,
            timeout: Constants.ALERT_TIMEOUT
          })
          break;
        case ParseErrorCodes.CONNECTION_FAILED:
          this.alerts.push({
            type: 'danger',
            msg: `<strong> Warning! </strong> Unable to connect to server. Please check your connection`,
            timeout: Constants.ALERT_TIMEOUT
          })
          break;
        default:
          break;
      }
    })

  }

  goto() {
    // this.gaService.event.emit({
    //   category: 'Authentication',
    //   action: 'Login',
    //   label: 'Success'
    // })
    this.router.navigate(['/']);
    this.loading = false;
  }

}
