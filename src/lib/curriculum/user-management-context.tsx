"use client";

import * as React from "react";
import { UserRole, UserPermissions, DEFAULT_ROLE_PERMISSIONS } from "@/types/roles";
import { ProgramLevel } from "./academic-context";

export interface LMSUser {
  id: string;
  fullName: string;
  username: string;
  password?: string;
  email: string;
  phone: string;
  role: UserRole; // "SUPER_ADMIN" | "ADMIN" | "MENTOR" | "STUDENT"
  permissions?: UserPermissions;
  institution: string;
  program: ProgramLevel;
  academicYear: string; // "1", "2", "3", "4"
  studentIdNumber: string;
  status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  joinedDate: string;
  isProtected?: boolean; // Default super admin cannot be deleted
}

export const DEFAULT_SUPER_ADMIN: LMSUser = {
  id: "usr-superadmin",
  fullName: "Ansarul Anis",
  username: "ansarulanis",
  password: "Ansarul@233",
  email: "ansarul.contact@gmail.com",
  phone: "01755667788",
  role: "SUPER_ADMIN",
  permissions: DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN,
  institution: "DGHS Medical Technology Directorate & LabTutor Central Administration",
  program: "BSC",
  academicYear: "4",
  studentIdNumber: "LT-SA-001",
  status: "ACTIVE",
  joinedDate: "2023-01-01",
  isProtected: true,
};

export const SUPER_ADMIN_ANSARUL_ISLAM: LMSUser = {
  id: "usr-superadmin-islam",
  fullName: "Ansarul Islam",
  username: "ansarul.admin",
  password: "Ansarulislam",
  email: "ansarul.admin@gmail.com",
  phone: "01709260934",
  role: "SUPER_ADMIN",
  permissions: DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN,
  institution: "DGHS Medical Technology Directorate & LabTutor Central Administration",
  program: "BSC",
  academicYear: "4",
  studentIdNumber: "LT-SA-002",
  status: "ACTIVE",
  joinedDate: "2023-01-01",
  isProtected: true,
};

const INITIAL_USERS: LMSUser[] = [
  SUPER_ADMIN_ANSARUL_ISLAM,
  DEFAULT_SUPER_ADMIN,
  {
    id: "usr-001",
    fullName: "Dr. Rafiqul Islam",
    username: "rafiqul.islam",
    password: "Admin@Password1",
    email: "rafiqul.islam@dghs.gov.bd",
    phone: "01711002233",
    role: "ADMIN",
    permissions: DEFAULT_ROLE_PERMISSIONS.ADMIN,
    institution: "DGHS Medical Technology Directorate, Mohakhali, Dhaka",
    program: "BSC",
    academicYear: "4",
    studentIdNumber: "DGHS-DIR-001",
    status: "ACTIVE",
    joinedDate: "2023-01-15",
  },
  {
    id: "usr-002",
    fullName: "Prof. Nasreen Akhter",
    username: "nasreen.akhter",
    password: "Faculty@Pass102",
    email: "nasreen.akhter@diht.edu.bd",
    phone: "01819887766",
    role: "ADMIN",
    permissions: DEFAULT_ROLE_PERMISSIONS.ADMIN,
    institution: "Dhaka Institute of Health Technology (DIHT)",
    program: "DIPLOMA",
    academicYear: "2",
    studentIdNumber: "DIHT-FAC-102",
    status: "ACTIVE",
    joinedDate: "2023-03-20",
  },
  {
    id: "usr-003",
    fullName: "Dr. Sabrina Parvin",
    username: "sabrina.mentor",
    password: "Mentor@Pass2024",
    email: "sabrina.parvin@labtutor.ac.bd",
    phone: "01711554433",
    role: "MENTOR",
    permissions: DEFAULT_ROLE_PERMISSIONS.MENTOR,
    institution: "Dhaka Medical College Diagnostic Wing",
    program: "BSC",
    academicYear: "4",
    studentIdNumber: "LT-MEN-012",
    status: "ACTIVE",
    joinedDate: "2023-05-18",
  },
  {
    id: "usr-004",
    fullName: "MD. Arif Hossain",
    username: "arif.mentor",
    password: "Mentor@Pass2024",
    email: "arif.hossain@labtutor.ac.bd",
    phone: "01998877665",
    role: "MENTOR",
    permissions: DEFAULT_ROLE_PERMISSIONS.MENTOR,
    institution: "Institute of Health Technology (IHT), Rajshahi",
    program: "DIPLOMA",
    academicYear: "3",
    studentIdNumber: "LT-MEN-019",
    status: "ACTIVE",
    joinedDate: "2023-07-22",
  },
  {
    id: "usr-005",
    fullName: "Md. Ansarul Islam",
    username: "ansarul.islam",
    password: "Student@Pass2024",
    email: "ansarul.support@gmail.com",
    phone: "+8801709260934",
    role: "STUDENT",
    permissions: DEFAULT_ROLE_PERMISSIONS.STUDENT,
    institution: "Dhaka Institute of Health Technology (DIHT)",
    program: "DIPLOMA",
    academicYear: "2",
    studentIdNumber: "LT-2024-0482",
    status: "ACTIVE",
    joinedDate: "2024-01-10",
  },
  {
    id: "usr-006",
    fullName: "Nusrat Jahan",
    username: "nusrat.jahan",
    password: "Student@Pass2024",
    email: "nusrat.jahan@iht.rajshahi.gov.bd",
    phone: "01623998877",
    role: "STUDENT",
    permissions: DEFAULT_ROLE_PERMISSIONS.STUDENT,
    institution: "Institute of Health Technology (IHT), Rajshahi",
    program: "BSC",
    academicYear: "1",
    studentIdNumber: "LT-2024-0199",
    status: "ACTIVE",
    joinedDate: "2024-02-14",
  },
];

const USERS_STORAGE_KEY = "labtutor_lms_users_v5";

interface UserManagementContextType {
  users: LMSUser[];
  addUser: (userData: Omit<LMSUser, "id" | "joinedDate">) => { success: boolean; error?: string };
  updateUser: (id: string, updates: Partial<LMSUser>) => { success: boolean; error?: string };
  updateUserPermissions: (id: string, permissions: Partial<UserPermissions>) => { success: boolean; error?: string };
  deleteUser: (id: string) => { success: boolean; error?: string };
  getUserById: (id: string) => LMSUser | undefined;
  getUserByUsername: (username: string) => LMSUser | undefined;
  hasPermission: (user: LMSUser | null | undefined, permissionKey: keyof UserPermissions) => boolean;
}

const UserManagementContext = React.createContext<UserManagementContextType | undefined>(undefined);

export function UserManagementProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = React.useState<LMSUser[]>(INITIAL_USERS);

  // Load from localStorage on mount with migration to enforce Super Admins
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        let parsed: LMSUser[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 1. Synchronize or insert Ansarul Islam as Super Admin
          const islamIdx = parsed.findIndex(
            u => u.id === "usr-superadmin-islam" || u.username?.toLowerCase() === "ansarul.admin" || u.email?.toLowerCase() === "ansarul.admin@gmail.com"
          );
          if (islamIdx >= 0) {
            parsed[islamIdx] = {
              ...parsed[islamIdx],
              ...SUPER_ADMIN_ANSARUL_ISLAM,
              isProtected: true,
            };
          } else {
            parsed.unshift(SUPER_ADMIN_ANSARUL_ISLAM);
          }

          // 2. Synchronize or insert Ansarul Anis as protected super admin
          const anisIdx = parsed.findIndex(
            u => u.id === "usr-superadmin" || u.username?.toLowerCase() === "ansarulanis" || u.email?.toLowerCase() === "ansarul.contact@gmail.com"
          );
          if (anisIdx >= 0) {
            parsed[anisIdx] = {
              ...parsed[anisIdx],
              ...DEFAULT_SUPER_ADMIN,
              isProtected: true,
            };
          } else {
            parsed.unshift(DEFAULT_SUPER_ADMIN);
          }

          // 3. Remove any old duplicate student records with matching emails
          parsed = parsed.filter(u => !(u.id !== "usr-superadmin" && u.id !== "usr-superadmin-islam" && (u.username === "ansarul.anis" || u.email === "ansarul.anis@gmail.com")));

          // 4. Ensure no unauthorized user has SUPER_ADMIN role (e.g. Dr. Rafiqul Islam)
          parsed = parsed.map(u => {
            if (
              u.id !== "usr-superadmin" &&
              u.id !== "usr-superadmin-islam" &&
              u.username?.toLowerCase() !== "ansarulanis" &&
              u.username?.toLowerCase() !== "ansarul.admin" &&
              u.role === "SUPER_ADMIN"
            ) {
              if (u.fullName === "Dr. Rafiqul Islam" || u.username === "rafiqul.islam") {
                return { ...u, role: "ADMIN" as UserRole, permissions: DEFAULT_ROLE_PERMISSIONS.ADMIN };
              }
            }
            return u;
          });

          // 5. Ensure mentors exist
          const hasMentor = parsed.some((u: LMSUser) => u.role === "MENTOR");
          if (!hasMentor) {
            parsed = [...parsed, ...INITIAL_USERS.filter(u => u.role === "MENTOR")];
          }

          setUsers(parsed);
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
          return;
        }
      }
    } catch {
      // fallback
    }
    setUsers(INITIAL_USERS);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    } catch {}
  }, []);

  const persistUsers = React.useCallback((newUsers: LMSUser[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    } catch {
      // ignore
    }
  }, []);

  const addUser = React.useCallback(
    (userData: Omit<LMSUser, "id" | "joinedDate">): { success: boolean; error?: string } => {
      if (!userData.fullName.trim()) return { success: false, error: "Full Name is required." };
      if (!userData.email.trim() || !userData.email.includes("@")) return { success: false, error: "Valid Email is required." };
      if (!userData.username.trim()) return { success: false, error: "Username is required." };

      // Check duplicates
      const usernameExists = users.some(u => u.username.toLowerCase() === userData.username.toLowerCase());
      if (usernameExists) return { success: false, error: "Username already in use." };

      const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (emailExists) return { success: false, error: "Email address already registered." };

      const defaultPerms = DEFAULT_ROLE_PERMISSIONS[userData.role] || DEFAULT_ROLE_PERMISSIONS.STUDENT;

      const newUser: LMSUser = {
        ...userData,
        permissions: userData.permissions || defaultPerms,
        id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        joinedDate: new Date().toISOString().split("T")[0],
        isProtected: false,
      };

      const updated = [newUser, ...users];
      persistUsers(updated);
      return { success: true };
    },
    [users, persistUsers]
  );

  const updateUser = React.useCallback(
    (id: string, updates: Partial<LMSUser>): { success: boolean; error?: string } => {
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) return { success: false, error: "User not found." };

      const current = users[userIndex];
      const isTargetProtected =
        current.isProtected ||
        current.username?.toLowerCase() === "ansarulanis" ||
        current.email?.toLowerCase() === "ansarul.contact@gmail.com" ||
        current.id === "usr-superadmin" ||
        current.username?.toLowerCase() === "ansarul.admin" ||
        current.email?.toLowerCase() === "ansarul.admin@gmail.com" ||
        current.id === "usr-superadmin-islam";

      if (isTargetProtected) {
        if (updates.role && updates.role !== "SUPER_ADMIN") {
          return { success: false, error: "Protected Super Administrator cannot be demoted from SUPER_ADMIN role." };
        }
      }

      if (updates.username) {
        const usernameConflict = users.some(
          u => u.id !== id && u.username.toLowerCase() === updates.username!.toLowerCase()
        );
        if (usernameConflict) return { success: false, error: "Username already in use by another user." };
      }

      if (updates.email) {
        const emailConflict = users.some(
          u => u.id !== id && u.email.toLowerCase() === updates.email!.toLowerCase()
        );
        if (emailConflict) return { success: false, error: "Email already in use by another user." };
      }

      const updatedUsers = [...users];
      const newRole = isTargetProtected ? "SUPER_ADMIN" : (updates.role || current.role);
      const defaultPerms = DEFAULT_ROLE_PERMISSIONS[newRole];

      updatedUsers[userIndex] = {
        ...current,
        ...updates,
        role: newRole,
        isProtected: isTargetProtected ? true : (updates.isProtected ?? current.isProtected),
        permissions: isTargetProtected
          ? DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN
          : (updates.permissions || current.permissions || defaultPerms),
      };

      persistUsers(updatedUsers);
      return { success: true };
    },
    [users, persistUsers]
  );

  const updateUserPermissions = React.useCallback(
    (id: string, permissions: Partial<UserPermissions>): { success: boolean; error?: string } => {
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) return { success: false, error: "User not found." };

      const updatedUsers = [...users];
      const current = updatedUsers[userIndex];
      const basePerms = current.permissions || DEFAULT_ROLE_PERMISSIONS[current.role] || DEFAULT_ROLE_PERMISSIONS.STUDENT;

      updatedUsers[userIndex] = {
        ...current,
        permissions: {
          ...basePerms,
          ...permissions,
        },
      };

      persistUsers(updatedUsers);
      return { success: true };
    },
    [users, persistUsers]
  );

  const deleteUser = React.useCallback(
    (id: string): { success: boolean; error?: string } => {
      const userToDelete = users.find(u => u.id === id);
      if (!userToDelete) return { success: false, error: "User not found." };

      // Super Admins are permanently protected and cannot be deleted
      if (
        userToDelete.isProtected ||
        userToDelete.username?.toLowerCase() === "ansarulanis" ||
        userToDelete.email?.toLowerCase() === "ansarul.contact@gmail.com" ||
        userToDelete.id === "usr-superadmin" ||
        userToDelete.username?.toLowerCase() === "ansarul.admin" ||
        userToDelete.email?.toLowerCase() === "ansarul.admin@gmail.com" ||
        userToDelete.id === "usr-superadmin-islam"
      ) {
        return {
          success: false,
          error: `Super Administrator (${userToDelete.fullName}) is permanently protected and cannot be deleted.`,
        };
      }

      if (userToDelete.role === "SUPER_ADMIN") {
        const superAdminCount = users.filter(u => u.role === "SUPER_ADMIN").length;
        if (superAdminCount <= 1) {
          return { success: false, error: "Cannot delete the sole Super Administrator." };
        }
      }

      const updated = users.filter(u => u.id !== id);
      persistUsers(updated);
      return { success: true };
    },
    [users, persistUsers]
  );

  const getUserById = React.useCallback((id: string) => users.find(u => u.id === id), [users]);
  const getUserByUsername = React.useCallback(
    (username: string) => users.find(u => u.username.toLowerCase() === username.toLowerCase()),
    [users]
  );

  const hasPermission = React.useCallback(
    (user: LMSUser | null | undefined, permissionKey: keyof UserPermissions): boolean => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;
      if (user.permissions && user.permissions[permissionKey] !== undefined) {
        return !!user.permissions[permissionKey];
      }
      const roleDefaults = DEFAULT_ROLE_PERMISSIONS[user.role];
      return !!roleDefaults?.[permissionKey];
    },
    []
  );

  const value = React.useMemo(
    () => ({
      users,
      addUser,
      updateUser,
      updateUserPermissions,
      deleteUser,
      getUserById,
      getUserByUsername,
      hasPermission,
    }),
    [users, addUser, updateUser, updateUserPermissions, deleteUser, getUserById, getUserByUsername, hasPermission]
  );

  return <UserManagementContext.Provider value={value}>{children}</UserManagementContext.Provider>;
}

export function useUserManagement() {
  const context = React.useContext(UserManagementContext);
  if (!context) {
    throw new Error("useUserManagement must be used within a UserManagementProvider");
  }
  return context;
}
