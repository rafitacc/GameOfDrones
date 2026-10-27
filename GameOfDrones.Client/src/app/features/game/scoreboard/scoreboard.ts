import { Component, computed, inject, input } from '@angular/core';
import { I18n } from '../../../core/i18n/i18n';
import { Game, winsToFinish } from '../../../core/models/game';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.html',
  styleUrl: './scoreboard.scss',
})
export class Scoreboard {
  protected readonly i18n = inject(I18n);

  readonly game = input.required<Game>();

  protected readonly pips = Array.from({ length: winsToFinish }, (_, index) => index);
  protected readonly players = computed(() => {
    const game = this.game();
    return [
      { name: game.player1Name, wins: game.player1Wins, css: 'player-1' },
      { name: game.player2Name, wins: game.player2Wins, css: 'player-2' },
    ];
  });
  protected readonly winnerCss = computed(() => {
    const game = this.game();
    return new Map([
      [game.player1Name, 'player-1'],
      [game.player2Name, 'player-2'],
    ]);
  });
}
