import { NgModule } from '@angular/core';

import { IndexModule } from './index/index.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { CsoModule } from './cso/cso.module';

@NgModule({
  imports: [
    IndexModule,
    UserModule,
    FormModule,
    CsoModule,
  ],
  declarations: []
})
export class AdminChildrenModule {
}
