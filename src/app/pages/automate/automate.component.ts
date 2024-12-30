import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
  @ViewChild('resultContainer') resultContainer: ElementRef;
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
  public startInterval:any;
  public reportData: any = {
    general: {}
  };
  public applicationData: any;
  public templateData: any = {};
  public testCases: any[] = [];
  public isEditMode: boolean = false;
  public appData: any;
  public appCapabilities: any;
  public showResult: boolean = false;
  public completeAppData: any;
  public extras: any = {};

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
      //      "id":9,get
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
ngOnDestroy(){
  clearInterval(this.startInterval)
}
  ngOnInit() {
    this.webSocketService.getSocketFailure().subscribe((res)=>{
      if(this.startInterval){
        clearInterval(this.startInterval);
      }
    })
    const state = window.history.state;

    if (state && state.templateArr) {
      this.templateData = state.templateArr
    }

    // Call getCapabilities() and subscribe to it
    this.getCapabilities().subscribe((appCapabilities) => {
      console.log(appCapabilities);  // This will log the data once it's available
      this.completeAppData = appCapabilities
    });



    if (state && state.capabilities) {
      this.appCapabilities = state.capabilities;
    }

    console.log(this.appCapabilities);

    this.appData = this.applicationDataService.getData();

    console.log(this.appData);

    //   {
    //     "platformName": "Android",
    //     "app": "/home/codingnebula/Downloads/app-debug-v12.apk",
    //     "appPackage": "com.example.app",
    //     "automationName": "UIAutomator2",
    //     "deviceName": "Samsung",
    //     "noReset": true,
    //     "ignoreHiddenApiPolicyError": true,
    //     "newCommandTimeout": 1200000
    // }

    this.myForm = this.fb.group({
      platform: [this.appCapabilities?.platformName, [Validators.required]],
      app: [this.appCapabilities?.app, [Validators.required]],
      package: [this.appCapabilities?.appPackage, [Validators.required]],
      automation: [this.appCapabilities?.automationName, [Validators.required]],
      device: [this.appCapabilities?.deviceName, [Validators.required]],
      noReset: [this.appCapabilities?.noReset, [Validators.required]],
      hiddenApp: [this.appCapabilities?.ignoreHiddenApiPolicyError, [Validators.required]],
      timeout: [this.appCapabilities?.newCommandTimeout, [Validators.required]],
      description:[this.appCapabilities?.description, []],
      buildNo:[this.appCapabilities?.buildNo, []],
    });

    this.myForm.get('platform').valueChanges.subscribe(platform => {
      if (platform === 'Android') {
        this.myForm.get('automation').setValue('UIAutomator2');
      }
      else {
        this.myForm.get('automation').setValue('');
      }
    })



    this.formatTestCaseData();
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isAccordionExpanded = false;

      this.reportData.general.platform = this.myForm.value?.platform;
      this.reportData.general.device = this.myForm.value?.device;

      this.appLaunchLoading = true;

      const app_id = localStorage.getItem('app_id');
     delete this.myForm.value.description;
     delete this.myForm.value.buildNo;
 
      console.log(this.myForm.value);

      this.accountService.updateCapabilities(app_id,
        {
          extra: {
            capabilities: this.myForm.value
  
          },
          name:'Ionic Anypay'
        }
      ).subscribe((response) => {
        console.log(response);
        this.appLaunch(app_id);

      }, (error) => {
        console.log(error);

      })

      // this.accountService.launchApp({
      //   capabilities: {
      //     platformName: "Android",
      //     app: "/home/codingnebula/Downloads/app-debug-v12.apk",
      //     appPackage: "com.example.app",
      //     automationName: "UIAutomator2",
      //     deviceName: "Samsung",
      //     noReset: true,
      //     ignoreHiddenApiPolicPUSyError: true,
      //     newCommandTimeout: 1200000
      //   }
      // }, app_id).subscribe(
      //   (response) => {

      //     this.appLaunchLoading = false;
      //     this.appLaunchStatus = 'SUCCESS'
      //   },
      //   (error) => {
      //     console.error('API Error:', error);
      //     this.appLaunchLoading = false;
      //     this.appLaunchStatus = 'FAILED'
      //   }
      // );
      this.myForm.reset();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    // setTimeout(()=>{
    //   const parentDiv = document.getElementsByClassName('test-case-container')[0]
    //   if (parentDiv) {
    //     parentDiv.scrollTop = parentDiv.scrollHeight
    //   }
    // },500)
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
  onSaveDescription() {

  }

  onStartTrans(itemData) {
    let count = 0;
    let individualCount = 0;
    console.log(itemData);

    const result = itemData.screens.map(screen => {
      return screen.instructions.map((instruction, index) => {
        return {
          id: index,
          screenName: instruction.ins_back_name,
          btnName: instruction.ins_element_name,
          successMessage: `${instruction.ins_name} Passed`,
          failedMessage: `${instruction.ins_name} Failed`,
          roomId: localStorage.getItem("id"),
        };
      });
    }).flat();

    result.push(
      {
        screenName: "End_Instructions",
        successMessage: "End_Instructions",
        roomId: localStorage.getItem("id"),
      }
    );

    const obj = { "id": "111", "screenName": "End_Instructions", roomId: localStorage.getItem("id"), };

    // let item = [
    //   {
    //     "id": "0",
    //     "screenName": "Welcome",
    //     "btnName": "Welcome"
    //   },
    //   {
    //     "id": "8",
    //     "screenName": "Click_Image", // image 
    //     "btnName": "left_arrow"
    //   },
    //   {
    //     "id": "1",
    //     "screenName": "Permissions"
    //   },
    //   {
    //     "id": "8",
    //     "screenName": "Click_Image", // image 
    //     "btnName": "left_arrow"
    //   },
    //   {
    //     "id": "2",
    //     "screenName": "Permissions_list"
    //   },
    //   {
    //     "id": "3",
    //     "screenName": "Allow_PhoneCalls",
    //     "btnName": "Allow"
    //   },
    //   {
    //     "id": "4",
    //     "screenName": "Allow_DeviceLocation",
    //     "btnName": "ALLOW"
    //   },
    //   {
    //     "id": "5",
    //     "screenName": "Allow_BluetoothConnection",
    //     "btnName": "ALLOW"
    //   },
    //   {
    //     "id": "6",
    //     "screenName": "Click_Button",
    //     "btnName": "Continue"
    //   },
    //   {
    //     "id": "7",
    //     "screenName": "Terminal Setup"
    //   },
    //   {
    //     "id": "8",
    //     "screenName": "Click_Image" // image 
    //   },
    //   {
    //     "id": "9",
    //     "screenName": "Select_Options",
    //     "options": "Testing"
    //   },
    //   {
    //     "id": "6",
    //     "screenName": "Click_Button",
    //     "btnName": "PROCEED"
    //   },
    //   {
    //     "id": "1",
    //     "screenName": "Enter_Terminal_ID",
    //     "terminal_id": ["2994001"]

    //   },
    //   {
    //     "id": "6",
    //     "screenName": "Click_Button",
    //     "btnName": "Next"
    //   },
    //   {
    //     "id": "10",
    //     "screenName": "Enter_Terminal_ID",
    //     "terminal_id": ["2994001"]

    //   },
    //   {
    //     "id": "6",
    //     "screenName": "Click_Button",
    //     "btnName": "Submit"
    //   },

    //   {
    //     "id": "11",
    //     "screenName": "Profile_Login",
    //     "pin": ["9", "2", "0", "4"]
    //   },
    //   {
    //     "id": "6",
    //     "screenName": "Click_Button",
    //     "btnName": "Confirm"
    //   },
    //   {
    //     "id": "6",
    //     "screenName": "Click_Button",
    //     "btnName": "GO"
    //   },
    //   {
    //     "id": 9,
    //     "screenName": "Click_Text",
    //     "btnName": "Skip >"
    //   },
    //   {
    //     "id": 9,
    //     "screenName": "homePage",
    //     "action": "Transaction"
    //   },

    //   // connect reader steps start
    //   {
    //     "id": 10,
    //     "screenName": "Click_View",
    //     "btnName": "Device"
    //   },


    //   {
    //     "id": 12,
    //     "screenName": "Click_Button",
    //     "btnName": "CONNECT TO READER"
    //   },
    //   {
    //     "id": 13,
    //     "screenName": "Wait_For_Text",
    //     // "btnName":"WPS323247002051"
    //     "btnName": "WPC323951000219"
    //     //   "btnName":"CHB2A6132009935"
    //     // "btnName":"CHB204650000480"
    //   },
    //   {
    //     "id": 13,
    //     "screenName": "Click_Text",
    //     // "btnName":"WPS323247002051"
    //     "btnName": "WPC323951000219"
    //     // "btnName":"CHB2A6132009935"
    //     // "btnName":"CHB204650000480"
    //   },
    //   {
    //     "id": 14,
    //     "screenName": "Find_Button",
    //     "btnName": "Disconnect"
    //   },
    //   {
    //     "id": "8",
    //     "screenName": "Click_Image" // image 
    //   },

    //   {
    //     "id": "8",
    //     "screenName": "Click_Image", // image 
    //     "btnName": "Sale"
    //   },
    //   {
    //     "id": 14,
    //     "screenName": "Enter_Amount",
    //     "amount": "200.00"
    //   },
    //   {
    //     "id": 9,
    //     "screenName": "Click_Text",
    //     "btnName": "Clear"
    //   },
    //   {
    //     "id": 14,
    //     "screenName": "Enter_Amount",
    //     "amount": "50.00"
    //   },
    //   {
    //     "id": 10,
    //     "screenName": "Click_View",
    //     "btnName": "2 / 4"
    //   },
    //   {
    //     "id": 9,
    //     "screenName": "Click_Text",
    //     "btnName": "Go"
    //   },

    //   {
    //     "id": 9,
    //     "screenName": "Click_Text",
    //     "btnName": "10%"
    //   },
    //   {
    //     "id": 12,
    //     "screenName": "Click_Button",
    //     "btnName": "Continue"
    //   },
    //   {
    //     "id": 13,
    //     "screenName": "Wait_For_Text",
    //     "btnName": "Transaction ID"
    //   },
    //   {
    //     "id": "14",
    //     "screenName": "Element_Avail", // image 
    //     "elementName": ["Transaction FAILED", "Transaction Approved"]
    //   },

    //   {
    //     "id": "12",
    //     "screenName": "Click_Button",
    //     "btnName": "See Details"
    //   },

    //   {
    //     "id": "8",
    //     "screenName": "Click_Image" // image 

    //   },


    // ]

    let item = [
      {
        "id":"0",
        "screenName":"Welcome",
        "btnName":"Welcome"
      },
      {
        "id":"8",
        "screenName":"Click_Image", // image
        "btnName":"left_arrow"
      },
      {
        "id":"1",
        "screenName":"Permissions"
      },
      {
        "id":"8",
        "screenName":"Click_Image", // image
        "btnName":"left_arrow"
      },
      {
        "id":"2",
        "screenName":"Permissions_list"
      },
      {
        "id":"3",
        "screenName":"Allow_PhoneCalls",
        "btnName":"Allow"
      },
      {
        "id": "4",
        "screenName": "Allow_DeviceLocation",
        "btnName": "ALLOW"
      },
      {
        "id": "5",
        "screenName": "Allow_BluetoothConnection",
        "btnName": "ALLOW"
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
      {
        "id": 9,
        "screenName": "homePage",
        "action": "Transaction"
      },
      // {
      //     "id":20
      // },
      // connect reader steps start
      {
        "id": 10,
        "screenName": "Click_View",
        "btnName": "Device"
      },
      {
        "id":12,
        "screenName":"Click_Button",
        "btnName":"CONNECT TO READER"
      },
      {
        "id":13,
        "screenName":"Wait_For_Text",
        "btnName":"WPC323951000219"
        // "btnName":"WPS323247002051"
        // "btnName":"WPS323129001477"
        //   "btnName":"CHB2A6132009935"
        // "btnName":"CHB204650000480"
      },
      {
        "id":13,
        "screenName":"Click_Text",
        "btnName":"WPC323951000219"
        // "btnName":"WPS323247002051"
        // "btnName":"WPS323129001477"
        // "btnName":"CHB2A6132009935"
        // "btnName":"CHB204650000480"
      },
      {
        "id":14,
        "screenName":"Find_Button",
        "btnName":"Disconnect"
      },
      {
        "id":"8",
        "screenName":"Click_Image" // image
      },
      // connect reader steps ends
      // transaction step starts
      {
        "id":"8",
        "screenName":"Click_Image", // image
        "btnName":"Sale"
      },
      {
        "id":14,
        "screenName":"Enter_Amount",
        "btnName":"200.00"
      },
      {
        "id":9,
        "screenName":"Click_Text",
        "btnName":"Clear"
      },
      {
        "id":14,
        "screenName":"Enter_Amount",
        "btnName":"50.00"
      },
      {
        "id":10,
        "screenName":"Click_View",
        "btnName":"2 / 4"
      },
      {
        "id":9,
        "screenName":"Click_Text",
        "btnName":"Go"
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
        "id":9,
        "screenName":"Click_Text",
        "btnName":"10%"
      },
      {
        "id":12,
        "screenName":"Click_Button",
        "btnName":"Continue"
      },
      {
        "id":13,
        "screenName":"Wait_For_Text",
        "btnName":"Transaction ID"
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
        "screenName": "Click_Image" // image
      },
      // refund steps starts from dashboard
      {
        "id":"8",
        "screenName":"Click_Image", // image
        "btnName":"Refund"
      },
      {
        "id":"0",
        "screenName":"Find_Screen_Elements"
      }
    ]

    item.push(obj);

    // Output the modified item array
    console.log(item);
    this.showResult = true;
    console.log(result);

    this.webSocketService.sendTestCaseRequest(item);

    let counterInterval = setInterval(() => {
      count++;
    }, 1000);


    //COUNTING TIME SPENT FOR INDIVIDUAL TEST CASES----------------------------------->START
    let startInterval;
    function startCounting() {
      this.startInterval = setInterval(() => {
        individualCount = individualCount + 1;
        console.log('count started:', individualCount);
      }, 1000);
    }
    startCounting();
    let timeChecked = false;

    this.webSocketService.getSubject().subscribe((res) => {

      if (!timeChecked) {
        const currentDate = new Date();

        // Get year, month, day, hours, minutes, and seconds
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        res.extra.startTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

      if (res?.message && (res?.message?.successMessage || res?.message?.failedMessage)) {

        res.extra.timeSpent = individualCount;
        individualCount = 0;
        clearInterval(this.startInterval);

        // Restart the interval by calling the function
        startCounting();
        if (res?.message?.successMessage !== "End_Instructions") {

          this.resultArr.push(res.message);
          this.scrollToBottom();
          console.log(res);
        }
        if (res?.message?.successMessage === "End_Instructions") {
          clearInterval(counterInterval);
          clearInterval(startInterval)
          res.extra.timeTaken = count;
     
          const now = new Date();
          const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
          this.extras.startedTime = formattedTime;
          res.extra.startedTime=formattedTime;
          const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          this.extras.createdAt = formattedDate;
          const socketReport = {
            capabilities: this.completeAppData,
            resultArr: this.resultArr,
            extras: this.extras,
          }

          let passedCount = 0;
          let failedCount = 0;
          let untestedCount = 0;

          // Iterate over the reports to count the number of passed, failed, and untested test cases
          this.resultArr?.map((testCase) => {
            testCase.completeCount = count;
            if (testCase?.successMessage !== "End_Instructions") {
              console.log(testCase);
              if (testCase.message === 'SUCCESS') {
                passedCount++;
              } else if (testCase.message === 'FAILED') {
                failedCount++;
              } else if (testCase.message === 'Untested') {
                untestedCount++;
              }
            }
          });

          const body = {
            applicationId: localStorage.getItem('app_id'),
            filename: itemData?.wt_desc,
            app_version: "2.1",
            totalTestCase: result?.length - 1,
            passed: passedCount,
            failed: failedCount,
            crash_count: untestedCount,
            extra: socketReport,
          }
          this.accountService.postReportData(body).subscribe((resp) => {
            if (resp) {
              console.log(resp);
              setTimeout(() => {
                this.router.navigateByUrl('pages/test-reports', { state: { reportData: resp } });
              }, 1000)

            }
          })
        }
      }
    }, (err) => {
      console.log(err,'err')

      clearInterval(this.startInterval);
    })

    //   this.router.navigateByUrl('test-reports')

  }

  onStart(item) {
    console.log(item);

    const res = item.testCase.map((item) => {
      return {
        screenName: item.ins_back_name,
        btnName: item.ins_element_name
      }
    })

    console.log(res);

    //   {
    //     "sender": "e6135615-48a5-4b5d-a121-af82670e0a92",
    //     "message": {
    //         "message": "SUCCESS",
    //         "info": "Continue Button Clicked on Screen",
    //         "id": "e6135615-48a5-4b5d-a121-af82670e0a92",
    //         "successMessage": "Permission list Continue button Passed"
    //     }
    // }
    this.webSocketService.sendTestCaseRequest(res);
    this.webSocketService.getSubject().subscribe((res) => {
      if (res?.message && res?.message?.info) {
        this.resultArr.push(res.message);
        console.log(res);

      }
    })

    // const obj = {
    //   screenName: item?.ins_back_name,
    //   btnName: item?.ins_element_name
    // }

    // console.log(obj);

  }

  generateReport() {
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


  formatTestCaseData() {
    console.log(this.templateData);

    this.templateData?.screens.map((item) => {
      item?.instructions?.map((testCase) => {
        // Check if testCase with the same ins_set_id is already present in testCases array 
        // Check if the current ins_set_id exists in this.testCases
        const exists = this.testCases.some(existingTestCase => existingTestCase.ins_set_id === item.ins_set_id);

        if (!exists) {
          this.testCases.push({
            ins_set_id: item.ins_set_id,
            ins_set_screen_name: item.ins_set_screen_name, // Include ins_set_screen_name for reference
            testCase: item.instructions  // Add the entire instructions array as a nested property
          });
        }
      });
    });

    console.log(this.testCases);
  }



  onEdit() {
    this.isEditMode = true;
    this.enableFields(true);
  }

  enableFields(enable: boolean) {
    if (enable) {
      this.myForm.get('platform').enable();
      this.myForm.get('app').enable();
      this.myForm.get('package').enable();
      this.myForm.get('automation').enable();
      this.myForm.get('device').enable();
      this.myForm.get('timeout').enable();
      this.myForm.get('noReset').enable();
      this.myForm.get('hiddenApp').enable();
      // this.myForm.get('description').enable();
      // this.myForm.get('buildNo').enable();
  
    }
    else {
      this.myForm.get('platform').disable();
      this.myForm.get('app').disable();
      this.myForm.get('package').disable();
      this.myForm.get('automation').disable();
      this.myForm.get('device').disable();
      this.myForm.get('timeout').disable();
      this.myForm.get('noReset').disable();
      this.myForm.get('hiddenApp').disable();
      // this.myForm.get('description').enable();
      // this.myForm.get('buildNo').enable();
    }
  }

  appLaunch(id) {
    this.accountService.launchApp({
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
    }, id).subscribe(
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
  }

  getCapabilities() {
    const app_id = localStorage.getItem('app_id');
    return this.accountService.getCapabilites(app_id);
  }


}
