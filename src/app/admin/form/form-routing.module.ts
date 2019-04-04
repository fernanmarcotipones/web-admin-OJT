import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { FormListComponent } from './list/list.component';

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
];

@NgModule({
  imports: [
    RouterModule.forChild(routerConfig)
  ],
  exports: [RouterModule]
})
export class FormRoutingModule{
}
