import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AutomateComponent } from './automate/automate.component';
import { TestCasesComponent } from './test-cases/test-cases.component';
import { ApplicationComponent } from './application/application.component';
import { SignOutComponent } from './signout/signOut.component';
import {TestReportsComponent} from "./test-reports/test-reports.component";
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'application',
      component: ApplicationComponent
    },
    {
      path: 'test-cases',
      component: TestCasesComponent,
    },
    {
      path: 'automate',
      component: AutomateComponent,
    },
    {
      path: '',
      redirectTo: 'test-cases',
      pathMatch: 'full',
    },
    {
      path: 'test-reports',
      component: TestReportsComponent,
    },
    
    {
      path: 'signout',
      component: SignOutComponent,
    },
    {
      path:'reports',
      component:ReportsComponent
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
   
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
