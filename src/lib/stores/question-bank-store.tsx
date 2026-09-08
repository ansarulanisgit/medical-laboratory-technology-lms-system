"use client";

import * as React from "react";
import { ProgramLevel } from "@/lib/curriculum/academic-context";

export interface QuestionBankItem {
  id: string;
  title: string;
  program: ProgramLevel; // "DIPLOMA" | "BSC"
  year: string; // "1" | "2" | "3" | "4"
  subjectCode: string;
  subjectName: string;
  examYear: string; // e.g. "2024", "2023"
  boardName: string; // e.g. "State Medical Faculty of Bangladesh (SMFB)" or "Dhaka University"
  examType: "ANNUAL" | "SUPPLEMENTARY" | "TERM_FINAL" | "MODEL_TEST";
  documentType: "PDF" | "DOC" | "IMAGE";
  fileUrl: string;
  fileSize: string;
  description: string;
  totalMarks: number;
  hasSolution: boolean;
  solutionSummary?: string;
  uploadedBy: string;
  uploadedRole: string;
  createdAt: string;
  downloadCount: number;
}

const INITIAL_QUESTIONS: QuestionBankItem[] = [
  {
    id: "qb-001",
    title: "Basic English Language Course Annual Board Examination 2024 (Official Paper)",
    program: "DIPLOMA",
    year: "1",
    subjectCode: "ENG-101",
    subjectName: "Basic English Language Course",
    examYear: "2024",
    boardName: "State Medical Faculty of Bangladesh (SMFB)",
    examType: "ANNUAL",
    documentType: "PDF",
    fileUrl: "/curriculum/Basic_English_Language_Course_Syllabus.pdf",
    fileSize: "1.4 MB",
    description: "Complete Part-I (Grammar, Translation, Report Writing) & Part-II (SAQs) with benchmark faculty solution.",
    totalMarks: 75,
    hasSolution: true,
    solutionSummary: "Verified model answers for grammatical concordance, medical instrument translation, and hospital observation report.",
    uploadedBy: "Dr. Sabrina Parvin",
    uploadedRole: "MENTOR",
    createdAt: "2024-11-10",
    downloadCount: 428,
  },
  {
    id: "qb-002",
    title: "Basic Anatomy Annual Faculty Examination Paper 2023",
    program: "DIPLOMA",
    year: "1",
    subjectCode: "ANAT-102",
    subjectName: "Basic Anatomy",
    examYear: "2023",
    boardName: "State Medical Faculty of Bangladesh (SMFB)",
    examType: "ANNUAL",
    documentType: "PDF",
    fileUrl: "/curriculum/Basic_English_Language_Course_Syllabus.pdf",
    fileSize: "2.1 MB",
    description: "Histology of lymph nodes, circulatory coronary vascular anatomy, and urinary system filtration nephron structure.",
    totalMarks: 75,
    hasSolution: true,
    solutionSummary: "Illustrated cross-sectional histology diagrams and anatomical labels.",
    uploadedBy: "Prof. Nasreen Akhter",
    uploadedRole: "ADMIN",
    createdAt: "2024-03-15",
    downloadCount: 615,
  },
  {
    id: "qb-003",
    title: "Clinical Pathology & Haematology Board Exam 2024 (With OSPE Stations)",
    program: "DIPLOMA",
    year: "2",
    subjectCode: "CPH-205",
    subjectName: "Clinical Pathology & Haematology",
    examYear: "2024",
    boardName: "State Medical Faculty of Bangladesh (SMFB)",
    examType: "ANNUAL",
    documentType: "PDF",
    fileUrl: "/curriculum/Basic_English_Language_Course_Syllabus.pdf",
    fileSize: "3.2 MB",
    description: "Leishman staining technique, automated hemogram interpretation, ESR Westergren pipetting, and urine sediments.",
    totalMarks: 100,
    hasSolution: true,
    solutionSummary: "Includes full practical OSPE benchmark stations and slide identification keys.",
    uploadedBy: "Dr. Rafiqul Islam",
    uploadedRole: "SUPER_ADMIN",
    createdAt: "2024-12-05",
    downloadCount: 890,
  },
  {
    id: "qb-004",
    title: "Advanced Hematology & Hemoglobinopathies B.Sc. 2nd Year Final Paper",
    program: "BSC",
    year: "2",
    subjectCode: "BSC-HEM-201",
    subjectName: "Advanced Hematology & Hemoglobinopathies",
    examYear: "2024",
    boardName: "Faculty of Allied Health Sciences, University of Dhaka",
    examType: "TERM_FINAL",
    documentType: "PDF",
    fileUrl: "/curriculum/Basic_English_Language_Course_Syllabus.pdf",
    fileSize: "2.8 MB",
    description: "Hemoglobin alkaline electrophoresis quantification, flow cytometric immunophenotyping, and FAB leukemia classification.",
    totalMarks: 75,
    hasSolution: true,
    solutionSummary: "Chromatogram interpretations and cellulose acetate migration benchmark bands.",
    uploadedBy: "Dr. Sabrina Parvin",
    uploadedRole: "MENTOR",
    createdAt: "2024-09-20",
    downloadCount: 312,
  },
  {
    id: "qb-005",
    title: "Molecular Diagnostics & PCR Technology B.Sc. 4th Year Exam Paper",
    program: "BSC",
    year: "4",
    subjectCode: "BSC-MOL-401",
    subjectName: "Molecular Diagnostics & PCR Technology",
    examYear: "2024",
    boardName: "Faculty of Allied Health Sciences, University of Dhaka",
    examType: "ANNUAL",
    documentType: "PDF",
    fileUrl: "/curriculum/Basic_English_Language_Course_Syllabus.pdf",
    fileSize: "1.9 MB",
    description: "Real-Time TaqMan probe fluorescence kinetics, HBV viral load log calculations, and primer dimer troubleshooting.",
    totalMarks: 75,
    hasSolution: true,
    solutionSummary: "Amplification plot threshold calculations and melt curve derivative peaks.",
    uploadedBy: "MD. Arif Hossain",
    uploadedRole: "MENTOR",
    createdAt: "2024-10-18",
    downloadCount: 245,
  },
];

const STORAGE_KEY = "labtutor_question_bank_v1";

interface QuestionBankContextType {
  questions: QuestionBankItem[];
  addQuestion: (item: Omit<QuestionBankItem, "id" | "createdAt" | "downloadCount">) => { success: boolean; error?: string };
  updateQuestion: (id: string, updates: Partial<QuestionBankItem>) => { success: boolean; error?: string };
  deleteQuestion: (id: string) => { success: boolean; error?: string };
  recordDownload: (id: string) => void;
}

const QuestionBankContext = React.createContext<QuestionBankContextType | undefined>(undefined);

export function QuestionBankProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = React.useState<QuestionBankItem[]>(INITIAL_QUESTIONS);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          return;
        }
      }
    } catch {}
    setQuestions(INITIAL_QUESTIONS);
  }, []);

  const persistQuestions = (newQuestions: QuestionBankItem[]) => {
    setQuestions(newQuestions);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuestions));
    } catch {}
  };

  const addQuestion = React.useCallback(
    (item: Omit<QuestionBankItem, "id" | "createdAt" | "downloadCount">): { success: boolean; error?: string } => {
      if (!item.title.trim()) return { success: false, error: "Question title is required." };
      if (!item.subjectCode.trim()) return { success: false, error: "Subject is required." };

      const newItem: QuestionBankItem = {
        ...item,
        id: `qb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString().split("T")[0],
        downloadCount: 0,
      };

      const updated = [newItem, ...questions];
      persistQuestions(updated);
      return { success: true };
    },
    [questions]
  );

  const updateQuestion = React.useCallback(
    (id: string, updates: Partial<QuestionBankItem>): { success: boolean; error?: string } => {
      const idx = questions.findIndex((q) => q.id === id);
      if (idx === -1) return { success: false, error: "Question not found." };

      const updated = [...questions];
      updated[idx] = { ...updated[idx], ...updates };
      persistQuestions(updated);
      return { success: true };
    },
    [questions]
  );

  const deleteQuestion = React.useCallback(
    (id: string): { success: boolean; error?: string } => {
      const updated = questions.filter((q) => q.id !== id);
      persistQuestions(updated);
      return { success: true };
    },
    [questions]
  );

  const recordDownload = React.useCallback(
    (id: string) => {
      const updated = questions.map((q) => (q.id === id ? { ...q, downloadCount: q.downloadCount + 1 } : q));
      persistQuestions(updated);
    },
    [questions]
  );

  return (
    <QuestionBankContext.Provider value={{ questions, addQuestion, updateQuestion, deleteQuestion, recordDownload }}>
      {children}
    </QuestionBankContext.Provider>
  );
}

export function useQuestionBank() {
  const context = React.useContext(QuestionBankContext);
  if (!context) {
    throw new Error("useQuestionBank must be used within QuestionBankProvider");
  }
  return context;
}
