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

export const INITIAL_CERTIFICATES: CertificateRecord[] = [
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
