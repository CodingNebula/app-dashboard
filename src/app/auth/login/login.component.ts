import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { WebsocketService } from '../../shared/services/websocket/websocket.service';
// import { io, Socket } from "socket.io-client";
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

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
    // Check if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    const payload = {
      email: email,
      password: password
    };

    // Make the POST request to authenticate the user
    this.http.post<any>(`${environment.api_url}/authenticate`, payload)
      .subscribe(
        (data) => {
          if (data?.token) {
            let response = data;
            console.log(data);
            
            localStorage.setItem('id', response.id);
            localStorage.setItem('accessToken', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('expiry', moment(new Date()).add(response.expireTime, 'seconds').unix().toString());

            // localStorage.setItem('refreshExpiry', moment(new Date()).add(response.refresh_expires_in, 'seconds').unix().toString());

            // localStorage.setItem('token', data.token);

            // this.webSocketService.socketConnect(data?.token);

            this.router.navigateByUrl('pages/application');
          } else {
            console.error('No token received');
          }
        },
        (error) => {
          console.error('Error during HTTP request:', error);
          // alert('Login failed. Please check your credentials and try again.');
        }
      );
  }

}


// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { io, Socket } from 'socket.io-client';
// import { WebsocketService } from '../../shared/services/websocket/websocket.service';
// // import { io, Socket } from "socket.io-client";
// import { environment } from '../../../environments/environment';
// import * as moment from 'moment';

// @Component({
//   selector: 'ngx-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {

//   public socket: Socket;
//   loginForm: FormGroup;  // The reactive form group
//   loading = false;
//   images = [2].map((n) => `../../../assets/new-ui/loginSlide-${n}.png`);
//   pauseOnHover = true;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private http: HttpClient,
//     private webSocketService: WebsocketService,
//   ) { }

//   ngOnInit(): void {
//     // Initialize the form with form controls
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(5)]]
//     });
//   }

//   // ngOnInit(): void {
//   // }


//   loginCode() {

//   }

//   onSlide(event) {

//   }

//   toggle(event) {

//   }
//   onLoggedin() {
//     // Check if the form is invalid
//     if (this.loginForm.invalid) {
//       return;
//     }

//     const email = this.loginForm.get('email').value;
//     const password = this.loginForm.get('password').value;

//     const payload = {
//       email: email,
//       password: password
//     };

//     // Make the POST request to authenticate the user
//     this.http.post<any>(`${environment.api_url}/authenticate`, payload)
//       .subscribe(
//         (data) => {
//           if (data?.token) {
//             let response = data;

//             localStorage.setItem('accessToken', response.access_token);
//             localStorage.setItem('refreshToken', response.refresh_token);
//             localStorage.setItem('expiry', moment(new Date()).add(response.expires_in, 'seconds').unix().toString());

//             localStorage.setItem('refreshExpiry', moment(new Date()).add(response.refresh_expires_in, 'seconds').unix().toString());

//             // this.webSocketService.socketConnect(data?.token);
//             console.log('njfnjkdnvd');
            

//             this.router.navigateByUrl('pages/application');
//           } else {
//             console.error('No token received');
//           }
//         },
//         (error) => {
//           console.error('Error during HTTP request:', error);
//           // alert('Login failed. Please check your credentials and try again.');
//         }
//       );
//   }

// }



