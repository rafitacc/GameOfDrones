namespace GameOfDrones.Server.Entities;

/// <summary>
/// Moves are stored by name so the game history stays intact when the move rules are edited.
/// </summary>
public class Round
{
    public int Id { get; set; }

    public int GameId { get; set; }

    public Game Game { get; set; } = null!;

    public int Number { get; set; }

    public string Player1Move { get; set; } = string.Empty;

    public string Player2Move { get; set; } = string.Empty;

    public int? WinnerId { get; set; }

    public Player? Winner { get; set; }
}
