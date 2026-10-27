namespace GameOfDrones.Server.Entities;

public class Player
{
    public const int NameMaxLength = 50;

    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
}
