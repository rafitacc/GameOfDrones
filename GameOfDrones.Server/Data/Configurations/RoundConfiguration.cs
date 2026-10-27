using GameOfDrones.Server.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GameOfDrones.Server.Data.Configurations;

public class RoundConfiguration : IEntityTypeConfiguration<Round>
{
    public void Configure(EntityTypeBuilder<Round> builder)
    {
        builder.Property(r => r.Player1Move).HasMaxLength(Move.NameMaxLength);
        builder.Property(r => r.Player2Move).HasMaxLength(Move.NameMaxLength);
        builder.HasIndex(r => new { r.GameId, r.Number }).IsUnique();

        builder.HasOne(r => r.Winner)
            .WithMany()
            .HasForeignKey(r => r.WinnerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
