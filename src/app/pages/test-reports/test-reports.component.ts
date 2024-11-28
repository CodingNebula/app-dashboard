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


  public searchTerm: string = '';
  public testCases: TestCase[] = [
    {
      title: 'Test Case 1', expectedReult: '', Defect: '', timeSpent: '00:00:05', description: 'Description of Test Case 1', result: 'Passed'
    },
    {
      title: 'Test Case 2', expectedReult: '', Defect: '', timeSpent: '00:00:15', description: 'Description of Test Case 2', result: 'Failed'
    },
    {
      title: 'Test Case 3', expectedReult: '', Defect: '', timeSpent: '00:00:08', description: 'Description of Test Case 3', result: 'Passed'
    },
    {
      title: 'Test Case 4', expectedReult: '', Defect: '', timeSpent: '00:00:10', description: 'Description of Test Case 4', result: 'Failed'
    },
    ,
    {
      title: 'Test Case 4', expectedReult: '', Defect: '', timeSpent: '00:00:10', description: 'Description of Test Case 4', result: 'Failed'
    }
    ,
    {
      title: 'Test Case 4', expectedReult: '', Defect: '', timeSpent: '00:00:10', description: 'Description of Test Case 4', result: 'Failed'
    }
    ,
    {
      title: 'Test Case 4', expectedReult: '', Defect: '', timeSpent: '00:00:10', description: 'Description of Test Case 4', result: 'Failed'
    }
    ,
    {
      title: 'Test Case 4', expectedReult: '', Defect: '', timeSpent: '00:00:10', description: 'Description of Test Case 4', result: 'Failed'
    }

    // Add more test cases as needed
  ];


  constructor(private webSocketService: WebsocketService) {
    this.reportData = webSocketService.testReportsData;

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
    let passedCount = 0;
    let failedCount = 0;
    let untestedCount = 0;
  
    // Iterate over the reports to count the number of passed, failed, and untested test cases
    this.reportData?.reports.map((testCase) => {
      if (testCase.status === 'Passed') {
        passedCount++;
      } else if (testCase.status === 'Failed') {
        failedCount++;
      } else if (testCase.status === 'Untested') {
        untestedCount++;
      }
    });
  
    dataArr.push({ name: 'Passed', value: passedCount });
    dataArr.push({ name: 'Failed', value: failedCount });
    dataArr.push({ name: 'Untested', value: untestedCount });
  
    this.pieData = dataArr

    this.generatePieData();
  }

  generatePieData(){
    setTimeout(() => {
      this.CompletionChart = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
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
  get filteredTestCases() {
    return this.testCases.filter(testCase =>
      testCase.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
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
