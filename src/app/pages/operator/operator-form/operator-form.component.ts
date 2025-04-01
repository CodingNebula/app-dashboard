import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {NbDialogRef} from "@nebular/theme";

@Component({
  selector: 'ngx-operator-form',
  templateUrl: './operator-form.component.html',
  styleUrls: ['./operator-form.component.scss']
})
export class OperatorFormComponent implements OnInit, AfterViewInit{
  public myForm: FormGroup;
  public selectedItem: '';
  public submitted: boolean = false;
  public itemToEdit: any;
  public selectedType: string = '';
  constructor(private dialogRef: NbDialogRef<OperatorFormComponent>, private fb: FormBuilder){

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      appName: ['', [this.noSpacesValidator(),Validators.required]],
      role: ['Operator', [this.noSpacesValidator(),Validators.required]],
      userName: ['', [this.noSpacesValidator(),Validators.required]],
      password: ['', [this.noSpacesValidator(),Validators.required]],
      pin: ['', [this.noSpacesValidator(),Validators.required]],
      secretkey: ['', [this.noSpacesValidator(),Validators.required]],
    });

    // this.patchFormValues()
  }

  // patchFormValues() {
  //   if (this.selectedType === 'edit') {
  //     // Assuming 'screen_name' exists in 'editData'
  //     this.myForm.patchValue({
  //       application: this.itemToEdit.app_name.trim(),
  //     });
  //
  //   }
  // }

  noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.trim().length === 0) {
        return { 'noSpaces': true };
      }
      return null;
    };
  }

  ngAfterViewInit() {
    // Disable any autofocus behavior here if needed
    setTimeout(() => {
      const applicationInput = document.getElementById('app');
      if (applicationInput) {
        applicationInput.blur(); // Remove focus explicitly
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.myForm.value);
    //
    // if(this.myForm.value.platform === '' && this.myForm.value.application !== '' && this.myForm.value.application.trim().length > 0){
    //   this.dialogRef.close({ confirmed: true, data: this.myForm.value, type: this.selectedType, appId: this.itemToEdit.id });
    // }
    // if (this.myForm.valid && this.myForm.value.application.trim().length > 0) {
    //
    //   this.dialogRef.close({ confirmed: true, data: this.myForm.value, type: this.selectedType });
    // }
    this.dialogRef.close({ confirmed: true, data: this.myForm.value});
  }

  close() {
    this.dialogRef.close({confirmed: false});
  }

}
