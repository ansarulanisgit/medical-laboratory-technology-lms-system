"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Printer,
  Sparkles,
  Download,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  RotateCcw,
  Palette,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Globe,
  Sliders,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoveUp,
  MoveDown,
  Type,
  Camera,
  Upload,
  User,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useResume,
  ResumeSkill,
  ResumeEducation,
  ResumeExperience,
  ResumeTheme,
  ResumeCustomSection,
  ResumeContactLink,
  RESUME_FONT_FAMILIES,
} from "@/lib/stores/resume-store";
import { useAcademic } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { useNotification } from "@/components/ui/notification-context";
import { exportResumeToPdf, printResumeDocument } from "@/lib/utils/export-resume-pdf";

// 8 Healthcare & Executive Color Presets
const COLOR_PRESETS = [
  { id: "emerald", label: "Clinical Emerald", primary: "#059669", accent: "#0284c7" },
  { id: "navy", label: "Hospital Navy", primary: "#1d4ed8", accent: "#0891b2" },
  { id: "slate", label: "Slate Charcoal", primary: "#334155", accent: "#475569" },
  { id: "crimson", label: "Medical Crimson", primary: "#dc2626", accent: "#b91c1c" },
  { id: "teal", label: "Diagnostic Teal", primary: "#0d9488", accent: "#0284c7" },
  { id: "violet", label: "Royal Violet", primary: "#7c3aed", accent: "#6366f1" },
  { id: "amber", label: "Warm Amber", primary: "#d97706", accent: "#b45309" },
  { id: "monochrome", label: "Pure Dark", primary: "#0f172a", accent: "#334155" },
];

// 6 Layout Theme Metadata
const THEME_OPTIONS: { id: ResumeTheme; name: string; tag: string; description: string }[] = [
  {
    id: "MODERN_SPLIT",
    name: "Modern Split",
    tag: "2-Column Clinical",
    description: "Left accent sidebar for skills, instrumentation & photo; right body for clinical experience.",
  },
  {
    id: "MINIMALIST_ACADEMIC",
    name: "Academic Classic",
    tag: "Single Column",
    description: "Centered institutional header, classic dividers, traditional hospital fellowship format.",
  },
  {
    id: "EXECUTIVE_HEALTH",
    name: "Executive Health",
    tag: "Hero Banner",
    description: "Solid primary header banner with white identity text, passport photo slot, and structured grid.",
  },
  {
    id: "COMPACT_DIAGNOSTIC",
    name: "Compact Diagnostic",
    tag: "ATS High-Density",
    description: "High-density structured cards designed to fit extensive lab competencies into 1 page.",
  },
  {
    id: "MODERN_MINIMALIST",
    name: "Nordic Minimalist",
    tag: "Clean Typography",
    description: "Generous whitespace, bold left-aligned typography, and subtle accent lines.",
  },
  {
    id: "CLINICAL_TIMELINE",
    name: "Clinical Timeline",
    tag: "Timeline Accent",
    description: "Chronological vertical timeline nodes connecting clinical rotations and education.",
  },
];

import {
  ResumeSectionKey,
  DEFAULT_SECTION_HEADINGS,
  DEFAULT_SECTION_ORDER,
  DEFAULT_RESUME,
} from "@/lib/stores/resume-store";

function GripIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-4 w-4"} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

const SECTION_METADATA: Record<
  ResumeSectionKey,
  {
    key: ResumeSectionKey;
    editorTab: EditorSection;
    defaultLabel: string;
    icon: string;
    getCount: (r: any) => number;
  }
> = {
  summary: {
    key: "summary",
    editorTab: "OBJECTIVE",
    defaultLabel: "Career Objective",
    icon: "🎯",
    getCount: () => 1,
  },
  skills: {
    key: "skills",
    editorTab: "SKILLS",
    defaultLabel: "Laboratory Competencies",
    icon: "🧪",
    getCount: (r) => r.skills.length,
  },
  experience: {
    key: "experience",
    editorTab: "EXPERIENCE",
    defaultLabel: "Working Experiences",
    icon: "🏥",
    getCount: (r) => r.rotations.length,
  },
  education: {
    key: "education",
    editorTab: "EDUCATION",
    defaultLabel: "Academic Qualifications & Training",
    icon: "🎓",
    getCount: (r) => r.education.length,
  },
  personal: {
    key: "personal",
    editorTab: "PERSONAL",
    defaultLabel: "Personal Details",
    icon: "📋",
    getCount: (r) => (r.personalDetails ? 10 : 0),
  },
  equipment: {
    key: "equipment",
    editorTab: "EQUIPMENT",
    defaultLabel: "Diagnostic Instrumentation & Analyzers",
    icon: "🔬",
    getCount: (r) => r.equipmentProficiencies.length,
  },
  certs: {
    key: "certs",
    editorTab: "CERTS",
    defaultLabel: "Certifications & Licensure",
    icon: "📜",
    getCount: (r) => r.certifications.length,
  },
  languages: {
    key: "languages",
    editorTab: "LANGUAGES",
    defaultLabel: "Languages & Fluency",
    icon: "🌐",
    getCount: (r) => r.languages.length,
  },
  custom: {
    key: "custom",
    editorTab: "CUSTOM",
    defaultLabel: "Custom Sections & Research",
    icon: "✨",
    getCount: (r) => (r.customSections || []).length,
  },
};

type EditorSection =
  | "CONTACT"
  | "OBJECTIVE"
  | "PERSONAL"
  | "EDUCATION"
  | "SKILLS"
  | "EXPERIENCE"
  | "LANGUAGES"
  | "SIGNATURE"
  | "EQUIPMENT"
  | "CERTS"
  | "CUSTOM";

const SECTION_OPTIONS: { key: EditorSection; label: string; icon: string }[] = [
  { key: "CONTACT", label: "1. Identity, Contact & Photo", icon: "👤" },
  { key: "OBJECTIVE", label: "2. Career Objectives", icon: "🎯" },
  { key: "PERSONAL", label: "3. Personal Details: Full Name, Father, Address, NID, etc.", icon: "📋" },
  { key: "EDUCATION", label: "4. Academic Qualifications & Training", icon: "🎓" },
  { key: "SKILLS", label: "5. Laboratory Competencies", icon: "🧪" },
  { key: "EXPERIENCE", label: "6. Working Experiences", icon: "🏥" },
  { key: "LANGUAGES", label: "7. Languages & Fluency", icon: "🌐" },
  { key: "SIGNATURE", label: "8. Signature (Bottom Right)", icon: "✍️" },
  { key: "EQUIPMENT", label: "9. Diagnostic Analyzers & Equipment", icon: "🔬" },
  { key: "CERTS", label: "10. Certifications & Licensure", icon: "📜" },
  { key: "CUSTOM", label: "11. Custom Sections & Research", icon: "✨" },
];

export default function StudentResumePage() {
  const {
    resume,
    updateResume,
    resetResume,
    reorderSections,
    updateSectionHeading,
    toggleSectionVisibility,
  } = useResume();
  const { role } = useAcademic();
  const { logActivity } = useActivityLog();
  const { showNotification } = useNotification();

  const [activeEditorTab, setActiveEditorTab] = React.useState<EditorSection>("CONTACT");
    const [selectorMode, setSelectorMode] = React.useState<"SELECT" | "REORDER">("SELECT");
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const activeSectionOrder = resume.sectionOrder && resume.sectionOrder.length > 0
    ? resume.sectionOrder
    : DEFAULT_SECTION_ORDER;

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const currentOrder = [...activeSectionOrder];
    const [removed] = currentOrder.splice(draggedIndex, 1);
    currentOrder.splice(targetIndex, 0, removed);
    reorderSections(currentOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const currentOrder = [...activeSectionOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
    const [item] = currentOrder.splice(index, 1);
    currentOrder.splice(targetIndex, 0, item);
    reorderSections(currentOrder);
  };

  const [mobileTab, setMobileTab] = React.useState<"EDITOR" | "PREVIEW">("EDITOR");
  const [showStylePanel, setShowStylePanel] = React.useState(true);
  const [customColorPicker, setCustomColorPicker] = React.useState(false);
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);

  // Collapsible Left Customizer Panel
  const [isCustomizerCollapsed, setIsCustomizerCollapsed] = React.useState(false);

  // Responsive A4 Preview Zoom & Fit
  const previewContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [zoomScale, setZoomScale] = React.useState<number>(0.82);
  const [zoomMode, setZoomMode] = React.useState<"fit" | "custom">("fit");

  React.useEffect(() => {
    const handleResize = () => {
      if (zoomMode === "fit" && previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        if (containerWidth > 0) {
          // Standard A4 sheet (794px) + comfortable 40px studio padding
          const ideal = Math.min(1.0, Math.max(0.45, (containerWidth - 40) / 794));
          setZoomScale(Number(ideal.toFixed(2)));
        }
      }
    };
    handleResize();
    const timer = setTimeout(handleResize, 200);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [zoomMode, isCustomizerCollapsed]);

  // Draft inputs
  const [newEquipmentDraft, setNewEquipmentDraft] = React.useState("");
  const [newCertDraft, setNewCertDraft] = React.useState("");
  const [newLangDraft, setNewLangDraft] = React.useState("");
  const [newContactLabel, setNewContactLabel] = React.useState("");
  const [newContactUrl, setNewContactUrl] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const currentSectionIndex = SECTION_OPTIONS.findIndex((s) => s.key === activeEditorTab);

  // Handle image upload and convert to base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification({
        type: "warning",
        title: "Invalid File Format",
        message: "Please select an image file (JPEG, PNG, WebP).",
      });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showNotification({
        type: "warning",
        title: "File Size Too Large",
        message: "Image must be under 3MB in size.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateResume({
        photoUrl: dataUrl,
        showPhoto: true,
      });
      showNotification({
        type: "success",
        title: "Passport Photo Attached",
        message: "Your passport photo was added to the top right of the resume.",
      });
    };
    reader.readAsDataURL(file);
  };

  const signatureInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification({
        type: "warning",
        title: "Invalid Format",
        message: "Please select an image file (PNG, JPEG, WebP).",
      });
      return;
    }

    // Maximum file size: 200KB
    if (file.size > 200 * 1024) {
      showNotification({
        type: "warning",
        title: "File Size Too Large",
        message: "Signature image must be under 200KB. (Recommended: 150x80 px).",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Optimize / scale image to fit within 150x80 px while preserving transparency
        const maxW = 150;
        const maxH = 80;
        let width = img.width;
        let height = img.height;

        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataUrl = canvas.toDataURL("image/png");
          updateResume({
            signature: {
              ...(resume.signature || DEFAULT_RESUME.signature),
              imageUrl: resizedDataUrl,
              enabled: true,
            },
          });
        } else {
          updateResume({
            signature: {
              ...(resume.signature || DEFAULT_RESUME.signature),
              imageUrl: dataUrl,
              enabled: true,
            },
          });
        }

        showNotification({
          type: "success",
          title: "Signature Attached",
          message: "150x80 px signature image attached successfully.",
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Direct High-Resolution A4 PDF File Export (Zero notifications)
  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);

    // If mobile viewport is viewing editor, temporarily switch to preview so DOM element is mounted
    if (mobileTab !== "PREVIEW") {
      setMobileTab("PREVIEW");
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    const sanitizedName = resume.fullName.replace(/[^a-zA-Z0-9_-]/g, "_") || "Clinical";
    const fileName = `${sanitizedName}_Clinical_Resume.pdf`;

    try {
      await exportResumeToPdf({
        elementId: "resume-document",
        fileName,
      });
      logActivity({
        action: "DOWNLOAD",
        module: "Resume Maker",
        details: `Exported clinical A4 PDF resume for ${resume.fullName}`,
      });
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setTimeout(() => {
        setIsExportingPdf(false);
      }, 500);
    }
  };

  // Print & System PDF Export via Isolated Print Engine (Zero notifications, exact 1-page A4)
  const handlePrint = () => {
    logActivity({
      action: "DOWNLOAD",
      module: "Resume Maker",
      details: `Printed clinical resume for ${resume.fullName}`,
    });

    const sanitizedName = resume.fullName.replace(/[^a-zA-Z0-9_-]/g, "_") || "Clinical";
    const docTitle = `${sanitizedName}_Clinical_Resume`;

    // Switch to preview on mobile so the element exists in DOM
    if (mobileTab !== "PREVIEW") {
      setMobileTab("PREVIEW");
    }

    setTimeout(() => {
      printResumeDocument("resume-document", docTitle);
    }, 100);
  };

  const renderSectionHeadingEditor = (secKey: ResumeSectionKey) => {
    const currentHeading = resume.sectionHeadings?.[secKey] || DEFAULT_SECTION_HEADINGS[secKey];
    const isHidden = (resume.hiddenSections || []).includes(secKey);

    return (
      <div className="p-3 bg-muted/40 rounded-xl border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-primary shrink-0" />
          <div>
            <div className="font-semibold text-foreground text-xs flex items-center gap-2">
              <span>Section Heading on PDF / Resume</span>
              <span
                className={cn(
                  "text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase",
                  !isHidden
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                )}
              >
                {!isHidden ? "Visible" : "Hidden"}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground">Custom title and visibility state on your document sheet</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Input
            value={currentHeading}
            onChange={(e) => updateSectionHeading(secKey, e.target.value)}
            className="h-8 text-xs font-semibold bg-background max-w-full sm:max-w-[200px]"
            placeholder="Custom Section Heading"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => updateSectionHeading(secKey, DEFAULT_SECTION_HEADINGS[secKey])}
            className="h-8 px-2 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
            title="Reset to standard heading"
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => toggleSectionVisibility(secKey)}
            className={cn(
              "h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0",
              !isHidden
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                : "bg-muted text-muted-foreground hover:text-foreground border border-border/70"
            )}
            title={!isHidden ? "Turn OFF section (hide from resume)" : "Turn ON section (show on resume)"}
          >
            {!isHidden ? (
              <>
                <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold">ON</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-bold">OFF</span>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Skill Add / Remove
  const addSkill = () => {
    const newSkill: ResumeSkill = {
      id: `sk-${Date.now()}`,
      name: "New Laboratory Technique / Assay",
      category: "Clinical Pathology",
      proficiency: "Advanced",
    };
    updateResume({ skills: [...resume.skills, newSkill] });
  };

  const removeSkill = (id: string) => {
    updateResume({ skills: resume.skills.filter((s) => s.id !== id) });
  };

  // Education Add / Remove / Reorder
  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`,
      degree: "Diploma in Medical Laboratory Technology (DMT)",
      institute: "Institute of Health Technology (IHT)",
      yearOfPassing: "2024",
      result: "GPA 4.80 / 5.00",
    };
    updateResume({ education: [...resume.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    updateResume({ education: resume.education.filter((e) => e.id !== id) });
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    const list = [...resume.education];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateResume({ education: list });
  };

  // Rotation Add / Remove / Reorder
  const addRotation = () => {
    const newExp: ResumeExperience = {
      id: `rot-${Date.now()}`,
      role: "Clinical Trainee Technologist",
      organization: "District Sadar Hospital / Medical College Central Lab",
      period: "6 Months Clinical Internship",
      location: "Dhaka, Bangladesh",
      responsibilities: [
        "Collected venous blood samples following strict aseptic phlebotomy guidelines.",
        "Performed routine automated hematology analysis and verified differential blood smears.",
      ],
    };
    updateResume({ rotations: [...resume.rotations, newExp] });
  };

  const removeRotation = (id: string) => {
    updateResume({ rotations: resume.rotations.filter((r) => r.id !== id) });
  };

  const moveRotation = (index: number, direction: "up" | "down") => {
    const list = [...resume.rotations];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateResume({ rotations: list });
  };

  // Responsibility bullet CRUD within rotation
  const addResponsibilityBullet = (rotIndex: number) => {
    const updated = [...resume.rotations];
    updated[rotIndex] = {
      ...updated[rotIndex],
      responsibilities: [...updated[rotIndex].responsibilities, "New clinical laboratory responsibility..."],
    };
    updateResume({ rotations: updated });
  };

  const updateResponsibilityBullet = (rotIndex: number, bulletIndex: number, text: string) => {
    const updated = [...resume.rotations];
    const newBullets = [...updated[rotIndex].responsibilities];
    newBullets[bulletIndex] = text;
    updated[rotIndex] = { ...updated[rotIndex], responsibilities: newBullets };
    updateResume({ rotations: updated });
  };

  const removeResponsibilityBullet = (rotIndex: number, bulletIndex: number) => {
    const updated = [...resume.rotations];
    const newBullets = updated[rotIndex].responsibilities.filter((_, i) => i !== bulletIndex);
    updated[rotIndex] = { ...updated[rotIndex], responsibilities: newBullets };
    updateResume({ rotations: updated });
  };

  // Equipment Proficiencies CRUD
  const addEquipment = () => {
    const trimmed = newEquipmentDraft.trim();
    if (!trimmed) return;
    updateResume({ equipmentProficiencies: [...resume.equipmentProficiencies, trimmed] });
    setNewEquipmentDraft("");
  };

  const removeEquipment = (index: number) => {
    updateResume({
      equipmentProficiencies: resume.equipmentProficiencies.filter((_, i) => i !== index),
    });
  };

  // Certifications CRUD
  const addCertification = () => {
    const trimmed = newCertDraft.trim();
    if (!trimmed) return;
    updateResume({ certifications: [...resume.certifications, trimmed] });
    setNewCertDraft("");
  };

  const removeCertification = (index: number) => {
    updateResume({
      certifications: resume.certifications.filter((_, i) => i !== index),
    });
  };

  // Languages CRUD
  const addLanguage = () => {
    const trimmed = newLangDraft.trim();
    if (!trimmed) return;
    updateResume({ languages: [...resume.languages, trimmed] });
    setNewLangDraft("");
  };

  const removeLanguage = (index: number) => {
    updateResume({
      languages: resume.languages.filter((_, i) => i !== index),
    });
  };

  // Custom Contact Links CRUD
  const addContactLink = () => {
    if (!newContactLabel.trim() || !newContactUrl.trim()) return;
    const newLink: ResumeContactLink = {
      id: `cl-${Date.now()}`,
      label: newContactLabel.trim(),
      url: newContactUrl.trim(),
    };
    updateResume({ contactLinks: [...(resume.contactLinks || []), newLink] });
    setNewContactLabel("");
    setNewContactUrl("");
  };

  const removeContactLink = (id: string) => {
    updateResume({
      contactLinks: (resume.contactLinks || []).filter((l) => l.id !== id),
    });
  };

  // Custom Sections CRUD
  const addCustomSection = () => {
    const newSection: ResumeCustomSection = {
      id: `cs-${Date.now()}`,
      title: "Research Projects & Publications",
      items: [
        {
          id: `csi-${Date.now()}`,
          title: "Title of Paper, Case Study, or Clinical Project",
          subtitle: "Department of Medical Technology",
          date: "2024",
          description: "Key findings, analytical methodologies, and clinical outcomes.",
        },
      ],
    };
    updateResume({ customSections: [...(resume.customSections || []), newSection] });
  };

  const removeCustomSection = (sectionId: string) => {
    updateResume({
      customSections: (resume.customSections || []).filter((s) => s.id !== sectionId),
    });
  };

  const addCustomSectionItem = (sectionId: string) => {
    const updated = (resume.customSections || []).map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: [
          ...sec.items,
          {
            id: `csi-${Date.now()}`,
            title: "New Project / Workshop / Award",
            subtitle: "Institution / Organization",
            date: "2024",
            description: "Description of accomplishment and diagnostic significance.",
          },
        ],
      };
    });
    updateResume({ customSections: updated });
  };

  const removeCustomSectionItem = (sectionId: string, itemId: string) => {
    const updated = (resume.customSections || []).map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.filter((item) => item.id !== itemId),
      };
    });
    updateResume({ customSections: updated });
  };

  // Active theme variables
  const primaryColor = resume.primaryColor || "#059669";
  const accentColor = resume.accentColor || "#0284c7";
  const activeFontFamily = resume.fontFamily || "sans";
  const activeFontSize = resume.fontSize || "base";
  const activeSpacing = resume.sectionSpacing || "normal";

  const fontConfig = RESUME_FONT_FAMILIES[activeFontFamily] || RESUME_FONT_FAMILIES.sans;
  const activeFontFamilyCSS = fontConfig.fontFamilyCSS;

  const fontClass =
    activeFontFamily === "serif" || activeFontFamily === "playfair"
      ? "font-serif"
      : activeFontFamily === "mono"
      ? "font-mono"
      : activeFontFamily === "inter"
      ? "font-inter"
      : "font-sans";

  const fontSizeClass =
    activeFontSize === "sm" ? "text-xs" : activeFontSize === "lg" ? "text-sm" : "text-xs sm:text-[13px]";

  const spacingClass =
    activeSpacing === "compact" ? "space-y-2" : activeSpacing === "spacious" ? "space-y-4" : "space-y-3";

  // Reusable Passport Photo Component
  const renderPassportPhoto = (sizeClass = "h-28 w-24") => {
    if (!resume.showPhoto || !resume.photoUrl) return null;
    const isCircle = resume.photoShape === "circle";
    return (
      <div className="shrink-0 print-avoid-break">
        <img
          src={resume.photoUrl}
          alt={resume.fullName}
          className={cn(
            "object-cover shadow-2xs border-2 bg-slate-100",
            isCircle ? "rounded-full h-24 w-24" : "rounded-xl",
            sizeClass
          )}
          style={{ borderColor: primaryColor }}
        />
      </div>
    );
  };

  // Reusable Applicant Signature Block Component (Bottom Right)
  const renderSignatureBlock = () => {
    if (!resume.signature?.enabled) return null;
    const sig = resume.signature;
    const name = sig.signatoryName || resume.fullName;
    return (
      <div className="pt-4 flex justify-end print-avoid-break mt-auto">
        <div className="min-w-[170px] max-w-[220px] text-center flex flex-col items-center">
          {sig.imageUrl ? (
            <div className="h-[60px] w-full flex items-end justify-center pb-1">
              <img
                src={sig.imageUrl}
                alt="Signature"
                className="max-h-[55px] max-w-[150px] object-contain"
              />
            </div>
          ) : (
            <div className="h-[45px] w-full" />
          )}
          <div className="w-full border-t border-slate-700 pt-1 text-center space-y-0.5">
            <p className="text-[10.5px] sm:text-[11px] font-bold text-slate-900 leading-tight">
              ({name})
            </p>
            <p className="text-[10px] sm:text-[10.5px] text-slate-700 font-medium leading-tight">
              Signature
            </p>
            <p className="text-[9.5px] sm:text-[10px] text-slate-600 font-normal leading-tight">
              Date: {sig.date || "15 November, 2026"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Reusable Section Heading Component with Dynamic Dividers (ON/OFF & Multiple Styles)
  const renderSectionHeading = (title: string, rightExtra?: React.ReactNode) => {
    const showDividers = resume.showDividers ?? true;
    const dividerStyle = resume.dividerStyle || "solid";

    return (
      <div className="space-y-1 mb-1 print-avoid-break">
        <div className="flex items-center justify-between">
          <h2
            className="text-xs sm:text-[13px] font-bold uppercase tracking-wider leading-snug"
            style={{ color: primaryColor }}
          >
            {title}
          </h2>
          {rightExtra}
        </div>
        {showDividers && dividerStyle !== "none" && (
          <div className="w-full">
            {dividerStyle === "solid" && (
              <div className="w-full border-b-[1.5px]" style={{ borderColor: `${primaryColor}40` }} />
            )}
            {dividerStyle === "thick" && (
              <div className="w-full h-[2.5px] rounded-full" style={{ backgroundColor: primaryColor }} />
            )}
            {dividerStyle === "double" && (
              <div className="w-full border-b-[3px] border-double" style={{ borderColor: `${primaryColor}65` }} />
            )}
            {dividerStyle === "dashed" && (
              <div className="w-full border-b-[1.5px] border-dashed" style={{ borderColor: `${primaryColor}55` }} />
            )}
            {dividerStyle === "dotted" && (
              <div className="w-full border-b-2 border-dotted" style={{ borderColor: `${primaryColor}60` }} />
            )}
            {dividerStyle === "gradient" && (
              <div
                className="w-full h-[2px] rounded-full"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}25, transparent)`,
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  // Render individual section block dynamically according to user custom drag-and-drop arrangement
  const renderSingleColumnSection = (secKey: ResumeSectionKey) => {
    if (resume.hiddenSections?.includes(secKey)) return null;

    const heading = resume.sectionHeadings?.[secKey] || DEFAULT_SECTION_HEADINGS[secKey];

    switch (secKey) {
      case "summary":
        return (
          <div key="summary" className="space-y-1.5 print-avoid-break overflow-visible">
            {renderSectionHeading(heading)}
            <p className="leading-relaxed text-slate-700 text-xs sm:text-[12px]">
              {resume.summary}
            </p>
          </div>
        );

      case "skills":
        return (
          <div key="skills" className="space-y-1.5 print-avoid-break overflow-visible">
            {renderSectionHeading(heading)}
            <div
              className={cn(
                "grid gap-2 overflow-visible",
                resume.theme === "COMPACT_DIAGNOSTIC" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
              )}
            >
              {resume.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-1.5 px-2 rounded-lg bg-slate-50 border border-slate-200/90 flex items-start justify-between gap-2 overflow-visible h-full"
                >
                  <div className="min-w-0 flex-1 overflow-visible">
                    <span className="font-semibold text-slate-900 block text-xs leading-normal py-0.5">
                      {skill.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block leading-normal">{skill.category}</span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border whitespace-nowrap mt-0.5"
                    style={{
                      color: primaryColor,
                      backgroundColor: `${primaryColor}12`,
                      borderColor: `${primaryColor}35`,
                    }}
                  >
                    {skill.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "experience":
        return (
          <div key="experience" className="space-y-1.5 print-avoid-break overflow-visible">
            {renderSectionHeading(heading)}
            <div
              className={cn(
                "space-y-2",
                resume.theme === "CLINICAL_TIMELINE" ? "border-l-2 pl-3.5 ml-1 space-y-2" : ""
              )}
              style={resume.theme === "CLINICAL_TIMELINE" ? { borderColor: primaryColor } : undefined}
            >
              {resume.rotations.map((rot) => (
                <div key={rot.id} className="relative space-y-0.5 overflow-visible">
                  {resume.theme === "CLINICAL_TIMELINE" && (
                    <div
                      className="absolute -left-[20px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white shadow-2xs"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                  <div className="flex items-start justify-between gap-3 text-xs sm:text-[12.5px] leading-snug">
                    <span className="font-bold text-slate-900">{rot.role}</span>
                    <span className="text-[11px] font-medium text-slate-500 shrink-0 text-right">{rot.period}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600 font-medium leading-snug">
                    <span>{rot.organization}</span>
                    {rot.location && <span className="text-slate-500">{rot.location}</span>}
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 text-xs leading-relaxed pt-0.5">
                    {rot.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case "equipment":
        if (!resume.equipmentProficiencies || resume.equipmentProficiencies.length === 0) return null;
        return (
          <div key="equipment" className="space-y-1.5 print-avoid-break overflow-visible">
            {renderSectionHeading(heading)}
            <div className="flex flex-wrap gap-1.5 pt-0.5 overflow-visible">
              {resume.equipmentProficiencies.map((equip, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                >
                  {equip}
                </span>
              ))}
            </div>
          </div>
        );

      case "education":
        return (
          <div key="education" className="space-y-1.5 print-avoid-break overflow-visible">
            {renderSectionHeading(heading)}
            <div className="w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-700/80">
              <table className="w-full border-collapse text-left text-xs sm:text-[11px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/80 font-bold text-slate-700 dark:text-slate-200">
                    <th className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-700/80">
                      Exam Name and Institute
                    </th>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-200 dark:border-slate-700/80 whitespace-nowrap w-28 sm:w-36">
                      Passing Year
                    </th>
                    <th className="py-1.5 px-2.5 text-center whitespace-nowrap w-24 sm:w-32">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80 bg-white dark:bg-slate-900/30">
                  {resume.education.map((edu) => (
                    <tr key={edu.id} className="align-top">
                      <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-700/80">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block leading-snug">
                          {edu.degree}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 block text-[10.5px] leading-snug">
                          {edu.institute}
                        </span>
                      </td>
                      <td className="py-1.5 px-2.5 text-center text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium border-r border-slate-200 dark:border-slate-700/80">
                        {edu.yearOfPassing}
                      </td>
                      <td className="py-1.5 px-2.5 text-center font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {edu.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "personal":
        if (!resume.personalDetails) return null;
        return (
          <div key="personal" className="space-y-1 print-avoid-break overflow-visible">
            {renderSectionHeading(heading)}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-[11px] leading-snug pt-0.5">
              <div className="flex items-baseline">
                <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Full Name</span>
                <span className="text-slate-400 mr-1.5">:</span>
                <span className="text-slate-800 font-semibold truncate">
                  {resume.personalDetails.fullName || resume.fullName}
                </span>
              </div>
              {resume.personalDetails.fatherName && (
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Father&apos;s Name</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-semibold truncate">{resume.personalDetails.fatherName}</span>
                </div>
              )}
              {resume.personalDetails.motherName && (
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Mother&apos;s Name</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-semibold truncate">{resume.personalDetails.motherName}</span>
                </div>
              )}
              {resume.personalDetails.dateOfBirth && (
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Date of Birth</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-semibold">{resume.personalDetails.dateOfBirth}</span>
                </div>
              )}
              {resume.personalDetails.nid && (
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">National ID (NID)</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-semibold font-mono text-[10.5px]">{resume.personalDetails.nid}</span>
                </div>
              )}
              {resume.personalDetails.gender && (
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Gender</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-semibold">{resume.personalDetails.gender}</span>
                </div>
              )}
              {resume.personalDetails.maritalStatus && (
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Marital Status</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-semibold">{resume.personalDetails.maritalStatus}</span>
                </div>
              )}
              {resume.personalDetails.nationality && (
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Nationality</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-semibold">{resume.personalDetails.nationality}</span>
                </div>
              )}
              {resume.personalDetails.bloodGroup && (
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Blood Group</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-bold" style={{ color: primaryColor }}>
                    {resume.personalDetails.bloodGroup}
                  </span>
                </div>
              )}
              {resume.personalDetails.presentAddress && (
                <div className="col-span-2 flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Present Address</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-normal">{resume.personalDetails.presentAddress}</span>
                </div>
              )}
              {resume.personalDetails.permanentAddress && (
                <div className="col-span-2 flex items-baseline">
                  <span className="w-24 sm:w-28 text-slate-500 font-medium shrink-0">Permanent Address</span>
                  <span className="text-slate-400 mr-1.5">:</span>
                  <span className="text-slate-800 font-normal">{resume.personalDetails.permanentAddress}</span>
                </div>
              )}
            </div>
          </div>
        );

      case "certs":
        if (!resume.certifications || resume.certifications.length === 0) return null;
        return (
          <div key="certs" className="space-y-1.5 print-avoid-break overflow-visible">
            {renderSectionHeading(heading)}
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 text-xs leading-relaxed">
              {resume.certifications.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </div>
        );

      case "languages":
        if (!resume.languages || resume.languages.length === 0) return null;
        return (
          <div key="languages" className="space-y-1.5 print-avoid-break overflow-visible">
            {renderSectionHeading(heading)}
            <div className="flex flex-wrap gap-2 text-xs text-slate-700 pt-0.5 overflow-visible">
              {resume.languages.map((lang, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-medium">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        );

      case "custom":
        if (!resume.customSections || resume.customSections.length === 0) return null;
        return (
          <div key="custom" className="space-y-2 print-avoid-break overflow-visible">
            {resume.customSections.map((sec) => (
              <div key={sec.id} className="space-y-1.5 overflow-visible">
                {renderSectionHeading(sec.title)}
                <div className="space-y-2 overflow-visible">
                  {sec.items.map((it) => (
                    <div key={it.id} className="space-y-0.5 overflow-visible">
                      <div className="flex items-center justify-between font-bold text-slate-900 text-xs leading-snug">
                        <span>{it.title}</span>
                        {it.date && <span className="text-xs font-normal text-slate-500">{it.date}</span>}
                      </div>
                      {it.subtitle && <div className="text-xs text-slate-600 font-medium leading-snug">{it.subtitle}</div>}
                      {it.description && <p className="text-slate-700 leading-relaxed text-xs">{it.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header - Hidden on Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Dynamic Resume Maker
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Create, customize, and export your professional 1-page resume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Collapse / Expand Customizer Panel */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCustomizerCollapsed((prev) => !prev)}
            className="text-xs gap-1.5 h-9 rounded-xl border-border hover:bg-muted font-medium cursor-pointer"
            title={isCustomizerCollapsed ? "Open customizer panel" : "Collapse customizer to view full resume"}
          >
            {isCustomizerCollapsed ? (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-primary" />
                <span>Show Customizer</span>
              </>
            ) : (
              <>
                <ChevronLeft className="h-3.5 w-3.5 text-primary" />
                <span>Collapse Customizer</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Reset resume to standard clinical template defaults? All custom changes will be reset.")) {
                resetResume();
              }
            }}
            className="text-xs gap-1.5 h-9 rounded-xl border-border hover:bg-muted cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>


          <Button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="text-xs gap-1.5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all disabled:opacity-75"
          >
            {isExportingPdf ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isExportingPdf ? "Exporting PDF..." : "Export PDF"}</span>
          </Button>
        </div>
      </div>

      {/* Mobile Screen Toggle: Editor vs Preview */}
      <div className="flex lg:hidden items-center p-1 bg-muted/80 rounded-xl border border-border print:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("EDITOR")}
          className={cn(
            "flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer",
            mobileTab === "EDITOR"
              ? "bg-card text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Resume Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("PREVIEW")}
          className={cn(
            "flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer",
            mobileTab === "PREVIEW"
              ? "bg-card text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Live CV Preview
        </button>
      </div>

      {/* MAIN BUILDER GRID: Editor & Controls on Left & Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: RESUME BUILDER & CONTROLS (Hidden when collapsed or on print) */}
        {!isCustomizerCollapsed && (
          <div
            className={cn(
              "lg:col-span-5 space-y-4 print:hidden",
              mobileTab === "PREVIEW" ? "hidden lg:block" : "block"
            )}
          >
          {/* Collapsible Panel Control Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/70 dark:bg-muted/30 rounded-2xl border border-border/70 text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-semibold text-foreground">Customizer Panel</span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCustomizerCollapsed(true)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-background/80 cursor-pointer gap-1"
              title="Collapse customizer to view full preview"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-primary" />
              <span>Collapse</span>
            </Button>
          </div>

          {/* 1. ADVANCED DESIGN & STYLING CONTROLS */}
          <Card className="border-border shadow-xs p-4 rounded-2xl bg-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Palette className="h-4 w-4 text-primary" />
                Resume Layout &amp; Theme Styling
              </span>
              <button
                type="button"
                onClick={() => setShowStylePanel(!showStylePanel)}
                className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>{showStylePanel ? "Hide Styling" : "Show Styling"}</span>
                {showStylePanel ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            {showStylePanel && (
              <div className="space-y-4 pt-1 text-xs animate-in fade-in">
                {/* A. Layout Theme Dropdown / Grid */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center justify-between">
                    <span>Layout Theme Template</span>
                    <span className="text-[11px] font-normal text-muted-foreground">
                      {THEME_OPTIONS.find((t) => t.id === resume.theme)?.tag || "Clinical"}
                    </span>
                  </label>
                  <select
                    value={resume.theme}
                    onChange={(e) => updateResume({ theme: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground cursor-pointer focus:ring-2 focus:ring-primary/20"
                  >
                    {THEME_OPTIONS.map((th) => (
                      <option key={th.id} value={th.id}>
                        {th.name} ({th.tag})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {THEME_OPTIONS.find((t) => t.id === resume.theme)?.description}
                  </p>
                </div>

                {/* B. Typography & Font Family Selector */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/70">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground flex items-center gap-1">
                      <Type className="h-3.5 w-3.5 text-primary" />
                      <span>Typography Font</span>
                    </label>
                    <select
                      value={resume.fontFamily || "sans"}
                      onChange={(e) => updateResume({ fontFamily: e.target.value as any })}
                      className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground cursor-pointer"
                    >
                      {Object.values(RESUME_FONT_FAMILIES).map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground flex items-center gap-1">
                      <Sliders className="h-3.5 w-3.5 text-primary" />
                      <span>Font Sizing Scale</span>
                    </label>
                    <select
                      value={resume.fontSize || "base"}
                      onChange={(e) => updateResume({ fontSize: e.target.value as any })}
                      className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground cursor-pointer"
                    >
                      <option value="sm">Compact (9.5pt - Fit 1 Page)</option>
                      <option value="base">Standard (10.5pt - Balanced)</option>
                      <option value="lg">Spacious (11.5pt - Executive)</option>
                    </select>
                  </div>
                </div>

                {/* C. Color Palette Presets + Custom Color Picker */}
                <div className="space-y-2 pt-1 border-t border-border/70">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-foreground">Color Palette &amp; Accents</label>
                    <button
                      type="button"
                      onClick={() => setCustomColorPicker(!customColorPicker)}
                      className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                    >
                      {customColorPicker ? "Preset Palettes" : "Custom Hex Picker"}
                    </button>
                  </div>

                  {/* Preset Swatches */}
                  {!customColorPicker ? (
                    <div className="grid grid-cols-4 gap-1.5">
                      {COLOR_PRESETS.map((preset) => {
                        const isSelected = resume.primaryColor === preset.primary;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() =>
                              updateResume({
                                primaryColor: preset.primary,
                                accentColor: preset.accent,
                              })
                            }
                            className={cn(
                              "p-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                              isSelected
                                ? "border-foreground/40 bg-muted font-bold shadow-2xs"
                                : "border-border/70 bg-card hover:bg-muted/50 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center space-x-1">
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-2xs shrink-0"
                                style={{ backgroundColor: preset.primary }}
                              />
                              <span
                                className="h-2.5 w-2.5 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: preset.accent }}
                              />
                            </div>
                            <span className="text-[10px] truncate max-w-full leading-tight">{preset.label.split(" ")[1] || preset.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Custom Color Pickers */
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-foreground block">Primary Accent</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={resume.primaryColor || "#059669"}
                            onChange={(e) => updateResume({ primaryColor: e.target.value })}
                            className="h-8 w-10 p-0 border border-border rounded-lg cursor-pointer bg-transparent"
                          />
                          <Input
                            value={resume.primaryColor || "#059669"}
                            onChange={(e) => updateResume({ primaryColor: e.target.value })}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-foreground block">Secondary Accent</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={resume.accentColor || "#0284c7"}
                            onChange={(e) => updateResume({ accentColor: e.target.value })}
                            className="h-8 w-10 p-0 border border-border rounded-lg cursor-pointer bg-transparent"
                          />
                          <Input
                            value={resume.accentColor || "#0284c7"}
                            onChange={(e) => updateResume({ accentColor: e.target.value })}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* D. Spacing & Density */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/70">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Section Density</label>
                    <select
                      value={resume.sectionSpacing || "normal"}
                      onChange={(e) => updateResume({ sectionSpacing: e.target.value as any })}
                      className="w-full h-8 px-2.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground cursor-pointer"
                    >
                      <option value="compact">Compact (Tighter Margins)</option>
                      <option value="normal">Normal (Standard)</option>
                      <option value="spacious">Spacious (Relaxed)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Header Alignment</label>
                    <select
                      value={resume.headerStyle || "standard"}
                      onChange={(e) => updateResume({ headerStyle: e.target.value as any })}
                      className="w-full h-8 px-2.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground cursor-pointer"
                    >
                      <option value="standard">Left Aligned</option>
                      <option value="centered">Centered (Academic)</option>
                      <option value="banner">Solid Banner Block</option>
                    </select>
                  </div>
                </div>

                {/* E. Section Dividers & Line Styles */}
                <div className="pt-2.5 border-t border-border/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-semibold text-foreground text-xs block">Section Dividers</label>
                      <span className="text-[11px] text-muted-foreground block">Heading line separator</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateResume({ showDividers: !(resume.showDividers ?? true) })}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5",
                        (resume.showDividers ?? true)
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-muted text-muted-foreground border-border hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          (resume.showDividers ?? true) ? "bg-white" : "bg-muted-foreground"
                        )}
                      />
                      {(resume.showDividers ?? true) ? "Dividers ON" : "Dividers OFF"}
                    </button>
                  </div>

                  {(resume.showDividers ?? true) && (
                    <div className="space-y-1.5 pt-0.5">
                      <label className="text-[11px] font-medium text-muted-foreground block">Divider Line Style</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: "solid", label: "Solid Line", preview: "border-b-[1.5px] border-foreground/60" },
                          { id: "thick", label: "Accent Bar", preview: "h-[3px] bg-primary rounded-full" },
                          { id: "gradient", label: "Gradient", preview: "h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-full" },
                          { id: "double", label: "Double Line", preview: "border-b-[3px] border-double border-foreground/70" },
                          { id: "dashed", label: "Dashed Line", preview: "border-b-[1.5px] border-dashed border-foreground/60" },
                          { id: "dotted", label: "Dotted Line", preview: "border-b-2 border-dotted border-foreground/60" },
                        ].map((st) => {
                          const isSelected = (resume.dividerStyle || "solid") === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => updateResume({ dividerStyle: st.id as any })}
                              className={cn(
                                "p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2",
                                isSelected
                                  ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/40"
                                  : "bg-card hover:bg-muted/60 border-border/70 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <span
                                className={cn(
                                  "text-[11px] leading-tight",
                                  isSelected ? "text-primary font-bold" : "text-foreground font-medium"
                                )}
                              >
                                {st.label}
                              </span>
                              <div className="w-full py-0.5">
                                <div className={cn("w-full", st.preview)} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* 2. SECTION DROPDOWN & DRAG-AND-DROP ARRANGEMENT SELECTOR */}
          <Card className="border-border shadow-xs p-4 rounded-2xl bg-card space-y-3.5">
            {/* Mode Switcher: Edit vs Drag & Arrange */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/70 text-xs">
              <button
                type="button"
                onClick={() => setSelectorMode("SELECT")}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  selectorMode === "SELECT"
                    ? "bg-card text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Edit Section Inputs</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectorMode("REORDER")}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  selectorMode === "REORDER"
                    ? "bg-card text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <GripIcon className="h-3.5 w-3.5 text-primary" />
                <span>Drag &amp; Arrange Sections</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                  Drag
                </span>
              </button>
            </div>

            {/* A. SELECT MODE: DROPDOWN SELECTOR */}
            {selectorMode === "SELECT" ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-primary" />
                    <span>Select Section to Edit</span>
                  </label>
                  <div className="flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={currentSectionIndex === 0}
                      onClick={() => setActiveEditorTab(SECTION_OPTIONS[currentSectionIndex - 1].key)}
                      className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Previous Section"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-[11px] font-mono text-muted-foreground px-1">
                      {currentSectionIndex + 1} / {SECTION_OPTIONS.length}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={currentSectionIndex === SECTION_OPTIONS.length - 1}
                      onClick={() => setActiveEditorTab(SECTION_OPTIONS[currentSectionIndex + 1].key)}
                      className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Next Section"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Main Dropdown Select Component */}
                <div className="relative">
                  <select
                    value={activeEditorTab}
                    onChange={(e) => setActiveEditorTab(e.target.value as any)}
                    className="w-full h-11 px-3.5 py-2 rounded-xl border border-border bg-background text-foreground font-semibold text-xs shadow-2xs focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-10 transition-all"
                  >
                    {SECTION_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.icon} {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ) : (
              /* B. REORDER MODE: DRAG & DROP ARRANGEMENT LIST */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <GripIcon className="h-4 w-4 text-primary" />
                      <span>Drag to Change Section Arrangement</span>
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Drag cards or use arrows to reorganize order on the 1-page PDF.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => reorderSections(DEFAULT_SECTION_ORDER)}
                    className="text-[10.5px] h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    <span>Reset Order</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  {/* Fixed Header Row */}
                  <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-5 text-center">Top</span>
                        <span className="text-base">👤</span>
                        <div>
                          <div className="font-semibold text-xs text-foreground">Candidate Identity, Header &amp; Photo</div>
                          <div className="text-[10px] text-muted-foreground">Fixed document header at the top of the resume</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                          Always Active
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveEditorTab("CONTACT");
                            setSelectorMode("SELECT");
                          }}
                          className="text-xs h-7 px-3 font-medium border-border hover:bg-muted cursor-pointer rounded-lg text-primary hover:text-primary"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Draggable Movable Sections */}
                  {activeSectionOrder.map((secKey, index) => {
                    const meta = SECTION_METADATA[secKey];
                    const heading = resume.sectionHeadings?.[secKey] || DEFAULT_SECTION_HEADINGS[secKey];
                    const isDragging = draggedIndex === index;
                    const isOver = dragOverIndex === index;
                    const isHidden = (resume.hiddenSections || []).includes(secKey);
                    const itemCount = meta.getCount(resume);

                    return (
                      <div
                        key={secKey}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "p-3 rounded-xl border transition-all select-none bg-card space-y-2.5",
                          isDragging
                            ? "opacity-40 border-dashed border-primary scale-[0.98]"
                            : isHidden
                            ? "opacity-65 border-dashed bg-muted/20 border-border/80"
                            : "opacity-100 border-border hover:border-primary/40",
                          isOver ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "",
                          "shadow-2xs"
                        )}
                      >
                        {/* Row 1: Drag handle, #Index, Icon, Section Name, ON/OFF Toggle, Up/Down */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div
                              className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground shrink-0 rounded hover:bg-muted"
                              title="Drag to reorder section"
                            >
                              <GripIcon className="h-4 w-4" />
                            </div>

                            <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                              #{index + 1}
                            </span>

                            <span className="text-base shrink-0">{meta.icon}</span>

                            <div className="min-w-0 flex-1">
                              <span
                                className={cn(
                                  "font-bold text-xs text-foreground block truncate",
                                  isHidden && "text-muted-foreground line-through decoration-muted-foreground/40"
                                )}
                              >
                                {heading}
                              </span>
                            </div>
                          </div>

                          {/* Right controls: ON/OFF Toggle Pill + Up / Down Reorder */}
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSectionVisibility(secKey);
                              }}
                              className={cn(
                                "h-6 px-2.5 rounded-full text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer border",
                                !isHidden
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                                  : "bg-muted text-muted-foreground border-border/70 hover:bg-muted/80"
                              )}
                              title={!isHidden ? "Click to turn OFF (hide from resume)" : "Click to turn ON (show on resume)"}
                            >
                              {!isHidden ? (
                                <>
                                  <Eye className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>Visible</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                                  <span>Hidden</span>
                                </>
                              )}
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={index === 0}
                              onClick={() => moveSection(index, "up")}
                              className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-25"
                              title="Move Up"
                            >
                              <MoveUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={index === activeSectionOrder.length - 1}
                              onClick={() => moveSection(index, "down")}
                              className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-25"
                              title="Move Down"
                            >
                              <MoveDown className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Row 2: Editable Heading Input (Full Width!) + Items Count + Edit Button */}
                        <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                          <div className="flex-1 min-w-0">
                            <Input
                              value={heading}
                              onChange={(e) => updateSectionHeading(secKey, e.target.value)}
                              className={cn(
                                "h-7 text-xs bg-muted/40 hover:bg-background focus:bg-background px-2 py-0.5 rounded-lg border-border/60 transition-colors w-full font-medium",
                                isHidden && "text-muted-foreground"
                              )}
                              title="Edit section heading on PDF / Resume"
                              placeholder="Section Heading"
                            />
                          </div>

                          <span className="text-[10.5px] bg-muted/70 px-2 py-1 rounded-md text-muted-foreground shrink-0 border border-border/50 font-medium">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </span>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveEditorTab(meta.editorTab);
                              setSelectorMode("SELECT");
                            }}
                            className="text-xs h-7 px-3 font-medium border-border hover:bg-muted cursor-pointer shrink-0 rounded-lg text-primary hover:text-primary"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Fixed Signature Row at Bottom */}
                  <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-5 text-center">End</span>
                        <span className="text-base">✍️</span>
                        <div>
                          <div className="font-semibold text-xs text-foreground">Applicant Signature (Bottom Right)</div>
                          <div className="text-[10px] text-muted-foreground">Fixed signature at the bottom right corner</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateResume({
                              signature: {
                                ...(resume.signature || DEFAULT_RESUME.signature),
                                enabled: !(resume.signature?.enabled ?? true),
                              },
                            })
                          }
                          className={cn(
                            "h-6 px-2.5 rounded-full text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer border",
                            (resume.signature?.enabled ?? true)
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-muted text-muted-foreground border-border/70 hover:bg-muted/80"
                          )}
                          title={(resume.signature?.enabled ?? true) ? "Click to turn OFF signature" : "Click to turn ON signature"}
                        >
                          {(resume.signature?.enabled ?? true) ? (
                            <>
                              <Eye className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 text-muted-foreground" />
                              <span>Hidden</span>
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveEditorTab("SIGNATURE");
                            setSelectorMode("SELECT");
                          }}
                          className="text-xs h-7 px-3 font-medium border-border hover:bg-muted cursor-pointer rounded-lg text-primary hover:text-primary"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* 3. SECTION EDITORS (FULL CRUD FOR ALL INPUTS) */}

          {/* TAB 1: IDENTITY, CONTACT & PASSPORT PHOTO */}
          {activeEditorTab === "CONTACT" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>👤</span>
                  <span>Personal Identity &amp; Headline</span>
                </h3>
              </div>

              {/* Passport Photo Upload & Configuration Card */}
              <div className="p-3.5 rounded-2xl border border-border bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                    <Camera className="h-4 w-4 text-primary" />
                    Passport Size Photo (Top Right)
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-medium text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={!!resume.showPhoto}
                      onChange={(e) => updateResume({ showPhoto: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>Show on Resume</span>
                  </label>
                </div>

                <div className="flex items-start gap-4">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative shrink-0">
                    {resume.photoUrl ? (
                      <div className="relative group">
                        <img
                          src={resume.photoUrl}
                          alt="Passport preview"
                          className={cn(
                            "h-24 w-20 object-cover border-2 shadow-2xs bg-background",
                            resume.photoShape === "circle" ? "rounded-full h-20 w-20" : "rounded-xl"
                          )}
                          style={{ borderColor: primaryColor }}
                        />
                        <button
                          type="button"
                          onClick={() => updateResume({ photoUrl: "", showPhoto: false })}
                          className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-xs hover:opacity-90 cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "h-24 w-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 text-muted-foreground/70 bg-card hover:bg-muted/50 cursor-pointer transition-colors text-center p-1",
                          resume.photoShape === "circle" && "rounded-full h-20 w-20"
                        )}
                      >
                        <User className="h-6 w-6 text-muted-foreground/50" />
                        <span className="text-[10px] font-medium leading-none">Add Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Photo Controls */}
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 text-xs rounded-xl font-medium cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5 mr-1 text-primary" />
                        {resume.photoUrl ? "Change Photo" : "Upload Passport Photo"}
                      </Button>
                      {resume.photoUrl && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => updateResume({ photoUrl: "", showPhoto: false })}
                          className="h-8 text-xs text-destructive hover:bg-destructive/10 rounded-xl"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-[11px] text-muted-foreground font-medium">Shape:</span>
                      <button
                        type="button"
                        onClick={() => updateResume({ photoShape: "rounded" })}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer",
                          resume.photoShape !== "circle"
                            ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Standard Passport
                      </button>
                      <button
                        type="button"
                        onClick={() => updateResume({ photoShape: "circle" })}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer",
                          resume.photoShape === "circle"
                            ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Circle Badge
                      </button>
                    </div>

                    <Input
                      value={resume.photoUrl || ""}
                      onChange={(e) =>
                        updateResume({
                          photoUrl: e.target.value,
                          showPhoto: !!e.target.value,
                        })
                      }
                      placeholder="Or paste external image URL (https://...)"
                      className="h-8 text-[11px] rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Full Legal Name *</label>
                <Input
                  value={resume.fullName}
                  onChange={(e) => updateResume({ fullName: e.target.value })}
                  placeholder="Md. Ansarul Islam"
                  className="rounded-xl h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Professional Title / Headline *</label>
                <Input
                  value={resume.title}
                  onChange={(e) => updateResume({ title: e.target.value })}
                  placeholder="Medical Technologist (Laboratory)"
                  className="rounded-xl h-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Email Address *</label>
                  <Input
                    value={resume.email}
                    onChange={(e) => updateResume({ email: e.target.value })}
                    placeholder="ansarul.support@gmail.com"
                    className="rounded-xl h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Phone Number *</label>
                  <Input
                    value={resume.phone}
                    onChange={(e) => updateResume({ phone: e.target.value })}
                    placeholder="+8801709260934"
                    className="rounded-xl h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Location (City, Country)</label>
                  <Input
                    value={resume.location}
                    onChange={(e) => updateResume({ location: e.target.value })}
                    placeholder="Dhaka, Bangladesh"
                    className="rounded-xl h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">LinkedIn / Web Portfolio</label>
                  <Input
                    value={resume.linkedinOrWeb || ""}
                    onChange={(e) => updateResume({ linkedinOrWeb: e.target.value })}
                    placeholder="linkedin.com/in/ansarul-islam"
                    className="rounded-xl h-9"
                  />
                </div>
              </div>

              <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground text-xs">Career Objectives &amp; Headline</div>
                  <div className="text-[11px] text-muted-foreground">Customize your statement in Section 2 with quick clinical presets</div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveEditorTab("OBJECTIVE")}
                  className="text-xs h-8 px-3 rounded-lg border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                >
                  Edit Objectives 🎯
                </Button>
              </div>

              {/* Dynamic Custom Contact Links */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="font-semibold text-foreground flex items-center justify-between">
                  <span>Additional Links &amp; Profiles</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {(resume.contactLinks || []).length} Custom Links
                  </span>
                </label>

                {(resume.contactLinks || []).map((link) => (
                  <div key={link.id} className="flex items-center gap-2 p-2 rounded-xl bg-muted/40 border border-border">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        value={link.label}
                        onChange={(e) => {
                          const updated = (resume.contactLinks || []).map((l) =>
                            l.id === link.id ? { ...l, label: e.target.value } : l
                          );
                          updateResume({ contactLinks: updated });
                        }}
                        placeholder="Link Label (e.g. GitHub, ResearchGate)"
                        className="h-8 text-xs rounded-lg"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const updated = (resume.contactLinks || []).map((l) =>
                            l.id === link.id ? { ...l, url: e.target.value } : l
                          );
                          updateResume({ contactLinks: updated });
                        }}
                        placeholder="URL / Handle"
                        className="h-8 text-xs rounded-lg font-mono"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContactLink(link.id)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-lg shrink-0 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    value={newContactLabel}
                    onChange={(e) => setNewContactLabel(e.target.value)}
                    placeholder="New Label (e.g. ResearchGate)"
                    className="h-8 text-xs rounded-xl"
                  />
                  <Input
                    value={newContactUrl}
                    onChange={(e) => setNewContactUrl(e.target.value)}
                    placeholder="URL or handle"
                    className="h-8 text-xs rounded-xl"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addContactLink}
                    disabled={!newContactLabel.trim() || !newContactUrl.trim()}
                    className="h-8 text-xs bg-primary text-primary-foreground rounded-xl shrink-0 font-medium cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Link
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 2: CAREER OBJECTIVES */}
          {activeEditorTab === "OBJECTIVE" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span>🎯</span>
                    <span>Career Objectives</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Clear, professional statement tailored for diagnostic clinical laboratory roles.
                  </p>
                </div>
              </div>

              {renderSectionHeadingEditor("summary")}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground">Objective Statement</label>
                  <span className="text-[10px] text-muted-foreground">
                    {resume.summary ? resume.summary.length : 0} characters
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={resume.summary}
                  onChange={(e) => updateResume({ summary: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed resize-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Summarize clinical competencies, hospital rotations, biosafety standards, and laboratory goals..."
                />
              </div>

              {/* Pre-fill Clinical Career Templates */}
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Quick Clinical Presets &amp; Templates
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateResume({
                        summary:
                          "Dedicated Medical Laboratory Technologist with comprehensive clinical training in hematology, biochemistry, and microbiology. Proven track record in rapid specimen processing, internal quality control (IQC), and automated diagnostic instrumentation across high-volume tertiary hospital laboratories.",
                      })
                    }
                    className="p-2.5 text-left rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 transition-colors cursor-pointer text-foreground"
                  >
                    <div className="font-bold text-xs text-primary mb-1">Pathology &amp; Diagnostics</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-3">
                      Comprehensive clinical training in hematology, biochemistry, IQC, and automated diagnostics.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateResume({
                        summary:
                          "Detail-oriented Clinical Laboratory Technologist committed to zero-defect diagnostic reporting, ISO 15189 laboratory compliance, and stringent BSL-2 biosafety protocols. Seeking to contribute advanced technical skills in emergency and routine hospital rotations.",
                      })
                    }
                    className="p-2.5 text-left rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 transition-colors cursor-pointer text-foreground"
                  >
                    <div className="font-bold text-xs text-primary mb-1">Quality &amp; Biosafety Focus</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-3">
                      Committed to zero-defect diagnostic reporting, ISO 15189 compliance, and BSL-2 protocols.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateResume({
                        summary:
                          "Ambitious Laboratory Medicine graduate with distinguished academic training and hands-on clinical rotations. Eager to leverage expertise in molecular diagnostic protocols, automated analyzers, and laboratory information management systems (LIMS).",
                      })
                    }
                    className="p-2.5 text-left rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 transition-colors cursor-pointer text-foreground"
                  >
                    <div className="font-bold text-xs text-primary mb-1">Academic &amp; Research</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-3">
                      Distinguished academic training, molecular protocols, automated analyzers, and LIMS.
                    </div>
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: PERSONAL DETAILS */}
          {activeEditorTab === "PERSONAL" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span>📋</span>
                    <span>Personal Details</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Standard institutional CV personal information: Full Name, Father&apos;s Name, Mother&apos;s Name, Address, NID, etc.
                  </p>
                </div>
              </div>

              {renderSectionHeadingEditor("personal")}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-muted-foreground">Full Name</label>
                    <button
                      type="button"
                      onClick={() =>
                        updateResume({
                          personalDetails: {
                            ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                            fullName: resume.fullName,
                          },
                        })
                      }
                      className="text-[10px] text-primary hover:underline cursor-pointer"
                    >
                      Sync with Header
                    </button>
                  </div>
                  <Input
                    value={resume.personalDetails?.fullName ?? resume.fullName}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          fullName: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Md. Ansarul Islam"
                    className="rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Father&apos;s Name</label>
                  <Input
                    value={resume.personalDetails?.fatherName || ""}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          fatherName: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Md. Rafiqul Islam"
                    className="rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Mother&apos;s Name</label>
                  <Input
                    value={resume.personalDetails?.motherName || ""}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          motherName: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Mst. Anwara Begum"
                    className="rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Date of Birth</label>
                  <Input
                    value={resume.personalDetails?.dateOfBirth || ""}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          dateOfBirth: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 15 October 2002"
                    className="rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">National ID (NID) / Birth Reg No.</label>
                  <Input
                    value={resume.personalDetails?.nid || ""}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          nid: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 19982692510000123"
                    className="rounded-xl h-9 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Gender</label>
                  <select
                    value={resume.personalDetails?.gender || "Male"}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          gender: e.target.value,
                        },
                      })
                    }
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-foreground text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Marital Status</label>
                  <select
                    value={resume.personalDetails?.maritalStatus || "Single"}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          maritalStatus: e.target.value,
                        },
                      })
                    }
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-foreground text-xs"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Nationality</label>
                  <Input
                    value={resume.personalDetails?.nationality || ""}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          nationality: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Bangladeshi"
                    className="rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Religion</label>
                  <Input
                    value={resume.personalDetails?.religion || ""}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          religion: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Islam"
                    className="rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Blood Group</label>
                  <select
                    value={resume.personalDetails?.bloodGroup || "B+ (Positive)"}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          bloodGroup: e.target.value,
                        },
                      })
                    }
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-foreground text-xs font-semibold"
                  >
                    <option value="A+ (Positive)">A+ (Positive)</option>
                    <option value="A- (Negative)">A- (Negative)</option>
                    <option value="B+ (Positive)">B+ (Positive)</option>
                    <option value="B- (Negative)">B- (Negative)</option>
                    <option value="O+ (Positive)">O+ (Positive)</option>
                    <option value="O- (Negative)">O- (Negative)</option>
                    <option value="AB+ (Positive)">AB+ (Positive)</option>
                    <option value="AB- (Negative)">AB- (Negative)</option>
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="font-semibold text-muted-foreground">Present Address</label>
                  <Input
                    value={resume.personalDetails?.presentAddress || ""}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          presentAddress: e.target.value,
                        },
                      })
                    }
                    placeholder="House #12, Road #4, Dhanmondi, Dhaka-1205"
                    className="rounded-xl h-9"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="font-semibold text-muted-foreground">Permanent Address</label>
                  <Input
                    value={resume.personalDetails?.permanentAddress || ""}
                    onChange={(e) =>
                      updateResume({
                        personalDetails: {
                          ...(resume.personalDetails || DEFAULT_RESUME.personalDetails),
                          permanentAddress: e.target.value,
                        },
                      })
                    }
                    placeholder="Village: Gopalpur, P.O: Damkura Hat, Thana: Paba, Dist: Rajshahi"
                    className="rounded-xl h-9"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: LABORATORY COMPETENCIES */}
          {activeEditorTab === "SKILLS" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span>🧪</span>
                    <span>Diagnostic Clinical Skills ({resume.skills.length})</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Categorize competencies by clinical sub-discipline and proficiency.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={addSkill}
                  className="h-8 text-xs bg-primary text-primary-foreground font-semibold rounded-xl gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Skill</span>
                </Button>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {resume.skills.map((skill, idx) => (
                  <div key={skill.id} className="p-3 rounded-xl border border-border bg-muted/25 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Input
                        value={skill.name}
                        onChange={(e) => {
                          const updated = [...resume.skills];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          updateResume({ skills: updated });
                        }}
                        placeholder="Skill / Procedure Name"
                        className="text-xs font-semibold h-9 rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-lg shrink-0 cursor-pointer"
                        title="Delete Skill"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={skill.category}
                        onChange={(e) => {
                          const updated = [...resume.skills];
                          updated[idx] = { ...updated[idx], category: e.target.value as any };
                          updateResume({ skills: updated });
                        }}
                        className="h-8 rounded-lg border border-border bg-background px-2.5 text-[11px] font-medium"
                      >
                        <option value="Clinical Pathology">Clinical Pathology</option>
                        <option value="Biochemistry">Biochemistry</option>
                        <option value="Microbiology">Microbiology</option>
                        <option value="Blood Transfusion">Blood Transfusion</option>
                        <option value="Histopathology">Histopathology</option>
                        <option value="General & IT">General &amp; IT</option>
                      </select>

                      <select
                        value={skill.proficiency}
                        onChange={(e) => {
                          const updated = [...resume.skills];
                          updated[idx] = { ...updated[idx], proficiency: e.target.value as any };
                          updateResume({ skills: updated });
                        }}
                        className="h-8 rounded-lg border border-border bg-background px-2.5 text-[11px] font-medium"
                      >
                        <option value="Competent">Competent</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Mastery">Mastery</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 3: ROTATIONS & EXPERIENCE */}
          {activeEditorTab === "EXPERIENCE" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span>🏥</span>
                    <span>Clinical Rotations &amp; Internships ({resume.rotations.length})</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Add hospital postings, edit duties item by item, and reorder.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={addRotation}
                  className="h-8 text-xs bg-primary text-primary-foreground font-semibold rounded-xl gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Rotation</span>
                </Button>
              </div>

              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                {resume.rotations.map((rot, rotIdx) => (
                  <div key={rot.id} className="p-4 rounded-xl border border-border bg-muted/25 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={rotIdx === 0}
                          onClick={() => moveRotation(rotIdx, "up")}
                          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={rotIdx === resume.rotations.length - 1}
                          onClick={() => moveRotation(rotIdx, "down")}
                          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-[11px] font-mono text-muted-foreground font-semibold">#{rotIdx + 1}</span>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRotation(rot.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                        title="Delete Rotation"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Role / Designation *</label>
                      <Input
                        value={rot.role}
                        onChange={(e) => {
                          const updated = [...resume.rotations];
                          updated[rotIdx] = { ...updated[rotIdx], role: e.target.value };
                          updateResume({ rotations: updated });
                        }}
                        placeholder="e.g. Clinical Trainee Laboratory Technologist"
                        className="text-xs font-semibold h-9 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">Hospital / Facility *</label>
                        <Input
                          value={rot.organization}
                          onChange={(e) => {
                            const updated = [...resume.rotations];
                            updated[rotIdx] = { ...updated[rotIdx], organization: e.target.value };
                            updateResume({ rotations: updated });
                          }}
                          placeholder="Dhaka Medical College Hospital"
                          className="h-8 text-xs rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">Duration / Period *</label>
                        <Input
                          value={rot.period}
                          onChange={(e) => {
                            const updated = [...resume.rotations];
                            updated[rotIdx] = { ...updated[rotIdx], period: e.target.value };
                            updateResume({ rotations: updated });
                          }}
                          placeholder="July 2024 – Dec 2024"
                          className="h-8 text-xs rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Bullet Points with Add / Edit / Delete */}
                    <div className="space-y-2 pt-1 border-t border-border/70">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-foreground">
                          Key Clinical Responsibilities ({rot.responsibilities.length})
                        </label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addResponsibilityBullet(rotIdx)}
                          className="h-6 text-[11px] text-primary hover:bg-primary/10 rounded-md font-medium cursor-pointer"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Duty
                        </Button>
                      </div>

                      <div className="space-y-1.5">
                        {rot.responsibilities.map((resp, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-1.5">
                            <span className="text-muted-foreground mt-1.5 text-xs">•</span>
                            <textarea
                              rows={2}
                              value={resp}
                              onChange={(e) => updateResponsibilityBullet(rotIdx, bIdx, e.target.value)}
                              className="flex-1 rounded-lg border border-border bg-background p-2 text-xs leading-relaxed resize-none focus:ring-1 focus:ring-primary"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeResponsibilityBullet(rotIdx, bIdx)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0 mt-0.5 rounded-lg cursor-pointer"
                              title="Delete Duty"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 4: EDUCATION */}
          {activeEditorTab === "EDUCATION" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span>🎓</span>
                    <span>Academic Education ({resume.education.length})</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Degrees, diplomas, board examinations, and faculty honors.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={addEducation}
                  className="h-8 text-xs bg-primary text-primary-foreground font-semibold rounded-xl gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Education</span>
                </Button>
              </div>

              <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
                {resume.education.map((edu, eduIdx) => (
                  <div key={edu.id} className="p-4 rounded-xl border border-border bg-muted/25 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={eduIdx === 0}
                          onClick={() => moveEducation(eduIdx, "up")}
                          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={eduIdx === resume.education.length - 1}
                          onClick={() => moveEducation(eduIdx, "down")}
                          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-[11px] font-mono text-muted-foreground font-semibold">#{eduIdx + 1}</span>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                        title="Delete Education"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Exam Name / Degree *</label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[eduIdx] = { ...updated[eduIdx], degree: e.target.value };
                          updateResume({ education: updated });
                        }}
                        placeholder="Diploma in Medical Laboratory Technology (DMT)"
                        className="text-xs font-semibold h-9 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Institute / Board *</label>
                      <Input
                        value={edu.institute}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[eduIdx] = { ...updated[eduIdx], institute: e.target.value };
                          updateResume({ education: updated });
                        }}
                        placeholder="Dhaka Institute of Health Technology (DIHT)"
                        className="h-8 text-xs rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">Passing Year *</label>
                        <Input
                          value={edu.yearOfPassing}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[eduIdx] = { ...updated[eduIdx], yearOfPassing: e.target.value };
                            updateResume({ education: updated });
                          }}
                          placeholder="2023 – Present (2nd Year Ongoing)"
                          className="h-8 text-xs rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">Result *</label>
                        <Input
                          value={edu.result}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[eduIdx] = { ...updated[eduIdx], result: e.target.value };
                            updateResume({ education: updated });
                          }}
                          placeholder="GPA 4.85 / 5.00"
                          className="h-8 text-xs rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 5: EQUIPMENT & ANALYZERS */}
          {activeEditorTab === "EQUIPMENT" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="border-b border-border pb-2.5">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>🔬</span>
                  <span>Diagnostic Analyzers &amp; Equipment ({resume.equipmentProficiencies.length})</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Specific automated analyzers, optical systems, and diagnostic hardware platforms.
                </p>
              </div>

              {/* Add New Equipment Input */}
              <div className="flex items-center gap-2">
                <Input
                  value={newEquipmentDraft}
                  onChange={(e) => setNewEquipmentDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEquipment();
                    }
                  }}
                  placeholder="e.g. Sysmex XN-550 Automated Hematology Analyzer"
                  className="rounded-xl h-10 text-xs"
                />
                <Button
                  type="button"
                  onClick={addEquipment}
                  disabled={!newEquipmentDraft.trim()}
                  className="h-10 text-xs bg-primary text-primary-foreground font-semibold rounded-xl px-4 shrink-0 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>

              {/* Equipment Items List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {resume.equipmentProficiencies.map((equip, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-2.5 rounded-xl border border-border bg-muted/25 flex items-center justify-between gap-2"
                  >
                    <Input
                      value={equip}
                      onChange={(e) => {
                        const updated = [...resume.equipmentProficiencies];
                        updated[eIdx] = e.target.value;
                        updateResume({ equipmentProficiencies: updated });
                      }}
                      className="h-8 text-xs rounded-lg font-medium"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEquipment(eIdx)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg shrink-0 cursor-pointer"
                      title="Delete Equipment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 6: CERTIFICATIONS */}
          {activeEditorTab === "CERTS" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="border-b border-border pb-2.5">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>📜</span>
                  <span>Certifications &amp; Accreditations ({resume.certifications.length})</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Biosafety certifications, competency licenses, and healthcare credentials.
                </p>
              </div>

              {/* Add New Certification Input */}
              <div className="flex items-center gap-2">
                <Input
                  value={newCertDraft}
                  onChange={(e) => setNewCertDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCertification();
                    }
                  }}
                  placeholder="e.g. BSL-2 Infection Control & Biomedical Waste Handling"
                  className="rounded-xl h-10 text-xs"
                />
                <Button
                  type="button"
                  onClick={addCertification}
                  disabled={!newCertDraft.trim()}
                  className="h-10 text-xs bg-primary text-primary-foreground font-semibold rounded-xl px-4 shrink-0 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>

              {/* Certifications List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {resume.certifications.map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-2.5 rounded-xl border border-border bg-muted/25 flex items-center justify-between gap-2"
                  >
                    <Input
                      value={cert}
                      onChange={(e) => {
                        const updated = [...resume.certifications];
                        updated[cIdx] = e.target.value;
                        updateResume({ certifications: updated });
                      }}
                      className="h-8 text-xs rounded-lg font-medium"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(cIdx)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg shrink-0 cursor-pointer"
                      title="Delete Certification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 7: LANGUAGES */}
          {activeEditorTab === "LANGUAGES" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              {renderSectionHeadingEditor("languages")}
              <div className="border-b border-border pb-2.5">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>🌐</span>
                  <span>Languages &amp; Fluency ({resume.languages.length})</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Languages for clinical reporting and medical communication.
                </p>
              </div>

              {/* Add New Language Input */}
              <div className="flex items-center gap-2">
                <Input
                  value={newLangDraft}
                  onChange={(e) => setNewLangDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLanguage();
                    }
                  }}
                  placeholder="e.g. English (Professional Working Proficiency)"
                  className="rounded-xl h-10 text-xs"
                />
                <Button
                  type="button"
                  onClick={addLanguage}
                  disabled={!newLangDraft.trim()}
                  className="h-10 text-xs bg-primary text-primary-foreground font-semibold rounded-xl px-4 shrink-0 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>

              {/* Languages List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {resume.languages.map((lang, lIdx) => (
                  <div
                    key={lIdx}
                    className="p-2.5 rounded-xl border border-border bg-muted/25 flex items-center justify-between gap-2"
                  >
                    <Input
                      value={lang}
                      onChange={(e) => {
                        const updated = [...resume.languages];
                        updated[lIdx] = e.target.value;
                        updateResume({ languages: updated });
                      }}
                      className="h-8 text-xs rounded-lg font-medium"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(lIdx)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg shrink-0 cursor-pointer"
                      title="Delete Language"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 8: APPLICANT SIGNATURE (BOTTOM RIGHT) */}
          {activeEditorTab === "SIGNATURE" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span>✍️</span>
                    <span>Applicant Signature (Bottom Right)</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Official applicant sign-off displayed strictly on the bottom right corner of the document.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={resume.signature?.enabled ?? true}
                    onChange={(e) =>
                      updateResume({
                        signature: {
                          ...(resume.signature || DEFAULT_RESUME.signature),
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Show Signature</span>
                </label>
              </div>

              {/* Signature Visual Preview Card */}
              <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col items-end">
                <div className="w-56 p-3 rounded-lg bg-card border border-border/60 shadow-2xs text-center flex flex-col items-center">
                  {resume.signature?.imageUrl ? (
                    <div className="h-14 w-full flex items-center justify-center pb-1">
                      <img
                        src={resume.signature.imageUrl}
                        alt="Signature preview"
                        className="max-h-[55px] max-w-[150px] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-full flex items-center justify-center border border-dashed border-border/70 rounded bg-muted/30 text-[10.5px] text-muted-foreground select-none">
                      (Blank for handwritten signature)
                    </div>
                  )}
                  <div className="w-full border-t border-foreground/30 mt-2 pt-1 text-center space-y-0.5">
                    <p className="text-[11px] font-bold text-foreground leading-tight">
                      ({resume.signature?.signatoryName || resume.fullName})
                    </p>
                    <p className="text-[10px] text-foreground/80 font-medium leading-tight">
                      Signature
                    </p>
                    <p className="text-[9.5px] text-muted-foreground leading-tight">
                      Date: {resume.signature?.date || "15 November, 2026"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1.5">
                  Live Preview: Exactly how signature renders on the bottom right of the 1-page A4
                </span>
              </div>

              {/* Signature Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-muted-foreground">Signatory Full Name</label>
                    <button
                      type="button"
                      onClick={() =>
                        updateResume({
                          signature: {
                            ...(resume.signature || DEFAULT_RESUME.signature),
                            signatoryName: resume.fullName,
                          },
                        })
                      }
                      className="text-[10px] text-primary hover:underline cursor-pointer"
                    >
                      Use Full Name
                    </button>
                  </div>
                  <Input
                    value={resume.signature?.signatoryName ?? resume.fullName}
                    onChange={(e) =>
                      updateResume({
                        signature: {
                          ...(resume.signature || DEFAULT_RESUME.signature),
                          signatoryName: e.target.value,
                        },
                      })
                    }
                    placeholder="Your Full Name"
                    className="rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-muted-foreground">Date of Signature</label>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date().toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });
                        updateResume({
                          signature: {
                            ...(resume.signature || DEFAULT_RESUME.signature),
                            date: today,
                          },
                        });
                      }}
                      className="text-[10px] text-primary hover:underline cursor-pointer"
                    >
                      Set Today
                    </button>
                  </div>
                  <Input
                    value={resume.signature?.date || ""}
                    onChange={(e) =>
                      updateResume({
                        signature: {
                          ...(resume.signature || DEFAULT_RESUME.signature),
                          date: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 07 Sept 2026"
                    className="rounded-xl h-9"
                  />
                </div>
              </div>

              {/* Upload 150x80 px Signature Image or Keep Blank */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5 text-primary" />
                    <span>Signature Image (150x80 px, max 200KB)</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Upload a 150x80 px image under 200KB, or keep it blank for physical signature.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={signatureInputRef}
                    onChange={handleSignatureUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => signatureInputRef.current?.click()}
                    className="h-8 text-xs rounded-xl cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1 text-primary" />
                    {resume.signature?.imageUrl ? "Change Image" : "Upload (150x80 px)"}
                  </Button>
                  {resume.signature?.imageUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateResume({
                          signature: {
                            ...(resume.signature || DEFAULT_RESUME.signature),
                            imageUrl: undefined,
                          },
                        })
                      }
                      className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Keep Blank
                    </Button>
                  ) : (
                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 rounded bg-emerald-500/10">
                      Currently Blank
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* TAB 9: CUSTOM SECTIONS */}
          {activeEditorTab === "CUSTOM" && (
            <Card className="border-border shadow-xs p-5 rounded-2xl bg-card space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span>✨</span>
                    <span>Custom Sections &amp; Research ({(resume.customSections || []).length})</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Add custom categories: Research Papers, Clinical Workshops, Awards, or Memberships.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={addCustomSection}
                  className="h-8 text-xs bg-primary text-primary-foreground font-semibold rounded-xl gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Section</span>
                </Button>
              </div>

              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                {(resume.customSections || []).length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                    <p>No custom sections created yet.</p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addCustomSection}
                      className="mt-2 text-xs bg-primary text-primary-foreground rounded-xl"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Create First Custom Section
                    </Button>
                  </div>
                ) : (
                  (resume.customSections || []).map((sec) => (
                    <div key={sec.id} className="p-4 rounded-xl border border-border bg-muted/25 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          value={sec.title}
                          onChange={(e) => {
                            const updated = (resume.customSections || []).map((s) =>
                              s.id === sec.id ? { ...s, title: e.target.value } : s
                            );
                            updateResume({ customSections: updated });
                          }}
                          placeholder="Section Title (e.g. Research Publications)"
                          className="font-bold text-xs h-9 rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomSection(sec.id)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer shrink-0"
                          title="Delete Custom Section"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Items in Section */}
                      <div className="space-y-2 pt-1 border-t border-border/70">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-foreground">
                            Section Entries ({sec.items.length})
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addCustomSectionItem(sec.id)}
                            className="h-6 text-[11px] text-primary hover:bg-primary/10 rounded-md font-medium cursor-pointer"
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Entry
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {sec.items.map((item) => (
                            <div key={item.id} className="p-2.5 rounded-lg border border-border bg-background space-y-1.5">
                              <div className="flex items-center justify-between gap-1">
                                <Input
                                  value={item.title}
                                  onChange={(e) => {
                                    const updated = (resume.customSections || []).map((s) => {
                                      if (s.id !== sec.id) return s;
                                      return {
                                        ...s,
                                        items: s.items.map((it) =>
                                          it.id === item.id ? { ...it, title: e.target.value } : it
                                        ),
                                      };
                                    });
                                    updateResume({ customSections: updated });
                                  }}
                                  placeholder="Entry Title / Paper"
                                  className="h-7 text-xs font-semibold rounded-md"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCustomSectionItem(sec.id, item.id)}
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive rounded-md shrink-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-1.5">
                                <Input
                                  value={item.subtitle || ""}
                                  onChange={(e) => {
                                    const updated = (resume.customSections || []).map((s) => {
                                      if (s.id !== sec.id) return s;
                                      return {
                                        ...s,
                                        items: s.items.map((it) =>
                                          it.id === item.id ? { ...it, subtitle: e.target.value } : it
                                        ),
                                      };
                                    });
                                    updateResume({ customSections: updated });
                                  }}
                                  placeholder="Subtitle / Org"
                                  className="h-7 text-[11px] rounded-md"
                                />
                                <Input
                                  value={item.date || ""}
                                  onChange={(e) => {
                                    const updated = (resume.customSections || []).map((s) => {
                                      if (s.id !== sec.id) return s;
                                      return {
                                        ...s,
                                        items: s.items.map((it) =>
                                          it.id === item.id ? { ...it, date: e.target.value } : it
                                        ),
                                      };
                                    });
                                    updateResume({ customSections: updated });
                                  }}
                                  placeholder="Year / Date"
                                  className="h-7 text-[11px] rounded-md"
                                />
                              </div>

                              <textarea
                                rows={2}
                                value={item.description || ""}
                                onChange={(e) => {
                                  const updated = (resume.customSections || []).map((s) => {
                                    if (s.id !== sec.id) return s;
                                    return {
                                      ...s,
                                      items: s.items.map((it) =>
                                        it.id === item.id ? { ...it, description: e.target.value } : it
                                      ),
                                    };
                                  });
                                  updateResume({ customSections: updated });
                                }}
                                placeholder="Summary of accomplishment or analytical findings..."
                                className="w-full rounded-md border border-border bg-background p-1.5 text-[11px] leading-relaxed resize-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>
      )}

        {/* RIGHT COLUMN: LIVE RESUME / CV CANVAS */}
        <div
          className={cn(
            isCustomizerCollapsed ? "col-span-12 w-full" : "lg:col-span-7",
            "print:!block print:!w-full print:!col-span-12 flex flex-col transition-all duration-300",
            mobileTab === "EDITOR" ? "hidden lg:block" : "flex"
          )}
        >
          {/* Preview Controls Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-muted/70 rounded-t-2xl border border-b-0 border-border/70 text-xs print:hidden">
            <div className="flex items-center gap-2">
              {isCustomizerCollapsed && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomizerCollapsed(false)}
                  className="h-7 px-2.5 text-xs font-semibold text-foreground hover:bg-background cursor-pointer gap-1.5 shadow-2xs border-primary/40 bg-background mr-1"
                  title="Expand the customizer panel"
                >
                  <Sliders className="h-3.5 w-3.5 text-primary" />
                  <span>Open Customizer</span>
                  <ChevronRight className="h-3 w-3 text-primary" />
                </Button>
              )}
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-foreground">Live A4 Preview</span>
              <span className="hidden sm:inline text-muted-foreground text-[11px]">(210 × 297 mm • 1-Page Fit)</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => {
                  setZoomMode("custom");
                  setZoomScale((s) => Math.max(0.45, Number((s - 0.08).toFixed(2))));
                }}
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs font-semibold text-foreground hover:bg-background/80 cursor-pointer"
                onClick={() => {
                  if (zoomMode === "fit") {
                    setZoomMode("custom");
                    setZoomScale(1.0);
                  } else {
                    setZoomMode("fit");
                  }
                }}
                title={zoomMode === "fit" ? "Click to set 100%" : "Click to Auto-Fit"}
              >
                {Math.round(zoomScale * 100)}%
                <span className="text-[10px] text-muted-foreground ml-1">
                  ({zoomMode === "fit" ? "Fit" : "Custom"})
                </span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => {
                  setZoomMode("custom");
                  setZoomScale((s) => Math.min(1.3, Number((s + 0.08).toFixed(2))));
                }}
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>

              <div className="h-3.5 w-px bg-border/80 mx-1" />

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-[11px] font-medium cursor-pointer"
                onClick={() => {
                  if (zoomScale === 1.0) {
                    setZoomMode("fit");
                  } else {
                    setZoomMode("custom");
                    setZoomScale(1.0);
                  }
                }}
              >
                {zoomScale === 1.0 ? "Auto Fit" : "100%"}
              </Button>
            </div>
          </div>

          {/* A4 Sheet Studio Wrapper with Responsive Scaled Viewport */}
          <div
            ref={previewContainerRef}
            className="w-full flex justify-center overflow-x-auto p-3 sm:p-5 bg-slate-100/80 dark:bg-slate-900/60 rounded-b-2xl border border-border/70 print:p-0 print:m-0 print:bg-transparent print:border-0 print:overflow-visible print:w-full print:block"
          >
            {/* Scaled Visual Wrapper that preserves true DOM aspect ratio without clipping */}
            <div
              style={{
                width: `${Math.round(794 * zoomScale)}px`,
                height: `${Math.round(1123 * zoomScale)}px`,
                transition: "width 0.15s ease, height 0.15s ease",
              }}
              className="relative shrink-0 flex justify-center print:!w-full print:!h-auto print:!static"
            >
              <div
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: "top left",
                  width: "794px",
                  height: "1123px",
                }}
                className="absolute top-0 left-0 print:!static print:!transform-none"
              >
                {/* A4 Sheet Container (Standard ISO 210mm x 297mm = 794px x 1123px at 96 DPI) */}
                <div
                  id="resume-document"
                  style={{
                    width: "794px",
                    minWidth: "794px",
                    maxWidth: "794px",
                    height: "1123px",
                    minHeight: "1123px",
                    maxHeight: "1123px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    fontFamily: activeFontFamilyCSS,
                    ["--theme-primary" as any]: primaryColor,
                    ["--theme-accent" as any]: accentColor,
                  }}
                  data-font-family={activeFontFamily}
                  className={cn(
                    "bg-white text-slate-900 border border-slate-300/80 shadow-2xl transition-all rounded-xs",
                    "print:!border-0 print:!shadow-none print:!p-0 print:!m-0 print:!w-[210mm] print:!h-[297mm] print:!max-h-[297mm] print:!rounded-none",
                    fontClass,
                    fontSizeClass,
                    resume.theme === "MODERN_SPLIT" ? "p-0 overflow-hidden" : "p-6 sm:p-7 print:!p-6"
                  )}
                >
            {/* ------------------------------------------------------------- */}
            {/* THEME 1: MODERN SPLIT (2-COLUMN CLINCAL SIDEBAR) */}
            {/* ------------------------------------------------------------- */}
            {resume.theme === "MODERN_SPLIT" && (
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[297mm]">
                {/* Left Colored Sidebar (4 cols) */}
                <div
                  className="md:col-span-4 p-6 sm:p-7 text-white space-y-5 print-avoid-break"
                  style={{ backgroundColor: primaryColor }}
                >
                  {/* Identity Avatar / Passport Photo */}
                  <div className="space-y-2.5 text-center md:text-left">
                    {resume.showPhoto && resume.photoUrl ? (
                      <div className="flex justify-center md:justify-start">
                        <img
                          src={resume.photoUrl}
                          alt={resume.fullName}
                          className={cn(
                            "h-28 w-24 object-cover border-2 border-white/60 shadow-md",
                            resume.photoShape === "circle" ? "rounded-full h-24 w-24" : "rounded-xl"
                          )}
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-2xl border border-white/30 text-white shadow-xs mx-auto md:mx-0">
                        {resume.fullName
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "LT"}
                      </div>
                    )}

                    <div>
                      <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">
                        {resume.fullName}
                      </h1>
                      <p className="text-xs font-medium text-white/85 leading-snug mt-1">
                        {resume.title}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-3 border-t border-white/20 text-[11px] text-white/90">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0 opacity-80" />
                      <span className="truncate">{resume.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0 opacity-80" />
                      <span>{resume.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 opacity-80" />
                      <span>{resume.location}</span>
                    </div>
                    {resume.linkedinOrWeb && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 shrink-0 opacity-80" />
                        <span className="truncate">{resume.linkedinOrWeb}</span>
                      </div>
                    )}
                    {(resume.contactLinks || []).map((l) => (
                      <div key={l.id} className="flex items-center gap-2">
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" />
                        <span className="truncate font-medium">{l.label}: {l.url}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills Section in Sidebar */}
                  {!resume.hiddenSections?.includes("skills") && (
                    <div className="space-y-2 pt-3 border-t border-white/20">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                        {resume.sectionHeadings?.skills || DEFAULT_SECTION_HEADINGS.skills}
                      </h3>
                      <div className="space-y-1.5">
                        {resume.skills.map((s) => (
                          <div key={s.id} className="bg-white/10 p-2 rounded-lg backdrop-blur-2xs">
                            <div className="font-semibold text-white text-[11.5px] leading-tight">{s.name}</div>
                            <div className="flex items-center justify-between text-[10px] text-white/75 mt-0.5">
                              <span>{s.category}</span>
                              <span className="font-bold text-white bg-white/20 px-1.5 py-0.2 rounded">{s.proficiency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diagnostic Analyzers */}
                  {!resume.hiddenSections?.includes("equipment") && resume.equipmentProficiencies.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-white/20">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                        {resume.sectionHeadings?.equipment || DEFAULT_SECTION_HEADINGS.equipment}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {resume.equipmentProficiencies.map((equip, idx) => (
                          <span key={idx} className="bg-white/15 px-2 py-0.5 rounded-md text-[10.5px] font-medium text-white">
                            {equip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {!resume.hiddenSections?.includes("languages") && resume.languages.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-white/20 text-[11px] text-white/90">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                        {resume.sectionHeadings?.languages || DEFAULT_SECTION_HEADINGS.languages}
                      </h3>
                      <div className="space-y-0.5">
                        {resume.languages.map((lang, idx) => (
                          <div key={idx} className="text-[10.5px]">• {lang}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Main Body (8 cols) */}
                <div className="md:col-span-8 p-6 sm:p-8 space-y-5 bg-white">
                  {/* Executive Summary */}
                  {!resume.hiddenSections?.includes("summary") && (
                    <div className="space-y-1.5 print-avoid-break">
                      {renderSectionHeading(resume.sectionHeadings?.summary || DEFAULT_SECTION_HEADINGS.summary)}
                      <p className="leading-relaxed text-slate-700 text-justify">
                        {resume.summary}
                      </p>
                    </div>
                  )}

                  {/* Rotations */}
                  {!resume.hiddenSections?.includes("experience") && (
                    <div className="space-y-3 print-avoid-break">
                      {renderSectionHeading(resume.sectionHeadings?.experience || DEFAULT_SECTION_HEADINGS.experience)}
                      <div className="space-y-3">
                        {resume.rotations.map((rot) => (
                          <div key={rot.id} className="space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>{rot.role} — {rot.organization}</span>
                              <span className="text-[11px] font-normal text-slate-500">{rot.period}</span>
                            </div>
                            {rot.location && <div className="text-[11px] text-slate-500">{rot.location}</div>}
                            <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                              {rot.responsibilities.map((resp, i) => (
                                <li key={i} className="leading-relaxed">{resp}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {!resume.hiddenSections?.includes("education") && (
                    <div className="space-y-1.5 print-avoid-break">
                      {renderSectionHeading(resume.sectionHeadings?.education || DEFAULT_SECTION_HEADINGS.education)}
                      <div className="w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-700/80">
                        <table className="w-full border-collapse text-left text-[11px]">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/80 font-bold text-slate-700 dark:text-slate-200 text-[10.5px]">
                              <th className="py-1.5 px-2.5 border-r border-slate-200 dark:border-slate-700/80">
                                Exam Name and Institute
                              </th>
                              <th className="py-1.5 px-2 text-center border-r border-slate-200 dark:border-slate-700/80 whitespace-nowrap w-24">
                                Passing Year
                              </th>
                              <th className="py-1.5 px-2 text-center whitespace-nowrap w-20">
                                Result
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80 bg-white dark:bg-slate-900/30">
                            {resume.education.map((edu) => (
                              <tr key={edu.id} className="align-top">
                                <td className="py-1 px-2.5 border-r border-slate-200 dark:border-slate-700/80">
                                  <span className="font-bold text-slate-900 dark:text-slate-100 block leading-snug text-[11px]">
                                    {edu.degree}
                                  </span>
                                  <span className="text-slate-600 dark:text-slate-400 block text-[10px] leading-snug">
                                    {edu.institute}
                                  </span>
                                </td>
                                <td className="py-1 px-2 text-center text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium border-r border-slate-200 dark:border-slate-700/80 text-[10.5px]">
                                  {edu.yearOfPassing}
                                </td>
                                <td className="py-1 px-2 text-center font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap text-[10.5px]">
                                  {edu.result}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {!resume.hiddenSections?.includes("certs") && resume.certifications.length > 0 && (
                    <div className="space-y-1.5 print-avoid-break">
                      {renderSectionHeading(resume.sectionHeadings?.certs || DEFAULT_SECTION_HEADINGS.certs)}
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                        {resume.certifications.map((cert, idx) => (
                          <li key={idx}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Custom Sections */}
                  {!resume.hiddenSections?.includes("custom") && (resume.customSections || []).map((sec) => (
                    <div key={sec.id} className="space-y-2 print-avoid-break">
                      {renderSectionHeading(sec.title)}
                      <div className="space-y-2">
                        {sec.items.map((it) => (
                          <div key={it.id} className="space-y-0.5">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>{it.title}</span>
                              {it.date && <span className="text-[11px] font-normal text-slate-500">{it.date}</span>}
                            </div>
                            {it.subtitle && <div className="text-[11px] text-slate-600 font-medium">{it.subtitle}</div>}
                            {it.description && <p className="text-slate-700 leading-relaxed">{it.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Personal Details in Split Theme */}
                  {!resume.hiddenSections?.includes("personal") && resume.personalDetails && (
                    <div className="space-y-1.5 print-avoid-break">
                      {renderSectionHeading(resume.sectionHeadings?.personal || DEFAULT_SECTION_HEADINGS.personal)}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] leading-snug pt-0.5">
                        <div className="flex items-baseline">
                          <span className="w-24 text-slate-500 font-medium shrink-0">Full Name</span>
                          <span className="text-slate-400 mr-1.5">:</span>
                          <span className="text-slate-800 font-semibold truncate">
                            {resume.personalDetails.fullName || resume.fullName}
                          </span>
                        </div>
                        {resume.personalDetails.fatherName && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">Father&apos;s Name</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-semibold truncate">{resume.personalDetails.fatherName}</span>
                          </div>
                        )}
                        {resume.personalDetails.motherName && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">Mother&apos;s Name</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-semibold truncate">{resume.personalDetails.motherName}</span>
                          </div>
                        )}
                        {resume.personalDetails.dateOfBirth && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">Date of Birth</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-semibold">{resume.personalDetails.dateOfBirth}</span>
                          </div>
                        )}
                        {resume.personalDetails.nid && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">National ID</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-semibold font-mono text-[10px]">{resume.personalDetails.nid}</span>
                          </div>
                        )}
                        {resume.personalDetails.gender && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">Gender</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-semibold">{resume.personalDetails.gender}</span>
                          </div>
                        )}
                        {resume.personalDetails.maritalStatus && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">Marital Status</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-semibold">{resume.personalDetails.maritalStatus}</span>
                          </div>
                        )}
                        {resume.personalDetails.nationality && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">Nationality</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-semibold">{resume.personalDetails.nationality}</span>
                          </div>
                        )}
                        {resume.personalDetails.bloodGroup && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">Blood Group</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-bold" style={{ color: primaryColor }}>
                              {resume.personalDetails.bloodGroup}
                            </span>
                          </div>
                        )}
                        {resume.personalDetails.presentAddress && (
                          <div className="col-span-2 flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">Present Address</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-normal">{resume.personalDetails.presentAddress}</span>
                          </div>
                        )}
                        {resume.personalDetails.permanentAddress && (
                          <div className="col-span-2 flex items-baseline">
                            <span className="w-24 text-slate-500 font-medium shrink-0">Permanent Address</span>
                            <span className="text-slate-400 mr-1.5">:</span>
                            <span className="text-slate-800 font-normal">{resume.personalDetails.permanentAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Applicant Signature in Split Theme */}
                  {renderSignatureBlock()}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* THEMES 2-6: SINGLE COLUMN / EXECUTIVE / COMPACT / TIMELINE / MINIMALIST */}
            {/* ------------------------------------------------------------- */}
            {resume.theme !== "MODERN_SPLIT" && (
              <div className={cn("w-full space-y-2.5", spacingClass)}>
                {/* Header Block with Passport Photo on Right */}
                <div
                  className={cn(
                    "pb-2.5 border-b print-avoid-break flex items-start justify-between gap-4",
                    resume.theme === "EXECUTIVE_HEALTH" || resume.headerStyle === "banner"
                      ? "p-6 rounded-xl text-white -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 md:-mx-10 md:-mt-10"
                      : "border-slate-200"
                  )}
                  style={
                    resume.theme === "EXECUTIVE_HEALTH" || resume.headerStyle === "banner"
                      ? { backgroundColor: primaryColor }
                      : { borderColor: `${primaryColor}40` }
                  }
                >
                  {/* Left Column of Header: Identity & Contact Info */}
                  <div
                    className={cn(
                      "space-y-1 min-w-0 flex-1",
                      resume.headerStyle === "centered" || resume.theme === "MINIMALIST_ACADEMIC"
                        ? "text-center"
                        : "text-left"
                    )}
                  >
                    <h1
                      className={cn(
                        "text-2xl sm:text-3xl font-extrabold tracking-tight",
                        resume.theme === "EXECUTIVE_HEALTH" || resume.headerStyle === "banner"
                          ? "text-white"
                          : "text-slate-950"
                      )}
                      style={
                        resume.theme !== "EXECUTIVE_HEALTH" && resume.headerStyle !== "banner"
                          ? { color: primaryColor }
                          : undefined
                      }
                    >
                      {resume.fullName}
                    </h1>

                    <p
                      className={cn(
                        "text-sm font-semibold mt-1",
                        resume.theme === "EXECUTIVE_HEALTH" || resume.headerStyle === "banner"
                          ? "text-white/90"
                          : "text-slate-700"
                      )}
                    >
                      {resume.title}
                    </p>

                    {/* Contact Strip */}
                    <div
                      className={cn(
                        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-2.5",
                        resume.headerStyle === "centered" || resume.theme === "MINIMALIST_ACADEMIC"
                          ? "justify-center"
                          : "justify-start",
                        resume.theme === "EXECUTIVE_HEALTH" || resume.headerStyle === "banner"
                          ? "text-white/80"
                          : "text-slate-600"
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5 shrink-0">
                        <Mail className="h-3.5 w-3.5 opacity-80 shrink-0 inline-block" />
                        <span>{resume.email}</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="inline-flex items-center gap-1.5 shrink-0">
                        <Phone className="h-3.5 w-3.5 opacity-80 shrink-0 inline-block" />
                        <span>{resume.phone}</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="inline-flex items-center gap-1.5 shrink-0">
                        <MapPin className="h-3.5 w-3.5 opacity-80 shrink-0 inline-block" />
                        <span>{resume.location}</span>
                      </span>
                      {resume.linkedinOrWeb && (
                        <>
                          <span className="text-slate-400">•</span>
                          <span className="inline-flex items-center gap-1.5 font-medium shrink-0">
                            <Globe className="h-3.5 w-3.5 opacity-80 shrink-0 inline-block" />
                            <span>{resume.linkedinOrWeb}</span>
                          </span>
                        </>
                      )}
                      {(resume.contactLinks || []).map((l) => (
                        <React.Fragment key={l.id}>
                          <span className="text-slate-400">•</span>
                          <span className="inline-flex items-center gap-1.5 font-medium shrink-0">
                            <ExternalLink className="h-3.5 w-3.5 opacity-80 shrink-0 inline-block" />
                            <span>{l.label}: {l.url}</span>
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Right Side Passport Photo */}
                  {renderPassportPhoto()}
                </div>

                {/* Dynamic Drag-and-Drop Ordered Sections */}
                {activeSectionOrder.map((secKey) => (
                  <React.Fragment key={secKey}>
                    {renderSingleColumnSection(secKey)}
                  </React.Fragment>
                ))}

                {/* Applicant Signature at Bottom Right */}
                {renderSignatureBlock()}
              </div>
            )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
