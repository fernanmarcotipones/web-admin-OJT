import { NgModule } from '@angular/core';
import { NavDropdownDirective, NavDropdownToggleDirective } from './nav-dropdown.directive';

@NgModule({
  declarations: [ NavDropdownDirective, NavDropdownToggleDirective],
  exports: [ NavDropdownDirective, NavDropdownToggleDirective],
})
export class NavDropdownDirectiveModule {
}
