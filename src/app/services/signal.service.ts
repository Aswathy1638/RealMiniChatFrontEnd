import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {  HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Message } from '../Message.model';


@Injectable({
  providedIn: 'root'
})
export class SignalService {

  private hubConnection :signalR.HubConnection;

  constructor() { 
    this.hubConnection=new HubConnectionBuilder()
    .withUrl('https://localhost:7298/chathub')
    .configureLogging(LogLevel.Information)
    .build();
  }

  startConnection() {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.hubConnection.start().then(() => {
        console.log('Hub connection started');
    
      }).catch(error => {
        console.error('Error starting hub connection:', error);
      });


      
    }
  }

  sendMessage( message: any) {
    try {
       this.hubConnection.invoke('SendMessage',message);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  onReceiveMessage(callback: ( message: Message) => void) {
    this.hubConnection.on('ReceiveOne', callback);
  }
}
