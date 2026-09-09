"use client";

import * as React from "react";
import { useSidebar } from "@/lib/context/sidebar-context";
import { cn } from "@/lib/utils";

export function StudentMainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 min-w-0 pb-24 md:pb-8 transition-all duration-300 ease-in-out print:pl-0 print:p-0 print:m-0 print:max-w-none",
        isCollapsed ? "md:pl-[72px]" : "md:pl-64"
      )}
    >
      <div
        className={cn(
          "w-full transition-all duration-300 px-4 pt-4 pb-6 sm:px-6 lg:px-8 print:p-0 print:m-0 print:max-w-none",
          isCollapsed ? "max-w-none" : "max-w-7xl mx-auto"
        )}
      >
        {children}
      </div>
    </main>
  );
}
