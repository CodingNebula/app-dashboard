import { Component, OnInit, ViewChild } from '@angular/core';
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
export class TestReportsComponent implements OnInit {
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

    // this.testCases.map((item) => {
    //   if(!item?.Skip){
    //     id = item?.id;
    //     break;
    //   }
    // })

    for (const item of this.testCases) {
      if (!item?.Skip) {  // Check if Skip is false
        id = item?.id;  // Assign the id of the item
        break;  // Break the loop as soon as you find the condition
      }
    }
    console.log(id);  // Log the id to see which one was found

    // const id = this.testCases[0]?.id;
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
      // this.skipData = this.originalData?.slice(0, 5);
    }

    if (id === undefined) {
      this.skipData = this.testCases;
    }

    if (this.skipData) {
      this.skipData?.map((item) => {
        // item.message = 'Skip'
        item.type = 'Skip';
      })
    }

    // if()

    this.untestedData = this.originalData.slice(lastId + 1, this.originalData.length);
    console.log(this.untestedData);


    this.untestedData?.map((item) => {
      // item.message = 'Untested'
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
    // for(let i=0;i<this.testCases.length;i++){
    //   if(storeFirstData?.moduleName===this.testCases[i].moduleName){
    //     this.testCases[i].continue=true;
    //   }
    //   else{
    //     storeFirstData=this.testCases[i];
    //   }
    //   if(!storeFirstData?.screens){
    //     storeFirstData.screens=[];
    //   }
    //   storeFirstData.screens.push(this.testCases[i]);
    // }
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
    // Make sure the DOM is fully loaded before accessing the chart element
    this.reportPdfService.onChartInit(this.chartElement.nativeElement);
  }

  ngOnInit() {
    const state = history.state.reportData
    this.timeCreated = state.extra.extras.createdAt
    this.timeTaken = state.extra.totalTimeElapsed;

  }
  convertToSeconds(ms) {
    const minutes = Math.floor(ms / 600000); // 1 minute = 60000 milliseconds
    const seconds = ((ms % 60000) / 1000).toFixed(0); // remainder of milliseconds for seconds
    return `${minutes} minutes and ${seconds} seconds`;
  }

  generateReport(item: any, event: Event): void {
    this.reportPdfService.downloadReportPDF(item, event);
  }


  generatePie() {
    // Initialize the array to hold the pie chart data
    const dataArr = [];
    console.log(this.skipData);
    console.log(this.untestedData);



    // Initialize counters for passed, failed, and untested
    let passedCount = this.reportData?.testcase_passed;
    let failedCount = this.reportData?.testcase_failed;
    let untestedCount = this.untestedData;


    dataArr.push({ name: 'SUCCESS', value: passedCount });
    dataArr.push({ name: 'FAILED', value: failedCount });
    dataArr.push({ name: 'SKIP', value: this.skipData.length });
    dataArr.push({ name: 'UNTESTED', value: this.untestedData.length });

    this.pieData = dataArr

    this.generatePieData();
  }

  generatePieData() {

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
            data: this.pieData,

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
        color: [' #10EB93', ' #EE4748', ' #808080', ' #A64C52'],
      };
    }, 10)
  }

  updateCharts() {

    // Update the chart options with the new data

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

    //     this.chartData = [];
    //     this.testCases = this.testCases.filter(test => test.hasOwnProperty('info'));

    //     this.chartData.push({ name: 'PASSED', value: Number(item.testcase_passed) }, { name: 'FAILED', value: Number(item.testcase_failed) === 0 ? 1 : 0 }, { name: 'UNTESTED', value: Number(item.testcase_performed) - (Number(item.testcase_passed) + Number(item.testcase_failed + 1)) })
    //     this.chartData.forEach((ele: any, ind) => {
    //       if (ele.value === 0) {
    //         delete this.chartData[ind];
    //       }
    //     })
    //     // this.updateCharts();
    //     $event.stopPropagation();
    //     setTimeout(() => {
    //       this.capabilities = item?.extra?.capabilities;
    //       // this.testCases = item?.extra?.resultArr;
    //       // this.reportData = item?.reportData;
    //       this.extras = item?.extra?.extras;

    //       const dates = new Date(this.reportData?.extra?.extras.createdAt || 'N/A');

    // // Check if 'dates' is a valid Date object
    //       const formattedDate = dates instanceof Date && !isNaN(dates.getTime())
    //         ? dates.toLocaleDateString('en-GB', {
    //           day: '2-digit',
    //           month: 'short',
    //           year: 'numeric'
    //         }).replace(/\//g, ' ') // Replace slashes with a space
    //         : 'N/A';

    //       const doc = new jsPDF();

    //       // Add report header
    //       doc.setFontSize(16);
    //       doc.setFont("helvetica", "bold");
    //       doc.text(this.capabilities?.app_name || 'App Name', 14, 20);
    //       doc.setFontSize(12);
    //       doc.setFont("helvetica", "normal");
    //       doc.text(`Created At: ${formattedDate}`, 14, 30);

    //       // Add device and platform information
    //       doc.setFontSize(14);
    //       doc.setFont("helvetica", "bold");
    //       doc.text('Device Information :- ', 14, 40);
    //       doc.setFont("helvetica", "normal");
    //       if (this.echartsInstance) {
    //         // Get chart as Base64 image
    //         const chartImage = this.echartsInstance.getDataURL({
    //           type: 'png', // Specify the image format
    //           pixelRatio: 2, // Higher pixel ratio for better quality
    //           backgroundColor: '#fff' // Optional: Set a background color
    //         });
    //         const pageWidth = doc.internal.pageSize.width;
    //         const xPosition = pageWidth - 140;
    //         doc.addImage(chartImage, 'PNG', xPosition, 10, 150, 90);

    //       }
    //       doc.setFontSize(12);
    //       doc.text(`Device Name: ${this.capabilities?.extra?.capabilities.device || 'N/A'}`, 14, 50);
    //       doc.text(`Platform: ${this.capabilities?.extra?.capabilities.platform || 'N/A'}`, 14, 60);
    //       doc.text(`Started By: John Doe`, 14, 70);
    //       doc.text(`Started Time: ${formattedDate}, ${this.reportData?.extra?.extras?.startedTime}`, 14, 80);
    //       doc.text(`Total Time Taken: ${this.timeTaken ? this.timeTaken + ' sec' : 'N/A'}`, 14, 90);
    //       doc.text(`Description: ${this.reportData?.extra?.capabilities.description || 'N/A'}`, 14, 100);
    //       doc.text(`Build Number: ${item?.extra?.capabilities.buildInfo || 'N/A'}`, 14, 110);
    //       // Add a line break
    //       doc.text('', 14, 110);

    //       // Add test cases
    //       doc.setFontSize(14);
    //       doc.text('Test Cases', 14, 125);


    //       // Prepare data for the table
    //       const testCaseData = this.testCases.map(testCase => ({
    //         info: testCase.successMessage,
    //         message: testCase.message,
    //         expectedResult: testCase.expected_result,
    //         defect: testCase.status === 'Failed' ? testCase.defect : 'N/A',
    //         timeSpent: (`${testCase.timeSpent} sec`)
    //       }));

    //       // Create the table
    //       autoTable(doc, {
    //         head: [['Info', 'Message', 'Expected Result', 'Defect', 'Time Spent']],
    //         body: testCaseData.map(tc => [
    //           tc.info,
    //           tc.message,
    //           tc.expectedResult,
    //           tc.defect,
    //           tc.timeSpent
    //         ]),
    //         startY: 130,
    //         theme: 'grid',
    //         headStyles: {
    //           fillColor: [22, 160, 133],
    //           textColor: [255, 255, 255],
    //           fontSize: 12,
    //           fontStyle: 'bold'
    //         },
    //         bodyStyles: {
    //           fillColor: [255, 255, 255],
    //           textColor: [0, 0, 0],
    //           fontSize: 10,
    //         },
    //         alternateRowStyles: {
    //           fillColor: [240, 240, 240]
    //         },
    //         margin: { top: 20 },
    //       });



    //       // Save the PDF

    //       doc.save('report.pdf');


    //     }, 500)


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
