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

type Result = 'winner' | 'loser' | 'tie';

/** Matches the moment the winning card lands in round-reveal.scss. */
const clashDelayMs = 300;

/** Animated result of the last round played: both moves collide, then the verdict. */
@Component({
  selector: 'app-round-reveal',
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

  protected readonly sides = computed(() => {
    const game = this.game();
    const round = this.round();
    const resultOf = (player: string): Result =>
      round.winnerName === null ? 'tie' : round.winnerName === player ? 'winner' : 'loser';

    return [
      {
        player: game.player1Name,
        move: round.player1Move,
        css: 'player-1',
        result: resultOf(game.player1Name),
      },
      {
        player: game.player2Name,
        move: round.player2Move,
        css: 'player-2',
        result: resultOf(game.player2Name),
      },
    ];
  });

  protected readonly verdict = computed(() => {
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
      title: this.i18n.t('reveal.winsRound', { name: winner.player }),
      detail: this.i18n.t('reveal.kills', { winnerMove: winner.move, loserMove: loser.move }),
    };
  });

  constructor() {
    afterNextRender(() => {
      this.continueButton().nativeElement.focus({ preventScroll: true });

      const timer = setTimeout(() => this.burstFromWinner(), clashDelayMs);
      this.destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }

  private burstFromWinner(): void {
    const winnerCard = this.host.nativeElement.querySelector<HTMLElement>('.reveal__move--winner');
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
