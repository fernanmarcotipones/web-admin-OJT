import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Region, Page, PagedData } from '../../models';
import { APIService } from '../api/api.service';

@Injectable()
export class RegionService {

  private className = 'Region';

  constructor(private apiService: APIService) { }

  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the location data
   */
  search(page: Page): Promise<PagedData<Region>> {
    const pagedData = new PagedData<Region>();
    return new Promise(async (resolve, reject) => {
      try {
        // search by name
        const nameQuery = new this.apiService.Query(this.className);
        if (page.filters.name && page.filters.name !== '' ) {
          nameQuery.matches('name', new RegExp(page.filters.name, 'i'));
        }

        // const regionQ = new this.apiService.Query('Region');
        // if (page.filters.region && page.filters.region !== '') {
        //   regionQ.equalTo('regionCode', page.filters.region);
        // }

        // get count first
        const query = new this.apiService.Query(this.className);

        if (page.filters.name && page.filters.name !== '' ) {
          query._orQuery([nameQuery]);
        }
        // if (page.filters.region && page.filters.region !== '') {
        //   query.matchesQuery('region', regionQ);
        // }

        let count = 0;
        let results = [];

        const subscription = query.subscribe();
        subscription.on('create', (data) => {
          count++;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;

          const region = new Region(data.toJSON());
          pagedData.data.push(region);
        });

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
          if (page.sorts[0].dir === 'asc') {
            resultQuery.ascending(page.sorts[0].prop);
          }else {
            resultQuery.descending(page.sorts[0].prop);
          }
        }

        results = await resultQuery.find();
        results.forEach((regionForm) => {
          const region = new Region(regionForm.toJSON());
          pagedData.data.push(region);
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
    let regions = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('Region');
        query.ascending('name');
        regions = await query.cache(43200).find();
        regions = regions.map(data => data.toJSON());
        resolve(regions);
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
    query.include('description');
    query.include('psgcCode');
    query.include('regionCode');
    query.include('location');
    query.include('geoCode');
    query.equalTo('objectId', objectId).limit(1)
    query.find().then(res => {
        subject.next({type: 'result', result: res})
    });

    return subject;
  }
}
