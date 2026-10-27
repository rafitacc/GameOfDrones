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
}
