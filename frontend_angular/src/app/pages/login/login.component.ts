import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = 'guest';
  password: string = 'guest';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  async login() {
    try {
      const response = await firstValueFrom(
        this.http.post('http://localhost:5000/api/login', {
          username: this.username,
          password: this.password
        })
      );
      // alert(response)
      localStorage.setItem('token', response['access_token']);
      this.router.navigate(['/search']).then(() => {
        window.location.reload();
      });
    } catch (error) {
      this.errorMessage = "Username not Exist or Password not correct!";
    }
  }
}
