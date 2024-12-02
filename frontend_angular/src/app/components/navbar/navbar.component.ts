import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { jwtDecode  } from 'jwt-decode';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  loggedInUser: string = localStorage.getItem('token') || 'guest';

  constructor() {
    this.updateLoggedInUser();
  }
  
  updateLoggedInUser() {
    const token = localStorage.getItem('token');
    if (token) {
      try{
        const decodedToken: any = jwtDecode(token);
        this.loggedInUser = decodedToken.sub || 'guest';
      } catch (error) {
        console.error('Invalid token', error);
        this.loggedInUser = 'guest';
      }
    } else {
      this.loggedInUser = 'guest';
    }
  }
}
