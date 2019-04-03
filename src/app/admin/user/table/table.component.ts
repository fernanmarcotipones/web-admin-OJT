import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { UserService, Page, User } from 'app/core';
import { Constants } from 'app/shared/constants';

@Component({
  selector: 'app-admin-user-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class UserTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() activeUserProgramRole: any;
  @Input() filterValues: any;
  @Input() isFilterLoaded: boolean;

  public loading = false;
  public page = new Page();
  public rows = new Array<User>();

  private subscriptions: Array<Subscription> = [];

  constructor (
    private userService: UserService,
  ) {
    this.page.pageNumber = Constants.DEFAULT_PAGE_NUMBER;
    this.page.size = Constants.DEFAULT_PAGE_SIZE;
  }

  ngOnInit() {

  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  loadUsers() {
    this.loading = true;
    if (this.activeUserProgramRole && this.isFilterLoaded) {
      this.userService.searchByUserProgramRole(this.page).then(pagedData => {
        this.page = pagedData.page;
        this.rows = pagedData.data;
        this.loading = false;
      });
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadUsers();
  }

  search() {
    this.page.filters = this.filterValues;
    this.page.pageNumber = 0;
    this.loadUsers();
  }

  async onSort(event) {
    // this.page.sorts = event.sorts;
    // this.loading = true;
    // this.page.pageNumber = 0;
    // this.loadProjects();
  }

  ngOnChanges(changes) {
    if (this.activeUserProgramRole && this.isFilterLoaded) {
      this.search();
    }
  }

  deactivateUserModal(id) {

  }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }

}
