import { Injectable, signal } from '@angular/core';

/** Names of the last game started in this visit, so a rematch does not need them typed again. */
@Injectable({ providedIn: 'root' })
export class LastPlayers {
  readonly names = signal({ player1: '', player2: '' });
}
