import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-instructions-dialog',
  templateUrl: './instructions-dialog.component.html',
  styleUrls: ['./instructions-dialog.component.scss']
})
export class InstructionsDialogComponent {
  public myForm: FormGroup;
  public selectedItem: '';

  constructor(private dialogRef: NbDialogRef<InstructionsDialogComponent>, private fb: FormBuilder){

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      actions: ['', [Validators.required]],
      elem_name: [''],
      normal_name: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      
      this.dialogRef.close({ confirmed: true, data: this.myForm.value });
    }
  }
  

  close() {
    this.dialogRef.close({confirmed: false});  
  }

}
