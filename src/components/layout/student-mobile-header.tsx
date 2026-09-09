"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, User, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";

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
        <div className="relative flex h-9 w-9 items-center justify-center shrink-0">
          <Image
            src="/logo.png"
            alt="LabTutor Academy Logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain drop-shadow-xs"
            priority
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[16px] font-extrabold tracking-tight leading-tight whitespace-nowrap text-foreground">
            LabTutor <span className="text-primary font-bold">Academy</span>
          </span>
          <span className="text-[8.5px] uppercase font-semibold text-muted-foreground tracking-[0.06em] mt-0.5 whitespace-nowrap leading-tight">
            {roleBadgeLabel}
          </span>
        </div>
      </Link>

      <div className="flex items-center space-x-2">
        <div className="inline-flex items-center space-x-1 rounded-lg border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary">
          <ShieldCheck className="h-3 w-3" />
          <span>{roleBadgeLabel}</span>
        </div>
        <Link
          href="/student/profile"
          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-border bg-card p-1.5 text-foreground"
          aria-label="Student Profile"
        >
          <User className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
