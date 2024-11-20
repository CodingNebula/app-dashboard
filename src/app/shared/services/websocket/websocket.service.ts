import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket: Socket;

  public message: string | null = null;
  public appLaunchStatus: string | null = null;

  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  public testReportsData: any = {
    reports: [],
  };

  constructor() { }

  connectWithAccessToken(): void {
    if (!this.socket || !this.socket.connected) {
      // this.socket = io('ws://192.168.1.29:3000', {
      //   withCredentials: true,
      //   extraHeaders: {
      //     token: localStorage.getItem('id'),
      //   },
      // });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
        this.socket.emit('join', localStorage.getItem('id'));
        this.socket.emit('Client has joined the room');
      });

      this.socket.on('result', (message: any) => {
        this.message = message;
        console.log(message, 'message');
      });

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
    }
  }

  socketConnect(token){
    this.socket = io('ws://192.168.1.29:3000', {
      withCredentials: true,
      extraHeaders: {
        token: token,
      },
    });
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
    console.log(item);
    console.log(this.message);
  
    // Assuming you want to push the item to some `reports` array
    this.testReportsData.reports.push(item);
  
    console.log(this.testReportsData);
  
    if (this.socket && this.socket.connected) {
      this.socket.emit("sendTestCaseRequest", { room: "12345", message: JSON.stringify(item) });
  
      this.socket.on('testCaseResponse', (response: any) => {
        console.log('Received server response:', response);
        if (response.success) {
          console.log(response);
          // Handle success response
        } else {
          console.log('Test case request failed:', response.error);
          // Handle error response
        }
      });
    } else {
      console.error('Socket is not connected.');
    }
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

  // ngOnDestroy(): void {
  //   if (this.socket) {
  //     this.socket.removeAllListeners();
  //     this.socket.disconnect();
  //   }
  // }
}
