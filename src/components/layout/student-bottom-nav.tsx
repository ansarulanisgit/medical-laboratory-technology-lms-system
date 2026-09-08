"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Layers,
  FlaskConical,
  User,
  FileQuestion,
  Award,
  FileText,
  Briefcase,
  Bell,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";

interface NavTab {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  isCenter?: boolean;
}

export function StudentBottomNav() {
  const pathname = usePathname();
  const { profile } = useAcademicProfile();
  const currentRole = profile.role || "STUDENT";
  const isManagement = currentRole === "SUPER_ADMIN" || currentRole === "ADMIN";

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const activeTabRef = React.useRef<HTMLAnchorElement>(null);

  // Tabs ordered so the first 5 are: Dashboard, Curriculum, [Study Center (Middle)], Practical, Profile
  const tabs: NavTab[] = React.useMemo(() => {
    const list: NavTab[] = [
      { href: "/student", label: "Dashboard", icon: Home, exact: true },
      { href: "/student/curriculum", label: "Curriculum", icon: BookOpen, exact: false },
      { href: "/student/study-center", label: "Study Center", icon: Layers, exact: false, isCenter: true },
      { href: "/student/practical", label: "Practical", icon: FlaskConical, exact: false },
      { href: "/student/profile", label: "Profile", icon: User, exact: false },
      { href: "/student/questions", label: "Questions", icon: FileQuestion, exact: false },
      { href: "/student/certificates", label: "Certificates", icon: Award, exact: false },
      { href: "/student/resume", label: "Resume", icon: FileText, exact: false },
      { href: "/student/jobs", label: "Jobs", icon: Briefcase, exact: false },
      { href: "/student/updates", label: "Updates", icon: Bell, exact: false },
    ];

    if (isManagement) {
      list.push({ href: "/student/users", label: "Users", icon: Users, exact: false });
    }

    return list;
  }, [isManagement]);

  // Smoothly center the active tab in the horizontally scrollable bar
  React.useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [pathname]);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md md:hidden pb-safe shadow-lg print:hidden"
    >
      <div
        ref={scrollContainerRef}
        className="flex items-center overflow-x-auto no-scrollbar scrollbar-none h-[62px] scroll-smooth w-full snap-x snap-mandatory"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              ref={isActive ? activeTabRef : null}
              className={cn(
                "flex flex-col items-center justify-center w-[20%] min-w-[20%] max-w-[20%] shrink-0 h-full py-1 snap-start transition-colors select-none active:scale-95",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive ? "stroke-[2.25] text-primary" : "stroke-[1.6] text-muted-foreground"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1 tracking-tight leading-none text-center whitespace-nowrap truncate px-1",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground font-normal"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
