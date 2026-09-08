"use client";

import { CourseCurriculumDetail } from "./course-details-data";

const CURRICULUM_DETAILS_STORAGE_KEY = "labtutor_curriculum_details_v2";

/**
 * Retrieves custom curriculum details stored in localStorage.
 */
export function getStoredCustomCurriculumDetails(): Record<string, Partial<CourseCurriculumDetail>> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(CURRICULUM_DETAILS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return {};
}

/**
 * Saves or updates a specific course curriculum detail.
 */
export function saveStoredCurriculumDetail(code: string, detail: Partial<CourseCurriculumDetail>) {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredCustomCurriculumDetails();
    const upperCode = code.toUpperCase();
    existing[upperCode] = {
      ...existing[upperCode],
      ...detail,
      code: upperCode,
    };
    localStorage.setItem(CURRICULUM_DETAILS_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

/**
 * Deletes a course curriculum detail from persistent storage.
 */
export function deleteStoredCurriculumDetail(code: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredCustomCurriculumDetails();
    const upperCode = code.toUpperCase();
    delete existing[upperCode];
    localStorage.setItem(CURRICULUM_DETAILS_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}
