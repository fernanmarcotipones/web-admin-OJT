import { NgModule } from '@angular/core';

import { IndexModule } from './index/index.module';
import { UserModule } from './user/user.module';

@NgModule({
  imports: [
    IndexModule,
    UserModule,
  ]
})
export class AdminChildrenModule {
}
