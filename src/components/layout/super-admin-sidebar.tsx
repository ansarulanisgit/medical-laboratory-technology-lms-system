"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  Users2,
  GraduationCap,
  Building,
  Layers,
  GitFork,
  BookMarked,
  ScrollText,
  Sliders,
  LogOut,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const superAdminNavItems = [
  { href: "/super-admin", label: "Overview", icon: Sparkles, exact: true },
  { href: "/super-admin/admins", label: "Admin Management", icon: Users2, exact: false },
  { href: "/super-admin/institutions", label: "Institutions", icon: Building, exact: false },
  { href: "/super-admin/programs", label: "Degree Programs", icon: GraduationCap, exact: false },
  { href: "/super-admin/curriculum", label: "Curriculum Versions", icon: GitFork, exact: false },
  { href: "/super-admin/subjects", label: "All Subjects", icon: Layers, exact: false },
  { href: "/super-admin/audit-logs", label: "System Audit Logs", icon: ScrollText, exact: false },
  { href: "/super-admin/settings", label: "Platform Settings", icon: Sliders, exact: false },
];

import { handleSignOut } from "@/lib/auth/logout";

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await handleSignOut();
  };

  return (
    <aside className="h-screen w-64 flex-col border-r border-border bg-card text-card-foreground fixed left-0 top-0 z-30 hidden md:flex">
      {/* Brand & Super Admin Badge */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/super-admin" className="flex items-center space-x-2.5">
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
            <span className="text-[10px] uppercase font-semibold text-destructive">Super Admin</span>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Platform Ownership Notice */}
      <div className="p-4 border-b border-border bg-destructive/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">
            Root Authority
          </span>
          <Badge variant="destructive" className="text-[10px]">
            Super Admin
          </Badge>
        </div>
        <p className="text-xs font-semibold text-foreground">
          Platform-Wide Ownership
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Unrestricted cross-institution control
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {superAdminNavItems.map((item) => {
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
                  ? "bg-destructive text-destructive-foreground shadow-sm"
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
