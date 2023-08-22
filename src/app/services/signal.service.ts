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
  //   this.hubConnection.start().then(() => {
  //     console.log('SignalR Connection started');
  //     const connectionId = this.hubConnection.connectionId;
  //       console.log("Connection ID:", connectionId);
  //   }).catch((error) => {
  //     console.error('Error starting SignalR connection:', error);
  //   });
  // this.hubConnection.start();
  this.connectionPromise = this.startConnection();

  }

  // startConnection() {
  //   if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
  //     this.hubConnection.start().then(() => {
  //       console.log('Hub connection started');
      
    
  //     }).catch(error => {
  //       console.error('Error starting hub connection:', error);
  //     });


      
  //   }
  // }



  
  // // sendMessage( message: any) {
  // //   try {
  // //     const senderId=localStorage.getItem('id');
  // //      this.hubConnection.invoke('SendMessage',message,senderId);
  // //     console.log('Message sent successfully ok');
  // //   } catch (error) {
  // //     console.error('Error sending message:', error);
  // //     throw error;
  // //   }
  // // }

  // sendMessage(message: any): void {
  //   if (this.isConnectionEstablished) {
  //     const senderId = localStorage.getItem('id');
  //     this.hubConnection.invoke('SendMessage', message, senderId);
  //     console.log('Message sent successfully');
  //   } else {
  //     console.warn('SignalR connection is not established yet.');
  //   }
  // }

  // // onReceiveMessage(callback: ( message: Message) => void) {
  // //   this.hubConnection.on('ReceiveOne', callback);
  // // }
  // // onReceiveMessage(callback: (message: any,senderId: string) => void) {
  // //   if (this.hubConnection) {
  // //     this.hubConnection.on('ReceiveOne', (message:any,senderId:string) => {
  // //       console.log('ReceivedOne:', message);
  // //       const newReceivedMessage = {
  // //         senderId: senderId,
  // //         receiverId: message.receiverId,
  // //         content: message.content,
  // //         timestamp:message.timestamp
  // //       };
  // //       callback(newReceivedMessage,senderId);
  // //     });
  // //   }
  // // }

  // // onReceiveMessage(callback: (message: any, senderId: string) => void) {
  // //   if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
  // //     this.hubConnection.on('ReceiveOne', (message: any, senderId: string) => {
  // //       console.log('ReceivedOne:', message);
  // //       const newReceivedMessage = {
  // //         senderId: senderId,
  // //         receiverId: message.receiverId,
  // //         content: message.content,
  // //         timestamp: message.timestamp
  // //       };
  // //       callback(newReceivedMessage, senderId);
  // //     });
  // //   } else {
  // //     console.warn('SignalR connection is not in a connected state.');
  // //   }
  // // }

  // onReceiveMessage(callback: (message: any, senderId: string) => void): void {
  //   if (this.isConnectionEstablished) {
  //     this.hubConnection.on('ReceiveOne', (message: any, senderId: string) => {
  //       console.log('ReceivedOne:', message);
  //       const newReceivedMessage = {
  //         senderId: senderId,
  //         receiverId: message.receiverId,
  //         content: message.content,
  //         timestamp: message.timestamp
  //       };
  //       callback(newReceivedMessage, senderId);
  //     });
  //   } else {
  //     console.warn('SignalR connection is not established yet.');
  //   }
  // }



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


//   async sendMessageEdited(editedMessage: any, editorId: string): Promise<void> {
//     await this.connectionPromise;
//     if (this.isConnectionEstablished) {
//       this.hubConnection.invoke('EditMessage', editedMessage, editorId);
//       console.log('Edit message sent successfully');
//     } else {
//       console.warn('SignalR connection is not established yet.');
//     }
//   }
// // onMessageEdited(callback: (editedMessage: any, editorId: string) => void): void {
// //   if (this.hubConnection) {
// //     this.hubConnection.on('MessageEdited', (editedMessage: any, editorId: string) => {
// //       console.log('MessageEdited:', editedMessage);
// //       callback(editedMessage, editorId);
// //       console.log('Callback function:', callback);
// //     });
// //   }
// // }
// async onMessageEdited(callback: (editedMessage: any, editorId: string) => void): Promise<void> {
//   await this.connectionPromise;
//   if (this.isConnectionEstablished) {
//     this.hubConnection.on('MessageEdited', (editedMessage: any, editorId: string) => {
//       console.log('MessageEdited:', editedMessage);
//       callback(editedMessage, editorId);
//       console.log('Callback function:');
//     });
//   } else {
//     console.warn('SignalR connection is not established yet.');
//   }
// }

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
