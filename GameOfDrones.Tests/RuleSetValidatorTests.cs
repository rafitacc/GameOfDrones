using System.Globalization;
using GameOfDrones.Server.Dtos;
using GameOfDrones.Server.Services;

namespace GameOfDrones.Tests;

public class RuleSetValidatorTests
{
    public RuleSetValidatorTests()
    {
        CultureInfo.CurrentUICulture = CultureInfo.GetCultureInfo("en");
    }

    private static MoveDto Move(string name, params string[] kills) => new(name, kills);

    [Fact]
    public void Validate_DefaultRules_HasNoErrors()
    {
        var errors = RuleSetValidator.Validate(
            [Move("Paper", "Rock"), Move("Rock", "Scissors"), Move("Scissors", "Paper")]);

        Assert.Empty(errors);
    }

    [Fact]
    public void Validate_RulesFromTheSpecificationExample_HasNoErrors()
    {
        var errors = RuleSetValidator.Validate(
        [
            Move("Paper", "Rock"),
            Move("Rock", "Scissors"),
            Move("Scissors", "String"),
            Move("String", "Dog"),
            Move("Dog", "Paper"),
        ]);

        Assert.Empty(errors);
    }

    [Fact]
    public void Validate_NamesAreTrimmedAndComparedIgnoringCase()
    {
        var errors = RuleSetValidator.Validate([Move(" Paper ", "rock"), Move("Rock")]);

        Assert.Empty(errors);
    }

    [Fact]
    public void Validate_LessThanTwoMoves_Fails()
    {
        var errors = RuleSetValidator.Validate([Move("Paper")]);

        Assert.Contains("At least 2 moves are required.", errors);
    }

    [Fact]
    public void Validate_EmptyName_Fails()
    {
        var errors = RuleSetValidator.Validate([Move("Paper"), Move("  ")]);

        Assert.Contains("Move names cannot be empty.", errors);
    }

    [Fact]
    public void Validate_NameLongerThanLimit_Fails()
    {
        var errors = RuleSetValidator.Validate([Move("Paper"), Move(new string('a', 31))]);

        Assert.Single(errors);
    }

    [Fact]
    public void Validate_DuplicateNameIgnoringCase_Fails()
    {
        var errors = RuleSetValidator.Validate([Move("Rock"), Move("rock")]);

        Assert.Contains("Move 'rock' is defined more than once.", errors);
    }

    [Fact]
    public void Validate_KillingUnknownMove_Fails()
    {
        var errors = RuleSetValidator.Validate([Move("Paper", "Lizard"), Move("Rock")]);

        Assert.Contains("'Paper' kills 'Lizard', which is not a defined move.", errors);
    }

    [Fact]
    public void Validate_MoveKillingItself_Fails()
    {
        var errors = RuleSetValidator.Validate([Move("Paper", "Paper"), Move("Rock")]);

        Assert.Contains("'Paper' cannot kill itself.", errors);
    }

    [Fact]
    public void Validate_MovesKillingEachOther_FailsOnce()
    {
        var errors = RuleSetValidator.Validate([Move("Paper", "Rock"), Move("Rock", "Paper")]);

        Assert.Equal(["'Paper' and 'Rock' cannot kill each other."], errors);
    }

    [Fact]
    public void Validate_UsesTheCurrentUiCultureForMessages()
    {
        CultureInfo.CurrentUICulture = CultureInfo.GetCultureInfo("es");

        var errors = RuleSetValidator.Validate([Move("Paper", "Paper"), Move("Rock")]);

        Assert.Contains("'Paper' no puede matarse a sí mismo.", errors);
    }
}
