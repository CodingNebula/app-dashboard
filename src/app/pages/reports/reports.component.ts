import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api/api.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EChartsInstance } from 'echarts';
import { ReportPdfService } from '../../shared/services/reportPdf/report-pdf.service';

@Component({
  selector: 'ngx-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {

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
  constructor(public router: Router, public apiService: ApiService, public reportPdfService: ReportPdfService) {
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
      this.reports = res;

      console.log(this.reports);
      
      this.calculatePieChartData();
      this.generatePieData()

    })
  }

  ngAfterViewInit(): void {
    // Make sure the DOM is fully loaded before accessing the chart element
    this.reportPdfService.onChartInit(this.chartElement.nativeElement);
  }

  // This method can be used to call the download PDF logic
  generateReport(item: any, event: Event): void {
    this.reportPdfService.downloadReportPDF(item, event);
  }

  calculatePieChartData() {
    let data = { SUCCESS: 0, FAILURE: 0, UNTESTED: 0 }
    this.reports.map((res) => {
      res['SUCCESS'] = Number(res.testcase_passed);
      res['FAILURE'] = Number(res.testcase_failed);
      res['UNTESTED'] = Number(res.testcase_performed)

    })
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

    this.router.navigateByUrl('pages/test-reports', { state: { reportData: item } });
  }
  onChartInit(instance: EChartsInstance): void {
    this.echartsInstance = instance; // Capture the ECharts instance
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

          },
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%'
          },
        }
      ],
      color: ['#10EB93', '#EE4748', '#A64C52'],
    };

    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.CompletionChart);

    }

  }
  downloadPDF(item, $event: Event) {
    this.reportPdfService.downloadReportPDF(item, $event);
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
