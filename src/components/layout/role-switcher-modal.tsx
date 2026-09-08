"use client";

import * as React from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
  Award,
  Crown,
  Check,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { UserRole } from "@/types/roles";
import { cn } from "@/lib/utils";

interface RoleOption {
  role: UserRole;
  label: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeColor: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "STUDENT",
    label: "Student",
    badge: "Learner Portal",
    description:
      "Study Center notes, 10-year question banks, practical SOP procedures, CV builder, and job updates.",
    icon: GraduationCap,
    accentColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  {
    role: "MENTOR",
    label: "Mentor / Instructor",
    badge: "Clinical Faculty",
    description:
      "Student procedure verification, viva score evaluations, clinical rotation log approvals, and student mentoring.",
    icon: Award,
    accentColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  {
    role: "ADMIN",
    label: "Admin / Faculty",
    badge: "Institute Admin",
    description:
      "Student enrollment approvals, institution curriculum scheduling, subject allocations, and batch performance metrics.",
    icon: Shield,
    accentColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
    badgeColor: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  {
    role: "SUPER_ADMIN",
    label: "Super Admin",
    badge: "Directorate Level",
    description:
      "Central system management, multi-institution administration, activity audit logs, and global configuration.",
    icon: Crown,
    accentColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
    badgeColor: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  },
];

export function RoleSwitcherModal() {
  const { profile, updateUserRole } = useAcademicProfile();
  const [isOpen, setIsOpen] = React.useState(false);
  const currentRole: UserRole = profile.role || "STUDENT";

  const activeOption =
    ROLE_OPTIONS.find((opt) => opt.role === currentRole) || ROLE_OPTIONS[0];

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
        title={`Current Role: ${activeOption.label}. Click to switch role.`}
        className="h-10 px-2.5 sm:px-3 rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5 shadow-2xs group cursor-pointer shrink-0 select-none"
      >
        <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
          <Shield className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-col items-start leading-none text-left">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider hidden lg:block">
            Role
          </span>
          <span className="text-xs font-bold text-foreground truncate max-w-[90px] sm:max-w-[120px]">
            {activeOption.label.split(" / ")[0]}
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-0.5" />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg sm:max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-border/80 bg-gradient-to-br from-primary/10 via-card to-card flex items-start justify-between relative shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25 shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                    Switch User Role
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                      LMS Demo
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Preview the platform experience and modules from different perspectives
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-xl border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Role Cards Grid */}
            <div className="p-5 sm:p-6 space-y-2.5 overflow-y-auto max-h-[60vh]">
              {ROLE_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isCurrent = currentRole === opt.role;

                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleSelectRole(opt.role)}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer relative group",
                      isCurrent
                        ? "bg-primary/10 border-primary ring-2 ring-primary/30 shadow-xs"
                        : "bg-card border-border/80 hover:border-primary/50 hover:bg-muted/40"
                    )}
                  >
                    <div
                      className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                        opt.accentColor
                      )}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm sm:text-base font-bold text-foreground">
                          {opt.label}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                            opt.badgeColor
                          )}
                        >
                          {opt.badge}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow-2xs">
                            Active Role
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    {isCurrent && (
                      <div className="absolute right-4 top-4 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/80 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground shrink-0">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Updates instantly across all sidebar navigation items
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
