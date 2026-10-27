import { TranslationKey } from './en';

export const es: Record<TranslationKey, string> = {
  'app.name': 'Game of Drones',
  'title.home': 'Game of Drones',
  'title.setup': 'Jugadores · Game of Drones',
  'title.game': 'Batalla · Game of Drones',
  'title.winner': 'Ganador · Game of Drones',

  'header.home': 'Inicio de Game of Drones',
  'header.language': 'Idioma',
  'header.theme': 'Tema',
  'theme.system': 'Auto',
  'theme.light': 'Claro',
  'theme.dark': 'Oscuro',

  'home.title': 'Game of Drones',
  'home.tagline': 'Piedra, papel o tijera para dos jugadores en una misma pantalla.',
  'home.howItWorks': 'Cómo se juega',
  'home.step1': 'Los dos jugadores escriben su nombre.',
  'home.step2': 'Cada jugador elige su movimiento mientras el otro no mira.',
  'home.step3': 'Quien gane tres rondas primero se convierte en emperador.',
  'home.start': 'Empezar',

  'setup.title': 'Nombres de los jugadores',
  'setup.player': 'Jugador {number}',
  'setup.nameRequired': 'Escribe un nombre para el Jugador {number}.',
  'setup.start': 'Empezar partida',
  'setup.starting': 'Empezando…',
  'setup.back': 'Volver',

  'game.round': 'Ronda {number}',
  'game.firstTo': 'Gana quien llegue a {wins}',
  'game.turn': 'Turno de {name}',
  'game.lookAway': '{name}, no mires.',
  'game.selectMove': 'Elige tu movimiento',
  'game.lockIn': 'Confirmar movimiento',
  'game.leave': 'Abandonar partida',
  'game.loading': 'Cargando partida…',
  'game.newGame': 'Empezar una partida nueva',

  'handoff.lockedIn': '{name} ya eligió su movimiento',
  'handoff.passTo': 'Pasa la pantalla a {name}.',
  'handoff.ready': 'Soy {name}, mostrar movimientos',

  'reveal.winsRound': '¡{name} gana la ronda!',
  'reveal.kills': '{winnerMove} mata a {loserMove}.',
  'reveal.tie': '¡Empate!',
  'reveal.tieDetail': 'Nadie suma en esta ronda.',
  'reveal.nextRound': 'Siguiente ronda',

  'score.title': 'Marcador',
  'score.round': 'Ronda',
  'score.winner': 'Ganador',
  'score.tie': 'Empate',
  'score.empty': 'Aquí aparecerán los ganadores de cada ronda.',
  'score.wins': '{wins} de {needed} victorias',

  'winner.eyebrow': '¡¡Tenemos un GANADOR!!',
  'winner.title': 'es el nuevo',
  'winner.emperor': '¡EMPERADOR!',
  'winner.rounds': '{rounds} rondas jugadas',
  'winner.playAgain': 'Jugar otra vez',
  'winner.loading': 'Cargando resultado…',

  'error.unexpected': 'Error inesperado. Inténtalo de nuevo.',
  'error.unreachable':
    'No se puede conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
  'error.status': 'El servidor respondió con el error {status}. Inténtalo de nuevo.',
};
