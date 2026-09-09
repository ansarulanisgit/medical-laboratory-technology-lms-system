"use client";

import * as React from "react";
import { ProgramLevel } from "@/lib/curriculum/academic-context";

export interface CertificateRecord {
  id: string;
  code: string;
  certificateNumber: string; // Auto-generated official certificate serial number
  studentId: string;
  studentName: string;
  institution: string;
  program: ProgramLevel;
  year: string; // "1" | "2" | "3" | "4"
  title: string;
  grade: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  applicationDate: string;
  issuedDate?: string;
  reviewedBy?: string;
  reviewedRole?: string;
  feedback?: string;
  verificationCode: string;
}

export type ColorPreset =
  | "EMERALD_CLINICAL"
  | "ROYAL_GOLD"
  | "SAPPHIRE_ACADEMIC"
  | "BURGUNDY_DISTINCTION"
  | "SLATE_MINIMALIST"
  | "CUSTOM";

export type CertFontFamily =
  | "SERIF_CLASSIC"
  | "SANS_MODERN"
  | "CALLIGRAPHIC_PRESTIGE"
  | "MONO_FORMAL";

export type CertBorderStyle =
  | "EMERALD_CLINICAL"
  | "CLASSIC_GOLD"
  | "MINIMALIST_NAVY"
  | "ORNATE_VINTAGE"
  | "SECURITY_GUILLOCHE";

export const US_LETTER_DIMENSION_LABEL = "US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)";

export interface CertificateTemplateConfig {
  institutionName: string;
  subHeader: string;
  colorPreset: ColorPreset;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  accentColor: string; // hex
  paperTone: "PURE_WHITE" | "IVORY_PARCHMENT" | "ANTIQUE_LINEN";
  paperSize: "US_LETTER";
  orientation: "LANDSCAPE" | "PORTRAIT";
  fontFamily: CertFontFamily;
  borderStyle: CertBorderStyle;
  signatoryTitle1: string;
  signatoryName1: string;
  signatorySignature1?: string; // base64 or image url
  signatoryTitle2: string;
  signatoryName2: string;
  signatorySignature2?: string; // base64 or image url
  sealText: string;
  sealIcon: "AWARD" | "SHIELD" | "CADUCEUS" | "MICROSCOPE";
  holographicSeal: boolean;
  watermarkLogoUrl: string;
  watermarkLogoOpacity: number; // 0.15 - 0.20
  showCenterLogoWatermark: boolean;
}

export const COLOR_PRESETS: Record<
  ColorPreset,
  { label: string; primary: string; secondary: string; accent: string; border: CertBorderStyle }
> = {
  EMERALD_CLINICAL: {
    label: "Emerald Clinical (DGHS Standard)",
    primary: "#059669",
    secondary: "#047857",
    accent: "#10b981",
    border: "EMERALD_CLINICAL",
  },
  ROYAL_GOLD: {
    label: "Royal Gold (Faculty Honors)",
    primary: "#b45309",
    secondary: "#92400e",
    accent: "#f59e0b",
    border: "CLASSIC_GOLD",
  },
  SAPPHIRE_ACADEMIC: {
    label: "Sapphire Academic (University Navy)",
    primary: "#1d4ed8",
    secondary: "#1e40af",
    accent: "#3b82f6",
    border: "MINIMALIST_NAVY",
  },
  BURGUNDY_DISTINCTION: {
    label: "Burgundy Distinction (Council Executive)",
    primary: "#991b1b",
    secondary: "#7f1d1d",
    accent: "#ef4444",
    border: "ORNATE_VINTAGE",
  },
  SLATE_MINIMALIST: {
    label: "Slate Minimalist (Diagnostic Lab)",
    primary: "#334155",
    secondary: "#1e293b",
    accent: "#64748b",
    border: "SECURITY_GUILLOCHE",
  },
  CUSTOM: {
    label: "Custom Palette",
    primary: "#059669",
    secondary: "#047857",
    accent: "#10b981",
    border: "EMERALD_CLINICAL",
  },
};

const DEFAULT_TEMPLATE: CertificateTemplateConfig = {
  institutionName: "LabTutor Academy Certificate",
  subHeader: "Digital Platform to Learn Medical Laboratory Technology",
  colorPreset: "EMERALD_CLINICAL",
  primaryColor: "#059669",
  secondaryColor: "#047857",
  accentColor: "#10b981",
  paperTone: "IVORY_PARCHMENT",
  paperSize: "US_LETTER",
  orientation: "LANDSCAPE",
  fontFamily: "SERIF_CLASSIC",
  borderStyle: "EMERALD_CLINICAL",
  signatoryTitle1: "Chairman, Academic Examination Council",
  signatoryName1: "Dr. Rafiqul Islam, MBBS, FCPS",
  signatorySignature1: "",
  signatoryTitle2: "Clinical Director of Medical Technology",
  signatoryName2: "Prof. Nasreen Akhter, M.Phil",
  signatorySignature2: "",
  sealText: "OFFICIALLY VERIFIED • COMPETENCY CONFERRED",
  sealIcon: "SHIELD",
  holographicSeal: true,
  watermarkLogoUrl: "/images/certificate-watermark-logo.png",
  watermarkLogoOpacity: 0.18,
  showCenterLogoWatermark: true,
};

const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: "cert-001",
    code: "LT-CERT-2025-0482",
    certificateNumber: "LTA-DIP-2025-48201",
    studentId: "usr-005",
    studentName: "Md. Ansarul Islam",
    institution: "Dhaka Institute of Health Technology (DIHT)",
    program: "DIPLOMA",
    year: "1",
    title: "1st Year Foundation Competency: Diagnostic Pre-Analytical SOPs & Basic Sciences",
    grade: "Distinction (92%)",
    status: "APPROVED",
    applicationDate: "2025-01-10",
    issuedDate: "2025-01-15",
    reviewedBy: "Prof. Nasreen Akhter",
    reviewedRole: "ADMIN",
    verificationCode: "VER-9201-ENG101",
  },
  {
    id: "cert-002",
    code: "LT-CERT-2025-0199",
    certificateNumber: "LTA-BSC-2025-19934",
    studentId: "usr-006",
    studentName: "Nusrat Jahan",
    institution: "Institute of Health Technology (IHT), Rajshahi",
    program: "BSC",
    year: "1",
    title: "B.Sc. 1st Year Core Competency: Cell Biology, Biophysics & Histological Protocols",
    grade: "Superior Competency (88%)",
    status: "APPROVED",
    applicationDate: "2025-01-20",
    issuedDate: "2025-01-25",
    reviewedBy: "Dr. Rafiqul Islam",
    reviewedRole: "SUPER_ADMIN",
    verificationCode: "VER-8812-BIO101",
  },
  {
    id: "cert-003",
    code: "LT-REQ-2026-003",
    certificateNumber: "LTA-DIP-2026-88412",
    studentId: "usr-005",
    studentName: "Md. Ansarul Islam",
    institution: "Dhaka Institute of Health Technology (DIHT)",
    program: "DIPLOMA",
    year: "2",
    title: "2nd Year Clinical Benchmark: Clinical Pathology, Routine Hematology & Microbiology",
    grade: "Expected: First Class (85%+)",
    status: "PENDING",
    applicationDate: "2026-09-01",
    verificationCode: "VER-PENDING-0482",
  },
];

const STORAGE_KEY = "labtutor_certificates_registry_v1";
const TEMPLATE_STORAGE_KEY = "labtutor_cert_template_v1";

interface CertificateContextType {
  certificates: CertificateRecord[];
  templateConfig: CertificateTemplateConfig;
  applyForCertificate: (
    data: Omit<CertificateRecord, "id" | "code" | "certificateNumber" | "status" | "applicationDate" | "verificationCode">
  ) => { success: boolean; error?: string; certificateNumber: string };
  reviewCertificate: (
    id: string,
    decision: "APPROVED" | "REJECTED",
    reviewerName: string,
    reviewerRole: string,
    feedback?: string
  ) => void;
  updateTemplateConfig: (updates: Partial<CertificateTemplateConfig>) => void;
  resetTemplateConfig: () => void;
}

const CertificateContext = React.createContext<CertificateContextType | undefined>(undefined);

export function CertificateProvider({ children }: { children: React.ReactNode }) {
  const [certificates, setCertificates] = React.useState<CertificateRecord[]>(INITIAL_CERTIFICATES);
  const [templateConfig, setTemplateConfig] = React.useState<CertificateTemplateConfig>(DEFAULT_TEMPLATE);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure all certificates have certificateNumber
          const sanitized = parsed.map((c: any) => ({
            ...c,
            certificateNumber:
              c.certificateNumber ||
              `LTA-${c.program || "DIP"}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
          }));
          setCertificates(sanitized);
        }
      }
      const storedTemplate = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (storedTemplate) {
        setTemplateConfig({ ...DEFAULT_TEMPLATE, ...JSON.parse(storedTemplate) });
      }
    } catch {}
  }, []);

  const persistCertificates = (newCerts: CertificateRecord[]) => {
    setCertificates(newCerts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCerts));
    } catch {}
  };

  const applyForCertificate = React.useCallback(
    (
      data: Omit<CertificateRecord, "id" | "code" | "certificateNumber" | "status" | "applicationDate" | "verificationCode">
    ): { success: boolean; error?: string; certificateNumber: string } => {
      const currentYear = new Date().getFullYear();
      const progCode = data.program === "BSC" ? "BSC" : "DIP";
      const randomSeq = Math.floor(10000 + Math.random() * 90000);
      const code = `LT-REQ-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
      const certificateNumber = `LTA-${progCode}-${currentYear}-${randomSeq}`;
      const verificationCode = `VER-${Math.floor(1000 + Math.random() * 9000)}-${data.program}`;

      const newCert: CertificateRecord = {
        ...data,
        id: `cert-${Date.now()}`,
        code,
        certificateNumber,
        status: "PENDING",
        applicationDate: new Date().toISOString().split("T")[0],
        verificationCode,
      };

      const updated = [newCert, ...certificates];
      persistCertificates(updated);

      // Record study activity
      try {
        const { recordStudentActivity } = require("@/lib/curriculum/student-study-progress-store");
        recordStudentActivity(data.studentId || "usr-005", data.program, data.year, {
          type: "CERTIFICATE",
          title: `Applied for Certificate: ${data.title}`,
          desc: `Submitted official credential verification application with grade ${data.grade}. Assigned Certificate No: ${certificateNumber}. Pending Super Admin review.`,
          device: "Candidate Web Client",
          ip: "103.205.71.18",
          status: "Pending Verification",
        });
      } catch {}

      // Dispatch event
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("labtutor_certificate_applied", {
            detail: { cert: newCert },
          })
        );
      }

      return { success: true, certificateNumber };
    },
    [certificates]
  );

  const reviewCertificate = React.useCallback(
    (id: string, decision: "APPROVED" | "REJECTED", reviewerName: string, reviewerRole: string, feedback?: string) => {
      let targetCert: CertificateRecord | undefined;

      const updated = certificates.map((cert) => {
        if (cert.id === id) {
          const currentYear = new Date().getFullYear();
          const progCode = cert.program === "BSC" ? "BSC" : "DIP";
          const finalCertNumber =
            cert.certificateNumber || `LTA-${progCode}-${currentYear}-${Math.floor(10000 + Math.random() * 90000)}`;

          targetCert = {
            ...cert,
            status: decision,
            certificateNumber: finalCertNumber,
            code: decision === "APPROVED" ? cert.code.replace("REQ", "CERT") : cert.code,
            issuedDate: decision === "APPROVED" ? new Date().toISOString().split("T")[0] : undefined,
            reviewedBy: reviewerName,
            reviewedRole: reviewerRole,
            feedback,
          };
          return targetCert;
        }
        return cert;
      });
      persistCertificates(updated);

      // Record student activity event and dispatch in-app notification
      if (targetCert) {
        try {
          const { recordStudentActivity } = require("@/lib/curriculum/student-study-progress-store");
          recordStudentActivity(targetCert.studentId || "usr-005", targetCert.program, targetCert.year, {
            type: "CERTIFICATE",
            title:
              decision === "APPROVED"
                ? `Certificate Conferred: ${targetCert.title}`
                : `Certificate Request Declined: ${targetCert.title}`,
            desc:
              decision === "APPROVED"
                ? `Officially conferred by ${reviewerName} (${reviewerRole}). Certificate No: ${targetCert.certificateNumber} (Verification: ${targetCert.verificationCode}).`
                : `Declined by ${reviewerName}. Reason: ${feedback || "Curriculum criteria not met."}`,
            device: "Super Admin Directorate",
            ip: "103.205.71.18",
            status: decision === "APPROVED" ? "Conferred & Active" : "Declined",
          });

          // Dispatch in-app notification into localStorage announcements
          const storedNotifs = localStorage.getItem("labtutor_lms_announcements_v1");
          const notifsList = storedNotifs ? JSON.parse(storedNotifs) : [];
          const notifEntry = {
            id: `notif-cert-${Date.now()}`,
            title: decision === "APPROVED" ? `Certificate Conferred: ${targetCert.title}` : `Certificate Request Declined`,
            message:
              decision === "APPROVED"
                ? `Congratulations ${targetCert.studentName}! Your certificate application for ${targetCert.title} (No: ${targetCert.certificateNumber}) has been APPROVED by ${reviewerName}. You can now download and print your official credential.`
                : `Your certificate request for ${targetCert.title} was declined by ${reviewerName}. Reason: "${feedback || "Please complete all pending practical tasks and bench SOPs."}"`,
            type: "ACADEMIC",
            priority: decision === "APPROVED" ? "HIGH" : "URGENT",
            targetAudience: "ALL",
            targetUserId: targetCert.studentId,
            targetStudentName: targetCert.studentName,
            authorRole: reviewerRole === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN",
            authorName: reviewerName,
            createdAt: new Date().toISOString(),
            readBy: [],
          };
          localStorage.setItem("labtutor_lms_announcements_v1", JSON.stringify([notifEntry, ...notifsList]));
        } catch {}

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("labtutor_certificate_reviewed", {
              detail: { cert: targetCert, decision, feedback, reviewerName },
            })
          );
        }
      }
    },
    [certificates]
  );

  const updateTemplateConfig = React.useCallback((updates: Partial<CertificateTemplateConfig>) => {
    setTemplateConfig((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetTemplateConfig = React.useCallback(() => {
    setTemplateConfig(DEFAULT_TEMPLATE);
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(DEFAULT_TEMPLATE));
    } catch {}
  }, []);

  return (
    <CertificateContext.Provider
      value={{
        certificates,
        templateConfig,
        applyForCertificate,
        reviewCertificate,
        updateTemplateConfig,
        resetTemplateConfig,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificates() {
  const context = React.useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificates must be used within a CertificateProvider");
  }
  return context;
}
