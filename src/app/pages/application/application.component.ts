import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { NoAppDialogComponent } from '../component/no-app-dialog/no-app-dialog.component';
import { Router } from '@angular/router';
import { AccountService } from '../../shared/services/account/account.service';
import { AutomationDataService } from '../../shared/services/automationData/automation-data.service';
import { ApplicationDataService } from '../../shared/services/applicationData/application-data.service';


@Component({
  selector: 'ngx-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  public applicationDataArr: any[] = [];
  public instructionsArr: any[] = [];
  public appCapabilities: any;
  public applicationNameAlert: boolean = false;

  constructor(
    private dialogService: NbDialogService,
    protected router: Router,
    private accountService: AccountService,
    private automateDataService: AutomationDataService,
    private applicationDataService: ApplicationDataService) {

  }

  ngOnInit() {
    this.getApplication();
    this.getCapabilities();
  }

  openDialog() {
    // Open the dialog and pass data to it using 'context'
    const dialogRef = this.dialogService.open(NoAppDialogComponent, {});

    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        if (result.confirmed) {

          //   const appDetails = {
          //     app_name: req.body.appName,
          //     user_id: userId,
          //     platform: req.body.platform,
          //     test_case_results: req.body.test_case_results,
          //     extra: JSON.stringify(req.body.extra),
          // }

          const appNameToCheck = result.data.application.replace(/\s+/g, ' ').trim().toLowerCase();
          console.log(appNameToCheck);
          
          const appExists = this.applicationDataArr.some(app => app.app_name.trim().toLowerCase() === appNameToCheck);

          if (appExists) {
            this.applicationNameAlert = true;
            console.log('app exist!');
            

            setTimeout(() => {
              this.applicationNameAlert = false;
            }, 1000)
          }
          else {


            const appDetails = {
              appName: result.data.application,
              platform: result.data.platform,
              test_case_results: null,
              extra: {}
            }

            console.log(appDetails);


            this.saveApplicationData(appDetails);
            // this.applicationDataService.setData('app_details', appDetails);
          }



        }
      }
    });
  }

  saveApplicationData(data) {


    this.accountService.postApplication(data).subscribe((response) => {
      if (response) {
        // After successful post, update applicationDataArr


        this.applicationDataArr.push(response); // Assuming the response contains the newly saved item
        this.applicationDataService.setData('app_details', response);
        localStorage.setItem('app_id', response?.id);
        localStorage.setItem('app_name', response?.app_name);

        setTimeout(() => {
          this.router.navigateByUrl('pages/capabilities');
        }, 1500)

      }
    }, (error) => {
      console.error('Error saving test case:', error);
    });
  }

  getApplication() {
    this.accountService.getApplication().subscribe((data) => {
      if (data && data.length > 0) {
        this.applicationDataArr = data;

      }
    })
  }

  navigate(item: any) {
    // Store app_id and app_name in localStorage
    localStorage.setItem('app_id', item?.id);
    localStorage.setItem('app_name', item?.app_name);

    // Retrieve and parse the app_capa from localStorage
    const app_capa = localStorage.getItem("app_capa");
    const parsedAppCapa = app_capa ? JSON.parse(app_capa) : null;


    // Initialize instructionsArr
    const app_id = item.id;

    // First API call to get instructions
    this.accountService.getInstruction(app_id).subscribe((instructionData) => {
      this.instructionsArr = [];
      if (instructionData && instructionData.length > 0) {
        this.instructionsArr = instructionData;
      }

      // Now, fetch capabilities after instructions API response
      this.accountService.getCapabilites(app_id).subscribe((capabilitiesData) => {
        this.appCapabilities = capabilitiesData;

        // Now that both API responses are received, check the conditions
        if (this.appCapabilities?.extra?.capabilities && this.appCapabilities?.id === item.id && this.instructionsArr.length === 0) {
          // Navigate to instructions page if app_id matches and no instructions
          this.router.navigateByUrl('pages/instructions');
        } else if (this.appCapabilities?.extra?.capabilities && this.appCapabilities?.id === item.id && this.instructionsArr.length > 0) {
          // Navigate to template page if app_id matches and there are instructions
          this.router.navigateByUrl('pages/template');
        } else {
          // Navigate to capabilities page if no conditions are met
          this.router.navigateByUrl('pages/capabilities', { state: { id: item.id, appName: item?.app_name } });

          // Log item and store data
          this.applicationDataService.setData('app_details', item);

          // Store app_id and app_name again in localStorage (optional redundancy)
          localStorage.setItem('app_id', item?.id);
          localStorage.setItem('app_name', item?.app_name);
        }
      }, (error) => {
        console.error('Error fetching capabilities:', error);
      });
    }, (error) => {
      console.error('Error fetching instructions:', error);
    });
  }



  getInstructions() {
    const app_id = localStorage.getItem('app_id');
    this.accountService.getInstruction(app_id).subscribe((data) => {
      if (data && data.length > 0) {
        this.applicationDataArr = data;
        this.applicationDataService.setData('instructions', data)
      }
    })
  }

  getCapabilities() {
    const app_id = localStorage.getItem('app_id');
    this.accountService.getCapabilites(app_id).subscribe((data) => {

    })
  }

  onClose(){
    this.applicationNameAlert = false;
  }
}
