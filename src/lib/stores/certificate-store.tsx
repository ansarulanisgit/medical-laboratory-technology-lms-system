"use client";

import * as React from "react";
import { ProgramLevel } from "@/lib/curriculum/academic-context";

export interface CertificateRecord {
  id: string;
  code: string;
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

export interface CertificateTemplateConfig {
  institutionName: string;
  subHeader: string;
  primaryColor: string; // hex
  borderStyle: "CLASSIC_GOLD" | "EMERALD_CLINICAL" | "MINIMALIST_NAVY";
  signatoryTitle1: string;
  signatoryName1: string;
  signatoryTitle2: string;
  signatoryName2: string;
  sealText: string;
}

const DEFAULT_TEMPLATE: CertificateTemplateConfig = {
  institutionName: "State Medical Faculty of Bangladesh & LabTutor Academy",
  subHeader: "Governed Diagnostic Medical Laboratory Technology Competency Registry",
  primaryColor: "#059669",
  borderStyle: "EMERALD_CLINICAL",
  signatoryTitle1: "Chairman, Academic Examination Council",
  signatoryName1: "Dr. Rafiqul Islam, MBBS, FCPS",
  signatoryTitle2: "Clinical Director of Medical Technology",
  signatoryName2: "Prof. Nasreen Akhter, M.Phil",
  sealText: "OFFICIALLY VERIFIED • COMPETENCY CONFERRED",
};

const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: "cert-001",
    code: "LT-CERT-2025-0482",
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
  applyForCertificate: (data: Omit<CertificateRecord, "id" | "code" | "status" | "applicationDate" | "verificationCode">) => { success: boolean; error?: string };
  reviewCertificate: (id: string, decision: "APPROVED" | "REJECTED", reviewerName: string, reviewerRole: string, feedback?: string) => void;
  updateTemplateConfig: (updates: Partial<CertificateTemplateConfig>) => void;
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
        if (Array.isArray(parsed) && parsed.length > 0) setCertificates(parsed);
      }
      const storedTemplate = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (storedTemplate) {
        setTemplateConfig(JSON.parse(storedTemplate));
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
    (data: Omit<CertificateRecord, "id" | "code" | "status" | "applicationDate" | "verificationCode">): { success: boolean; error?: string } => {
      const code = `LT-REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const verificationCode = `VER-${Math.floor(1000 + Math.random() * 9000)}-${data.program}`;

      const newCert: CertificateRecord = {
        ...data,
        id: `cert-${Date.now()}`,
        code,
        status: "PENDING",
        applicationDate: new Date().toISOString().split("T")[0],
        verificationCode,
      };

      const updated = [newCert, ...certificates];
      persistCertificates(updated);
      return { success: true };
    },
    [certificates]
  );

  const reviewCertificate = React.useCallback(
    (id: string, decision: "APPROVED" | "REJECTED", reviewerName: string, reviewerRole: string, feedback?: string) => {
      const updated = certificates.map((cert) => {
        if (cert.id === id) {
          return {
            ...cert,
            status: decision,
            code: decision === "APPROVED" ? cert.code.replace("REQ", "CERT") : cert.code,
            issuedDate: decision === "APPROVED" ? new Date().toISOString().split("T")[0] : undefined,
            reviewedBy: reviewerName,
            reviewedRole: reviewerRole,
            feedback,
          };
        }
        return cert;
      });
      persistCertificates(updated);
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

  return (
    <CertificateContext.Provider
      value={{
        certificates,
        templateConfig,
        applyForCertificate,
        reviewCertificate,
        updateTemplateConfig,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificates() {
  const context = React.useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificates must be used within CertificateProvider");
  }
  return context;
}
