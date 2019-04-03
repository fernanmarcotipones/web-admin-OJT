import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

export const routes: Routes = [
  {path: '',
    component: AppComponent,
    data: {
      title: 'Home'
    },
    loadChildren: './app-children.module#AppChildrenModule'
  },
  {path: '**', redirectTo: '/error/404', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
