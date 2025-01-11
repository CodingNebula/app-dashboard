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
  constructor(private dialogRef: NbDialogRef<NoAppDialogComponent>, private fb: FormBuilder){

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      platform: ['', [Validators.required]],
      application: ['', [Validators.required]],
    });
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

    if (this.myForm.valid) {
      this.dialogRef.close({ confirmed: true, data: this.myForm.value });
    }
  }

  close() {
    this.dialogRef.close({confirmed: false});  
  }
}
