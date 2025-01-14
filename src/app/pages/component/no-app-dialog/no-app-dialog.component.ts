import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-no-app-dialog',
  templateUrl: './no-app-dialog.component.html',
  styleUrls: ['./no-app-dialog.component.scss']
})
export class NoAppDialogComponent implements OnInit, AfterViewInit{
  public myForm: FormGroup;
  public selectedItem: '';
  public submitted: boolean = false;
  public itemToEdit: any;
  public selectedType: string = '';
  constructor(private dialogRef: NbDialogRef<NoAppDialogComponent>, private fb: FormBuilder){

  }

  ngOnInit() {
    console.log(this.itemToEdit);
    
    this.myForm = this.fb.group({
      platform: ['', [Validators.required]],
      application: ['', [Validators.required]],
    });

    this.patchFormValues()
  }

  patchFormValues() {
    if (this.selectedType === 'edit') {
      // Assuming 'screen_name' exists in 'editData'
      this.myForm.patchValue({
        application: this.itemToEdit.app_name,
      });

    }
  }

  ngAfterViewInit() {
    // Disable any autofocus behavior here if needed
    setTimeout(() => {
      const applicationInput = document.getElementById('application');
      if (applicationInput) {
        applicationInput.blur(); // Remove focus explicitly
      }
    });
  }


  onSubmit() {
    this.submitted = true;

    if(this.myForm.value.platform === '' && this.myForm.value.app_name !== ''){
      this.dialogRef.close({ confirmed: true, data: this.myForm.value, type: this.selectedType, appId: this.itemToEdit.id });
    }
    if (this.myForm.valid) {
      
      this.dialogRef.close({ confirmed: true, data: this.myForm.value, type: this.selectedType });
    }
  }

  close() {
    this.dialogRef.close({confirmed: false});  
  }
}
