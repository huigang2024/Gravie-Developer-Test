import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  query: string = '';
  games: any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  rentedGames: any[] = [];

  constructor(private http: HttpClient) {
    this.loadRentedGames()
   }

  async loadRentedGames() {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      const response: any = await firstValueFrom(this.http.get(`${environment.apiUrl}/rentals`, { headers }));
      if (response) {
        this.rentedGames = response;
      }
    } catch (error) {
      alert('Failed to load rented games! Please try again later.');
    }
  }

  isGameRented(gameId: number): boolean {
    return this.rentedGames.some(game => game.id === gameId);
  }  

  async search(page: number = 1) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': token ? `Bearer ${token}` : '' };
    const params = {
      query: this.query,
      page: page.toString(),
    };
    
    try{
      const response: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/search`, { headers, params }));
        if (response && response.results) {
          this.games = response.results;
          this.currentPage = page;
          this.totalPages = Math.ceil(response.number_of_total_results / 10);
        } else {
          this.errorMessage = 'No results found.';
        }
    } catch(error){
      this.errorMessage = 'Search failed! Please try again later.';
    }
  }

  async rentGame(gameId: number) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': token ? `Bearer ${token}` : '' };
    try {
      const response: any = await firstValueFrom(this.http.post(`${environment.apiUrl}/rent`, { game_id: gameId }, { headers }));
      this.rentedGames.push(gameId)
      alert('Game rented successfully!');
    } catch (error) {
      alert('Failed to rent game! Please try again later.');
    }
  }  

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.search(this.currentPage + 1);
    }
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.search(this.currentPage - 1);
    }
  }  
}
