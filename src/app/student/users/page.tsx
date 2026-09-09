"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Building,
  GraduationCap,
  Mail,
  Phone,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Sparkles,
  Sliders,
  Lock,
  Unlock,
  KeyRound,
  Award,
  BarChart3,
  Clock,
  XCircle,
  FileText,
  Check,
  Printer,
  Eye,
  BookOpen,
  FlaskConical,
  Calendar,
  Activity,
  UserCheck,
  Download,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  History,
  CheckCircle,
  ExternalLink,
  Percent,
  FileCheck2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserManagement, LMSUser } from "@/lib/curriculum/user-management-context";
import { useAcademic, ProgramLevel, CURRICULUM_SUBJECTS_CATALOG } from "@/lib/curriculum/academic-context";
import { useNotification } from "@/components/ui/notification-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { useCertificates, CertificateRecord } from "@/lib/stores/certificate-store";
import { useLMSAnnouncements } from "@/lib/notifications/lms-announcement-context";
import { getStudentStudyRecord, checkEnrollmentEligibility } from "@/lib/curriculum/student-study-progress-store";
import { UserRole, UserPermissions, DEFAULT_ROLE_PERMISSIONS, ROLE_LABELS } from "@/types/roles";
import { QRCodeView } from "@/components/ui/qr-code-view";

const INSTITUTIONS_LIST = [
  "Dhaka Institute of Health Technology (DIHT)",
  "Chittagong Medical College (IHT Wing)",
  "Institute of Health Technology (IHT), Rajshahi",
  "Institute of Health Technology, Sylhet",
  "Institute of Health Technology, Rangpur",
  "Faculty of Allied Health Sciences, University of Dhaka",
  "DGHS Medical Technology Directorate, Mohakhali, Dhaka",
];

const PERMISSION_KEYS: { key: keyof UserPermissions; label: string; desc: string }[] = [
  { key: "canEditCurriculum", label: "Curriculum Editor", desc: "Add, modify, and delete subjects across Diploma & B.Sc." },
  { key: "canEditCourses", label: "Study Center Builder", desc: "Create courses, units, modules, lecture notes, and quizzes." },
  { key: "canManageQuestionBank", label: "Question Bank Author", desc: "Upload and publish past board question papers and solutions." },
  { key: "canManagePracticals", label: "Lab SOP Author", desc: "Author clinical laboratory bench SOPs and safety protocols." },
  { key: "canApproveCertificates", label: "Certificate Authority", desc: "Review, approve, and confer official competency credentials." },
  { key: "canManageJobs", label: "Career Board Manager", desc: "Post and manage diagnostic hospital career openings." },
  { key: "canPostUpdates", label: "Notice Publisher", desc: "Broadcast official academic bulletins and emergency notices." },
  { key: "canAccessSuperAdminTools", label: "Super Admin Tools Access", desc: "Privilege to access system audit logs, strings, and modules." },
];

export default function UserManagementPage() {
  const { users, addUser, updateUser, deleteUser, updateUserPermissions } = useUserManagement();
  const { role: currentRole, userProfile } = useAcademic();
  const { showNotification } = useNotification();
  const { logActivity, logs } = useActivityLog();
  const { certificates, reviewCertificate, templateConfig, applyForCertificate } = useCertificates();
  const { createAnnouncement } = useLMSAnnouncements();

  const isSuperAdmin = currentRole === "SUPER_ADMIN";
  const isAdmin = currentRole === "ADMIN";

  // Student Dossier & Certificate Approval Modal
  const [selectedStudentForDossier, setSelectedStudentForDossier] = React.useState<LMSUser | null>(null);
  const [dossierTab, setDossierTab] = React.useState<"ANALYTICS" | "ACTIVITIES" | "CERTIFICATES">("CERTIFICATES");
  const [rejectingCertId, setRejectingCertId] = React.useState<string | null>(null);
  const [declineReason, setDeclineReason] = React.useState("");
  const [previewCert, setPreviewCert] = React.useState<CertificateRecord | null>(null);
  const [activitySearchQuery, setActivitySearchQuery] = React.useState("");

  // Search and filters
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [programFilter, setProgramFilter] = React.useState<string>("ALL");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = React.useState(false);
  const [userToEdit, setUserToEdit] = React.useState<LMSUser | null>(null);
  const [userToDelete, setUserToDelete] = React.useState<LMSUser | null>(null);
  const [userToManagePerms, setUserToManagePerms] = React.useState<LMSUser | null>(null);
  const [editingPerms, setEditingPerms] = React.useState<UserPermissions>(DEFAULT_ROLE_PERMISSIONS.STUDENT);

  // Form inputs for Add / Edit
  const [formFullName, setFormFullName] = React.useState("");
  const [formUsername, setFormUsername] = React.useState("");
  const [formPassword, setFormPassword] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formRole, setFormRole] = React.useState<UserRole>("STUDENT");
  const [formInstitution, setFormInstitution] = React.useState(INSTITUTIONS_LIST[0]);
  const [formProgram, setFormProgram] = React.useState<ProgramLevel>("DIPLOMA");
  const [formYear, setFormYear] = React.useState("1");
  const [formIdNumber, setFormIdNumber] = React.useState("");
  const [formStatus, setFormStatus] = React.useState<"ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED">("ACTIVE");

  // Close open modals on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewCert(null);
        setSelectedStudentForDossier(null);
        setIsPermModalOpen(false);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setUserToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const resetForm = () => {
    setFormFullName("");
    setFormUsername("");
    setFormPassword("");
    setFormEmail("");
    setFormPhone("");
    setFormRole("STUDENT");
    setFormInstitution(INSTITUTIONS_LIST[0]);
    setFormProgram("DIPLOMA");
    setFormYear("1");
    setFormIdNumber("");
    setFormStatus("ACTIVE");
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: LMSUser) => {
    setUserToEdit(user);
    setFormFullName(user.fullName);
    setFormUsername(user.username || "");
    setFormPassword(user.password || "");
    setFormEmail(user.email);
    setFormPhone(user.phone || "");
    setFormRole(user.role);
    setFormInstitution(user.institution || INSTITUTIONS_LIST[0]);
    setFormProgram(user.program);
    setFormYear(user.academicYear || "1");
    setFormIdNumber(user.studentIdNumber || "");
    setFormStatus(user.status);
    setIsEditModalOpen(true);
  };

  const openPermModal = (user: LMSUser) => {
    setUserToManagePerms(user);
    setEditingPerms(user.permissions || DEFAULT_ROLE_PERMISSIONS[user.role]);
    setIsPermModalOpen(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addUser({
      fullName: formFullName,
      username: formUsername,
      password: formPassword,
      email: formEmail,
      phone: formPhone,
      role: formRole,
      institution: formInstitution,
      program: formProgram,
      academicYear: formYear,
      studentIdNumber: formIdNumber || `LT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: formStatus,
    });

    if (res.success) {
      logActivity({
        action: "CREATE",
        module: "User Management",
        details: `Created user "${formFullName}" with role ${formRole}`,
      });
      setIsAddModalOpen(false);
      resetForm();
      showNotification({
        type: "success",
        title: "User Created",
        message: `${formFullName} (${formRole}) has been successfully provisioned.`,
        autoRefresh: true,
      });
    } else {
      showNotification({
        type: "error",
        title: "Validation Error",
        message: res.error || "Failed to create user.",
      });
    }
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;

    const res = updateUser(userToEdit.id, {
      fullName: formFullName,
      username: formUsername,
      password: formPassword,
      email: formEmail,
      phone: formPhone,
      role: formRole,
      institution: formInstitution,
      program: formProgram,
      academicYear: formYear,
      studentIdNumber: formIdNumber,
      status: formStatus,
    });

    if (res.success) {
      logActivity({
        action: "UPDATE",
        module: "User Management",
        details: `Updated user profile for "${formFullName}" (${formRole})`,
      });
      setIsEditModalOpen(false);
      setUserToEdit(null);
      showNotification({
        type: "success",
        title: "User Updated",
        message: `Profile changes for ${formFullName} saved successfully.`,
        autoRefresh: true,
      });
    } else {
      showNotification({
        type: "error",
        title: "Update Failed",
        message: res.error || "Could not update user.",
      });
    }
  };

  const handleSavePermissions = () => {
    if (!userToManagePerms) return;
    updateUserPermissions(userToManagePerms.id, editingPerms);
    logActivity({
      action: "SETTINGS",
      module: "User Management",
      details: `Adjusted granular permissions for "${userToManagePerms.fullName}"`,
    });
    setIsPermModalOpen(false);
    setUserToManagePerms(null);
    showNotification({
      type: "success",
      title: "Permissions Updated",
      message: `Granular permissions for ${userToManagePerms.fullName} have been saved.`,
    });
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    const isProtected =
      userToDelete.isProtected ||
      userToDelete.username?.toLowerCase() === "ansarulanis" ||
      userToDelete.email?.toLowerCase() === "ansarul.contact@gmail.com" ||
      userToDelete.id === "usr-superadmin" ||
      userToDelete.username?.toLowerCase() === "ansarul.admin" ||
      userToDelete.email?.toLowerCase() === "ansarul.admin@gmail.com" ||
      userToDelete.id === "usr-superadmin-islam";

    if (isProtected) {
      showNotification({
        type: "error",
        title: "Action Prohibited",
        message: `Super Administrator (${userToDelete.fullName}) is permanently protected and cannot be deleted.`,
      });
      setUserToDelete(null);
      return;
    }

    const name = userToDelete.fullName;
    const res = deleteUser(userToDelete.id);
    if (res.success) {
      logActivity({
        action: "DELETE",
        module: "User Management",
        details: `Deleted user account "${name}"`,
      });
      setUserToDelete(null);
      showNotification({
        type: "success",
        title: "User Removed",
        message: `User ${name} has been removed from the platform.`,
        autoRefresh: true,
      });
    } else {
      showNotification({
        type: "error",
        title: "Deletion Failed",
        message: res.error || "Could not delete user.",
      });
      setUserToDelete(null);
    }
  };

  // Filter users
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.studentIdNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
      const matchesProgram = programFilter === "ALL" || u.program === programFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesProgram;
    });
  }, [users, searchTerm, roleFilter, statusFilter, programFilter]);

  const getStudentCertificates = React.useCallback(
    (targetUser: LMSUser) => {
      return certificates.filter(
        (c) =>
          c.studentId === targetUser.id ||
          c.studentName.toLowerCase().trim() === targetUser.fullName.toLowerCase().trim() ||
          (targetUser.studentIdNumber &&
            c.verificationCode?.toLowerCase().includes(targetUser.studentIdNumber.toLowerCase())) ||
          (targetUser.username && c.studentId === targetUser.username)
      );
    },
    [certificates]
  );

  const getPendingCertCount = React.useCallback(
    (targetUser: LMSUser) => {
      return getStudentCertificates(targetUser).filter((c) => c.status === "PENDING").length;
    },
    [getStudentCertificates]
  );

  const totalPendingCerts = React.useMemo(() => {
    return certificates.filter((c) => c.status === "PENDING").length;
  }, [certificates]);

  const openDossier = (
    user: LMSUser,
    defaultTab: "ANALYTICS" | "ACTIVITIES" | "CERTIFICATES" = "ANALYTICS"
  ) => {
    setSelectedStudentForDossier(user);
    setDossierTab(defaultTab);
    setRejectingCertId(null);
    setDeclineReason("");
    setPreviewCert(null);
    setActivitySearchQuery("");
  };

  const handleApproveCertificate = (cert: CertificateRecord, student: LMSUser) => {
    const reviewerName =
      userProfile?.name || (isSuperAdmin ? "Super Administrator (Ansarul Anis)" : "Academic Council Admin");
    const reviewerRole = currentRole || "SUPER_ADMIN";

    reviewCertificate(
      cert.id,
      "APPROVED",
      reviewerName,
      reviewerRole,
      "Approved following comprehensive academic dossier & bench practical competency review."
    );

    createAnnouncement({
      title: "🎉 Certificate Application Approved & Issued!",
      message: `Congratulations ${student.fullName}! Your requested credential "${cert.title}" has been reviewed and approved by ${reviewerName} (${ROLE_LABELS[reviewerRole] || reviewerRole}). You can now view and download your official credential from the Certificates registry.`,
      type: "ACADEMIC",
      priority: "HIGH",
      targetAudience: "ALL",
      targetUserId: student.id,
      targetStudentName: student.fullName,
      authorRole: isSuperAdmin ? "SUPER_ADMIN" : "ADMIN",
      authorName: reviewerName,
    });

    logActivity({
      action: "UPDATE",
      module: "Certificates",
      details: `Approved & issued certificate "${cert.title}" (${cert.code.replace("REQ", "CERT")}) for ${student.fullName}`,
      performedBy: reviewerName,
      role: currentRole,
    });

    showNotification({
      type: "success",
      title: "Certificate Approved & Issued",
      message: `Credential approved for ${student.fullName}. Real-time notification dispatched to student.`,
      autoRefresh: true,
    });
  };

  const handleDeclineCertificate = (cert: CertificateRecord, student: LMSUser, reason: string) => {
    if (!reason.trim()) {
      showNotification({
        type: "error",
        title: "Feedback Reason Required",
        message: "Please enter a specific reason or feedback for declining the certificate request.",
      });
      return;
    }

    const reviewerName =
      userProfile?.name || (isSuperAdmin ? "Super Administrator (Ansarul Anis)" : "Academic Council Admin");
    const reviewerRole = currentRole || "SUPER_ADMIN";

    reviewCertificate(cert.id, "REJECTED", reviewerName, reviewerRole, reason.trim());

    createAnnouncement({
      title: "⚠️ Certificate Application Update - Requirements Needed",
      message: `Your certificate request for "${cert.title}" was reviewed by ${reviewerName} (${ROLE_LABELS[reviewerRole] || reviewerRole}) and declined. Feedback / Remarks: "${reason.trim()}". Please fulfill the requirements and re-apply.`,
      type: "ADVISORY",
      priority: "URGENT",
      targetAudience: "ALL",
      targetUserId: student.id,
      targetStudentName: student.fullName,
      authorRole: isSuperAdmin ? "SUPER_ADMIN" : "ADMIN",
      authorName: reviewerName,
    });

    logActivity({
      action: "UPDATE",
      module: "Certificates",
      details: `Declined certificate request for ${student.fullName}. Reason: ${reason.trim()}`,
      performedBy: reviewerName,
      role: currentRole,
    });

    setRejectingCertId(null);
    setDeclineReason("");

    showNotification({
      type: "warning",
      title: "Certificate Request Declined",
      message: `Certificate declined. Formal notification and feedback sent to ${student.fullName}.`,
      autoRefresh: true,
    });
  };

  const counts = React.useMemo(() => {
    return {
      total: users.length,
      superAdmin: users.filter((u) => u.role === "SUPER_ADMIN").length,
      admin: users.filter((u) => u.role === "ADMIN").length,
      mentor: users.filter((u) => u.role === "MENTOR").length,
      student: users.filter((u) => u.role === "STUDENT").length,
      pendingCerts: totalPendingCerts,
    };
  }, [users, totalPendingCerts]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isSuperAdmin ? "User & Role Management" : "Academic User Directory"}
            </h1>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              4 Roles Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage students, faculty mentors, administrators, and granular role authorizations.
          </p>
        </div>

        {isSuperAdmin && (
          <Button onClick={openAddModal} className="gap-2 shadow-sm bg-primary text-primary-foreground">
            <UserPlus className="h-4 w-4" />
            <span>Provision New User</span>
          </Button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 border-border bg-card">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Enrolled</div>
          <div className="text-2xl sm:text-3xl font-black mt-1 text-foreground">{counts.total}</div>
        </Card>
        <Card className="p-4 border-purple-500/20 bg-purple-500/5">
          <div className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Super Admins</div>
          <div className="text-2xl sm:text-3xl font-black mt-1 text-purple-700 dark:text-purple-400">{counts.superAdmin}</div>
        </Card>
        <Card className="p-4 border-blue-500/20 bg-blue-500/5">
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Admins</div>
          <div className="text-2xl sm:text-3xl font-black mt-1 text-blue-700 dark:text-blue-400">{counts.admin}</div>
        </Card>
        <Card className="p-4 border-amber-500/20 bg-amber-500/5">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Faculty Mentors</div>
          <div className="text-2xl sm:text-3xl font-black mt-1 text-amber-700 dark:text-amber-400">{counts.mentor}</div>
        </Card>
        <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Students</div>
          <div className="text-2xl sm:text-3xl font-black mt-1 text-emerald-700 dark:text-emerald-400">{counts.student}</div>
        </Card>
        <Card
          onClick={() => {
            const studentWithPending = users.find((u) => getPendingCertCount(u) > 0);
            if (studentWithPending) {
              openDossier(studentWithPending, "CERTIFICATES");
            }
          }}
          className={`p-4 border transition-all cursor-pointer ${
            counts.pendingCerts > 0
              ? "border-amber-500/50 bg-amber-500/10 hover:border-amber-500"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Cert Requests
            </div>
            {counts.pendingCerts > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-1 text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <span>{counts.pendingCerts}</span>
            {counts.pendingCerts > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white animate-pulse">
                Pending
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-border">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search user by name, username, ID, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="MENTOR">Mentor</option>
              <option value="STUDENT">Student</option>
            </select>

            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground cursor-pointer"
            >
              <option value="ALL">All Programs</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="BSC">B.Sc.</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* User Table Card */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase font-semibold">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User Identity</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Program & Year</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Analytics & Activity</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-muted-foreground text-sm">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isProtected =
                    user.isProtected ||
                    user.username?.toLowerCase() === "ansarulanis" ||
                    user.email?.toLowerCase() === "ansarul.contact@gmail.com" ||
                    user.id === "usr-superadmin";

                  const roleBadgeClass =
                    user.role === "SUPER_ADMIN"
                      ? "bg-purple-600 text-white"
                      : user.role === "ADMIN"
                      ? "bg-blue-600 text-white"
                      : user.role === "MENTOR"
                      ? "bg-amber-600 text-white"
                      : "bg-emerald-600 text-white";

                  const isStudent = user.role === "STUDENT";
                  const studentCerts = getStudentCertificates(user);
                  const pendingCount = studentCerts.filter((c) => c.status === "PENDING").length;

                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm sm:text-base text-foreground leading-snug">{user.fullName}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <span>@{user.username || user.email.split("@")[0]}</span>
                          <span>•</span>
                          <span className="font-mono">{user.studentIdNumber}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <Badge className={`text-xs font-semibold px-3 py-1 ${roleBadgeClass}`}>
                          {ROLE_LABELS[user.role] || user.role}
                        </Badge>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-sm sm:text-base text-foreground">{user.program}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                          Year {user.academicYear}
                        </div>
                        <div className="text-xs text-muted-foreground/85 mt-1 line-clamp-1 max-w-[260px]" title={user.institution}>
                          {user.institution}
                        </div>
                      </td>

                      {/* Analytics & Activity Column */}
                      <td className="p-4">
                        {isStudent ? (() => {
                          const studentElig = checkEnrollmentEligibility(user.id, user.program, user.academicYear);
                          return (
                            <div className="space-y-2 min-w-[230px]">
                              <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                                  <span>{studentElig.cumulativeScore}% Avg Score</span>
                                </span>
                                <span className="text-xs text-muted-foreground font-semibold">{studentElig.completionPct}% Covered</span>
                              </div>

                              {/* Mini Activity Progress Bar */}
                              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    studentElig.completionPct === 100 ? "bg-emerald-600" : "bg-primary"
                                  }`}
                                  style={{ width: `${studentElig.completionPct}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="inline-flex items-center gap-1.5 text-muted-foreground truncate">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                  <span>{studentElig.completedTasksCount}/{studentElig.totalTasksCount} Tasks Done</span>
                                </span>

                                {pendingCount > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => openDossier(user, "CERTIFICATES")}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-all animate-pulse shrink-0 cursor-pointer text-xs"
                                    title="Review pending certificate request"
                                  >
                                    <Clock className="h-3 w-3" />
                                    <span>{pendingCount} Cert Pending</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openDossier(user, "ANALYTICS")}
                                    className="text-primary hover:underline font-semibold text-xs shrink-0 cursor-pointer"
                                  >
                                    Live Log & Chart →
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })() : (
                          <div className="space-y-1.5 min-w-[220px]">
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground">
                              <Activity className="h-4 w-4 text-primary shrink-0" />
                              <span>
                                {user.role === "MENTOR"
                                  ? "18 Lab SOPs • 42 Reviews"
                                  : user.role === "SUPER_ADMIN"
                                  ? "System Controller • Full Audit"
                                  : "Academic Administration"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                                <span>Active now</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => openDossier(user, "ACTIVITIES")}
                                className="text-primary hover:underline text-xs font-semibold cursor-pointer"
                              >
                                View Logs →
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Analytics / Dossier Icon Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openDossier(user, pendingCount > 0 ? "CERTIFICATES" : "ANALYTICS")
                            }
                            title={
                              isStudent
                                ? `Student Analytics, Live Activity & Certificates (${pendingCount} pending)`
                                : "User Analytics & Live Activity Trail"
                            }
                            className={`h-8.5 w-8.5 sm:h-9 sm:w-9 p-0 rounded-xl relative border-border/80 hover:border-primary/50 text-foreground hover:text-primary ${
                              pendingCount > 0
                                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 animate-pulse"
                                : ""
                            }`}
                          >
                            <BarChart3 className="h-4 w-4 text-primary" />
                            {pendingCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                                {pendingCount}
                              </span>
                            )}
                          </Button>

                          {isSuperAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPermModal(user)}
                              title="Manage Granular Permissions"
                              className="h-8.5 w-8.5 sm:h-9 sm:w-9 p-0 rounded-xl border-border/80 hover:border-primary/50 text-foreground hover:text-primary"
                            >
                              <KeyRound className="h-4 w-4 text-primary" />
                            </Button>
                          )}

                          {isSuperAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(user)}
                              className="h-8.5 w-8.5 sm:h-9 sm:w-9 p-0 rounded-xl"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}

                          {isSuperAdmin && !isProtected && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUserToDelete(user)}
                              className="h-8.5 w-8.5 sm:h-9 sm:w-9 p-0 rounded-xl text-destructive hover:bg-destructive/10"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}

                          {isSuperAdmin && isProtected && (
                            <span
                              title="Default Super Admin (Ansarul Anis) is protected and cannot be deleted"
                              className="h-8.5 w-8.5 sm:h-9 sm:w-9 inline-flex items-center justify-center text-muted-foreground/40 cursor-not-allowed"
                            >
                              <Lock className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Granular Permissions (SUPER ADMIN ONLY) */}
      {isPermModalOpen && userToManagePerms && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <span>Granular Permissions: {userToManagePerms.fullName}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Role: <strong className="text-foreground">{userToManagePerms.role}</strong> ({userToManagePerms.program})
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsPermModalOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-muted-foreground leading-relaxed">
                Configure module authoring, review, and editing privileges for this specific account.
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {PERMISSION_KEYS.map((p) => {
                  const isChecked = !!editingPerms[p.key];
                  return (
                    <label
                      key={p.key}
                      onClick={() =>
                        setEditingPerms((prev) => ({
                          ...prev,
                          [p.key]: !prev[p.key],
                        }))
                      }
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                        isChecked
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-accent/60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded mt-0.5"
                      />
                      <div>
                        <div className="font-bold text-foreground">{p.label}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{p.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button variant="outline" onClick={() => setIsPermModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePermissions} className="bg-primary text-primary-foreground">
                  Save Permissions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Provision / Edit User */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base">
                {isEditModalOpen ? "Modify User Account & Role" : "Provision New User Account"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form
              onSubmit={isEditModalOpen ? handleUpdateUser : handleCreateUser}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Full Legal Name *</label>
                  <Input
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="e.g. Dr. Sabrina Parvin"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Username *</label>
                  <Input
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="sabrina.mentor"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Email Address *</label>
                  <Input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="sabrina@diht.edu.bd"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Contact Phone *</label>
                  <Input
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Assigned Role *</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs font-semibold"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MENTOR">Mentor</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Program Level *</label>
                  <select
                    value={formProgram}
                    onChange={(e) => setFormProgram(e.target.value as ProgramLevel)}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                  >
                    <option value="DIPLOMA">Diploma in MLT</option>
                    <option value="BSC">B.Sc. in MLT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Academic Year *</label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Affiliated Institution *</label>
                <select
                  value={formInstitution}
                  onChange={(e) => setFormInstitution(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                >
                  {INSTITUTIONS_LIST.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Registration / ID Number</label>
                  <Input
                    value={formIdNumber}
                    onChange={(e) => setFormIdNumber(e.target.value)}
                    placeholder="e.g. DIHT-2025-0482"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Account Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING_VERIFICATION">Pending Verification</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  {isEditModalOpen ? "Save Changes" : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            {userToDelete.isProtected || userToDelete.username?.toLowerCase() === "ansarulanis" || userToDelete.id === "usr-superadmin" ? (
              <>
                <h3 className="font-bold text-base text-destructive flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Deletion Prohibited</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{userToDelete.fullName}</strong> is the Default Super Administrator and is permanently protected from deletion.
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setUserToDelete(null)}>
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-base text-destructive flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  <span>Confirm User Deletion</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to permanently remove <strong className="text-foreground">{userToDelete.fullName}</strong> ({userToDelete.email})? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setUserToDelete(null)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteUser}>
                    Delete User
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Student Academic Dossier, Live Activities & Certificate Authority */}
      {selectedStudentForDossier && (() => {
        const student = selectedStudentForDossier;
        const studentCerts = getStudentCertificates(student);
        const pendingCerts = studentCerts.filter((c) => c.status === "PENDING");
        const approvedCerts = studentCerts.filter((c) => c.status === "APPROVED");
        const rejectedCerts = studentCerts.filter((c) => c.status === "REJECTED");

        // Filter catalog subjects by student program & year
        const programSubjects = CURRICULUM_SUBJECTS_CATALOG.filter(
          (s) => s.program === student.program && (!student.academicYear || s.year === student.academicYear)
        );
        // Real-time Dynamic Study Center records and eligibility for this student
        const studyRecord = getStudentStudyRecord(student.id, student.program, student.academicYear);
        const eligibility = checkEnrollmentEligibility(student.id, student.program, student.academicYear);
        const displayBenchSops = studyRecord.benchSops;
        const studentActivityEvents = studyRecord.activities.filter(
          (e) =>
            !activitySearchQuery.trim() ||
            e.title.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
            e.desc.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
            e.type.toLowerCase().includes(activitySearchQuery.toLowerCase())
        );

        return (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedStudentForDossier(null);
            }}
          >
            <div className="bg-card border border-border rounded-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base uppercase shrink-0">
                    {student.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base sm:text-xl text-foreground">
                        {student.fullName}
                      </h3>
                      <Badge
                        className={`text-xs font-semibold px-2.5 py-0.5 ${
                          student.role === "SUPER_ADMIN"
                            ? "bg-purple-600 text-white"
                            : student.role === "ADMIN"
                            ? "bg-blue-600 text-white"
                            : student.role === "MENTOR"
                            ? "bg-amber-600 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {ROLE_LABELS[student.role] || student.role}
                      </Badge>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono font-medium">
                        {student.studentIdNumber}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>
                        {student.program} • Year {student.academicYear}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[280px]" title={student.institution}>
                        {student.institution}
                      </span>
                      <span>•</span>
                      <span className="text-primary font-medium">
                        @{student.username || student.email.split("@")[0]}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {pendingCerts.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                      <Clock className="h-4 w-4" />
                      <span>{pendingCerts.length} Cert Request Pending</span>
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStudentForDossier(null)}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-border/70 pb-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setDossierTab("ANALYTICS")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                    dossierTab === "ANALYTICS"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Academic Analytics & SOPs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDossierTab("ACTIVITIES")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                    dossierTab === "ACTIVITIES"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  <span>Live Activity Trail & Telemetry</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDossierTab("CERTIFICATES")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer relative ${
                    dossierTab === "CERTIFICATES"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>Certificate Requests</span>
                  {pendingCerts.length > 0 && (
                    <span className="h-4.5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                      {pendingCerts.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Body */}
              <div className="overflow-y-auto pr-1 space-y-4 max-h-[calc(92vh-190px)]">
                {/* TAB 1: ACADEMIC ANALYTICS */}
                {dossierTab === "ANALYTICS" && (
                  <div className="space-y-4">
                    {/* Top KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Card className="p-4 bg-card border-border/80">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                          <span>Average Score</span>
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">{eligibility.cumulativeScore}%</div>
                        <div className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          {eligibility.recommendedGrade}
                        </div>
                      </Card>

                      <Card className="p-4 bg-card border-border/80">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                          <span>Curriculum Covered</span>
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">{eligibility.completionPct}%</div>
                        <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                          {eligibility.completedTasksCount} / {eligibility.totalTasksCount} Tasks Done
                        </div>
                      </Card>

                      <Card className="p-4 bg-card border-border/80">
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

                      <Card className="p-4 bg-card border-border/80">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                          <span>Clinical Status</span>
                          <Calendar className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                          {eligibility.isEligible ? "Complete" : "In Progress"}
                        </div>
                        <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                          {eligibility.completedSubjectsCount} / {eligibility.totalSubjectsCount} Subjects Clear
                        </div>
                      </Card>
                    </div>

                    {/* Curriculum Subject Breakdown */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>Curriculum Subject Competency Performance</span>
                        </h4>
                        <span className="text-xs text-muted-foreground font-medium">
                          Program: {student.program} (Year {student.academicYear})
                        </span>
                      </div>

                      <div className="border border-border rounded-xl divide-y divide-border/60 overflow-hidden bg-card">
                        {eligibility.subjects.map((subj) => {
                          const pct = subj.totalTasks > 0 ? Math.round((subj.completedTasks / subj.totalTasks) * 100) : 0;
                          return (
                            <div
                              key={subj.code}
                              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-muted/30 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                                    {subj.code}
                                  </span>
                                  <span className="font-bold text-sm sm:text-base text-foreground">{subj.name}</span>
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
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  Avg Quiz Score: <strong className="text-foreground">{subj.avgQuizScore}%</strong> • Status: {subj.lastStudied || "Active"}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 shrink-0 sm:self-center">
                                <div className="w-28 bg-muted rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      subj.isCompleted ? "bg-emerald-500" : "bg-primary"
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <div className="text-right min-w-[70px]">
                                  <div className="font-black text-sm sm:text-base text-foreground">{subj.avgQuizScore}%</div>
                                  <div className="text-xs text-muted-foreground">
                                    {pct}% tasks
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Diagnostic Lab Bench Competency SOPs */}
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
                              <span className="font-mono text-[9px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
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

                {/* TAB 2: LIVE ACTIVITY STREAM */}
                {dossierTab === "ACTIVITIES" && (
                  <div className="space-y-4">
                    {/* Activity Filter & Telemetry KPI */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Filter student activity by action, exam, or keyword..."
                          value={activitySearchQuery}
                          onChange={(e) => setActivitySearchQuery(e.target.value)}
                          className="pl-9 h-8 text-xs"
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
                    <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
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
                    <div className="border border-border rounded-xl divide-y divide-border/60 overflow-hidden bg-card">
                      {studentActivityEvents.length === 0 ? (
                        <div className="p-6 text-center text-xs text-muted-foreground">
                          No activity events found matching &quot;{activitySearchQuery}&quot;.
                        </div>
                      ) : (
                        studentActivityEvents.map((evt) => (
                          <div key={evt.id} className="p-3 hover:bg-muted/30 transition-colors space-y-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`text-[9px] font-bold ${
                                    evt.type === "EXAM"
                                      ? "bg-purple-600 text-white"
                                      : evt.type === "PRACTICAL"
                                      ? "bg-emerald-600 text-white"
                                      : evt.type === "CERTIFICATE"
                                      ? "bg-amber-600 text-white"
                                      : evt.type === "ATTENDANCE"
                                      ? "bg-blue-600 text-white"
                                      : "bg-muted text-muted-foreground"
                                  }`}
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

                {/* TAB 3: CERTIFICATES REVIEW & APPROVALS */}
                {dossierTab === "CERTIFICATES" && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
                      <Award className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground font-semibold">
                          Super Administrator Credential Authority:
                        </strong>{" "}
                        Accept or decline certificate generation requests submitted by this student.
                        Approving immediately confers the credential, assigns the official verification ID, and updates the student in real time. Declining dispatches an immediate notification with your feedback reason.
                      </div>
                    </div>

                    {/* Pending Requests Section */}
                    {pendingCerts.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Pending Certificate Applications ({pendingCerts.length})</span>
                          </h4>
                          <Badge className="bg-amber-600 text-white text-[10px] animate-pulse">
                            Action Required
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          {pendingCerts.map((cert) => (
                            <div
                              key={cert.id}
                              className="p-4 rounded-xl border-2 border-amber-500/40 bg-amber-500/5 space-y-3 shadow-sm"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                                      {cert.code}
                                    </span>
                                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/40">
                                      {cert.program} Year {cert.year}
                                    </Badge>
                                  </div>
                                  <h4 className="font-bold text-sm text-foreground mt-1">{cert.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Affiliated Institution: <strong className="text-foreground">{cert.institution}</strong>
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Assessment Grade: <strong className="text-primary">{cert.grade}</strong> • Applied: {cert.applicationDate}
                                  </p>
                                </div>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPreviewCert(cert)}
                                  className="gap-1 text-xs shrink-0 self-start border-amber-500/30 hover:bg-amber-500/10"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>Preview Template</span>
                                </Button>
                              </div>

                              {/* Rejection Feedback Box */}
                              {rejectingCertId === cert.id ? (
                                <div className="p-3 rounded-lg bg-card border border-destructive/30 space-y-2">
                                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                                    <span>Reason / Feedback for Declining Request *</span>
                                  </label>
                                  <textarea
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    placeholder="e.g. Student must submit verified logbook for 2 remaining SOPs and retake Clinical Hematology mock test before certification."
                                    rows={3}
                                    className="w-full text-xs p-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setRejectingCertId(null);
                                        setDeclineReason("");
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeclineCertificate(cert, student, declineReason)}
                                    >
                                      Confirm Decline & Send Notification
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-500/20">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setRejectingCertId(cert.id);
                                      setDeclineReason("");
                                    }}
                                    className="gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    <span>Decline Request</span>
                                  </Button>

                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveCertificate(cert, student)}
                                    className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    <span>Accept & Issue Certificate</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Approved & Active Certificates */}
                    {approvedCerts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Approved & Active Credentials ({approvedCerts.length})</span>
                        </h4>

                        <div className="space-y-2.5">
                          {approvedCerts.map((cert) => (
                            <div
                              key={cert.id}
                              className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                    {cert.code}
                                  </span>
                                  <Badge className="bg-emerald-600 text-white text-[9px]">
                                    Conferred & Active
                                  </Badge>
                                </div>
                                <h4 className="font-bold text-xs text-foreground mt-1">{cert.title}</h4>
                                <div className="text-[10px] text-muted-foreground flex items-center gap-2 flex-wrap">
                                  <span>Conferred: {cert.issuedDate || cert.applicationDate}</span>
                                  <span>•</span>
                                  <span>Grade: <strong className="text-primary">{cert.grade}</strong></span>
                                  <span>•</span>
                                  <span>Verified by: {cert.reviewedBy || "Super Administrator"}</span>
                                  <span>•</span>
                                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                                    ID: {cert.verificationCode}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPreviewCert(cert)}
                                  className="gap-1 text-xs h-8 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>View Certificate</span>
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setPreviewCert(cert);
                                    setTimeout(() => window.print(), 300);
                                  }}
                                  className="gap-1 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span>Download</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rejected Applications */}
                    {rejectedCerts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <XCircle className="h-3.5 w-3.5 text-destructive" />
                          <span>Declined Applications ({rejectedCerts.length})</span>
                        </h4>

                        <div className="space-y-2">
                          {rejectedCerts.map((cert) => (
                            <div
                              key={cert.id}
                              className="p-3 rounded-xl border border-destructive/30 bg-destructive/5 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                                    {cert.code}
                                  </span>
                                  <Badge variant="destructive" className="text-[9px]">Declined</Badge>
                                  <span className="font-bold text-foreground">{cert.title}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground">{cert.applicationDate}</span>
                              </div>
                              <p className="text-xs text-destructive">
                                <strong>Feedback / Reason:</strong> {cert.feedback || "Academic criteria not met."}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-destructive/20">
                                <span>Reviewed by: {cert.reviewedBy || "Super Administrator"}</span>
                                <button
                                  type="button"
                                  onClick={() => handleApproveCertificate(cert, student)}
                                  className="text-primary hover:underline font-semibold cursor-pointer"
                                >
                                  Re-evaluate & Approve →
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State / Quick Generation */}
                    {studentCerts.length === 0 && (
                      <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-3 bg-muted/20">
                        <Award className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                        <div>
                          <h4 className="font-bold text-sm text-foreground">No Certificate Applications on File</h4>
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-md mx-auto">
                            This student has not yet submitted a certificate generation request. You can provision a sample application to test the verification workflow.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            applyForCertificate({
                              studentId: student.id,
                              studentName: student.fullName,
                              institution: student.institution,
                              program: student.program,
                              year: student.academicYear || "1",
                              title: `${student.program === "BSC" ? "B.Sc." : "Diploma"} Competency: Diagnostic Clinical Laboratory Benchmark`,
                              grade: "Distinction (88.5%)",
                            });
                            showNotification({
                              type: "success",
                              title: "Request Generated",
                              message: `Generated a certificate request for ${student.fullName}. You can now review, accept, or decline.`,
                              autoRefresh: true,
                            });
                          }}
                          className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Provision Sample Application for Review</span>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: Official Certificate Preview & Print */}
      {previewCert && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewCert(null);
          }}
        >
          <div className="bg-card border border-border rounded-2xl max-w-4xl lg:max-w-5xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative my-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={`text-xs ${
                    previewCert.status === "APPROVED"
                      ? "bg-emerald-600 text-white"
                      : previewCert.status === "PENDING"
                      ? "bg-amber-600 text-white animate-pulse"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {previewCert.status === "APPROVED"
                    ? "Conferred & Active Credential"
                    : previewCert.status === "PENDING"
                    ? "Pending Super Admin Verification"
                    : "Declined Application"}
                </Badge>
                <span className="text-xs font-mono font-bold text-primary border border-primary/20 px-2 py-0.5 rounded bg-primary/10">
                  {previewCert.certificateNumber || previewCert.code}
                </span>
                {previewCert.verificationCode && (
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    ID: {previewCert.verificationCode}
                  </span>
                )}
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5">
                  US Letter: 8.5 × 11 inches (21.6 × 27.9 cm)
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/verify?code=${encodeURIComponent(previewCert.certificateNumber || previewCert.code)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                  title="Verify credential on public registry"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verify Online</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
                {previewCert.status === "PENDING" && selectedStudentForDossier && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleApproveCertificate(previewCert, selectedStudentForDossier);
                      setPreviewCert(null);
                    }}
                    className="gap-1.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Approve Now</span>
                  </Button>
                )}
                {previewCert.status === "APPROVED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="gap-1.5 h-8 text-xs cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print / PDF</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewCert(null)}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 cursor-pointer"
                  title="Close Preview (Esc)"
                >
                  <X className="h-4 w-4 mr-1" />
                  <span>Close</span>
                </Button>
              </div>
            </div>

            {/* Render Printable Certificate */}
            <div
              id="users-official-cert-print"
              className={`printable-cert-document rounded-2xl p-5 sm:p-7 md:p-8 border-4 sm:border-8 bg-card text-foreground shadow-sm relative overflow-visible aspect-[11/8.5] max-w-[960px] min-h-[520px] flex flex-col justify-between mx-auto ${
                templateConfig.borderStyle === "EMERALD_CLINICAL"
                  ? "border-emerald-600"
                  : templateConfig.borderStyle === "CLASSIC_GOLD"
                  ? "border-amber-600"
                  : "border-blue-700"
              }`}
            >
              {/* Security Watermark for Non-Approved / Pending Previews */}
              {previewCert.status !== "APPROVED" && (
                <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden flex flex-col justify-around opacity-30">
                  <div className="rotate-[-22deg] scale-110 whitespace-nowrap text-red-600 font-mono font-black text-lg sm:text-xl tracking-[0.25em] text-center border-y-2 border-red-500/40 py-2 bg-red-500/5">
                    NOT APPROVED BY LABTUTOR ACADEMY
                  </div>
                  <div className="rotate-[-22deg] scale-110 whitespace-nowrap text-red-600 font-mono font-black text-lg sm:text-xl tracking-[0.25em] text-center border-y-2 border-red-500/40 py-2 bg-red-500/5">
                    Not Approved by LabTutor Academy • Official Conferral Pending
                  </div>
                  <div className="rotate-[-22deg] scale-110 whitespace-nowrap text-red-600 font-mono font-black text-lg sm:text-xl tracking-[0.25em] text-center border-y-2 border-red-500/40 py-2 bg-red-500/5">
                    NOT APPROVED BY LABTUTOR ACADEMY
                  </div>
                </div>
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
                      opacity: templateConfig.watermarkLogoOpacity ?? 0.08,
                    }}
                  />
                </div>
              )}

              <div className="text-center relative z-10 flex-1 flex flex-col justify-between h-full space-y-4">
                {/* Upper Body */}
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex justify-center">
                    <Award className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-serif font-bold uppercase tracking-wider text-foreground">
                      {templateConfig.institutionName}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
                      {templateConfig.subHeader}
                    </p>
                  </div>

                  <div className="py-0.5">
                    <span className="text-[10px] sm:text-xs tracking-widest font-semibold uppercase text-primary border-b-2 border-primary/40 pb-1">
                      Certificate of Competency & Academic Merit
                    </span>
                  </div>

                  <p className="text-xs italic text-muted-foreground">This is to officially certify that</p>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-foreground underline decoration-primary underline-offset-8">
                    {previewCert.studentName}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
                    affiliated with <strong className="text-foreground">{previewCert.institution}</strong>, has fulfilled all required clinical benchmark criteria and verified laboratory SOP standards for{" "}
                    <strong className="text-foreground">{previewCert.title}</strong> in the curriculum of{" "}
                    <strong className="text-foreground">{previewCert.program} (Year {previewCert.year})</strong> with an official assessment grade of{" "}
                    <strong className="text-primary font-bold">{previewCert.grade}</strong>.
                  </p>
                </div>

                {/* Lower Body: Signatories and Footer */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-end gap-3 text-xs text-muted-foreground">
                    <div className="text-center border-t border-border pt-2">
                      <p className="font-semibold text-foreground">{previewCert.reviewedBy || templateConfig.signatoryName1}</p>
                      <p className="text-[10px]">
                        {previewCert.reviewedRole
                          ? `${ROLE_LABELS[previewCert.reviewedRole as UserRole] || previewCert.reviewedRole}`
                          : templateConfig.signatoryTitle1}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <QRCodeView
                        value={
                          typeof window !== "undefined"
                            ? `${window.location.origin}/verify?code=${encodeURIComponent(previewCert.verificationCode || previewCert.id)}`
                            : `https://labtutor.academy/verify?code=${encodeURIComponent(previewCert.verificationCode || previewCert.id)}`
                        }
                        size={52}
                      />
                      <span className="text-[8.5px] font-bold tracking-wider text-muted-foreground uppercase mt-1">
                        Scan to Verify
                      </span>
                    </div>

                    <div className="text-center border-t border-border pt-2">
                      <p className="font-semibold text-foreground">{templateConfig.signatoryName2}</p>
                      <p className="text-[10px]">{templateConfig.signatoryTitle2}</p>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-muted-foreground/80 flex items-center justify-between border-t border-border/40 font-mono flex-wrap gap-1">
                    <span>Issued Date: {previewCert.issuedDate || previewCert.applicationDate}</span>
                    <span>Auth Code: {previewCert.verificationCode || "PENDING"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground">
                {previewCert.status === "APPROVED" ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Official verified credential conferred by Super Admin.
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    ⚠ Candidate application watermarked preview. Requires Super Admin verification.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 justify-end">
                {previewCert.status === "PENDING" && selectedStudentForDossier && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleApproveCertificate(previewCert, selectedStudentForDossier);
                      setPreviewCert(null);
                    }}
                    className="gap-1.5 h-9 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve & Issue Certificate</span>
                  </Button>
                )}
                {previewCert.status === "APPROVED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="gap-1.5 h-9 px-4 text-xs font-semibold cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print / Save PDF</span>
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPreviewCert(null)}
                  className="h-9 px-4 text-xs font-semibold cursor-pointer"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  <span>Close Preview</span>
                </Button>
              </div>
            </div>

            {/* Print Stylesheet for exact US Letter Dimensions */}
            <style>{`
              @page {
                size: letter landscape;
                margin: 0.35in;
              }
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #users-official-cert-print, #users-official-cert-print * {
                  visibility: visible !important;
                }
                #users-official-cert-print {
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 10.3in !important;
                  height: 7.8in !important;
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
    </div>
  );
}
