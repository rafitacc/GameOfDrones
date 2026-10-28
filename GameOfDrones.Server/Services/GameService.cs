using GameOfDrones.Server.Data;
using GameOfDrones.Server.Domain;
using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Entities;
using GameOfDrones.Server.Exceptions;
using GameOfDrones.Server.Resources;
using Microsoft.EntityFrameworkCore;

namespace GameOfDrones.Server.Services;

public class GameService(GameOfDronesDbContext db, MoveService moveService, TimeProvider timeProvider)
{
    public async Task<GameDto> CreateAsync(CreateGameRequest request, CancellationToken cancellationToken)
    {
        var player1Name = request.Player1Name.Trim();
        var player2Name = request.Player2Name.Trim();

        var errors = new List<string>();
        ValidatePlayerName(player1Name, 1, errors);
        ValidatePlayerName(player2Name, 2, errors);
        if (errors.Count == 0 && string.Equals(player1Name, player2Name, StringComparison.OrdinalIgnoreCase))
        {
            errors.Add(Messages.PlayersMustDiffer);
        }

        if (errors.Count > 0)
        {
            throw new RequestValidationException(errors);
        }

        try
        {
            return ToDto(await AddGameAsync(player1Name, player2Name, cancellationToken));
        }
        catch (DbUpdateException exception) when (exception.IsConcurrentChange())
        {
            // Another request created one of these players at the same time, so it exists now.
            db.ChangeTracker.Clear();
            return ToDto(await AddGameAsync(player1Name, player2Name, cancellationToken));
        }
    }

    public async Task<GameDto> GetAsync(int id, CancellationToken cancellationToken) =>
        ToDto(await LoadGameAsync(id, cancellationToken));

    public async Task<GameDto> PlayRoundAsync(int id, PlayRoundRequest request, CancellationToken cancellationToken)
    {
        var game = await LoadGameAsync(id, cancellationToken);
        if (game.WinnerId is not null)
        {
            throw new ConflictException(Messages.GameAlreadyFinished);
        }

        var moves = await moveService.GetAllAsync(cancellationToken);
        var player1Move = FindMoveName(moves, request.Player1Move);
        var player2Move = FindMoveName(moves, request.Player2Move);

        var rules = new MoveRuleSet(moves.SelectMany(m => m.Kills.Select(loser => (m.Name, loser))));
        game.Rounds.Add(new Round
        {
            Number = game.Rounds.Count + 1,
            Player1Move = player1Move,
            Player2Move = player2Move,
            Winner = PlayerIn(game, rules.Resolve(player1Move, player2Move)),
        });

        if (ScoreOf(game).Winner is { } winner)
        {
            game.Winner = PlayerIn(game, winner);
            game.FinishedAt = timeProvider.GetUtcNow().UtcDateTime;
        }

        await db.SaveChangesOrConflictAsync(cancellationToken);
        return ToDto(game);
    }

    private async Task<Game> AddGameAsync(string player1Name, string player2Name, CancellationToken cancellationToken)
    {
        var game = new Game
        {
            Player1 = await FindOrCreatePlayerAsync(player1Name, cancellationToken),
            Player2 = await FindOrCreatePlayerAsync(player2Name, cancellationToken),
            CreatedAt = timeProvider.GetUtcNow().UtcDateTime,
        };
        db.Games.Add(game);
        await db.SaveChangesOrConflictAsync(cancellationToken);
        return game;
    }

    private static void ValidatePlayerName(string name, int playerNumber, List<string> errors)
    {
        if (name.Length == 0)
        {
            errors.Add(string.Format(Messages.PlayerNameRequired, playerNumber));
        }
        else if (name.Length > Player.NameMaxLength)
        {
            errors.Add(string.Format(Messages.PlayerNameTooLong, playerNumber, Player.NameMaxLength));
        }
    }

    private async Task<Player> FindOrCreatePlayerAsync(string name, CancellationToken cancellationToken) =>
        await db.Players.FirstOrDefaultAsync(p => p.Name == name, cancellationToken)
            ?? db.Players.Add(new Player { Name = name }).Entity;

    private async Task<Game> LoadGameAsync(int id, CancellationToken cancellationToken) =>
        await db.Games
            .Include(g => g.Player1)
            .Include(g => g.Player2)
            .Include(g => g.Rounds.OrderBy(r => r.Number))
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken)
            ?? throw new NotFoundException(string.Format(Messages.GameNotFound, id));

    private static string FindMoveName(IReadOnlyList<MoveDto> moves, string requested) =>
        moves.FirstOrDefault(m => string.Equals(m.Name, requested.Trim(), StringComparison.OrdinalIgnoreCase))?.Name
            ?? throw new RequestValidationException([string.Format(Messages.InvalidMove, requested)]);

    private static Player? PlayerIn(Game game, PlayerSlot? slot) => slot switch
    {
        PlayerSlot.Player1 => game.Player1,
        PlayerSlot.Player2 => game.Player2,
        _ => null,
    };

    private static PlayerSlot? SlotOf(Game game, Player? player) =>
        player is null ? null
        : player == game.Player1 ? PlayerSlot.Player1
        : PlayerSlot.Player2;

    private static Score ScoreOf(Game game) => Score.From(game.Rounds.Select(r => SlotOf(game, r.Winner)));

    private static GameDto ToDto(Game game)
    {
        var score = ScoreOf(game);
        return new GameDto(
            game.Id,
            game.Player1.Name,
            game.Player2.Name,
            score.Player1Wins,
            score.Player2Wins,
            game.Winner?.Name,
            game.Rounds
                .Select(r => new RoundDto(r.Number, r.Player1Move, r.Player2Move, r.Winner?.Name))
                .ToList());
    }
}
