import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  ViewChild,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Page, RegionService } from 'app/core';
import { Constants } from 'app/shared/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-admin-region-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class RegionTableComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(BsModalRef) confirmDeleteModalRef: BsModalRef;
  @Input() activeUserProgramRole: any;
  @Input() filterValues: any;
  @Input() isFilterLoaded: boolean;

  public regionName: string;
  public regionIndex: any;
  public objId: any;
  public loading = false;
  public page = new Page();
  public rows = new Array();

  private subscriptions: Array<Subscription> = [];

  constructor(
    private regionService: RegionService,
    private modalService: BsModalService,
  ) {
    this.page.pageNumber = Constants.DEFAULT_PAGE_NUMBER;
    this.page.size = Constants.DEFAULT_PAGE_SIZE;
  }

  ngOnInit() {}
  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  loadRegions() {
    this.loading = true;
    if (this.activeUserProgramRole && this.isFilterLoaded) {
      this.regionService.search(this.page).then(res => {
        console.log(res)
        this.rows = res.data;
        this.page = res.page;
        this.loading = false;
      });
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadRegions();
  }

  search() {
    this.page.filters = this.filterValues;
    this.page.pageNumber = 0;
    this.loadRegions();
  }

  onSort(event) {
    this.page.sorts = event.sorts;
    this.loading = true;
    this.page.pageNumber = 0;
    this.loadRegions();
  }

  ngOnChanges(changes) {
    if (this.activeUserProgramRole && this.isFilterLoaded) {
      this.search();
    }
  }

  openModal(template: TemplateRef<any>, index: number, objId: any) {
    this.confirmDeleteModalRef = this.modalService.show(template);
    this.regionIndex = index;
    this.objId = objId;
    this.regionName = this.rows[index].name;
  }

  closeModal() {
    if (!this.confirmDeleteModalRef) {
      return;
    }
    this.confirmDeleteModalRef.hide();
    this.confirmDeleteModalRef = null;
  }

  // deleteRegion() {
  //   this.regionService.deleteItem(this.objId);
  //   this.regionService.getAll().then(data => {
  //     this.loading = true;
  //     this.rows = data;
  //     this.loading = false;
  //   });
  //   this.closeModal();
  // }

  deactivateRegion() {
    // this.regionService.deactivateRegion(this.objId, { isDeactivated: true });
    this.closeModal();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }
}


