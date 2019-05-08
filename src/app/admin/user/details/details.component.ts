import { Component, OnInit, Input, ViewChild,
   ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import {
  UserService, User, UserProfileService, UserProgramRoleService,
  UserProfile, NotificationToastrService, CurrentUserService
} from 'app/core';
import { Constants } from 'app/shared/constants';

@Component({
  selector: 'app-admin-user-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent implements OnInit {
  @ViewChild('activateModal') public activateModal: ModalDirective;
  @Input() userProgramRole;
  public activeTab = 'about';

  public user: any;
  public userProfile: any;
  public newData: any;

  public modalAction = '';
  public modalTab = '';

  public isLoading = false;
  public isUserDataLoaded = false;
  public isControlDisabled = false;
  public isProjectAdmin = false;

  constructor(
    public userService: UserService,
    public userProfileService: UserProfileService,
    public userProgramRoleService: UserProgramRoleService,
    public changeDetectorRef: ChangeDetectorRef,
    protected notification: NotificationToastrService,
    private currentUserService: CurrentUserService,
  ) {
    this.user = new User();
    this.userProfile = new UserProfile();
  }

  ngOnInit() {
    if (this.userProgramRole) {
      this.loadUserDetails();
    }
  }

  loadUserDetails() {
    this.isLoading = true;
    this.isUserDataLoaded = false;

    if (this.userProgramRole.user) {
      this.user.assign(this.userProgramRole.user);
      if (this.user.userProfile) {
        this.userProfile.assign(this.user.userProfile);
      }
    }
    if (this.userProgramRole.role) {
      this.isProjectAdmin = (this.userProgramRole.role.name === Constants.PROJECT_ADMIN_ROLE);
    }
    this.isLoading = false;
    this.isUserDataLoaded = true;
    this.changeDetectorRef.markForCheck();
  }

  setUserData(data) {
    if (data) {
      this.newData = data.value;
      this.isControlDisabled = data.isFormInvalid || false;
    }
  }

  updateUserData() {
    if (this.newData && Object.keys(this.newData).length > 0) {
      switch (this.activeTab) {
        case 'profile':
          if (this.user.userProfile) {
            const newUserProfileData = this.getNewUserProfileData();
            this.updateUserProfile(newUserProfileData);
          } else {
            this.createNewUserProfile(this.newData);
          }
          break;
        case 'account':
          const newUserData = this.getNewUserData();
          this.updateUserAccount(newUserData);
          break;
      }
    } else {
      this.notification.alert('info', 'No changes were made.');
      this.activateModal.hide();
    }
  }

  getNewUserData() {
    const newUserData = {};

    if (this.newData.email && (this.user.email !== this.newData.email)) {
      newUserData['email'] = this.newData.email;
    }
    if (this.isProjectAdmin && this.newData.username && (this.user.username !== this.newData.username)) {
      newUserData['username'] = this.newData.username;
    }
    if (this.isNewPasswordExist()) { newUserData['password'] = this.newData.newPassword; }

    return newUserData;
  }

  async updateUserAccount(newUserData) {
    if (newUserData && Object.keys(newUserData).length > 0) {
      this.isLoading = true;
      this.isUserDataLoaded = false;
      await this.userService.updateByUserId(this.user.objectId, newUserData).then(res => {
        if (res.isSuccess) {
          this.newData = {};
          this.userProgramRole.user = res.userData.toJSON();
          this.loadUserDetails();
          this.notification.alert('success', `Done! You successfully saved the changes.`);
        } else {
          this.notification.alert('danger', 'Warning! An error occured while updating user account.');
          this.isLoading = false;
          this.isUserDataLoaded = true;
        }
      });
    } else {
      this.notification.alert('info', 'No changes were made.');
    }
    this.activateModal.hide();
    this.scrollToTop();
  }

  getNewUserProfileData() {
    const newUserProfileData = {};

    const mobileNum = this.newData.mobileNumber ? this.getMobileNumberDetails(this.newData.mobileNumber) : '';

    if (mobileNum && mobileNum.body && (this.userProfile.mobileNumber !== parseInt(mobileNum.body, 10))) {
      newUserProfileData['mobileNumber'] = parseInt(mobileNum.body, 10);
    }
    if (this.newData.firstName && (this.userProfile.firstName !== this.newData.firstName)) {
      newUserProfileData['firstName'] = this.newData.firstName;
    }
    if (this.newData.lastName && (this.userProfile.lastName !== this.newData.lastName)) {
      newUserProfileData['lastName'] = this.newData.lastName;
    }
    if (this.userProfile.middleName !== this.newData.middleName) {
      newUserProfileData['middleName'] = this.newData.middleName;
    }
    if (this.newData.occupation && (this.userProfile.occupation !== this.newData.occupation)) {
      newUserProfileData['occupation'] = this.newData.occupation;
    }

    return newUserProfileData;
  }

  async updateUserProfile(newUserProfileData) {
    if (newUserProfileData && Object.keys(newUserProfileData).length > 0) {
      this.isLoading = true;
      this.isUserDataLoaded = false;

      await this.userProfileService.updateByUserProfileId(this.userProgramRole.user.userProfile.objectId, newUserProfileData)
        .then(async res => {
          if (res.isSuccess) {
            this.userProgramRole.user.userProfile = res.userProfileData.toJSON()
            if (newUserProfileData.mobileNumber) {
              const mobileNum = this.newData.mobileNumber ? this.getMobileNumberDetails(newUserProfileData.mobileNumber) : '';
              const newUserData = {};
              if (mobileNum['full']) { newUserData['mobileNumberFull'] = mobileNum['full'] };
              if (mobileNum['code']) { newUserData['mobileNumberCountryCode'] = mobileNum['code'] };
              this.updateUserAccount(newUserData);
            } else {
              this.newData = {};
              this.loadUserDetails();
              this.notification.alert('success', `Done! You successfully saved the changes.`);
              this.currentUserService.update();
            }
          } else {
            this.notification.alert('danger', 'Warning! An error occured while updating user profile.');
            this.isLoading = false;
            this.isUserDataLoaded = true;
          }
        });
    } else {
      this.notification.alert('info', 'No changes were made.');
    }

    this.activateModal.hide();
    this.scrollToTop();
  }

  createNewUserProfile(newUserProfileData) {
    if (newUserProfileData) {
      this.isLoading = true;
      this.isUserDataLoaded = false;
      let mobileNum: any;
      if (newUserProfileData.mobileNumber) {
        mobileNum = this.newData.mobileNumber ? this.getMobileNumberDetails(newUserProfileData.mobileNumber) : '';
        newUserProfileData.mobileNumber = parseInt(mobileNum.body, 10);
      }
      this.userProfileService.create(newUserProfileData).then(res => {
        if (res.isSuccess) {
          this.userProgramRole.user.userProfile = res.userProfileData.toJSON()
          const newUserData = {};
          if (res.userProfileData) { newUserData['userProfile'] = res.userProfileData };
          if (newUserProfileData.mobileNumber) {
            if (mobileNum['full']) { newUserData['mobileNumberFull'] = mobileNum['full'] };
            if (mobileNum['code']) { newUserData['mobileNumberCountryCode'] = mobileNum['code'] };
          }
          this.updateUserAccount(newUserData);
        } else {
          this.notification.alert('danger', 'Warning! An error occured while creating user profile.');
          this.isLoading = false;
          this.isUserDataLoaded = true;
        }
      })
    }
    this.activateModal.hide();
    this.scrollToTop();
  }

  getMobileNumberDetails(mobileNumber) {
    const mobile = {
      full: '',
      body: '',
      code: '',
    };

    if (typeof mobileNumber !== 'string') {
      mobileNumber = mobileNumber.toString();
    }

    if (mobileNumber) {
      if (mobileNumber[0] === '+') {
        mobile.code = mobileNumber.substring(1, 3);
        mobile.body = mobileNumber.substring(3);
        mobile.full = mobileNumber.substring(1);
      } else if (mobileNumber[0] === '0') {
        mobile.code = '63';
        mobile.body = mobileNumber.substring(1);
        mobile.full = '63' + mobileNumber.substring(1);
      } else if (mobileNumber[0] === '9') {
        mobile.code = '63';
        mobile.body = mobileNumber;
        mobile.full = '63' + mobileNumber;
      }
    }

    return mobile;
  }

  isNewPasswordExist() {
    let isExist = false;
    if (this.newData.newPassword && this.newData.repeatPassword) {
      isExist = this.newData.newPassword === this.newData.repeatPassword;
    }
    return isExist;
  }

  activeModal(action) {
    this.modalAction = action;
    this.activateModal.show();
  }

  confirmChangeTab(tab) {
    if (this.newData && Object.keys(this.newData).length > 0) {
      this.modalTab = tab;
      this.activeModal('confirmation');
    } else {
      this.setActiveTab(tab)
    }
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.newData = {};
  }

  isActive(tab) {
    return tab === this.activeTab;
  }

  scrollToTop() {
    document.querySelector('app-admin-user-details')
      .scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      });
  }

}
