import { Component, OnInit, ViewChild  } from '@angular/core';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EChartsInstance } from 'echarts';

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
  @ViewChild('chartElement', { static: false }) chartElement: any;
  private echartsInstance: EChartsInstance | null = null;
public chartData:any=[];
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
    this.testCases = state?.reportData?.extra?.resultArr.filter(testCase => testCase.successMessage !== "End_Instructions");   
    this.reportData = state?.reportData;
    this.extras = state?.reportData?.extra?.extras;
    console.log(this.extras);
    console.log(state);

    this.generatePie();
  }

  onChartInit(instance: EChartsInstance): void {
    this.echartsInstance = instance; // Capture the ECharts instance
  }

  generatePie() {
    // Initialize the array to hold the pie chart data
    const dataArr = [];

    // Initialize counters for passed, failed, and untested
    let passedCount = this.reportData?.testcase_passed;
    let failedCount = this.reportData?.testcase_failed;
    let untestedCount = this.reportData?.testcase_performed;

    console.log(this.reportData);
    dataArr.push({ name: 'SUCCESS', value: passedCount });
    dataArr.push({ name: 'FAILED', value: 1 });
    dataArr.push({ name: 'Untested', value: untestedCount - (failedCount+passedCount)});

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
            selectedMode: 'single',
            labelLine: {
              show: true,
              length: 1,
            },
            data: this.pieData,

            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },

            }
          }
        ],
        color: ['#10EB93', '#EE4748', '#A64C52'],
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
          selectedMode: 'single',
          labelLine: {
            show: true,
            length: 1,
          },
          data: this.chartData,

          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },

          }
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
    this.chartData = [];


    this.chartData.push({ name: 'PASSED', value: Number(item.testcase_passed) }, { name: 'FAILED', value: Number(item.testcase_failed)===0?1:0 }, { name: 'UNTESTED', value: Number(item.testcase_performed)-(Number(item.testcase_passed)+Number(item.testcase_failed+1  )) })
this.chartData.forEach((ele:any,ind)=>{
  if(ele.value===0){
    delete this.chartData[ind];
  }
})
    // this.updateCharts();
    $event.stopPropagation();
    setTimeout(()=>{
      this.capabilities = item?.extra?.capabilities;
      console.log(this.capabilities);
      // this.testCases = item?.extra?.resultArr;
      // this.reportData = item?.reportData;
      this.extras = item?.extra?.extras;
      console.log(this.extras);
      console.log(item);
  
      const doc = new jsPDF();
  
      // Add report header
      doc.setFontSize(16);
      doc.text(item?.app_name || 'App Name', 14, 20);
      doc.setFontSize(12);
      doc.text(`Created At: ${this.extras?.createdAt || 'N/A'}`, 14, 30);
  
      // Add device and platform information
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text('Device Information', 14, 40);
      doc.setFont("helvetica", "normal");
      if (this.echartsInstance) {
        console.log(this.echartsInstance, 'INSTANCE')
        // Get chart as Base64 image
        const chartImage = this.echartsInstance.getDataURL({
          type: 'png', // Specify the image format
          pixelRatio: 2, // Higher pixel ratio for better quality
          backgroundColor: '#fff' // Optional: Set a background color
        });
        const pageWidth = doc.internal.pageSize.width;
        const xPosition = pageWidth - 120;
        doc.addImage(chartImage, 'PNG', xPosition, 10, 150, 90);
  
      }
      doc.setFontSize(12);
      doc.text(`Device Name: ${this.capabilities?.extra?.capabilities.device || 'N/A'}`, 14, 50);
      doc.text(`Platform: ${this.capabilities?.extra?.capabilities.platform || 'N/A'}`, 14, 60);
      doc.text(`Started By: John Doe`, 14, 70);
      doc.text(`Started Time: ${this.extras?.startedTime || 'N/A'}`, 14, 80);
      doc.text(`Total Time Taken: ${this.extras?.timeTaken || 'N/A'} Sec`, 14, 90);
      doc.text(`Description: ${this.reportData?.filename || 'N/A'}`, 14, 100);
  
      // Add a line break
      doc.text('', 14, 110);
  
      // Add test cases
      doc.setFontSize(14);
      doc.text('Test Cases', 14, 120);
  
      console.log(this.testCases);
  
      // Prepare data for the table
      const testCaseData = this.testCases.map(testCase => ({
        info: testCase.info,
        message: testCase.message,
        expectedResult: testCase.expected_result,
        defect: testCase.status === 'Failed' ? testCase.defect : 'N/A',
        timeSpent: this.convertMilliseconds(testCase.time_spent)
      }));
  
      // Create the table
      autoTable(doc, {
        head: [['Info', 'Message', 'Expected Result', 'Defect', 'Time Spent']],
        body: testCaseData.map(tc => [
          tc.info,
          tc.message,
          tc.expectedResult,
          tc.defect,
          tc.timeSpent
        ]),
        startY: 130,
        theme: 'grid',
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        margin: { top: 20 },
      });
  
  
  
      // Save the PDF
  
      doc.save('report.pdf');
  
  
    },500)
   

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
