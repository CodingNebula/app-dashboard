import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditDeleteService {

  public testCaseDeleteSubject = new Subject<any>();;
  constructor() { }


  getTestCaseDeleteSubject(){
    return this.testCaseDeleteSubject;
  }

  setTestCaseDeleteSubject(item){
    console.log(item);
    
    this.testCaseDeleteSubject.next(item);
  }

  

}
