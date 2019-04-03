import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CurrentUserService, SearchFilterService} from 'app/core';

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];
  public currentUser: any;
  public isFilterLoaded = false;
  public filterValues: any;
  public defaultFilterValues: any;

  public userFilterConfig = {
    userSearchKey: true,
    userVerification: true,
    userActivation: true,
    role: true,
  }

  constructor(public currentUserService: CurrentUserService,
  public searchFilterService: SearchFilterService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.currentUserService.currentUser
      .distinctUntilChanged()
      .subscribe(user => {
        if (user && user.objectId) {
          this.currentUser = user;
        }
      }))
    // this.subscribeDefaultFilterValuesFromService()
  }

  // subscribeDefaultFilterValuesFromService() {
  //   this.searchFilterService.cast.first().subscribe(projectListSearchFilters =>  this.defaultFilterValues = projectListSearchFilters)
  // }

  fetchFilterValues(values) {
    // this.searchFilterService.setprojectListSearchFilterValues(values);
    this.filterValues = values;
  }

  setFilterLoaded(value) {
    this.isFilterLoaded = value;
  }

  ngOnDestroy() {
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }
}
