import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'ngx-test-cases-dialog',
  templateUrl: './test-cases-dialog.component.html',
  styleUrls: ['./test-cases-dialog.component.scss']
})
export class TestCasesDialogComponent implements OnInit {
  public myForm: FormGroup;
  public selectedItems: string[] = [];
  public context: any;
  public item: any;
  public endpoints: any[] = [];
  public isSubmit: boolean = false;
  public selectedEndpoint: string = '';
  constructor(private dialogRef: NbDialogRef<TestCasesDialogComponent>, private fb: FormBuilder){

    this.endpoints = ['Propay', 'pps', 'WorldNet'];

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      terminalName: ['', [Validators.required]],
      endpoint: ['', [Validators.required]],
      merchantId: ['', [Validators.required]],
      consumerKey: ['', [Validators.required]],
      secret: ['', [Validators.required]],
      gatewayUrl: ['', [Validators.required]]
    });


    if (this.item) {
      console.log(this.item);
      this.selectedEndpoint = this.item.endpoint;
      this.myForm.patchValue({
        terminalName: this.item?.terminalName,
        endpoint: this.item?.endpoint,
        merchantId: this.item?.configuration?.merchantId,
        consumerKey: this.item?.configuration?.consumerKey,
        secret: this.item?.configuration?.secret,
        gatewayUrl: this.item?.configuration?.gatewayUrl,
      });
    }
  }



  onTestCaseChange(selectedItems: any) {
    // Update the testCases form control whenever the selection changes
    this.myForm.get('endpoint')?.setValue(selectedItems);
    this.selectedEndpoint = selectedItems;
  }

  onSubmit() {
    this.isSubmit = true;
    console.log(this.myForm.value);
    if (this.myForm.valid) {
      this.dialogRef.close({ confirmed: true, data: this.myForm.value });
    }
  }

  close() {
    this.dialogRef.close({confirmed: false});
  }
}
