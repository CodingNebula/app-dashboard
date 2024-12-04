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
    this.getAllTempates();
    this.getInstructions()
  }

  openDialog(action: string, type: string, id?: string) {
    // Open the dialog and pass data to it using 'context'
    console.log(id);
    
    const dialogRef = this.dialogService.open(TemplateDialogComponent, {
      context: { selectedAction: action, selectedType: type, testCaseArr: this.testCasesArray, instructionsArr: this.instructionsArr },
    });


    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {
        if (result.confirmed) {
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
                  
                }
              })
              this.applicationDataService.setData('testCases', this.testCasesArray);
              // this.router.navigateByUrl('pages/capabilities');
            }

            if(result.selectedType === 'instruction'){
              console.log(result.data);
              
              let body = {
                instruction_set_id: this.screenNameId,  // This value can be dynamic
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
                  
                  this.testCasesArray.push(resp[0]);
                  console.log(this.testCasesArray);
                  
                }
              })
              this.applicationDataService.setData('testCases', this.testCasesArray);
              // this.router.navigateByUrl('pages/capabilities');
            }
          }
          else if (result.selectedAction === 'template') {
            if(result.selectedType === 'name'){
              console.log(result.data);
              
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
                  this.templateId = resp[0]?.id
                  
                }
              })
              this.applicationDataService.setData('testCases', this.testCasesArray);
              // this.router.navigateByUrl('pages/capabilities');
            }

            if(result.selectedType === 'testCase'){
              console.log(result.data);
              
              let body = {
                application_id: localStorage.getItem('app_id'),  // This value can be dynamic
                instructions_set: result?.data?.templates?.map((instruction, index) => {
                    return {
                        id: instruction?.instruction_set_id,  // Mapping the dynamic id from instructionsArray
                        order: (index + 1).toString(),     // Using index + 1 to set the order dynamically
                        extra: {}  // Adding any extra dynamic data
                    };
                })
            };

            console.log(body);
            

              
              this.accountService.postTemplates(this.templateId, body).subscribe((resp) => {
                if(resp){
                  console.log(resp);
                  
                  this.testCasesArray.push(resp[0]);
                  console.log(this.testCasesArray);
                  
                }
              })
              this.applicationDataService.setData('testCases', this.testCasesArray);
              // this.router.navigateByUrl('pages/capabilities');
            }

            //   const appDetails = {
            //     app_name: req.body.appName,
            //     user_id: userId,
            //     platform: req.body.platform,
            //     test_case_results: req.body.test_case_results,
            //     extra: JSON.stringify(req.body.extra),
            // }

            const appDetails = {
              appName: result.data.application,
              platform: result.data.platform,
              test_case_results: null,
              extra: {}
            }

            this.templateArray.push(result.data);
            console.log(this.templateArray);

            // this.saveApplicationData(appDetails);
            this.applicationDataService.setData('templates', this.templateArray);
            // this.router.navigateByUrl('pages/capabilities');
          }
        }
      // }
    });
  }

  automateTemplate(template: any) {

    this.router.navigateByUrl('/pages/automate', { state: { templateArr: this.templateArray } })
  }

  getAllPages(){
    const id = localStorage.getItem('app_id');
    this.accountService.getAllPages(id).subscribe((resp) => {
      console.log(resp);
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
    const result = Object.values(groupedInstructions);
  
    this.testCasesArray = result;
    console.log(result);
    })
  }


  getAllTempates(){
    const id = localStorage.getItem('app_id');
    this.accountService.getAllTemplates(id).subscribe((resp) => {
      // console.log(resp);

      const groupedData = resp.reduce((acc, curr) => {
        let wtGroup = acc.find(group => group.wt_id === curr.wt_id);
      
        if (!wtGroup) {
          wtGroup = {
            wt_id: curr.wt_id,
            wt_name: curr.wt_name,
            wt_desc: curr.wt_desc,
            screens: [],
          };
          acc.push(wtGroup);
        }
      
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
      
        return acc;
      }, []);
      
      this.templateArray = groupedData
      console.log(groupedData);
      
    })
  }

  getInstructions(){
    const app_id = localStorage.getItem('app_id');
    this.accountService.getInstruction(app_id).subscribe((data) => {
      if (data && data.length > 0) {
        this.instructionsArr = data;
        console.log(this.instructionsArr);
      }
    })
  }
  
}

