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
          this.applicationDataArr.push(result.data);
          this.saveApplicationData(appDetails);
        }
      }
    });
  }

  saveApplicationData(data) {


    this.accountService.postApplication(data).subscribe((data) => {
      console.log(data);

    });
  }

  navigate() {
    this.router.navigateByUrl('pages/test-cases');
  }
}
