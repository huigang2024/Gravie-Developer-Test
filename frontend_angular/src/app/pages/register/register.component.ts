import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html'
})

export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  async register() {
    try{
      const response = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/register`, {
          username: this.username,
          password: this.password
        })
      );
      // alert('Registration successful!');
      this.router.navigate(['/login']);
    } catch(error) {
      this.errorMessage = 'Registration failed! Please try again.';
      // alert('Registration failed!');
    }
  }
}