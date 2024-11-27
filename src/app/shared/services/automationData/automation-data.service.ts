import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutomationDataService {
  public selectedApplication: any;
  public selectedTestCase: any;

  constructor() {
  }

  saveSelectedApplication(item: any){
    console.log(item);
    
    this.selectedApplication = item;
  }

  saveSelectedTestCase(item: any){
    console.log(item);
    
    this.selectedTestCase = item;
  }
}
