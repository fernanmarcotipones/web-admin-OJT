import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FormRoutingModule} from './form-routing.module';

import { FormListComponent } from './list/list.component';
import { FormTableComponent } from './table/table.component';
import { ManagementComponent } from './management/management.component';

@NgModule({
  imports: [
    SharedModule,
    FormRoutingModule,
  ],
  providers: [ ],
  declarations: [
    FormListComponent,
    FormTableComponent,
    ManagementComponent,
  ],
  entryComponents: [
    FormListComponent,
  ],
  exports: [
  ]
})
export class FormModule { }
