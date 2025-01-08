import { Injectable } from '@angular/core';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDataService {
  private formData: any = {};

  constructor(public accountService: AccountService) { }


  setData(type: string, data: any): void {
    this.formData[type] = data;
    
  }

  getData(): any {
    return this.formData;
  }

  clearData(): void {
    this.formData = {};
  }

  getApplicationData(){
    // const app_id = localStorage.getItem('app_id');
    // this.accountService.getInstruction(app_id).subscribe((data) => {
    //   if (data && data.length > 0) {
    //     this.applicationDataArr = data;
    //   }
    // })
  }
}
