import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CSOListComponent } from './list/list.component';
import { CsoComponent } from './cso.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsoRoutingModule { }
