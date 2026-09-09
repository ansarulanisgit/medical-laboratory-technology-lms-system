"use client";

import * as React from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight,
  UserCheck,
  AlertCircle,
  History,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  institution?: string;
  role: string;
  category: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: "RECEIVED" | "UNDER_REVIEW" | "RESPONDED";
}

const FAQ_ITEMS = [
  {
    q: "Do I need to log in to contact support or ask academic questions?",
    a: "No. This contact desk is open to all students, faculty members, institutional principals, and applicants across Bangladesh without any sign-in requirement.",
  },
  {
    q: "How fast will the academic coordination team reply to my inquiry?",
    a: "Our coordination desk processes inquiries Sunday through Thursday between 8:00 AM and 6:00 PM BST. Typical response time is between 4 and 24 hours via email or WhatsApp.",
  },
  {
    q: "How can health directorates or employers verify certificates issued by LabTutor Academy?",
    a: "Digital credentials can be verified instantaneously on our public verification portal at /verify using the official 10-digit authentication code stamped on the credential.",
  },
  {
    q: "Is the LabTutor curriculum certified according to State Medical Faculty of Bangladesh (SMFB) standards?",
    a: "Yes. All curriculum subjects, lesson sequences, OSPE diagnostic bench SOP checklists, and viva voice items are specifically structured per SMFB and DGHS clinical benchmarks.",
  },
  {
    q: "Can institute mentors and department heads register their student batches?",
    a: "Yes. Institute leaders can select 'Faculty / Institutional Partnership' in the form below to request administrative batch onboarding and mentor tracking dashboards.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    institution: "Dhaka Institute of Health Technology (DIHT)",
    userType: "STUDENT",
    category: "CURRICULUM_ACADEMIC",
    subject: "",
    message: "",
    mathAnswer: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedInquiry, setSubmittedInquiry] = React.useState<ContactInquiry | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [savedInquiries, setSavedInquiries] = React.useState<ContactInquiry[]>([]);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  // Simple dynamic anti-spam math verification
  const [mathProblem, setMathProblem] = React.useState({ a: 4, b: 5 });

  React.useEffect(() => {
    // Generate simple randomized addition
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 6) + 1;
    setMathProblem({ a, b });

    // Load past inquiries from local storage
    try {
      const stored = localStorage.getItem("labtutor_public_contact_inquiries_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSavedInquiries(parsed);
      }
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate form inputs
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in all required fields marked with an asterisk (*).");
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please provide a valid email address so we can reply to you.");
      return;
    }

    // Simple anti-spam math verification
    const expected = mathProblem.a + mathProblem.b;
    if (parseInt(formData.mathAnswer.trim(), 10) !== expected) {
      setErrorMessage(`Math verification incorrect. Please solve: ${mathProblem.a} + ${mathProblem.b} = ?`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: ContactInquiry = {
        id: `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        institution: formData.institution.trim(),
        role: formData.userType,
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        submittedAt: new Date().toISOString(),
        status: "RECEIVED",
      };

      const updated = [newInquiry, ...savedInquiries];
      setSavedInquiries(updated);
      try {
        localStorage.setItem("labtutor_public_contact_inquiries_v1", JSON.stringify(updated));
      } catch {}

      setSubmittedInquiry(newInquiry);
      setIsSubmitting(false);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        institution: "Dhaka Institute of Health Technology (DIHT)",
        userType: "STUDENT",
        category: "CURRICULUM_ACADEMIC",
        subject: "",
        message: "",
        mathAnswer: "",
      });

      // Reset math problem
      const nextA = Math.floor(Math.random() * 8) + 2;
      const nextB = Math.floor(Math.random() * 6) + 1;
      setMathProblem({ a: nextA, b: nextB });
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 sm:px-6 max-w-6xl space-y-12">
        {/* HERO BANNER */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Public Academic Helpdesk • No Login Required</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Get in Touch with <span className="text-primary">LabTutor Academy</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Have questions regarding the SMFB Medical Laboratory Technology curriculum, OSPE examination benchmark stations, logbook sign-offs, or institutional registration? We are here to support your learning journey.
          </p>
        </div>

        {/* 4 CONTACT CHANNELS MATRIX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Campus Office */}
          <Card className="p-5 rounded-2xl border-border bg-card shadow-xs hover:border-primary/40 transition-colors space-y-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Academic Campus</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                DGHS &amp; State Medical Faculty Liaison Desk
              </p>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1">
              <p className="font-medium text-foreground">Mohakhali Health Complex</p>
              <p>Dhaka-1212, Bangladesh</p>
            </div>
          </Card>

          {/* Card 2: Email Contacts */}
          <Card className="p-5 rounded-2xl border-border bg-card shadow-xs hover:border-primary/40 transition-colors space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Official Email Desks</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Direct coordinator responses within 24h
              </p>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1 font-mono">
              <a href="mailto:support@labtutoracademy.com" className="block text-primary hover:underline truncate">
                support@labtutoracademy.com
              </a>
              <a href="mailto:academic@labtutoracademy.com" className="block text-muted-foreground hover:text-foreground truncate">
                academic@labtutoracademy.com
              </a>
            </div>
          </Card>

          {/* Card 3: Telephone & Hotline */}
          <Card className="p-5 rounded-2xl border-border bg-card shadow-xs hover:border-primary/40 transition-colors space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Telephone Helpline</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Sun – Thu: 8:00 AM – 6:00 PM BST
              </p>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1 font-mono">
              <p className="font-bold text-foreground">+880 1712-345678</p>
              <p className="text-[11px] text-muted-foreground">Emergency Exam Desk: +880 1812-345678</p>
            </div>
          </Card>

          {/* Card 4: Community & WhatsApp */}
          <Card className="p-5 rounded-2xl border-border bg-card shadow-xs hover:border-primary/40 transition-colors space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Community &amp; Social</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Direct mentor &amp; student channels
              </p>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 flex flex-col space-y-1.5 font-semibold">
              <Link
                href="https://www.facebook.com/ansarulanis"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <span>Lead Developer Profile</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
              <span className="text-[11px] text-muted-foreground">Telegram MLT Study Network</span>
            </div>
          </Card>
        </div>

        {/* MAIN SECTION: CONTACT FORM & INSTITUTIONAL INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: INTERACTIVE CONTACT FORM (7 COLS) */}
          <Card className="lg:col-span-7 rounded-3xl border-border bg-card shadow-md overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    Send an Official Inquiry
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-0.5">
                    Our academic coordinators and technical mentors will review and get back to you promptly.
                  </CardDescription>
                </div>
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Send className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              {/* SUCCESS STATE */}
              {submittedInquiry ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="h-14 w-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Inquiry Successfully Submitted!</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                      Thank you, <strong className="text-foreground">{submittedInquiry.name}</strong>. Your ticket has been logged with our academic desk.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border inline-block text-left text-xs space-y-1.5 font-mono max-w-sm w-full mx-auto">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking ID:</span>
                      <span className="font-bold text-primary">{submittedInquiry.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipient Email:</span>
                      <span className="font-medium text-foreground truncate max-w-[170px]">{submittedInquiry.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Topic:</span>
                      <span className="font-medium text-foreground truncate max-w-[170px]">{submittedInquiry.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SLA Window:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Within 24 Hours</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Button
                      onClick={() => setSubmittedInquiry(null)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      <span>Submit Another Inquiry</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">
                        Your Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Mohammad Ansarul"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-xl text-xs sm:text-sm h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="e.g. ansarul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-xl text-xs sm:text-sm h-10"
                      />
                    </div>
                  </div>

                  {/* Phone & User Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">
                        Phone / WhatsApp Number (Optional)
                      </label>
                      <Input
                        type="tel"
                        placeholder="e.g. +880 1700-000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-xl text-xs sm:text-sm h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">
                        I am contacting as:
                      </label>
                      <select
                        value={formData.userType}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-3 h-10 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
                      >
                        <option value="STUDENT">Enrolled MLT Student (Diploma / B.Sc.)</option>
                        <option value="APPLICANT">Prospective Student / Applicant</option>
                        <option value="MENTOR">Faculty Mentor / Instructor</option>
                        <option value="INSTITUTE_ADMIN">Institute Principal / Administrator</option>
                        <option value="EMPLOYER">Diagnostic Center / Clinical Employer</option>
                        <option value="OTHER">General Public / Health Researcher</option>
                      </select>
                    </div>
                  </div>

                  {/* Institution & Inquiry Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">
                        Institution / Institute Name
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Dhaka Institute of Health Technology (DIHT)"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="rounded-xl text-xs sm:text-sm h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">
                        Inquiry Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-3 h-10 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
                      >
                        <option value="CURRICULUM_ACADEMIC">Curriculum &amp; Study Center Lessons</option>
                        <option value="EXAM_OSPE">SMFB Examination Routine &amp; OSPE Viva</option>
                        <option value="BENCH_SOPS">ISO 15189 Clinical Bench Competency SOPs</option>
                        <option value="CERTIFICATE_VERIFY">Certificate Verification &amp; Conferred Inquiries</option>
                        <option value="INSTITUTION_PARTNER">Institutional Batch Enrollment &amp; Partnership</option>
                        <option value="TECHNICAL_SUPPORT">Account, Password &amp; Portal Technical Issue</option>
                        <option value="GENERAL">General Inquiries</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject Headline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Inquiry Subject Headline *
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Inquiring about 2nd Year Microbiology OSPE stations checklist"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="rounded-xl text-xs sm:text-sm h-10"
                    />
                  </div>

                  {/* Message Body */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Detailed Message / Description *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please write your questions, batch details, or feedback with as much detail as possible..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full rounded-xl border border-input bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs leading-relaxed"
                    />
                  </div>

                  {/* Anti-Spam Math Captcha */}
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-bold text-foreground">Security Verification:</span> What is{" "}
                      <span className="font-mono font-bold text-primary text-sm">
                        {mathProblem.a} + {mathProblem.b}
                      </span>{" "}
                      ?
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Answer"
                        value={formData.mathAnswer}
                        onChange={(e) => setFormData({ ...formData, mathAnswer: e.target.value })}
                        required
                        className="w-24 h-9 rounded-lg text-xs text-center font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md cursor-pointer transition-all"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Dispatching Inquiry to Academic Desk...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Send className="h-4 w-4" />
                          <span>Submit Official Inquiry Now</span>
                        </div>
                      )}
                    </Button>
                    <p className="text-[11px] text-center text-muted-foreground mt-2">
                      Official State Medical Faculty &amp; DGHS affiliated communication standard. No login required.
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* RIGHT: INSTITUTIONAL DESK & PAST INQUIRIES (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Affiliation & Standards Card */}
            <Card className="p-5 sm:p-6 rounded-3xl border-border bg-gradient-to-br from-card via-card to-primary/[0.04] space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Institutional Integrity</h3>
                  <p className="text-xs text-muted-foreground">Certified Educational Platform</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                LabTutor Academy provides rigorous digital support specifically configured for students preparing for the <strong className="text-foreground">State Medical Faculty of Bangladesh (SMFB)</strong> annual board examinations and continuous clinical bench SOP assessment.
              </p>

              <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Curriculum aligned with Dhaka IHT, Rajshahi IHT &amp; all affiliated government/private institutes.</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Interactive laboratory diagnostic bench SOP matrix based on ISO 15189 guidelines.</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Tamper-proof digital credential verification via QR code and auth reference keys.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>Verify Student Credential Online</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>

            {/* Operating Hours Card */}
            <Card className="p-5 sm:p-6 rounded-3xl border-border bg-card shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-foreground">Helpdesk Operating Schedule</h4>
              </div>

              <div className="text-xs divide-y divide-border/60">
                <div className="py-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Sunday – Thursday:</span>
                  <span className="font-bold text-foreground">8:00 AM – 6:00 PM (BST)</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Friday – Saturday:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Emergency Desk Only</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Exam Season Routine:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">24/7 Notice Updates</span>
                </div>
              </div>
            </Card>

            {/* Saved Inquiries History Drawer (if any) */}
            {savedInquiries.length > 0 && (
              <Card className="p-5 rounded-3xl border-border bg-card shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <h4 className="font-bold text-sm text-foreground">Your Recent Inquiries</h4>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {savedInquiries.length} Logged
                  </Badge>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {savedInquiries.slice(0, 4).map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-muted/40 border border-border/70 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-bold text-primary">{item.id}</span>
                        <span className="text-muted-foreground">
                          {new Date(item.submittedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div className="font-bold text-foreground truncate">{item.subject}</div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="truncate max-w-[150px]">{item.email}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Received
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <div className="space-y-6 pt-6 border-t border-border">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs font-semibold text-primary">
              Instant Knowledge Base
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Quick answers about student access, examination routines, and laboratory competencies.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                      <span>{item.q}</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        isOpen ? "rotate-180 text-primary" : ""
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10 animate-in fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
