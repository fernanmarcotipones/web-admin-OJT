import { NgModule } from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { SharedModule } from 'app/shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminGuardService } from './admin-guard.service';
import { AdminComponent } from './admin.component';


@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    BsDropdownModule.forRoot(),
    ChartsModule,
  ],
  providers: [
    AdminGuardService
  ],
  declarations: [
    AdminComponent,
  ],
})
export class AdminModule {
}
