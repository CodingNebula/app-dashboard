import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public editData: any;
  public templateTestcaseData: any;
  public isEdit: boolean;

  constructor(
    private dialogService: NbDialogService,
    private dialogRef: NbDialogRef<TemplateDialogComponent>,
    private fb: FormBuilder,
    private applicationDataService: ApplicationDataService,
    private accountService: AccountService,
  private editDeleteService: EditDeleteService) {
  }

  ngOnInit() {

    console.log(this.testCaseArr);
    

    let data
    if (this.selectedAction === '' && this.selectedType === 'template') {
      data = this.editData?.screens.map((testcase) => testcase.ins_set_screen_name)
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
      templateName: ['', [Validators.required]],
      description: ['', Validators.required],
    })

    this.testCases = this.fb.group({
      templates: [[], Validators.required],
    })

    this.patchFormValues()

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.editData.instructions, event.previousIndex, event.currentIndex);
  }

  dropScreen(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.editData.screens, event.previousIndex, event.currentIndex);
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

      if (this.editData.wt_name) {
        this.templateForm.patchValue({
          templateName: this.editData.wt_name,
          description: this.editData.wt_desc,
        });
      }

      if (this.editData.testCases) {
        this.testCases.patchValue({
          templates: this.editData.testCases,
        });
      }
    }
  }



  onSubmit(type?) {
    
    if (type === 'reorder') {
      this.dialogRef.close({ confirmed: true, data: this.editData, selectedAction: this.selectedAction, selectedType: this.selectedType, isEdit: this.isEdit });

    }

    if (this.testCaseName.valid) {
      this.dialogRef.close({ confirmed: true, data: this.testCaseName.value, selectedAction: this.selectedAction, selectedType: this.selectedType, isEdit: this.isEdit });
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
      console.log(result, this.selectedAction, this.selectedType);
      console.log(this.editData);
      
      

      if (result) {
        if (result.confirmed) {
          if(this.selectedAction === 'template'){
            let app_id = localStorage.getItem('app_id');
            console.log(this.editData?.wt_id);
            

          let body = {
            wt_id : this.editData?.wt_id,
            instructions_set: this.editData.screens.map((screen, index) => {
              if (screen.ins_set_id === result?.data?.screenId) {
                return {
                  id: screen.ins_set_id,  
                  order: '0',
                  extra: {}  
                };
              } else {
                
                return {
                  id: screen.ins_set_id,  
                  order: index < this.editData.screens.findIndex((item: any) => item.ins_set_id === result?.data?.screenId) ? (index + 1).toString() : (index).toString(),
                  extra: {}  
                };
              }
            })
          };
        
          console.log(body);
          

          const id = this.editData?.wt_id;
          this.accountService.updateTemplateScreens(id, body).subscribe((resp) => {
            if (resp) {
              // this.getAllPages()
              console.log(resp);
              
              this.editDeleteService.setTemplateDeleteSubject(resp);
            }
          })

          // this.deleteTestcase(result.data)

          }
          else{

          

          // this.saveApplicationData(appDetails);
          let app_id = localStorage.getItem('app_id');

          let body = {
            instruction_set_id: result?.data?.testcase_id,
            instruction_id: this.editData.instructions.map((instruction, index) => {
              if (instruction.instruction_id === result?.data?.instruction_id) {
                return {
                  id: instruction.instruction_id,  
                  order: '0',
                  extra: {}  
                };
              } else {
                
                return {
                  id: instruction.instruction_id,  
                  order: index < this.editData.instructions.findIndex((item: any) => item.instruction_id === result?.data?.instruction_id) ? (index + 1).toString() : (index).toString(),
                  extra: {}  
                };
              }
            })
          };
        

          const id = result?.data?.testcase_id;
          this.accountService.updatePageInstructions(id, body).subscribe((resp) => {
            if (resp) {
              // this.getAllPages()
              
              console.log(resp);
              
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
