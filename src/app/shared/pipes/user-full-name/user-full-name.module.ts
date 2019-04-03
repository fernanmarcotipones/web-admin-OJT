import { NgModule } from '@angular/core';
import { UserFullNamePipe } from './user-full-name.pipe';

@NgModule({
  declarations: [ UserFullNamePipe ],
  exports: [ UserFullNamePipe ],
})
export class UserFullNameModule {
}
