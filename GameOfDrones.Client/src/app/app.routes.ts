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
  { path: '**', redirectTo: '' },
];
