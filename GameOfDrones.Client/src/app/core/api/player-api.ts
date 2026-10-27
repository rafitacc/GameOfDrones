import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerStats } from '../models/player-stats';

@Injectable({ providedIn: 'root' })
export class PlayerApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/players';

  getStats(): Observable<PlayerStats[]> {
    return this.http.get<PlayerStats[]>(`${this.baseUrl}/stats`);
  }
}
