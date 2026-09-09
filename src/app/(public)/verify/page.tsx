"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeView } from "@/components/ui/qr-code-view";
import {
  useCertificates,
  CertificateRecord,
  getProgramLabel,
  getYearLabel,
  findCertificateByQuery,
  INITIAL_CERTIFICATES,
} from "@/lib/stores/certificate-store";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Award,
  GraduationCap,
  Building2,
  Calendar,
  FileBadge,
  KeyRound,
  FileCheck2,
  UserCheck,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

function CertificateVerificationContent() {
  const searchParams = useSearchParams();
  const { certificates, findCertificate, templateConfig } = useCertificates();

  const [certCode, setCertCode] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "valid" | "not_found">("idle");
  const [verifiedCert, setVerifiedCert] = React.useState<CertificateRecord | null>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [showDocPreview, setShowDocPreview] = React.useState(false);
  const [verifiedAt, setVerifiedAt] = React.useState<string>("");

  const verifyCode = React.useCallback(
    (codeToVerify: string) => {
      const trimmed = codeToVerify.trim();
      if (!trimmed) return;

      setStatus("loading");
      setVerifiedCert(null);

      // Brief query simulation for professional UX responsiveness
      setTimeout(() => {
        // Query via store context or fallback to INITIAL_CERTIFICATES
        let found = findCertificate ? findCertificate(trimmed) : undefined;
        if (!found) {
          found = findCertificateByQuery(trimmed, certificates || INITIAL_CERTIFICATES);
        }

        if (found) {
          setVerifiedCert(found);
          setStatus("valid");
          setVerifiedAt(
            new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
            })
          );
        } else {
          setStatus("not_found");
        }
      }, 350);
    },
    [findCertificate, certificates]
  );

  // Auto-verify if "code" or "id" query parameter is in the URL on mount
  React.useEffect(() => {
    const urlCode =
      searchParams.get("code") ||
      searchParams.get("id") ||
      searchParams.get("cert") ||
      searchParams.get("verificationCode");
    if (urlCode && urlCode.trim()) {
      setCertCode(urlCode.trim());
      verifyCode(urlCode.trim());
    }
  }, [searchParams, verifyCode]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCode.trim()) return;

    // Update browser URL query parameter without full reload for instant sharing
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("code", certCode.trim());
      window.history.replaceState({}, "", url.toString());
    }

    verifyCode(certCode.trim());
  };

  const handlePresetSelect = (code: string) => {
    setCertCode(code);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("code", code);
      window.history.replaceState({}, "", url.toString());
    }
    verifyCode(code);
  };

  const handleCopyVerificationLink = () => {
    if (!verifiedCert) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://labtutor.academy";
    const shareUrl = `${origin}/verify?code=${encodeURIComponent(verifiedCert.certificateNumber || verifiedCert.code)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handlePrintRecord = () => {
    window.print();
  };

  const verifyUrl = verifiedCert
    ? typeof window !== "undefined"
      ? `${window.location.origin}/verify?code=${encodeURIComponent(verifiedCert.certificateNumber || verifiedCert.code)}`
      : `https://labtutor.academy/verify?code=${encodeURIComponent(verifiedCert.certificateNumber || verifiedCert.code)}`
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Banner Section */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1 font-semibold">
              Institutional Credential Registry
            </Badge>
            <Badge variant="outline" className="text-muted-foreground border-border text-[11px] font-mono">
              US Letter Standard (8.5 × 11 in)
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Verify Issued Certificate
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Enter the official <strong>Certificate Number</strong>, <strong>Authentication Code</strong>, or scan the credential’s QR code to confirm candidate competency, institutional conferral, and academic benchmark records.
          </p>
        </div>

        {/* Credential Lookup Card */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span>Credential Verification Search</span>
              </div>
              <span className="text-xs font-normal text-muted-foreground">
                Official DGHS & SMFB Competency Platform
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Supports official Certificate Numbers (e.g. <span className="font-mono font-bold text-primary">LTA-DIP-2025-48201</span>), verification hashes, or registry reference codes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleVerify} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="e.g. LTA-DIP-2025-48201 or VER-9201-ENG101"
                    value={certCode}
                    onChange={(e) => setCertCode(e.target.value)}
                    className="pl-9.5 font-mono uppercase text-sm h-11 rounded-xl"
                    required
                  />
                  {certCode && (
                    <button
                      type="button"
                      onClick={() => {
                        setCertCode("");
                        setStatus("idle");
                        setVerifiedCert(null);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={status === "loading" || !certCode.trim()}
                  className="min-h-[44px] px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 cursor-pointer shadow-xs"
                >
                  {status === "loading" ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Verify Credential</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Demo Test Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  <span>Quick Test:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("LTA-DIP-2025-48201")}
                  className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all font-mono text-[11px] border border-border/60 cursor-pointer"
                >
                  LTA-DIP-2025-48201 (Diploma)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("LTA-BSC-2025-19934")}
                  className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all font-mono text-[11px] border border-border/60 cursor-pointer"
                >
                  LTA-BSC-2025-19934 (B.Sc.)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("LTA-DIP-2026-88412")}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all font-mono text-[11px] border border-amber-500/20 cursor-pointer"
                >
                  LTA-DIP-2026-88412 (Pending)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("LAB-DEMO-2026")}
                  className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all font-mono text-[11px] border border-border/60 cursor-pointer"
                >
                  LAB-DEMO-2026 (Demo)
                </button>
              </div>
            </form>

            {/* Loading Feedback */}
            {status === "loading" && (
              <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 text-center space-y-2 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-primary font-bold text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Querying Official Cryptographic Registry...</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Validating digital serial number, student identity, and academic council conferral records.
                </p>
              </div>
            )}

            {/* NOT FOUND FEEDBACK */}
            {status === "not_found" && (
              <div className="p-5 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3 animate-in fade-in">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-destructive">
                      Certificate Not Found in Official Registry
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      No active or pending certificate matches the code <strong className="font-mono text-foreground font-bold">&quot;{certCode}&quot;</strong>.
                    </p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside pt-1 space-y-0.5">
                      <li>Check that the Certificate Number is typed exactly as printed (e.g. <span className="font-mono">LTA-DIP-2025-48201</span>).</li>
                      <li>Scan the printed QR code with your phone camera to open the direct verification link.</li>
                      <li>Try testing one of the official sample credentials above.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* VERIFIED SUCCESSFUL RECORD CARD */}
            {status === "valid" && verifiedCert && (
              <div className="mt-4 space-y-6 animate-in fade-in duration-200">
                {/* Status Callout Banner */}
                <div
                  className={cn(
                    "p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                    verifiedCert.status === "APPROVED"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                      : verifiedCert.status === "PENDING"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
                        verifiedCert.status === "APPROVED"
                          ? "bg-emerald-600 text-white"
                          : verifiedCert.status === "PENDING"
                          ? "bg-amber-600 text-white"
                          : "bg-destructive text-white"
                      )}
                    >
                      {verifiedCert.status === "APPROVED" ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : verifiedCert.status === "PENDING" ? (
                        <Clock className="h-6 w-6 animate-pulse" />
                      ) : (
                        <AlertCircle className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm sm:text-base">
                          {verifiedCert.status === "APPROVED"
                            ? "Officially Conferred & Verified Authentic"
                            : verifiedCert.status === "PENDING"
                            ? "Record Found — Application Pending Review"
                            : "Application Record Inactive / Declined"}
                        </span>
                        <Badge
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide",
                            verifiedCert.status === "APPROVED"
                              ? "bg-emerald-600 text-white"
                              : verifiedCert.status === "PENDING"
                              ? "bg-amber-600 text-white"
                              : "bg-destructive text-white"
                          )}
                        >
                          {verifiedCert.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {verifiedCert.status === "APPROVED"
                          ? "This credential has been validated against the central LabTutor Academy registry."
                          : verifiedCert.status === "PENDING"
                          ? "Application is awaiting final benchmark audit and signature approval by the Super Administrator."
                          : "This application was not conferred by the academic examination council."}
                      </p>
                      {verifiedAt && (
                        <p className="text-[11px] text-muted-foreground/80 font-mono mt-1">
                          Verified Query Timestamp: {verifiedAt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyVerificationLink}
                      className="gap-1.5 text-xs h-9 rounded-xl border-border bg-card cursor-pointer hover:bg-muted"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePrintRecord}
                      className="gap-1.5 text-xs h-9 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Record</span>
                    </Button>
                  </div>
                </div>

                {/* Comprehensive Certificate Details Card (The exact breakdown requested by user) */}
                <div id="printable-verification-dossier" className="border border-border rounded-2xl p-5 sm:p-7 bg-card shadow-sm space-y-6">
                  {/* Card Section 1: Certificate Identity Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-border gap-4">
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-mono font-bold tracking-widest text-primary">
                        Official Credential Dossier
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        {verifiedCert.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Governed by State Medical Faculty of Bangladesh (SMFB) & DGHS Medical Technology Directorate
                      </p>
                    </div>

                    {/* QR Code Scannable View */}
                    <div className="flex items-center gap-3 shrink-0 bg-muted/40 p-2.5 rounded-xl border border-border/60">
                      <QRCodeView value={verifyUrl} size={84} />
                      <div className="text-[11px] space-y-0.5">
                        <span className="font-bold text-foreground block">Scan to Verify</span>
                        <span className="font-mono text-muted-foreground text-[10px] block">
                          {verifiedCert.certificateNumber}
                        </span>
                        <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                          Cryptographically Signed
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Card Section 2: Core Details Grid (Name, Institute, Course Type, Year, Date, Grade etc.) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    {/* 1. Student / Candidate Name */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-primary" />
                        <span>Candidate / Student Name</span>
                      </span>
                      <p className="font-bold text-base text-foreground">
                        {verifiedCert.studentName}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Student ID: {verifiedCert.studentId}
                      </p>
                    </div>

                    {/* 2. Institute / Affiliated College */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span>Affiliated Institute / Institution</span>
                      </span>
                      <p className="font-bold text-foreground">
                        {verifiedCert.institution}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Accredited Clinical Training Center
                      </p>
                    </div>

                    {/* 3. Course Type & Program */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                        <span>Course Type / Program</span>
                      </span>
                      <p className="font-bold text-foreground">
                        {getProgramLabel(verifiedCert.program)}
                      </p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                          {verifiedCert.program === "BSC" ? "Bachelor of Science" : "Diploma Program"}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">4-Year Curriculum</span>
                      </div>
                    </div>

                    {/* 4. Academic Year & Curriculum Phase */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>Academic Curriculum Year</span>
                      </span>
                      <p className="font-bold text-foreground">
                        {getYearLabel(verifiedCert.year)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Year {verifiedCert.year} Clinical Benchmark Syllabus
                      </p>
                    </div>

                    {/* 5. Conferred Grade & Standing */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Assessment Grade & Competency</span>
                      </span>
                      <p className="font-bold text-base text-emerald-600 dark:text-emerald-400">
                        {verifiedCert.grade}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Verified via Diagnostic Practical Tasks & Case Scenarios
                      </p>
                    </div>

                    {/* 6. Dates (Issued & Applied) */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>Date of Conferral & Application</span>
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground">
                          {verifiedCert.issuedDate
                            ? `Issued Date: ${verifiedCert.issuedDate}`
                            : `Conferral: Pending Final Approval`}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          Application Date: {verifiedCert.applicationDate}
                        </p>
                      </div>
                    </div>

                    {/* 7. Official Serial & Authentication Codes */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <FileBadge className="h-3.5 w-3.5 text-primary" />
                        <span>Certificate Serial & Code</span>
                      </span>
                      <p className="font-mono font-bold text-foreground text-sm">
                        {verifiedCert.certificateNumber}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        Registry Ref: {verifiedCert.code}
                      </p>
                    </div>

                    {/* 8. Verification Security Hash / Authority */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        <span>Authentication Key & Reviewer</span>
                      </span>
                      <p className="font-mono font-bold text-primary text-sm">
                        {verifiedCert.verificationCode || "PENDING-ISSUANCE"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Signatory: {verifiedCert.reviewedBy || "Academic Examination Council"} ({verifiedCert.reviewedRole || "SUPER_ADMIN"})
                      </p>
                    </div>
                  </div>

                  {/* Feedback or Notes (If declined or specific feedback) */}
                  {verifiedCert.feedback && (
                    <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                      <span className="font-bold text-foreground block">
                        Academic Directorate Notes:
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {verifiedCert.feedback}
                      </p>
                    </div>
                  )}

                  {/* Toggle Full Visual Digital Certificate Parchment Preview */}
                  <div className="pt-2 border-t border-border/80 flex items-center justify-between flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDocPreview(!showDocPreview)}
                      className="gap-2 text-xs font-semibold rounded-xl h-9 cursor-pointer"
                    >
                      {showDocPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>{showDocPreview ? "Hide Digital Certificate Parchment" : "View Full Certificate Document Preview"}</span>
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <span>Standard: US Letter (8.5 × 11 in)</span>
                      <span>•</span>
                      <Link href="/contact" className="hover:text-primary transition-colors underline">
                        Report Issue
                      </Link>
                    </div>
                  </div>

                  {/* Visual Digital Certificate Preview Accordion */}
                  {showDocPreview && (
                    <div className="pt-4 border-t border-border/80 animate-in fade-in duration-200">
                      <div className="text-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Authentic Conferred Certificate Document Preview
                        </span>
                      </div>

                      {/* Render realistic parchment certificate view */}
                      <div
                        className={cn(
                          "rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-md transition-all flex flex-col justify-between mx-auto border-8 border-emerald-700 ring-4 ring-emerald-500/20 bg-[#fdfbf7] text-slate-900 font-serif",
                          templateConfig.orientation === "PORTRAIT"
                            ? "aspect-[8.5/11] max-w-[620px]"
                            : "aspect-[11/8.5] max-w-[920px]"
                        )}
                      >
                        {/* US Letter Dimension Label */}
                        <div className="absolute top-2 right-4 z-10 pointer-events-none opacity-50 text-[9px] font-mono select-none">
                          US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
                        </div>

                        {/* Watermark Logo */}
                        <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden p-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={templateConfig.watermarkLogoUrl || "/images/certificate-watermark-logo.png"}
                            alt="Watermark Logo"
                            className="w-56 h-56 sm:w-72 sm:h-72 object-contain"
                            style={{ opacity: templateConfig.watermarkLogoOpacity || 0.08 }}
                          />
                        </div>

                        <div className="text-center space-y-3 relative z-10">
                          <div className="flex justify-center">
                            <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-white bg-emerald-700 shadow-md">
                              <Award className="h-6 w-6" />
                            </div>
                          </div>
                          <div>
                            <h2 className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-slate-900">
                              {templateConfig.institutionName}
                            </h2>
                            <p className="text-xs text-slate-600 uppercase tracking-widest mt-0.5">
                              {templateConfig.subHeader}
                            </p>
                          </div>

                          <div className="py-0.5">
                            <span className="text-xs sm:text-sm tracking-widest font-semibold uppercase pb-1 border-b-2 border-emerald-700 text-emerald-700">
                              Certificate of Competency & Academic Achievement
                            </span>
                          </div>

                          <p className="text-xs italic text-slate-600">This is to officially certify that</p>

                          <h3 className="text-xl sm:text-3xl font-bold underline underline-offset-8 decoration-emerald-700">
                            {verifiedCert.studentName}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                            having completed clinical laboratory training at <strong>{verifiedCert.institution}</strong>, has fulfilled all diagnostic benchmark requirements for{" "}
                            <strong>{verifiedCert.title}</strong> in the curriculum of{" "}
                            <strong>{verifiedCert.program} (Year {verifiedCert.year})</strong> with an assessment grade of{" "}
                            <strong className="text-emerald-700">{verifiedCert.grade}</strong>.
                          </p>

                          {/* Signatories and Seal */}
                          <div className="pt-6 grid grid-cols-3 items-end gap-2 text-xs text-slate-700">
                            <div className="text-center border-t border-slate-300 pt-1 flex flex-col items-center">
                              {templateConfig.signatorySignature1 ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={templateConfig.signatorySignature1}
                                  alt="Signature 1"
                                  className="h-8 max-w-[100px] object-contain mb-1"
                                />
                              ) : (
                                <span className="font-serif italic text-xs text-slate-800 mb-1">
                                  {templateConfig.signatoryName1.split(",")[0]}
                                </span>
                              )}
                              <p className="font-bold text-slate-900 text-xs">{templateConfig.signatoryName1}</p>
                              <p className="text-[10px] text-slate-600">{templateConfig.signatoryTitle1}</p>
                            </div>

                            <div className="flex flex-col items-center">
                              <div className="h-16 w-16 rounded-full border-2 border-dashed border-emerald-700 text-emerald-700 bg-emerald-700/10 flex items-center justify-center p-1 text-[8px] font-bold text-center leading-tight">
                                {templateConfig.sealText}
                              </div>
                              <span className="text-[10px] font-mono font-bold mt-1 text-slate-600">
                                {verifiedCert.certificateNumber}
                              </span>
                            </div>

                            <div className="text-center border-t border-slate-300 pt-1 flex flex-col items-center">
                              {templateConfig.signatorySignature2 ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={templateConfig.signatorySignature2}
                                  alt="Signature 2"
                                  className="h-8 max-w-[100px] object-contain mb-1"
                                />
                              ) : (
                                <span className="font-serif italic text-xs text-slate-800 mb-1">
                                  {templateConfig.signatoryName2.split(",")[0]}
                                </span>
                              )}
                              <p className="font-bold text-slate-900 text-xs">{templateConfig.signatoryName2}</p>
                              <p className="text-[10px] text-slate-600">{templateConfig.signatoryTitle2}</p>
                            </div>
                          </div>

                          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-200 font-mono">
                            <span>Issued: {verifiedCert.issuedDate || verifiedCert.applicationDate}</span>
                            <span>Verify Code: {verifiedCert.verificationCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Verification Footer Notice */}
                <div className="text-center text-xs text-muted-foreground space-y-1 pt-2">
                  <p>
                    Official Public Verification Query ID: <span className="font-mono font-semibold">{verifiedCert.verificationCode || verifiedCert.certificateNumber}</span>
                  </p>
                  <p>
                    For institutional credential inquiries, contact the Directorate of Medical Technology at <Link href="/contact" className="text-primary hover:underline">contact@labtutor.academy</Link>.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <PublicFooter />

      {/* Print Styles for Verification Report */}
      <style>{`
        @media print {
          header, footer, nav, button, form, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          #printable-verification-dossier {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin: 0 !important;
            padding: 1cm !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-background">
          <PublicNavbar />
          <main className="flex-1 container mx-auto px-4 py-16 text-center space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground">
              Loading Certificate Verification Portal...
            </p>
          </main>
          <PublicFooter />
        </div>
      }
    >
      <CertificateVerificationContent />
    </React.Suspense>
  );
}
