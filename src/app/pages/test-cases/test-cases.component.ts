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
  public applicationId: any;
  constructor(
    private dialogService: NbDialogService,
    protected router: Router,
  private accountService: AccountService){
    this.applicationDataArr =  [
      {
        terminalName: 'propay1',
        endpoint: 'propay',
        configuration: {
          merchantId : "1000015959",
          consumerKey : "9T7tBhJPwIUH2bAIaYRXcgvM",
          secret : "KrJ+cxSM9fRlBOol4+iQK8Ztggw=",
          gatewayUrl : "https://sandbox.api.mxmerchant.com/checkout/v3/",
        }
      },
      {
        terminalName: 'propay12',
        endpoint: 'propay',
        configuration: {
          merchantId : "1000015959",
          consumerKey : "9T7tBhJPwIUH2bAIaYRXcgvM",
          secret : "KrJ+cxSM9fRlBOol4+iQK8Ztggw=",
          gatewayUrl : "https://sandbox.api.mxmerchant.com/checkout/v3/",
        }
      },
      {
        terminalName: 'worldnet123',
        endpoint: 'worldnet',
        configuration: {
          merchantId : "1000015959",
          consumerKey : "9T7tBhJPwIUH2bAIaYRXcgvM",
          secret : "KrJ+cxSM9fRlBOol4+iQK8Ztggw=",
          gatewayUrl : "https://sandbox.api.mxmerchant.com/checkout/v3/",
        }
      },
      {
        terminalName: 'worldnet456',
        endpoint: 'worldnet',
        configuration: {
          merchantId : "1000015959",
          consumerKey : "9T7tBhJPwIUH2bAIaYRXcgvM",
          secret : "KrJ+cxSM9fRlBOol4+iQK8Ztggw=",
          gatewayUrl : "https://sandbox.api.mxmerchant.com/checkout/v3/",
        }
      },
      {
        terminalName: 'pps01',
        endpoint: 'pps',
        configuration: {
          merchantId : "1000015959",
          consumerKey : "9T7tBhJPwIUH2bAIaYRXcgvM",
          secret : "KrJ+cxSM9fRlBOol4+iQK8Ztggw=",
          gatewayUrl : "https://sandbox.api.mxmerchant.com/checkout/v3/",
        }
      },
      {
        terminalName: 'pps50',
        endpoint: 'pps',
        configuration: {
          merchantId : "1000015959",
          consumerKey : "9T7tBhJPwIUH2bAIaYRXcgvM",
          secret : "KrJ+cxSM9fRlBOol4+iQK8Ztggw=",
          gatewayUrl : "https://sandbox.api.mxmerchant.com/checkout/v3/",
        }
      },
    ]
  }

  ngOnInit(){
    const state = window.history.state;

    if (state && state.id) {
      this.applicationId = state.id;
    }


    // this.getTestCases();

  }

  getTestCaseTitles(testCases: any[]): string {
    return testCases?.map(testCase => testCase.title).join(', ') || 'No Test Cases';
  }


  openDialog(itemToEdit?,edit = false) {

    // Open the dialog and pass data to it using 'context'
    const dialogRef = this.dialogService.open(TestCasesDialogComponent, {
      context: {item: itemToEdit, editing: edit},
    });

    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {

      if (result) {
        if (result.confirmed) {
          if (itemToEdit) {
            const index = this.applicationDataArr.findIndex((item) => item === itemToEdit);
            this.applicationDataArr.splice(index, 1, result.data);

          } else {
            this.applicationDataArr.push(result.data);
          }

          const formattedData = {
            terminalName: result.data.terminalName,
            endpoint: result.data.endpoint,
            configuration: { ...result.data }
          };

          delete formattedData.configuration.terminalName;
          delete formattedData.configuration.endpoint;

          if (result.data.endpoint === 'pps') {
            delete formattedData.configuration.logLevel;
            delete formattedData.configuration.remoteLoggingEnabled;

            formattedData.configuration.logging = {
              logLevel: result.data.logLevel,
              remoteLoggingEnabled: result.data.remoteLoggingEnabled,
            };
          }
        }
      }
    });
  }

  saveTestCasesData(data) {
    this.accountService.postTestCases(data).subscribe((response) => {

      if (response) {
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

  this.accountService.getTestCases(this.applicationId).subscribe((data) => {

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

openDonfigurationDialog(config){
  console.log(config);
}


}
