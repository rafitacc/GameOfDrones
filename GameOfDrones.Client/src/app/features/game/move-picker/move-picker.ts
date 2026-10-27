import { Component, inject, input, linkedSignal, output } from '@angular/core';
import { I18n } from '../../../core/i18n/i18n';
import { Move } from '../../../core/models/move';

/**
 * Move selection used for both players. The selection resets to the first move
 * whenever the player changes, so the previous player's choice is never shown.
 */
@Component({
  selector: 'app-move-picker',
  templateUrl: './move-picker.html',
  styleUrl: './move-picker.scss',
})
export class MovePicker {
  protected readonly i18n = inject(I18n);

  readonly playerName = input.required<string>();
  readonly moves = input.required<Move[]>();
  readonly disabled = input(false);
  readonly chosen = output<string>();

  protected readonly selected = linkedSignal({
    source: () => ({ player: this.playerName(), moves: this.moves() }),
    computation: ({ moves }) => moves[0]?.name ?? null,
  });

  protected confirm(event: SubmitEvent): void {
    event.preventDefault();
    const move = this.selected();
    if (move !== null) {
      this.chosen.emit(move);
    }
  }
}
