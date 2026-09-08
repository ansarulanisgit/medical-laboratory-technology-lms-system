import * as React from "react";
import { SuperAdminSidebar } from "@/components/layout/super-admin-sidebar";
import { SuperAdminMobileHeader } from "@/components/layout/super-admin-mobile-header";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <SuperAdminMobileHeader />
      <SuperAdminSidebar />
      <main className="flex-1 md:pl-64 min-w-0 pb-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
