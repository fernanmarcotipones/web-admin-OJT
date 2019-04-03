import { NgModule } from '@angular/core';

import { FilterOptionsComponentModule } from './filter-options/filter-options.component.module';
import { DynamicFormDisplayModule } from './dynamic-form-display/dynamic-form-display.module';
import { UserExportsComponentModule } from './user-exports-table/user-exports-table.component.module';
import { UserAccountFormComponentModule } from './user-account-form/user-account-form.component.module';
import { UserProfileFormComponentModule } from './user-profile-form/user-profile-form.component.module';

export * from './filter-options/filter-options.component.module';
export * from './dynamic-form-display/dynamic-form-display.module';
export * from './user-exports-table/user-exports-table.component.module';
export * from './user-account-form/user-account-form.component.module';

@NgModule({
  exports: [
    FilterOptionsComponentModule,
    DynamicFormDisplayModule,
    UserExportsComponentModule,
    UserAccountFormComponentModule,
    UserProfileFormComponentModule,
  ],
})
export class ComponentsModule {
}
