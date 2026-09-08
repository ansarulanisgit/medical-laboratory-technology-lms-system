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
  ExternalLink,
  QrCode,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  Palette,
  Settings2,
  Plus,
  Printer,
  Eye,
  Check,
  X,
  UserCheck,
  Sparkles,
  School,
  Search,
} from "lucide-react";
import { useCertificates, CertificateRecord, CertificateTemplateConfig } from "@/lib/stores/certificate-store";
import { useAcademic, ProgramLevel } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";

export default function StudentCertificatesPage() {
  const { certificates, templateConfig, applyForCertificate, reviewCertificate, updateTemplateConfig } = useCertificates();
  const { role, userProfile } = useAcademic();
  const { logActivity } = useActivityLog();

  const isSuperOrAdmin = role === "SUPER_ADMIN" || role === "ADMIN";
  const isMentor = role === "MENTOR";

  // Tab states
  const [activeTab, setActiveTab] = React.useState<"MY_CERTS" | "APPLY" | "REVIEW" | "CUSTOMIZE">("MY_CERTS");
  const [selectedCertForPreview, setSelectedCertForPreview] = React.useState<CertificateRecord | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = React.useState("");

  // Application Form State
  const [applyForm, setApplyForm] = React.useState({
    program: "DIPLOMA" as ProgramLevel,
    year: "1",
    title: "1st Year Foundation Competency: Diagnostic Pre-Analytical SOPs & Basic Sciences",
    institution: userProfile?.institution || "Dhaka Institute of Health Technology (DIHT)",
    grade: "Pass with Distinction (90%+)",
  });
  const [applySuccess, setApplySuccess] = React.useState(false);

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
        c.studentId === "usr-005" ||
        c.studentName.toLowerCase() === (userProfile?.name || "").toLowerCase() ||
        c.status === "APPROVED"
    );
  }, [certificates, isSuperOrAdmin, isMentor, searchQuery, userProfile?.name]);

  const pendingCerts = React.useMemo(() => {
    return certificates.filter((c) => c.status === "PENDING");
  }, [certificates]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyForCertificate({
      studentId: "usr-" + Date.now().toString().slice(-4),
      studentName: userProfile?.name || "Md. Ansarul Islam",
      institution: applyForm.institution,
      program: applyForm.program,
      year: applyForm.year,
      title: applyForm.title,
      grade: applyForm.grade,
    });

    if (result.success) {
      logActivity({
        action: "CREATE",
        module: "Certificates",
        details: `Submitted certificate application for "${applyForm.title}"`,
      });
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setActiveTab("MY_CERTS");
      }, 1500);
    }
  };

  const handleReviewAction = (certId: string, decision: "APPROVED" | "REJECTED") => {
    const feedback = prompt(decision === "APPROVED" ? "Enter commendation / remarks (optional):" : "Enter rejection reason:");
    if (decision === "REJECTED" && !feedback) return;

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
      details: `${decision === "APPROVED" ? "Approved" : "Rejected"} certificate request for ${certId}`,
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Certificates & Credentials
            </h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
              Cryptographic Registry
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Verifiable competency certificates, accreditation applications, and institutional registry management.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {role === "STUDENT" && (
            <Button
              onClick={() => setActiveTab("APPLY")}
              className="gap-2 shadow-sm bg-primary text-primary-foreground"
            >
              <Award className="h-4 w-4" />
              <span>Apply for Certificate</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("MY_CERTS")}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "MY_CERTS"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>{isSuperOrAdmin ? "All Credentials Registry" : "My Credentials"}</span>
          <Badge variant="secondary" className="text-[10px] ml-1">
            {studentCerts.length}
          </Badge>
        </button>

        {role === "STUDENT" && (
          <button
            onClick={() => setActiveTab("APPLY")}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "APPLY"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Apply for Year Certificate</span>
          </button>
        )}

        {isSuperOrAdmin && (
          <>
            <button
              onClick={() => setActiveTab("REVIEW")}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "REVIEW"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Review Applications</span>
              {pendingCerts.length > 0 && (
                <Badge variant="destructive" className="text-[10px] ml-1 px-1.5 py-0">
                  {pendingCerts.length} Pending
                </Badge>
              )}
            </button>

            <button
              onClick={() => setActiveTab("CUSTOMIZE")}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "CUSTOMIZE"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>Template & Signature Customizer</span>
            </button>
          </>
        )}
      </div>

      {/* TAB 1: MY CERTIFICATES / REGISTRY */}
      {activeTab === "MY_CERTS" && (
        <div className="space-y-4">
          {/* Search bar for Admin */}
          {isSuperOrAdmin && (
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidate name, cert code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
              <span className="text-xs text-muted-foreground">
                Showing {studentCerts.length} credentials
              </span>
            </div>
          )}

          {studentCerts.length === 0 ? (
            <Card className="p-10 text-center space-y-3">
              <Award className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
              <CardTitle className="text-base">No Certificates Found</CardTitle>
              <CardDescription className="text-xs max-w-sm mx-auto">
                {role === "STUDENT"
                  ? "You have not completed or applied for any year competency certifications yet."
                  : "No certificate records matching your query."}
              </CardDescription>
              {role === "STUDENT" && (
                <Button onClick={() => setActiveTab("APPLY")} size="sm" className="text-xs">
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
                    className={`flex flex-col justify-between transition-all ${
                      isApproved
                        ? "border-emerald-500/30 hover:border-emerald-500/60 shadow-sm"
                        : isPending
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-red-500/30 bg-red-500/5"
                    }`}
                  >
                    <CardHeader className="p-5 pb-3 border-b border-border/60">
                      <div className="flex items-center justify-between mb-2">
                        {isApproved ? (
                          <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Verified Credential</span>
                          </Badge>
                        ) : isPending ? (
                          <Badge variant="outline" className="text-amber-600 border-amber-500/40 text-[10px] gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Pending Council Approval</span>
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px] gap-1">
                            <XCircle className="h-3 w-3" />
                            <span>Application Rejected</span>
                          </Badge>
                        )}

                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          {cert.code}
                        </span>
                      </div>

                      <CardTitle className="text-base font-bold leading-snug">
                        {cert.title}
                      </CardTitle>

                      <CardDescription className="text-xs mt-1">
                        Candidate: <strong className="text-foreground">{cert.studentName}</strong> • {cert.program} (Year {cert.year})
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 pt-3 space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="font-semibold text-foreground block">Institution:</span>
                          {cert.institution}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground block">Assessment Result:</span>
                          {cert.grade}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground block">Application Date:</span>
                          {cert.applicationDate}
                        </div>
                        {cert.issuedDate && (
                          <div>
                            <span className="font-semibold text-foreground block">Conferred On:</span>
                            {cert.issuedDate}
                          </div>
                        )}
                      </div>

                      {cert.feedback && (
                        <div className="p-2.5 rounded-lg bg-muted/50 border border-border text-xs">
                          <span className="font-semibold text-foreground">Reviewer Remarks: </span>
                          <span className="text-muted-foreground">{cert.feedback}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        {isApproved ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCertForPreview(cert)}
                              className="flex-1 text-xs gap-1.5"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View Certificate</span>
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedCertForPreview(cert);
                                setTimeout(() => window.print(), 300);
                              }}
                              className="bg-primary text-primary-foreground text-xs gap-1.5"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Print / PDF</span>
                            </Button>
                          </>
                        ) : (
                          <div className="w-full text-center text-xs text-muted-foreground italic py-1">
                            {isPending
                              ? "Awaiting Academic Council verification and endorsement."
                              : "Contact examination cell for resolution."}
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

      {/* TAB 2: APPLY FOR CERTIFICATE */}
      {activeTab === "APPLY" && (
        <Card className="max-w-2xl mx-auto border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Apply for Year Competency Certificate</CardTitle>
            <CardDescription className="text-xs">
              Students who have completed the syllabus modules and practical benchmarks for their academic year can apply for official institutional accreditation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applySuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="font-bold text-base">Application Submitted Successfully!</h3>
                <p className="text-xs text-muted-foreground">
                  Your application has been logged into the registry and routed to the Academic Review Council.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Program Level *</label>
                    <select
                      value={applyForm.program}
                      onChange={(e) => setApplyForm({ ...applyForm, program: e.target.value as ProgramLevel })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                    >
                      <option value="DIPLOMA">Diploma in Medical Lab Technology</option>
                      <option value="BSC">B.Sc. in Medical Laboratory Technology</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Academic Year *</label>
                    <select
                      value={applyForm.year}
                      onChange={(e) => setApplyForm({ ...applyForm, year: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year (Internship & Degree)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Certificate Title / Competency Focus *</label>
                  <Input
                    value={applyForm.title}
                    onChange={(e) => setApplyForm({ ...applyForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Institute / Medical College Name *</label>
                  <Input
                    value={applyForm.institution}
                    onChange={(e) => setApplyForm({ ...applyForm, institution: e.target.value })}
                    placeholder="e.g. Dhaka Institute of Health Technology"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Performance / Grade Summary *</label>
                  <Input
                    value={applyForm.grade}
                    onChange={(e) => setApplyForm({ ...applyForm, grade: e.target.value })}
                    placeholder="e.g. Pass with Distinction (88%)"
                    required
                  />
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border text-[11px] text-muted-foreground leading-relaxed">
                  <strong>Verification Notice:</strong> Applications are cross-matched against your LabTutor course completions, quiz milestones, and bench practical evaluations before approval.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("MY_CERTS")}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground gap-1.5">
                    <Award className="h-4 w-4" />
                    <span>Submit Application</span>
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: REVIEW APPLICATIONS (SUPER ADMIN & ADMIN ONLY) */}
      {isSuperOrAdmin && activeTab === "REVIEW" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Pending Candidate Applications ({pendingCerts.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              Review qualifications and confer authorized certificates
            </span>
          </div>

          {pendingCerts.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground text-xs space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-foreground">All caught up!</p>
              <p>There are no pending certificate applications requiring review at this time.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingCerts.map((cert) => (
                <Card key={cert.id} className="border-amber-500/30 p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-amber-600 border-amber-500/40 text-[10px]">
                          Pending Review
                        </Badge>
                        <span className="text-xs font-mono font-bold text-muted-foreground">{cert.code}</span>
                      </div>
                      <h3 className="font-bold text-sm text-foreground">{cert.title}</h3>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                        <span>Candidate: <strong className="text-foreground">{cert.studentName}</strong></span>
                        <span>Program: <strong>{cert.program} Year {cert.year}</strong></span>
                        <span>Institute: <strong>{cert.institution}</strong></span>
                        <span>Grade: <strong className="text-emerald-600">{cert.grade}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewAction(cert.id, "REJECTED")}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10 gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReviewAction(cert.id, "APPROVED")}
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
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
          {/* Editor Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-primary" />
                  <span>Customize Certificate Template</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure the official institutional branding, signatories, and seal displayed on generated certificates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveTemplate} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Conferring Institution Name</label>
                    <Input
                      value={templateForm.institutionName}
                      onChange={(e) => setTemplateForm({ ...templateForm, institutionName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Subheading / Registry Board</label>
                    <Input
                      value={templateForm.subHeader}
                      onChange={(e) => setTemplateForm({ ...templateForm, subHeader: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Border Style</label>
                      <select
                        value={templateForm.borderStyle}
                        onChange={(e) => setTemplateForm({ ...templateForm, borderStyle: e.target.value as any })}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                      >
                        <option value="EMERALD_CLINICAL">Emerald Clinical</option>
                        <option value="CLASSIC_GOLD">Classic Gold</option>
                        <option value="MINIMALIST_NAVY">Minimalist Navy</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Primary Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={templateForm.primaryColor}
                          onChange={(e) => setTemplateForm({ ...templateForm, primaryColor: e.target.value })}
                          className="h-9 w-12 rounded cursor-pointer border border-input p-0.5"
                        />
                        <Input
                          value={templateForm.primaryColor}
                          onChange={(e) => setTemplateForm({ ...templateForm, primaryColor: e.target.value })}
                          className="font-mono text-xs uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">
                      Signatory 1 (Academic Board)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder="Signatory Name"
                        value={templateForm.signatoryName1}
                        onChange={(e) => setTemplateForm({ ...templateForm, signatoryName1: e.target.value })}
                      />
                      <Input
                        placeholder="Signatory Title"
                        value={templateForm.signatoryTitle1}
                        onChange={(e) => setTemplateForm({ ...templateForm, signatoryTitle1: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">
                      Signatory 2 (Clinical Director)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder="Signatory Name"
                        value={templateForm.signatoryName2}
                        onChange={(e) => setTemplateForm({ ...templateForm, signatoryName2: e.target.value })}
                      />
                      <Input
                        placeholder="Signatory Title"
                        value={templateForm.signatoryTitle2}
                        onChange={(e) => setTemplateForm({ ...templateForm, signatoryTitle2: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Embossed Seal Text</label>
                    <Input
                      value={templateForm.sealText}
                      onChange={(e) => setTemplateForm({ ...templateForm, sealText: e.target.value })}
                    />
                  </div>

                  {templateSavedMsg && (
                    <div className="p-2 text-center text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 rounded-md font-semibold">
                      Template styles updated successfully!
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Save Template Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Live Certificate Preview
              </h3>
              <Badge variant="outline" className="text-[10px]">
                Interactive Render
              </Badge>
            </div>

            <div
              className={`rounded-2xl p-8 border-4 bg-card text-foreground shadow-xl relative overflow-hidden ${
                templateForm.borderStyle === "EMERALD_CLINICAL"
                  ? "border-emerald-600 dark:border-emerald-500"
                  : templateForm.borderStyle === "CLASSIC_GOLD"
                  ? "border-amber-600 dark:border-amber-400"
                  : "border-blue-700 dark:border-blue-500"
              }`}
            >
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-xs opacity-40 font-mono">✦✦</div>
              <div className="absolute top-2 right-2 text-xs opacity-40 font-mono">✦✦</div>
              <div className="absolute bottom-2 left-2 text-xs opacity-40 font-mono">✦✦</div>
              <div className="absolute bottom-2 right-2 text-xs opacity-40 font-mono">✦✦</div>

              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold tracking-wide uppercase">
                    {templateForm.institutionName}
                  </h2>
                  <p className="text-[11px] text-muted-foreground tracking-widest uppercase mt-0.5">
                    {templateForm.subHeader}
                  </p>
                </div>

                <div className="py-2">
                  <span className="text-[10px] tracking-widest font-semibold uppercase text-primary border-b border-primary/30 pb-0.5">
                    Certificate of Competency & Academic Achievement
                  </span>
                </div>

                <p className="text-xs italic text-muted-foreground">This is to officially certify that</p>

                <h3 className="text-xl sm:text-2xl font-bold font-serif text-foreground underline decoration-primary/40 underline-offset-8">
                  Md. Ansarul Islam
                </h3>

                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  has successfully satisfied all rigorous theoretical, clinical laboratory, and bench practical competencies for{" "}
                  <strong className="text-foreground">1st Year Foundation Competency: Diagnostic Pre-Analytical SOPs & Basic Sciences</strong>{" "}
                  with an evaluation grade of <strong className="text-primary">Distinction (92%)</strong>.
                </p>

                <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 items-end gap-3 text-[10px] text-muted-foreground">
                  <div className="text-center border-t border-border pt-1">
                    <p className="font-semibold text-foreground">{templateForm.signatoryName1}</p>
                    <p className="text-[9px]">{templateForm.signatoryTitle1}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-2 border-dashed border-primary flex items-center justify-center p-1 text-[8px] font-bold text-center text-primary leading-none">
                      {templateForm.sealText.slice(0, 18)}
                    </div>
                  </div>

                  <div className="text-center border-t border-border pt-1">
                    <p className="font-semibold text-foreground">{templateForm.signatoryName2}</p>
                    <p className="text-[9px]">{templateForm.signatoryTitle2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATE FULL MODAL / PRINT VIEW */}
      {selectedCertForPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl relative my-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/40 text-xs">
                  Official Verification ID: {selectedCertForPreview.verificationCode}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handlePrint} className="gap-1.5 h-8 text-xs">
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Document</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCertForPreview(null)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Render Printable Certificate */}
            <div
              className={`rounded-2xl p-4 sm:p-8 md:p-10 border-4 sm:border-8 bg-card text-foreground shadow-sm relative overflow-hidden ${
                templateConfig.borderStyle === "EMERALD_CLINICAL"
                  ? "border-emerald-600"
                  : templateConfig.borderStyle === "CLASSIC_GOLD"
                  ? "border-amber-600"
                  : "border-blue-700"
              }`}
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold uppercase tracking-wider">
                    {templateConfig.institutionName}
                  </h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    {templateConfig.subHeader}
                  </p>
                </div>

                <div className="py-2">
                  <span className="text-xs tracking-widest font-semibold uppercase text-primary border-b-2 border-primary/40 pb-1">
                    Certificate of Competency & Academic Achievement
                  </span>
                </div>

                <p className="text-xs italic text-muted-foreground">This is to officially certify that</p>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-foreground underline decoration-primary underline-offset-8">
                  {selectedCertForPreview.studentName}
                </h3>

                <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  having studied at <strong className="text-foreground">{selectedCertForPreview.institution}</strong>, has successfully fulfilled all clinical benchmark requirements for{" "}
                  <strong className="text-foreground">{selectedCertForPreview.title}</strong> in the program of{" "}
                  <strong className="text-foreground">{selectedCertForPreview.program} (Year {selectedCertForPreview.year})</strong> with an official assessment grade of{" "}
                  <strong className="text-primary">{selectedCertForPreview.grade}</strong>.
                </p>

                <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 items-end gap-4 text-xs text-muted-foreground">
                  <div className="text-center border-t border-border pt-2">
                    <p className="font-semibold text-foreground">{templateConfig.signatoryName1}</p>
                    <p className="text-[10px]">{templateConfig.signatoryTitle1}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full border-2 border-dashed border-primary flex items-center justify-center p-1 text-[9px] font-bold text-center text-primary leading-tight">
                      {templateConfig.sealText}
                    </div>
                    <span className="text-[9px] font-mono mt-1 text-muted-foreground">
                      {selectedCertForPreview.code}
                    </span>
                  </div>

                  <div className="text-center border-t border-border pt-2">
                    <p className="font-semibold text-foreground">{templateConfig.signatoryName2}</p>
                    <p className="text-[10px]">{templateConfig.signatoryTitle2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
