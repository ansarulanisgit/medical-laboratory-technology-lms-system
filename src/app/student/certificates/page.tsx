"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Award,
  ShieldCheck,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Palette,
  Settings2,
  Plus,
  Printer,
  Eye,
  Check,
  X,
  UserCheck,
  Search,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";
import { useCertificates, CertificateRecord, CertificateTemplateConfig } from "@/lib/stores/certificate-store";
import { useAcademic, ProgramLevel } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { useNotification } from "@/components/ui/notification-context";
import { useStudentStudyProgress } from "@/lib/curriculum/student-study-progress-store";

export default function StudentCertificatesPage() {
  const { certificates, templateConfig, applyForCertificate, reviewCertificate, updateTemplateConfig } = useCertificates();
  const { role, userProfile } = useAcademic();
  const { logActivity } = useActivityLog();
  const { showNotification } = useNotification();

  const isSuperOrAdmin = role === "SUPER_ADMIN" || role === "ADMIN";
  const isMentor = role === "MENTOR";

  // Tab states
  const [activeTab, setActiveTab] = React.useState<"MY_CERTS" | "APPLY" | "REVIEW" | "CUSTOMIZE">("MY_CERTS");
  const [selectedCertForPreview, setSelectedCertForPreview] = React.useState<CertificateRecord | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = React.useState("");

  // Student Enrollment State for Application
  const currentStudentId = (userProfile as any)?.id || userProfile?.idNumber || "usr-005";
  const currentProgram = (userProfile?.program as ProgramLevel) || "DIPLOMA";
  const currentYear = userProfile?.academicYear || "1";

  // Application Form State
  const [applyForm, setApplyForm] = React.useState({
    program: currentProgram,
    year: currentYear,
    title: `${currentProgram === "BSC" ? "B.Sc." : "Diploma"} Competency: Diagnostic Clinical Benchmark & SOP Verification`,
    institution: userProfile?.institution || "Dhaka Institute of Health Technology (DIHT)",
    grade: "Pass with Distinction (91.5%)",
  });
  const [applySuccess, setApplySuccess] = React.useState(false);

  // Watermarked Candidate Preview Modal State (before submission)
  const [candidateWatermarkPreview, setCandidateWatermarkPreview] = React.useState<{
    studentName: string;
    studentId: string;
    institution: string;
    program: ProgramLevel;
    year: string;
    title: string;
    grade: string;
  } | null>(null);

  // Real-time Study Progress & Eligibility Audit
  const { eligibility, markAllCompleted } = useStudentStudyProgress(
    currentStudentId,
    applyForm.program,
    applyForm.year
  );

  // Auto-sync calculated grade and default title when eligibility changes
  React.useEffect(() => {
    if (eligibility.recommendedGrade) {
      setApplyForm((prev) => ({
        ...prev,
        grade: eligibility.recommendedGrade,
        title: `${prev.program === "BSC" ? "B.Sc." : "Diploma"} Year ${prev.year} Competency: Diagnostic Clinical Benchmark & SOP Verification`,
      }));
    }
  }, [eligibility.recommendedGrade, applyForm.program, applyForm.year]);

  // Template Customizer State
  const [templateForm, setTemplateForm] = React.useState<CertificateTemplateConfig>(templateConfig);
  const [templateSavedMsg, setTemplateSavedMsg] = React.useState(false);

  React.useEffect(() => {
    setTemplateForm(templateConfig);
  }, [templateConfig]);

  // If Admin/Super Admin, default to Review if there are pending items, else MY_CERTS
  React.useEffect(() => {
    if (isSuperOrAdmin) {
      const hasPending = certificates.some((c) => c.status === "PENDING");
      if (hasPending) setActiveTab("REVIEW");
    }
  }, [isSuperOrAdmin]);

  // Listen for Escape key to close modals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCertForPreview(null);
        setCandidateWatermarkPreview(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for live certificate reviews
  React.useEffect(() => {
    const handleReviewed = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.cert) {
        const cert = custom.detail.cert as CertificateRecord;
        if (cert.studentId === currentStudentId || cert.studentName === userProfile?.name) {
          showNotification({
            type: cert.status === "APPROVED" ? "success" : "error",
            title: cert.status === "APPROVED" ? "Certificate Conferred!" : "Certificate Request Declined",
            message: cert.status === "APPROVED"
              ? `Your official credential for "${cert.title}" has been approved! You can now download it.`
              : `Your request was declined: ${custom.detail.feedback || "Requirements not met."}`,
            autoRefresh: true,
          });
        }
      }
    };
    window.addEventListener("labtutor_certificate_reviewed", handleReviewed);
    return () => window.removeEventListener("labtutor_certificate_reviewed", handleReviewed);
  }, [currentStudentId, userProfile?.name, showNotification]);

  const studentCerts = React.useMemo(() => {
    if (isSuperOrAdmin || isMentor) {
      return certificates.filter(
        (c) =>
          !searchQuery.trim() ||
          c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Students see their own certificates or matching student name
    return certificates.filter(
      (c) =>
        c.studentId === currentStudentId ||
        c.studentName.toLowerCase() === (userProfile?.name || "").toLowerCase() ||
        c.status === "APPROVED"
    );
  }, [certificates, isSuperOrAdmin, isMentor, searchQuery, currentStudentId, userProfile?.name]);

  const pendingCerts = React.useMemo(() => {
    return certificates.filter((c) => c.status === "PENDING");
  }, [certificates]);

  // Open candidate watermark preview before submitting
  const handleOpenWatermarkPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibility.isEligible) {
      showNotification({
        type: "warning",
        title: "Course Incomplete",
        message: "You must complete all subjects and practical tasks before previewing and submitting.",
      });
      return;
    }

    setCandidateWatermarkPreview({
      studentName: userProfile?.name || "Md. Ansarul Islam",
      studentId: currentStudentId,
      institution: applyForm.institution,
      program: applyForm.program,
      year: applyForm.year,
      title: applyForm.title,
      grade: applyForm.grade,
    });
  };

  // Submit from candidate preview
  const handleConfirmSubmitApplication = () => {
    if (!candidateWatermarkPreview) return;

    const result = applyForCertificate({
      studentId: candidateWatermarkPreview.studentId,
      studentName: candidateWatermarkPreview.studentName,
      institution: candidateWatermarkPreview.institution,
      program: candidateWatermarkPreview.program,
      year: candidateWatermarkPreview.year,
      title: candidateWatermarkPreview.title,
      grade: candidateWatermarkPreview.grade,
    });

    if (result.success) {
      logActivity({
        action: "CREATE",
        module: "Certificates",
        details: `Submitted certificate application for "${candidateWatermarkPreview.title}"`,
      });

      setCandidateWatermarkPreview(null);
      setApplySuccess(true);
      showNotification({
        type: "success",
        title: "Application Submitted",
        message: "Your application has been queued for Super Admin review. You will receive a real-time notification upon decision.",
        autoRefresh: true,
      });

      setTimeout(() => {
        setApplySuccess(false);
        setActiveTab("MY_CERTS");
      }, 1200);
    }
  };

  const handleReviewAction = (certId: string, decision: "APPROVED" | "REJECTED") => {
    const feedback = prompt(
      decision === "APPROVED"
        ? "Enter commendation / remarks (optional):"
        : "Enter reason / feedback for declining application *:"
    );
    if (decision === "REJECTED" && !feedback?.trim()) {
      alert("A specific reason is required when declining a student certificate request.");
      return;
    }

    reviewCertificate(
      certId,
      decision,
      userProfile?.name || (role === "SUPER_ADMIN" ? "Super Admin" : "Admin"),
      role,
      feedback || undefined
    );

    logActivity({
      action: "UPDATE",
      module: "Certificates",
      details: `${decision === "APPROVED" ? "Approved" : "Declined"} certificate request for ${certId}`,
    });

    showNotification({
      type: decision === "APPROVED" ? "success" : "info",
      title: decision === "APPROVED" ? "Certificate Conferred" : "Application Declined",
      message: decision === "APPROVED"
        ? "Official credential issued. Student notified to download."
        : "Decline notification with feedback dispatched to student.",
    });
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    updateTemplateConfig(templateForm);
    logActivity({
      action: "UPDATE",
      module: "Certificates",
      details: "Updated official institutional certificate template styling & signatories",
    });
    setTemplateSavedMsg(true);
    setTimeout(() => setTemplateSavedMsg(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Certificates & Credentials
            </h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5">
              Cryptographic Registry
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Verifiable competency certificates, curriculum task audits, and accreditation registry management.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {role === "STUDENT" && (
            <Button
              onClick={() => setActiveTab("APPLY")}
              className="gap-2 shadow-sm bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl h-9 sm:h-10 px-4"
            >
              <Award className="h-4 w-4" />
              <span>Apply for Certificate</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-1 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab("MY_CERTS")}
          className={`px-4 py-2.5 font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "MY_CERTS"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>{isSuperOrAdmin ? "All Credentials Registry" : "My Credentials"}</span>
          <Badge variant="secondary" className="text-xs ml-1">
            {studentCerts.length}
          </Badge>
        </button>

        {role === "STUDENT" && (
          <button
            onClick={() => setActiveTab("APPLY")}
            className={`px-4 py-2.5 font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "APPLY"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Apply for Year Certificate</span>
            {eligibility.isEligible ? (
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Eligible to apply" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-amber-500" title="Tasks pending" />
            )}
          </button>
        )}

        {isSuperOrAdmin && (
          <>
            <button
              onClick={() => setActiveTab("REVIEW")}
              className={`px-4 py-2.5 font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === "REVIEW"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Review Applications</span>
              {pendingCerts.length > 0 && (
                <Badge className="bg-amber-600 text-white text-xs ml-1 px-2 py-0.5 animate-pulse">
                  {pendingCerts.length} Pending
                </Badge>
              )}
            </button>

            <button
              onClick={() => setActiveTab("CUSTOMIZE")}
              className={`px-4 py-2.5 font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === "CUSTOMIZE"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>Template & Signatures</span>
            </button>
          </>
        )}
      </div>

      {/* TAB 1: MY CERTIFICATES / REGISTRY */}
      {activeTab === "MY_CERTS" && (
        <div className="space-y-4">
          {/* Search bar for Admin */}
          {isSuperOrAdmin && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidate name, cert code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs sm:text-sm h-10 rounded-xl"
                />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                Showing {studentCerts.length} credentials
              </span>
            </div>
          )}

          {studentCerts.length === 0 ? (
            <Card className="p-10 text-center space-y-3 rounded-2xl border-border">
              <Award className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <CardTitle className="text-base sm:text-lg">No Certificates Found</CardTitle>
              <CardDescription className="text-xs sm:text-sm max-w-sm mx-auto">
                {role === "STUDENT"
                  ? "You have not completed or applied for any year competency certifications yet."
                  : "No certificate records matching your query."}
              </CardDescription>
              {role === "STUDENT" && (
                <Button onClick={() => setActiveTab("APPLY")} size="sm" className="text-xs sm:text-sm font-semibold rounded-xl">
                  Apply Now
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {studentCerts.map((cert) => {
                const isApproved = cert.status === "APPROVED";
                const isPending = cert.status === "PENDING";
                return (
                  <Card
                    key={cert.id}
                    className={`flex flex-col justify-between transition-all rounded-2xl ${
                      isApproved
                        ? "border-emerald-500/40 hover:border-emerald-500/70 shadow-sm bg-card"
                        : isPending
                        ? "border-amber-500/40 bg-amber-500/5 shadow-xs"
                        : "border-destructive/40 bg-destructive/5 shadow-xs"
                    }`}
                  >
                    <CardHeader className="p-5 pb-3 border-b border-border/60">
                      <div className="flex items-center justify-between mb-2">
                        {isApproved ? (
                          <Badge className="bg-emerald-600 text-white text-xs font-semibold gap-1 px-2.5 py-0.5">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Verified Credential</span>
                          </Badge>
                        ) : isPending ? (
                          <Badge variant="outline" className="text-amber-600 border-amber-500/40 bg-amber-500/10 text-xs font-semibold gap-1 px-2.5 py-0.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Pending Super Admin Verification</span>
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs font-semibold gap-1 px-2.5 py-0.5">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Application Declined</span>
                          </Badge>
                        )}

                        <span className="font-mono text-xs font-bold text-muted-foreground border border-border px-2 py-0.5 rounded-lg bg-muted/40">
                          {cert.code}
                        </span>
                      </div>

                      <CardTitle className="text-base sm:text-lg font-bold leading-snug text-foreground">
                        {cert.title}
                      </CardTitle>

                      <CardDescription className="text-xs sm:text-sm mt-1">
                        Candidate: <strong className="text-foreground">{cert.studentName}</strong> • {cert.program} (Year {cert.year})
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 pt-3 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-muted-foreground">
                        <div>
                          <span className="font-bold text-foreground block text-xs uppercase tracking-wider text-muted-foreground/80">Institution:</span>
                          <span className="text-foreground font-medium">{cert.institution}</span>
                        </div>
                        <div>
                          <span className="font-bold text-foreground block text-xs uppercase tracking-wider text-muted-foreground/80">Grade:</span>
                          <span className="text-primary font-bold">{cert.grade}</span>
                        </div>
                        <div>
                          <span className="font-bold text-foreground block text-xs uppercase tracking-wider text-muted-foreground/80">Application Date:</span>
                          <span>{cert.applicationDate}</span>
                        </div>
                        {cert.issuedDate && (
                          <div>
                            <span className="font-bold text-foreground block text-xs uppercase tracking-wider text-muted-foreground/80">Conferred Date:</span>
                            <span className="text-emerald-600 font-semibold">{cert.issuedDate}</span>
                          </div>
                        )}
                      </div>

                      {cert.feedback && (
                        <div className="p-3 rounded-xl bg-card border border-destructive/30 text-xs sm:text-sm space-y-1">
                          <span className="font-bold text-destructive flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Super Administrator Feedback:</span>
                          </span>
                          <p className="text-muted-foreground">{cert.feedback}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-3 border-t border-border">
                        {isApproved ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCertForPreview(cert)}
                              className="flex-1 text-xs sm:text-sm font-semibold rounded-xl h-9 gap-1.5"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Certificate</span>
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedCertForPreview(cert);
                                setTimeout(() => window.print(), 300);
                              }}
                              className="bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl h-9 gap-1.5 px-4"
                            >
                              <Download className="h-4 w-4" />
                              <span>Print / PDF</span>
                            </Button>
                          </>
                        ) : isPending ? (
                          <div className="w-full flex items-center justify-between gap-2">
                            <span className="text-xs text-amber-600 font-medium italic">
                              Awaiting Super Admin review...
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCertForPreview(cert)}
                              className="text-xs h-8 rounded-xl border-amber-500/40 text-amber-700 dark:text-amber-300"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Preview Watermark
                            </Button>
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-2">
                            <span className="text-xs text-destructive font-medium">
                              Application declined. Review feedback above.
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab("APPLY")}
                              className="text-xs h-8 rounded-xl"
                            >
                              Re-Audit & Apply →
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPLY FOR CERTIFICATE WITH COURSE COMPLETION AUDIT & WATERMARK PREVIEW */}
      {activeTab === "APPLY" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 1. ENROLLMENT COURSE COMPLETION AUDIT CARD */}
          <Card className="rounded-2xl border-border shadow-xs overflow-hidden">
            <CardHeader className="p-5 pb-4 bg-muted/20 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Curriculum Completion Audit ({applyForm.program} Year {applyForm.year})</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-0.5">
                    Students can only apply for certificate for current enrollment after completing all subjects&apos; tasks successfully.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  {eligibility.isEligible ? (
                    <Badge className="bg-emerald-600 text-white text-xs font-bold gap-1 px-3 py-1">
                      <Unlock className="h-3.5 w-3.5" />
                      <span>100% Completed (Eligible)</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-500/40 bg-amber-500/10 text-xs font-bold gap-1 px-3 py-1">
                      <Lock className="h-3.5 w-3.5" />
                      <span>Tasks Incomplete (Locked)</span>
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              {/* Progress Bar & Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-foreground">
                    Enrollment Tasks Progress: <strong className="text-primary">{eligibility.completionPct}%</strong>
                  </span>
                  <span className="text-muted-foreground">
                    {eligibility.completedTasksCount} / {eligibility.totalTasksCount} Tasks Finished ({eligibility.completedSubjectsCount}/{eligibility.totalSubjectsCount} Subjects)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      eligibility.completionPct === 100 ? "bg-emerald-500" : "bg-primary"
                    }`}
                    style={{ width: `${eligibility.completionPct}%` }}
                  />
                </div>
              </div>

              {/* Subject Matrix Audit */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Required Subjects Checklist:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eligibility.subjects.map((sub) => (
                    <div
                      key={sub.code}
                      className={`p-3.5 rounded-xl border transition-colors flex flex-col justify-between gap-2 ${
                        sub.isCompleted
                          ? "border-emerald-500/40 bg-emerald-500/5"
                          : "border-amber-500/40 bg-amber-500/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-foreground">
                              {sub.code}
                            </span>
                            {sub.isCompleted ? (
                              <Badge className="bg-emerald-600 text-white text-[10px] font-semibold">
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-600 border-amber-500/40 text-[10px] font-semibold">
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-foreground mt-1 line-clamp-1">
                            {sub.name}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                        <span>
                          Tasks: <strong className="text-foreground">{sub.completedTasks}/{sub.totalTasks}</strong>
                        </span>
                        <span>
                          Avg Score: <strong className="text-primary">{sub.avgQuizScore}%</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locked Warning or Unlocked Banner */}
              {!eligibility.isEligible ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs sm:text-sm">
                      <strong className="text-amber-800 dark:text-amber-200 font-bold block">
                        Application Locked: Course Tasks Incomplete
                      </strong>
                      <p className="text-amber-700 dark:text-amber-300">
                        You have {eligibility.totalTasksCount - eligibility.completedTasksCount} remaining tasks in your enrolled curriculum. Finish all lessons, quizzes, and practical bench tasks in the Study Center before applying.
                      </p>
                    </div>
                  </div>

                  {/* Action links */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-500/20">
                    <Button asChild size="sm" className="text-xs h-8 rounded-xl gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
                      <Link href="/student/study-center">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Go to Study Center to Complete Tasks</span>
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => markAllCompleted(true)}
                      className="text-xs h-8 rounded-xl border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 gap-1.5"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Simulate 100% Tasks Complete (Demo Mode)</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div className="text-xs sm:text-sm">
                      <strong className="text-emerald-800 dark:text-emerald-200 font-bold block">
                        Enrollment Requirement Satisfied!
                      </strong>
                      <span className="text-emerald-700 dark:text-emerald-300">
                        All {eligibility.totalSubjectsCount} subjects and practical tasks for {applyForm.program} Year {applyForm.year} are verified. You may proceed.
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => markAllCompleted(false)}
                    className="text-xs h-8 rounded-xl shrink-0 gap-1 text-muted-foreground"
                    title="Reset to incomplete to test locked state"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Demo Tasks</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. APPLICATION DETAILS FORM (UNLOCKED WHEN ELIGIBLE) */}
          <Card className={`rounded-2xl border-border shadow-sm transition-opacity ${!eligibility.isEligible ? "opacity-60 pointer-events-none" : ""}`}>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-bold">
                Student Credential Application Details
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Step 1: Confirm your student registration and curriculum records. Step 2: Preview your certificate with security watermarks before submitting.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2">
              <form onSubmit={handleOpenWatermarkPreview} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Program Level *</label>
                    <select
                      value={applyForm.program}
                      onChange={(e) => setApplyForm({ ...applyForm, program: e.target.value as ProgramLevel })}
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs sm:text-sm font-medium"
                    >
                      <option value="DIPLOMA">Diploma in Medical Lab Technology</option>
                      <option value="BSC">B.Sc. in Medical Laboratory Technology</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Enrolled Academic Year *</label>
                    <select
                      value={applyForm.year}
                      onChange={(e) => setApplyForm({ ...applyForm, year: e.target.value })}
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs sm:text-sm font-medium"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year (Internship & Degree)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Candidate Full Name *</label>
                  <Input
                    value={userProfile?.name || "Md. Ansarul Islam"}
                    readOnly
                    className="h-10 rounded-xl bg-muted/30 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Certificate Title / Competency Focus *</label>
                  <Input
                    value={applyForm.title}
                    onChange={(e) => setApplyForm({ ...applyForm, title: e.target.value })}
                    required
                    className="h-10 rounded-xl font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Affiliated Institute / Medical College *</label>
                  <Input
                    value={applyForm.institution}
                    onChange={(e) => setApplyForm({ ...applyForm, institution: e.target.value })}
                    placeholder="e.g. Dhaka Institute of Health Technology (DIHT)"
                    required
                    className="h-10 rounded-xl font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Performance / Grade *</label>
                  <Input
                    value={applyForm.grade}
                    onChange={(e) => setApplyForm({ ...applyForm, grade: e.target.value })}
                    placeholder="e.g. Pass with Distinction (91.5%)"
                    required
                    className="h-10 rounded-xl font-medium"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
                  <strong>Verification Governance:</strong> Upon submitting, this application enters the Super Admin verification queue with your verified Study Center logs, quiz metrics, and bench SOP assessments.
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("MY_CERTS")} className="rounded-xl h-10 px-4">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!eligibility.isEligible}
                    className="bg-primary text-primary-foreground font-semibold rounded-xl h-10 px-5 gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview Certificate with Protection Watermark</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: REVIEW APPLICATIONS (SUPER ADMIN & ADMIN ONLY) */}
      {isSuperOrAdmin && activeTab === "REVIEW" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Pending Candidate Applications ({pendingCerts.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              Super Administrator Authority: Review Study Center records, inspect watermark preview, and confer or decline credentials.
            </span>
          </div>

          {pendingCerts.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground text-xs sm:text-sm space-y-2 rounded-2xl border-border">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-base text-foreground">All caught up!</p>
              <p>There are no pending certificate applications requiring review at this time.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingCerts.map((cert) => (
                <Card key={cert.id} className="border-amber-500/40 bg-amber-500/5 p-4 sm:p-5 rounded-2xl shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-amber-600 border-amber-500/40 bg-amber-500/10 text-xs font-semibold px-2.5 py-0.5">
                          Pending Review
                        </Badge>
                        <span className="text-xs font-mono font-bold text-muted-foreground">{cert.code}</span>
                      </div>
                      <h3 className="font-bold text-base text-foreground">{cert.title}</h3>
                      <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                        <span>Candidate: <strong className="text-foreground">{cert.studentName}</strong></span>
                        <span>Program: <strong>{cert.program} Year {cert.year}</strong></span>
                        <span>Institute: <strong>{cert.institution}</strong></span>
                        <span>Grade: <strong className="text-primary font-bold">{cert.grade}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedCertForPreview(cert)}
                        className="h-9 text-xs sm:text-sm font-semibold rounded-xl gap-1.5"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Preview Watermark</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewAction(cert.id, "REJECTED")}
                        className="h-9 text-xs sm:text-sm font-semibold rounded-xl text-destructive hover:bg-destructive/10 gap-1.5 border-destructive/30"
                      >
                        <X className="h-4 w-4" />
                        <span>Decline</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReviewAction(cert.id, "APPROVED")}
                        className="h-9 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve & Issue</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TEMPLATE & SIGNATURE CUSTOMIZER (SUPER ADMIN & ADMIN ONLY) */}
      {isSuperOrAdmin && activeTab === "CUSTOMIZE" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <Card className="border-border rounded-2xl shadow-xs">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <span>Customize Certificate Template</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Configure conferring authority branding, border styling, and official board signatories.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs sm:text-sm">
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Conferring Authority Name</label>
                    <Input
                      value={templateForm.institutionName}
                      onChange={(e) => setTemplateForm({ ...templateForm, institutionName: e.target.value })}
                      required
                      className="h-10 rounded-xl font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Registry Sub-header</label>
                    <Input
                      value={templateForm.subHeader}
                      onChange={(e) => setTemplateForm({ ...templateForm, subHeader: e.target.value })}
                      required
                      className="h-10 rounded-xl font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Official Border Style</label>
                    <select
                      value={templateForm.borderStyle}
                      onChange={(e) => setTemplateForm({ ...templateForm, borderStyle: e.target.value as any })}
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs sm:text-sm font-medium"
                    >
                      <option value="EMERALD_CLINICAL">Emerald Clinical (DGHS / SMFB Standard)</option>
                      <option value="CLASSIC_GOLD">Classic Academic Gold</option>
                      <option value="MINIMALIST_NAVY">Minimalist Navy Blue</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground">Signatory 1 Name</label>
                      <Input
                        value={templateForm.signatoryName1}
                        onChange={(e) => setTemplateForm({ ...templateForm, signatoryName1: e.target.value })}
                        required
                        className="h-10 rounded-xl font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground">Signatory 1 Title</label>
                      <Input
                        value={templateForm.signatoryTitle1}
                        onChange={(e) => setTemplateForm({ ...templateForm, signatoryTitle1: e.target.value })}
                        required
                        className="h-10 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground">Signatory 2 Name</label>
                      <Input
                        value={templateForm.signatoryName2}
                        onChange={(e) => setTemplateForm({ ...templateForm, signatoryName2: e.target.value })}
                        required
                        className="h-10 rounded-xl font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground">Signatory 2 Title</label>
                      <Input
                        value={templateForm.signatoryTitle2}
                        onChange={(e) => setTemplateForm({ ...templateForm, signatoryTitle2: e.target.value })}
                        required
                        className="h-10 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Official Seal Inscription</label>
                    <Input
                      value={templateForm.sealText}
                      onChange={(e) => setTemplateForm({ ...templateForm, sealText: e.target.value })}
                      required
                      className="h-10 rounded-xl font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {templateSavedMsg && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Template Saved!
                      </span>
                    )}
                    <Button type="submit" className="ml-auto rounded-xl h-10 px-5 font-semibold">
                      Save Template Settings
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: CANDIDATE WATERMARKED PREVIEW (BEFORE SUBMITTING APPLICATION)
         ========================================================================= */}
      {candidateWatermarkPreview && (
        <div
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCandidateWatermarkPreview(null);
          }}
        >
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative my-auto">
            {/* Header with explicit Close button */}
            <div className="flex items-center justify-between pb-3 border-b border-border gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/40 text-xs font-bold px-2.5 py-1">
                  Candidate Pre-Submission Preview (Watermarked)
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Verification Code: Pending Super Admin Issuance
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCandidateWatermarkPreview(null)}
                  className="h-9 px-3 text-xs sm:text-sm font-semibold rounded-xl gap-1.5"
                >
                  <X className="h-4 w-4" />
                  <span>Close</span>
                </Button>
              </div>
            </div>

            {/* Render Printable Certificate with WATERMARK OVERLAYS */}
            <div
              className={`rounded-2xl p-5 sm:p-8 md:p-10 border-4 sm:border-8 bg-card text-foreground shadow-sm relative overflow-hidden ${
                templateConfig.borderStyle === "EMERALD_CLINICAL"
                  ? "border-emerald-600"
                  : templateConfig.borderStyle === "CLASSIC_GOLD"
                  ? "border-amber-600"
                  : "border-blue-700"
              }`}
            >
              {/* DIAGONAL WATERMARK REPEATING RIBBONS */}
              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between overflow-hidden select-none opacity-25 dark:opacity-30">
                <div className="w-[160%] -rotate-12 -translate-x-16 -translate-y-8 flex flex-col gap-9">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="text-center font-black tracking-widest text-red-600 text-[11px] sm:text-xs md:text-sm uppercase whitespace-nowrap"
                    >
                      UNOFFICIAL PREVIEW • NOT CONFERRED • PENDING SUPER ADMIN APPROVAL • VOID IF REPRODUCED
                    </div>
                  ))}
                </div>
              </div>

              {/* CENTRAL PROTECTION SEAL WATERMARK */}
              <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-4">
                <div className="-rotate-20 border-4 border-red-600/50 rounded-2xl px-6 py-4 bg-card/75 backdrop-blur-xs text-center shadow-xl max-w-sm">
                  <span className="text-lg sm:text-2xl font-black uppercase tracking-widest text-red-600/70 block">
                    SAMPLE PREVIEW ONLY
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600/70 block mt-1">
                    UNAUTHORIZED FOR OFFICIAL USE • WATERMARKED FOR SECURITY
                  </span>
                </div>
              </div>

              {/* CERTIFICATE CONTENT */}
              <div className="text-center space-y-3 sm:space-y-4 relative z-10">
                <div className="flex justify-center">
                  <Award className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-serif font-bold uppercase tracking-wider text-foreground">
                    {templateConfig.institutionName}
                  </h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    {templateConfig.subHeader}
                  </p>
                </div>

                <div className="py-1">
                  <span className="text-xs sm:text-sm tracking-widest font-semibold uppercase text-primary border-b-2 border-primary/40 pb-1">
                    Certificate of Competency & Academic Achievement
                  </span>
                </div>

                <p className="text-xs italic text-muted-foreground">This is to officially certify that</p>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-foreground underline decoration-primary underline-offset-8">
                  {candidateWatermarkPreview.studentName}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  affiliated with <strong className="text-foreground">{candidateWatermarkPreview.institution}</strong>, having completed all prescribed syllabus modules and verified clinical bench SOPs, has fulfilled competency criteria for{" "}
                  <strong className="text-foreground">{candidateWatermarkPreview.title}</strong> in the curriculum of{" "}
                  <strong className="text-foreground">{candidateWatermarkPreview.program} (Year {candidateWatermarkPreview.year})</strong> with an assessment grade of{" "}
                  <strong className="text-primary font-bold">{candidateWatermarkPreview.grade}</strong>.
                </p>

                <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 items-end gap-3 text-xs text-muted-foreground">
                  <div className="text-center border-t border-border pt-2">
                    <p className="font-bold text-foreground">{templateConfig.signatoryName1}</p>
                    <p className="text-xs text-muted-foreground">{templateConfig.signatoryTitle1}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full border-2 border-dashed border-primary flex items-center justify-center p-1 text-[9px] font-bold text-center text-primary leading-tight">
                      {templateConfig.sealText}
                    </div>
                  </div>

                  <div className="text-center border-t border-border pt-2">
                    <p className="font-bold text-foreground">{templateConfig.signatoryName2}</p>
                    <p className="text-xs text-muted-foreground">{templateConfig.signatoryTitle2}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-muted-foreground/80 flex items-center justify-between border-t border-border/40 font-mono">
                  <span>Application Status: PENDING SUBMISSION</span>
                  <span>Auth Code: PENDING SUPER ADMIN APPROVAL</span>
                </div>
              </div>
            </div>

            {/* Modal Footer with explicit Close & Submit actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-3">
              <span className="text-xs text-muted-foreground">
                Notice: Super Administrator reviews your study activities and bench tasks before issuing the clean official PDF.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  onClick={() => setCandidateWatermarkPreview(null)}
                  className="rounded-xl h-10 px-4 text-xs sm:text-sm font-semibold gap-1.5"
                >
                  <X className="h-4 w-4" />
                  <span>Close & Edit Info</span>
                </Button>
                <Button
                  onClick={handleConfirmSubmitApplication}
                  className="rounded-xl h-10 px-5 text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm"
                >
                  <Check className="h-4 w-4" />
                  <span>Submit Application to Super Admin →</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: OFFICIAL CERTIFICATE VIEW / PRINT (WITH FIX FOR CLOSE BUTTON)
         ========================================================================= */}
      {selectedCertForPreview && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCertForPreview(null);
          }}
        >
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative my-auto">
            {/* Header with explicit Close button */}
            <div className="flex items-center justify-between pb-3 border-b border-border gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={`text-xs font-semibold px-2.5 py-0.5 ${
                    selectedCertForPreview.status === "APPROVED"
                      ? "bg-emerald-600 text-white"
                      : selectedCertForPreview.status === "PENDING"
                      ? "bg-amber-600 text-white animate-pulse"
                      : "bg-destructive text-white"
                  }`}
                >
                  {selectedCertForPreview.status === "APPROVED"
                    ? "Official Conferred Credential"
                    : selectedCertForPreview.status === "PENDING"
                    ? "Pending Super Admin Verification"
                    : "Declined Application"}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground border border-border px-2 py-0.5 rounded-lg bg-muted/40">
                  {selectedCertForPreview.code}
                </span>
                {selectedCertForPreview.verificationCode && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    ID: {selectedCertForPreview.verificationCode}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedCertForPreview.status === "APPROVED" && (
                  <Button size="sm" onClick={handlePrint} className="gap-1.5 h-9 text-xs sm:text-sm font-semibold rounded-xl">
                    <Printer className="h-4 w-4" />
                    <span>Print Document</span>
                  </Button>
                )}
                {/* PROMINENT CLOSE BUTTON IN HEADER */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCertForPreview(null)}
                  className="h-9 px-3 text-xs sm:text-sm font-semibold rounded-xl gap-1.5 border-border hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  <span>Close</span>
                </Button>
              </div>
            </div>

            {/* Render Printable Certificate */}
            <div
              className={`rounded-2xl p-5 sm:p-8 md:p-10 border-4 sm:border-8 bg-card text-foreground shadow-sm relative overflow-hidden ${
                templateConfig.borderStyle === "EMERALD_CLINICAL"
                  ? "border-emerald-600"
                  : templateConfig.borderStyle === "CLASSIC_GOLD"
                  ? "border-amber-600"
                  : "border-blue-700"
              }`}
            >
              {/* WATERMARK IF NOT APPROVED */}
              {selectedCertForPreview.status !== "APPROVED" && (
                <>
                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between overflow-hidden select-none opacity-25 dark:opacity-30">
                    <div className="w-[160%] -rotate-12 -translate-x-16 -translate-y-8 flex flex-col gap-9">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="text-center font-black tracking-widest text-red-600 text-[11px] sm:text-xs md:text-sm uppercase whitespace-nowrap"
                        >
                          UNOFFICIAL PREVIEW • NOT CONFERRED • PENDING SUPER ADMIN APPROVAL • VOID IF REPRODUCED
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-4">
                    <div className="-rotate-20 border-4 border-red-600/50 rounded-2xl px-6 py-4 bg-card/75 backdrop-blur-xs text-center shadow-xl max-w-sm">
                      <span className="text-lg sm:text-2xl font-black uppercase tracking-widest text-red-600/70 block">
                        SAMPLE PREVIEW ONLY
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600/70 block mt-1">
                        UNAUTHORIZED FOR OFFICIAL USE • WATERMARKED FOR SECURITY
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="text-center space-y-3 sm:space-y-4 relative z-10">
                <div className="flex justify-center">
                  <Award className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-serif font-bold uppercase tracking-wider text-foreground">
                    {templateConfig.institutionName}
                  </h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    {templateConfig.subHeader}
                  </p>
                </div>

                <div className="py-1">
                  <span className="text-xs sm:text-sm tracking-widest font-semibold uppercase text-primary border-b-2 border-primary/40 pb-1">
                    Certificate of Competency & Academic Achievement
                  </span>
                </div>

                <p className="text-xs italic text-muted-foreground">This is to officially certify that</p>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-foreground underline decoration-primary underline-offset-8">
                  {selectedCertForPreview.studentName}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  having studied at <strong className="text-foreground">{selectedCertForPreview.institution}</strong>, has successfully fulfilled all clinical benchmark requirements and verified laboratory SOP standards for{" "}
                  <strong className="text-foreground">{selectedCertForPreview.title}</strong> in the curriculum of{" "}
                  <strong className="text-foreground">{selectedCertForPreview.program} (Year {selectedCertForPreview.year})</strong> with an official assessment grade of{" "}
                  <strong className="text-primary font-bold">{selectedCertForPreview.grade}</strong>.
                </p>

                <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 items-end gap-3 text-xs text-muted-foreground">
                  <div className="text-center border-t border-border pt-2">
                    <p className="font-bold text-foreground">{templateConfig.signatoryName1}</p>
                    <p className="text-xs text-muted-foreground">{templateConfig.signatoryTitle1}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full border-2 border-dashed border-primary flex items-center justify-center p-1 text-[9px] font-bold text-center text-primary leading-tight">
                      {templateConfig.sealText}
                    </div>
                    <span className="text-xs font-mono mt-1 text-muted-foreground">
                      {selectedCertForPreview.code}
                    </span>
                  </div>

                  <div className="text-center border-t border-border pt-2">
                    <p className="font-bold text-foreground">{templateConfig.signatoryName2}</p>
                    <p className="text-xs text-muted-foreground">{templateConfig.signatoryTitle2}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-muted-foreground/80 flex items-center justify-between border-t border-border/40 font-mono">
                  <span>Issued Date: {selectedCertForPreview.issuedDate || selectedCertForPreview.applicationDate}</span>
                  <span>Auth Code: {selectedCertForPreview.verificationCode || "PENDING"}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer with explicit Close button */}
            <div className="flex items-center justify-between pt-3 border-t border-border flex-wrap gap-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Officially Governed Credential Registry</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCertForPreview(null)}
                  className="rounded-xl h-9 px-4 text-xs sm:text-sm font-semibold gap-1.5"
                >
                  <X className="h-4 w-4" />
                  <span>Close Document</span>
                </Button>
                {selectedCertForPreview.status === "APPROVED" && (
                  <Button
                    onClick={handlePrint}
                    className="rounded-xl h-9 px-4 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground gap-1.5"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print / Download PDF</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
