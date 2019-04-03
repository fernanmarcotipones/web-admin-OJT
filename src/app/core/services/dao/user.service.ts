import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Page, PagedData } from '../../models';
import { Observable, Subject } from 'rxjs/Rx';

import { APIService } from '../api/api.service';


@Injectable()
export class UserService {

  public data: any;
  public userFilterData: any;

  private className = 'User';

  constructor(private apiService: APIService, private router: Router) {
    this.data = this.apiService.userInfo();
  }

  logout() {
    if (confirm('Are you sure you want to quit?')) {
      this.apiService.logout().subscribe(
        res => {
          this.router.navigate(['/login']);
        }
      );
    }
  }

  hasRole(roleName): Promise<any> {
    let roles = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.apiService.Role);
        query.equalTo('name', roleName);
        query.equalTo('users', this.apiService.User.current());
        roles = await query.find();
        resolve(roles.length > 0 ? true : false);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  }

  getAll(): Promise<any[]> {
    let users = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('User');
        query.ascending('username');
        users = await query.find();
        users = users.map(data => data.toJSON());
        resolve(users);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });

  }

  search(page: Page): Promise<PagedData<User>> {
    const pagedData = new PagedData<User>();
    let status;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className)

        const userNameQuery = new this.apiService.Query(this.className);

        if (page.filters.username && page.filters.username !== '') {
          userNameQuery.fullText('username', new RegExp(page.filters.username, 'i'));
        }
        if (page.filters.accountStatus && page.filters.accountStatus !== '') {
          if (page.filters.accountStatus === 'true') {
            status = true;
          } else {
            status = false;
          }
          query.equalTo('isActivated', status);
        }

        const userProfileQuery = new this.apiService.Query('UserProfile');

        if (page.filters.lastname && page.filters.lastname !== '') {
          userProfileQuery.fullText('lastName', page.filters.lastname)
        }

        if (page.filters.username && page.filters.username !== '') {
          query._orQuery([userNameQuery]);
        }

        if (page.filters.lastname && page.filters.lastname !== '') {
          query.matchesQuery('userProfile', userProfileQuery);
        }

        let count = 0;
        let results = [];

        const subscription = query.subscribe();

        count = await query.count();
        page.totalElements = count;
        page.totalPages = page.totalElements / page.size;
        const start = page.pageNumber * page.size;
        const end = Math.min((start + page.size), page.totalElements);

        const resultQuery = query;
        resultQuery.include('isActivated');
        resultQuery.include('userProfile');
        resultQuery.skip(start).limit(end);

        if (page.sorts.length !== 0) {
          if (page.sorts[0].dir === 'asc') {
            resultQuery.ascending(page.sorts[0].prop);
          } else {
            resultQuery.descending(page.sorts[0].prop);
          }
        }

        results = await resultQuery.find();
        results.forEach((userForm) => {
          const user = new User(userForm.toJSON());
          pagedData.data.push(user);
        })

        pagedData.page = page;
        resolve(pagedData);
      } catch (error) {
        reject(error);
      }
    });
  }

  searchByUserProgramRole(page: Page): Promise<PagedData<any>> {
    const pagedData = new PagedData<any>();
    return new Promise(async (resolve, reject) => {
      try {
        const query = await this.createQueryByFilter('UserProgramRole', page.filters);

        let count = 0;
        let results = [];
        let uniqueUserIds = [];

        const subscription = query.subscribe();

        subscription.on('delete', (data) => {
          count--;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;
          pagedData.data = pagedData.data.filter(user => user.objectId !== data.objectId);
        });

        // get count and unique user ids
        await query.distinct('user').then(res => {
          count = res.length;
          uniqueUserIds = res;
        });
        page.totalElements = count;
        page.totalPages = page.totalElements / page.size;
        const start = page.pageNumber * page.size;
        const end = Math.min((start + page.size), page.totalElements);

        results = uniqueUserIds.slice(start, end);
        results.forEach(async user => {
          await this.getByObjectId(user.objectId).then(res => {
            const item = res.toJSON();
            pagedData.data.push(item);
          })
        })

        pagedData.page = page;
        resolve(pagedData);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  createQueryByFilter(className, filters) {
    const query = new this.apiService.Query(className);

    if (className === 'UserProgramRole') {
      const mainAndQuery = [];
      const userSearchKeyOrQuery = new this.apiService.Query(className);
      const verificationOrQuery = new this.apiService.Query(className);
      const activationOrQuery = new this.apiService.Query(className);

      // search by programme
      if (filters.program && filters.program !== '') {
        const programQ = new this.apiService.Query('Program');
        programQ.equalTo('objectId', filters.program);
        query.matchesQuery('program', programQ);
      }

      // search by role
      const roleQ = new this.apiService.Query('_Role');
      roleQ.containedIn('objectId', filters.role);
      query.matchesQuery('role', roleQ);

      // search by search key
      if (filters.userSearchKey && filters.userSearchKey !== '' ) {
        const fnameQ = new this.apiService.Query('UserProfile');
        const lnameQ = new this.apiService.Query('UserProfile');
        fnameQ.matches('firstName', new RegExp(filters.userSearchKey, 'i'));
        lnameQ.matches('lastName', new RegExp(filters.userSearchKey, 'i'));

        const emailQ = new this.apiService.Query(this.className);
        const usernameQ = new this.apiService.Query(this.className);
        const userFnameQ = new this.apiService.Query(this.className);
        const userLnameQ = new this.apiService.Query(this.className);
        emailQ.matches('email', new RegExp(filters.userSearchKey, 'i'));
        usernameQ.matches('username', new RegExp(filters.userSearchKey, 'i'));
        userFnameQ.matchesQuery('userProfile', fnameQ);
        userLnameQ.matchesQuery('userProfile', lnameQ);

        const UserProgramRoleFnameQ = new this.apiService.Query(className);
        const UserProgramRoleLnameQ = new this.apiService.Query(className);
        const UserProgramRoleUsernameQ = new this.apiService.Query(className);
        const UserProgramRoleEmailQ = new this.apiService.Query(className);
        UserProgramRoleFnameQ.matchesQuery('user', userFnameQ);
        UserProgramRoleLnameQ.matchesQuery('user', userLnameQ);
        UserProgramRoleUsernameQ.matchesQuery('user', usernameQ);
        UserProgramRoleEmailQ.matchesQuery('user', emailQ);

        userSearchKeyOrQuery._orQuery([UserProgramRoleUsernameQ, UserProgramRoleFnameQ, UserProgramRoleLnameQ, UserProgramRoleEmailQ]);

        mainAndQuery.push(userSearchKeyOrQuery);
      }

      // search by verification status
      if (filters.userVerification !== '' ) {
        const verificationQueries = [];

        const verificationQ = new this.apiService.Query(this.className);
        verificationQ.equalTo('isVerified', filters.userVerification);

        const UPRVerificationQ = new this.apiService.Query(className);
        UPRVerificationQ.matchesQuery('user', verificationQ);

        verificationQueries.push(UPRVerificationQ);

        // Query for undefined value if filter looking for NOT VERIFIED
        if (!filters.userVerification) {
          const verificationNotExistQ = new this.apiService.Query(this.className);
          verificationNotExistQ.doesNotExist('isVerified');

          const UPRVerificationNotExistQ = new this.apiService.Query(className);
          UPRVerificationNotExistQ.matchesQuery('user', verificationNotExistQ);

          verificationQueries.push(UPRVerificationNotExistQ);
        }

        verificationOrQuery._orQuery(verificationQueries);

        mainAndQuery.push(verificationOrQuery);
      }

      // search by activation status
      if (filters.userActivation !== '' ) {
        const activationQueries = [];

        const activationQ = new this.apiService.Query(this.className);
        activationQ.equalTo('isActivated', filters.userActivation);

        const UPRActivationQ = new this.apiService.Query(className);
        UPRActivationQ.matchesQuery('user', activationQ);

        activationQueries.push(UPRActivationQ);

        // Query for undefined value if filter looking for INACTIVE
        if (!filters.userActivation) {
          const activationNotExistQ = new this.apiService.Query(this.className);
          activationNotExistQ.doesNotExist('isActivated');

          const UPRActivationNotExistQ = new this.apiService.Query(className);
          UPRActivationNotExistQ.matchesQuery('user', activationNotExistQ);

          activationQueries.push(UPRActivationNotExistQ);
        }

        activationOrQuery._orQuery(activationQueries);

        mainAndQuery.push(activationOrQuery);
      }

      if (mainAndQuery.length) { query._andQuery(mainAndQuery) }
    }

    return query;
  }

  getById(objectId: string): Observable<any> {
    const subject = new Subject();
    const query = new this.apiService.Query(this.className);
    query.include('username');
    query.include('email');
    query.include('isVerified');
    query.include('isActivated');
    query.include('userProfile');
    query.equalTo('objectId', objectId).limit(1)
    query.find({ useMasterKey: true }).then(res => {
      subject.next({ type: 'result', result: res[0] })
    });
    return subject;
  }

  getByObjectId(objectId: string): Promise<any> {

    return new Promise((resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.include('username');
        query.include('email');
        query.include('isVerified');
        query.include('isActivated');
        query.include('userProfile');
        query.equalTo('objectId', objectId)
        query.first({useMasterKey: true}).then(res => {
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    })
  }

  isUsernameExist(username: string): Promise<boolean> {
    let returnVal = false;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.matches('username', new RegExp('^' + username + '$', 'i'));
        query.find().then(objects => {
          if (objects.length > 0) {
            returnVal = true;
          }
          resolve(returnVal);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  isEmailExist(email: string): Promise<boolean> {
    let returnVal = false;
    return new Promise((resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.matches('email', new RegExp('^' + email + '$', 'i'));
        query.first().then(user => {
          if (user) { returnVal = true; }
          resolve(returnVal);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  updateByUserId(userId: string, newData: any): Promise<any> {
    const returnVal = {};
    return new Promise((resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('objectId', userId)
        query.first().then(async res => {
          const currentUserObject = res;
          Object.keys(newData).forEach(key => {
            currentUserObject.set(key, newData[key]);
          });
          await currentUserObject.save()

          returnVal['isSuccess'] = true;
          returnVal['userData'] = currentUserObject;

          resolve(returnVal);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // getAssignedProgram(): Promise<any> {
  //   let roles = [];
  // return  this.apiService.userInfo().toPromise();
  //   return new Promise(async(resolve, reject) => {
  //     try {
  //       this.data.toPromise();
  //       // const query = new this.apiService.Query(this.apiService.Role);
  //       // query.equalTo('name', roleName);
  //       // query.equalTo('users', this.apiService.User.current());
  //       // roles = await query.find();
  //       resolve(true);
  //     }catch (error) {
  //       reject(error);
  //     }
  //   })
  // }





}
