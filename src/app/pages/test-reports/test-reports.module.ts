import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestReportsRoutingModule } from './test-reports-routing.module';
import { TestReportsComponent } from './test-reports.component';
import {NbAccordionModule, NbCardModule, NbIconModule, NbTreeGridModule} from "@nebular/theme";
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; // Import FormsModule


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    TestReportsRoutingModule,
    NbCardModule,
    FormsModule,
    NgxEchartsModule,
    NbIconModule,
NbAccordionModule,
    BrowserAnimationsModule
  ]
})
export class TestReportsModule { }
