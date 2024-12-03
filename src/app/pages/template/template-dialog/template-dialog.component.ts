import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ApplicationDataService } from '../../../shared/services/applicationData/application-data.service';

@Component({
  selector: 'ngx-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent {
  public testCaseName: FormGroup;
  public templateForm: FormGroup;
  public selectedItems: string[] = [];
  public instructionsArr: any[] = [];
  public selectedAction: string;
  public testCaseArr: any[] = [];
  public templates: string[] = [];
  public appDetails: any;
  public selectedType: string;

  constructor(
    private dialogRef: NbDialogRef<TemplateDialogComponent>,
    private fb: FormBuilder,
    private applicationDataService: ApplicationDataService) {
    }

  ngOnInit() {
    this.appDetails = this.applicationDataService.getData();
    console.log(this.appDetails?.instructions);

    console.log(this.selectedType);
    
    
    this.instructionsArr = this.appDetails?.instructions;

    this.testCaseName = this.fb.group({
      test_case_name: ['', [Validators.required]],
      // testCases: [[], [Validators.required]],
    });

    this.templateForm = this.fb.group({
      templateName: ['', [Validators.required]],
      templates: [[], Validators.required],
      description: ['', Validators.required],
    })


    // if (this.item) {
    //   this.myForm.patchValue({
    //     application: this.item?.application,
    //     testCases: this.item?.testCases,
    //   });
    // }
  }

  onSubmit() {
    if (this.testCaseName.valid) {
      this.dialogRef.close({ confirmed: true, data: this.testCaseName.value, selectedAction: this.selectedAction, selectedType: this.selectedType });
    }

    if (this.templateForm.valid) {
      this.dialogRef.close({ confirmed: true, data: this.templateForm.value, selectedAction: this.selectedAction, selectedType: this.selectedType });
    }
  }

  onTestCaseChange(selectedItems: any[]) {
    // Update the testCases form control whenever the selection changes
    this.testCaseName.get('testCases')?.setValue(selectedItems);
  }

  onTemplateChange(templates: any[]) {
    this.templateForm.get('templates')?.setValue(templates);
  }

  close() {
    this.dialogRef.close({ confirmed: false });
  }

}
