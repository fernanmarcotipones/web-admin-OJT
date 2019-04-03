import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class SearchFilterService {

    public projectListSearchFilters = new BehaviorSubject({});
    castProjectListSearchFilters = this.projectListSearchFilters.asObservable();

    public reportSearchFilters = new BehaviorSubject({});
    castReportSearchFilters = this.reportSearchFilters.asObservable();

    public citizenFeedbackSearchFilters = new BehaviorSubject({});
    castCitizenFeedbackSearchFilters = this.citizenFeedbackSearchFilters.asObservable();

    public mapSearchFilters = new BehaviorSubject({});
    castMapSearchFilters = this.mapSearchFilters.asObservable();

    public CSOReportSearchFilters = new BehaviorSubject({});
    castCSOReportSearchFilters = this.CSOReportSearchFilters.asObservable();

    constructor() {

    }

    setProjectListSearchFilterValues(values: any) {
        this.projectListSearchFilters.next(values);
    }

    setReportSearchFilterValues(values: any) {
        this.reportSearchFilters.next(values);
    }

    setCitizenFeedbackSearchFilterValues(values: any) {
        this.citizenFeedbackSearchFilters.next(values);
    }

    setMapSearchFilterValues(values: any) {
        this.mapSearchFilters.next(values);
    }

    setCSOReportSearchFilterValues(values: any) {
        this.CSOReportSearchFilters.next(values);
    }
}
