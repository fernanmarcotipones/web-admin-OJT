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

  searchByCSOProgram(page: Page): Promise<PagedData<any>> {
    const pagedData = new PagedData<any>();
    return new Promise(async (resolve, reject) => {
      try {
        // get count first
        // const query = new this.apiService.Query('CSOGroupProgram');
        // console.log('page.filters', page.filters)
        const query =  await this.createQueryByFilter('CSOGroupProgram', page.filters);

        let count = 0;
        let results = [];
        let uniqueUserIds = [];

        const subscription = query.subscribe();
        subscription.on('delete', (data) => {
          count--;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;
          pagedData.data = pagedData.data.filter(id => id.objectId !== data.objectId);
        });

        subscription.on('update', (data) => {
          const index = pagedData.data.findIndex(obj => obj.objectId === data.toJSON().objectId);
          pagedData.data[index] = data.toJSON();
        });

        // get count and unique csoGroup ids
        await query.distinct('csoGroup').then(res => {
          count = res.length;
          uniqueUserIds = res;
        });

        // get count
        page.totalElements = count;
        page.totalPages = page.totalElements / page.size;
        const start = page.pageNumber * page.size;
        const end = Math.min((start + page.size), page.totalElements);

        // get results
        const resultQuery = query;
        resultQuery.include('region');
        resultQuery.include('province');
        resultQuery.include('municipality');
        resultQuery.include('barangay');
        resultQuery.include('level');
        resultQuery.include('program');
        resultQuery.include('project');
        resultQuery.include('csoGroup');
        resultQuery.skip(start).limit(end);

        if (page.sorts.length !== 0) {
          if (page.sorts[0].dir === 'asc') {
            resultQuery.ascending(page.sorts[0].prop);
          }else {
            resultQuery.descending(page.sorts[0].prop);
          }
        }
        results = uniqueUserIds.slice(start, end);
        results.forEach(async csoGroup => {
          await this.getByObjectId(csoGroup.objectId).then(res => {
            // const item = res.toJSON();
            pagedData.data.push(res);
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

    if (filters.searchCSOKey && filters.searchCSOKey !== '') {
      const csoQ = new this.apiService.Query('CSOGroup');
      csoQ.matches('name', new RegExp(filters.searchCSOKey, 'i'));
      const csoNameQ = new this.apiService.Query(className);
      csoNameQ.matchesQuery('csoGroup', csoQ);
      query._orQuery([csoNameQ])
    }

    return query;
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
        obj = await query.cache(43200).find();
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
