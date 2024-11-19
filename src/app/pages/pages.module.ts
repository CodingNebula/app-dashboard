import { NgModule } from '@angular/core';
import { NbAccordionModule, NbCardModule, NbDialogModule, NbIconModule, NbMenuModule, NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { AutomateComponent } from './automate/automate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestCasesComponent } from './test-cases/test-cases.component';
import { ApplicationComponent } from './application/application.component';
import { NoAppDialogComponent } from './component/no-app-dialog/no-app-dialog.component';
import { TestCasesDialogComponent } from './component/test-cases-dialog/test-cases-dialog.component';
import { SignOutComponent } from './signout/signOut.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    NbAccordionModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbIconModule,
    NbDialogModule.forRoot(),
    NbCardModule
  ],
  declarations: [
    PagesComponent,
    AutomateComponent,
    TestCasesComponent,
    ApplicationComponent,
    NoAppDialogComponent,
    SignOutComponent,
    TestCasesDialogComponent,
  ],
})
export class PagesModule {
}
