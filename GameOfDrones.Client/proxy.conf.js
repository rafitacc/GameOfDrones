const { env } = require('process');

// ASPNETCORE_URLS is provided by the .NET host (SpaProxy) when it launches the dev server.
const backendUrl = env.ASPNETCORE_URLS?.split(';').find((url) => url.startsWith('http://'));

if (!backendUrl) {
  throw new Error('ASPNETCORE_URLS is not set. Start the app from GameOfDrones.Server (F5 or "dotnet run").');
}

module.exports = {
  '/api': {
    target: backendUrl,
    secure: false,
  },
};
