import { NgModule } from '@angular/core';
import {
  NbAccordionModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule, NbListModule,
  NbMenuModule,
  NbPopoverModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTooltipModule
} from '@nebular/theme';

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
import {NgxEchartsModule} from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { TestReportsComponent } from './test-reports/test-reports.component';
import { ReportsComponent } from './reports/reports.component';
import { TemplateComponent } from './template/template.component';
import { CapabilitiesComponent } from './component/capabilities/capabilities.component';
import { InstructionsComponent } from './component/instructions/instructions.component';
import { InstructionsDialogComponent } from './component/instructions-dialog/instructions-dialog.component';
import { TemplateDialogComponent } from './template/template-dialog/template-dialog.component';
import { DeleteDialogComponent } from './component/delete-dialog/delete-dialog.component';
import {CdkDrag, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";

@NgModule({
    imports: [
        CommonModule,
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,
        MiscellaneousModule,
        NbAccordionModule,
        ReactiveFormsModule,
        NbSelectModule,
        NbIconModule,
        NbDialogModule.forRoot(),
        NbCardModule,
        NbPopoverModule,
        NgxEchartsModule,
        NbSpinnerModule,
        NbTooltipModule,
        NbAlertModule,
        NbButtonModule,
        NbListModule,
        CdkDropList,
        CdkDrag,
        CdkDragHandle
    ],
  declarations: [
    PagesComponent,
    AutomateComponent,
    TestCasesComponent,
    ApplicationComponent,
    NoAppDialogComponent,
    SignOutComponent,
    TestCasesDialogComponent,
    TestReportsComponent,
    ReportsComponent,
    TemplateComponent,
    CapabilitiesComponent,
    InstructionsComponent,
    InstructionsDialogComponent,
    TemplateDialogComponent,
    DeleteDialogComponent,
  ],
})
export class PagesModule {
}
