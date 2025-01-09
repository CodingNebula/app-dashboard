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
              position: 'inside',
              formatter: '{c} ({d}%)'
            },
          }
        ],
        color: ['#10EB93', '#EE4748', '#A64C52'],
      });
    }
  }

  downloadReportPDF(item, $event: Event) {

    this.chartData = [];

    this.chartData.push({
      name: 'SUCCESS', value: Number(item.testcase_passed)
    },
      { name: 'FAILED', value: Number(item.testcase_failed) },
      { name: 'UNTESTED', value: Number(item.testcase_performed) - (Number(item.testcase_passed) + Number(item.testcase_failed)) })
    
    this.generatePieData(this.chartData);
    $event.stopPropagation();
    setTimeout(() => {
      if(this.echartsInstance){
        
      const dates = new Date(item.extra?.extras.createdAt || 'N/A');

      const formattedDate = dates instanceof Date && !isNaN(dates.getTime())
        ? dates.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).replace(/\//g, ' ') // Replace slashes with a space
        : 'N/A';





      this.capabilities = item?.extra?.capabilities;
      this.testCases = item?.extra?.resultArr;
      this.extras = item?.extra?.extras;

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

      doc.save('report.pdf');
    }

    }, 500)


  }


  generatePieData(chartData: any) {
    if (this.echartsInstance) {
      this.updateCharts(chartData);
    }
  }
}
