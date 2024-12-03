import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../../shared/services/account/account.service';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';
import { AutomationDataService } from '../../shared/services/automationData/automation-data.service';
import { Router } from '@angular/router';
import { ApplicationDataService } from '../../shared/services/applicationData/application-data.service';

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
  public templateData: any[] = [];
  public testCases: any[] = [];
  public isEditMode: boolean = false;
  public appData: any;

  constructor(
    private fb: FormBuilder,
    private webSocketService: WebsocketService,
    private accountService: AccountService,
    private automateDataService: AutomationDataService,
    private applicationDataService: ApplicationDataService,
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
    this.appData = this.applicationDataService.getData();

    console.log(this.appData);
    

    this.myForm = this.fb.group({
      platform: [this.appData?.capabilities?.platform, [Validators.required]],
      app: [this.appData?.capabilities?.app, [Validators.required]],
      package: [this.appData?.capabilities?.package, [Validators.required]],
      automation: [this.appData?.capabilities?.automation, [Validators.required]],
      device: [this.appData?.capabilities?.device, [Validators.required]],
      noReset: [this.appData?.capabilities?.noReset, [Validators.required]],
      hiddenApp: [this.appData?.capabilities?.hiddenApp, [Validators.required]],
      timeout: [this.appData?.capabilities?.timeout, [Validators.required]],
    });

    this.myForm.get('platform').valueChanges.subscribe(platform => {
      if (platform === 'Android') {
        this.myForm.get('automation').setValue('UIAutomator2');
      }
      else {
        this.myForm.get('automation').setValue('');
      }
    })

    const state = window.history.state;

    if(state && state.templateArr){
      this.templateData = state.templateArr
    }
    console.log(this.templateData);
    
    this.formateTestCaseData();
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isAccordionExpanded = false;
      
      this.reportData.general.platform = this.myForm.value?.platform;
      this.reportData.general.device = this.myForm.value?.device;

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

  // noResetValidator(control) {
  //   if (control.value === 'False') {
  //     return { invalidValue: true };
  //   }
  //   return null;
  // }

  // ignoreHiddenValidator(control) {
  //   if (control.value === 'False') {
  //     return { invalidValue: true };
  //   }
  //   return null;
  // }
  onSaveDescription(){
    
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
    this.webSocketService.getSubject().subscribe((res) => {
      if (res?.message && res?.message?.info) {
        this.resultArr.push(res.message);
      }
    })

      this.router.navigateByUrl('test-reports')

  }

  generateReport(){
    this.webSocketService.saveTestReportData({
      id: 0,
      capabilities: {
        platformName: "Android",
        app: "/home/codingnebula/Downloads/app-debug-v12.apk",
        appPackage: "com.example.app",
        automationName: "UIAutomator2",
        deviceName: "Samsung",
        noReset: true,
        ignoreHiddenApiPolicyError: true,
        newCommandTimeout: 1200000
      },
      reports: [
        {
          test_case: 'Welcome',
          status: 'Passed',
          defect: '',
          time_spent: 300,
          expected_result: 'Should be able to enter the text'
        },
        {
          test_case: 'Permission',
          status: 'Failed',
          defect: 'User not allowed permissions',
          time_spent: 200,
          expected_result: 'Permission should allowed'
        },
        {
          test_case: 'Device Connection',
          status: 'Passed',
          defect: '',
          time_spent: 280,
          expected_result: 'Device connected'
        },
        {
          test_case: 'Transaction',
          status: 'Failed',
          defect: 'Reader not connected',
          time_spent: 300,
          expected_result: 'Reader should be connected'
        },
        {
          test_case: 'Receipt',
          status: 'Untested',
          defect: '',
          time_spent: 300,
          expected_result: 'Receipt send on email'
        },
      ],
      extras: {
        app_name: 'Anypay 2.10 (Alpha)',
        started_by: 'Nick Jones',
        start_time: '14:15:00',
        created_at: '25-11-2024',
        time_taken: 12000,
      }
    });
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

    this.webSocketService.getSubject().subscribe((res) => {
      this.resultArr.push(res.message);
    })


  }

  formatDate(date: Date): string {
    const day = ("0" + date.getDate()).slice(-2); 
    const month = ("0" + (date.getMonth() + 1)).slice(-2); 
    const year = date.getFullYear(); 
    return `${day}-${month}-${year}`;
  }


  formateTestCaseData(){
    this.templateData[0]?.templates.map((item) => {
      item?.testCases?.map((testCase) => {
        this.testCases.push(testCase);
      })
    })
    console.log(this.testCases);
    
  }

  onEdit(){
    this.isEditMode = true;
    this.enableFields(true);
  }

  enableFields(enable: boolean){
    if(enable){
      this.myForm.get('platform').enable();
      this.myForm.get('app').enable();
      this.myForm.get('package').enable();
      this.myForm.get('automation').enable();
      this.myForm.get('device').enable();
      this.myForm.get('timeout').enable();
      this.myForm.get('noReset').enable();
      this.myForm.get('hiddenApp').enable();
    }
    else{
      this.myForm.get('platform').disable();
      this.myForm.get('app').disable();
      this.myForm.get('package').disable();
      this.myForm.get('automation').disable();
      this.myForm.get('device').disable();
      this.myForm.get('timeout').disable();
      this.myForm.get('noReset').disable();
      this.myForm.get('hiddenApp').disable();
    }
  }



}
