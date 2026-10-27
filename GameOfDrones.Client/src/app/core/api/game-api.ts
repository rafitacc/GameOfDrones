import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({ providedIn: 'root' })
export class GameApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/games';

  create(player1Name: string, player2Name: string): Observable<Game> {
    return this.http.post<Game>(this.baseUrl, { player1Name, player2Name });
  }

  get(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.baseUrl}/${id}`);
  }

  playRound(id: number, player1Move: string, player2Move: string): Observable<Game> {
    return this.http.post<Game>(`${this.baseUrl}/${id}/rounds`, { player1Move, player2Move });
  }
}
