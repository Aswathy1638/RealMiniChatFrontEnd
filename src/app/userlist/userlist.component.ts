import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import {MessageService} from '../services/message.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent  implements OnInit{
  userList: any[] = [];
   isLoading : boolean=true;
   conversationId!: number;
   messages :any[]=[];
   searchResultsSubscription: any;
  searchResults:any[]=[];
  searchQuery: any;
   
  /**
   *
   */
  constructor(private userService :UserService,private messageService:MessageService, private router: Router) {}
  ngOnInit(): void {
    this.loadUserList();
  }
  loadUserList() {
    this.userService.GetUserList().subscribe(data => {
      this.userList = data;
      console.log(this.userList);
    });
  }

  loadConversationHistory(userId:string) {
    this.router.navigate(['/chat/user', userId]);
   
    }


    searchMessages(): void {
      if (this.searchQuery.trim() === '') {
        return;
      }
  
      // Call the message service to search for messages
      this.searchResultsSubscription = this.messageService
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
}
