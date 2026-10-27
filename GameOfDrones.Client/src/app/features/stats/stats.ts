import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { errorMessages } from '../../core/api/error-messages';
import { PlayerApi } from '../../core/api/player-api';
import { I18n } from '../../core/i18n/i18n';
import { PlayerStats } from '../../core/models/player-stats';
import { ErrorAlert } from '../../shared/error-alert/error-alert';

@Component({
  selector: 'app-stats',
  imports: [RouterLink, ErrorAlert],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  private readonly playerApi = inject(PlayerApi);
  protected readonly i18n = inject(I18n);

  protected readonly players = signal<PlayerStats[] | null>(null);
  protected readonly errors = signal<string[]>([]);

  ngOnInit(): void {
    this.playerApi.getStats().subscribe({
      next: (players) => this.players.set(players),
      error: (error: unknown) => this.errors.set(errorMessages(error, this.i18n)),
    });
  }
}
