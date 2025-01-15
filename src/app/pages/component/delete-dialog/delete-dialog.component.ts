import { Component, OnInit } from '@angular/core';
import { NbCalendarRange, NbDateService, NbDialogRef } from '@nebular/theme';
import { FilterModelComponent } from "../../signout/filter-model/filter-model.component";

@Component({
  selector: 'ngx-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {
  public itemToDelete: any;
  public typeName: any;

  constructor(private ref: NbDialogRef<DeleteDialogComponent>) {
  }

  ngOnInit(): void {

  }

  cancel() {
    this.ref.close('cancel');
  }

  submit() {
    this.ref.close({ confirmed: true, data: { insId: this.itemToDelete.id, testcase_id: this.itemToDelete.instruction_set_id, template_id: this.itemToDelete.wt_id, instruction_id: this.itemToDelete.instruction_id, screenId: this.itemToDelete.ins_set_id, appId: this.itemToDelete.id } });
  }
}
