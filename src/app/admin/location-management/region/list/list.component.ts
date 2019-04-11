import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CurrentUserService } from 'app/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-region-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class RegionListComponent implements OnInit, OnDestroy {
  @Input() activeUserProgramRole: any;
  @Input() filterValues: any;
  @Input() isFilterLoaded: boolean;

  private subscriptions: Array<Subscription> = [];
  public loading = false;
  public currentUser: any;
  public regionFilterConfig = {
    name: true,
  };

  constructor(public currentUserService: CurrentUserService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.currentUserService.currentUser
        .distinctUntilChanged()
        .subscribe(user => {
          if (user && user.objectId) {
            this.currentUser = user;
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
