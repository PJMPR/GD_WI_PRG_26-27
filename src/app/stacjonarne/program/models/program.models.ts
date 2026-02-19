export interface Subject {
  name: string;
  type: 'M' | 'O';
  code: string;
  lecture: number;
  tutorial: number;
  lab: number;
  form: string;
  ects: number;
  electiveGroup?: string;
}

export interface SemesterSummary {
  ects: number;
  lecture: number;
  tutorial: number;
  lab: number;
}

export interface Semester {
  semester: number;
  summary: SemesterSummary;
  description: string;
  subjects: Subject[];
}

export interface ProgramData {
  semesters: Semester[];
}

export interface ElectiveItem {
  name: string;
  code: string;
  lecture: number;
  tutorial: number;
  lab: number;
  form: string;
  ects: number;
  semester?: number;
}

export interface ElectiveGroup {
  id: string;
  label: string;
  semester: number;
  items: ElectiveItem[];
}

export interface ElectivesOtherData {
  groups: ElectiveGroup[];
}

export interface SpecializationItem extends ElectiveItem {
  semester: number;
}

export interface Specialization {
  name: string;
  items: SpecializationItem[];
}

export interface ElectivesSpecializationsData {
  specializations: Specialization[];
}

export interface SubjectTreeNode {
  data: SubjectRow;
  children?: SubjectTreeNode[];
  leaf?: boolean;
}

export interface SubjectRow {
  name: string;
  type: string;
  code: string;
  lecture: number | string;
  tutorial: number | string;
  lab: number | string;
  form: string;
  ects: number | string;
  isGroup?: boolean;
  electiveGroup?: string;
}

