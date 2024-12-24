import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';
export interface TestCase {
  title: string;
  description: string;
  result: string;
  timeSpent: String;
  expectedReult: String;
  Defect: String;
}
@Component({
  selector: 'ngx-test-reports',
  templateUrl: './test-reports.component.html',
  styleUrls: ['./test-reports.component.scss']
})
export class TestReportsComponent {

  public customColumn = 'name';
  public defaultColumns = ['size', 'kind', 'items'];
  public allColumns = [this.customColumn, ...this.defaultColumns];
  public CompletionChart: any = null;
  public reportData: any = null;
  public pieData: any[] = [];
  public reportHeading : string;
  public platform :any;
  public capabilities: any;
  public searchTerm: string = '';
  public testCases: any;
  public extras: any = {};


  constructor(private webSocketService: WebsocketService) {
    
    this.reportHeading = localStorage.getItem('app_name')
    let plaformdata = localStorage.getItem('app_capa')
    this.platform = JSON.parse(plaformdata);

    const state = window.history.state;
    this.capabilities = state?.reportData?.extra?.capabilities;
    console.log(this.capabilities);
    this.testCases = state?.reportData?.extra?.resultArr;
    this.reportData = state?.reportData;
    this.extras = state?.reportData?.extra?.extras;
    console.log(this.extras);
    
  //   {
  //     "reportData": {
  //         "id": "8fe201ee-7c84-409f-808a-f01ea46b6350",
  //         "application_id": "f51e27df-be0f-491c-bafe-bf8e1068fc52",
  //         "user_id": "e6135615-48a5-4b5d-a121-af82670e0a92",
  //         "filename": "Test sale",
  //         "application_version": "2.1",
  //         "testcase_performed": "3",
  //         "testcase_passed": "15",
  //         "testcase_failed": "0",
  //         "crash_count": 0,
  //         "extra": {
  //             "resultArr": [
  //                 {
  //                     "id": "e6135615-48a5-4b5d-a121-af82670e0a92",
  //                     "info": "Welcome Screen Test Case Passes",
  //                     "message": "SUCCESS",
  //                     "successMessage": "Welcome Text Passed"
  //                 },
  //                 {
  //                     "id": "e6135615-48a5-4b5d-a121-af82670e0a92",
  //                     "info": "left_arrow image clicked on Screen",
  //                     "message": "SUCCESS",
  //                     "successMessage": "Welcome Next Button Passed"
  //                 },
  //                 {
  //                     "id": "e6135615-48a5-4b5d-a121-af82670e0a92",
  //                     "successMessage": "End_Instructions"
  //                 }
  //             ],
  //             "capabilities": {
  //                 "id": "f51e27df-be0f-491c-bafe-bf8e1068fc52",
  //                 "extra": {
  //                     "capabilities": {
  //                         "app": "/home/codingnebula/Downloads/app-debug-v12.apk",
  //                         "device": "Samsung",
  //                         "noReset": "True",
  //                         "package": "com.example.app",
  //                         "timeout": 1200000,
  //                         "platform": "Android",
  //                         "hiddenApp": "True",
  //                         "automation": "UIAutomator2"
  //                     }
  //                 },
  //                 "user_id": "e6135615-48a5-4b5d-a121-af82670e0a92",
  //                 "app_name": "Anypay 3.6",
  //                 "platform": "Android",
  //                 "created_at": "2024-12-23T13:27:19.046Z",
  //                 "updated_at": "2024-12-24T05:35:01.869Z",
  //                 "test_case_results": null
  //             }
  //         }
  //     },
  //     "navigationId": 9
  // }
    console.log(state);
    

    // this.CompletionChart = {
    //   tooltip: {
    //     trigger: 'item',
    //     formatter: '{a} <br/>{b} : {c} ({d}%)'
    //   },
    //   legend: {
    //     orient: 'vertical', // Vertical or horizontal orientation
    //     right: 'right',       // Position of the legend: 'left', 'right', 'center', or specific px/% values
    //     top: 'middle',      // Adjust vertical positioning
    //     textStyle: {
    //       fontSize: 10,     // Font size for legend text
    //       color: '#333'     // Color for legend text
    //     }
    //   },
    //   series: [
    //     {
    //       type: 'pie',
    //       radius: '60%', // Decreased radius percentage
    //       center: ['50%', '50%'],
    //       selectedMode: 'single',
    //       data: this.pieData,
    //       emphasis: {
    //         itemStyle: {
    //           shadowBlur: 10,
    //           shadowOffsetX: 0,
    //           shadowColor: 'rgba(0, 0, 0, 0.5)'
    //         }
    //       }
    //     }
    //   ]
    // };

    this.generatePie();
  }

  generatePie() {
    // Initialize the array to hold the pie chart data
    const dataArr = [];

    // Initialize counters for passed, failed, and untested
    let passedCount = this.reportData?.testcase_passed;
    let failedCount = this.reportData?.testcase_failed;
    let untestedCount = this.reportData?.crash_count;

    console.log(this.reportData);


    

    dataArr.push({ name: 'SUCCESS', value: passedCount });
    dataArr.push({ name: 'FAILED', value: failedCount });
    dataArr.push({ name: 'Untested', value: untestedCount });

    this.pieData = dataArr

    this.generatePieData();
  }

  generatePieData(){

    setTimeout(() => {
      this.CompletionChart = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical', // Vertical or horizontal orientation
          right: 'right',       // Position of the legend: 'left', 'right', 'center', or specific px/% values
          top: 'middle',      // Adjust vertical positioning
          textStyle: {
            fontSize: 10,     // Font size for legend text
            color: '#333'     // Color for legend text
          }
        },
        series: [
          {
            type: 'pie',
            radius: '60%', // Decreased radius percentage
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#10EB93', '#EE4748', '#A64C52'],
      };
    }, 10)
  }


  // ngOnInit(): void {
  //   // this.createCompletionChart();
  // }

  convertMilliseconds(milliseconds: number): string {
    const hours = Math.floor(milliseconds / 3600000); // Total hours
    const minutes = Math.floor((milliseconds % 3600000) / 60000); // Total minutes
    const remainingSeconds = (milliseconds % 60000) / 1000; // Remaining seconds with fractional part

    let timeString = '';

    if (hours > 0) {
      timeString += `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    if (minutes > 0) {
      if (timeString) timeString += ', '; // Add a comma if hours were added
      timeString += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    if (remainingSeconds > 0 || timeString === '') {
      if (timeString) timeString += ', '; // Add a comma if hours or minutes were added
      timeString += `${remainingSeconds.toFixed(1)} second${remainingSeconds !== 1 ? 's' : ''}`; // Use fractional seconds
    }

    return timeString;
  }
}
