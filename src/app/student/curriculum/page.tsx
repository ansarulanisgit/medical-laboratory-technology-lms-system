"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Layers,
  ArrowRight,
  CheckCircle2,
  PlusCircle,
  Edit2,
  Trash2,
  AlertCircle,
  Sliders,
  Hammer,
  Edit3,
  Lock,
} from "lucide-react";
import {
  useAcademicProfile,
  SubjectModule,
  ProgramLevel,
} from "@/lib/curriculum/academic-context";
import {
  getStoredStudyData,
  INITIAL_STUDY_CENTER_DATA,
  Module,
  isSubjectBuiltInStudyCenter,
} from "@/lib/curriculum/study-center-store";
import { useNotification } from "@/components/ui/notification-context";
import { cn } from "@/lib/utils";

const PROGRAM_FULL_NAMES: Record<ProgramLevel, string> = {
  DIPLOMA: "Diploma in Medical Laboratory Technology",
  BSC: "B.Sc. in Health Technology (Laboratory)",
};

export default function StudentCurriculumPage() {
  const router = useRouter();
  const {
    profile,
    coursesCatalog,
    deleteCurriculumCourse,
  } = useAcademicProfile();
  const { showNotification } = useNotification();

  // Load studyMap to verify if courses have existing content
  const [studyMap, setStudyMap] = React.useState<Record<string, Module[]>>({});
  const [completedLessons, setCompletedLessons] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setStudyMap(getStoredStudyData());

    const loadCompletedLessons = () => {
      try {
        const saved = localStorage.getItem("labtutor_completed_lessons");
        if (saved) {
          setCompletedLessons(JSON.parse(saved));
        }
      } catch {}
    };

    loadCompletedLessons();
    window.addEventListener("storage", loadCompletedLessons);
    return () => window.removeEventListener("storage", loadCompletedLessons);
  }, []);

  // Real-time dynamic course progress calculation for students
  const getCourseDynamicProgress = React.useCallback(
    (sub: SubjectModule): number => {
      const modules = studyMap[sub.code] || INITIAL_STUDY_CENTER_DATA[sub.code];
      if (modules && modules.length > 0) {
        const allLessons = modules.flatMap((m) => m.subModules.flatMap((sm) => sm.lessons));
        if (allLessons.length > 0) {
          const completedCount = allLessons.filter((l) => completedLessons[l.id]).length;
          if (completedCount > 0) {
            return Math.round((completedCount / allLessons.length) * 100);
          }
        }
      }
      return sub.progress || 0;
    },
    [studyMap, completedLessons]
  );

  const isCourseBuilt = React.useCallback(
    (code: string) => {
      return isSubjectBuiltInStudyCenter(code, studyMap);
    },
    [studyMap]
  );

  const currentRole = profile.role || "STUDENT";
  const isManagementRole = currentRole === "SUPER_ADMIN" || currentRole === "ADMIN" || currentRole === "MENTOR";

  // Selected Program: for management roles, allow switching between Diploma and B.Sc.
  const [managementProgram, setManagementProgram] = React.useState<ProgramLevel>(profile.program || "DIPLOMA");
  const activeProgram: ProgramLevel = isManagementRole ? managementProgram : profile.program;

  const [selectedYear, setSelectedYear] = React.useState(profile.academicYear || "1");

  // Keep year in sync if student profile changes
  React.useEffect(() => {
    if (!isManagementRole) {
      setSelectedYear(profile.academicYear || "1");
    }
  }, [profile.academicYear, isManagementRole]);

  const activeProgramName = PROGRAM_FULL_NAMES[activeProgram];

  const currentYearLabel = `Year ${profile.academicYear}`;
  const currentSessionLabel = "Syllabus Standard";

  // Subjects for the currently selected year tab from reactive coursesCatalog
  const displayedSubjects = React.useMemo(() => {
    return coursesCatalog.filter(
      (s) => s.program === activeProgram && s.year === selectedYear
    );
  }, [coursesCatalog, activeProgram, selectedYear]);

  // Total courses count for active program
  const totalProgramCourses = React.useMemo(() => {
    return coursesCatalog.filter((s) => s.program === activeProgram).length;
  }, [coursesCatalog, activeProgram]);

  // State for Course Deletion
  const [courseToDelete, setCourseToDelete] = React.useState<SubjectModule | null>(null);

  const handleDeleteCourse = () => {
    if (!courseToDelete) return;
    const code = courseToDelete.code;
    const res = deleteCurriculumCourse(code);
    if (res.success) {
      setCourseToDelete(null);
      showNotification({
        type: "success",
        title: "Course Removed",
        message: `Course ${code} has been deleted from the curriculum.`,
        autoRefresh: true,
      });
    } else {
      showNotification({
        type: "error",
        title: "Delete Failed",
        message: res.error || "Failed to delete course.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner: Profile Academic Status (Role-Aware) */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {isManagementRole && (
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="blue" className="text-[10px] font-medium">
                  {currentRole === "SUPER_ADMIN"
                    ? "Super Admin Authority"
                    : currentRole === "ADMIN"
                    ? "Admin Manage Mode"
                    : "Faculty Mentor View"}
                </Badge>
              </div>
            )}

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Course Curriculum
            </h1>

            {/* Management Role Header vs Student Role Header */}
            {isManagementRole ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                  Program:
                </span>
                <div className="inline-flex rounded-xl border border-border p-1 bg-muted/40 gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setManagementProgram("DIPLOMA")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      activeProgram === "DIPLOMA"
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-card"
                    )}
                  >
                    Diploma in Medical Laboratory Technology
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagementProgram("BSC")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      activeProgram === "BSC"
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-card"
                    )}
                  >
                    B.Sc. in Health Technology (Laboratory)
                  </button>
                </div>
                <span className="text-xs text-muted-foreground font-normal">
                  • <strong className="text-foreground">{totalProgramCourses}</strong> Courses Across 4 Years
                </span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                Program: <span className="text-foreground font-medium">{activeProgramName}</span> • Current Status:{" "}
                <span className="text-primary font-medium">{currentYearLabel}</span> ({currentSessionLabel})
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Management role: Add Curriculum button */}
            {isManagementRole && (
              <Link
                href={`/student/curriculum/manage?program=${activeProgram}&year=${selectedYear}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/student/curriculum/manage?program=${activeProgram}&year=${selectedYear}`);
                }}
                className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl text-xs min-h-[38px] px-4 py-2 shadow-xs transition-all cursor-pointer select-none"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                <span>Add Curriculum</span>
              </Link>
            )}

            {/* ONLY FOR STUDENTS: Change Academic Status */}
            {!isManagementRole && (
              <Link
                href="/student/profile"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/student/profile");
                }}
                className="inline-flex items-center justify-center min-h-[38px] px-3.5 shrink-0 text-foreground font-medium rounded-xl text-xs border border-input bg-card hover:bg-muted/60 transition-colors shadow-xs select-none cursor-pointer"
              >
                <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-primary" />
                <span>Change Academic Status</span>
              </Link>
            )}
          </div>
        </div>

        {/* Selector Tabs: 4 Years */}
        <div className="flex items-center space-x-2 pt-2 border-t border-border overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2 shrink-0">
            Select Syllabus Year:
          </span>
          {["1", "2", "3", "4"].map((yr) => {
            const isStudentCurrent = !isManagementRole && yr === profile.academicYear;
            const isSelected = yr === selectedYear;

            return (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 min-h-[36px]",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground font-normal"
                )}
              >
                <span>Year {yr}</span>
                {isStudentCurrent && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses/Subjects List for Selected Stage */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground flex items-center gap-2 flex-wrap">
              <span>{isManagementRole ? `${activeProgramName} • Year ${selectedYear}` : `Courses for Year ${selectedYear}`}</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 text-xs font-semibold px-2.5 py-0.5 rounded-lg shadow-2xs">
                {displayedSubjects.length} Courses
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground font-normal">
              Showing {displayedSubjects.length} accredited courses mapped for this academic stage
            </p>
          </div>
          {!isManagementRole && selectedYear === profile.academicYear && (
            <Badge variant="filled" className="text-xs font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active Syllabus
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {displayedSubjects.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground rounded-2xl border-dashed border-border/80">
              <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground/60" />
              <p className="text-sm font-medium">No courses found for {activeProgramName} (Year {selectedYear}).</p>
              {isManagementRole && (
                <Link href={`/student/curriculum/manage?year=${selectedYear}&program=${activeProgram}`}>
                  <Button
                    size="sm"
                    className="mt-3 bg-primary text-primary-foreground text-xs rounded-xl"
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Add Course for Year {selectedYear}
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            displayedSubjects.map((sub, index) => {
              const dynamicProg = getCourseDynamicProgress(sub);
              return (
              <Card
                key={sub.code}
                className="border-border/80 hover:border-primary/50 hover:shadow-xs transition-all rounded-2xl"
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Column: Course Info */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex items-start space-x-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-mono text-xs font-semibold shrink-0 mt-0.5 shadow-2xs">
                        {index + 1}
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/70">
                            {sub.code}
                          </span>
                          <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                            {sub.name}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                          {sub.description}
                        </p>
                      </div>
                    </div>

                    {/* Info Badges & Metadata Chips */}
                    <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-11 text-xs">
                      <Badge variant="filled" className="text-[10px] py-0.5 font-medium">
                        <Layers className="h-3 w-3 mr-1" />
                        {sub.units} Topics
                      </Badge>
                      <Badge variant="blue" className="text-[10px] py-0.5 font-medium">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {sub.lessons} Lessons
                      </Badge>
                      <span className="inline-flex items-center text-muted-foreground text-[11px] bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/80 font-normal">
                        Theory + Practical Lab
                      </span>
                      <span className="inline-flex items-center text-muted-foreground text-[11px] bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/80 font-normal">
                        100 Marks (50% Pass)
                      </span>
                      {/* Show progress badge strictly for students with real-time dynamic value */}
                      {!isManagementRole && isCourseBuilt(sub.code) && dynamicProg > 0 && (
                        <span className="inline-flex items-center font-medium text-emerald-700 dark:text-emerald-300 text-[11px] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {dynamicProg}% Covered
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Beautiful Action Buttons (Role-Aware) */}
                  <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0 gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {/* Beautiful Management Edit / Delete Controls */}
                      {isManagementRole && (
                        <div className="flex items-center space-x-1.5">
                          <Link
                            href={`/student/curriculum/manage?code=${encodeURIComponent(sub.code)}`}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/student/curriculum/manage?code=${encodeURIComponent(sub.code)}`);
                            }}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border/80 bg-background/90 hover:bg-muted/70 hover:border-primary/50 text-foreground transition-all shadow-2xs group cursor-pointer"
                            title="Edit Curriculum Specifications & Metadata"
                            aria-label="Edit curriculum specifications"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </Link>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setCourseToDelete(sub)}
                            className="h-9 w-9 p-0 rounded-xl border border-destructive/25 bg-destructive/5 hover:bg-destructive/15 text-destructive/80 hover:text-destructive hover:border-destructive/40 transition-all shadow-2xs cursor-pointer"
                            title="Delete Course from Curriculum"
                            aria-label="Delete course"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}

                      <Link
                        href={`/student/curriculum/${sub.code}`}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/student/curriculum/${sub.code}`);
                        }}
                        className="inline-flex items-center justify-center w-full sm:w-auto h-9 text-foreground font-medium px-3.5 rounded-xl text-xs border border-border/80 bg-card hover:bg-muted/60 transition-colors shadow-2xs cursor-pointer"
                      >
                        Curriculum Details
                      </Link>

                      {/* Main Action: Build Course / Edit Course / Start Study */}
                      {isManagementRole ? (
                        isCourseBuilt(sub.code) ? (
                          <Link
                            href={`/student/study-center?subject=${encodeURIComponent(sub.code)}&mode=builder`}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/student/study-center?subject=${encodeURIComponent(sub.code)}&mode=builder`);
                            }}
                            className="inline-flex items-center justify-center w-full sm:w-auto h-9 bg-primary text-primary-foreground font-semibold px-4 shadow-xs hover:opacity-95 rounded-xl text-xs space-x-1.5 transition-all cursor-pointer active:scale-95"
                            title="Edit Course Content in Course Builder"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Edit Course</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/student/study-center?subject=${encodeURIComponent(sub.code)}&mode=builder`}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/student/study-center?subject=${encodeURIComponent(sub.code)}&mode=builder`);
                            }}
                            className="inline-flex items-center justify-center w-full sm:w-auto h-9 bg-primary text-primary-foreground font-semibold px-4 shadow-xs hover:opacity-95 rounded-xl text-xs space-x-1.5 transition-all cursor-pointer active:scale-95"
                            title="Build Course Modules, Lessons, Quizzes & Viva"
                          >
                            <Hammer className="h-3.5 w-3.5" />
                            <span>Build Course</span>
                          </Link>
                        )
                      ) : isCourseBuilt(sub.code) ? (
                        <Link
                          href={`/student/study-center?subject=${encodeURIComponent(sub.code)}`}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/student/study-center?subject=${encodeURIComponent(sub.code)}`);
                          }}
                          className="inline-flex items-center justify-center w-full sm:w-auto h-9 bg-primary text-primary-foreground font-medium px-4 shadow-xs hover:opacity-95 rounded-xl text-xs space-x-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <span>{dynamicProg > 0 ? "Continue Study" : "Start Study"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            showNotification({
                              type: "info",
                              title: "Course Content Not Available Yet",
                              message: `Study Center course materials for ${sub.code} have not been built or published by the faculty yet. You can view the official syllabus by clicking 'Curriculum Details'.`,
                            });
                          }}
                          className="inline-flex items-center justify-center w-full sm:w-auto h-9 rounded-xl px-3.5 text-xs font-medium border border-border/80 bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground cursor-pointer transition-colors space-x-1.5 shadow-2xs"
                          title="Interactive course materials have not been built in Study Center yet"
                        >
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Content in Development</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
            })
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-3 text-destructive">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h2 className="text-lg font-semibold">Confirm Course Deletion</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove <strong className="text-foreground">{courseToDelete.code}: {courseToDelete.name}</strong> from the accredited curriculum?
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setCourseToDelete(null)}
                className="rounded-xl min-h-[40px]"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCourse}
                className="rounded-xl min-h-[40px]"
              >
                Delete Course
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
