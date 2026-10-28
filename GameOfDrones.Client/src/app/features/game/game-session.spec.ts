import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Game } from '../../core/models/game';
import { Move } from '../../core/models/move';
import { GameSession } from './game-session';

const moves: Move[] = [
  { name: 'Paper', kills: ['Rock'] },
  { name: 'Rock', kills: ['Scissors'] },
  { name: 'Scissors', kills: ['Paper'] },
];

function game(changes: Partial<Game> = {}): Game {
  return {
    id: 7,
    player1Name: 'Ana',
    player2Name: 'Bob',
    player1Wins: 0,
    player2Wins: 0,
    winnerName: null,
    rounds: [],
    ...changes,
  };
}

describe('GameSession', () => {
  let session: GameSession;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), GameSession],
    });
    session = TestBed.inject(GameSession);
    http = TestBed.inject(HttpTestingController);

    session.load(7);
    http.expectOne('/api/games/7').flush(game());
    http.expectOne('/api/moves').flush(moves);
  });

  afterEach(() => http.verify());

  it("keeps player 1's move out of the state until player 2 has picked", () => {
    session.choose('Rock');

    expect(session.stage()).toBe('handoff');
    expect(JSON.stringify(session.game())).not.toContain('Rock');
    http.expectNone('/api/games/7/rounds');

    session.startPlayer2Turn();
    session.choose('Paper');

    const request = http.expectOne('/api/games/7/rounds');
    expect(request.request.body).toEqual({ player1Move: 'Rock', player2Move: 'Paper' });
    request.flush(
      game({
        player2Wins: 1,
        rounds: [{ number: 1, player1Move: 'Rock', player2Move: 'Paper', winnerName: 'Bob' }],
      }),
    );
    expect(session.stage()).toBe('reveal');
    expect(session.roundNumber()).toBe(2);
  });

  it('skips the reveal when the round decides the game', () => {
    session.choose('Rock');
    session.startPlayer2Turn();
    session.choose('Scissors');

    http.expectOne('/api/games/7/rounds').flush(game({ player1Wins: 3, winnerName: 'Ana' }));

    expect(session.stage()).toBe('player2');
    expect(session.game()?.winnerName).toBe('Ana');
  });

  it('starts the round again when another tab played it first', () => {
    session.choose('Rock');
    session.startPlayer2Turn();
    session.choose('Paper');

    http
      .expectOne('/api/games/7/rounds')
      .flush({ detail: 'Someone else changed this.' }, { status: 409, statusText: 'Conflict' });
    const saved = game({
      rounds: [{ number: 1, player1Move: 'Paper', player2Move: 'Paper', winnerName: null }],
    });
    http.expectOne('/api/games/7').flush(saved);

    expect(session.stage()).toBe('player1');
    expect(session.errors()).toEqual(['Someone else changed this.']);
    expect(session.game()).toEqual(saved);
  });

  it('reports a game the API does not know', () => {
    session.load(404);
    http
      .expectOne('/api/games/404')
      .flush({ detail: 'Game 404 does not exist.' }, { status: 404, statusText: 'Not Found' });
    expect(http.expectOne('/api/moves').cancelled).toBe(true);

    expect(session.notFound()).toBe(true);
  });
});
