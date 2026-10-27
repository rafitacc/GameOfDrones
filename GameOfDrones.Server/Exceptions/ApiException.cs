namespace GameOfDrones.Server.Exceptions;

/// <summary>
/// Expected error that is returned to the client as ProblemDetails with the given status code.
/// </summary>
public abstract class ApiException(int statusCode, string title, string message) : Exception(message)
{
    public int StatusCode { get; } = statusCode;

    public string Title { get; } = title;
}

public sealed class NotFoundException(string message)
    : ApiException(StatusCodes.Status404NotFound, "Resource not found", message);

public sealed class ConflictException(string message)
    : ApiException(StatusCodes.Status409Conflict, "Request conflicts with the current state", message);

public sealed class RequestValidationException(IReadOnlyList<string> errors)
    : ApiException(StatusCodes.Status400BadRequest, "Invalid request", string.Join(" ", errors))
{
    public IReadOnlyList<string> Errors { get; } = errors;
}
