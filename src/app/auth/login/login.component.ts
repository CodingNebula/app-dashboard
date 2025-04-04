import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';
// import { io, Socket } from "socket.io-client";
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { AccountService } from '../../shared/services/account/account.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public socket: Socket;
  loginForm: FormGroup;  // The reactive form group
  loading = false;
  images = [2].map((n) => `../../../assets/new-ui/loginSlide-${n}.png`);
  pauseOnHover = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private webSocketService: WebsocketService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // Initialize the form with form controls
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  // ngOnInit(): void {
  // }


  loginCode(){

  }

  onSlide(event){

  }

  toggle(event){

  }
  onLoggedin() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    // Check if the form is invalid
    if (!email || !password) {
      return;
    }


    const payload = {
      email: email,
      password: password
    };

    localStorage.setItem('token',JSON.stringify(btoa(payload.email + ':' + payload.password)))
    this.accountService.userLogin(payload).subscribe(res =>{
      this.router.navigateByUrl('pages/terminal');
    })
    
    // Make the POST request to authenticate the user
    // this.http.post<any>(`${environment.api_url}/authenticate`, payload)
      // .subscribe(
      //   (data) => {
      //     if (data?.token) {
      //       let response = data;
      //
      //       localStorage.setItem('id', response.id);
      //       localStorage.setItem('accessToken', response.token);
      //       localStorage.setItem('refreshToken', response.refreshToken);
      //       localStorage.setItem('expiry', moment(new Date()).add(response.expireTime, 'seconds').unix().toString());
      //
      //       // localStorage.setItem('refreshExpiry', moment(new Date()).add(response.refresh_expires_in, 'seconds').unix().toString());
      //
      //       // localStorage.setItem('token', data.token);
      //
      //       // this.webSocketService.socketConnect(data?.token);
      //
      //       this.router.navigateByUrl('pages/application');
      //     } else {
      //       console.error('No token received');
      //     }
      //   },
      //   (error) => {
      //     console.error('Error during HTTP request:', error);
      //     // alert('Login failed. Please check your credentials and try again.');
      //   }
      // );
  }

}




