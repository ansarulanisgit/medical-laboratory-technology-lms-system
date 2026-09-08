"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  AtSign,
  School,
  Hash,
  Calendar,
  Layers,
  Phone,
  Mail,
  LogOut,
} from "lucide-react";
import { useAcademicProfile, ProgramLevel } from "@/lib/curriculum/academic-context";
import { useNotification } from "@/components/ui/notification-context";
import { handleSignOut } from "@/lib/auth/logout";

const PREDEFINED_INSTITUTIONS = [
  "Dhaka Institute of Health Technology (DIHT)",
  "Chittagong Medical College (IHT Wing)",
  "Institute of Health Technology (IHT), Rajshahi",
  "Institute of Health Technology, Sylhet",
  "Institute of Health Technology, Rangpur",
  "Faculty of Allied Health Sciences, University of Dhaka",
  "DGHS Medical Technology Directorate, Mohakhali, Dhaka",
];

export default function StudentProfilePage() {
  const { profile, updateAcademicStatus, updatePersonalInfo } = useAcademicProfile();
  const notify = useNotification();

  // Form Fields per User Request:
  // Full name, Username, Email (it's can't change), phone, Institution (add an option> others, if chose give a input box. Course (Diploma/Bsc), Year, roll. remove session.
  const [fullName, setFullName] = React.useState(profile?.fullName || "Md. Ansarul Islam");
  const [username, setUsername] = React.useState(profile?.username || "ansarul.islam");
  const [password, setPassword] = React.useState(profile?.password || "Student@Pass2024");
  const [showPassword, setShowPassword] = React.useState(false);
  const email = profile?.email || "ansarul.support@gmail.com"; // Cannot change
  const [phone, setPhone] = React.useState(profile?.phone || "+8801709260934");

  // Institution State
  const initialIsPredefined = PREDEFINED_INSTITUTIONS.includes(profile?.institution || "");
  const [institutionSelect, setInstitutionSelect] = React.useState(
    initialIsPredefined ? (profile?.institution || PREDEFINED_INSTITUTIONS[0]) : "Others"
  );
  const [customInstitution, setCustomInstitution] = React.useState(
    initialIsPredefined ? "" : (profile?.institution || "")
  );

  // Course, Year, Roll
  const [program, setProgram] = React.useState<ProgramLevel>(profile?.program || "DIPLOMA");
  const [academicYear, setAcademicYear] = React.useState(profile?.academicYear || "1");
  const [studentIdNumber, setStudentIdNumber] = React.useState(profile?.studentIdNumber || "LT-2024-0482");

  const [isSaving, setIsSaving] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Sync state if context profile updates
  React.useEffect(() => {
    if (profile?.fullName) setFullName(profile.fullName);
    if (profile?.username) setUsername(profile.username);
    if (profile?.password) setPassword(profile.password);
    if (profile?.phone) setPhone(profile.phone);

    const isPredefined = PREDEFINED_INSTITUTIONS.includes(profile?.institution || "");
    if (isPredefined) {
      setInstitutionSelect(profile?.institution || PREDEFINED_INSTITUTIONS[0]);
      setCustomInstitution("");
    } else if (profile?.institution) {
      setInstitutionSelect("Others");
      setCustomInstitution(profile.institution);
    }

    if (profile?.program) setProgram(profile.program);
    if (profile?.academicYear) setAcademicYear(profile.academicYear);
    if (profile?.studentIdNumber) setStudentIdNumber(profile.studentIdNumber);
  }, [
    profile?.fullName,
    profile?.username,
    profile?.password,
    profile?.phone,
    profile?.institution,
    profile?.program,
    profile?.academicYear,
    profile?.studentIdNumber,
  ]);

  const handleProgramChange = (newProg: ProgramLevel) => {
    setProgram(newProg);
  };

  const handleYearChange = (newYear: string) => {
    setAcademicYear(newYear);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      notify.error("Full Name Required", "Please enter your full name.");
      setErrorMsg("Full name is required.");
      return;
    }

    if (!username.trim()) {
      notify.error("Username Required", "Please enter your unique username.");
      setErrorMsg("Username is required.");
      return;
    }

    const finalInstitution =
      institutionSelect === "Others"
        ? (customInstitution.trim() || "Independent Medical Institute")
        : institutionSelect;

    setIsSaving(true);
    try {
      // 1. Update personal details
      const personalResult = await updatePersonalInfo({
        fullName,
        username,
        password,
        phone,
        institution: finalInstitution,
        program,
        academicYear,
        studentIdNumber,
      });

      // 2. If program/year changed, record academic transition
      if (
        program !== profile?.program ||
        academicYear !== profile?.academicYear
      ) {
        updateAcademicStatus(
          program,
          academicYear,
          "Student updated academic status via profile settings"
        );
      }

      if (personalResult.success) {
        const progLabel =
          program === "BSC"
            ? `B.Sc. in Health Technology (Laboratory) - Year ${academicYear}`
            : `Diploma in Medical Laboratory Technology - Year ${academicYear}`;

        notify.success(
          "Profile Updated Successfully",
          `Your personal information and academic stage (${progLabel}) have been saved.`,
          true
        );
        setSuccessMsg(
          `Profile successfully updated! Your curriculum, Study Center courses, and dashboard now reflect ${progLabel}.`
        );
      } else {
        notify.error("Update Failed", personalResult.error || "Could not save profile.");
        setErrorMsg(personalResult.error || "Failed to save profile changes.");
      }
    } catch {
      notify.error("Update Error", "An error occurred while saving profile.");
      setErrorMsg("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            My Profile & Academic Status
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-normal">
            Manage your account credentials, institutional affiliation, theme appearance, and academic stage.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSignOut()}
          className="text-xs text-destructive hover:bg-destructive/10 hover:border-destructive/40 border-border/80 rounded-xl h-9 px-3.5 self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <Link href="/student">
            <Button size="sm" variant="outline" className="text-xs border-emerald-500/40 shrink-0 font-medium rounded-xl">
              View Updated Dashboard
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs sm:text-sm flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Personal & Academic Information Card (Responsive 3-4 Columns) */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center space-x-2 font-semibold">
            <User className="h-4 w-4 text-primary" />
            <span>Personal & Academic Information</span>
          </CardTitle>
          <CardDescription className="text-xs font-normal">
            Update your personal credentials, contact numbers, institution, and academic status.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Col 1: Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>Full Name *</span>
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="rounded-xl min-h-[42px] text-xs font-normal"
                />
              </div>

              {/* Col 2: Username */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <AtSign className="h-3.5 w-3.5 text-primary" />
                  <span>Username *</span>
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ansarul.islam"
                  required
                  className="rounded-xl min-h-[42px] text-xs font-mono font-normal"
                />
              </div>

              {/* Col 3: Password */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  <span>Password *</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter login password"
                    required
                    className="rounded-xl min-h-[42px] text-xs font-mono pr-10 font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Col 4: Email Address (Cannot change) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>Email Address</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                    Locked
                  </span>
                </div>
                <Input
                  type="email"
                  value={email}
                  disabled
                  readOnly
                  className="rounded-xl min-h-[42px] text-xs font-normal bg-muted/60 opacity-80 cursor-not-allowed text-muted-foreground"
                />
              </div>

              {/* Col 5: Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>Phone Number</span>
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +8801709260934"
                  className="rounded-xl min-h-[42px] text-xs font-normal"
                />
              </div>

              {/* Col 6-7: Institution / Medical College (2 Columns) */}
              <div className="space-y-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <School className="h-3.5 w-3.5 text-primary" />
                  <span>Institution / Medical College *</span>
                </label>
                <select
                  value={institutionSelect}
                  onChange={(e) => setInstitutionSelect(e.target.value)}
                  className="flex min-h-[42px] w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {PREDEFINED_INSTITUTIONS.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                  <option value="Others">Others</option>
                </select>

                {institutionSelect === "Others" && (
                  <div className="pt-1.5 animate-in fade-in space-y-1">
                    <Input
                      type="text"
                      placeholder="Enter your Institution / Medical College name"
                      value={customInstitution}
                      onChange={(e) => setCustomInstitution(e.target.value)}
                      required
                      className="rounded-xl min-h-[42px] text-xs font-normal"
                    />
                    <span className="text-[10.5px] text-muted-foreground block">
                      Type your specific institute or medical college name.
                    </span>
                  </div>
                )}
              </div>

              {/* Col 8: Student Roll / ID Number */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-primary" />
                  <span>Student Roll / ID</span>
                </label>
                <Input
                  type="text"
                  value={studentIdNumber}
                  onChange={(e) => setStudentIdNumber(e.target.value)}
                  placeholder="e.g. Roll 12, LT-2024"
                  className="rounded-xl min-h-[42px] text-xs font-normal font-mono"
                />
              </div>

              {/* Col 9: Course Track */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  <span>Course Track *</span>
                </label>
                <select
                  value={program}
                  onChange={(e) => handleProgramChange(e.target.value as ProgramLevel)}
                  className="flex min-h-[42px] w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="DIPLOMA">Diploma in Medical Laboratory Technology</option>
                  <option value="BSC">B.Sc. in Health Technology (Laboratory)</option>
                </select>
              </div>

              {/* Col 10: Academic Year */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Academic Year *</span>
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="flex min-h-[42px] w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              {/* Col 11-12: Syllabus Structure (2 Columns) */}
              <div className="space-y-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Syllabus Structure</span>
                </label>
                <div className="flex items-center min-h-[42px] px-3 rounded-xl border border-input bg-muted/40 text-xs text-muted-foreground font-normal">
                  Standard 4-Year Direct Curriculum (1st – 4th Year)
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 bg-primary text-primary-foreground min-h-[42px] rounded-xl font-semibold text-xs shadow-xs hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving Information..." : "Save Personal & Academic Information"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

