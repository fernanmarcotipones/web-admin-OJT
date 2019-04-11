import { NgModule } from '@angular/core';

import { IndexModule } from './index/index.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { CsoModule } from './cso/cso.module';
import { LocationManagementModule } from './location-management/location-management.module';

@NgModule({
  imports: [
    IndexModule,
    UserModule,
    FormModule,
    CsoModule,
    LocationManagementModule
  ],
  declarations: []
})
export class AdminChildrenModule {
}
