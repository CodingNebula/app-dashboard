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
  public itemToEdit: any;
  public submitted: boolean = false;

  constructor(private dialogRef: NbDialogRef<InstructionsDialogComponent>, private fb: FormBuilder){

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      actions: ['', [Validators.required]],
      elem_name: [''],
      normal_name: ['', [Validators.required]]
    });

    this.patchFormValues()
  }

  patchFormValues() {
    if (this.itemToEdit) {
      this.myForm.controls['actions'].setValue(this.itemToEdit.back_name);
      this.myForm.controls['elem_name'].setValue(this.itemToEdit.element_name);
      this.myForm.controls['normal_name'].setValue(this.itemToEdit.instruction_name);
    }
  }


  deleteInstruction(instId){
  }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {

      this.dialogRef.close({ confirmed: true, data: {formValue: this.myForm.value, isEdit: this.itemToEdit?true: false, insId: this.itemToEdit?this.itemToEdit.id:null} });
    }
  }


  close() {
    this.dialogRef.close({confirmed: false});
  }

}
