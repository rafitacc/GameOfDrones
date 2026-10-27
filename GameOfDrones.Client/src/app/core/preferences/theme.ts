import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { readPreference, writePreference } from './stored-preference';

export const themes = ['system', 'light', 'dark'] as const;
export type Theme = (typeof themes)[number];

/** "system" follows the operating system setting through prefers-color-scheme. */
@Injectable({ providedIn: 'root' })
export class ThemePreference {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>(readPreference('theme', themes) ?? 'system');

  constructor() {
    effect(() => {
      const theme = this.theme();
      const root = this.document.documentElement;
      if (theme === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', theme);
      }
      writePreference('theme', theme);
    });
  }
}
