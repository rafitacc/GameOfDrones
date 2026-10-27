using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Entities;

namespace GameOfDrones.Server.Services;

public static class RuleSetValidator
{
    public const int MinimumMoves = 2;

    public static IReadOnlyList<string> Validate(IReadOnlyList<MoveDto> moves)
    {
        var errors = new List<string>();

        if (moves.Count < MinimumMoves)
        {
            errors.Add($"At least {MinimumMoves} moves are required.");
        }

        var names = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var name in moves.Select(m => m.Name.Trim()))
        {
            if (name.Length == 0)
            {
                errors.Add("Move names cannot be empty.");
            }
            else if (name.Length > Move.NameMaxLength)
            {
                errors.Add($"Move '{name}' must be at most {Move.NameMaxLength} characters long.");
            }
            else if (!names.Add(name))
            {
                errors.Add($"Move '{name}' is defined more than once.");
            }
        }

        var kills = moves
            .SelectMany(m => m.Kills.Select(k => (Winner: m.Name.Trim(), Loser: k.Trim())))
            .ToList();
        var killKeys = kills.Select(k => Key(k.Winner, k.Loser)).ToHashSet();

        foreach (var (winner, loser) in kills)
        {
            if (!names.Contains(loser))
            {
                errors.Add($"'{winner}' kills '{loser}', which is not a defined move.");
            }
            else if (string.Equals(winner, loser, StringComparison.OrdinalIgnoreCase))
            {
                errors.Add($"'{winner}' cannot kill itself.");
            }
            else if (killKeys.Contains(Key(loser, winner))
                && string.Compare(winner, loser, StringComparison.OrdinalIgnoreCase) < 0)
            {
                errors.Add($"'{winner}' and '{loser}' cannot kill each other.");
            }
        }

        return errors.Distinct().ToList();
    }

    private static (string, string) Key(string winner, string loser) =>
        (winner.ToUpperInvariant(), loser.ToUpperInvariant());
}
