import { NgModule } from '@angular/core';

import { CurrentProgramConfigurationService } from './current-program-configuration.service';

export * from './current-program-configuration.service';

@NgModule({
  providers: [
    CurrentProgramConfigurationService
  ]
})
export class CurrentProgramConfirationServiceModule {
}
