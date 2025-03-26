import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout class="layout-section">
      <nb-layout-header class="header-main" fixed >
        <ngx-header></ngx-header>
      </nb-layout-header>
      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <div class="header-container">
          <div class="logo-container">
            <!--              <i routerLink="/health" style="color: wheat" class="fa fa-heart health-icon"></i>-->


          </div>
        </div>
        <ng-content select="nb-menu"></ng-content>
<!--                  <nb-icon (click)="openSettingsDialog()" icon="settings-2-outline" class="settings-icon"></nb-icon>-->
<!--                    <p class="settings-icon app-version"><b>App version:- </b> 1.0.1</p>-->
      </nb-sidebar>
      <nb-layout-column class="main-content mobile-view" style="padding: 1rem">
        <div *ngIf="hideHeader" (click)="test()" class="backdrop-custom">
        </div>

        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  hideHeader: boolean = false;
  constructor(private sidebarService: NbSidebarService, private layoutService: LayoutService) {}


  navigateHome() {
    // this.menuService.navigateHome();
    // return false;
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }


  test() {
    // this.sidebarService.collapse('menu-sidebar');
    // this.storageService.menuBackLayer = false;
  }
}
