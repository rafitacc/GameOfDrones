using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace GameOfDrones.Tests;

public sealed class GameServiceTests : IDisposable
{
    private readonly TestDatabase _database = new();

    public void Dispose() => _database.Dispose();

    private Task<GameDto> CreateGame(string player1 = "Ana", string player2 = "Bob") =>
        _database.GameService().CreateAsync(new CreateGameRequest(player1, player2), CancellationToken.None);

    private Task<GameDto> Play(int gameId, string player1Move, string player2Move) =>
        _database.GameService().PlayRoundAsync(
            gameId, new PlayRoundRequest(player1Move, player2Move), CancellationToken.None);

    [Fact]
    public async Task CreateAsync_TrimsNamesAndReusesExistingPlayers()
    {
        var first = await CreateGame("  Ana ", "Bob");
        await CreateGame("Ana", "Carl");

        await using var db = _database.CreateContext();
        Assert.Equal("Ana", first.Player1Name);
        Assert.Equal(["Ana", "Bob", "Carl"], await db.Players.OrderBy(p => p.Name).Select(p => p.Name).ToListAsync());
    }

    [Theory]
    [InlineData("", "Bob")]
    [InlineData("Ana", "   ")]
    [InlineData("Ana", "ana")]
    public async Task CreateAsync_InvalidNames_Fails(string player1, string player2)
    {
        await Assert.ThrowsAsync<RequestValidationException>(() => CreateGame(player1, player2));
    }

    [Fact]
    public async Task PlayRoundAsync_TieCountsAsRoundWithoutWinner()
    {
        var game = await CreateGame();

        game = await Play(game.Id, "Rock", "rock");

        var round = Assert.Single(game.Rounds);
        Assert.Equal(("Rock", "Rock", null), (round.Player1Move, round.Player2Move, round.WinnerName));
        Assert.Equal((0, 0), (game.Player1Wins, game.Player2Wins));
    }

    [Fact]
    public async Task PlayRoundAsync_ThirdWinFinishesTheGame()
    {
        var game = await CreateGame();

        await Play(game.Id, "Paper", "Rock");
        await Play(game.Id, "Rock", "Paper");
        await Play(game.Id, "Rock", "Scissors");
        game = await Play(game.Id, "Scissors", "Paper");

        Assert.Equal("Ana", game.WinnerName);
        Assert.Equal((3, 1), (game.Player1Wins, game.Player2Wins));
        await using var db = _database.CreateContext();
        Assert.NotNull((await db.Games.SingleAsync()).FinishedAt);
    }

    [Fact]
    public async Task PlayRoundAsync_FinishedGame_IsAConflict()
    {
        var game = await CreateGame();
        for (var round = 0; round < 3; round++)
        {
            await Play(game.Id, "Rock", "Scissors");
        }

        await Assert.ThrowsAsync<ConflictException>(() => Play(game.Id, "Rock", "Scissors"));
    }

    [Fact]
    public async Task PlayRoundAsync_UnknownMove_Fails()
    {
        var game = await CreateGame();

        await Assert.ThrowsAsync<RequestValidationException>(() => Play(game.Id, "Laser", "Rock"));
    }

    [Fact]
    public async Task PlayRoundAsync_UsesTheRulesSavedAtThatMoment()
    {
        var game = await CreateGame();
        await _database.MoveService().ReplaceAllAsync(
        [
            new MoveDto("Paper", ["Rock"]),
            new MoveDto("Rock", ["Scissors"]),
            new MoveDto("Scissors", ["String"]),
            new MoveDto("String", ["Dog"]),
            new MoveDto("Dog", ["Paper"]),
        ], CancellationToken.None);

        game = await Play(game.Id, "Scissors", "String");
        game = await Play(game.Id, "Scissors", "Paper");

        Assert.Equal(["Ana", null], game.Rounds.Select(r => r.WinnerName));
    }

    [Fact]
    public async Task GetAsync_UnknownGame_IsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(
            () => _database.GameService().GetAsync(404, CancellationToken.None));
    }
}
