import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InstructionsDialogComponent } from '../instructions-dialog/instructions-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {
  public applicationDataArr: any[] = [];


  constructor(
    private dialogService: NbDialogService,
    protected router: Router,
  ){

  }

  openDialog() {
    // Open the dialog and pass data to it using 'context'
    const dialogRef = this.dialogService.open(InstructionsDialogComponent, {});

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
          
          this.applicationDataArr.push(result.data);
          // this.saveApplicationData(appDetails);
          // this.applicationDataService.setData('app_details', appDetails);
          // this.router.navigateByUrl('pages/capabilities');
        }
      }
    });
  }

  saveInstructions(){
    this.router.navigateByUrl('pages/application');
  }
}
