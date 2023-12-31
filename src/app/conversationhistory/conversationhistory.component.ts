import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MessageService} from '../services/message.service'
import {UserService} from '../services/user.service'
import { HttpHeaders } from '@angular/common/http';
import {SignalService} from '../services/signal.service'
import { Message } from '../Message.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-conversationhistory',
  templateUrl: './conversationhistory.component.html',
  styleUrls: ['./conversationhistory.component.css']
})
export class ConversationhistoryComponent implements OnInit {
  conversationId!: number;
  messages :any[]=[];
  isLoading!: boolean;
  userId!: string;
  selectedUserId!: string; 
  newMessageContent: string = '';
  editingMessageIndex: number | null = null;
  editedMessageContent: string = '';
  editingMessage: any | null = null;
  showEditButton: { [key: number]: boolean } = {};
  before: Date = new Date();
  count: number = 20;
  sort: string = 'desc';
  searchResultsSubscription: any;
  searchResults:any[]=[];
  searchQuery: any;
  //conversationHistory: string[] = [];
  conversationHistory: { id:string,timestamp: string, content: string }[] = []; 
  messageToSend: string = '';

 

  constructor(private route:ActivatedRoute,
    private messageSevice:MessageService,private userService:UserService,
    private signalRservice:SignalService) { } 
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      console.log('userId:', this.userId);
      console.log('selectedUserId:', this.selectedUserId);
      this.loadConversationHistory();
    });
    //this.signalRservice.startConnection();
 
// This is test part

this.signalRservice.onReceiveMessage((receivedMessage: any,senderId: string) => {
  console.log('Received message:', receivedMessage);
  
    const newReceivedMessage= {
     senderId :senderId,
      receiverId: receivedMessage.receiverId,
      content: receivedMessage.content,
      timestamp: receivedMessage.timestamp
    };
  this.messages.push(newReceivedMessage);
  
});

 this.signalRservice.onMessageEdited((editedMessage:any,editorId:string) =>{ 
    console.log('Received edited message:', editedMessage);
    console.log('Editor ID:', editorId);
    const newReceivedMessage= {
      messageId:editedMessage.messageId,
      senderId :editedMessage.senderId,
       receiverId: editedMessage.receiverId,
       content: editedMessage.content,
       timestamp: editedMessage.timestamp
     };
    
    this.handleEditedMessage(newReceivedMessage, editorId);
   
  });
  this.signalRservice.onMessageDeleted((messageId:number) =>{

    
    console.log('Deleted message:', messageId);
    this.handleDeletedMessage(messageId);
       
  });
}
   private handleDeletedMessage(messageId:number){
    const index = this.messages.findIndex((msg) => msg.id === messageId);
    if (index !== -1) {
      this.messages.splice(index, 1);
     
    }
   } 
  
  private handleEditedMessage(editedMessage: any, editorId: string) {
    const messageIndex = this.messages.findIndex((msg) => msg.id === editedMessage.messageId);
    if (messageIndex !== -1) {
      this.messages[messageIndex].content = editedMessage.content;
      this.messages[messageIndex].edited = true; 
    }
  }
loadConversationHistory(): void {
  this.messageSevice.getConversationHistory(this.userId, this.before, this.count, this.sort)
    .subscribe((data: any[]) => {
      this.messages = data;
      console.log(this.messages);
    });
}

loadMoreMessages(): void {
  const oldestMessage = this.messages[this.messages.length - 1];
  if (oldestMessage) {
    this.before = new Date(oldestMessage.timestamp);
    this.loadConversationHistory();
  }
}
  get userList(): any[] {
    return this.userService.userList;
  }
 
  
 sendMessage() {
    if (!this.newMessageContent.trim()) {
      return; // Don't send empty messages
    }
  
    this.messageSevice.sendNewMessage(this.userId, this.newMessageContent).subscribe(
      (response) => {
        // Message sent successfully, append the new message to the conversation history
        const newMessage = {
          senderId :localStorage.getItem('id'),
          receiverId:this.userId ,
          content: this.newMessageContent,
          timestamp: new Date().toISOString()
        };
        console.log("Message to send",newMessage);
              // this.messages.push(newMessage);
        this.signalRservice.sendMessage(newMessage);
        this.signalRservice.onReceiveMessage((receivedmessage: Message) => {
          console.log('Received message:', receivedmessage);
          const msg={
            senderId :receivedmessage.senderId,
            receiverId :receivedmessage.receiverId,
            content:receivedmessage.content,
            timestamp:receivedmessage.timestamp

          }
                  
        });
        //this.cdr.detectChanges();
        this.newMessageContent = '';
    
       } );
  }



  
  onContextMenu(event: MouseEvent, message: any) {
    event.preventDefault();
    if (message.senderId === this.userId) {
    
      if (!message.editing) {
        this.startEditing(message);
      } else {
        this.cancelEditing(message);
      }
    }
  }

  
  onMouseEnter(message: any) {
    if (message.senderId === this.userId && !message.editing) {
      this.showEditButton[message.id] = true;
    }
  }

  onMouseLeave(message: any) {
    if (message.senderId === this.userId && !message.editing) {
      this.showEditButton[message.id] = false;
    }
  }

  startEditing(message: any) {
    this.messages.forEach((msg) => (msg.editing = false));
    this.editingMessage = message;
    message.editing = true;
    message.editedContent = message.content;
  }


  cancelEditing(message: any) {
    message.editing = false;
    this.editingMessage = null;
  }

  

  onAcceptEdit(message: any) {
    // Update the edited message locally
    const updatedMessage = { ...message, content: message.editedContent };
    this.messageSevice.updateMessage(message.id, updatedMessage)
      .subscribe(
        (response) => {
          const index = this.messages.findIndex((m) => m.id === message.id);
                if (index !== -1) {
                  const editorId = localStorage.getItem('id') || '';
                  this.signalRservice.invokeEditMessage(updatedMessage, editorId);
                   this.messages[index] = updatedMessage;
                   this.cancelEditing(message);
                 }
          // Emit a signal to the server using SignalR to notify other clients about the edit
        },
        (error) => {
          console.log('Error updating message', error);
        }
      );
  }
  
  onDeclineEdit(message: any) {
    this.cancelEditing(message);
  }
  getUserById(userId: number) {
    return this.userList.find(user => user.id === userId);
  }
 
  deleteMessage(message: any) {
    // Show a confirmation dialog to the user
    const confirmation = confirm('Are you sure you want to delete this message?');
    if (!confirmation) {
      return; 
    }

   
    this.messageSevice.deleteMessage(message.id).subscribe(
      (response) => {
        // Upon success, remove the deleted message from the conversation history
        this.messages = this.messages.filter((msg) => msg.id !== message.id);
        console.log('Message deleted successfully', response);
        this.signalRservice.invokeDeleteMessage(message.id);
      },
      (error) => {
        console.log('Error deleting message', error);
        // Display relevant error message to the user
      }
    );
  }


  searchMessages(): void {
    if (this.searchQuery.trim() === '') {
      return;
    }

    // Call the message service to search for messages
    this.searchResultsSubscription = this.messageSevice
      .searchMessages(this.searchQuery)
      .subscribe(
        (results) => {
          this.searchResults = results;
        },
        (error) => {
          console.error('Error searching messages:', error);
          // Handle error and display appropriate message
        }
      );
  }

  closeSearchResults(): void {
    this.searchResults = [];
    if (this.searchResultsSubscription) {
      this.searchResultsSubscription.unsubscribe();
    }
  }

getSenderName(senderId: string): string {
  const sender = this.userList.find(user => user.id === senderId);
  return sender ? sender.name : 'Unknown Sender';
}
}








