"use client";

import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
          <Link href="/student/curriculum" className="hover:text-primary transition-colors">
            Curriculum
          </Link>
          <Link href="/student/study-center" className="hover:text-primary transition-colors">
            Study Center
          </Link>
          <Link href="/student/resume" className="hover:text-primary transition-colors">
            Resume Maker
          </Link>
          <Link href="/student/jobs" className="hover:text-primary transition-colors">
            Jobs
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors text-primary font-bold">
            Contact Us
          </Link>
          <Link href="/verify" className="hover:text-primary transition-colors">
            Verify Certificate
          </Link>
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
              Ansarul Anis
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

