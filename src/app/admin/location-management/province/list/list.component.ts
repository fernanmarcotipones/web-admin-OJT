import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CurrentUserService } from 'app/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-province-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ProvinceListComponent implements OnInit, OnDestroy {
  @Input() activeUserProgramRole: any;
  @Input() filterValues: any;
  @Input() isFilterLoaded: boolean;

  public loading = false;
  private subscriptions: Array<Subscription> = [];
  public currentUser: any;
  public provinceFilterConfig = {
    name: true,
    region: true,
  };

  constructor(public currentUserService: CurrentUserService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.currentUserService.currentUser
        .distinctUntilChanged()
        .subscribe(user => {
          if (user && user.objectId && user.activeUserProgramRole) {
            this.currentUser = user;
            this.activeUserProgramRole = user.activeUserProgramRole;
          }
        }),
    );
  }

  fetchFilterValues(values) {
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
