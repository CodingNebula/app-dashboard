import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InstructionsDialogComponent } from '../instructions-dialog/instructions-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { ApplicationDataService } from '../../../shared/services/applicationData/application-data.service';
import { AccountService } from '../../../shared/services/account/account.service';

@Component({
  selector: 'ngx-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {
  public applicationDataArr: any[] = [];
  public appDetails: any;


  constructor(
    private dialogService: NbDialogService,
    private applicationDataService: ApplicationDataService,
    protected router: Router,
    private accountService: AccountService
  ){

  }

  ngOnInit() {
    this.appDetails = this.applicationDataService.getData();

    this.getInstructions();
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

          const instructionDetails = {
            name: result.data.normal_name, // Name of the instruction provided by the user
            elementName: result.data.elem_name, // Frontend-specific element name
            backendName: result.data.actions, // Server-specific backend name for the instruction
            extra: {}, // Additional metadata or information (optional)
        }
          console.log(this.appDetails);
          
          // this.saveApplicationData(appDetails);
          const app_id = localStorage.getItem('app_id');
          this.accountService.postInstruction(app_id, instructionDetails).subscribe((response) => {
            if (response) {
              // After successful post, update applicationDataArr
              console.log(response[0]);
              
              this.applicationDataArr.push(response[0]); // Assuming the response contains the newly saved item
              this.applicationDataService.setData('instructions', response[0]);
            }
          }, (error) => {
            console.error('Error saving test case:', error);
          });
          this.applicationDataService.setData('instructions', this.applicationDataArr);
          // this.router.navigateByUrl('pages/capabilities');
        }
      }
    });
  }

  saveInstructions(){
    this.router.navigateByUrl('pages/application');
  }

  getInstructions(){
    const app_id = localStorage.getItem('app_id');
    this.accountService.getInstruction(app_id).subscribe((data) => {
      if (data && data.length > 0) {
        this.applicationDataArr = data;
      }
    })
  }
}
