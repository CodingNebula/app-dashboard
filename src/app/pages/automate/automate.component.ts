import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../../shared/services/account/account.service';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';

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
  constructor(
    private fb: FormBuilder,
    private webSocketService: WebsocketService,
    private accountService: AccountService) {


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
        "screenName": "Click_Image", // image 
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
      //  {
      //      "id":"7",
      //      "screenName":"Terminal Setup",
      //      "title": "Terminal Setup"
      //  },
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
      //  {
      //      "id":"1",
      //      "screenName":"Enter_Terminal_ID",
      //      "terminal_id":["2994001"],
      //      "title": "Welcome"

      //  },
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
  }

  ngOnInit() {
    // Create the form with FormBuilder
    this.myForm = this.fb.group({
      platform: ['', [Validators.required]],
      app: ['', [Validators.required]],
      package: ['', [Validators.required]],
      automation: ['', [Validators.required]],
      device: ['', [Validators.required]],
      noReset: ['', [Validators.required]],
      hiddenApp: ['', [Validators.required]],
      timeout: ['', [Validators.required]],
    });
  }

  onSubmit() {
    // if (this.myForm.valid) {
    //   this.isAccordionExpanded = false;
    this.webSocketService.connectWithAccessToken();
    this.myForm.reset();
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
    item.loading = true;

    item.status = this.webSocketService.message;


    item.loading = false;
  }

  onStartAppLaunch() {
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
    //   },
    //   (error) => {
    //     console.error('API Error:', error);
    //   }
    // );
    
      this.webSocketService.sendAppLaunchRequest(
        // [{ appType: "Android" },

        {
          capabilities: {
            //  "browserName": "Android",
            "platformName": "Android",
            "app": "/home/codingnebula/Downloads/app-debug-v12.apk",
            //"app":"/home/codingnebula/Downloads/app-debug-hid.apk",
            "appPackage": "com.example.app",
            "automationName": "UIAutomator2",
            //"deviceName": "CPH1859",
            "deviceName": "Samsung",
            "noReset": true,
            "ignoreHiddenApiPolicyError": true,
            //  "autoGrantPermissions": true,
            "newCommandTimeout": 1200000
          }
        },

        // {
        //   config: {
        //     "activationCode": "2994001",
        //     "activationKey": "2994001",
        //     "provider": "worldnet",
        //     "endpoint": "worldnet",
        //     "portfolio": "stormfront",
        //     "accountNumber": "718032354"
        //   }
        // }]
      )

    // item.status = this.webSocketService.message;
    // this.appLaunchStatus = this.webSocketService.appLaunchStatus;
  }



}
