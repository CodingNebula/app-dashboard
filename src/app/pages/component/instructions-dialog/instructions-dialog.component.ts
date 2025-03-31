import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'ngx-instructions-dialog',
  templateUrl: './instructions-dialog.component.html',
  styleUrls: ['./instructions-dialog.component.scss']
})
export class InstructionsDialogComponent implements OnInit {
  public myForm: FormGroup;
  public selectedItem: '';
  public itemToEdit: any;
  public submitted: boolean = false;

  constructor(private dialogRef: NbDialogRef<InstructionsDialogComponent>, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      actions: ['', [Validators.required, this.noSpacesValidator()]],
      elem_name: [''],
      normal_name: ['', [Validators.required]]
    });

    this.patchFormValues()
  }

  noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasSpace = control.value && control.value.includes(' ');
      return hasSpace ? { 'noSpaces': true } : null;
    };
  }

  preventSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();  // Prevent space from being entered
    }
  }

  patchFormValues() {
    if (this.itemToEdit) {
      this.myForm.controls['actions'].setValue(this.itemToEdit.back_name.trim());
      
      const elementName = this.itemToEdit.element_name[0]; // Access the string in the array
      if (typeof elementName === 'string') {
        this.myForm.controls['elem_name'].setValue(elementName.trim());
      } else {
        this.myForm.controls['elem_name'].setValue(''); // or a fallback value
      }
      // this.myForm.controls['elem_name'].setValue(elementName);
      // this.myForm.controls['elem_name'].setValue(this.itemToEdit.element_name);
      this.myForm.controls['normal_name'].setValue(this.itemToEdit.instruction_name.trim());
    }
  }


  deleteInstruction(instId) {
  }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {

      this.dialogRef.close({ confirmed: true, data: { formValue: this.myForm.value, isEdit: this.itemToEdit ? true : false, insId: this.itemToEdit ? this.itemToEdit.id : null } });
    }
  }


  close() {
    this.dialogRef.close({ confirmed: false });
  }

}
