"use client";

import * as React from "react";
import { ProgramLevel, CURRICULUM_SUBJECTS_CATALOG } from "./academic-context";

export interface StudentBenchSOP {
  code: string;
  name: string;
  score: string;
  eval: string;
  evaluator: string;
  date: string;
}

export interface StudentActivityEvent {
  id: string;
  type: "EXAM" | "PRACTICAL" | "LESSON" | "CERTIFICATE" | "ATTENDANCE";
  title: string;
  desc: string;
  time: string;
  device: string;
  ip: string;
  status: string;
  timestamp: number;
}

export interface SubjectTaskAudit {
  code: string;
  name: string;
  completedTasks: number;
  totalTasks: number;
  avgQuizScore: number;
  isCompleted: boolean;
  lastStudied: string;
}

export interface EnrollmentEligibilityResult {
  isEligible: boolean;
  completionPct: number;
  completedSubjectsCount: number;
  totalSubjectsCount: number;
  totalTasksCount: number;
  completedTasksCount: number;
  cumulativeScore: number;
  recommendedGrade: string;
  subjects: SubjectTaskAudit[];
  missingRequirements: string[];
}

export interface StudentStudyRecord {
  studentId: string;
  program: ProgramLevel;
  year: string;
  completedLessonIds: string[];
  subjectTasks: Record<string, { completedTasks: number; totalTasks: number; avgQuizScore: number; isCompleted: boolean; lastStudied: string }>;
  benchSops: StudentBenchSOP[];
  activities: StudentActivityEvent[];
}

const STORAGE_KEY = "labtutor_student_study_progress_v2";

// Default diagnostic bench competencies (ISO 15189 Aligned)
export const DEFAULT_BENCH_COMPETENCIES: StudentBenchSOP[] = [
  {
    code: "SOP-HEM-01",
    name: "Automated CBC & Manual Differential Leukocyte Count (DLC)",
    score: "94/100",
    eval: "Exemplary",
    evaluator: "Dr. Sabrina Parvin (Hematology Wing)",
    date: "2026-09-02",
  },
  {
    code: "SOP-MIC-04",
    name: "Primary Specimen Inoculation & Standard Gram Stain Diagnostic",
    score: "88/100",
    eval: "Proficient",
    evaluator: "MD. Arif Hossain (Microbiology)",
    date: "2026-08-28",
  },
  {
    code: "SOP-BIO-02",
    name: "Kinetic Enzyme Photometry & Daily Quality Control Charting",
    score: "92/100",
    eval: "Exemplary",
    evaluator: "Prof. Nasreen Akhter (Biochemistry)",
    date: "2026-08-22",
  },
  {
    code: "SOP-PTH-07",
    name: "Erythrocyte Sedimentation Rate (Westergren Method) SOP",
    score: "90/100",
    eval: "Proficient",
    evaluator: "Dr. Rafiqul Islam (Directorate)",
    date: "2026-08-15",
  },
  {
    code: "SOP-IMM-03",
    name: "Slide Agglutination Blood Grouping (ABO & Rh-D) Forward/Reverse",
    score: "96/100",
    eval: "Exemplary",
    evaluator: "Dr. Sabrina Parvin (Blood Transfusion)",
    date: "2026-08-10",
  },
  {
    code: "SOP-HST-05",
    name: "Paraffin Block Sectioning & Routine H&E Tissue Staining",
    score: "85/100",
    eval: "Competent",
    evaluator: "MD. Arif Hossain (Histopathology)",
    date: "2026-08-05",
  },
];

// Seed activities for student
export const DEFAULT_STUDENT_ACTIVITIES: StudentActivityEvent[] = [
  {
    id: "act-101",
    type: "EXAM",
    title: "Clinical Hematology Annual Mock Exam",
    desc: "Achieved 91.5% with distinction across 50 clinical OSPE MCQs & morphological slide spotters.",
    time: "Today, 08:30 AM",
    device: "Chrome / Windows 11",
    ip: "103.205.71.18",
    status: "Verified 91.5%",
    timestamp: Date.now() - 3600000,
  },
  {
    id: "act-102",
    type: "PRACTICAL",
    title: "SOP Bench Calibration: Westergren ESR Verification",
    desc: "Completed pipetting protocol within 1.2% analytical CV margin under supervisor oversight.",
    time: "Yesterday, 03:15 PM",
    device: "Chrome / Windows 11",
    ip: "103.205.71.18",
    status: "Bench SOP Pass",
    timestamp: Date.now() - 86400000,
  },
  {
    id: "act-103",
    type: "LESSON",
    title: "Study Center: Eukaryotic Cellular Anatomy & Osmotic Fragility",
    desc: "Reviewed all 4 core lecture components, lecture notes, and scored 100% on unit quiz.",
    time: "Sep 07, 11:20 AM",
    device: "Edge / Windows 11",
    ip: "103.205.71.18",
    status: "Completed",
    timestamp: Date.now() - 172800000,
  },
  {
    id: "act-104",
    type: "ATTENDANCE",
    title: "Clinical Diagnostic Laboratory Roster Check-In",
    desc: "Logged 4.5 hours of dedicated clinical bench training and diagnostic report validation.",
    time: "Sep 05, 08:00 AM",
    device: "Mobile Chrome / Android 14",
    ip: "103.205.71.18",
    status: "Attended",
    timestamp: Date.now() - 345600000,
  },
  {
    id: "act-105",
    type: "CERTIFICATE",
    title: "1st Year Foundation Competency Conferred",
    desc: "Official credential issued with verification ID VER-9201-ENG101 by Directorate Council.",
    time: "Jan 15, 2025",
    device: "LabTutor System Registry",
    ip: "127.0.0.1",
    status: "Conferred",
    timestamp: Date.now() - 20000000000,
  },
];

// Helper to generate realistic seed record for a student
function createSeedRecord(studentId: string, program: ProgramLevel, year: string): StudentStudyRecord {
  const subjectsForYear = CURRICULUM_SUBJECTS_CATALOG.filter(
    (s) => s.program === program && s.year === year
  );

  const subjectTasks: Record<string, SubjectTaskAudit> = {};
  subjectsForYear.forEach((s, idx) => {
    // Default: for Year 1 diploma, student is partially done (e.g. 4/5 subjects done, or 80% tasks done)
    const isSubjectDone = idx < subjectsForYear.length - 1; // last subject has remaining tasks
    const total = s.lessons || 14;
    const completed = isSubjectDone ? total : Math.floor(total * 0.6);
    const avgScore = 85 + (idx % 3) * 4;

    subjectTasks[s.code] = {
      code: s.code,
      name: s.name,
      completedTasks: completed,
      totalTasks: total,
      avgQuizScore: avgScore,
      isCompleted: completed >= total,
      lastStudied: isSubjectDone ? "Completed" : "2 tasks remaining",
    };
  });

  return {
    studentId,
    program,
    year,
    completedLessonIds: ["anat-les-1", "eng-les-1", "eng-les-2", "comp-les-1"],
    subjectTasks,
    benchSops: DEFAULT_BENCH_COMPETENCIES,
    activities: DEFAULT_STUDENT_ACTIVITIES,
  };
}

export function getAllStoredStudentStudyRecords(): Record<string, StudentStudyRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {}
  return {};
}

export function saveAllStoredStudentStudyRecords(data: Record<string, StudentStudyRecord>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("labtutor_study_progress_updated"));
  } catch {}
}

export function getStudentStudyRecord(
  studentId: string = "usr-005",
  program: ProgramLevel = "DIPLOMA",
  year: string = "1"
): StudentStudyRecord {
  const all = getAllStoredStudentStudyRecords();
  const key = `${studentId}_${program}_${year}`;

  if (all[key]) {
    return all[key];
  }

  // Generate seed and store
  const seed = createSeedRecord(studentId, program, year);
  all[key] = seed;
  saveAllStoredStudentStudyRecords(all);
  return seed;
}

/**
 * Strict Enrollment Eligibility Audit:
 * Evaluates whether student has completed ALL subjects and tasks for their current enrolled program and year.
 */
export function checkEnrollmentEligibility(
  studentId: string = "usr-005",
  program: ProgramLevel = "DIPLOMA",
  year: string = "1"
): EnrollmentEligibilityResult {
  const record = getStudentStudyRecord(studentId, program, year);
  const subjectsForYear = CURRICULUM_SUBJECTS_CATALOG.filter(
    (s) => s.program === program && s.year === year
  );

  const subjectAudits: SubjectTaskAudit[] = [];
  let totalTasks = 0;
  let completedTasks = 0;
  let scoreSum = 0;
  let completedSubjects = 0;
  const missingRequirements: string[] = [];

  subjectsForYear.forEach((s) => {
    const stored = record.subjectTasks[s.code];
    const total = stored?.totalTasks || s.lessons || 14;
    const completed = stored ? stored.completedTasks : 0;
    const isCompleted = completed >= total && total > 0;
    const avgScore = stored?.avgQuizScore || 85;

    totalTasks += total;
    completedTasks += completed;
    scoreSum += avgScore;

    if (isCompleted) {
      completedSubjects++;
    } else {
      const remaining = total - completed;
      missingRequirements.push(
        `${s.code} (${s.name}): ${remaining} remaining ${remaining === 1 ? "task" : "tasks"} to complete.`
      );
    }

    subjectAudits.push({
      code: s.code,
      name: s.name,
      completedTasks: completed,
      totalTasks: total,
      avgQuizScore: avgScore,
      isCompleted,
      lastStudied: stored?.lastStudied || (isCompleted ? "Completed" : "In Progress"),
    });
  });

  const totalSubjects = subjectsForYear.length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isEligible = completionPct === 100 && completedSubjects === totalSubjects && totalSubjects > 0;
  const cumulativeScore = totalSubjects > 0 ? Math.round((scoreSum / totalSubjects) * 10) / 10 : 85;

  let recommendedGrade = "Pass with Distinction (90%+)";
  if (cumulativeScore < 75) recommendedGrade = "Pass (70-74%)";
  else if (cumulativeScore < 85) recommendedGrade = "First Class Merit (75-84%)";
  else recommendedGrade = `Distinction (${cumulativeScore}%)`;

  return {
    isEligible,
    completionPct,
    completedSubjectsCount: completedSubjects,
    totalSubjectsCount: totalSubjects,
    totalTasksCount: totalTasks,
    completedTasksCount: completedTasks,
    cumulativeScore,
    recommendedGrade,
    subjects: subjectAudits,
    missingRequirements,
  };
}

/**
 * Complete all tasks for current enrolled year (Used for demo / simulation and verified completions)
 */
export function setAllCurrentYearTasksCompleted(
  studentId: string = "usr-005",
  program: ProgramLevel = "DIPLOMA",
  year: string = "1",
  completed: boolean = true
) {
  const all = getAllStoredStudentStudyRecords();
  const key = `${studentId}_${program}_${year}`;
  const record = getStudentStudyRecord(studentId, program, year);

  const subjectsForYear = CURRICULUM_SUBJECTS_CATALOG.filter(
    (s) => s.program === program && s.year === year
  );

  const updatedTasks: Record<string, SubjectTaskAudit> = {};
  subjectsForYear.forEach((s, idx) => {
    const total = s.lessons || 14;
    const count = completed ? total : Math.floor(total * (idx === subjectsForYear.length - 1 ? 0.6 : 1));
    updatedTasks[s.code] = {
      code: s.code,
      name: s.name,
      completedTasks: count,
      totalTasks: total,
      avgQuizScore: 88 + (idx % 4) * 3,
      isCompleted: count >= total,
      lastStudied: completed ? "Completed & Verified" : "Pending Remaining Tasks",
    };
  });

  const updatedActivities = [
    {
      id: `act-${Date.now()}`,
      type: completed ? ("PRACTICAL" as const) : ("LESSON" as const),
      title: completed
        ? `All ${program} Year ${year} Curriculum Tasks Verified Complete`
        : `Reset ${program} Year ${year} Tasks to In-Progress`,
      desc: completed
        ? `Successfully completed all ${subjectsForYear.length} subject modules and practical clinical bench tasks.`
        : `Academic audit reset to incomplete for demonstration verification.`,
      time: "Just now",
      device: "Study Center Engine",
      ip: "103.205.71.18",
      status: completed ? "100% Completed" : "In Progress",
      timestamp: Date.now(),
    },
    ...record.activities,
  ];

  all[key] = {
    ...record,
    subjectTasks: updatedTasks,
    activities: updatedActivities,
  };

  saveAllStoredStudentStudyRecords(all);
}

/**
 * Record a new real-time study activity event
 */
export function recordStudentActivity(
  studentId: string = "usr-005",
  program: ProgramLevel = "DIPLOMA",
  year: string = "1",
  event: Omit<StudentActivityEvent, "id" | "timestamp" | "time">
) {
  const all = getAllStoredStudentStudyRecords();
  const key = `${studentId}_${program}_${year}`;
  const record = getStudentStudyRecord(studentId, program, year);

  const newEvent: StudentActivityEvent = {
    ...event,
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    time: "Just now",
    timestamp: Date.now(),
  };

  all[key] = {
    ...record,
    activities: [newEvent, ...record.activities],
  };

  saveAllStoredStudentStudyRecords(all);
}

/**
 * React hook to observe student study progress reactively
 */
export function useStudentStudyProgress(
  studentId: string = "usr-005",
  program: ProgramLevel = "DIPLOMA",
  year: string = "1"
) {
  const [record, setRecord] = React.useState<StudentStudyRecord>(() =>
    getStudentStudyRecord(studentId, program, year)
  );

  const [eligibility, setEligibility] = React.useState<EnrollmentEligibilityResult>(() =>
    checkEnrollmentEligibility(studentId, program, year)
  );

  const refresh = React.useCallback(() => {
    setRecord(getStudentStudyRecord(studentId, program, year));
    setEligibility(checkEnrollmentEligibility(studentId, program, year));
  }, [studentId, program, year]);

  React.useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("labtutor_study_progress_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("labtutor_study_progress_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const markAllCompleted = React.useCallback(
    (completed: boolean = true) => {
      setAllCurrentYearTasksCompleted(studentId, program, year, completed);
      refresh();
    },
    [studentId, program, year, refresh]
  );

  const completeTask = React.useCallback(
    (subjectCode: string) => {
      const all = getAllStoredStudentStudyRecords();
      const key = `${studentId}_${program}_${year}`;
      const r = getStudentStudyRecord(studentId, program, year);
      const curr = r.subjectTasks[subjectCode];
      const total = curr ? curr.totalTasks : 14;
      const nextCount = total;

      all[key] = {
        ...r,
        subjectTasks: {
          ...r.subjectTasks,
          [subjectCode]: {
            completedTasks: nextCount,
            totalTasks: total,
            avgQuizScore: curr?.avgQuizScore || 92,
            isCompleted: true,
            lastStudied: "Completed & Verified",
          },
        },
      };
      saveAllStoredStudentStudyRecords(all);
      refresh();
    },
    [studentId, program, year, refresh]
  );

  const logActivity = React.useCallback(
    (event: Omit<StudentActivityEvent, "id" | "timestamp" | "time">) => {
      recordStudentActivity(studentId, program, year, event);
      refresh();
    },
    [studentId, program, year, refresh]
  );

  return {
    record,
    studyRecord: record,
    eligibility,
    refresh,
    markAllCompleted,
    completeTask,
    resetProgress: () => markAllCompleted(false),
    completeAllTasks: () => markAllCompleted(true),
    logActivity,
  };
}
