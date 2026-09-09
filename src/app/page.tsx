"use client";

import * as React from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Microscope,
  BookOpen,
  FlaskConical,
  FileQuestion,
  FileText,
  Briefcase,
  Award,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Layers,
  ChevronRight,
  Bell,
  Building2,
  Check,
  Zap,
  HelpCircle,
  Stethoscope,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  HeartPulse,
  Clock,
  Eye,
  Calendar,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@/components/auth/auth-modal-context";

// =========================================================================
// 1. DATA: CORE 8 FEATURES (3-COLUMN CARDS)
// =========================================================================

interface CoreFeature {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  glowColor: string;
  badge: string;
  badgeColor: string;
  ctaText: string;
  href: string;
}

const CORE_FEATURES: CoreFeature[] = [
  {
    id: "curriculum",
    title: "Course Curriculum & Marks",
    shortDesc: "Complete 4-year subject syllabus, theoretical mark distributions, and official exam question patterns.",
    icon: BookOpen,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/10 dark:bg-blue-950/50",
    glowColor: "group-hover:border-blue-500/50 group-hover:shadow-blue-500/10",
    badge: "Syllabus Blueprint",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    ctaText: "View Curriculum & Marks",
    href: "/student/curriculum",
  },
  {
    id: "study-center",
    title: "Study Center & Notes",
    shortDesc: "Classroom video lectures, examiner summary key notes, chapter quizzes, and oral viva voce drill cards.",
    icon: Layers,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-950/50",
    glowColor: "group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10",
    badge: "All 4 Academic Years",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    ctaText: "Enter 4-Year Study Center",
    href: "/student/study-center",
  },
  {
    id: "questions",
    title: "Last 10 Years Question Banks",
    shortDesc: "Enriched archive of past 10 years board examination papers with examiner model answers.",
    icon: FileQuestion,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10 dark:bg-amber-950/50",
    glowColor: "group-hover:border-amber-500/50 group-hover:shadow-amber-500/10",
    badge: "10-Year Archive",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    ctaText: "Practice Past Questions",
    href: "/student/questions",
  },
  {
    id: "practicals",
    title: "Lab Practical SOPs",
    shortDesc: "Step-by-step guides for all laboratory examinations across Clinical Biochemistry, Hematology, Immunology, Blood Banking, and Microbiology.",
    icon: FlaskConical,
    iconColor: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-500/10 dark:bg-teal-950/50",
    glowColor: "group-hover:border-teal-500/50 group-hover:shadow-teal-500/10",
    badge: "Bench Protocols",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    ctaText: "Explore Practical SOPs",
    href: "/student/practical",
  },
  {
    id: "certificates",
    title: "Course Completion Certificates",
    shortDesc: "Generate automated completion certificates after finishing subjects, lectures, and tasks on our platform.",
    icon: Award,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-500/10 dark:bg-purple-950/50",
    glowColor: "group-hover:border-purple-500/50 group-hover:shadow-purple-500/10",
    badge: "Course Completion",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    ctaText: "Explore Certificates",
    href: "/student/certificates",
  },
  {
    id: "updates",
    title: "Academic Updates & Notices",
    shortDesc: "Real-time SMFB exam routines, DGHS recruitment circulars, and university semester notifications.",
    icon: Bell,
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-500/10 dark:bg-rose-950/50",
    glowColor: "group-hover:border-rose-500/50 group-hover:shadow-rose-500/10",
    badge: "Real-Time Feed",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    ctaText: "Check Latest Updates",
    href: "/student/updates",
  },
  {
    id: "resume",
    title: "Standard Resume Builder",
    shortDesc: "Easily build a highly professional, laboratory technologist standard resume and become job-ready in just a few clicks.",
    icon: FileText,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-950/50",
    glowColor: "group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10",
    badge: "Career Ready",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    ctaText: "Build Standard Resume (Free)",
    href: "/student/resume",
  },
  {
    id: "jobs",
    title: "Hospital & Diagnostic Jobs",
    shortDesc: "Regular updates of Medical Technologist job vacancies in top Diagnostic and hospitals with details info",
    icon: Briefcase,
    iconColor: "text-emerald-700 dark:text-emerald-300",
    iconBg: "bg-emerald-600/10 dark:bg-emerald-950/50",
    glowColor: "group-hover:border-emerald-600/50 group-hover:shadow-emerald-600/10",
    badge: "Hospital Vacancies",
    badgeColor: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-600/20",
    ctaText: "Browse Job Offers",
    href: "/student/jobs",
  },
];

// =========================================================================
// 2. DATA: SPECIMEN VACUTAINER RACK (Interactive Graphic)
// =========================================================================

interface VacutainerTube {
  id: string;
  name: string;
  additive: string;
  capColor: string;
  accentBg: string;
  textColor: string;
  borderColor: string;
  department: string;
  commonTests: string[];
  inversions: string;
  clinicalNote: string;
}

const VACUTAINER_TUBES: VacutainerTube[] = [
  {
    id: "lavender",
    name: "Lavender Top (EDTA)",
    additive: "K2 / K3 EDTA (1.5–2.0 mg/mL)",
    capColor: "bg-purple-600",
    accentBg: "bg-purple-500/10 dark:bg-purple-950/40",
    textColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-500/30",
    department: "Hematology & Blood Bank",
    commonTests: ["Complete Blood Count (CBC)", "Peripheral Smear (PBF)", "HbA1c", "ESR"],
    inversions: "8 to 10 gentle inversions",
    clinicalNote: "Chelates Calcium (Factor IV) irreversibly without altering cellular morphology. Never freeze whole blood.",
  },
  {
    id: "blue",
    name: "Light Blue Top (Citrate)",
    additive: "3.2% Buffered Sodium Citrate (1:9 ratio)",
    capColor: "bg-sky-500",
    accentBg: "bg-sky-500/10 dark:bg-sky-950/40",
    textColor: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-500/30",
    department: "Coagulation / Hemostasis",
    commonTests: ["Prothrombin Time (PT/INR)", "APTT", "Fibrinogen", "D-Dimer"],
    inversions: "3 to 4 gentle inversions",
    clinicalNote: "Reversible calcium binding preserves labile Factors V & VIII. Fill strictly to mark indicator.",
  },
  {
    id: "gold",
    name: "Gold / Red Top (SST)",
    additive: "Clot Activator & Inert Polyester Gel",
    capColor: "bg-amber-500",
    accentBg: "bg-amber-500/10 dark:bg-amber-950/40",
    textColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-500/30",
    department: "Clinical Biochemistry & Serology",
    commonTests: ["Liver Function (LFT)", "Kidney Function (KFT)", "Lipid Profile", "Hepatitis Serology"],
    inversions: "5 gentle inversions (clot 30 min)",
    clinicalNote: "Allows complete fibrin clot retraction. Centrifuge at 3,000 RPM for 10 minutes to obtain clear serum.",
  },
  {
    id: "gray",
    name: "Gray Top (Fluoride)",
    additive: "Sodium Fluoride + Potassium Oxalate",
    capColor: "bg-slate-500",
    accentBg: "bg-slate-500/10 dark:bg-slate-900/40",
    textColor: "text-slate-700 dark:text-slate-300",
    borderColor: "border-slate-500/30",
    department: "Specialized Biochemistry",
    commonTests: ["Fasting Plasma Glucose (FPG)", "2-Hour Post Prandial", "OGTT", "Blood Lactate"],
    inversions: "8 to 10 gentle inversions",
    clinicalNote: "Inhibits enolase enzyme to arrest glycolysis, preserving true glucose values up to 48 hours.",
  },
  {
    id: "green",
    name: "Green Top (Heparin)",
    additive: "Lithium Heparin (10–30 USP units/mL)",
    capColor: "bg-emerald-600",
    accentBg: "bg-emerald-500/10 dark:bg-emerald-950/40",
    textColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-500/30",
    department: "Stat Emergency & Blood Gas",
    commonTests: ["Arterial Blood Gas (ABG)", "Electrolytes (Na+, K+, Cl-)", "Cardiac Troponin I"],
    inversions: "8 to 10 gentle inversions",
    clinicalNote: "Activates antithrombin III for rapid emergency plasma testing without waiting for clot.",
  },
];

// =========================================================================
// MAIN PAGE COMPONENT (Large, Comfortable & Highly Readable Typography)
// =========================================================================

export default function HomePage() {
  const { openAuthModal } = useAuthModal();
  const [selectedTube, setSelectedTube] = React.useState<VacutainerTube>(VACUTAINER_TUBES[0]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* 1. HERO SECTION (Starts immediately after navbar)                 */}
        {/* ================================================================= */}
        <section className="relative overflow-hidden pt-10 pb-16 sm:pt-20 sm:pb-28 border-b border-border/80 bg-gradient-to-b from-primary/10 via-background to-background">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative">
            {/* Main Headline (Short, Meaningful & Engaging) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.18] max-w-4xl mx-auto">
              Learn, Practice &amp; Excel in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-teal-500 dark:from-primary dark:to-teal-400">
                Medical Laboratory Technology
              </span>
            </h1>

            {/* Clear, Engaging Subhead */}
            <p className="mt-4 sm:mt-6 text-base sm:text-[18px] text-foreground/90 max-w-4xl mx-auto leading-relaxed font-normal">
              <span className="block sm:hidden">
                The all-in-one digital learning and competency platform for Diploma and B.Sc. Medical Laboratory Technology students in Bangladesh.
              </span>
              <span className="hidden sm:inline">
                The all-in-one digital learning and competency development platform for Diploma and BSc Medical Laboratory Technology students in Bangladesh. Learn smarter, practice with confidence, prepare for exams, develop essential laboratory competencies, and build the knowledge and skills you need for a successful career as a Medical Laboratory Technologist—all in one place.
              </span>
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 max-w-5xl mx-auto">
              <Button
                size="lg"
                onClick={() => openAuthModal("REGISTER")}
                className="w-full sm:w-auto h-13 sm:h-14 px-6 sm:px-7 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25 text-base rounded-2xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Get Free Student Access</span>
                <ArrowRight className="h-5 w-5" />
              </Button>

              <Link href="/student/study-center" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-13 sm:h-14 px-6 sm:px-7 border-border/90 bg-card hover:bg-blue-600 hover:border-blue-600 hover:text-white text-foreground font-bold text-base rounded-2xl cursor-pointer active:scale-95 transition-all duration-200 shadow-xs hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-all duration-200 group-hover:scale-110 group-hover:text-white" />
                  <span className="transition-colors duration-200 group-hover:text-white">Study Center</span>
                  <ArrowRight className="h-4 w-4 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" />
                </Button>
              </Link>

              <Link href="/student/resume" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-13 sm:h-14 px-6 sm:px-7 border-border/90 bg-card hover:bg-purple-600 hover:border-purple-600 hover:text-white text-foreground font-bold text-base rounded-2xl cursor-pointer active:scale-95 transition-all duration-200 shadow-xs hover:shadow-lg hover:shadow-purple-600/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400 transition-all duration-200 group-hover:scale-110 group-hover:text-white" />
                  <span className="transition-colors duration-200 group-hover:text-white">Build Resume</span>
                  <ArrowRight className="h-4 w-4 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" />
                </Button>
              </Link>

              <Link href="/student/jobs" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-13 sm:h-14 px-6 sm:px-7 border-border/90 bg-card hover:bg-amber-600 hover:border-amber-600 hover:text-white text-foreground font-bold text-base rounded-2xl cursor-pointer active:scale-95 transition-all duration-200 shadow-xs hover:shadow-lg hover:shadow-amber-600/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  <Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400 transition-all duration-200 group-hover:scale-110 group-hover:text-white" />
                  <span className="transition-colors duration-200 group-hover:text-white">Get a Job</span>
                  <ArrowRight className="h-4 w-4 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" />
                </Button>
              </Link>
            </div>

            {/* 5 Beautiful, Elegant Feature Cards (Icon Above, Title, Short Description) */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 pt-10 border-t border-border/80 text-left">
              {/* Card 1: All 4 Years */}
              <Link href="/student/curriculum" className="group">
                <div className="h-full p-5 sm:p-6 rounded-3xl bg-card border border-border/80 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-xs">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-blue-600 transition-colors leading-snug">
                      All 4 Years
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                      Full curriculum syllabus &amp; mark distribution
                    </p>
                  </div>
                </div>
              </Link>

              {/* Card 2: Interactive Study Center (NEW) */}
              <Link href="/student/study-center" className="group">
                <div className="h-full p-5 sm:p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-xs">
                      <Layers className="h-6 w-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-emerald-600 transition-colors leading-snug">
                      Interactive Study Center
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                      Classroom lectures, key notes &amp; chapter quizzes
                    </p>
                  </div>
                </div>
              </Link>

              {/* Card 3: 10-Year Archive */}
              <Link href="/student/questions" className="group">
                <div className="h-full p-5 sm:p-6 rounded-3xl bg-card border border-border/80 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-xs">
                      <FileQuestion className="h-6 w-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-amber-600 transition-colors leading-snug">
                      10-Year Archive
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                      Enriched previous board examination questions
                    </p>
                  </div>
                </div>
              </Link>

              {/* Card 4: 100+ Lab SOPs */}
              <Link href="/student/practical" className="group">
                <div className="h-full p-5 sm:p-6 rounded-3xl bg-card border border-border/80 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-xs">
                      <FlaskConical className="h-6 w-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-teal-600 transition-colors leading-snug">
                      100+ Lab SOPs
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                      Step-by-step frontline examination guides
                    </p>
                  </div>
                </div>
              </Link>

              {/* Card 5: Resume & Jobs */}
              <Link href="/student/jobs" className="group col-span-2 sm:col-span-1">
                <div className="h-full p-5 sm:p-6 rounded-3xl bg-card border border-border/80 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-xs">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-indigo-600 transition-colors leading-snug">
                      Resume &amp; Jobs
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                      Diagnostic CV builder &amp; hospital vacancies
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. OUR CORE FEATURES (3-COLUMN DESIGN FOR DESKTOP)               */}
        {/* ================================================================= */}
        <section className="container mx-auto px-4 sm:px-6 max-w-7xl py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <Badge variant="outline" className="text-primary font-bold text-sm sm:text-base px-4 py-1.5 mb-3.5">
              Essential Platform Pillars
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Our Core Features
            </h2>
            <p className="mt-4 text-base sm:text-xl text-muted-foreground leading-relaxed">
              Eight comprehensive features specifically engineered to support Medical Laboratory Technology students and clinical professionals throughout college and career.
            </p>
          </div>

          {/* 3-Column Desktop Grid (lg:grid-cols-3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CORE_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={cn(
                    "group relative p-7 sm:p-9 rounded-3xl bg-card border border-border/80 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between space-y-7 shadow-xs hover:shadow-md",
                    feature.glowColor
                  )}
                >
                  <div className="space-y-4">
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center justify-between">
                      <div className={cn("p-4 rounded-2xl shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110", feature.iconBg)}>
                        <Icon className={cn("h-7 w-7", feature.iconColor)} />
                      </div>
                      <span className={cn("text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full border", feature.badgeColor)}>
                        {feature.badge}
                      </span>
                    </div>

                    {/* Short Title & Short Description */}
                    <div>
                      <h3 className="font-extrabold text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-base sm:text-[17px] text-muted-foreground mt-2.5 leading-relaxed">
                        {feature.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-3 border-t border-border/60">
                    <Link href={feature.href} className="w-full block">
                      <Button
                        className="w-full h-12 sm:h-13 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-bold text-sm sm:text-base rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground shadow-2xs"
                      >
                        <span>{feature.ctaText}</span>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. DEDICATED IN-DEPTH FEATURE EXPLANATION SECTION                 */}
        {/* ================================================================= */}
        <section className="py-16 sm:py-24 bg-muted/30 border-y border-border space-y-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
              <Badge variant="outline" className="text-primary font-bold text-sm sm:text-base px-4 py-1.5 mb-3.5">
                Comprehensive Feature Deep-Dive
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Everything You Get on LabTutor Academy
              </h2>
              <p className="mt-4 text-base sm:text-xl text-muted-foreground leading-relaxed">
                Explore how each feature provides the real-world depth, interactive graphics, and syllabus alignment needed to excel in examinations and clinical practice.
              </p>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 1: Curriculum & Marks                                  */}
            {/* ------------------------------------------------------------- */}
            <div id="curriculum" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 border-b border-border/80 scroll-mt-24">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <BookOpen className="h-5 w-5" />
                  <span>Academic Blueprint</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Course Curriculum, Mark Distribution &amp; Question Patterns
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Never enter an examination room wondering how marks are structured. We break down the complete 4-year curriculum for Diploma in Medical Laboratory Technology (IHT/SMFB) and B.Sc. in Health Technology (Laboratory), mapping exact weightings between theoretical papers, practical bench spotting, and oral viva voce examinations.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 shrink-0 mt-0.5" />
                    <span>Complete 4-year subject maps for Diploma (SMFB) and B.Sc. under DU, RU &amp; BSMMU.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 shrink-0 mt-0.5" />
                    <span>Exact mark distribution: Written Theory (60%), Practical Bench (25%), Oral Viva (15%).</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 shrink-0 mt-0.5" />
                    <span>Question anatomy breakdowns across Part A (Broad), Part B (Short notes), and Part C (Distinctions).</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link href="/student/curriculum">
                    <Button className="h-13 px-7 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl flex items-center gap-2">
                      <span>Explore Full Curriculum &amp; Marks</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Graphic 1: Mark Distribution Gauge Card */}
              <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                  <span className="text-sm sm:text-base font-bold text-foreground">Official Examination Mark Weighting</span>
                  <Badge variant="outline" className="text-xs font-semibold text-blue-600">SMFB / University</Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm sm:text-base font-semibold mb-1.5">
                      <span>Written Theory Paper</span>
                      <span className="font-bold text-blue-600">60%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[60%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm sm:text-base font-semibold mb-1.5">
                      <span>Practical Examination &amp; Slide Spotting</span>
                      <span className="font-bold text-teal-600">25%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full w-[25%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm sm:text-base font-semibold mb-1.5">
                      <span>Oral Viva Voce &amp; Clinical Logbook</span>
                      <span className="font-bold text-purple-600">15%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full w-[15%]" />
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs sm:text-sm text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                  <strong>Examiner Guideline:</strong> Candidates must score at least 50% separately in written, practical, and viva to pass each course.
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 2: Study Center & Notes                                */}
            {/* ------------------------------------------------------------- */}
            <div id="study-center" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 border-b border-border/80 scroll-mt-24">
              {/* Graphic 2: 4-Year Academic Grid Preview */}
              <div className="lg:col-span-5 order-2 lg:order-1 p-7 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                  <span className="text-sm sm:text-base font-bold text-foreground">Study Center 4-Year Hierarchy</span>
                  <Badge variant="outline" className="text-xs font-semibold text-emerald-600">Digital Classroom</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
                    <span className="font-bold text-foreground block text-sm sm:text-base">Year 1: Foundations</span>
                    <p className="text-xs sm:text-sm text-muted-foreground">Anatomy, Biochemistry I, Lab Safety</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
                    <span className="font-bold text-foreground block text-sm sm:text-base">Year 2: Core Diagnostics</span>
                    <p className="text-xs sm:text-sm text-muted-foreground">Hematology I, Microbiology, Urine R/M/E</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
                    <span className="font-bold text-foreground block text-sm sm:text-base">Year 3: Advanced Tech</span>
                    <p className="text-xs sm:text-sm text-muted-foreground">Biochemistry II, Blood Bank, Parasitology</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
                    <span className="font-bold text-foreground block text-sm sm:text-base">Year 4: Hospital Shift</span>
                    <p className="text-xs sm:text-sm text-muted-foreground">Histopathology, Cytology, Grand Viva</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2.5">
                  <Layers className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span>Includes video lectures, downloadable hand notes, and chapter quizzes.</span>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  <Layers className="h-5 w-5" />
                  <span>Core Classroom</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Study Center (Lectures, Examiner Key Notes &amp; Quizzes)
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Your structured digital study hub for all 4 academic years. Learn complex pathophysiological pathways, master staining reactions, and reinforce your knowledge with high-yield examiner summaries designed specifically for quick mobile revision.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Systematic video lectures breaking down laboratory testing principles and automation.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Downloadable hand notes, reference ranges, and staining protocol summary sheets.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Self-testing chapter quizzes with instant scoring and explanation rationales.</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link href="/student/study-center">
                    <Button className="h-13 px-7 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-2xl flex items-center gap-2">
                      <span>Enter 4-Year Study Center</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 3: 10-Year Question Bank                               */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 border-b border-border/80">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  <FileQuestion className="h-5 w-5" />
                  <span>Exam Success</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Last 10 Years Question Banks Archive
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Eliminate the frustration of blurry, dog-eared photocopies with missing questions. We cataloged ten complete years of State Medical Faculty and University final professional examination papers, tagged by repetition frequency, question marks, and chapter.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 shrink-0 mt-0.5" />
                    <span>Complete board exam papers from the last 10 years indexed by subject and year.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 shrink-0 mt-0.5" />
                    <span>High-frequency badges identifying questions repeated across multiple board sessions.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 shrink-0 mt-0.5" />
                    <span>Examiner model answers written according to official marking rubrics.</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link href="/student/questions">
                    <Button className="h-13 px-7 bg-amber-600 hover:bg-amber-700 text-white font-bold text-base rounded-2xl flex items-center gap-2">
                      <span>Practice 10-Year Question Bank</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Graphic 3: Board Paper Mockup */}
              <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4 font-sans">
                <div className="text-center border-b border-border/80 pb-3.5">
                  <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest block">
                    State Medical Faculty of Bangladesh
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground">Clinical Hematology &amp; Hemostasis</span>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/70 space-y-2.5 text-sm">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-bold text-foreground text-sm sm:text-base">
                      Q.2 (a) Classify Anemias based on RBC indices (MCV, MCH, MCHC).
                    </p>
                    <span className="font-bold text-amber-600 shrink-0 text-sm sm:text-base">[8 Marks]</span>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    (b) Write down the clinical significance of Reticulocyte count in hemolytic anemia.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                      Repeated: 2024, 2022, 2019
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold text-xs">
                      Model Answer Ready
                    </span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground text-center">
                  Searchable by chapter, mark value, and repetition frequency.
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 4: Lab Practical Guides & SOPs                         */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 border-b border-border/80">
              {/* Graphic 4: Interactive Vacutainer Tube Rack */}
              <div className="lg:col-span-6 order-2 lg:order-1 p-7 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                  <span className="text-sm sm:text-base font-bold text-foreground">Specimen Collection &amp; Tube Rack</span>
                  <Badge variant="outline" className="text-xs font-semibold text-teal-600">Click to Inspect</Badge>
                </div>

                {/* Tubes Bar */}
                <div className="grid grid-cols-5 gap-2.5">
                  {VACUTAINER_TUBES.map((tube) => {
                    const isSelected = selectedTube.id === tube.id;
                    return (
                      <button
                        key={tube.id}
                        type="button"
                        onClick={() => setSelectedTube(tube)}
                        className={cn(
                          "p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-2.5 cursor-pointer",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                            : "border-border/70 hover:bg-muted/40"
                        )}
                      >
                        <div className={cn("w-7 h-14 rounded-t-md rounded-b-full border border-black/20 flex items-start justify-center pt-1.5 shadow-2xs", tube.capColor)}>
                          <div className="w-3.5 h-1.5 bg-white/40 rounded-full" />
                        </div>
                        <span className="text-xs font-bold truncate w-full">{tube.name.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Tube Specs */}
                <div className={cn("p-5 rounded-2xl border text-sm space-y-2.5 transition-all", selectedTube.accentBg, selectedTube.borderColor)}>
                  <div className="flex justify-between items-center font-bold text-sm sm:text-base">
                    <span className="text-foreground">{selectedTube.name}</span>
                    <span className={selectedTube.textColor}>{selectedTube.department}</span>
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    <strong>Additive:</strong> {selectedTube.additive} &bull; <strong>Inversions:</strong> {selectedTube.inversions}
                  </div>
                  <div className="text-foreground/90 text-xs sm:text-sm pt-1.5 border-t border-border/50 leading-relaxed">
                    {selectedTube.clinicalNote}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  <FlaskConical className="h-5 w-5" />
                  <span>Frontline Skills</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Lab Practical Guides &amp; Standard Operating Procedures (SOPs)
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Bridge the gap between textbook theory and real hospital pathology benchwork. Master step-by-step Standard Operating Procedures across Clinical Biochemistry, Hematology, Immunology, Blood Banking, and Microbiology.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 shrink-0 mt-0.5" />
                    <span>Complete test protocols for biochemical assays, cross-matching, blood grouping &amp; serology.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 shrink-0 mt-0.5" />
                    <span>Reagent preparation, chemical principles, staining techniques, and sample preservation.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 shrink-0 mt-0.5" />
                    <span>Diagnostic reference intervals, clinical interpretation, and Quality Control (QC) troubleshooting.</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link href="/student/practical">
                    <Button className="h-13 px-7 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base rounded-2xl flex items-center gap-2">
                      <span>Browse 100+ Practical SOPs</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 5: Course Completion Certificates                     */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 border-b border-border/80">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  <Award className="h-5 w-5" />
                  <span>Course Milestone</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Automated Course Completion Certificates
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Track your learning progress and celebrate your academic achievements. Whenever you complete courses, watch lectures, and finish practice quizzes on our platform, you receive an automatically generated completion certificate to document your study milestones.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 shrink-0 mt-0.5" />
                    <span>Automated generation upon completing course subjects and modules on our platform.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 shrink-0 mt-0.5" />
                    <span>Personalized with your name, completed course subject, and completion date.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 shrink-0 mt-0.5" />
                    <span>Downloadable high-resolution vector ISO A4 PDF ready to print or add to your study portfolio.</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link href="/student/certificates">
                    <Button className="h-13 px-7 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-2xl flex items-center gap-2">
                      <span>Explore Completion Certificates</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Graphic 5: Certificate Mockup Card */}
              <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-card to-card border border-purple-500/30 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-6 w-6 text-purple-600" />
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">Certificate of Completion</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-purple-600 font-bold">COURSE COMPLETED</Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-base sm:text-lg font-extrabold text-foreground">Clinical Hematology &amp; Hemostasis</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Issued by LabTutor Academy upon platform course completion</div>
                  </div>
                  <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Automated certificate for your personal study portfolio
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600">ISO A4 Vector PDF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 6: Real-Time Academic Updates                         */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 border-b border-border/80">
              {/* Graphic 6: Live Circular Feed */}
              <div className="lg:col-span-5 order-2 lg:order-1 p-7 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                  <span className="text-sm sm:text-base font-bold text-foreground">Live Circulars &amp; Notice Feed</span>
                  <Badge variant="outline" className="text-xs font-semibold text-rose-600">Real-Time</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600">SMFB Notice</span>
                    <p className="font-bold text-foreground text-sm sm:text-base">Final Professional Exam Routine Published</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">DGHS Circular</span>
                    <p className="font-bold text-foreground text-sm sm:text-base">Medical Technologist (Lab) 1,200+ Recruitment</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">University Timetable</span>
                    <p className="font-bold text-foreground text-sm sm:text-base">B.Sc. Allied Health Semester Final Schedule</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  <Bell className="h-5 w-5" />
                  <span>Stay Informed</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Real-Time Academic Updates &amp; Notice Circulars
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Never miss an examination routine, admit card deadline, or government recruitment notification. Our live academic feed monitors notices from the State Medical Faculty of Bangladesh (SMFB), DGHS, and university faculties.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 shrink-0 mt-0.5" />
                    <span>SMFB final professional exam routines, admit alerts, and center allocations.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 shrink-0 mt-0.5" />
                    <span>Directorate General of Health Services (DGHS) technologist recruitment notices.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 shrink-0 mt-0.5" />
                    <span>University syllabus updates, supplementary examination routines &amp; internship schedules.</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link href="/student/updates">
                    <Button className="h-13 px-7 bg-rose-600 hover:bg-rose-700 text-white font-bold text-base rounded-2xl flex items-center gap-2">
                      <span>Check Latest Academic Updates</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 7: Standard Resume Builder                            */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 border-b border-border/80">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  <FileText className="h-5 w-5" />
                  <span>Career Tool</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Standard Resume Builder (Built for Hospital Jobs)
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  General purpose CV builders fail to capture clinical diagnostic capabilities. Our specialized resume generator highlights your analyzer proficiencies (Sysmex, Cobas, Mindray), academic credentials, and clinical internship rotations in an ISO A4 1-page format.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 shrink-0 mt-0.5" />
                    <span>6 clinical color themes tailored for hospital pathology and diagnostic laboratories.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Pre-formatted diagnostic analyzer skills (5-part hematology, clinical chemistry, HPLC).</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Digital signature upload and instant 1-page ISO A4 vector PDF export.</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link href="/student/resume">
                    <Button className="h-13 px-7 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl flex items-center gap-2">
                      <span>Build Standard Resume (Free)</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Graphic 7: Analyzer Skill Tags */}
              <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                  <span className="text-sm sm:text-base font-bold text-foreground">Diagnostic Analyzer Proficiencies</span>
                  <Badge variant="outline" className="text-xs font-semibold text-indigo-600">CV Ready</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
                    <span className="font-bold text-foreground block text-sm sm:text-base">Sysmex XN-550</span>
                    <span className="text-xs text-muted-foreground">5-Part Hematology Flow</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
                    <span className="font-bold text-foreground block text-sm sm:text-base">Roche Cobas c311</span>
                    <span className="text-xs text-muted-foreground">Clinical Chemistry / ISE</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
                    <span className="font-bold text-foreground block text-sm sm:text-base">Mindray BC-6800</span>
                    <span className="text-xs text-muted-foreground">SF Cube &amp; Reticulocytes</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
                    <span className="font-bold text-foreground block text-sm sm:text-base">Bio-Rad D-10 HPLC</span>
                    <span className="text-xs text-muted-foreground">HbA1c &amp; Hemoglobinopathy</span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground text-center">
                  Pre-loaded analyzer proficiencies ready to add to your resume with one click.
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 8: Hospital & Diagnostic Jobs                          */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10">
              {/* Graphic 8: Hospital Vacancy Card */}
              <div className="lg:col-span-5 order-2 lg:order-1 p-7 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                  <span className="text-sm sm:text-base font-bold text-foreground">Verified Healthcare Vacancies</span>
                  <Badge variant="outline" className="text-xs font-semibold text-emerald-700">Bangladesh &amp; Abroad</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5">
                    <div className="flex justify-between font-bold text-foreground text-sm sm:text-base">
                      <span>Medical Technologist (Lab)</span>
                      <span className="text-emerald-700 dark:text-emerald-400">৳ 28,000 – 35,000</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Evercare Hospital &bull; Dhaka &bull; Full-time</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5">
                    <div className="flex justify-between font-bold text-foreground text-sm sm:text-base">
                      <span>Phlebotomist / Lab Assistant</span>
                      <span className="text-emerald-700 dark:text-emerald-400">৳ 20,000 – 25,000</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Popular Diagnostic Center &bull; Dhanmondi &bull; Morning Shift</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  <Briefcase className="h-5 w-5" />
                  <span>Career Launch</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Hospital &amp; Diagnostic Job Offers (Bangladesh &amp; Abroad)
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Connect directly with verified laboratory openings across private diagnostic chains, specialized hospitals, and public health projects. We also provide licensing roadmaps for overseas healthcare careers in the Gulf region.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Direct vacancies with transparent salary ranges, shift timings &amp; requirements.</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Verified openings in top hospitals (Evercare, Square, United, Popular, Ibn Sina).</span>
                  </div>
                  <div className="flex items-start gap-3 text-base sm:text-lg text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Guidance for international licensing examinations (Saudi Prometric, UAE MOH/DHA).</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link href="/student/jobs">
                    <Button className="h-13 px-7 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base rounded-2xl flex items-center gap-2">
                      <span>Browse Laboratory Job Offers</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. PRE-FOOTER HERO SECTION WITH PROPER CALL TO ACTION             */}
        {/* ================================================================= */}
        <section className="relative overflow-hidden w-full bg-gradient-to-b from-primary/10 via-background to-background py-14 sm:py-20">
          {/* Subtle background dot matrix & glowing ambiance */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none"
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative space-y-8">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-5 sm:px-6 py-2.5 text-sm sm:text-base font-bold text-primary shadow-xs">
              <Sparkles className="h-5 w-5 shrink-0" />
              <span>100% Free Core Access for Medical Laboratory Students</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.18] max-w-4xl mx-auto">
              Ready to Excel in Your Exams and Launch Your Career?
            </h2>

            <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join thousands of Diploma and B.Sc. students across Bangladesh mastering laboratory diagnostics, acing board examinations, and building their clinical careers.
            </p>

            <div className="pt-2 flex items-center justify-center">
              <Button
                size="lg"
                onClick={() => openAuthModal("REGISTER")}
                className="w-full sm:w-auto h-14 sm:h-16 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg rounded-2xl shadow-lg shadow-primary/25 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Create your account</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm sm:text-base text-muted-foreground border-t border-border/60 max-w-4xl mx-auto">
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>100% Free Platform</span>
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>Designed for MLT Students</span>
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>Interactive and Fun Study</span>
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>Instant Access</span>
              </span>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
