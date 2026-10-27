import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationKey } from '../../core/i18n/en';
import { I18n, languages } from '../../core/i18n/i18n';
import { Theme, ThemePreference, themes } from '../../core/preferences/theme';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {
  protected readonly i18n = inject(I18n);
  protected readonly themePreference = inject(ThemePreference);
  protected readonly languages = languages;
  protected readonly themes = themes;
  protected readonly themeLabels: Record<Theme, TranslationKey> = {
    system: 'theme.system',
    light: 'theme.light',
    dark: 'theme.dark',
  };
}
