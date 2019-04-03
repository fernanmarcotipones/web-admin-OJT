import {NgModule} from '@angular/core';
import {RouterModule, Route} from '@angular/router';

import {ForgotPasswordComponent} from './forgot-password.component';

export const routerConfig: Route[] = [
  {path: 'forgot-password', component: ForgotPasswordComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routerConfig)
  ],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule {
}
