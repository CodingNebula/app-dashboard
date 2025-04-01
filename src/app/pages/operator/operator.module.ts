import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatorRoutingModule } from './operator-routing.module';
import {OperatorComponent} from "./operator.component";
import { OperatorFormComponent } from './operator-form/operator-form.component';
import {NbCardModule} from "@nebular/theme";


@NgModule({
  declarations: [
    OperatorFormComponent
  ],
  imports: [
    CommonModule,
      NbCardModule,
    // OperatorRoutingModule
  ]
})
export class OperatorModule { }
