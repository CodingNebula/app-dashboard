import { Component } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { NoAppDialogComponent } from '../component/no-app-dialog/no-app-dialog.component';
import { Router } from '@angular/router';
import { AccountService } from '../../shared/services/account/account.service';


@Component({
  selector: 'ngx-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {
  public applicationDataArr: any[] = [];

  constructor(
    private dialogService: NbDialogService,
    protected router: Router,
    private accountService: AccountService) {

  }

  ngOnInit(){
    this.getApplication();
  }

  openDialog() {
    // Open the dialog and pass data to it using 'context'
    const dialogRef = this.dialogService.open(NoAppDialogComponent, {});

    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        if (result.confirmed) {
          console.log(result.data);

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
        }
      }
    });
  }

  saveApplicationData(data) {


    this.accountService.postApplication(data).subscribe((response) => {
      if (response) {
        // After successful post, update applicationDataArr
        this.applicationDataArr.push(response); // Assuming the response contains the newly saved item
        console.log('Item saved and added to array:', response);
      }
    }, (error) => {
      console.error('Error saving test case:', error);
    });
  }

  getApplication() {
    this.accountService.getApplication().subscribe((data) => {
      console.log(data); // You can inspect what data you're receiving from the backend
      if (data && data.length > 0) {
        this.applicationDataArr = data; // Update the applicationDataArr with the data received from backend
        console.log(this.applicationDataArr);
        
      }
    })
  }

  navigate() {
    this.router.navigateByUrl('pages/test-cases');
  }
}
