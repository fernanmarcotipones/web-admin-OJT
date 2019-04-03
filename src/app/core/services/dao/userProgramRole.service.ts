import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { APIService } from '../api/api.service';
import { CSOGroupService } from '../dao/csoGroup.service';
import { Constants } from '../../../shared/constants';

@Injectable()
export class UserProgramRoleService {
  private className = 'UserProgramRole';

  constructor(
    private apiService: APIService,
    private csoGroupService: CSOGroupService
  ) { }

  getAllProgramRoles(): Promise<any[]> {
    let roles = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('user', this.apiService.User.current());
        roles = await query.find();
        roles = roles.map(data => data.toJSON());
        resolve(roles);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  getSelectedProgramRole(): Promise<any[]> {
    let role: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('user', this.apiService.User.current());
        query.equalTo('selected', true);
        query.include('user');
        query.include('user.userProfile');
        query.include('role');
        query.include('level');
        query.include('program');
        query.include('csoGroup');
        query.include('region');
        query.include('province');
        query.include('district');
        query.include('municipality');
        query.include('barangay');
        query.include('selected');

        const subscription = query.subscribe();
        subscription.on('update', data => {
          // console.log('UPdate', data);
          // role = data.toJSON();
        });

        let results = await query.find();
        results = results.filter(result => result.toJSON().selected === true);

        if (results.length > 0) {
          role = results[0].toJSON();
        }
        resolve(role);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  getObservableSelectedProgramRole(): Observable<any> {
    let role: any;
    const subject = new Subject();
    const query = new this.apiService.Query(this.className);
    query.equalTo('selected', true);
    query.equalTo('user', this.apiService.User.current());
    query.include('user');
    query.include('role');
    query.include('level');
    query.include('program');
    query.include('region');
    query.include('province');
    query.include('municipality');
    query.include('barangay');
    query.include('selected');

    const subscription = query.subscribe();
    subscription.on('update', data => {
      // console.log('UPdate', data);
      // role = data.toJSON();
    });

    query.first().then(res => {
      role = res.toJSON();
      subject.next(role);
    })

    return subject;
  }

  getSelectedProgramRoleByUserId(userId): Promise<any[]> {
    let role: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        const userQuery = new this.apiService.Query('User');

        userQuery.equalTo('objectId', userId)
        query.matchesQuery('user', userQuery);
        query.equalTo('selected', true);
        query.include('user');
        query.include('user.userProfile');
        query.include('role');
        query.include('level');
        query.include('program');
        query.include('csoGroup');
        query.include('region');
        query.include('province');
        query.include('district');
        query.include('municipality');
        query.include('barangay');
        query.include('selected');

        let results = await query.first();
        role = results.toJSON();

        resolve(role);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  setUserProgramRole(role, roleForm): Promise<any[]> {
    let selectedValue: boolean;
    let programRole;
    return new Promise(async (resolve, reject) => {
      try {
        switch (role['attributes'].name) {
          case Constants.PROJECT_ADMIN_ROLE:
            programRole = await this.getSelectedProgramRoleByCurrentUser();
            break;
          case Constants.CSO_ADMIN_ROLE:
            programRole = await this.csoGroupService.getByObjectId(roleForm.assignedCSOGroup);
            break;
          default:
            programRole = this.setProgramRole(roleForm);
        }
        const checkSelectedQuery = new this.apiService.Query(this.className);
        checkSelectedQuery.equalTo('selected', true);
        checkSelectedQuery.equalTo('role', role);
        const count = await checkSelectedQuery.count();
        selectedValue = count > 0 ? false : true;
        programRole['selected'] = selectedValue;
        resolve(programRole);
      } catch (error) {
        reject(error);
      }
    });
  }

  getSelectedProgramRoleByCurrentUser(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const programRoleQuery = new this.apiService.Query(this.className);
      programRoleQuery.equalTo('user', this.apiService.User.current());
      programRoleQuery.equalTo('selected', true);
      programRoleQuery.include('program');
      programRoleQuery.include('level');
      programRoleQuery.include('region');
      const programRole = await programRoleQuery.first();
      const newProgramRole = programRole ? programRole.toJSON() : {};
      resolve(newProgramRole);
    });
  }

  getProgramRolesByCurrentUser(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const programRoleQuery = new this.apiService.Query(this.className);
      programRoleQuery.equalTo('user', this.apiService.User.current());
      programRoleQuery.include('program');
      programRoleQuery.include('level');
      programRoleQuery.include('region');
      const programRoles = await programRoleQuery.find();
      const newProgramRoles = programRoles.map(programRole => programRole ? programRole.toJSON() : {});
      resolve(newProgramRoles);
    });
  }

  setCurrentUserSelectedProgramRoleByObjectId(newProgramRole): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const programRoles = await this.getProgramRolesByCurrentUser()

      for (let index = 0; index < programRoles.length; index++) {
        const programRole = programRoles[index];
        const newSelected = (programRole.objectId === newProgramRole.objectId);
        const programRoleQuery = new this.apiService.Query(this.className);
        programRoleQuery.equalTo('objectId', programRole.objectId);

        await programRoleQuery.find().then(async res => {
          const currentProgramRole = res[0];
          currentProgramRole.set('selected', newSelected);
          await currentProgramRole.save()
        });

      }

      // await programRoles.map(async programRole => {
      // });
      resolve(newProgramRole);
    });
  }

  getProgramRoleByUserObject(userId): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const userQuery = new this.apiService.Query('User');
      userQuery.equalTo('objectId', userId).first();
      const user = await userQuery.find();

      const programRoleQuery = new this.apiService.Query(this.className);
      programRoleQuery.equalTo('user', user[0]).first();
      programRoleQuery.include('user');
      programRoleQuery.include('role');
      programRoleQuery.include('level');
      programRoleQuery.include('program');
      programRoleQuery.include('region');
      programRoleQuery.include('province');
      programRoleQuery.include('municipality');
      programRoleQuery.include('barangay');
      programRoleQuery.include('selected');
      const programRole = await programRoleQuery.find();
      const newProgramRole = programRole[0] ? programRole[0].toJSON() : {};
      resolve(newProgramRole);
    });
  }

  setProgramRoleToDefault() {
    return new Promise(async (resolve, reject) => {
      const programRoleQuery = new this.apiService.Query(this.className);
      programRoleQuery.include('program');
      programRoleQuery.include('level');
      const programRole = await programRoleQuery.find();
      const newProgramRole = programRole[0].toJSON();
      resolve(newProgramRole);
    });
  }

  setProgramRole(roleForm) {
    return new Promise(async (resolve, reject) => {
      const programRoleQuery = new this.apiService.Query(this.className);
      programRoleQuery.include('program');
      programRoleQuery.include('level');
      const programRole = await programRoleQuery.find();
      const newProgramRole = programRole[0].toJSON();

      const programQuery = new this.apiService.Query('Program');
      programQuery.equalTo('objectId', roleForm.program);
      await programQuery.find().then(res => {
        newProgramRole['program'] = res[0];
      });

      let levelName = Constants.NATIONAL_ACCESS_LEVEL;
      if (roleForm.region) {
        const regionQuery = new this.apiService.Query('Region');
        regionQuery.equalTo('objectId', roleForm.region);
        await regionQuery.find().then(res => {
          newProgramRole['region'] = res[0];
        });
        levelName = Constants.REGIONAL_ACCESS_LEVEL;
      }
      if (roleForm.province) {
        const provinceQuery = new this.apiService.Query('Province');
        provinceQuery.equalTo('objectId', roleForm.province);
        await provinceQuery.find().then(res => {
          newProgramRole['province'] = res[0];
        });
        levelName = Constants.PROVINCIAL_ACCESS_LEVEL;
      }
      if (roleForm.municipality) {
        const municipalityQuery = new this.apiService.Query('Municipality');
        municipalityQuery.equalTo('objectId', roleForm.municipality);
        await municipalityQuery.find().then(res => {
          newProgramRole['municipality'] = res[0];
        });
        levelName = Constants.MUNICIPAL_ACCESS_LEVEL;
      }

      const ProgramAccessLevelQuery = new this.apiService.Query('ProgramAccessLevel');
      ProgramAccessLevelQuery.equalTo('name', levelName);
      await ProgramAccessLevelQuery.find().then(res => {
        newProgramRole['level'] = res[0];
      });

      resolve(newProgramRole);
    });
  }
}
