import {Component, OnInit} from '@angular/core';
import {NbCalendarRange, NbDateService, NbDialogRef} from '@nebular/theme';
import {FilterModelComponent} from "../../signout/filter-model/filter-model.component";

@Component({
  selector: 'ngx-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {
public itemToDelete: any;

  constructor(private ref: NbDialogRef<DeleteDialogComponent>) {
    console.log(this.itemToDelete,'itemsstoDeletere');
  }

  ngOnInit(): void {
    console.log(this.itemToDelete,'itemsstoDeletere');
  }

  cancel() {
    this.ref.close('cancel');
  }

  submit() {
    this.ref.close({confirmed: true, data: {insId:this.itemToDelete.id}});
  }
}
