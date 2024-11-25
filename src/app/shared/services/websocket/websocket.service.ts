import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket: Socket;
  private mySubject = new BehaviorSubject<any>(null);
  public message: string | null = null;
  public appLaunchStatus: string | null = null;

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
        app_name: 'Anypay 2.1 (Alpha)',
        started_by: 'Nick Jones',
        start_time: '14:15:00'
      }
    }
   }
   getSubject() {
    return this.mySubject.asObservable();
  }
  connectWithAccessToken(): void {
    // if (!this.socket || !this.socket.connected) {
    // this.socket = io('ws://192.168.1.29:3000', {
    //   withCredentials: true,
    //   extraHeaders: {
    //     token: localStorage.getItem('id'),
    //   },
    // });

    // console.log('Socket connected:', this.socket);
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
    //   console.log(message, 'message');
    // });

    // this.socket.on('disconnect', () => {
    //   console.log('Socket disconnected.');
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
    //   console.log('Received server response:', response);
    //   // Test case name and status
    //   if (response.success) {
    //     console.log('Test case request success:', response);
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
    this.socket.on('ping', (response: any) => {
      console.log(response,'receive pings')
    })
  }

  private handleReconnect(): void {
    // Only attempt to reconnect a limited number of times
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts + 1}`);
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connectWithAccessToken();
      }, 2000);
    } else {
      console.error('Max reconnect attempts reached. Please check your connection.');
    }
  }

  sendTestCaseRequest(item?: any): void {
    this.testReportsData.reports.push(item);

    // Check if the socket is connected before emitting
    if (this.socket && this.socket.connected) {
      console.log('Emitting sendTestCaseRequest with data:', { room: localStorage.getItem('id'), message: JSON.stringify(item) });
      this.socket.emit("message", { room: localStorage.getItem('id'), message: item });

      console.log('Message sent to server');

      // Listen for the response from the server
      this.socket.on('message', (response: any) => {
        console.log('Received server response:', response);
this.updateValue(response);
        // Test case name and status
        // if (response.success) {
        //   console.log('Test case request success:', response);
        // } else {
        //   console.error('Test case request failed:', response.error);
        // }
      });
    } else {
      console.error('Socket is not connected.');
    }
  }

 updateValue(newValue: any) {
    this.mySubject.next(newValue);
  }
  sendAppLaunchRequest(item: any): void {
    console.log(this.socket);

    this.testReportsData.capabilities = item.capabilities;

    console.log(this.testReportsData);

    if (this.socket && this.socket.connected) {
      // this.appLaunchStatus = 'SUCCESS';
      console.log(item.capabilities);

      // this.testReportsData.capabilities = item.capabilities;

      // console.log(this.testReportsData);


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
      console.log('WebSocket disconnected');
    }
  }

  // ngOnDestroy(): void {
  //   if (this.socket) {
  //     this.socket.removeAllListeners();
  //     this.socket.disconnect();
  //   }
  // }
}
