using GameOfDrones.Server.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GameOfDrones.Server.Data.Configurations;

public class MoveRuleConfiguration : IEntityTypeConfiguration<MoveRule>
{
    public void Configure(EntityTypeBuilder<MoveRule> builder)
    {
        builder.HasKey(r => new { r.WinnerMoveId, r.LoserMoveId });

        builder.HasOne(r => r.WinnerMove)
            .WithMany(m => m.Kills)
            .HasForeignKey(r => r.WinnerMoveId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.LoserMove)
            .WithMany()
            .HasForeignKey(r => r.LoserMoveId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ToTable(t => t.HasCheckConstraint(
            "CK_MoveRules_NoSelfKill", "[WinnerMoveId] <> [LoserMoveId]"));

        var rules = DefaultMoves.Rules.Select(rule => new MoveRule
        {
            WinnerMoveId = SeedId(rule.Winner),
            LoserMoveId = SeedId(rule.Loser),
        });
        builder.HasData(rules);
    }

    private static int SeedId(string moveName) => DefaultMoves.Names.IndexOf(moveName) + 1;
}
