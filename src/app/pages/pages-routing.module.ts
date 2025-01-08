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
import { TemplateComponent } from './template/template.component';
import { CapabilitiesComponent } from './component/capabilities/capabilities.component';
import { InstructionsComponent } from './component/instructions/instructions.component';
import {AuthGuard} from "../shared/services/guard/auth.guard";

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'application',
      canActivate: [AuthGuard],
      component: ApplicationComponent
    },
    {
      path: 'test-cases',
      canActivate: [AuthGuard],
      component: TestCasesComponent,
    },
    {
      path: 'automate',
      canActivate: [AuthGuard],
      component: AutomateComponent,
    },
    {
      path: '',
      redirectTo: 'test-cases',
      pathMatch: 'full',
    },
    {
      path: 'test-reports',
      canActivate: [AuthGuard],
      component: TestReportsComponent,
    },
    {
      path:'reports',
      canActivate: [AuthGuard],
      component:ReportsComponent
    },
    {
      path:'template',
      canActivate: [AuthGuard],
      component: TemplateComponent
    },
    {
      path: 'signout',
      component: SignOutComponent,
    },
    {
      path: 'capabilities',
      canActivate: [AuthGuard],
      component: CapabilitiesComponent
    },
    {
      path: 'instructions',
      canActivate: [AuthGuard],
      component: InstructionsComponent
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
