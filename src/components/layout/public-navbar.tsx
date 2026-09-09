"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X, GraduationCap, ShieldCheck, Microscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useSystemSettings } from "@/lib/stores/system-settings-store";

const navLinks = [
  { href: "/#curriculum", label: "Curriculum" },
  { href: "/#study-center", label: "Study Center" },
  { href: "/student/resume", label: "Resume Maker" },
  { href: "/student/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { openAuthModal } = useAuthModal();
  const { settings } = useSystemSettings();

  const brandParts = settings.brandName.split(" ");
  const brandFirst = brandParts[0] || "LabTutor";
  const brandRest = brandParts.slice(1).join(" ") || "Academy";

  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm overflow-hidden">
            {settings.customLogoUrl ? (
              <img src={settings.customLogoUrl} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <Microscope className="h-6 w-6" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              {brandFirst} <span className="text-primary font-semibold">{brandRest}</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground line-clamp-1">
              {settings.brandTagline ? "Dedicated LMS Platform" : "Dedicated LMS Platform"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-[15px] font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary py-2",
                pathname === link.href
                  ? "text-primary font-bold"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAuthModal("LOGIN")}
            className="cursor-pointer font-bold text-sm h-10 px-4"
          >
            Log In
          </Button>
          <Button
            size="sm"
            onClick={() => openAuthModal("REGISTER")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm h-10 px-5 rounded-xl cursor-pointer shadow-xs"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-border bg-card p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex min-h-[44px] items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-accent",
                  pathname === link.href
                    ? "bg-accent text-primary font-semibold"
                    : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-border flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full justify-center cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                openAuthModal("LOGIN");
              }}
            >
              Log In
            </Button>
            <Button
              className="w-full justify-center bg-primary text-primary-foreground font-semibold cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                openAuthModal("REGISTER");
              }}
            >
              Create Free Account
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
