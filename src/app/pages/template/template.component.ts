import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TemplateDialogComponent } from './template-dialog/template-dialog.component';
import { Router } from '@angular/router';
import { ApplicationDataService } from '../../shared/services/applicationData/application-data.service';
import { AccountService } from '../../shared/services/account/account.service';

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
  public appName : any;

  constructor(
    private dialogService: NbDialogService,
    private router: Router,
    private accountService: AccountService,
    private applicationDataService: ApplicationDataService) {
      const appDetails = this.applicationDataService.getData();
    console.log(appDetails);



  }

  ngOnInit(){
    this.getAllPages();
    this.getAllTemplates();
    this.getInstructions();

    this.appName = localStorage.getItem('app_name');
  }

  openDialog(action: string, type: string, id?: string) {
    // Open the dialog and pass data to it using 'context'
    console.log(id);

    const dialogRef = this.dialogService.open(TemplateDialogComponent, {
      context: { selectedAction: action, selectedType: type, testCaseArr: this.testCasesArray, instructionsArr: this.instructionsArr },
    });


    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {
        if (result?.confirmed) {
          if (result.selectedAction === 'testCase') {
            if(result.selectedType === 'name'){
              console.log(result.data);

              const details = {
                screenName: result.data.test_case_name,
                applicationId: localStorage.getItem('app_id'),
                extra: {},
            }
              console.log(result.data);



              // this.saveApplicationData(appDetails);
              this.accountService.postPageName(details).subscribe((resp) => {
                if(resp){
                  console.log(resp);

                  this.testCasesArray.push(resp[0]);
                  this.screenNameId = resp[0]?.id
                  this.tempTestCase.screen_name = result.data.test_case_name;
                  this.tempTestCase.instruction_set_id = resp[0]?.id;

                }
              })
              this.applicationDataService.setData('testCases', this.testCasesArray);
              // this.router.navigateByUrl('pages/capabilities');
            }

            if(result.selectedType === 'instruction'){
              console.log(result.data);

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

            console.log(body);



              this.accountService.postPageInstructions(body).subscribe((resp) => {
                if(resp){
                  console.log(resp);

                  // this.testCasesArray.push(resp[0]);
                //   if (this.testCasesArray.length > 0) {
                //     this.testCasesArray.pop();
                // }
                  this.tempTestCase.instructions = result.data.instructionArr;
                  this.testCasesArray.push(this.tempTestCase);
                  console.log(this.tempTestCase);

                  console.log(this.testCasesArray);

                }
              })
              this.applicationDataService.setData('testCases', this.testCasesArray);
              // this.router.navigateByUrl('pages/capabilities');
            }
          }
          else if (result.selectedAction === 'template') {
            if(result.selectedType === 'name'){
              console.log(result.data,'datum');

            //   const details = {
            //     screenName: result.data.test_case_name,
            //     applicationId: localStorage.getItem('app_id'),
            //     extra: {},
            // }

            const details = {
              templateName: result.data.templateName,
              applicationId: localStorage.getItem('app_id'),
              description: result.data.description,
              extra: {},
          }


              console.log(result.data);


              // this.saveApplicationData(appDetails);
              this.accountService.postTemplateName(details).subscribe((resp) => {
                if(resp){
                  console.log(resp);

                  // this.testCasesArray.push(resp[0]);
                  this.templateId = resp[0]?.wt_id
                  // this.tempTemplate.wt_name = resp[0]?.template_name;
                  // this.tempTemplate.wt_desc = resp[0]?.description;
                  // this.tempTemplate.wt_id = resp[0]?.id;



                  // this.templateArray.push(this.tempTemplate)
                  this.getAllTemplates();
                }
              })
              this.applicationDataService.setData('testCases', this.testCasesArray);
              // this.router.navigateByUrl('pages/capabilities');
            }

            if(result.selectedType === 'testCase'){
              console.log(result.data);

              let body = {
                application_id: localStorage.getItem('app_id'),  // This value can be dynamic
                wt_id:id,
                instructions_set: result?.data?.templates?.map((instruction, index) => {
                    return {
                        id: instruction?.instruction_set_id,  // Mapping the dynamic id from instructionsArray
                        order: (index + 1).toString(),     // Using index + 1 to set the order dynamically
                        extra: {}  // Adding any extra dynamic data
                    };
                })
            };

            console.log(body,'body');
            console.log(result,'sult')
            let screens = result?.data?.templates?.map((screen, index) => {
              return {
                wt_id:screen?.wt_id,
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

          console.log(screens);
              console.log(this.templateId,'tempid');
              let appId=localStorage.getItem('app_id');
              console.log(result,'res')
              this.accountService.postTemplates(id, body).subscribe((resp) => {
                if(resp){
                  console.log(resp);

                //   if (this.templateArray.length > 0) {
                //     this.templateArray.pop();
                // }

                  // this.tempTemplate.screens = screens;
                  //
                  // this.templateArray.push(this.tempTemplate);
                  // console.log(this.templateArray);
                  this.getAllTemplates();

                }
              })
            }

          }
        }
      // }
    });
  }

  automateTemplate(template: any) {
    console.log(template);

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

  getAllPages(){
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
        acc[instruction_set_id].instructions.push(curr);

        return acc;
    }, {});

    // Convert the grouped object to an array
    const result = Object.values(groupedInstructions); // assuming groupedInstructions is an object


// Flatten and sort the instructions by 'instruction_order'
const sortedInstructions = result
  .map((item: any) => {
    // Sort the instructions in each item by instruction_order
    item.instructions.sort((a: any, b: any) => {
      return parseInt(a.instruction_order) - parseInt(b.instruction_order);
    });
    return item;
  })

// sortedInstructions.forEach((instruction: any) => {
//   console.log(instruction);
// });



    this.testCasesArray = result;
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
                    instructions: [],
                };
                wtGroup.screens.push(screenGroup);
            }


            // Check if the instruction is already added to the screenGroup
            const instructionExists = screenGroup.instructions.some(instr => instr.im_id === curr.im_id);
            if (!instructionExists) {
                screenGroup.instructions.push(curr);
            }
        });

        this.templateArray = groupedData;

    });
}

  getInstructions(){
    const app_id = localStorage.getItem('app_id');
    this.accountService.getInstruction(app_id).subscribe((data) => {
      if (data && data.length > 0) {
        this.instructionsArr = data;
      }
    })
  }

  toInstructions(){
    this.router.navigateByUrl('pages/instructions');
  }

}

