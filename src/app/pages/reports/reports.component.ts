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
  public reports: any;
  constructor(public router: Router, public apiService: ApiService) {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

  }
  ngOnInit() {
    this.apiService.getAllReports().subscribe((res: any) => {
      this.reports = res;
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
    $event.stopPropagation();
    this.router.navigateByUrl('pages/test-reports')
  }
  downloadPDF($event: Event) {
    // Sample JSON data
    const jsonData = [
      { name: 'Test User', age: 28, email: 'test@example.com' },
      { name: 'Test User1', age: 38, email: 'testUser1@example.com' }

    ];
    $event.stopPropagation();
    const doc = new jsPDF();
    // Define the columns based on the keys of the JSON object
    const columns = [
      { title: 'Name', dataKey: 'name' },
      { title: 'Age', dataKey: 'age' },
      { title: 'Email', dataKey: 'email' }
    ];
    // Convert jsonData to the desired format
    const convertedData = jsonData.map(item => [item.name,item.age.toString(), item.email]);
    // Generate the table using autoTable
    autoTable(doc, {
      head: [columns],
      body: convertedData,
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
    doc.save('report.pdf');
  }

}
