using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace GameOfDrones.Server.Controllers;

[ApiController]
[Route("api/moves")]
public class MovesController(MoveService moveService) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<MoveDto>> GetAll(CancellationToken cancellationToken) =>
        moveService.GetAllAsync(cancellationToken);

    [HttpPut]
    public Task<IReadOnlyList<MoveDto>> ReplaceAll(
        IReadOnlyList<MoveDto> moves, CancellationToken cancellationToken) =>
        moveService.ReplaceAllAsync(moves, cancellationToken);

    [HttpPost("reset")]
    public Task<IReadOnlyList<MoveDto>> Reset(CancellationToken cancellationToken) =>
        moveService.ResetAsync(cancellationToken);
}
