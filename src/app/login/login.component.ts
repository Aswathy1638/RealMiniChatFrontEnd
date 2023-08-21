import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import { Router } from '@angular/router';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { HttpClient } from '@angular/common/http';
import { SocialUser } from "@abacritt/angularx-social-login";
import {SocialserviceService} from '../services/socialservice.service'
 @Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  private accessToken = '';
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  user!: SocialUser;
  loggedIn!: boolean;
  private googleToken = '';
  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
     private router: Router,
     private authService: SocialAuthService,
     private socialService:SocialserviceService,
     private httpClient: HttpClient)
      {}
  ngOnInit(){

    this.authService.authState.subscribe((user) => {
      console.log("this",user.idToken);
      this.user = user;
      this.accessToken=user.authToken;
      this.googleToken = user.idToken;
      this.loggedIn = (user != null);
      this.signInWithGoogle(this.user.idToken);
    });
    
    this.loginForm = this.formBuilder.group({
      
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });  
  }
  
  onSubmit(){
    if(this.loginForm.invalid){
      return ; //return to prevent the page reload when there is an error in validation of input fields
    }
    
    const email =this.loginForm.get('email')?.value;
    const password=this.loginForm.get('password')?.value;

    this.userService.loginUser(email,password).subscribe(
      (response)=>{

        localStorage.setItem('jwtToken',response.token);
        localStorage.setItem('id',response.profile.id);
        console.log('User login successful', response);
        this.router.navigate(['/chat']);
      },
      (error)=>{
      this.errorMessage=error.error.error;

      } 
    );
  }
  signInWithGoogle(idToken: string): void {
    console.log("Token to send:", idToken); // Use the stored token
    this.socialService.socialLogin(idToken).subscribe((res) => {
      this.router.navigate(['/chat']);
      console.log("Response from backend:", res);
    });
  }
 

}
