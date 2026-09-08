/**
 * Medical Laboratory Technology LMS Curriculum Types
 * Bangladesh Diploma (Annual 1st-4th Year) & B.Sc. (Semester 1st-8th / Part I-IV)
 */

export type ProgramLevel = "DIPLOMA" | "BSC";

export interface Program {
  id: string;
  name: string;
  code: string;
  level: ProgramLevel;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CurriculumVersion {
  id: string;
  programId: string;
  versionCode: string; // e.g. "DMT-2023-V1", "BSC-LT-2024-V2"
  title: string;
  effectiveFrom: string;
  isActive: boolean;
  createdAt: string;
}

export interface AcademicYear {
  id: string;
  programId: string;
  name: string; // "1st Year", "2nd Year", "3rd Year", "4th Year"
  sequence: number;
  isActive: boolean;
}

export interface Semester {
  id: string;
  programId: string;
  academicYearId: string;
  name: string; // "1st Semester", "2nd Semester", etc. (Nullable for Annual/Part programs)
  sequence: number;
  isActive: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string; // e.g. "HEM-101", "MIC-201", "BIO-102"
  description?: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface CurriculumSubjectMapping {
  id: string;
  curriculumVersionId: string;
  programId: string;
  academicYearId: string;
  semesterId?: string | null;
  subjectId: string;
  displayOrder: number;
  subject?: Subject;
}

export interface Unit {
  id: string;
  subjectId: string;
  name: string;
  displayOrder: number;
}

export interface Topic {
  id: string;
  unitId: string;
  name: string;
  displayOrder: number;
}

export type LessonStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  slug: string;
  description?: string;
  content: string; // Markdown / Rich content
  videoUrl?: string;
  durationMinutes: number;
  isFree: boolean;
  status: LessonStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ResourceType = "PDF" | "VIDEO" | "IMAGE" | "DOCUMENT" | "LINK";

export interface Resource {
  id: string;
  lessonId: string;
  title: string;
  type: ResourceType;
  fileUrl?: string;
  externalUrl?: string;
  displayOrder: number;
}

export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: ProgressStatus;
  progressPercent: number;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}
