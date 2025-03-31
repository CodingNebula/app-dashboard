import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EChartsInstance } from 'echarts';
import { ReportPdfService } from '../../shared/services/reportPdf/report-pdf.service';
import { skip } from 'rxjs/operators';

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
export class TestReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('chartElement', { static: false }) chartElement: any;
  private echartsInstance: EChartsInstance | null = null;

  public chartData: any = [];
  public customColumn = 'name';
  public groupedData: any;
  public defaultColumns = ['size', 'kind', 'items'];
  public allColumns = [this.customColumn, ...this.defaultColumns];
  public CompletionChart: any = null;
  public reportData: any = null;
  public timeTaken: string;
  public pieData: any[] = [];
  public reportHeading: string;
  public platform: any;
  public capabilities: any;
  public timeCreated: string;
  public searchTerm: string = '';
  public testCases: any;
  public extras: any = {};
  public untestedData: any[] = [];
  public skipData: any[] = [];
  public originalData: any[] = [];


  constructor(private webSocketService: WebsocketService, public reportPdfService: ReportPdfService) {

    this.reportHeading = localStorage.getItem('app_name')
    let plaformdata = localStorage.getItem('app_capa')
    this.platform = JSON.parse(plaformdata);

    const state = window.history.state;
    this.capabilities = state?.reportData?.extra?.capabilities;
    this.testCases = state?.reportData?.extra?.resultArr.filter(testCase => testCase.successMessage !== "End_Instructions");
    this.reportData = state?.reportData;
    // this.untestedData = state?.reportData?.extra?.untestedData;
    this.originalData = state?.reportData?.extra?.originalData;
    this.extras = state?.reportData?.extra?.extras;
    console.log(state?.reportData?.extra);
    console.log(state?.reportData);



    this.calculateSkipData();
    this.addScreenNameToTestCases();
    this.generatePie();
  }


  calculateSkipData() {
    console.log(this.testCases);
    let id;


    for (const item of this.testCases) {
      if (!item?.Skip) {  // Check if Skip is false
        id = item?.id;  // Assign the id of the item
        break;  // Break the loop as soon as you find the condition
      }
    }
    console.log(id);  // Log the id to see which one was found

    let lastId = 0;

    if (this.testCases[this.testCases.length - 1]?.ins_id !== "12345") {
      lastId = this.testCases[this.testCases.length - 1]?.id;
    }
    console.log(id);
    console.log(lastId);

    console.log(this.untestedData);
    console.log(this.originalData);



    if (id !== 0) {
      this.skipData = this.originalData.slice(0, id);
    }

    if (id === undefined) {
      this.skipData = this.testCases;
    }

    if (this.skipData) {
      this.skipData?.map((item) => {
        item.type = 'Skip';
      })
    }


    this.untestedData = this.originalData.slice(lastId + 1, this.originalData.length);
    console.log(this.untestedData);


    this.untestedData?.map((item) => {
      item.type = 'Untested';
    })

    let updatedTestCase = this.testCases.slice(id, this.testCases.length);
    console.log(updatedTestCase);

    console.log(this.skipData);

    if (id === undefined) {
      this.testCases = [...this.skipData, ...this.untestedData];
    }
    else {
      this.testCases = [...this.skipData, ...updatedTestCase, ...this.untestedData];
    }
    console.log(this.testCases);


  }
  addScreenNameToTestCases() {
    let storeFirstData: any = null;
    console.log(this.testCases);


    this.groupedData = this.testCases.reduce((acc, ele) => {
      if (!acc[ele?.moduleName]) {
        acc[ele?.moduleName] = [];
      }
      acc[ele?.moduleName].push(ele);
      return acc;
    }, {})

  }
  keepOrder = (a: any, b: any) => {
    return a;
  }

  onChartInit(instance: EChartsInstance): void {
    this.echartsInstance = instance; // Capture the ECharts instance
  }

  ngAfterViewInit(): void {
    this.reportPdfService.onChartInit(this.chartElement.nativeElement);
  }

  ngOnInit() {
    const state = history.state.reportData
    this.timeCreated = state.extra.extras.createdAt
    this.timeTaken = state.extra.totalTimeElapsed;

  }
  convertToHoursMinutesAndSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600); // 1 hour = 3600 seconds
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining seconds converted to minutes
    const seconds = totalSeconds % 60; // Remaining seconds after extracting hours and minutes

    const parts = [];

    if (hours > 0) {
        parts.push(`${hours} hour${hours > 1 ? 's' : ''}`); // Add hours if greater than 0
    }
    if (minutes > 0) {
        parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`); // Add minutes if greater than 0
    }
    if (seconds > 0 || parts.length === 0) { // Always show seconds if no other parts are present
        parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`); // Add seconds if greater than 0 or if no other parts
    }

    return parts.join(', '); // Join the parts with a comma
}

  generateReport(item: any, event: Event): void {
    this.reportPdfService.downloadReportPDF(item, event);
  }


  generatePie() {
    const dataArr = [];
    console.log(this.skipData);
    console.log(this.untestedData);

    let passedCount = this.reportData?.testcase_passed;
    let failedCount = this.reportData?.testcase_failed;
    let untestedCount = this.untestedData;


    dataArr.push({ name: 'SUCCESS', value: passedCount });
    dataArr.push({ name: 'FAILED', value: failedCount });
    dataArr.push({ name: 'SKIP', value: this.skipData.length });
    dataArr.push({ name: 'UNTESTED', value: this.untestedData.length });

    this.pieData = dataArr.sort((a, b) => b.value - a.value);
    console.log(this.pieData);
    

    this.generatePieData();
  }

  generatePieData() {
    const colorPalette = {
      'SUCCESS': '#10EB93',
      'FAILED': '#EE4748',
      'SKIP': '#808080',
      'UNTESTED': '#A64C52',
    };

    // Map the pie data to include color from the colorPalette
    const pieDataWithColors = this.pieData.map((item) => ({
      ...item,
      itemStyle: { color: colorPalette[item.name] } // Map each segment to its specific color
    }));

    setTimeout(() => {
      this.CompletionChart = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        label: {
          show: true,
          fontSize: 7,  // Adjust the font size of the label here
          fontFamily: 'Arial',  // Optional: specify font family
          color: '#333',  // Optional: set color of label text
          fontWeight: 'bold',  // Optional: set font weight

          overflow: 'none',
          bleedMargin: 40

        },
        legend: {
          orient: 'horizontal', // Vertical or horizontal orientation
          bottom: 0,     // Adjust vertical positioning
          textStyle: {
            fontSize: 8,     // Font size for legend text
            color: '#333'     // Color for legend text
          },
          data: this.pieData.map(item => item.name),
        },
        series: [
          {
            type: 'pie',

            radius: '60%', // Decreased radius percentage
            center: ['50%', '50%'],
            selectedMode: false,
            labelLine: {
              show: true,
              length: 1,
            },
            data: pieDataWithColors,

            emphasis: {
              itemStyle: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                borderWidth: 0,
                borderColor: 'transparent',
                cursor: 'default'
              }
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{d}%',
              fontSize: 12,
            },
          }
        ],
        color: Object.values(colorPalette),
      };
    }, 10)
  }

  updateCharts() {

    this.CompletionChart = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      label: {
        show: true,
        fontSize: 7,  // Adjust the font size of the label here
        fontFamily: 'Arial',  // Optional: specify font family
        color: '#333',  // Optional: set color of label text
        fontWeight: 'bold',  // Optional: set font weight

        overflow: 'none',
        bleedMargin: 40

      },
      legend: {
        orient: 'horizontal', // Vertical or horizontal orientation
        bottom: 0,     // Adjust vertical positioning
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
          selectedMode: false,
          labelLine: {
            show: true,
            length: 1,
          },
          data: this.chartData,

          emphasis: {
            itemStyle: {
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0,
              borderColor: 'transparent',
              cursor: 'default'
            }
          },
        }
      ],
      color: ['#10EB93', '#EE4748', '#A64C52'],
    };

    // Immediately update the chart if the ECharts instance exists
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.CompletionChart);

    }

  }




  downloadPDF(item, $event: Event) {
    console.log(item);



    this.reportPdfService.downloadReportPDF(item, $event);


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
  goBack(): void {
    window.history.back();
  }
}
