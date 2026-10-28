using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Entities;
using GameOfDrones.Server.Resources;

namespace GameOfDrones.Server.Services;

public static class RuleSetValidator
{
    public const int MinimumMoves = 2;

    public static IReadOnlyList<string> Validate(IReadOnlyList<MoveDto> moves)
    {
        var errors = new List<string>();

        if (moves.Count < MinimumMoves)
        {
            errors.Add(string.Format(Messages.MinimumMoves, MinimumMoves));
        }

        var names = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var name in moves.Select(m => m.Name.Trim()))
        {
            if (name.Length == 0)
            {
                errors.Add(Messages.MoveNameRequired);
            }
            else if (name.Length > Move.NameMaxLength)
            {
                errors.Add(string.Format(Messages.MoveNameTooLong, name, Move.NameMaxLength));
            }
            else if (!names.Add(name))
            {
                errors.Add(string.Format(Messages.MoveDefinedTwice, name));
            }
        }

        var kills = moves
            .SelectMany(m => m.Kills.Select(k => (Winner: m.Name.Trim(), Loser: k?.Trim() ?? string.Empty)))
            .ToList();
        var killKeys = kills.Select(k => Key(k.Winner, k.Loser)).ToHashSet();

        foreach (var (winner, loser) in kills)
        {
            if (!names.Contains(loser))
            {
                errors.Add(string.Format(Messages.MoveKillsUnknownMove, winner, loser));
            }
            else if (string.Equals(winner, loser, StringComparison.OrdinalIgnoreCase))
            {
                errors.Add(string.Format(Messages.MoveKillsItself, winner));
            }
            else if (killKeys.Contains(Key(loser, winner))
                && string.Compare(winner, loser, StringComparison.OrdinalIgnoreCase) < 0)
            {
                errors.Add(string.Format(Messages.MovesKillEachOther, winner, loser));
            }
        }

        return errors.Distinct().ToList();
    }

    private static (string, string) Key(string winner, string loser) =>
        (winner.ToUpperInvariant(), loser.ToUpperInvariant());
}
