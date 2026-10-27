namespace GameOfDrones.Server.Dtos;

public record MoveDto(string Name, IReadOnlyList<string> Kills);
