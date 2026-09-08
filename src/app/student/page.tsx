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

  const currentRole: UserRole = profile.role || "STUDENT";
  const userFullName = profile.fullName || "Md. Ansarul Islam";

  const formattedYear = String(profile.academicYear).padStart(2, "0");
  const courseTitle =
    profile.program === "BSC"
      ? "B.Sc. in Health Technology (Laboratory)"
      : "Diploma in Medical Laboratory Technology";
  const programShortLabel = profile.program === "BSC" ? "B.Sc" : "Diploma";
  const ordinalYear =
    profile.academicYear === "1"
      ? "1st"
      : profile.academicYear === "2"
      ? "2nd"
      : profile.academicYear === "3"
      ? "3rd"
      : profile.academicYear === "4"
      ? "4th"
      : `${profile.academicYear}th`;

  // Student metrics
  const totalSubjects = activeSubjects.length;
  const avgProgress =
    totalSubjects > 0
      ? Math.round(
          activeSubjects.reduce((acc, curr) => acc + curr.progress, 0) /
            totalSubjects
        )
      : 0;

  const totalLessons = activeSubjects.reduce((acc, curr) => acc + curr.lessons, 0);
  const completedLessons = Math.round((avgProgress / 100) * totalLessons);

  // System statistics for Super Admin & Admin
  const superAdminCount = users.filter((u) => u.role === "SUPER_ADMIN").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const mentorCount = users.filter((u) => u.role === "MENTOR").length;
  const studentCount = users.filter((u) => u.role === "STUDENT").length;
  const pendingCertificates = certificates.filter((c) => c.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner - Differentiated per role */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          {currentRole === "SUPER_ADMIN" ? (
            <>
              <div className="flex items-center space-x-2">
                <Badge variant="filled" className="text-[10px] font-semibold uppercase tracking-wider">
                  Super Admin
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {userFullName}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                Real-time platform governance, multi-role analytics, user activity audit and system health.
              </p>
            </>
          ) : currentRole === "ADMIN" ? (
            <>
              <div className="flex items-center space-x-2">
                <Badge variant="blue" className="text-[10px] font-semibold uppercase tracking-wider">
                  Admin
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {userFullName}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                Institutional academic oversight, curriculum coverage, practical evaluations and student progress.
              </p>
            </>
          ) : currentRole === "MENTOR" ? (
            <>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider border-emerald-500 text-emerald-700 dark:text-emerald-300">
                  Clinical Mentor
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {userFullName}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                Clinical trainee mentorship, bench practical guidance, viva voce defense preparation and Q&A support.
              </p>
            </>
          ) : (
            // Student View
            <>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {userFullName}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                Real-time study progress, syllabus coverage, competency tracking and more.
              </p>

              {/* Below the line: Strictly Course and Year ONLY. (NO Session, NO Semester) */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-1 text-xs">
                <span className="inline-flex items-center text-foreground font-normal">
                  <span className="font-medium text-muted-foreground mr-1">Course:</span>
                  <span className="font-medium text-primary">{courseTitle}</span>
                </span>
                <span className="text-muted-foreground/30 select-none">•</span>
                <span className="inline-flex items-center text-foreground font-normal">
                  <span className="font-medium text-muted-foreground mr-1">Year:</span>
                  <span className="font-medium text-foreground">{formattedYear}</span>
                </span>
                <Link href="/student/profile">
                  <Badge
                    variant="filled"
                    className="ml-1 text-[9.5px] px-2 py-0.5 cursor-pointer font-medium hover:opacity-90 transition-opacity"
                  >
                    Change
                  </Badge>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <ThemeToggle />
          <NotificationBell />
          <Link href="/student/profile">
            <Button
              size="sm"
              variant="outline"
              className="text-xs rounded-xl font-medium min-h-[38px] border-border/80 hover:border-primary/50 text-foreground"
            >
              <User className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Edit Profile
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
            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Users
                </span>
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{users.length}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{studentCount} Students</span> •
                  <span>{mentorCount} Mentors</span> •
                  <span>{adminCount} Admins</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Curriculum Subjects
                </span>
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{coursesCatalog.length}</div>
                <div className="text-[11px] text-muted-foreground">
                  Diploma 4-Year & B.Sc. 4-Year Structured
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Question Bank Papers
                </span>
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <FileQuestion className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{questions.length}</div>
                <div className="text-[11px] text-muted-foreground">
                  {questions.reduce((acc, q) => acc + q.downloadCount, 0)} Total Student Downloads
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  System Health
                </span>
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">99.9%</div>
                <div className="text-[11px] text-muted-foreground">
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
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      User Management
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Permissions, roles & verification</p>
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
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Module Management
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Toggle visibility & arrange</p>
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
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      String Management
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Edit UI texts & banners</p>
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
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Real-time Data Log
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Audit trail & user actions</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Real-Time Live Activity Stream */}
          <Card className="rounded-2xl border-border/80 overflow-hidden shadow-xs">
            <CardHeader className="p-5 pb-3 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Real-Time Audit Activity Feed
                </CardTitle>
                <CardDescription className="text-xs">
                  Live user actions, curriculum edits, and governance updates across the application
                </CardDescription>
              </div>
              <Link href="/student/admin/logs">
                <Button size="sm" variant="outline" className="text-xs h-8 rounded-xl font-medium">
                  View Full Logs →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-border/60">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-foreground">{log.performedBy}</span>
                      <span className="text-muted-foreground ml-1.5 font-normal">({log.action})</span>
                      <p className="text-[11px] text-muted-foreground truncate">{log.details}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="outline" className="text-[10px] font-mono">
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
            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Pending Certificates
              </span>
              <div className="text-2xl font-bold text-foreground">{pendingCertificates}</div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {pendingCertificates > 0 ? "Awaiting your faculty verification" : "All requests up-to-date"}
              </p>
              {pendingCertificates > 0 && (
                <Link href="/student/certificates" className="inline-block mt-2">
                  <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground rounded-lg px-2.5">
                    Review Now
                  </Button>
                </Link>
              )}
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Total Enrolled Students
              </span>
              <div className="text-2xl font-bold text-foreground">{studentCount}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Across 4 Diploma & B.Sc. Years</p>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Practical SOP Protocols
              </span>
              <div className="text-2xl font-bold text-foreground">{practicals.length}</div>
              <p className="text-[11px] text-muted-foreground mt-1">All Clinical Laboratory Disciplines</p>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Active Job Postings
              </span>
              <div className="text-2xl font-bold text-foreground">{jobs.filter((j) => j.isActive).length}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Hospital & Diagnostic Opportunities</p>
            </Card>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/student/curriculum/manage">
              <Button className="bg-primary text-primary-foreground text-xs rounded-xl min-h-[38px]">
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Author Curriculum Subject
              </Button>
            </Link>
            <Link href="/student/certificates">
              <Button variant="outline" className="text-xs rounded-xl min-h-[38px]">
                <Award className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Certificate Registry
              </Button>
            </Link>
            <Link href="/student/updates">
              <Button variant="outline" className="text-xs rounded-xl min-h-[38px]">
                <Bell className="h-3.5 w-3.5 mr-1.5 text-primary" />
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
            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Question Bank Papers
              </span>
              <div className="text-2xl font-bold text-foreground">{questions.length}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Official faculty papers with solutions</p>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Practical SOP Guides
              </span>
              <div className="text-2xl font-bold text-foreground">{practicals.length}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Step-by-step diagnostic procedures</p>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Clinical Inquiries
              </span>
              <div className="text-2xl font-bold text-foreground">14</div>
              <p className="text-[11px] text-muted-foreground mt-1">Study Center & Practical Q&A queries</p>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Active Job Offers
              </span>
              <div className="text-2xl font-bold text-foreground">{jobs.length}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Shared with graduating trainees</p>
            </Card>
          </div>

          {/* Quick Mentor Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/student/questions">
              <Button className="bg-primary text-primary-foreground text-xs rounded-xl min-h-[38px]">
                <FileQuestion className="h-3.5 w-3.5 mr-1.5" />
                Upload Question Paper
              </Button>
            </Link>
            <Link href="/student/practical">
              <Button variant="outline" className="text-xs rounded-xl min-h-[38px]">
                <FlaskConical className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Add Practical SOP
              </Button>
            </Link>
            <Link href="/student/study-center">
              <Button variant="outline" className="text-xs rounded-xl min-h-[38px]">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-primary" />
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
            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Syllabus Progress
                </span>
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{avgProgress}%</div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-500 rounded-full"
                    style={{ width: `${avgProgress}%` }}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Lessons Covered
                </span>
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {completedLessons} / {totalLessons}
                </div>
                <p className="text-[11px] text-muted-foreground">Topics completed this academic year</p>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Question Bank
                </span>
                <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FileQuestion className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{questions.length}</div>
                <p className="text-[11px] text-muted-foreground">Solved board papers available</p>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80 bg-card shadow-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Practical SOPs
                </span>
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <FlaskConical className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{practicals.length}</div>
                <p className="text-[11px] text-muted-foreground">Bench training modules</p>
              </div>
            </Card>
          </div>

          {/* Active Subjects Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-foreground">
                    {activeSubjects.length} {activeSubjects.length === 1 ? "subject" : "subjects"}
                  </span>
                  <span className="text-muted-foreground font-normal">in your</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold text-xs sm:text-sm">
                    {programShortLabel} • {ordinalYear} Year
                  </span>
                </h2>
              </div>
              <Link href="/student/curriculum" className="text-xs text-primary font-semibold hover:underline shrink-0 flex items-center gap-1">
                View Full Curriculum →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {activeSubjects.map((subject) => (
                <Card
                  key={subject.code}
                  className="rounded-2xl border-border/80 p-4 hover:border-primary/50 transition-all hover:shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-muted">
                        {subject.code}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {subject.progress}%
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 font-normal leading-relaxed">
                      {subject.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {subject.units} Modules • {subject.lessons} Lessons
                    </span>
                    <Link href={`/student/study-center?subject=${subject.code}`}>
                      <Button size="sm" className="h-7 text-xs px-2.5 bg-primary text-primary-foreground rounded-lg">
                        Study →
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
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Announcements & Notices
            </CardTitle>
            <CardDescription className="text-xs">
              Official faculty notifications, examination routines, and academic circulars
            </CardDescription>
          </div>
          <Link href="/student/updates">
            <Button size="sm" variant="outline" className="text-xs h-8 rounded-xl font-medium">
              All Updates →
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {updates.slice(0, 3).map((notice) => (
            <div
              key={notice.id}
              className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={notice.urgency === "CRITICAL" ? "destructive" : notice.urgency === "HIGH" ? "blue" : "outline"}
                    className="text-[9.5px] py-0 px-1.5"
                  >
                    {notice.category.replace("_", " ")}
                  </Badge>
                  <span className="text-muted-foreground text-[11px] font-mono">{notice.createdAt}</span>
                </div>
                <h4 className="font-semibold text-foreground text-xs sm:text-sm">{notice.title}</h4>
                <p className="text-muted-foreground text-xs line-clamp-1 font-normal">{notice.content.replace(/<[^>]*>/g, "")}</p>
              </div>

              {notice.attachmentUrl && (
                <a href={notice.attachmentUrl} download className="shrink-0 self-end sm:self-center">
                  <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg px-2 text-primary font-medium">
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
