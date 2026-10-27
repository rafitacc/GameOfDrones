import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'title.home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'players',
    title: 'title.setup',
    loadComponent: () => import('./features/setup/setup').then((m) => m.Setup),
  },
  {
    path: 'games/:id',
    title: 'title.game',
    loadComponent: () => import('./features/game/game').then((m) => m.GamePage),
  },
  {
    path: 'games/:id/winner',
    title: 'title.winner',
    loadComponent: () => import('./features/winner/winner').then((m) => m.Winner),
  },
  { path: '**', redirectTo: '' },
];
