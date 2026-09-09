"use client";

import * as React from "react";
import { UserRole } from "@/types/roles";

export interface NavModuleItem {
  id: string;
  href: string;
  label: string;
  iconName: string;
  exact: boolean;
  visible: boolean;
  order: number;
  allowedRoles: UserRole[];
}

const INITIAL_NAV_MODULES: NavModuleItem[] = [
  { id: "mod-dashboard", href: "/student", label: "Dashboard", iconName: "Home", exact: true, visible: true, order: 1, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-curriculum", href: "/student/curriculum", label: "Course Curriculum", iconName: "BookOpen", exact: false, visible: true, order: 2, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-study-center", href: "/student/study-center", label: "Study Center", iconName: "Layers", exact: false, visible: true, order: 3, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-questions", href: "/student/questions", label: "Question Bank", iconName: "FileQuestion", exact: false, visible: true, order: 4, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-practical", href: "/student/practical", label: "Lab Practical", iconName: "FlaskConical", exact: false, visible: true, order: 5, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-certificates", href: "/student/certificates", label: "Certificates", iconName: "Award", exact: false, visible: true, order: 6, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-resume", href: "/student/resume", label: "Resume Maker", iconName: "FileText", exact: false, visible: true, order: 7, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-jobs", href: "/student/jobs", label: "Jobs", iconName: "Briefcase", exact: false, visible: true, order: 8, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-updates", href: "/student/updates", label: "Updates", iconName: "Bell", exact: false, visible: true, order: 9, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-profile", href: "/student/profile", label: "My Profile", iconName: "User", exact: false, visible: true, order: 10, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  { id: "mod-about", href: "/student/developer", label: "About", iconName: "Code2", exact: false, visible: true, order: 11, allowedRoles: ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"] },
  // Super Admin Exclusive
  { id: "mod-users", href: "/student/users", label: "User Management", iconName: "Users", exact: false, visible: true, order: 12, allowedRoles: ["SUPER_ADMIN"] },
  { id: "mod-admin-modules", href: "/student/admin/modules", label: "Module Management", iconName: "Settings", exact: false, visible: true, order: 13, allowedRoles: ["SUPER_ADMIN"] },
  { id: "mod-admin-strings", href: "/student/admin/strings", label: "String Management", iconName: "Type", exact: false, visible: true, order: 14, allowedRoles: ["SUPER_ADMIN"] },
  { id: "mod-admin-logs", href: "/student/admin/logs", label: "Real-time Data Log", iconName: "Activity", exact: false, visible: true, order: 15, allowedRoles: ["SUPER_ADMIN"] },
  { id: "mod-admin-settings", href: "/student/admin/settings", label: "Settings", iconName: "Sliders", exact: false, visible: true, order: 16, allowedRoles: ["SUPER_ADMIN"] },
];

const STORAGE_KEY = "labtutor_nav_modules_v1";

interface ModuleContextType {
  modules: NavModuleItem[];
  getModulesForRole: (role: UserRole) => NavModuleItem[];
  toggleModuleVisibility: (id: string) => void;
  updateModule: (id: string, updates: Partial<NavModuleItem>) => void;
  reorderModules: (startIndex: number, endIndex: number) => void;
  resetModules: () => void;
}

const ModuleContext = React.createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = React.useState<NavModuleItem[]>(INITIAL_NAV_MODULES);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated = parsed.map((item: NavModuleItem) => {
            if (item.id === "mod-admin-settings" && (item.label === "System Settings" || !item.label)) {
              return { ...item, label: "Settings" };
            }
            return item;
          });
          setModules(migrated);
          return;
        }
      }
    } catch {}
    setModules(INITIAL_NAV_MODULES);
  }, []);

  const persistModules = (newModules: NavModuleItem[]) => {
    setModules(newModules);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newModules));
    } catch {}
  };

  const getModulesForRole = React.useCallback(
    (role: UserRole): NavModuleItem[] => {
      return modules
        .filter((m) => m.visible && m.allowedRoles.includes(role))
        .sort((a, b) => a.order - b.order);
    },
    [modules]
  );

  const toggleModuleVisibility = React.useCallback(
    (id: string) => {
      const updated = modules.map((m) => (m.id === id ? { ...m, visible: !m.visible } : m));
      persistModules(updated);
    },
    [modules]
  );

  const updateModule = React.useCallback(
    (id: string, updates: Partial<NavModuleItem>) => {
      const updated = modules.map((m) => (m.id === id ? { ...m, ...updates } : m));
      persistModules(updated);
    },
    [modules]
  );

  const reorderModules = React.useCallback(
    (startIndex: number, endIndex: number) => {
      const result = Array.from(modules);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      const reindexed = result.map((m, idx) => ({ ...m, order: idx + 1 }));
      persistModules(reindexed);
    },
    [modules]
  );

  const resetModules = React.useCallback(() => {
    persistModules(INITIAL_NAV_MODULES);
  }, []);

  return (
    <ModuleContext.Provider
      value={{
        modules,
        getModulesForRole,
        toggleModuleVisibility,
        updateModule,
        reorderModules,
        resetModules,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}

export function useModuleManagement() {
  const context = React.useContext(ModuleContext);
  if (!context) {
    throw new Error("useModuleManagement must be used within ModuleProvider");
  }
  return context;
}
