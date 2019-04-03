import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';

import { ProjectMonitoringReport, Page, PagedData } from '../../models';
import { APIService } from '../api/api.service';
import { count } from 'rxjs/operators';
import { Constants } from '../../../shared/constants';

@Injectable()
export class ProjectMonitoringReportService implements OnDestroy {

  private className = 'ProjectMonitoringReport';
  private subscriptions: Array<Subscription> = [];

  constructor(private apiService: APIService) { }

  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the project data
   */
  search(page: Page): Promise<any> {
    const pagedData = new PagedData<ProjectMonitoringReport>();
    return new Promise(async (resolve, reject) => {
      try {
        const liveQ = new this.apiService.Query(this.className);
        const query = await this.createQueryByFilters(page.filters);
        const countQ = await this.createQueryByFilters(page.filters);

        const reportCountDetails = await this.getReportCountByQuery(countQ, page.filters);

        let count = 0;
        let results = [];

        const subscription = liveQ.subscribe();
        subscription.on('create', (data) => {
          count++;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;

          const proj = new ProjectMonitoringReport(data.toJSON());
          pagedData.data.push(proj);
        });

        subscription.on('delete', (data) => {
          count--;
          page.totalElements = count;
          page.totalPages = page.totalElements / page.size;
          pagedData.data = pagedData.data.filter(project => project.objectId !== data.objectId);
        });

        subscription.on('update', async (data) => {
          const index = pagedData.data.findIndex(obj => obj.objectId === data.toJSON().objectId);
          reportCountDetails[pagedData.data[index].status] -= 1;
          pagedData.data[index] = data.toJSON();
          reportCountDetails[pagedData.data[index].status] += 1;
        });

        this.subscriptions.push(subscription);

        // get count
        count = await query.count();
        page.totalElements = count;
        page.totalPages = page.totalElements / page.size;
        const start = page.pageNumber * page.size;
        const end = Math.min((start + page.size), page.totalElements);

        // const reportCountDetails = {};

        // get results
        const resultQuery = query;
        resultQuery.include('user');
        resultQuery.include('user.userProfile');
        resultQuery.include('project');
        resultQuery.include('value');
        resultQuery.include('status');
        resultQuery.include('form');
        resultQuery.include('startDate');
        resultQuery.include('endDate');
        resultQuery.include('csoGroup');
        resultQuery.include('createdAt');
        resultQuery.descending('createdAt');
        resultQuery.skip(start).limit(end);

        if (page.sorts.length !== 0) {
          if (page.sorts[0].dir === 'asc') {
            resultQuery.ascending(page.sorts[0].prop);
          } else {
            resultQuery.descending(page.sorts[0].prop);
          }
        }

        results = await resultQuery.find();
        results.forEach((project) => {
          const proj = new ProjectMonitoringReport(project.toJSON());
          pagedData.data.push(proj);
        })

        pagedData.page = page;

        const result = {
          pagedData,
          reportCountDetails,
        }

        resolve(result);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async createQueryByFilters(filters) {
    const query = new this.apiService.Query(this.className);

    // search by programme of project
    if (filters.program && filters.program !== '') {
      const programQ = new this.apiService.Query('Program');
      const projectProgramQ = new this.apiService.Query('Project');
      programQ.equalTo('objectId', filters.program);
      projectProgramQ.matchesQuery('program', programQ)
      query.matchesQuery('project', projectProgramQ);
    }

    // search by project name or reference number
    if (filters.searchKey && filters.searchKey !== '') {
      const name = new this.apiService.Query('Project');
      const referenceNumber = new this.apiService.Query('Project');
      const reportName = new this.apiService.Query(this.className);
      const reportReferenceNumber = new this.apiService.Query(this.className);
      name.matches('name', new RegExp(filters.searchKey, 'i'))
      referenceNumber.matches('referenceNumber', new RegExp(filters.searchKey, 'i'))
      reportName.matchesQuery('project', name)
      reportReferenceNumber.matchesQuery('project', referenceNumber)
      query._orQuery([reportName, reportReferenceNumber]);
    }

    // search by name
    if (filters.name && filters.name !== '') {
      const fnameQ = new this.apiService.Query('UserProfile');
      const lnameQ = new this.apiService.Query('UserProfile');
      const userFnameQ = new this.apiService.Query('_User');
      const userLnameQ = new this.apiService.Query('_User');
      const reportUserFnameQ = new this.apiService.Query(this.className);
      const reportUserLnameQ = new this.apiService.Query(this.className);
      fnameQ.matches('firstName', new RegExp(filters.name, 'i'));
      lnameQ.matches('lastName', new RegExp(filters.name, 'i'));
      userFnameQ.matchesQuery('userProfile', fnameQ)
      userLnameQ.matchesQuery('userProfile', lnameQ)
      reportUserFnameQ.matchesQuery('user', userFnameQ)
      reportUserLnameQ.matchesQuery('user', userLnameQ)
      query._orQuery([reportUserFnameQ, reportUserLnameQ]);
    }

    // search by date created
    if (filters.dateRange && filters.dateRange !== '') {
      const startDate = filters.dateRange[0];
      const endDate = filters.dateRange[1];
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);
      query.greaterThanOrEqualTo('createdAt', startDate);
      query.lessThanOrEqualTo('createdAt', endDate);
    }

    // search by cso group
    if (filters.csoGroup && filters.csoGroup !== '') {
      const csoGroupQ = new this.apiService.Query('CSOGroup');
      csoGroupQ.equalTo('objectId', filters.csoGroup);
      query.matchesQuery('csoGroup', csoGroupQ);
    }

    // search by program monitoring form
    if (filters.programForm && filters.programForm !== '') {
      const programFormQ = new this.apiService.Query('ProgramMonitoringForm');
      programFormQ.equalTo('objectId', filters.programForm);
      query.matchesQuery('programMonitoringForm', programFormQ);
    }

    // search by form
    if (filters.form && filters.form !== '') {
      const formQ = new this.apiService.Query('Form');
      formQ.equalTo('objectId', filters.form);
      query.matchesQuery('form', formQ);
    }

    // search by report status
    if (filters.reportStatus && filters.reportStatus !== '') {
      query.equalTo('status', filters.reportStatus);
    }

    // search by region of project
    if (filters.regionId && filters.regionId !== '') {
      const regionQ = new this.apiService.Query('Region');
      const projectRegionQ = new this.apiService.Query('Project');
      regionQ.equalTo('objectId', filters.regionId);
      projectRegionQ.matchesQuery('region', regionQ);
      query.matchesQuery('project', projectRegionQ);
    }


    // search by province of project
    if (filters.provinceId && filters.provinceId !== '') {
      const provinceQ = new this.apiService.Query('Province');
      const projectProvinceQ = new this.apiService.Query('Project');
      provinceQ.equalTo('objectId', filters.provinceId);
      projectProvinceQ.matchesQuery('province', provinceQ);
      query.matchesQuery('project', projectProvinceQ);
    }

    // search by municipality of project
    if (filters.municipalityId && filters.municipalityId !== '') {
      const municipalityQ = new this.apiService.Query('Municipality');
      const projectMunicipalityQ = new this.apiService.Query('Project');
      municipalityQ.equalTo('objectId', filters.municipalityId);
      projectMunicipalityQ.matchesQuery('municipality', municipalityQ);
      query.matchesQuery('project', projectMunicipalityQ);
    }

    // search by barangay of project
    if (filters.barangayId && filters.barangayId !== '') {
      const barangayQ = new this.apiService.Query('Barangay');
      const projectBarangayQ = new this.apiService.Query('Project');
      barangayQ.equalTo('objectId', filters.barangayId);
      projectBarangayQ.matchesQuery('barangay', barangayQ);
      query.matchesQuery('project', projectBarangayQ);
    }

    return query;
  }

  getReportCountByQuery(query, filters): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const countQuery = query;
        const reportCount = {
          SUBMITTED: 0,
          FOR_REVISION: 0,
          VALID: 0,
          REJECTED: 0,
          TOTAL: 0,
        }
        // const csoReportStatuses = Constants.CSO_REPORT_STATUSES;

        reportCount['TOTAL'] = await countQuery.count();

        if (filters.reportStatus && filters.reportStatus !== '') {
          countQuery.equalTo('status', filters.reportStatus);
          reportCount[filters.reportStatus] = await countQuery.count();
        } else {
          // await csoReportStatuses.forEach(async status => {
          //   await countQuery.equalTo('status', status.value)
          //   reportCount[status.value] = await countQuery.count();
          //   console.log(status.value, reportCount[status.value])
          // });
          const totalSubmitted = countQuery;
          totalSubmitted.equalTo('status', 'SUBMITTED')
          reportCount['SUBMITTED'] = await totalSubmitted.count();

          const totalValid = countQuery;
          totalValid.equalTo('status', 'VALID')
          reportCount['VALID'] = await totalValid.count();

          const totalRejected = countQuery;
          totalRejected.equalTo('status', 'REJECTED')
          reportCount['REJECTED'] = await totalRejected.count();

          const totalReqRevise = countQuery;
          totalReqRevise.equalTo('status', 'FOR_REVISION')
          reportCount['FOR_REVISION'] = await totalReqRevise.count();
        }

        resolve(reportCount)
      } catch (error) {
        reject(error)
      }
    });
  }

  searchFeedback(page: Page, projectId): Promise<PagedData<Response>> {
    const pagedData = new PagedData<Response>();
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);

        const projectQ = new this.apiService.Query('Project');
        projectQ.equalTo('objectId', projectId);
        query.matchesQuery('project', projectQ);

        const formQ = new this.apiService.Query('Form');
        formQ.equalTo('questionType', 'FEEDBACK');
        if (page.filters.form) {
          formQ.equalTo('objectId', page.filters.form);
        }
        query.matchesQuery('form', formQ)

        if (page.filters.status) {
          query.equalTo('status', page.filters.status);
        }

        if (page.filters.point) {
          query.equalTo('points', parseInt(page.filters.point, 10));
        }

        let count = 0;
        let results = [];

        // const subscription = query.subscribe()

        count = await query.count();
        page.totalElements = count;
        page.totalPages = page.totalElements / page.size;
        const start = page.pageNumber * page.size;
        const end = Math.min((start + page.size), page.totalElements);

        const resultsQuery = query;
        resultsQuery.include('points');
        resultsQuery.include('project');
        resultsQuery.include('form');
        resultsQuery.include('user');
        resultsQuery.include('status');
        resultsQuery.skip(start).limit(end);
        resultsQuery.descending('points');

        if (page.sorts.length !== 0) {
          if (page.sorts[0].dir === 'asc') {
            resultsQuery.ascending(page.sorts[0].prop);
          } else {
            resultsQuery.descending(page.sorts[0].prop);
          }
        }

        results = await resultsQuery.find();
        results.forEach((response) => {
          const res = new Response(response.toJSON());
          pagedData.data.push(res);
        })
        pagedData.page = page;
        resolve(pagedData);

      } catch (error) {
        reject(error)
      }

    })
  }

  getByObjectId(objectId): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.include('user');
        query.include('user.userProfile');
        query.include('user.userProfile.region');
        query.include('user.userProfile.province');
        query.include('user.userProfile.municipality');
        query.include('project');
        query.include('project.region');
        query.include('project.province');
        query.include('project.municipality');
        query.include('project.barangay');
        query.include('form');
        query.include('value');
        query.include('remarks');
        query.equalTo('objectId', objectId);
        const res = query.first()
        resolve(res);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getImagesResponse(responseID): Promise<any> {
    let images;
    let projectImage;
    const imagesList = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.equalTo('objectId', responseID);
        images = await query.find();
        images = await images.map(data => {
          data.relation('images').query().each(relatedObject => {
            projectImage = relatedObject.toJSON();
            projectImage = { id: projectImage.objectId }
            imagesList.push(projectImage);
          })
        })
        resolve(imagesList);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getById(objectId: string): Observable<any> {
    const subject = new Subject();
    const query = new this.apiService.Query(this.className);
    query.include('user');
    query.include('project');
    query.include('form');
    query.include('value')
    query.equalTo('objectId', objectId).limit(1)
    query.find().then(res => {
      subject.next({ type: 'result', result: res })
    });

    return subject;
  }

  getFormId(formId): Promise<any[]> {
    let formValues = [];
    return new Promise(async (resolve, reject) => {
      try {
        const formField = new this.apiService.Query('Form');
        formField.equalTo('objectId', formId);

        const query = new this.apiService.Query(this.className);
        query.matchesQuery('form', formField);
        query.select('value');
        formValues = await query.find();
        formValues = formValues.map(data => data.toJSON());
        resolve(formValues);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getResponseReportDetail(formId, fieldId): Promise<any> {
    const formValues = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query('ChartResponseReport');
        query.include('region');
        query.include('option');
        query.include('field');
        query.equalTo('field', fieldId);

        const totalQuery = new this.apiService.Query('ChartResponseReport');
        totalQuery.include('region');
        totalQuery.include('field');
        totalQuery.equalTo('field', fieldId);

        const formQ = new this.apiService.Query('Form');
        formQ.select('objectId');
        formQ.select('fields');
        formQ.equalTo('objectId', formId);
        query.matchesQuery('form', formQ);
        totalQuery.matchesQuery('form', formQ);

        const regionQ = new this.apiService.Query('Region');
        regionQ.select('objectId');
        regionQ.select('name');
        regionQ.ascending('name');
        const regions = await regionQ.find();

        let form = await formQ.first();
        form = form.toJSON();
        const fieldItems = form['fields']['items'];
        const field = fieldItems.filter((data: any) => data.id === fieldId);
        const choices = field[0]['choices'];

        const retObj = { data: [], labels: [], totals: [] };
        // const labels = regions.map(region => region.get('name'));
        const data = [];
        const totals = [];

        for (const choice of choices) {
          const obj = { label: choice, data: [] };
          query.equalTo('option.answer', choice);
          for (const region of regions) {
            query.equalTo('region', region);
            const dataNum = await query.count();
            obj.data.push(dataNum);
          }
          data.push(obj);
        }

        for (const region of regions) {
          totalQuery.equalTo('region', region);
          const totalNum = await totalQuery.count();
          totals.push(totalNum);
        }

        // retObj.labels = labels;
        retObj.data = data;
        retObj.totals = totals;
        resolve(retObj);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async parseFetchAll(collected = [], query) {
    // let query = new Parse.Query(GameScore);
    const limit = 1000;
    const fetchQuery = query;
    fetchQuery.limit(limit);
    fetchQuery.skip(collected.length);

    const results = await fetchQuery.find();

    if (results.length === limit) {
      return await this.parseFetchAll([...collected, ...results], query);
    } else {
      return collected.concat(results);
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }


}
