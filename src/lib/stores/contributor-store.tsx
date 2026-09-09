"use client";

import * as React from "react";

export type ContributorStatus = "ACTIVE" | "PAST";

export interface Contributor {
  id: string;
  name: string;
  avatarUrl?: string;
  institute: string;
  course: string;
  yearOfContribution: string;
  whatsapp?: string;
  facebook?: string;
  phone?: string;
  email?: string;
  status: ContributorStatus;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CONTRIBUTOR_AVATAR = "/images/default-avatar.png";

const STORAGE_KEY = "labtutor_contributors_v2";
const SYNC_EVENT = "labtutor_contributors_updated";

const INITIAL_CONTRIBUTORS: Contributor[] = [
  {
    id: "cnt-001",
    name: "Dr. Sabrina Parvin",
    avatarUrl: "",
    institute: "Dhaka Institute of Health Technology (DIHT)",
    course: "B.Sc. in Health Technology (Laboratory)",
    yearOfContribution: "2025 - Present",
    whatsapp: "01712345678",
    facebook: "https://www.facebook.com/sabrina.parvin.dmlt",
    status: "ACTIVE",
    role: "Clinical Hematology SOP Contributor",
    createdAt: "2025-01-10T10:00:00.000Z",
    updatedAt: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "cnt-002",
    name: "Md. Arif Hossain",
    avatarUrl: "",
    institute: "Institute of Health Technology (IHT), Rajshahi",
    course: "Diploma in Medical Laboratory Technology (DMLT)",
    yearOfContribution: "2024 - Present",
    whatsapp: "01819456789",
    facebook: "https://www.facebook.com/arif.hossain.lab",
    status: "ACTIVE",
    role: "OSPE Revision & Microscopic Slides Author",
    createdAt: "2024-06-15T12:00:00.000Z",
    updatedAt: "2024-06-15T12:00:00.000Z",
  },
  {
    id: "cnt-003",
    name: "Fahmida Rahman",
    avatarUrl: "",
    institute: "Institute of Health Technology (IHT), Chittagong",
    course: "Diploma in Medical Laboratory Technology (DMLT)",
    yearOfContribution: "2025",
    whatsapp: "01911234567",
    facebook: "https://www.facebook.com/fahmida.rahman.iht",
    status: "ACTIVE",
    role: "Clinical Biochemistry Bench Protocol Reviewer",
    createdAt: "2025-02-01T09:00:00.000Z",
    updatedAt: "2025-02-01T09:00:00.000Z",
  },
  {
    id: "cnt-004",
    name: "Tanvir Ahmed",
    avatarUrl: "",
    institute: "Shaheed Suhrawardy Medical College IHT",
    course: "Diploma in Medical Laboratory Technology (DMLT)",
    yearOfContribution: "2023 - 2024",
    whatsapp: "01733987654",
    facebook: "https://www.facebook.com/tanvir.ahmed.dmlt",
    status: "PAST",
    role: "Histopathology Staining SOP Contributor",
    createdAt: "2023-03-10T08:00:00.000Z",
    updatedAt: "2024-12-20T16:00:00.000Z",
  },
  {
    id: "cnt-005",
    name: "Nusrat Jahan",
    avatarUrl: "",
    institute: "Institute of Health Technology (IHT), Sylhet",
    course: "B.Sc. in Health Technology (Laboratory)",
    yearOfContribution: "2022 - 2023",
    whatsapp: "01622334455",
    facebook: "https://www.facebook.com/nusrat.jahan.lab",
    status: "PAST",
    role: "Medical Microbiology Media Preparation Contributor",
    createdAt: "2022-09-01T11:00:00.000Z",
    updatedAt: "2023-11-30T14:00:00.000Z",
  },
];

interface ContributorContextType {
  contributors: Contributor[];
  activeContributors: Contributor[];
  pastContributors: Contributor[];
  addContributor: (data: Omit<Contributor, "id" | "createdAt" | "updatedAt">) => { success: boolean; error?: string };
  updateContributor: (id: string, updates: Partial<Contributor>) => { success: boolean; error?: string };
  deleteContributor: (id: string) => { success: boolean; error?: string };
  toggleStatus: (id: string) => { success: boolean; error?: string };
  isLoaded: boolean;
}

const ContributorContext = React.createContext<ContributorContextType | undefined>(undefined);

export function ContributorProvider({ children }: { children: React.ReactNode }) {
  const [contributors, setContributors] = React.useState<Contributor[]>(INITIAL_CONTRIBUTORS);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      // Check v2 storage key first, fallback to v1 with migration
      let stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const v1 = localStorage.getItem("labtutor_contributors_v1");
        if (v1) {
          try {
            const parsedV1 = JSON.parse(v1);
            if (Array.isArray(parsedV1)) {
              // Migrate phone to whatsapp
              const migrated = parsedV1.map((item: Contributor) => ({
                ...item,
                whatsapp: item.whatsapp || item.phone || "",
                facebook: item.facebook || "",
              }));
              stored = JSON.stringify(migrated);
              localStorage.setItem(STORAGE_KEY, stored);
            }
          } catch {
            // ignore
          }
        }
      }

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setContributors(parsed);
        } else {
          setContributors(INITIAL_CONTRIBUTORS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONTRIBUTORS));
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONTRIBUTORS));
      }
    } catch {
      setContributors(INITIAL_CONTRIBUTORS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage and dispatch sync event on state changes
  const saveContributors = React.useCallback((items: Contributor[]) => {
    setContributors(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent(SYNC_EVENT));
    } catch (e) {
      console.error("Failed to save contributors to localStorage", e);
    }
  }, []);

  // Listen to storage events and custom sync events across tabs / windows
  React.useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setContributors(parsed);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener(SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener(SYNC_EVENT, handleSync);
    };
  }, []);

  const addContributor = React.useCallback(
    (data: Omit<Contributor, "id" | "createdAt" | "updatedAt">) => {
      if (!data.name?.trim()) {
        return { success: false, error: "Contributor name is required" };
      }
      if (!data.institute?.trim()) {
        return { success: false, error: "Institute is required" };
      }
      if (!data.course?.trim()) {
        return { success: false, error: "Course is required" };
      }

      const now = new Date().toISOString();
      const newContributor: Contributor = {
        ...data,
        id: `cnt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: data.name.trim(),
        institute: data.institute.trim(),
        course: data.course.trim(),
        yearOfContribution: data.yearOfContribution?.trim() || new Date().getFullYear().toString(),
        whatsapp: data.whatsapp?.trim() || "",
        facebook: data.facebook?.trim() || "",
        status: data.status || "ACTIVE",
        role: data.role?.trim() || "",
        createdAt: now,
        updatedAt: now,
      };

      const updatedList = [newContributor, ...contributors];
      saveContributors(updatedList);
      return { success: true };
    },
    [contributors, saveContributors]
  );

  const updateContributor = React.useCallback(
    (id: string, updates: Partial<Contributor>) => {
      const exists = contributors.some((c) => c.id === id);
      if (!exists) {
        return { success: false, error: "Contributor not found" };
      }

      const updatedList = contributors.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });

      saveContributors(updatedList);
      return { success: true };
    },
    [contributors, saveContributors]
  );

  const deleteContributor = React.useCallback(
    (id: string) => {
      const exists = contributors.some((c) => c.id === id);
      if (!exists) {
        return { success: false, error: "Contributor not found" };
      }

      const updatedList = contributors.filter((c) => c.id !== id);
      saveContributors(updatedList);
      return { success: true };
    },
    [contributors, saveContributors]
  );

  const toggleStatus = React.useCallback(
    (id: string) => {
      const target = contributors.find((c) => c.id === id);
      if (!target) {
        return { success: false, error: "Contributor not found" };
      }

      const newStatus: ContributorStatus = target.status === "ACTIVE" ? "PAST" : "ACTIVE";
      return updateContributor(id, { status: newStatus });
    },
    [contributors, updateContributor]
  );

  const activeContributors = React.useMemo(
    () => contributors.filter((c) => c.status === "ACTIVE"),
    [contributors]
  );

  const pastContributors = React.useMemo(
    () => contributors.filter((c) => c.status === "PAST"),
    [contributors]
  );

  return (
    <ContributorContext.Provider
      value={{
        contributors,
        activeContributors,
        pastContributors,
        addContributor,
        updateContributor,
        deleteContributor,
        toggleStatus,
        isLoaded,
      }}
    >
      {children}
    </ContributorContext.Provider>
  );
}

export function useContributors() {
  const context = React.useContext(ContributorContext);
  if (!context) {
    throw new Error("useContributors must be used within a ContributorProvider");
  }
  return context;
}
