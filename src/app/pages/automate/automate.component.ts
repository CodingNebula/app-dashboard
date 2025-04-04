import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../../shared/services/account/account.service';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';
import { AutomationDataService } from '../../shared/services/automationData/automation-data.service';
import { Router } from '@angular/router';
import { ApplicationDataService } from '../../shared/services/applicationData/application-data.service';
import { NbDialogService } from '@nebular/theme';
import { EditautomateComponent } from '../component/edit-automate/editautomate/editautomate.component';

@Component({
  selector: 'ngx-automate',
  templateUrl: './automate.component.html',
  styleUrls: ['./automate.component.scss']
})
export class AutomateComponent implements OnInit {
  @ViewChild('resultContainer') resultContainer: ElementRef;
  public showIndividualEnd = false;
  public startApp: boolean = false;
  public currentOnGoingScreen = null
  public socketSubscription;
  public currentScreen = '';
  public showEnd = false;
  public counterInterval;
  public individualCount = 0;
  public singleInstructionTimeTotal: number = 0
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
  public startInterval: any;
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
  public description: any;
  public buildNumber: any;
  public showAppLaunchError: boolean = false;
  public isAppLaunched: boolean = false;
  public hideAll: boolean = false;
  public originalData: any[] = [];
  public count: number = 0;
  public totalTimeApp: number;
  private endTest: boolean = false;
  public showWaitLoader: boolean = false;
  public iSingleCase: boolean = true;
  public isInstructionSkipped: boolean = true;
  public isQuickTemplate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private webSocketService: WebsocketService,
    private accountService: AccountService,
    private automateDataService: AutomationDataService,
    private applicationDataService: ApplicationDataService,
    private router: Router,
    private dialogService: NbDialogService) {

      console.log('gbnglglnberbiereeeeeeeeeeee');

    this.applicationData = this.automateDataService.selectedApplication;

  }
  ngOnDestroy() {
    clearInterval(this.startInterval);
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    console.log('gbnglglnberbiereeeeeeeeeeee');

    this.webSocketService.getSocketFailure().subscribe((res) => {
      if (this.startInterval) {
        clearInterval(this.startInterval);
      }
    })
    const state = window.history.state;

    if (state && state.templateArr) {
      this.templateData = state.templateArr
      console.log(this.templateData);

    }

    // Call getCapabilities() and subscribe to it
    this.getCapabilities().subscribe((appCapabilities) => {

      this.completeAppData = appCapabilities;
    });



    if (state && state.capabilities) {
      this.appCapabilities = state.capabilities;
    }
    this.appData = this.applicationDataService.getData();

    this.myForm = this.fb.group({
      platform: [{ value: this.appCapabilities?.platformName, disabled: true }, [Validators.required]],
      app: [this.appCapabilities?.app, [Validators.required]],
      package: [this.appCapabilities?.appPackage, [Validators.required]],
      automation: [this.appCapabilities?.automationName, [Validators.required]],
      device: [this.appCapabilities?.deviceName, [Validators.required]],
      noReset: [{ value: (this.appCapabilities?.noReset).toString(), disabled: true }, [Validators.required]],
      hiddenApp: [{ value: (this.appCapabilities?.ignoreHiddenApiPolicyError).toString(), disabled: true }, [Validators.required]],
      timeout: [this.appCapabilities?.newCommandTimeout, [Validators.required]],
      description: [this.appCapabilities?.description, [Validators.required]],
      buildNo: [this.appCapabilities?.buildNo, [Validators.required]],
    });

    this.myForm.get('platform').valueChanges.subscribe(platform => {
      if (platform === 'Android') {
        this.myForm.get('automation').setValue('UIAutomator2');
      }
      else {
        this.myForm.get('automation').setValue('');
      }
    })

    this.formatTemplateData();
    this.formatTestCaseData();
  }

  onSubmit() {
    if (this.myForm.valid) {

      this.reportData.general.platform = this.myForm.value?.platform;
      this.reportData.general.device = this.myForm.value?.device;

      this.appLaunchLoading = true;

      const app_id = localStorage.getItem('app_id');

      this.myForm.get('description').enable();
      this.myForm.get('buildNo').enable();

      this.description = this.myForm.value.description
      this.buildNumber = this.myForm.value.buildNo

      let updatedCapabilities = { ...this.myForm.value };

      delete updatedCapabilities.description;
      delete updatedCapabilities.buildNo;

      if (this.myForm.dirty && !this.myForm.get('buildNo').dirty && !this.myForm.get('description').dirty) {

        this.accountService.updateCapabilities(app_id,
          {
            extra: {
              capabilities: updatedCapabilities

            },
            name: 'Ionic Anypay'
          }
        ).subscribe((response) => {
          this.appLaunch(app_id);
        }, (error) => {
          console.log(error);

        })
      } else {
        this.appLaunch(app_id);
      }

    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  openEditInstructionDialog() {
    const dialogRef = this.dialogService.open(EditautomateComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true,
      context: {
        itemsToEdit: this.templateData
      }
    })

    dialogRef.onClose.subscribe((result) => {
      // console.log(result);
      this.templateData = result?.data;
      console.log(this.templateData);

    })
  }

  scrollToBottom() {
  }

  startCounting(individualCount) {
    this.individualCount = individualCount;

    this.startInterval = setInterval(() => {
      this.individualCount += 1;

    }, 1000);
  }

  onStartTrans(itemData, startAll) {
    this.iSingleCase = false;
    console.log(itemData);

    let count = 0;
    let totalTimeApp = Math.floor(Date.now() / 1000);
    const roomId = localStorage.getItem("id");
    this.hideAll = true;
    let result = itemData;
    this.startApp = true;
    if (startAll) {
      let index = 0;
      result = itemData.screens.map(screen => {
        return screen.instructions.map((instruction) => {
          const newIntruction = {
            id: index,
            screenName: instruction.ins_back_name,
            btnName: instruction.ins_element_name,
            successMessage: `${instruction.ins_name}`,
            failedMessage: `${instruction.ins_name}`,
            roomId,
            moduleName: instruction.ins_set_screen_name,
            ins_id: instruction.ins_id,
            singleInstLoader: false,
          };

          index += 1;
          return newIntruction;
        });
      }).flat();


      console.log(result);


      result.push(
        {
          screenName: 'End_Instructions',
          successMessage: 'End Instructions',
          roomId: localStorage.getItem("id"),
          ins_id: '12345',
        }
      );
    }
    this.sendAllInstructionSocket(itemData, result)

  }


  sendAllInstructionSocket(itemData, result) {
    let count = 0;

    let totalTimeApp = Math.floor(Date.now() / 1000)

    let passedCount = 0;
    let failedCount = 0;
    let untestedCount = 0;

    if (this.showEnd) {

      this.showWaitLoader = true;

      setTimeout(() => {
        console.log(this.endTest, 'endtest1');

        this.endTest = true;
      }, 2000)

      const now = new Date();
      const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      this.extras.startedTime = formattedTime;
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      this.extras.createdAt = formattedDate;

      this.resultArr?.map((testCase) => {
        testCase.completeCount = count;

        if (testCase?.successMessage !== "End_Instructions") {

          if (testCase.message === 'SUCCESS') {
            passedCount++;
          } else if (testCase.message === 'FAILED') {
            failedCount++;
          } else if (testCase.message === 'Untested') {
            untestedCount++;
          }
        }
      });

      const untestedData = result.slice(passedCount, result.length);

      console.log('ShowEnd', this.showEnd);

      console.log('untested', untestedData);

      const socketReport = {
        capabilities: {
          description: this.description.trim(),
          buildInfo: this.buildNumber.trim(), ...this.completeAppData,
        },
        resultArr: this.resultArr,
        extras: this.extras,
        totalTimeElapsed: Math.floor(Date.now() / 1000) - this.totalTimeTaken,
        untestedData: untestedData,
        untestedCount: untestedCount,
        originalData: result,
      }

      let intsCount = itemData?.screens.reduce((acc, item) => acc + item.instructions.length, 0);

      const body = {
        applicationId: localStorage.getItem('app_id'),
        filename: itemData?.wt_desc,
        app_version: "2.1",
        totalTestCase: intsCount,
        passed: passedCount,
        failed: failedCount,
        untestedCount: intsCount - passedCount - failedCount,
        extra: socketReport,
      }

    } else {

      const obj = { "id": "111", "screenName": "End_Instructions", roomId: localStorage.getItem("id"), };

      this.showResult = true;

      // for single instructions
      this.sendInstructions(result);

      // for testing
      // this.webSocketService.sendTestCaseRequest(result);

      this.counterInterval = setInterval(() => {
        count++;
      }, 1000);

      let startInterval = Date.now() / 1000;
      this.startCounting(this.individualCount);
      let timeChecked = false;
      this.showEnd = true

      this.totalTimeTaken = Math.floor(Date.now() / 1000);

    }
  }



  singleInstructionWebsocket(allInstructions) {

    this.showIndividualEnd = true;
    allInstructions.showSingleInstruction = true;
    allInstructions.singleInstLoader = true;

    const res = {
      id: 0,
      screenName: allInstructions.ins_back_name,
      btnName: allInstructions.ins_element_name,
      successMessage: `${allInstructions.ins_name}`,
      failedMessage: `${allInstructions.ins_name}`,
      roomId: localStorage.getItem("id"),
      moduleName: allInstructions.ins_set_screen_name,
      ins_id: allInstructions.ins_id,
    }

    let startInterval = Date.now() / 1000;
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();

    }
    console.log(res);

    this.webSocketService.sendTestCaseRequest({ ...res, singleCase: true });
    this.socketSubscription = this.webSocketService.getSubject().subscribe((res) => {
      console.log(res);

      if (res?.message && (res?.message?.successMessage || res?.message?.failedMessage)) {

        this.currentOnGoingScreen = res.message.moduleName;
        allInstructions.singleInstLoader = false;
        let currentTime = Date.now() / 1000;
        const now = new Date();
        const formatdate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        this.extras.createdAt = formatdate;

        const hours = String(now.getHours()).padStart(2, '0'); // Get the hours, ensure two digits
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Get the minutes, ensure two digits
        const seconds = String(now.getSeconds()).padStart(2, '0'); // Get the seconds, ensure two digits
        this.extras.startedTime = `${hours}:${minutes}:${seconds}`;
        res.startedTime = `${hours}:${minutes}:${seconds}`;
        res.createdAt = formatdate;
        res.message.timeSpent = (currentTime - startInterval).toFixed(2);

        startInterval = Date.now() / 1000;
        this.singleInstructionTimeTotal += Math.ceil(res.message.timeSpent);
        this.resultArr.push(res.message);

        this.testCases.map((item) => {
          item.testCase.map((inst) => {
            if (inst.ins_id === allInstructions.ins_id) {
              inst.status = res.message.message;
              return this.testCases;
            }
          })
        })
        // indexCounter += 1;
        // this.recursiveInstructions(instructionsArr,indexCounter);

      }

    })

  }
  onStart(item, testCases) {
    console.log(item);


    // this.showEnd = true
    this.showIndividualEnd = true;
    item.hideStart = true;

    const res = item.testCase.map((item, index) => {
      const matchedItem = this.originalData.find(originalItem => originalItem.ins_id === item.ins_id);

      const result = {
        id: index,
        screenName: item.ins_back_name,
        btnName: item.ins_element_name,
        successMessage: `${item.ins_name}`,
        failedMessage: `${item.ins_name}`,
        roomId: localStorage.getItem("id"),
        moduleName: item.ins_set_screen_name,
        ins_id: item.ins_id,
        singleInstLoader: false,
      };

      if (matchedItem) {
        result.id = matchedItem.id;
      }

      return result;
    });

    res.push(
      {
        screenName: 'End_Instructions',
        successMessage: 'End Instructions',
        roomId: localStorage.getItem("id"),
        ins_id: '12345',
      }
    );

    let id = res[0].id;
    // let updatedReq;
    let leftOverInstructions = [];

    if (id !== 0) {
      leftOverInstructions = this.originalData.slice(0, id);
      console.log(leftOverInstructions);

    }

    const updatedReq = [...leftOverInstructions, ...res];
    console.log(updatedReq);

    console.log(res);

    this.sendInstructions(updatedReq);

  }

  sendInstructions(resArr) {
    this.totalTimeApp = Math.floor(Date.now() / 1000);
    this.recursiveInstructions(resArr, 0)
  }

  recursiveInstructions(instructionsArr, indexCounter) {
    console.log(instructionsArr);

    if (indexCounter < instructionsArr.length && !this.endTest) {
      console.log('endtest', this.endTest);

      if (this.socketSubscription) {
        this.socketSubscription.unsubscribe();

      }
      let startInterval = Date.now() / 1000;

      instructionsArr[indexCounter].singleInstLoader = true;
      this.webSocketService.sendTestCaseRequest({ ...instructionsArr[indexCounter], singleCase: false, Skip: this.isInstructionSkipped });
      this.currentOnGoingScreen = instructionsArr[indexCounter].moduleName;

      console.log(instructionsArr[indexCounter]);
      console.log(this.endTest, 'end before mess received');

      this.socketSubscription = this.webSocketService.getSubject().subscribe((res) => {

        if (res?.message && (res?.message?.successMessage || res?.message?.failedMessage) && res?.message?.successMessage !== "End Instructions") {
          this.showWaitLoader = false;
          let currentTime = Date.now() / 1000;
          const now = new Date();
          const formatdate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          this.extras.createdAt = formatdate;

          const hours = String(now.getHours()).padStart(2, '0'); // Get the hours, ensure two digits
          const minutes = String(now.getMinutes()).padStart(2, '0'); // Get the minutes, ensure two digits
          const seconds = String(now.getSeconds()).padStart(2, '0'); // Get the seconds, ensure two digits
          this.extras.startedTime = `${hours}:${minutes}:${seconds}`;
          res.startedTime = `${hours}:${minutes}:${seconds}`;
          res.createdAt = formatdate;
          res.message.timeSpent = (currentTime - startInterval).toFixed(2);
          this.isInstructionSkipped = res.message.Skip;

          console.log(this.endTest, 'end when mess received');
          startInterval = Date.now() / 1000;
          this.singleInstructionTimeTotal += Math.ceil(res.message.timeSpent);
          this.resultArr.push(res.message);
          this.testCases.map((item) => {
            item.testCase.map((inst) => {
              console.log(this.testCases);
              if (inst.ins_id === instructionsArr[indexCounter].ins_id) {
                inst.status = res.message.message;
                return this.testCases;
              }
            })
          })
          console.log(this.testCases);

          indexCounter += 1;

        console.log(this.endTest, 'end after mess received');
          if (res?.message?.successMessage) {
            console.log(this.endTest, 'nsglnglsnglsgls');
            this.recursiveInstructions(instructionsArr, indexCounter);

          }
          else {
            console.log(this.endTest, 'endtest2');
            this.endTest = true;
          }
        }
        console.log(this.endTest, 'endtest3');

        if (res?.message?.successMessage === "End Instructions" || this.endTest) {
          console.log('End Instructions', res?.message?.successMessage);
          console.log('endtest', this.endTest);

          this.showWaitLoader = false;
          clearInterval(this.counterInterval);
          clearInterval(startInterval)

          const now = new Date();
          const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

          this.extras.startedTime = formattedTime;
          const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          this.extras.createdAt = formattedDate;

          let passedCount = 0;
          let failedCount = 0;
          let untestedCount = 0;

          this.resultArr?.map((testCase) => {
            testCase.completeCount = this.count;
            if (testCase?.successMessage !== "End_Instructions") {

              if (testCase.message === 'SUCCESS') {
                passedCount++;
              } else if (testCase.message === 'FAILED') {
                failedCount++;
              } else if (testCase.message === 'Untested') {
                untestedCount++;
              }
            }
          });

          const untestedData = instructionsArr.slice(passedCount, instructionsArr.length);

          const socketReport = {
            capabilities: { description: this.myForm.value.description, buildInfo: this.myForm.value.buildNo, ...this.completeAppData },
            resultArr: this.resultArr,
            extras: this.extras,
            totalTimeElapsed: Math.floor(Date.now() / 1000) - this.totalTimeApp,
            // untestedData: untestedData,
            originalData: this.originalData,
          }


          const body = {
            applicationId: localStorage.getItem('app_id'),
            filename: this.templateData?.wt_desc,
            app_version: "2.1",
            totalTestCase: instructionsArr?.length - 1,
            passed: passedCount,
            failed: failedCount,
            untestedCount: untestedCount,
            extra: socketReport,
          }

          this.sendReportData(body);
        }
      })
    }

    else {
      this.currentOnGoingScreen = null;
      return
    }

  }

  endSingleInstruction() {

    let count = 0;

    let passedCount = 0;
    let failedCount = 0;
    let untestedCount = 0;

    setTimeout(() => {
      console.log(this.endTest, 'endtest4');

      this.endTest = true;
    }, 2000)

    this.resultArr?.map((testCase) => {
      testCase.completeCount = count;

      if (testCase?.successMessage !== "End_Instructions") {

        if (testCase.message === 'SUCCESS') {
          passedCount++;
        } else if (testCase.message === 'FAILED') {
          failedCount++;
        } else if (testCase.message === 'Untested') {
          untestedCount++;
        }
      }
    });

    let totalCount = this.templateData.screens.reduce((acc, item) => acc + item.instructions.length, 0);

    const socketReport = {
      capabilities: {
        description: this.description.trim(),
        buildInfo: this.buildNumber.trim(), ...this.completeAppData
      },
      resultArr: this.resultArr,
      extras: this.extras,
      totalTimeElapsed: this.singleInstructionTimeTotal,
      untestedCount: totalCount - passedCount - failedCount,
      originalData: this.originalData,
    }


    const body = {
      applicationId: localStorage.getItem('app_id'),
      app_version: "2.1",
      totalTestCase: totalCount,
      passed: passedCount,
      failed: failedCount,
      crash_count: 0,
      extra: socketReport,
    }


    this.sendReportData(body);

  }

  sendReportData(data) {
    this.accountService.postReportData(data).subscribe((resp) => {
      if (resp) {
        setTimeout(() => {
          this.router.navigateByUrl('pages/test-reports', { state: { reportData: resp } });
        }, 1000)
      }
    })
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

  formatDate(date: Date): string {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  formatTestCaseData() {
    this.isQuickTemplate = this.templateData?.quick;


    let idCounter = 1;
    this.templateData?.screens.map((item) => {
      item?.instructions?.map((inst) => {

        inst.showSingleInstruction = false;
        inst.status = '';
        inst.singleInstLoader = false;



        const exists = this.testCases.some(existingTestCase => existingTestCase.ins_set_id === item.ins_set_id);

        if (!exists) {
          this.testCases.push({
            id: idCounter++,
            ins_set_id: item.ins_set_id,
            ins_set_screen_name: item.ins_set_screen_name,
            hideStart: false,
            testCase: item.instructions
          });
        }
      });
    });

    console.log(this.testCases);

  }

  formatTemplateData() {
    let index = 0;
    this.originalData = this.templateData.screens.map(screen => {
      return screen.instructions.map((instruction) => {

        const newIntruction = {
          id: index,
          screenName: instruction.ins_back_name,
          btnName: instruction.ins_element_name,
          successMessage: `${instruction.ins_name}`,
          failedMessage: `${instruction.ins_name}`,
          roomId: localStorage.getItem("id"),
          moduleName: instruction.ins_set_screen_name,
          ins_id: instruction.ins_id,
        };

        index += 1;
        return newIntruction;
      });
    }).flat();

    console.log(this.originalData);

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
      this.myForm.get('description').enable();
      this.myForm.get('buildNo').enable();

    } else {
      this.myForm.get('platform').disable();
      this.myForm.get('app').disable();
      this.myForm.get('package').disable();
      this.myForm.get('automation').disable();
      this.myForm.get('device').disable();
      this.myForm.get('timeout').disable();
      this.myForm.get('noReset').disable();
      this.myForm.get('hiddenApp').disable();
      this.myForm.get('description').enable();
      this.myForm.get('buildNo').enable();
    }
  }

  appLaunch(id) {
    this.accountService.launchApp({
      capabilities: {
        platformName: "Android",
        app: "/home/codingnebula/Downloads/app-debug-v19.apk",
        appPackage: "com.example.app",
        automationName: "UIAutomator2",
        deviceName: "Samsung",
        noReset: true,
        ignoreHiddenApiPolicyError: true,
        newCommandTimeout: 1200000
      }
    }, id).subscribe(
      (response) => {

        setTimeout(() => {
          this.appLaunchStatus = 'SUCCESS';
          this.appLaunchLoading = false; // After 2 seconds, set it to false to hide the loader
          if (this.isQuickTemplate) {
            this.openEditInstructionDialog();
          }
        }, 7000);

        this.showAppLaunchError = false;
        this.isAppLaunched = true;
        this.isAccordionExpanded = false;
        this.endTest = false;
      },
      (error) => {
        console.error('API Error:', error);

        this.appLaunchLoading = false;
        this.showAppLaunchError = true;
        this.appLaunchStatus = error.error.message;

        setTimeout(() => {
          this.showAppLaunchError = false;
          this.isAccordionExpanded = true;
        }, 2000);
      }
    );
  }

  getCapabilities() {
    const app_id = localStorage.getItem('app_id');
    return this.accountService.getCapabilites(app_id);
  }

  goBack(): void {
    window.history.back();
  }

}
