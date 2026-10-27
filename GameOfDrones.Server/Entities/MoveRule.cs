namespace GameOfDrones.Server.Entities;

public class MoveRule
{
    public int WinnerMoveId { get; set; }

    public Move WinnerMove { get; set; } = null!;

    public int LoserMoveId { get; set; }

    public Move LoserMove { get; set; } = null!;
}
