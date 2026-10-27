using GameOfDrones.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace GameOfDrones.Server.Data;

public class GameOfDronesDbContext(DbContextOptions<GameOfDronesDbContext> options) : DbContext(options)
{
    public DbSet<Player> Players => Set<Player>();

    public DbSet<Move> Moves => Set<Move>();

    public DbSet<MoveRule> MoveRules => Set<MoveRule>();

    public DbSet<Game> Games => Set<Game>();

    public DbSet<Round> Rounds => Set<Round>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(GameOfDronesDbContext).Assembly);
    }
}
