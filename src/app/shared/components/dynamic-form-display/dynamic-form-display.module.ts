import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicFormDisplayComponent } from './dynamic-form-display.component';
import { DynamicFormItemComponent } from './dynamic-form-item.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DynamicFormDisplayComponent,
    DynamicFormItemComponent
  ],
  entryComponents: [
    DynamicFormDisplayComponent,
    DynamicFormItemComponent
  ],
  exports: [
    DynamicFormDisplayComponent,
    DynamicFormItemComponent
  ]
})
export class DynamicFormDisplayModule {}
