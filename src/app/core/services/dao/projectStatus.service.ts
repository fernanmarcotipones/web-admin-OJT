import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { APIService } from '../api/api.service';
import { UserProgramRoleService } from '../dao/userProgramRole.service';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class ProjectStatusService {

  private className = 'ProjectStatus';

  constructor(
    private apiService: APIService,
    private userProgramRoleService: UserProgramRoleService
  ) { }

  getByProgramCode(programCode): Promise<any[]> {
    let statuses = [];
    return new Promise(async (resolve, reject) => {
      try {
        const programQ = new this.apiService.Query('Program');
        programQ.equalTo('programCode', programCode);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('program', programQ);
        query.ascending('name');
        statuses = await query.find();
        statuses = statuses.map(data => data.toJSON());
        resolve(statuses);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  getByCode(code): Promise<any[]> {
    let status: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('code', code).limit(1);
        status = await query.find();
        // status = statuses.map(data => data.toJSON());
        resolve(status[0]);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  getAll(): Promise<any[]> {
    let projectStatus = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.descending('name');
        projectStatus = await query.find();
        projectStatus = projectStatus.map(data => data.toJSON());
        resolve(projectStatus);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  getByObjectId(objId): Promise<any[]> {
    let status: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('objectId', objId).limit(1);
        status = await query.find();
        // status = statuses.map(data => data.toJSON());
        resolve(status[0]);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  getProjectSubStatus(objId): Promise<any[]> {
    let status: any;
    let subStatus = [];
    return new Promise(async(resolve, reject) => {
      try {
        status = await this.getByObjectId(objId)
        const query = new this.apiService.Query(this.className);
        // query.equalTo('objectId', objId),
        query.equalTo('main', status),
        query.equalTo('isMain', false),
        query.ascending('order')
        subStatus = await query.find();
        subStatus = subStatus.map(data => data.toJSON())
        resolve(subStatus)
      } catch (error) {
        reject(error);
      }
    })
  }

  getProjectStatusId(id): Promise<any[]> {
    let type = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('ProjectType');
        query.equalTo('objectId', id)
        type = await query.first();
        resolve(type);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });

  }

  getByProgramStatusId(objId): Promise<any[]> {
    let projectStatus = [];
    return new Promise(async (resolve, reject) => {
      try {
        const progStatusQ = new this.apiService.Query('ProgramStatus');
        progStatusQ.equalTo('objectId', objId);

        const programQ = new this.apiService.Query('Program');
        const userProgramRole = await this.userProgramRoleService.getSelectedProgramRole();
        if (userProgramRole && userProgramRole['role']) {
          programQ.equalTo('objectId', userProgramRole['program']['objectId'])
        }

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('program', programQ);
        query.matchesQuery('programStatus', progStatusQ);
        query.ascending('order');
        projectStatus = await query.find();
        projectStatus = projectStatus.map(data => data.toJSON());
        resolve(projectStatus);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }


  getByProgramObjectId(objectId): Promise<any[]> {
    let statuses = [];
    return new Promise(async (resolve, reject) => {
      try {
        const programQ = new this.apiService.Query('Program');
        programQ.equalTo('objectId', objectId);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('program', programQ);
        query.equalTo('isMain', true);
        query.ascending('order');
        query.equalTo('isMain', true);
        statuses = await query.find();
        statuses = statuses.map(data => data.toJSON());
        resolve(statuses);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  getByProgramObjectIdAndName(objectId, statusName): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const programQ = new this.apiService.Query('Program');
        programQ.equalTo('objectId', objectId);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('program', programQ);
        query.equalTo('name', statusName);
        let status = await query.first();
        if (status) {
          status = status.toJSON();
        }
        resolve(status);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }
}
