using GameOfDrones.Server.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GameOfDrones.Server.Data.Configurations;

public class GameConfiguration : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder.HasOne(g => g.Player1)
            .WithMany()
            .HasForeignKey(g => g.Player1Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(g => g.Player2)
            .WithMany()
            .HasForeignKey(g => g.Player2Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(g => g.Winner)
            .WithMany()
            .HasForeignKey(g => g.WinnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(g => g.Rounds)
            .WithOne(r => r.Game)
            .HasForeignKey(r => r.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.ToTable(t => t.HasCheckConstraint(
            "CK_Games_DistinctPlayers", "[Player1Id] <> [Player2Id]"));
    }
}
