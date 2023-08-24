import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {  HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Message } from '../Message.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SignalService {

  private hubConnection :signalR.HubConnection;
  private isConnectionEstablished: boolean = false;
  private connectionPromise: Promise<void>;
  private messageReceivedSubject: Subject<{ editedMessage: any, editorId: string }> = new Subject();

  constructor() { 
    this.hubConnection=new HubConnectionBuilder()
    .withUrl('https://localhost:7298/chathub')
    .configureLogging(LogLevel.Information)
    .build();
    this.connectionPromise = this.startConnection();

  }
  
  async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      console.log('SignalR Connection started');
      this.isConnectionEstablished = true;
      const connectionId = this.hubConnection.connectionId;
      console.log('Connection ID:', connectionId);
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      throw error;
    }
  }

  async sendMessage(message: any): Promise<void> {
    await this.connectionPromise;
    if (this.isConnectionEstablished) {
      const senderId = localStorage.getItem('id');
      this.hubConnection.invoke('SendMessage', message, senderId);
      console.log('Message sent successfully');
    } else {
      console.warn('SignalR connection is not established yet.');
    }
  }

  async onReceiveMessage(callback: (message: any, senderId: string) => void): Promise<void> {
    await this.connectionPromise;
    if (this.isConnectionEstablished) {
      this.hubConnection.on('ReceiveOne', (message: any, senderId: string) => {
        console.log('ReceivedOne:', message);
        const newReceivedMessage = {
          senderId: senderId,
          receiverId: message.receiverId,
          content: message.content,
          timestamp: message.timestamp
        };
        callback(newReceivedMessage, senderId);
      });
    } else {
      console.warn('SignalR connection is not established yet.');
    }
  }




async invokeEditMessage(editedMessage: any, editorId: string): Promise<void> {
  await this.connectionPromise;
  if (this.isConnectionEstablished) {
    await this.hubConnection.invoke('EditMessage', editedMessage, editorId);
  } else {
    console.warn('SignalR connection is not established yet.');
  }
}

onMessageEdited(callback: (editedMessage: any, editorId: string) => void): void {
  this.hubConnection.on('messageedited', (editedMessage: any, editorId: string) => {
    console.log('MessageEdited:', editedMessage);
    
    callback(editedMessage, editorId);
    
  });
}
async invokeDeleteMessage(messageId: number): Promise<void> {
  await this.connectionPromise;
  if (this.isConnectionEstablished) {
    await this.hubConnection.invoke('DeleteMessage',messageId);
  } else {
    console.warn('SignalR connection is not established yet.');
  }
}

onMessageDeleted(callback: (messageId: number) => void): void {
  this.hubConnection.on('messagedeleted', (messagedeleted:number) => {
    console.log('MessageDeleted:', messagedeleted);
    
    callback(messagedeleted);
    
  });
}

}
