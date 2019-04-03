import { Injectable } from '@angular/core';

import { Page, PagedData } from '../../models';
import { APIService } from './../api/api.module';

@Injectable()
export class CSOGroupCodeService {

  private className = 'CSOGroupCode';

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

        results = await this.apiService.Cloud.run('searchCSOGroupCode', page);

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

  getByObjectId(objectId): Promise<any> {
    let obj: any;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.include('proram');
        query.include('csoGroup');
        query.include('level');
        query.include('region');
        query.equalTo('objectId', objectId).limit(1);
        obj = await query.find();
        if (obj.length > 0 ) {
          obj = obj[0].toJSON();
        }
        resolve(obj);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getByCSOGroupObjectId(objectId): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const csoGroupQ = new this.apiService.Query('CSOGroup');
        csoGroupQ.equalTo('objectId', objectId);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('csoGroup', csoGroupQ);
        query.find().then(results => {
          results = results.length > 0 ? results.map(obj => obj.toJSON()) : [];
          resolve(results);
        })
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getByProgramObjectId(objectId): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const programQ = new this.apiService.Query('Program');
        programQ.equalTo('objectId', objectId);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('program', programQ);
        query.find().then(results => {
          results = results.length > 0 ? results.map(obj => obj.toJSON()) : [];
          resolve(results);
        })
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  isCodeExists(code, exceptObjectId?): Promise<boolean> {
    let returnVal = false;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('code', code);
        if (exceptObjectId !== '') {
          query.notEqualTo('objectId', exceptObjectId);
        }
        query.find().then(objects => {
          if (objects.length > 0 ) {
            returnVal = true;
          }
           resolve(returnVal);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getByUserProgramRole(userProgramRole): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);

        // program query
        const programQ = new this.apiService.Query('Program');
        query.equalTo('objectId', userProgramRole['program']['objectId']);
        query.matchesQuery('program', programQ);

        const regionQ = new this.apiService.Query('Region');
        if (userProgramRole['region']) {
          regionQ.equalTo('objectId', userProgramRole['region']['objectId']);
          query.matchesQuery('region', regionQ);
        }

        const provinceQ = new this.apiService.Query('Region');
        if (userProgramRole['province']) {
          provinceQ.equalTo('objectId', userProgramRole['province']['objectId']);
          query.matchesQuery('province', provinceQ);
        }

        const municipalityQ = new this.apiService.Query('Municipality');
        if (userProgramRole['municipality']) {
          municipalityQ.equalTo('objectId', userProgramRole['municipality']['objectId']);
          query.matchesQuery('municipality', municipalityQ);
        }

        const barangayQ = new this.apiService.Query('Barangay');
        if (userProgramRole['barangay']) {
          barangayQ.equalTo('objectId', userProgramRole['barangay']['objectId']);
          query.matchesQuery('barangay', barangayQ);
        }

        query.find().then(results => {
          results = results.length > 0 ? results.map(obj => obj.toJSON()) : [];
          resolve(results);
        })
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
