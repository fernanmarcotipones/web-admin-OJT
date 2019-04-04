import { NgModule } from '@angular/core';

import { IndexModule } from './index/index.module';
import { UserModule } from './user/user.module';
import { CsoModule } from './cso/cso.module'

@NgModule({
  imports: [
    IndexModule,
    UserModule,
    CsoModule,
  ],
  declarations: []
})
export class AdminChildrenModule {
}
