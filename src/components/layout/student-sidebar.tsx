"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Layers,
  FlaskConical,
  FileQuestion,
  Award,
  FileText,
  Briefcase,
  Bell,
  User,
  LogOut,
  Microscope,
  Users,
  Settings,
  Type,
  Activity,
  ChevronsLeft,
  ChevronsRight,
  Code2,
  Shield,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { handleSignOut } from "@/lib/auth/logout";
import { useSidebar } from "@/lib/context/sidebar-context";
import { useSystemSettings } from "@/lib/stores/system-settings-store";
import { UserRole } from "@/types/roles";

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, updateUserRole } = useAcademicProfile();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { settings } = useSystemSettings();

  const [tooltip, setTooltip] = React.useState<{
    label: string;
    top: number;
    isActive?: boolean;
  } | null>(null);

  // Clear tooltip when sidebar collapses/expands or route changes
  React.useEffect(() => {
    setTooltip(null);
  }, [isCollapsed, pathname]);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentRole: UserRole = mounted ? (profile?.role || "STUDENT") : "STUDENT";

  const handleLogout = async () => {
    await handleSignOut();
  };

  interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
  }

  interface NavGroup {
    id: string;
    title: string;
    items: NavItem[];
  }

  // Role-adaptive categorized navigation groups
  const navGroups: NavGroup[] = React.useMemo(() => {
    const academics: NavItem[] = [
      { href: "/student/curriculum", label: "Course Curriculum", icon: BookOpen, exact: false },
      { href: "/student/study-center", label: "Study Center", icon: Layers, exact: false },
      { href: "/student/questions", label: "Question Bank", icon: FileQuestion, exact: false },
      { href: "/student/practical", label: "Lab Practical", icon: FlaskConical, exact: false },
    ];

    const studentTools: NavItem[] = [
      { href: "/student/certificates", label: "Certificates", icon: Award, exact: false },
      { href: "/student/resume", label: "Resume Maker", icon: FileText, exact: false },
      { href: "/student/jobs", label: "Jobs", icon: Briefcase, exact: false },
      { href: "/student/updates", label: "Updates", icon: Bell, exact: false },
      { href: "/student/profile", label: "My Profile", icon: User, exact: false },
      { href: "/student/developer", label: "About", icon: Code2, exact: false },
    ];

    if (currentRole === "SUPER_ADMIN") {
      return [
        {
          id: "overview",
          title: "Overview",
          items: [{ href: "/student", label: "Dashboard", icon: Home, exact: true }],
        },
        {
          id: "admin",
          title: "Administration",
          items: [
            { href: "/student/users", label: "User Management", icon: Users, exact: false },
            { href: "/student/admin/modules", label: "Module Management", icon: Settings, exact: false },
            { href: "/student/admin/strings", label: "String Management", icon: Type, exact: false },
            { href: "/student/admin/logs", label: "Real-time Data Log", icon: Activity, exact: false },
          ],
        },
        {
          id: "academics",
          title: "Academics",
          items: academics,
        },
        {
          id: "tools",
          title: "Career & Tools",
          items: studentTools,
        },
        {
          id: "system",
          title: "System",
          items: [{ href: "/student/admin/settings", label: "Settings", icon: Sliders, exact: false }],
        },
      ];
    }

    if (currentRole === "ADMIN") {
      return [
        {
          id: "overview",
          title: "Overview",
          items: [{ href: "/student", label: "Dashboard", icon: Home, exact: true }],
        },
        {
          id: "admin",
          title: "Administration",
          items: [{ href: "/student/users", label: "User Directory", icon: Users, exact: false }],
        },
        {
          id: "academics",
          title: "Academics",
          items: academics,
        },
        {
          id: "tools",
          title: "Career & Tools",
          items: studentTools,
        },
      ];
    }

    return [
      {
        id: "overview",
        title: "Overview",
        items: [{ href: "/student", label: "Dashboard", icon: Home, exact: true }],
      },
      {
        id: "academics",
        title: "Academics",
        items: academics,
      },
      {
        id: "tools",
        title: "Career & Tools",
        items: studentTools,
      },
    ];
  }, [currentRole]);

  const roleBadgeLabel =
    currentRole === "SUPER_ADMIN"
      ? "Super Admin Portal"
      : currentRole === "ADMIN"
      ? "Admin Portal"
      : currentRole === "MENTOR"
      ? "Mentor Portal"
      : "Student Portal";

  const brandParts = settings.brandName.split(" ");
  const brandFirst = brandParts[0] || "LabTutor";
  const brandRest = brandParts.slice(1).join(" ") || "Academy";

  return (
    <aside
      className={cn(
        "hidden md:flex h-screen flex-col border-r border-border bg-card text-card-foreground fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-64",
        "print:hidden"
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border/80 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "px-4"
        )}
      >
        <Link
          href="/student"
          title={!isCollapsed ? settings.brandName : undefined}
          onMouseEnter={(e) => {
            if (isCollapsed) {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip({
                label: settings.brandName,
                top: rect.top + rect.height / 2,
              });
            }
          }}
          onMouseLeave={() => setTooltip(null)}
          className={cn(
            "flex items-center group",
            isCollapsed ? "justify-center w-full" : "space-x-3"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary text-primary-foreground shadow-xs shrink-0 transition-transform group-hover:scale-105 mx-auto overflow-hidden">
            {settings.customLogoUrl ? (
              <img src={settings.customLogoUrl} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <Microscope className="h-5.5 w-5.5" />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-300 animate-in fade-in">
              <span className="text-[17px] font-extrabold tracking-tight text-foreground leading-tight whitespace-nowrap">
                {brandFirst} <span className="text-primary font-bold">{brandRest}</span>
              </span>
              <span className="text-[11px] uppercase font-semibold text-muted-foreground tracking-[0.06em] mt-0.5 whitespace-nowrap leading-tight">
                {roleBadgeLabel}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Role-adaptive Navigation List with subtle section dividers */}
      <div
        onScroll={() => setTooltip(null)}
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden py-2.5 transition-all duration-300 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          isCollapsed ? "px-2 flex flex-col items-center" : "px-3 space-y-3"
        )}
      >
        {navGroups.map((group, groupIdx) => (
          <div
            key={group.id}
            className={cn("w-full", isCollapsed ? "flex flex-col items-center" : "space-y-0.5")}
          >
            {/* Elegant Divider between groups when collapsed */}
            {isCollapsed && groupIdx > 0 && (
              <div className="w-5 h-px bg-border/70 my-1.5 shrink-0 rounded-full" />
            )}

            {/* Section Header when expanded */}
            {!isCollapsed && group.title && groupIdx > 0 && (
              <div className="px-3 pt-2 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground/70 select-none">
                {group.title}
              </div>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={(e) => {
                    if (isCollapsed) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        label: item.label,
                        top: rect.top + rect.height / 2,
                        isActive,
                      });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  className={cn(
                    "flex items-center rounded-xl text-sm transition-all duration-150 relative group cursor-pointer",
                    isCollapsed
                      ? "h-[35px] w-[35px] justify-center mx-auto my-0.5"
                      : "w-full space-x-3 px-3.5 py-2",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold ring-1 ring-primary/30"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground font-normal"
                  )}
                >
                  <Icon
                    className={cn(
                      "shrink-0 transition-transform group-hover:scale-105",
                      isCollapsed ? "h-[17px] w-[17px]" : "h-4 w-4"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>


      {/* Footer Controls with Collapsible Toggle Button */}
      <div className={cn("p-2.5 border-t border-border/80", isCollapsed ? "px-2 py-2.5 flex flex-col items-center gap-1.5" : "")}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex-1 justify-start text-sm min-h-[38px] text-muted-foreground hover:text-destructive hover:border-destructive/30 rounded-xl font-medium overflow-hidden cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">Sign Out</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="h-[38px] w-[38px] rounded-xl text-muted-foreground hover:text-foreground shrink-0 border-border/80 hover:bg-muted/60 cursor-pointer"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 w-full">
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  label: "Sign Out",
                  top: rect.top + rect.height / 2,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              className="h-[35px] w-[35px] rounded-xl text-muted-foreground hover:text-destructive hover:border-destructive/30 border-border/80 hover:bg-muted/60 shrink-0 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  label: "Expand Sidebar",
                  top: rect.top + rect.height / 2,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="h-[35px] w-[35px] mx-auto rounded-xl text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted/60 shrink-0 cursor-pointer"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Floating Tooltip when Collapsed */}
      {isCollapsed && tooltip && (
        <div
          className="fixed left-[76px] z-50 pointer-events-none -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-xl border border-primary/30 whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-150 flex items-center gap-2 ring-1 ring-black/10"
          style={{ top: tooltip.top + 'px' }}
        >
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-primary" />
          <span className="relative z-10 font-bold tracking-wide text-primary-foreground">{tooltip.label}</span>
          {tooltip.isActive && (
            <span className="relative z-10 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white/25 text-white tracking-wider uppercase">
              Active
            </span>
          )}
        </div>
      )}
    </aside>
  );
}
