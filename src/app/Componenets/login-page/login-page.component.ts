import { Component } from '@angular/core';
import { LoginServiceService } from '../../Services/login-service.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Route, Router } from '@angular/router';
import { login } from '../../Types/login';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  message_error: string = '';
  // loginData: login = {};
  constructor(private myservice: LoginServiceService, private route: Router) {}
  //property of input in html
  myform = new FormGroup({
    user_email: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(
        '^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
      ),
    ]),
  });
  //to send date to api and create jwt token
  send_data() {
    if (this.myform.valid) {
      const loginData: login = {
        email_username: this.myform.value.user_email || '',
        password: this.myform.value.password || '',
      };

      this.myservice.add_login(loginData).subscribe({
        next: (response: any) => {
          if (response.token) {
            this.myservice.setToken(response.token);
            this.route.navigate(['/Home']);
            this.message_error = '';
          } else {
            console.error('Login failed: No token in response');
          }
        },
        error: (err) => {
          this.message_error = err.error.message;
          console.error('Login failed', err);
          console.log(this.message_error);
        },
      });
    } else {
      this.message_error = 'من فضلك ادخل داتا مطلوبه';
    }
  }
}
