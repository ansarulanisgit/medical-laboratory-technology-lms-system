"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/roles";

export type ProgramLevel = "DIPLOMA" | "BSC";

export interface AcademicHistoryRecord {
  id: string;
  fromProgram: ProgramLevel;
  fromYear: string;
  toProgram: ProgramLevel;
  toYear: string;
  transitionDate: string;
  reason: string;
}

export interface AcademicProfileState {
  fullName?: string;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  baseRole?: UserRole;
  institution?: string;
  program: ProgramLevel;
  academicYear: string; // "1", "2", "3", "4"
  curriculumVersionCode: string;
  enrollmentYear: number;
  studentIdNumber: string;
  academicHistory: AcademicHistoryRecord[];
}

export interface SubjectModule {
  code: string;
  name: string;
  program: ProgramLevel;
  year: string; // "1", "2", "3", "4"
  units: number;
  lessons: number;
  progress: number;
  description: string;
}

// Master curriculum subjects by Bangladesh curriculum level & year
export const CURRICULUM_SUBJECTS_CATALOG: SubjectModule[] = [
  // --- DIPLOMA YEAR 1 (5 Subjects) ---
  {
    code: "ENG-101",
    name: "Basic English Language Course",
    program: "DIPLOMA",
    year: "1",
    units: 4,
    lessons: 18,
    progress: 85,
    description: "Official SMFB curriculum: Grammar, Translation, Technical Descriptions, Reports of Observation, and Communicative English (Reading, Writing, Listening, Speaking).",
  },
  {
    code: "ANAT-102",
    name: "Basic Anatomy",
    program: "DIPLOMA",
    year: "1",
    units: 5,
    lessons: 18,
    progress: 75,
    description: "Human cell structure, tissue histology, skeletal, muscular, circulatory, and visceral organ systems.",
  },
  {
    code: "PHYS-103",
    name: "Basic Physiology",
    program: "DIPLOMA",
    year: "1",
    units: 5,
    lessons: 18,
    progress: 70,
    description: "Homeostasis, blood physiology, cardiovascular dynamics, respiration, renal filtration, and metabolism.",
  },
  {
    code: "COMM-104",
    name: "Basic Community Medicine & Behavioural Science",
    program: "DIPLOMA",
    year: "1",
    units: 4,
    lessons: 14,
    progress: 60,
    description: "Primary healthcare, epidemiology, nutrition, occupational health, medical ethics, and Bangladesh health systems.",
  },
  {
    code: "COMP-105",
    name: "Basic Computer Science",
    program: "DIPLOMA",
    year: "1",
    units: 4,
    lessons: 14,
    progress: 90,
    description: "Computer fundamentals, operating systems, MS Office, internet, networking, and Laboratory Information Systems (LIS).",
  },

  // --- DIPLOMA YEAR 2 (5 Subjects) ---
  {
    code: "PHY-201",
    name: "Physics",
    program: "DIPLOMA",
    year: "2",
    units: 4,
    lessons: 14,
    progress: 50,
    description: "Measurement, mechanics, heat, light, optics, electricity, magnetism, and laboratory instrument physics.",
  },
  {
    code: "CHEM-202",
    name: "Chemistry",
    program: "DIPLOMA",
    year: "2",
    units: 4,
    lessons: 16,
    progress: 65,
    description: "Atomic structure, chemical bonding, solutions, acids/bases, pH, buffers, and analytical qualitative/quantitative analysis.",
  },
  {
    code: "MIC-203",
    name: "Basic Microbiology & Parasitology",
    program: "DIPLOMA",
    year: "2",
    units: 5,
    lessons: 20,
    progress: 55,
    description: "Microbial morphology, bacteriology, sterilization, disinfection, culture principles, protozoa, and helminths.",
  },
  {
    code: "MLS-204",
    name: "Medical Laboratory Science",
    program: "DIPLOMA",
    year: "2",
    units: 5,
    lessons: 18,
    progress: 85,
    description: "Laboratory organization, biosafety, specimen collection, handling, storage, equipment care, and biomedical waste management.",
  },
  {
    code: "CPH-205",
    name: "Clinical Pathology & Haematology",
    program: "DIPLOMA",
    year: "2",
    units: 6,
    lessons: 22,
    progress: 70,
    description: "Routine examination of urine, stool, body fluids, blood cell counts, Hb, ESR, PCV, peripheral blood film, and coagulation.",
  },

  // --- DIPLOMA YEAR 3 (3 Subjects) ---
  {
    code: "CC-301",
    name: "Clinical Chemistry",
    program: "DIPLOMA",
    year: "3",
    units: 5,
    lessons: 20,
    progress: 40,
    description: "Routine biochemistry, liver function tests (LFT), renal function tests (RFT), lipid profile, cardiac biomarkers, and quality control.",
  },
  {
    code: "MIC-302",
    name: "Microbiology & Parasitology",
    program: "DIPLOMA",
    year: "3",
    units: 6,
    lessons: 24,
    progress: 35,
    description: "Specimen processing, Gram & AFB staining, bacterial culture, AST Kirby-Bauer, and identification of clinical pathogens.",
  },
  {
    code: "HBT-303",
    name: "Histopathology & Blood Transfusion",
    program: "DIPLOMA",
    year: "3",
    units: 5,
    lessons: 20,
    progress: 30,
    description: "Tissue collection, fixation, paraffin processing, microtomy, H&E staining, ABO/Rh grouping, crossmatching, and donor safety.",
  },

  // --- DIPLOMA YEAR 4 (3 Subjects) ---
  {
    code: "CBI-401",
    name: "Clinical Biochemistry & Immunology",
    program: "DIPLOMA",
    year: "4",
    units: 5,
    lessons: 20,
    progress: 15,
    description: "Advanced organ panels, enzymology, hormonal assays, antigen-antibody reactions, agglutination, ELISA, and autoimmune serology.",
  },
  {
    code: "SMIC-402",
    name: "Special Microbiology",
    program: "DIPLOMA",
    year: "4",
    units: 5,
    lessons: 18,
    progress: 10,
    description: "Advanced bacteriology, diagnostic virology, medical mycology, opportunistic pathogens, molecular detection, and biosafety.",
  },
  {
    code: "SFA-403",
    name: "Special Field Attachment",
    program: "DIPLOMA",
    year: "4",
    units: 6,
    lessons: 24,
    progress: 20,
    description: "Rotational internship across clinical pathology, biochemistry, hematology, microbiology, blood bank, and emergency laboratory duty.",
  },

  // --- B.SC. PART I (Year 1, Sem 1-2) ---
  {
    code: "BSC-BIO-101",
    name: "Cell Biology & Medical Genetics",
    program: "BSC",
    year: "1",
    units: 5,
    lessons: 20,
    progress: 50,
    description: "Molecular cell structure, Mendelian genetics, cytogenetics, and karyotype abnormalities.",
  },
  {
    code: "BSC-PHY-102",
    name: "Biophysics & Analytical Laboratory Techniques",
    program: "BSC",
    year: "1",
    units: 4,
    lessons: 16,
    progress: 30,
    description: "Electrophoresis, chromatography, spectrophotometry, radioactivity, and biosafety.",
  },
  {
    code: "BSC-PAT-103",
    name: "General Pathology & Cell Injury",
    program: "BSC",
    year: "1",
    units: 4,
    lessons: 15,
    progress: 10,
    description: "Inflammation, tissue repair, hemodynamic disorders, and neoplasia mechanisms.",
  },
  {
    code: "BSC-HIS-104",
    name: "Histological Techniques & Tissue Processing",
    program: "BSC",
    year: "1",
    units: 4,
    lessons: 16,
    progress: 0,
    description: "Fixation protocols, paraffin sectioning, hematoxylin & eosin (H&E) staining, and microtome maintenance.",
  },

  // --- B.SC. PART II (Year 2, Sem 3-4) ---
  {
    code: "BSC-HEM-201",
    name: "Advanced Hematology & Hemoglobinopathies",
    program: "BSC",
    year: "2",
    units: 5,
    lessons: 22,
    progress: 70,
    description: "Hemoglobin electrophoresis, flow cytometry, leukemia cytochemistry, and bone marrow biopsy.",
  },
  {
    code: "BSC-MIC-202",
    name: "Systematic Bacteriology & Antimicrobial Resistance",
    program: "BSC",
    year: "2",
    units: 5,
    lessons: 24,
    progress: 45,
    description: "Pathogen identification, molecular AST, ESBL mechanisms, and hospital infection control.",
  },
  {
    code: "BSC-INS-203",
    name: "Biomedical Instrumentation & Automation",
    program: "BSC",
    year: "2",
    units: 4,
    lessons: 18,
    progress: 20,
    description: "Chemiluminescence immunoassay (CLIA), ion-selective electrodes, and robotic track systems.",
  },
  {
    code: "BSC-CLP-204",
    name: "Clinical Cytopathology & Body Fluid Analysis",
    program: "BSC",
    year: "2",
    units: 4,
    lessons: 16,
    progress: 0,
    description: "Exfoliative and aspiration cytology (FNAC), Papanicolaou staining, CSF and pleural fluid differential analysis.",
  },

  // --- B.SC. PART III (Year 3, Sem 5-6) ---
  {
    code: "BSC-IMM-301",
    name: "Clinical Immunology & Serodiagnosis",
    program: "BSC",
    year: "3",
    units: 5,
    lessons: 20,
    progress: 0,
    description: "ELISA, autoimmune disease panels (ANA/dsDNA), flow cytometric CD4/CD8 enumeration.",
  },
  {
    code: "BSC-ENZ-302",
    name: "Clinical Enzymology & Endocrinology",
    program: "BSC",
    year: "3",
    units: 5,
    lessons: 20,
    progress: 0,
    description: "Thyroid hormone panels, tumor markers (PSA, CA-125, CEA), and metabolic profiling.",
  },
  {
    code: "BSC-TRN-303",
    name: "Transfusion Medicine & Component Therapy",
    program: "BSC",
    year: "3",
    units: 4,
    lessons: 16,
    progress: 0,
    description: "Blood component separation (PRBC, FFP, Platelets), apheresis, and hemolytic disease.",
  },
  {
    code: "BSC-VIR-304",
    name: "Diagnostic Virology & Medical Mycology",
    program: "BSC",
    year: "3",
    units: 4,
    lessons: 16,
    progress: 0,
    description: "Viral culture, direct antigen detection, fungal KOH wet mounts, and antifungal susceptibility testing.",
  },

  // --- B.SC. PART IV (Year 4, Sem 7-8) ---
  {
    code: "BSC-MOL-401",
    name: "Molecular Diagnostics & PCR Technology",
    program: "BSC",
    year: "4",
    units: 6,
    lessons: 25,
    progress: 0,
    description: "DNA/RNA extraction, Real-Time PCR, viral load quantification (HBV/HCV), and sequencing.",
  },
  {
    code: "BSC-MGT-402",
    name: "Laboratory Quality Management (ISO 15189)",
    program: "BSC",
    year: "4",
    units: 4,
    lessons: 15,
    progress: 0,
    description: "Accreditation standards, total quality management, pre-analytical error mitigation.",
  },
  {
    code: "BSC-DIS-403",
    name: "Undergraduate Research Project & Dissertation",
    program: "BSC",
    year: "4",
    units: 6,
    lessons: 12,
    progress: 0,
    description: "Epidemiological laboratory study, statistical data analysis, and oral defense.",
  },
  {
    code: "BSC-RES-404",
    name: "Laboratory Biostatistics & Health Informatics",
    program: "BSC",
    year: "4",
    units: 4,
    lessons: 14,
    progress: 0,
    description: "Reference interval establishment, method validation (Bland-Altman), parametric/non-parametric tests, and LIS SQL queries.",
  },
];

const DEFAULT_PROFILE: AcademicProfileState = {
  fullName: "Md. Ansarul Islam",
  username: "ansarul.islam",
  password: "Student@Pass2024",
  email: "ansarul.support@gmail.com",
  phone: "+8801709260934",
  role: "STUDENT",
  baseRole: "STUDENT",
  institution: "Dhaka Institute of Health Technology (DIHT)",
  program: "DIPLOMA",
  academicYear: "2",
  curriculumVersionCode: "DMT-2023-V1",
  enrollmentYear: 2024,
  studentIdNumber: "LT-2024-0482",
  academicHistory: [
    {
      id: "hist-001",
      fromProgram: "DIPLOMA",
      fromYear: "1",
      toProgram: "DIPLOMA",
      toYear: "2",
      transitionDate: "2025-01-10T10:00:00Z",
      reason: "Successfully promoted upon passing 1st Year Annual Faculty Examination",
    },
  ],
};

const STORAGE_KEY = "labtutor_academic_profile_v3";
const COURSES_STORAGE_KEY = "labtutor_courses_catalog_v3";

interface AcademicContextType {
  profile: AcademicProfileState;
  coursesCatalog: SubjectModule[];
  activeSubjects: SubjectModule[];
  updateUserRole: (newRole: UserRole) => void;
  updateAcademicStatus: (
    newProgram: ProgramLevel,
    newYear: string,
    reason?: string
  ) => { success: boolean; error?: string };
  updatePersonalInfo: (data: {
    fullName: string;
    username?: string;
    password?: string;
    phone?: string;
    email?: string;
    institution?: string;
    program?: ProgramLevel;
    academicYear?: string;
    semester?: string;
    session?: string;
    studentIdNumber?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  addCurriculumCourse: (course: SubjectModule) => { success: boolean; error?: string };
  updateCurriculumCourse: (code: string, updated: Partial<SubjectModule>) => { success: boolean; error?: string };
  deleteCurriculumCourse: (code: string) => { success: boolean; error?: string };
  resetToDefault: () => void;
}

const AcademicContext = React.createContext<AcademicContextType | undefined>(undefined);

export function StudentAcademicProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<AcademicProfileState>(DEFAULT_PROFILE);
  const [coursesCatalog, setCoursesCatalog] = React.useState<SubjectModule[]>(CURRICULUM_SUBJECTS_CATALOG);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load saved profile & courses from localStorage on mount
  React.useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        const effectiveBaseRole =
          parsed.baseRole ||
          (parsed.username === "ansarulanis" ||
          parsed.email?.includes("ansarul.contact") ||
          parsed.role === "SUPER_ADMIN"
            ? "SUPER_ADMIN"
            : parsed.role || "STUDENT");

        setProfile({
          ...parsed,
          role: parsed.role || "STUDENT",
          baseRole: effectiveBaseRole,
          institution: parsed.institution || "Dhaka Institute of Health Technology (DIHT)",
        });
      }

      const savedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
      if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        if (Array.isArray(parsedCourses) && parsedCourses.length > 0) {
          setCoursesCatalog(parsedCourses);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when profile changes
  const persistProfile = (newProfile: AcademicProfileState) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  };

  const persistCourses = (newCourses: SubjectModule[]) => {
    setCoursesCatalog(newCourses);
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(newCourses));
    } catch {
      // ignore
    }
  };

  const updateUserRole = (newRole: UserRole) => {
    const effectiveBaseRole =
      profile.baseRole ||
      (profile.username === "ansarulanis" ||
      profile.email?.includes("ansarul.contact") ||
      profile.role === "SUPER_ADMIN"
        ? "SUPER_ADMIN"
        : profile.role || "STUDENT");

    const updatedProfile: AcademicProfileState = {
      ...profile,
      role: newRole,
      baseRole: effectiveBaseRole,
    };
    persistProfile(updatedProfile);
  };

  const updateAcademicStatus = (
    newProgram: ProgramLevel,
    newYear: string,
    reason = "Student Academic Progression"
  ) => {
    // 1. Validation: strictly 4 years
    if (!["1", "2", "3", "4"].includes(newYear)) {
      return { success: false, error: "Academic Year must be between 1 and 4." };
    }

    // 2. Derive curriculum version
    const curriculumVersionCode =
      newProgram === "BSC" ? "BSC-LT-2024-V2" : "DMT-2023-V1";

    // 3. Create historical transition record
    const historyEntry: AcademicHistoryRecord = {
      id: `hist-${Date.now()}`,
      fromProgram: profile.program,
      fromYear: profile.academicYear,
      toProgram: newProgram,
      toYear: newYear,
      transitionDate: new Date().toISOString(),
      reason,
    };

    const updatedProfile: AcademicProfileState = {
      ...profile,
      program: newProgram,
      academicYear: newYear,
      curriculumVersionCode,
      academicHistory: [historyEntry, ...profile.academicHistory],
    };

    persistProfile(updatedProfile);

    // Optional: Synchronize with Supabase
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from("student_profiles")
            .upsert({
              user_id: user.id,
              program_level: newProgram,
              academic_year: parseInt(newYear, 10),
              updated_at: new Date().toISOString(),
            })
            .then(() => {});
        }
      });
    } catch {
      // background sync
    }

    return { success: true };
  };

  const updatePersonalInfo = async (data: {
    fullName: string;
    username?: string;
    password?: string;
    phone?: string;
    email?: string;
    institution?: string;
    program?: ProgramLevel;
    academicYear?: string;
    semester?: string;
    session?: string;
    studentIdNumber?: string;
  }) => {
    if (!data.fullName.trim()) {
      return { success: false, error: "Full Name cannot be empty." };
    }

    const updatedProfile: AcademicProfileState = {
      ...profile,
      fullName: data.fullName.trim(),
      username: data.username !== undefined ? data.username.trim() : profile.username,
      password: data.password !== undefined ? data.password : profile.password,
      phone: data.phone !== undefined ? data.phone.trim() : profile.phone,
      email: data.email !== undefined ? data.email.trim() : profile.email,
      institution: data.institution !== undefined ? data.institution.trim() : profile.institution,
      program: data.program !== undefined ? data.program : profile.program,
      academicYear: data.academicYear !== undefined ? data.academicYear : profile.academicYear,
      studentIdNumber: data.studentIdNumber !== undefined ? data.studentIdNumber.trim() : profile.studentIdNumber,
    };

    persistProfile(updatedProfile);

    // Synchronize to LMS users storage (labtutor_lms_users_v3)
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("labtutor_lms_users_v3");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const updatedUsers = parsed.map((u: any) => {
              const matchesUser =
                (profile.email && u.email?.toLowerCase() === profile.email.toLowerCase()) ||
                (profile.username && u.username?.toLowerCase() === profile.username.toLowerCase()) ||
                u.id === "user-std-001";

              if (matchesUser) {
                return {
                  ...u,
                  fullName: data.fullName.trim(),
                  username: data.username !== undefined ? data.username.trim() : u.username,
                  password: data.password !== undefined ? data.password : u.password,
                  email: data.email !== undefined ? data.email.trim() : u.email,
                  phone: data.phone !== undefined ? data.phone.trim() : u.phone,
                  institution: data.institution !== undefined ? data.institution.trim() : u.institution,
                  session: data.session !== undefined ? data.session.trim() : u.session,
                  program: data.program !== undefined ? data.program : u.program,
                  academicYear: data.academicYear !== undefined ? data.academicYear : u.academicYear,
                  semester: data.semester !== undefined ? data.semester : u.semester,
                  studentIdNumber: data.studentIdNumber !== undefined ? data.studentIdNumber.trim() : u.studentIdNumber,
                };
              }
              return u;
            });
            localStorage.setItem("labtutor_lms_users_v3", JSON.stringify(updatedUsers));
          }
        }
      }
    } catch {
      // background sync
    }

    // Optional background sync with Supabase auth metadata
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          full_name: data.fullName.trim(),
          phone: data.phone?.trim(),
        },
      });
    } catch {
      // background sync
    }

    return { success: true };
  };

  const addCurriculumCourse = (course: SubjectModule) => {
    if (!course.code.trim() || !course.name.trim()) {
      return { success: false, error: "Course Code and Course Title are required." };
    }

    if (coursesCatalog.some((c) => c.code.toLowerCase() === course.code.trim().toLowerCase())) {
      return { success: false, error: `A course with code "${course.code.toUpperCase()}" already exists.` };
    }

    const newCourse: SubjectModule = {
      ...course,
      code: course.code.trim().toUpperCase(),
      name: course.name.trim(),
    };

    const updated = [newCourse, ...coursesCatalog];
    persistCourses(updated);
    return { success: true };
  };

  const updateCurriculumCourse = (code: string, updatedData: Partial<SubjectModule>) => {
    const existingIndex = coursesCatalog.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
    if (existingIndex === -1) {
      return { success: false, error: "Course not found." };
    }

    const updated = [...coursesCatalog];
    updated[existingIndex] = {
      ...updated[existingIndex],
      ...updatedData,
    };

    persistCourses(updated);
    return { success: true };
  };

  const deleteCurriculumCourse = (code: string) => {
    const existingIndex = coursesCatalog.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
    if (existingIndex === -1) {
      return { success: false, error: "Course not found." };
    }

    const updated = coursesCatalog.filter((c) => c.code.toUpperCase() !== code.toUpperCase());
    persistCourses(updated);
    return { success: true };
  };

  const resetToDefault = () => {
    persistProfile(DEFAULT_PROFILE);
    persistCourses(CURRICULUM_SUBJECTS_CATALOG);
  };

  // Compute active subjects for the student's selected program & academic stage from reactive coursesCatalog
  const activeSubjects = React.useMemo(() => {
    return coursesCatalog.filter((sub) => {
      return sub.program === profile.program && sub.year === profile.academicYear;
    });
  }, [coursesCatalog, profile.program, profile.academicYear]);

  return (
    <AcademicContext.Provider
      value={{
        profile,
        coursesCatalog,
        activeSubjects,
        updateUserRole,
        updateAcademicStatus,
        updatePersonalInfo,
        addCurriculumCourse,
        updateCurriculumCourse,
        deleteCurriculumCourse,
        resetToDefault,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademicProfile() {
  const context = React.useContext(AcademicContext);
  if (!context) {
    throw new Error("useAcademicProfile must be used within a StudentAcademicProvider");
  }
  return context;
}

export function useAcademic() {
  const context = useAcademicProfile();
  return {
    ...context,
    role: context.profile.role || "STUDENT",
    userProfile: {
      name: context.profile.fullName || "User",
      email: context.profile.email || "",
      institution: context.profile.institution || "",
      program: context.profile.program,
      academicYear: context.profile.academicYear,
      idNumber: context.profile.studentIdNumber || "",
    },
  };
}

