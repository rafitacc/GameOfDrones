import { HttpStatusCode } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { errorMessages, hasStatus } from '../../core/api/error-messages';
import { GameApi } from '../../core/api/game-api';
import { MoveApi } from '../../core/api/move-api';
import { I18n } from '../../core/i18n/i18n';
import { Game } from '../../core/models/game';
import { Move } from '../../core/models/move';

/**
 * player1 → handoff (pass the screen) → player2 → reveal (round result) → player1 …
 * The round that decides the game skips the reveal and goes straight to the winner screen.
 */
type Stage = 'player1' | 'handoff' | 'player2' | 'reveal';

/**
 * State of the game being played. Player 1's move is kept here, never rendered,
 * and sent together with player 2's move once both have chosen.
 */
@Injectable()
export class GameSession {
  private readonly gameApi = inject(GameApi);
  private readonly moveApi = inject(MoveApi);
  private readonly i18n = inject(I18n);
  private player1Move: string | null = null;

  readonly game = signal<Game | null>(null);
  readonly moves = signal<Move[]>([]);
  readonly errors = signal<string[]>([]);
  readonly notFound = signal(false);
  readonly sending = signal(false);
  readonly stage = signal<Stage>('player1');

  readonly roundNumber = computed(() => (this.game()?.rounds.length ?? 0) + 1);

  load(id: number): void {
    forkJoin({ game: this.gameApi.get(id), moves: this.moveApi.getAll() }).subscribe({
      next: ({ game, moves }) => {
        this.game.set(game);
        this.moves.set(moves);
      },
      error: (error: unknown) => {
        this.notFound.set(hasStatus(error, HttpStatusCode.NotFound));
        this.errors.set(errorMessages(error, this.i18n));
      },
    });
  }

  choose(move: string): void {
    const game = this.game();
    if (!game) {
      return;
    }

    if (this.stage() === 'player1') {
      this.player1Move = move;
      this.stage.set('handoff');
      return;
    }

    this.sending.set(true);
    this.errors.set([]);
    this.gameApi.playRound(game.id, this.player1Move!, move).subscribe({
      next: (updated) => {
        this.player1Move = null;
        this.game.set(updated);
        if (!updated.winnerName) {
          this.stage.set('reveal');
        }
        this.sending.set(false);
      },
      error: (error: unknown) => {
        this.errors.set(errorMessages(error, this.i18n));
        this.sending.set(false);
      },
    });
  }

  startPlayer2Turn(): void {
    this.stage.set('player2');
  }

  nextRound(): void {
    this.stage.set('player1');
  }

}
