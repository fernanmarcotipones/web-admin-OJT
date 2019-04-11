import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CsoRoutingModule } from './cso-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { CSOListComponent } from './list/list.component';
import { TableComponent } from './table/table.component';
import { DetailsComponent } from './details/details.component';
import { CsoGroupFormComponent } from './cso-group-form/cso-group-form.component'

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CsoRoutingModule
  ],
  declarations: [CSOListComponent, TableComponent, DetailsComponent, CsoGroupFormComponent]
})
export class CsoModule { }
