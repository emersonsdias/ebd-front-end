import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  hidePassword: boolean = true
  keepLoggedIn: boolean = false
  credentials: { username: string, password: string} = {
    username: '',
    password: ''
  }

  login() {
    console.log("LOGIN")
  }

  forgotPassword() {
    console.log("FORGOT PASSWORD")
  }

  signUp() {
    console.log("SIGN UP")
  }

}
