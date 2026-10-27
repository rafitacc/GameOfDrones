using GameOfDrones.Server.Data;
using GameOfDrones.Server.Domain;

namespace GameOfDrones.Tests;

public class MoveRuleSetTests
{
    private static readonly MoveRuleSet DefaultRules = new(DefaultMoves.Rules);

    private static readonly MoveRuleSet CustomRules = new(
    [
        ("Paper", "Rock"),
        ("Rock", "Scissors"),
        ("Scissors", "String"),
        ("String", "Dog"),
        ("Dog", "Paper"),
    ]);

    [Theory]
    [InlineData("Paper", "Rock", PlayerSlot.Player1)]
    [InlineData("Rock", "Scissors", PlayerSlot.Player1)]
    [InlineData("Scissors", "Paper", PlayerSlot.Player1)]
    [InlineData("Rock", "Paper", PlayerSlot.Player2)]
    [InlineData("Scissors", "Rock", PlayerSlot.Player2)]
    [InlineData("Paper", "Scissors", PlayerSlot.Player2)]
    public void Resolve_WithDefaultRules_ReturnsPlayerWhoseMoveKills(string move1, string move2, PlayerSlot expected)
    {
        Assert.Equal(expected, DefaultRules.Resolve(move1, move2));
    }

    [Theory]
    [InlineData("Paper")]
    [InlineData("Rock")]
    [InlineData("Scissors")]
    public void Resolve_WithSameMove_IsTie(string move)
    {
        Assert.Null(DefaultRules.Resolve(move, move));
    }

    [Theory]
    [InlineData("Scissors", "String", PlayerSlot.Player1)]
    [InlineData("Dog", "String", PlayerSlot.Player2)]
    [InlineData("Dog", "Paper", PlayerSlot.Player1)]
    public void Resolve_WithCustomRules_UsesCustomKills(string move1, string move2, PlayerSlot expected)
    {
        Assert.Equal(expected, CustomRules.Resolve(move1, move2));
    }

    [Theory]
    [InlineData("Paper", "String")]
    [InlineData("Rock", "Dog")]
    [InlineData("Scissors", "Paper")]
    public void Resolve_WhenNeitherMoveKillsTheOther_IsTie(string move1, string move2)
    {
        Assert.Null(CustomRules.Resolve(move1, move2));
    }
}
