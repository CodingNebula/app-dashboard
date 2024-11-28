import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDataService {
  private formData: any = {};

  constructor() { }


  setData(type: string, data: any): void {
    this.formData[type] = data;
  }

  getData(): any {
    return this.formData;
  }

  clearData(): void {
    this.formData = {};
  }
}
