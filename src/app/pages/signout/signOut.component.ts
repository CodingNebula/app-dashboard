import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RoutesRecognized} from '@angular/router';
// import {StorageService} from '../../shared/services/storage/storage.service';
// import {WebsocketService} from '../../shared/services/webosocket/websocket.service';
import {FilterModelComponent} from './filter-model/filter-model.component';
import {NbDialogRef, NbDialogService, NbMenuService} from '@nebular/theme';
import {Location} from "@angular/common";
import {filter, pairwise} from "rxjs/operators";
import {AccountService} from "../../shared/services/account/account.service";
import { WebsocketService } from '../../shared/services/websocket/websocket.service';

@Component({
  template: `
  `,
})
export class SignOutComponent implements OnInit,OnDestroy{
  public currentUrl:string;
  public previousUrl:any=null;
  public dialog:NbDialogRef<any>;
  constructor(
    public route:Router,
    public location: Location, 
    // public storage: StorageService, 
    private dialogService: NbDialogService, 
    public router: Router, 
    public websocketService: WebsocketService, 
    public nbMenuService: NbMenuService,
    private accountService:AccountService) {
    /*this.dialogService.open(FilterModelComponent)
      .onClose.subscribe(name => {
    });*/
    if(!this.router.getCurrentNavigation().previousNavigation?.finalUrl.toString().includes('signout')){
      this.previousUrl = this.router.getCurrentNavigation().previousNavigation?.finalUrl.toString();

    }
    else{
      this.previousUrl='pages/transaction-history'
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Access the upcoming route
        const upcomingRoute = event.url;
        if (upcomingRoute === 'transaction-history'){
          // const creds = this.storage.getCreds();
          //console.log('Upcoming Route:', upcomingRoute);
          //console.log('creeesds:', creds);
        }
      }});

  this.dialog = this.dialogService.open(FilterModelComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true,
    });
    this.dialog.onClose.subscribe(data => {
     if (data === 'cancel') {
       let prevUrl=this.location.back();

       // window.history.back();
       // const previousNavigation = this.router.getCurrentNavigation();
       // //console.log(previousNavigation)
     } else if (data === 'submit') {
      //  this.storage.getAuthenticationTokenClear();
       this.websocketService.disconnectSocket();
       // this.accountService.gethandleSubscriptions().map((res)=>{
       //   res?.unsubscribe();
       // })
//console.log(this.previousUrl,'prevurl')
       this.router.navigate(['auth/login']);
     } else {
       window.history.back();
     }
    });

    this.nbMenuService.onItemClick().subscribe(item => {
      this.dialog.close();
    });
  }

  ngOnInit() {
    //console.log('fireeed')
    this.location.replaceState('/auth/login');

  }
ngOnDestroy(){

      this.dialog?.close();

}
}
