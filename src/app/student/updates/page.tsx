"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Calendar,
  AlertTriangle,
  FileText,
  Download,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Megaphone,
  X,
  Filter,
  Eye,
  Paperclip,
  UploadCloud,
  FileCheck,
  Printer,
  ExternalLink,
  Layers,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Clock,
  User,
  Check,
  BookOpen,
  ArrowUpRight,
  ChevronRight,
  Share2,
  Radio,
} from "lucide-react";
import { useUpdates, UpdateNoticeItem } from "@/lib/stores/updates-store";
import { useLMSAnnouncements, LMSAnnouncement } from "@/lib/notifications/lms-announcement-context";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { cn } from "@/lib/utils";

const BASE_CATEGORIES = [
  "ALL",
  "EXAM_NOTICE",
  "PRACTICAL_SCHEDULE",
  "ACADEMIC",
  "PLATFORM_UPDATE",
  "WORKSHOP",
] as const;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatNoticeDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function getRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) return formatNoticeDate(dateStr);
    if (diffDays === 1) return "Yesterday";
    if (diffDays > 1) return `${diffDays}d ago`;
    if (diffHours >= 1) return `${diffHours}h ago`;
    if (diffMin >= 1) return `${diffMin}m ago`;
    return "Just now";
  } catch {
    return dateStr;
  }
}

function getCategoryDisplay(cat: string) {
  switch (cat) {
    case "EXAM_NOTICE":
    case "EXAM":
      return "Exam Notice";
    case "PRACTICAL_SCHEDULE":
    case "CLINICAL":
      return "Practical Schedule";
    case "ACADEMIC":
      return "Academic Circular";
    case "PLATFORM_UPDATE":
    case "SYSTEM":
      return "Platform Update";
    case "WORKSHOP":
    case "ADVISORY":
      return "Workshop & Advisory";
    default:
      return cat;
  }
}

function getCategoryColor(cat: string) {
  switch (cat) {
    case "EXAM_NOTICE":
    case "EXAM":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
    case "PRACTICAL_SCHEDULE":
    case "CLINICAL":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
    case "ACADEMIC":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    case "PLATFORM_UPDATE":
    case "SYSTEM":
      return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/30";
    case "WORKSHOP":
    case "ADVISORY":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30";
    default:
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
  }
}

interface UnifiedNoticeItem {
  id: string;
  source: "LMS_BROADCAST" | "BULLETIN";
  title: string;
  content: string;
  isHtml: boolean;
  category: string;
  urgency: "CRITICAL" | "HIGH" | "NORMAL";
  targetAudience: string;
  postedBy: string;
  postedRole: string;
  createdAt: string;
  attachmentName?: string;
  attachmentUrl?: string;
  fileSize?: string;
  fileType?: string;
  isRead?: boolean;
  rawUpdateItem?: UpdateNoticeItem;
  rawLMSItem?: LMSAnnouncement;
}

export default function StudentUpdatesPage() {
  const {
    updates,
    customCategories,
    addUpdate,
    modifyUpdate,
    deleteUpdate,
    addCustomCategory,
  } = useUpdates();
  const {
    announcements: lmsAnnouncements,
    deleteAnnouncement: deleteLMSAnnouncement,
    markAsRead: markLMSAsRead,
  } = useLMSAnnouncements();
  const { profile } = useAcademicProfile();
  const { logActivity } = useActivityLog();

  const role = profile?.role || "STUDENT";
  const currentUsername = profile?.username || "student.user";
  const canManage = role === "SUPER_ADMIN" || role === "ADMIN" || role === "MENTOR";

  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [selectedUrgency, setSelectedUrgency] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewDensity, setViewDensity] = React.useState<"detailed" | "compact">("detailed");

  // Selected notice for detailed reading modal
  const [readingNotice, setReadingNotice] = React.useState<UnifiedNoticeItem | null>(null);

  // Unify announcements from both sources
  const unifiedNotices = React.useMemo<UnifiedNoticeItem[]>(() => {
    // 1. Regular store updates
    const storeItems: UnifiedNoticeItem[] = updates.map((item) => ({
      id: item.id,
      source: "BULLETIN",
      title: item.title,
      content: item.content,
      isHtml: true,
      category: item.category,
      urgency: item.urgency,
      targetAudience: item.targetAudience,
      postedBy: item.postedBy,
      postedRole: item.postedRole,
      createdAt: item.createdAt,
      attachmentName: item.attachmentName,
      attachmentUrl: item.attachmentUrl,
      fileSize: item.fileSize,
      fileType: item.fileType,
      isRead: true,
      rawUpdateItem: item,
    }));

    // 2. Real-time LMS broadcast announcements
    const lmsItems: UnifiedNoticeItem[] = lmsAnnouncements.map((a) => {
      let mappedCat = "ACADEMIC";
      if (a.type === "EXAM") mappedCat = "EXAM_NOTICE";
      else if (a.type === "CLINICAL") mappedCat = "PRACTICAL_SCHEDULE";
      else if (a.type === "SYSTEM") mappedCat = "PLATFORM_UPDATE";
      else if (a.type === "ADVISORY") mappedCat = "WORKSHOP";

      let mappedUrgency: "CRITICAL" | "HIGH" | "NORMAL" = "NORMAL";
      if (a.priority === "URGENT") mappedUrgency = "CRITICAL";
      else if (a.priority === "HIGH") mappedUrgency = "HIGH";

      return {
        id: a.id,
        source: "LMS_BROADCAST",
        title: a.title,
        content: a.message,
        isHtml: false,
        category: mappedCat,
        urgency: mappedUrgency,
        targetAudience: a.targetAudience,
        postedBy: a.authorName,
        postedRole: a.authorRole,
        createdAt: a.createdAt,
        isRead: a.readBy.includes(currentUsername),
        rawLMSItem: a,
      };
    });

    // Merge and remove potential duplicate IDs, then sort by createdAt descending
    const combined = [...storeItems, ...lmsItems];
    return combined.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return timeB - timeA;
    });
  }, [updates, lmsAnnouncements, currentUsername]);

  // Dynamic Categories
  const allCategories = React.useMemo(() => {
    const list = [...BASE_CATEGORIES, ...customCategories.filter((c) => !BASE_CATEGORIES.includes(c as any))];
    return list;
  }, [customCategories]);

  // Statistics KPI counts
  const stats = React.useMemo(() => {
    const total = unifiedNotices.length;
    const criticalCount = unifiedNotices.filter((n) => n.urgency === "CRITICAL" || n.urgency === "HIGH").length;
    const withAttachments = unifiedNotices.filter((n) => Boolean(n.attachmentUrl || n.attachmentName)).length;
    const examOrPractical = unifiedNotices.filter(
      (n) => n.category === "EXAM_NOTICE" || n.category === "PRACTICAL_SCHEDULE"
    ).length;
    return { total, criticalCount, withAttachments, examOrPractical };
  }, [unifiedNotices]);

  // Form State
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    content: "",
    category: "EXAM_NOTICE",
    urgency: "NORMAL" as UpdateNoticeItem["urgency"],
    targetAudience: "ALL" as UpdateNoticeItem["targetAudience"],
    attachmentName: "",
    attachmentUrl: "",
    fileSize: "",
    fileType: "",
  });

  // Custom Category Input in Modal
  const [isAddingCustomCategory, setIsAddingCustomCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [categoryError, setCategoryError] = React.useState<string | null>(null);

  // File Upload State
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showManualUrlInput, setShowManualUrlInput] = React.useState(false);

  // Filtered notices
  const filteredNotices = React.useMemo(() => {
    return unifiedNotices.filter((item) => {
      const matchCat =
        selectedCategory === "ALL" ||
        item.category === selectedCategory ||
        (selectedCategory === "EXAM_NOTICE" && item.category === "EXAM") ||
        (selectedCategory === "PRACTICAL_SCHEDULE" && item.category === "CLINICAL");

      const matchUrgency =
        selectedUrgency === "ALL" ||
        (selectedUrgency === "CRITICAL" && item.urgency === "CRITICAL") ||
        (selectedUrgency === "HIGH" && item.urgency === "HIGH") ||
        (selectedUrgency === "NORMAL" && item.urgency === "NORMAL");

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.postedBy.toLowerCase().includes(q) ||
        getCategoryDisplay(item.category).toLowerCase().includes(q);

      return matchCat && matchUrgency && matchSearch;
    });
  }, [unifiedNotices, selectedCategory, selectedUrgency, searchQuery]);

  // Keyboard shortcut to close reader modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setReadingNotice(null);
        setIsFormOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenNotice = (notice: UnifiedNoticeItem) => {
    if (notice.source === "LMS_BROADCAST") {
      markLMSAsRead(notice.id);
    }
    setReadingNotice(notice);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      category: "EXAM_NOTICE",
      urgency: "NORMAL",
      targetAudience: "ALL",
      attachmentName: "",
      attachmentUrl: "",
      fileSize: "",
      fileType: "",
    });
    setIsAddingCustomCategory(false);
    setNewCategoryName("");
    setCategoryError(null);
    setUploadError(null);
    setShowManualUrlInput(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (notice: UnifiedNoticeItem) => {
    if (notice.source !== "BULLETIN" || !notice.rawUpdateItem) {
      alert("This notice is a broadcast bulletin. Use the admin controls to post a new announcement.");
      return;
    }
    const item = notice.rawUpdateItem;
    setEditingId(item.id);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      urgency: item.urgency,
      targetAudience: item.targetAudience,
      attachmentName: item.attachmentName || "",
      attachmentUrl: item.attachmentUrl || "",
      fileSize: item.fileSize || "",
      fileType: item.fileType || "",
    });
    setIsAddingCustomCategory(false);
    setNewCategoryName("");
    setCategoryError(null);
    setUploadError(null);
    setShowManualUrlInput(Boolean(item.attachmentUrl && !item.attachmentUrl.startsWith("data:")));
    setIsFormOpen(true);
  };

  const handleSaveCustomCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCategoryName.trim()) {
      setCategoryError("Please enter a category name.");
      return;
    }
    const cleanName = newCategoryName.trim();
    const res = addCustomCategory(cleanName);
    if (!res.success) {
      setCategoryError(res.error || "Category already exists.");
      return;
    }
    setFormData((prev) => ({ ...prev, category: cleanName }));
    setNewCategoryName("");
    setCategoryError(null);
    setIsAddingCustomCategory(false);
  };

  const handleFileProcess = (file: File) => {
    setUploadError(null);
    const MAX_BYTES = 1024 * 1024; // 1 MB Limit
    if (file.size > MAX_BYTES) {
      setUploadError(
        `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 1MB limit. Please upload a file smaller than 1MB.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        attachmentName: file.name,
        attachmentUrl: dataUrl,
        fileSize: formatBytes(file.size),
        fileType: file.type || file.name.split(".").pop()?.toUpperCase() || "DOCUMENT",
      }));
    };
    reader.onerror = () => {
      setUploadError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachmentName: "",
      attachmentUrl: "",
      fileSize: "",
      fileType: "",
    }));
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter Announcement Headline.");
      return;
    }
    if (!formData.content.trim()) {
      alert("Please provide Notice Content using the editor.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      urgency: formData.urgency,
      targetAudience: formData.targetAudience,
      postedBy: profile?.fullName || "Academic Authority",
      postedRole: role,
      attachmentName: formData.attachmentName.trim() || undefined,
      attachmentUrl: formData.attachmentUrl.trim() || undefined,
      fileSize: formData.fileSize || undefined,
      fileType: formData.fileType || undefined,
    };

    if (editingId) {
      modifyUpdate(editingId, payload);
      logActivity({
        action: "UPDATE",
        module: "Updates & Notices",
        details: `Updated announcement "${payload.title}"`,
      });
    } else {
      addUpdate(payload);
      logActivity({
        action: "CREATE",
        module: "Updates & Notices",
        details: `Published new official announcement "${payload.title}"`,
      });
    }

    setIsFormOpen(false);
  };

  const handleDeleteNotice = (notice: UnifiedNoticeItem) => {
    if (!confirm(`Are you sure you want to remove notice "${notice.title}"?`)) return;

    if (notice.source === "BULLETIN") {
      deleteUpdate(notice.id);
    } else {
      deleteLMSAnnouncement(notice.id);
    }

    logActivity({
      action: "DELETE",
      module: "Updates & Notices",
      details: `Deleted notice "${notice.title}"`,
    });

    if (readingNotice?.id === notice.id) {
      setReadingNotice(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-card via-card to-primary/5 p-6 rounded-3xl border border-border/80 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Academic Updates & Circulars
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs px-2.5 py-0.5 font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Central institutional repository for State Medical Faculty of Bangladesh (SMFB) official circulars,
            DGHS guidelines, laboratory examination routines, OSPE workstation notices, and course syllabus releases.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/curriculum/Basic_English_Language_Course_Syllabus.pdf"
            target="_blank"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground border border-border transition-colors shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-primary" />
            <span>ENG-101 Syllabus PDF</span>
          </Link>

          {canManage && (
            <Button
              onClick={handleOpenCreate}
              className="gap-2 shadow-xs bg-primary text-primary-foreground font-semibold rounded-xl text-xs h-9 px-3.5 cursor-pointer hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              <span>Post Announcement</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-2xs hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Circulars</span>
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Megaphone className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">{stats.total}</span>
            <span className="text-[11px] text-muted-foreground font-medium">Recorded</span>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-2xs hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">High & Critical Priority</span>
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
              {stats.criticalCount}
            </span>
            <span className="text-[11px] text-rose-600/80 font-medium">Urgent actions</span>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-2xs hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Exam & Practical Routines</span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">{stats.examOrPractical}</span>
            <span className="text-[11px] text-muted-foreground font-medium">Routines active</span>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-2xs hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Downloadable Attachments</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">{stats.withAttachments}</span>
            <span className="text-[11px] text-muted-foreground font-medium">PDFs & documents</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-2xs space-y-3.5">
        {/* Row 1: Search & Urgency & Density */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search circulars by headline, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9.5 h-10 text-xs rounded-xl bg-background border-border"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Urgency Filter */}
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground px-2">Priority:</span>
              {[
                { id: "ALL", label: "All" },
                { id: "CRITICAL", label: "Critical" },
                { id: "HIGH", label: "High" },
                { id: "NORMAL", label: "Normal" },
              ].map((urg) => (
                <button
                  key={urg.id}
                  onClick={() => setSelectedUrgency(urg.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    selectedUrgency === urg.id
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {urg.label}
                </button>
              ))}
            </div>

            {/* Density switch */}
            <div className="hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
              <button
                onClick={() => setViewDensity("detailed")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  viewDensity === "detailed"
                    ? "bg-card text-foreground shadow-2xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Detailed Cards"
              >
                Cards
              </button>
              <button
                onClick={() => setViewDensity("compact")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  viewDensity === "compact"
                    ? "bg-card text-foreground shadow-2xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Compact Digest"
              >
                Digest
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-border/50 pt-3">
          {allCategories.map((cat) => {
            const count = unifiedNotices.filter((n) =>
              cat === "ALL"
                ? true
                : n.category === cat ||
                  (cat === "EXAM_NOTICE" && n.category === "EXAM") ||
                  (cat === "PRACTICAL_SCHEDULE" && n.category === "CLINICAL")
            ).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                )}
              >
                <span>{cat === "ALL" ? "All Categories" : getCategoryDisplay(cat)}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold",
                    selectedCategory === cat
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background/80 text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notices Feed */}
      {filteredNotices.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground text-xs space-y-3 rounded-3xl border-border bg-card">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Megaphone className="h-6 w-6 opacity-40" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-foreground text-base">No Circulars Match Filter Criteria</p>
            <p className="max-w-md mx-auto">
              No academic bulletins match your search term &quot;{searchQuery}&quot; or chosen urgency and category.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("ALL");
              setSelectedUrgency("ALL");
              setSearchQuery("");
            }}
            className="rounded-xl text-xs"
          >
            Reset Filters
          </Button>
        </Card>
      ) : viewDensity === "compact" ? (
        /* Compact Digest View */
        <div className="bg-card rounded-2xl border border-border/80 shadow-2xs divide-y divide-border/60 overflow-hidden">
          {filteredNotices.map((notice) => {
            const isCritical = notice.urgency === "CRITICAL";
            const isHigh = notice.urgency === "HIGH";

            return (
              <div
                key={notice.id}
                onClick={() => handleOpenNotice(notice)}
                className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border",
                      isCritical
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                        : isHigh
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {isCritical ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : notice.source === "LMS_BROADCAST" ? (
                      <Radio className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {notice.title}
                      </span>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.2 rounded-full border", getCategoryColor(notice.category))}>
                        {getCategoryDisplay(notice.category)}
                      </span>
                      {notice.attachmentName && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                          <Paperclip className="h-2.5 w-2.5" /> PDF
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span>{notice.postedBy}</span>
                      <span>•</span>
                      <span>{getRelativeTime(notice.createdAt)}</span>
                      <span>•</span>
                      <span>Audience: {notice.targetAudience}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNotice(notice);
                    }}
                    className="h-8 px-3 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10"
                  >
                    <span>Read Notice</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Card View */
        <div className="space-y-4">
          {filteredNotices.map((notice) => {
            const isCritical = notice.urgency === "CRITICAL";
            const isHigh = notice.urgency === "HIGH";

            return (
              <Card
                key={notice.id}
                className={cn(
                  "border rounded-3xl transition-all shadow-xs overflow-hidden",
                  isCritical
                    ? "border-rose-500/40 bg-gradient-to-br from-rose-500/5 via-card to-card"
                    : isHigh
                    ? "border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-card"
                    : "border-border/80 bg-card hover:border-primary/40"
                )}
              >
                <CardHeader className="p-5 sm:p-6 pb-3">
                  <div className="flex items-start sm:items-center justify-between gap-3 mb-2 flex-wrap">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={isCritical ? "destructive" : isHigh ? "outline" : "secondary"}
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                          isHigh ? "text-amber-600 border-amber-500/40 bg-amber-500/10" : ""
                        )}
                      >
                        {notice.urgency === "CRITICAL" ? "Critical Alert" : notice.urgency === "HIGH" ? "High Priority" : "Official Notice"}
                      </Badge>

                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
                          getCategoryColor(notice.category)
                        )}
                      >
                        {getCategoryDisplay(notice.category)}
                      </span>

                      {notice.source === "LMS_BROADCAST" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                          <Radio className="h-2.5 w-2.5" />
                          Live Broadcast
                        </span>
                      )}

                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3" />
                        {getRelativeTime(notice.createdAt)} ({formatNoticeDate(notice.createdAt)})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenNotice(notice)}
                        className="h-8 px-2.5 text-xs text-primary hover:text-primary hover:bg-primary/10 rounded-xl font-semibold gap-1 cursor-pointer"
                        title="View full notice details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </Button>

                      {canManage && (
                        <>
                          {notice.source === "BULLETIN" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(notice)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
                              title="Edit notice"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotice(notice)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg cursor-pointer"
                            title="Delete notice"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <CardTitle
                    onClick={() => handleOpenNotice(notice)}
                    className="text-base sm:text-lg md:text-xl font-bold leading-snug cursor-pointer hover:text-primary transition-colors"
                  >
                    {notice.title}
                  </CardTitle>

                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Issued by:</span>
                      <strong className="text-foreground font-semibold">{notice.postedBy}</strong>
                    </span>
                    <span>({notice.postedRole})</span>
                    <span>•</span>
                    <span>Target: <strong className="text-foreground">{notice.targetAudience === "ALL" ? "All Enrolled Students" : notice.targetAudience}</strong></span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 sm:p-6 pt-0 space-y-3.5">
                  {/* Notice Preview Content */}
                  {notice.isHtml ? (
                    <div
                      className="text-xs sm:text-sm text-muted-foreground leading-relaxed prose prose-xs sm:prose-sm dark:prose-invert max-w-none line-clamp-3 [&_p]:mb-1.5"
                      dangerouslySetInnerHTML={{ __html: notice.content }}
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {notice.content}
                    </p>
                  )}

                  {/* Attachment Box with Direct Download */}
                  {notice.attachmentName && (
                    <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between text-xs mt-2">
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">{notice.attachmentName}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {notice.fileSize || "Official Attachment"}
                          </div>
                        </div>
                      </div>

                      {notice.attachmentUrl && (
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={notice.attachmentUrl}
                            download={notice.attachmentName}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xs"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* FULL NOTICE DETAILS / DOCUMENT PREVIEW MODAL */}
      {readingNotice && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setReadingNotice(null)}
        >
          <div
            className="bg-card border border-border rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar with Institutional Badge */}
            <div className="flex items-start justify-between pb-4 border-b border-border/80 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    Official Institutional Circular
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    REF: LTA-CIR-2026-{readingNotice.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight pt-1">
                  {readingNotice.title}
                </h2>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReadingNotice(null)}
                className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/60 text-xs">
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">Category</span>
                <span className={cn("inline-block mt-0.5 font-bold px-2 py-0.5 rounded-md border text-[11px]", getCategoryColor(readingNotice.category))}>
                  {getCategoryDisplay(readingNotice.category)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">Priority Urgency</span>
                <span
                  className={cn(
                    "inline-block mt-0.5 font-bold px-2 py-0.5 rounded-md border text-[11px]",
                    readingNotice.urgency === "CRITICAL"
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                      : readingNotice.urgency === "HIGH"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                      : "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {readingNotice.urgency}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">Published Date</span>
                <span className="font-semibold text-foreground mt-0.5 block">
                  {formatNoticeDate(readingNotice.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">Author / Authority</span>
                <span className="font-semibold text-foreground mt-0.5 block truncate" title={readingNotice.postedBy}>
                  {readingNotice.postedBy}
                </span>
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notice Description & Directives</h4>
              {readingNotice.isHtml ? (
                <div
                  className="text-sm leading-relaxed text-foreground/90 prose prose-sm dark:prose-invert max-w-none [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: readingNotice.content }}
                />
              ) : (
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                  {readingNotice.content}
                </p>
              )}
            </div>

            {/* Attached Files Section */}
            {readingNotice.attachmentName && (
              <div className="space-y-2 pt-2 border-t border-border/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Official Document Attachment
                </h4>
                <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-foreground text-sm truncate">
                        {readingNotice.attachmentName}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {readingNotice.fileSize || "Verified Document"} • Official Curriculum / Faculty Record
                      </div>
                    </div>
                  </div>

                  {readingNotice.attachmentUrl && (
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={readingNotice.attachmentUrl}
                        download={readingNotice.attachmentName}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/80">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>State Medical Faculty of Bangladesh (SMFB) & DGHS Certified Notice</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="rounded-xl text-xs gap-1.5 h-9"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Circular</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReadingNotice(null)}
                  className="rounded-xl text-xs h-9 px-4"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post / Edit Notice Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Megaphone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {editingId ? "Edit Announcement" : "Post Official Announcement"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Broadcast circulars, notices, and attach documents (up to 1MB).
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFormOpen(false)}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              {/* Headline */}
              <div className="space-y-1">
                <label className="font-semibold text-foreground text-xs">Announcement Headline *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Schedule for 1st Year Practical Bench Examination"
                  required
                  className="rounded-xl text-xs h-10"
                />
              </div>

              {/* Category, Urgency, Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category with Custom Option */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-foreground text-xs">Category *</label>
                    {!isAddingCustomCategory && (
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomCategory(true)}
                        className="text-[11px] text-primary hover:underline font-medium flex items-center gap-0.5"
                      >
                        <Plus className="h-3 w-3" />
                        <span>New</span>
                      </button>
                    )}
                  </div>

                  {!isAddingCustomCategory ? (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === "__ADD_CUSTOM__") {
                          setIsAddingCustomCategory(true);
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      <option value="EXAM_NOTICE">Exam Notice</option>
                      <option value="PRACTICAL_SCHEDULE">Practical Schedule</option>
                      <option value="ACADEMIC">Academic Circular</option>
                      <option value="PLATFORM_UPDATE">Platform Update</option>
                      <option value="WORKSHOP">Workshop</option>
                      {customCategories.map((c) => (
                        <option key={c} value={c}>
                          {c} (Custom)
                        </option>
                      ))}
                      <option value="__ADD_CUSTOM__">+ Add Custom Category...</option>
                    </select>
                  ) : (
                    <div className="space-y-1.5 animate-in fade-in">
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Category name..."
                          autoFocus
                          className="h-10 text-xs rounded-xl flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleSaveCustomCategory}
                          className="h-10 px-3 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:bg-primary/90 shadow-2xs"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCustomCategory(false);
                            setCategoryError(null);
                          }}
                          className="h-10 px-2 rounded-xl border border-input text-muted-foreground hover:bg-muted text-xs"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {categoryError && (
                        <span className="text-[10.5px] text-destructive block">{categoryError}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Urgency Level */}
                <div className="space-y-1">
                  <label className="font-semibold text-foreground text-xs">Urgency Level</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="CRITICAL">Critical Alert</option>
                  </select>
                </div>

                {/* Audience */}
                <div className="space-y-1">
                  <label className="font-semibold text-foreground text-xs">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="ALL">All Users</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="MENTOR">Mentors Only</option>
                  </select>
                </div>
              </div>

              {/* WYSIWYG Notice Content */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground text-xs">Full Notice Content *</label>
                  <span className="text-[10px] text-muted-foreground">WYSIWYG Rich Editor</span>
                </div>
                <WysiwygEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Provide detailed instructions, timings, examination rules, room numbers, or links..."
                  minHeight="150px"
                />
              </div>

              {/* Attachment File Upload (Up to 1MB) */}
              <div className="space-y-2 pt-1 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5 text-primary" />
                    <span>Upload Attachment (Max 1MB)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualUrlInput(!showManualUrlInput)}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline"
                  >
                    {showManualUrlInput ? "Hide manual link" : "Or specify external URL / path"}
                  </button>
                </div>

                {/* File Dropzone / Uploader */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.txt,.zip"
                  className="hidden"
                />

                {!formData.attachmentUrl ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5",
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/30"
                    )}
                  >
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-foreground">
                        Click to upload file
                      </span>
                      <span className="text-xs text-muted-foreground"> or drag & drop here</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Supports PDF, DOCX, XLSX, Images, ZIP • Maximum file size: <strong>1 MB</strong>
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl border border-primary/30 bg-primary/5 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-2xs">
                        <FileCheck className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate text-xs">
                          {formData.attachmentName || "Attached Document"}
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                          {formData.fileSize && <span>{formData.fileSize}</span>}
                          {formData.fileSize && <span>•</span>}
                          <span className="text-primary font-medium">Ready to publish</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {formData.attachmentUrl && (
                        <a
                          href={formData.attachmentUrl}
                          download={formData.attachmentName || "attachment"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline px-2 py-1 font-medium flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>Preview</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="h-7 w-7 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                        title="Remove attachment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Error Banner */}
                {uploadError && (
                  <div className="p-2.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Optional Manual URL / Path Input */}
                {showManualUrlInput && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-in fade-in">
                    <div className="space-y-1">
                      <label className="font-medium text-foreground text-[11px]">Attachment Display Name</label>
                      <Input
                        value={formData.attachmentName}
                        onChange={(e) => setFormData({ ...formData, attachmentName: e.target.value })}
                        placeholder="e.g. Official_Routine_2026.pdf"
                        className="h-9 text-xs rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-foreground text-[11px]">Attachment URL or Local Path</label>
                      <Input
                        value={formData.attachmentUrl}
                        onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                        placeholder="e.g. https://... or /curriculum/..."
                        className="h-9 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  className="h-9 px-4 rounded-xl text-xs font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-2xs hover:bg-primary/90"
                >
                  {editingId ? "Save Changes" : "Publish Announcement"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
