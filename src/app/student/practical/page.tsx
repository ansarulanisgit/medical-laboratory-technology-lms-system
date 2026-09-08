"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Beaker,
  FileCheck,
  Plus,
  Search,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Send,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  X,
  Clock,
  Sparkles,
  Award,
  Video
} from "lucide-react";
import { cn } from '@/lib/utils';
import { usePracticals, PracticalProcedure } from "@/lib/stores/practical-lab-store";
import { useAcademic } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";

const DEPARTMENTS = [
  "All Departments",
  "Hematology",
  "Biochemistry",
  "Microbiology",
  "Blood Banking",
  "Histopathology",
  "Clinical Pathology",
] as const;

export default function StudentPracticalPage() {
  const { practicals, addPractical, updatePractical, deletePractical, addComment } = usePracticals();
  const { role, userProfile } = useAcademic();
  const { logActivity } = useActivityLog();

  const canManage = role === "SUPER_ADMIN" || role === "ADMIN" || role === "MENTOR";

  const [selectedDept, setSelectedDept] = React.useState<string>("All Departments");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string>(practicals[0]?.id || "");
  const [mobilePracticalView, setMobilePracticalView] = React.useState<"LIST" | "DETAIL">("LIST");
  const [currentStepIdx, setCurrentStepIdx] = React.useState<number>(0);
  const [checkedReagents, setCheckedReagents] = React.useState<Record<string, boolean>>({});
  
  // Q&A Comment state
  const [newComment, setNewComment] = React.useState("");

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    department: "Hematology" as PracticalProcedure["department"],
    specimen: "",
    whyPerform: "",
    whenPerform: "",
    reagentsAndEquipment: "",
    steps: "",
    qualityControl: "",
    normalValues: "",
    criticalAlerts: "",
    rejectionCriteria: "",
    videoUrl: "",
  });

  const filteredPracticals = React.useMemo(() => {
    return practicals.filter((p) => {
      const matchDept = selectedDept === "All Departments" || p.department === selectedDept;
      const matchQuery =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specimen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.whyPerform.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchQuery;
    });
  }, [practicals, selectedDept, searchQuery]);

  const activeProcedure = React.useMemo(() => {
    return practicals.find((p) => p.id === selectedId) || practicals[0];
  }, [practicals, selectedId]);

  React.useEffect(() => {
    setCurrentStepIdx(0);
    setCheckedReagents({});
  }, [selectedId]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      department: "Hematology",
      specimen: "",
      whyPerform: "",
      whenPerform: "",
      reagentsAndEquipment: "",
      steps: "",
      qualityControl: "",
      normalValues: "",
      criticalAlerts: "",
      rejectionCriteria: "",
      videoUrl: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (proc: PracticalProcedure) => {
    setEditingId(proc.id);
    setFormData({
      title: proc.title,
      department: proc.department,
      specimen: proc.specimen,
      whyPerform: proc.whyPerform,
      whenPerform: proc.whenPerform,
      reagentsAndEquipment: proc.reagentsAndEquipment.join("\n"),
      steps: proc.steps.join("\n"),
      qualityControl: proc.qualityControl,
      normalValues: proc.normalValues,
      criticalAlerts: proc.criticalAlerts,
      rejectionCriteria: proc.rejectionCriteria,
      videoUrl: proc.videoUrl || "",
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.specimen.trim()) {
      alert("Please fill in at least the Title and Specimen.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      department: formData.department,
      specimen: formData.specimen.trim(),
      whyPerform: formData.whyPerform.trim(),
      whenPerform: formData.whenPerform.trim(),
      reagentsAndEquipment: formData.reagentsAndEquipment
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      steps: formData.steps
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      qualityControl: formData.qualityControl.trim(),
      normalValues: formData.normalValues.trim(),
      criticalAlerts: formData.criticalAlerts.trim(),
      rejectionCriteria: formData.rejectionCriteria.trim(),
      videoUrl: formData.videoUrl.trim() || undefined,
    };

    if (editingId) {
      updatePractical(editingId, payload);
      logActivity({
        action: "UPDATE",
        module: "Lab Practical",
        details: `Updated SOP procedure "${payload.title}"`,
      });
    } else {
      addPractical(payload);
      logActivity({
        action: "CREATE",
        module: "Lab Practical",
        details: `Published new SOP procedure "${payload.title}"`,
      });
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deletePractical(id);
      logActivity({
        action: "DELETE",
        module: "Lab Practical",
        details: `Deleted SOP procedure "${title}"`,
      });
      if (selectedId === id && practicals.length > 1) {
        setSelectedId(practicals.find((p) => p.id !== id)?.id || "");
      }
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeProcedure) return;

    addComment(
      activeProcedure.id,
      newComment,
      userProfile?.name || role,
      role
    );
    logActivity({
      action: "COMMENT",
      module: "Lab Practical",
      details: `Posted query/feedback on "${activeProcedure.title}"`,
    });
    setNewComment("");
  };

  const toggleReagent = (idx: number) => {
    setCheckedReagents((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Practical Laboratory Procedures
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              SOP Hub
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Step-by-step diagnostic bench procedures, indications, quality control, reference values, and critical alerts.
          </p>
        </div>

        {canManage && (
          <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Add Practical SOP</span>
          </Button>
        )}
      </div>

      {/* Mandatory Training Disclaimer */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-foreground space-y-1">
        <div className="flex items-center space-x-2 font-semibold text-amber-700 dark:text-amber-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>Educational SOP & Good Laboratory Practice (GLP) Directive</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          These interactive bench guidelines adhere to ISO 15189 and WHO standard clinical laboratory methodologies. Always wear PPE (lab coat, gloves, eye protection) and adhere to institutional safety guidelines when handling biohazardous human specimens.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search procedures, specimen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

            {/* Mobile-First Toggle: Procedures List vs SOP Guide */}
      <div className="flex lg:hidden items-center p-1 bg-muted/80 rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setMobilePracticalView("LIST")}
          className={cn(
            "flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center",
            mobilePracticalView === "LIST"
              ? "bg-card text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Procedures ({filteredPracticals.length})
        </button>
        <button
          type="button"
          onClick={() => setMobilePracticalView("DETAIL")}
          className={cn(
            "flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center",
            mobilePracticalView === "DETAIL"
              ? "bg-card text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          SOP Guide View
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Procedure Cards List (4 cols) */}
        <div className={cn("lg:col-span-4 space-y-3", mobilePracticalView === "DETAIL" ? "hidden lg:block" : "block")}>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Procedures ({filteredPracticals.length})
            </h2>
            <span className="text-[11px] text-muted-foreground">Select to view guide</span>
          </div>

          {filteredPracticals.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground text-xs">
              No practical procedures match your filter criteria.
            </Card>
          ) : (
            <div className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
              {filteredPracticals.map((proc) => {
                const isSelected = proc.id === activeProcedure?.id;
                return (
                  <div
                    key={proc.id}
                    onClick={() => { setSelectedId(proc.id); setMobilePracticalView("DETAIL"); }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card hover:bg-accent/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Badge variant={isSelected ? "default" : "outline"} className="text-[10px]">
                        {proc.department}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <FileCheck className="h-3 w-3" />
                        {proc.steps.length} Steps
                      </span>
                    </div>

                    <h3 className="font-semibold text-xs leading-snug line-clamp-2">
                      {proc.title}
                    </h3>

                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                      <span className="font-medium text-foreground">Specimen:</span> {proc.specimen}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                      <span>{proc.comments?.length || 0} Q&A replies</span>
                      <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? "translate-x-0.5 text-primary" : ""}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Active Procedure Detail (8 cols) */}
        <div className={cn("lg:col-span-8 space-y-6", mobilePracticalView === "LIST" ? "hidden lg:block" : "block")}>
              <Button variant="ghost" size="sm" onClick={() => setMobilePracticalView("LIST")} className="lg:hidden text-xs text-primary mb-2 -ml-2">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to All Procedures
              </Button>
          {activeProcedure ? (
            <div className="space-y-6">
              {/* Header Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                        {activeProcedure.department}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {activeProcedure.steps.length} SOP Steps
                      </Badge>
                    </div>

                    {canManage && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(activeProcedure)}
                          className="h-7 text-xs gap-1.5"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(activeProcedure.id, activeProcedure.title)}
                          className="h-7 text-xs text-destructive hover:bg-destructive/10 gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-lg sm:text-xl font-bold mt-2">
                    {activeProcedure.title}
                  </CardTitle>

                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <div>
                      <span className="font-semibold text-foreground">Specimen:</span> {activeProcedure.specimen}
                    </div>
                    {activeProcedure.createdAt && (
                      <div>
                        <span className="font-semibold text-foreground">Published:</span> {activeProcedure.createdAt}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Rejection Criteria Alert */}
                  {activeProcedure.rejectionCriteria && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-foreground flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-red-700 dark:text-red-400">Specimen Rejection Criteria: </span>
                        <span className="text-muted-foreground">{activeProcedure.rejectionCriteria}</span>
                      </div>
                    </div>
                  )}

                  {/* Why & When Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700 dark:text-blue-400">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Why Perform (Clinical Objective)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {activeProcedure.whyPerform}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-teal-500/20 bg-teal-500/5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-teal-700 dark:text-teal-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>When Perform (Clinical Indications)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {activeProcedure.whenPerform}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bench Reagents & Equipment Checklist */}
              {activeProcedure.reagentsAndEquipment.length > 0 && (
                <Card className="border-border">
                  <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Beaker className="h-4 w-4 text-primary" />
                        <CardTitle className="text-xs sm:text-sm font-bold">
                          Required Reagents, Glassware & Instrumentation
                        </CardTitle>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {Object.values(checkedReagents).filter(Boolean).length} / {activeProcedure.reagentsAndEquipment.length} Prepared
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeProcedure.reagentsAndEquipment.map((item, idx) => {
                        const isChecked = !!checkedReagents[idx];
                        return (
                          <label
                            key={idx}
                            onClick={() => toggleReagent(idx)}
                            className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer select-none transition-colors ${
                              isChecked
                                ? "bg-primary/10 border-primary/40 text-foreground"
                                : "bg-card border-border hover:bg-accent text-muted-foreground"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="rounded mt-0.5"
                            />
                            <span className={isChecked ? "line-through opacity-80" : ""}>{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step by Step Execution SOP Guide */}
              <Card className="border-border">
                <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-primary" />
                      <CardTitle className="text-xs sm:text-sm font-bold">
                        Standard Operating Procedure (SOP) Bench Steps
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Step {currentStepIdx + 1} of {activeProcedure.steps.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Current Active Step Highlight */}
                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary tracking-wide uppercase">
                        Active Step {currentStepIdx + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentStepIdx === 0}
                          onClick={() => setCurrentStepIdx((c) => Math.max(0, c - 1))}
                          className="h-7 px-2 text-xs"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentStepIdx >= activeProcedure.steps.length - 1}
                          onClick={() => setCurrentStepIdx((c) => Math.min(activeProcedure.steps.length - 1, c + 1))}
                          className="h-7 px-2 text-xs"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      {activeProcedure.steps[currentStepIdx]}
                    </p>
                  </div>

                  {/* All Steps Roadmap */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Complete Sequence
                    </h4>
                    <div className="space-y-1.5">
                      {activeProcedure.steps.map((step, idx) => (
                        <div
                          key={idx}
                          onClick={() => setCurrentStepIdx(idx)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            currentStepIdx === idx
                              ? "border-primary bg-primary/10 font-semibold"
                              : "border-border bg-card hover:bg-accent/60"
                          }`}
                        >
                          <span
                            className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                              currentStepIdx === idx
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <p className="leading-snug text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* QC, Reference Values & Panic Critical Alerts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* QC and Normal Values */}
                <Card className="border-border">
                  <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border">
                    <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-2">
                      <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Quality Control & Normal Values</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-foreground block mb-0.5">Quality Control Verification:</span>
                      <p className="text-muted-foreground leading-relaxed">{activeProcedure.qualityControl}</p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <span className="font-semibold text-foreground block mb-0.5">Reference / Normal Values:</span>
                      <p className="text-muted-foreground leading-relaxed">{activeProcedure.normalValues}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Critical Alert Panic Values */}
                <Card className="border-red-500/30 bg-red-500/5">
                  <CardHeader className="py-3 px-4 bg-red-500/10 border-b border-red-500/20">
                    <CardTitle className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Panic Values & Critical Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 text-xs space-y-2">
                    <p className="text-foreground leading-relaxed font-medium">
                      {activeProcedure.criticalAlerts}
                    </p>
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-700 dark:text-red-300">
                      <strong>Mandatory Protocol:</strong> Upon identification of any critical value, verify result with second run, double-check sample identity, and immediately telephone the clinical ward or attending consultant with read-back confirmation.
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Video Tutorial (if available) */}
              {activeProcedure.videoUrl && (
                <Card className="border-border">
                  <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        <span>Video Bench Demonstration</span>
                      </CardTitle>
                      <a
                        href={activeProcedure.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Open on YouTube</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5 flex items-center justify-center border border-border">
                      <iframe
                        src={
                          activeProcedure.videoUrl.includes("watch?v=")
                            ? activeProcedure.videoUrl.replace("watch?v=", "embed/")
                            : activeProcedure.videoUrl
                        }
                        title={activeProcedure.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bench Discussion & Trainee Q&A */}
              <Card className="border-border">
                <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <CardTitle className="text-xs sm:text-sm font-bold">
                      Bench Discussion & Trainee Q&A ({activeProcedure.comments?.length || 0})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Comments Feed */}
                  <div className="space-y-3">
                    {activeProcedure.comments && activeProcedure.comments.length > 0 ? (
                      activeProcedure.comments.map((comm) => (
                        <div key={comm.id} className="p-3 rounded-lg border border-border bg-card text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-semibold">
                              <span>{comm.userName}</span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {comm.userRole}
                              </Badge>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{comm.createdAt}</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed pt-0.5">{comm.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-2">
                        No questions asked yet. Be the first to inquire about troubleshooting or technique!
                      </p>
                    )}
                  </div>

                  {/* Comment Input */}
                  <form onSubmit={handlePostComment} className="flex gap-2 pt-2 border-t border-border">
                    <Input
                      placeholder="Ask mentor a question about this procedure..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="text-xs h-9"
                    />
                    <Button type="submit" size="sm" className="h-9 px-3 gap-1 shrink-0">
                      <Send className="h-3.5 w-3.5" />
                      <span>Post</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center text-muted-foreground text-sm">
              Please select a procedure from the list to view its complete SOP.
            </Card>
          )}
        </div>
      </div>

      {/* Add / Edit Procedure Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base">
                {editingId ? "Edit SOP Procedure" : "Add New Practical Procedure"}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Procedure Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Automated ESR Measurement..."
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Blood Banking">Blood Banking</option>
                    <option value="Histopathology">Histopathology</option>
                    <option value="Clinical Pathology">Clinical Pathology</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Required Specimen *</label>
                <Input
                  value={formData.specimen}
                  onChange={(e) => setFormData({ ...formData, specimen: e.target.value })}
                  placeholder="e.g. EDTA Whole Blood (Lavender top)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Why Perform (Clinical Objective)</label>
                  <textarea
                    rows={2}
                    value={formData.whyPerform}
                    onChange={(e) => setFormData({ ...formData, whyPerform: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2 text-xs"
                    placeholder="Clinical purpose..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">When Perform (Timing/Indications)</label>
                  <textarea
                    rows={2}
                    value={formData.whenPerform}
                    onChange={(e) => setFormData({ ...formData, whenPerform: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2 text-xs"
                    placeholder="Patient conditions..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Reagents & Equipment (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.reagentsAndEquipment}
                  onChange={(e) => setFormData({ ...formData, reagentsAndEquipment: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                  placeholder="Leishman Stain working solution&#10;Phosphate Buffer pH 6.8&#10;Glass slides"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Standard Steps (One step per line in execution order) *
                </label>
                <textarea
                  rows={4}
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                  placeholder="Step 1: Place a drop of blood...&#10;Step 2: Spread at 30 degrees angle...&#10;Step 3: Allow to air dry..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Quality Control Criteria</label>
                  <Input
                    value={formData.qualityControl}
                    onChange={(e) => setFormData({ ...formData, qualityControl: e.target.value })}
                    placeholder="QC acceptable standards..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Reference / Normal Values</label>
                  <Input
                    value={formData.normalValues}
                    onChange={(e) => setFormData({ ...formData, normalValues: e.target.value })}
                    placeholder="Normal physiological limits..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Panic Values / Critical Alerts</label>
                  <Input
                    value={formData.criticalAlerts}
                    onChange={(e) => setFormData({ ...formData, criticalAlerts: e.target.value })}
                    placeholder="Immediate notification parameters..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Specimen Rejection Criteria</label>
                  <Input
                    value={formData.rejectionCriteria}
                    onChange={(e) => setFormData({ ...formData, rejectionCriteria: e.target.value })}
                    placeholder="Hemolysis, clotted specimen, etc."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Video Demonstration URL (YouTube)</label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Save Changes" : "Create Procedure"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
