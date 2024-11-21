import { Component } from '@angular/core';
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
  public data = [
    {
      data: { name: 'Projects', size: '1.8 MB', items: 5, kind: 'dir' },
      children: [
        { data: { name: 'project-1.doc', kind: 'doc', size: '240 KB' } },
        { data: { name: 'project-2.doc', kind: 'doc', size: '290 KB' } },
        {
          data: { name: 'project-3', kind: 'dir', size: '466 KB', items: 3 },
          children: [
            { data: { name: 'project-3A.doc', kind: 'doc', size: '200 KB' } },
            { data: { name: 'project-3B.doc', kind: 'doc', size: '266 KB' } },
            { data: { name: 'project-3C.doc', kind: 'doc', size: '0' } },
          ],
        },
        { data: { name: 'project-4.docx', kind: 'docx', size: '900 KB' } },
      ],
    },
    {
      data: { name: 'Reports', kind: 'dir', size: '400 KB', items: 2 },
      children: [
        {
          data: { name: 'Report 1', kind: 'dir', size: '100 KB', items: 1 },
          children: [
            { data: { name: 'report-1.doc', kind: 'doc', size: '100 KB' } },
          ],
        },
        {
          data: { name: 'Report 2', kind: 'dir', size: '300 KB', items: 2 },
          children: [
            { data: { name: 'report-2.doc', kind: 'doc', size: '290 KB' } },
            { data: { name: 'report-2-note.txt', kind: 'txt', size: '10 KB' } },
          ],
        },
      ],
    },
    {
      data: { name: 'Other', kind: 'dir', size: '109 MB', items: 2 },
      children: [
        { data: { name: 'backup.bkp', kind: 'bkp', size: '107 MB' } },
        { data: { name: 'secret-note.txt', kind: 'txt', size: '2 MB' } },
      ],
    },
  ];

  constructor(private webSocketService: WebsocketService) {
    this.reportData = webSocketService.testReportsData;

    console.log(this.reportData);
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
          data: [
            { value: 335, name: 'CityA' },
            { value: 434, name: 'CityB' },
            { value: 735, name: 'CityC' },
            { value: 510, name: 'CityD' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  ngOnInit(): void {
    // this.createCompletionChart();
  }
  get filteredTestCases() {
    return this.testCases.filter(testCase =>
      testCase.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  // createCompletionChart() {

  // }
}
