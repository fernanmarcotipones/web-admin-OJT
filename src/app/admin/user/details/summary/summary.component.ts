import { Component, OnInit, Input, } from '@angular/core';
import { UserService } from 'app/core';

@Component({
  selector: 'app-admin-user-details-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class UserDetailsSummaryComponent implements OnInit {
  @Input() user;
  public defaultImg = '/assets/img/user-placeholder.jpg';
  public userSummary = {
    isActivated: false,
    isVerified: false,
    imgUrl: this.defaultImg,
    firstName: '',
    middleName: '',
    lastName: '',
    occupation: ''
  }

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit() {
    if (this.user) {
      this.setUserSummary(this.user);
    }
  }

  setUserSummary(details) {
    if (details) {
      this.userSummary.isActivated = details.isActivated || false;
      this.userSummary.isVerified = details.isVerified || false;
      this.userSummary.imgUrl = details.userProfile && details.userProfile.photoUrl ? details.userProfile.photoUrl : this.defaultImg;
      this.userSummary.firstName = details.userProfile && details.userProfile.firstName ? details.userProfile.firstName : '';
      this.userSummary.middleName = details.userProfile && details.userProfile.middleName ? details.userProfile.middleName : '';
      this.userSummary.lastName = details.userProfile && details.userProfile.lastName ? details.userProfile.lastName : '';
      this.userSummary.occupation = details.userProfile && details.userProfile.occupation ? details.userProfile.occupation : '';
    }
  }


}
