import { NgModule } from '@angular/core';

import { MapDirectiveModule } from './map/map.directive.module';
import { AsideDirectiveModule } from './aside/aside.directive.module';
import { NavDropdownDirectiveModule } from './nav-dropdown/nav-dropdown.module';
import { SidebarDirectiveModule } from './sidebar/sidebar.module';

@NgModule({
  exports: [
    MapDirectiveModule,
    AsideDirectiveModule,
    NavDropdownDirectiveModule,
    SidebarDirectiveModule
  ]
})
export class DirectivesModule {
}
