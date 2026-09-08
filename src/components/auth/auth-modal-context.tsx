"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const DynamicAuthModal = dynamic(
  () => import("./auth-modal").then((m) => m.AuthModal),
  { ssr: false }
);

export type AuthTab = "LOGIN" | "REGISTER";

interface AuthModalContextType {
  isOpen: boolean;
  activeTab: AuthTab;
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;
  setActiveTab: (tab: AuthTab) => void;
}

const AuthModalContext = React.createContext<AuthModalContextType | undefined>(undefined);

function AuthUrlListener({
  openAuthModal,
}: {
  openAuthModal: (tab: AuthTab) => void;
}) {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "login") {
      openAuthModal("LOGIN");
    } else if (authParam === "register" || authParam === "signup") {
      openAuthModal("REGISTER");
    }
  }, [searchParams, openAuthModal]);

  return null;
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<AuthTab>("LOGIN");

  const openAuthModal = React.useCallback((tab: AuthTab = "LOGIN") => {
    setActiveTab(tab);
    setIsOpen(true);
  }, []);

  const closeAuthModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  // Lock body scroll when modal is active
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        activeTab,
        openAuthModal,
        closeAuthModal,
        setActiveTab,
      }}
    >
      <React.Suspense fallback={null}>
        <AuthUrlListener openAuthModal={openAuthModal} />
      </React.Suspense>
      {children}
      {isOpen && <DynamicAuthModal />}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = React.useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
