"use client";

import * as React from "react";
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
  Sparkles,
  Sliders,
  Lock,
  Unlock,
  KeyRound
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserManagement, LMSUser } from "@/lib/curriculum/user-management-context";
import { useAcademic, ProgramLevel } from "@/lib/curriculum/academic-context";
import { useNotification } from "@/components/ui/notification-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { UserRole, UserPermissions, DEFAULT_ROLE_PERMISSIONS, ROLE_LABELS } from "@/types/roles";

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
  const { logActivity } = useActivityLog();

  const isSuperAdmin = currentRole === "SUPER_ADMIN";
  const isAdmin = currentRole === "ADMIN";

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
      userToDelete.id === "usr-superadmin";

    if (isProtected) {
      showNotification({
        type: "error",
        title: "Action Prohibited",
        message: "Default Super Administrator (Ansarul Anis) is permanently protected and cannot be deleted.",
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

  const counts = React.useMemo(() => {
    return {
      total: users.length,
      superAdmin: users.filter((u) => u.role === "SUPER_ADMIN").length,
      admin: users.filter((u) => u.role === "ADMIN").length,
      mentor: users.filter((u) => u.role === "MENTOR").length,
      student: users.filter((u) => u.role === "STUDENT").length,
    };
  }, [users]);

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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-3 border-border bg-card">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase">Total Enrolled</div>
          <div className="text-xl font-extrabold mt-1">{counts.total}</div>
        </Card>
        <Card className="p-3 border-purple-500/20 bg-purple-500/5">
          <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-400 uppercase">Super Admins</div>
          <div className="text-xl font-extrabold mt-1 text-purple-700 dark:text-purple-400">{counts.superAdmin}</div>
        </Card>
        <Card className="p-3 border-blue-500/20 bg-blue-500/5">
          <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 uppercase">Admins</div>
          <div className="text-xl font-extrabold mt-1 text-blue-700 dark:text-blue-400">{counts.admin}</div>
        </Card>
        <Card className="p-3 border-amber-500/20 bg-amber-500/5">
          <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase">Faculty Mentors</div>
          <div className="text-xl font-extrabold mt-1 text-amber-700 dark:text-amber-400">{counts.mentor}</div>
        </Card>
        <Card className="p-3 border-emerald-500/20 bg-emerald-500/5 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Students</div>
          <div className="text-xl font-extrabold mt-1 text-emerald-700 dark:text-emerald-400">{counts.student}</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-border">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search user by name, username, ID, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground"
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
              className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground"
            >
              <option value="ALL">All Programs</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="BSC">B.Sc.</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground"
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
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase font-semibold">
              <tr>
                <th className="p-3.5">User Identity</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Program & Year</th>
                <th className="p-3.5">Institution</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
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

                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-foreground">{user.fullName}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span>@{user.username || user.email.split("@")[0]}</span>
                          <span>•</span>
                          <span className="font-mono">{user.studentIdNumber}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <Badge className={`text-[10px] font-semibold ${roleBadgeClass}`}>
                          {ROLE_LABELS[user.role] || user.role}
                        </Badge>
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-foreground">{user.program}</div>
                        <div className="text-[11px] text-muted-foreground">
                          Year {user.academicYear}
                        </div>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <div className="truncate text-muted-foreground" title={user.institution}>
                          {user.institution}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <Badge
                          variant={
                            user.status === "ACTIVE"
                              ? "outline"
                              : user.status === "PENDING_VERIFICATION"
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {user.status === "ACTIVE" ? "Active" : user.status.replace("_", " ")}
                        </Badge>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isSuperAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPermModal(user)}
                              title="Manage Granular Permissions"
                              className="h-7 px-2 text-[11px] gap-1"
                            >
                              <KeyRound className="h-3 w-3 text-primary" />
                              <span className="hidden sm:inline">Perms</span>
                            </Button>
                          )}

                          {isSuperAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(user)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          )}

                          {isSuperAdmin && !isProtected && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUserToDelete(user)}
                              className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                              title="Delete user"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}

                          {isSuperAdmin && isProtected && (
                            <span
                              title="Default Super Admin (Ansarul Anis) is protected and cannot be deleted"
                              className="h-7 w-7 inline-flex items-center justify-center text-muted-foreground/40 cursor-not-allowed"
                            >
                              <Lock className="h-3.5 w-3.5" />
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
    </div>
  );
}
