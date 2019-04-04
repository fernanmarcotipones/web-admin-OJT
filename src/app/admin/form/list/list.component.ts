import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CurrentUserService, SearchFilterService } from 'app/core';

@Component({
  selector: 'app-admin-formlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class FormListComponent implements OnInit {
  private subscriptions: Array<Subscription> = [];
  public currentUser: any;
  public isFilterLoaded = false;
  public filterValues: any;
  public defaultFilterValues: any;
  public formFilterConfig = {
    formTitle: true,
    formQuestionType: true,
    projectStatus: true,
  }

  constructor(
    public currentUserService: CurrentUserService,
    public searchFilterService: SearchFilterService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.currentUserService.currentUser
      .distinctUntilChanged()
      .subscribe(user => {
        if (user && user.objectId) {
          this.currentUser = user;
        }
      }))
    this.subscribeDefaultFilterValuesFromService()
  }

  subscribeDefaultFilterValuesFromService() {
    this.searchFilterService.castformListSearchFilters.first().subscribe(projectListSearchFilters =>  this.defaultFilterValues = projectListSearchFilters)
  }

  fetchFilterValues(values) {
    // this.searchFilterService.setFormListSearchValues(values);
    this.filterValues = values;
  }

  setFilterLoaded(value) {
    this.isFilterLoaded = value;
  }

}
