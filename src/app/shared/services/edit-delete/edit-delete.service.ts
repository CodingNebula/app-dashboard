import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditDeleteService {

  public testCaseDeleteSubject = new Subject<any>();
  public templateDeleteSubject = new Subject<any>();
  constructor() { }


  getTestCaseDeleteSubject(){
    return this.testCaseDeleteSubject;
  }

  setTestCaseDeleteSubject(item){
    this.testCaseDeleteSubject.next(item);
  }

  getTemplateDeleteSubject(){
    return this.templateDeleteSubject;
  }

  setTemplateDeleteSubject(item){
    this.templateDeleteSubject.next(item);
  }

  

}
