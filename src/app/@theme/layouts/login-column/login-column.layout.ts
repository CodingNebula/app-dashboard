import { Component } from '@angular/core';

@Component({
  selector: 'ngx-login-column-layout',
  styleUrls: ['./login-column.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-column class="p-0">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class LoginColumnLayoutComponent {}
