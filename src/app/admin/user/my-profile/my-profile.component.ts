import { Component, OnInit } from '@angular/core';
import { UserProgramRoleService, UserProgramRole } from 'app/core';

@Component({
  selector: 'app-admin-user-myprofile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  public currentUserProgramRole: any;
  public isReady: boolean = false;

  constructor(
    public userProgramRoleService: UserProgramRoleService,
  ) {
    this.currentUserProgramRole = new UserProgramRole();
  }

  ngOnInit() {
    this.userProgramRoleService.getSelectedProgramRole().then(res => {
      if (res) { this.currentUserProgramRole.assign(res); }
      this.isReady = true;
    });
  }
}
