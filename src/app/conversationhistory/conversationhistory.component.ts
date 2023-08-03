import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MessageService} from '../services/message.service'
import {UserService} from '../services/user.service'
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-conversationhistory',
  templateUrl: './conversationhistory.component.html',
  styleUrls: ['./conversationhistory.component.css']
})
export class ConversationhistoryComponent implements OnInit {
  conversationId!: number;
  messages :any[]=[];
  isLoading!: boolean;
  userId!: number;
  selectedUserId!: number; 
  newMessageContent: string = '';
  editingMessageIndex: number | null = null;
  editedMessageContent: string = '';
  editingMessage: any | null = null;
  showEditButton: { [key: number]: boolean } = {};

 
  /**
   *
   */
  constructor(private route:ActivatedRoute,private messageSevice:MessageService,private userService:UserService) { } 
  ngOnInit(): void {
     // Get the userId from the route parameter
  this.route.paramMap.subscribe(params => {
    const userIdString = params.get('userId');
    if (userIdString !== null) {
      this.userId = parseInt(userIdString, 10);
      // Call the service method to get the conversation history
      this.loadConversationHistory(this.userId);
    } else {
      console.error('Invalid userId');
    }
  });
   
  }

 loadConversationHistory(userId: number) {
  this.selectedUserId=userId;
  
  
   this.messageSevice.getConversationHistory(this.userId).subscribe(
    (data) => {
      this.messages = data;
      this.isLoading = false;
      console.log(this.selectedUserId,userId);
    },
    (error)=>
    {
      console.log('error in fetching history',error);
      
      this.isLoading=false;
    }
   );
  
  
  }
  get userList(): any[] {
    return this.userService.userList;
  }

  sendMessage() {
    if (!this.newMessageContent.trim()) {
      return; // Don't send empty messages
    }
  
    this.messageSevice.sendNewMessage(this.selectedUserId, this.newMessageContent).subscribe(
      (response) => {
        // Message sent successfully, append the new message to the conversation history
        const newMessage = {
          senderId:this.selectedUserId ,
          receiverId:this.userId ,
          content: this.newMessageContent,
          timestamp: new Date().toISOString()
        };
        this.messages.push(newMessage);
  
        // Clear the new message input field
        this.newMessageContent = '';
      },
      (error) => {
        console.log('error in sending message', error);
        // Display relevant error message to the user
      }
    );
  }
  
  onContextMenu(event: MouseEvent, message: any) {
    event.preventDefault();
    if (message.senderId === this.userId) {
      // Only show the context menu for the current user's messages
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
    const updatedMessage = { ...message, content: message.editedContent };
    this.messageSevice.updateMessage(message.id, updatedMessage).subscribe(
      (response) => {
        // Update the message in the conversation history
        const index = this.messages.findIndex((m) => m.id === message.id);
        if (index !== -1) {
          this.messages[index] = updatedMessage;
        }
        this.cancelEditing(message);
      },
      (error) => {
        console.log('error in updating message', error);
        // Display relevant error message to the user
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
      return; // User canceled the deletion
    }

    // Make the DELETE request to the backend API
    this.messageSevice.deleteMessage(message.id).subscribe(
      (response) => {
        // Upon success, remove the deleted message from the conversation history
        this.messages = this.messages.filter((msg) => msg.id !== message.id);
        console.log('Message deleted successfully', response);
      },
      (error) => {
        console.log('Error deleting message', error);
        // Display relevant error message to the user
      }
    );
  }


}