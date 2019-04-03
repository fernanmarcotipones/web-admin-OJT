import { Injectable } from '@angular/core';
import { APIService } from '../api/api.service';
@Injectable()
export class ProgramAccessLevelService {

  constructor(private apiService: APIService) { }

  getAll(): Promise<any[]> {
    let programs = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('ProgramAccessLevel');
        query.ascending('order');
        programs = await query.find();
        programs = programs.map(data => data.toJSON());
        resolve(programs);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getByObjectId(objectId): Promise<any> {
    let level: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('ProgramAccessLevel');
        query.equalTo('objectId', objectId).limit(1);
        level = await query.find();
        if (level.length > 0 ) {
          level = level[0].toJSON();
        }
        resolve(level);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getByName(name): Promise<any> {
    let level: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('ProgramAccessLevel');
        query.equalTo('name', name).limit(1);
        level = await query.find();
        if (level.length > 0 ) {
          level = level[0].toJSON();
        }
        resolve(level);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

}
