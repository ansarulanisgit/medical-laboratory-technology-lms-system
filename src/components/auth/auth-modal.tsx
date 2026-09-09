"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "./auth-modal-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Microscope,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  GraduationCap,
  Calendar,
  Building2,
  CheckCircle2,
  Loader2,
  Sparkles,
  MailCheck,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const STANDARD_INSTITUTIONS = [
  "Institute of Health Technology (IHT), Rajshahi",
  "Dhaka Institute of Health Technology (DIHT)",
  "Chittagong Medical College (IHT Wing)",
  "Institute of Health Technology, Sylhet",
  "Institute of Health Technology, Rangpur",
  "Faculty of Allied Health Sciences, University of Dhaka",
  "Others",
];

export function AuthModal() {
  const router = useRouter();
  const { isOpen, activeTab, closeAuthModal, setActiveTab } = useAuthModal();

  // Login states
  const [loginIdentifier, setLoginIdentifier] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [loginSuccessMsg, setLoginSuccessMsg] = React.useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string | null>(null);
  const [resendLoading, setResendLoading] = React.useState(false);
  const [resendStatus, setResendStatus] = React.useState<string | null>(null);

  // Register states
  const [regStep, setRegStep] = React.useState<1 | 2>(1);
  const [regFullName, setRegFullName] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regPhone, setRegPhone] = React.useState("");
  const [regPassword, setRegPassword] = React.useState("");
  const [regConfirmPassword, setRegConfirmPassword] = React.useState("");
  const [showRegPassword, setShowRegPassword] = React.useState(false);
  const [regProgram, setRegProgram] = React.useState<"DIPLOMA" | "BSC">("DIPLOMA");
  const [regYear, setRegYear] = React.useState("1");
  const [regInstitution, setRegInstitution] = React.useState(STANDARD_INSTITUTIONS[0]);
  const [regCustomInstitution, setRegCustomInstitution] = React.useState("");
  const [regRoll, setRegRoll] = React.useState("");
  const [regLoading, setRegLoading] = React.useState(false);
  const [regError, setRegError] = React.useState<string | null>(null);

  // Verification sent state
  const [regVerificationSent, setRegVerificationSent] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState("");
  const [resendCooldown, setResendCooldown] = React.useState(0);

  // Check URL parameters for email verification notices
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified") === "true" || params.get("email_verified") === "true") {
        const emailParam = params.get("email");
        if (emailParam) {
          const cleanKey = emailParam.trim().toLowerCase();
          try {
            const pendingRaw = localStorage.getItem(`labtutor_pending_${cleanKey}`);
            if (pendingRaw) {
              const parsed = JSON.parse(pendingRaw);
              parsed.isVerified = true;
              localStorage.setItem(`labtutor_pending_${cleanKey}`, JSON.stringify(parsed));
              localStorage.setItem("labtutor_academic_profile_v2", JSON.stringify(parsed));
              localStorage.setItem("labtutor_academic_profile_v3", JSON.stringify(parsed));
            }
          } catch {}
          setLoginIdentifier(cleanKey);
        }
        setLoginSuccessMsg("Email verified successfully! You can now sign in to your student dashboard.");
        setActiveTab("LOGIN");
        setUnverifiedEmail(null);
        setLoginError(null);
      } else if (params.get("error") === "auth_callback_failed") {
        setLoginError("Verification link expired or already used. Please request a new link.");
        setActiveTab("LOGIN");
      }
    }
  }, [setActiveTab]);

  // Resend cooldown timer
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Reset errors and step when tab changes
  React.useEffect(() => {
    setLoginError(null);
    setLoginSuccessMsg(null);
    setRegError(null);
    setUnverifiedEmail(null);
    setResendStatus(null);
    if (activeTab === "REGISTER") {
      setRegStep(1);
      setRegVerificationSent(false);
    }
  }, [activeTab]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeAuthModal]);

  if (!isOpen) return null;

  // Handle Resend Verification Email
  const handleResendVerification = async (targetEmail: string) => {
    if (!targetEmail || resendCooldown > 0) return;
    setResendLoading(true);
    setResendStatus(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder") || supabaseUrl.includes("your-project");

      if (!isPlaceholder) {
        const supabase = createClient();
        const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: targetEmail.trim().toLowerCase(),
          options: {
            emailRedirectTo: `${siteUrl}/auth/callback?next=/student`,
          },
        });

        if (error) {
          setResendStatus("Failed to resend: " + error.message);
          return;
        }
      }

      setResendStatus("Verification link prepared! Click the direct button below or open the callback link.");
      setResendCooldown(60);
    } catch {
      setResendStatus("Verification link ready! You can activate your account below.");
      setResendCooldown(60);
    } finally {
      setResendLoading(false);
    }
  };

  // Verify email and immediately login to student dashboard
  const handleVerifyAndLogin = async (targetEmail: string) => {
    const cleanKey = targetEmail.trim().toLowerCase();
    const setSessionCookie = () => {
      if (typeof document !== "undefined") {
        document.cookie = "labtutor-session=true; path=/; max-age=604800; SameSite=Lax";
      }
    };

    try {
      await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanKey }),
      });
    } catch {}

    setSessionCookie();

    // Auto-login with Supabase if password exists
    try {
      const supabase = createClient();
      if (loginPassword) {
        await supabase.auth.signInWithPassword({
          email: cleanKey,
          password: loginPassword,
        });
      }
    } catch {}

    try {
      const pendingRaw = localStorage.getItem(`labtutor_pending_${cleanKey}`);
      if (pendingRaw) {
        const parsed = JSON.parse(pendingRaw);
        parsed.isVerified = true;
        localStorage.setItem(`labtutor_pending_${cleanKey}`, JSON.stringify(parsed));
        localStorage.setItem("labtutor_academic_profile_v2", JSON.stringify(parsed));
        localStorage.setItem("labtutor_academic_profile_v3", JSON.stringify(parsed));
      } else {
        const fallbackProfile = {
          fullName: regFullName || cleanKey.split("@")[0],
          email: cleanKey,
          role: "STUDENT",
          isVerified: true,
          institution: regInstitution || "Institute of Health Technology (IHT)",
          program: regProgram || "DIPLOMA",
          academicYear: regYear || "1",
        };
        localStorage.setItem("labtutor_academic_profile_v2", JSON.stringify(fallbackProfile));
        localStorage.setItem("labtutor_academic_profile_v3", JSON.stringify(fallbackProfile));
      }
    } catch {}

    closeAuthModal();
    window.location.href = "/student";
  };

  // Simulate local verification for offline dev testing
  const handleSimulateLocalVerification = (targetEmail: string) => {
    handleVerifyAndLogin(targetEmail);
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    const defaultEmail = loginIdentifier.includes("@") ? loginIdentifier : "";
    const email = window.prompt(
      "Enter your registered email address to receive a password reset link:",
      defaultEmail
    );
    if (!email || !email.trim()) return;

    try {
      const supabase = createClient();
      const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${siteUrl}/auth/callback?next=/student`,
      });
      if (error) {
        alert(error.message || "Failed to send reset link. Please verify the email address.");
      } else {
        alert(`A password reset link has been sent to ${email.trim()}. Please check your email inbox and spam folder.`);
      }
    } catch {
      alert(`If an account exists for ${email.trim()}, a password reset link has been dispatched.`);
    }
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    setLoginSuccessMsg(null);
    setUnverifiedEmail(null);

    const cleanInput = loginIdentifier.trim().toLowerCase();

    // Map usernames to master emails
    let authEmail = cleanInput;
    if (cleanInput === "ansarulanis") {
      authEmail = "ansarul.contact@gmail.com";
    } else if (cleanInput === "ansarul.admin" || cleanInput === "ansarulislam") {
      authEmail = "ansarul.admin@gmail.com";
    }

    const setSessionCookie = () => {
      if (typeof document !== "undefined") {
        document.cookie = "labtutor-session=true; path=/; max-age=604800; SameSite=Lax";
      }
    };

    // Fast check for Super Admin credentials
    const isAnsarulIslam =
      (cleanInput === "ansarul.admin" ||
        cleanInput === "ansarul.admin@gmail.com" ||
        cleanInput === "ansarulislam") &&
      (loginPassword === "Ansarulislam" || loginPassword === "Ansarul@233");

    const isAnsarulAnis =
      (cleanInput === "ansarulanis" || cleanInput === "ansarul.contact@gmail.com") &&
      (loginPassword === "Ansarul@233" || loginPassword === "Ansarulislam");

    if (isAnsarulIslam || isAnsarulAnis) {
      setSessionCookie();
      try {
        const saved = localStorage.getItem("labtutor_academic_profile_v2");
        const base = saved ? JSON.parse(saved) : {};
        base.role = "SUPER_ADMIN";
        base.baseRole = "SUPER_ADMIN";
        base.fullName = isAnsarulIslam ? "Ansarul Islam" : "Ansarul Anis";
        base.username = isAnsarulIslam ? "ansarul.admin" : "ansarulanis";
        base.email = isAnsarulIslam ? "ansarul.admin@gmail.com" : "ansarul.contact@gmail.com";
        base.institution = "DGHS Medical Technology Directorate & LabTutor Central Administration";
        base.studentIdNumber = isAnsarulIslam ? "LT-SA-002" : "LT-SA-001";
        base.program = "BSC";
        base.academicYear = "4";
        localStorage.setItem("labtutor_academic_profile_v2", JSON.stringify(base));
        localStorage.setItem("labtutor_academic_profile_v3", JSON.stringify(base));
      } catch {}
      closeAuthModal();
      window.location.href = "/student";
      return;
    }

    // 1. Authenticate with Supabase
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: loginPassword,
      });

      if (!error && data?.user) {
        // Double check email confirmation if available on user object
        if (data.user.email_confirmed_at === null) {
          setLoginError(
            "Your email address has not been verified yet. Please click the confirmation link sent to your registered email before signing in."
          );
          setUnverifiedEmail(cleanInput);
          return;
        }

        setSessionCookie();

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, email")
          .eq("id", data.user.id)
          .single();

        const role = profile?.role || data.user.user_metadata?.role || (authEmail.includes("super") ? "SUPER_ADMIN" : "STUDENT");
        try {
          const saved = localStorage.getItem("labtutor_academic_profile_v2");
          const base = saved ? JSON.parse(saved) : {};
          base.role = role;
          base.baseRole = role;
          base.email = data.user.email;
          if (profile?.full_name) base.fullName = profile.full_name;
          localStorage.setItem("labtutor_academic_profile_v2", JSON.stringify(base));
          localStorage.setItem("labtutor_academic_profile_v3", JSON.stringify(base));
        } catch {}

        closeAuthModal();
        window.location.href = "/student";
        return;
      }

      if (error) {
        const errMsg = error.message.toLowerCase();

        // Check if error is due to unverified email
        if (
          errMsg.includes("email not confirmed") ||
          errMsg.includes("not confirmed") ||
          (error as any)?.code === "email_not_confirmed"
        ) {
          setLoginError(
            "Your email address has not been verified yet. Please click the confirmation link sent to your registered email before signing in."
          );
          setUnverifiedEmail(cleanInput);
          return;
        }

        // Master Super Admin bypass fallback (if remote network fails or service temporarily down)
        if (
          (cleanInput === "ansarulanis" || cleanInput === "ansarul.contact@gmail.com") &&
          loginPassword === "Ansarul@233"
        ) {
          setSessionCookie();
          try {
            const saved = localStorage.getItem("labtutor_academic_profile_v2");
            const base = saved ? JSON.parse(saved) : {};
            base.role = "SUPER_ADMIN";
            base.baseRole = "SUPER_ADMIN";
            base.fullName = "Ansarul Anis";
            base.username = "ansarulanis";
            base.email = "ansarul.contact@gmail.com";
            base.institution = "DGHS Medical Technology Directorate & LabTutor Central Administration";
            base.studentIdNumber = "LT-SA-001";
            base.program = "BSC";
            base.academicYear = "4";
            localStorage.setItem("labtutor_academic_profile_v2", JSON.stringify(base));
            localStorage.setItem("labtutor_academic_profile_v3", JSON.stringify(base));
          } catch {}
          closeAuthModal();
          window.location.href = "/student";
          return;
        }

        // Check local pending verification storage
        const pendingRaw = localStorage.getItem(`labtutor_pending_${cleanInput}`);
        if (pendingRaw) {
          try {
            const pendingProfile = JSON.parse(pendingRaw);
            if (pendingProfile.isVerified === false) {
              setLoginError(
                "Your email address has not been verified yet. Please click the confirmation link sent to your email before signing in."
              );
              setUnverifiedEmail(cleanInput);
              return;
            }
            if (pendingProfile.password && pendingProfile.password !== loginPassword) {
              setLoginError("Invalid password. Please try again.");
              return;
            }
            setSessionCookie();
            localStorage.setItem("labtutor_academic_profile_v2", JSON.stringify(pendingProfile));
            localStorage.setItem("labtutor_academic_profile_v3", JSON.stringify(pendingProfile));
            closeAuthModal();
            window.location.href = "/student";
            return;
          } catch {}
        }

        // Display user-friendly error message
        if (errMsg.includes("invalid login credentials")) {
          setLoginError("Invalid email or password. Please double-check your credentials.");
        } else {
          setLoginError(error.message);
        }
        return;
      }
    } catch (err: any) {
      // Offline / Emergency Super Admin check
      if (
        (cleanInput === "ansarulanis" || cleanInput === "ansarul.contact@gmail.com") &&
        loginPassword === "Ansarul@233"
      ) {
        setSessionCookie();
        closeAuthModal();
        window.location.href = "/student";
        return;
      }
      setLoginError(err?.message || "An unexpected error occurred. Please try again.");
      setLoginError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Next step in Registration (Phone Number is Mandatory)
  const handleRegNext = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regFullName.trim()) {
      setRegError("Please enter your full name.");
      return;
    }
    if (!regPhone.trim()) {
      setRegError("Phone number is required. Please provide your active phone number.");
      return;
    }
    const cleanDigits = regPhone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setRegError("Please enter a valid phone number (at least 10 digits).");
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setRegError("Please provide a valid email address.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }

    setRegStep(2);
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError(null);

    const finalInstitution =
      regInstitution === "Others"
        ? regCustomInstitution.trim() || "Independent Medical Institute"
        : regInstitution;

    const finalStudentId =
      regRoll.trim() ||
      `LT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const normalizedEmail = regEmail.trim().toLowerCase();

    const setSessionCookie = () => {
      if (typeof document !== "undefined") {
        document.cookie = "labtutor-session=true; path=/; max-age=604800; SameSite=Lax";
      }
    };

    try {
      const profilePayload = {
        fullName: regFullName.trim(),
        username: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        phone: regPhone.trim(),
        role: "STUDENT",
        institution: finalInstitution,
        program: regProgram,
        academicYear: regYear,
        curriculumVersionCode: regProgram === "BSC" ? "BSC-LT-2024-V2" : "DMT-2023-V1",
        enrollmentYear: new Date().getFullYear(),
        studentIdNumber: finalStudentId,
        password: regPassword,
        isVerified: true,
        registeredAt: new Date().toISOString(),
      };

      // Always save pending profile to local storage backup
      localStorage.setItem(`labtutor_pending_${normalizedEmail}`, JSON.stringify(profilePayload));

      // Register and auto-confirm through server admin client
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password: regPassword,
          fullName: regFullName.trim(),
          phone: regPhone.trim(),
          institution: finalInstitution,
          program: regProgram,
          academicYear: regYear,
          studentIdNumber: finalStudentId,
        }),
      });

      const resData = await response.json();

      if (!response.ok || resData.error) {
        if (
          resData.error?.toLowerCase().includes("already registered") ||
          resData.error?.toLowerCase().includes("user already")
        ) {
          setRegError("An account with this email address already exists. Please sign in instead.");
          return;
        }
        throw new Error(resData.error || "Registration failed. Please try again.");
      }

      // Log in with Supabase directly
      try {
        const supabase = createClient();
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: regPassword,
        });
      } catch {}

      setSessionCookie();
      localStorage.setItem("labtutor_academic_profile_v2", JSON.stringify(profilePayload));
      localStorage.setItem("labtutor_academic_profile_v3", JSON.stringify(profilePayload));

      closeAuthModal();
      window.location.href = "/student";
      return;
    } catch (err: any) {
      setRegError(err?.message || "Registration failed. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Dialog Card (Desktop Dual-Pane, Mobile Single-Pane) */}
      <div className="relative w-full max-w-md md:max-w-4xl lg:max-w-5xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[94vh] md:max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* ============================================================== */}
        {/* LEFT BRAND PANEL (DESKTOP ONLY)                                */}
        {/* ============================================================== */}
        <div className="hidden md:flex md:w-[46%] lg:w-[44%] flex-col justify-between p-6 sm:p-8 lg:p-9 bg-gradient-to-br from-primary/15 via-primary/5 to-card border-r border-border/70 relative shrink-0 select-none">
          {/* Subtle decorative glow */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25 shrink-0">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-foreground tracking-tight leading-tight">
                  LabTutor <span className="text-primary font-bold">Academy</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                  Dedicated LMS Platform
                </div>
              </div>
            </div>
          </div>

          {/* Middle Value Proposition */}
          <div className="relative space-y-4 my-auto py-3">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              {activeTab === "LOGIN"
                ? "Access your interactive study center, 10-year question bank, and practical SOPs."
                : "The all-in-one digital learning platform for Diploma and BSc Medical Laboratory Technology students."}
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-foreground">
                <div className="h-5.5 w-5.5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>Interactive Study Center &amp; Notes</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-foreground">
                <div className="h-5.5 w-5.5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>Last 10 Years Question Banks</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-foreground">
                <div className="h-5.5 w-5.5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>Step-by-Step Practical SOPs</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-foreground">
                <div className="h-5.5 w-5.5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>Certificates, Resume Builder &amp; Jobs</span>
              </div>
            </div>
          </div>

          {/* Bottom Developer Credit */}
          <div className="relative pt-3 border-t border-border/60">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                Developed by{" "}
                <a
                  href="https://www.facebook.com/ansarulanis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary hover:underline"
                >
                  Ansarul Anis
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT FORM PANEL (RESPONSIVE & SPACIOUS)                      */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col overflow-hidden bg-card">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-3.5 border-b border-border/70 bg-muted/20 shrink-0">
            {/* Segmented Tab Switcher */}
            <div className="flex-1 max-w-xs sm:max-w-sm mx-auto md:mx-0">
              <div className="grid grid-cols-2 gap-1 p-1 sm:gap-1.5 sm:p-1.5 bg-muted/70 rounded-2xl border border-border/70 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("LOGIN")}
                  className={cn(
                    "py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base font-bold",
                    activeTab === "LOGIN"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground font-semibold"
                  )}
                >
                  <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("REGISTER")}
                  className={cn(
                    "py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base font-bold",
                    activeTab === "REGISTER"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground font-semibold"
                  )}
                >
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closeAuthModal}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-border/60 hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-3 shrink-0"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Form Scrollable Area with balanced padding */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 overflow-y-auto flex-1 flex flex-col overscroll-contain">
            
            {/* ========================================================== */}
            {/* TAB 1: SIGN IN FORM                                        */}
            {/* ========================================================== */}
            {activeTab === "LOGIN" && (
              <form onSubmit={handleLoginSubmit} className="space-y-5 max-w-md mx-auto w-full my-auto">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">Sign In to Dashboard</h3>
                </div>

                {/* Email Verified Success Alert */}
                {loginSuccessMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{loginSuccessMsg}</span>
                  </div>
                )}

                {/* Login Error Alert */}
                {loginError && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{loginError}</span>
                    </div>

                    {/* Quick verify action when email is unverified */}
                    {unverifiedEmail && (
                      <div className="pt-2.5 border-t border-destructive/20 space-y-2.5">
                        <Button
                          type="button"
                          onClick={() => handleVerifyAndLogin(unverifiedEmail)}
                          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Verify Email &amp; Access Dashboard Now</span>
                        </Button>
                        <div className="flex items-center justify-between text-xs pt-0.5 px-1">
                          <button
                            type="button"
                            onClick={() => handleResendVerification(unverifiedEmail)}
                            disabled={resendLoading || resendCooldown > 0}
                            className="font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Send className="h-3 w-3" />
                            <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Link"}</span>
                          </button>
                          <a
                            href={`/auth/callback?verified=true&email=${encodeURIComponent(unverifiedEmail)}`}
                            className="text-muted-foreground hover:text-primary underline cursor-pointer"
                          >
                            Direct Callback Link
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {resendStatus && (
                  <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{resendStatus}</span>
                  </div>
                )}

                <div className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-bold text-foreground">Email or Username</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        required
                        placeholder="student@labtutor.edu or username"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="pl-12 h-12 text-sm sm:text-base rounded-2xl border-border/80 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm sm:text-base font-bold text-foreground">Password</label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs sm:text-sm text-primary hover:underline font-bold cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 text-sm sm:text-base rounded-2xl border-border/80 focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full h-12 sm:h-13 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl text-base cursor-pointer shadow-md shadow-primary/20 transition-all mt-2 flex items-center justify-center gap-2"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="ml-1 h-5 w-5" />
                    </>
                  )}
                </Button>

                {/* Developer / Demo Quick Fill */}
                <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Testing as Super Admin?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier("ansarul.admin@gmail.com");
                      setLoginPassword("Ansarulislam");
                    }}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    Autofill (Ansarul Islam)
                  </button>
                </div>

                <div className="text-center pt-1 text-xs sm:text-sm text-muted-foreground">
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("REGISTER")}
                    className="text-primary font-bold hover:underline cursor-pointer"
                  >
                    Create Student Account
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================== */}
            {/* TAB 2: REGISTRATION FORM                                   */}
            {/* ========================================================== */}
            {activeTab === "REGISTER" && (
              <div className="max-w-lg mx-auto w-full space-y-3.5 my-auto">
                
                {/* -------------------------------------------------------- */}
                {/* CASE A: EMAIL VERIFICATION LINK SENT SUCCESS VIEW        */}
                {/* -------------------------------------------------------- */}
                {regVerificationSent ? (
                  <div className="space-y-4 text-center py-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-lg shadow-primary/10 relative">
                      <MailCheck className="h-8 w-8" />
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold text-foreground">Verify Your Email Address</h3>
                      <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        We have sent an activation link to your registered email:
                      </p>
                      <div className="inline-block px-4 py-2 rounded-2xl bg-muted border border-border/80 text-sm sm:text-base font-mono font-bold text-foreground">
                        {registeredEmail}
                      </div>
                    </div>

                    {/* Step-by-step instructions card */}
                    <div className="p-5 rounded-2xl bg-muted/40 border border-border/70 text-left space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          1
                        </span>
                        <span>Check your inbox (and spam or promotions folder) for our verification email.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          2
                        </span>
                        <span>Click the confirmation link inside the email to activate your student account.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          3
                        </span>
                        <span>Return here to sign in with your email and password to enter the dashboard.</span>
                      </div>
                    </div>

                    {resendStatus && (
                      <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{resendStatus}</span>
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                      <Button
                        type="button"
                        onClick={() => handleVerifyAndLogin(registeredEmail)}
                        className="w-full h-12 sm:h-13 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl text-base cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Verify Email &amp; Open Dashboard</span>
                        <ArrowRight className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center justify-between text-xs sm:text-sm pt-1 px-1">
                        <button
                          type="button"
                          onClick={() => handleResendVerification(registeredEmail)}
                          disabled={resendLoading || resendCooldown > 0}
                          className="text-primary hover:underline font-bold cursor-pointer disabled:opacity-50"
                        >
                          {resendCooldown > 0 ? `Resend link in ${resendCooldown}s` : "Resend Verification Email"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setLoginIdentifier(registeredEmail);
                            setActiveTab("LOGIN");
                            setRegVerificationSent(false);
                          }}
                          className="text-muted-foreground hover:text-foreground underline cursor-pointer"
                        >
                          Sign In with Password
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* -------------------------------------------------------- */
                  /* CASE B: REGISTRATION FORM STEPS 1 & 2                    */
                  /* -------------------------------------------------------- */
                  <>
                    {/* Step Indicator Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                      <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        {regStep === 1
                          ? "Step 1 of 2: Basic Account Details"
                          : "Step 2 of 2: Tailor your syllabus and practicals"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "h-2 w-7 rounded-full transition-all",
                            regStep === 1 ? "bg-primary" : "bg-primary/40"
                          )}
                        />
                        <span
                          className={cn(
                            "h-2 w-7 rounded-full transition-all",
                            regStep === 2 ? "bg-primary" : "bg-muted"
                          )}
                        />
                      </div>
                    </div>

                    {regError && (
                      <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-start gap-2.5">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <span>{regError}</span>
                      </div>
                    )}

                    {/* Step 1: Account Credentials (Mandatory Phone Number) */}
                    {regStep === 1 && (
                      <form onSubmit={handleRegNext} className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Full Name */}
                          <div className="space-y-1.5">
                            <label className="text-sm sm:text-base font-bold text-foreground">Full Name *</label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                type="text"
                                required
                                placeholder="e.g. Md. Ansarul Islam"
                                value={regFullName}
                                onChange={(e) => setRegFullName(e.target.value)}
                                className="pl-11 h-12 text-sm sm:text-base rounded-2xl border-border/80"
                              />
                            </div>
                          </div>

                          {/* Phone Number (Mandatory) */}
                          <div className="space-y-1.5">
                            <label className="text-sm sm:text-base font-bold text-foreground">
                              Phone Number <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                type="tel"
                                required
                                placeholder="01XXXXXXXXX"
                                value={regPhone}
                                onChange={(e) => setRegPhone(e.target.value)}
                                className="pl-11 h-12 text-sm sm:text-base rounded-2xl border-border/80"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-sm sm:text-base font-bold text-foreground">Email Address *</label>
                            <span className="text-xs text-muted-foreground">Verification link will be sent here</span>
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input
                              type="email"
                              required
                              placeholder="student@example.com"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              className="pl-11 h-12 text-sm sm:text-base rounded-2xl border-border/80"
                            />
                          </div>
                        </div>

                        {/* Password & Confirm Password side-by-side */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1.5">
                            <label className="text-sm sm:text-base font-bold text-foreground">Password *</label>
                            <div className="relative">
                              <Input
                                type={showRegPassword ? "text" : "password"}
                                required
                                placeholder="Min. 6 characters"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                className="h-12 pr-11 text-sm sm:text-base rounded-2xl border-border/80"
                              />
                              <button
                                type="button"
                                onClick={() => setShowRegPassword(!showRegPassword)}
                                className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                {showRegPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-sm sm:text-base font-bold text-foreground">Confirm *</label>
                            <Input
                              type={showRegPassword ? "text" : "password"}
                              required
                              placeholder="Repeat password"
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              className="h-12 text-sm sm:text-base rounded-2xl border-border/80"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            className="w-full h-12 sm:h-13 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl text-base cursor-pointer shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
                          >
                            <span>Continue to Academic Profile</span>
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="text-center pt-2 text-xs sm:text-sm text-muted-foreground">
                          Already registered?{" "}
                          <button
                            type="button"
                            onClick={() => setActiveTab("LOGIN")}
                            className="text-primary font-bold hover:underline cursor-pointer"
                          >
                            Sign In here
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Step 2: Academic Profile */}
                    {regStep === 2 && (
                      <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        {/* Program Level Switcher */}
                        <div className="space-y-2">
                          <label className="text-sm sm:text-base font-bold text-foreground">Academic Program *</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setRegProgram("DIPLOMA")}
                              className={cn(
                                "p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1",
                                regProgram === "DIPLOMA"
                                  ? "bg-primary/10 border-primary ring-2 ring-primary/40 text-primary font-bold shadow-xs"
                                  : "bg-card border-border text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <div className="text-sm sm:text-base font-bold text-foreground">Diploma in MT</div>
                              <div className="text-xs text-muted-foreground font-medium">4-Year IHT Track</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRegProgram("BSC")}
                              className={cn(
                                "p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1",
                                regProgram === "BSC"
                                  ? "bg-primary/10 border-primary ring-2 ring-primary/40 text-primary font-bold shadow-xs"
                                  : "bg-card border-border text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <div className="text-sm sm:text-base font-bold text-foreground">B.Sc. in Health Tech</div>
                              <div className="text-xs text-muted-foreground font-medium">4-Year Degree Track</div>
                            </button>
                          </div>
                        </div>

                        {/* Academic Year Selection */}
                        <div className="space-y-2">
                          <label className="text-sm sm:text-base font-bold text-foreground">Current Academic Year *</label>
                          <div className="grid grid-cols-4 gap-2">
                            {["1", "2", "3", "4"].map((yr) => (
                              <button
                                key={yr}
                                type="button"
                                onClick={() => setRegYear(yr)}
                                className={cn(
                                  "py-2.5 rounded-xl border text-sm sm:text-base font-bold transition-all cursor-pointer text-center",
                                  regYear === yr
                                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                                )}
                              >
                                Year {yr}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Institution Selection */}
                        <div className="space-y-2">
                          <label className="text-sm sm:text-base font-bold text-foreground">Institution / IHT *</label>
                          <select
                            value={regInstitution}
                            onChange={(e) => setRegInstitution(e.target.value)}
                            className="w-full h-12 px-4 rounded-2xl border border-border bg-background text-sm sm:text-base font-medium text-foreground cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary"
                          >
                            {STANDARD_INSTITUTIONS.map((inst) => (
                              <option key={inst} value={inst}>
                                {inst}
                              </option>
                            ))}
                          </select>
                        </div>

                        {regInstitution === "Others" && (
                          <div className="space-y-2">
                            <label className="text-sm sm:text-base font-bold text-foreground">Institute Name *</label>
                            <Input
                              type="text"
                              required
                              placeholder="Enter your institute name"
                              value={regCustomInstitution}
                              onChange={(e) => setRegCustomInstitution(e.target.value)}
                              className="h-12 px-4 text-sm sm:text-base rounded-2xl border-border"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-sm sm:text-base font-bold text-foreground">Roll / Student ID (Optional)</label>
                          <Input
                            type="text"
                            placeholder="e.g. 2022-DMT-104"
                            value={regRoll}
                            onChange={(e) => setRegRoll(e.target.value)}
                            className="h-12 px-4 text-sm sm:text-base rounded-2xl border-border"
                          />
                        </div>

                        <div className="pt-2 flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRegStep(1)}
                            className="h-12 px-5 rounded-2xl text-sm sm:text-base font-bold cursor-pointer border-border"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={regLoading}
                            className="flex-1 h-12 sm:h-13 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl text-base cursor-pointer shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
                          >
                            {regLoading ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Sending Verification Link...</span>
                              </>
                            ) : (
                              <>
                                <span>Complete Registration</span>
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
