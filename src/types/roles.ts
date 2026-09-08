/**
 * Medical Laboratory Technology LMS (LabTutor Academy)
 * 4-Role Architecture: SUPER_ADMIN, ADMIN, MENTOR, STUDENT
 */

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MENTOR" | "STUDENT";

export const USER_ROLES: Record<UserRole, UserRole> = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MENTOR: "MENTOR",
  STUDENT: "STUDENT",
} as const;

export interface UserPermissions {
  canEditCurriculum: boolean;
  canEditCourses: boolean;
  canManageQuestionBank: boolean;
  canManagePracticals: boolean;
  canManageJobs: boolean;
  canPostUpdates: boolean;
  canApproveCertificates: boolean;
  canAccessSuperAdminTools: boolean;
}

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  SUPER_ADMIN: {
    canEditCurriculum: true,
    canEditCourses: true,
    canManageQuestionBank: true,
    canManagePracticals: true,
    canManageJobs: true,
    canPostUpdates: true,
    canApproveCertificates: true,
    canAccessSuperAdminTools: true,
  },
  ADMIN: {
    canEditCurriculum: true,
    canEditCourses: true,
    canManageQuestionBank: true,
    canManagePracticals: true,
    canManageJobs: true,
    canPostUpdates: true,
    canApproveCertificates: true,
    canAccessSuperAdminTools: false,
  },
  MENTOR: {
    canEditCurriculum: true,
    canEditCourses: true,
    canManageQuestionBank: true,
    canManagePracticals: true,
    canManageJobs: true,
    canPostUpdates: true,
    canApproveCertificates: false,
    canAccessSuperAdminTools: false,
  },
  STUDENT: {
    canEditCurriculum: false,
    canEditCourses: false,
    canManageQuestionBank: false,
    canManagePracticals: false,
    canManageJobs: false,
    canPostUpdates: false,
    canApproveCertificates: false,
    canAccessSuperAdminTools: false,
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MENTOR: "Mentor",
  STUDENT: "Student",
};

export const ROLE_PORTAL_NAMES: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin Portal",
  ADMIN: "Admin Workspace",
  MENTOR: "Mentor Desk",
  STUDENT: "Student Portal",
};

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  permissions?: Partial<UserPermissions>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAcademicProfile {
  id: string;
  userId: string;
  programId: string;
  curriculumVersionId: string;
  academicYearId: string;
  enrollmentYear: number;
  studentIdNumber?: string;
  createdAt: string;
  updatedAt: string;
}
