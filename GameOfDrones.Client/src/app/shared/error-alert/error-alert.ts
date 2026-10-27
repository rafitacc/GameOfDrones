import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  template: `
    @if (messages().length) {
      <div class="error-alert" role="alert">
        @for (message of messages(); track message) {
          <p>{{ message }}</p>
        }
      </div>
    }
  `,
  styles: `
    .error-alert {
      padding: 0.75rem 1rem;
      border: 1px solid color-mix(in srgb, var(--danger) 35%, transparent);
      border-radius: 0.75rem;
      background: color-mix(in srgb, var(--danger) 8%, var(--surface));
      color: var(--danger);
      font-weight: 600;
    }

    p {
      margin: 0;
    }

    p + p {
      margin-top: 0.25rem;
    }
  `,
})
export class ErrorAlert {
  readonly messages = input.required<string[]>();
}
