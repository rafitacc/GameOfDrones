import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n/i18n';
import { TranslatedTitleStrategy } from '../../core/i18n/translated-title-strategy';
import { Duel, DuelSide, DuelVerdict } from '../../shared/duel/duel';

/**
 * "Round 404": the requested address and the app's map meet in a duel that nobody wins.
 * Shown for unknown routes and for games the API does not know.
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Duel],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18n);

  protected readonly sides = computed<DuelSide[]>(() => [
    {
      label: this.i18n.t('notFound.you'),
      move: this.router.url,
      mark: '?',
      css: 'player-1',
      result: 'tie',
    },
    {
      label: this.i18n.t('notFound.map'),
      move: this.i18n.t('notFound.nothing'),
      mark: '∅',
      css: 'player-2',
      result: 'tie',
    },
  ]);

  protected readonly verdict = computed<DuelVerdict>(() => ({
    css: 'tie',
    title: this.i18n.t('notFound.verdict'),
    detail: this.i18n.t('notFound.detail'),
  }));

  constructor() {
    inject(TranslatedTitleStrategy).show('title.notFound');
  }
}
