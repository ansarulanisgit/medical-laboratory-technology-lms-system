"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  TrendingUp,
  Award,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Calendar,
  Layers,
  GraduationCap,
  Target,
  AlertCircle,
  User,
  FlaskConical,
  Microscope,
  Users,
  ShieldCheck,
  Building,
  ScrollText,
  FileQuestion,
  FileText,
  Briefcase,
  Bell,
  Activity,
  Settings,
  Type,
  Check,
  ExternalLink,
  Sparkles,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { useUserManagement } from "@/lib/curriculum/user-management-context";
import { useNotification } from "@/components/ui/notification-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { RoleSwitcherModal } from "@/components/layout/role-switcher-modal";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { useQuestionBank } from "@/lib/stores/question-bank-store";
import { usePracticals } from "@/lib/stores/practical-lab-store";
import { useCertificates } from "@/lib/stores/certificate-store";
import { useJobs } from "@/lib/stores/jobs-store";
import { useUpdates } from "@/lib/stores/updates-store";
import { UserRole } from "@/types/roles";

export default function StudentDashboardPage() {
  const { profile, activeSubjects, coursesCatalog } = useAcademicProfile();
  const { users } = useUserManagement();
  const { logs } = useActivityLog();
  const { questions } = useQuestionBank();
  const { practicals } = usePracticals();
  const { certificates } = useCertificates();
  const { jobs } = useJobs();
  const { updates } = useUpdates();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentRole: UserRole = mounted ? (profile?.role || "STUDENT") : "STUDENT";
  const userFullName = mounted ? (profile?.fullName || "Md. Ansarul Islam") : "Md. Ansarul Islam";
  const isSuperOrAdmin = currentRole === "SUPER_ADMIN" || currentRole === "ADMIN";

  const safeYear = String(mounted ? (profile?.academicYear || "1") : "2");
  const program = mounted ? (profile?.program || "DIPLOMA") : "DIPLOMA";
  const formattedYear = safeYear.padStart(2, "0");
  const courseTitle =
    program === "BSC"
      ? "B.Sc. in Health Technology (Laboratory)"
      : "Diploma in Medical Laboratory Technology";
  const programShortLabel = program === "BSC" ? "B.Sc" : "Diploma";
  const ordinalYear =
    safeYear === "1"
      ? "1st"
      : safeYear === "2"
      ? "2nd"
      : safeYear === "3"
      ? "3rd"
      : safeYear === "4"
      ? "4th"
      : `${safeYear}th`;

  // Student metrics
  const safeSubjects = activeSubjects || [];
  const totalSubjects = safeSubjects.length;
  const avgProgress =
    totalSubjects > 0
      ? Math.round(
          safeSubjects.reduce((acc, curr) => acc + (curr?.progress || 0), 0) /
            totalSubjects
        )
      : 0;

  const totalLessons = safeSubjects.reduce((acc, curr) => acc + (curr?.lessons || 0), 0);
  const completedLessons = Math.round((avgProgress / 100) * totalLessons);

  // System statistics for Super Admin & Admin
  const safeUsers = users || [];
  const safeCertificates = certificates || [];
  const safeQuestions = questions || [];
  const safePracticals = practicals || [];
  const safeJobs = jobs || [];
  const safeLogs = logs || [];
  const safeUpdates = updates || [];
  const safeCoursesCatalog = coursesCatalog || [];

  const superAdminCount = safeUsers.filter((u) => u?.role === "SUPER_ADMIN").length;
  const adminCount = safeUsers.filter((u) => u?.role === "ADMIN").length;
  const mentorCount = safeUsers.filter((u) => u?.role === "MENTOR").length;
  const studentCount = safeUsers.filter((u) => u?.role === "STUDENT").length;
  const pendingCertificates = safeCertificates.filter((c) => c?.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner - Differentiated per role */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          {currentRole === "SUPER_ADMIN" ? (
            <>
              <div className="flex items-center space-x-2">
                <Badge variant="filled" className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5">
                  Super Admin
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {userFullName}!
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-normal">
                Real-time platform governance, multi-role analytics, user activity audit and system health.
              </p>
            </>
          ) : currentRole === "ADMIN" ? (
            <>
              <div className="flex items-center space-x-2">
                <Badge variant="blue" className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5">
                  Admin
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {userFullName}!
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-normal">
                Institutional academic oversight, curriculum coverage, practical evaluations and student progress.
              </p>
            </>
          ) : currentRole === "MENTOR" ? (
            <>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 border-emerald-500 text-emerald-700 dark:text-emerald-300">
                  Clinical Mentor
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {userFullName}!
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-normal">
                Clinical trainee mentorship, bench practical guidance, viva voce defense preparation and Q&A support.
              </p>
            </>
          ) : (
            // Student View
            <>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {userFullName}!
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-normal">
                Real-time study progress, syllabus coverage, competency tracking and more.
              </p>

              {/* Below the line: Strictly Course and Year ONLY. (NO Session, NO Semester) */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-1.5 text-xs sm:text-sm">
                <span className="inline-flex items-center text-foreground font-normal">
                  <span className="font-semibold text-muted-foreground mr-1">Course:</span>
                  <span className="font-semibold text-primary">{courseTitle}</span>
                </span>
                <span className="text-muted-foreground/40 select-none">•</span>
                <span className="inline-flex items-center text-foreground font-normal">
                  <span className="font-semibold text-muted-foreground mr-1">Year:</span>
                  <span className="font-semibold text-foreground">{formattedYear}</span>
                </span>
                <Link href="/student/profile">
                  <Badge
                    variant="filled"
                    className="ml-1 text-xs px-2.5 py-0.5 cursor-pointer font-medium hover:opacity-90 transition-opacity"
                  >
                    Change
                  </Badge>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Hero Actions Cluster: Role Switcher, Real-time Log, Theme Toggle, Notification Bell, Edit Profile */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center flex-wrap">
          <RoleSwitcherModal />

          {/* Real-time System Audit Logs Icon (Super Admin and Admin exclusive) */}
          {isSuperOrAdmin && (
            <Link
              href="/student/admin/logs"
              title="Real-time Activity & Audit Logs"
              aria-label="Real-time Activity & Audit Logs"
            >
              <button
                type="button"
                className="h-9 w-9 rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted/60 transition-all flex items-center justify-center shadow-2xs group shrink-0 cursor-pointer"
              >
                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform" />
              </button>
            </Link>
          )}

          <ThemeToggle />

          <NotificationBell />

          <Link href="/student/profile">
            <Button
              size="sm"
              variant="outline"
              className="h-9 px-3 text-xs rounded-xl font-medium border-border/80 hover:border-primary/50 text-foreground gap-1.5 cursor-pointer shadow-2xs"
            >
              <User className="h-4 w-4 text-primary" />
              <span>Edit Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          2. SUPER ADMIN DASHBOARD - SYSTEM ANALYTICS & INFOGRAPHICS
         ========================================================================= */}
      {currentRole === "SUPER_ADMIN" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Infographic KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Total Users
                </span>
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{safeUsers.length}</div>
                <div className="text-[12.5px] sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{studentCount} Students</span> •
                  <span>{mentorCount} Mentors</span> •
                  <span>{adminCount} Admins</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Curriculum Subjects
                </span>
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{safeCoursesCatalog.length}</div>
                <div className="text-[12.5px] sm:text-sm font-medium text-muted-foreground pt-0.5">
                  Diploma 4-Year & B.Sc. 4-Year Structured
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Question Bank Papers
                </span>
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileQuestion className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{safeQuestions.length}</div>
                <div className="text-[12.5px] sm:text-sm font-medium text-muted-foreground pt-0.5">
                  {safeQuestions.reduce((acc, q) => acc + (q?.downloadCount || 0), 0)} Total Student Downloads
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  System Health
                </span>
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">99.9%</div>
                <div className="text-[12.5px] sm:text-sm font-medium text-muted-foreground pt-0.5">
                  Zero critical incidents • All services active
                </div>
              </div>
            </Card>
          </div>

          {/* Super Admin Quick Governance Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/student/users" className="block">
              <Card className="p-4 rounded-2xl border-border/80 hover:border-primary/50 transition-all hover:shadow-xs group">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      User Management
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">Permissions, roles & verification</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/student/admin/modules" className="block">
              <Card className="p-4 rounded-2xl border-border/80 hover:border-primary/50 transition-all hover:shadow-xs group">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      Module Management
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">Toggle visibility & arrange</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/student/admin/strings" className="block">
              <Card className="p-4 rounded-2xl border-border/80 hover:border-primary/50 transition-all hover:shadow-xs group">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Type className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      String Management
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">Edit UI texts & banners</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/student/admin/logs" className="block">
              <Card className="p-4 rounded-2xl border-border/80 hover:border-primary/50 transition-all hover:shadow-xs group">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      Real-time Data Log
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">Audit trail & user actions</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Real-Time Live Activity Stream */}
          <Card className="rounded-2xl border-border/80 overflow-hidden shadow-xs">
            <CardHeader className="p-5 pb-3 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Platform Audit Stream
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Live, immutable event ledger tracking user registrations, role updates, and system events.
                </CardDescription>
              </div>
              <Link href="/student/admin/logs">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-8 text-primary">
                  View All &rarr;
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {safeLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">{log.action}</span>
                      <p className="text-sm md:text-base text-muted-foreground truncate">{log.details}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="outline" className="text-xs font-mono">
                      {log.module}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          3. ADMIN DASHBOARD - ACADEMIC OVERSIGHT & INSTITUTIONAL ANALYTICS
         ========================================================================= */}
      {currentRole === "ADMIN" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Admin KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                Pending Certificates
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{pendingCertificates}</div>
              <p className="text-sm md:text-base font-medium text-muted-foreground mt-1">
                {pendingCertificates > 0 ? "Awaiting your faculty verification" : "All requests up-to-date"}
              </p>
              {pendingCertificates > 0 && (
                <Link href="/student/certificates" className="inline-block mt-2">
                  <Button size="sm" className="h-9 text-sm bg-primary text-primary-foreground rounded-xl px-3.5 font-semibold">
                    Review Now
                  </Button>
                </Link>
              )}
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                Total Enrolled Students
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{studentCount}</div>
              <p className="text-[14px] font-medium text-muted-foreground mt-1">Across 4 Diploma & B.Sc. Years</p>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                Practical SOP Protocols
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{safePracticals.length}</div>
              <p className="text-[14px] font-medium text-muted-foreground mt-1">All Clinical Laboratory Disciplines</p>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                Active Job Postings
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{safeJobs.filter((j) => j?.isActive).length}</div>
              <p className="text-[14px] font-medium text-muted-foreground mt-1">Hospital & Diagnostic Opportunities</p>
            </Card>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/student/curriculum/manage">
              <Button className="bg-primary text-primary-foreground text-xs sm:text-sm rounded-xl min-h-[40px]">
                <BookOpen className="h-4 w-4 mr-1.5" />
                Author Curriculum Subject
              </Button>
            </Link>
            <Link href="/student/certificates">
              <Button variant="outline" className="text-xs sm:text-sm rounded-xl min-h-[40px]">
                <Award className="h-4 w-4 mr-1.5 text-primary" />
                Certificate Registry
              </Button>
            </Link>
            <Link href="/student/updates">
              <Button variant="outline" className="text-xs sm:text-sm rounded-xl min-h-[40px]">
                <Bell className="h-4 w-4 mr-1.5 text-primary" />
                Post Announcement
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. MENTOR DASHBOARD - TRAINEE COACHING & DIAGNOSTIC ANALYTICS
         ========================================================================= */}
      {currentRole === "MENTOR" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Mentor KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                Question Bank Papers
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{safeQuestions.length}</div>
              <p className="text-[14px] font-medium text-muted-foreground mt-1">Official faculty papers with solutions</p>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                Practical SOP Guides
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{safePracticals.length}</div>
              <p className="text-[14px] font-medium text-muted-foreground mt-1">Step-by-step diagnostic procedures</p>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                Clinical Inquiries
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">14</div>
              <p className="text-[14px] font-medium text-muted-foreground mt-1">Study Center & Practical Q&A queries</p>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                Active Job Offers
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{safeJobs.length}</div>
              <p className="text-[14px] font-medium text-muted-foreground mt-1">Shared with graduating trainees</p>
            </Card>
          </div>

          {/* Quick Mentor Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/student/questions">
              <Button className="bg-primary text-primary-foreground text-xs sm:text-sm rounded-xl min-h-[40px]">
                <FileQuestion className="h-4 w-4 mr-1.5" />
                Upload Question Paper
              </Button>
            </Link>
            <Link href="/student/practical">
              <Button variant="outline" className="text-xs sm:text-sm rounded-xl min-h-[40px]">
                <FlaskConical className="h-4 w-4 mr-1.5 text-primary" />
                Add Practical SOP
              </Button>
            </Link>
            <Link href="/student/study-center">
              <Button variant="outline" className="text-xs sm:text-sm rounded-xl min-h-[40px]">
                <MessageSquare className="h-4 w-4 mr-1.5 text-primary" />
                Answer Trainee Q&A
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. STUDENT DASHBOARD - PERSONALIZED LEARNING & REAL-TIME DATA UPDATES
         ========================================================================= */}
      {currentRole === "STUDENT" && (
        <div className="space-y-6 animate-in fade-in">
          {/* 4 Core Progress & Analytics KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Syllabus Progress
                </span>
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{avgProgress}%</div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className="bg-primary h-full transition-all duration-500 rounded-full"
                    style={{ width: `${avgProgress}%` }}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Lessons Covered
                </span>
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {completedLessons} / {totalLessons}
                </div>
                <p className="text-[14px] font-medium text-muted-foreground leading-snug pt-0.5">
                  Topics completed this academic year
                </p>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Question Bank
                </span>
                <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <FileQuestion className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{safeQuestions.length}</div>
                <p className="text-[14px] font-medium text-muted-foreground leading-snug pt-0.5">
                  Solved board papers available
                </p>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[13px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Practical SOPs
                </span>
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FlaskConical className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{safePracticals.length}</div>
                <p className="text-[14px] font-medium text-muted-foreground leading-snug pt-0.5">
                  Bench training modules
                </p>
              </div>
            </Card>
          </div>

          {/* Active Subjects Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-foreground">
                    {safeSubjects.length} {safeSubjects.length === 1 ? "subject" : "subjects"}
                  </span>
                  <span className="text-muted-foreground font-normal">in your</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold text-xs sm:text-sm">
                    {programShortLabel} • {ordinalYear} Year
                  </span>
                </h2>
              </div>
              <Link href="/student/curriculum" className="text-sm sm:text-base text-primary font-bold hover:underline shrink-0 flex items-center gap-1">
                View Full Curriculum →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {safeSubjects.map((subject) => (
                <Card
                  key={subject.code}
                  className="rounded-2xl border-border/80 p-4 sm:p-5 hover:border-primary/50 transition-all hover:shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-primary px-3 py-1 rounded-lg bg-muted">
                        {subject.code}
                      </span>
                      <span className="text-sm sm:text-base text-muted-foreground font-bold">
                        {subject.progress}%
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                      {subject.name}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground line-clamp-2 font-normal leading-relaxed">
                      {subject.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-border flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap text-[12.5px] sm:text-sm">
                    <span className="text-muted-foreground font-medium">
                      {subject.units} Modules • {subject.lessons} Lessons
                    </span>
                    <Link href={`/student/study-center?subject=${subject.code}`}>
                      <Button size="sm" className="h-9 text-sm px-3.5 bg-primary text-primary-foreground rounded-xl font-semibold inline-flex items-center gap-1.5 shrink-0 shadow-xs hover:opacity-95 transition-all">
                        <span>Continue Study</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. SHARED SECTION: ANNOUNCEMENTS & NOTICES (SYNCHRONIZED WITH UPDATES STORE)
         ========================================================================= */}
      <Card className="rounded-2xl border-border/80 overflow-hidden shadow-xs">
        <CardHeader className="p-5 pb-3 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Announcements & Notices
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Official faculty notifications, examination routines, and academic circulars
            </CardDescription>
          </div>
          <Link href="/student/updates">
            <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8 rounded-xl font-medium">
              All Updates →
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {safeUpdates.slice(0, 3).map((notice) => (
            <div
              key={notice.id}
              className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={notice.urgency === "CRITICAL" ? "destructive" : notice.urgency === "HIGH" ? "blue" : "outline"}
                    className="text-xs py-0.5 px-2 font-medium"
                  >
                    {notice.category.replace("_", " ")}
                  </Badge>
                  <span className="text-muted-foreground text-xs font-mono">{notice.createdAt}</span>
                </div>
                <h4 className="font-semibold text-foreground text-sm sm:text-base">{notice.title}</h4>
                <p className="text-muted-foreground text-sm md:text-base line-clamp-1 font-normal">{notice.content.replace(/<[^>]*>/g, "")}</p>
              </div>

              {notice.attachmentUrl && (
                <a href={notice.attachmentUrl} download className="shrink-0 self-end sm:self-center">
                  <Button size="sm" variant="outline" className="h-8 text-xs sm:text-sm rounded-lg px-2.5 text-primary font-medium">
                    Download PDF
                  </Button>
                </a>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
