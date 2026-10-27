import { Component, OnInit, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n/i18n';
import { winsToFinish } from '../../core/models/game';
import { ErrorAlert } from '../../shared/error-alert/error-alert';
import { GameSession } from './game-session';
import { MovePicker } from './move-picker/move-picker';
import { RoundReveal } from './round-reveal/round-reveal';
import { Scoreboard } from './scoreboard/scoreboard';
import { TurnHandoff } from './turn-handoff/turn-handoff';

@Component({
  selector: 'app-game',
  imports: [RouterLink, ErrorAlert, MovePicker, RoundReveal, Scoreboard, TurnHandoff],
  providers: [GameSession],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class GamePage implements OnInit {
  private readonly router = inject(Router);
  protected readonly session = inject(GameSession);
  protected readonly i18n = inject(I18n);
  protected readonly winsToFinish = winsToFinish;

  readonly id = input.required({ transform: numberAttribute });

  protected readonly cardCss = computed(() => {
    switch (this.session.stage()) {
      case 'player1':
        return 'player-1';
      case 'reveal':
        return 'turn--reveal';
      default:
        return 'player-2';
    }
  });

  protected readonly picking = computed(() => {
    const game = this.session.game();
    if (!game) {
      return null;
    }

    return this.session.stage() === 'player1'
      ? { current: game.player1Name, other: game.player2Name }
      : { current: game.player2Name, other: game.player1Name };
  });

  constructor() {
    effect(() => {
      const game = this.session.game();
      if (game?.winnerName) {
        this.router.navigate(['/games', game.id, 'winner'], { replaceUrl: true });
      }
    });
  }

  ngOnInit(): void {
    this.session.load(this.id());
  }
}
