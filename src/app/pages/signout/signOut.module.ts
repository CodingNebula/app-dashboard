import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import {SignOutComponent} from './signOut.component';
import {FilterModelComponent} from './filter-model/filter-model.component';
import {NbButtonModule, NbCardModule} from "@nebular/theme";

@NgModule({
  imports: [
    ThemeModule,
    NbButtonModule,
    NbCardModule,
  ],
  declarations: [
    SignOutComponent,
    FilterModelComponent,
  ],
})
export class SignOutModule { }
