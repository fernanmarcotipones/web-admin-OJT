import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { UserListComponent } from './list/list.component';

export const routerConfig: Route[] = [
  {
    path: 'user',
    data: {
      title: 'Users'
    },
    component: UserListComponent
  },
  {
    path: 'user/list',
    data: {
      title: 'Users'
    },
    component: UserListComponent
  },{
    path: 'my-profile',
    data: {
      title: 'My Profile'
    },
    component: MyProfileComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routerConfig)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
