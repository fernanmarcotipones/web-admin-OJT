import {NgModule} from '@angular/core';

import { UserFullNameModule } from './user-full-name/user-full-name.module';

import { ParseDateModule } from './parse-date/parse-date.module';
import { ObjectKeysPipeModule } from './object-keys/object-keys.module';

@NgModule({
  exports: [
    UserFullNameModule,
    ParseDateModule,
    ObjectKeysPipeModule
  ]
})
export class PipesModule {
}
