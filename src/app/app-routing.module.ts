import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from './user-register/user-register.component';
import {LoginComponent} from './login/login.component';
import {UserlistComponent} from './userlist/userlist.component';
import {ConversationhistoryComponent} from './conversationhistory/conversationhistory.component'
import {RequestLogsComponent}from './request-logs/request-logs.component'
import {CommonComponent} from './common/common.component'
const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'register',component: UserRegisterComponent},
 {path:'chat/user/:userId',component:ConversationhistoryComponent},
  {path:'chat',component:UserlistComponent},
  {path:'logs',component:RequestLogsComponent},
  {path:'app-common',component:CommonComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
