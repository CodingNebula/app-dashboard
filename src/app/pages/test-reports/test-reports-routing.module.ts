import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAccordionModule } from '@nebular/theme';
import { NbIconModule } from '@nebular/theme';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestReportsRoutingModule { }
