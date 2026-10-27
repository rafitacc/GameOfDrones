export const en = {
  'app.name': 'Game of Drones',
  'title.home': 'Game of Drones',
  'title.setup': 'Players · Game of Drones',
  'title.game': 'Battle · Game of Drones',
  'title.winner': 'Winner · Game of Drones',

  'header.home': 'Game of Drones home',
  'header.language': 'Language',
  'header.theme': 'Theme',
  'theme.system': 'Auto',
  'theme.light': 'Light',
  'theme.dark': 'Dark',

  'home.title': 'Game of Drones',
  'home.tagline': 'Paper, Rock and Scissors for two players sharing one screen.',
  'home.howItWorks': 'How it works',
  'home.step1': 'Both players enter their names.',
  'home.step2': 'Each player picks a move while the other looks away.',
  'home.step3': 'The first to win three rounds becomes emperor.',
  'home.start': 'Start',

  'setup.title': "Enter players' names",
  'setup.player': 'Player {number}',
  'setup.nameRequired': 'Enter a name for Player {number}.',
  'setup.start': 'Start game',
  'setup.starting': 'Starting…',
  'setup.back': 'Back',

  'game.round': 'Round {number}',
  'game.firstTo': 'First to {wins} wins',
  'game.turn': "{name}'s turn",
  'game.lookAway': '{name}, look away.',
  'game.selectMove': 'Select your move',
  'game.lockIn': 'Lock in move',
  'game.leave': 'Leave game',
  'game.loading': 'Loading game…',
  'game.newGame': 'Start a new game',

  'handoff.lockedIn': '{name} has locked in a move',
  'handoff.passTo': 'Pass the screen to {name}.',
  'handoff.ready': "I'm {name}, show my moves",

  'reveal.winsRound': '{name} wins the round!',
  'reveal.kills': '{winnerMove} kills {loserMove}.',
  'reveal.tie': "It's a tie!",
  'reveal.tieDetail': 'Nobody scores this round.',
  'reveal.nextRound': 'Next round',

  'score.title': 'Score',
  'score.round': 'Round',
  'score.winner': 'Winner',
  'score.tie': 'Tie',
  'score.empty': 'Round winners will appear here.',
  'score.wins': '{wins} of {needed} wins',

  'winner.eyebrow': 'We have a WINNER!!',
  'winner.title': 'is the new',
  'winner.emperor': 'EMPEROR!',
  'winner.rounds': '{rounds} rounds played',
  'winner.playAgain': 'Play again',
  'winner.loading': 'Loading result…',

  'error.unexpected': 'Unexpected error. Try again.',
  'error.unreachable': 'The server cannot be reached. Check your connection and try again.',
  'error.status': 'The server answered with error {status}. Try again.',
};

export type TranslationKey = keyof typeof en;
