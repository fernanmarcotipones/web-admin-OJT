import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CSOListComponent } from './list/list.component';
import { CsoComponent } from './cso.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: 'cso',
    data: {
      title: 'CSO'
    },
    component: CSOListComponent
  },
  {
    path: 'cso/list',
    data: {
      title: 'CSO'
    },
    component: CSOListComponent
  },
  {
    path: 'cso/details',
    data: {
      title: 'CSO'
    },
    component: DetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsoRoutingModule { }
