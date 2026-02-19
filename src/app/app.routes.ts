import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'stacjonarne/program',
    loadComponent: () =>
      import('./stacjonarne/program/program.component').then((m) => m.ProgramComponent),
  },
  { path: '', redirectTo: 'stacjonarne/program', pathMatch: 'full' },
];
