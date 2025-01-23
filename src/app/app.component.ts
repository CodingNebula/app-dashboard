/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private analytics: AnalyticsService, 
    private seoService: SeoService,
    private router: Router  ) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();

    const token = localStorage.getItem('accessToken');

    if (token && this.isTokenExpired(token)) {
        this.logoutUser();
    }
  }

  

  isTokenExpired(token: string){
    if(!token) return true;

    try{
      const decode: any = jwtDecode(token);

      const expirationTime = decode.exp * 1000;

      const currentTime = Date.now();

      

      return currentTime > expirationTime;
    }
    catch(error){
      console.log(error);
      
    }
  }

  logoutUser(){
    localStorage.removeItem('accessToken');
    this.router.navigateByUrl('auth/login');
  }




}
