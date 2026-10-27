import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { readPreference, writePreference } from '../preferences/stored-preference';
import { TranslationKey, en } from './en';
import { es } from './es';

export const languages = ['en', 'es'] as const;
export type Language = (typeof languages)[number];

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, es };

/**
 * Runtime translations. Reading the language signal inside t() makes every template
 * that calls it update when the language changes.
 */
@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly document = inject(DOCUMENT);

  readonly language = signal<Language>(
    readPreference('language', languages) ?? this.browserLanguage(),
  );

  constructor() {
    effect(() => {
      const language = this.language();
      this.document.documentElement.lang = language;
      writePreference('language', language);
    });
  }

  t(key: TranslationKey, params: Record<string, string | number> = {}): string {
    return dictionaries[this.language()][key].replace(/\{(\w+)\}/g, (placeholder, name: string) =>
      name in params ? String(params[name]) : placeholder,
    );
  }

  private browserLanguage(): Language {
    return this.document.defaultView?.navigator.language.toLowerCase().startsWith('es')
      ? 'es'
      : 'en';
  }
}
