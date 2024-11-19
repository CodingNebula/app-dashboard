import { Component } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  template: `
  <ngx-login-column-layout>
    <router-outlet></router-outlet>
  </ngx-login-column-layout>
  `,
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  constructor(){
    
  }
}
