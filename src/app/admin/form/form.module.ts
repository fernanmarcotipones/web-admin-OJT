import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FormRoutingModule} from './form-routing.module';

import { FormListComponent } from './list/list.component';
import { FormTableComponent } from './table/table.component';
import { ManagementComponent } from './management/management.component';
import { FieldComponent } from './management/field/field.component';
import { ProfileSurveyComponent } from './management/field/profile-survey/profile-survey.component';

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
    ProfileSurveyComponent,
  ],
  entryComponents: [
    FormListComponent,
  ],
  exports: [
  ]
})
export class FormModule { }
