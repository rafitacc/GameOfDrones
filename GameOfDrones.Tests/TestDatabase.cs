using GameOfDrones.Server.Data;
using GameOfDrones.Server.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace GameOfDrones.Tests;

/// <summary>
/// In-memory SQLite database with the real model and seed data. Each service gets a fresh
/// context, so tests read what was saved instead of what the change tracker remembers.
/// </summary>
public sealed class TestDatabase : IDisposable
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");
    private readonly DbContextOptions<GameOfDronesDbContext> _options;

    public TestDatabase()
    {
        _connection.Open();
        _options = new DbContextOptionsBuilder<GameOfDronesDbContext>().UseSqlite(_connection).Options;
        using var db = CreateContext();
        db.Database.EnsureCreated();
    }

    public GameOfDronesDbContext CreateContext() => new(_options);

    public MoveService MoveService() => new(CreateContext());

    public GameService GameService()
    {
        var db = CreateContext();
        return new GameService(db, new MoveService(db), TimeProvider.System);
    }

    public PlayerService PlayerService() => new(CreateContext());

    public void Dispose() => _connection.Dispose();
}
