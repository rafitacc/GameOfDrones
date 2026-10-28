import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n/i18n';

/** Heading for the screens reached from home: a way back, the title and a short lead. */
@Component({
  selector: 'app-page-intro',
  imports: [RouterLink],
  template: `
    <a class="text-link" routerLink="/">{{ i18n.t('common.back') }}</a>
    <h1>{{ heading() }}</h1>
    <p>{{ lead() }}</p>
  `,
  styles: `
    :host {
      display: grid;
      gap: 0.75rem;
      justify-items: start;
    }

    h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 500;
      letter-spacing: -0.03em;
    }

    p {
      max-width: 38rem;
      margin: 0;
      color: var(--muted);
      font-size: 1.0625rem;
    }
  `,
})
export class PageIntro {
  protected readonly i18n = inject(I18n);

  readonly heading = input.required<string>();
  readonly lead = input.required<string>();
}
