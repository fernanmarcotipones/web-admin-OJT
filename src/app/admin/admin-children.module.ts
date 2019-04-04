import { NgModule } from '@angular/core';

import { IndexModule } from './index/index.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';

@NgModule({
  imports: [
    IndexModule,
    UserModule,
    FormModule,
  ]
})
export class AdminChildrenModule {
}
