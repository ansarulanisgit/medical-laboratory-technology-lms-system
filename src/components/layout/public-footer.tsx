"use client";

import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
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

