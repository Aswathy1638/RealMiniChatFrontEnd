import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalService {

  private hubConnection :HubConnection;

  constructor() { 
    this.hubConnection=new HubConnectionBuilder()
    .withUrl('http://localhost:5000/chathub')
    .build();
  }

  startConnection() {
    return this.hubConnection.start();
  }

  sendMessage(receiverId: string, message: string) {
    return this.hubConnection.invoke('SendMessage', receiverId, message);
  }

  onReceiveMessage(callback: (message: string) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }
}
