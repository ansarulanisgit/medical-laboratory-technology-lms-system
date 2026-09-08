"use client";

import * as React from "react";
import {
  FileQuestion,
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  Clock,
  Building,
  FileText,
  Image as ImageIcon,
  Sparkles,
  X,
  AlertCircle,
  Eye,
  Upload,
  Paperclip,
  GraduationCap,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuestionBank, QuestionBankItem } from "@/lib/stores/question-bank-store";
import { useAcademicProfile, ProgramLevel } from "@/lib/curriculum/academic-context";
import { useNotification } from "@/components/ui/notification-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { cn } from "@/lib/utils";

const PROGRAM_FULL_NAMES: Record<ProgramLevel, string> = {
  DIPLOMA: "Diploma in Medical Laboratory Technology",
  BSC: "B.Sc. in Health Technology (Laboratory)",
};

const MAX_FILE_BYTES = 1 * 1024 * 1024; // 1 MB max limit

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function QuestionBankPage() {
  const { questions, addQuestion, updateQuestion, deleteQuestion, recordDownload } = useQuestionBank();
  const { profile, coursesCatalog } = useAcademicProfile();
  const { showNotification } = useNotification();
  const { logActivity } = useActivityLog();

  const currentRole = profile?.role || "STUDENT";
  const canManageQuestions = currentRole === "SUPER_ADMIN" || currentRole === "ADMIN" || currentRole === "MENTOR";

  // Filter States: Program, Syllabus Year, Exam Year, Subject
  const [selectedProgram, setSelectedProgram] = React.useState<ProgramLevel | "ALL">("ALL");
  const [selectedYear, setSelectedYear] = React.useState<string>("ALL");
  const [selectedExamYear, setSelectedExamYear] = React.useState<string>("ALL");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("ALL");
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<QuestionBankItem | null>(null);
  const [deletingItem, setDeletingItem] = React.useState<QuestionBankItem | null>(null);
  const [viewingItem, setViewingItem] = React.useState<QuestionBankItem | null>(null);

  // Form States
  const [formTitle, setFormTitle] = React.useState("");
  const [formProgram, setFormProgram] = React.useState<ProgramLevel>(profile?.program || "DIPLOMA");
  const [formYear, setFormYear] = React.useState("1");
  const [formSubjectCode, setFormSubjectCode] = React.useState("ENG-101");
  const [formSubjectName, setFormSubjectName] = React.useState("Basic English Language Course");
  const [formExamYear, setFormExamYear] = React.useState("2024");
  const [formBoardName, setFormBoardName] = React.useState("State Medical Faculty of Bangladesh (SMFB)");
  const [formExamType, setFormExamType] = React.useState<"ANNUAL" | "SUPPLEMENTARY" | "TERM_FINAL" | "MODEL_TEST">("ANNUAL");
  const [formDocType, setFormDocType] = React.useState<"PDF" | "DOC" | "IMAGE">("PDF");
  const [formFileUrl, setFormFileUrl] = React.useState("/curriculum/Basic_English_Language_Course_Syllabus.pdf");
  const [formFileSize, setFormFileSize] = React.useState("850 KB");
  const [formFileName, setFormFileName] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formTotalMarks, setFormTotalMarks] = React.useState(75);
  const [formHasSolution, setFormHasSolution] = React.useState(true);
  const [formSolutionSummary, setFormSolutionSummary] = React.useState("");

  // Upload Interaction States
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Dynamic Exam Years available from existing questions + standard years
  const availableExamYears = React.useMemo(() => {
    const yearsSet = new Set<string>(["2025", "2024", "2023", "2022", "2021", "2020"]);
    questions.forEach((q) => {
      if (q.examYear) yearsSet.add(q.examYear);
    });
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [questions]);

  // Dynamic Subjects filtered based on selected Program and Syllabus Year
  const availableSubjects = React.useMemo(() => {
    const subjectMap = new Map<string, string>(); // code -> name

    coursesCatalog.forEach((s) => {
      const matchProg = selectedProgram === "ALL" || s.program === selectedProgram;
      const matchYr = selectedYear === "ALL" || s.year === selectedYear;
      if (matchProg && matchYr) {
        subjectMap.set(s.code, s.name);
      }
    });

    questions.forEach((q) => {
      const matchProg = selectedProgram === "ALL" || q.program === selectedProgram;
      const matchYr = selectedYear === "ALL" || q.year === selectedYear;
      if (matchProg && matchYr) {
        if (!subjectMap.has(q.subjectCode)) {
          subjectMap.set(q.subjectCode, q.subjectName);
        }
      }
    });

    return Array.from(subjectMap.entries()).map(([code, name]) => ({ code, name }));
  }, [coursesCatalog, questions, selectedProgram, selectedYear]);

  // Filtered Questions List according to: Program, Syllabus Year, Exam Year, Subject & Search
  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      const matchProg = selectedProgram === "ALL" || q.program === selectedProgram;
      const matchSyllabusYr = selectedYear === "ALL" || q.year === selectedYear;
      const matchExamYr = selectedExamYear === "ALL" || q.examYear === selectedExamYear;
      const matchSub = selectedSubject === "ALL" || q.subjectCode === selectedSubject;
      const matchSearch =
        !searchTerm.trim() ||
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.boardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.examYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (PROGRAM_FULL_NAMES[q.program] && PROGRAM_FULL_NAMES[q.program].toLowerCase().includes(searchTerm.toLowerCase()));
      return matchProg && matchSyllabusYr && matchExamYr && matchSub && matchSearch;
    });
  }, [questions, selectedProgram, selectedYear, selectedExamYear, selectedSubject, searchTerm]);

  // Active filters check
  const hasActiveFilters =
    selectedProgram !== "ALL" ||
    selectedYear !== "ALL" ||
    selectedExamYear !== "ALL" ||
    selectedSubject !== "ALL" ||
    searchTerm.trim() !== "";

  const handleResetFilters = () => {
    setSelectedProgram("ALL");
    setSelectedYear("ALL");
    setSelectedExamYear("ALL");
    setSelectedSubject("ALL");
    setSearchTerm("");
  };

  const handleFileProcess = (file: File) => {
    setUploadError(null);
    const validExts = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    const isImage = file.type.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp"].includes(fileExt);
    const isPdf = file.type === "application/pdf" || fileExt === ".pdf";

    if (!isImage && !isPdf) {
      setUploadError("Invalid file type. Please upload a PDF document or an Image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setUploadError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 1MB limit. Please upload a file smaller than 1MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFormFileUrl(dataUrl);
      setFormFileName(file.name);
      setFormFileSize(formatBytes(file.size));
      setFormDocType(isImage ? "IMAGE" : "PDF");
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

  const openAddModal = () => {
    setEditingItem(null);
    setFormTitle("");
    const defaultProg = selectedProgram === "ALL" ? (profile?.program || "DIPLOMA") : selectedProgram;
    const defaultYr = selectedYear === "ALL" ? (profile?.academicYear || "1") : selectedYear;
    setFormProgram(defaultProg);
    setFormYear(defaultYr);
    const defaultSub = availableSubjects[0] || { code: "ENG-101", name: "Basic English Language Course" };
    setFormSubjectCode(defaultSub.code);
    setFormSubjectName(defaultSub.name);
    setFormExamYear(selectedExamYear !== "ALL" ? selectedExamYear : "2024");
    setFormBoardName(defaultProg === "BSC" ? "Faculty of Allied Health Sciences, University of Dhaka" : "State Medical Faculty of Bangladesh (SMFB)");
    setFormExamType("ANNUAL");
    setFormDocType("PDF");
    setFormFileUrl("/curriculum/Basic_English_Language_Course_Syllabus.pdf");
    setFormFileSize("850 KB");
    setFormFileName("Basic_English_Language_Course_Syllabus.pdf");
    setFormDescription("");
    setFormTotalMarks(75);
    setFormHasSolution(true);
    setFormSolutionSummary("");
    setUploadError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: QuestionBankItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormProgram(item.program);
    setFormYear(item.year);
    setFormSubjectCode(item.subjectCode);
    setFormSubjectName(item.subjectName);
    setFormExamYear(item.examYear);
    setFormBoardName(item.boardName);
    setFormExamType(item.examType);
    setFormDocType(item.documentType);
    setFormFileUrl(item.fileUrl);
    setFormFileSize(item.fileSize);
    setFormFileName(item.title + (item.documentType === "IMAGE" ? ".png" : ".pdf"));
    setFormDescription(item.description);
    setFormTotalMarks(item.totalMarks);
    setFormHasSolution(item.hasSolution);
    setFormSolutionSummary(item.solutionSummary || "");
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (!formFileUrl) {
      setUploadError("Please upload a question paper file (PDF or Image, max 1MB).");
      return;
    }

    if (editingItem) {
      updateQuestion(editingItem.id, {
        title: formTitle.trim(),
        program: formProgram,
        year: formYear,
        subjectCode: formSubjectCode,
        subjectName: formSubjectName,
        examYear: formExamYear,
        boardName: formBoardName,
        examType: formExamType,
        documentType: formDocType,
        fileUrl: formFileUrl,
        fileSize: formFileSize || "850 KB",
        description: formDescription,
        totalMarks: Number(formTotalMarks) || 75,
        hasSolution: formHasSolution,
        solutionSummary: formSolutionSummary,
      });

      logActivity({
        userId: profile?.studentIdNumber || "usr-current",
        userName: profile?.fullName || "Faculty Staff",
        userRole: currentRole,
        action: "Question Paper Updated",
        category: "QUESTIONS",
        details: `Updated ${formTitle}`,
      });

      showNotification({
        type: "success",
        title: "Question Paper Updated",
        message: "Question paper has been updated successfully.",
      });
    } else {
      addQuestion({
        title: formTitle.trim(),
        program: formProgram,
        year: formYear,
        subjectCode: formSubjectCode,
        subjectName: formSubjectName,
        examYear: formExamYear,
        boardName: formBoardName,
        examType: formExamType,
        documentType: formDocType,
        fileUrl: formFileUrl,
        fileSize: formFileSize || "850 KB",
        description: formDescription,
        totalMarks: Number(formTotalMarks) || 75,
        hasSolution: formHasSolution,
        solutionSummary: formSolutionSummary,
        uploadedBy: profile?.fullName || "Faculty Staff",
        uploadedRole: currentRole,
      });

      logActivity({
        userId: profile?.studentIdNumber || "usr-current",
        userName: profile?.fullName || "Faculty Staff",
        userRole: currentRole,
        action: "Question Paper Uploaded",
        category: "QUESTIONS",
        details: `Uploaded ${formTitle}`,
      });

      showNotification({
        type: "success",
        title: "Question Paper Published",
        message: "Question paper is now available for students to browse and download.",
      });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    deleteQuestion(deletingItem.id);
    showNotification({
      type: "success",
      title: "Question Paper Removed",
      message: `${deletingItem.title} has been deleted.`,
    });
    setDeletingItem(null);
  };

  const handleDownloadClick = (item: QuestionBankItem) => {
    recordDownload(item.id);
    showNotification({
      type: "info",
      title: "Downloading Question Paper",
      message: `Downloading ${item.title}...`,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileQuestion className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Official Question Bank
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Previous 10 years' official board & faculty examination question papers with verified solutions.
          </p>
        </div>

        {canManageQuestions && (
          <Button
            onClick={openAddModal}
            size="sm"
            className="bg-primary text-primary-foreground font-medium rounded-xl shadow-xs self-start sm:self-auto h-9"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Upload Question Paper
          </Button>
        )}
      </div>

      {/* 2. Filter Controls: Program, Syllabus Year, Exam Year, Subject */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top bar: Filter Label, Count & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Filter Question Papers</span>
              <p className="text-[11px] text-muted-foreground">
                Showing <strong className="text-foreground">{filteredQuestions.length}</strong> of {questions.length} question papers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 max-w-md w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title, board, subject..."
                className="pl-9 h-9 rounded-xl text-xs bg-muted/30 border-border/80"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-2.5 text-xs rounded-xl border-border shrink-0 text-muted-foreground hover:text-foreground"
                title="Reset all filters"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1 text-primary" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* 4 Filter Dropdowns in requested sequence: Program, Syllabus Year, Exam Year, Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Program Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <span>Program</span>
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => {
                setSelectedProgram(e.target.value as ProgramLevel | "ALL");
                setSelectedSubject("ALL");
              }}
              className={cn(
                "w-full h-10 rounded-xl border text-xs font-medium px-3 bg-background transition-colors focus:ring-1 focus:ring-primary focus:outline-none truncate",
                selectedProgram !== "ALL"
                  ? "border-primary/60 bg-primary/5 text-primary font-semibold"
                  : "border-border/80 text-foreground"
              )}
            >
              <option value="ALL">All Programs</option>
              <option value="DIPLOMA">Diploma in Medical Laboratory Technology</option>
              <option value="BSC">B.Sc. in Health Technology (Laboratory)</option>
            </select>
          </div>

          {/* 2. Syllabus Year Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Syllabus Year</span>
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedSubject("ALL");
              }}
              className={cn(
                "w-full h-10 rounded-xl border text-xs font-medium px-3 bg-background transition-colors focus:ring-1 focus:ring-primary focus:outline-none",
                selectedYear !== "ALL"
                  ? "border-primary/60 bg-primary/5 text-primary font-semibold"
                  : "border-border/80 text-foreground"
              )}
            >
              <option value="ALL">All Syllabus Years</option>
              <option value="1">1st Year Syllabus</option>
              <option value="2">2nd Year Syllabus</option>
              <option value="3">3rd Year Syllabus</option>
              <option value="4">4th Year Syllabus</option>
            </select>
          </div>

          {/* 3. Exam Year Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Exam Year</span>
            </label>
            <select
              value={selectedExamYear}
              onChange={(e) => setSelectedExamYear(e.target.value)}
              className={cn(
                "w-full h-10 rounded-xl border text-xs font-medium px-3 bg-background transition-colors focus:ring-1 focus:ring-primary focus:outline-none",
                selectedExamYear !== "ALL"
                  ? "border-primary/60 bg-primary/5 text-primary font-semibold"
                  : "border-border/80 text-foreground"
              )}
            >
              <option value="ALL">All Exam Years</option>
              {availableExamYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr} Exam Paper
                </option>
              ))}
            </select>
          </div>

          {/* 4. Subject Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>Subject</span>
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={cn(
                "w-full h-10 rounded-xl border text-xs font-medium px-3 bg-background transition-colors focus:ring-1 focus:ring-primary focus:outline-none truncate",
                selectedSubject !== "ALL"
                  ? "border-primary/60 bg-primary/5 text-primary font-semibold"
                  : "border-border/80 text-foreground"
              )}
            >
              <option value="ALL">All Subjects ({availableSubjects.length})</option>
              {availableSubjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code}: {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium mr-1">Active filters:</span>
            {selectedProgram !== "ALL" && (
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20 pr-1 text-[11px] py-0.5">
                <span>{selectedProgram === "DIPLOMA" ? "Diploma in MLT" : "B.Sc. in Health Tech"}</span>
                <button
                  type="button"
                  onClick={() => { setSelectedProgram("ALL"); setSelectedSubject("ALL"); }}
                  className="hover:text-destructive p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedYear !== "ALL" && (
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20 pr-1 text-[11px] py-0.5">
                <span>Year {selectedYear}</span>
                <button
                  type="button"
                  onClick={() => { setSelectedYear("ALL"); setSelectedSubject("ALL"); }}
                  className="hover:text-destructive p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedExamYear !== "ALL" && (
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20 pr-1 text-[11px] py-0.5">
                <span>Exam {selectedExamYear}</span>
                <button
                  type="button"
                  onClick={() => setSelectedExamYear("ALL")}
                  className="hover:text-destructive p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedSubject !== "ALL" && (
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20 pr-1 text-[11px] py-0.5">
                <span>Subject: {selectedSubject}</span>
                <button
                  type="button"
                  onClick={() => setSelectedSubject("ALL")}
                  className="hover:text-destructive p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20 pr-1 text-[11px] py-0.5">
                <span>"{searchTerm}"</span>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="hover:text-destructive p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-muted-foreground hover:text-foreground font-medium underline ml-1.5"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* 3. Questions Grid (Faculty Solution Benchmark Box removed as requested) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((q) => {
          const downloadFileName = `${q.title}.${q.documentType === "IMAGE" ? "png" : "pdf"}`;
          return (
            <Card
              key={q.id}
              className="rounded-2xl border-border/80 overflow-hidden shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/70 bg-gradient-to-r from-muted/20 via-muted/5 to-transparent space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Badge variant="blue" className="text-[10px] font-mono shrink-0">
                      {q.subjectCode}
                    </Badge>
                    <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[140px] sm:max-w-xs" title={`${q.examYear} • ${q.boardName}`}>
                      {q.examYear} • {q.boardName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/80 border border-border/60">
                      {q.documentType === "IMAGE" ? (
                        <ImageIcon className="h-3 w-3 text-amber-500" />
                      ) : (
                        <FileText className="h-3 w-3 text-rose-500" />
                      )}
                      <span>{q.documentType === "IMAGE" ? "Image" : "PDF"}</span>
                    </span>

                    <Badge variant={q.hasSolution ? "filled" : "outline"} className="text-[9.5px]">
                      {q.hasSolution ? "✓ Model Solution" : "Paper Only"}
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-sm sm:text-base font-semibold leading-snug text-foreground">
                  {q.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-normal line-clamp-2">
                  {q.description}
                </CardDescription>

                <div className="text-[11px] text-muted-foreground/90 font-medium">
                  {PROGRAM_FULL_NAMES[q.program]} • Year {q.year}
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 pt-3 space-y-3">
                {/* Note: Faculty Solution Benchmark box removed from card display per user request */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3 text-[11px] flex-wrap gap-y-1">
                    <span>{q.totalMarks} Marks</span>
                    <span>•</span>
                    <span>{q.fileSize}</span>
                    <span>•</span>
                    <span>{q.downloadCount} Downloads</span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-2 w-full sm:w-auto">
                    {/* View Option */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setViewingItem(q)}
                      className="h-8 text-xs font-medium rounded-xl border-border/80 hover:border-primary/50 text-foreground"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1 text-primary" />
                      View
                    </Button>

                    {/* Download Option */}
                    <a href={q.fileUrl} download={downloadFileName} onClick={() => handleDownloadClick(q)} className="flex-1 sm:flex-none">
                      <Button size="sm" className="w-full sm:w-auto h-8 text-xs bg-primary text-primary-foreground font-medium rounded-xl shadow-2xs">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </a>

                    {canManageQuestions && (
                      <div className="flex items-center space-x-0.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(q)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
                          title="Edit question paper"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingItem(q)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                          title="Delete question paper"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <Card className="p-12 text-center rounded-2xl border-dashed border-border/80 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <FileQuestion className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No Question Papers Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No papers matched your selected filters. Adjust your program, syllabus year, exam year, or subject criteria.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={handleResetFilters} className="text-xs rounded-xl">
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset All Filters
            </Button>
            {canManageQuestions && (
              <Button size="sm" onClick={openAddModal} className="bg-primary text-primary-foreground text-xs rounded-xl">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Upload Question Paper
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* 4. Upload / Edit Question Paper Modal (1MB limit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-lg w-full p-4 sm:p-6 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  {editingItem ? "Edit Question Paper" : "Upload Official Question Paper"}
                </h2>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Paper Title *</label>
                <Input
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Basic English Language Course Annual Board Examination 2024"
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Full Name of Programs in Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Program *</label>
                  <select
                    value={formProgram}
                    onChange={(e) => setFormProgram(e.target.value as ProgramLevel)}
                    className="w-full h-10 rounded-xl border border-border bg-card px-2.5 text-xs font-medium focus:ring-1 focus:ring-primary focus:outline-none truncate"
                  >
                    <option value="DIPLOMA">Diploma in Medical Laboratory Technology</option>
                    <option value="BSC">B.Sc. in Health Technology (Laboratory)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Syllabus Year *</label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-card px-2.5 text-xs font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Subject Code *</label>
                  <Input
                    required
                    value={formSubjectCode}
                    onChange={(e) => setFormSubjectCode(e.target.value)}
                    placeholder="e.g. ENG-101"
                    className="h-10 text-xs rounded-xl uppercase font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Subject Name *</label>
                  <Input
                    required
                    value={formSubjectName}
                    onChange={(e) => setFormSubjectName(e.target.value)}
                    placeholder="e.g. Basic English Language Course"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Exam Year *</label>
                  <Input
                    required
                    value={formExamYear}
                    onChange={(e) => setFormExamYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Allotted Marks *</label>
                  <Input
                    type="number"
                    value={formTotalMarks}
                    onChange={(e) => setFormTotalMarks(Number(e.target.value))}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Exam Board / Authority *</label>
                <Input
                  required
                  value={formBoardName}
                  onChange={(e) => setFormBoardName(e.target.value)}
                  placeholder="e.g. State Medical Faculty of Bangladesh (SMFB)"
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* File Upload Section: Supports PDF and Image (PNG, JPG, WEBP) up to 1MB */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5 text-primary" />
                    <span>Upload Question Paper File (PDF or Image, max 1MB) *</span>
                  </label>
                  {formFileUrl && (
                    <span className="text-[11px] text-primary font-mono">{formFileSize}</span>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                />

                {!formFileUrl ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5",
                      isDragging
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-border/80 hover:border-primary/50 hover:bg-muted/40"
                    )}
                  >
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Click to browse or drag & drop question paper
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Accepts PDF documents and Images (PNG, JPG, WEBP) up to 1MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl border border-border/80 bg-muted/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {formDocType === "IMAGE" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                          {formFileName || "question_paper." + (formDocType === "IMAGE" ? "png" : "pdf")}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <Badge variant="outline" className="text-[9.5px] py-0 px-1.5">
                            {formDocType === "IMAGE" ? "IMAGE" : "PDF"}
                          </Badge>
                          <span>{formFileSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* View Option in form */}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setViewingItem({
                            id: "preview-temp",
                            title: formTitle || "Question Paper Preview",
                            program: formProgram,
                            year: formYear,
                            subjectCode: formSubjectCode,
                            subjectName: formSubjectName,
                            examYear: formExamYear,
                            boardName: formBoardName,
                            examType: formExamType,
                            documentType: formDocType,
                            fileUrl: formFileUrl,
                            fileSize: formFileSize,
                            description: formDescription,
                            totalMarks: formTotalMarks,
                            hasSolution: formHasSolution,
                            solutionSummary: formSolutionSummary,
                            uploadedBy: profile?.fullName || "Faculty Staff",
                            uploadedRole: currentRole,
                            createdAt: "Today",
                            downloadCount: 0,
                          });
                        }}
                        className="h-7 text-xs rounded-lg px-2 text-foreground font-medium"
                      >
                        <Eye className="h-3 w-3 mr-1 text-primary" />
                        View
                      </Button>

                      {/* Download Option in form */}
                      <a
                        href={formFileUrl}
                        download={formFileName || `${formTitle || "question_paper"}.${formDocType === "IMAGE" ? "png" : "pdf"}`}
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs rounded-lg px-2 text-foreground font-medium"
                        >
                          <Download className="h-3 w-3 mr-1 text-primary" />
                          Download
                        </Button>
                      </a>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setFormFileUrl("");
                          setFormFileName("");
                          setFormFileSize("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                        title="Remove file"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {uploadError}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Brief Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Summarize key question topics and examination format..."
                  className="w-full rounded-xl border border-border bg-card p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Benchmark Model Solution Summary</label>
                <textarea
                  value={formSolutionSummary}
                  onChange={(e) => setFormSolutionSummary(e.target.value)}
                  rows={2}
                  placeholder="Highlight key benchmark answers and grading rubrics..."
                  className="w-full rounded-xl border border-border bg-card p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="h-9 text-xs rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="h-9 text-xs bg-primary text-primary-foreground rounded-xl">
                  {editingItem ? "Update Paper" : "Publish Paper"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Question Paper Full Preview / Viewer Modal (PDF and Image) */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 my-4 max-h-[95vh] flex flex-col">
            {/* Viewer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {viewingItem.documentType === "IMAGE" ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-foreground truncate max-w-[240px] sm:max-w-md md:max-w-xl">
                    {viewingItem.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <Badge variant="blue" className="text-[9.5px] py-0 px-1.5 font-mono">
                      {viewingItem.subjectCode}
                    </Badge>
                    <span>{viewingItem.subjectName}</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">{PROGRAM_FULL_NAMES[viewingItem.program]} (Year {viewingItem.year})</span>
                    <span>•</span>
                    <span>{viewingItem.totalMarks} Marks</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={viewingItem.fileUrl}
                  download={`${viewingItem.title}.${viewingItem.documentType === "IMAGE" ? "png" : "pdf"}`}
                  onClick={() => handleDownloadClick(viewingItem)}
                >
                  <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground font-medium rounded-xl gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingItem(null)}
                  className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Viewer Content (PDF or Image) */}
            <div className="flex-1 min-h-[350px] max-h-[65vh] overflow-y-auto rounded-xl border border-border/70 bg-muted/20 p-2 flex items-center justify-center">
              {viewingItem.documentType === "IMAGE" ? (
                <div className="flex flex-col items-center justify-center p-2 max-w-full">
                  <img
                    src={viewingItem.fileUrl}
                    alt={viewingItem.title}
                    className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm border border-border"
                  />
                </div>
              ) : (
                <iframe
                  src={viewingItem.fileUrl}
                  title={viewingItem.title}
                  className="w-full h-[60vh] rounded-lg border-0 bg-white"
                />
              )}
            </div>

            {/* Benchmark Solution summary */}
            {viewingItem.solutionSummary && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/70 text-xs shrink-0 space-y-1">
                <span className="font-semibold text-foreground flex items-center gap-1 text-[11px]">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Faculty Model Solution Benchmark:
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {viewingItem.solutionSummary}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-base font-semibold">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{deletingItem.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setDeletingItem(null)} className="h-9 text-xs rounded-xl">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} className="h-9 text-xs rounded-xl">
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
