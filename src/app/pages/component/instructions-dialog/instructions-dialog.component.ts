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
      let elemNameValue = this.myForm.get('elem_name')?.value;
  
      // Check if the value contains spaces (indicating multiple elements)
      if (elemNameValue && elemNameValue.includes(' ')) {
        // If there are spaces, split the value into an array of strings
        this.myForm.patchValue({
          elem_name: elemNameValue.split(' ').filter(Boolean)
        });
      } else {
        // If there are no spaces, check if the value is a number or a single string
        if (!isNaN(elemNameValue)) {
          // If it's a number-like string, wrap it in an array
          this.myForm.patchValue({
            elem_name: [elemNameValue]
          });
        } else {
          // If it's a single word (like "Confirm"), keep it as a single string
          this.myForm.patchValue({
            elem_name: elemNameValue
          });
        }
      }
  
      // Now you can submit the data
      console.log(this.myForm.value);
      
      this.dialogRef.close({ confirmed: true, data: this.myForm.value });
    }
  }
  

  close() {
    this.dialogRef.close({confirmed: false});  
  }

}
