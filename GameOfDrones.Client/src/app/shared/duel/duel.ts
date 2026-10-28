import { Component, input } from '@angular/core';

export type DuelResult = 'winner' | 'loser' | 'tie';

export interface DuelSide {
  label: string;
  move: string;
  mark: string;
  css: 'player-1' | 'player-2';
  result: DuelResult;
}

export interface DuelVerdict {
  css: string;
  title: string;
  detail: string;
}

/** Matches the moment both cards collide in duel.scss. */
export const duelClashMs = 300;

/** Two moves slam into each other and the verdict appears: used by round results and the 404 page. */
@Component({
  selector: 'app-duel',
  templateUrl: './duel.html',
  styleUrl: './duel.scss',
})
export class Duel {
  readonly sides = input.required<DuelSide[]>();
  readonly verdict = input.required<DuelVerdict>();
}
