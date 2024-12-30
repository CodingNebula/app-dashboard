import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomateComponent } from './automate.component';
import {NbAccordionModule, NbOptionModule, NbSelectModule, NbSpinnerModule} from '@nebular/theme';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    // AutomateComponent
  ],
  imports: [
    CommonModule,
    NbSpinnerModule,
    NbOptionModule,
    NbSelectModule,
    ReactiveFormsModule,
    NbAccordionModule
  ]
})
export class AutomateModule { }
