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
  Sparkles,
  BarChart3,
  Activity,
  TrendingUp,
  FlaskConical,
  History,
  Calendar,
  ChevronRight,
  FileCheck2,
  CheckCircle,
  Upload,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Type,
  FileBadge,
  Sparkle,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  FileText,
  Building2,
  Lock,
  Unlock,
} from "lucide-react";
import {
  useCertificates,
  CertificateRecord,
  CertificateTemplateConfig,
  ColorPreset,
  CertFontFamily,
  CertBorderStyle,
  AdminCertificateTemplate,
  COLOR_PRESETS,
  US_LETTER_DIMENSION_LABEL,
} from "@/lib/stores/certificate-store";
import { useAcademic, ProgramLevel } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { useNotification } from "@/components/ui/notification-context";
import { useUserManagement, LMSUser } from "@/lib/curriculum/user-management-context";
import {
  useStudentStudyProgress,
  getStudentStudyRecord,
  checkEnrollmentEligibility,
} from "@/lib/curriculum/student-study-progress-store";
import { ROLE_LABELS } from "@/types/roles";
import { cn } from "@/lib/utils";

type SortOption =
  | "DATE_DESC"
  | "DATE_ASC"
  | "NAME_ASC"
  | "NAME_DESC"
  | "GRADE_DESC"
  | "CERT_NUM_ASC";

export default function StudentCertificatesPage() {
  const {
    certificates,
    templateConfig,
    adminTemplates,
    applyForCertificate,
    reviewCertificate,
    updateCertificateRecord,
    updateTemplateConfig,
    resetTemplateConfig,
    updateAdminTemplate,
    addAdminTemplate,
    resetAdminTemplates,
    getTemplateForProgramAndYear,
  } = useCertificates();
  const { role, userProfile } = useAcademic();
  const { logActivity } = useActivityLog();
  const { showNotification } = useNotification();
  const { users } = useUserManagement();

  const isSuperAdmin = role === "SUPER_ADMIN";
  const isSuperOrAdmin = role === "SUPER_ADMIN" || role === "ADMIN";

  // Tab states
  const [activeTab, setActiveTab] = React.useState<"MY_CERTS" | "APPLY" | "REVIEW" | "CUSTOMIZE">(
    isSuperAdmin ? "REVIEW" : "MY_CERTS"
  );
  const [selectedCertForPreview, setSelectedCertForPreview] = React.useState<CertificateRecord | null>(null);

  // Student User Analytics & Dossier Modal (for Super Admin Review)
  const [analyticsCandidateCert, setAnalyticsCandidateCert] = React.useState<CertificateRecord | null>(null);
  const [analyticsTab, setAnalyticsTab] = React.useState<"ANALYTICS" | "ACTIVITIES">("ANALYTICS");
  const [activitySearchQuery, setActivitySearchQuery] = React.useState("");

  // Decline dialog state
  const [decliningCert, setDecliningCert] = React.useState<CertificateRecord | null>(null);
  const [declineReason, setDeclineReason] = React.useState("");

  // Filters & Sorting for Generated Certificates
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [programFilter, setProgramFilter] = React.useState<string>("ALL");
  const [yearFilter, setYearFilter] = React.useState<string>("ALL");
  const [sortBy, setSortBy] = React.useState<SortOption>("DATE_DESC");

  // Student Enrollment State for Application
  const currentStudentId = (userProfile as any)?.id || userProfile?.idNumber || "usr-005";
  const currentProgram = (userProfile?.program as ProgramLevel) || "BSC";
  const currentYear = userProfile?.academicYear || "4";

  // Initial template for selected program & year
  const initialTemplate = getTemplateForProgramAndYear(currentProgram, currentYear);

  // Application Form State (matching screenshot media_1788929999357.png)
  const [applyForm, setApplyForm] = React.useState({
    candidateName: userProfile?.name || "Ansarul Islam",
    program: currentProgram,
    year: currentYear,
    title: initialTemplate?.title || "B.Sc. Year 4 Competency: Diagnostic Clinical Benchmark & SOP Verification",
    institution: initialTemplate?.institution || "DGHS Medical Technology Directorate & LabTutor Central Administration",
    grade: "Distinction (92.5%)",
  });

  // Dynamic user study center activities & tasks audit for current user
  const {
    eligibility,
    completeTask,
    resetProgress,
    completeAllTasks,
  } = useStudentStudyProgress(currentStudentId, applyForm.program, applyForm.year);

  // Auto-sync application form fields:
  // 1. Title & Institution get populated from Super Admin generated certificate templates for selected program & year
  // 2. Grade auto-fills from student course performance (eligibility.recommendedGrade / cumulativeScore)
  React.useEffect(() => {
    const tpl = getTemplateForProgramAndYear(applyForm.program, applyForm.year);
    const calculatedGrade =
      eligibility.recommendedGrade ||
      (eligibility.cumulativeScore ? `Distinction (${eligibility.cumulativeScore}%)` : "Distinction (92.5%)");

    setApplyForm((prev) => ({
      ...prev,
      title: tpl?.title || `${prev.program === "BSC" ? "B.Sc." : "Diploma"} Year ${prev.year} Competency: Diagnostic Clinical Benchmark & SOP Verification`,
      institution: tpl?.institution || (prev.program === "BSC" ? "DGHS Medical Technology Directorate & LabTutor Central Administration" : "State Medical Faculty of Bangladesh (SMFB) & DIHT Central Laboratory"),
      // Only auto-update grade if not manually overridden by Super Admin
      grade: !isSuperOrAdmin || !prev.grade ? calculatedGrade : prev.grade,
    }));
  }, [
    applyForm.program,
    applyForm.year,
    eligibility.recommendedGrade,
    eligibility.cumulativeScore,
    getTemplateForProgramAndYear,
    isSuperOrAdmin,
  ]);

  // Keep candidateName updated if user profile loads
  React.useEffect(() => {
    if (userProfile?.name && (!applyForm.candidateName || applyForm.candidateName === "Ansarul Islam")) {
      setApplyForm((prev) => ({ ...prev, candidateName: userProfile.name }));
    }
  }, [userProfile?.name]);

  // Watermark preview before application submission state
  const [candidateWatermarkPreview, setCandidateWatermarkPreview] = React.useState<null | {
    studentName: string;
    studentId: string;
    institution: string;
    program: ProgramLevel;
    year: string;
    title: string;
    grade: string;
    certificateNumber: string;
  }>(null);

  // Template customizer state (Editable copy for Super Admin)
  const [customizerState, setCustomizerState] = React.useState<CertificateTemplateConfig>({
    ...templateConfig,
  });
  const [isCustomizerCollapsed, setIsCustomizerCollapsed] = React.useState(false);
  const [templateSavedMsg, setTemplateSavedMsg] = React.useState(false);

  // Sync customizer when templateConfig changes
  React.useEffect(() => {
    setCustomizerState({ ...templateConfig });
  }, [templateConfig]);

  // Super Admin Curriculum Template Management State
  const [selectedAdminTplProg, setSelectedAdminTplProg] = React.useState<ProgramLevel>("BSC");
  const [selectedAdminTplYear, setSelectedAdminTplYear] = React.useState<string>("4");
  const activeAdminTemplate =
    adminTemplates.find((t) => t.program === selectedAdminTplProg && t.year === selectedAdminTplYear) ||
    getTemplateForProgramAndYear(selectedAdminTplProg, selectedAdminTplYear);
  const [adminTplEditTitle, setAdminTplEditTitle] = React.useState(activeAdminTemplate?.title || "");
  const [adminTplEditInst, setAdminTplEditInst] = React.useState(activeAdminTemplate?.institution || "");

  React.useEffect(() => {
    if (activeAdminTemplate) {
      setAdminTplEditTitle(activeAdminTemplate.title);
      setAdminTplEditInst(activeAdminTemplate.institution);
    }
  }, [selectedAdminTplProg, selectedAdminTplYear, adminTemplates]);

  // Close modals on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCertForPreview(null);
        setCandidateWatermarkPreview(null);
        setAnalyticsCandidateCert(null);
        setDecliningCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered & Sorted certificates list
  const filteredCertificates = React.useMemo(() => {
    const list = certificates.filter((c) => {
      // Role scope: regular students only see their own certificates; Admins see all
      if (role === "STUDENT") {
        const matchUser =
          c.studentId === currentStudentId ||
          c.studentName.toLowerCase().includes((userProfile?.name || "").toLowerCase());
        if (!matchUser) return false;
      }

      // Status filter
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;

      // Program filter
      if (programFilter !== "ALL" && c.program !== programFilter) return false;

      // Year filter
      if (yearFilter !== "ALL" && c.year !== yearFilter) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          c.studentName.toLowerCase().includes(q) ||
          c.certificateNumber.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.institution.toLowerCase().includes(q) ||
          c.verificationCode.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      switch (sortBy) {
        case "DATE_ASC": {
          const dateA = new Date(a.issuedDate || a.applicationDate).getTime() || 0;
          const dateB = new Date(b.issuedDate || b.applicationDate).getTime() || 0;
          return dateA - dateB;
        }
        case "NAME_ASC":
          return a.studentName.localeCompare(b.studentName);
        case "NAME_DESC":
          return b.studentName.localeCompare(a.studentName);
        case "GRADE_DESC":
          return b.grade.localeCompare(a.grade);
        case "CERT_NUM_ASC":
          return a.certificateNumber.localeCompare(b.certificateNumber);
        case "DATE_DESC":
        default: {
          const dateA = new Date(a.issuedDate || a.applicationDate).getTime() || 0;
          const dateB = new Date(b.issuedDate || b.applicationDate).getTime() || 0;
          return dateB - dateA;
        }
      }
    });
  }, [
    certificates,
    role,
    currentStudentId,
    userProfile?.name,
    statusFilter,
    programFilter,
    yearFilter,
    searchQuery,
    sortBy,
  ]);

  // Pending applications for review
  const pendingCerts = React.useMemo(() => {
    return certificates.filter((c) => c.status === "PENDING");
  }, [certificates]);

  // Signature file upload handler (converts to Data URL)
  const handleSignatureUpload = (file: File, signatoryIndex: 1 | 2) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomizerState((prev) => ({
        ...prev,
        [signatoryIndex === 1 ? "signatorySignature1" : "signatorySignature2"]: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Preset Color Template change handler
  const handlePresetSelect = (preset: ColorPreset) => {
    const p = COLOR_PRESETS[preset];
    setCustomizerState((prev) => ({
      ...prev,
      colorPreset: preset,
      primaryColor: p.primary,
      secondaryColor: p.secondary,
      accentColor: p.accent,
      borderStyle: p.border,
    }));
  };

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

    const currentYear = new Date().getFullYear();
    const progCode = applyForm.program === "BSC" ? "BSC" : "DIP";
    const sampleCertNum = `LTA-${progCode}-${currentYear}-${Math.floor(10000 + Math.random() * 90000)}`;

    setCandidateWatermarkPreview({
      studentName: applyForm.candidateName || userProfile?.name || "Ansarul Islam",
      studentId: currentStudentId,
      institution: applyForm.institution,
      program: applyForm.program,
      year: applyForm.year,
      title: applyForm.title,
      grade: applyForm.grade,
      certificateNumber: sampleCertNum,
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
        details: `Submitted certificate application for "${candidateWatermarkPreview.title}" (Assigned: ${result.certificateNumber})`,
      });

      setCandidateWatermarkPreview(null);
      showNotification({
        type: "success",
        title: "Application Submitted",
        message: `Your application (Certificate No: ${result.certificateNumber}) has been queued for Super Admin review.`,
        autoRefresh: true,
      });

      setActiveTab("MY_CERTS");
    }
  };

  const handleReviewAction = (certId: string, decision: "APPROVED" | "REJECTED", reason?: string) => {
    let feedback = reason;
    if (decision === "REJECTED" && !feedback) {
      feedback = prompt("Enter reason / feedback for declining application *:") || "";
      if (!feedback.trim()) {
        alert("A specific reason is required when declining a student certificate request.");
        return;
      }
    }

    reviewCertificate(
      certId,
      decision,
      userProfile?.name || (role === "SUPER_ADMIN" ? "Super Admin Ansarul Islam" : "Academic Admin"),
      role,
      feedback || undefined
    );

    logActivity({
      action: "UPDATE",
      module: "Certificates",
      details: `${decision === "APPROVED" ? "Approved" : "Declined"} certificate application for ${certId}`,
    });

    showNotification({
      type: decision === "APPROVED" ? "success" : "info",
      title: decision === "APPROVED" ? "Certificate Conferred" : "Application Declined",
      message:
        decision === "APPROVED"
          ? "Official credential issued with cryptographic certificate number. Student notified."
          : "Decline notification with feedback dispatched to student.",
    });

    if (analyticsCandidateCert?.id === certId) {
      setAnalyticsCandidateCert(null);
    }
    if (decliningCert?.id === certId) {
      setDecliningCert(null);
      setDeclineReason("");
    }
  };

  const handleSaveTemplateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateTemplateConfig(customizerState);
    logActivity({
      action: "UPDATE",
      module: "Certificates",
      details: `Updated certificate template styling: Color template ${customizerState.colorPreset}, Font ${customizerState.fontFamily}, Border ${customizerState.borderStyle}`,
    });
    setTemplateSavedMsg(true);
    showNotification({
      type: "success",
      title: "Template Saved",
      message: "Certificate design, color template, font, and signatures updated successfully.",
    });
    setTimeout(() => setTemplateSavedMsg(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper font class generator
  const getFontFamilyClass = (font: CertFontFamily) => {
    switch (font) {
      case "SANS_MODERN":
        return "font-sans tracking-tight";
      case "CALLIGRAPHIC_PRESTIGE":
        return "font-serif italic tracking-wide";
      case "MONO_FORMAL":
        return "font-mono";
      case "SERIF_CLASSIC":
      default:
        return "font-serif";
    }
  };

  // Helper border styling
  const getBorderStyleClasses = (border: CertBorderStyle, primaryColor: string) => {
    switch (border) {
      case "CLASSIC_GOLD":
        return "border-8 border-double border-amber-600 shadow-lg ring-4 ring-amber-500/20";
      case "MINIMALIST_NAVY":
        return "border-4 border-blue-800 shadow-md ring-2 ring-blue-500/20";
      case "ORNATE_VINTAGE":
        return "border-8 border-red-800 shadow-xl ring-4 ring-red-500/20";
      case "SECURITY_GUILLOCHE":
        return "border-4 border-dashed border-slate-700 shadow-md ring-4 ring-slate-500/20";
      case "EMERALD_CLINICAL":
      default:
        return "border-8 border-emerald-700 shadow-xl ring-4 ring-emerald-500/20";
    }
  };

  // Helper paper background
  const getPaperToneClass = (tone: CertificateTemplateConfig["paperTone"]) => {
    switch (tone) {
      case "PURE_WHITE":
        return "bg-white text-slate-900";
      case "ANTIQUE_LINEN":
        return "bg-[#fcfaf2] text-slate-900";
      case "IVORY_PARCHMENT":
      default:
        return "bg-[#fdfbf7] text-slate-900";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Certificates & Credentials
            </h1>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5"
            >
              Cryptographic Registry
            </Badge>
            {isSuperAdmin && (
              <Badge className="bg-purple-600 text-white text-xs px-2.5 py-0.5 font-bold">
                Super Admin Mode
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Verifiable competency certificates, automated credential numbering, template design customizer, and registry management.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isSuperOrAdmin && (
            <Button
              variant={activeTab === "CUSTOMIZE" && !isCustomizerCollapsed ? "default" : "outline"}
              onClick={() => {
                if (activeTab === "CUSTOMIZE") {
                  setIsCustomizerCollapsed(!isCustomizerCollapsed);
                } else {
                  setActiveTab("CUSTOMIZE");
                  setIsCustomizerCollapsed(false);
                }
              }}
              className="gap-2 text-xs sm:text-sm font-semibold rounded-xl h-9 sm:h-10 px-3.5 cursor-pointer"
            >
              <Palette className="h-4 w-4" />
              <span>
                {activeTab === "CUSTOMIZE" && !isCustomizerCollapsed
                  ? "Collapse Customizer"
                  : "Certificate Customizer"}
              </span>
              {activeTab === "CUSTOMIZE" && (
                <span className="ml-0.5">
                  {isCustomizerCollapsed ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronUp className="h-3.5 w-3.5" />
                  )}
                </span>
              )}
            </Button>
          )}

          {role === "STUDENT" && (
            <Button
              onClick={() => setActiveTab("APPLY")}
              className="gap-2 shadow-xs bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl h-9 sm:h-10 px-4 cursor-pointer hover:bg-primary/90"
            >
              <Award className="h-4 w-4" />
              <span>Apply for Certificate</span>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-1 text-xs sm:text-sm scrollbar-none">
        <button
          onClick={() => setActiveTab("MY_CERTS")}
          className={cn(
            "px-4 py-2.5 font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 cursor-pointer shrink-0",
            activeTab === "MY_CERTS"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Award className="h-4 w-4" />
          <span>{role === "STUDENT" ? "My Certificates" : "All Credentials Registry"}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.2">
            {filteredCertificates.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("APPLY")}
          className={cn(
            "px-4 py-2.5 font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 cursor-pointer shrink-0",
            activeTab === "APPLY"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Plus className="h-4 w-4" />
          <span>{role === "STUDENT" ? "Apply for Certificate" : "Candidate Application Form"}</span>
          {eligibility.isEligible ? (
            <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2">Eligible</Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.2 text-amber-600 border-amber-500/40">
              {eligibility.completionPct}% Complete
            </Badge>
          )}
        </button>

        {isSuperOrAdmin && (
          <button
            onClick={() => setActiveTab("REVIEW")}
            className={cn(
              "px-4 py-2.5 font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 cursor-pointer relative shrink-0",
              activeTab === "REVIEW"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <UserCheck className="h-4 w-4" />
            <span>Review Applications</span>
            {pendingCerts.length > 0 && (
              <Badge className="bg-amber-600 text-white text-[10px] px-2 py-0.5 animate-pulse">
                {pendingCerts.length} Pending
              </Badge>
            )}
          </button>
        )}

        {isSuperOrAdmin && (
          <button
            onClick={() => {
              if (activeTab === "CUSTOMIZE") {
                setIsCustomizerCollapsed(!isCustomizerCollapsed);
              } else {
                setActiveTab("CUSTOMIZE");
              }
            }}
            className={cn(
              "px-4 py-2.5 font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 cursor-pointer shrink-0",
              activeTab === "CUSTOMIZE"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Palette className="h-4 w-4" />
            <span>Template & Signatures Customizer</span>
            <Badge className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.2">
              {activeTab === "CUSTOMIZE" && isCustomizerCollapsed ? "Collapsed" : "Super Admin"}
            </Badge>
            {activeTab === "CUSTOMIZE" && (
              isCustomizerCollapsed ? (
                <ChevronDown className="h-3.5 w-3.5 text-primary" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5 text-primary" />
              )
            )}
          </button>
        )}
      </div>

      {/* =========================================================================
          TAB 1: CREDENTIALS REGISTRY (WITH COMPREHENSIVE FILTERS & SORTING)
         ========================================================================= */}
      {activeTab === "MY_CERTS" && (
        <div className="space-y-4">
          {/* Advanced Filter Toolbar */}
          <Card className="p-4 rounded-2xl border-border bg-card shadow-2xs space-y-3">
            {/* Search and Sort Row */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by candidate name, certificate number (e.g. LTA-DIP-2025-...), title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9.5 h-10 text-xs rounded-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                  <span>Sort:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-10 text-xs font-semibold rounded-xl border border-input bg-background px-3 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="DATE_DESC">Newest Issued / Applied</option>
                  <option value="DATE_ASC">Oldest Date</option>
                  <option value="NAME_ASC">Candidate Name (A → Z)</option>
                  <option value="NAME_DESC">Candidate Name (Z → A)</option>
                  <option value="GRADE_DESC">Highest Grade</option>
                  <option value="CERT_NUM_ASC">Certificate Number</option>
                </select>
              </div>
            </div>

            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Status:</span>
                </span>
                {[
                  { id: "ALL", label: "All Statuses" },
                  { id: "APPROVED", label: "Approved & Conferred" },
                  { id: "PENDING", label: "Pending Review" },
                  { id: "REJECTED", label: "Declined" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      statusFilter === s.id
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground">Program:</span>
                <select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="h-8 text-xs font-medium rounded-lg border border-input bg-background px-2 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="ALL">All Programs</option>
                  <option value="DIPLOMA">Diploma (SMFB)</option>
                  <option value="BSC">B.Sc. Health Tech</option>
                </select>

                <span className="text-xs font-semibold text-muted-foreground ml-1">Year:</span>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="h-8 text-xs font-medium rounded-lg border border-input bg-background px-2 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="ALL">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>

                {(statusFilter !== "ALL" || programFilter !== "ALL" || yearFilter !== "ALL" || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter("ALL");
                      setProgramFilter("ALL");
                      setYearFilter("ALL");
                      setSearchQuery("");
                      setSortBy("DATE_DESC");
                    }}
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Reset All
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Cards Grid */}
          {filteredCertificates.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground text-xs sm:text-sm space-y-3 rounded-2xl border-border bg-card">
              <Award className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="font-bold text-base text-foreground">No Credentials Match Filters</p>
              <p className="max-w-md mx-auto">
                No certificate records match your selected status, program, or search query. Try clearing the filters.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCertificates.map((cert) => (
                <Card
                  key={cert.id}
                  className="border-border hover:border-primary/40 transition-all rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between bg-card"
                >
                  <CardHeader className="p-5 pb-3 space-y-2">
                    {/* Certificate Number & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                        <FileBadge className="h-3 w-3" />
                        <span>{cert.certificateNumber}</span>
                      </span>
                      <Badge
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5",
                          cert.status === "APPROVED"
                            ? "bg-emerald-600 text-white"
                            : cert.status === "PENDING"
                            ? "bg-amber-600 text-white animate-pulse"
                            : "bg-destructive text-white"
                        )}
                      >
                        {cert.status === "APPROVED"
                          ? "Approved & Conferred"
                          : cert.status === "PENDING"
                          ? "Pending Super Admin Review"
                          : "Declined"}
                      </Badge>
                    </div>

                    <CardTitle className="text-base font-bold line-clamp-2 leading-snug">
                      {cert.title}
                    </CardTitle>

                    <CardDescription className="text-xs space-y-1">
                      <div className="text-foreground font-semibold flex items-center justify-between">
                        <span>Candidate: {cert.studentName}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{cert.studentId}</span>
                      </div>
                      <div className="text-muted-foreground truncate" title={cert.institution}>
                        {cert.institution}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-primary font-bold">{cert.program} Year {cert.year}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{cert.grade}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 border-t border-border/60 bg-muted/20 space-y-3 mt-3">
                    {/* Feedback if declined */}
                    {cert.status === "REJECTED" && cert.feedback && (
                      <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1 mt-2">
                        <div className="font-bold flex items-center gap-1">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Declined by {cert.reviewedBy || "Super Administrator"}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-foreground/80">{cert.feedback}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {cert.status === "APPROVED"
                          ? `Issued: ${cert.issuedDate || cert.applicationDate}`
                          : `Applied: ${cert.applicationDate}`}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCertForPreview(cert)}
                          className="h-8 text-xs font-semibold rounded-lg gap-1 border-border cursor-pointer hover:bg-muted"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{cert.status === "APPROVED" ? "View Certificate" : "Preview Watermark"}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: APPLY FOR CERTIFICATE (STUDENT WORKFLOW & ADMIN TESTING)
         ========================================================================= */}
      {activeTab === "APPLY" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Real-time curriculum audit */}
          <Card className="border-border rounded-2xl shadow-2xs overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-border bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span>Real-Time Study Center Task & Competency Audit</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    State Medical Faculty of Bangladesh (SMFB) requires verified completion of all curriculum tasks & laboratory SOPs before certificate application.
                  </CardDescription>
                </div>
                <Badge
                  variant={eligibility.isEligible ? "default" : "outline"}
                  className={cn(
                    "text-xs font-bold px-3 py-1 self-start sm:self-auto",
                    eligibility.isEligible
                      ? "bg-emerald-600 text-white"
                      : "text-amber-600 border-amber-500/40 bg-amber-500/10"
                  )}
                >
                  {eligibility.isEligible ? "Eligibility Verified (100%)" : `${eligibility.completionPct}% Completed`}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-muted-foreground block text-[11px]">Tasks Completed</span>
                  <span className="text-xl font-black text-foreground">
                    {eligibility.completedTasksCount} / {eligibility.totalTasksCount}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-muted-foreground block text-[11px]">Subjects Cleared</span>
                  <span className="text-xl font-black text-foreground">
                    {eligibility.completedSubjectsCount} / {eligibility.totalSubjectsCount}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-muted-foreground block text-[11px]">Cumulative Score</span>
                  <span className="text-xl font-black text-primary">{eligibility.cumulativeScore}%</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-muted-foreground block text-[11px]">Recommended Grade</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {eligibility.recommendedGrade}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Curriculum Completion Benchmark</span>
                  <span className="font-bold text-primary">{eligibility.completionPct}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      eligibility.isEligible ? "bg-emerald-600" : "bg-primary"
                    )}
                    style={{ width: `${eligibility.completionPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Enrolled Subject Task Status</span>
                  <span className="text-[11px] normal-case font-normal text-muted-foreground">
                    Click any incomplete task to simulate completion for testing
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {eligibility.subjects.map((subj) => (
                    <div
                      key={subj.code}
                      onClick={() => !subj.isCompleted && completeTask(subj.code)}
                      className={cn(
                        "p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all",
                        subj.isCompleted
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : "bg-muted/30 border-border hover:border-primary/50 cursor-pointer"
                      )}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-bold">
                            {subj.code}
                          </span>
                          <span className="font-bold text-foreground truncate">{subj.name}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {subj.completedTasks} / {subj.totalTasks} Tasks • Quiz Avg: {subj.avgQuizScore}%
                        </div>
                      </div>

                      <div className="shrink-0">
                        {subj.isCompleted ? (
                          <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-semibold text-primary hover:underline px-2 py-1 rounded bg-primary/10">
                            + Complete
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/80">
                <div className="text-xs text-muted-foreground">
                  {eligibility.isEligible ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      All subjects passed! You can preview the protected watermark certificate below.
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Remaining: {eligibility.missingRequirements.length} subjects still have incomplete tasks.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!eligibility.isEligible ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={completeAllTasks}
                      className="text-xs rounded-xl h-8 gap-1.5 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Complete All Tasks for Testing</span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={resetProgress}
                      className="text-xs rounded-xl h-8 gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset Progress</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Details Form */}
          <Card className={cn(
            "rounded-2xl border-border shadow-2xs transition-opacity",
            !eligibility.isEligible ? "opacity-60 pointer-events-none" : ""
          )}>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Student Credential Application Details</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Step 1: Confirm your student registration and curriculum records. Step 2: Preview your certificate with security watermarks before submitting.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0">
              <form onSubmit={handleOpenWatermarkPreview} className="space-y-4 text-xs sm:text-sm">
                {/* 1. STUDENT REGISTRATION & ENROLLMENT (STUDENT CAN CHOOSE & ADD THESE) */}
                <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>Academic Program & Candidate Identity</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30 bg-primary/5 font-semibold">
                      Student Selectable
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground flex items-center justify-between">
                        <span>Program Level <span className="text-destructive">*</span></span>
                      </label>
                      <select
                        value={applyForm.program}
                        onChange={(e) => {
                          const newProg = e.target.value as ProgramLevel;
                          const tpl = getTemplateForProgramAndYear(newProg, applyForm.year);
                          setApplyForm((prev) => ({
                            ...prev,
                            program: newProg,
                            title: tpl?.title || prev.title,
                            institution: tpl?.institution || prev.institution,
                          }));
                        }}
                        className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs sm:text-sm font-semibold focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                      >
                        <option value="BSC">B.Sc. in Medical Laboratory Technology</option>
                        <option value="DIPLOMA">Diploma in Medical Laboratory Technology</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground flex items-center justify-between">
                        <span>Enrolled Academic Year <span className="text-destructive">*</span></span>
                      </label>
                      <select
                        value={applyForm.year}
                        onChange={(e) => {
                          const newYear = e.target.value;
                          const tpl = getTemplateForProgramAndYear(applyForm.program, newYear);
                          setApplyForm((prev) => ({
                            ...prev,
                            year: newYear,
                            title: tpl?.title || prev.title,
                            institution: tpl?.institution || prev.institution,
                          }));
                        }}
                        className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs sm:text-sm font-semibold focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                      >
                        <option value="4">4th Year (Internship & Degree)</option>
                        <option value="1">1st Year (Foundation & Pre-Analytical)</option>
                        <option value="2">2nd Year (Core Pathology & Clinical Bench)</option>
                        <option value="3">3rd Year (Advanced Diagnostics & Blood Banking)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-foreground">
                        Candidate Full Name <span className="text-destructive">*</span>
                      </label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Student ID: {currentStudentId}
                      </span>
                    </div>
                    <Input
                      value={applyForm.candidateName}
                      onChange={(e) => setApplyForm({ ...applyForm, candidateName: e.target.value })}
                      placeholder="Candidate Full Name (as it will appear on certificate)"
                      required
                      className="h-10 rounded-xl bg-background font-semibold"
                    />
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Student can edit and specify their full legal name as it should appear on the official certificate.</span>
                    </p>
                  </div>
                </div>

                {/* 2. SUPER ADMIN GENERATED CERTIFICATE TEMPLATE DETAILS */}
                <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span>Super Admin Certificate Template Specification</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-bold flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      <span>Super Admin Approved Template</span>
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-foreground">
                        Certificate Title / Competency Focus <span className="text-destructive">*</span>
                      </label>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {applyForm.program} Year {applyForm.year} Template
                      </Badge>
                    </div>
                    <Input
                      value={applyForm.title}
                      readOnly={!isSuperOrAdmin}
                      onChange={(e) => setApplyForm({ ...applyForm, title: e.target.value })}
                      required
                      className={cn(
                        "h-10 rounded-xl font-medium",
                        !isSuperOrAdmin ? "bg-muted/40 cursor-default text-foreground" : "bg-background"
                      )}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Automatically populated from official certificate templates configured by Super Admin for {applyForm.program === "BSC" ? "B.Sc." : "Diploma"} (Year {applyForm.year}).
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-foreground">
                        Affiliated Institute / Medical College <span className="text-destructive">*</span>
                      </label>
                      <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>Registered Institution</span>
                      </Badge>
                    </div>
                    <Input
                      value={applyForm.institution}
                      readOnly={!isSuperOrAdmin}
                      onChange={(e) => setApplyForm({ ...applyForm, institution: e.target.value })}
                      required
                      className={cn(
                        "h-10 rounded-xl font-medium",
                        !isSuperOrAdmin ? "bg-muted/40 cursor-default text-foreground" : "bg-background"
                      )}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Conferring authority and affiliated institution set by Super Admin.
                    </p>
                  </div>
                </div>

                {/* 3. PERFORMANCE / GRADE (AUTO-FILLED, LOCKED FOR STUDENT, EDITABLE BY ADMIN & SUPER ADMIN) */}
                <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      <span>Verified Academic & Practical Performance</span>
                    </span>
                    {isSuperOrAdmin ? (
                      <Badge className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-2xs">
                        <Sparkles className="h-3 w-3" />
                        <span>Admin Override Enabled</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground border-border text-[10px] font-semibold flex items-center gap-1 bg-muted/30">
                        <Lock className="h-3 w-3" />
                        <span>Student Locked</span>
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-foreground flex items-center gap-1.5">
                        <span>Performance / Grade</span>
                        <span className="text-destructive">*</span>
                      </label>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        Calculated Avg: {eligibility.cumulativeScore}%
                      </span>
                    </div>
                    <Input
                      value={applyForm.grade}
                      readOnly={!isSuperOrAdmin}
                      disabled={!isSuperOrAdmin}
                      onChange={(e) => setApplyForm({ ...applyForm, grade: e.target.value })}
                      required
                      className={cn(
                        "h-10 rounded-xl font-bold text-sm",
                        isSuperOrAdmin
                          ? "bg-background text-primary border-primary/50"
                          : "bg-muted/60 text-foreground cursor-not-allowed border-muted-foreground/30 opacity-90"
                      )}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-muted-foreground pt-0.5">
                      <span>
                        {isSuperOrAdmin
                          ? "Super Administrator / Admin Authority: You can edit or calibrate the candidate grade prior to conferral."
                          : `Auto-filled from student course performance (${eligibility.cumulativeScore}% avg across study tasks & laboratory SOPs). Cannot be changed by student.`}
                      </span>
                      {isSuperOrAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            const calculatedGrade =
                              eligibility.recommendedGrade ||
                              (eligibility.cumulativeScore ? `Distinction (${eligibility.cumulativeScore}%)` : "Distinction (92.5%)");
                            setApplyForm((prev) => ({ ...prev, grade: calculatedGrade }));
                          }}
                          className="text-primary hover:underline font-bold cursor-pointer shrink-0"
                        >
                          Reset to Auto-Grade
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. VERIFICATION GOVERNANCE & PREVIEW SUBMIT */}
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Verification Governance</span>
                  </p>
                  <p>
                    Upon submitting, this application enters the Super Admin verification queue with your verified Study Center logs, quiz metrics, and bench SOP assessments.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Next step: Preview certificate with security watermarks before submitting.
                  </span>
                  <Button
                    type="submit"
                    disabled={!eligibility.isEligible}
                    className="gap-2 rounded-xl h-10 px-5 font-semibold bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 cursor-pointer w-full sm:w-auto"
                  >
                    <span>Preview Certificate with Protection Watermark</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 3: REVIEW APPLICATIONS (SUPER ADMIN & ADMIN ONLY)
         ========================================================================= */}
      {isSuperOrAdmin && activeTab === "REVIEW" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Pending Candidate Applications ({pendingCerts.length})
              </h2>
              <span className="text-xs text-muted-foreground">
                Super Administrator Authority: Review Study Center records, inspect watermark preview, and confer or decline credentials.
              </span>
            </div>
            {pendingCerts.length > 0 && (
              <Badge className="bg-amber-600 text-white text-xs px-2.5 py-0.5 animate-pulse self-start sm:self-auto">
                Action Required
              </Badge>
            )}
          </div>

          {pendingCerts.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground text-xs sm:text-sm space-y-2 rounded-2xl border-border bg-card">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-base text-foreground">All caught up!</p>
              <p>There are no pending certificate applications requiring review at this time.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingCerts.map((cert) => {
                const candidateAudit = checkEnrollmentEligibility(cert.studentId, cert.program, cert.year);
                return (
                  <Card key={cert.id} className="border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-card to-card p-4 sm:p-5 rounded-2xl shadow-2xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-amber-600 border-amber-500/40 bg-amber-500/10 text-xs font-semibold px-2.5 py-0.5">
                            Pending Review
                          </Badge>
                          <span className="text-xs font-mono font-bold text-muted-foreground">{cert.code}</span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            Cert No: {cert.certificateNumber}
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-foreground">{cert.title}</h3>
                        <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                          <span>Candidate: <strong className="text-foreground">{cert.studentName}</strong></span>
                          <span>Program: <strong>{cert.program} Year {cert.year}</strong></span>
                          <span>Institute: <strong>{cert.institution}</strong></span>
                          <span>Grade: <strong className="text-primary font-bold">{cert.grade}</strong></span>
                        </div>

                        {/* Live Academic Audit & Telemetry Badge Row */}
                        <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
                          <span className="font-semibold text-muted-foreground flex items-center gap-1">
                            <Activity className="h-3 w-3 text-primary" />
                            <span>Study Center Audit:</span>
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                              candidateAudit.isEligible
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            )}
                          >
                            {candidateAudit.isEligible ? "100% Tasks Complete (Eligible)" : `${candidateAudit.completedTasksCount}/${candidateAudit.totalTasksCount} Tasks (${candidateAudit.completionPct}%)`}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
                            Avg Quiz: {candidateAudit.cumulativeScore}%
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30">
                            Grade: {candidateAudit.recommendedGrade}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons with User Analytics Prominently Highlighted */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAnalyticsCandidateCert(cert);
                            setAnalyticsTab("ANALYTICS");
                            setActivitySearchQuery("");
                          }}
                          className="h-9 text-xs sm:text-sm font-bold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border-primary/40 gap-1.5 shadow-2xs cursor-pointer"
                          title="Open student learning analytics & diagnostic dossier"
                        >
                          <BarChart3 className="h-4 w-4" />
                          <span>User Analytics</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCertForPreview(cert)}
                          className="h-9 text-xs sm:text-sm font-semibold rounded-xl gap-1.5 cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Preview Watermark</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setDecliningCert(cert);
                            setDeclineReason("");
                          }}
                          className="h-9 text-xs sm:text-sm font-semibold rounded-xl text-destructive hover:bg-destructive/10 gap-1.5 border-destructive/30 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                          <span>Decline</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReviewAction(cert.id, "APPROVED")}
                          className="h-9 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                          <span>Approve & Issue</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: SUPER ADMIN CERTIFICATE CUSTOMIZER & LIVE REAL-TIME PREVIEW
         ========================================================================= */}
      {isSuperOrAdmin && activeTab === "CUSTOMIZE" && (
        <div className="space-y-5">
          {/* Collapsible Banner if Studio Controls are Collapsed */}
          {isCustomizerCollapsed && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      Certificate Customization Studio (Collapsed)
                    </h3>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
                      Controls Hidden
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30 bg-primary/5">
                      US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Template: <span className="font-semibold text-foreground">{COLOR_PRESETS[customizerState.colorPreset]?.label || customizerState.colorPreset}</span> • Font: <span className="font-semibold text-foreground">{customizerState.fontFamily}</span> • Tone: <span className="font-semibold text-foreground">{customizerState.paperTone}</span> • Orientation: <span className="font-semibold text-foreground">{customizerState.orientation || "LANDSCAPE"}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetTemplateConfig}
                  className="text-xs h-9 px-3 text-muted-foreground hover:text-foreground"
                >
                  Reset Defaults
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsCustomizerCollapsed(false)}
                  className="text-xs h-9 px-4 font-semibold gap-1.5 rounded-xl shadow-2xs"
                >
                  <ChevronDown className="h-4 w-4" />
                  <span>Expand Studio Controls</span>
                </Button>
              </div>
            </div>
          )}

          <div className={cn("grid gap-6", isCustomizerCollapsed ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12")}>
            {/* Controls Column (Left) - Hidden when Collapsed */}
            {!isCustomizerCollapsed && (
              <div className="lg:col-span-6 space-y-5">
                <Card className="border-border rounded-3xl shadow-2xs">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Palette className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base sm:text-lg font-bold">
                            Certificate Customization Studio
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Configure color templates, typography, US Letter orientation, seal, and digital signatures.
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsCustomizerCollapsed(true)}
                          className="text-xs text-foreground h-8 px-2.5 gap-1 rounded-lg hover:bg-muted"
                          title="Collapse studio controls to view full-width certificate"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                          <span>Collapse</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={resetTemplateConfig}
                          className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0">
                    <form onSubmit={handleSaveTemplateSettings} className="space-y-5 text-xs sm:text-sm">
                      {/* 1. COLOR TEMPLATES PRESETS */}
                      <div className="space-y-2">
                        <label className="font-bold text-foreground flex items-center gap-1.5">
                          <Palette className="h-4 w-4 text-primary" />
                          <span>Select Color Template Preset</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {(Object.keys(COLOR_PRESETS) as ColorPreset[]).map((key) => {
                            const preset = COLOR_PRESETS[key];
                            const isSelected = customizerState.colorPreset === key;
                            return (
                              <div
                                key={key}
                                onClick={() => handlePresetSelect(key)}
                                className={cn(
                                  "p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-2",
                                  isSelected
                                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                    : "border-border bg-muted/20 hover:border-border/80"
                                )}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="h-4 w-4 rounded-full border shadow-2xs"
                                    style={{ backgroundColor: preset.primary }}
                                  />
                                  <span
                                    className="h-4 w-4 rounded-full border shadow-2xs"
                                    style={{ backgroundColor: preset.secondary }}
                                  />
                                  <span
                                    className="h-4 w-4 rounded-full border shadow-2xs"
                                    style={{ backgroundColor: preset.accent }}
                                  />
                                </div>
                                <span className="font-bold text-[11px] text-foreground truncate">
                                  {preset.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. CUSTOM COLOR PICKERS */}
                      <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-muted/30 border border-border">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-muted-foreground block">Primary Color</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={customizerState.primaryColor}
                              onChange={(e) =>
                                setCustomizerState({
                                  ...customizerState,
                                  colorPreset: "CUSTOM",
                                  primaryColor: e.target.value,
                                })
                              }
                              className="h-8 w-10 rounded-lg cursor-pointer border p-0.5 bg-background"
                            />
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {customizerState.primaryColor}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-muted-foreground block">Secondary</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={customizerState.secondaryColor}
                              onChange={(e) =>
                                setCustomizerState({
                                  ...customizerState,
                                  colorPreset: "CUSTOM",
                                  secondaryColor: e.target.value,
                                })
                              }
                              className="h-8 w-10 rounded-lg cursor-pointer border p-0.5 bg-background"
                            />
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {customizerState.secondaryColor}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-muted-foreground block">Accent / Seal</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={customizerState.accentColor}
                              onChange={(e) =>
                                setCustomizerState({
                                  ...customizerState,
                                  colorPreset: "CUSTOM",
                                  accentColor: e.target.value,
                                })
                              }
                              className="h-8 w-10 rounded-lg cursor-pointer border p-0.5 bg-background"
                            />
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {customizerState.accentColor}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. DOCUMENT STANDARD & ORIENTATION */}
                      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-foreground text-xs flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-primary" />
                            <span>Document Standard & Page Size</span>
                          </label>
                          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5">
                            US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() =>
                              setCustomizerState({
                                ...customizerState,
                                orientation: "LANDSCAPE",
                              })
                            }
                            className={cn(
                              "p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer flex flex-col items-center gap-1",
                              customizerState.orientation !== "PORTRAIT"
                                ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30 font-bold"
                                : "border-border bg-background text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <span className="text-xs">Landscape (Recommended)</span>
                            <span className="text-[10px] font-mono opacity-80">11 × 8.5 in (27.9 × 21.6 cm)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCustomizerState({
                                ...customizerState,
                                orientation: "PORTRAIT",
                              })
                            }
                            className={cn(
                              "p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer flex flex-col items-center gap-1",
                              customizerState.orientation === "PORTRAIT"
                                ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30 font-bold"
                                : "border-border bg-background text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <span className="text-xs">Portrait</span>
                            <span className="text-[10px] font-mono opacity-80">8.5 × 11 in (21.6 × 27.9 cm)</span>
                          </button>
                        </div>
                      </div>

                      {/* 4. FONT FAMILY & PAPER TONE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="font-bold text-foreground flex items-center gap-1.5">
                            <Type className="h-4 w-4 text-primary" />
                            <span>Font Family</span>
                          </label>
                          <select
                            value={customizerState.fontFamily}
                            onChange={(e) =>
                              setCustomizerState({
                                ...customizerState,
                                fontFamily: e.target.value as CertFontFamily,
                              })
                            }
                            className="w-full h-10 rounded-xl border border-input bg-background px-3 font-semibold focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                          >
                            <option value="SERIF_CLASSIC">Classic Serif (Times / Merriweather)</option>
                            <option value="SANS_MODERN">Modern Sans (Plus Jakarta Sans)</option>
                            <option value="CALLIGRAPHIC_PRESTIGE">Calligraphic Prestige (Italic Serif)</option>
                            <option value="MONO_FORMAL">Formal Monospace (Security Registry)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-foreground flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-primary" />
                            <span>Paper Texture & Tone</span>
                          </label>
                          <select
                            value={customizerState.paperTone}
                            onChange={(e) =>
                              setCustomizerState({
                                ...customizerState,
                                paperTone: e.target.value as any,
                              })
                            }
                            className="w-full h-10 rounded-xl border border-input bg-background px-3 font-semibold focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                          >
                            <option value="IVORY_PARCHMENT">Ivory Parchment (Official Traditional)</option>
                            <option value="PURE_WHITE">Pure Clinical White</option>
                            <option value="ANTIQUE_LINEN">Antique Linen Tone</option>
                          </select>
                        </div>
                      </div>

                      {/* 5. BORDER STYLING */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-foreground">Border Frame Styling</label>
                        <select
                          value={customizerState.borderStyle}
                          onChange={(e) =>
                            setCustomizerState({
                              ...customizerState,
                              borderStyle: e.target.value as CertBorderStyle,
                            })
                          }
                          className="w-full h-10 rounded-xl border border-input bg-background px-3 font-semibold focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                        >
                          <option value="EMERALD_CLINICAL">Emerald Clinical (DGHS Double Inset)</option>
                          <option value="CLASSIC_GOLD">Classic Gold Foil (Faculty Honors Double Frame)</option>
                          <option value="MINIMALIST_NAVY">Minimalist Navy (Executive High-Contrast)</option>
                          <option value="ORNATE_VINTAGE">Ornate Vintage Crest (Deep Crimson Frame)</option>
                          <option value="SECURITY_GUILLOCHE">Security Guilloche (Dashed Cryptographic Frame)</option>
                        </select>
                      </div>

                      {/* 6. INSTITUTIONAL WATERMARK LOGO & OPACITY */}
                      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-foreground text-xs flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span>Institutional Watermark Logo (Center)</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              Opacity: {Math.round((customizerState.watermarkLogoOpacity ?? 0.18) * 100)}%
                            </span>
                            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5">
                              15% - 20% Optimal
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Mini logo preview thumbnail */}
                          <div className="h-12 w-12 rounded-xl border bg-white flex items-center justify-center p-1 shrink-0 shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={customizerState.watermarkLogoUrl || "/images/certificate-watermark-logo.png"}
                              alt="Logo"
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground">Watermark Opacity:</span>
                              <div className="flex items-center gap-1.5">
                                {[0.15, 0.18, 0.2].map((op) => (
                                  <button
                                    key={op}
                                    type="button"
                                    onClick={() =>
                                      setCustomizerState({
                                        ...customizerState,
                                        watermarkLogoOpacity: op,
                                      })
                                    }
                                    className={cn(
                                      "px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer",
                                      Math.abs((customizerState.watermarkLogoOpacity ?? 0.18) - op) < 0.005
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    {Math.round(op * 100)}%
                                  </button>
                                ))}
                              </div>
                            </div>

                            <input
                              type="range"
                              min="0.08"
                              max="0.30"
                              step="0.01"
                              value={customizerState.watermarkLogoOpacity ?? 0.18}
                              onChange={(e) =>
                                setCustomizerState({
                                  ...customizerState,
                                  watermarkLogoOpacity: parseFloat(e.target.value),
                                })
                              }
                              className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 7. AUTHORITY & SEAL */}
                      <div className="space-y-3 pt-2 border-t border-border">
                        <div className="space-y-1.5">
                          <label className="font-bold text-foreground">Conferring Authority Name</label>
                          <Input
                            value={customizerState.institutionName}
                            onChange={(e) =>
                              setCustomizerState({ ...customizerState, institutionName: e.target.value })
                            }
                            required
                            className="h-10 rounded-xl font-medium"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-foreground">Subheading / Registry Designation</label>
                          <Input
                            value={customizerState.subHeader}
                            onChange={(e) =>
                              setCustomizerState({ ...customizerState, subHeader: e.target.value })
                            }
                            required
                            className="h-10 rounded-xl font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="font-bold text-foreground">Seal Legend / Motto</label>
                            <Input
                              value={customizerState.sealText}
                              onChange={(e) =>
                                setCustomizerState({ ...customizerState, sealText: e.target.value })
                              }
                              className="h-10 rounded-xl text-xs"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-bold text-foreground">Seal Icon Crest</label>
                            <select
                              value={customizerState.sealIcon}
                              onChange={(e) =>
                                setCustomizerState({ ...customizerState, sealIcon: e.target.value as any })
                              }
                              className="w-full h-10 rounded-xl border border-input bg-background px-3 font-semibold text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            >
                              <option value="SHIELD">Shield Crest</option>
                              <option value="AWARD">Academic Star Award</option>
                              <option value="CADUCEUS">Medical Caduceus</option>
                              <option value="MICROSCOPE">Clinical Microscope</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 7. DIGITAL SIGNATURES & OFFICIALS */}
                      <div className="space-y-4 pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-foreground flex items-center gap-1.5">
                            <FileBadge className="h-4 w-4 text-primary" />
                            <span>Signatories & Digital Signatures</span>
                          </label>
                          <Badge variant="outline" className="text-[10px]">
                            PNG / SVG Signature Files
                          </Badge>
                        </div>

                        {/* Signatory 1 */}
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-2.5">
                          <span className="text-xs font-bold text-foreground">Signatory 1 (Primary Academic)</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                              placeholder="Full Name & Degrees (e.g. Dr. Rafiqul Islam, FCPS)"
                              value={customizerState.signatoryName1}
                              onChange={(e) =>
                                setCustomizerState({ ...customizerState, signatoryName1: e.target.value })
                              }
                              className="h-9 text-xs rounded-xl"
                            />
                            <Input
                              placeholder="Title / Office (e.g. Academic Council Chairman)"
                              value={customizerState.signatoryTitle1}
                              onChange={(e) =>
                                setCustomizerState({ ...customizerState, signatoryTitle1: e.target.value })
                              }
                              className="h-9 text-xs rounded-xl"
                            />
                          </div>

                          {/* Upload or remove signature 1 */}
                          <div className="flex items-center justify-between gap-3 pt-1">
                            <div className="flex items-center gap-2">
                              {customizerState.signatorySignature1 ? (
                                <div className="h-9 px-3 rounded-lg border bg-white flex items-center justify-center">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={customizerState.signatorySignature1}
                                    alt="Signatory 1 signature preview"
                                    className="h-7 max-w-[80px] object-contain"
                                  />
                                </div>
                              ) : (
                                <span className="text-[11px] font-serif italic text-muted-foreground">
                                  {customizerState.signatoryName1} (e-Signature script active)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <label className="h-8 px-3 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-primary/10">
                                <Upload className="h-3.5 w-3.5" />
                                <span>Upload PNG</span>
                                <input
                                  type="file"
                                  accept="image/png,image/svg+xml,image/jpeg"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleSignatureUpload(file, 1);
                                  }}
                                />
                              </label>
                              {customizerState.signatorySignature1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setCustomizerState({ ...customizerState, signatorySignature1: "" })
                                  }
                                  className="h-8 px-2 text-destructive text-xs"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Signatory 2 */}
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-2.5">
                          <span className="text-xs font-bold text-foreground">Signatory 2 (Clinical Director)</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                              placeholder="Full Name & Degrees (e.g. Prof. Nasreen Akhter, M.Phil)"
                              value={customizerState.signatoryName2}
                              onChange={(e) =>
                                setCustomizerState({ ...customizerState, signatoryName2: e.target.value })
                              }
                              className="h-9 text-xs rounded-xl"
                            />
                            <Input
                              placeholder="Title / Office (e.g. Clinical Director)"
                              value={customizerState.signatoryTitle2}
                              onChange={(e) =>
                                setCustomizerState({ ...customizerState, signatoryTitle2: e.target.value })
                              }
                              className="h-9 text-xs rounded-xl"
                            />
                          </div>

                          {/* Upload or remove signature 2 */}
                          <div className="flex items-center justify-between gap-3 pt-1">
                            <div className="flex items-center gap-2">
                              {customizerState.signatorySignature2 ? (
                                <div className="h-9 px-3 rounded-lg border bg-white flex items-center justify-center">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={customizerState.signatorySignature2}
                                    alt="Signatory 2 signature preview"
                                    className="h-7 max-w-[80px] object-contain"
                                  />
                                </div>
                              ) : (
                                <span className="text-[11px] font-serif italic text-muted-foreground">
                                  {customizerState.signatoryName2} (e-Signature script active)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <label className="h-8 px-3 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-primary/10">
                                <Upload className="h-3.5 w-3.5" />
                                <span>Upload PNG</span>
                                <input
                                  type="file"
                                  accept="image/png,image/svg+xml,image/jpeg"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleSignatureUpload(file, 2);
                                  }}
                                />
                              </label>
                              {customizerState.signatorySignature2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setCustomizerState({ ...customizerState, signatorySignature2: "" })
                                  }
                                  className="h-8 px-2 text-destructive text-xs"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        {templateSavedMsg ? (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            Template Saved to Registry!
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Preview updates live on the right.
                          </span>
                        )}
                        <Button
                          type="submit"
                          className="rounded-xl h-10 px-5 font-semibold bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 cursor-pointer"
                        >
                          Save Template & Signatures
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* SUPER ADMIN GENERATED CERTIFICATE TEMPLATES (CURRICULUM MAPPING) */}
                <Card className="border-border rounded-3xl shadow-2xs">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold">
                            Curriculum Certificate Templates
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Define the Certificate Title and Institute that auto-fill when candidates apply by program and year.
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          resetAdminTemplates();
                          showNotification({
                            type: "info",
                            title: "Templates Reset",
                            message: "Reset all certificate templates to default DGHS & SMFB benchmarks.",
                          });
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground h-8 px-2 cursor-pointer"
                      >
                        Reset Defaults
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAdminTplProg("BSC")}
                        className={cn(
                          "py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center",
                          selectedAdminTplProg === "BSC"
                            ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                            : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        B.Sc. in Health Technology (4 Years)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedAdminTplProg("DIPLOMA")}
                        className={cn(
                          "py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center",
                          selectedAdminTplProg === "DIPLOMA"
                            ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                            : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Diploma in MLT (SMFB - 4 Years)
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {["1", "2", "3", "4"].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setSelectedAdminTplYear(yr)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0",
                            selectedAdminTplYear === yr
                              ? "bg-primary/10 text-primary border border-primary/30 font-bold"
                              : "bg-muted/30 border border-transparent text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Year {yr}
                        </button>
                      ))}
                    </div>

                    {/* Template Editor Box */}
                    {activeAdminTemplate && (
                      <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
                        <div className="space-y-1">
                          <label className="font-bold text-foreground text-xs">
                            Certificate Title / Competency Focus
                          </label>
                          <Input
                            value={adminTplEditTitle}
                            onChange={(e) => setAdminTplEditTitle(e.target.value)}
                            className="h-9 text-xs rounded-xl font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-foreground text-xs">
                            Affiliated Institute / Medical College
                          </label>
                          <Input
                            value={adminTplEditInst}
                            onChange={(e) => setAdminTplEditInst(e.target.value)}
                            className="h-9 text-xs rounded-xl font-medium"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-muted-foreground">
                            Target: {selectedAdminTplProg === "BSC" ? "B.Sc." : "Diploma"} Year {selectedAdminTplYear}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              updateAdminTemplate(activeAdminTemplate.id, {
                                title: adminTplEditTitle,
                                institution: adminTplEditInst,
                              });
                              showNotification({
                                type: "success",
                                title: "Template Updated",
                                message: `Saved Super Admin template for ${selectedAdminTplProg} Year ${selectedAdminTplYear}.`,
                              });
                            }}
                            className="h-8 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                          >
                            Save Template for Year {selectedAdminTplYear}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Live Preview Column */}
            <div className={cn("space-y-3", isCustomizerCollapsed ? "lg:col-span-12 max-w-5xl mx-auto w-full" : "lg:col-span-6")}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-primary" />
                  <span>Live Interactive Certificate Preview</span>
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5">
                    US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
                  </Badge>
                  {isCustomizerCollapsed && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCustomizerCollapsed(false)}
                      className="h-7 px-2.5 text-xs font-medium gap-1 rounded-lg"
                    >
                      <Sliders className="h-3 w-3" />
                      <span>Edit Controls</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Live Certificate Card Container */}
              <div
                className={cn(
                  "rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden transition-all flex flex-col justify-between shadow-md mx-auto",
                  customizerState.orientation === "PORTRAIT"
                    ? "aspect-[8.5/11] max-w-[620px] min-h-[660px]"
                    : "aspect-[11/8.5] max-w-[960px] min-h-[520px]",
                  getPaperToneClass(customizerState.paperTone),
                  getBorderStyleClasses(customizerState.borderStyle, customizerState.primaryColor),
                  getFontFamilyClass(customizerState.fontFamily)
                )}
              >
                {/* Dimensions watermark pill */}
                <div className="absolute top-2 right-4 z-10 pointer-events-none opacity-50 text-[9px] font-mono select-none">
                  US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
                </div>

                {/* CENTRAL LABTUTOR ACADEMY LOGO WATERMARK */}
                {(customizerState.showCenterLogoWatermark ?? true) && (
                  <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={customizerState.watermarkLogoUrl || "/images/certificate-watermark-logo.png"}
                      alt="LabTutor Academy Watermark"
                      className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain transition-opacity duration-200"
                      style={{
                        opacity: customizerState.watermarkLogoOpacity ?? 0.18,
                      }}
                    />
                  </div>
                )}

                <div className="text-center space-y-3 relative z-10">
                  {/* Emblem */}
                  <div className="flex justify-center">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: customizerState.primaryColor }}
                    >
                      <Award className="h-7 w-7" />
                    </div>
                  </div>

                  {/* Institution Heading */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900">
                      {customizerState.institutionName}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-widest mt-0.5">
                      {customizerState.subHeader}
                    </p>
                  </div>

                  <div className="py-1">
                    <span
                      className="text-xs sm:text-sm tracking-widest font-bold uppercase pb-1 border-b-2"
                      style={{
                        color: customizerState.primaryColor,
                        borderColor: customizerState.primaryColor,
                      }}
                    >
                      Certificate of Competency & Academic Achievement
                    </span>
                  </div>

                  <p className="text-xs italic text-slate-600">This is to officially certify that</p>

                  {/* Candidate Name */}
                  <h2
                    className="text-xl sm:text-2xl font-bold underline underline-offset-8 decoration-2"
                    style={{ textDecorationColor: customizerState.primaryColor }}
                  >
                    Md. Ansarul Islam
                  </h2>

                  <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
                    having studied at <strong>Dhaka Institute of Health Technology (DIHT)</strong>, has successfully fulfilled all clinical benchmark requirements and verified laboratory SOP standards for{" "}
                    <strong>Clinical Pathology, Routine Hematology & Microbiology</strong> in the curriculum of{" "}
                    <strong>Diploma in Medical Laboratory Technology (Year 2)</strong> with an official assessment grade of{" "}
                    <strong style={{ color: customizerState.primaryColor }}>Distinction (92.5%)</strong>.
                  </p>

                  {/* Signatories and Seal */}
                  <div className="pt-6 grid grid-cols-3 items-end gap-2 text-[11px] text-slate-700">
                    {/* Signatory 1 */}
                    <div className="text-center border-t border-slate-300 pt-1.5 flex flex-col items-center">
                      {customizerState.signatorySignature1 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={customizerState.signatorySignature1}
                          alt="Signature 1"
                          className="h-8 max-w-[100px] object-contain mb-1"
                        />
                      ) : (
                        <span className="font-serif italic text-xs text-slate-800 mb-1">
                          {customizerState.signatoryName1.split(",")[0]}
                        </span>
                      )}
                      <p className="font-bold text-slate-900 text-[11px]">{customizerState.signatoryName1}</p>
                      <p className="text-[9.5px] text-slate-500 leading-tight">{customizerState.signatoryTitle1}</p>
                    </div>

                    {/* Official Seal */}
                    <div className="flex flex-col items-center">
                      <div
                        className="h-16 w-16 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-1 text-[8.5px] font-bold text-center leading-tight shadow-sm"
                        style={{
                          borderColor: customizerState.primaryColor,
                          color: customizerState.primaryColor,
                          backgroundColor: `${customizerState.primaryColor}10`,
                        }}
                      >
                        <ShieldCheck className="h-4 w-4 mb-0.5" />
                        <span className="line-clamp-2 uppercase text-[7.5px]">{customizerState.sealText}</span>
                      </div>
                      <span className="text-[9px] font-mono mt-1 text-slate-500 font-bold">
                        LTA-DIP-2026-88412
                      </span>
                    </div>

                    {/* Signatory 2 */}
                    <div className="text-center border-t border-slate-300 pt-1.5 flex flex-col items-center">
                      {customizerState.signatorySignature2 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={customizerState.signatorySignature2}
                          alt="Signature 2"
                          className="h-8 max-w-[100px] object-contain mb-1"
                        />
                      ) : (
                        <span className="font-serif italic text-xs text-slate-800 mb-1">
                          {customizerState.signatoryName2.split(",")[0]}
                        </span>
                      )}
                      <p className="font-bold text-slate-900 text-[11px]">{customizerState.signatoryName2}</p>
                      <p className="text-[9.5px] text-slate-500 leading-tight">{customizerState.signatoryTitle2}</p>
                    </div>
                  </div>

                  {/* Footer Metadata */}
                  <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200 font-mono">
                    <span>Issued Date: {new Date().toISOString().split("T")[0]}</span>
                    <span>Certificate ID: LTA-DIP-2026-88412</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: CANDIDATE WATERMARKED PREVIEW (BEFORE SUBMITTING APPLICATION)
          WATERMARK TEXT: "Not Approved by LabTutor Academy"
         ========================================================================= */}
      {candidateWatermarkPreview && (
        <div
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCandidateWatermarkPreview(null);
          }}
        >
          <div className="bg-card border border-border rounded-3xl max-w-4xl lg:max-w-5xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/40 text-xs font-bold px-2.5 py-1">
                  Candidate Pre-Submission Preview (Watermarked)
                </Badge>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  Cert No: {candidateWatermarkPreview.certificateNumber}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5">
                  US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
                </Badge>
              </div>

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

            {/* Render Printable Certificate with WATERMARK OVERLAYS (US Letter Standard) */}
            <div
              className={cn(
                "rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-sm transition-all flex flex-col justify-between mx-auto",
                templateConfig.orientation === "PORTRAIT"
                  ? "aspect-[8.5/11] max-w-[620px] min-h-[660px]"
                  : "aspect-[11/8.5] max-w-[960px] min-h-[520px]",
                getPaperToneClass(templateConfig.paperTone),
                getBorderStyleClasses(templateConfig.borderStyle, templateConfig.primaryColor),
                getFontFamilyClass(templateConfig.fontFamily)
              )}
            >
              {/* Dimensions tag */}
              <div className="absolute top-2 right-4 z-10 pointer-events-none opacity-50 text-[9px] font-mono select-none">
                US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
              </div>
              {/* DIAGONAL WATERMARK REPEATING RIBBONS */}
              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between overflow-hidden select-none opacity-30 dark:opacity-35">
                <div className="w-[160%] -rotate-12 -translate-x-16 -translate-y-8 flex flex-col gap-8">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="text-center font-black tracking-widest text-red-600 text-xs sm:text-sm uppercase whitespace-nowrap"
                    >
                      Not Approved by LabTutor Academy • Not Approved by LabTutor Academy • Not Approved by LabTutor Academy • Not Approved by LabTutor Academy
                    </div>
                  ))}
                </div>
              </div>

              {/* CENTRAL PROTECTION SEAL WATERMARK */}
              <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-4">
                <div className="-rotate-15 border-4 border-red-600/70 rounded-2xl px-6 py-4 bg-white/90 backdrop-blur-xs text-center shadow-2xl max-w-sm">
                  <span className="text-lg sm:text-2xl font-black uppercase tracking-widest text-red-600/90 block">
                    Not Approved by LabTutor Academy
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600/80 block mt-1">
                    UNAUTHORIZED FOR OFFICIAL USE • WATERMARKED FOR SECURITY
                  </span>
                </div>
              </div>

              {/* CENTRAL LABTUTOR ACADEMY LOGO WATERMARK */}
              {(templateConfig.showCenterLogoWatermark ?? true) && (
                <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={templateConfig.watermarkLogoUrl || "/images/certificate-watermark-logo.png"}
                    alt="LabTutor Academy Watermark"
                    className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain transition-opacity duration-200"
                    style={{
                      opacity: templateConfig.watermarkLogoOpacity ?? 0.18,
                    }}
                  />
                </div>
              )}

              {/* CERTIFICATE CONTENT */}
              <div className="text-center space-y-3 sm:space-y-4 relative z-10">
                <div className="flex justify-center">
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: templateConfig.primaryColor }}
                  >
                    <Award className="h-7 w-7" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-slate-900">
                    {templateConfig.institutionName}
                  </h2>
                  <p className="text-xs text-slate-600 uppercase tracking-widest mt-1">
                    {templateConfig.subHeader}
                  </p>
                </div>

                <div className="py-1">
                  <span
                    className="text-xs sm:text-sm tracking-widest font-semibold uppercase pb-1 border-b-2"
                    style={{
                      color: templateConfig.primaryColor,
                      borderColor: templateConfig.primaryColor,
                    }}
                  >
                    Certificate of Competency & Academic Achievement
                  </span>
                </div>

                <p className="text-xs italic text-slate-600">This is to officially certify that</p>

                <h3
                  className="text-xl sm:text-2xl md:text-3xl font-bold underline underline-offset-8"
                  style={{ textDecorationColor: templateConfig.primaryColor }}
                >
                  {candidateWatermarkPreview.studentName}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                  affiliated with <strong>{candidateWatermarkPreview.institution}</strong>, having completed all prescribed syllabus modules and verified clinical bench SOPs, has fulfilled competency criteria for{" "}
                  <strong>{candidateWatermarkPreview.title}</strong> in the curriculum of{" "}
                  <strong>{candidateWatermarkPreview.program} (Year {candidateWatermarkPreview.year})</strong> with an assessment grade of{" "}
                  <strong style={{ color: templateConfig.primaryColor }}>{candidateWatermarkPreview.grade}</strong>.
                </p>

                <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 items-end gap-3 text-xs text-slate-700">
                  <div className="text-center border-t border-slate-300 pt-2 flex flex-col items-center">
                    {templateConfig.signatorySignature1 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={templateConfig.signatorySignature1}
                        alt="Signature 1"
                        className="h-8 max-w-[110px] object-contain mb-1"
                      />
                    ) : (
                      <span className="font-serif italic text-xs text-slate-800 mb-1">
                        {templateConfig.signatoryName1.split(",")[0]}
                      </span>
                    )}
                    <p className="font-bold text-slate-900">{templateConfig.signatoryName1}</p>
                    <p className="text-xs text-slate-600">{templateConfig.signatoryTitle1}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className="h-16 w-16 rounded-full border-2 border-dashed flex items-center justify-center p-1 text-[9px] font-bold text-center leading-tight shadow-xs"
                      style={{
                        borderColor: templateConfig.primaryColor,
                        color: templateConfig.primaryColor,
                        backgroundColor: `${templateConfig.primaryColor}10`,
                      }}
                    >
                      {templateConfig.sealText}
                    </div>
                    <span className="text-[10px] font-mono font-bold mt-1 text-slate-600">
                      {candidateWatermarkPreview.certificateNumber}
                    </span>
                  </div>

                  <div className="text-center border-t border-slate-300 pt-2 flex flex-col items-center">
                    {templateConfig.signatorySignature2 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={templateConfig.signatorySignature2}
                        alt="Signature 2"
                        className="h-8 max-w-[110px] object-contain mb-1"
                      />
                    ) : (
                      <span className="font-serif italic text-xs text-slate-800 mb-1">
                        {templateConfig.signatoryName2.split(",")[0]}
                      </span>
                    )}
                    <p className="font-bold text-slate-900">{templateConfig.signatoryName2}</p>
                    <p className="text-xs text-slate-600">{templateConfig.signatoryTitle2}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-200 font-mono">
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
                  className="rounded-xl h-10 px-5 text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-2xs cursor-pointer"
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
          MODAL 2: OFFICIAL CERTIFICATE VIEW / PRINT (WITH WATERMARK IF NOT APPROVED)
          WATERMARK TEXT: "Not Approved by LabTutor Academy"
         ========================================================================= */}
      {selectedCertForPreview && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCertForPreview(null);
          }}
        >
          <div className="bg-card border border-border rounded-3xl max-w-4xl lg:max-w-5xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative my-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={cn(
                    "text-xs font-semibold px-2.5 py-0.5",
                    selectedCertForPreview.status === "APPROVED"
                      ? "bg-emerald-600 text-white"
                      : selectedCertForPreview.status === "PENDING"
                      ? "bg-amber-600 text-white animate-pulse"
                      : "bg-destructive text-white"
                  )}
                >
                  {selectedCertForPreview.status === "APPROVED"
                    ? "Official Conferred Credential"
                    : selectedCertForPreview.status === "PENDING"
                    ? "Pending Super Admin Verification"
                    : "Declined Application"}
                </Badge>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {selectedCertForPreview.certificateNumber}
                </span>
                {selectedCertForPreview.verificationCode && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    ID: {selectedCertForPreview.verificationCode}
                  </span>
                )}
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5">
                  US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {selectedCertForPreview.status === "APPROVED" && (
                  <Button size="sm" onClick={handlePrint} className="gap-1.5 h-9 text-xs sm:text-sm font-semibold rounded-xl">
                    <Printer className="h-4 w-4" />
                    <span>Print Document</span>
                  </Button>
                )}
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

            {/* Render Printable Certificate (US Letter Standard) */}
            <div
              id="official-us-letter-cert"
              className={cn(
                "printable-cert-document rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-sm transition-all flex flex-col justify-between mx-auto",
                templateConfig.orientation === "PORTRAIT"
                  ? "aspect-[8.5/11] max-w-[620px] min-h-[660px]"
                  : "aspect-[11/8.5] max-w-[960px] min-h-[520px]",
                getPaperToneClass(templateConfig.paperTone),
                getBorderStyleClasses(templateConfig.borderStyle, templateConfig.primaryColor),
                getFontFamilyClass(templateConfig.fontFamily)
              )}
            >
              {/* Dimensions tag */}
              <div className="absolute top-2 right-4 z-10 pointer-events-none opacity-50 text-[9px] font-mono select-none">
                US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
              </div>
              {/* WATERMARK IF NOT APPROVED: "Not Approved by LabTutor Academy" */}
              {selectedCertForPreview.status !== "APPROVED" && (
                <>
                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between overflow-hidden select-none opacity-30 dark:opacity-35">
                    <div className="w-[160%] -rotate-12 -translate-x-16 -translate-y-8 flex flex-col gap-8">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="text-center font-black tracking-widest text-red-600 text-xs sm:text-sm uppercase whitespace-nowrap"
                        >
                          Not Approved by LabTutor Academy • Not Approved by LabTutor Academy • Not Approved by LabTutor Academy • Not Approved by LabTutor Academy
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-4">
                    <div className="-rotate-15 border-4 border-red-600/70 rounded-2xl px-6 py-4 bg-white/90 backdrop-blur-xs text-center shadow-2xl max-w-sm">
                      <span className="text-lg sm:text-2xl font-black uppercase tracking-widest text-red-600/90 block">
                        Not Approved by LabTutor Academy
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600/80 block mt-1">
                        {selectedCertForPreview.status === "PENDING"
                          ? "PENDING SUPER ADMINISTRATOR REVIEW & CONFERRAL"
                          : "APPLICATION DECLINED BY ACADEMIC COUNCIL"}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* CENTRAL LABTUTOR ACADEMY LOGO WATERMARK */}
              {(templateConfig.showCenterLogoWatermark ?? true) && (
                <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={templateConfig.watermarkLogoUrl || "/images/certificate-watermark-logo.png"}
                    alt="LabTutor Academy Watermark"
                    className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain transition-opacity duration-200"
                    style={{
                      opacity: templateConfig.watermarkLogoOpacity ?? 0.18,
                    }}
                  />
                </div>
              )}

              <div className="text-center space-y-3 sm:space-y-4 relative z-10">
                <div className="flex justify-center">
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: templateConfig.primaryColor }}
                  >
                    <Award className="h-7 w-7" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-slate-900">
                    {templateConfig.institutionName}
                  </h2>
                  <p className="text-xs text-slate-600 uppercase tracking-widest mt-1">
                    {templateConfig.subHeader}
                  </p>
                </div>

                <div className="py-1">
                  <span
                    className="text-xs sm:text-sm tracking-widest font-semibold uppercase pb-1 border-b-2"
                    style={{
                      color: templateConfig.primaryColor,
                      borderColor: templateConfig.primaryColor,
                    }}
                  >
                    Certificate of Competency & Academic Achievement
                  </span>
                </div>

                <p className="text-xs italic text-slate-600">This is to officially certify that</p>

                <h3
                  className="text-xl sm:text-2xl md:text-3xl font-bold underline underline-offset-8"
                  style={{ textDecorationColor: templateConfig.primaryColor }}
                >
                  {selectedCertForPreview.studentName}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                  having studied at <strong>{selectedCertForPreview.institution}</strong>, has successfully fulfilled all clinical benchmark requirements and verified laboratory SOP standards for{" "}
                  <strong>{selectedCertForPreview.title}</strong> in the curriculum of{" "}
                  <strong>{selectedCertForPreview.program} (Year {selectedCertForPreview.year})</strong> with an official assessment grade of{" "}
                  <strong style={{ color: templateConfig.primaryColor }}>{selectedCertForPreview.grade}</strong>.
                </p>

                <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 items-end gap-3 text-xs text-slate-700">
                  <div className="text-center border-t border-slate-300 pt-2 flex flex-col items-center">
                    {templateConfig.signatorySignature1 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={templateConfig.signatorySignature1}
                        alt="Signature 1"
                        className="h-8 max-w-[110px] object-contain mb-1"
                      />
                    ) : (
                      <span className="font-serif italic text-xs text-slate-800 mb-1">
                        {templateConfig.signatoryName1.split(",")[0]}
                      </span>
                    )}
                    <p className="font-bold text-slate-900">{templateConfig.signatoryName1}</p>
                    <p className="text-xs text-slate-600">{templateConfig.signatoryTitle1}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className="h-16 w-16 rounded-full border-2 border-dashed flex items-center justify-center p-1 text-[9px] font-bold text-center leading-tight shadow-xs"
                      style={{
                        borderColor: templateConfig.primaryColor,
                        color: templateConfig.primaryColor,
                        backgroundColor: `${templateConfig.primaryColor}10`,
                      }}
                    >
                      {templateConfig.sealText}
                    </div>
                    <span className="text-[10px] font-mono font-bold mt-1 text-slate-600">
                      {selectedCertForPreview.certificateNumber}
                    </span>
                  </div>

                  <div className="text-center border-t border-slate-300 pt-2 flex flex-col items-center">
                    {templateConfig.signatorySignature2 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={templateConfig.signatorySignature2}
                        alt="Signature 2"
                        className="h-8 max-w-[110px] object-contain mb-1"
                      />
                    ) : (
                      <span className="font-serif italic text-xs text-slate-800 mb-1">
                        {templateConfig.signatoryName2.split(",")[0]}
                      </span>
                    )}
                    <p className="font-bold text-slate-900">{templateConfig.signatoryName2}</p>
                    <p className="text-xs text-slate-600">{templateConfig.signatoryTitle2}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-200 font-mono">
                  <span>Issued Date: {selectedCertForPreview.issuedDate || selectedCertForPreview.applicationDate}</span>
                  <span>Certificate ID: {selectedCertForPreview.certificateNumber}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
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
                    className="rounded-xl h-9 px-4 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground gap-1.5 shadow-2xs"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print / Download PDF</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Print Stylesheet for exact US Letter Dimensions */}
            <style>{`
              @page {
                size: letter ${templateConfig.orientation === "PORTRAIT" ? "portrait" : "landscape"};
                margin: 0.35in;
              }
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #official-us-letter-cert, #official-us-letter-cert * {
                  visibility: visible !important;
                }
                #official-us-letter-cert {
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: ${templateConfig.orientation === "PORTRAIT" ? "7.8in" : "10.3in"} !important;
                  height: ${templateConfig.orientation === "PORTRAIT" ? "10.3in" : "7.8in"} !important;
                  max-width: none !important;
                  max-height: none !important;
                  margin: 0 auto !important;
                  padding: 0.4in !important;
                  box-shadow: none !important;
                  page-break-inside: avoid !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: CANDIDATE USER ANALYTICS & DOSSIER (FOR SUPER ADMIN DECISION)
         ========================================================================= */}
      {analyticsCandidateCert && (() => {
        const studentUser: LMSUser = users.find(
          (u) =>
            u.id === analyticsCandidateCert.studentId ||
            u.studentIdNumber?.toLowerCase() === analyticsCandidateCert.studentId?.toLowerCase() ||
            u.fullName.toLowerCase().trim() === analyticsCandidateCert.studentName.toLowerCase().trim()
        ) || {
          id: analyticsCandidateCert.studentId || "usr-005",
          fullName: analyticsCandidateCert.studentName,
          username: analyticsCandidateCert.studentName.toLowerCase().replace(/[^a-z0-9]/g, "."),
          email: `${analyticsCandidateCert.studentName.toLowerCase().replace(/[^a-z0-9]/g, ".")}@student.labtutor.edu`,
          phone: "01712-345678",
          role: "STUDENT",
          institution: analyticsCandidateCert.institution,
          program: analyticsCandidateCert.program,
          academicYear: analyticsCandidateCert.year,
          studentIdNumber: analyticsCandidateCert.studentId || "LT-2026-DIHT-0482",
          status: "ACTIVE",
          joinedDate: "2024-01-10",
        };

        const studyRecord = getStudentStudyRecord(studentUser.id, studentUser.program, studentUser.academicYear);
        const candidateEligibility = checkEnrollmentEligibility(studentUser.id, studentUser.program, studentUser.academicYear);
        const displayBenchSops = studyRecord.benchSops;
        const filteredActivities = studyRecord.activities.filter(
          (a) =>
            !activitySearchQuery.trim() ||
            a.title.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
            a.desc.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
            a.type.toLowerCase().includes(activitySearchQuery.toLowerCase())
        );

        return (
          <div
            className="fixed inset-0 z-[65] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAnalyticsCandidateCert(null);
            }}
          >
            <div className="bg-card border border-border rounded-3xl max-w-4xl w-full p-4 sm:p-6 space-y-4 max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg uppercase shrink-0">
                    {studentUser.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg sm:text-xl text-foreground">
                        {studentUser.fullName}
                      </h3>
                      <Badge className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-0.5">
                        {ROLE_LABELS[studentUser.role] || studentUser.role}
                      </Badge>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono font-medium">
                        {studentUser.studentIdNumber}
                      </span>
                      <Badge variant="outline" className="text-amber-600 border-amber-500/40 bg-amber-500/10 text-xs font-bold">
                        Cert No: {analyticsCandidateCert.certificateNumber}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{studentUser.program} • Year {studentUser.academicYear}</span>
                      <span>•</span>
                      <span className="truncate max-w-[280px]" title={studentUser.institution}>{studentUser.institution}</span>
                      <span>•</span>
                      <span className="text-primary font-medium">@{studentUser.username || studentUser.email.split("@")[0]}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAnalyticsCandidateCert(null)}
                    className="h-9 px-3 rounded-xl text-xs sm:text-sm font-semibold gap-1.5"
                  >
                    <X className="h-4 w-4" />
                    <span>Close Dossier</span>
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-border/70 pb-2 overflow-x-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setAnalyticsTab("ANALYTICS")}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer",
                    analyticsTab === "ANALYTICS"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Academic Analytics & Lab Bench SOPs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAnalyticsTab("ACTIVITIES")}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer",
                    analyticsTab === "ACTIVITIES"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <Activity className="h-4 w-4" />
                  <span>Live Activity Trail & Telemetry</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="overflow-y-auto pr-1 space-y-4 max-h-[calc(92vh-220px)]">
                {analyticsTab === "ANALYTICS" && (
                  <div className="space-y-4">
                    {/* Top KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Card className="p-3.5 bg-card border-border/80 rounded-2xl shadow-2xs">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                          <span>Average Score</span>
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                          {candidateEligibility.cumulativeScore}%
                        </div>
                        <div className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          {candidateEligibility.recommendedGrade}
                        </div>
                      </Card>

                      <Card className="p-3.5 bg-card border-border/80 rounded-2xl shadow-2xs">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                          <span>Curriculum Tasks</span>
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                          {candidateEligibility.completionPct}%
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                          {candidateEligibility.completedTasksCount} / {candidateEligibility.totalTasksCount} Tasks Done
                        </div>
                      </Card>

                      <Card className="p-3.5 bg-card border-border/80 rounded-2xl shadow-2xs">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                          <span>Bench SOPs Logged</span>
                          <FlaskConical className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                          {displayBenchSops.filter((s) => !s.eval.toLowerCase().includes("pending")).length} / {displayBenchSops.length}
                        </div>
                        <div className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                          ISO 15189 Verified
                        </div>
                      </Card>

                      <Card className="p-3.5 bg-card border-border/80 rounded-2xl shadow-2xs">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                          <span>Clinical Status</span>
                          <Calendar className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                          {candidateEligibility.isEligible ? "Complete" : "In Progress"}
                        </div>
                        <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                          {candidateEligibility.completedSubjectsCount} / {candidateEligibility.totalSubjectsCount} Subjects Clear
                        </div>
                      </Card>
                    </div>

                    {/* Subject Breakdown */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>Curriculum Subject Competency Performance</span>
                        </h4>
                        <span className="text-xs text-muted-foreground font-medium">
                          Program: {studentUser.program} (Year {studentUser.academicYear})
                        </span>
                      </div>

                      <div className="border border-border rounded-2xl divide-y divide-border/60 overflow-hidden bg-card">
                        {candidateEligibility.subjects.map((subj) => {
                          const pct = subj.totalTasks > 0 ? Math.round((subj.completedTasks / subj.totalTasks) * 100) : 0;
                          return (
                            <div
                              key={subj.code}
                              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-muted/30 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                                    {subj.code}
                                  </span>
                                  <span className="font-bold text-sm text-foreground">{subj.name}</span>
                                  {subj.isCompleted ? (
                                    <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">
                                      {subj.completedTasks}/{subj.totalTasks} Tasks
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Avg Quiz Score: <strong className="text-foreground">{subj.avgQuizScore}%</strong> • Status: {subj.lastStudied || "Active"}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 shrink-0 sm:self-center">
                                <div className="w-28 bg-muted rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full transition-all", subj.isCompleted ? "bg-emerald-500" : "bg-primary")}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <div className="text-right min-w-[70px]">
                                  <div className="font-black text-sm text-foreground">{subj.avgQuizScore}%</div>
                                  <div className="text-xs text-muted-foreground">{pct}% tasks</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Lab Bench SOPs Matrix */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                          <FlaskConical className="h-3.5 w-3.5 text-primary" />
                          <span>Clinical Diagnostic Laboratory Bench SOPs Matrix</span>
                        </h4>
                        <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                          ISO 15189 Aligned
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {displayBenchSops.map((sop) => (
                          <div
                            key={sop.code}
                            className="p-3 rounded-xl border border-border bg-card/60 space-y-1.5 hover:border-primary/40 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
                                {sop.code}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="h-3 w-3" />
                                <span>{sop.score}</span>
                              </span>
                            </div>
                            <div className="text-xs font-bold text-foreground leading-snug">
                              {sop.name}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                              <span>Rating: <strong className="text-foreground">{sop.eval}</strong></span>
                              <span className="truncate max-w-[170px]" title={sop.evaluator}>
                                {sop.evaluator}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {analyticsTab === "ACTIVITIES" && (
                  <div className="space-y-4">
                    {/* Activity Filter & Telemetry Info */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Filter student activity by action, exam, or keyword..."
                          value={activitySearchQuery}
                          onChange={(e) => setActivitySearchQuery(e.target.value)}
                          className="pl-9 h-9 text-xs rounded-xl"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Telemetry Active</span>
                        </span>
                        <span>•</span>
                        <span>Windows 11 / Chrome</span>
                      </div>
                    </div>

                    {/* Weekly Distribution Bars */}
                    <div className="p-3.5 rounded-2xl border border-border bg-card space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground flex items-center gap-1.5">
                          <History className="h-3.5 w-3.5 text-primary" />
                          <span>Weekly Active Session Distribution</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">28 Sessions Logged this Month</span>
                      </div>
                      <div className="grid grid-cols-7 gap-2 pt-1 text-center text-[10px]">
                        {[
                          { day: "Mon", count: 4, h: "60%" },
                          { day: "Tue", count: 6, h: "85%" },
                          { day: "Wed", count: 3, h: "45%" },
                          { day: "Thu", count: 7, h: "100%" },
                          { day: "Fri", count: 5, h: "75%" },
                          { day: "Sat", count: 2, h: "30%" },
                          { day: "Sun", count: 1, h: "15%" },
                        ].map((d) => (
                          <div key={d.day} className="flex flex-col items-center gap-1.5">
                            <div className="w-full bg-muted rounded h-12 flex items-end justify-center p-1">
                              <div
                                className="w-full bg-primary/80 rounded-sm hover:bg-primary transition-all"
                                style={{ height: d.h }}
                                title={`${d.count} sessions on ${d.day}`}
                              />
                            </div>
                            <span className="font-medium text-muted-foreground">{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity Event List */}
                    <div className="border border-border rounded-2xl divide-y divide-border/60 overflow-hidden bg-card">
                      {filteredActivities.length === 0 ? (
                        <div className="p-6 text-center text-xs text-muted-foreground">
                          No activity events found matching &quot;{activitySearchQuery}&quot;.
                        </div>
                      ) : (
                        filteredActivities.map((evt) => (
                          <div key={evt.id} className="p-3 hover:bg-muted/30 transition-colors space-y-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={cn(
                                    "text-[9px] font-bold",
                                    evt.type === "EXAM"
                                      ? "bg-purple-600 text-white"
                                      : evt.type === "PRACTICAL"
                                      ? "bg-emerald-600 text-white"
                                      : evt.type === "CERTIFICATE"
                                      ? "bg-amber-600 text-white"
                                      : evt.type === "ATTENDANCE"
                                      ? "bg-blue-600 text-white"
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {evt.type}
                                </Badge>
                                <span className="font-bold text-foreground">{evt.title}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-medium">{evt.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{evt.desc}</p>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/80 pt-1 font-mono">
                              <span>Client: {evt.device}</span>
                              <span>•</span>
                              <span>IP: {evt.ip}</span>
                              <span>•</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{evt.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Super Admin Decision & Action Footer */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Super Administrator Decision Desk • Take action on {analyticsCandidateCert.certificateNumber}:</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCertForPreview(analyticsCandidateCert)}
                    className="h-9 text-xs sm:text-sm font-semibold rounded-xl gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview Watermark</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDecliningCert(analyticsCandidateCert);
                      setDeclineReason("");
                    }}
                    className="h-9 text-xs sm:text-sm font-semibold rounded-xl text-destructive hover:bg-destructive/10 gap-1.5 border-destructive/30 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>Decline Application</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReviewAction(analyticsCandidateCert.id, "APPROVED")}
                    className="h-9 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve & Issue Certificate</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          MODAL 4: DECLINE APPLICATION DIALOG WITH REASON INPUT
         ========================================================================= */}
      {decliningCert && (
        <div
          className="fixed inset-0 z-[75] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDecliningCert(null);
          }}
        >
          <div className="bg-card border border-destructive/30 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    Decline Certificate Application
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {decliningCert.certificateNumber} • {decliningCert.studentName}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDecliningCert(null)}
                className="h-8 w-8 p-0 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span>Reason / Feedback for Candidate *</span>
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Candidate must complete remaining practical tasks for Hematology and achieve min 80% on mock board before re-applying."
                rows={4}
                className="w-full text-xs p-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground">
                This feedback will be dispatched in a real-time notification to the student so they can rectify deficiencies.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDecliningCert(null)}
                className="h-9 px-4 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (!declineReason.trim()) {
                    alert("Please provide a reason for declining this certificate request.");
                    return;
                  }
                  handleReviewAction(decliningCert.id, "REJECTED", declineReason.trim());
                }}
                className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Confirm Decline & Notify</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
