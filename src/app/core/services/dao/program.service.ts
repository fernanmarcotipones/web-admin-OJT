import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { APIService } from '../api/api.service';

@Injectable()
export class ProgramService {

  constructor(private apiService: APIService) { }

  getAll(): Promise<any[]> {
    let programs = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('Program');
        query.ascending('agencyCode');
        programs = await query.find();
        programs = programs.map(data => data.toJSON());
        resolve(programs);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getProgramByObjectId(objId): Promise<any[]> {
    let program: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('Program');
        query.equalTo('objectId', objId);
        program = await query.first();
        // program = program.map(data => data.toJSON());
        resolve(program);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getByObjectId(objId): Promise<any[]> {
    let program: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('Program');
        query.equalTo('objectId', objId);
        program = await query.first();
        resolve(program);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getAllStatuses(): Promise<any[]> {
    let statuses = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('ProgramStatus');
        query.ascending('order');
        statuses = await query.find();
        statuses = statuses.map(data => data.toJSON());
        resolve(statuses);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getStatusByObjectId(objId): Promise<any[]> {
    let status: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('ProgramStatus');
        query.equalTo('objectId', objId).limit(1);
        status = await query.find();
        // status = statuses.map(data => data.toJSON());
        resolve(status[0]);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
