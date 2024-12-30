import {Component, OnInit} from '@angular/core';
import {NbCalendarRange, NbDateService, NbDialogRef} from '@nebular/theme';
import {FilterModelComponent} from "../../signout/filter-model/filter-model.component";

@Component({
  selector: 'ngx-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {


  constructor(protected ref: NbDialogRef<FilterModelComponent>) {
  }

  cancel() {
    this.ref.close('cancel');
  }

  submit() {
    this.ref.close('submit');
  }
}
