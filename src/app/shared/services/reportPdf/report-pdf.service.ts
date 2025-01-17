import { Injectable, ViewChild } from '@angular/core';
import { EChartsInstance } from 'echarts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ReportPdfService {

  @ViewChild('chartElement', { static: false }) chartElement: any;
  private echartsInstance: EChartsInstance | null = null;
  public CompletionChart: any;
  public chartData: any = [];
  public capabilities: any;
  public searchTerm: string = '';
  public testCases: any;
  public extras: any = {};
  public untestedData: any[] = [];
  public skipData: any[] = [];
  public originalData: any[] = [];

  constructor() { }

  onChartInit(chartElement: HTMLElement): void {
    if (typeof window !== 'undefined' && window.echarts) {
      this.echartsInstance = window.echarts.init(chartElement);
    }
  }
  updateCharts(chartData: any): void {
    if (this.echartsInstance) {
      this.chartData = chartData;
      this.echartsInstance.setOption({
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

            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b} : {c} ({d}%)'
            },
          }
        ],
        color: [' #10EB93', ' #EE4748', ' #808080', ' #A64C52'],
      });
    }
  }

  downloadReportPDF(item, $event: Event) {
    console.log(item);

    this.capabilities = item?.extra?.capabilities;
    this.testCases = item?.extra?.resultArr;
    this.extras = item?.extra?.extras;
    this.originalData = item?.extra?.originalData;

    console.log(this.originalData);

    console.log(this.testCases);
    const id = this.testCases[0]?.id;
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

    if (this.skipData) {
      this.skipData?.map((item) => {
        // item.message = 'Skip'
        item.message = 'Skip';
        item.timeSpent = 0;
      })
    }

    // if()

    this.untestedData = this.originalData.slice(lastId + 1, this.originalData.length - 1);

    this.untestedData?.map((item) => {
      // item.message = 'Untested'
      item.message = 'Untested';
      item.timeSpent = 0;
    })

    console.log(this.skipData);

    this.testCases = [...this.skipData, ...this.testCases, ...this.untestedData];

    console.log(this.testCases);


    this.chartData = [];

    // dataArr.push({ name: 'SUCCESS', value: passedCount });
    // dataArr.push({ name: 'FAILED', value: failedCount });
    // dataArr.push({ name: 'SKIP', value: this.skipData.length });
    // dataArr.push({ name: 'UNTESTED', value: this.untestedData.length });

    console.log(this.skipData);
    console.log(this.untestedData);
    
    

    this.chartData.push(
      { name: 'SUCCESS', value: Number(item.testcase_passed) },
      { name: 'FAILED', value: Number(item.testcase_failed) },
      { name: 'SKIP', value: Number(this.skipData.length) },
      { name: 'UNTESTED', value: Number(this.untestedData.length) }
      // { name: 'UNTESTED', value: Number(item.testcase_performed) - (Number(item.testcase_passed) + Number(item.testcase_failed)) 

    )

    
    this.echartsInstance?.on('finished', () => {
      this.generatePDF(item);
    });
    
    this.generatePieData(this.chartData);
    $event.stopPropagation();
  }

  generatePDF(item) {

    const dates = new Date(item.extra?.extras.createdAt || 'N/A');

    const formattedDate = dates instanceof Date && !isNaN(dates.getTime())
      ? dates.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/\//g, ' ') // Replace slashes with a space
      : 'N/A';

    // this.capabilities = item?.extra?.capabilities;
    // this.testCases = item?.extra?.resultArr;
    // this.extras = item?.extra?.extras;
    // this.originalData = item?.extra?.originalData;

    // console.log(this.originalData);

    // console.log(this.testCases);
    // const id = this.testCases[0]?.id;
    // let lastId = 0;

    // if (this.testCases[this.testCases.length - 1]?.ins_id !== "12345") {
    //   lastId = this.testCases[this.testCases.length - 1]?.id;
    // }
    // console.log(id);
    // console.log(lastId);

    // console.log(this.untestedData);
    // console.log(this.originalData);



    // if (id !== 0) {
    //   this.skipData = this.originalData.slice(0, id);
    //   // this.skipData = this.originalData?.slice(0, 5);
    // }

    // if (this.skipData) {
    //   this.skipData?.map((item) => {
    //     // item.message = 'Skip'
    //     item.message = 'Skip';
    //     item.timeSpent = 0;
    //   })
    // }

    // // if()

    // this.untestedData = this.originalData.slice(lastId + 1, this.originalData.length - 1);

    // this.untestedData?.map((item) => {
    //   // item.message = 'Untested'
    //   item.message = 'Untested';
    //   item.timeSpent = 0;
    // })

    // console.log(this.skipData);

    // this.testCases = [...this.skipData, ...this.testCases, ...this.untestedData];

    // console.log(this.testCases);



    const doc = new jsPDF();

    // Add report header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(item?.app_name || 'App Name', 14, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Created At: ${formattedDate} `, 14, 30);

    // Add device and platform information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('Device Information :- ', 14, 40);
    doc.setFont("helvetica", "normal");

    const chartImage = this.echartsInstance.getDataURL({
      type: 'png', // Specify the image format
      pixelRatio: 2, // Higher pixel ratio for better quality
      backgroundColor: '#fff' // Optional: Set a background color
    });

    const pageWidth = doc.internal.pageSize.width;
    const xPosition = pageWidth - 140;
    doc.addImage(chartImage, 'PNG', xPosition, 10, 150, 90);

    // }
    doc.setFontSize(12);
    doc.text(`Device Name: ${this.capabilities?.extra?.capabilities.device || 'N/A'}`, 14, 50);
    doc.text(`Platform: ${this.capabilities?.extra?.capabilities.platform || 'N/A'}`, 14, 60);
    doc.text(`Started By: John Doe`, 14, 70);
    doc.text(`Started Time: ${formattedDate}, ${item.extra.extras.startedTime}`, 14, 80);
    doc.text(`Total Time Taken: ${item.extra.totalTimeElapsed ? item.extra.totalTimeElapsed + ' sec' : 'N/A'} `, 14, 90);
    doc.text(`Description: ${item?.extra?.capabilities.description || 'N/A'}`, 14, 100);
    doc.text(`Build Number: ${item?.extra?.capabilities.buildInfo || 'N/A'}`, 14, 110);
    // Add a line break
    doc.text('', 14, 110);
    // Add test cases
    doc.setFontSize(14);
    doc.text('Test Cases', 14, 125);


    // Prepare data for the table
    const testCaseData = this.testCases.map(testCase => ({
      info: testCase.successMessage || testCase.failedMessage,
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

    doc.save('report.pdf');

  }


  generatePieData(chartData: any) {
    if (this.echartsInstance) {
      this.updateCharts(chartData);
    }
  }
}
