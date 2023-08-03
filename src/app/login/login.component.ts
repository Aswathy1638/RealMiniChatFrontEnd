import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {Router}from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
     private router: Router)
      {}
  ngOnInit(){
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
        console.log('User login successful', response);
        this.router.navigate(['/chat']);
      },
      (error)=>{
      this.errorMessage=error.error.error;

      } 
    );
  }


}
