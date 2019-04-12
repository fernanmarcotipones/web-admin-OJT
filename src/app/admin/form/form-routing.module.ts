import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { FormListComponent } from './list/list.component';
import { ManagementComponent } from './management/management.component';

export const routerConfig: Route[] = [
  {
    path: 'form',
    data: {
      title: 'Form'
    },
    component: FormListComponent
  },
  {
    path: 'form/list',
    data: {
      title: 'Form'
    },
    component: FormListComponent
  },
  {
    path: 'form/management',
    data: {
      title: 'Form Management'
    },
    component: ManagementComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routerConfig)
  ],
  exports: [RouterModule]
})
export class FormRoutingModule{
}
