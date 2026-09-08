"use client";

import * as React from "react";
import Link from "next/link";
import {
  Code2,
  ExternalLink,
  Microscope,
  Cpu,
  Sparkles,
  BookOpen,
  FlaskConical,
  Award,
  Globe,
  MessageSquare,
  GraduationCap,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AboutDeveloperPage() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-primary/10 text-primary inline-flex ring-1 ring-primary/20 shadow-2xs">
                <Code2 className="h-6 w-6" />
              </span>
              <span>About Developer</span>
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground font-normal">
            Medical Technologist (Lab) under DGHS & developer of LabTutor Academy.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/student/profile">
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm h-9 sm:h-10 px-4 rounded-xl border-border/80 hover:bg-muted font-medium transition-all"
            >
              My Profile
            </Button>
          </Link>
          <Link href="/student">
            <Button
              size="sm"
              className="text-xs sm:text-sm h-9 sm:h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-xs transition-all"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Main Developer Profile Card */}
      <Card className="rounded-3xl border-border/80 shadow-sm overflow-hidden bg-gradient-to-br from-card via-card to-primary/[0.03]">
        {/* Subtle Top Accent Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

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
                      alt="Ansarul Anis"
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

            {/* Right Column: Name + Credentials + Narrative */}
            <div className="space-y-5 text-center md:text-left flex-1 min-w-0">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                    Ansarul Anis
                  </h2>
                </div>

                {/* 3 Quick Credential Highlight Cards with Distinct Thematic Accents */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
                  {/* Card 1: Academic Background */}
                  <div className="flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-blue-500/[0.08] via-blue-500/[0.02] to-transparent border border-blue-500/25 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                          <GraduationCap className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-xs sm:text-[13px] font-bold text-foreground">
                          Academic Background
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] text-muted-foreground leading-relaxed">
                        Diploma in Medical Laboratory Technology from <strong>IHT, Rajshahi</strong> in 2015.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Current Service */}
                  <div className="flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.02] to-transparent border border-emerald-500/25 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
                          <Building2 className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-xs sm:text-[13px] font-bold text-foreground">
                          Current Service
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] text-muted-foreground leading-relaxed">
                        Working as a <strong>Medical Technologist (Lab)</strong> under the <strong>Directorate General of Health Services (DGHS)</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Platform Leadership */}
                  <div className="flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-purple-500/[0.08] via-purple-500/[0.02] to-transparent border border-purple-500/25 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 shrink-0 shadow-2xs">
                          <Code2 className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-xs sm:text-[13px] font-bold text-foreground">
                          Platform Leadership
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] text-muted-foreground leading-relaxed">
                        Creator, Architect & Full-Stack Developer of <strong>LabTutor Academy</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Professional Narrative Card */}
                <div className="mt-5 p-5 sm:p-6 rounded-2xl bg-muted/25 border border-border/75 space-y-3 text-left shadow-2xs">
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

      {/* 3. Platform Architecture & Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Vision & Mission */}
        <Card className="rounded-3xl border-border/80 shadow-xs flex flex-col justify-between overflow-hidden">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-primary/10 text-primary inline-flex">
                <Sparkles className="h-5 w-5" />
              </span>
              <span>Vision Behind LabTutor Academy</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">
              Transforming Medical Laboratory Technology education into an interactive, clinically grounded digital experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-3.5">
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/60 transition-all hover:bg-muted/40">
                <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block text-xs sm:text-sm font-semibold">National Curriculum Alignment (SMFB & DGHS)</strong>
                  <span className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                    Comprehensive 4-Year Diploma & B.Sc. syllabus digitized into structured units, high-yield lecture notes, and official exam weightings.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/60 transition-all hover:bg-muted/40">
                <FlaskConical className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block text-xs sm:text-sm font-semibold">Standard Operating Procedures (SOPs) & Bench Protocols</strong>
                  <span className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                    Bridging textbook theory with clinical reality—specimen criteria, diagnostic test principles, and biohazard safety standards.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/60 transition-all hover:bg-muted/40">
                <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block text-xs sm:text-sm font-semibold">Structured OSPE & Board Viva Preparation</strong>
                  <span className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                    Active diagnostic station guides, faculty oral viva defense Q&A with model answers, and authentic previous board questions.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/60 transition-all hover:bg-muted/40">
                <Microscope className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block text-xs sm:text-sm font-semibold">Clinical Competency & Practical Excellence</strong>
                  <span className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                    Empowering medical laboratory students across Bangladesh to master routine and emergency diagnostic pathology with digital confidence.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Stack & Expertise */}
        <Card className="rounded-3xl border-border/80 shadow-xs overflow-hidden">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-primary/10 text-primary inline-flex">
                <Cpu className="h-5 w-5" />
              </span>
              <span>Technical & Clinical Expertise</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">
              Combining full-stack software development, CMS & eCommerce solutions with clinical diagnostic science.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-5">
            <div className="space-y-4">
              {/* Web & Software Development */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-primary" />
                    <span>Web & Software Development</span>
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">Full-Stack & CMS</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "WordPress",
                    "WooCommerce",
                    "Shopify",
                    "PHP",
                    "HTML5",
                    "CSS3",
                    "JavaScript (JS)",
                    "TypeScript",
                    "React 19",
                    "Next.js 15",
                    "Tailwind CSS",
                    "Node.js",
                    "Supabase",
                    "PostgreSQL",
                    "REST & GraphQL APIs",
                    "Full-Stack Web Apps",
                    "Custom Theme Development",
                    "Responsive UI/UX Design",
                    "eCommerce Solutions",
                    "Web Performance Optimization",
                  ].map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="text-xs sm:text-[13px] font-normal px-2.5 py-1 border-border/80 bg-muted/40 hover:bg-muted/70 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clinical & Laboratory Science */}
              <div className="pt-3 border-t border-border/60">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Microscope className="h-4 w-4 text-primary" />
                    <span>Clinical & Laboratory Science</span>
                  </span>
                  <span className="text-xs text-primary font-mono font-medium">Diagnostic Medicine</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Clinical Pathology",
                    "Diagnostic Hematology",
                    "Clinical Chemistry",
                    "Medical Microbiology",
                    "Histopathology & Cytology",
                    "Blood Transfusion Medicine",
                    "Quality Control (Westgard Multirules)",
                    "OSPE & Lab Station Design",
                    "Clinical Phlebotomy SOPs",
                    "Laboratory Biosafety (BSL 1-3)",
                  ].map((sci) => (
                    <Badge
                      key={sci}
                      variant="outline"
                      className="text-xs sm:text-[13px] font-normal px-2.5 py-1 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                    >
                      {sci}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
