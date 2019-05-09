import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FormRoutingModule} from './form-routing.module';

import { FormListComponent } from './list/list.component';
import { FormTableComponent } from './table/table.component';
import { ManagementComponent } from './management/management.component';
import { FieldComponent } from './management/field/field.component';
import { FormPreviewComponent } from './management/form-preview/form-preview.component';

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
    FieldComponent,
    FormPreviewComponent,
  ],
  entryComponents: [
    FormListComponent,
  ],
  exports: [
  ]
})
export class FormModule { }
