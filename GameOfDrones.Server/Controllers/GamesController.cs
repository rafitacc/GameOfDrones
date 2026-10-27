using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace GameOfDrones.Server.Controllers;

[ApiController]
[Route("api/games")]
public class GamesController(GameService gameService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<GameDto>> Create(CreateGameRequest request, CancellationToken cancellationToken)
    {
        var game = await gameService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = game.Id }, game);
    }

    [HttpGet("{id:int}")]
    public Task<GameDto> Get(int id, CancellationToken cancellationToken) =>
        gameService.GetAsync(id, cancellationToken);

    [HttpPost("{id:int}/rounds")]
    public Task<GameDto> PlayRound(int id, PlayRoundRequest request, CancellationToken cancellationToken) =>
        gameService.PlayRoundAsync(id, request, cancellationToken);
}
