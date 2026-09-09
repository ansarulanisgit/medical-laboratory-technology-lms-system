"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { CertificateRecord, INITIAL_CERTIFICATES } from "@/lib/types/certificate-types";
export type { CertificateRecord };
export { INITIAL_CERTIFICATES };
import { ProgramLevel } from "@/lib/curriculum/academic-context";

// (CertificateRecord imported and re-exported from @/lib/types/certificate-types)

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
  watermarkLogoOpacity: number; // e.g. 0.08 (8%)
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
  watermarkLogoOpacity: 0.05,
  showCenterLogoWatermark: true,
};

// (INITIAL_CERTIFICATES imported and re-exported from @/lib/types/certificate-types)

export const CERTIFICATES_STORAGE_KEY = "labtutor_certificates_registry_v1";
const STORAGE_KEY = CERTIFICATES_STORAGE_KEY;
const TEMPLATE_STORAGE_KEY = "labtutor_cert_template_v1";
const ADMIN_TEMPLATES_STORAGE_KEY = "labtutor_admin_cert_templates_v1";

export function getProgramLabel(program: ProgramLevel | string): string {
  if (program === "BSC") {
    return "Bachelor of Science in Health Technology (Laboratory) — B.Sc. MLT";
  }
  return "Diploma in Medical Laboratory Technology — DMLT (SMFB)";
}

export function getYearLabel(year: string | number): string {
  const y = String(year);
  switch (y) {
    case "1":
      return "1st Year (Foundation Benchwork & Basic Sciences)";
    case "2":
      return "2nd Year (Core Clinical Pathology, Hematology & Microbiology)";
    case "3":
      return "3rd Year (Advanced Diagnostics, Immunohematology & QC)";
    case "4":
      return "4th Year (Hospital Laboratory Practicum & Management)";
    default:
      return `Year ${year}`;
  }
}

export function findCertificateByQuery(
  query: string,
  records?: CertificateRecord[]
): CertificateRecord | undefined {
  if (!query || !query.trim()) return undefined;
  const clean = query.trim().toUpperCase();

  const list = records && records.length > 0 ? records : INITIAL_CERTIFICATES;

  // Demo code backward compatibility
  if (clean === "LAB-DEMO-2026" || clean === "DEMO") {
    return list[0];
  }

  // Exact matches
  const exact = list.find((cert) => {
    return (
      (cert.certificateNumber && cert.certificateNumber.toUpperCase() === clean) ||
      (cert.code && cert.code.toUpperCase() === clean) ||
      (cert.verificationCode && cert.verificationCode.toUpperCase() === clean) ||
      (cert.id && cert.id.toUpperCase() === clean)
    );
  });
  if (exact) return exact;

  // Normalized alphanumeric (ignoring hyphens, spaces, slashes)
  const cleanAlphaNum = clean.replace(/[^A-Z0-9]/g, "");
  if (cleanAlphaNum.length >= 4) {
    const loose = list.find((cert) => {
      const cNum = (cert.certificateNumber || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      const cCode = (cert.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      const cVer = (cert.verificationCode || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      return cNum === cleanAlphaNum || cCode === cleanAlphaNum || cVer === cleanAlphaNum;
    });
    if (loose) return loose;
  }

  if (records && records.length > 0 && records !== INITIAL_CERTIFICATES) {
    return findCertificateByQuery(query, INITIAL_CERTIFICATES);
  }

  return undefined;
}

export interface AdminCertificateTemplate {
  id: string;
  program: ProgramLevel;
  year: string;
  title: string;
  institution: string;
  competencyFocus: string;
  isDefault?: boolean;
}

export const DEFAULT_ADMIN_TEMPLATES: AdminCertificateTemplate[] = [
  {
    id: "tpl-bsc-4",
    program: "BSC",
    year: "4",
    title: "B.Sc. Year 4 Competency: Diagnostic Clinical Benchmark & SOP Verification",
    institution: "DGHS Medical Technology Directorate & LabTutor Central Administration",
    competencyFocus: "Clinical Benchmark & SOP Verification (Year 4)",
    isDefault: true,
  },
  {
    id: "tpl-bsc-1",
    program: "BSC",
    year: "1",
    title: "B.Sc. Year 1 Core Competency: Cell Biology, Biophysics & Histological Protocols",
    institution: "DGHS Medical Technology Directorate & LabTutor Central Administration",
    competencyFocus: "Pre-Analytical & Basic Laboratory Sciences (Year 1)",
    isDefault: true,
  },
  {
    id: "tpl-bsc-2",
    program: "BSC",
    year: "2",
    title: "B.Sc. Year 2 Clinical Benchmark: Biochemistry, Clinical Pathology & Systematic Bacteriology",
    institution: "DGHS Medical Technology Directorate & LabTutor Central Administration",
    competencyFocus: "Diagnostic Biochemistry & Bacteriology (Year 2)",
    isDefault: true,
  },
  {
    id: "tpl-bsc-3",
    program: "BSC",
    year: "3",
    title: "B.Sc. Year 3 Advanced Diagnostics: Blood Banking, Immunology & Diagnostic Parasitology",
    institution: "DGHS Medical Technology Directorate & LabTutor Central Administration",
    competencyFocus: "Immunohematology & Advanced Diagnostics (Year 3)",
    isDefault: true,
  },
  {
    id: "tpl-dip-1",
    program: "DIPLOMA",
    year: "1",
    title: "1st Year Foundation Competency: Diagnostic Pre-Analytical SOPs & Basic Sciences",
    institution: "State Medical Faculty of Bangladesh (SMFB) & DIHT Central Laboratory",
    competencyFocus: "Pre-Analytical SOPs & Basic Sciences (Year 1)",
    isDefault: true,
  },
  {
    id: "tpl-dip-2",
    program: "DIPLOMA",
    year: "2",
    title: "2nd Year Clinical Benchmark: Clinical Pathology, Routine Hematology & Microbiology",
    institution: "State Medical Faculty of Bangladesh (SMFB) & DIHT Central Laboratory",
    competencyFocus: "Clinical Pathology & Routine Benchwork (Year 2)",
    isDefault: true,
  },
  {
    id: "tpl-dip-3",
    program: "DIPLOMA",
    year: "3",
    title: "3rd Year Senior Benchmark: Advanced Histotechnology, Immunohematology & QC Protocols",
    institution: "State Medical Faculty of Bangladesh (SMFB) & DIHT Central Laboratory",
    competencyFocus: "Histotechnology & Quality Control (Year 3)",
    isDefault: true,
  },
  {
    id: "tpl-dip-4",
    program: "DIPLOMA",
    year: "4",
    title: "4th Year Internship Practicum: Hospital Laboratory Management & Comprehensive MLT Benchwork",
    institution: "State Medical Faculty of Bangladesh (SMFB) & DIHT Central Laboratory",
    competencyFocus: "Hospital Laboratory Internship Practicum (Year 4)",
    isDefault: true,
  },
];

interface CertificateContextType {
  certificates: CertificateRecord[];
  templateConfig: CertificateTemplateConfig;
  adminTemplates: AdminCertificateTemplate[];
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
  updateCertificateRecord: (id: string, updates: Partial<CertificateRecord>) => void;
  updateTemplateConfig: (updates: Partial<CertificateTemplateConfig>) => void;
  resetTemplateConfig: () => void;
  updateAdminTemplate: (id: string, updates: Partial<AdminCertificateTemplate>) => void;
  addAdminTemplate: (tpl: Omit<AdminCertificateTemplate, "id">) => void;
  resetAdminTemplates: () => void;
  getTemplateForProgramAndYear: (program: ProgramLevel, year: string) => AdminCertificateTemplate;
  findCertificate: (query: string) => CertificateRecord | undefined;
}

const CertificateContext = React.createContext<CertificateContextType | undefined>(undefined);

export function CertificateProvider({ children }: { children: React.ReactNode }) {
  const [certificates, setCertificates] = React.useState<CertificateRecord[]>(INITIAL_CERTIFICATES);
  const [templateConfig, setTemplateConfig] = React.useState<CertificateTemplateConfig>(DEFAULT_TEMPLATE);
  const [adminTemplates, setAdminTemplates] = React.useState<AdminCertificateTemplate[]>(DEFAULT_ADMIN_TEMPLATES);

  // 1. Fetch latest certificates from central database on mount and fallback to localStorage
  React.useEffect(() => {
    const syncFromCentralDb = async () => {
      try {
        const res = await fetch("/api/certificates");
        const json = await res.json();
        if (json.success && Array.isArray(json.certificates) && json.certificates.length > 0) {
          setCertificates(json.certificates);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json.certificates));
          } catch {}
          return;
        }
      } catch (err) {
        console.warn("Central database initial sync:", err);
      }

      // Offline / network fallback to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = parsed.map((c: any) => ({
              ...c,
              certificateNumber:
                c.certificateNumber ||
                `LTA-${c.program || "DIP"}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
            }));
            setCertificates(sanitized);
          }
        }
      } catch {}
    };

    syncFromCentralDb();

    // Template config loading
    try {
      const storedTemplate = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (storedTemplate) {
        const parsedTemplate = JSON.parse(storedTemplate);
        if (parsedTemplate.watermarkLogoOpacity === 0.18 || parsedTemplate.watermarkLogoOpacity === 0.15 || parsedTemplate.watermarkLogoOpacity === 0.2 || parsedTemplate.watermarkLogoOpacity === 0.08) {
          parsedTemplate.watermarkLogoOpacity = 0.05;
        }
        setTemplateConfig({ ...DEFAULT_TEMPLATE, ...parsedTemplate });
      }
      const storedAdminTemplates = localStorage.getItem(ADMIN_TEMPLATES_STORAGE_KEY);
      if (storedAdminTemplates) {
        const parsedAdminTemplates = JSON.parse(storedAdminTemplates);
        if (Array.isArray(parsedAdminTemplates) && parsedAdminTemplates.length > 0) {
          setAdminTemplates(parsedAdminTemplates);
        }
      }
    } catch {}

    // 2. Real-time Supabase subscription for instant cross-client updates
    let channel: any = null;
    try {
      const supabase = createClient();
      channel = supabase.channel("certificates_realtime_provider");
      channel
        .on("broadcast", { event: "CERTIFICATES_SYNCED" }, ({ payload }: any) => {
          if (payload?.certificates && Array.isArray(payload.certificates)) {
            setCertificates((prev) => {
              const incoming: CertificateRecord[] = payload.certificates;
              const map = new Map<string, CertificateRecord>();
              incoming.forEach((c) => {
                const key = (c.certificateNumber || c.code || c.id).toUpperCase();
                map.set(key, c);
              });
              prev.forEach((c) => {
                const key = (c.certificateNumber || c.code || c.id).toUpperCase();
                if (!map.has(key)) map.set(key, c);
              });
              const merged = Array.from(map.values());
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        })
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "certificates" },
          () => {
            syncFromCentralDb();
          }
        )
        .subscribe();
    } catch (e) {
      console.warn("Realtime certificates channel setup:", e);
    }

    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch {}
      }
    };
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

      // Real-time central database sync
      fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCert),
      }).catch((e) => console.warn("Central DB apply sync error:", e));

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

      // Real-time central database sync
      if (targetCert) {
        fetch("/api/certificates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(targetCert),
        }).catch((e) => console.warn("Central DB review sync error:", e));
      }

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

  const updateCertificateRecord = React.useCallback((id: string, updates: Partial<CertificateRecord>) => {
    setCertificates((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      persistCertificates(next);
      return next;
    });
  }, []);

  const persistAdminTemplates = (newTemplates: AdminCertificateTemplate[]) => {
    setAdminTemplates(newTemplates);
    try {
      localStorage.setItem(ADMIN_TEMPLATES_STORAGE_KEY, JSON.stringify(newTemplates));
    } catch {}
  };

  const updateAdminTemplate = React.useCallback((id: string, updates: Partial<AdminCertificateTemplate>) => {
    setAdminTemplates((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      persistAdminTemplates(next);
      return next;
    });
  }, []);

  const addAdminTemplate = React.useCallback((tpl: Omit<AdminCertificateTemplate, "id">) => {
    const newTpl: AdminCertificateTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
    };
    setAdminTemplates((prev) => {
      const next = [newTpl, ...prev];
      persistAdminTemplates(next);
      return next;
    });
  }, []);

  const resetAdminTemplates = React.useCallback(() => {
    persistAdminTemplates(DEFAULT_ADMIN_TEMPLATES);
  }, []);

  const getTemplateForProgramAndYear = React.useCallback(
    (program: ProgramLevel, year: string): AdminCertificateTemplate => {
      const found = adminTemplates.find((t) => t.program === program && t.year === year);
      if (found) return found;
      const defaultFound = DEFAULT_ADMIN_TEMPLATES.find((t) => t.program === program && t.year === year);
      if (defaultFound) return defaultFound;
      return {
        id: `fallback-${program}-${year}`,
        program,
        year,
        title: `${program === "BSC" ? "B.Sc." : "Diploma"} Competency: Diagnostic Clinical Benchmark & SOP Verification`,
        institution: "DGHS Medical Technology Directorate & LabTutor Central Administration",
        competencyFocus: "Clinical Laboratory Science & Diagnostic Competency",
      };
    },
    [adminTemplates]
  );

  const findCertificate = React.useCallback(
    (query: string): CertificateRecord | undefined => {
      return findCertificateByQuery(query, certificates);
    },
    [certificates]
  );

  return (
    <CertificateContext.Provider
      value={{
        certificates,
        templateConfig,
        adminTemplates,
        applyForCertificate,
        reviewCertificate,
        updateCertificateRecord,
        updateTemplateConfig,
        resetTemplateConfig,
        updateAdminTemplate,
        addAdminTemplate,
        resetAdminTemplates,
        getTemplateForProgramAndYear,
        findCertificate,
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
