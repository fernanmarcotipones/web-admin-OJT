import { NgModule } from '@angular/core';
import { AdminModule } from './admin/admin.module';
import { ErrorModule } from './error/error.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { LoginModule } from './login/login.module';

@NgModule({
  imports: [
    AdminModule,
    ErrorModule,
    ForgotPasswordModule,
    LoginModule,
  ]
})
export class AppChildrenModule {
}
