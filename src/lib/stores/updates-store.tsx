"use client";

import * as React from "react";
import { UserRole } from "@/types/roles";

export interface UpdateNoticeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  urgency: "NORMAL" | "HIGH" | "CRITICAL";
  targetAudience: "ALL" | "STUDENT" | "MENTOR";
  postedBy: string;
  postedRole: UserRole;
  createdAt: string;
  attachmentName?: string;
  attachmentUrl?: string;
  fileSize?: string;
  fileType?: string;
}

const INITIAL_UPDATES: UpdateNoticeItem[] = [
  {
    id: "upd-001",
    title: "SMFB 1st Year Annual Faculty Examination Schedule & Center Allocation",
    content: "The State Medical Faculty of Bangladesh (SMFB) has officially announced the commencement date for the 1st Year Annual Faculty Examinations. Written examinations will start promptly at 10:00 AM across designated regional medical college examination centers.",
    category: "EXAM_NOTICE",
    urgency: "CRITICAL",
    targetAudience: "ALL",
    postedBy: "Dr. Rafiqul Islam",
    postedRole: "SUPER_ADMIN",
    createdAt: "2026-09-04",
    attachmentName: "SMFB_Exam_Routine_2026.pdf",
    attachmentUrl: "/curriculum/Basic_English_Language_Course_Syllabus.pdf",
  },
  {
    id: "upd-002",
    title: "Basic English Language Course (ENG-101) Syllabus PDF & Audio Viva Release",
    content: "Full 4-unit curriculum, technical report writing rubrics, and official syllabus PDF for ENG-101 have been synchronized across Course Curriculum and Study Center. Trainees can download the syllabus and test viva answers immediately.",
    category: "PLATFORM_UPDATE",
    urgency: "HIGH",
    targetAudience: "STUDENT",
    postedBy: "Prof. Nasreen Akhter",
    postedRole: "ADMIN",
    createdAt: "2026-09-03",
    attachmentName: "Basic_English_Language_Course_Syllabus.pdf",
    attachmentUrl: "/curriculum/Basic_English_Language_Course_Syllabus.pdf",
  },
  {
    id: "upd-003",
    title: "Hands-on Workshop: Automated CBC Hemogram Interpretation & Slide Review",
    content: "A 2-day clinical workshop on automated cell counter scattergram interpretation, immature granulocyte flagging, and peripheral smear verification will be conducted online for 2nd and 3rd-year trainees.",
    category: "WORKSHOP",
    urgency: "NORMAL",
    targetAudience: "STUDENT",
    postedBy: "Dr. Sabrina Parvin",
    postedRole: "MENTOR",
    createdAt: "2026-09-02",
  },
  {
    id: "upd-004",
    title: "Diagnostic Practical Logbook Mid-Term Submission Deadline",
    content: "All Diploma 2nd Year trainees must submit their completed clinical logbook entries for Hematology and Urine Microscopy to their assigned faculty mentors before September 20th for continuous assessment grading.",
    category: "PRACTICAL_SCHEDULE",
    urgency: "HIGH",
    targetAudience: "STUDENT",
    postedBy: "MD. Arif Hossain",
    postedRole: "MENTOR",
    createdAt: "2026-09-01",
  },
];

const STORAGE_KEY = "labtutor_notices_updates_v1";
const CATEGORIES_STORAGE_KEY = "labtutor_custom_categories_v1";

interface UpdatesContextType {
  updates: UpdateNoticeItem[];
  customCategories: string[];
  addUpdate: (notice: Omit<UpdateNoticeItem, "id" | "createdAt">) => { success: boolean; error?: string };
  modifyUpdate: (id: string, updates: Partial<UpdateNoticeItem>) => { success: boolean; error?: string };
  deleteUpdate: (id: string) => { success: boolean; error?: string };
  addCustomCategory: (category: string) => { success: boolean; error?: string };
  removeCustomCategory: (category: string) => void;
}

const UpdatesContext = React.createContext<UpdatesContextType | undefined>(undefined);

export function UpdatesProvider({ children }: { children: React.ReactNode }) {
  const [updates, setUpdates] = React.useState<UpdateNoticeItem[]>(INITIAL_UPDATES);
  const [customCategories, setCustomCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setUpdates(parsed);
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      const storedCats = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (storedCats) {
        const parsed = JSON.parse(storedCats);
        if (Array.isArray(parsed)) setCustomCategories(parsed);
      }
    } catch {}
  }, []);

  const persistUpdates = (newUpdates: UpdateNoticeItem[]) => {
    setUpdates(newUpdates);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUpdates));
    } catch {}
  };

  const addCustomCategory = React.useCallback((catName: string) => {
    const trimmed = catName.trim();
    if (!trimmed) return { success: false, error: "Category name cannot be empty." };
    if (customCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, error: "Category already exists." };
    }
    const next = [...customCategories, trimmed];
    setCustomCategories(next);
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    return { success: true };
  }, [customCategories]);

  const removeCustomCategory = React.useCallback((catName: string) => {
    const next = customCategories.filter(c => c !== catName);
    setCustomCategories(next);
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, [customCategories]);

  const addUpdate = React.useCallback(
    (notice: Omit<UpdateNoticeItem, "id" | "createdAt">): { success: boolean; error?: string } => {
      if (!notice.title.trim()) return { success: false, error: "Notice title is required." };
      if (!notice.content.trim()) return { success: false, error: "Notice content is required." };

      const newNotice: UpdateNoticeItem = {
        ...notice,
        id: `upd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString().split("T")[0],
      };

      const updated = [newNotice, ...updates];
      persistUpdates(updated);
      return { success: true };
    },
    [updates]
  );

  const modifyUpdate = React.useCallback(
    (id: string, partial: Partial<UpdateNoticeItem>): { success: boolean; error?: string } => {
      const idx = updates.findIndex((u) => u.id === id);
      if (idx === -1) return { success: false, error: "Notice not found." };

      const next = [...updates];
      next[idx] = { ...next[idx], ...partial };
      persistUpdates(next);
      return { success: true };
    },
    [updates]
  );

  const deleteUpdate = React.useCallback(
    (id: string): { success: boolean; error?: string } => {
      const next = updates.filter((u) => u.id !== id);
      persistUpdates(next);
      return { success: true };
    },
    [updates]
  );

  return (
    <UpdatesContext.Provider
      value={{
        updates,
        customCategories,
        addUpdate,
        modifyUpdate,
        deleteUpdate,
        addCustomCategory,
        removeCustomCategory,
      }}
    >
      {children}
    </UpdatesContext.Provider>
  );
}

export function useUpdates() {
  const context = React.useContext(UpdatesContext);
  if (!context) {
    throw new Error("useUpdates must be used within UpdatesProvider");
  }
  return context;
}
