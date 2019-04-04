import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormService, Page, Form} from 'app/core';
import { Constants } from 'app/shared/constants';

@Component({
  selector: 'app-admin-form-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class FormTableComponent implements OnInit, OnChanges {
  @Input() activeUserProgramRole: any;
  @Input() filterValues: any;
  @Input() isFilterLoaded: boolean;

  public loading = false;
  public page = new Page();
  public rows = new Array<Form>();

  private subscriptions: Array<Subscription> = [];
  constructor(
    private formService: FormService,
  ) {
    this.page.pageNumber = Constants.DEFAULT_PAGE_NUMBER;
    this.page.size = Constants.DEFAULT_PAGE_SIZE;
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (this.activeUserProgramRole && this.isFilterLoaded) {
      this.search();
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadForms();
  }

  search() {
    this.page.filters = this.filterValues;
    this.page.pageNumber = 0;
    this.loadForms();
  }

  loadForms() {
    this.loading = true;
    if (this.activeUserProgramRole && this.isFilterLoaded) {
      this.formService.search(this.page).then(pagedData => {
        this.page = pagedData.page;
        this.rows = pagedData.data;
        this.loading = false;
      });
    }
  }

}
