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

  constructor(
    private dialogService: NbDialogService,
    private router: Router,
    private accountService: AccountService,
    private applicationDataService: ApplicationDataService) {
      const appDetails = this.applicationDataService.getData();
    console.log(appDetails);
    
      
    // this.testCases = {
    //   "Welcome Happy Flow": {
    //     description: "A test case for the happy flow scenario",
    //     test_cases: [
    //       'click_image',
    //       'click_next_button'
    //     ]
    //   },
    //   "Permission happy Flow": {
    //     description: "A test case for the failed login scenario",
    //     test_cases: [
    //       'click_image',
    //       'click_next_button'
    //     ]
    //   },
    //   "Welcome Happy flow": {
    //     description: "A test case for the happy flow scenario",
    //     test_cases: [
    //       'click_image',
    //       'click_next_button'
    //     ]
    //   },
    //   "Permission Happy Flow": {
    //     description: "A test case for the failed login scenario",
    //     test_cases: [
    //       'click_image',
    //       'click_next_button'
    //     ]
    //   },

    //   "Permission Happy flow": {
    //     description: "A test case for the failed login scenario",
    //     test_cases: [
    //       'click_image',
    //       'click_next_button'
    //     ]
    //   },
    //   // Add more test cases as needed
    // };

    // this.testCasesArray = Object.entries(this.testCases);
  }

  openDialog(action: string, type: string) {
    // Open the dialog and pass data to it using 'context'
    const dialogRef = this.dialogService.open(TemplateDialogComponent, {
      context: { selectedAction: action, selectedType: type, testCaseArr: this.testCasesArray },
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

            // const appDetails = {
            //   appName: result.data.application,
            //   platform: result.data.platform,
            //   test_case_results: null,
            //   extra: {}
            // }
            // console.log(result.data);

            // this.testCasesArray.push(result.data);
            // // this.saveApplicationData(appDetails);
            // this.applicationDataService.setData('testCases', this.testCasesArray);
            // // this.router.navigateByUrl('pages/capabilities');
          }
          else if (result.selectedAction === 'template') {


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
}

