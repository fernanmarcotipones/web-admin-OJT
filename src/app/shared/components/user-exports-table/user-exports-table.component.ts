import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { UserExportService, Page, UserExport } from 'app/core';
import { Constants } from 'app/shared/constants';

import { Subscription, Observable, Subject } from 'rxjs/Rx';

@Component({
  selector: 'app-user-exports-table',
  templateUrl: './user-exports-table.component.html',
  styleUrls: ['./user-exports-table.component.scss'],
  providers: [UserExportService]
})
export class UserExportsTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activeUserProgramRole: any;
  @Input() module: any;
  @Input() projectId: any;

  private subscriptions: Array<Subscription> = [];

  public loading = false;
  public page = new Page();
  public rows = new Array<UserExport>();

  constructor(
    private userExportService: UserExportService
  ) {
    this.page.pageNumber = Constants.DEFAULT_PAGE_NUMBER;
    this.page.size = 5;
  }

  ngOnInit() {
    // console.log(this.filterConfig);
  }

  loadUserExports() {
    this.loading = true;
    if (this.activeUserProgramRole) {
      this.userExportService.search(this.page).then(result => {
        this.page = result.page;
        this.rows = result.data;
        this.loading = false;
      });
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadUserExports();
  }

  onSort(event) {

  }

  search() {
    this.page.filters = { module: this.module, projectId: this.projectId };
    this.page.pageNumber = 0;
    this.loadUserExports();
  }

  export(val) {
    this.loading = false;
    this.userExportService.getByObjectId(val).then((res) => {
      const link = document.createElement('a');
      link.href = res.file.url;
      link.click();
      this.loading = false;
    })
  }

  delete(val) {
    if (confirm('Are you sure you want to delete?')) {
      this.loading = false;
      this.userExportService.removeByObjectId(val).then((isRemoved) => {
        if (isRemoved) {
          this.loading = false;
          this.search();
        }
      })
    }
  }

  ngOnChanges(changes) {
    if (this.activeUserProgramRole) {
      this.search();
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }
}
