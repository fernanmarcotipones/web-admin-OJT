import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { ProgramMonitoringForm, Page, PagedData } from '../../models';
import { APIService } from '../api/api.service';

@Injectable()
export class ProgramMonitoringFormService {

  private className = 'ProgramMonitoringForm';

  constructor(private apiService: APIService) { }

  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the location data
   */
  search(page: Page): Promise<PagedData<ProgramMonitoringForm>> {
    const pagedData = new PagedData<ProgramMonitoringForm>();
    return new Promise(async (resolve, reject) => {
      try {
        // get count first
        const query = new this.apiService.Query(this.className);

        const titleQuery = new this.apiService.Query(this.className);
        if (page.filters.title && page.filters.title !== '') {
          titleQuery.matches('title', new RegExp(page.filters.title, 'i'));
        }
        if (page.filters.status && page.filters.status !== '') {
          query.equalTo('status', page.filters.status);
        }
        // search by programme
        const programQ = new this.apiService.Query('Program');
        if (page.filters.program && page.filters.program !== '') {
          programQ.equalTo('programCode', page.filters.program);
        }
        if (page.filters.title && page.filters.title !== '') {
          query._orQuery([titleQuery]);
        }
        if (page.filters.program && page.filters.program !== '') {
          query.matchesQuery('program', programQ);
        }


        let count = 0;
        let results = [];

        const subscription = query.subscribe();
        subscription.on('create', (data) => {
          count++;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;

          const form = new ProgramMonitoringForm(data.toJSON());
          pagedData.data.push(form);
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
        resultQuery.include('title');
        resultQuery.include('program');
        resultQuery.include('status');
        resultQuery.skip(start).limit(end);

        if (page.sorts.length !== 0) {
          if (page.sorts[0].dir === 'asc') {
            resultQuery.ascending(page.sorts[0].prop);
          } else {
            resultQuery.descending(page.sorts[0].prop);
          }
        }

        results = await resultQuery.find();
        results.forEach((gform) => {
          const form = new ProgramMonitoringForm(gform.toJSON());
          pagedData.data.push(form);
        })

        pagedData.page = page;
        resolve(pagedData);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getById(objectId: string): Observable<any> {
    const subject = new Subject();
    const query = new this.apiService.Query(this.className);
    query.include('title');
    query.include('description');
    query.include('source');
    query.include('program');
    query.include('questionType');
    query.include('isDefault');
    query.include('projects');
    query.include('fields');
    query.include('status');
    query.include('programStatus');
    query.include('projectStatus');
    query.equalTo('objectId', objectId).limit(1)
    query.find().then(res => {
      subject.next({ type: 'result', result: res })
    });

    return subject;
  }

  getByProgramCode(programCode): Promise<any[]> {
    let forms = [];
    return new Promise(async (resolve, reject) => {
      try {
        const programQ = new this.apiService.Query('Program');
        programQ.equalTo('programCode', programCode);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('program', programQ);
        forms = await query.find();
        forms = forms.map(data => data.toJSON());
        resolve(forms);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getByProgramObjectId(objectId): Promise<any[]> {
    let programForms = [];
    return new Promise(async (resolve, reject) => {
      try {
        const programQ = new this.apiService.Query('Program');
        programQ.equalTo('objectId', objectId);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('program', programQ);
        query.equalTo('isActive', true);
        query.include('forms');

        programForms = await query.cache(43200).find();
        programForms = programForms.map(data => {
          const forms = [];
          data.relation('forms').query().each(form => forms.push(form.toJSON()));
          data = data.toJSON();
          data.forms = forms;
          return data;
        });
        resolve(programForms);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getByObjectId(objectId): Promise<any[]> {
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

}
