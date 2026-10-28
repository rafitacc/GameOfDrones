using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Exceptions;

namespace GameOfDrones.Tests;

public sealed class MoveServiceTests : IDisposable
{
    private readonly TestDatabase _database = new();

    public void Dispose() => _database.Dispose();

    private static string Describe(IEnumerable<MoveDto> moves) =>
        string.Join("; ", moves.Select(m => $"{m.Name}>{string.Join(",", m.Kills)}"));

    [Fact]
    public async Task GetAllAsync_ReturnsTheSeededDefaults()
    {
        var moves = await _database.MoveService().GetAllAsync(CancellationToken.None);

        Assert.Equal("Paper>Rock; Rock>Scissors; Scissors>Paper", Describe(moves));
    }

    [Fact]
    public async Task ReplaceAllAsync_AddsRemovesAndRewiresMoves()
    {
        await _database.MoveService().ReplaceAllAsync(
        [
            new MoveDto(" Paper ", ["Dog"]),
            new MoveDto("Dog", ["Rock"]),
            new MoveDto("Rock", ["Paper"]),
        ], CancellationToken.None);

        var moves = await _database.MoveService().GetAllAsync(CancellationToken.None);
        Assert.Equal("Paper>Dog; Rock>Paper; Dog>Rock", Describe(moves));
    }

    [Fact]
    public async Task ReplaceAllAsync_InvalidSet_ChangesNothing()
    {
        var error = await Assert.ThrowsAsync<RequestValidationException>(() =>
            _database.MoveService().ReplaceAllAsync(
                [new MoveDto("Paper", ["Rock"]), new MoveDto("Rock", ["Paper", null!])],
                CancellationToken.None));

        Assert.Equal(2, error.Errors.Count);
        var moves = await _database.MoveService().GetAllAsync(CancellationToken.None);
        Assert.Equal("Paper>Rock; Rock>Scissors; Scissors>Paper", Describe(moves));
    }

    [Fact]
    public async Task ResetAsync_RestoresTheDefaults()
    {
        await _database.MoveService().ReplaceAllAsync(
            [new MoveDto("String", ["Dog"]), new MoveDto("Dog", [])], CancellationToken.None);

        var moves = await _database.MoveService().ResetAsync(CancellationToken.None);

        Assert.Equal("Paper>Rock; Rock>Scissors; Scissors>Paper", Describe(moves));
    }

    [Fact]
    public async Task ReplaceAllAsync_RemovingAPlayedMove_KeepsTheGameHistory()
    {
        var game = await _database.GameService().CreateAsync(
            new CreateGameRequest("Ana", "Bob"), CancellationToken.None);
        await _database.GameService().PlayRoundAsync(
            game.Id, new PlayRoundRequest("Scissors", "Paper"), CancellationToken.None);

        await _database.MoveService().ReplaceAllAsync(
            [new MoveDto("Paper", ["Rock"]), new MoveDto("Rock", [])], CancellationToken.None);

        var round = Assert.Single((await _database.GameService().GetAsync(game.Id, CancellationToken.None)).Rounds);
        Assert.Equal(("Scissors", "Ana"), (round.Player1Move, round.WinnerName));
    }
}
