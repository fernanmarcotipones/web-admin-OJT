import { NgModule } from '@angular/core';

import { APIService } from './api.service';
import { environment } from 'environments/environment';

export * from './api.service';

@NgModule({
  providers: [
    APIService
  ]
})
export class APIModule {
  constructor(private apiService: APIService) {
    apiService.initialize(environment.parse);
  }
}
