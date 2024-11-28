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

  constructor(
    private dialogService: NbDialogService,
    protected router: Router,
    private accountService: AccountService,
    private automateDataService: AutomationDataService,
    private applicationDataService: ApplicationDataService) {

  }

  ngOnInit() {
    this.getApplication();
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

          const appDetails = {
            appName: result.data.application,
            platform: result.data.platform,
            test_case_results: null,
            extra: {}
          }
          // this.applicationDataArr.push(result.data);
          this.saveApplicationData(appDetails);
          this.applicationDataService.setData('app_details', appDetails);
          this.router.navigateByUrl('pages/capabilities');
        }
      }
    });
  }

  saveApplicationData(data) {


    this.accountService.postApplication(data).subscribe((response) => {
      if (response) {
        // After successful post, update applicationDataArr
        this.applicationDataArr.push(response); // Assuming the response contains the newly saved item

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
    this.automateDataService.saveSelectedApplication(item);

    this.router.navigateByUrl('pages/test-cases', { state: { id: item.id } });
  }
}
