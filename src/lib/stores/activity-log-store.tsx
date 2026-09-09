"use client";

import * as React from "react";
import { UserRole } from "@/types/roles";

export interface ActivityLogItem {
  id: string;
  referenceCode: string;
  timestamp: string;
  fullDate: string;
  action: string;
  module: string;
  details: string;
  performedBy: string;
  role: UserRole;
  ipAddress?: string;
  device?: string;
  sessionId?: string;
  status?: "SUCCESS" | "WARNING" | "INFO" | "CRITICAL";
  targetEntity?: string;
  metadata?: Record<string, any>;
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
  device?: string;
  status?: "SUCCESS" | "WARNING" | "INFO" | "CRITICAL";
  targetEntity?: string;
  metadata?: Record<string, any>;
}

const INITIAL_LOGS: ActivityLogItem[] = [
  {
    id: "log-001",
    referenceCode: "EVT-894102",
    timestamp: "10:45:12 AM",
    fullDate: "Sep 09, 2026",
    action: "UPDATE",
    module: "Curriculum",
    details: "Synchronized ENG-101 syllabus units with official SMFB Bangladesh curriculum standards.",
    performedBy: "Dr. Rafiqul Islam",
    role: "SUPER_ADMIN",
    ipAddress: "192.168.1.1 (DGHS Directorate Gateway)",
    device: "Chrome 128 / Windows 11 Desktop",
    sessionId: "SES-9821-SUP",
    status: "SUCCESS",
    targetEntity: "Subject Module: ENG-101",
    metadata: {
      affectedUnits: 4,
      accreditationCode: "SMFB-2024-ENG",
      clientProtocol: "HTTPS/TLSv1.3",
    },
  },
  {
    id: "log-002",
    referenceCode: "EVT-771239",
    timestamp: "10:25:30 AM",
    fullDate: "Sep 09, 2026",
    action: "UPDATE",
    module: "Study Center",
    details: "Verified model defense answer & viva checklist for Unit 1: Sentence Anatomy in ENG-101.",
    performedBy: "Dr. Sabrina Parvin",
    role: "MENTOR",
    ipAddress: "192.168.1.14 (DMC Diagnostic Wing)",
    device: "Chrome 128 / macOS Sonoma",
    sessionId: "SES-4190-MEN",
    status: "SUCCESS",
    targetEntity: "Lesson: Sentence Anatomy",
    metadata: {
      actionTarget: "Viva Checklist",
      reviewRating: "Approved 5/5",
    },
  },
  {
    id: "log-003",
    referenceCode: "EVT-650182",
    timestamp: "09:50:18 AM",
    fullDate: "Sep 09, 2026",
    action: "UPDATE",
    module: "Certificates",
    details: "Conferred official competency credential for 1st Year Foundation Competency: Pre-Analytical SOPs.",
    performedBy: "Prof. Nasreen Akhter",
    role: "ADMIN",
    ipAddress: "192.168.1.8 (DIHT Academic Wing)",
    device: "Edge 128 / Windows 11 Desktop",
    sessionId: "SES-3312-ADM",
    status: "SUCCESS",
    targetEntity: "Credential: LT-CERT-2025-0482",
    metadata: {
      candidateId: "usr-005",
      candidateName: "Md. Ansarul Islam",
      verificationCode: "VER-9201-ENG101",
      assessmentScore: "92% (Distinction)",
    },
  },
  {
    id: "log-004",
    referenceCode: "EVT-528410",
    timestamp: "08:30:45 AM",
    fullDate: "Sep 09, 2026",
    action: "AUTH",
    module: "User Management",
    details: "User authenticated via secure biometric/credential session from DIHT campus network.",
    performedBy: "Md. Ansarul Islam",
    role: "STUDENT",
    ipAddress: "103.145.78.22 (DIHT Student Wifi)",
    device: "Mobile Chrome / Android 14",
    sessionId: "SES-7811-STU",
    status: "INFO",
    targetEntity: "Session Auth: usr-005",
    metadata: {
      authMethod: "Password + Portal Token",
      sessionDuration: "Active",
      program: "Diploma in MLT (Year 2)",
    },
  },
  {
    id: "log-005",
    referenceCode: "EVT-419022",
    timestamp: "08:15:20 AM",
    fullDate: "Sep 09, 2026",
    action: "DOWNLOAD",
    module: "Jobs Board",
    details: 'Downloaded hospital interview checklist & applied for "Junior Medical Technologist (Hematology & Biochemistry)" at Square Hospitals Ltd.',
    performedBy: "Md. Ansarul Islam",
    role: "STUDENT",
    ipAddress: "103.145.78.22 (DIHT Student Wifi)",
    device: "Chrome 128 / Windows 11 Desktop",
    sessionId: "SES-7811-STU",
    status: "SUCCESS",
    targetEntity: "Hospital Job Opening #sq-01",
    metadata: {
      hospital: "Square Hospitals Ltd., Dhaka",
      applicationRef: "APP-SQ-2026-992",
      resumeAttached: "Verified MLT Resume",
    },
  },
];

const STORAGE_KEY = "labtutor_activity_log_v2";

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
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      const role = input.role || input.userRole || "STUDENT";
      const newEntry: ActivityLogItem = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        referenceCode: `EVT-${randomCode}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        fullDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        action: input.action || "UPDATE",
        module: input.module || "System",
        details: input.details,
        performedBy: input.performedBy || input.userName || "System User",
        role: role,
        ipAddress: input.ipAddress || "127.0.0.1 (Localhost / DGHS Intranet)",
        device: input.device || "Chrome 128 / Windows 11 Desktop (Verified)",
        sessionId: `SES-${Math.floor(1000 + Math.random() * 9000)}-${role.slice(0, 3)}`,
        status: input.status || (input.action === "DELETE" ? "CRITICAL" : input.action === "AUTH" ? "INFO" : "SUCCESS"),
        targetEntity: input.targetEntity || input.module || "Platform Resource",
        metadata: input.metadata,
      };
      persistLogs([newEntry, ...logs].slice(0, 150)); // keep last 150
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
