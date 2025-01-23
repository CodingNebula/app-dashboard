import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import {WebsocketService} from "../shared/services/websocket/websocket.service";

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <nb-alert status="success">
        You have been successfully authenticated!
      </nb-alert>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  public showAlert = false;
  constructor(public webSocketService: WebsocketService) {
    let dataToken = localStorage.getItem('accessToken');
    this.webSocketService.socketConnect(dataToken);
  this.showAlert = this.webSocketService.showAlert
  }
  menu = MENU_ITEMS;

}
