import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-editautomate',
  templateUrl: './editautomate.component.html',
  styleUrls: ['./editautomate.component.scss']
})
export class EditautomateComponent {
  public itemsToEdit: any;

  constructor(private dialogRef: NbDialogRef<EditautomateComponent>){

  }

   ngOnInit() {
      console.log(this.itemsToEdit);
      
    }

  onSubmit(){
    console.log('Updated items:', this.itemsToEdit);
    this.dialogRef.close({data: this.itemsToEdit});
  }
  close(){
    this.dialogRef.close();
  }
}
