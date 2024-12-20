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
  public appName: any;


  constructor(
    private dialogService: NbDialogService,
    private applicationDataService: ApplicationDataService,
    protected router: Router,
    private accountService: AccountService
  ) {

  }

  ngOnInit() {
    this.appDetails = this.applicationDataService.getData();

    this.getInstructions();

    this.appName = localStorage.getItem('app_name');
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
          console.log(instructionDetails);

          // this.saveApplicationData(appDetails);
          const app_id = localStorage.getItem('app_id');
          this.accountService.postInstruction(app_id, instructionDetails).subscribe((response) => {
            if (response) {
              // After successful post, update applicationDataArr
              console.log(response[0]);

              const resp = response[0].element_name;

              const fixedString = resp.replace(/[{}"]/g, '');
              const result = [fixedString];
              response[0].element_name = result;
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

  saveInstructions() {
    this.router.navigateByUrl('pages/application');
  }

  getInstructions() {
    const app_id = localStorage.getItem('app_id');
    this.accountService.getInstruction(app_id).subscribe((data) => {
      if (data && data.length > 0) {
        console.log(data);
    
        // Loop through each item in the data array
        data.forEach(item => {
            // Check if element_name exists in the item
            if (data && data.length > 0) {
              console.log(data);
          
              // Loop through each item in the data array
              data.forEach(item => {
                  // Check if element_name exists in the item
                  if (item.element_name) {
                      let resp = item.element_name;
          
                      // If the element_name is a string that looks like a JSON array, parse it
                      if (resp.startsWith("{") && resp.endsWith("}")) {
                          try {
                              // Try to parse it as a JSON string (removes extra characters like quotes and braces)
                              resp = JSON.parse("[" + resp.replace(/[{}"]/g, '') + "]");
                          } catch (error) {
                              console.error('Error parsing element_name:', error);
                          }
                      } else if (resp.includes(',')) {
                          // If there are commas separating elements, treat it as a CSV-like string
                          resp = resp.split(',').map(item => item.trim());
                      }
          
                      // If it is still a single string (not an array-like format), leave it as it is
                      if (!Array.isArray(resp)) {
                          resp = [resp];  // Wrap it in an array only if it's a single string
                      }
          
                      // Update element_name with the cleaned result
                      item.element_name = resp;
                  }
              });
          
              // Log the updated data
              console.log(data);
          
              // Update the applicationDataArr and save the modified data to the applicationDataService
              this.applicationDataArr = data;
              this.applicationDataService.setData('instructions', data);
          }
          
        });
    
        // Log the updated data
        console.log(data);
    
        // Update the applicationDataArr and save the modified data to the applicationDataService
        this.applicationDataArr = data;
        this.applicationDataService.setData('instructions', data);
    }
    
    
    })
  }

  toTemplate() {
    this.router.navigateByUrl('pages/template');
  }
}
