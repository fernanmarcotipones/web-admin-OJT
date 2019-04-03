import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs/Rx';
import { UserExport, Page, PagedData } from '../../models';
import { APIService } from '../api/api.service';


@Injectable()
export class UserExportService implements OnDestroy {

  private className = 'UserExport';
  private subscriptions: Array<Subscription> = [];

  constructor(private apiService: APIService) { }

  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the location data
   */
  search(page: Page): Promise<PagedData<UserExport>> {
    const pagedData = new PagedData<UserExport>();
    return new Promise(async (resolve, reject) => {
      try {

        const query = new this.apiService.Query(this.className);
        query.equalTo('user', this.apiService.User.current());

        if (page.filters.module && page.filters.module !== '') {
          query.equalTo('module', page.filters.module);
        }

        if (page.filters.projectId && page.filters.projectId !== '') {
          const projectQ = new this.apiService.Query('Project');
          projectQ.equalTo('objectId', page.filters.projectId);
          query.matchesQuery('project', projectQ);
        }

        let count = 0;
        let results = [];

        const subscription = query.subscribe();
        subscription.on('create', (data) => {
          count++;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;

          const item = new UserExport(data.toJSON());
          pagedData.data.push(item);
        });

        subscription.on('delete', (data) => {
          count--;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;
          pagedData.data = pagedData.data.filter(item => item.objectId !== data.objectId);
        });

        this.subscriptions.push(subscription);

        // get count
        count = await query.count();
        page.totalElements = count;
        page.totalPages = page.totalElements / page.size;
        const start = page.pageNumber * page.size;
        const end = Math.min((start + page.size), page.totalElements);

        // get results
        const resultQuery = query;
        resultQuery.skip(start).limit(end);
        resultQuery.descending('createdAt')

        if (page.sorts.length !== 0) {
          if (page.sorts[0].dir === 'asc') {
            resultQuery.ascending(page.sorts[0].prop);
          }else {
            resultQuery.descending(page.sorts[0].prop);
          }
        }

        results = await resultQuery.find();
        results.forEach((userExport) => {
          const data = new UserExport(userExport.toJSON());
          pagedData.data.push(data);
        })

        pagedData.page = page;
        resolve(pagedData);
      } catch (error) {
        console.log(error);
        reject(error);
        }
    });
  }

  getByObjectId(objectId): Promise < UserExport > {
    return new Promise((resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('objectId', objectId);
        query.first().then(form => {
          resolve(form.toJSON());
        })
      } catch (error) {
        reject(error);
      }
    });
  }

  removeByObjectId(objectId): Promise < boolean > {
    return new Promise((resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('objectId', objectId);
        query.first().then(res => {
          return res.destroy();
        }).then(res => {
          resolve(true);
        })
      } catch (error) {
        reject(error);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }

}
