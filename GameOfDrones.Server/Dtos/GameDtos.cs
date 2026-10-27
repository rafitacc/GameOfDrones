namespace GameOfDrones.Server.Dtos;

public record CreateGameRequest(string Player1Name, string Player2Name);

public record PlayRoundRequest(string Player1Move, string Player2Move);

public record RoundDto(int Number, string Player1Move, string Player2Move, string? WinnerName);

public record GameDto(
    int Id,
    string Player1Name,
    string Player2Name,
    int Player1Wins,
    int Player2Wins,
    string? WinnerName,
    IReadOnlyList<RoundDto> Rounds);
