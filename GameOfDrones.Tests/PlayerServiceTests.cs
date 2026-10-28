using GameOfDrones.Server.Dtos;

namespace GameOfDrones.Tests;

public sealed class PlayerServiceTests : IDisposable
{
    private readonly TestDatabase _database = new();

    public void Dispose() => _database.Dispose();

    private async Task PlayGame(string player1, string player2, string winnerMove, string loserMove)
    {
        var game = await _database.GameService().CreateAsync(
            new CreateGameRequest(player1, player2), CancellationToken.None);
        for (var round = 0; round < 3; round++)
        {
            await _database.GameService().PlayRoundAsync(
                game.Id, new PlayRoundRequest(winnerMove, loserMove), CancellationToken.None);
        }
    }

    [Fact]
    public async Task GetStatsAsync_CountsFinishedGamesOrderedByGamesWon()
    {
        await PlayGame("Ana", "Bob", "Rock", "Scissors");
        await PlayGame("Bob", "Carl", "Rock", "Scissors");
        await PlayGame("Ana", "Bob", "Scissors", "Rock");
        await _database.GameService().CreateAsync(new CreateGameRequest("Dan", "Ana"), CancellationToken.None);

        var stats = await _database.PlayerService().GetStatsAsync(CancellationToken.None);

        Assert.Equal(
        [
            new PlayerStatsDto("Bob", 3, 2),
            new PlayerStatsDto("Ana", 2, 1),
            new PlayerStatsDto("Carl", 1, 0),
        ], stats);
    }
}
