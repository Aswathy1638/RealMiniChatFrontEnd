import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {FormsModule,FormBuilder,FormGroup,Validators} from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { HttpClient } from '@angular/common/http';
import { SocialUser } from "@abacritt/angularx-social-login";
import {SocialserviceService} from '../services/socialservice.service'

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit{
  registerForm!: FormGroup;
  private accessToken = '';
  user!: SocialUser;
  loggedIn!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: SocialAuthService,
     private httpClient: HttpClient,
     private socialService:SocialserviceService
  ) { }

  ngOnInit() {

    this.authService.authState.subscribe((user) => {
      console.log(user.idToken);
      this.user = user;
      this.loggedIn = (user != null);
    });


    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.userService.registerUser(this.registerForm.value['name'],this.registerForm.value['email'], this.registerForm.value['password'])
      .subscribe(
        (response) => {
          console.log('User Registration successful', response);
         
          this.router.navigate(['/']);
        },
        (error) => {
          console.log('Failed Registration', error);
        }
      );
  }
  signUpWithGoogle(idToken: string): void {
    console.log("Token to send:", idToken); // Use the stored token
    this.socialService.socialLogin(idToken).subscribe((res) => {
      this.router.navigate(['/chat']);
      console.log("Response from backend:", res);
    });
  }

  }


