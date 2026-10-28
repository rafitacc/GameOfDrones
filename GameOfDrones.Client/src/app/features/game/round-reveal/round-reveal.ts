import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { I18n } from '../../../core/i18n/i18n';
import { Game } from '../../../core/models/game';
import { burst } from '../../../shared/confetti/confetti';
import { Duel, DuelResult, DuelSide, DuelVerdict, duelClashMs } from '../../../shared/duel/duel';

/** Animated result of the last round played: both moves collide, then the verdict. */
@Component({
  selector: 'app-round-reveal',
  imports: [Duel],
  templateUrl: './round-reveal.html',
  styleUrl: './round-reveal.scss',
})
export class RoundReveal {
  protected readonly i18n = inject(I18n);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly continueButton =
    viewChild.required<ElementRef<HTMLButtonElement>>('continueButton');

  readonly game = input.required<Game>();
  readonly continued = output();

  protected readonly round = computed(() => this.game().rounds.at(-1)!);

  protected readonly sides = computed<DuelSide[]>(() => {
    const game = this.game();
    const round = this.round();
    const resultOf = (player: string): DuelResult =>
      round.winnerName === null ? 'tie' : round.winnerName === player ? 'winner' : 'loser';
    const side = (player: string, move: string, css: DuelSide['css']): DuelSide => ({
      label: player,
      move,
      mark: move.charAt(0),
      css,
      result: resultOf(player),
    });

    return [
      side(game.player1Name, round.player1Move, 'player-1'),
      side(game.player2Name, round.player2Move, 'player-2'),
    ];
  });

  protected readonly verdict = computed<DuelVerdict>(() => {
    const winner = this.sides().find((side) => side.result === 'winner');
    const loser = this.sides().find((side) => side.result === 'loser');
    if (!winner || !loser) {
      return {
        css: 'tie',
        title: this.i18n.t('reveal.tie'),
        detail: this.i18n.t('reveal.tieDetail'),
      };
    }

    return {
      css: winner.css,
      title: this.i18n.t('reveal.winsRound', { name: winner.label }),
      detail: this.i18n.t('reveal.kills', { winnerMove: winner.move, loserMove: loser.move }),
    };
  });

  constructor() {
    afterNextRender(() => {
      this.continueButton().nativeElement.focus({ preventScroll: true });

      const timer = setTimeout(() => this.burstFromWinner(), duelClashMs);
      this.destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }

  private burstFromWinner(): void {
    const winnerCard = this.host.nativeElement.querySelector<HTMLElement>('.duel__move--winner');
    const view = this.document.defaultView;
    if (!winnerCard || !view) {
      return;
    }

    const box = winnerCard.getBoundingClientRect();
    const playerColor = view.getComputedStyle(winnerCard).getPropertyValue('--player').trim();
    const gold = view
      .getComputedStyle(this.document.documentElement)
      .getPropertyValue('--gold')
      .trim();

    burst([playerColor, gold, '#ffffff'], {
      x: (box.left + box.width / 2) / view.innerWidth,
      y: (box.top + box.height / 2) / view.innerHeight,
    });
  }
}
