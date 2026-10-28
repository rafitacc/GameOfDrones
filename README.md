# Game of Drones

Paper, Rock and Scissors for two players sharing one screen. The first player to win three rounds becomes the new emperor.

Built with **ASP.NET Core (.NET 10)**, **Entity Framework Core** on **SQL Server** and **Angular 22**.

## Features

- **Start → names → rounds → winner → Play again**, following the flow and mocks of the assessment.
- **Hidden moves.** Player 1 picks, a handoff screen asks player 2 to take over, and player 2 picks. Player 1's move is never shown on screen; both moves are sent together.
- **Score next to the round**, with wins per player and a Round / Winner table. Ties count as rounds without a winner.
- **Results are stored.** The Stats screen lists every player with games won and games played.
- **Rules can change at runtime.** Between games, the Rules screen lets you rename, add and remove moves and choose what each move kills, for example the assessment's Paper → Rock → Scissors → String → Dog → Paper. Restore defaults brings back Paper, Rock and Scissors.
- **English and Spanish**, including the API's validation messages, and **light, dark and automatic themes**.
- Responsive from phones to desktops. Animations respect `prefers-reduced-motion`.
- A "Round 404" page for unknown addresses and for games that do not exist.

## Requirements

- **Visual Studio 2026** with the **ASP.NET and web development** workload, including its **SQL Server Express LocalDB** component. Visual Studio 2026 is needed for .NET 10 and the `.slnx` solution format.
- **Node.js** 22.22.3 or later 22.x, 24.15 or later 24.x, or 26 and later. These are the versions Angular 22 supports.

Without Visual Studio you need the **.NET 10 SDK**, Node.js and any SQL Server instance.

## Run it from Visual Studio

1. Open `GameOfDrones.slnx`.
2. Press **F5**. `GameOfDrones.Server` is the startup project.

The first run takes a few minutes. The build runs `npm install` for the client, and the server creates the `GameOfDrones` database in LocalDB, applies the migrations and seeds Paper, Rock and Scissors. Then the browser opens the Angular dev server, which forwards `/api` calls to the API. If Visual Studio asks you to trust the ASP.NET Core development certificate, accept it.

## Run it from the command line

```bash
dotnet run --project GameOfDrones.Server --launch-profile https
```

Then open https://localhost:7017, or http://localhost:5240 with the `http` profile. The server starts the Angular dev server for you (SpaProxy) and redirects the browser to it once it is ready, so there is nothing else to launch.

### Use another SQL Server

`appsettings.Development.json` points to LocalDB. To use another server, for example SQL Server in Docker on macOS or Linux, override the connection string with User Secrets, which stay outside the repository:

```bash
dotnet user-secrets set "ConnectionStrings:GameOfDrones" "Server=localhost,1433;Database=GameOfDrones;User Id=sa;Password=<your password>;TrustServerCertificate=True" --project GameOfDrones.Server
```

## Tests

```bash
dotnet test
```

46 xUnit tests cover the domain (round resolution, the end of a game, rule set validation) and the services against an in-memory SQLite database (games, rounds, rule set replacement and reset, stats).

```bash
cd GameOfDrones.Client
npm test -- --watch=false
```

7 Vitest tests cover the game session (player 1's move stays hidden, the deciding round, conflicts, missing games) and the rules editor (renaming and removing moves keeps the rule set consistent).

## Publish

```bash
dotnet publish GameOfDrones.Server -c Release -o publish
```

Publishing builds the Angular app and copies it to `wwwroot`, so the API also serves the client and the whole game is one deployable app. Set the connection string through the `ConnectionStrings__GameOfDrones` environment variable or your host's configuration. Migrations run on startup.

## Project structure

```
GameOfDrones.slnx
├── GameOfDrones.Server/    ASP.NET Core API
│   ├── Controllers/        games, moves, player stats
│   ├── Services/           game flow, rule set replacement and validation, stats
│   ├── Domain/             round resolution and score, without database code
│   ├── Data/               DbContext, entity configurations, seed, migrations
│   ├── Entities/ Dtos/
│   ├── Exceptions/         API errors returned as ProblemDetails
│   └── Resources/          English and Spanish messages
├── GameOfDrones.Client/    Angular app
│   └── src/app/
│       ├── core/           API clients, models, translations, theme
│       ├── features/       home, setup, game, winner, rules, stats, not-found
│       └── shared/         header, duel animation, alerts, loading state…
└── GameOfDrones.Tests/     xUnit tests
```

## API

| Method | Route                    | Description                                                      |
| ------ | ------------------------ | ---------------------------------------------------------------- |
| POST   | `/api/games`             | Starts a game for two players, creating them if they are new     |
| GET    | `/api/games/{id}`        | Game state: players, rounds, score and winner                    |
| POST   | `/api/games/{id}/rounds` | Plays a round with both moves and returns the updated game       |
| GET    | `/api/moves`             | Moves and what each one kills                                    |
| PUT    | `/api/moves`             | Replaces the whole rule set in one transaction, after validation |
| POST   | `/api/moves/reset`       | Restores Paper, Rock and Scissors                                |
| GET    | `/api/players/stats`     | Games won and played per player, ordered by games won            |

Errors are `ProblemDetails` in the language of the `Accept-Language` header: 400 for invalid input, 404 for an unknown game, 409 when the game has finished or another request changed the same data first.

## Design decisions

- **The server is the referee.** It resolves every round with the rules stored in the database and keeps the score. The client never decides who won.
- **A rule set is replaced as a whole.** `PUT /api/moves` checks the complete set first (at least two moves, unique names, known targets, no move killing itself, no two moves killing each other) and then saves it in one transaction.
- **Rounds store move names, not move ids**, so editing or deleting moves never changes past games.
- **Concurrent requests do not corrupt data.** Unique indexes guard rounds and players. A collision becomes a 409, and the game screen reloads the score and asks for the round again.
- **One deployable app.** In development SpaProxy starts the Angular dev server. On publish the API serves the built client, and unknown `/api` routes return a 404 ProblemDetails instead of the Angular page.
- **No secrets in the repository.** Only the LocalDB connection string, which has none, is committed for F5. Other environments use User Secrets or environment variables.
- `System.Security.Cryptography.Pkcs` is referenced explicitly to replace a vulnerable version that SQL Server's client library pulls in. For the same reason, `package.json` overrides the Vite version that Angular's build tools pin.

## Known limitations

- There are no accounts: anyone who opens the app can change the rules.
- A game left halfway and reopened by its address continues with the rules that are current at that moment.
- Player names are compared without case through SQL Server's default case-insensitive collation.
- The 404 page is part of the Angular app, so the server answers unknown pages with HTTP 200 and the app shows the 404.
