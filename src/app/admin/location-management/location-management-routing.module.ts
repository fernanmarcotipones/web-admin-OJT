import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegionDetailsComponent } from './region/details/details.component';
import { RegionListComponent } from './region/list/list.component';

import { ProvinceDetailsComponent } from './province/details/details.component';
import { ProvinceListComponent } from './province/list/list.component';

const routes: Routes = [
  //Region
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
  // Province
  {
    path: 'location-management/province',
    data: {
      title: 'Province List'
    },
    component: ProvinceListComponent,
  },
  {
    path: 'location-management/province/add',
    data: {
      title: 'Add New Province'
    },
    component: ProvinceDetailsComponent
  },
  {
    path: 'location-management/province/edit/:objId',
    data: {
      title: 'Edit Province'
    },
    component: ProvinceDetailsComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationManagmentRoutingModule {}