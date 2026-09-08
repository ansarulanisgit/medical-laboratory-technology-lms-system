"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Save,
  Trash2,
  Plus,
  Layers,
  GraduationCap,
  Award,
  BookMarked,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAcademicProfile, SubjectModule, ProgramLevel } from "@/lib/curriculum/academic-context";
import { useNotification } from "@/components/ui/notification-context";
import { getCourseCurriculum, CourseCurriculumDetail, AssessmentScheme, TextbookReference, CurriculumModule } from "@/lib/curriculum/course-details-data";
import { getStoredStudyData, Module as StoreModule } from "@/lib/curriculum/study-center-store";
import { saveStoredCurriculumDetail, deleteStoredCurriculumDetail } from "@/lib/curriculum/course-details-store";
import { cn } from "@/lib/utils";

function CurriculumManageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");
  const editCode = codeParam ? decodeURIComponent(codeParam).toUpperCase() : null;

  const {
    profile,
    coursesCatalog,
    addCurriculumCourse,
    updateCurriculumCourse,
    deleteCurriculumCourse,
  } = useAcademicProfile();
  const { showNotification } = useNotification();

  const currentRole = profile?.role || "STUDENT";
  const isManagementRole = currentRole === "SUPER_ADMIN" || currentRole === "ADMIN" || currentRole === "MENTOR";

  const isEditing = Boolean(editCode);

  // Active form tab
  const [activeTab, setActiveTab] = React.useState<"general" | "assessment" | "competencies" | "curriculum" | "textbooks">("general");

  // Tab 1: General Info
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [program, setProgram] = React.useState<ProgramLevel>("DIPLOMA");
  const [year, setYear] = React.useState("1");
  const [units, setUnits] = React.useState(4);
  const [lessons, setLessons] = React.useState(16);
  const [shortBrief, setShortBrief] = React.useState("");
  const [detailedOverview, setDetailedOverview] = React.useState("");
  const [curriculumVersion, setCurriculumVersion] = React.useState("DMT-2023-V1");
  const [accreditationBody, setAccreditationBody] = React.useState("State Medical Faculty of Bangladesh");

  // Tab 2: Assessment Scheme
  const [totalMarks, setTotalMarks] = React.useState(100);
  const [passPercentage, setPassPercentage] = React.useState(50);
  const [writtenMarks, setWrittenMarks] = React.useState(50);
  const [writtenStructure, setWrittenStructure] = React.useState(
    "Written Paper: 20 Multiple Choice Questions (20 marks) + 5 Structured Essay Questions (30 marks)"
  );
  const [practicalMarks, setPracticalMarks] = React.useState(30);
  const [practicalStructure, setPracticalStructure] = React.useState(
    "OSPE: 5 Active laboratory stations (Spotting, Slide preparation, Reagent preparation, Diagnostic calculation)"
  );
  const [vivaMarks, setVivaMarks] = React.useState(15);
  const [vivaStructure, setVivaStructure] = React.useState(
    "Oral Board Viva Voce conducted by internal and external faculty examiners"
  );
  const [continuousMarks, setContinuousMarks] = React.useState(5);
  const [continuousStructure, setContinuousStructure] = React.useState(
    "Continuous class evaluation, terminal assessments, and clinical practical logbook"
  );

  // Tab 3: Competencies & Objectives
  const [competencies, setCompetencies] = React.useState<string[]>([
    "Understand fundamental clinical principles and diagnostic pathophysiology.",
    "Perform standardized laboratory procedures and biosafety containment with precision.",
    "Evaluate quality control parameters against Westgard multirules and clinical reference intervals.",
    "Master oral viva voce case defenses and written examination question patterns.",
  ]);
  const [newCompetencyInput, setNewCompetencyInput] = React.useState("");

  // Collapsible Topics State
  const [expandedTopics, setExpandedTopics] = React.useState<Record<string, boolean>>(() => ({
    "top-1": true,
  }));

  const toggleTopicCollapse = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const expandAllTopics = () => {
    const all: Record<string, boolean> = {};
    curriculumTopics.forEach((t) => {
      all[t.id] = true;
    });
    setExpandedTopics(all);
  };

  const collapseAllTopics = () => {
    const all: Record<string, boolean> = {};
    curriculumTopics.forEach((t) => {
      all[t.id] = false;
    });
    setExpandedTopics(all);
  };

  // Tab 4: Curriculum (Topics & Lessons)
  interface ManageCurriculumLesson {
    id: string;
    serial: number;
    title: string;
    duration: string;
  }

  interface ManageCurriculumTopic {
    id: string;
    serial: number;
    title: string;
    description: string;
    lessons: ManageCurriculumLesson[];
  }

  const [curriculumTopics, setCurriculumTopics] = React.useState<ManageCurriculumTopic[]>([
    {
      id: "top-1",
      serial: 1,
      title: "Topic 1: Foundational Principles, Terminology & Biological Concepts",
      description: "Basic clinical laboratory theory, biosafety, and foundational scientific principles.",
      lessons: [
        { id: "les-1-1", serial: 1, title: "Cellular Anatomy, Organelles & Membrane Transport", duration: "25 min" },
        { id: "les-1-2", serial: 2, title: "Standard Bench Setup, Biosafety Levels & PPE Protocols", duration: "30 min" },
      ],
    },
    {
      id: "top-2",
      serial: 2,
      title: "Topic 2: Analytical Methods, Specimen Handling & Reagents",
      description: "Phlebotomy, anticoagulant selection, and analytical reagent preparation.",
      lessons: [
        { id: "les-2-1", serial: 1, title: "Specimen Integrity, Anticoagulant Ratios & Pre-Analytical Quality", duration: "25 min" },
        { id: "les-2-2", serial: 2, title: "Standard Reagent Formulation & Calibration Standards", duration: "35 min" },
      ],
    },
  ]);

  // Keep target units and lessons count in sync with curriculum topics
  React.useEffect(() => {
    setUnits(curriculumTopics.length);
    const totalLes = curriculumTopics.reduce((acc, t) => acc + t.lessons.length, 0);
    setLessons(totalLes || 1);
  }, [curriculumTopics]);

  const handleAddTopic = () => {
    const nextSerial = curriculumTopics.length + 1;
    const newTopic: ManageCurriculumTopic = {
      id: `top-${Date.now()}-${nextSerial}`,
      serial: nextSerial,
      title: `Topic ${nextSerial}: New Curriculum Topic`,
      description: "",
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          serial: 1,
          title: `Lesson 1: Fundamental Principles`,
          duration: "25 min",
        },
      ],
    };
    setCurriculumTopics((prev) => [...prev, newTopic]);
    setExpandedTopics((prev) => ({ ...prev, [newTopic.id]: true }));
  };

  const handleDeleteTopic = (topicId: string) => {
    setCurriculumTopics((prev) => {
      const filtered = prev.filter((t) => t.id !== topicId);
      return filtered.map((t, idx) => ({ ...t, serial: idx + 1 }));
    });
  };

  const handleUpdateTopic = (topicId: string, field: "title" | "description" | "serial", value: any) => {
    setCurriculumTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, [field]: value } : t))
    );
  };

  const handleAddLesson = (topicId: string) => {
    setCurriculumTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const nextLesSerial = t.lessons.length + 1;
        const newLesson: ManageCurriculumLesson = {
          id: `les-${Date.now()}-${nextLesSerial}`,
          serial: nextLesSerial,
          title: `Lesson ${nextLesSerial}: New Lesson Title`,
          duration: "25 min",
        };
        return { ...t, lessons: [...t.lessons, newLesson] };
      })
    );
    setExpandedTopics((prev) => ({ ...prev, [topicId]: true }));
  };

  const handleDeleteLesson = (topicId: string, lessonId: string) => {
    setCurriculumTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const filtered = t.lessons.filter((l) => l.id !== lessonId);
        return {
          ...t,
          lessons: filtered.map((l, idx) => ({ ...l, serial: idx + 1 })),
        };
      })
    );
  };

  const handleUpdateLesson = (
    topicId: string,
    lessonId: string,
    field: "title" | "duration" | "serial",
    value: any
  ) => {
    setCurriculumTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          lessons: t.lessons.map((l) => (l.id === lessonId ? { ...l, [field]: value } : l)),
        };
      })
    );
  };

  // Tab 5: Textbooks
  const [textbooks, setTextbooks] = React.useState<TextbookReference[]>([
    {
      title: "Medical Laboratory Technology: Procedure & Interpretation",
      author: "Ramnik Sood",
      edition: "6th Edition",
      type: "Primary Textbook",
      description: "Standard course text covering theoretical pathology, biochemical tests, and bench techniques.",
    },
    {
      title: "District Laboratory Practice in Tropical Countries",
      author: "Monica Cheesbrough",
      edition: "Cambridge University Press",
      type: "Reference Manual",
      description: "Benchmark international practical reference for diagnostic medical laboratory science.",
    },
  ]);
  const [newBookTitle, setNewBookTitle] = React.useState("");
  const [newBookAuthor, setNewBookAuthor] = React.useState("");
  const [newBookEdition, setNewBookEdition] = React.useState("");
  const [newBookType, setNewBookType] = React.useState<"Primary Textbook" | "Reference Manual" | "Laboratory Guide">(
    "Primary Textbook"
  );
  const [newBookDesc, setNewBookDesc] = React.useState("");

  // Save / Delete State
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [savedCourseCode, setSavedCourseCode] = React.useState<string | null>(null);

  // Load existing subject if in edit mode
  React.useEffect(() => {
    if (editCode) {
      const existing = coursesCatalog.find((c) => c.code.toUpperCase() === editCode.toUpperCase());
      const detailed = getCourseCurriculum(editCode);

      if (existing) {
        setCode(existing.code);
        setName(existing.name);
        setProgram(existing.program);
        setYear(existing.year);
        
        setUnits(existing.units);
        setLessons(existing.lessons);
        setShortBrief(existing.description || detailed.shortBrief);
      } else if (detailed) {
        setCode(detailed.code);
        setName(detailed.name);
        setProgram(detailed.program);
        setYear(detailed.year);
        setUnits(detailed.totalUnits);
        setLessons(detailed.totalLessons);
        setShortBrief(detailed.shortBrief);
      }

      if (detailed) {
        setDetailedOverview(detailed.detailedOverview || "");
        setCurriculumVersion(detailed.curriculumVersion || (detailed.program === "BSC" ? "BSC-LT-2024-V2" : "DMT-2023-V1"));
        setAccreditationBody(detailed.accreditationBody || "State Medical Faculty of Bangladesh");

        if (detailed.assessment) {
          setTotalMarks(detailed.assessment.totalMarks || 100);
          setPassPercentage(detailed.assessment.passPercentage || 50);
          setWrittenMarks(detailed.assessment.writtenExamMarks || 50);
          setWrittenStructure(detailed.assessment.writtenExamStructure || "");
          setPracticalMarks(detailed.assessment.practicalMarks || 30);
          setPracticalStructure(detailed.assessment.practicalOSPEStructure || "");
          setVivaMarks(detailed.assessment.vivaMarks || 15);
          setVivaStructure(detailed.assessment.vivaStructure || "");
          setContinuousMarks(detailed.assessment.continuousAssessmentMarks || 5);
          setContinuousStructure(detailed.assessment.continuousStructure || "");
        }

        if (detailed.courseAims && detailed.courseAims.length > 0) {
          setCompetencies(detailed.courseAims);
        }

        if (detailed.textbooks && detailed.textbooks.length > 0) {
          setTextbooks(detailed.textbooks);
        }
      }

        // Load existing curriculum syllabus topics exclusively from detailed course curriculum specifications
        const sourceModules = detailed?.modules || [];

        if (sourceModules && sourceModules.length > 0) {
          const loaded: ManageCurriculumTopic[] = sourceModules.map((mod: any, mIdx: number) => {
            const allLessons = (mod.subModules || []).flatMap((sm: any) => sm.lessons || []);
            return {
              id: mod.id || `top-${mIdx + 1}`,
              serial: mod.unitNumber || mIdx + 1,
              title: mod.title,
              description: mod.description || "",
              lessons: allLessons.length > 0
                ? allLessons.map((les: any, lIdx: number) => ({
                    id: les.id || `les-${mIdx + 1}-${lIdx + 1}`,
                    serial: lIdx + 1,
                    title: les.title,
                    duration: les.duration || "25 min",
                  }))
                : [
                    {
                      id: `les-${mIdx + 1}-1`,
                      serial: 1,
                      title: `Lesson 1: Fundamental Principles`,
                      duration: "25 min",
                    },
                  ],
            };
          });
          setCurriculumTopics(loaded);
          if (loaded.length > 0) {
            setExpandedTopics({ [loaded[0].id]: true });
          }
        }
    }
  }, [editCode, coursesCatalog]);

  // Adjust default version and accreditation when program changes
  const handleProgramChange = (newProgram: ProgramLevel) => {
    setProgram(newProgram);
    if (!isEditing) {
      if (newProgram === "BSC") {
        setCurriculumVersion("BSC-LT-2024-V2");
        setAccreditationBody("Faculty of Allied Health Sciences, University Curriculum");
      } else {
        setCurriculumVersion("DMT-2023-V1");
        setAccreditationBody("State Medical Faculty of Bangladesh");
      }
    }
  };

  // Add Competency
  const handleAddCompetency = () => {
    if (!newCompetencyInput.trim()) return;
    setCompetencies((prev) => [...prev, newCompetencyInput.trim()]);
    setNewCompetencyInput("");
  };

  // Remove Competency
  const handleRemoveCompetency = (index: number) => {
    setCompetencies((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Textbook
  const handleAddTextbook = () => {
    if (!newBookTitle.trim() || !newBookAuthor.trim()) return;
    setTextbooks((prev) => [
      ...prev,
      {
        title: newBookTitle.trim(),
        author: newBookAuthor.trim(),
        edition: newBookEdition.trim() || "Standard Edition",
        type: newBookType,
        description: newBookDesc.trim() || "Prescribed reference manual for diagnostic curriculum.",
      },
    ]);
    setNewBookTitle("");
    setNewBookAuthor("");
    setNewBookEdition("");
    setNewBookDesc("");
  };

  // Remove Textbook
  const handleRemoveTextbook = (index: number) => {
    setTextbooks((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      showNotification({
        title: "Validation Error",
        message: "Course Code is required (e.g. HEM-201).",
        type: "error",
      });
      setActiveTab("general");
      return;
    }

    if (!name.trim()) {
      showNotification({
        title: "Validation Error",
        message: "Course Title / Subject Name is required.",
        type: "error",
      });
      setActiveTab("general");
      return;
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();

    setIsSubmitting(true);

    try {
      // 1. Prepare Base Subject Module for Catalog
      const subjectData: SubjectModule = {
        code: cleanCode,
        name: cleanName,
        program,
        year,
        
        units: Number(units) || 4,
        lessons: Number(lessons) || 16,
        progress: 0,
        description: shortBrief.trim() || `${cleanName} course in Medical Laboratory Technology.`,
      };

      // 2. Prepare Detailed Curriculum Object
      const assessmentData: AssessmentScheme = {
        totalMarks: Number(totalMarks) || 100,
        passPercentage: Number(passPercentage) || 50,
        writtenExamMarks: Number(writtenMarks) || 50,
        writtenExamStructure: writtenStructure.trim(),
        practicalMarks: Number(practicalMarks) || 30,
        practicalOSPEStructure: practicalStructure.trim(),
        vivaMarks: Number(vivaMarks) || 15,
        vivaStructure: vivaStructure.trim(),
        continuousAssessmentMarks: Number(continuousMarks) || 5,
        continuousStructure: continuousStructure.trim(),
      };

      // 2.5 Compile Curriculum Topics & Lessons into detailed modules
      const generatedModules: CurriculumModule[] = curriculumTopics.map((top) => ({
        id: top.id,
        unitNumber: top.serial,
        title: top.title,
        description: top.description || `Module ${top.serial} comprehensive curriculum scope.`,
        learningOutcomes: [
          `Master core theoretical and clinical fundamentals of ${top.title}.`,
          "Perform practical procedures with adherence to laboratory biosafety.",
          "Evaluate diagnostic laboratory results against standard reference intervals.",
        ],
        subModules: [
          {
            id: `${top.id}-comp-1`,
            title: `Component ${top.serial}.1: Core Theoretical & Analytical Framework`,
            topics: top.lessons.map((l) => l.title),
            lessons: top.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              duration: l.duration || "25 min",
              keyCompetencies: ["Standard SOP execution", "Analytical precision"],
            })),
          },
        ],
      }));



      const detailedData: Partial<CourseCurriculumDetail> = {
        modules: generatedModules,
        code: cleanCode,
        name: cleanName,
        program,
        year,
        curriculumVersion,
        accreditationBody,
        shortBrief: shortBrief.trim() || `${cleanName} course in Medical Laboratory Technology.`,
        detailedOverview: detailedOverview.trim() || `${cleanName} provides comprehensive clinical training mapped to official medical technology syllabus requirements.`,
        courseAims: competencies,
        totalUnits: Number(units) || 4,
        totalLessons: Number(lessons) || 16,
        assessment: assessmentData,
        textbooks,
      };

      // 3. Save to Persistent Stores
      saveStoredCurriculumDetail(cleanCode, detailedData);

      if (isEditing) {
        updateCurriculumCourse(cleanCode, subjectData);
        showNotification({
          title: "Curriculum Updated",
          message: `Subject ${cleanCode}: "${cleanName}" has been successfully updated in real time.`,
          type: "success",
        });
      } else {
        const res = addCurriculumCourse(subjectData);
        if (!res.success) {
          showNotification({
            title: "Course Code Error",
            message: res.error || "A subject with this code already exists.",
            type: "error",
          });
          setIsSubmitting(false);
          return;
        }
        showNotification({
          title: "Subject Created Successfully",
          message: `Subject ${cleanCode} is now live in Curriculum and available in the Study Center!`,
          type: "success",
        });
      }

      setSavedCourseCode(cleanCode);
    } catch (err) {
      showNotification({
        title: "Save Failed",
        message: "An unexpected error occurred while saving the subject.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = () => {
    if (!editCode) return;

    deleteCurriculumCourse(editCode);
    deleteStoredCurriculumDetail(editCode);

    showNotification({
      title: "Subject Deleted",
      message: `Course ${editCode} has been permanently deleted from curriculum.`,
      type: "warning",
    });

    router.push("/student/curriculum");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/student/curriculum"
              className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-primary/10 text-primary inline-flex">
                <BookOpen className="h-5 w-5" />
              </span>
              <span>{isEditing ? `Edit Subject: ${editCode}` : "Add New Curriculum Subject"}</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground pl-10 font-normal">
            Define accredited subjects, examination marks distribution, clinical competencies, and prescribed literature.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-10 sm:pl-0">
          <Link
            href="/student/curriculum"
            onClick={(e) => {
              e.preventDefault();
              router.push("/student/curriculum");
            }}
            className="inline-flex items-center justify-center text-xs h-9 px-3.5 rounded-xl border border-border/80 hover:bg-muted font-medium bg-card text-foreground cursor-pointer transition-colors"
          >
            Cancel
          </Link>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-xs h-9 px-3.5 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 font-medium"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete Subject
            </Button>
          )}
        </div>
      </div>

      {/* Permission Warning for Non-Management Users */}
      {!isManagementRole && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="font-semibold block">Curriculum Governance Restricted</strong>
            <span>
              You are currently viewing this page with role <span className="font-mono font-bold uppercase">{currentRole}</span>. Changes are reserved for Faculty Admins and Super Administrators.
            </span>
          </div>
        </div>
      )}

      {/* Post-Save Success Modal / Action Dialog */}
      {savedCourseCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-4 sm:p-6 space-y-4 my-6">
            <div className="flex items-center gap-3 text-primary">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Subject Published Successfully</h3>
                <p className="text-xs text-muted-foreground">Code: <span className="font-mono font-semibold text-primary">{savedCourseCode}</span></p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              This subject is now active in the curriculum catalog and immediately available in the <strong>Study Center</strong> to build interactive topics, lectures, quizzes, and clinical notes.
            </p>

            <div className="space-y-2 pt-2">
              <Link
                href={`/student/study-center?subject=${savedCourseCode}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/student/study-center?subject=${savedCourseCode}`);
                }}
                className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs h-10 px-4 font-semibold shadow-xs cursor-pointer transition-colors"
              >
                <Layers className="h-4 w-4 mr-2" />
                <span>Open in Study Center to Build Course Content</span>
                <ArrowRight className="h-3.5 w-3.5 ml-auto" />
              </Link>
              <Link
                href={`/student/curriculum/${savedCourseCode}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/student/curriculum/${savedCourseCode}`);
                }}
                className="w-full inline-flex items-center justify-center rounded-xl text-xs h-9 px-4 font-medium border border-border/80 hover:bg-muted/60 text-foreground cursor-pointer transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                <span>View Full Curriculum Syllabus</span>
              </Link>
              <Link
                href="/student/curriculum"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/student/curriculum");
                }}
                className="w-full inline-flex items-center justify-center rounded-xl text-xs h-9 px-4 font-normal text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <span>Return to All Subjects</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Multi-Tab Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-muted/40 border border-border/80 overflow-x-auto">
          {[
            { id: "general", label: "1. General & Classification", icon: GraduationCap },
            { id: "assessment", label: "2. Assessment Scheme", icon: Award },
            { id: "competencies", label: "3. Learning Competencies", icon: CheckCircle2 },
            { id: "curriculum", label: "4. Curriculum", icon: Layers },
            { id: "textbooks", label: "5. Prescribed Textbooks", icon: BookMarked },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: General & Classification */}
        {activeTab === "general" && (
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>Course Program, Stage & Identification</span>
              </CardTitle>
              <CardDescription className="text-xs font-normal">
                Select the academic track, stage, and primary metadata for this medical laboratory subject.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* 1. Program Track */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    <span>Course Program Track *</span>
                  </label>
                  <select
                    value={program}
                    onChange={(e) => handleProgramChange(e.target.value as ProgramLevel)}
                    className="flex min-h-[42px] w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="DIPLOMA">Diploma in Medical Laboratory Technology (4 Years)</option>
                    <option value="BSC">B.Sc. in Health Technology (Laboratory) (4 Years)</option>
                  </select>
                </div>

                {/* 2. Academic Year */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Academic Year *</span>
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="flex min-h-[42px] w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                {/* 4. Subject Code */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>Course / Subject Code *</span>
                  </label>
                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HEM-201, CC-301"
                    required
                    className="rounded-xl min-h-[42px] text-xs font-mono font-semibold uppercase"
                  />
                </div>

                {/* 5. Subject Name */}
                <div className="space-y-1 sm:col-span-2 md:col-span-3">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    <span>Course Title / Subject Name *</span>
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Clinical Pathology & Haematology"
                    required
                    className="rounded-xl min-h-[42px] text-xs font-normal"
                  />
                </div>

                {/* 6. Target Units */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    <span>Target Topics</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="15"
                    value={units}
                    onChange={(e) => setUnits(parseInt(e.target.value, 10) || 1)}
                    className="rounded-xl min-h-[42px] text-xs font-normal"
                  />
                </div>

                {/* 7. Target Lessons */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Target Lessons Count</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={lessons}
                    onChange={(e) => setLessons(parseInt(e.target.value, 10) || 1)}
                    className="rounded-xl min-h-[42px] text-xs font-normal"
                  />
                </div>

                {/* 8. Curriculum Version Code */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Curriculum Version</label>
                  <Input
                    type="text"
                    value={curriculumVersion}
                    onChange={(e) => setCurriculumVersion(e.target.value)}
                    placeholder="e.g. DMT-2023-V1"
                    className="rounded-xl min-h-[42px] text-xs font-mono"
                  />
                </div>

                {/* 9. Accreditation Body */}
                <div className="space-y-1 sm:col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-foreground">Accreditation Body</label>
                  <Input
                    type="text"
                    value={accreditationBody}
                    onChange={(e) => setAccreditationBody(e.target.value)}
                    placeholder="e.g. State Medical Faculty of Bangladesh"
                    className="rounded-xl min-h-[42px] text-xs font-normal"
                  />
                </div>
              </div>

              {/* 10. Short Brief Description */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-medium text-foreground">
                  Short Brief / Syllabus Summary (Shown on Course Cards)
                </label>
                <textarea
                  rows={2}
                  value={shortBrief}
                  onChange={(e) => setShortBrief(e.target.value)}
                  placeholder="e.g. Routine examination of urine, stool, body fluids, blood cell counts, Hb, ESR, PCV, peripheral blood film, and coagulation."
                  className="flex w-full rounded-xl border border-input bg-background p-3 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                />
              </div>

              {/* 11. Detailed Overview */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Detailed Clinical Overview (Shown on Full Syllabus Page)
                </label>
                <textarea
                  rows={3}
                  value={detailedOverview}
                  onChange={(e) => setDetailedOverview(e.target.value)}
                  placeholder="Describe the clinical rationale, laboratory practice scope, and diagnostic relevance of this subject..."
                  className="flex w-full rounded-xl border border-input bg-background p-3 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: Assessment Scheme */}
        {activeTab === "assessment" && (
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span>Marks Distribution & Official Examination Scheme</span>
              </CardTitle>
              <CardDescription className="text-xs font-normal">
                Define the written theory, practical OSPE stations, board viva voce, and continuous internal evaluation weighting.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/25 border border-border/60">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Total Course Marks</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(parseInt(e.target.value, 10) || 100)}
                      className="rounded-xl h-9 text-xs font-bold font-mono"
                    />
                    <span className="text-xs font-semibold text-muted-foreground">Marks</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Minimum Pass Requirement</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={passPercentage}
                      onChange={(e) => setPassPercentage(parseInt(e.target.value, 10) || 50)}
                      className="rounded-xl h-9 text-xs font-bold font-mono"
                    />
                    <span className="text-xs font-semibold text-muted-foreground">%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Theory vs Practical Ratio</span>
                  <div className="text-xs font-semibold text-foreground mt-2">
                    Theory: {writtenMarks}m | Practical: {practicalMarks}m
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Viva + Continuous</span>
                  <div className="text-xs font-semibold text-foreground mt-2">
                    Viva: {vivaMarks}m | Continuous: {continuousMarks}m
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Written Exam */}
                <div className="p-4 rounded-xl border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      Written Theory Exam
                    </strong>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={writtenMarks}
                        onChange={(e) => setWrittenMarks(parseInt(e.target.value, 10) || 0)}
                        className="rounded-lg h-7 w-16 text-xs text-right font-mono"
                      />
                      <span className="text-[11px] text-muted-foreground">Marks</span>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={writtenStructure}
                    onChange={(e) => setWrittenStructure(e.target.value)}
                    placeholder="e.g. Paper I: 20 MCQs (20 marks) + 5 Short Essay Questions (30 marks)"
                    className="flex w-full rounded-xl border border-input bg-background p-2.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Practical / OSPE */}
                <div className="p-4 rounded-xl border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      Practical / OSPE Stations
                    </strong>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={practicalMarks}
                        onChange={(e) => setPracticalMarks(parseInt(e.target.value, 10) || 0)}
                        className="rounded-lg h-7 w-16 text-xs text-right font-mono"
                      />
                      <span className="text-[11px] text-muted-foreground">Marks</span>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={practicalStructure}
                    onChange={(e) => setPracticalStructure(e.target.value)}
                    placeholder="e.g. OSPE: 5 active laboratory stations (Spotting, Slide preparation, Reagent preparation, Diagnostic calculation)"
                    className="flex w-full rounded-xl border border-input bg-background p-2.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Viva Voce */}
                <div className="p-4 rounded-xl border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      Oral Board Viva Voce
                    </strong>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={vivaMarks}
                        onChange={(e) => setVivaMarks(parseInt(e.target.value, 10) || 0)}
                        className="rounded-lg h-7 w-16 text-xs text-right font-mono"
                      />
                      <span className="text-[11px] text-muted-foreground">Marks</span>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={vivaStructure}
                    onChange={(e) => setVivaStructure(e.target.value)}
                    placeholder="e.g. Oral board viva voce conducted by internal and external faculty examiners"
                    className="flex w-full rounded-xl border border-input bg-background p-2.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Continuous Assessment */}
                <div className="p-4 rounded-xl border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Continuous Assessment & Logbook
                    </strong>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={continuousMarks}
                        onChange={(e) => setContinuousMarks(parseInt(e.target.value, 10) || 0)}
                        className="rounded-lg h-7 w-16 text-xs text-right font-mono"
                      />
                      <span className="text-[11px] text-muted-foreground">Marks</span>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={continuousStructure}
                    onChange={(e) => setContinuousStructure(e.target.value)}
                    placeholder="e.g. Continuous class evaluation, terminal assessments, and clinical practical logbook"
                    className="flex w-full rounded-xl border border-input bg-background p-2.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: Learning Competencies */}
        {activeTab === "competencies" && (
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Clinical Competencies & Learning Objectives</span>
              </CardTitle>
              <CardDescription className="text-xs font-normal">
                Define the core diagnostic skills, laboratory proficiencies, and theoretical mastery required to pass.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              {/* Existing Competencies List */}
              <div className="space-y-2">
                {competencies.map((comp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/60 group"
                  >
                    <div className="flex items-start gap-2.5 text-xs text-foreground">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary font-bold text-[10.5px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{comp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompetency(idx)}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Remove Competency"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Competency */}
              <div className="flex items-center gap-2 pt-2">
                <Input
                  type="text"
                  value={newCompetencyInput}
                  onChange={(e) => setNewCompetencyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCompetency();
                    }
                  }}
                  placeholder="Type a new clinical competency objective and press Enter..."
                  className="rounded-xl min-h-[42px] text-xs font-normal flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCompetency}
                  className="rounded-xl min-h-[42px] px-4 text-xs font-medium border-border/80"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Objective
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

                {/* TAB 4: Curriculum Structure (Topics & Lessons) */}
        {activeTab === "curriculum" && (
          <Card className="rounded-2xl border-border/80 shadow-xs space-y-6">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span>Curriculum Topics & Lessons</span>
                    <Badge variant="filled" className="text-[10px] font-semibold py-0.5">
                      {curriculumTopics.length} Topics • {lessons} Lessons
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Define numbered curriculum topics. Multiple sequential lessons can be added under each topic.
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={expandAllTopics}
                    className="h-9 text-xs rounded-xl border-border/80 text-muted-foreground hover:text-foreground font-medium cursor-pointer"
                  >
                    Expand All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={collapseAllTopics}
                    className="h-9 text-xs rounded-xl border-border/80 text-muted-foreground hover:text-foreground font-medium cursor-pointer"
                  >
                    Collapse All
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddTopic}
                    className="bg-primary text-primary-foreground text-xs rounded-xl h-9 px-4 font-semibold shadow-2xs hover:opacity-90 active:scale-95 cursor-pointer shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Topic
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              {curriculumTopics.map((topic, tIdx) => {
                const isTopicExpanded = !!expandedTopics[topic.id];
                return (
                  <div
                    key={topic.id}
                    className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all space-y-4 shadow-2xs"
                  >
                    {/* Topic Header: Serial, Title, Actions */}
                    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-3", isTopicExpanded && "pb-3 border-b border-border/70")}>
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className="text-xs font-semibold text-muted-foreground">Serial:</span>
                          <input
                            type="number"
                            value={topic.serial}
                            onChange={(e) => handleUpdateTopic(topic.id, "serial", Number(e.target.value) || 1)}
                            className="w-12 h-8 text-center text-xs font-mono font-bold rounded-lg border border-border bg-background"
                            min="1"
                          />
                        </div>
                        <Input
                          value={topic.title}
                          onChange={(e) => handleUpdateTopic(topic.id, "title", e.target.value)}
                          placeholder="e.g. Topic 1: Foundational Principles & Specimen Governance"
                          className="h-9 text-xs font-semibold rounded-xl flex-1 min-w-0"
                        />
                        {!isTopicExpanded && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground shrink-0 font-normal">
                            {topic.lessons.length} Lessons
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddLesson(topic.id)}
                          className="h-8 text-xs rounded-xl border-primary/40 text-primary hover:bg-primary/10 font-semibold cursor-pointer"
                          title="Add a lesson under this topic"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Lesson
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="h-8 w-8 p-0 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          title="Delete Topic"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => toggleTopicCollapse(topic.id)}
                          className="h-8 px-2.5 text-xs rounded-xl border-border/80 text-muted-foreground hover:text-foreground font-medium flex items-center gap-1.5 cursor-pointer"
                          title={isTopicExpanded ? "Collapse Topic" : "Expand Topic"}
                        >
                          <span className="text-[11px] hidden sm:inline">
                            {isTopicExpanded ? "Collapse" : "Expand"}
                          </span>
                          {isTopicExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Topic Accordion Body */}
                    {isTopicExpanded && (
                      <div className="space-y-4 pt-1 animate-in fade-in">
                        {/* Topic Scope / Description */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-muted-foreground">
                            Topic Scope / Brief Clinical Description:
                          </label>
                          <Input
                            value={topic.description}
                            onChange={(e) => handleUpdateTopic(topic.id, "description", e.target.value)}
                            placeholder="Brief overview of the practical and theoretical concepts covered in this topic..."
                            className="h-8 text-xs rounded-xl font-normal"
                          />
                        </div>

                        {/* Lessons Under this Topic */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Lessons Under This Topic ({topic.lessons.length})
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Multiple lessons can be added under each topic
                            </span>
                          </div>

                          <div className="space-y-2">
                            {topic.lessons.map((les, lIdx) => (
                              <div
                                key={les.id}
                                className="p-3 rounded-xl border border-border/70 bg-muted/20 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                              >
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-[10px] font-bold shrink-0">
                                    {topic.serial}.{les.serial}
                                  </span>
                                  <Input
                                    value={les.title}
                                    onChange={(e) => handleUpdateLesson(topic.id, les.id, "title", e.target.value)}
                                    placeholder="e.g. Lesson 1: Cellular Architecture & Osmotic Fragility"
                                    className="h-8 text-xs rounded-lg flex-1 min-w-0"
                                  />
                                </div>

                                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                                  <div className="flex items-center space-x-1 shrink-0">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <Input
                                      value={les.duration}
                                      onChange={(e) => handleUpdateLesson(topic.id, les.id, "duration", e.target.value)}
                                      placeholder="25 min"
                                      className="w-18 h-8 text-xs font-mono rounded-lg text-center"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteLesson(topic.id, les.id)}
                                    className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                    title="Delete Lesson"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddLesson(topic.id)}
                            className="w-full h-8 text-xs border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 font-medium cursor-pointer"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Another Lesson to Topic {topic.serial}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add New Topic CTA Button */}
              <button
                type="button"
                onClick={handleAddTopic}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.02] hover:bg-primary/[0.05] hover:border-primary transition-all flex items-center justify-center gap-2 text-xs font-semibold text-primary cursor-pointer active:scale-98"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add New Curriculum Topic
              </button>
            </CardContent>
          </Card>
        )}

        {/* TAB 5: Prescribed Textbooks */}
        {activeTab === "textbooks" && (
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BookMarked className="h-4 w-4 text-primary" />
                <span>Prescribed Textbooks & Laboratory Manuals</span>
              </CardTitle>
              <CardDescription className="text-xs font-normal">
                Standard reference literature prescribed by the faculty curriculum committee.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              {/* Existing Textbooks List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {textbooks.map((book, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-muted/30 border border-border/60 relative group space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <strong className="text-xs font-semibold text-foreground block">{book.title}</strong>
                        <span className="text-[11px] text-muted-foreground block">
                          Author(s): {book.author} • {book.edition}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTextbook(idx)}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Remove Textbook"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="blue" className="text-[10px] font-medium">
                        {book.type}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground line-clamp-1">{book.description}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Textbook Form Box */}
              <div className="p-4 rounded-xl border border-dashed border-border/80 bg-card/40 space-y-3 pt-3">
                <span className="text-xs font-semibold text-foreground block">Add New Prescribed Book / Manual</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <Input
                    type="text"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    placeholder="Book Title (e.g. Ramnik Sood MLT)"
                    className="rounded-xl min-h-[38px] text-xs font-normal"
                  />
                  <Input
                    type="text"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    placeholder="Author(s)"
                    className="rounded-xl min-h-[38px] text-xs font-normal"
                  />
                  <Input
                    type="text"
                    value={newBookEdition}
                    onChange={(e) => setNewBookEdition(e.target.value)}
                    placeholder="Edition (e.g. 6th Edition)"
                    className="rounded-xl min-h-[38px] text-xs font-normal"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={newBookType}
                    onChange={(e) => setNewBookType(e.target.value as any)}
                    className="flex min-h-[38px] w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Primary Textbook">Primary Textbook</option>
                    <option value="Reference Manual">Reference Manual</option>
                    <option value="Laboratory Guide">Laboratory Guide</option>
                  </select>
                  <Input
                    type="text"
                    value={newBookDesc}
                    onChange={(e) => setNewBookDesc(e.target.value)}
                    placeholder="Syllabus usage / key chapters covered"
                    className="rounded-xl min-h-[38px] text-xs font-normal"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTextbook}
                  className="rounded-xl min-h-[38px] text-xs font-medium border-border/80"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Book to Syllabus
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 3. Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/80">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>
              Saving will update the official curriculum catalog and publish this subject into the Study Center immediately.
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/student/curriculum"
              onClick={(e) => {
                e.preventDefault();
                router.push("/student/curriculum");
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center text-xs min-h-[42px] px-5 rounded-xl border border-border/80 hover:bg-muted font-medium bg-card text-foreground cursor-pointer transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial text-xs min-h-[42px] px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-xs"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving Curriculum..." : isEditing ? "Save & Update Subject" : "Save & Publish Subject"}
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card rounded-2xl border border-destructive/30 shadow-2xl p-4 sm:p-6 space-y-4 my-6">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Confirm Subject Deletion</h3>
                <p className="text-xs text-muted-foreground">Permanent removal from Curriculum & Study Center</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">{editCode}</strong>? This action will remove the course from the catalog and any student enrollment tracks.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="rounded-xl text-xs h-9 px-4 border-border/80"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                className="rounded-xl text-xs h-9 px-4 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
              >
                Yes, Delete Subject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CurriculumManagePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground text-sm">Loading Curriculum Authoring...</div>}>
      <CurriculumManageContent />
    </React.Suspense>
  );
}
