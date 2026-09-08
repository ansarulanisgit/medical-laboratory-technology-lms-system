"use client";

import * as React from "react";

export interface JobOfferItem {
  id: string;
  title: string;
  organization: string;
  organizationType: "Hospital" | "Diagnostic Center" | "Research Institute" | "Blood Bank" | "Corporate Health";
  location: string;
  jobType: "Full-Time" | "Part-Time" | "Internship" | "Contract";
  salaryRange: string;
  experienceLevel: "Entry Level (Fresh Graduates)" | "1-2 Years Experience" | "3+ Years Senior Technologist";
  requiredQualifications: string[];
  responsibilities: string[];
  deadline: string;
  contactEmailOrUrl: string;
  postedBy: string;
  postedRole: string;
  createdAt: string;
  isActive: boolean;
}

const INITIAL_JOBS: JobOfferItem[] = [
  {
    id: "job-001",
    title: "Junior Medical Technologist (Hematology & Biochemistry)",
    organization: "Square Hospitals Ltd.",
    organizationType: "Hospital",
    location: "Panthapath, Dhaka",
    jobType: "Full-Time",
    salaryRange: "BDT 28,000 – 35,000 / month + Benefits",
    experienceLevel: "Entry Level (Fresh Graduates)",
    requiredQualifications: [
      "Diploma in Medical Laboratory Technology (DMT) or B.Sc. in Health Technology",
      "Valid registration with State Medical Faculty of Bangladesh (SMFB) or Allied Health Board",
      "Hands-on experience with automated clinical chemistry and hematology analyzers",
    ],
    responsibilities: [
      "Perform routine hematological cell counts and prepare Leishman-stained smears.",
      "Conduct photometric clinical chemistry assays (liver and renal panels).",
      "Perform internal quality control (IQC) daily and document calibrations.",
    ],
    deadline: "2026-10-15",
    contactEmailOrUrl: "jobs@squarehospital.com",
    postedBy: "Dr. Rafiqul Islam",
    postedRole: "SUPER_ADMIN",
    createdAt: "2026-09-01",
    isActive: true,
  },
  {
    id: "job-002",
    title: "Clinical Microbiology Technologist (Culture & Sensitivity)",
    organization: "Popular Diagnostic Centre Ltd.",
    organizationType: "Diagnostic Center",
    location: "Dhanmondi, Dhaka",
    jobType: "Full-Time",
    salaryRange: "BDT 32,000 – 40,000 / month",
    experienceLevel: "1-2 Years Experience",
    requiredQualifications: [
      "B.Sc. or Diploma in Medical Laboratory Technology",
      "Proficiency in bacterial isolation, Gram stain, AFB staining, and Kirby-Bauer AST",
      "Experience with automated blood culture systems (e.g. BACT/ALERT / BD BACTEC)",
    ],
    responsibilities: [
      "Inoculate clinical specimens on blood, MacConkey, and chocolate agar media.",
      "Read antibiotic zone of inhibition according to CLSI guidelines.",
      "Prepare urgent Gram stain smears for CSF and body fluids.",
    ],
    deadline: "2026-10-30",
    contactEmailOrUrl: "career@populardiagnostic.com",
    postedBy: "Prof. Nasreen Akhter",
    postedRole: "ADMIN",
    createdAt: "2026-09-02",
    isActive: true,
  },
  {
    id: "job-003",
    title: "Blood Transfusion & Immunohematology Officer",
    organization: "Bangladesh Red Crescent Society Blood Center",
    organizationType: "Blood Bank",
    location: "Mohammadpur, Dhaka",
    jobType: "Full-Time",
    salaryRange: "BDT 30,000 – 38,000 / month",
    experienceLevel: "Entry Level (Fresh Graduates)",
    requiredQualifications: [
      "Diploma in MLT or B.Sc. in Health Technology",
      "Thorough knowledge of tube blood grouping, Coombs testing, and crossmatching",
      "Knowledge of donor screening and blood component separation (PRBC, FFP, Platelets)",
    ],
    responsibilities: [
      "Perform forward and reverse ABO/Rh tube testing on patient and donor units.",
      "Execute major and minor crossmatch tests in anti-human globulin (AHG) phase.",
      "Screen for transfusion-transmitted infections (HBsAg, HCV, HIV, Syphilis, Malaria).",
    ],
    deadline: "2026-11-15",
    contactEmailOrUrl: "hr@bdrcs.org",
    postedBy: "Dr. Sabrina Parvin",
    postedRole: "MENTOR",
    createdAt: "2026-09-03",
    isActive: true,
  },
  {
    id: "job-004",
    title: "Diagnostic Laboratory Internship (Paid Stipend)",
    organization: "Evercare Hospital Dhaka",
    organizationType: "Hospital",
    location: "Bashundhara R/A, Dhaka",
    jobType: "Internship",
    salaryRange: "BDT 15,000 / month (Stipend) + Free Meal",
    experienceLevel: "Entry Level (Fresh Graduates)",
    requiredQualifications: [
      "Final year student or recent graduate of Diploma / B.Sc. in MLT",
      "Eager to learn modern automated hospital laboratory workflows and CAP/ISO 15189 standards",
    ],
    responsibilities: [
      "Rotate through Pathology, Biochemistry, Microbiology, and Emergency Labs.",
      "Learn vacuum phlebotomy techniques and barcode sample accessioning.",
    ],
    deadline: "2026-10-25",
    contactEmailOrUrl: "internships@evercarebd.com",
    postedBy: "MD. Arif Hossain",
    postedRole: "MENTOR",
    createdAt: "2026-09-04",
    isActive: true,
  },
];

const STORAGE_KEY = "labtutor_jobs_board_v1";

interface JobsContextType {
  jobs: JobOfferItem[];
  addJob: (item: Omit<JobOfferItem, "id" | "createdAt">) => { success: boolean; error?: string };
  updateJob: (id: string, updates: Partial<JobOfferItem>) => { success: boolean; error?: string };
  deleteJob: (id: string) => { success: boolean; error?: string };
}

const JobsContext = React.createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = React.useState<JobOfferItem[]>(INITIAL_JOBS);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setJobs(parsed);
      }
    } catch {}
  }, []);

  const persistJobs = (newJobs: JobOfferItem[]) => {
    setJobs(newJobs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newJobs));
    } catch {}
  };

  const addJob = React.useCallback(
    (item: Omit<JobOfferItem, "id" | "createdAt">): { success: boolean; error?: string } => {
      if (!item.title.trim()) return { success: false, error: "Job title is required." };
      if (!item.organization.trim()) return { success: false, error: "Organization name is required." };

      const newJob: JobOfferItem = {
        ...item,
        id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString().split("T")[0],
      };

      const updated = [newJob, ...jobs];
      persistJobs(updated);
      return { success: true };
    },
    [jobs]
  );

  const updateJob = React.useCallback(
    (id: string, updates: Partial<JobOfferItem>): { success: boolean; error?: string } => {
      const idx = jobs.findIndex((j) => j.id === id);
      if (idx === -1) return { success: false, error: "Job not found." };

      const updated = [...jobs];
      updated[idx] = { ...updated[idx], ...updates };
      persistJobs(updated);
      return { success: true };
    },
    [jobs]
  );

  const deleteJob = React.useCallback(
    (id: string): { success: boolean; error?: string } => {
      const updated = jobs.filter((j) => j.id !== id);
      persistJobs(updated);
      return { success: true };
    },
    [jobs]
  );

  return (
    <JobsContext.Provider value={{ jobs, addJob, updateJob, deleteJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = React.useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within JobsProvider");
  }
  return context;
}
