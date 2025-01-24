import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private apiService: ApiService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('accessToken');

    setInterval(() => {
      let accessToken = localStorage.getItem('accessToken');
      
      let refreshToken = localStorage.getItem('refreshToken');
      let expiry = localStorage.getItem('expiry');
      
      if (accessToken && expiry) {

        const remainingTime = Number(expiry) - moment(new Date()).unix();
        if (remainingTime < 30000) {
          
          this.refreshAccessToken();
        }
      }
    }, 1000)
    

    if (token) {
      return true; // Allow access if the token is present
    } else {
      // Redirect to login page or another route if no token
      return this.router.createUrlTree(['/auth/login']);
    }
  }

  refreshAccessToken() {
    
    try {
      this.apiService.getRefreshTokenWithoutModal('refresh-token').subscribe((res) => {
        if (res) {
          
          localStorage.setItem('accessToken', res.result.nat);
          localStorage.setItem('refreshToken', res.result.nrt);
          localStorage.setItem('expiry', moment(new Date()).add(res.result.nate, 'seconds').unix().toString());
          // localStorage.setItem('refreshExpiry', moment(new Date()).add(data.refresh_expires_in, 'seconds').unix().toString())
        } else {
          console.log('Failed to refresh token');
        }
      });
    } catch (error) {
    }
  }

}
