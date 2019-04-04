import { Component, OnInit, Input } from '@angular/core';
import { Page, CSOGroupService, CSOGroup } from 'app/core';
import { Constants } from 'app/shared/constants';

@Component({
  selector: 'app-admin-cso-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() filterValues: any;
  @Input() isFilterLoaded: boolean;

  public loading = false;
  public page = new Page();
  public rows = new Array<CSOGroup>();

  constructor(
    private CSOGroupService: CSOGroupService,
  ) {
    this.page.pageNumber = Constants.DEFAULT_PAGE_NUMBER;
    this.page.size = Constants.DEFAULT_PAGE_SIZE;
  }

  ngOnInit() {
    this.search();
  }

  loadCSO() {
    this.loading = true;
    this.CSOGroupService.searchByCSOProgram(this.page).then(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      this.loading = false;
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadCSO();
  }

  search() {
    this.page.filters = this.filterValues;
    this.page.pageNumber = 0;
    this.loadCSO();
  }

}
