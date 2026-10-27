import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { I18n } from '../../../core/i18n/i18n';

/** Shown between both picks so player 2 clearly sees it is their turn before any move is visible. */
@Component({
  selector: 'app-turn-handoff',
  templateUrl: './turn-handoff.html',
  styleUrl: './turn-handoff.scss',
})
export class TurnHandoff {
  protected readonly i18n = inject(I18n);
  private readonly readyButton = viewChild.required<ElementRef<HTMLButtonElement>>('readyButton');

  readonly round = input.required<number>();
  readonly nextPlayer = input.required<string>();
  readonly previousPlayer = input.required<string>();
  readonly ready = output();

  constructor() {
    afterNextRender(() => this.readyButton().nativeElement.focus());
  }
}
