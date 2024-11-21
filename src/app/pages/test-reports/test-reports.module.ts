import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestReportsRoutingModule } from './test-reports-routing.module';
import { TestReportsComponent } from './test-reports.component';
import {NbCardModule, NbTreeGridModule} from "@nebular/theme";
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    TestReportsComponent
  ],
  imports: [
    CommonModule,
    TestReportsRoutingModule,
    NbCardModule,
    NgxEchartsModule
  ]
})
export class TestReportsModule { }
