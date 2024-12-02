import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

export class CheckoutComponent {
  rentedGames: any[] = [];

  constructor(private http: HttpClient) {
    this.loadRentedGames();
  }

  async loadRentedGames() {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': token ? `Bearer ${token}` : '' };
      const response: any = await firstValueFrom(this.http.get(`${environment.apiUrl}/rentals`, { headers }));
      if (response) {
        this.rentedGames = response;
      }
    } catch (error) {
      alert('Failed to load rented games! Please try again later.');
    }
  }
}
