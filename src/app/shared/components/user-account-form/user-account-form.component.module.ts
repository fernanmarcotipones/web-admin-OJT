import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { PipesModule } from '../../pipes/pipes.module'

import { UserAccountFormComponent } from './user-account-form.component';

@NgModule({
  imports: [CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    PipesModule,

    NgxDatatableModule,
    BsDatepickerModule.forRoot(),
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.rectangleBounce,
      backdropBackgroundColour: 'rgba(255,255,255,0.3)', backdropBorderRadius: '10px',
      primaryColour: '#ff0010', secondaryColour: '#e6e6e6', tertiaryColour: '#ffffff'
    }
    ),
  ],
  declarations: [UserAccountFormComponent],
  entryComponents: [UserAccountFormComponent],
  exports: [UserAccountFormComponent]
})
export class UserAccountFormComponentModule {
}
