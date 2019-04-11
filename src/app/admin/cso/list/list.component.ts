import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CurrentUserService} from 'app/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CSOListComponent implements OnInit {

  private subscriptions: Array<Subscription> = [];
  public currentUser: any;
  public isFilterLoaded = false;
  public filterValues: any;
  public defaultFilterValues: any

  public csoFilterConfig = {
    searchCSOKey: true
  }

  constructor(public currentUserService: CurrentUserService) { }

  ngOnInit() {
    this.subscriptions.push(this.currentUserService.currentUser
      .distinctUntilChanged()
      .subscribe(user => {
        if (user && user.objectId) {
          this.currentUser = user;
        }
      }))
  }

  fetchFilterValues(values) {
    this.filterValues = values;
  }

  setFilterLoaded(value) {
    this.isFilterLoaded = value;
  }

}
