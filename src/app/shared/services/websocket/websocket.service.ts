import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket: Socket;
  private mySubject = new BehaviorSubject<any>(null);
  public message: string | null = null;
  public appLaunchStatus: string | null = null;
  public showAlert = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  public testReportsData: any = {
    reports: [],
  };

  constructor() {
    this.testReportsData = {
      id: 0,
      capabilities: {
        platformName: "Android",
        app: "/home/codingnebula/Downloads/app-debug-v12.apk",
        appPackage: "com.example.app",
        automationName: "UIAutomator2",
        deviceName: "Samsung",
        noReset: true,
        ignoreHiddenApiPolicyError: true,
        newCommandTimeout: 1200000
      },
      reports: [
        {
          test_case: 'Welcome',
          status: 'Passed',
          defect: '',
          time_spent: 300,
          expected_result: 'Should be able to enter the text'
        },
        {
          test_case: 'Permission',
          status: 'Failed',
          defect: 'User not allowed permissions',
          time_spent: 200,
          expected_result: 'Permission should allowed'
        },
        {
          test_case: 'Device Connection',
          status: 'Passed',
          defect: '',
          time_spent: 280,
          expected_result: 'Device connected'
        },
        {
          test_case: 'Transaction',
          status: 'Failed',
          defect: 'Reader not connected',
          time_spent: 300,
          expected_result: 'Reader should be connected'
        },
        {
          test_case: 'Receipt',
          status: 'Untested',
          defect: '',
          time_spent: 300,
          expected_result: 'Receipt send on email'
        },
      ],
      extras: {
        app_name: 'Anypay 2.10 (Alpha)',
        started_by: 'Nick Jones',
        start_time: '14:15:00',
        created_at: '25-11-2024',
        time_taken: 12000,
      }
    }
   }
   getSubject() {
    return this.mySubject.asObservable().pipe(catchError((error) => {
        console.error('Handled error in getSubject:', error);
        // Return an empty observable or re-throw the error if needed
        return new Observable();  // Return an empty observable in case of error
      }));
  }

  saveTestReportData(reportData: any){
    this.testReportsData = reportData
  }
  connectWithAccessToken(): void {
    // if (!this.socket || !this.socket.connected) {
    // this.socket = io('ws://192.168.1.29:3000', {
    //   withCredentials: true,
    //   extraHeaders: {
    //     token: localStorage.getItem('id'),
    //   },
    // });

    // this.socket.emit('join', localStorage.getItem('id'));
    // this.socket.on('connect', () => {
    //   this.socket.emit('join', localStorage.getItem('id'));
    //   this.socket.emit('Client has joined the room');
    // });


    this.socket.emit('message', {
      room: localStorage.getItem('id'),
      message: 'Hello, Room 12345!',
    });

    // this.socket.on('result', (message: any) => {
    //   this.message = message;
    // });

    // this.socket.on('disconnect', () => {
    //   // this.handleReconnect();
    // });

    // this.socket.on('connect_error', (error: any) => {
    //   console.error('Socket connection error:', error);
    //   // this.handleReconnect();
    // });

    // this.socket.on('connect_timeout', (timeout: any) => {
    //   console.error('Socket connection timeout:', timeout);
    //   // this.handleReconnect();
    // });
    // }

    // this.socket.on('message', (response: any) => {
    //   // Test case name and status
    //   if (response.success) {
    //   } else {
    //     console.error('Test case request failed:', response.error);
    //   }
    // });
  }

  socketConnect(token) {
    this.socket = io('ws://192.168.1.29:3000', {
      withCredentials: true,
      extraHeaders: {
        token: token,
      },
    });

    // this.socket.emit('message', {
    //   room: localStorage.getItem('id'),
    //   message: 'Hello, Room 12345!',
    // });

    this.socket.on('connect', () => {
      this.socket.emit('join', { 
        room: localStorage.getItem('id') 
      });
    });
   
    
  }

  private handleReconnect(): void {
    // Only attempt to reconnect a limited number of times
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connectWithAccessToken();
      }, 2000);
    } else {
      console.error('Max reconnect attempts reached. Please check your connection.');
    }
  }

  sendTestCaseRequest(item?: any): void {
    console.log(item);
    
    this.testReportsData.reports.push(item);

    // Check if the socket is connected before emitting
    if (this.socket && this.socket.connected) {
      this.socket.emit("message", { room: localStorage.getItem('id'), message: item });

      // Listen for the response from the server
      this.socket.on('message', (response: any) => {
this.updateValue(response);
        // Test case name and status
        // if (response.success) {
        // } else {
        //   console.error('Test case request failed:', response.error);
        // }
      });
    } else {
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 1000);
      console.error('Socket is not connected.');
    }
  }

 updateValue(newValue: any) {
    this.mySubject.next(newValue);
  }
  sendAppLaunchRequest(item: any): void {

    this.testReportsData.capabilities = item.capabilities;


    if (this.socket && this.socket.connected) {
      // this.appLaunchStatus = 'SUCCESS';

      // this.testReportsData.capabilities = item.capabilities;



      this.socket.emit('message', {
        room: localStorage.getItem('id'),
        message: 'Hello, Room 12345!',
      });

      // this.socket.emit("message", {
      //   room: localStorage.getItem('id'),
      //   message: JSON.stringify(item.capabilities),
      // });   
    } else {
      console.error('Socket is not connected.');
    }
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.close();  // Close the connection
      this.socket = null;   // Clear the socket reference
    }
  }

  // ngOnDestroy(): void {
  //   if (this.socket) {
  //     this.socket.removeAllListeners();
  //     this.socket.disconnect();
  //   }
  // }
}
