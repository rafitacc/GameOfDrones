using GameOfDrones.Server.Data;
using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Entities;
using GameOfDrones.Server.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace GameOfDrones.Server.Services;

public class MoveService(GameOfDronesDbContext db)
{
    public async Task<IReadOnlyList<MoveDto>> GetAllAsync(CancellationToken cancellationToken) =>
        await db.Moves
            .AsNoTracking()
            .OrderBy(m => m.Id)
            .Select(m => new MoveDto(
                m.Name,
                m.Kills.OrderBy(r => r.LoserMove.Name).Select(r => r.LoserMove.Name).ToList()))
            .ToListAsync(cancellationToken);

    /// <summary>
    /// Replaces the whole rule set in a single transaction. Moves are matched by name
    /// (case-insensitive), so existing moves keep their identity.
    /// </summary>
    public async Task<IReadOnlyList<MoveDto>> ReplaceAllAsync(
        IReadOnlyList<MoveDto> moves, CancellationToken cancellationToken)
    {
        var errors = RuleSetValidator.Validate(moves);
        if (errors.Count > 0)
        {
            throw new RequestValidationException(errors);
        }

        var existing = await db.Moves.Include(m => m.Kills).ToListAsync(cancellationToken);
        var movesByName = new Dictionary<string, Move>(StringComparer.OrdinalIgnoreCase);

        foreach (var name in moves.Select(m => m.Name.Trim()))
        {
            var move = existing.Find(e => string.Equals(e.Name, name, StringComparison.OrdinalIgnoreCase))
                ?? db.Moves.Add(new Move()).Entity;
            move.Name = name;
            movesByName[name] = move;
        }

        foreach (var definition in moves)
        {
            var winner = movesByName[definition.Name.Trim()];
            var losers = definition.Kills.Select(k => movesByName[k.Trim()]).ToHashSet();

            foreach (var rule in winner.Kills.Where(r => !losers.Contains(r.LoserMove)).ToList())
            {
                winner.Kills.Remove(rule);
            }

            foreach (var loser in losers.Where(l => winner.Kills.All(r => r.LoserMove != l)))
            {
                winner.Kills.Add(new MoveRule { WinnerMove = winner, LoserMove = loser });
            }
        }

        var removedMoves = existing.Where(e => !movesByName.ContainsKey(e.Name)).ToList();
        db.MoveRules.RemoveRange(removedMoves.SelectMany(m => m.Kills));
        db.Moves.RemoveRange(removedMoves);

        await db.SaveChangesAsync(cancellationToken);
        return await GetAllAsync(cancellationToken);
    }

    public Task<IReadOnlyList<MoveDto>> ResetAsync(CancellationToken cancellationToken)
    {
        var defaults = DefaultMoves.Names
            .Select(name => new MoveDto(
                name,
                DefaultMoves.Rules.Where(r => r.Winner == name).Select(r => r.Loser).ToList()))
            .ToList();

        return ReplaceAllAsync(defaults, cancellationToken);
    }
}
