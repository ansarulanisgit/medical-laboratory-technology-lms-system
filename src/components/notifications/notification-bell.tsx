"use client";

import * as React from "react";
import {
  Bell,
  CheckCheck,
  PlusCircle,
  Trash2,
  AlertCircle,
  Calendar,
  Layers,
  FlaskConical,
  ShieldCheck,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  useLMSAnnouncements,
  LMSAnnouncement,
  AnnouncementType,
  AnnouncementPriority,
} from "@/lib/notifications/lms-announcement-context";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function getRelativeTime(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  } catch {
    return "Recent";
  }
}

export function NotificationBell() {
  const {
    announcements,
    unreadCount,
    createAnnouncement,
    deleteAnnouncement,
    markAsRead,
    markAllAsRead,
  } = useLMSAnnouncements();
  const { profile } = useAcademicProfile();

  const currentRole = profile?.role || "STUDENT";
  const isManagementRole = currentRole === "SUPER_ADMIN" || currentRole === "ADMIN";
  const currentUsername = profile?.username || "student.user";

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedNotice, setSelectedNotice] = React.useState<LMSAnnouncement | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Form states for creating notification
  const [formTitle, setFormTitle] = React.useState("");
  const [formMessage, setFormMessage] = React.useState("");
  const [formType, setFormType] = React.useState<AnnouncementType>("EXAM");
  const [formPriority, setFormPriority] = React.useState<AnnouncementPriority>("NORMAL");
  const [formAudience, setFormAudience] = React.useState<"ALL" | "DIPLOMA" | "BSC">("ALL");

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or ESC
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSelectedNotice(null);
        setIsCreateModalOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleOpenNotice = (notice: LMSAnnouncement) => {
    markAsRead(notice.id);
    setSelectedNotice(notice);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) return;

    createAnnouncement({
      title: formTitle.trim(),
      message: formMessage.trim(),
      type: formType,
      priority: formPriority,
      targetAudience: formAudience,
      authorRole: currentRole as "SUPER_ADMIN" | "ADMIN",
      authorName: profile?.fullName || (currentRole === "SUPER_ADMIN" ? "Super Admin" : "Institute Admin"),
    });

    setFormTitle("");
    setFormMessage("");
    setFormType("EXAM");
    setFormPriority("NORMAL");
    setFormAudience("ALL");
    setIsCreateModalOpen(false);
  };

  const getTypeBadge = (type: AnnouncementType) => {
    switch (type) {
      case "EXAM":
        return (
          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
            <Calendar className="h-2.5 w-2.5 mr-1" />
            Exam Schedule
          </span>
        );
      case "ACADEMIC":
        return (
          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Layers className="h-2.5 w-2.5 mr-1" />
            Academic Notice
          </span>
        );
      case "CLINICAL":
        return (
          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20">
            <FlaskConical className="h-2.5 w-2.5 mr-1" />
            Clinical Lab
          </span>
        );
      case "SYSTEM":
        return (
          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
            <ShieldCheck className="h-2.5 w-2.5 mr-1" />
            System Alert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            Announcement
          </span>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open notifications"
        title="View Notifications & Announcements"
        className="h-9 w-9 rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted/60 transition-all flex items-center justify-center relative shadow-2xs group shrink-0 cursor-pointer"
      >
        <Bell className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:scale-105 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50 ring-2 ring-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 sm:hidden animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Notifications Popover / Mobile Modal */}
      {isOpen && (
        <div className="fixed inset-x-3.5 top-16 sm:inset-x-auto sm:absolute sm:right-0 sm:top-11 z-50 w-auto sm:w-[420px] sm:max-w-[420px] max-h-[calc(100vh-5rem)] sm:max-h-[540px] rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xl overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-border/80 bg-muted/20 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center gap-1.5 truncate">
                  <span>Announcements</span>
                  {unreadCount > 0 && (
                    <Badge variant="filled" className="text-xs px-2 py-0.5 font-bold">
                      {unreadCount} New
                    </Badge>
                  )}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">Read All</span>
                </button>
              )}

              {isManagementRole && (
                <Button
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="h-8 text-xs px-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-2xs"
                  title="Broadcast new announcement"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  Broadcast
                </Button>
              )}

              {/* Close Button on Mobile */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Announcements List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60 scrollbar-none overscroll-contain">
            {announcements.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground space-y-2">
                <Bell className="h-8 w-8 mx-auto text-muted-foreground/40" />
                <p className="text-sm font-medium">No announcements at this time.</p>
                <p className="text-xs text-muted-foreground/80">
                  New examination notices and academic alerts will appear here in real time.
                </p>
              </div>
            ) : (
              announcements.map((notice) => {
                const isUnread = !notice.readBy.includes(currentUsername);

                return (
                  <div
                    key={notice.id}
                    onClick={() => handleOpenNotice(notice)}
                    className={cn(
                      "p-3.5 sm:p-4 hover:bg-muted/40 active:bg-muted/60 cursor-pointer transition-colors relative flex gap-3 group text-left",
                      isUnread ? "bg-primary/[0.04]" : ""
                    )}
                  >
                    {/* Unread dot */}
                    <div className="pt-1.5 shrink-0">
                      {isUnread ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-xs ring-2 ring-primary/20" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getTypeBadge(notice.type)}
                          {notice.priority === "URGENT" && (
                            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white uppercase tracking-wider">
                              Urgent
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                          {getRelativeTime(notice.createdAt)}
                        </span>
                      </div>

                      <h4
                        className={cn(
                          "text-sm sm:text-base leading-snug line-clamp-2",
                          isUnread ? "font-bold text-foreground" : "font-medium text-foreground/85"
                        )}
                      >
                        {notice.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed font-normal">
                        {notice.message}
                      </p>

                      <div className="flex items-center justify-between pt-0.5 text-xs text-muted-foreground">
                        <span className="truncate">
                          By: <span className="font-semibold text-foreground">{notice.authorName}</span>
                        </span>

                        {isManagementRole && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAnnouncement(notice.id);
                            }}
                            title="Delete notice"
                            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border/80 bg-muted/20 text-center shrink-0">
            <span className="text-[11px] sm:text-xs text-muted-foreground font-normal">
              State Medical Faculty & DGHS Clinical LMS Announcements
            </span>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getTypeBadge(selectedNotice.type)}
                  {selectedNotice.priority === "URGENT" && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white uppercase tracking-wider">
                      Urgent Priority
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(selectedNotice.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-foreground tracking-tight leading-snug">
                  {selectedNotice.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedNotice(null)}
                className="h-8 w-8 rounded-xl shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border text-sm md:text-base text-foreground/90 leading-relaxed font-normal whitespace-pre-wrap">
              {selectedNotice.message}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground pt-3 border-t border-border">
              <span className="leading-snug">
                Authorized By: <span className="font-semibold text-foreground">{selectedNotice.authorName}</span> ({selectedNotice.authorRole.replace("_", " ")})
              </span>
              <Button
                size="sm"
                onClick={() => setSelectedNotice(null)}
                className="rounded-xl text-xs sm:text-sm font-semibold min-h-[36px] w-full sm:w-auto cursor-pointer"
              >
                Dismiss Notice
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast / Create Notification Modal (for Super Admin & Admin) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight">
                    Broadcast LMS Notice
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Publish real-time notification to students and faculty
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCreateModalOpen(false)}
                className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Notice Title *
                </label>
                <Input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Annual Faculty Examination Form Fill-up"
                  required
                  className="rounded-xl text-xs min-h-[40px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Notice Category *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as AnnouncementType)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground shadow-xs min-h-[40px]"
                  >
                    <option value="EXAM">Exam Schedule</option>
                    <option value="ACADEMIC">Academic Notice</option>
                    <option value="CLINICAL">Clinical Lab Alert</option>
                    <option value="SYSTEM">System Broadcast</option>
                    <option value="ADVISORY">Faculty Advisory</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Priority Level *
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as AnnouncementPriority)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground shadow-xs min-h-[40px]"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Target Audience
                </label>
                <select
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value as "ALL" | "DIPLOMA" | "BSC")}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground shadow-xs min-h-[40px]"
                >
                  <option value="ALL">All Enrolled Students (Diploma & B.Sc.)</option>
                  <option value="DIPLOMA">Diploma in Medical Laboratory Technology Only</option>
                  <option value="BSC">B.Sc. in Health Technology (Laboratory) Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Announcement Details *
                </label>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Enter full notice guidelines, instructions, deadlines, or OSPE information..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs leading-relaxed"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl text-xs font-medium min-h-[38px] w-full sm:w-auto cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground rounded-xl text-xs font-semibold min-h-[38px] shadow-xs w-full sm:w-auto cursor-pointer"
                >
                  Broadcast Notice Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
