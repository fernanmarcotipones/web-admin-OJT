import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Province, Page,  PagedData } from '../../models';
import { APIService } from '../api/api.service';

@Injectable()
export class ProvinceService {

  private className = 'Province';

  constructor(private apiService: APIService) { }

  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the location data
   */
  search(page: Page): Promise<PagedData<Province>> {
    const pagedData = new PagedData<Province>();
    return new Promise(async (resolve, reject) => {
      try {
        // search by title
        const nameQuery = new this.apiService.Query(this.className);
        if (page.filters.name && page.filters.name !== '' ) {
          nameQuery.matches('name', new RegExp(page.filters.name, 'i'));
        }

        const regionQ = new this.apiService.Query('Region');
        if (page.filters.region && page.filters.region !== '') {
          regionQ.equalTo('regionCode', page.filters.region);
        }

        // get count first
        const query = new this.apiService.Query(this.className);

        if (page.filters.name && page.filters.name !== '' ) {
          query._orQuery([nameQuery]);
        }
        if (page.filters.region && page.filters.region !== '') {
          query.matchesQuery('region', regionQ);
        }

        let count = 0;
        let results = [];

        const subscription = query.subscribe();
        subscription.on('create', (data) => {
          count++;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;

          const province = new Province(data.toJSON());
          pagedData.data.push(province);
        });

        subscription.on('delete', (data) => {
          count--;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;
          pagedData.data = pagedData.data.filter(location => location.objectId !== data.objectId);
        });

        subscription.on('update', (data) => {
          const index = pagedData.data.findIndex(obj => obj.objectId === data.toJSON().objectId);
          pagedData.data[index] = data.toJSON();
        });

        // get count
        count = await query.count();
        page.totalElements = count;
        page.totalPages = page.totalElements / page.size;
        const start = page.pageNumber * page.size;
        const end = Math.min((start + page.size), page.totalElements);

        // get results
        const resultQuery = query;
        resultQuery.include('name');
        resultQuery.include('region');
        resultQuery.skip(start).limit(end);

        if (page.sorts.length !== 0) {
        switch (page.sorts[0].prop) {
          case 'region' : {
            this.sortByColumn(resultQuery, 'regionCode', page.sorts[0].dir)
          }break
          default: {
            this.sortByColumn(resultQuery, page.sorts[0].prop, page.sorts[0].dir)
            }
          }
        }

        results = await resultQuery.find();
        results.forEach((provinceForm) => {
          const province = new Province(provinceForm.toJSON());
          pagedData.data.push(province);
        })

        pagedData.page = page;
        resolve(pagedData);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  sortByColumn(resultQuery, colName, sortType) {
    if (sortType === 'asc') {
      resultQuery.ascending(colName);
    }else {
      resultQuery.descending(colName);
    }
  }

  getByRegionCode(regionCode): Promise<any[]> {
    let provinces = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('Province');
        query.equalTo('regionCode', regionCode);
        query.ascending('name');
        provinces = await query.find();
        provinces = provinces.map(data => data.toJSON());
        resolve(provinces);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getByRegionObjectId(objectId): Promise<any[]> {
    let provinces = [];
    return new Promise(async (resolve, reject) => {
      try {
        const regionQ = new this.apiService.Query('Region');
        regionQ.equalTo('objectId', objectId);

        const query = new this.apiService.Query('Province');
        query.matchesQuery('region', regionQ)
        query.ascending('name');
        provinces = await query.cache(43200).find();
        provinces = provinces.map(data => data.toJSON());
        resolve(provinces);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getAll(): Promise<any[]> {
    let provinces = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new new this.apiService.Query(this.className);
        query.ascending('name');
        provinces = await query.cache(43200).find();
        provinces = provinces.map(data => data.toJSON());
        resolve(provinces);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getById(objectId: string): Observable<any> {
    const subject = new Subject();
    const query = new this.apiService.Query(this.className);
    query.include('name');
    query.include('psgcCode');
    query.include('regionCode');
    query.include('provinceCode');
    query.include('region');
    query.include('location');
    query.include('geoCode');
    query.equalTo('objectId', objectId).limit(1)
    query.find().then(res => {
        subject.next({type: 'result', result: res})
    });

    return subject;
  }
}
