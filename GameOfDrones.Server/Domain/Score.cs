namespace GameOfDrones.Server.Domain;

public sealed record Score(int Player1Wins, int Player2Wins)
{
    public const int WinsToFinish = 3;

    public PlayerSlot? Winner =>
        Player1Wins >= WinsToFinish ? PlayerSlot.Player1
        : Player2Wins >= WinsToFinish ? PlayerSlot.Player2
        : null;

    public static Score From(IEnumerable<PlayerSlot?> roundWinners)
    {
        var winners = roundWinners.ToList();
        return new Score(
            winners.Count(w => w == PlayerSlot.Player1),
            winners.Count(w => w == PlayerSlot.Player2));
    }
}
