import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationKey } from '../../core/i18n/en';
import { I18n } from '../../core/i18n/i18n';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly i18n = inject(I18n);
  protected readonly steps: TranslationKey[] = ['home.step1', 'home.step2', 'home.step3'];
}
