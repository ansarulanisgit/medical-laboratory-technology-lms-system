"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Award,
  History,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Microscope,
  ChevronRight,
  Maximize2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Clock,
  BookMarked,
  MessageSquare,
  ShieldCheck,
  FlaskConical,
  Check,
  PlusCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Video,
  Image as ImageIcon,
  Paperclip,
  ExternalLink,
  Send,
  RotateCcw,
  FileSpreadsheet,
  FileCode,
  LayoutGrid,
  Search,
  Sliders,
  Settings,
  Database,
  ArrowUpRight,
} from "lucide-react";
import {
  useAcademicProfile,
  SubjectModule,
  ProgramLevel,
} from "@/lib/curriculum/academic-context";
import { getCourseCurriculum } from "@/lib/curriculum/course-details-data";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/components/ui/notification-context";
import { LessonDiscussionTab } from "@/components/study-center/lesson-discussion-tab";
import {
  Module,
  SubModule,
  LessonContent,
  LessonAttachment,
  LessonImage,
  LessonVideo,
  LessonQA,
  LessonQuiz,
  QuizQuestionType,
  LessonVivaQA,
  LessonPreviousQuestion,
  getStoredStudyData,
  saveStoredStudyData,
  deleteStoredStudySubject,
  generateCourseModulesFromCurriculum,
  formatTopicTitle,
  INITIAL_STUDY_CENTER_DATA,
} from "@/lib/curriculum/study-center-store";
import { cn } from "@/lib/utils";

// Generator for catalog subjects that do not have manually curated data
function generateDynamicStudyData(courseCode: string): Module[] {
  const detail = getCourseCurriculum(courseCode);
  return detail.modules.map((m, mIdx) => ({
    id: m.id || `${courseCode.toLowerCase()}-mod-${mIdx + 1}`,
    unitNumber: m.unitNumber,
    title: formatTopicTitle(m.title, m.unitNumber),
    description: m.description,
    subModules: m.subModules.map((sm, smIdx) => ({
      id: sm.id || `${courseCode.toLowerCase()}-sub-${mIdx + 1}-${smIdx + 1}`,
      title: sm.title.replace(/^Sub-Module\s+/i, "Component "),
      lessons: sm.lessons.map((les, lIdx) => ({
        id: les.id || `${courseCode.toLowerCase()}-les-${mIdx + 1}-${smIdx + 1}-${lIdx + 1}`,
        title: les.title,
        duration: les.duration || "25 min",
        lectureText: `## ${les.title} - Official Clinical Syllabus Lecture\n\nThis comprehensive lecture covers analytical methodology, clinical laboratory correlations, and standardized testing guidelines prescribed by the ${detail.accreditationBody} curriculum.\n\n### 1. Clinical & Diagnostic Significance\n${les.title} forms an indispensable component of clinical laboratory practice. Trainees must understand specimen integrity, correct patient preparation, anticoagulant or preservative selection, and specimen rejection criteria.\n\n### 2. Analytical Fundamentals & Standard Operating Procedures\nStrict adherence to standard calibration curves, internal quality control (IQC) procedures, and diagnostic verification ensures reproducibility and clinical reliability of patient test reports.`,
        notes: [
          `${les.title} covers essential diagnostic concepts, specimen requirements, and analytical methodologies specified by the ${detail.accreditationBody} syllabus.`,
          `Laboratory execution requires strict compliance with internal quality control protocols, verification of calibration standard curves, and monitoring for pre-analytical variables.`,
          les.practicalComponent
            ? `Practical Bench Focus: ${les.practicalComponent}`
            : "Practical Competencies: Standardized pipetting, reagent preparation, and analytical verification.",
          `Key Clinical Competencies: ${les.keyCompetencies.join(", ")}.`,
        ],
        benchAlert: `Ensure patient identification is cross-verified and calibration controls (normal and pathological) fall within ±2 SD of target limits before releasing results.`,
        attachments: [
          {
            id: `att-${mIdx}-${smIdx}-${lIdx}-1`,
            name: `SOP_${courseCode}_${les.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
            fileType: "SOP",
            fileSize: "1.8 MB",
            url: "#",
          },
          {
            id: `att-${mIdx}-${smIdx}-${lIdx}-2`,
            name: `${courseCode}_Bench_Reference_Guide.pdf`,
            fileType: "PDF",
            fileSize: "2.4 MB",
            url: "#",
          },
        ],
        images: [
          {
            id: `img-${mIdx}-${smIdx}-${lIdx}-1`,
            title: `${les.title} - Diagnostic Bench Setup & Flowchart`,
            caption: `Standard diagnostic bench microscopy and analytical workflow diagram for ${les.title}.`,
            url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
          },
        ],
        videos: [
          {
            id: `vid-${mIdx}-${smIdx}-${lIdx}-1`,
            title: `Clinical Practical Video: ${les.title}`,
            duration: "18 min",
            url: "https://www.youtube.com/embed/fR3NxCR9z2U",
            description: `Laboratory instructor demonstration covering equipment setup, reagent addition, and analytical measurement for ${les.title}.`,
          },
        ],
        qas: [
          {
            id: `qa-${mIdx}-${smIdx}-${lIdx}-1`,
            question: `What are the critical pre-analytical precautions when performing tests for ${les.title}?`,
            answer: `Ensure specimen is unhemolyzed, collected in the proper anticoagulant tube, mixed by gentle inversion 8-10 times, and centrifuged at 3000 RPM for 10 minutes within 1 hour of phlebotomy.`,
            askedBy: "Clinical Trainee Query",
            category: "Pre-Analytical",
          },
        ],
        quizzes: [
          {
            question: `In clinical laboratory quality control for ${detail.name}, what indicates an analytical run rejection under Westgard Rules?`,
            options: [
              "1(2s) warning rule violation",
              "1(3s) rule violation where a single control exceeds ±3 SD",
              "Consecutive controls fluctuating around the mean",
              "A control value exactly at the target mean",
            ],
            correctIndex: 1,
            explanation: "Under Westgard Multirules, a 1(3s) violation indicates high random or severe systematic error and mandates analytical run rejection and investigation.",
          },
        ],
        vivaQAs: [
          {
            question: `What are the critical pre-analytical factors affecting ${les.title}?`,
            answer: `Pre-analytical errors account for over 65% of all laboratory discrepancies: incorrect patient identification, hemolysis, lipemia, improper anticoagulant ratio, delay in centrifugation, and improper storage temperature.`,
            frequentlyAskedIn: `${detail.accreditationBody} Annual Board Examination Viva Voce`,
          },
        ],
        previousQuestions: [
          {
            year: "2024",
            exam: `${detail.accreditationBody} - Official Examination`,
            questionText: `Discuss the clinical principle, diagnostic importance, and quality control of ${les.title}. (Marks: 6)`,
            modelAnswer: `1. Principle: Formulate standard analytical methodology following national SOP. 2. Diagnostic Importance: Correlate patient biomarker levels with clinical pathophysiology. 3. QC: Run two levels of controls, plot on Levy-Jennings chart, and resolve any Westgard rule alerts.`,
            marks: 6,
          },
        ],
      })),
    })),
  }));
}

function getSubjectStudyModules(code: string, customMap?: Record<string, Module[]>): Module[] {
  if (customMap && customMap[code] && customMap[code].length > 0) {
    return customMap[code];
  }
  if (INITIAL_STUDY_CENTER_DATA[code]) {
    return INITIAL_STUDY_CENTER_DATA[code];
  }
  return generateDynamicStudyData(code);
}

function StudyCenterContent() {
  const searchParams = useSearchParams();
  const initialSubjectParam = searchParams.get("subject");
  const initialModeParam = searchParams.get("mode");

  const {
    profile,
    coursesCatalog,
    addCurriculumCourse,
    updateCurriculumCourse,
    deleteCurriculumCourse,
  } = useAcademicProfile();
  const { showNotification } = useNotification();

  const currentRole = profile.role || "STUDENT";
  const isManagementRole =
    currentRole === "SUPER_ADMIN" || currentRole === "ADMIN" || currentRole === "MENTOR";

  // Persistent study center data map
  const [studyMap, setStudyMap] = React.useState<Record<string, Module[]>>({});

  React.useEffect(() => {
    setStudyMap(getStoredStudyData());
  }, []);

  const persistStudyMap = (newMap: Record<string, Module[]>) => {
    setStudyMap(newMap);
    saveStoredStudyData(newMap);
  };

  // Management View Mode: "archive" (default), "builder", "preview"
  const [adminViewMode, setAdminViewMode] = React.useState<"archive" | "builder" | "preview">(
    initialModeParam === "builder" ? "builder" : "archive"
  );

  // Archive Filters
  const [archiveProgram, setArchiveProgram] = React.useState<ProgramLevel>(profile.program || "DIPLOMA");
  const [archiveYear, setArchiveYear] = React.useState<string>("ALL");
  const [archiveSearch, setArchiveSearch] = React.useState<string>("");

  // Course Builder States
  const [builderCourseCode, setBuilderCourseCode] = React.useState<string>(() => {
    return initialSubjectParam || "ENG-101";
  });
  const [builderTab, setBuilderTab] = React.useState<"basic" | "modules" | "lessons" | "content">("content");
  const [builderSelectedUnitId, setBuilderSelectedUnitId] = React.useState<string>("");
  const [builderSelectedLessonId, setBuilderSelectedLessonId] = React.useState<string>("");
  const [builderContentSubTab, setBuilderContentSubTab] = React.useState<
    "notes" | "quizzes" | "viva" | "exams" | "resources" | "media"
  >("notes");

  // Active syllabus year tab for student view: strictly 4 years
  const [selectedYear, setSelectedYear] = React.useState(() => {
    if (initialSubjectParam) {
      const match = coursesCatalog.find((c) => c.code === initialSubjectParam);
      if (match) return match.year;
    }
    return profile.academicYear || "1";
  });

  // Subjects for the currently selected year from reactive coursesCatalog
  const displayedYearSubjects = React.useMemo(() => {
    return coursesCatalog.filter(
      (s) => s.program === profile.program && s.year === selectedYear
    );
  }, [coursesCatalog, profile.program, selectedYear]);

  // Active subject code for student reader view
  const [selectedSubjectCode, setSelectedSubjectCode] = React.useState(() => {
    if (initialSubjectParam) return initialSubjectParam;
    return displayedYearSubjects[0]?.code || "ENG-101";
  });

  // Sync mode and subject if search params change
  React.useEffect(() => {
    if (initialModeParam === "builder") {
      setAdminViewMode("builder");
    } else if (initialModeParam === "archive") {
      setAdminViewMode("archive");
    } else if (initialModeParam === "preview") {
      setAdminViewMode("preview");
    }

    if (initialSubjectParam) {
      setBuilderCourseCode(initialSubjectParam);
      setSelectedSubjectCode(initialSubjectParam);
      const match = coursesCatalog.find((c) => c.code === initialSubjectParam);
      if (match) {
        setSelectedYear(match.year);
      }
    }
  }, [initialModeParam, initialSubjectParam, coursesCatalog]);

  // Sync year if subject query param or profile changes
  React.useEffect(() => {
    if (initialSubjectParam) {
      const match = coursesCatalog.find((c) => c.code === initialSubjectParam);
      if (match) {
        setSelectedYear(match.year);
        setSelectedSubjectCode(match.code);
        return;
      }
    }
    if (!isManagementRole && !initialSubjectParam) {
      setSelectedYear(profile.academicYear || "1");
    }
  }, [initialSubjectParam, coursesCatalog, profile.academicYear, isManagementRole]);

  // Course Selector Dropdown open/close state
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCourseDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keep subject in sync when user switches year tab
  React.useEffect(() => {
    const existsInStage = displayedYearSubjects.some((s) => s.code === selectedSubjectCode);
    if (!existsInStage && displayedYearSubjects.length > 0) {
      setSelectedSubjectCode(displayedYearSubjects[0].code);
    }
  }, [selectedYear, displayedYearSubjects, selectedSubjectCode]);

  // Modules for current subject in student workspace
  const currentModules: Module[] = React.useMemo(() => {
    return getSubjectStudyModules(selectedSubjectCode, studyMap);
  }, [selectedSubjectCode, studyMap]);

  // Active module & lesson tracking for student reader
  const [activeModuleId, setActiveModuleId] = React.useState<string>("");
  const [activeLessonId, setActiveLessonId] = React.useState<string>("");

  // Units accordion state for expandable topic modules
  const [expandedUnits, setExpandedUnits] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (currentModules.length > 0) {
      setExpandedUnits((prev) => {
        const next: Record<string, boolean> = { ...prev };
        currentModules.forEach((m, idx) => {
          if (next[m.id] === undefined) {
            next[m.id] = idx === 0;
          }
        });
        return next;
      });
    }
  }, [currentModules]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const expandAllUnits = () => {
    const all: Record<string, boolean> = {};
    currentModules.forEach((m) => {
      all[m.id] = true;
    });
    setExpandedUnits(all);
  };

  const collapseAllUnits = () => {
    const all: Record<string, boolean> = {};
    currentModules.forEach((m) => {
      all[m.id] = false;
    });
    setExpandedUnits(all);
  };

  // Sync active module and lesson when currentModules change
  React.useEffect(() => {
    if (currentModules.length > 0) {
      const firstMod = currentModules[0];
      setActiveModuleId(firstMod.id);
      if (firstMod.subModules.length > 0 && firstMod.subModules[0].lessons.length > 0) {
        if (!activeLessonId) {
          setActiveLessonId(firstMod.subModules[0].lessons[0].id);
        }
      }
    }
  }, [currentModules, activeLessonId]);

  // Content tabs: comprehensive modes in reader
  const [contentTab, setContentTab] = React.useState<
    "lecture" | "attachments" | "media" | "quizzes" | "viva" | "prev_questions" | "qas" | "discussion"
  >("lecture");

  // Quiz interactive states in reader
  const [userAnswers, setUserAnswers] = React.useState<Record<number, number>>({});
  const [userMultiAnswers, setUserMultiAnswers] = React.useState<Record<number, number[]>>({});
  const [userShortAnswers, setUserShortAnswers] = React.useState<Record<number, string>>({});
  const [submittedMulti, setSubmittedMulti] = React.useState<Record<number, boolean>>({});
  const [submittedShort, setSubmittedShort] = React.useState<Record<number, boolean>>({});
  // Viva toggle state in reader
  const [revealedAnswers, setRevealedAnswers] = React.useState<Record<number, boolean>>({});

  // Quiz Builder Form State
  // Add Resource Modal States
  const [isResourceModalOpen, setIsResourceModalOpen] = React.useState(false);
  const [resourceTitle, setResourceTitle] = React.useState("");
  const [resourceMode, setResourceMode] = React.useState<"file" | "link">("file");
  const [resourceLink, setResourceLink] = React.useState("");
  const [resourceFileName, setResourceFileName] = React.useState("");
  const [resourceFileSize, setResourceFileSize] = React.useState("");
  const [resourceFileDataUrl, setResourceFileDataUrl] = React.useState("");



  const [isQuizFormOpen, setIsQuizFormOpen] = React.useState(false);
  const [quizFormType, setQuizFormType] = React.useState<QuizQuestionType>("mcq");
  const [quizFormScenario, setQuizFormScenario] = React.useState("");
  const [quizFormQuestion, setQuizFormQuestion] = React.useState("");
  const [quizFormOptions, setQuizFormOptions] = React.useState<string[]>([
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
  ]);
  const [quizFormCorrectIndex, setQuizFormCorrectIndex] = React.useState(0);
  const [quizFormCorrectIndices, setQuizFormCorrectIndices] = React.useState<number[]>([0]);
  const [quizFormCorrectText, setQuizFormCorrectText] = React.useState("");
  const [quizFormExplanation, setQuizFormExplanation] = React.useState("");

  // Interactive Student/User Q&A Input State
  const [userQText, setUserQText] = React.useState("");
  const [userQCategory, setUserQCategory] = React.useState("Clinical Practice");

  // Management Modal States
  const [isAddSubjectOpen, setIsAddSubjectOpen] = React.useState(false);
  const [subSubjectCode, setSubSubjectCode] = React.useState("");
  const [subSubjectName, setSubSubjectName] = React.useState("");
  const [subSubjectProgram, setSubSubjectProgram] = React.useState<ProgramLevel>(profile.program);
  const [subSubjectYear, setSubSubjectYear] = React.useState(selectedYear);
  const [subSubjectDesc, setSubSubjectDesc] = React.useState("");

  // Unit (Module) Modal States
  const [isModuleModalOpen, setIsModuleModalOpen] = React.useState(false);
  const [moduleToEdit, setModuleToEdit] = React.useState<Module | null>(null);
  const [formUnitNumber, setFormUnitNumber] = React.useState(1);
  const [formModuleTitle, setFormModuleTitle] = React.useState("");
  const [formModuleDesc, setFormModuleDesc] = React.useState("");

  // Sub-Module Modal States
  const [isSubModuleModalOpen, setIsSubModuleModalOpen] = React.useState(false);
  const [subModuleToEdit, setSubModuleToEdit] = React.useState<SubModule | null>(null);
  const [targetModIdForSubMod, setTargetModIdForSubMod] = React.useState<string>("");
  const [formSubModuleTitle, setFormSubModuleTitle] = React.useState("");

  // Lesson Authoring Modal States
  const [isLessonModalOpen, setIsLessonModalOpen] = React.useState(false);
  const [lessonToEdit, setLessonToEdit] = React.useState<LessonContent | null>(null);
  const [targetModId, setTargetModId] = React.useState<string>("");
  const [targetSubModId, setTargetSubModId] = React.useState<string>("");
  const [lessonModalTab, setLessonModalTab] = React.useState<
    "lecture" | "media" | "quiz" | "viva" | "exam" | "qa"
  >("lecture");

  // Lesson Form Fields
  const [formLessonTitle, setFormLessonTitle] = React.useState("");
  const [formLessonDuration, setFormLessonDuration] = React.useState("25 min");
  const [formLessonLectureText, setFormLessonLectureText] = React.useState("");
  const [formLessonNotes, setFormLessonNotes] = React.useState("");
  const [formBenchAlert, setFormBenchAlert] = React.useState("");

  // Media Collections
  const [formImages, setFormImages] = React.useState<LessonImage[]>([]);
  const [formVideos, setFormVideos] = React.useState<LessonVideo[]>([]);
  const [formAttachments, setFormAttachments] = React.useState<LessonAttachment[]>([]);

  // Interactive Question Collections
  const [formQuizzes, setFormQuizzes] = React.useState<LessonQuiz[]>([]);
  const [formVivaQAs, setFormVivaQAs] = React.useState<LessonVivaQA[]>([]);
  const [formPreviousQuestions, setFormPreviousQuestions] = React.useState<LessonPreviousQuestion[]>([]);
  const [formLessonQAs, setFormLessonQAs] = React.useState<LessonQA[]>([]);

  // Delete Target Dialog
  const [deleteTarget, setDeleteTarget] = React.useState<{
    type: "subject" | "module" | "submodule" | "lesson";
    id: string;
    name: string;
    extra?: { modId?: string; subModId?: string };
  } | null>(null);

  // Completed lessons tracking in localStorage
  const [completedLessons, setCompletedLessons] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("labtutor_completed_lessons");
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const toggleLessonCompleted = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const updated = { ...prev, [lessonId]: !prev[lessonId] };
      try {
        localStorage.setItem("labtutor_completed_lessons", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    const isNowDone = !completedLessons[lessonId];
    showNotification({
      type: "success",
      title: isNowDone ? "Lesson Completed" : "Marked Incomplete",
      message: isNowDone
        ? "Great progress! Your syllabus completion has been updated."
        : "Lesson marked as in-progress.",
    });
  };

  // Sidebar toggle state for focused full-width reading
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  // Mobile drawer state
  const [isMobileOutlineOpen, setIsMobileOutlineOpen] = React.useState(false);

  // Active subject metadata
  const activeSubject = React.useMemo(() => {
    return (
      coursesCatalog.find((s) => s.code === selectedSubjectCode) || {
        code: selectedSubjectCode,
        name: "Medical Laboratory Course",
        program: profile.program,
        year: selectedYear,
        units: currentModules.length || 4,
        lessons:
          currentModules.reduce(
            (acc, m) => acc + m.subModules.reduce((subAcc, sm) => subAcc + sm.lessons.length, 0),
            0
          ) || 16,
        progress: 50,
        description: "Official diagnostic pathology and laboratory clinical syllabus module.",
      }
    );
  }, [selectedSubjectCode, coursesCatalog, profile.program, selectedYear, currentModules]);

  // Active lesson object
  const activeLesson: LessonContent | null = React.useMemo(() => {
    for (const m of currentModules) {
      for (const sm of m.subModules) {
        for (const l of sm.lessons) {
          if (l.id === activeLessonId) return l;
        }
      }
    }
    return currentModules[0]?.subModules[0]?.lessons[0] || null;
  }, [currentModules, activeLessonId]);

  // Active module & submodule helpers
  const activeModule = React.useMemo(() => {
    if (!currentModules || currentModules.length === 0) return null;
    return (
      currentModules.find((m) =>
        m.subModules.some((sm) => sm.lessons.some((l) => l.id === activeLesson?.id))
      ) || currentModules[0]
    );
  }, [currentModules, activeLesson]);

  const activeSubModule = React.useMemo(() => {
    if (!activeModule) return null;
    return (
      activeModule.subModules.find((sm) =>
        sm.lessons.some((l) => l.id === activeLesson?.id)
      ) || activeModule.subModules[0] || null
    );
  }, [activeModule, activeLesson]);

  // Linear lessons list for Previous / Next lesson navigation
  const allLessonsList = React.useMemo(() => {
    const list: { lesson: LessonContent; moduleId: string; subModuleId: string }[] = [];
    currentModules.forEach((m) => {
      m.subModules.forEach((sm) => {
        sm.lessons.forEach((l) => {
          list.push({ lesson: l, moduleId: m.id, subModuleId: sm.id });
        });
      });
    });
    return list;
  }, [currentModules]);

  const totalLessonsCount = allLessonsList.length;
  const activeLessonIndex = allLessonsList.findIndex((item) => item.lesson.id === activeLesson?.id);
  const prevLessonItem = activeLessonIndex > 0 ? allLessonsList[activeLessonIndex - 1] : null;
  const nextLessonItem =
    activeLessonIndex >= 0 && activeLessonIndex < allLessonsList.length - 1
      ? allLessonsList[activeLessonIndex + 1]
      : null;

  const goToPrevLesson = () => {
    if (prevLessonItem) {
      setActiveLessonId(prevLessonItem.lesson.id);
      setActiveModuleId(prevLessonItem.moduleId);
      setExpandedUnits((prev) => ({ ...prev, [prevLessonItem.moduleId]: true }));
      setUserAnswers({});
      setRevealedAnswers({});
    }
  };

  const goToNextLesson = () => {
    if (nextLessonItem) {
      setActiveLessonId(nextLessonItem.lesson.id);
      setActiveModuleId(nextLessonItem.moduleId);
      setExpandedUnits((prev) => ({ ...prev, [nextLessonItem.moduleId]: true }));
      setUserAnswers({});
      setRevealedAnswers({});
    }
  };

  const startStudyingLesson = (lessonId: string, moduleId: string) => {
    setActiveLessonId(lessonId);
    setActiveModuleId(moduleId);
    setExpandedUnits((prev) => ({ ...prev, [moduleId]: true }));
    setUserAnswers({});
    setUserMultiAnswers({});
    setUserShortAnswers({});
    setSubmittedMulti({});
    setSubmittedShort({});
    setRevealedAnswers({});
  };

  const handleSelectSubject = (code: string) => {
    setSelectedSubjectCode(code);
    setIsCourseDropdownOpen(false);
    setUserAnswers({});
    setUserMultiAnswers({});
    setUserShortAnswers({});
    setSubmittedMulti({});
    setSubmittedShort({});
    setRevealedAnswers({});
  };

  // Calculate Quiz Score in reader across all question types
  const quizScore = React.useMemo(() => {
    if (!activeLesson || !activeLesson.quizzes) return { total: 0, answered: 0, correct: 0 };
    const total = activeLesson.quizzes.length;
    let answered = 0;
    let correct = 0;

    activeLesson.quizzes.forEach((q, idx) => {
      const type = q.type || "mcq";
      if (type === "mcq" || type === "true_false" || type === "case_scenario") {
        if (userAnswers[idx] !== undefined) {
          answered++;
          if (userAnswers[idx] === q.correctIndex) correct++;
        }
      } else if (type === "multi_select") {
        if (submittedMulti[idx]) {
          answered++;
          const selected = userMultiAnswers[idx] || [];
          const targets = q.correctIndices || [q.correctIndex || 0];
          const isExact =
            selected.length === targets.length &&
            selected.every((val) => targets.includes(val));
          if (isExact) correct++;
        }
      } else if (type === "short_answer") {
        if (submittedShort[idx]) {
          answered++;
          const entered = (userShortAnswers[idx] || "").trim().toLowerCase();
          const target = (q.correctText || "").trim().toLowerCase();
          if (entered && entered === target) correct++;
        }
      }
    });
    return { total, answered, correct };
  }, [activeLesson, userAnswers, userMultiAnswers, userShortAnswers, submittedMulti, submittedShort]);

  // Management CRUD Operations
  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const code = subSubjectCode.trim().toUpperCase();
    const name = subSubjectName.trim();
    if (!code || !name) return;

    addCurriculumCourse({
      code,
      name,
      program: subSubjectProgram,
      year: subSubjectYear,
      units: 4,
      lessons: 16,
      progress: 0,
      description: subSubjectDesc.trim() || `${name} clinical laboratory curriculum course.`,
    });

    const initialModules = generateCourseModulesFromCurriculum(
      code,
      name,
      subSubjectProgram,
      subSubjectYear
    );

    const updated = {
      ...studyMap,
      [code]: initialModules,
    };
    persistStudyMap(updated);
    setSelectedSubjectCode(code);
    setIsAddSubjectOpen(false);
    setSubSubjectCode("");
    setSubSubjectName("");
    setSubSubjectDesc("");
    showNotification({
      type: "success",
      title: "Subject Created & Available in Study Center",
      message: `"${name}" (${code}) created with modules ready for authoring.`,
      autoRefresh: true,
    });
  };

  const confirmDeleteSubject = () => {
    if (!deleteTarget || deleteTarget.type !== "subject") return;
    const code = deleteTarget.id;
    deleteCurriculumCourse(code);
    deleteStoredStudySubject(code);
    const updated = { ...studyMap };
    delete updated[code];
    persistStudyMap(updated);

    const remaining = coursesCatalog.filter((s) => s.code !== code);
    if (remaining.length > 0) {
      setSelectedSubjectCode(remaining[0].code);
    }
    setDeleteTarget(null);
    showNotification({
      type: "success",
      title: "Subject Removed",
      message: `Subject ${code} was permanently deleted from Study Center.`,
      autoRefresh: true,
    });
  };

  const handleInitializeCourseModules = () => {
    const modules = generateCourseModulesFromCurriculum(
      activeSubject.code,
      activeSubject.name,
      activeSubject.program,
      activeSubject.year
    );
    const updated = {
      ...studyMap,
      [activeSubject.code]: modules,
    };
    persistStudyMap(updated);
    showNotification({
      type: "success",
      title: "Foundational Topics Created",
      message: `Created ${modules.length} syllabus topics with clinical lecture outlines for ${activeSubject.code}.`,
      autoRefresh: true,
    });
  };

  const openAddModuleModal = () => {
    setModuleToEdit(null);
    setFormUnitNumber(currentModules.length + 1);
    setFormModuleTitle("");
    setFormModuleDesc("");
    setIsModuleModalOpen(true);
  };

  const openEditModuleModal = (module: Module) => {
    setModuleToEdit(module);
    setFormUnitNumber(module.unitNumber);
    setFormModuleTitle(module.title);
    setFormModuleDesc(module.description);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formModuleTitle.trim()) return;

    let updatedModules: Module[];

    if (moduleToEdit) {
      updatedModules = currentModules.map((m) =>
        m.id === moduleToEdit.id
          ? {
              ...m,
              unitNumber: formUnitNumber,
              title: formModuleTitle.trim(),
              description: formModuleDesc.trim(),
            }
          : m
      );
    } else {
      const newModule: Module = {
        id: `mod-${Date.now()}`,
        unitNumber: formUnitNumber,
        title: formModuleTitle.trim(),
        description: formModuleDesc.trim(),
        subModules: [
          {
            id: `submod-${Date.now()}`,
            title: "General Core Competencies",
            lessons: [],
          },
        ],
      };
      updatedModules = [...currentModules, newModule];
    }

    persistStudyMap({
      ...studyMap,
      [selectedSubjectCode]: updatedModules,
    });
    setIsModuleModalOpen(false);
    showNotification({
      type: "success",
      title: moduleToEdit ? "Topic Updated" : "Topic Added",
      message: `"${formModuleTitle}" saved successfully.`,
      autoRefresh: true,
    });
  };

  const confirmDeleteModule = () => {
    if (!deleteTarget || deleteTarget.type !== "module") return;
    const moduleId = deleteTarget.id;
    const updatedModules = currentModules.filter((m) => m.id !== moduleId);
    persistStudyMap({
      ...studyMap,
      [selectedSubjectCode]: updatedModules,
    });
    setDeleteTarget(null);
    showNotification({
      type: "success",
      title: "Topic Removed",
      message: "Topic and all nested components were deleted.",
      autoRefresh: true,
    });
  };

  const openAddSubModuleModal = (moduleId: string) => {
    setSubModuleToEdit(null);
    setTargetModIdForSubMod(moduleId);
    setFormSubModuleTitle("");
    setIsSubModuleModalOpen(true);
  };

  const openEditSubModuleModal = (moduleId: string, sm: SubModule) => {
    setSubModuleToEdit(sm);
    setTargetModIdForSubMod(moduleId);
    setFormSubModuleTitle(sm.title);
    setIsSubModuleModalOpen(true);
  };

  const handleSaveSubModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubModuleTitle.trim() || !targetModIdForSubMod) return;

    const updatedModules = currentModules.map((m) => {
      if (m.id !== targetModIdForSubMod) return m;

      let nextSubMods: SubModule[];
      if (subModuleToEdit) {
        nextSubMods = m.subModules.map((sm) =>
          sm.id === subModuleToEdit.id ? { ...sm, title: formSubModuleTitle.trim() } : sm
        );
      } else {
        const newSm: SubModule = {
          id: `submod-${Date.now()}`,
          title: formSubModuleTitle.trim(),
          lessons: [],
        };
        nextSubMods = [...m.subModules, newSm];
      }
      return { ...m, subModules: nextSubMods };
    });

    persistStudyMap({
      ...studyMap,
      [selectedSubjectCode]: updatedModules,
    });
    setIsSubModuleModalOpen(false);
    showNotification({
      type: "success",
      title: subModuleToEdit ? "Component Updated" : "Component Created",
      message: `"${formSubModuleTitle}" saved successfully.`,
      autoRefresh: true,
    });
  };

  const confirmDeleteSubModule = () => {
    if (!deleteTarget || deleteTarget.type !== "submodule") return;
    const subModId = deleteTarget.id;
    const modId = deleteTarget.extra?.modId;

    const updatedModules = currentModules.map((m) => {
      if (m.id !== modId) return m;
      return {
        ...m,
        subModules: m.subModules.filter((sm) => sm.id !== subModId),
      };
    });

    persistStudyMap({
      ...studyMap,
      [selectedSubjectCode]: updatedModules,
    });
    setDeleteTarget(null);
    showNotification({
      type: "success",
      title: "Component Deleted",
      message: "Component removed from topic.",
      autoRefresh: true,
    });
  };

  const openAddLessonModal = (moduleId: string, subModId: string) => {
    setLessonToEdit(null);
    setTargetModId(moduleId);
    setTargetSubModId(subModId);
    setFormLessonTitle("");
    setFormLessonDuration("25 min");
    setFormLessonLectureText("");
    setFormLessonNotes("");
    setFormBenchAlert("");
    setFormImages([]);
    setFormVideos([]);
    setFormAttachments([]);
    setFormQuizzes([]);
    setFormVivaQAs([]);
    setFormPreviousQuestions([]);
    setFormLessonQAs([]);
    setLessonModalTab("lecture");
    setIsLessonModalOpen(true);
  };

  const openEditLessonModal = (moduleId: string, subModId: string, lesson: LessonContent) => {
    setLessonToEdit(lesson);
    setTargetModId(moduleId);
    setTargetSubModId(subModId);
    setFormLessonTitle(lesson.title);
    setFormLessonDuration(lesson.duration);
    setFormLessonLectureText(lesson.lectureText || "");
    setFormLessonNotes((lesson.notes || []).join("\n\n"));
    setFormBenchAlert(lesson.benchAlert || "");
    setFormImages(lesson.images || []);
    setFormVideos(lesson.videos || []);
    setFormAttachments(lesson.attachments || []);
    setFormQuizzes(lesson.quizzes || []);
    setFormVivaQAs(lesson.vivaQAs || []);
    setFormPreviousQuestions(lesson.previousQuestions || []);
    setFormLessonQAs(lesson.qas || []);
    setLessonModalTab("lecture");
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLessonTitle.trim()) return;

    const notesArray = formLessonNotes
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const lessonData: LessonContent = {
      id: lessonToEdit ? lessonToEdit.id : `les-${Date.now()}`,
      title: formLessonTitle.trim(),
      duration: formLessonDuration.trim() || "25 min",
      lectureText: formLessonLectureText.trim(),
      notes: notesArray.length > 0 ? notesArray : ["Diagnostic procedure requires strict SOP compliance."],
      benchAlert: formBenchAlert.trim(),
      images: formImages,
      videos: formVideos,
      attachments: formAttachments,
      quizzes: formQuizzes,
      vivaQAs: formVivaQAs,
      previousQuestions: formPreviousQuestions,
      qas: formLessonQAs,
    };

    const updatedModules = currentModules.map((m) => {
      if (m.id !== targetModId) return m;
      return {
        ...m,
        subModules: m.subModules.map((sm) => {
          if (sm.id !== targetSubModId) return sm;
          let nextLessons: LessonContent[];
          if (lessonToEdit) {
            nextLessons = sm.lessons.map((l) => (l.id === lessonToEdit.id ? lessonData : l));
          } else {
            nextLessons = [...sm.lessons, lessonData];
          }
          return { ...sm, lessons: nextLessons };
        }),
      };
    });

    persistStudyMap({
      ...studyMap,
      [selectedSubjectCode]: updatedModules,
    });

    setIsLessonModalOpen(false);
    setLessonToEdit(null);
    showNotification({
      type: "success",
      title: lessonToEdit ? "Lesson Updated" : "Lesson Published",
      message: `"${formLessonTitle}" saved with rich lecture, media, quizzes, viva, and exam questions.`,
      autoRefresh: true,
    });
  };

  const confirmDeleteLesson = () => {
    if (!deleteTarget || deleteTarget.type !== "lesson") return;
    const lessonId = deleteTarget.id;

    const updatedModules = currentModules.map((m) => ({
      ...m,
      subModules: m.subModules.map((sm) => ({
        ...sm,
        lessons: sm.lessons.filter((l) => l.id !== lessonId),
      })),
    }));

    persistStudyMap({
      ...studyMap,
      [selectedSubjectCode]: updatedModules,
    });
    setDeleteTarget(null);
    showNotification({
      type: "success",
      title: "Lesson Removed",
      message: "Lesson removed from topic.",
      autoRefresh: true,
    });
  };

  // Interactive Student Q&A Posting
  const handleUserSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQText.trim() || !activeLesson) return;

    const newQaItem: LessonQA = {
      id: `qa-${Date.now()}`,
      question: userQText.trim(),
      answer: `Verified Faculty Response: In diagnostic clinical practice, always verify specimen volume, check for hemolysis/lipemia, and review control records before resolving ${userQText.trim()}.`,
      category: userQCategory,
      askedBy: "Trainee Question (Live)",
    };

    const updatedModules = currentModules.map((m) => ({
      ...m,
      subModules: m.subModules.map((sm) => ({
        ...sm,
        lessons: sm.lessons.map((l) =>
          l.id === activeLesson.id ? { ...l, qas: [...(l.qas || []), newQaItem] } : l
        ),
      })),
    }));

    persistStudyMap({
      ...studyMap,
      [selectedSubjectCode]: updatedModules,
    });
    setUserQText("");
    showNotification({
      type: "success",
      title: "Clinical Question Posted",
      message: "Your query has been added with verified instructor explanation.",
      autoRefresh: true,
    });
  };

  // ==========================================
  // COURSE BUILDER LOGIC & HANDLERS
  // ==========================================
  const builderCourse = React.useMemo(() => {
    return (
      coursesCatalog.find((c) => c.code === builderCourseCode) ||
      coursesCatalog[0] || {
        code: builderCourseCode,
        name: "New Laboratory Subject",
        program: archiveProgram,
        year: "1",
        units: 4,
        lessons: 16,
        progress: 0,
        description: "Clinical laboratory curriculum course.",
      }
    );
  }, [builderCourseCode, coursesCatalog, archiveProgram]);

  const builderModules = React.useMemo(() => {
    return getSubjectStudyModules(builderCourseCode, studyMap);
  }, [builderCourseCode, studyMap]);

  // Sync builder selected unit and lesson
  React.useEffect(() => {
    if (builderModules.length > 0) {
      if (!builderSelectedUnitId || !builderModules.some((m) => m.id === builderSelectedUnitId)) {
        setBuilderSelectedUnitId(builderModules[0].id);
      }
    }
  }, [builderModules, builderSelectedUnitId]);

  const activeBuilderUnit = React.useMemo(() => {
    return builderModules.find((m) => m.id === builderSelectedUnitId) || builderModules[0] || null;
  }, [builderModules, builderSelectedUnitId]);

  React.useEffect(() => {
    if (activeBuilderUnit && activeBuilderUnit.subModules.length > 0) {
      const allLes = activeBuilderUnit.subModules.flatMap((sm) => sm.lessons);
      if (allLes.length > 0) {
        if (!builderSelectedLessonId || !allLes.some((l) => l.id === builderSelectedLessonId)) {
          setBuilderSelectedLessonId(allLes[0].id);
        }
      }
    }
  }, [activeBuilderUnit, builderSelectedLessonId]);

  const activeBuilderLesson = React.useMemo(() => {
    if (!activeBuilderUnit) return null;
    for (const sm of activeBuilderUnit.subModules) {
      for (const les of sm.lessons) {
        if (les.id === builderSelectedLessonId) return les;
      }
    }
    return activeBuilderUnit.subModules[0]?.lessons[0] || null;
  }, [activeBuilderUnit, builderSelectedLessonId]);

  const handleDownloadAttachment = (att: LessonAttachment) => {
    if (att.url && att.url !== "#" && !att.url.startsWith("blob:")) {
      const link = document.createElement("a");
      link.href = att.url;
      link.download = att.name;
      if (!att.url.startsWith("data:")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Generate clinical document text file for standard SOPs
    const docLessonTitle = activeLesson?.title || activeBuilderLesson?.title || "Analytical Procedure";
    const docContent = `LABTUTOR ACADEMY - CLINICAL LABORATORY STANDARD OPERATING PROCEDURE\n` +
      `=============================================================================\n` +
      `Document: ${att.name}\n` +
      `Course: ${builderCourse?.name || activeSubject?.name || "Medical Laboratory Technology"}\n` +
      `Lesson: ${docLessonTitle}\n` +
      `Standard: State Medical Faculty of Bangladesh (SMFB) / DGHS Laboratory Guidelines\n` +
      `=============================================================================\n\n` +
      `1. PURPOSE & PRINCIPLE:\n` +
      `Standard operating guideline for clinical laboratory analysis, reagent preparation,\n` +
      `and bench diagnostic verification.\n\n` +
      `2. PRE-ANALYTICAL REQUIREMENTS:\n` +
      `- Specimen verification: Patient ID, tube anticoagulant integrity, rejection criteria.\n` +
      `- Personal Protective Equipment (PPE Level 2) mandatory at all analytical workstations.\n\n` +
      `3. QUALITY CONTROL CRITERIA:\n` +
      `- Two levels of internal quality control (normal and abnormal) must pass Westgard multirules\n` +
      `  prior to releasing diagnostic patient reports.\n\n` +
      `[LabTutor Academy Verified Educational Resource]`;

    const blob = new Blob([docContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = att.name.endsWith(".txt") ? att.name : `${att.name.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Course Builder Quick Create
  const handleCreateNewCourseInBuilder = () => {
    const nextNum = coursesCatalog.length + 1;
    const newCode = `LAB-${nextNum}01`;
    const newName = `Clinical Laboratory Science Specialization ${nextNum}`;
    addCurriculumCourse({
      code: newCode,
      name: newName,
      program: archiveProgram,
      year: archiveYear === "ALL" ? "1" : archiveYear,
      units: 4,
      lessons: 8,
      progress: 0,
      description: "Comprehensive diagnostic laboratory practice and pathology curriculum course.",
    });

    const initialMods = generateCourseModulesFromCurriculum(newCode, newName, archiveProgram, "1");
    persistStudyMap({
      ...studyMap,
      [newCode]: initialMods,
    });

    setBuilderCourseCode(newCode);
    setAdminViewMode("builder");
    setBuilderTab("basic");
    showNotification({
      type: "success",
      title: "New Course Initialized",
      message: `"${newCode}" is now loaded in the Course Builder.`,
      autoRefresh: true,
    });
  };

  // Helper renderer for Course Outline Sidebar in Student Reader
  const renderCourseOutlineSidebar = () => {
    const completedInCourse = allLessonsList.filter((item) => completedLessons[item.lesson.id]).length;
    const completionRate = totalLessonsCount > 0 ? Math.round((completedInCourse / totalLessonsCount) * 100) : 0;

    return (
      <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden sticky top-4">
        {/* Sidebar Header with prominent Collapse Button */}
        <div className="p-3.5 sm:p-4 border-b border-border/80 bg-muted/25 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Course Outline</h3>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-mono text-muted-foreground font-medium px-1.5 py-0.5 rounded bg-muted/60">
                {completedInCourse}/{totalLessonsCount}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg hidden lg:flex items-center gap-1 cursor-pointer"
                title="Collapse sidebar to view lesson in full width"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">Collapse</span>
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted/70 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-muted-foreground font-medium">
              {currentModules.length} {currentModules.length === 1 ? "Topic" : "Topics"} • {totalLessonsCount} Lessons
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={expandAllUnits}
                className="text-muted-foreground hover:text-primary transition-colors font-medium cursor-pointer"
              >
                Expand
              </button>
              <span className="text-muted-foreground/30">•</span>
              <button
                type="button"
                onClick={collapseAllUnits}
                className="text-muted-foreground hover:text-primary transition-colors font-medium cursor-pointer"
              >
                Collapse
              </button>
            </div>
          </div>
        </div>

        {/* Modules & Lessons Tree List */}
        <div className="max-h-[calc(100vh-230px)] overflow-y-auto divide-y divide-border/60 scrollbar-thin">
          {currentModules.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-xs text-muted-foreground">No topics found for this course.</p>
              {isManagementRole && (
                <Button
                  size="sm"
                  onClick={handleInitializeCourseModules}
                  className="text-xs bg-primary text-primary-foreground rounded-xl"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Initialize Topics
                </Button>
              )}
            </div>
          ) : (
            currentModules.map((module) => {
              const isExpanded = !!expandedUnits[module.id];
              const modLessonsCount = module.subModules.reduce(
                (acc, sm) => acc + sm.lessons.length,
                0
              );
              const isModuleActive = module.id === activeModule?.id;

              return (
                <div key={module.id} className="group">
                  {/* Unit Title Bar */}
                  <div
                    className={cn(
                      "w-full text-left px-3.5 py-3 flex items-center justify-between gap-2 hover:bg-muted/35 transition-colors cursor-pointer",
                      isModuleActive && "bg-muted/20"
                    )}
                    onClick={() => toggleUnit(module.id)}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted text-foreground font-mono text-xs font-semibold shrink-0">
                        {module.unitNumber}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-foreground block truncate">
                          {formatTopicTitle(module.title, module.unitNumber)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {modLessonsCount} {modLessonsCount === 1 ? "Lesson" : "Lessons"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Submodules & Lessons */}
                  {isExpanded && (
                    <div className="bg-muted/10 pb-2 space-y-1">
                      {module.subModules.map((sm) => (
                        <div key={sm.id} className="space-y-1">
                          {module.subModules.length > 1 && sm.title && (
                            <div className="px-3.5 pt-1.5 pb-0.5 text-[10px] font-semibold text-muted-foreground/80 truncate">
                              {sm.title.replace(/^COMPONENT\s+[\d\.]+\s*:\s*/i, "").replace(/^SUB-MODULE\s+[\d\.]+\s*:\s*/i, "")}
                            </div>
                          )}

                          <div className="space-y-1 px-2">
                            {sm.lessons.map((lesson) => {
                              const isCurrent = lesson.id === activeLesson?.id;
                              const isCompleted = !!completedLessons[lesson.id];

                              return (
                                <button
                                  key={lesson.id}
                                  type="button"
                                  onClick={() => {
                                    startStudyingLesson(lesson.id, module.id);
                                    setIsMobileOutlineOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between gap-2.5 transition-all cursor-pointer",
                                    isCurrent
                                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                      : "text-foreground hover:bg-muted/60"
                                  )}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                    {isCompleted ? (
                                      <CheckCircle2
                                        className={cn(
                                          "h-4 w-4 shrink-0",
                                          isCurrent ? "text-white" : "text-emerald-500"
                                        )}
                                      />
                                    ) : isCurrent ? (
                                      <div className="h-3.5 w-3.5 rounded-full border-2 border-white shrink-0 bg-white/30" />
                                    ) : (
                                      <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40 shrink-0" />
                                    )}
                                    <span className="truncate text-xs leading-snug">{lesson.title}</span>
                                  </div>

                                  <span
                                    className={cn(
                                      "text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0",
                                      isCurrent
                                        ? "bg-white/20 text-white"
                                        : "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    {lesson.duration || "25m"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Helper renderer for Active Lesson Study Workspace in Student Reader
  const renderActiveLessonWorkspace = (targetLesson?: LessonContent) => {
    const currentLesson = targetLesson || activeLesson;

    if (!currentLesson) {
      return (
        <Card className="p-8 text-center text-muted-foreground text-sm rounded-2xl border-border/80 space-y-3">
          <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/60" />
          <p>Select a lesson from the course outline to begin studying.</p>
        </Card>
      );
    }

    const isLessonCompleted = !!completedLessons[currentLesson.id];
    const mediaCount = (currentLesson.videos?.length || 0) + (currentLesson.images?.length || 0) + (currentLesson.attachments?.length || 0);
    const quizCount = currentLesson.quizzes?.length || 0;
    const vivaCount = currentLesson.vivaQAs?.length || 0;
    const examCount = currentLesson.previousQuestions?.length || 0;
    const qaCount = currentLesson.qas?.length || 0;

    return (
      <div className="space-y-4">
        {/* Top Breadcrumbs & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div className="flex items-center space-x-2 min-w-0">
            {!isSidebarOpen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="h-8 px-2.5 rounded-xl border-border text-xs font-semibold text-primary hover:bg-primary/10 flex items-center space-x-1.5 shadow-2xs shrink-0 cursor-pointer"
                title="Open course outline sidebar"
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Course Outline</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            )}

            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground truncate">
              <span className="font-semibold text-primary">{activeSubject.code}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{formatTopicTitle(activeModule?.title, activeModule?.unitNumber) || "Topic"}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span className="font-medium text-foreground truncate max-w-[180px] sm:max-w-[260px]">
                {currentLesson.title}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              disabled={!prevLessonItem}
              onClick={goToPrevLesson}
              className="text-xs h-8 px-2.5 rounded-xl border-border font-medium"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1 text-primary" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!nextLessonItem}
              onClick={goToNextLesson}
              className="text-xs h-8 px-2.5 rounded-xl border-border font-medium"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1 text-primary" />
            </Button>

            <Button
              size="sm"
              variant={isLessonCompleted ? "default" : "outline"}
              onClick={() => toggleLessonCompleted(currentLesson.id)}
              className={cn(
                "text-xs h-8 px-3 rounded-xl font-medium transition-all",
                isLessonCompleted
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-border text-foreground hover:bg-muted"
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              {isLessonCompleted ? "Completed" : "Mark as Done"}
            </Button>
          </div>
        </div>

        {/* Lesson Canvas Card */}
        <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
          <CardHeader className="p-5 pb-4 border-b border-border/80 bg-gradient-to-r from-muted/20 via-muted/5 to-transparent space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Badge variant="filled" className="text-[10px] font-medium">
                  {isLessonCompleted ? "Completed Lesson" : "In Progress"}
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground border border-border/70 rounded-full px-2.5 py-0.5 bg-muted/40">
                  {activeSubject.code}
                </span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center font-normal">
                <Clock className="h-3.5 w-3.5 mr-1 text-primary" />
                {currentLesson.duration || "25 min"}
              </span>
            </div>

            <div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                {currentLesson.title}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-normal mt-1">
                Course: <span className="text-foreground font-medium">{activeSubject.name} ({activeSubject.code})</span> • Official Clinical Syllabus Study Material
              </CardDescription>
            </div>

            {/* Smart Decluttered Tabs (Notes_Attachments placed right after Lecture Notes, Oral Viva renamed to Viva Q/A) */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none pt-2">
              <button
                type="button"
                onClick={() => setContentTab("lecture")}
                className={cn(
                  "py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 min-h-[34px] shrink-0 cursor-pointer",
                  contentTab === "lecture"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>Lecture Notes</span>
              </button>

              {/* Notes_Attachments placed right after Lecture Notes */}
              {(currentLesson.attachments?.length || 0) > 0 && (
                <button
                  type="button"
                  onClick={() => setContentTab("attachments")}
                  className={cn(
                    "py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 min-h-[34px] shrink-0 cursor-pointer",
                    contentTab === "attachments"
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Paperclip className="h-3.5 w-3.5 shrink-0" />
                  <span>Notes_Attachments ({currentLesson.attachments?.length || 0})</span>
                </button>
              )}

              {(quizCount > 0 || isManagementRole) && (
                <button
                  type="button"
                  onClick={() => setContentTab("quizzes")}
                  className={cn(
                    "py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 min-h-[34px] shrink-0 cursor-pointer",
                    contentTab === "quizzes"
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Practice Quiz ({quizCount})</span>
                </button>
              )}

              {(vivaCount > 0 || isManagementRole) && (
                <button
                  type="button"
                  onClick={() => setContentTab("viva")}
                  className={cn(
                    "py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 min-h-[34px] shrink-0 cursor-pointer",
                    contentTab === "viva"
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Award className="h-3.5 w-3.5 shrink-0" />
                  <span>Viva Q/A ({vivaCount})</span>
                </button>
              )}

              {(examCount > 0 || isManagementRole) && (
                <button
                  type="button"
                  onClick={() => setContentTab("prev_questions")}
                  className={cn(
                    "py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 min-h-[34px] shrink-0 cursor-pointer",
                    contentTab === "prev_questions"
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <History className="h-3.5 w-3.5 shrink-0" />
                  <span>Board Exams ({examCount})</span>
                </button>
              )}

              {/* Discussion Tab (Real-Time Interactive Forum) */}
              <button
                type="button"
                onClick={() => setContentTab("discussion")}
                className={cn(
                  "py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 min-h-[34px] shrink-0 cursor-pointer relative",
                  contentTab === "discussion"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span>Discussion</span>
              </button>

              {(mediaCount > 0 || isManagementRole) && (
                <button
                  type="button"
                  onClick={() => setContentTab("media")}
                  className={cn(
                    "py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 min-h-[34px] shrink-0 cursor-pointer",
                    contentTab === "media"
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Video className="h-3.5 w-3.5 shrink-0" />
                  <span>Media ({mediaCount})</span>
                </button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-6">
            {/* TAB 1: LECTURE */}
            {contentTab === "lecture" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">
                    Core Principles & Syllabus Notes:
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      showNotification({
                        type: "success",
                        title: "Generating PDF Summary",
                        message: `Downloading clinical notes and bench reference for "${currentLesson.title}".`,
                      })
                    }
                    className="text-xs h-8 rounded-xl font-medium"
                  >
                    <Download className="h-3.5 w-3.5 mr-1 text-primary" />
                    Download Summary PDF
                  </Button>
                </div>

                {currentLesson.lectureText && (
                  <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2 text-primary font-semibold text-xs border-b border-border/60 pb-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Detailed Clinical Lecture Overview:</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal whitespace-pre-line space-y-2.5">
                      {currentLesson.lectureText}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Key Bench Takeaways & High-Yield Points:
                  </span>
                  <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed">
                    {currentLesson.notes.map((paragraph, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-4 rounded-xl bg-card border border-border/70 shadow-2xs flex items-start space-x-3.5"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-mono text-xs font-semibold shrink-0 mt-0.5 shadow-2xs">
                          {pIdx + 1}
                        </span>
                        <p className="text-muted-foreground leading-relaxed font-normal">
                          {paragraph}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {currentLesson.benchAlert && (
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 text-xs space-y-1.5">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Clinical Bench Note & Quality Control Rule:
                    </span>
                    <p className="text-muted-foreground leading-relaxed font-normal pl-5">
                      {currentLesson.benchAlert}
                    </p>
                  </div>
                )}

                {currentLesson.attachments && currentLesson.attachments.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Attached Notes & Resources ({currentLesson.attachments.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentLesson.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="p-3 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-all flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <Paperclip className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate font-medium text-foreground">{att.name}</span>
                          </div>
                          <a href={att.url} download={att.name} className="shrink-0">
                            <Button size="sm" variant="outline" className="h-7 text-xs px-2.5 rounded-lg">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 1.5: NOTES_ATTACHMENTS */}
            {contentTab === "attachments" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Attached Notes &amp; Clinical Resources ({currentLesson.attachments?.length || 0})
                  </h4>
                  <span className="text-[11px] text-muted-foreground">Click Download to save resource directly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentLesson.attachments || []).map((att) => (
                    <div
                      key={att.id}
                      className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xs transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground block truncate">{att.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono block">
                            {att.fileSize || "Resource File"} • {att.fileType || "PDF"}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleDownloadAttachment(att)}
                        className="h-8 text-xs px-3 rounded-xl bg-primary text-white shrink-0 font-medium cursor-pointer shadow-2xs active:scale-95"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: MEDIA */}
            {contentTab === "media" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-foreground flex items-center space-x-1.5 pb-1 border-b border-border">
                    <Video className="h-4 w-4 text-primary" />
                    <span>Video Demonstrations ({currentLesson.videos?.length || 0})</span>
                  </span>
                  {currentLesson.videos && currentLesson.videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentLesson.videos.map((vid) => (
                        <div key={vid.id} className="p-3.5 rounded-2xl border border-border bg-card space-y-2.5">
                          <h6 className="font-semibold text-xs text-foreground truncate">{vid.title}</h6>
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/10">
                            <iframe src={vid.url} className="w-full h-full border-0" allowFullScreen title={vid.title} />
                          </div>
                          {vid.description && <p className="text-[11px] text-muted-foreground">{vid.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No video demonstrations attached to this lesson.</p>
                  )}
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-semibold text-foreground flex items-center space-x-1.5 pb-1 border-b border-border">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Clinical Images & Micrographs ({currentLesson.images?.length || 0})</span>
                  </span>
                  {currentLesson.images && currentLesson.images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentLesson.images.map((img) => (
                        <div key={img.id} className="rounded-2xl border border-border overflow-hidden bg-card">
                          <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
                          <div className="p-3">
                            <span className="font-semibold text-xs text-foreground block">{img.title}</span>
                            {img.caption && <p className="text-[11px] text-muted-foreground mt-0.5">{img.caption}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No clinical micrographs attached to this lesson.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: QUIZZES (Multi-Type Support: MCQ, Multi-Select, True/False, Short Answer, Case Scenario) */}
            {contentTab === "quizzes" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">
                    Interactive Clinical Assessment ({currentLesson.quizzes?.length || 0} Questions)
                  </span>
                  {quizScore.answered > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-primary">
                        Score: {quizScore.correct} / {quizScore.answered} Correct ({Math.round((quizScore.correct / Math.max(1, quizScore.answered)) * 100)}%)
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setUserAnswers({});
                          setUserMultiAnswers({});
                          setUserShortAnswers({});
                          setSubmittedMulti({});
                          setSubmittedShort({});
                        }}
                        className="h-6 text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        Reset Quiz
                      </Button>
                    </div>
                  )}
                </div>

                {currentLesson.quizzes && currentLesson.quizzes.length > 0 ? (
                  <div className="space-y-4">
                    {currentLesson.quizzes.map((quiz, qIdx) => {
                      const qType: QuizQuestionType = quiz.type || "mcq";

                      return (
                        <div key={qIdx} className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-3.5 shadow-2xs">
                          {/* Question Header & Type Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5 min-w-0">
                              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-semibold shrink-0 mt-0.5">
                                {qIdx + 1}
                              </span>
                              <div className="space-y-1">
                                <Badge variant="blue" className="text-[10px] uppercase tracking-wider font-semibold py-0">
                                  {qType === "case_scenario"
                                    ? "Clinical Case Scenario"
                                    : qType === "multi_select"
                                    ? "Multiple Answers (Select All)"
                                    : qType === "true_false"
                                    ? "True / False"
                                    : qType === "short_answer"
                                    ? "Short Answer"
                                    : "Single Choice MCQ"}
                                </Badge>
                                <h5 className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                                  {quiz.question}
                                </h5>
                              </div>
                            </div>
                          </div>

                          {/* Clinical Case Scenario Vignette */}
                          {qType === "case_scenario" && quiz.scenario && (
                            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/25 border border-blue-200/80 dark:border-blue-900/60 text-xs space-y-1">
                              <span className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                                <FlaskConical className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                Patient Laboratory Presentation & Findings:
                              </span>
                              <p className="text-muted-foreground leading-relaxed pl-5 font-normal">
                                {quiz.scenario}
                              </p>
                            </div>
                          )}

                          {/* 1. SINGLE-CHOICE MCQ & CASE SCENARIO */}
                          {(qType === "mcq" || qType === "case_scenario") && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {(quiz.options || []).map((opt, optIdx) => {
                                const userChoice = userAnswers[qIdx];
                                const isAnswered = userChoice !== undefined;
                                const isSelected = userChoice === optIdx;
                                const isTargetCorrect = optIdx === quiz.correctIndex;

                                let btnStyle = "bg-muted/40 hover:bg-muted text-foreground border-border";
                                if (isAnswered) {
                                  if (isSelected) {
                                    btnStyle = isTargetCorrect
                                      ? "bg-emerald-500 text-white border-emerald-600 font-semibold"
                                      : "bg-destructive text-destructive-foreground border-destructive font-semibold";
                                  } else if (isTargetCorrect) {
                                    btnStyle = "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-semibold";
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                                    className={cn("p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer", btnStyle)}
                                  >
                                    <span>{opt}</span>
                                    {isAnswered && isSelected && (isTargetCorrect ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />)}
                                    {isAnswered && !isSelected && isTargetCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* 2. TRUE / FALSE */}
                          {qType === "true_false" && (
                            <div className="grid grid-cols-2 gap-3 pt-1 max-w-md">
                              {["True", "False"].map((label, optIdx) => {
                                const userChoice = userAnswers[qIdx];
                                const isAnswered = userChoice !== undefined;
                                const isSelected = userChoice === optIdx;
                                const isTargetCorrect = optIdx === quiz.correctIndex;

                                let btnStyle = "bg-muted/40 hover:bg-muted text-foreground border-border";
                                if (isAnswered) {
                                  if (isSelected) {
                                    btnStyle = isTargetCorrect
                                      ? "bg-emerald-500 text-white border-emerald-600 font-semibold"
                                      : "bg-destructive text-destructive-foreground border-destructive font-semibold";
                                  } else if (isTargetCorrect) {
                                    btnStyle = "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-semibold";
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                                    className={cn("p-3 rounded-xl border text-center text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer", btnStyle)}
                                  >
                                    <span>{label}</span>
                                    {isAnswered && isSelected && (isTargetCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />)}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* 3. MULTIPLE-CHOICE MULTI-SELECT */}
                          {qType === "multi_select" && (
                            <div className="space-y-3 pt-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(quiz.options || []).map((opt, optIdx) => {
                                  const currentSelected = userMultiAnswers[qIdx] || [];
                                  const isChecked = currentSelected.includes(optIdx);
                                  const isSubmitted = !!submittedMulti[qIdx];
                                  const targetIndices = quiz.correctIndices || [quiz.correctIndex || 0];
                                  const isTargetCorrect = targetIndices.includes(optIdx);

                                  let optStyle = "bg-muted/30 border-border hover:bg-muted/60";
                                  if (isSubmitted) {
                                    if (isChecked) {
                                      optStyle = isTargetCorrect
                                        ? "bg-emerald-500 text-white border-emerald-600 font-semibold"
                                        : "bg-destructive text-destructive-foreground border-destructive font-semibold";
                                    } else if (isTargetCorrect) {
                                      optStyle = "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-semibold";
                                    }
                                  } else if (isChecked) {
                                    optStyle = "bg-primary/15 border-primary/60 text-foreground font-semibold";
                                  }

                                  return (
                                    <div
                                      key={optIdx}
                                      onClick={() => {
                                        if (isSubmitted) return;
                                        const next = isChecked
                                          ? currentSelected.filter((i) => i !== optIdx)
                                          : [...currentSelected, optIdx];
                                        setUserMultiAnswers((prev) => ({ ...prev, [qIdx]: next }));
                                      }}
                                      className={cn("p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer", optStyle)}
                                    >
                                      <span>{opt}</span>
                                      <div className={cn("h-4 w-4 rounded border flex items-center justify-center shrink-0", isChecked ? "bg-primary border-primary text-white" : "border-muted-foreground/40")}>
                                        {isChecked && <Check className="h-3 w-3" />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {!submittedMulti[qIdx] ? (
                                <Button
                                  size="sm"
                                  onClick={() => setSubmittedMulti((prev) => ({ ...prev, [qIdx]: true }))}
                                  disabled={!(userMultiAnswers[qIdx] && userMultiAnswers[qIdx].length > 0)}
                                  className="bg-primary text-white text-xs h-8 rounded-xl px-4"
                                >
                                  Submit Multiple Answers
                                </Button>
                              ) : null}
                            </div>
                          )}

                          {/* 4. SHORT ANSWER */}
                          {qType === "short_answer" && (
                            <div className="space-y-2 pt-1 max-w-md">
                              <div className="flex items-center space-x-2">
                                <Input
                                  placeholder="Type your answer / clinical value..."
                                  disabled={submittedShort[qIdx]}
                                  value={userShortAnswers[qIdx] || ""}
                                  onChange={(e) => setUserShortAnswers((prev) => ({ ...prev, [qIdx]: e.target.value }))}
                                  className="h-9 text-xs rounded-xl"
                                />
                                {!submittedShort[qIdx] && (
                                  <Button
                                    size="sm"
                                    onClick={() => setSubmittedShort((prev) => ({ ...prev, [qIdx]: true }))}
                                    disabled={!(userShortAnswers[qIdx] && userShortAnswers[qIdx].trim())}
                                    className="bg-primary text-white text-xs h-9 rounded-xl px-3 shrink-0"
                                  >
                                    Check Answer
                                  </Button>
                                )}
                              </div>

                              {submittedShort[qIdx] && (
                                <div className={cn("p-2.5 rounded-xl text-xs flex items-center justify-between border", (userShortAnswers[qIdx] || "").trim().toLowerCase() === (quiz.correctText || "").trim().toLowerCase() ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300" : "bg-destructive/10 border-destructive/30 text-destructive")}>
                                  <span>
                                    {(userShortAnswers[qIdx] || "").trim().toLowerCase() === (quiz.correctText || "").trim().toLowerCase()
                                      ? "✓ Correct Answer!"
                                      : `✗ Incorrect. Expected answer: "${quiz.correctText}"`}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Rationale Display after answering */}
                          {(userAnswers[qIdx] !== undefined || submittedMulti[qIdx] || submittedShort[qIdx]) && quiz.explanation && (
                            <div className="p-3 rounded-xl bg-muted/60 text-[11px] text-muted-foreground mt-2 border border-border animate-in fade-in">
                              <strong className="text-foreground">Clinical Rationale: </strong>
                              {quiz.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No practice quiz questions available for this lesson.</p>
                )}
              </div>
            )}

            {/* TAB 4: VIVA */}
            {contentTab === "viva" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">
                    Oral Board Examination Viva Voce ({currentLesson.vivaQAs?.length || 0} Questions)
                  </span>
                </div>

                {currentLesson.vivaQAs && currentLesson.vivaQAs.length > 0 ? (
                  <div className="space-y-3">
                    {currentLesson.vivaQAs.map((viva, vIdx) => {
                      const isRevealed = !!revealedAnswers[vIdx];
                      return (
                        <div key={vIdx} className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-2.5 shadow-2xs">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5">
                              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-semibold shrink-0 mt-0.5">
                                {vIdx + 1}
                              </span>
                              <h5 className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                                {viva.question}
                              </h5>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRevealedAnswers((prev) => ({ ...prev, [vIdx]: !prev[vIdx] }))}
                              className="h-7 text-xs px-2.5 rounded-lg shrink-0"
                            >
                              {isRevealed ? "Hide Answer" : "Reveal Answer"}
                            </Button>
                          </div>

                          {isRevealed && (
                            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1 animate-in fade-in">
                              <span className="font-semibold text-primary block">Benchmark Model Defense:</span>
                              <p className="text-muted-foreground leading-relaxed font-normal">{viva.answer}</p>
                            </div>
                          )}

                          {viva.frequentlyAskedIn && (
                            <span className="text-[10px] text-muted-foreground block italic">
                              Exam Frequency: {viva.frequentlyAskedIn}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No viva questions archived for this lesson.</p>
                )}
              </div>
            )}

            {/* TAB 5: PREV BOARD EXAMS */}
            {contentTab === "prev_questions" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">
                    Archived Written Board Questions ({currentLesson.previousQuestions?.length || 0})
                  </span>
                </div>

                {currentLesson.previousQuestions && currentLesson.previousQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {currentLesson.previousQuestions.map((pq, pqIdx) => (
                      <div key={pqIdx} className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5 text-xs">
                          <div className="flex items-center space-x-2">
                            <Badge variant="blue" className="text-[10px] font-mono">{pq.year}</Badge>
                            <span className="font-medium text-foreground">{pq.exam}</span>
                          </div>
                          <Badge variant="filled" className="text-[10px]">Marks: {pq.marks}</Badge>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">{pq.questionText}</p>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                          <strong className="text-foreground">Official Model Answer: </strong>
                          <span className="text-muted-foreground leading-relaxed font-normal">{pq.modelAnswer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No previous board questions archived for this lesson.</p>
                )}
              </div>
            )}

            {/* TAB 6: DISCUSSION (REAL-TIME INTERACTIVE FORUM WITH LIKES, DISLIKES, REPLIES) */}
            {contentTab === "discussion" && (
              <LessonDiscussionTab
                lessonId={currentLesson.id}
                lessonTitle={currentLesson.title}
                subjectCode={activeSubject.code}
                subjectName={activeSubject.name}
                initialQas={currentLesson.qas}
              />
            )}
          </CardContent>
        </Card>

        {/* Bottom Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {prevLessonItem ? (
            <button
              type="button"
              onClick={goToPrevLesson}
              className="text-left p-4 rounded-2xl border border-border/80 bg-card hover:bg-muted/30 hover:border-primary/40 transition-all space-y-1 shadow-2xs group cursor-pointer"
            >
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 group-hover:text-primary">
                <ChevronLeft className="h-3.5 w-3.5" /> Previous Lesson
              </span>
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{prevLessonItem.lesson.title}</p>
            </button>
          ) : (
            <div />
          )}

          {nextLessonItem ? (
            <button
              type="button"
              onClick={goToNextLesson}
              className="text-right p-4 rounded-2xl border border-border/80 bg-card hover:bg-muted/30 hover:border-primary/40 transition-all space-y-1 shadow-2xs group ml-auto w-full cursor-pointer"
            >
              <span className="text-[11px] font-medium text-muted-foreground flex items-center justify-end gap-1 group-hover:text-primary">
                Next Lesson <ChevronRight className="h-3.5 w-3.5" />
              </span>
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{nextLessonItem.lesson.title}</p>
            </button>
          ) : (
            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-50/20 text-right flex items-center justify-end gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> Course Completed!
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper renderer for Student Reader Workspace (Header + 2 Columns)
  const renderStudentStudyWorkspace = () => {
    const completedCount = allLessonsList.filter((item) => completedLessons[item.lesson.id]).length;
    const completionPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

    return (
      <div className="space-y-5 max-w-7xl mx-auto pb-10">
        {/* If in Management Student Preview mode, show executive banner */}
        {isManagementRole && adminViewMode === "preview" && (
          <div className="bg-primary/10 border border-primary/30 text-primary p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <Eye className="h-4 w-4 shrink-0 text-primary" />
              <span>
                Student Preview Mode: Viewing &quot;{activeSubject.name} ({activeSubject.code})&quot; exactly as a student sees it.
              </span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setBuilderCourseCode(activeSubject.code);
                  setAdminViewMode("builder");
                }}
                className="h-8 text-xs font-medium bg-card"
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit in Builder
              </Button>
              <Button
                size="sm"
                onClick={() => setAdminViewMode("archive")}
                className="h-8 text-xs font-medium bg-primary text-primary-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Return to Courses Archive
              </Button>
            </div>
          </div>
        )}

        {/* Compact Header Bar */}
        <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    Study Center
                  </h1>
                  <Badge variant="blue" className="text-[10px] hidden sm:inline-flex py-0 font-medium">
                    {profile.program === "BSC" ? "B.Sc. Laboratory" : "Diploma DMLT"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="h-5 w-px bg-border/80 hidden sm:block" />

            {!isManagementRole ? (
              <Badge variant="filled" className="text-xs py-1 px-3 bg-primary/10 text-primary border border-primary/20">
                <Clock className="h-3 w-3 mr-1" />
                Year {profile.academicYear || "1"} (Enrolled)
              </Badge>
            ) : (
              <div className="flex items-center space-x-1 bg-muted/40 p-1 rounded-xl border border-border/80">
                {["1", "2", "3", "4"].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                      selectedYear === yr
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Yr {yr}
                  </button>
                ))}
              </div>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                className="px-3.5 py-1.5 rounded-xl border border-border/80 bg-background hover:bg-muted/40 text-foreground text-xs shadow-2xs transition-all flex items-center justify-between gap-2.5 min-h-[38px] max-w-[280px] sm:max-w-xs cursor-pointer"
              >
                <Microscope className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-mono font-semibold text-primary text-xs shrink-0">{activeSubject.code}:</span>
                <span className="truncate text-xs font-medium text-foreground">{activeSubject.name}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200", isCourseDropdownOpen && "rotate-180")} />
              </button>

              {isCourseDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-80 sm:w-96 rounded-2xl border border-border/80 bg-card p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/70 flex items-center justify-between">
                    <span>Select Course ({displayedYearSubjects.length})</span>
                    <span className="font-mono text-primary text-[10px]">Year {selectedYear}</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 py-1 scrollbar-thin">
                    {displayedYearSubjects.map((sub) => {
                      const isSel = sub.code === selectedSubjectCode;
                      return (
                        <button
                          key={sub.code}
                          type="button"
                          onClick={() => handleSelectSubject(sub.code)}
                          className={cn(
                            "w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer",
                            isSel ? "bg-primary text-primary-foreground font-medium shadow-xs" : "hover:bg-muted/60 text-foreground"
                          )}
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className={cn("font-mono text-[11px] px-1.5 py-0.5 rounded", isSel ? "bg-white/20 text-white" : "bg-muted border border-border/70")}>
                              {sub.code}
                            </span>
                            <span className="truncate font-medium">{sub.name}</span>
                          </div>
                          {isSel && <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
            <div className="hidden sm:flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/70 text-xs">
              <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(5, completionPercent)}%` }}
                />
              </div>
              <span className="font-semibold text-foreground text-[11px]">
                {completedCount}/{totalLessonsCount} Done
              </span>
            </div>

            <Link href={`/student/curriculum/${activeSubject.code}`}>
              <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-border text-xs font-medium">
                <BookOpen className="h-3.5 w-3.5 mr-1 text-primary" />
                <span>Full Syllabus</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "h-9 px-3 rounded-xl border-border text-xs font-medium hidden lg:flex items-center space-x-1.5",
                !isSidebarOpen && "bg-muted font-semibold"
              )}
              title={isSidebarOpen ? "Collapse Course Outline" : "Expand Course Outline"}
            >
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>{isSidebarOpen ? "Hide Outline" : "Show Outline"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileOutlineOpen(true)}
              className="h-9 px-3 rounded-xl border-border text-xs font-medium lg:hidden flex items-center space-x-1.5"
            >
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>Outline</span>
            </Button>

            {isManagementRole && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAdminViewMode("archive")}
                className="h-9 px-3 rounded-xl text-xs font-medium text-primary border-primary/30 hover:bg-primary/10"
              >
                <Database className="h-3.5 w-3.5 mr-1" />
                Admin Hub
              </Button>
            )}
          </div>
        </div>

        {/* 2-Column Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {isSidebarOpen && (
            <aside className="lg:col-span-4 xl:col-span-3.5 space-y-4">
              {renderCourseOutlineSidebar()}
            </aside>
          )}

          <main
            className={cn(
              isSidebarOpen ? "lg:col-span-8 xl:col-span-8.5" : "col-span-12 w-full",
              "space-y-6 min-w-0"
            )}
          >
            {renderActiveLessonWorkspace(activeLesson || undefined)}
          </main>
        </div>

        {/* Mobile Outline Drawer */}
        {isMobileOutlineOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 lg:hidden animate-in fade-in duration-150">
            <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/20">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Course Navigation</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileOutlineOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-2 overflow-y-auto flex-1">
                {renderCourseOutlineSidebar()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // MANAGEMENT VIEW 1: COURSES ARCHIVE & HUB
  // ==========================================
  const renderAdminArchiveView = () => {
    // Filter courses by active program, selected year, and search query
    const filteredCourses = coursesCatalog.filter((sub) => {
      const matchProgram = sub.program === archiveProgram;
      const matchYear = archiveYear === "ALL" || sub.year === archiveYear;
      const q = archiveSearch.trim().toLowerCase();
      const matchSearch = !q || sub.code.toLowerCase().includes(q) || sub.name.toLowerCase().includes(q);
      return matchProgram && matchYear && matchSearch;
    });

    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
        {/* Admin Header */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Badge variant="blue" className="text-[10px] font-semibold">
                  {currentRole === "SUPER_ADMIN"
                    ? "Super Admin Authority"
                    : currentRole === "ADMIN"
                    ? "Admin Workspace"
                    : "Faculty Mentor Access"}
                </Badge>
                <span className="text-xs text-muted-foreground">• Live Dynamic Curriculum Governance</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Study Center & Course Archive
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                Manage all academic courses, author syllabus modules, edit interactive learning content, and inspect student views in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                onClick={handleCreateNewCourseInBuilder}
                className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs h-10 px-4 shadow-xs"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Course Builder: Add New Course
              </Button>
            </div>
          </div>

          {/* Program & Year Filters Bar */}
          <div className="pt-2 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Program:
              </span>
              <div className="inline-flex rounded-xl border border-border p-1 bg-muted/40 gap-1">
                <button
                  type="button"
                  onClick={() => setArchiveProgram("DIPLOMA")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                    archiveProgram === "DIPLOMA"
                      ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Diploma DMLT
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveProgram("BSC")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                    archiveProgram === "BSC"
                      ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  B.Sc. Laboratory
                </button>
              </div>

              <div className="h-4 w-px bg-border hidden sm:block mx-1" />

              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Year:
              </span>
              <div className="inline-flex rounded-xl border border-border p-1 bg-muted/40 gap-1">
                {["ALL", "1", "2", "3", "4"].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setArchiveYear(yr)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                      archiveYear === yr
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {yr === "ALL" ? "All Years" : `Yr ${yr}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search code or title..."
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                className="pl-8 h-9 text-xs rounded-xl bg-background"
              />
            </div>
          </div>
        </div>

        {/* Courses Archive Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing <strong className="text-foreground">{filteredCourses.length}</strong> registered courses in archive
            </span>
            <span className="text-[11px] font-mono">
              Database: Reactive Local Storage & Academic Catalog
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-border rounded-2xl space-y-3">
              <BookOpen className="h-8 w-8 text-muted-foreground/50 mx-auto" />
              <p className="text-sm font-semibold text-foreground">No courses found matching criteria</p>
              <p className="text-xs text-muted-foreground">Adjust your filters or create a new course using the Course Builder.</p>
              <Button size="sm" onClick={handleCreateNewCourseInBuilder} className="bg-primary text-white text-xs rounded-xl">
                <Plus className="h-3.5 w-3.5 mr-1" /> Open Course Builder
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((sub, idx) => {
                const subModules = getSubjectStudyModules(sub.code, studyMap);
                const uCount = subModules.length;
                const lCount = subModules.reduce((acc, m) => acc + m.subModules.reduce((sAcc, sm) => sAcc + sm.lessons.length, 0), 0);
                const qCount = subModules.reduce((acc, m) => acc + m.subModules.reduce((sAcc, sm) => sAcc + sm.lessons.reduce((lAcc, l) => lAcc + (l.quizzes?.length || 0), 0), 0), 0);
                const vCount = subModules.reduce((acc, m) => acc + m.subModules.reduce((sAcc, sm) => sAcc + sm.lessons.reduce((lAcc, l) => lAcc + (l.vivaQAs?.length || 0), 0), 0), 0);
                const eCount = subModules.reduce((acc, m) => acc + m.subModules.reduce((sAcc, sm) => sAcc + sm.lessons.reduce((lAcc, l) => lAcc + (l.previousQuestions?.length || 0), 0), 0), 0);
                const rCount = subModules.reduce((acc, m) => acc + m.subModules.reduce((sAcc, sm) => sAcc + sm.lessons.reduce((lAcc, l) => lAcc + (l.attachments?.length || 0) + (l.videos?.length || 0), 0), 0), 0);

                return (
                  <Card key={sub.code} className="rounded-2xl border-border/80 hover:border-primary/50 transition-all p-5 space-y-4 shadow-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-mono text-xs font-semibold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                            {sub.code}
                          </span>
                          <Badge variant="blue" className="text-[10px]">
                            Year {sub.year}
                          </Badge>
                        </div>
                        <Badge variant="filled" className="text-[10px]">
                          {sub.program}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-foreground leading-snug tracking-tight">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 font-normal leading-relaxed">
                          {sub.description}
                        </p>
                      </div>

                      {/* Diagnostic Content Statistics */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px]">
                        <div className="p-2 rounded-xl bg-muted/40 border border-border/70 text-center">
                          <span className="font-semibold text-foreground block">{uCount} Topics</span>
                          <span className="text-[10px] text-muted-foreground">{lCount} Lessons</span>
                        </div>
                        <div className="p-2 rounded-xl bg-muted/40 border border-border/70 text-center">
                          <span className="font-semibold text-foreground block">{qCount} Quizzes</span>
                          <span className="text-[10px] text-muted-foreground">{vCount} Viva Q&As</span>
                        </div>
                        <div className="p-2 rounded-xl bg-muted/40 border border-border/70 text-center">
                          <span className="font-semibold text-foreground block">{eCount} Board Exams</span>
                          <span className="text-[10px] text-muted-foreground">{rCount} Resources</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                      <div className="flex items-center space-x-1.5">
                        <Button
                          size="sm"
                          onClick={() => {
                            setBuilderCourseCode(sub.code);
                            setAdminViewMode("builder");
                            setBuilderTab("content");
                          }}
                          className="bg-primary text-primary-foreground font-semibold text-xs h-9 rounded-xl px-3 shadow-2xs"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          Manage &amp; Edit Content
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSubjectCode(sub.code);
                            setSelectedYear(sub.year);
                            setAdminViewMode("preview");
                          }}
                          className="text-xs h-9 rounded-xl font-medium"
                          title="Preview how this course looks to students"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1 text-primary" />
                          Student Preview
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setDeleteTarget({
                            type: "subject",
                            id: sub.code,
                            name: `${sub.code}: ${sub.name}`,
                          })
                        }
                        className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive rounded-xl"
                        title="Delete course from Study Center"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // MANAGEMENT VIEW 2: COURSE BUILDER
  // ==========================================
  const renderAdminCourseBuilder = () => {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
        {/* Top Builder Bar */}
        <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAdminViewMode("archive")}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground mr-1"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Archive
              </Button>
              <Badge variant="blue" className="text-[10px] font-mono">
                {builderCourse.code}
              </Badge>
              <Badge variant="filled" className="text-[10px]">
                Year {builderCourse.year} • {builderCourse.program}
              </Badge>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Course Builder: {builderCourse.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedSubjectCode(builderCourse.code);
                setSelectedYear(builderCourse.year);
                setAdminViewMode("preview");
              }}
              className="h-9 px-3 rounded-xl text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10"
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview as Student
            </Button>

            <Button
              size="sm"
              onClick={() => {
                showNotification({
                  type: "success",
                  title: "Course Saved in Real Time",
                  message: `All modifications for "${builderCourse.name}" (${builderCourse.code}) are persisted.`,
                  action: {
                    label: "Preview as Student",
                    onClick: () => {
                      setSelectedSubjectCode(builderCourse.code);
                      setSelectedYear(builderCourse.year);
                      setAdminViewMode("preview");
                    },
                  },
                  autoRefresh: true,
                });
              }}
              className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs h-9 px-4 shadow-xs"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Save Course
            </Button>
          </div>
        </div>

        {/* Builder Main Tabs (Arranged 1, 2, 3) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-b border-border/80">
          {/* TAB 1: BASIC INFO */}
          <button
            type="button"
            onClick={() => setBuilderTab("basic")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 cursor-pointer",
              builderTab === "basic"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>1. Basic Info</span>
          </button>

          {/* TAB 2: COURSE CONTENT */}
          <button
            type="button"
            onClick={() => setBuilderTab("modules")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 cursor-pointer",
              builderTab === "modules"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>2. Course Content</span>
            {builderModules.length > 0 && (
              <span
                className={cn(
                  "text-[10.5px] px-1.5 py-0.5 rounded-md font-mono font-medium leading-none",
                  builderTab === "modules"
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {builderModules.length}
              </span>
            )}
          </button>

          {/* TAB 3: OTHERS */}
          <button
            type="button"
            onClick={() => setBuilderTab("content")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 cursor-pointer",
              builderTab === "content"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>3. Others</span>
          </button>
        </div>

        {/* TAB 1: BASIC INFO */}
        {builderTab === "basic" && (
          <Card className="rounded-2xl border-border/80 p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Course Metadata &amp; Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Course Code *</label>
                <Input
                  disabled
                  value={builderCourse.code}
                  className="h-10 rounded-xl font-mono uppercase bg-muted/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Course Name *</label>
                <Input
                  value={builderCourse.name}
                  onChange={(e) => {
                    updateCurriculumCourse(builderCourse.code, { name: e.target.value });
                  }}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Academic Year</label>
                <select
                  value={builderCourse.year}
                  onChange={(e) => {
                    updateCurriculumCourse(builderCourse.code, { year: e.target.value });
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-card text-xs text-foreground font-medium"
                >
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Program Track</label>
                <select
                  value={builderCourse.program}
                  onChange={(e) => {
                    updateCurriculumCourse(builderCourse.code, { program: e.target.value as ProgramLevel });
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-card text-xs text-foreground font-medium"
                >
                  <option value="DIPLOMA">Diploma in Medical Laboratory Technology</option>
                  <option value="BSC">B.Sc. in Health Technology (Laboratory)</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-foreground">Syllabus Description &amp; Scope</label>
                <textarea
                  rows={3}
                  value={builderCourse.description}
                  onChange={(e) => {
                    updateCurriculumCourse(builderCourse.code, { description: e.target.value });
                  }}
                  className="w-full p-3 rounded-xl border border-border bg-card text-xs text-foreground resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => {
                  showNotification({
                    type: "success",
                    title: "Metadata Updated",
                    message: "Course basic parameters updated successfully.",
                  });
                }}
                className="bg-primary text-white text-xs rounded-xl h-9 px-4"
              >
                Save Basic Info
              </Button>
            </div>
          </Card>
        )}

        {/* TAB 2: MODULES & UNITS */}
        {builderTab === "modules" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Topics &amp; Components Hierarchy</h3>
                <p className="text-xs text-muted-foreground">Manage curriculum topics and clinical components for {builderCourse.code}.</p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setTargetModId("");
                  openAddModuleModal();
                }}
                className="bg-primary text-white text-xs rounded-xl h-8 px-3"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Topic
              </Button>
            </div>

            <div className="space-y-3">
              {builderModules.map((mod) => (
                <Card key={mod.id} className="p-4 sm:p-5 rounded-2xl border-border space-y-3 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-mono text-xs font-semibold">
                        {mod.unitNumber}
                      </span>
                      <h4 className="font-semibold text-sm text-foreground">{formatTopicTitle(mod.title, mod.unitNumber)}</h4>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModuleModal(mod)}
                        className="h-7 text-xs px-2 rounded-lg"
                      >
                        <Edit2 className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteTarget({ type: "module", id: mod.id, name: mod.title })}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {mod.description && <p className="text-xs text-muted-foreground">{mod.description}</p>}

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{mod.subModules.length} Components • {mod.subModules.reduce((acc, sm) => acc + sm.lessons.length, 0)} Lessons</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openAddSubModuleModal(mod.id)}
                      className="h-7 text-xs text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Component
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DEEP CONTENT EDITOR */}
        {builderTab === "content" && (
          <div className="space-y-5">
            {/* Unit & Lesson Selector Controls */}
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                    Select Topic:
                  </span>
                  <select
                    value={builderSelectedUnitId}
                    onChange={(e) => setBuilderSelectedUnitId(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground max-w-xs"
                  >
                    {builderModules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {formatTopicTitle(m.title, m.unitNumber)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                    Select Lesson:
                  </span>
                  <select
                    value={builderSelectedLessonId}
                    onChange={(e) => setBuilderSelectedLessonId(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground max-w-xs"
                  >
                    {activeBuilderUnit?.subModules.flatMap((sm) =>
                      sm.lessons.map((les) => (
                        <option key={les.id} value={les.id}>
                          {les.title} ({les.duration})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {activeBuilderUnit && (
                <Button
                  size="sm"
                  onClick={() => openAddLessonModal(activeBuilderUnit.id, activeBuilderUnit.subModules[0]?.id || "")}
                  className="bg-primary text-white text-xs h-9 rounded-xl px-3 shrink-0 self-end sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add New Lesson to Topic
                </Button>
              )}
            </div>

            {/* Lesson Editing Canvas */}
            {activeBuilderLesson ? (
              <Card className="rounded-2xl border-border/80 shadow-xs p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">Editing Lesson:</span>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">{activeBuilderLesson.title}</h2>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (activeBuilderUnit) {
                        openEditLessonModal(activeBuilderUnit.id, activeBuilderUnit.subModules[0]?.id || "", activeBuilderLesson);
                      }
                    }}
                    className="h-8 text-xs rounded-xl"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit Full Lesson Modal
                  </Button>
                </div>

                {/* Sub-Tabs for Content Types (Notes_Attachments placed right after Notes, Viva Q/A renamed) */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-border/70">
                  {[
                    { id: "notes", label: "Lecture Notes & Key Takeaways", icon: FileText },
                    { id: "resources", label: `Notes_Attachments (${activeBuilderLesson.attachments?.length || 0})`, icon: Paperclip },
                    { id: "quizzes", label: `MCQ Quizzes (${activeBuilderLesson.quizzes?.length || 0})`, icon: HelpCircle },
                    { id: "viva", label: `Viva Q/A (${activeBuilderLesson.vivaQAs?.length || 0})`, icon: Award },
                    { id: "exams", label: `Board Exams (${activeBuilderLesson.previousQuestions?.length || 0})`, icon: History },
                    { id: "media", label: `Media (${(activeBuilderLesson.videos?.length || 0) + (activeBuilderLesson.images?.length || 0)})`, icon: Video },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isTabActive = builderContentSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setBuilderContentSubTab(tab.id as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer",
                          isTabActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* SUB-TAB 1: LECTURE NOTES & TAKEAWAYS */}
                {builderContentSubTab === "notes" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">Lecture Markdown / Procedural Text</label>
                      <textarea
                        rows={6}
                        value={activeBuilderLesson.lectureText || ""}
                        onChange={(e) => {
                          const updated = builderModules.map((m) => ({
                            ...m,
                            subModules: m.subModules.map((sm) => ({
                              ...sm,
                              lessons: sm.lessons.map((l) =>
                                l.id === activeBuilderLesson.id ? { ...l, lectureText: e.target.value } : l
                              ),
                            })),
                          }));
                          persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                        }}
                        className="w-full p-3 rounded-xl border border-border bg-card text-xs text-foreground font-mono leading-relaxed"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground">Key Bench Takeaways (Bullet Points)</label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const updated = builderModules.map((m) => ({
                              ...m,
                              subModules: m.subModules.map((sm) => ({
                                ...sm,
                                lessons: sm.lessons.map((l) =>
                                  l.id === activeBuilderLesson.id
                                    ? { ...l, notes: [...(l.notes || []), "New high-yield clinical takeaway."] }
                                    : l
                                ),
                              })),
                            }));
                            persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                          }}
                          className="h-6 text-xs text-primary"
                        >
                          + Add Takeaway
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {(activeBuilderLesson.notes || []).map((note, nIdx) => (
                          <div key={nIdx} className="flex items-center space-x-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-muted text-xs font-mono shrink-0">
                              {nIdx + 1}
                            </span>
                            <Input
                              value={note}
                              onChange={(e) => {
                                const newNotes = [...activeBuilderLesson.notes];
                                newNotes[nIdx] = e.target.value;
                                const updated = builderModules.map((m) => ({
                                  ...m,
                                  subModules: m.subModules.map((sm) => ({
                                    ...sm,
                                    lessons: sm.lessons.map((l) =>
                                      l.id === activeBuilderLesson.id ? { ...l, notes: newNotes } : l
                                    ),
                                  })),
                                }));
                                persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                              }}
                              className="h-9 text-xs rounded-xl flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newNotes = activeBuilderLesson.notes.filter((_, idx) => idx !== nIdx);
                                const updated = builderModules.map((m) => ({
                                  ...m,
                                  subModules: m.subModules.map((sm) => ({
                                    ...sm,
                                    lessons: sm.lessons.map((l) =>
                                      l.id === activeBuilderLesson.id ? { ...l, notes: newNotes } : l
                                    ),
                                  })),
                                }));
                                persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                              }}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">Clinical Bench &amp; Quality Control Alert</label>
                      <Input
                        value={activeBuilderLesson.benchAlert || ""}
                        onChange={(e) => {
                          const updated = builderModules.map((m) => ({
                            ...m,
                            subModules: m.subModules.map((sm) => ({
                              ...sm,
                              lessons: sm.lessons.map((l) =>
                                l.id === activeBuilderLesson.id ? { ...l, benchAlert: e.target.value } : l
                              ),
                            })),
                          }));
                          persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                        }}
                        className="h-10 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* SUB-TAB: NOTES_ATTACHMENTS WITH DIRECT FILE UPLOAD (UP TO 5MB) OR LINK & INSTANT DOWNLOAD */}
                {builderContentSubTab === "resources" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-border/80">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">Notes_Attachments ({activeBuilderLesson.attachments?.length || 0})</h4>
                        <p className="text-[11px] text-muted-foreground">Attach PDFs, SOPs, documents up to 5MB, or external resource links for students to download directly.</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setResourceTitle("");
                          setResourceLink("");
                          setResourceFileName("");
                          setResourceFileSize("");
                          setResourceFileDataUrl("");
                          setResourceMode("file");
                          setIsResourceModalOpen(true);
                        }}
                        className="bg-primary text-white text-xs rounded-xl h-8 px-3 cursor-pointer shadow-2xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Resource
                      </Button>
                    </div>

                    {/* INTERACTIVE ADD RESOURCE MODAL */}
                    {isResourceModalOpen && (
                      <Card className="p-4 sm:p-5 rounded-2xl border-primary/40 bg-primary/[0.02] space-y-4 shadow-sm animate-in fade-in">
                        <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
                          <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                            <Paperclip className="h-4 w-4 text-primary" />
                            Add Resource (Upload File up to 5MB or Provide Link)
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsResourceModalOpen(false)}
                            className="h-6 w-6 p-0 text-muted-foreground"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Mode Selector */}
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setResourceMode("file")}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer",
                              resourceMode === "file"
                                ? "bg-primary text-primary-foreground border-primary font-semibold shadow-2xs"
                                : "bg-card text-muted-foreground border-border hover:text-foreground"
                            )}
                          >
                            Upload File (up to 5MB)
                          </button>
                          <button
                            type="button"
                            onClick={() => setResourceMode("link")}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer",
                              resourceMode === "link"
                                ? "bg-primary text-primary-foreground border-primary font-semibold shadow-2xs"
                                : "bg-card text-muted-foreground border-border hover:text-foreground"
                            )}
                          >
                            Resource Link (URL)
                          </button>
                        </div>

                        {/* Title input */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">Resource Title *</label>
                          <Input
                            value={resourceTitle}
                            onChange={(e) => setResourceTitle(e.target.value)}
                            placeholder="e.g. SOP-01: Standard Phlebotomy Protocol & Bench Guidelines.pdf"
                            className="h-9 text-xs rounded-xl"
                          />
                        </div>

                        {/* File Upload Mode */}
                        {resourceMode === "file" && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground">Select File (PDF, DOC, XLS, Images - max 5MB) *</label>
                            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-card">
                              <input
                                type="file"
                                id="resource-file-input"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
                                  if (file.size > MAX_SIZE) {
                                    showNotification({
                                      type: "error",
                                      title: "File Too Large",
                                      message: "File exceeds the 5MB maximum limit. Please upload a smaller file or link externally.",
                                    });
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setResourceFileDataUrl(reader.result as string);
                                    setResourceFileName(file.name);
                                    setResourceFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                                    if (!resourceTitle.trim()) {
                                      setResourceTitle(file.name);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="hidden"
                              />
                              <label htmlFor="resource-file-input" className="cursor-pointer block space-y-1">
                                <Download className="h-6 w-6 text-primary mx-auto" />
                                <span className="text-xs font-semibold text-foreground block">
                                  {resourceFileName ? `Selected: ${resourceFileName} (${resourceFileSize})` : "Click to browse and upload file"}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">Maximum file size: 5MB</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {/* URL Link Mode */}
                        {resourceMode === "link" && (
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">Web Link / Cloud Document URL *</label>
                            <Input
                              value={resourceLink}
                              onChange={(e) => setResourceLink(e.target.value)}
                              placeholder="https://drive.google.com/... or https://dghs.gov.bd/sop.pdf"
                              className="h-9 text-xs rounded-xl font-mono"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsResourceModalOpen(false)}
                            className="h-8 text-xs rounded-xl"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!resourceTitle.trim()) {
                                showNotification({
                                  type: "error",
                                  title: "Title Required",
                                  message: "Please specify a resource title.",
                                });
                                return;
                              }

                              const ext = resourceFileName.split('.').pop()?.toUpperCase() || (resourceMode === "link" ? "LINK" : "PDF");
                              const newAtt: LessonAttachment = {
                                id: `att-${Date.now()}`,
                                name: resourceTitle.trim(),
                                fileType: ext,
                                fileSize: resourceFileSize || (resourceMode === "link" ? "External Link" : "1.5 MB"),
                                url: resourceFileDataUrl || resourceLink.trim() || "#",
                              };

                              const updated = builderModules.map((m) => ({
                                ...m,
                                subModules: m.subModules.map((sm) => ({
                                  ...sm,
                                  lessons: sm.lessons.map((l) =>
                                    l.id === activeBuilderLesson.id
                                      ? { ...l, attachments: [...(l.attachments || []), newAtt] }
                                      : l
                                  ),
                                })),
                              }));

                              persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                              setIsResourceModalOpen(false);
                              showNotification({
                                type: "success",
                                title: "Resource Added",
                                message: `"${resourceTitle}" added. Students can download it directly.`,
                              });
                            }}
                            className="bg-primary text-white text-xs h-8 px-4 rounded-xl font-semibold cursor-pointer shadow-2xs"
                          >
                            Save Resource
                          </Button>
                        </div>
                      </Card>
                    )}

                    {/* ATTACHMENTS LIST WITH DIRECT DOWNLOAD & TITLE EDIT */}
                    <div className="space-y-2">
                      {(activeBuilderLesson.attachments || []).map((att, aIdx) => (
                        <div
                          key={att.id}
                          className="p-3.5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                        >
                          <div className="flex items-center space-x-2.5 truncate flex-1">
                            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Paperclip className="h-4 w-4" />
                            </div>
                            <div className="truncate flex-1">
                              <Input
                                value={att.name}
                                onChange={(e) => {
                                  const newAtt = [...activeBuilderLesson.attachments!];
                                  newAtt[aIdx].name = e.target.value;
                                  const updated = builderModules.map((m) => ({
                                    ...m,
                                    subModules: m.subModules.map((sm) => ({
                                      ...sm,
                                      lessons: sm.lessons.map((l) =>
                                        l.id === activeBuilderLesson.id ? { ...l, attachments: newAtt } : l
                                      ),
                                    })),
                                  }));
                                  persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                                }}
                                className="h-7 text-xs rounded-lg font-medium"
                              />
                              <span className="text-[10px] text-muted-foreground font-mono pl-1">
                                {att.fileSize || "1.8 MB"} • {att.fileType || "PDF"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadAttachment(att)}
                              className="h-7 text-xs px-2.5 rounded-lg font-medium cursor-pointer"
                              title="Download resource file directly"
                            >
                              <Download className="h-3 w-3 mr-1 text-primary" />
                              Download
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newAtt = activeBuilderLesson.attachments!.filter((_, idx) => idx !== aIdx);
                                const updated = builderModules.map((m) => ({
                                  ...m,
                                  subModules: m.subModules.map((sm) => ({
                                    ...sm,
                                    lessons: sm.lessons.map((l) =>
                                      l.id === activeBuilderLesson.id ? { ...l, attachments: newAtt } : l
                                    ),
                                  })),
                                }));
                                persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                              }}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                              title="Delete Resource"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: QUIZZES WITH MULTI-TYPE CREATOR */}
                {builderContentSubTab === "quizzes" && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-border">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">Interactive Quizzes ({activeBuilderLesson.quizzes?.length || 0} Questions)</h4>
                        <p className="text-[11px] text-muted-foreground">Support for Single Choice, Multi-Select, True/False, Short Answer, and Case Scenarios.</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setIsQuizFormOpen(!isQuizFormOpen)}
                        className="bg-primary text-white text-xs rounded-xl h-8 px-3 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        {isQuizFormOpen ? "Close Form" : "Add New Question"}
                      </Button>
                    </div>

                    {/* INTERACTIVE QUESTION AUTHORING FORM */}
                    {isQuizFormOpen && (
                      <Card className="p-4 sm:p-5 rounded-2xl border-primary/40 bg-primary/[0.02] space-y-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
                          <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Create Quiz Question &amp; Set Right Answer
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsQuizFormOpen(false)}
                            className="h-6 w-6 p-0 text-muted-foreground"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* 1. Select Question Type */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                            1. Select Question Type:
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                            {[
                              { id: "mcq", label: "Single Choice (MCQ)" },
                              { id: "multi_select", label: "Multi-Select (Multiple)" },
                              { id: "true_false", label: "True / False" },
                              { id: "short_answer", label: "Short Answer" },
                              { id: "case_scenario", label: "Case Scenario" },
                            ].map((t) => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  setQuizFormType(t.id as QuizQuestionType);
                                  if (t.id === "true_false") {
                                    setQuizFormOptions(["True", "False"]);
                                    setQuizFormCorrectIndex(0);
                                  } else if (t.id === "short_answer") {
                                    setQuizFormOptions([]);
                                    setQuizFormCorrectText("");
                                  } else if (quizFormOptions.length < 2) {
                                    setQuizFormOptions(["Option 1", "Option 2", "Option 3", "Option 4"]);
                                  }
                                }}
                                className={cn(
                                  "px-2.5 py-2 rounded-xl text-xs text-center font-medium border transition-all cursor-pointer",
                                  quizFormType === t.id
                                    ? "bg-primary text-primary-foreground border-primary font-semibold shadow-2xs"
                                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                                )}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Clinical Case Scenario if applicable */}
                        {quizFormType === "case_scenario" && (
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">Clinical Scenario &amp; Lab Data *</label>
                            <textarea
                              rows={2}
                              value={quizFormScenario}
                              onChange={(e) => setQuizFormScenario(e.target.value)}
                              placeholder="e.g. A 52-year-old female presents with fatigue and jaundice. Total bilirubin is 5.4 mg/dL..."
                              className="w-full p-2.5 rounded-xl border border-border bg-card text-xs resize-none"
                            />
                          </div>
                        )}

                        {/* 3. Question Prompt */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">Question Text *</label>
                          <Input
                            required
                            value={quizFormQuestion}
                            onChange={(e) => setQuizFormQuestion(e.target.value)}
                            placeholder={
                              quizFormType === "true_false"
                                ? "e.g. Hemolyzed specimens cause pseudohyperkalemia in clinical chemistry."
                                : quizFormType === "short_answer"
                                ? "e.g. What is the standard anticoagulant for coagulation tests?"
                                : "e.g. Which biomarker is most specific for acute myocardial infarction?"
                            }
                            className="h-9 text-xs rounded-xl"
                          />
                        </div>

                        {/* 4. Options and Setting which is Right */}
                        {(quizFormType === "mcq" || quizFormType === "case_scenario") && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-semibold text-foreground">
                                Options (Click button to set which option is RIGHT):
                              </label>
                              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                Option {quizFormCorrectIndex + 1} marked as correct
                              </span>
                            </div>

                            <div className="space-y-2">
                              {quizFormOptions.map((opt, oIdx) => {
                                const isRight = quizFormCorrectIndex === oIdx;
                                return (
                                  <div key={oIdx} className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setQuizFormCorrectIndex(oIdx)}
                                      className={cn(
                                        "h-8 px-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0 transition-all cursor-pointer",
                                        isRight
                                          ? "bg-emerald-600 text-white shadow-2xs"
                                          : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                                      )}
                                      title="Click to set this option as the right answer"
                                    >
                                      {isRight ? <Check className="h-3.5 w-3.5 mr-1" /> : null}
                                      <span>{isRight ? "✓ RIGHT ANSWER" : "Set as Right"}</span>
                                    </button>

                                    <Input
                                      value={opt}
                                      onChange={(e) => {
                                        const newOpts = [...quizFormOptions];
                                        newOpts[oIdx] = e.target.value;
                                        setQuizFormOptions(newOpts);
                                      }}
                                      className={cn("h-8 text-xs rounded-xl flex-1", isRight && "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 font-medium")}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Multi-Select Options & Setting Correct Indices */}
                        {quizFormType === "multi_select" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-semibold text-foreground">
                                Options (Check which options are RIGHT - multiple allowed):
                              </label>
                              <span className="text-[11px] font-medium text-emerald-600">
                                {quizFormCorrectIndices.length} correct options selected
                              </span>
                            </div>

                            <div className="space-y-2">
                              {quizFormOptions.map((opt, oIdx) => {
                                const isRight = quizFormCorrectIndices.includes(oIdx);
                                return (
                                  <div key={oIdx} className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = isRight
                                          ? quizFormCorrectIndices.filter((i) => i !== oIdx)
                                          : [...quizFormCorrectIndices, oIdx];
                                        setQuizFormCorrectIndices(next);
                                      }}
                                      className={cn(
                                        "h-8 px-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0 transition-all cursor-pointer",
                                        isRight
                                          ? "bg-emerald-600 text-white shadow-2xs"
                                          : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                                      )}
                                    >
                                      {isRight ? <Check className="h-3.5 w-3.5 mr-1" /> : null}
                                      <span>{isRight ? "✓ RIGHT" : "Mark Right"}</span>
                                    </button>

                                    <Input
                                      value={opt}
                                      onChange={(e) => {
                                        const newOpts = [...quizFormOptions];
                                        newOpts[oIdx] = e.target.value;
                                        setQuizFormOptions(newOpts);
                                      }}
                                      className={cn("h-8 text-xs rounded-xl flex-1", isRight && "border-emerald-500 bg-emerald-50/20 font-medium")}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* True / False Setting */}
                        {quizFormType === "true_false" && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Select Which is Right:</label>
                            <div className="flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => setQuizFormCorrectIndex(0)}
                                className={cn(
                                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                                  quizFormCorrectIndex === 0
                                    ? "bg-emerald-600 text-white shadow-2xs"
                                    : "bg-muted text-muted-foreground border border-border"
                                )}
                              >
                                {quizFormCorrectIndex === 0 && "✓ "}TRUE is Correct
                              </button>
                              <button
                                type="button"
                                onClick={() => setQuizFormCorrectIndex(1)}
                                className={cn(
                                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                                  quizFormCorrectIndex === 1
                                    ? "bg-emerald-600 text-white shadow-2xs"
                                    : "bg-muted text-muted-foreground border border-border"
                                )}
                              >
                                {quizFormCorrectIndex === 1 && "✓ "}FALSE is Correct
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Short Answer Setting */}
                        {quizFormType === "short_answer" && (
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">Target Correct Answer / Expected String *</label>
                            <Input
                              required
                              value={quizFormCorrectText}
                              onChange={(e) => setQuizFormCorrectText(e.target.value)}
                              placeholder="e.g. Sodium Citrate (or 3.2% Sodium Citrate)"
                              className="h-9 text-xs rounded-xl border-emerald-500/80 bg-emerald-50/10 font-semibold"
                            />
                            <p className="text-[10px] text-muted-foreground">Student answer will be matched case-insensitively.</p>
                          </div>
                        )}

                        {/* 5. Clinical Rationale */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">Clinical Explanation &amp; Rationale</label>
                          <textarea
                            rows={2}
                            value={quizFormExplanation}
                            onChange={(e) => setQuizFormExplanation(e.target.value)}
                            placeholder="Explain the physiological mechanism or standard protocol rationale..."
                            className="w-full p-2.5 rounded-xl border border-border bg-card text-xs resize-none"
                          />
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsQuizFormOpen(false)}
                            className="h-8 text-xs rounded-xl"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!quizFormQuestion.trim()) {
                                showNotification({ type: "error", title: "Missing Question", message: "Please provide a question prompt." });
                                return;
                              }

                              const newQuestionItem: LessonQuiz = {
                                id: `quiz-${Date.now()}`,
                                type: quizFormType,
                                scenario: quizFormScenario.trim(),
                                question: quizFormQuestion.trim(),
                                options: quizFormType === "short_answer" ? [] : quizFormOptions.map((s) => s.trim()),
                                correctIndex: quizFormCorrectIndex,
                                correctIndices: quizFormType === "multi_select" ? quizFormCorrectIndices : [quizFormCorrectIndex],
                                correctText: quizFormCorrectText.trim(),
                                explanation: quizFormExplanation.trim() || "Verified clinical laboratory quality standard.",
                              };

                              const updated = builderModules.map((m) => ({
                                ...m,
                                subModules: m.subModules.map((sm) => ({
                                  ...sm,
                                  lessons: sm.lessons.map((l) =>
                                    l.id === activeBuilderLesson.id
                                      ? { ...l, quizzes: [...(l.quizzes || []), newQuestionItem] }
                                      : l
                                  ),
                                })),
                              }));

                              persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                              setIsQuizFormOpen(false);
                              setQuizFormQuestion("");
                              setQuizFormScenario("");
                              setQuizFormExplanation("");
                              showNotification({
                                type: "success",
                                title: "Question Added",
                                message: `${quizFormType.toUpperCase()} question added with correct answer specified.`,
                                action: {
                                  label: "Preview Quiz",
                                  onClick: () => {
                                    setSelectedSubjectCode(builderCourse.code);
                                    setSelectedYear(builderCourse.year);
                                    setAdminViewMode("preview");
                                    setContentTab("quizzes");
                                  },
                                },
                              });
                            }}
                            className="bg-primary text-white text-xs h-8 px-4 rounded-xl font-semibold cursor-pointer"
                          >
                            Save Question to Quiz
                          </Button>
                        </div>
                      </Card>
                    )}

                    {/* EXISTING QUESTIONS LIST WITH REAL-TIME RIGHT ANSWER TOGGLE */}
                    <div className="space-y-3">
                      {(activeBuilderLesson.quizzes || []).map((quiz, qIdx) => {
                        const qType: QuizQuestionType = quiz.type || "mcq";

                        return (
                          <Card key={qIdx} className="p-4 rounded-xl border-border bg-card space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-xs text-foreground">Question {qIdx + 1}</span>
                                <Badge variant="blue" className="text-[10px] uppercase">
                                  {qType === "case_scenario"
                                    ? "Case Scenario"
                                    : qType === "multi_select"
                                    ? "Multi-Select"
                                    : qType === "true_false"
                                    ? "True / False"
                                    : qType === "short_answer"
                                    ? "Short Answer"
                                    : "Single Choice"}
                                </Badge>
                              </div>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const newQ = activeBuilderLesson.quizzes!.filter((_, idx) => idx !== qIdx);
                                  const updated = builderModules.map((m) => ({
                                    ...m,
                                    subModules: m.subModules.map((sm) => ({
                                      ...sm,
                                      lessons: sm.lessons.map((l) =>
                                        l.id === activeBuilderLesson.id ? { ...l, quizzes: newQ } : l
                                      ),
                                    })),
                                  }));
                                  persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                                }}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                title="Delete Question"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            {/* Question prompt */}
                            <Input
                              value={quiz.question}
                              onChange={(e) => {
                                const newQ = [...activeBuilderLesson.quizzes!];
                                newQ[qIdx].question = e.target.value;
                                const updated = builderModules.map((m) => ({
                                  ...m,
                                  subModules: m.subModules.map((sm) => ({
                                    ...sm,
                                    lessons: sm.lessons.map((l) =>
                                      l.id === activeBuilderLesson.id ? { ...l, quizzes: newQ } : l
                                    ),
                                  })),
                                }));
                                persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                              }}
                              className="h-8 text-xs rounded-lg font-medium"
                            />

                            {/* Options with live Right Answer click toggle */}
                            {(qType === "mcq" || qType === "case_scenario") && (
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[11px] text-muted-foreground font-medium block">
                                  Options (Click any pill to set as the Right Answer):
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {(quiz.options || []).map((opt, oIdx) => {
                                    const isRight = quiz.correctIndex === oIdx;
                                    return (
                                      <div
                                        key={oIdx}
                                        className={cn(
                                          "flex items-center space-x-1.5 p-2 rounded-lg border transition-all",
                                          isRight ? "bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-medium" : "bg-muted/30 border-border"
                                        )}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newQ = [...activeBuilderLesson.quizzes!];
                                            newQ[qIdx].correctIndex = oIdx;
                                            const updated = builderModules.map((m) => ({
                                              ...m,
                                              subModules: m.subModules.map((sm) => ({
                                                ...sm,
                                                lessons: sm.lessons.map((l) =>
                                                  l.id === activeBuilderLesson.id ? { ...l, quizzes: newQ } : l
                                                ),
                                              })),
                                            }));
                                            persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                                          }}
                                          className={cn(
                                            "h-6 px-1.5 rounded text-[10px] font-bold shrink-0 cursor-pointer",
                                            isRight ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                                          )}
                                          title="Click to set this option as Right"
                                        >
                                          {isRight ? "✓ RIGHT" : "SET"}
                                        </button>

                                        <Input
                                          value={opt}
                                          onChange={(e) => {
                                            const newQ = [...activeBuilderLesson.quizzes!];
                                            newQ[qIdx].options[oIdx] = e.target.value;
                                            const updated = builderModules.map((m) => ({
                                              ...m,
                                              subModules: m.subModules.map((sm) => ({
                                                ...sm,
                                                lessons: sm.lessons.map((l) =>
                                                  l.id === activeBuilderLesson.id ? { ...l, quizzes: newQ } : l
                                                ),
                                              })),
                                            }));
                                            persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                                          }}
                                          className="h-6 text-xs border-0 bg-transparent p-0 focus-visible:ring-0 flex-1"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* True / False Toggle in List */}
                            {qType === "true_false" && (
                              <div className="flex items-center space-x-2 pt-1 text-xs">
                                <span className="text-muted-foreground">Right Answer:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newQ = [...activeBuilderLesson.quizzes!];
                                    newQ[qIdx].correctIndex = 0;
                                    const updated = builderModules.map((m) => ({
                                      ...m,
                                      subModules: m.subModules.map((sm) => ({
                                        ...sm,
                                        lessons: sm.lessons.map((l) =>
                                          l.id === activeBuilderLesson.id ? { ...l, quizzes: newQ } : l
                                        ),
                                      })),
                                    }));
                                    persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                                  }}
                                  className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold", quiz.correctIndex === 0 ? "bg-emerald-600 text-white" : "bg-muted")}
                                >
                                  {quiz.correctIndex === 0 && "✓ "}True
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newQ = [...activeBuilderLesson.quizzes!];
                                    newQ[qIdx].correctIndex = 1;
                                    const updated = builderModules.map((m) => ({
                                      ...m,
                                      subModules: m.subModules.map((sm) => ({
                                        ...sm,
                                        lessons: sm.lessons.map((l) =>
                                          l.id === activeBuilderLesson.id ? { ...l, quizzes: newQ } : l
                                        ),
                                      })),
                                    }));
                                    persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                                  }}
                                  className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold", quiz.correctIndex === 1 ? "bg-emerald-600 text-white" : "bg-muted")}
                                >
                                  {quiz.correctIndex === 1 && "✓ "}False
                                </button>
                              </div>
                            )}

                            {/* Short Answer Target String in List */}
                            {qType === "short_answer" && (
                              <div className="flex items-center space-x-2 pt-1 text-xs">
                                <span className="text-muted-foreground shrink-0 font-medium">Right Answer String:</span>
                                <Input
                                  value={quiz.correctText || ""}
                                  onChange={(e) => {
                                    const newQ = [...activeBuilderLesson.quizzes!];
                                    newQ[qIdx].correctText = e.target.value;
                                    const updated = builderModules.map((m) => ({
                                      ...m,
                                      subModules: m.subModules.map((sm) => ({
                                        ...sm,
                                        lessons: sm.lessons.map((l) =>
                                          l.id === activeBuilderLesson.id ? { ...l, quizzes: newQ } : l
                                        ),
                                      })),
                                    }));
                                    persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                                  }}
                                  className="h-7 text-xs rounded-lg font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-500/50"
                                />
                              </div>
                            )}

                            {/* Clinical Rationale */}
                            <div className="pt-1">
                              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Clinical Rationale:</span>
                              <Input
                                value={quiz.explanation}
                                onChange={(e) => {
                                  const newQ = [...activeBuilderLesson.quizzes!];
                                  newQ[qIdx].explanation = e.target.value;
                                  const updated = builderModules.map((m) => ({
                                    ...m,
                                    subModules: m.subModules.map((sm) => ({
                                      ...sm,
                                      lessons: sm.lessons.map((l) =>
                                        l.id === activeBuilderLesson.id ? { ...l, quizzes: newQ } : l
                                      ),
                                    })),
                                  }));
                                  persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                                }}
                                className="h-7 text-xs rounded-lg"
                              />
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}{/* SUB-TAB 3: VIVA VOCE */}
                {builderContentSubTab === "viva" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Viva Q/A Voce Questions ({activeBuilderLesson.vivaQAs?.length || 0})</span>
                      <Button
                        size="sm"
                        onClick={() => {
                          const newV: LessonVivaQA = {
                            question: "How do you distinguish pre-analytical vs analytical errors in this diagnostic procedure?",
                            answer: "Pre-analytical errors involve specimen collection, hemolysis, and labeling. Analytical errors involve calibrator drift, reagent degradation, or temperature deviation.",
                            frequentlyAskedIn: "Faculty Board Viva Examination",
                          };
                          const updated = builderModules.map((m) => ({
                            ...m,
                            subModules: m.subModules.map((sm) => ({
                              ...sm,
                              lessons: sm.lessons.map((l) =>
                                l.id === activeBuilderLesson.id
                                  ? { ...l, vivaQAs: [...(l.vivaQAs || []), newV] }
                                  : l
                              ),
                            })),
                          }));
                          persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                        }}
                        className="bg-primary text-white text-xs rounded-xl h-8 px-3"
                      >
                        + Add Viva Question
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(activeBuilderLesson.vivaQAs || []).map((viva, vIdx) => (
                        <Card key={vIdx} className="p-4 rounded-xl border-border bg-card space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-foreground">Viva #{vIdx + 1}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newV = activeBuilderLesson.vivaQAs!.filter((_, idx) => idx !== vIdx);
                                const updated = builderModules.map((m) => ({
                                  ...m,
                                  subModules: m.subModules.map((sm) => ({
                                    ...sm,
                                    lessons: sm.lessons.map((l) =>
                                      l.id === activeBuilderLesson.id ? { ...l, vivaQAs: newV } : l
                                    ),
                                  })),
                                }));
                                persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                              }}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <Input
                            value={viva.question}
                            onChange={(e) => {
                              const newV = [...activeBuilderLesson.vivaQAs!];
                              newV[vIdx].question = e.target.value;
                              const updated = builderModules.map((m) => ({
                                ...m,
                                subModules: m.subModules.map((sm) => ({
                                  ...sm,
                                  lessons: sm.lessons.map((l) =>
                                    l.id === activeBuilderLesson.id ? { ...l, vivaQAs: newV } : l
                                  ),
                                })),
                              }));
                              persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                            }}
                            className="h-8 text-xs rounded-lg"
                          />
                          <textarea
                            rows={2}
                            value={viva.answer}
                            onChange={(e) => {
                              const newV = [...activeBuilderLesson.vivaQAs!];
                              newV[vIdx].answer = e.target.value;
                              const updated = builderModules.map((m) => ({
                                ...m,
                                subModules: m.subModules.map((sm) => ({
                                  ...sm,
                                  lessons: sm.lessons.map((l) =>
                                    l.id === activeBuilderLesson.id ? { ...l, vivaQAs: newV } : l
                                  ),
                                })),
                              }));
                              persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                            }}
                            className="w-full p-2.5 rounded-lg border border-border bg-card text-xs text-foreground resize-none"
                          />
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 4: BOARD EXAMS */}
                {builderContentSubTab === "exams" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Past Board Questions ({activeBuilderLesson.previousQuestions?.length || 0})</span>
                      <Button
                        size="sm"
                        onClick={() => {
                          const newPq: LessonPreviousQuestion = {
                            year: "2024",
                            exam: "SMFB Board Annual Examination",
                            questionText: `Discuss the clinical principle and diagnostic evaluation of ${activeBuilderLesson.title}.`,
                            marks: 6,
                            modelAnswer: "Formulate standard procedure, sample integrity, quality controls, and diagnostic reference range.",
                          };
                          const updated = builderModules.map((m) => ({
                            ...m,
                            subModules: m.subModules.map((sm) => ({
                              ...sm,
                              lessons: sm.lessons.map((l) =>
                                l.id === activeBuilderLesson.id
                                  ? { ...l, previousQuestions: [...(l.previousQuestions || []), newPq] }
                                  : l
                              ),
                            })),
                          }));
                          persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                        }}
                        className="bg-primary text-white text-xs rounded-xl h-8 px-3"
                      >
                        + Add Board Question
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(activeBuilderLesson.previousQuestions || []).map((pq, pIdx) => (
                        <Card key={pIdx} className="p-4 rounded-xl border-border bg-card space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-xs text-foreground">{pq.exam} ({pq.year})</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newP = activeBuilderLesson.previousQuestions!.filter((_, idx) => idx !== pIdx);
                                const updated = builderModules.map((m) => ({
                                  ...m,
                                  subModules: m.subModules.map((sm) => ({
                                    ...sm,
                                    lessons: sm.lessons.map((l) =>
                                      l.id === activeBuilderLesson.id ? { ...l, previousQuestions: newP } : l
                                    ),
                                  })),
                                }));
                                persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                              }}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <Input
                            value={pq.questionText}
                            onChange={(e) => {
                              const newP = [...activeBuilderLesson.previousQuestions!];
                              newP[pIdx].questionText = e.target.value;
                              const updated = builderModules.map((m) => ({
                                ...m,
                                subModules: m.subModules.map((sm) => ({
                                  ...sm,
                                  lessons: sm.lessons.map((l) =>
                                    l.id === activeBuilderLesson.id ? { ...l, previousQuestions: newP } : l
                                  ),
                                })),
                              }));
                              persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                            }}
                            className="h-8 text-xs rounded-lg"
                          />
                          <textarea
                            rows={2}
                            value={pq.modelAnswer}
                            onChange={(e) => {
                              const newP = [...activeBuilderLesson.previousQuestions!];
                              newP[pIdx].modelAnswer = e.target.value;
                              const updated = builderModules.map((m) => ({
                                ...m,
                                subModules: m.subModules.map((sm) => ({
                                  ...sm,
                                  lessons: sm.lessons.map((l) =>
                                    l.id === activeBuilderLesson.id ? { ...l, previousQuestions: newP } : l
                                  ),
                                })),
                              }));
                              persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                            }}
                            className="w-full p-2.5 rounded-lg border border-border bg-card text-xs text-foreground resize-none"
                          />
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 6: MEDIA */}
                {builderContentSubTab === "media" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-foreground block">Video Demonstrations</span>
                      {(activeBuilderLesson.videos || []).map((vid, vIdx) => (
                        <div key={vid.id} className="p-3 rounded-xl border border-border bg-card space-y-2 text-xs">
                          <Input
                            value={vid.title}
                            placeholder="Video Title"
                            onChange={(e) => {
                              const newV = [...activeBuilderLesson.videos!];
                              newV[vIdx].title = e.target.value;
                              const updated = builderModules.map((m) => ({
                                ...m,
                                subModules: m.subModules.map((sm) => ({
                                  ...sm,
                                  lessons: sm.lessons.map((l) =>
                                    l.id === activeBuilderLesson.id ? { ...l, videos: newV } : l
                                  ),
                                })),
                              }));
                              persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                            }}
                            className="h-8 text-xs rounded-lg"
                          />
                          <Input
                            value={vid.url}
                            placeholder="Embed URL"
                            onChange={(e) => {
                              const newV = [...activeBuilderLesson.videos!];
                              newV[vIdx].url = e.target.value;
                              const updated = builderModules.map((m) => ({
                                ...m,
                                subModules: m.subModules.map((sm) => ({
                                  ...sm,
                                  lessons: sm.lessons.map((l) =>
                                    l.id === activeBuilderLesson.id ? { ...l, videos: newV } : l
                                  ),
                                })),
                              }));
                              persistStudyMap({ ...studyMap, [builderCourseCode]: updated });
                            }}
                            className="h-8 text-xs rounded-lg font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 text-center text-muted-foreground text-xs rounded-2xl border-border">
                No lessons found in this module. Add a lesson to begin content authoring.
              </Card>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // ROOT ROUTING BY ROLE & MODE
  // ==========================================
  return (
    <>
      {/* 1. Student Role: Always renders the focused Student Learning Workspace */}
      {!isManagementRole && renderStudentStudyWorkspace()}

      {/* 2. Management Role (Super Admin / Admin / Mentor) */}
      {isManagementRole && (
        <>
          {adminViewMode === "archive" && renderAdminArchiveView()}
          {adminViewMode === "builder" && renderAdminCourseBuilder()}
          {adminViewMode === "preview" && renderStudentStudyWorkspace()}
        </>
      )}

      {/* MODALS PRESERVED FOR CRUD */}
      {/* 1. ADD SUBJECT MODAL */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-lg w-full p-4 sm:p-6 space-y-4 my-4 sm:my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Add Course / Subject</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSubjectOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Course Code *</label>
                <Input
                  required
                  placeholder="e.g. PARA-201"
                  value={subSubjectCode}
                  onChange={(e) => setSubSubjectCode(e.target.value)}
                  className="h-10 rounded-xl uppercase font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Course / Subject Name *</label>
                <Input
                  required
                  placeholder="e.g. Medical Parasitology & Entomology"
                  value={subSubjectName}
                  onChange={(e) => setSubSubjectName(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Program Track</label>
                  <select
                    value={subSubjectProgram}
                    onChange={(e) => setSubSubjectProgram(e.target.value as ProgramLevel)}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs"
                  >
                    <option value="DIPLOMA">Diploma in Medical Laboratory Technology</option>
                    <option value="BSC">B.Sc. in Health Technology (Laboratory)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Academic Year</label>
                  <select
                    value={subSubjectYear}
                    onChange={(e) => setSubSubjectYear(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs"
                  >
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Brief Syllabus Description</label>
                <textarea
                  rows={3}
                  value={subSubjectDesc}
                  onChange={(e) => setSubSubjectDesc(e.target.value)}
                  placeholder="Clinical rationale, specimen types, and lab diagnostic focus..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="rounded-xl min-h-[40px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold rounded-xl min-h-[40px]"
                >
                  Create Subject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD / EDIT MODULE (UNIT) MODAL */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-lg w-full p-4 sm:p-6 space-y-4 my-4 sm:my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  {moduleToEdit ? "Edit Topic" : "Add Topic"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModuleModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Topic Number *</label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={formUnitNumber}
                  onChange={(e) => setFormUnitNumber(Number(e.target.value))}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Topic Title *</label>
                <Input
                  required
                  placeholder="e.g. Topic 3: Cellular Pathology & Biopsy Fixation"
                  value={formModuleTitle}
                  onChange={(e) => setFormModuleTitle(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Topic Scope & Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formModuleDesc}
                  onChange={(e) => setFormModuleDesc(e.target.value)}
                  placeholder="Describe the clinical topics and lab competencies covered in this topic..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="rounded-xl min-h-[40px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold rounded-xl min-h-[40px]"
                >
                  {moduleToEdit ? "Update Topic" : "Add Topic"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD / EDIT SUB-MODULE MODAL */}
      {isSubModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4 my-4 sm:my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  {subModuleToEdit ? "Edit Component" : "Add Component"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsSubModuleModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubModule} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Component Title *</label>
                <Input
                  required
                  placeholder="e.g. Component 1.1: Automated Haematology Cell Counters"
                  value={formSubModuleTitle}
                  onChange={(e) => setFormSubModuleTitle(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSubModuleModalOpen(false)}
                  className="rounded-xl min-h-[40px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold rounded-xl min-h-[40px]"
                >
                  {subModuleToEdit ? "Update Component" : "Add Component"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD / EDIT LESSON MODAL */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-2xl w-full p-4 sm:p-6 space-y-4 my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  {lessonToEdit ? "Edit Lesson Workspace" : "Author New Lesson"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsLessonModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-foreground">Lesson Title *</label>
                  <Input
                    required
                    placeholder="e.g. Erythrocyte Sedimentation Rate (Westergren Method)"
                    value={formLessonTitle}
                    onChange={(e) => setFormLessonTitle(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Duration *</label>
                  <Input
                    required
                    placeholder="e.g. 25 min"
                    value={formLessonDuration}
                    onChange={(e) => setFormLessonDuration(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Detailed Lecture Text</label>
                <textarea
                  rows={5}
                  value={formLessonLectureText}
                  onChange={(e) => setFormLessonLectureText(e.target.value)}
                  placeholder="Detailed lecture notes, diagnostic clinical pathophysiology, and procedure..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Key Takeaways (one per paragraph/line)</label>
                <textarea
                  rows={3}
                  value={formLessonNotes}
                  onChange={(e) => setFormLessonNotes(e.target.value)}
                  placeholder="Enter key clinical takeaways separated by new lines..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Bench QC Alert Note</label>
                <Input
                  placeholder="e.g. Reject hemolyzed specimens. Calibration control must be within ±2 SD."
                  value={formBenchAlert}
                  onChange={(e) => setFormBenchAlert(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="rounded-xl min-h-[40px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold rounded-xl min-h-[40px]"
                >
                  {lessonToEdit ? "Update Lesson" : "Publish Lesson"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-3 text-destructive">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h2 className="text-lg font-semibold">
                Confirm{" "}
                {deleteTarget.type === "subject"
                  ? "Subject"
                  : deleteTarget.type === "module"
                  ? "Topic"
                  : deleteTarget.type === "submodule"
                  ? "Sub-Module"
                  : "Lesson"}{" "}
                Deletion
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">{deleteTarget.name}</strong> from Study Center? All associated notes, media, and test questions will be removed.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl min-h-[40px]"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteTarget.type === "subject") confirmDeleteSubject();
                  else if (deleteTarget.type === "module") confirmDeleteModule();
                  else if (deleteTarget.type === "submodule") confirmDeleteSubModule();
                  else confirmDeleteLesson();
                }}
                className="rounded-xl min-h-[40px]"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function StudyCenterPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground text-sm">Loading Study Center...</div>}>
      <StudyCenterContent />
    </React.Suspense>
  );
}
