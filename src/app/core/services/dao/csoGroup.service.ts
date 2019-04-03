import { Injectable } from '@angular/core';

import { Page, PagedData } from '../../models';
import { APIService } from './../api/api.module';

@Injectable()
export class CSOGroupService {

  private className = 'CSOGroup';

  constructor(private apiService: APIService) { }

  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the project data
   */
  search(page: Page): Promise<PagedData<any>> {
    const pagedData = new PagedData<any>();
    return new Promise(async (resolve, reject) => {
      try {
        let results: any;

        results = await this.apiService.Cloud.run('searchCSOGroup', page);

        page.totalElements = results['total'];
        page.totalPages = results['total'] / page.size;

        pagedData.data = results['data'].map(d => d.toJSON());

        pagedData.page = page;
      resolve(pagedData);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getAllCSOGroup(): Promise<any[]> {
    let csoGroup = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        csoGroup = await query.cache(43200).find();
        csoGroup = csoGroup.map(data => data.toJSON())
        resolve(csoGroup)
      }catch (error) {
        reject(error)
      }
    })
  }

  getByObjectId(objectId): Promise<any> {
    let obj: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.include('program');
        query.include('level');
        query.include('region');
        query.equalTo('objectId', objectId).limit(1);
        obj = await query.find();
        if (obj.length > 0 ) {
        obj = obj[0].toJSON();
        resolve(obj);
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  setObjectIdToParseObject(objectId) {
    let obj: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.include('program');
        query.include('level');
        query.include('region');
        query.equalTo('objectId', objectId).limit(1);
        obj = await query.find();
        resolve(obj[0]);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });

  }

  getByProgramObjectId(objectId): Promise<any[]> {
    let groups = [];
    return new Promise(async (resolve, reject) => {
      try {
        const programQ = new this.apiService.Query('Program');
        programQ.equalTo('objectId', objectId);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('program', programQ);
        query.ascending('name');
        groups = await query.find();
        groups = groups.map(data => data.toJSON());
        resolve(groups);
      } catch (error) {
        reject(error);
      }
    });
  }
}
