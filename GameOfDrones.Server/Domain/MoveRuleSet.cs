namespace GameOfDrones.Server.Domain;

public sealed class MoveRuleSet(IEnumerable<(string Winner, string Loser)> kills)
{
    private readonly HashSet<(string Winner, string Loser)> _kills = [.. kills];

    /// <summary>
    /// Returns the slot of the player whose move kills the other one, or null when neither does.
    /// </summary>
    public PlayerSlot? Resolve(string player1Move, string player2Move)
    {
        if (_kills.Contains((player1Move, player2Move)))
        {
            return PlayerSlot.Player1;
        }

        if (_kills.Contains((player2Move, player1Move)))
        {
            return PlayerSlot.Player2;
        }

        return null;
    }
}
