import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ApplicationDataService } from '../../../shared/services/applicationData/application-data.service';
import { AccountService } from '../../../shared/services/account/account.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DeleteDialogComponent } from '../../component/delete-dialog/delete-dialog.component';
import { EditDeleteService } from '../../../shared/services/edit-delete/edit-delete.service';


@Component({
  selector: 'ngx-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent implements OnInit {
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
  public editData: any;
  public item: any;
  public templateTestcaseData: any;
  public isEdit: boolean;
  public submitted: boolean;
  public isDisableClose: boolean = false;

  constructor(
    private dialogService: NbDialogService,
    private dialogRef: NbDialogRef<TemplateDialogComponent>,
    private fb: FormBuilder,
    private applicationDataService: ApplicationDataService,
    private accountService: AccountService,
    private editDeleteService: EditDeleteService) {
  }

  ngOnInit() {

    let data
    if (this.selectedAction === '' && this.selectedType === 'template') {
      data = this.item?.screens.map((testcase) => testcase.ins_set_screen_name)
      this.templateTestcaseData = data;
    }

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
      templateName: ['', [ this.noSpacesValidator(), Validators.required]],
      // description: ['',[Validators.required, Validators.pattern(/^(?!.*\s{2,}).*$/)]]
      description: ['',[ this.noSpacesValidator(), Validators.required]],
      quick: [false]
    })

    this.testCases = this.fb.group({
      templates: [[], Validators.required],
    })

    this.patchFormValues();

  }


  
  drop(event: CdkDragDrop<string[]>) {
    this.isDisableClose = true;
    
    moveItemInArray(this.item.instructions, event.previousIndex, event.currentIndex);
  }

  dropScreen(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.item.screens, event.previousIndex, event.currentIndex);
  }

  patchFormValues() {
    if (this.item) {
      // Assuming 'screen_name' exists in 'editData'
      if(this.item.screen_name){
        this.testCaseName.patchValue({
          test_case_name: this.item.screen_name.trim(),
        });
      }

      // Optionally, you can patch the 'instruction' or 'template' values similarly
      if (this.item.instructionArr) {
        this.instruction.patchValue({
          instructionArr: this.item.instructionArr
        });
      }

      if (this.item.wt_name) {
        console.log(this.item);
        
        this.templateForm.patchValue({
          templateName: this.item.wt_name,
          description: this.item.wt_desc,
        });
      }

      if (this.item.testCases) {
        this.testCases.patchValue({
          templates: this.item.testCases,
        });
      }
    }
  }

  noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.trim().length === 0) {
        return { 'noSpaces': true };
      }
      return null; // null means valid
    };
  }



  onSubmit(type?) {
    // const trimmedValues = { 
    //   ...this.templateForm.value, 
    //   description: this.templateForm.get('description')?.value.trim() // Trim specific control
    // };
    
    this.submitted = true;

    if (type === 'reorder') {
      this.dialogRef.close({ confirmed: true, data: this.item, selectedAction: this.selectedAction, selectedType: this.selectedType, isEdit: this.isEdit });

    }

    if (this.testCaseName.valid) {
      this.dialogRef.close({ confirmed: true, data: this.testCaseName.value, selectedAction: this.selectedAction, selectedType: this.selectedType, isEdit: this.isEdit });
    }
    if (this.instruction.valid) {
      this.dialogRef.close({ confirmed: true, data: this.instruction.value, selectedAction: this.selectedAction, selectedType: this.selectedType });
    }
    
    if (this.templateForm.valid && this.templateForm.value.description.trim().length > 0 && this.templateForm.value.templateName.trim().length > 0) {
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

  deleteInstruction(inst) {

  }

  openDeleteDailog(item) {
    const dialogRef = this.dialogService.open(DeleteDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true,
      context: { itemToDelete: item }
    });


    dialogRef.onClose.subscribe((result) => {

      if (result) {
        if (result.confirmed) {
          if (this.selectedAction === 'template') {
            let app_id = localStorage.getItem('app_id');
            let body = {
              wt_id: this.item?.wt_id,
              instructions_set: this.item.screens.map((screen, index) => {
                if (screen.ins_set_id === result?.data?.screenId) {
                  return {
                    id: screen.ins_set_id,
                    order: '0',
                    extra: {}
                  };
                } else {

                  return {
                    id: screen.ins_set_id,
                    order: index < this.item.screens.findIndex((item: any) => item.ins_set_id === result?.data?.screenId) ? (index + 1).toString() : (index).toString(),
                    extra: {}
                  };
                }
              })
            };

            const templateid = this.item?.wt_id;
            const testCaseid = result.data.screenId;
            
            
            this.accountService.deleteTemplateTestCases(templateid, testCaseid).subscribe((resp) => {
              if (resp) {
                // this.getAllPages()
                const screensLeft = this.item?.screens?.filter((screen) => screen.ins_set_id !== item.ins_set_id);
    
                this.item.screens = screensLeft;

                this.editDeleteService.setTemplateDeleteSubject(resp);
              }
            })

            // this.deleteTestcase(result.data)

          }
          else {

            // this.saveApplicationData(appDetails);
            let app_id = localStorage.getItem('app_id');

            let body = {
              instruction_set_id: result?.data?.testcase_id,
              instruction_id: this.item.instructions.map((instruction, index) => {
                if (instruction.instruction_id === result?.data?.instruction_id) {
                  return {
                    id: instruction.instruction_id,
                    order: '0',
                    extra: {}
                  };
                } else {

                  return {
                    id: instruction.instruction_id,
                    order: index < this.item.instructions.findIndex((item: any) => item.instruction_id === result?.data?.instruction_id) ? (index + 1).toString() : (index).toString(),
                    extra: {}
                  };
                }
              })
            };


            const testid = result?.data?.testcase_id;
            const instid = result?.data?.instruction_id;
            this.accountService.deletePageInstructions(testid, instid).subscribe((resp) => {
              if (resp) {
                // this.getAllPages()
                this.isDisableClose = true;

                const instructionsLeft = this.item?.instructions?.filter((instruction) => instruction.instruction_id !== item.instruction_id);

                this.item.instructions = instructionsLeft;


                this.editDeleteService.setTestCaseDeleteSubject(resp);
              }
            })

            // this.deleteTestcase(result.data)

          }
        }
      }
    });

  }

  //

}
