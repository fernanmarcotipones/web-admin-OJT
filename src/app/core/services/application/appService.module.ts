import { NgModule } from '@angular/core';

import { AppProgramConfigurationService } from './appProgramConfiguration.service';
import { PsgcCodeCheckerService } from './psgcCodeChecker.service';
import { NotificationToastrService } from './notificationToastr.service';
import { SearchFilterService } from './searchFilter.service'

export * from './appProgramConfiguration.service';
export * from './psgcCodeChecker.service';
export * from './notificationToastr.service';
export * from './searchFilter.service'

@NgModule({
  providers: [
    AppProgramConfigurationService,
    PsgcCodeCheckerService,
    NotificationToastrService,
    SearchFilterService
  ]
})
export class AppServiceModule {
}
