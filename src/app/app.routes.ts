import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'stacjonarne/program',
    loadComponent: () =>
      import('./stacjonarne/program/program.component').then((m) => m.ProgramComponent),
  },
  {
    path: 'niestacjonarne/program',
    loadComponent: () =>
      import('./niestacjonarne/program/niestacjonarne-program.component').then((m) => m.NiestacjonarneProgramComponent),
  },
  { path: '', redirectTo: 'stacjonarne/program', pathMatch: 'full' },
];
