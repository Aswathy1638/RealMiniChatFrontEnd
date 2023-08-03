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
  userList: any[]=[];
   isLoading : boolean=true;
   conversationId!: number;
   messages :any[]=[];
   
  /**
   *
   */
  constructor(private userService :UserService,private messageService:MessageService, private router: Router) {}
  ngOnInit(): void {
    this.loadUserList();
  }
  loadUserList() {
    this.userService.GetUserList().subscribe(
      (users:any[])=>{
        this.userList=users;
        this.isLoading=false;
      },
      (error)=>{
        console.log("Error Occured while fetching users",error);
        this.isLoading=false;
      }
      
    )
  }

  loadConversationHistory(userId:number) {
    this.router.navigate(['/chat/user', userId]);
   
    }
}
