"use client";

import * as React from "react";
import { ProgramLevel } from "@/lib/curriculum/academic-context";

export type ResumeTheme =
  | "MODERN_SPLIT"
  | "MINIMALIST_ACADEMIC"
  | "EXECUTIVE_HEALTH"
  | "COMPACT_DIAGNOSTIC"
  | "MODERN_MINIMALIST"
  | "CLINICAL_TIMELINE"
  | "MODERN_CLINICAL";

export interface ResumeSkill {
  id: string;
  name: string;
  category: "Clinical Pathology" | "Biochemistry" | "Microbiology" | "Blood Transfusion" | "Histopathology" | "General & IT" | string;
  proficiency: "Competent" | "Advanced" | "Mastery";
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institute: string;
  yearOfPassing: string;
  result: string;
}

export interface ResumeExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  location?: string;
  responsibilities: string[];
}

export interface ResumeCustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  items: ResumeCustomSectionItem[];
}

export interface ResumePersonalDetails {
  fullName?: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other" | string;
  maritalStatus: "Single" | "Married" | string;
  nid: string;
  nationality: string;
  religion?: string;
  bloodGroup?: string;
  presentAddress: string;
  permanentAddress: string;
}

export interface ResumeSignature {
  enabled: boolean;
  signatoryName: string;
  date: string;
  imageUrl?: string;
}

export type ResumeSectionKey =
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "personal"
  | "equipment"
  | "certs"
  | "languages"
  | "custom";

export const DEFAULT_SECTION_HEADINGS: Record<ResumeSectionKey, string> = {
  summary: "Career Objectives",
  personal: "Personal Details",
  education: "Academic Qualifications & Training",
  skills: "Laboratory Competencies",
  experience: "Working Experiences",
  languages: "Languages & Fluency",
  equipment: "Diagnostic Instrumentation & Analyzers",
  certs: "Certifications & Licensure",
  custom: "Specialized Projects & Research",
};

export const DEFAULT_SECTION_ORDER: ResumeSectionKey[] = [
  "summary",
  "personal",
  "education",
  "skills",
  "experience",
  "languages",
  "equipment",
  "certs",
  "custom",
];

export interface ResumeContactLink {
  id: string;
  label: string;
  url: string;
}
export type ResumeFontFamily = "sans" | "serif" | "mono" | "system" | "inter" | "playfair" | string;

export interface ResumeFontOption {
  id: string;
  name: string;
  category: string;
  fontFamilyCSS: string;
  description: string;
}

export const RESUME_FONT_FAMILIES: Record<string, ResumeFontOption> = {
  sans: {
    id: "sans",
    name: "Modern Sans (Plus Jakarta)",
    category: "Sans-Serif",
    fontFamilyCSS: "'Plus Jakarta Sans', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Ultra-clean modern healthcare typography",
  },
  inter: {
    id: "inter",
    name: "Clean Professional (Inter)",
    category: "Sans-Serif",
    fontFamilyCSS: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Crisp, balanced high-legibility ATS sans",
  },
  serif: {
    id: "serif",
    name: "Academic Serif (Merriweather)",
    category: "Serif",
    fontFamilyCSS: "'Merriweather', Georgia, Cambria, 'Times New Roman', serif",
    description: "Distinguished institutional editorial serif",
  },
  playfair: {
    id: "playfair",
    name: "Editorial Classic (Playfair)",
    category: "Serif",
    fontFamilyCSS: "'Playfair Display', 'Merriweather', Georgia, serif",
    description: "High-contrast academic title typography",
  },
  mono: {
    id: "mono",
    name: "Technical Mono (JetBrains Lab)",
    category: "Monospace",
    fontFamilyCSS: "'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, Monaco, Consolas, monospace",
    description: "Precision laboratory diagnostic monospace",
  },
  system: {
    id: "system",
    name: "Standard System UI (Native)",
    category: "System",
    fontFamilyCSS: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    description: "Standard OS native system typography",
  },
};

export type ResumeDividerStyle =
  | "solid"
  | "thick"
  | "double"
  | "dashed"
  | "dotted"
  | "gradient"
  | "none";

export interface ResumeData {
  id: string;
  studentId: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedinOrWeb: string;
  summary: string;
  program: ProgramLevel;
  academicYear: string;
  skills: ResumeSkill[];
  education: ResumeEducation[];
  rotations: ResumeExperience[];
  certifications: string[];
  equipmentProficiencies: string[];
  languages: string[];
  customSections: ResumeCustomSection[];
  contactLinks: ResumeContactLink[];
  sectionHeadings: Record<ResumeSectionKey, string>;
  sectionOrder: ResumeSectionKey[];
  hiddenSections?: ResumeSectionKey[];
  personalDetails: ResumePersonalDetails;
  signature: ResumeSignature;
  theme: ResumeTheme;
  fontFamily: ResumeFontFamily;
  fontSize: "sm" | "base" | "lg";
  sectionSpacing: "compact" | "normal" | "spacious";
  primaryColor: string;
  accentColor: string;
  headerStyle: "standard" | "centered" | "banner";
  showDividers?: boolean;
  dividerStyle?: ResumeDividerStyle;
  photoUrl?: string;
  showPhoto?: boolean;
  photoShape?: "rounded" | "circle";
  updatedAt: string;
}

export const DEFAULT_RESUME: ResumeData = {
  id: "res-default",
  studentId: "usr-005",
  fullName: "Md. Ansarul Islam",
  title: "Medical Technologist (Laboratory)",
  email: "ansarul.support@gmail.com",
  phone: "+8801709260934",
  location: "Dhaka, Bangladesh",
  linkedinOrWeb: "linkedin.com/in/ansarul-islam",
  summary: "Dedicated and certified Medical Laboratory Technologist seeking a challenging clinical role to apply analytical competencies in automated hematology, clinical biochemistry photometric assays, routine microbiological cultures, and biosafety protocols with focus on analytical quality control.",
  personalDetails: {
    fullName: "Md. Ansarul Islam",
    fatherName: "Harun Or Rashid",
    motherName: "Anjura Begum",
    dateOfBirth: "15 October 2002",
    gender: "Male",
    maritalStatus: "Married",
    nid: "19982692510000123",
    nationality: "Bangladeshi",
    religion: "Islam",
    bloodGroup: "B+ (Positive)",
    presentAddress: "House #12, Road #4, Dhanmondi, Dhaka-1205",
    permanentAddress: "Village: Gopalpur, P.O: Damkura Hat, Thana: Paba, Dist: Rajshahi",
  },
  signature: {
    enabled: true,
    signatoryName: "Md. Ansarul Islam",
    date: "15 November, 2026",
    imageUrl: "",
  },
  program: "DIPLOMA",
  academicYear: "2",
  skills: [
    { id: "sk-1", name: "Automated Hematology & Blood Smear", category: "Hematology", proficiency: "Advanced" },
    { id: "sk-2", name: "Routine Biochemistry (LFT, RFT, Lipids)", category: "Biochemistry", proficiency: "Advanced" },
    { id: "sk-3", name: "Gram & AFB Staining, Culture Inoculation", category: "Microbiology", proficiency: "Competent" },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Diploma in Medical Laboratory Technology (DMT)",
      institute: "Institute of Health Technology, Rajshahi",
      yearOfPassing: "2022",
      result: "Passed",
    },
    {
      id: "edu-2",
      degree: "Secondary School Certificate (SSC) - Science",
      institute: "Damkura Hat High School, Rajshahi",
      yearOfPassing: "2022",
      result: "GPA 5.00 / 5.00",
    },
  ],
  rotations: [
    {
      id: "rot-1",
      role: "Clinical Trainee Laboratory Technologist",
      organization: "Dhaka Medical College Hospital (DMCH) Central Lab",
      period: "July 2024 – Dec 2024",
      location: "Dhaka, Bangladesh",
      responsibilities: [
        "Conducted phlebotomy and stained 40+ daily blood films with Leishman stain for differential counts.",
        "Monitored daily Levey-Jennings QC charts on automated analyzers and reported critical ward alerts.",
      ],
    },
  ],
  certifications: [
    "Competency in Automated Hematology & Peripheral Blood Smear (DIHT)",
    "BSL-2 Biosafety & Biomedical Waste Management",
  ],
  equipmentProficiencies: [
    "Sysmex XN-550 / KX-21N",
    "Mindray BS-240 / BS-430",
    "Bio-Rad D-10 HPLC",
    "Olympus CX23 Microscope",
  ],
  languages: [
    "Bengali (Native Fluency)",
    "English (Professional Clinical Reporting)",
  ],
  customSections: [],
  contactLinks: [
    {
      id: "cl-1",
      label: "Portfolio",
      url: "researchgate.net/profile/ansarul-islam",
    },
  ],
  sectionHeadings: DEFAULT_SECTION_HEADINGS,
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
  theme: "MODERN_MINIMALIST",
  fontFamily: "sans",
  fontSize: "base",
  sectionSpacing: "normal",
  primaryColor: "#059669",
  accentColor: "#0284c7",
  headerStyle: "standard",
  showDividers: true,
  dividerStyle: "solid",
  photoUrl: "",
  showPhoto: false,
  photoShape: "rounded",
  updatedAt: new Date().toISOString().split("T")[0],
};

const STORAGE_KEY = "labtutor_student_resume_v2";

interface ResumeContextType {
  resume: ResumeData;
  updateResume: (updates: Partial<ResumeData>) => void;
  resetResume: () => void;
  reorderSections: (newOrder: ResumeSectionKey[]) => void;
  updateSectionHeading: (key: ResumeSectionKey, heading: string) => void;
  toggleSectionVisibility: (key: ResumeSectionKey) => void;
}

const ResumeContext = React.createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resume, setResume] = React.useState<ResumeData>(DEFAULT_RESUME);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("labtutor_student_resume_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        const isLegacyName = !parsed.fullName || parsed.fullName.includes("Tanvir") || (parsed.email && parsed.email.includes("tanvir"));
        const isOldBloated = (parsed.skills && parsed.skills.length > 4) || (parsed.rotations?.[0]?.responsibilities?.length > 2);
        const migratedData: ResumeData = {
          ...DEFAULT_RESUME,
          ...parsed,
          fullName: isLegacyName ? DEFAULT_RESUME.fullName : (parsed.fullName || DEFAULT_RESUME.fullName),
          title: (!parsed.title || parsed.title.includes("Medical Laboratory Technologist") || isLegacyName) ? DEFAULT_RESUME.title : parsed.title,
          email: isLegacyName ? DEFAULT_RESUME.email : (parsed.email || DEFAULT_RESUME.email),
          phone: isLegacyName ? DEFAULT_RESUME.phone : (parsed.phone || DEFAULT_RESUME.phone),
          linkedinOrWeb: isLegacyName ? DEFAULT_RESUME.linkedinOrWeb : (parsed.linkedinOrWeb || DEFAULT_RESUME.linkedinOrWeb),
          customSections: parsed.customSections || DEFAULT_RESUME.customSections,
          contactLinks: parsed.contactLinks || DEFAULT_RESUME.contactLinks,
          fontFamily: parsed.fontFamily || "sans",
          fontSize: parsed.fontSize || "base",
          sectionSpacing: parsed.sectionSpacing || "normal",
          primaryColor: parsed.primaryColor || (parsed.theme === "EXECUTIVE_HEALTH" ? "#1e3a8a" : "#059669"),
          accentColor: parsed.accentColor || "#0284c7",
          headerStyle: parsed.headerStyle || "standard",
          theme: (!parsed.theme || parsed.theme === "MODERN_SPLIT" || parsed.theme === "MODERN_CLINICAL") ? "MODERN_MINIMALIST" : parsed.theme,
          skills: (Array.isArray(parsed.skills) && parsed.skills.length > 3) ? parsed.skills.slice(0, 3) : (parsed.skills || DEFAULT_RESUME.skills),
          education: (!parsed.education || parsed.education[0]?.institute?.includes("Dhaka Institute") || parsed.education[1]?.institute?.includes("Residential Model"))
            ? DEFAULT_RESUME.education
            : parsed.education,
          personalDetails: (!parsed.personalDetails || parsed.personalDetails.fatherName === "Md. Rafiqul Islam" || parsed.personalDetails.motherName === "Mst. Anwara Begum" || parsed.personalDetails.permanentAddress?.includes("Charpara") || parsed.personalDetails.permanentAddress?.includes("Mymensingh"))
            ? { ...DEFAULT_RESUME.personalDetails, ...(parsed.personalDetails || {}), permanentAddress: DEFAULT_RESUME.personalDetails.permanentAddress, presentAddress: DEFAULT_RESUME.personalDetails.presentAddress }
            : { ...DEFAULT_RESUME.personalDetails, ...parsed.personalDetails },
          signature: parsed.signature
            ? {
                ...DEFAULT_RESUME.signature,
                ...parsed.signature,
                date: (!parsed.signature.date || parsed.signature.date.includes("Sept") || parsed.signature.date.includes("Sep"))
                  ? "15 November, 2026"
                  : parsed.signature.date,
              }
            : DEFAULT_RESUME.signature,
          sectionHeadings: {
            ...DEFAULT_SECTION_HEADINGS,
            ...(parsed.sectionHeadings || {}),
            summary: (!parsed.sectionHeadings?.summary || parsed.sectionHeadings.summary === "Clinical Profile" || parsed.sectionHeadings.summary === "Career Objective") ? DEFAULT_SECTION_HEADINGS.summary : parsed.sectionHeadings.summary,
            skills: (!parsed.sectionHeadings?.skills || parsed.sectionHeadings.skills === "Clinical Laboratory Competencies") ? DEFAULT_SECTION_HEADINGS.skills : parsed.sectionHeadings.skills,
            experience: (!parsed.sectionHeadings?.experience || parsed.sectionHeadings.experience === "Clinical Rotations & Hospital Experience" || parsed.sectionHeadings.experience === "Working Experience") ? DEFAULT_SECTION_HEADINGS.experience : parsed.sectionHeadings.experience,
            personal: parsed.sectionHeadings?.personal || DEFAULT_SECTION_HEADINGS.personal,
          },
          sectionOrder: (Array.isArray(parsed.sectionOrder) && parsed.sectionOrder.length > 0 && parsed.sectionOrder[1] !== "skills")
            ? (parsed.sectionOrder.includes("personal") ? parsed.sectionOrder : ["summary", "personal", ...parsed.sectionOrder.filter((k: any) => k !== "summary")])
            : DEFAULT_SECTION_ORDER,
          hiddenSections: Array.isArray(parsed.hiddenSections) ? parsed.hiddenSections : [],
          showDividers: parsed.showDividers !== undefined ? parsed.showDividers : true,
          dividerStyle: parsed.dividerStyle || "solid",
        };
        setResume(migratedData);
        if (isLegacyName) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData));
          } catch {}
        }
      }
    } catch {}
  }, []);

  const persistResume = (newResume: ResumeData) => {
    setResume(newResume);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newResume));
    } catch {}
  };

  const updateResume = React.useCallback(
    (updates: Partial<ResumeData>) => {
      setResume((prev) => {
        const updated: ResumeData = {
          ...prev,
          ...updates,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    []
  );

  const reorderSections = React.useCallback((newOrder: ResumeSectionKey[]) => {
    updateResume({ sectionOrder: newOrder });
  }, [updateResume]);

  const updateSectionHeading = React.useCallback((key: ResumeSectionKey, heading: string) => {
    setResume((prev) => {
      const updatedHeadings = {
        ...prev.sectionHeadings,
        [key]: heading,
      };
      const updated = { ...prev, sectionHeadings: updatedHeadings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const toggleSectionVisibility = React.useCallback((key: ResumeSectionKey) => {
    setResume((prev) => {
      const currentHidden = prev.hiddenSections || [];
      const isHidden = currentHidden.includes(key);
      const updatedHidden = isHidden
        ? currentHidden.filter((k) => k !== key)
        : [...currentHidden, key];
      const updated = { ...prev, hiddenSections: updatedHidden };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const resetResume = React.useCallback(() => {
    persistResume(DEFAULT_RESUME);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        resume,
        updateResume,
        resetResume,
        reorderSections,
        updateSectionHeading,
        toggleSectionVisibility,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = React.useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within ResumeProvider");
  }
  return context;
}
