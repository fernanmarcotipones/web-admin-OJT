import { NgModule } from '@angular/core';
import { SidebarToggleDirective, SidebarMinimizeDirective, MobileSidebarToggleDirective, SidebarOffCanvasCloseDirective  } from './sidebar.directive';

@NgModule({
  declarations: [ SidebarToggleDirective, SidebarMinimizeDirective, MobileSidebarToggleDirective, SidebarOffCanvasCloseDirective ],
  exports: [ SidebarToggleDirective, SidebarMinimizeDirective, MobileSidebarToggleDirective, SidebarOffCanvasCloseDirective ],
})
export class SidebarDirectiveModule {
}
