namespace GameOfDrones.Server.Entities;

public class Move
{
    public const int NameMaxLength = 30;

    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ICollection<MoveRule> Kills { get; set; } = [];
}
