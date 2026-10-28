import { HttpStatusCode } from '@angular/common/http';
import {
  DOCUMENT,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { errorMessages, hasStatus } from '../../core/api/error-messages';
import { GameApi } from '../../core/api/game-api';
import { I18n } from '../../core/i18n/i18n';
import { Game } from '../../core/models/game';
import { LoadState } from '../../shared/load-state/load-state';
import { NotFound } from '../not-found/not-found';
import { celebrate } from '../../shared/confetti/confetti';

@Component({
  selector: 'app-winner',
  imports: [RouterLink, LoadState, NotFound],
  templateUrl: './winner.html',
  styleUrl: './winner.scss',
})
export class Winner implements OnInit {
  private readonly gameApi = inject(GameApi);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject(I18n);

  readonly id = input.required({ transform: numberAttribute });

  protected readonly game = signal<Game | null>(null);
  protected readonly errors = signal<string[]>([]);
  protected readonly notFound = signal(false);
  protected readonly winnerIsPlayer1 = computed(
    () => this.game()?.winnerName === this.game()?.player1Name,
  );

  ngOnInit(): void {
    this.gameApi.get(this.id()).subscribe({
      next: (game) => {
        if (!game.winnerName) {
          this.router.navigate(['/games', game.id], { replaceUrl: true });
          return;
        }
        this.game.set(game);
        this.startCelebration();
      },
      error: (error: unknown) => {
        this.notFound.set(hasStatus(error, HttpStatusCode.NotFound));
        this.errors.set(errorMessages(error, this.i18n));
      },
    });
  }

  private startCelebration(): void {
    const tokens = getComputedStyle(this.document.documentElement);
    const playerColor = tokens.getPropertyValue(this.winnerIsPlayer1() ? '--p1' : '--p2').trim();
    const gold = tokens.getPropertyValue('--gold').trim();

    const stop = celebrate([gold, playerColor, '#ffffff']);
    this.destroyRef.onDestroy(stop);
  }
}
