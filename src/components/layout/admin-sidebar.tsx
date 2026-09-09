"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderKanban,
  HelpCircle,
  FileCheck,
  FlaskConical,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Building2,
  Shield,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/students", label: "Students", icon: Users, exact: false },
  { href: "/admin/curriculum", label: "Curriculum", icon: BookOpen, exact: false },
  { href: "/admin/content", label: "Lessons & Content", icon: FolderKanban, exact: false },
  { href: "/admin/assessments", label: "Quizzes & Exams", icon: FileCheck, exact: false },
  { href: "/admin/practical", label: "Practical Lab", icon: FlaskConical, exact: false },
  { href: "/admin/clinical-review", label: "Clinical Review", icon: ClipboardCheck, exact: false },
  { href: "/admin/analytics", label: "Cohort Analytics", icon: BarChart3, exact: false },
];

import { handleSignOut } from "@/lib/auth/logout";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await handleSignOut();
  };

  return (
    <aside className="h-screen w-64 flex-col border-r border-border bg-card text-card-foreground fixed left-0 top-0 z-30 hidden md:flex">
      {/* Brand & Role Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/admin" className="flex items-center space-x-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="LabTutor Academy"
              width={36}
              height={36}
              className="h-9 w-9 object-contain drop-shadow-xs"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">LabTutor</span>
            <span className="text-[10px] uppercase font-semibold text-secondary">Admin Portal</span>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Institutional Scoping Info */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Scope & Institution
          </span>
          <Badge variant="outline" className="text-[10px] border-secondary text-secondary">
            Scoped Admin
          </Badge>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-medium text-foreground mt-1">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">Dhaka Institute of Health Tech</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Role: ADMIN (Authorized Scope)
        </p>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                isActive
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-border">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start text-xs min-h-[44px] text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
