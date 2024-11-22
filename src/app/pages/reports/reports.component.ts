import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api/api.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'ngx-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  public currentPage: number = 1;
  public totalItems: number = 460;
  public itemsPerPage: number = 10;
  public totalPages: number;
  public activeBtn = 'All';
  public reports:any;
  constructor(public router: Router, public apiService: ApiService) {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

  }
  ngOnInit() {
    this.apiService.getAllReports().subscribe((res: any) => {
      this.reports=res;
      console.log(res, 'result')
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
  openReportDetail($event: Event) {
    console.log($event, 'event')
    $event.stopPropagation();
    this.router.navigateByUrl('pages/test-reports')
  }
  downloadPDF($event: Event) {
    // Sample JSON data
    const jsonData = [
      { name: 'Test User', age: 28, email: 'test@example.com' }

    ];
    console.log($event, 'event')
    $event.stopPropagation();
    const doc = new jsPDF();
      // Define the columns based on the keys of the JSON object
    const columns = [
      { title: 'Name', dataKey: 'name' },
      { title: 'Age', dataKey: 'age' },
      { title: 'Email', dataKey: 'email' }
    ];
    console.log(columns,jsonData)
      // Generate the table using autoTable
      autoTable(doc, {
        head: [columns],
        body: [
          ['David', 'david@example.com', 'Sweden'],
          ['Castille', 'castille@example.com', 'Spain'],
        ],
        theme: 'grid', // You can set the theme to 'striped', 'grid', or 'plain'
        headStyles: {
          fillColor: [22, 160, 133], // RGB color for header background
          textColor: [255, 255, 255], // RGB color for header text
          fontSize: 12,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fillColor: [255, 255, 255], // RGB color for body background
          textColor: [0, 0, 0], // RGB color for body text
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240] // RGB color for alternate rows
        },
        margin: { top: 20 }, // Top margin for the table
      });
  
      // Save the PDF
      doc.save('table.pdf');
  }

}
