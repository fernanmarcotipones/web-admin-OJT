import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { UserDetailsComponent } from './details/details.component';
import { UserDetailsSummaryComponent } from './details/summary/summary.component';
import { UserListComponent } from './list/list.component';
import { UserTableComponent } from './table/table.component';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';

export * from './details/details.component';

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule,
  ],
  providers: [ ],
  declarations: [
    UserComponent,
    MyProfileComponent,
    UserDetailsComponent,
    UserDetailsSummaryComponent,
    UserListComponent,
    UserTableComponent,
    EditComponent,
    CreateComponent,
  ],
  entryComponents: [
    UserDetailsComponent,
    UserDetailsSummaryComponent,
  ],
  exports: [
    UserDetailsComponent,
    UserDetailsSummaryComponent,
  ]
})
export class UserModule { }
