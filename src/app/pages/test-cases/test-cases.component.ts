import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { TestCasesDialogComponent } from '../component/test-cases-dialog/test-cases-dialog.component';
import { AccountService } from '../../shared/services/account/account.service';

@Component({
  selector: 'ngx-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss']
})
export class TestCasesComponent implements OnInit{
  public applicationDataArr: any[] = [];
  constructor(
    private dialogService: NbDialogService, 
    protected router: Router,
  private accountService: AccountService){}

  ngOnInit(){
    this.getTestCases();
  }

  getTestCaseTitles(testCases: any[]): string {
    return testCases?.map(testCase => testCase.title).join(', ') || 'No Test Cases';
  }


  openDialog(itemToEdit?) {
  
    // Open the dialog and pass data to it using 'context'
    const dialogRef = this.dialogService.open(TestCasesDialogComponent, {
      context: {item: itemToEdit},
    });
  
    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        if (result.confirmed) {
          if (itemToEdit) {
            // If item is being edited, update the existing item
            const index = this.applicationDataArr.findIndex((item) => item === itemToEdit);
            if (index > -1) {
              this.applicationDataArr[index] = result.data;  // Update the existing item
            }
          } else {
            // Otherwise, add a new item
          //   const details = {
          //     title: req.body.title,
          //     types: JSON.stringify(req.body.types),
          //     applicationId: req.body.applicationId,
          //     extra: JSON.stringify(req.body.extra),
          // }

        //   {
        //     "application": "Welcome page",
        //     "testCases": [
        //         "Permission_Continue_Button",
        //         "TerminalID_Next_Button"
        //     ]
        // }
          console.log(result.data);
          
            const details = {
              title: result.data.application,
              types: result.data.testCases,
              applicationId: "12e13954-ab70-4398-ae04-317ac55a41b8",
              extra: {}
            }
            this.saveTestCasesData(details);
            // this.applicationDataArr.push(result.data);
          }
        }
      }
    });
  }

  saveTestCasesData(data) {
    this.accountService.postTestCases(data).subscribe((response) => {
      console.log(response); // Inspect the response from the POST request
  
      if (response) {
        // After successful post, update applicationDataArr
        console.log(this.applicationDataArr);
        if (Array.isArray(this.applicationDataArr)) {
          this.applicationDataArr.push(response); // Add the new item to the array
          
        } else {
          console.error('applicationDataArr is not an array');
        }
      }
    }, (error) => {
      console.error('Error saving test case:', error);
    });
  }

  getTestCases(){
  this.accountService.getTestCases().subscribe((data) => {
    
    if (data?.message !== 'No Test Case Found') {
      this.applicationDataArr = data;
    }
  });
}

deleteTestCase(id: string){
  this.accountService.deleteTestCase(id).subscribe((res) => {
    if(res){
      this.applicationDataArr = this.applicationDataArr.filter(item => item.test_case_id !== id);
    }
  })
}
  

}
