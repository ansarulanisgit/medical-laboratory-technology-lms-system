"use client";

import * as React from "react";
import { UserRole } from "@/types/roles";

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  details: string;
  performedBy: string;
  role: UserRole;
  ipAddress?: string;
}

export interface LogEntryInput {
  action?: string;
  module?: string;
  category?: string;
  details: string;
  performedBy?: string;
  userName?: string;
  userId?: string;
  role?: UserRole;
  userRole?: UserRole;
  ipAddress?: string;
}

const INITIAL_LOGS: ActivityLogItem[] = [
  {
    id: "log-001",
    timestamp: "10:45:12 AM",
    action: "UPDATE",
    module: "Curriculum",
    details: "Synchronized ENG-101 syllabus units with official SMFB curriculum.",
    performedBy: "Dr. Rafiqul Islam",
    role: "SUPER_ADMIN",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-002",
    timestamp: "10:25:30 AM",
    action: "UPDATE",
    module: "Study Center",
    details: "Verified model defense answer for Unit 1: Sentence Anatomy in ENG-101.",
    performedBy: "Dr. Sabrina Parvin",
    role: "MENTOR",
    ipAddress: "192.168.1.14",
  },
  {
    id: "log-003",
    timestamp: "09:50:18 AM",
    action: "UPDATE",
    module: "Certificates",
    details: "Conferred official competency credential for 1st Year Pre-Analytical SOPs.",
    performedBy: "Prof. Nasreen Akhter",
    role: "ADMIN",
    ipAddress: "192.168.1.8",
  },
  {
    id: "log-004",
    timestamp: "08:30:45 AM",
    action: "AUTH",
    module: "User Management",
    details: "Student Md. Ansarul Islam logged in and completed interactive hematology quiz.",
    performedBy: "Md. Ansarul Islam",
    role: "STUDENT",
    ipAddress: "103.145.78.22",
  },
];

const STORAGE_KEY = "labtutor_activity_log_v1";

interface ActivityLogContextType {
  logs: ActivityLogItem[];
  logActivity: (item: LogEntryInput) => void;
  clearLogs: () => void;
}

const ActivityLogContext = React.createContext<ActivityLogContextType | undefined>(undefined);

export function ActivityLogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = React.useState<ActivityLogItem[]>(INITIAL_LOGS);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setLogs(parsed);
      }
    } catch {}
  }, []);

  const persistLogs = (newLogs: ActivityLogItem[]) => {
    setLogs(newLogs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    } catch {}
  };

  const logActivity = React.useCallback(
    (input: LogEntryInput) => {
      const newEntry: ActivityLogItem = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        action: input.action || "UPDATE",
        module: input.module || "System",
        details: input.details,
        performedBy: input.performedBy || "System User",
        role: input.role || "STUDENT",
        ipAddress: input.ipAddress || "127.0.0.1",
      };
      persistLogs([newEntry, ...logs].slice(0, 100)); // keep last 100
    },
    [logs]
  );

  const clearLogs = React.useCallback(() => {
    persistLogs([]);
  }, []);

  return (
    <ActivityLogContext.Provider value={{ logs, logActivity, clearLogs }}>
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const context = React.useContext(ActivityLogContext);
  if (!context) {
    throw new Error("useActivityLog must be used within ActivityLogProvider");
  }
  return context;
}
