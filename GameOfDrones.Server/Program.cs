using GameOfDrones.Server.Data;
using GameOfDrones.Server.Exceptions;
using GameOfDrones.Server.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("GameOfDrones")
    ?? throw new InvalidOperationException("Connection string 'GameOfDrones' is not configured.");

builder.Services.AddDbContext<GameOfDronesDbContext>(options =>
    options.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure()));

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<GameService>();
builder.Services.AddScoped<MoveService>();
builder.Services.AddScoped<PlayerService>();

string[] supportedCultures = ["en", "es"];
builder.Services.AddRequestLocalization(options => options
    .SetDefaultCulture(supportedCultures[0])
    .AddSupportedCultures(supportedCultures)
    .AddSupportedUICultures(supportedCultures));

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<GameOfDronesDbContext>().Database.Migrate();
}

app.UseRequestLocalization();
app.UseExceptionHandler();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapFallback("/api/{**path}", () => Results.Problem(statusCode: StatusCodes.Status404NotFound));
app.MapFallbackToFile("index.html");

app.Run();
