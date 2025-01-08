import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ApplicationDataService } from '../../../shared/services/applicationData/application-data.service';
import { AccountService } from '../../../shared/services/account/account.service';

@Component({
  selector: 'ngx-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent {
  public testCaseName: FormGroup;
  public instruction: FormGroup;
  public templateForm: FormGroup;
  public selectedItems: string[] = [];
  public instructionsArr: any[] = [];
  public selectedAction: string;
  public testCaseArr: any[] = [];
  public templates: string[] = [];
  public appDetails: any;
  public selectedType: string;
  public testCases: FormGroup;
  public appName: any;
  public editData:any;

  constructor(
    private dialogRef: NbDialogRef<TemplateDialogComponent>,
    private fb: FormBuilder,
    private applicationDataService: ApplicationDataService,
  private accountService: AccountService) {
    }

  ngOnInit() {
    this.appDetails = this.applicationDataService.getData();
    this.appName = localStorage.getItem('app_name');
    

    this.testCaseName = this.fb.group({
      test_case_name: ['', [Validators.required]],
      // testCases: [[], [Validators.required]],
    });
    
    this.instruction = this.fb.group({
      instructionArr: [[], [Validators.required]],
    })

    this.templateForm = this.fb.group({
      templateName: ['', [Validators.required]],
      description: ['', Validators.required],
    })

    this.testCases = this.fb.group({
      templates: [[], Validators.required],
    })

this.patchFormValues()

  }


  patchFormValues() {
    if (this.editData) {
      // Assuming 'screen_name' exists in 'editData'
      this.testCaseName.patchValue({
        test_case_name: this.editData.screen_name,
        elem_name: this.editData.screen_name,
        normal_name: this.editData.screen_name,
      });

      // Optionally, you can patch the 'instruction' or 'template' values similarly
      if (this.editData.instructionArr) {
        this.instruction.patchValue({
          instructionArr: this.editData.instructionArr
        });
      }

      if (this.editData.templateName) {
        this.templateForm.patchValue({
          templateName: this.editData.templateName,
          description: this.editData.description,
        });
      }

      if (this.editData.testCases) {
        this.testCases.patchValue({
          templates: this.editData.testCases,
        });
      }
    }
  }



  onSubmit() {
    if (this.testCaseName.valid) {
      this.dialogRef.close({ confirmed: true, data: this.testCaseName.value, selectedAction: this.selectedAction, selectedType: this.selectedType });
    }
    if (this.instruction.valid) {
      this.dialogRef.close({ confirmed: true, data: this.instruction.value, selectedAction: this.selectedAction, selectedType: this.selectedType });
    }

    if (this.templateForm.valid) {
      this.dialogRef.close({ confirmed: true, data: this.templateForm.value, selectedAction: this.selectedAction, selectedType: this.selectedType });
    }
    if (this.testCases.valid) {
      this.dialogRef.close({ confirmed: true, data: this.testCases.value, selectedAction: this.selectedAction, selectedType: this.selectedType });
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

  // 

}
