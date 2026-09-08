"use client";

import * as React from "react";
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
  File,
  FileCheck,
  Tag,
  ExternalLink,
} from "lucide-react";
import { useUpdates, UpdateNoticeItem } from "@/lib/stores/updates-store";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { cn } from "@/lib/utils";

const BASE_CATEGORIES = [
  "ALL",
  "EXAM_NOTICE",
  "PRACTICAL_SCHEDULE",
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

function getCategoryDisplay(cat: string) {
  switch (cat) {
    case "EXAM_NOTICE":
      return "Exam Notice";
    case "PRACTICAL_SCHEDULE":
      return "Practical Schedule";
    case "PLATFORM_UPDATE":
      return "Platform Update";
    case "WORKSHOP":
      return "Workshop";
    default:
      return cat;
  }
}

function getCategoryColor(cat: string) {
  switch (cat) {
    case "EXAM_NOTICE":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
    case "PRACTICAL_SCHEDULE":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
    case "PLATFORM_UPDATE":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    case "WORKSHOP":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30";
    default:
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
  }
}

export default function StudentUpdatesPage() {
  const { updates, customCategories, addUpdate, modifyUpdate, deleteUpdate, addCustomCategory } = useUpdates();
  const { profile } = useAcademicProfile();
  const { logActivity } = useActivityLog();

  const role = profile.role || "STUDENT";
  const canManage = role === "SUPER_ADMIN" || role === "ADMIN" || role === "MENTOR";

  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Category list combining standard and user-defined categories
  const allCategories = React.useMemo(() => {
    return [...BASE_CATEGORIES, ...customCategories.filter((c) => !BASE_CATEGORIES.includes(c as any))];
  }, [customCategories]);

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

  const filteredUpdates = React.useMemo(() => {
    return updates.filter((item) => {
      const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [updates, selectedCategory, searchQuery]);

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

  const handleOpenEdit = (notice: UpdateNoticeItem) => {
    setEditingId(notice.id);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      urgency: notice.urgency,
      targetAudience: notice.targetAudience,
      attachmentName: notice.attachmentName || "",
      attachmentUrl: notice.attachmentUrl || "",
      fileSize: notice.fileSize || "",
      fileType: notice.fileType || "",
    });
    setIsAddingCustomCategory(false);
    setNewCategoryName("");
    setCategoryError(null);
    setUploadError(null);
    setShowManualUrlInput(Boolean(notice.attachmentUrl && !notice.attachmentUrl.startsWith("data:")));
    setIsFormOpen(true);
  };

  // Custom Category Handler
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

  // File Upload Handler (Up to 1MB)
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
      postedBy: profile.fullName || "Academic Authority",
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

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete notice "${title}"?`)) {
      deleteUpdate(id);
      logActivity({
        action: "DELETE",
        module: "Updates & Notices",
        details: `Deleted notice "${title}"`,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Announcements & Notices
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              Live Bulletin
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Official academic notices, examination schedules, laboratory routines, and institutional circulars.
          </p>
        </div>

        {canManage && (
          <Button onClick={handleOpenCreate} className="gap-2 shadow-sm bg-primary text-primary-foreground font-semibold rounded-xl">
            <Plus className="h-4 w-4" />
            <span>Post Announcement</span>
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat === "ALL" ? "All Notices" : getCategoryDisplay(cat)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notices, circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Notices Feed */}
      {filteredUpdates.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground text-xs space-y-2 rounded-2xl border-border">
          <Megaphone className="h-10 w-10 mx-auto opacity-40 text-muted-foreground" />
          <p className="font-semibold text-foreground text-sm">No Notices Found</p>
          <p>No circulars match your current search query or category filter.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((notice) => {
            const isCritical = notice.urgency === "CRITICAL";
            const isHigh = notice.urgency === "HIGH";

            return (
              <Card
                key={notice.id}
                className={cn(
                  "border rounded-2xl transition-all shadow-xs overflow-hidden",
                  isCritical
                    ? "border-rose-500/40 bg-rose-500/5"
                    : isHigh
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={isCritical ? "destructive" : isHigh ? "outline" : "secondary"}
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider",
                          isHigh ? "text-amber-600 border-amber-500/40" : ""
                        )}
                      >
                        {notice.urgency}
                      </Badge>
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2.5 py-0.5 rounded-full border",
                          getCategoryColor(notice.category)
                        )}
                      >
                        {getCategoryDisplay(notice.category)}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {notice.createdAt}
                      </span>
                    </div>

                    {canManage && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(notice)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-lg"
                          title="Edit notice"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notice.id, notice.title)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                          title="Delete notice"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-base sm:text-lg font-bold leading-snug">
                    {notice.title}
                  </CardTitle>

                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <span>Issued by:</span>
                    <strong className="text-foreground">{notice.postedBy}</strong>
                    <span>({notice.postedRole})</span>
                    <span>• Target: {notice.targetAudience === "ALL" ? "All Users" : notice.targetAudience}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3">
                  {/* WYSIWYG Rendered HTML Content */}
                  <div
                    className="text-xs text-muted-foreground leading-relaxed prose prose-xs dark:prose-invert max-w-none [&_p]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-foreground [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-2.5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_a]:text-primary [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: notice.content }}
                  />

                  {/* Attachment Box with Direct Download */}
                  {notice.attachmentName && (
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between text-xs mt-2">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">{notice.attachmentName}</div>
                          {notice.fileSize && (
                            <div className="text-[10.5px] text-muted-foreground font-mono">
                              {notice.fileSize}
                            </div>
                          )}
                        </div>
                      </div>

                      {notice.attachmentUrl && (
                        <a
                          href={notice.attachmentUrl}
                          download={notice.attachmentName}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Post / Edit Notice Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Megaphone className="h-4 w-4" />
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
                          className="h-10 px-3 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:bg-primary/90 shadow-xs"
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
                      "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5",
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
                  <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
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
                  className="h-9 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/90"
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
