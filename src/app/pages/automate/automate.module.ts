import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomateComponent } from './automate.component';
import { NbSpinnerModule } from '@nebular/theme';



@NgModule({
  declarations: [
    // AutomateComponent
  ],
  imports: [
    CommonModule,
    NbSpinnerModule
  ]
})
export class AutomateModule { }
