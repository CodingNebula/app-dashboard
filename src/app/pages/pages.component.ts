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
  constructor(public ws: WebsocketService) {
  this.showAlert = this.ws.showAlert
  }
  menu = MENU_ITEMS;
}
