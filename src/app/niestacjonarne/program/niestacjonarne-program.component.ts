import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

import { NiestacjonarneProgramService, SemesterViewModel } from './services/niestacjonarne-program.service';
import { SubjectRow } from '../../stacjonarne/program/models/program.models';

@Component({
  selector: 'app-niestacjonarne-program',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    TabsModule,
    TreeTableModule,
    ButtonModule,
    DialogModule,
    TagModule,
  ],
  templateUrl: './niestacjonarne-program.component.html',
  styleUrl: './niestacjonarne-program.component.css',
})
export class NiestacjonarneProgramComponent implements OnInit {
  semesters = signal<SemesterViewModel[]>([]);
  loading = signal(true);

  totals = computed(() => {
    const data = this.semesters();
    return {
      ects:     data.reduce((s, sem) => s + sem.totalEcts, 0),
      lecture:  data.reduce((s, sem) => s + sem.totalLecture, 0),
      tutorial: data.reduce((s, sem) => s + sem.totalTutorial, 0),
      lab:      data.reduce((s, sem) => s + sem.totalLab, 0),
    };
  });

  dialogVisible = signal(false);
  dialogTitle = signal('');
  selectedSubject = signal<SubjectRow | null>(null);

  constructor(private programService: NiestacjonarneProgramService) {}

  ngOnInit(): void {
    this.programService.loadAll().subscribe({
      next: (data) => {
        this.semesters.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Błąd ładowania danych programu niestacjonarnego:', err);
        this.loading.set(false);
      },
    });
  }

  openDetails(subject: SubjectRow): void {
    this.selectedSubject.set(subject);
    this.dialogTitle.set(subject.name);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.selectedSubject.set(null);
  }

  getTypeLabel(type: string): string {
    if (type === 'M') return 'Obowiązkowy';
    if (type === 'O') return 'Obieralny';
    return type;
  }
}

