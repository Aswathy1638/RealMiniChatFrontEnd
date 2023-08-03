import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {FormsModule,FormBuilder,FormGroup,Validators} from '@angular/forms';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit{
  registerForm!: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
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
          // Redirect user to login after successful registration
          this.router.navigate(['/']);
        },
        (error) => {
          console.log('Failed Registration', error);
        }
      );
  }
  }


