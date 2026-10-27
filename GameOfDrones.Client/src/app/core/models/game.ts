/** Mirrors Score.WinsToFinish in the API. */
export const winsToFinish = 3;

export interface Round {
  number: number;
  player1Move: string;
  player2Move: string;
  winnerName: string | null;
}

export interface Game {
  id: number;
  player1Name: string;
  player2Name: string;
  player1Wins: number;
  player2Wins: number;
  winnerName: string | null;
  rounds: Round[];
}
