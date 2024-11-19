import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { NbCheckboxModule, NbLayoutModule } from '@nebular/theme';
import { LoginColumnLayoutComponent } from '../@theme/layouts/login-column/login-column.layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    LoginColumnLayoutComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    NbLayoutModule,
    NbCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ], 
})
export class AuthModule { }
