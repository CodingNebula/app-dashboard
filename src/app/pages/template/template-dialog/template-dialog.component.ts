import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent {
  public myForm: FormGroup;
  public templateForm: FormGroup;
  public selectedItems: string[] = [];
  public instructionsArr: any[] = [];
  public selectedAction : string;
  public testCaseArr: any[] = [];
  public templates: string[] = [];

  constructor(private dialogRef: NbDialogRef<TemplateDialogComponent>, private fb: FormBuilder){
    this.instructionsArr = [
      {
          "actions": "click_button",
          "elem_name": "Welcome_Next_Button",
          "normal_name": "Welcome_Next_Button"
      },
      {
          "actions": "left-arrow",
          "elem_name": "Welcome_Back_Button",
          "normal_name": "Welcome_Back_Button"
      },
      {
          "actions": "right-arrow",
          "elem_name": "Permission_Next_Button",
          "normal_name": "Permission_Next_Button"
      },
      {
          "actions": "click_image",
          "elem_name": "Permission_Image",
          "normal_name": "Permission_Image"
      }
  ]
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      test_case_name: ['', [Validators.required]],
      testCases: [[], [Validators.required]],
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
    if (this.myForm.valid) {
      this.dialogRef.close({ confirmed: true, data: this.myForm.value, selectedAction: this.selectedAction });
    }

    if (this.templateForm.valid) {
      this.dialogRef.close({ confirmed: true, data: this.templateForm.value, selectedAction: this.selectedAction });
    }
  }

  onTestCaseChange(selectedItems: any[]) {
    // Update the testCases form control whenever the selection changes
    this.myForm.get('testCases')?.setValue(selectedItems);
  }

  onTemplateChange(templates: any[]){
    this.templateForm.get('templates')?.setValue(templates);
  }

  close() {
    this.dialogRef.close({confirmed: false});  
  }

}
