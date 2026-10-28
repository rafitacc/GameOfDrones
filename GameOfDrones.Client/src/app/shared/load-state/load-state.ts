import { Component, input } from '@angular/core';
import { ErrorAlert } from '../error-alert/error-alert';

/** What a screen shows until its data arrives: a loading message, or the errors and a way out. */
@Component({
  selector: 'app-load-state',
  imports: [ErrorAlert],
  template: `
    @if (errors().length) {
      <app-error-alert [messages]="errors()" />
      <ng-content />
    } @else {
      <p role="status">{{ loading() }}</p>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: 1.5rem;
      justify-items: start;
    }

    p {
      margin: 0;
      color: var(--muted);
      font-size: 1.0625rem;
    }
  `,
})
export class LoadState {
  readonly errors = input.required<string[]>();
  readonly loading = input.required<string>();
}
