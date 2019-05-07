import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { APIService } from '../api/api.service';
import { Municipality, Page, PagedData } from '../../models';


@Injectable()
export class MunicipalityService {

  private className = 'Municipality';

    constructor(private apiService: APIService) { }

    /**
     * A method that mocks a paged server response
     * @param page The selected page
     * @returns {any} An observable containing the location data
     */
    search(page: Page): Promise<PagedData<Municipality>> {
      const pagedData = new PagedData<Municipality>();
      return new Promise(async (resolve, reject) => {
        try {
          // search by name
          const nameQuery = new this.apiService.Query(this.className);
          if (page.filters.name && page.filters.name !== '' ) {
            nameQuery.matches('name', new RegExp(page.filters.name, 'i'));
          }
          // // search by Region
          const regionQ = new this.apiService.Query('Region');
          if (page.filters.region && page.filters.region !== '') {
            regionQ.equalTo('regionCode', page.filters.region);
          }

          const provinceQ = new this.apiService.Query('Province');
          if (page.filters.province && page.filters.province !== '') {
            provinceQ.equalTo('provinceCode', page.filters.province);
          }

          // get count first
          const query = new this.apiService.Query(this.className);

          if (page.filters.name && page.filters.name !== '' ) {
            query._orQuery([nameQuery]);
          }
          if (page.filters.region && page.filters.region !== '') {
            query.matchesQuery('region', regionQ);
          }
          if (page.filters.province && page.filters.province !== '') {
            query.matchesQuery('province', provinceQ);
          }

          let count = 0;
          let results = [];

          const subscription = query.subscribe();
          subscription.on('create', (data) => {
            count++;
            page.totalElements = count;
            page.totalPages = page.totalElements / page.size;

            const municipality = new Municipality(data.toJSON());
            pagedData.data.push(municipality);
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
          resultQuery.include('province');
          resultQuery.skip(start).limit(end);

          if (page.sorts.length !== 0) {
            switch (page.sorts[0].prop) {
              case 'region': {
                this.sortByColumn(resultQuery, 'regionCode', page.sorts[0].dir)
              }break
              case 'province': {
                this.sortByColumn(resultQuery, 'provinceCode', page.sorts[0].dir)
              }break
              default: {
                this.sortByColumn(resultQuery, page.sorts[0].prop, page.sorts[0].dir)
              }
            }
          }

          results = await resultQuery.find();
          results.forEach((municipalityForm) => {
            const municipality = new Municipality(municipalityForm.toJSON());
            pagedData.data.push(municipality);
          })

          pagedData.page = page;
          resolve(pagedData);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    }

  getAll(): Promise<any[]> {
    let municipalities = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.ascending('name');
        municipalities = await query.find();
        municipalities = municipalities.map(data => data.toJSON());
        resolve(municipalities);
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

  getByProvinceCode(provinceCode): Promise<any[]> {
    let municipalities = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('Municipality');
        query.equalTo('provinceCode', provinceCode);
        query.ascending('name');
        municipalities = await query.find();
        municipalities = municipalities.map(data => data.toJSON());
        resolve(municipalities);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getByProvinceObjectId(objectId): Promise<any[]> {
    let municipalities = [];
    return new Promise(async (resolve, reject) => {
      try {
        const provinceQ = new this.apiService.Query('Province');
        provinceQ.equalTo('objectId', objectId);

        const query = new this.apiService.Query('Municipality');
        query.matchesQuery('province', provinceQ)
        query.ascending('name');
        municipalities = await query.cache(43200).find();
        municipalities = municipalities.map(data => data.toJSON());
        resolve(municipalities);
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
    query.include('municipaltityCode');
    query.include('region');
    query.include('province');
    query.include('geoCode');
    query.equalTo('objectId', objectId).limit(1)
    query.find().then(res => {
        subject.next({type: 'result', result: res})
    });

    return subject;
  }
}
