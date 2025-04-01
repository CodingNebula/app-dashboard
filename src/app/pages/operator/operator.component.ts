import { Component } from '@angular/core';
import * as momentTz from "moment";
import {LoadingService} from "../../shared/services/loading/loading.service";
import {AccountService} from "../../shared/services/account/account.service";
import {NbDialogRef, NbDialogService} from "@nebular/theme";
import {OperatorFormComponent} from "./operator-form/operator-form.component";
import {NoAppDialogComponent} from "../component/no-app-dialog/no-app-dialog.component";

@Component({
  selector: 'ngx-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss']
})
export class OperatorComponent {
  public callData: boolean = true;
  public operators: any = undefined;
  public mobileView: boolean;
  public eventFunc: boolean = true;
  public scrollTop: number = 0;
  public page: number = 1;
  public size = 10;
  public operatorSearch: string = '';
  public scrollDisable: boolean;
  public timezoneSubscriber: any;
  public pageScrolled: boolean = false
  private dialogRef: NbDialogRef<OperatorFormComponent>;

  constructor(public accountService: AccountService, private dialogService: NbDialogService) {

  }

  subscribeToTimezoneChange() {
    // this.timezoneSubscriber = this.timezoneService.timezoneSubject.subscribe((updatedTimezone) => {
    //
    //   if (this.callData) {
    //
    //     this.page = 1;
    //     this.operators = null;
    //     this.fetchOperators();
    //
    //   }
    //
    // })
  }

  ngOnInit() {
  this.fetchOperators();
  //   this.size = Math.round(window.innerHeight * 0.8 / 50);
  //   // this.operators = [];
  //   // if (this.accountService?.getOperatorsSearch()) {
  //   //   this.operatorSearch = this.accountService.getOperatorsSearch();
  //   // }
  //
  //   this.accountService.getScrollSubjectForOperators().subscribe((res: any) => {
  //
  //     if (res?.page) {
  //       this.operators = res.page;
  //       this.callData = false;
  //
  //       setTimeout(() => {
  //         if (document.getElementsByClassName('table-body')[0]) {
  //
  //           this.scrollTop = res.scroll;
  //
  //         }
  //       }, 0)
  //       this.page = res?.pageNo;
  //
  //     }
  //     // if (this.callData) {
  //
  //     //   this.page = 1 || res.pageNo;
  //     //   this.fetchOperators();
  //     //
  //     // }
  //
  //     this.subscribeToTimezoneChange();
  //   });
  //   this.mobileView = false;
  }



  updateScroll(event) {

    const scrollH = event.target.scrollHeight;
    const scrollDist = event.target.scrollTop + window.innerHeight * 0.8;
    if ((scrollH - scrollDist) < 50 && !this.scrollDisable) {
      this.scrollDisable = true;
      if(this.callData){
        this.fetchOperators();
      }

    }
    this.pageScrolled = true
  }

  fetchOperators() {
    // this.loaderService.show();
    this.size = Math.round(window.innerHeight * 0.8 / 10);
    this.eventFunc = false;
    this.accountService.fetchOperator(this.page, this.size, this.operatorSearch.trim()).subscribe((operators) => {


        if (Object.keys(operators).length > 0) {
          console.log(operators);
          // let operatorss = this.jsonModificationService.upperCaseToLowerCase(operators);
          // this.loaderService.hide();
          if (!this.operators) {
            this.operators = [];
          }
          // operators.forEach(operator => {
          //   operator.syncdate = momentTz(operator.syncdate).format('DD-MM-YYYY HH:mm:ss');
          // });
          this.operators = operators;
          this.page++;
          this.scrollDisable = false;
        } else {                       // -------------------isht-------------------- //
          // this.loaderService.hide();
          if (!this.operators) {
            this.operators = [];
          }
        }
        this.eventFunc = true;
        // this.transactionData.push(...showTransaction);
        // this.transactionData.map((res) => {
        //   res.datecreated = moment((res.dateCreated)).format('DD-MM-YYYY HH:mm');
        // });
      },
      err => {
        // this.loaderService.hide();
        this.operators = [];

      },
    );
  }

  searchForOperator(event, keyword?: any) {

    if(keyword !== undefined && keyword.trim() !== ''){
      if (event.target.value === undefined) {
        this.operatorSearch = '';
      } else {
        this.operatorSearch = event.target.value ? event.target.value : keyword;
      }
      this.operators = undefined;
      this.size = 10;
      this.page = 1;
      this.fetchOperators();
    }
  }

  changeOperator(event) {
    const charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8)

      return true;
    else
      return false;
  }

  keyword(event: any) {
    this.operatorSearch = '';
    this.operators = undefined;
    this.page = 1;
    this.fetchOperators()
  }

  // ngOnDestroy() {
  //
  //   if (this.operatorSearch || this.pageScrolled) {
  //     this.accountService.setOperatorsSearch(this.operatorSearch);
  //     this.accountService.setScrollSubjectForOperators({
  //       scroll: document.getElementsByClassName('table-body')[0]?.scrollTop,
  //       page: this.operators,
  //       pageNo: this.page,
  //     });
  //   }
  //
  //   if (this.timezoneSubscriber) {
  //     this.timezoneSubscriber.unsubscribe();
  //   }
  // }
  addOperator(){
    const dialogRef = this.dialogService.open(OperatorFormComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true,
    });

    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {
      this.dialogRef = null;
      if (result) {
        if (result.confirmed) {

          console.log(result.data);
              // const appDetails = {
              //   appName: result.data.application.trim(),
              //   platform: result.data.platform,
              //   test_case_results: null,
              //   extra: {}
              // }

          this.createOperator(result.data);
              // this.saveApplicationData(appDetails);
              // this.applicationDataService.setData('app_details', appDetails);
            }
          }
    });
  }

  createOperator(data){
    this.accountService.addNewOperator(data).subscribe((operator) => {
      console.log(operator);
      // this.operators.push(operator);
      if(operator.status === 200 || operator.status === 201){
      this.fetchOperators();

      }
    })
  }
}
