"use client";

import * as React from "react";
import {
  Shield,
  GraduationCap,
  Award,
  Crown,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { UserRole } from "@/types/roles";
import { cn } from "@/lib/utils";

interface RoleOption {
  role: UserRole;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "SUPER_ADMIN",
    label: "Super Admin",
    subtitle: "Full system access",
    icon: Crown,
    accentColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  {
    role: "ADMIN",
    label: "Admin",
    subtitle: "Faculty & institution",
    icon: Shield,
    accentColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    role: "MENTOR",
    label: "Mentor",
    subtitle: "Clinical instructor",
    icon: Award,
    accentColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    role: "STUDENT",
    label: "Student",
    subtitle: "Learner portal",
    icon: GraduationCap,
    accentColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
];

export function RoleSwitcherModal() {
  const { profile, updateUserRole } = useAcademicProfile();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Derive the account's permanent base role
  const baseRole: UserRole =
    profile?.baseRole ||
    (profile?.username === "ansarulanis" ||
    profile?.email?.includes("ansarul.contact") ||
    profile?.role === "SUPER_ADMIN"
      ? "SUPER_ADMIN"
      : profile?.role || "STUDENT");

  // Current active view role
  const currentRole: UserRole = profile?.role || "STUDENT";

  // Hierarchy of allowed roles (Hooks must execute unconditionally on every render)
  const allowedRoles: UserRole[] = React.useMemo(() => {
    if (baseRole === "SUPER_ADMIN") {
      return ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"];
    }
    if (baseRole === "ADMIN") {
      return ["ADMIN", "MENTOR", "STUDENT"];
    }
    if (baseRole === "MENTOR") {
      return ["MENTOR", "STUDENT"];
    }
    return [];
  }, [baseRole]);

  const availableOptions = React.useMemo(() => {
    return ROLE_OPTIONS.filter((opt) => allowedRoles.includes(opt.role));
  }, [allowedRoles]);

  // Close modal on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Students or users without elevated permissions won't see the switcher, and avoid SSR mismatch before mount
  if (!isMounted || baseRole === "STUDENT" || availableOptions.length <= 1) {
    return null;
  }

  const activeOption =
    ROLE_OPTIONS.find((opt) => opt.role === currentRole) || availableOptions[0] || ROLE_OPTIONS[0];

  const handleSelectRole = (role: UserRole) => {
    updateUserRole(role);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Header Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Role Switcher"
        title={`Active View: ${activeOption.label}. Click to switch role.`}
        className="h-9 px-2.5 rounded-lg border border-border/80 bg-card text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5 shadow-2xs group cursor-pointer shrink-0 select-none"
      >
        <div className="h-5 w-5 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Shield className="h-3 w-3" />
        </div>
        <div className="flex flex-col items-start leading-none text-left">
          <span className="text-[10.5px] uppercase font-bold text-muted-foreground tracking-wider hidden sm:block">
            View
          </span>
          <span className="text-xs sm:text-sm font-bold text-foreground truncate max-w-[80px] sm:max-w-[120px]">
            {activeOption.label}
          </span>
        </div>
        <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
      </button>

      {/* Compact Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Switch View</h3>
                <p className="text-xs text-muted-foreground">Select role perspective</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Compact Role List */}
            <div className="p-2 space-y-1">
              {availableOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isCurrent = currentRole === opt.role;

                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleSelectRole(opt.role)}
                    className={cn(
                      "w-full px-3 py-2 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer group",
                      isCurrent
                        ? "bg-primary/10 border-primary/50 text-foreground font-semibold"
                        : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                        opt.accentColor
                      )}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-bold text-foreground truncate">
                          {opt.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {opt.subtitle}
                      </p>
                    </div>

                    {isCurrent && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
