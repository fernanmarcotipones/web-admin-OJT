import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { Page, ProvinceService, NotificationToastrService } from 'app/core';
import { Subscription } from 'rxjs/Subscription';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Constants } from 'app/shared/constants';

@Component({
  selector: 'app-admin-province-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class ProvinceTableComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(BsModalRef) confirmDeleteModalRef: BsModalRef;
  @Input() activeUserProgramRole: any;
  @Input() filterValues: any;
  @Input() isFilterLoaded: boolean;

  provinceName: string;
  provinceIndex: any;
  objId: any;

  public page = new Page();
  public rows = new Array();
  public loading = false;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private provinceService: ProvinceService,
    private modalService: BsModalService,
    private notification: NotificationToastrService,
  ) {
    this.page.pageNumber = Constants.DEFAULT_PAGE_NUMBER;
    this.page.size = Constants.DEFAULT_PAGE_SIZE;
  }

  ngOnInit() {}

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  loadProvinces() {
    this.loading = true;
    if (this.activeUserProgramRole && this.isFilterLoaded) {
      this.provinceService.search(this.page).then(res => {
        this.page = res.page;
        this.rows = res.data;
        this.loading = false;
      });
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadProvinces();
  }

  search() {
    this.page.filters = this.filterValues;
    this.page.pageNumber = 0;
    this.loadProvinces();
  }

  async onSort(event) {
    this.page.sorts = event.sorts;
    this.loading = true;
    this.page.pageNumber = 0;
    this.loadProvinces();
  }

  ngOnChanges(changes) {
    if (this.activeUserProgramRole && this.isFilterLoaded) {
      this.search();
    }
  }

  openModal(template: TemplateRef<any>, index: number, objId: any) {
    this.confirmDeleteModalRef = this.modalService.show(template);
    this.provinceIndex = index;
    this.objId = objId;
    this.provinceName = this.rows[index].name;
  }

  closeModal() {
    if (!this.confirmDeleteModalRef) {
      return;
    }
    this.confirmDeleteModalRef.hide();
    this.confirmDeleteModalRef = null;
  }

  // deleteProvince() {
  //   this.provinceService.deleteItem(this.objId);
  //   this.provinceService.search(this.page).then(res => {
  //     this.loading = true;
  //     this.rows = res.data;
  //     this.page = res.page;
  //     this.loading = false;
  //   });
  //   this.closeModal();
  // }

  deactivateProvince() {
    this.notification.alert(
      'success',
      `Successfully deactivated ${this.provinceName}`,
    );
    this.closeModal();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }
}
