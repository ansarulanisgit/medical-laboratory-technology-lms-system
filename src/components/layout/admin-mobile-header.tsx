"use client";

import * as React from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AdminMobileHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
      <Link href="/admin" className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Shield className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold tracking-tight">Admin Portal</span>
      </Link>

      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-border bg-card p-2 text-foreground"
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="absolute top-14 left-0 right-0 border-b border-border bg-card p-4 shadow-lg flex flex-col space-y-2">
          <Link href="/admin" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
            Dashboard
          </Link>
          <Link href="/admin/students" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
            Students
          </Link>
          <Link href="/admin/curriculum" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
            Curriculum
          </Link>
          <Link href="/admin/content" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
            Content
          </Link>
          <Link href="/admin/assessments" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
            Assessments
          </Link>
          <Link href="/admin/clinical-review" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
            Clinical Review
          </Link>
          <Link href="/admin/analytics" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
            Analytics
          </Link>
        </div>
      )}
    </header>
  );
}
