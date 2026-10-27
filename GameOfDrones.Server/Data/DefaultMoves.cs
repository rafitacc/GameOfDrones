using System.Collections.Immutable;

namespace GameOfDrones.Server.Data;

public static class DefaultMoves
{
    public static readonly ImmutableArray<string> Names = ["Paper", "Rock", "Scissors"];

    public static readonly ImmutableArray<(string Winner, string Loser)> Rules =
    [
        ("Paper", "Rock"),
        ("Rock", "Scissors"),
        ("Scissors", "Paper"),
    ];
}
