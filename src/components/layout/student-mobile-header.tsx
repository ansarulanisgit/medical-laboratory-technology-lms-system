"use client";

import * as React from "react";
import Link from "next/link";
import { Microscope, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function StudentMobileHeader() {
  const { profile } = useAcademicProfile();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentRole = mounted ? (profile?.role || "STUDENT") : "STUDENT";

  const roleBadgeLabel =
    !mounted
      ? "Student Portal"
      : currentRole === "SUPER_ADMIN"
      ? "Super Admin Portal"
      : currentRole === "ADMIN"
      ? "Admin Portal"
      : currentRole === "MENTOR"
      ? "Mentor Portal"
      : "Student Portal";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden print:hidden">
      <Link href="/student" className="flex items-center space-x-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-primary text-primary-foreground shrink-0 shadow-xs">
          <Microscope className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[16px] font-extrabold tracking-tight leading-tight whitespace-nowrap text-foreground">
            LabTutor <span className="text-primary font-bold">Academy</span>
          </span>
          <span className="text-[10.5px] uppercase font-semibold text-muted-foreground tracking-wide mt-0.5 whitespace-nowrap leading-tight">
            {roleBadgeLabel}
          </span>
        </div>
      </Link>

      <div className="flex items-center space-x-2">
        <NotificationBell />
        <Link
          href="/student/profile"
          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl border border-border bg-card p-1.5 text-foreground hover:bg-muted/60 transition-colors shadow-2xs"
          aria-label="Student Profile"
        >
          <User className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
