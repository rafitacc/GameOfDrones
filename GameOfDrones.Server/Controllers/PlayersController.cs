using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace GameOfDrones.Server.Controllers;

[ApiController]
[Route("api/players")]
public class PlayersController(PlayerService playerService) : ControllerBase
{
    [HttpGet("stats")]
    public Task<IReadOnlyList<PlayerStatsDto>> GetStats(CancellationToken cancellationToken) =>
        playerService.GetStatsAsync(cancellationToken);
}
