using GameOfDrones.Server.Data;
using GameOfDrones.Server.Dtos;
using Microsoft.EntityFrameworkCore;

namespace GameOfDrones.Server.Services;

public class PlayerService(GameOfDronesDbContext db)
{
    public async Task<IReadOnlyList<PlayerStatsDto>> GetStatsAsync(CancellationToken cancellationToken) =>
        await db.Players
            .AsNoTracking()
            .Select(p => new
            {
                p.Name,
                GamesPlayed = db.Games.Count(g => g.WinnerId != null && (g.Player1Id == p.Id || g.Player2Id == p.Id)),
                GamesWon = db.Games.Count(g => g.WinnerId == p.Id),
            })
            .Where(s => s.GamesPlayed > 0)
            .OrderByDescending(s => s.GamesWon)
            .ThenBy(s => s.Name)
            .Select(s => new PlayerStatsDto(s.Name, s.GamesPlayed, s.GamesWon))
            .ToListAsync(cancellationToken);
}
