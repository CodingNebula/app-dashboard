import { Component } from '@angular/core';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';

@Component({
  selector: 'ngx-test-reports',
  templateUrl: './test-reports.component.html',
  styleUrls: ['./test-reports.component.scss']
})
export class TestReportsComponent {

  public customColumn = 'name';
  public defaultColumns = [ 'size', 'kind', 'items' ];
  public allColumns = [ this.customColumn, ...this.defaultColumns ];
  public completionChart: any = null;
  public reportData: any = null;

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

constructor(private webSocketService: WebsocketService){
  this.reportData = webSocketService.testReportsData;

  console.log(this.reportData);
  
}

ngOnInit(): void {
this.createCompletionChart();
}

createCompletionChart(){
  this.completionChart = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  };
}
}
