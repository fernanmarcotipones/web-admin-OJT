import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FormRoutingModule} from './form-routing.module';

import { FormListComponent } from './list/list.component';
import { FormTableComponent } from './table/table.component';

@NgModule({
  imports: [
    SharedModule,
    FormRoutingModule,
  ],
  providers: [ ],
  declarations: [
    FormListComponent,
    FormTableComponent,
  ],
  entryComponents: [
    FormListComponent,
  ],
  exports: [
  ]
})
export class FormModule { }
