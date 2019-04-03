import { NgModule } from '@angular/core';

import { APIModule } from './api/api.module';
import { AuthenticationServiceModule } from './authentication/authentication.service.module';
import { AppServiceModule } from './application/appService.module';
import { CurrentUserServiceModule } from './current-user/current-user.sevice.module';
import { DAOModule } from './dao/dao.module';
import { CurrentProgramConfirationServiceModule } from './current-program-configuration/current-program-configuration.service.module';

export * from './api/api.module';
export * from './authentication/authentication.service.module';
export * from './application/appService.module';
export * from './current-user/current-user.sevice.module';
export * from './dao/dao.module';
export * from './current-program-configuration/current-program-configuration.service.module';

@NgModule({
  imports: [
    APIModule,
    AuthenticationServiceModule,
    AppServiceModule,
    CurrentUserServiceModule,
    DAOModule,
    CurrentProgramConfirationServiceModule
  ]
})
export class ServicesModule {
}
