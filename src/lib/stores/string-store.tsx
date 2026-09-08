"use client";

import * as React from "react";

export interface StringItem {
  key: string;
  value: string;
  category: "GENERAL" | "DASHBOARD" | "CURRICULUM" | "STUDY_CENTER" | "FOOTER";
  description: string;
}

const INITIAL_STRINGS: StringItem[] = [
  {
    key: "app.brandName",
    value: "LabTutor Academy",
    category: "GENERAL",
    description: "Main application branding name in navigation and headers.",
  },
  {
    key: "app.tagline",
    value: "Medical Technology Learning & Clinical Diagnostic Governance Platform",
    category: "GENERAL",
    description: "Brand subtitle used across banners and metadata.",
  },
  {
    key: "dashboard.superAdmin.title",
    value: "System Governance & Multi-Role Analytics",
    category: "DASHBOARD",
    description: "Super Admin dashboard header banner title.",
  },
  {
    key: "dashboard.admin.title",
    value: "Academic Oversight & Institutional Analytics",
    category: "DASHBOARD",
    description: "Admin dashboard header banner title.",
  },
  {
    key: "dashboard.mentor.title",
    value: "Diagnostic Case Reviews & Trainee Mentorship",
    category: "DASHBOARD",
    description: "Mentor dashboard header banner title.",
  },
  {
    key: "dashboard.student.subtitle",
    value: "Real-time study progress, syllabus coverage, competency tracking and more.",
    category: "DASHBOARD",
    description: "Student personalized dashboard subtitle.",
  },
  {
    key: "curriculum.disclaimer",
    value: "Official curriculum guidelines adhering to State Medical Faculty of Bangladesh (SMFB) & DGHS directives.",
    category: "CURRICULUM",
    description: "Accreditation and curriculum compliance notice.",
  },
  {
    key: "practical.warning",
    value: "Standard Operating Procedures (SOPs) are calibrated for competency verification. Adhere to institutional biosafety guidelines.",
    category: "GENERAL",
    description: "Laboratory bench biosafety advisory note.",
  },
];

const STORAGE_KEY = "labtutor_strings_dictionary_v1";

interface StringContextType {
  strings: StringItem[];
  getString: (key: string, defaultValue?: string) => string;
  updateString: (key: string, value: string) => void;
  resetStrings: () => void;
}

const StringContext = React.createContext<StringContextType | undefined>(undefined);

export function StringProvider({ children }: { children: React.ReactNode }) {
  const [strings, setStrings] = React.useState<StringItem[]>(INITIAL_STRINGS);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStrings(parsed);
          return;
        }
      }
    } catch {}
    setStrings(INITIAL_STRINGS);
  }, []);

  const persistStrings = (newStrings: StringItem[]) => {
    setStrings(newStrings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStrings));
    } catch {}
  };

  const getString = React.useCallback(
    (key: string, defaultValue?: string): string => {
      const found = strings.find((s) => s.key === key);
      return found ? found.value : defaultValue || key;
    },
    [strings]
  );

  const updateString = React.useCallback(
    (key: string, value: string) => {
      const updated = strings.map((s) => (s.key === key ? { ...s, value } : s));
      persistStrings(updated);
    },
    [strings]
  );

  const resetStrings = React.useCallback(() => {
    persistStrings(INITIAL_STRINGS);
  }, []);

  return (
    <StringContext.Provider value={{ strings, getString, updateString, resetStrings }}>
      {children}
    </StringContext.Provider>
  );
}

export function useStrings() {
  const context = React.useContext(StringContext);
  if (!context) {
    throw new Error("useStrings must be used within StringProvider");
  }
  return context;
}
