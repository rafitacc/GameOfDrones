/** Mirrors RuleSetValidator.MinimumMoves in the API. */
export const minimumMoves = 2;

/** Mirrors Move.NameMaxLength in the API. */
export const moveNameMaxLength = 30;

export interface Move {
  name: string;
  kills: string[];
}
