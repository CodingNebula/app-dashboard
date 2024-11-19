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

  constructor() { }

  connectWithAccessToken(): void {
    if (!this.socket || !this.socket.connected) {
      // this.socket = io('ws://192.168.1.29:3000', {
      //   withCredentials: true,
      //   extraHeaders: {
      //     token: '12345',
      //   },
      // });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
        this.socket.emit('join', '12345');
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

    if (this.socket && this.socket.connected) {
      // this.socket.emit("message", { room: "12345", message: JSON.stringify(item) });
    } else {
      console.error('Socket is not connected.');
    }
  }

  sendAppLaunchRequest(item: any): void {
    if (this.socket && this.socket.connected) {
      // this.appLaunchStatus = 'SUCCESS';
      console.log(item.capabilities);

      this.socket.emit('message', {
        room: '12345',
        message: 'Hello, Room 12345!',
      });

      this.socket.emit("message", {
        room: "12345",
        message: JSON.stringify(item.capabilities),
      });   
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
