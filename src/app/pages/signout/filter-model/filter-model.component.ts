import {Component, OnInit} from '@angular/core';
import {NbCalendarRange, NbDateService, NbDialogRef} from '@nebular/theme';
@Component({
  selector: 'ngx-filter-model',
  templateUrl: 'filter-model.component.html',
  styleUrls: ['filter-model.component.scss'],
})
export class FilterModelComponent {
  constructor(protected ref: NbDialogRef<FilterModelComponent>) {
  }

  cancel() {
    this.ref.close('cancel');
  }

  submit() {
    this.ref.close('submit');
  }
}
