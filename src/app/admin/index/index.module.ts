import { NgModule } from '@angular/core';

import { IndexRoutingModule } from './index-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { IndexComponent } from './index.component';

@NgModule({
  imports: [
    SharedModule,
    IndexRoutingModule
  ],
  declarations: [ IndexComponent ]
})
export class IndexModule {
}
