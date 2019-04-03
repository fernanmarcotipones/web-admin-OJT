import { NgModule } from '@angular/core';

import { CurrentUserService } from './current-user.service';

export * from './current-user.service';

@NgModule({
  providers: [
    CurrentUserService
  ]
})
export class CurrentUserServiceModule {
}
