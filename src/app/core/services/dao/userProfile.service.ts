import {Injectable} from '@angular/core';

import { APIService } from '../api/api.service';
import { UserProfile } from '../../models/user-profile';

@Injectable()
export class UserProfileService {

  private className = 'UserProfile'

  constructor(private apiService: APIService) {
  }
  getAll(): Promise<any[]> {
    let userProfile = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.ascending('lastName');
        userProfile = await query.find();
        userProfile = userProfile.map(data => data.toJSON());
        resolve(userProfile);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });

  }

  create(newData: any): Promise<any> {
    let returnVal = {};
    return new Promise((resolve, reject) => {
      try {
        const userProfile = new UserProfile();
        userProfile.assign(newData);
        this.apiService.create(this.className, userProfile).subscribe(res => {
          returnVal['isSuccess'] = true;
          returnVal['userProfileData'] = res;
          resolve(returnVal);
        });
      } catch (error) {
        reject(error);
      }
    })
  }

  updateByUserProfileId(userProfileId: string, newData: any): Promise<any> {
    let returnVal = {};
    return new Promise((resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('objectId', userProfileId)
        query.first().then(async res => {
          const currentUserProfileObject = res;
          Object.keys(newData).forEach(key => {
            currentUserProfileObject.set(key, newData[key]);
          });
          await currentUserProfileObject.save()

          returnVal['isSuccess'] = true;
          returnVal['userProfileData'] = currentUserProfileObject;

          resolve(returnVal);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  isMobileNumberExist(mobileNumber: number): Promise<boolean> {
    let returnVal = false;
    return new Promise((resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('mobileNumber', mobileNumber);
        query.first().then(user => {
          if (user) { returnVal = true; }
          resolve(returnVal);
        });
      } catch (error) {
        reject(error);
      }
    });
  }


}
