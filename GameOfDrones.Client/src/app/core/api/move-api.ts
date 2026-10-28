import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Move } from '../models/move';

@Injectable({ providedIn: 'root' })
export class MoveApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/moves';

  getAll(): Observable<Move[]> {
    return this.http.get<Move[]>(this.baseUrl);
  }

  replaceAll(moves: Move[]): Observable<Move[]> {
    return this.http.put<Move[]>(this.baseUrl, moves);
  }

  reset(): Observable<Move[]> {
    return this.http.post<Move[]>(`${this.baseUrl}/reset`, null);
  }
}
