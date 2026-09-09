"use client";

import * as React from "react";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { useNotification } from "@/components/ui/notification-context";

export type AnnouncementType = "EXAM" | "ACADEMIC" | "CLINICAL" | "SYSTEM" | "ADVISORY";
export type AnnouncementPriority = "NORMAL" | "HIGH" | "URGENT";

export interface LMSAnnouncement {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  targetAudience: "ALL" | "DIPLOMA" | "BSC";
  targetUserId?: string;
  targetStudentName?: string;
  authorRole: "SUPER_ADMIN" | "ADMIN";
  authorName: string;
  createdAt: string;
  readBy: string[];
}

const STORAGE_KEY = "labtutor_lms_announcements_v1";

const SEED_ANNOUNCEMENTS: LMSAnnouncement[] = [
  {
    id: "notif-smfb-exam-2024",
    title: "SMFB Annual Examination Schedule & Form Fill-up",
    message: "State Medical Faculty of Bangladesh (SMFB) has officially released the schedule for the upcoming Annual Examination 2024. All 1st to 4th Year students must ensure complete practical logbook attestations prior to submission.",
    type: "EXAM",
    priority: "URGENT",
    targetAudience: "ALL",
    authorRole: "SUPER_ADMIN",
    authorName: "DGHS Academic Controller",
    createdAt: "2026-09-08T18:00:00.000Z",
    readBy: [],
  },
  {
    id: "notif-ospe-workstations",
    title: "Clinical Microbiology & Hematology OSPE Stations Updated",
    message: "New digital OSPE station checklists, Gram staining benchmark criteria, and peripheral blood film (PBF) identification guides have been published in the Study Center.",
    type: "ACADEMIC",
    priority: "HIGH",
    targetAudience: "ALL",
    authorRole: "ADMIN",
    authorName: "Clinical Laboratory Faculty",
    createdAt: "2026-09-08T10:00:00.000Z",
    readBy: [],
  },
  {
    id: "notif-welcome-lms",
    title: "Welcome to LabTutor Academy Digital Learning Platform",
    message: "Access accredited curriculum modules, interactive OSPE practice quizzes, oral board viva voice question banks, and clinical logbook monitoring tools.",
    type: "SYSTEM",
    priority: "NORMAL",
    targetAudience: "ALL",
    authorRole: "SUPER_ADMIN",
    authorName: "Ansarul Anis (Lead Developer)",
    createdAt: "2026-09-06T12:00:00.000Z",
    readBy: [],
  },
];

interface LMSAnnouncementContextType {
  announcements: LMSAnnouncement[];
  unreadCount: number;
  createAnnouncement: (data: Omit<LMSAnnouncement, "id" | "createdAt" | "readBy">) => void;
  deleteAnnouncement: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const LMSAnnouncementContext = React.createContext<LMSAnnouncementContextType | undefined>(undefined);

export function LMSAnnouncementProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAcademicProfile();
  const { showNotification } = useNotification();
  const [announcements, setAnnouncements] = React.useState<LMSAnnouncement[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const currentUsername = profile?.username || "student.user";

  // Load from localStorage or initialize with seed data
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAnnouncements(parsed);
          setIsLoaded(true);
          return;
        }
      }
      // Seed default notifications
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ANNOUNCEMENTS));
      setAnnouncements(SEED_ANNOUNCEMENTS);
    } catch {
      setAnnouncements(SEED_ANNOUNCEMENTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Listen for storage events for multi-tab synchronization
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setAnnouncements(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const persistAnnouncements = (newList: LMSAnnouncement[]) => {
    setAnnouncements(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch {
      // ignore
    }
  };

  // Filter announcements for current student program or targeted student
  const visibleAnnouncements = React.useMemo(() => {
    const program = profile?.program || "DIPLOMA";
    const isManagement = profile?.role === "SUPER_ADMIN" || profile?.role === "ADMIN";

    return announcements.filter((a) => {
      // Management roles see all announcements and targeted decisions
      if (isManagement) return true;

      // Targeted notification matching current student
      if (
        a.targetUserId &&
        ((profile as any)?.id === a.targetUserId ||
          profile?.username?.toLowerCase() === a.targetUserId.toLowerCase() ||
          profile?.studentIdNumber?.toLowerCase() === a.targetUserId.toLowerCase() ||
          profile?.email?.toLowerCase() === a.targetUserId.toLowerCase())
      ) {
        return true;
      }
      if (
        a.targetStudentName &&
        profile?.fullName?.toLowerCase().trim() === a.targetStudentName.toLowerCase().trim()
      ) {
        return true;
      }

      // General audience
      if (a.targetAudience === "ALL") return true;
      if (a.targetAudience === "DIPLOMA" && program === "DIPLOMA") return true;
      if (a.targetAudience === "BSC" && program === "BSC") return true;
      return false;
    });
  }, [announcements, profile?.program, profile?.role, profile?.studentIdNumber, profile?.username, profile?.fullName]);

  // Compute unread count for current user
  const unreadCount = React.useMemo(() => {
    return visibleAnnouncements.filter((a) => !a.readBy.includes(currentUsername)).length;
  }, [visibleAnnouncements, currentUsername]);

  const createAnnouncement = (data: Omit<LMSAnnouncement, "id" | "createdAt" | "readBy">) => {
    const newNotice: LMSAnnouncement = {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      readBy: [],
    };

    const updated = [newNotice, ...announcements];
    persistAnnouncements(updated);

    showNotification({
      type: "success",
      title: "Notice Broadcasted",
      message: `"${data.title}" published to all students in real time.`,
    });
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    persistAnnouncements(updated);
    showNotification({
      type: "info",
      title: "Notice Removed",
      message: "Announcement removed from the notice board.",
    });
  };

  const markAsRead = (id: string) => {
    const updated = announcements.map((a) => {
      if (a.id === id && !a.readBy.includes(currentUsername)) {
        return {
          ...a,
          readBy: [...a.readBy, currentUsername],
        };
      }
      return a;
    });
    persistAnnouncements(updated);
  };

  const markAllAsRead = () => {
    const updated = announcements.map((a) => {
      if (!a.readBy.includes(currentUsername)) {
        return {
          ...a,
          readBy: [...a.readBy, currentUsername],
        };
      }
      return a;
    });
    persistAnnouncements(updated);
    showNotification({
      type: "info",
      title: "All Notices Read",
      message: "All notifications marked as read.",
    });
  };

  return (
    <LMSAnnouncementContext.Provider
      value={{
        announcements: visibleAnnouncements,
        unreadCount,
        createAnnouncement,
        deleteAnnouncement,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </LMSAnnouncementContext.Provider>
  );
}

export function useLMSAnnouncements() {
  const context = React.useContext(LMSAnnouncementContext);
  if (!context) {
    throw new Error("useLMSAnnouncements must be used within an LMSAnnouncementProvider");
  }
  return context;
}
