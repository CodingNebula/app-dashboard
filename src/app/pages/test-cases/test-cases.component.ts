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
export class TestCasesComponent implements OnInit {
  public applicationDataArr: any[] = [];
  public applicationId: any;
  public showNoData: boolean = false;
  constructor(
    private dialogService: NbDialogService,
    protected router: Router,
    private accountService: AccountService) {
    this.applicationDataArr = []
  }

  ngOnInit() {
    const state = window.history.state;
    this.getTerminalsData()
    if (state && state.id) {
      this.applicationId = state.id;
    }


    // this.getTestCases();

  }

  getTestCaseTitles(testCases: any[]): string {
    return testCases?.map(testCase => testCase.title).join(', ') || 'No Test Cases';
  }

  getTerminalsData() {
    this.accountService.getTerminal().subscribe((res)=>{
      this.applicationDataArr = [...res]
    })
  }


  openDialog(itemToEdit?, edit = false) {

    // Open the dialog and pass data to it using 'context'
    const dialogRef = this.dialogService.open(TestCasesDialogComponent, {
      context: { item: itemToEdit, editing: edit },
    });

    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {

      if (result) {
        if (result.confirmed) {

          // Extract required values
          const {
            terminalName,
            endpoint,
            gatewayurl,
            api,
            worldnetId,
            debug,
            flavor,
            certstr,
            x509Cert,
            accountNum,
            gatewayUrlPropay,
            terminalId,
            xmlApiBaseUrl,
            classMetaKey,
            jsonApiBaseUrl,
            ServerDateFormat,
            splitfundingAccountNum,
            Debug,
            Flavor,
            secret,
            logLevel,
            remoteLoggingEnabled,
            password,
            username,
            gatewayURL,
            merchantId,
            consumerKey,
            consumerSecret,
            serverDateFormatPPS
          } = result.data;


          // Initialize formatted data
          const formattedData = {
            terminalName,
            TerminalConfiguration: {
              endpoint: {
                provider: endpoint,
              }
            }
          };

          // Adjust format based on provider type
          if (endpoint === 'worldnet') {
            Object.assign(formattedData.TerminalConfiguration.endpoint, {
              apiKey: api,
              gatewayUrl: gatewayurl,
              worldnetTerminalID: worldnetId
            });
          }

          if (endpoint === 'propay') {
            Object.assign(formattedData.TerminalConfiguration.endpoint, {
              debug: debug,
              flavor: flavor,
              certStr: certstr,
              x509Cert: x509Cert,
              accountNum: accountNum,
              gatewayUrl: gatewayUrlPropay,
              terminalID: terminalId,
              terminalId: terminalId,
              xmlApiBaseUrl: xmlApiBaseUrl,
              CLASS_META_KEY: classMetaKey,
              jsonApiBaseUrl: jsonApiBaseUrl,
              serverDateFormat: ServerDateFormat,
              splitfundingAccountNum: splitfundingAccountNum
            });
          }

          if (endpoint === 'pps') {
            Object.assign(formattedData.TerminalConfiguration.endpoint, {
              debug: Debug,
              flavor: Flavor,
              secret: secret,
              gatewayUrl: gatewayURL,
              password: password,
              username: username,
              merchantId: merchantId,
              consumerKey: consumerKey,
              consumerSecret: consumerSecret,
              serverDateFormat: serverDateFormatPPS,
              logging: {
                logLevel: logLevel,
                remoteLoggingEnabled: remoteLoggingEnabled
              }
            });
          }

          const body = this.getBody(formattedData)
          if(edit) {
            console.log(itemToEdit)
            this.accountService.updateTerminal(itemToEdit.TerminalId,body).subscribe()
          } else {
            this.accountService.addTerminal(body).subscribe(res =>{
              console.log(res);
              if(res.status === 200 || res.status === 201){
                this.getTerminalsData();
              }
            })
          }

        }
      }

    });
  }

  getBody(data) {
    data.name = data.terminalName
    data.appUserId = 'cbc1ba18-32bc-4b3b-902a-f21044a7eacb';
    delete data.terminalName
    return data
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

  getTestCases() {

    this.accountService.getTestCases(this.applicationId).subscribe((data) => {

      if (data?.message !== 'No Test Case Found') {
        this.applicationDataArr = data;
      }
    });
  }

  deleteTestCase(id: string) {
    this.accountService.deleteTestCase(id).subscribe((res) => {
      if (res) {
        this.applicationDataArr = this.applicationDataArr.filter(item => item.test_case_id !== id);
      }
    })
  }

  openDonfigurationDialog(config) {
    console.log(config);
  }


}
