import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegionDetailsComponent } from './region/details/details.component';
import { RegionListComponent } from './region/list/list.component';

const routes: Routes = [
  {
    path: 'location-management',
    data: {
      title: 'Region'
    },
    component: RegionListComponent
  },
  {
    path: 'location-management/region',
    data: {
      title: 'Region List'
    },
    component: RegionListComponent
  },
  {
    path: 'location-management/region/add',
    data: {
      title: 'Add New Region'
    },
    component: RegionDetailsComponent,
  },
  {
    path: 'location-management/region/edit/:objId',
    data: {
      title: 'Edit Region'
    },
    component: RegionDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationManagmentRoutingModule {}
