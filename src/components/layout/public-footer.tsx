"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PublicFooter() {
  const pathname = usePathname();

  const footerLinks = [
    { href: "/#curriculum", label: "Curriculum" },
    { href: "/#study-center", label: "Study Center" },
    { href: "/student/resume", label: "Resume Maker" },
    { href: "/student/jobs", label: "Jobs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact Us" },
    { href: "/verify", label: "Verify Certificate" },
  ];

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-[14px] font-semibold text-muted-foreground">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hover:text-primary transition-colors",
                pathname === link.href ? "text-primary font-bold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground pt-3 border-t border-border/60">
          <p>© {new Date().getFullYear()} LabTutor Academy. All rights reserved.</p>
          <div className="flex items-center space-x-1.5">
            <span>Developed by</span>
            <Link
              href="https://www.facebook.com/ansarulanis"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              Md. Ansarul Islam
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

