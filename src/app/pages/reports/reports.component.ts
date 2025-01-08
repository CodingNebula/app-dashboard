import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api/api.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EChartsInstance } from 'echarts';

@Component({
  selector: 'ngx-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  @ViewChild('chartElement', { static: false }) chartElement: any;
  private echartsInstance: EChartsInstance | null = null;

  public CompletionChart: any;

  public currentPage: number = 1;
  public totalItems: number = 460;
  public itemsPerPage: number = 10;
  public totalPages: number;
  public activeBtn = 'All';
  public reports: any;
  public reportData: any = null;
  public pieData: any[] = [];
  public reportHeading: string;
  public platform: any;
  public capabilities: any;
  public searchTerm: string = '';
  public testCases: any;
  public chartData: any = [];
  public extras: any = {};
  constructor(public router: Router, public apiService: ApiService) {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    this.reportHeading = localStorage.getItem('app_name')
    let plaformdata = localStorage.getItem('app_capa')
    this.platform = JSON.parse(plaformdata);

    const state = window.history.state;



  }
  ngOnInit() {
    this.apiService.getAllReports().subscribe((res: any) => {


      res.sort((a, b) => {
        const aDateTime = new Date(`${a.extra.extras?.createdAt}T${a.extra.extras?.startedTime}`);
        const bDateTime = new Date(`${b.extra.extras?.createdAt}T${b.extra.extras?.startedTime}`);

        return bDateTime.getTime() - aDateTime.getTime(); // Sort in ascending order
      });
      console.log(res, 'reports');
      this.reports = res;
      console.log(this.reports, 'reports');
      this.calculatePieChartData();
      this.generatePieData()

    })
  }
  calculatePieChartData() {
    let data = { SUCCESS: 0, FAILURE: 0, UNTESTED: 0 }
    this.reports.map((res) => {
      res['SUCCESS'] = Number(res.testcase_passed);
      res['FAILURE'] = Number(res.testcase_failed);
      res['UNTESTED'] = Number(res.testcase_performed)

    })
    console.log(this.reports, '------>after calculate');
  }
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  async buildReport() {

  }
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  goBack() {
    // this.loc.back();
  }
  btnHandler(value: any) {
    this.activeBtn = value;
  }
  openReportDetail(item, $event) {
    $event.stopPropagation();
    console.log(item,"item");

    this.router.navigateByUrl('pages/test-reports', { state: { reportData: item } });
  }
  onChartInit(instance: EChartsInstance): void {
    console.log(instance, 'ins')
    this.echartsInstance = instance; // Capture the ECharts instance
  }

  // downloadPDF(item, $event: Event) {
  //   // Sample JSON data
  //   const jsonData = [
  //     { name: 'Test User', age: 28, email: 'test@example.com' },
  //     { name: 'Test User1', age: 38, email: 'testUser1@example.com' }

  //   ];
  //   $event.stopPropagation();
  //   const doc = new jsPDF();
  //   // Define the columns based on the keys of the JSON object
  //   const columns = [
  //     { title: 'Name', dataKey: 'name' },
  //     { title: 'Age', dataKey: 'age' },
  //     { title: 'Email', dataKey: 'email' }
  //   ];
  //   // Convert jsonData to the desired format
  //   const convertedData = jsonData.map(item => [item.name,item.age.toString(), item.email]);
  //   // Generate the table using autoTable
  //   autoTable(doc, {
  //     head: [columns],
  //     body: convertedData,
  //     theme: 'grid', // You can set the theme to 'striped', 'grid', or 'plain'
  //     headStyles: {
  //       fillColor: [22, 160, 133], // RGB color for header background
  //       textColor: [255, 255, 255], // RGB color for header text
  //       fontSize: 12,
  //       fontStyle: 'bold'
  //     },
  //     bodyStyles: {
  //       fillColor: [255, 255, 255], // RGB color for body background
  //       textColor: [0, 0, 0], // RGB color for body text
  //       fontSize: 10,
  //     },
  //     alternateRowStyles: {
  //       fillColor: [240, 240, 240] // RGB color for alternate rows
  //     },
  //     margin: { top: 20 }, // Top margin for the table
  //   });

  //   // Save the PDF
  //   doc.save('report.pdf');
  // }
  //   {
  //     "id": "f96c30cf-c653-4f78-b6fc-795d5f51b8a1",
  //     "user_id": "e6135615-48a5-4b5d-a121-af82670e0a92",
  //     "application_version": "2.1",
  //     "testcase_performed": "2",
  //     "testcase_passed": "2",
  //     "testcase_failed": "0",
  //     "extra": {
  //         "extras": {
  //             "createdAt": "2024-12-24",
  //             "timeTaken": 20,
  //             "startedTime": "12:57:39"
  //         },
  //         "resultArr": [
  //             {
  //                 "id": "e6135615-48a5-4b5d-a121-af82670e0a92",
  //                 "info": "Welcome Screen Test Case Passes",
  //                 "message": "SUCCESS",
  //                 "successMessage": "Welcome Text Passed"
  //             },
  //             {
  //                 "id": "e6135615-48a5-4b5d-a121-af82670e0a92",
  //                 "info": "left_arrow image clicked on Screen",
  //                 "message": "SUCCESS",
  //                 "successMessage": "Welcome Next Button Passed"
  //             }
  //         ],
  //         "capabilities": {
  //             "id": "f51e27df-be0f-491c-bafe-bf8e1068fc52",
  //             "extra": {
  //                 "capabilities": {
  //                     "app": "/home/codingnebula/Downloads/app-debug-v12.apk",
  //                     "device": "Samsung",
  //                     "noReset": "True",
  //                     "package": "com.example.app",
  //                     "timeout": 1200000,
  //                     "platform": "Android",
  //                     "hiddenApp": "True",
  //                     "automation": "UIAutomator2"
  //                 }
  //             },
  //             "user_id": "e6135615-48a5-4b5d-a121-af82670e0a92",
  //             "app_name": "Anypay 3.6",
  //             "platform": "Android",
  //             "created_at": "2024-12-23T13:27:19.046Z",
  //             "updated_at": "2024-12-24T07:23:48.632Z",
  //             "test_case_results": null
  //         }
  //     },
  //     "app_name": "Anypay 3.6"
  // }
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

    // this.chartData.push({ name: 'PASSED', value: Number(item.testcase_passed) }, { name: 'FAILED', value: Number(item.testcase_failed)===0?1:0 }, { name: 'UNTESTED', value: Number(item.testcase_performed)-(Number(item.testcase_passed)+Number(item.testcase_failed+1  )) })
    this.chartData.push({ name: 'PASSED', value: Number(item.testcase_passed) }, { name: 'FAILED', value: Number(item.testcase_failed) }, { name: 'UNTESTED', value: Number(item.testcase_performed)-(Number(item.testcase_passed)+Number(item.testcase_failed  )) })
this.chartData.forEach((ele:any,ind)=>{
  if(ele.value===0){
    delete this.chartData[ind];
  }


})
    this.updateCharts();
    $event.stopPropagation();
    setTimeout(()=>{




      const dates = new Date(item.extra?.extras.createdAt || 'N/A');

// Check if 'dates' is a valid Date object
      const formattedDate = dates instanceof Date && !isNaN(dates.getTime())
        ? dates.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).replace(/\//g, ' ') // Replace slashes with a space
        : 'N/A';





      this.capabilities = item?.extra?.capabilities;
      console.log(this.capabilities);
      this.testCases = item?.extra?.resultArr;
      // this.reportData = item?.reporesrtData;
      this.extras = item?.extra?.extras;
      console.log(this.extras);
      console.log(item);

      const doc = new jsPDF();

      // Add report header
      doc.setFontSize(16);
      doc.text(item?.app_name || 'App Name', 14, 20);
      doc.setFontSize(12);
      doc.text(`Created At: ${formattedDate} `, 14, 30);

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
        const xPosition = pageWidth - 140;
        doc.addImage(chartImage, 'PNG', xPosition, 10, 150, 90);

      }
      doc.setFontSize(12);
      doc.text(`Device Name: ${this.capabilities?.extra?.capabilities.device || 'N/A'}`, 14, 50);
      doc.text(`Platform: ${this.capabilities?.extra?.capabilities.platform || 'N/A'}`, 14, 60);
      doc.text(`Started By: John Doe`, 14, 70);
      doc.text(`Started Time: ${formattedDate}, ${item.extra.extras.startedTime}`, 14, 80);
      doc.text(`Total Time Taken: ${ item.extra.totalTimeElapsed ? item.extra.totalTimeElapsed + ' sec' : 'N/A'} `, 14, 90);
      doc.text(`Description: ${item?.extra?.capabilities.description || 'N/A'}`, 14, 100);
      doc.text(`Build Number: ${item?.extra?.capabilities.buildInfo || 'N/A'}`, 14, 110);
      // Add a line break
      doc.text('', 14, 110);
      // Add test cases
      doc.setFontSize(14);
      doc.text('Test Cases', 14, 120);

      console.log(this.testCases);

      // Prepare data for the table
      const testCaseData = this.testCases.map(testCase => ({
        info: testCase.successMessage,
        message: testCase.message,
        expectedResult: testCase.expected_result,
        defect: testCase.status === 'Failed' ? testCase.defect : 'N/A',
        timeSpent: (`${testCase.timeSpent} sec`)
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
  generatePieData(chartData = []) {
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
            data: chartData,

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
