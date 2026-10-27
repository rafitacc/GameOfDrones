import { Injectable, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslationKey } from './en';
import { I18n } from './i18n';

/** Route titles are translation keys, so the tab title follows the selected language. */
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly i18n = inject(I18n);
  private readonly title = inject(Title);
  private readonly key = signal<TranslationKey>('title.home');

  constructor() {
    super();
    effect(() => this.title.setTitle(this.i18n.t(this.key())));
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot);
    if (key) {
      this.key.set(key as TranslationKey);
    }
  }
}
