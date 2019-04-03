import { Injectable } from '@angular/core';
import { APIService } from './../api/api.module';

@Injectable()
export class UserCSOGroupService {

  private className = 'UserCSOGroup';

  constructor(private apiService: APIService) {}

  getByUserObjectId(objectId): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const userQ = new this.apiService.Query('User');
        userQ.equalTo('objectId', objectId);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('user', userQ);
        query.first().then(result => {
          result = result ? result.toJSON() : undefined;
          resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

}
