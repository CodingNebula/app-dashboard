import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestReportsRoutingModule } from './test-reports-routing.module';
import { TestReportsComponent } from './test-reports.component';
import {NbCardModule, NbTreeGridModule} from "@nebular/theme";


@NgModule({
  declarations: [
    TestReportsComponent
  ],
  imports: [
    CommonModule,
    TestReportsRoutingModule,
    NbCardModule,
  ]
})
export class TestReportsModule { }
