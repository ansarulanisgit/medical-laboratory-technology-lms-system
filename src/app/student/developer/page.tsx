"use client";

import * as React from "react";
import {
  Code2,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContributorsSection } from "@/components/contributors/contributors-section";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";

export default function AboutDeveloperPage() {
  const { profile } = useAcademicProfile();
  const isSuperOrAdmin = profile?.role === "SUPER_ADMIN" || profile?.role === "ADMIN";

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Main Developer Profile Card */}
      <Card className="rounded-3xl border-border/80 shadow-sm overflow-hidden bg-card">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 lg:gap-10">
            {/* Left Column: Avatar & Designations */}
            <div className="flex flex-col items-center shrink-0 gap-3.5">
              {/* Profile Image with Gradient Border & Glow */}
              <div className="relative group">
                <div className="p-1 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 shadow-md">
                  <div className="relative h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40 rounded-full overflow-hidden ring-2 ring-card bg-card">
                    <img
                      src="/developer.jpg"
                      alt="Md. Ansarul Islam"
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                {/* Verified Healthcare Badge */}
                <div
                  className="absolute bottom-1 right-1 p-1.5 rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-card"
                  title="Verified Healthcare Professional"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>

              {/* Roles & Designations Underneath Avatar */}
              <div className="flex flex-col items-center gap-2 w-full max-w-[215px]">
                <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-[12.5px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs w-full text-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span className="truncate">Medical Technologist (Lab)</span>
                </div>
                <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-[12.5px] font-medium bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-2xs w-full text-center">
                  <Code2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="truncate">Lead Web Developer</span>
                </div>
              </div>
            </div>

            {/* Right Column: Name + Badge + Narrative */}
            <div className="space-y-5 text-center md:text-left flex-1 min-w-0">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                    Md. Ansarul Islam
                  </h2>
                  <Badge
                    variant="outline"
                    className="text-xs sm:text-[13px] font-semibold px-3 py-1 rounded-full border-primary/30 bg-primary/10 text-primary shadow-2xs"
                  >
                    Founder &amp; Lead Developer of LabTutor Academy
                  </Badge>
                </div>

                {/* Detailed Professional Narrative Card */}
                <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-muted/25 border border-border/75 space-y-3 text-left shadow-2xs">
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
                    Studied and completed the <strong>Diploma in Medical Laboratory Technology (DMLT)</strong> course from the <strong>Institute of Health Technology (IHT), Rajshahi</strong> in <strong>2015</strong>.
                  </p>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
                    Currently working as a <strong>Professional Medical Technologist (Lab)</strong> under the <strong>Directorate General of Health Services (DGHS)</strong>. Possesses extensive practical expertise in hospital diagnostic laboratories across clinical pathology, hematology and quality assurance.
                  </p>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
                    Along with clinical laboratory practice, actively working as a passionate freelance software and web application developer. Built and architected <strong>LabTutor Academy</strong> to bridge the gap between classroom theory and real-world clinical laboratory practice—providing medical laboratory students across Bangladesh with digital SOPs, interactive curriculum governance, structured OSPE revision, and authentic board examination preparation.
                  </p>
                </div>
              </div>

              {/* Contact Buttons Section */}
              <div className="pt-3 border-t border-border/60">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3.5">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span>Contact:</span>
                  </span>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    {/* Facebook Button with Icon + Link */}
                    <a
                      href="https://www.facebook.com/ansarulanis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border border-[#1877F2]/30 transition-all shadow-2xs group"
                    >
                      <svg className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                    </a>

                    {/* WhatsApp Button with Icon + Link (No phone number in text) */}
                    <a
                      href="https://wa.me/8801709260934"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 transition-all shadow-2xs group"
                    >
                      <svg className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>WhatsApp</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Contributors Section (Current & Past) */}
      <ContributorsSection isAdmin={isSuperOrAdmin} />
    </div>
  );
}
