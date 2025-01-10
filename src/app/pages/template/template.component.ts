import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService, NbPopoverDirective } from '@nebular/theme';
import { TemplateDialogComponent } from './template-dialog/template-dialog.component';
import { Router } from '@angular/router';
import { ApplicationDataService } from '../../shared/services/applicationData/application-data.service';
import { AccountService } from '../../shared/services/account/account.service';
import { DeleteDialogComponent } from "../component/delete-dialog/delete-dialog.component";
import { EditDeleteService } from '../../shared/services/edit-delete/edit-delete.service';

@Component({
  selector: 'ngx-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  public testCases: any;
  public templates: any[] = [];
  public testCasesArray: any[] = [];
  public templateArray: any[] = [];
  public screenNameId: any;
  public instructionsArr: any[] = [];
  public templateId: any;
  public tempTestCase: any = {};
  public tempTemplate: any = {};
  public appName: any;
  public editDeleteSubcription: any;
  public isShowMenu:boolean=false;

  @ViewChild('popover') popover: NbPopoverDirective;
  @ViewChild('list', { read: TemplateRef }) templateList: TemplateRef<any>;

  constructor(
    private dialogService: NbDialogService,
    private router: Router,
    private accountService: AccountService,
    private applicationDataService: ApplicationDataService,
  private editDeleteService: EditDeleteService) {
    const appDetails = this.applicationDataService.getData();



  }

  ngOnInit() {
    this.getAllPages();
    this.getAllTemplates();
    this.getInstructions();
    this.subscribeToDelete();

    this.appName = localStorage.getItem('app_name');
  }

  ngOnDestroy(){
    if(this.editDeleteSubcription){
      this.editDeleteSubcription.unsubscribe();
    }
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

          // this.saveApplicationData(appDetails);
          let app_id = localStorage.getItem('app_id');

          this.deleteTestcase(result.data)

        }
      }
    });

  }


  deleteTestcase(ins_id) {

    const userId = localStorage.getItem('app_id')


    let url
    if (ins_id.testcase_id !== undefined) {
      url = `${userId}/${ins_id.testcase_id}`

      this.accountService.deleteTestCase(url).subscribe((response) => {
        if (response) {

          this.getAllPages();

        }
      }, (error) => {
        console.error('Error saving test case:', error);
      });


    } else {
      url = `${userId}/${ins_id.template_id}`
      this.accountService.deleteTemplate(url).subscribe((response) => {
        if (response) {

          this.getAllTemplates();

        }
      }, (error) => {
        console.error('Error saving test case:', error);
      });

    }




  }


  openDialog(action: string, type: string, id?: any, editData?: any, isEdit?: boolean) {
    // Open the dialog and pass data to it using 'context'
    

    const dialogRef = this.dialogService.open(TemplateDialogComponent, {
      context: { selectedAction: action, selectedType: type, testCaseArr: this.testCasesArray, instructionsArr: this.instructionsArr, editData: editData, isEdit: isEdit },
    });


    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {
      
      if (result?.confirmed) {
        if (result.selectedAction === 'testCase') {
          if (result.selectedType === 'name') {

            if (isEdit) {
              const details = {
                screenName: result.data.test_case_name,
                extra: {},
              }
              
              const api_url = `page/${localStorage.getItem('app_id')}/${id}`;
              this.accountService.updateTestCaseName(api_url, details).subscribe((res) => {
                if(res){
                  this.getAllPages();
                }
              })
            }
            else {
              const details = {
                screenName: result.data.test_case_name,
                applicationId: localStorage.getItem('app_id'),
                extra: {},
              }

              this.accountService.postPageName(details).subscribe((resp) => {
                if (resp) {

                  this.getAllPages();

                }
              })
              this.applicationDataService.setData('testCases', this.testCasesArray);

            }
          }

          if(result.selectedType === 'reorder'){
            
            let body = {
              instruction_set_id: result?.data?.instruction_set_id,  // This value can be dynamic
              instruction_id: result?.data?.instructions?.map((instruction, index) => {
                return {
                  id: instruction.instruction_id,  // Mapping the dynamic id from instructionsArray
                  order: (index + 1).toString(),     // Using index + 1 to set the order dynamically
                  extra: {}  // Adding any extra dynamic data
                };
              })
            };

            const id = result?.data?.instruction_set_id;

            this.accountService.updatePageInstructions(id, body).subscribe((resp) => {
              if (resp) {
                this.getAllPages()
              }
            })
          }

          if (result.selectedType === 'instruction') {

            let body = {
              instruction_set_id: id,  // This value can be dynamic
              instruction_id: result?.data?.instructionArr?.map((instruction, index) => {
                return {
                  id: instruction.id,  // Mapping the dynamic id from instructionsArray
                  order: (index + 1).toString(),     // Using index + 1 to set the order dynamically
                  extra: instruction.extra  // Adding any extra dynamic data
                };
              })
            };




            this.accountService.postPageInstructions(body).subscribe((resp) => {
              if (resp) {
                this.getAllPages();

              }
            })
            this.applicationDataService.setData('testCases', this.testCasesArray);
            // this.router.navigateByUrl('pages/capabilities');
          }
        }
        else if (result.selectedAction === 'template') {
          if (result.selectedType === 'name') {

            if (isEdit) {
              const details = {
                screenName: result.data.templateName,
                description:  result.data.description,
                extra: {},
              }
              
              const api_url = `workflow/${localStorage.getItem('app_id')}/${id}`;
              this.accountService.updateTestCaseName(api_url, details).subscribe((res) => {
                if(res){
                  this.getAllTemplates();
                }
              })
            } else{
              

            const details = {
              templateName: result.data.templateName,
              applicationId: localStorage.getItem('app_id'),
              description: result.data.description,
              extra: {},
            }


            this.accountService.postTemplateName(details).subscribe((resp) => {
              if (resp) {


                this.templateId = resp[0]?.wt_id
                this.getAllTemplates();
              }
            })
            this.applicationDataService.setData('testCases', this.testCasesArray);
          }
          
        }

        if(result.selectedType === 'reorder'){

          console.log(result);
            
          let body = {
            wt_id: result?.data?.wt_id,  // This value can be dynamic
            instructions_set: result?.data?.screens?.map((screen, index) => {
              return {
                id: screen.ins_set_id,  // Mapping the dynamic id from instructionsArray
                order: (index + 1).toString(),     // Using index + 1 to set the order dynamically
                extra: {}  // Adding any extra dynamic data
              };
            })
          };

          const id = result?.data?.wt_id;
          this.accountService.updateTemplateScreens(id, body).subscribe((resp) => {
            if (resp) {
              this.getAllTemplates();
            }
          })
        }

          if (result.selectedType === 'testCase') {

            let body = {
              application_id: localStorage.getItem('app_id'),  // This value can be dynamic
              wt_id: id,
              instructions_set: result?.data?.templates?.map((instruction, index) => {
                return {
                  id: instruction?.instruction_set_id,  // Mapping the dynamic id from instructionsArray
                  order: (index + 1).toString(),     // Using index + 1 to set the order dynamically
                  extra: {}  // Adding any extra dynamic data
                };
              })
            };


            let screens = result?.data?.templates?.map((screen, index) => {
              return {
                wt_id: screen?.wt_id,
                ins_set_id: screen?.instruction_set_id,
                ins_set_screen_name: screen?.screen_name,  // Setting the screen name dynamically from result.data.screen_name
                instructions: screen?.instructions?.map((instruction) => {
                  return {
                    ins_name: instruction?.instruction_name,
                    ins_back_name: instruction?.server_name,
                    ins_element_name: instruction?.element_name,  // Mapping each instruction's inst_name dynamically
                  };
                })
              };
            });

            let appId = localStorage.getItem('app_id');
            this.accountService.postTemplates(id, body).subscribe((resp) => {
              if (resp) {

                //   if (this.templateArray.length > 0) {
                //     this.templateArray.pop();
                // }

                // this.tempTemplate.screens = screens;
                //
                // this.templateArray.push(this.tempTemplate);
                this.getAllTemplates();

              }
            })
          }

        }
      }
      // }
    });
  }

  

  deleteInstruction(app_id, insId) {
    this.accountService.deleteInstruction(app_id, insId).subscribe((response) => {
      if (response) {
        this.getInstructions();
      }
    }, (error) => {
      console.error('Error saving test case:', error);
    });
  }

  automateTemplate(template: any) {

    const capabilities = {
      platformName: "Android",
      app: "/home/codingnebula/Downloads/app-debug-v12.apk",
      appPackage: "com.example.app",
      automationName: "UIAutomator2",
      deviceName: "Samsung",
      noReset: true,
      ignoreHiddenApiPolicyError: true,
      newCommandTimeout: 1200000
    }
    this.router.navigateByUrl('/pages/automate', { state: { templateArr: template, capabilities: capabilities } })
  }

  getAllPages() {
    const id = localStorage.getItem('app_id');
    this.accountService.getAllPages(id).subscribe((resp) => {

      const groupedInstructions = resp.reduce((acc, curr) => {
        const { instruction_set_id, screen_name } = curr;

        // Check if this instruction_set_id already exists in the accumulator
        if (!acc[instruction_set_id]) {
          acc[instruction_set_id] = {
            instruction_set_id: instruction_set_id,
            screen_name: screen_name,
            instructions: []
          };
        }
        
        
        // Add current instruction to the appropriate group
        if (curr.instruction_name !== null) {
          acc[instruction_set_id].instructions.push(curr);
        }
        
        return acc;
      }, {});
      
      const result = Object.values(groupedInstructions); 


      const sortedInstructions = result.map((item: any) => {
        item.instructions = item.instructions.filter((instruction: any) => {
          return instruction.instruction_order !== "0";
        });
        return item;
      });
      

      this.testCasesArray = sortedInstructions;
      
    })
  }


  getAllTemplates() {
    const id = localStorage.getItem('app_id');
    this.accountService.getAllTemplates(id).subscribe((resp) => {
      const groupedData = [];


      resp.forEach((curr) => {
        // Find or create the weight group
        let wtGroup = groupedData.find(group => group.wt_id === curr.wt_id);

        if (!wtGroup) {
          wtGroup = {
            wt_id: curr.wt_id,
            wt_name: curr.wt_name,
            wt_desc: curr.wt_desc,
            screens: [],
          };
          groupedData.push(wtGroup);
        }


        // Find or create the screen group
        let screenGroup = wtGroup.screens.find(screen => screen.ins_set_id === curr.ins_set_id);
        
        if (!screenGroup) {
          screenGroup = {
            ins_set_id: curr.ins_set_id,
            ins_set_screen_name: curr.ins_set_screen_name,
            wim_order: curr.wim_order,
            instructions: [],
          };

          if (curr.ins_set_screen_name !== null) {
            wtGroup.screens.push(screenGroup);
          }

        }


        // Check if the instruction is already added to the screenGroup
        const instructionExists = screenGroup.instructions.some(instr => instr.im_id === curr.im_id);
        if (!instructionExists) {
          screenGroup.instructions.push(curr);
        }
      });

      // const sortedInstructions = result.map((item: any) => {
      //   item.instructions = item.instructions.filter((instruction: any) => {
      //     return instruction.instruction_order !== "0";
      //   });
      //   return item;
      // });
      
      
      // console.log(sortedInstructions);

      

      let result = groupedData.map((item) => {
        item.screens = item.screens.filter((screen) => {
          return screen.wim_order !== "0"; 
        })
        return item;
      })

      
      
      this.templateArray = result;
      

    });
  }

  getInstructions() {
    const app_id = localStorage.getItem('app_id');
    this.accountService.getInstruction(app_id).subscribe((data) => {
      if (data && data.length > 0) {
        this.instructionsArr = data;
      }
    })
  }

  toInstructions() {
    this.router.navigateByUrl('pages/instructions');
  }

  openPopover() {
    console.log('popover');
    
    if (this.popover.isShown) {
      this.popover.hide(); // Hide the popover if it is currently shown
    } else {
      this.popover.show(); // Show the popover if it is currently hidden
    }
  }

  // Example of a method that stops the propagation of the click event
  propagation(event: MouseEvent) {
    console.log('propagation');
    
    event.stopPropagation();
    this.openPopover();
  }

  subscribeToDelete(){
    this.editDeleteSubcription = this.editDeleteService.getTestCaseDeleteSubject().subscribe(() => {
      console.log('Subscribed');
      
      this.getAllPages();
    });
  }

}

