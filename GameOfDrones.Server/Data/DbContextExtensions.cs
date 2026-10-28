using GameOfDrones.Server.Exceptions;
using GameOfDrones.Server.Resources;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace GameOfDrones.Server.Data;

public static class DbContextExtensions
{
    /// <summary>SQL Server errors raised when a row breaks a unique index or constraint.</summary>
    private static readonly int[] UniqueViolationNumbers = [2601, 2627];

    /// <summary>
    /// True when another request changed the same data first: it inserted a row with the same
    /// unique key, or updated or deleted a row this request was about to change.
    /// </summary>
    public static bool IsConcurrentChange(this DbUpdateException exception) =>
        exception is DbUpdateConcurrencyException
        || exception.InnerException is SqlException { Number: var number } && UniqueViolationNumbers.Contains(number);

    /// <summary>Saves the changes, or reports a 409 when another request changed the same data first.</summary>
    public static async Task SaveChangesOrConflictAsync(this DbContext db, CancellationToken cancellationToken)
    {
        try
        {
            await db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.IsConcurrentChange())
        {
            throw new ConflictException(Messages.ConcurrentChange);
        }
    }
}
