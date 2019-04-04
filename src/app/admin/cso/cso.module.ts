import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CsoRoutingModule } from './cso-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { CSOListComponent } from './list/list.component';
import { TableComponent } from './table/table.component'

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CsoRoutingModule
  ],
  declarations: [CSOListComponent, TableComponent]
})
export class CsoModule { }
