import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { UserListComponent } from './list/list.component';
import { EditComponent} from './edit/edit.component';
import { CreateComponent} from './create/create.component';

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
  }, {
    path: 'my-profile',
    data: {
      title: 'My Profile'
    },
    component: MyProfileComponent
  }, {
    path: 'user/edit',
    data: {
      title: 'Edit'
    },
    component: EditComponent
  }, {
    path: 'user/create',
    data: {
      title: 'Create'
    },
    component: CreateComponent
  },
  {
    path: 'user/edit/:id',
    data: {
      title: 'edit'
    },
    component: EditComponent
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
