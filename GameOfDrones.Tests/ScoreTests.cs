using GameOfDrones.Server.Domain;

namespace GameOfDrones.Tests;

public class ScoreTests
{
    [Fact]
    public void From_CountsWinsPerPlayerAndIgnoresTies()
    {
        var score = Score.From([PlayerSlot.Player1, null, PlayerSlot.Player2, PlayerSlot.Player1, null]);

        Assert.Equal(new Score(2, 1), score);
        Assert.Null(score.Winner);
    }

    [Fact]
    public void Winner_IsPlayer1_AfterThreeWins()
    {
        var score = Score.From([PlayerSlot.Player1, PlayerSlot.Player2, PlayerSlot.Player1, null, PlayerSlot.Player1]);

        Assert.Equal(PlayerSlot.Player1, score.Winner);
    }

    [Fact]
    public void Winner_IsPlayer2_AfterThreeWins()
    {
        var score = Score.From([PlayerSlot.Player2, PlayerSlot.Player2, PlayerSlot.Player2]);

        Assert.Equal(PlayerSlot.Player2, score.Winner);
    }

    [Fact]
    public void Winner_IsNull_WhenOnlyTiesWerePlayed()
    {
        var score = Score.From([null, null, null, null]);

        Assert.Null(score.Winner);
    }
}
