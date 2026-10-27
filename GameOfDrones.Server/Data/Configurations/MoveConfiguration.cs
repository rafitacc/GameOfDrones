using GameOfDrones.Server.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GameOfDrones.Server.Data.Configurations;

public class MoveConfiguration : IEntityTypeConfiguration<Move>
{
    public void Configure(EntityTypeBuilder<Move> builder)
    {
        builder.Property(m => m.Name).HasMaxLength(Move.NameMaxLength);
        builder.HasIndex(m => m.Name).IsUnique();

        var moves = DefaultMoves.Names
            .Select((name, index) => new Move { Id = index + 1, Name = name });
        builder.HasData(moves);
    }
}
