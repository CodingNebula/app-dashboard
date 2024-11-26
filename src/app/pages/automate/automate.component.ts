import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../../shared/services/account/account.service';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';
import { AutomationDataService } from '../../shared/services/automationData/automation-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-automate',
  templateUrl: './automate.component.html',
  styleUrls: ['./automate.component.scss']
})
export class AutomateComponent implements OnInit {
  public myForm: FormGroup;
  public selectedItem: '';
  public noReset: '';
  public hiddenApp: '';
  public isAccordionExpanded: boolean = true;
  public temp: any[] = [];
  public status: string = null;
  public appLaunchStatus: string = null;
  public appLaunchLoading: boolean = false;
  public totalTimeTaken: number;
  public resultArr: any[] = [];
  public reportData: any = {
    general: {}
  };
  public applicationData: any;
  constructor(
    private fb: FormBuilder,
    private webSocketService: WebsocketService,
    private accountService: AccountService,
    private automateDataService: AutomationDataService,
    private router: Router) {


    this.temp = [
      {
        "id": "0",
        "screenName": "Welcome",
        "title": "Welcome"
      },
      {
        "id": "8",
        "screenName": "Click_Image", // image 
        "btnName": "left_arrow",
        "title": "Welcome_Next_Button"
      },
      {
        "id": "1",
        "screenName": "Permissions",
        "title": "Permissions"
      },
      {
        "id": "8",
        "screenName": "Click_Image",
        "btnName": "left_arrow",
        "title": "Permissions_Next_Button"
      },
      {
        "id": "2",
        "screenName": "Permissions_list",
        "title": "Permissions_list"
      },
      {
        "id": "3",
        "screenName": "Allow_PhoneCalls",
        "action": "Allow",
        "title": "Permissions_Allow_PhoneCalls"
      },
      {
        "id": "4",
        "screenName": "Allow_DeviceLocation",
        "action": "ALLOW",
        "title": "Permissions_Allow_DeviceLocations"
      },
      {
        "id": "5",
        "screenName": "Allow_BluetoothConnection",
        "action": "ALLOW",
        "title": "Permissions_Allow_BluetoothConnections"
      },
      {
        "id": "6",
        "screenName": "Click_Button",
        "btnName": "Continue",
        "title": "Permission_Continue_Button"
      },
      {
        "id": "7",
        "screenName": "Terminal Setup",
        "title": "Terminal Setup"
      },
      {
        "id": "8",
        "screenName": "Click_Image", // image
        "title": "TerminalID_Next_Button"
      },
      //    {
      //     "id":"7",
      //     "screenName":"Terminal ID",
      //     "title": "Terminal ID"
      // },
      {
        "id": "9",
        "screenName": "Select_Options",
        "options": "Testing",
        "title": "TerminalID_Setting"
      },
      {
        "id": "6",
        "screenName": "Click_Button",
        "btnName": "PROCEED",
        "title": "TerminalID_Setting_Proceed_Button"
      },
      {
        "id": "1",
        "screenName": "Enter_Terminal_ID",
        "terminal_id": ["2994001"],
        "title": "Welcome"

      },
      {
        "id": "6",
        "screenName": "Click_Button",
        "btnName": "Next",
        "title": "TerminalID_Next_Button"
      },

      {
        "id": "10",
        "screenName": "Enter_Terminal_ID",
        "terminal_id": ["2994001"],
        "title": "Re-Terminal ID"

      },
      {
        "id": "6",
        "screenName": "Click_Button",
        "btnName": "Submit",
        "title": "TerminalID_Submit_Button"
      },

      {
        "id": "11",
        "screenName": "Profile_Login",
        "pin": ["9", "2", "0", "4"],
        "title": "Verify Detail Page"
      },
      {
        "id": "6",
        "screenName": "Click_Button",
        "btnName": "Confirm",
        "title": "Detail_Confirm_Button"
      },
      //    {
      //     "id":"6",
      //     "screenName":"Click_Button",
      //     "btnName":"ReLogIn",
      //     "title": "Detail_ReLogIn_Button"
      // },
      //   {
      //     "id":"6",
      //     "screenName":"Terminal_Setup_Complete",
      //     "title": "Terminal Setup Complete"
      // },
      {
        "id": "6",
        "screenName": "Click_Button",
        "btnName": "GO",
        "title": "Terminal_Setup_Go_Button"
      },
      //    {
      //     "id":"6",
      //     "screenName":"Device_Connection",
      //     "title": "Device Connection"
      // },
      {
        "id": 9,
        "screenName": "Click_Text",
        "btnName": "Skip >",
        "title": "DeviceConnection_Skip_Button"
      },
      //  {
      //      "id":9,
      //      "screenName":"homePage",
      //      "title": "HomePage"
      //  },
      {
        "id": 9,
        "screenName": "homePage",
        "action": "Transaction",
        "title": "Home_Setting_Button"
      },
      //  {
      //      "id":10,
      //      "screenName":"Click_View",
      //      "btnName":"Device"
      //  },


      //  {
      //      "id":12,
      //      "screenName":"Click_Button",
      //      "btnName":"CONNECT TO READER"
      //  },
      //  {
      //      "id":13,
      //      "screenName":"Wait_For_Text",
      //       "btnName":"WPC323951000219"
      //  }, 
      //  {
      //      "id":13,
      //      "screenName":"Click_Text",
      //      "btnName":"WPC323951000219"
      //  },
      //  {
      //      "id":14,
      //      "screenName":"Find_Button",
      //      "btnName":"Disconnect"
      //  },
      //   {
      //      "id":"8",
      //      "screenName":"Click_Image" // image 
      //  },
      //  {
      //      "id":"8",
      //      "screenName":"Click_Image", // image 
      //      "btnName":"Sale"
      //  },
      //  {
      //      "id":14,
      //      "screenName":"Enter_Amount",
      //      "amount":"200.00"
      //  },
      //    {
      //      "id":9,
      //      "screenName":"Click_Text",
      //      "btnName":"Clear"
      //  },
      //    {
      //      "id":14,
      //      "screenName":"Enter_Amount",
      //      "amount":"50.00"
      //  },
      //   {
      //      "id":10,
      //      "screenName":"Click_View",
      //      "btnName":"2 / 4"
      //  },
      //   {
      //      "id":9,
      //      "screenName":"Click_Text",
      //      "btnName":"Go"
      //  },
      //    {
      //      "id":9,
      //      "screenName":"Click_Text",
      //      "btnName":"10%"
      //  },
      //  {
      //      "id":12,
      //      "screenName":"Click_Button",
      //      "btnName":"Continue"
      //  },
      //   {
      //      "id":13,
      //      "screenName":"Wait_For_Text",
      //       "btnName":"Transaction ID"
      //  },
      //   {
      //      "id":"14",
      //      "screenName":"Element_Avail", // image 
      //      "elementName":["Transaction FAILED", "Transaction Approved"]
      //  },

      //  {
      //      "id":"12",
      //      "screenName":"Click_Button",
      //      "btnName":"See Details"
      //  },
      //   {
      //      "id":"0",
      //      "screenName":"Find_Screen_Elements"
      //  }
    ]

    this.applicationData = this.automateDataService.selectedApplication;

  }

  ngOnInit() {
    // Create the form with FormBuilder
    this.myForm = this.fb.group({
      platform: ['', [Validators.required]],
      app: ['', [Validators.required]],
      package: ['com.example.app', [Validators.required]],
      automation: ['', [Validators.required]],
      device: ['', [Validators.required]],
      noReset: ['True', [Validators.required, this.noResetValidator]],
      hiddenApp: ['True', [Validators.required, this.ignoreHiddenValidator]],
      timeout: ['1200000', [Validators.required]],
    });

    this.myForm.get('platform').valueChanges.subscribe(platform => {
      if (platform === 'Android') {
        this.myForm.get('automation').setValue('UIAutomator2');
      }
      else {
        this.myForm.get('automation').setValue('');
      }
    })


  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isAccordionExpanded = false;
      console.log(this.myForm.value);

      this.reportData.general.platform = this.myForm.value?.platform;
      this.reportData.general.device = this.myForm.value?.device;

      console.log(this.reportData);

      // this.webSocketService.connectWithAccessToken();
      this.appLaunchLoading = true;
    this.accountService.postCapabilities({
      capabilities: {
        platformName: "Android",
        app: "/home/codingnebula/Downloads/app-debug-v12.apk",
        appPackage: "com.example.app",
        automationName: "UIAutomator2",
        deviceName: "Samsung",
        noReset: true,
        ignoreHiddenApiPolicyError: true,
        newCommandTimeout: 1200000
      }
    }).subscribe(
      (response) => {
        console.log('API Response:', response);
        this.appLaunchLoading = false;
        this.appLaunchStatus = 'SUCCESS'
      },
      (error) => {
        console.error('API Error:', error);
        this.appLaunchLoading = false;
        this.appLaunchStatus = 'FAILED'
      }
    );
      this.myForm.reset();
    }
  }

  noResetValidator(control) {
    if (control.value === 'False') {
      return { invalidValue: true };
    }
    return null;
  }

  ignoreHiddenValidator(control) {
    if (control.value === 'False') {
      return { invalidValue: true };
    }
    return null;
  }

  onReset() {
    this.myForm.reset();
  }
  getFile(event) {

  }

  // onStart(item){
  //   this.webSocketService.sendTestCaseRequest(item)
  //   item.status = this.webSocketService.message;
  //   alert(this.status);
  // }

  onStart(item) {

    this.webSocketService.sendTestCaseRequest(item)
    // item.loading = true;

    // item.status = this.webSocketService.message;


    // item.loading = false;
  }

  onStartAppLaunch() {
    // this.appLaunchLoading = true;
    // this.accountService.postCapabilities({
    //   capabilities: {
    //     platformName: "Android",
    //     app: "/home/codingnebula/Downloads/app-debug-v12.apk",
    //     appPackage: "com.example.app",
    //     automationName: "UIAutomator2",
    //     deviceName: "Samsung",
    //     noReset: true,
    //     ignoreHiddenApiPolicyError: true,
    //     newCommandTimeout: 1200000
    //   }
    // }).subscribe(
    //   (response) => {
    //     console.log('API Response:', response);
    //     this.appLaunchLoading = false;
    //     this.appLaunchStatus = 'SUCCESS'
    //   },
    //   (error) => {
    //     console.error('API Error:', error);
    //     this.appLaunchLoading = false;
    //     this.appLaunchStatus = 'FAILED'
    //   }
    // );
  }

  onStartTrans() {
    let item = [{
      "id": "1",
      "screenName": "Welcome"
    },
    {
      "id": "2",
      "screenName": "Click_Image", // image 
      "btnName": "left_arrow"
    },
    {
      "id": "3",
      "screenName": "Permissions"
    },
    {
      "id": "4",
      "screenName": "Click_Image", // image 
      "btnName": "left_arrow"
    },
    {
      "id": "5",
      "screenName": "Permissions_list"
    },
    {
      "id": "6",
      "screenName": "Allow_PhoneCalls",
      "action": "Allow"
    },
    {
      "id": "7",
      "screenName": "Allow_DeviceLocation",
      "action": "ALLOW"
    },
    {
      "id": "8",
      "screenName": "Allow_BluetoothConnection",
      "action": "ALLOW"
    },
    {
      "id": "9",
      "screenName": "Click_Button",
      "btnName": "Continue"
    },
    {
      "id": "10",
      "screenName": "Terminal Setup"
    },
    {
      "id": "11",
      "screenName": "Click_Image" // image 
    },
    {
      "id": "12",
      "screenName": "Select_Options",
      "options": "Testing"
    },
    {
      "id": "13",
      "screenName": "Click_Button",
      "btnName": "PROCEED"
    },
    {
      "id": "14",
      "screenName": "Enter_Terminal_ID",
      "terminal_id": ["2994001"]

    },
    {
      "id": "15",
      "screenName": "Click_Button",
      "btnName": "Next"
    },
    {
      "id": "16",
      "screenName": "Enter_Terminal_ID",
      "terminal_id": ["2994001"]

    },
    {
      "id": "17",
      "screenName": "Click_Button",
      "btnName": "Submit"
    },

    {
      "id": "18",
      "screenName": "Profile_Login",
      "pin": ["9", "2", "0", "4"]
    },
    {
      "id": "19",
      "screenName": "Click_Button",
      "btnName": "Confirm"
    },
    {
      "id": "20",
      "screenName": "Click_Button",
      "btnName": "GO"
    },
    {
      "id": "21",
      "screenName": "Click_Text",
      "btnName": "Skip >"
    },
    {
      "id": "22",
      "screenName": "Click_Image",
      "btnName": "gear-icon"
    },


    // connect reader steps start
    {
      "id": "23",
      "screenName": "Click_View",
      "btnName": "Device"
    },


    {
      "id": "24",
      "screenName": "Click_Button",
      "btnName": "CONNECT TO READER"
    },
    {
      "id": "25",
      "screenName": "Wait_For_Text",
      // "btnName":"WPS323247002051"
      "btnName": "WPC323951000219"
      //   "btnName":"CHB2A6132009935"
      // "btnName":"CHB204650000480"
    },
    {
      "id": "26",
      "screenName": "Click_Text",
      // "btnName":"WPS323247002051"
      "btnName": "WPC323951000219"
      // "btnName":"CHB2A6132009935"
      // "btnName":"CHB204650000480"
    },
    {
      "id": "27",
      "screenName": "Find_Button",
      "btnName": "Disconnect"
    },
    {
      "id": "28",
      "screenName": "Click_Image" // image 
    },
    // connect reader steps ends
    // transaction step starts  
    {
      "id": "29",
      "screenName": "Click_Image", // image 
      "btnName": "Sale"

    },
    {
      "id": "30",
      "screenName": "Enter_Amount",
      "amount": "200.00"
    },
    {
      "id": "31",
      "screenName": "Click_Text",
      "btnName": "Clear"
    },
    {
      "id": "32",
      "screenName": "Enter_Amount",
      "amount": "50.00"
    },
    {
      "id": "33",
      "screenName": "Click_View",
      "btnName": "2 / 4"
    },
    {
      "id": "34",
      "screenName": "Click_Text",
      "btnName": "Go"
    },
    //custom tip
    //     {
    //     "id":9,
    //     "screenName":"Click_Text",
    //     "btnName":"Custom"
    // },
    //   {
    //     "id":14,
    //     "screenName":"Enter_Amount",
    //     "amount":"500.00"
    // },
    // fix tip
    {
      "id": "35",
      "screenName": "Click_Text",
      "btnName": "10%"
    },
    {
      "id": "36",
      "screenName": "Click_Button",
      "btnName": "Continue"
    },
    {
      "id": "37",
      "screenName": "Wait_For_Text",
      "btnName": "Transaction ID"
    },
    {
      "id": "38",
      "screenName": "Element_Avail", // image 
      "elementName": ["Transaction FAILED", "Transaction Approved"]
    },

    {
      "id": "39",
      "screenName": "Click_Button",
      "btnName": "See Details"
    }
    ];
    this.webSocketService.sendTestCaseRequest(item);
    // this.reportData.general.createdAt = this.formatDate(new Date());
    // const startTime = Date.now();

    //   {
    //     "sender": "6d1b7721-4973-4c98-9fd4-a3564d83ac10",
    //     "message": {
    //         "message": "SUCCESS",
    //         "info": "Welcome Screen Test Case Passes",
    //         "id": "6d1b7721-4973-4c98-9fd4-a3564d83ac10"
    //     }
    // }

    // const expectedMessCnt = item.length;
    const expectedMessCnt = 0;
    let receivedMessCnt = 0;

    this.webSocketService.getSubject().subscribe((res) => {
      receivedMessCnt++;
      if (res?.message && res?.message?.info) {
        this.resultArr.push(res.message);
      }
    })

    if (expectedMessCnt === receivedMessCnt) {
      console.log('expected');
      
      this.router.navigateByUrl('test-reports')
    }

    // const endTime = Date.now();  // Capture end time after the last response
    // const elapsedTimeInSeconds = (endTime - startTime) / 1000;  // Calculate elapsed time in seconds
    // console.log(`Total Time: ${elapsedTimeInSeconds} seconds`);

    // // Store the elapsed time (in seconds) in the report
    // this.reportData.general.executionTime = Math.round(elapsedTimeInSeconds);
    // console.log(this.reportData);



  }

  onStartTemp() {
    let item = [{
      "id": "0",
      "screenName": "Welcome"
    },
    {
      "id": "8",
      "screenName": "Click_Image", // image 
      "btnName": "left_arrow"
    },
    {
      "id": "1",
      "screenName": "Permissions"
    },
    {
      "id": "8",
      "screenName": "Click_Image", // image 
      "btnName": "left_arrow"
    },
    {
      "id": "2",
      "screenName": "Permissions_list"
    },
    {
      "id": "3",
      "screenName": "Allow_PhoneCalls",
      "action": "Allow"
    },
    {
      "id": "4",
      "screenName": "Allow_DeviceLocation",
      "action": "ALLOW"
    },
    {
      "id": "5",
      "screenName": "Allow_BluetoothConnection",
      "action": "ALLOW"
    },
    {
      "id": "6",
      "screenName": "Click_Button",
      "btnName": "Continue"
    },
    {
      "id": "7",
      "screenName": "Terminal Setup"
    },
    {
      "id": "8",
      "screenName": "Click_Image" // image 
    },
    {
      "id": "9",
      "screenName": "Select_Options",
      "options": "Testing"
    },
    {
      "id": "6",
      "screenName": "Click_Button",
      "btnName": "PROCEED"
    },
    {
      "id": "1",
      "screenName": "Enter_Terminal_ID",
      "terminal_id": ["2994001"]

    },
    {
      "id": "6",
      "screenName": "Click_Button",
      "btnName": "Next"
    },
    {
      "id": "10",
      "screenName": "Enter_Terminal_ID",
      "terminal_id": ["2994001"]

    },
    {
      "id": "6",
      "screenName": "Click_Button",
      "btnName": "Submit"
    },

    {
      "id": "11",
      "screenName": "Profile_Login",
      "pin": ["9", "2", "0", "4"]
    },
    {
      "id": "6",
      "screenName": "Click_Button",
      "btnName": "Confirm"
    },
    {
      "id": "6",
      "screenName": "Click_Button",
      "btnName": "GO"
    },
    {
      "id": 9,
      "screenName": "Click_Text",
      "btnName": "Skip >"
    },


    // connect reader steps start
    {
      "id": 10,
      "screenName": "Click_View",
      "btnName": "Device"
    },


    {
      "id": 12,
      "screenName": "Click_Button",
      "btnName": "CONNECT TO READER"
    },
    {
      "id": 13,
      "screenName": "Wait_For_Text",
      // "btnName":"WPS323247002051"
      "btnName": "WPC323951000219"
      //   "btnName":"CHB2A6132009935"
      // "btnName":"CHB204650000480"
    },
    {
      "id": 13,
      "screenName": "Click_Text",
      // "btnName":"WPS323247002051"
      "btnName": "WPC323951000219"
      // "btnName":"CHB2A6132009935"
      // "btnName":"CHB204650000480"
    },
    {
      "id": 14,
      "screenName": "Find_Button",
      "btnName": "Disconnect"
    },
    {
      "id": "8",
      "screenName": "Click_Image" // image 
    },
    // connect reader steps ends
    // transaction step starts  
    {
      "id": "8",
      "screenName": "Click_Image", // image 
      "btnName": "Sale"

    },
    {
      "id": 14,
      "screenName": "Enter_Amount",
      "amount": "200.00"
    },
    {
      "id": 9,
      "screenName": "Click_Text",
      "btnName": "Clear"
    },
    {
      "id": 14,
      "screenName": "Enter_Amount",
      "amount": "50.00"
    },
    {
      "id": 10,
      "screenName": "Click_View",
      "btnName": "2 / 4"
    },
    {
      "id": 9,
      "screenName": "Click_Text",
      "btnName": "Go"
    },
    //custom tip
    //     {
    //     "id":9,
    //     "screenName":"Click_Text",
    //     "btnName":"Custom"
    // },
    //   {
    //     "id":14,
    //     "screenName":"Enter_Amount",
    //     "amount":"500.00"
    // },
    // fix tip
    {
      "id": 9,
      "screenName": "Click_Text",
      "btnName": "10%"
    },
    {
      "id": 12,
      "screenName": "Click_Button",
      "btnName": "Continue"
    },
    {
      "id": 13,
      "screenName": "Wait_For_Text",
      "btnName": "Transaction ID"
    },
    {
      "id": "14",
      "screenName": "Element_Avail", // image 
      "elementName": ["Transaction FAILED", "Transaction Approved"]
    },

    {
      "id": "12",
      "screenName": "Click_Button",
      "btnName": "See Details"
    },
    //     // 2nd transaction starts
    {
      "id": "8",
      "screenName": "Click_Image", // image 
      "btnName": "Sale"

    },
    {
      "id": 14,
      "screenName": "Enter_Amount",
      "amount": "25.00"
    },
    {
      "id": 9,
      "screenName": "Click_Text",
      "btnName": "Go"
    },
    {
      "id": 12,
      "screenName": "Click_Button",
      "btnName": "Continue"
    },
    {
      "id": 13,
      "screenName": "Wait_For_Text",
      // "btnName":"WPS323247002051"
      "btnName": "Transaction ID"
    },
    {
      "id": "14",
      "screenName": "Element_Avail", // image 
      "elementName": ["Transaction FAILED", "Transaction Approved"]
    },
    {
      "id": "12",
      "screenName": "Click_Button",
      "btnName": "See Details"
    },
    {
      "id": "8",
      "screenName": "Click_Image", // image 
      "btnName": "Sale"

    },
    ];
    this.webSocketService.sendTestCaseRequest(item);

    //   {
    //     "sender": "6d1b7721-4973-4c98-9fd4-a3564d83ac10",
    //     "message": {
    //         "message": "SUCCESS",
    //         "info": "Welcome Screen Test Case Passes",
    //         "id": "6d1b7721-4973-4c98-9fd4-a3564d83ac10"
    //     }
    // }
    this.webSocketService.getSubject().subscribe((res) => {
      this.resultArr.push(res.message);
    })
    console.log(this.resultArr);


  }

  formatDate(date: Date): string {
    const day = ("0" + date.getDate()).slice(-2); // Add leading zero if day is single digit
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero if month is single digit (note: months are 0-based)
    const year = date.getFullYear(); // Get the full year
    return `${day}-${month}-${year}`; // Return the formatted string
  }



}
