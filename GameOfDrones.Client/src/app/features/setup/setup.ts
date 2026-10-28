import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { errorMessages } from '../../core/api/error-messages';
import { GameApi } from '../../core/api/game-api';
import { I18n } from '../../core/i18n/i18n';
import { ErrorAlert } from '../../shared/error-alert/error-alert';
import { LastPlayers } from './last-players';

const nameMaxLength = 50;

@Component({
  selector: 'app-setup',
  imports: [ReactiveFormsModule, RouterLink, ErrorAlert],
  templateUrl: './setup.html',
  styleUrl: './setup.scss',
})
export class Setup {
  private readonly gameApi = inject(GameApi);
  private readonly router = inject(Router);
  private readonly lastPlayers = inject(LastPlayers);
  protected readonly i18n = inject(I18n);

  protected readonly nameMaxLength = nameMaxLength;
  protected readonly form = new FormGroup({
    player1: this.nameControl(this.lastPlayers.names().player1),
    player2: this.nameControl(this.lastPlayers.names().player2),
  });
  protected readonly players = [
    { control: 'player1', number: 1, css: 'player-1' },
    { control: 'player2', number: 2, css: 'player-2' },
  ] as const;
  protected readonly starting = signal(false);
  protected readonly errors = signal<string[]>([]);

  protected start(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { player1, player2 } = this.form.getRawValue();
    this.starting.set(true);
    this.errors.set([]);

    this.gameApi.create(player1.trim(), player2.trim()).subscribe({
      next: (game) => {
        this.lastPlayers.names.set({ player1: game.player1Name, player2: game.player2Name });
        this.router.navigate(['/games', game.id]);
      },
      error: (error: unknown) => {
        this.errors.set(errorMessages(error, this.i18n));
        this.starting.set(false);
      },
    });
  }

  private nameControl(name: string): FormControl<string> {
    return new FormControl(name, {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(nameMaxLength)],
    });
  }
}
