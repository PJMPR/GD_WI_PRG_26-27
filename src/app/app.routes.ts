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
  {
    path: 'pdf-viewer',
    loadComponent: () =>
      import('./pdf-viewer/pdf-viewer.component').then((m) => m.PdfViewerComponent),
  },
  { path: '', redirectTo: 'stacjonarne/program', pathMatch: 'full' },
];
