import * as React from "react";
import { StudentSidebar } from "@/components/layout/student-sidebar";
import { StudentBottomNav } from "@/components/layout/student-bottom-nav";
import { StudentMobileHeader } from "@/components/layout/student-mobile-header";
import { StudentAcademicProvider } from "@/lib/curriculum/academic-context";
import { UserManagementProvider } from "@/lib/curriculum/user-management-context";
import { LMSAnnouncementProvider } from "@/lib/notifications/lms-announcement-context";
import { SidebarProvider } from "@/lib/context/sidebar-context";
import { StudentMainContent } from "@/components/layout/student-main-content";
import { ActivityLogProvider } from "@/lib/stores/activity-log-store";
import { StringProvider } from "@/lib/stores/string-store";
import { ModuleProvider } from "@/lib/stores/module-management-store";
import { QuestionBankProvider } from "@/lib/stores/question-bank-store";
import { PracticalProvider } from "@/lib/stores/practical-lab-store";
import { ResumeProvider } from "@/lib/stores/resume-store";
import { JobsProvider } from "@/lib/stores/jobs-store";
import { UpdatesProvider } from "@/lib/stores/updates-store";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentAcademicProvider>
      <UserManagementProvider>
        <LMSAnnouncementProvider>
          <ActivityLogProvider>
            <StringProvider>
              <ModuleProvider>
                <QuestionBankProvider>
                  <PracticalProvider>
                    <ResumeProvider>
                      <JobsProvider>
                        <UpdatesProvider>
                          <SidebarProvider>
                            <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row w-full overflow-x-hidden">
                              {/* Mobile Top Header (Small screens) */}
                              <StudentMobileHeader />

                              {/* Desktop Left Sidebar */}
                              <StudentSidebar />

                              {/* Main Content Area */}
                              <StudentMainContent>{children}</StudentMainContent>

                              {/* Mobile Bottom Navigation */}
                              <StudentBottomNav />
                            </div>
                          </SidebarProvider>
                        </UpdatesProvider>
                      </JobsProvider>
                    </ResumeProvider>
                  </PracticalProvider>
                </QuestionBankProvider>
              </ModuleProvider>
            </StringProvider>
          </ActivityLogProvider>
        </LMSAnnouncementProvider>
      </UserManagementProvider>
    </StudentAcademicProvider>
  );
}
