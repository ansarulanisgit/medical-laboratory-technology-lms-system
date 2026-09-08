"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Layers,
  Award,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Download,
  Check,
  Edit2,
  Edit3,
  Target,
  Lock,
  Hammer,
} from "lucide-react";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { useNotification } from "@/components/ui/notification-context";
import { getCourseCurriculum, CourseCurriculumDetail } from "@/lib/curriculum/course-details-data";
import { getStoredStudyData, Module as StoreModule, isSubjectBuiltInStudyCenter } from "@/lib/curriculum/study-center-store";

export default function CourseCurriculumDetailPage() {
  const params = useParams();
  const rawCode = (params?.code as string) || "ANAT-101";
  const courseCode = decodeURIComponent(rawCode).toUpperCase();

  const { profile } = useAcademicProfile();
  const course: CourseCurriculumDetail = React.useMemo(() => {
    return getCourseCurriculum(courseCode);
  }, [courseCode]);

  const { showNotification } = useNotification();
  const [studyMap, setStudyMap] = React.useState<Record<string, StoreModule[]>>({});

  React.useEffect(() => {
    setStudyMap(getStoredStudyData());
  }, []);

  // Check if course materials have been built in Study Center
  const isBuilt = React.useMemo(() => {
    return isSubjectBuiltInStudyCenter(courseCode, studyMap);
  }, [courseCode, studyMap]);

  // Curriculum accordion strictly displays syllabus modules from course details specifications
  const displayModules = course.modules || [];

  const totalLessonsCount = React.useMemo(() => {
    return displayModules.reduce(
      (acc: number, m: any) =>
        acc + (m.subModules || []).reduce((sAcc: number, sm: any) => sAcc + (sm.lessons || []).length, 0),
      0
    );
  }, [displayModules]);

  const currentRole = profile?.role || "STUDENT";
  const isManagementRole = currentRole === "SUPER_ADMIN" || currentRole === "ADMIN" || currentRole === "MENTOR";

  // Track expanded unit modules in curriculum accordion
  const [expandedUnits, setExpandedUnits] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    course.modules.forEach((mod, idx) => {
      init[mod.id] = idx === 0; // Default expand the first topic
    });
    return init;
  });

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    course.modules.forEach((mod) => {
      all[mod.id] = true;
    });
    setExpandedUnits(all);
  };

  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    course.modules.forEach((mod) => {
      all[mod.id] = false;
    });
    setExpandedUnits(all);
  };

  const programLabel =
    course.program === "BSC"
      ? "B.Sc. in Health Technology (Laboratory)"
      : "Diploma in Medical Laboratory Technology";

  const yearLabel = `Year ${course.year}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Link href="/student" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/student/curriculum" className="hover:text-primary transition-colors">
            Course Curriculum
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{course.code}</span>
        </div>

        <div className="flex items-center space-x-2">
          {course.pdfUrl && (
            <a
              href={course.pdfUrl}
              download
              className="hidden sm:inline-block"
            >
              <Button variant="outline" size="sm" className="min-h-[38px] text-xs font-semibold rounded-xl border-primary/40 text-primary hover:bg-primary/10">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download PDF
              </Button>
            </a>
          )}
          <Link
            href="/student/curriculum"
            className="inline-flex items-center justify-center min-h-[38px] text-xs font-medium rounded-xl border border-input bg-card hover:bg-muted/60 px-3 text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            <span>Back to Courses</span>
          </Link>
          {isManagementRole ? (
            isBuilt ? (
              <>
                <Link
                  href={`/student/study-center?subject=${encodeURIComponent(course.code)}&mode=builder`}
                  className="inline-flex items-center justify-center min-h-[38px] text-xs bg-card border border-border/80 hover:bg-muted font-medium rounded-xl px-3 text-foreground transition-colors shadow-2xs cursor-pointer"
                  title="Edit course content in Course Builder"
                >
                  <Edit3 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>Edit in Course Builder</span>
                </Link>
                <Link
                  href={`/student/study-center?subject=${course.code}`}
                  className="inline-flex items-center justify-center min-h-[38px] text-xs bg-primary text-primary-foreground font-medium rounded-xl px-3 hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Enter Course Player</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </>
            ) : (
              <Link
                href={`/student/study-center?subject=${encodeURIComponent(course.code)}&mode=builder`}
                className="inline-flex items-center justify-center min-h-[38px] text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-3.5 transition-colors shadow-xs cursor-pointer active:scale-95"
                title="Build Course Modules, Lessons, SOPs & Quizzes in Study Center"
              >
                <Hammer className="h-3.5 w-3.5 mr-1.5" />
                <span>Build Course in Study Center</span>
              </Link>
            )
          ) : isBuilt ? (
            <Link
              href={`/student/study-center?subject=${course.code}`}
              className="inline-flex items-center justify-center min-h-[38px] text-xs bg-primary text-primary-foreground font-medium rounded-xl px-3 hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
            >
              <span>Enter Course Player</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                showNotification({
                  type: "info",
                  title: "Course Player Not Available Yet",
                  message: `Interactive course player materials (lectures, clinical SOPs, and quizzes) for ${course.code} have not been built or published in the Study Center yet.`,
                });
              }}
              className="inline-flex items-center justify-center min-h-[38px] text-xs bg-muted/40 border border-border/80 hover:bg-muted/70 font-medium rounded-xl px-3 text-muted-foreground transition-colors shadow-2xs cursor-pointer space-x-1.5"
              title="Study Center course player content is not yet built"
            >
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Content in Development</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Hero Header Banner (Tutor LMS Course Header) */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="filled" className="font-mono text-xs font-semibold px-2.5 py-1">
            {course.code}
          </Badge>
          <Badge variant="blue" className="text-xs font-medium">
            {course.curriculumVersion}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground border border-border/80 rounded-full px-2.5 py-0.5 bg-muted/40">
            {course.accreditationBody}
          </span>
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Active Accredited Course
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {course.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">
            Program: <span className="text-foreground font-medium">{programLabel}</span> • Academic Stage:{" "}
            <span className="text-primary font-medium">{yearLabel}</span> • Faculty:{" "}
            <span className="text-foreground font-medium">Department of Laboratory Medicine</span>
          </p>
        </div>

        {/* Quick Stats Strip */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground font-normal">
          <span className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary" />
            <strong className="text-foreground font-semibold">{displayModules.length || course.totalUnits}</strong> Topics
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" />
            <strong className="text-foreground font-semibold">{course.totalLessons}</strong> Structured Lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <strong className="text-foreground font-semibold">{course.totalHours || 120}</strong> Contact Hours
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-primary" />
            <strong className="text-foreground font-semibold">{course.assessment.totalMarks}</strong> Marks ({course.assessment.passPercentage}% Pass)
          </span>
        </div>
      </div>

      {/* Main Course Content (Full Width Layout) */}
      <div className="space-y-8">
        {/* Official Syllabus Document Download Banner (if available) */}
        {course.pdfUrl && (
          <Card className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-foreground">
                    Official Curriculum & Syllabus Document
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    State Medical Faculty of Bangladesh (SMFB) Approved Syllabus PDF
                  </p>
                </div>
              </div>
              <a
                href={course.pdfUrl}
                download
                className="shrink-0"
              >
                <Button size="sm" className="bg-primary text-primary-foreground font-medium rounded-xl text-xs min-h-[36px] shadow-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download Syllabus PDF
                </Button>
              </a>
            </div>
          </Card>
        )}

        {/* 1. About This Course */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              About This Course
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              {course.detailedOverview}
            </p>
          </div>

          {/* 2. What You Will Learn (Signature Tutor LMS Competencies Box) */}
          <Card className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-foreground font-semibold text-base">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>What You Will Learn</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
              {course.courseAims.map((aim, idx) => (
                <div key={idx} className="flex items-start space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground leading-relaxed font-normal">
                    {aim}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. Course Curriculum (Tutor LMS Collapsible Accordion) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                    Course Curriculum
                  </h2>
                  {isBuilt ? (
                    <Badge variant="blue" className="text-[10px] font-semibold py-0.5">
                      Active in Study Center
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800 py-0.5 font-medium">
                      Not Yet Built in Study Center
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-normal">
                  {displayModules.length} Topics • {totalLessonsCount} Lessons • Full Practical OSPE Stations
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                {isManagementRole && (
                  <Link
                    href={`/student/study-center?subject=${encodeURIComponent(course.code)}&mode=builder`}
                    className="inline-flex items-center justify-center min-h-[34px] text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-3.5 transition-all shadow-xs cursor-pointer active:scale-95 space-x-1.5"
                    title={isBuilt ? "Edit Course in Study Center Builder" : "Build Course in Study Center"}
                  >
                    {isBuilt ? <Edit3 className="h-3.5 w-3.5" /> : <Hammer className="h-3.5 w-3.5" />}
                    <span>{isBuilt ? "Edit Course in Builder" : "Build Course in Study Center"}</span>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandAll}
                  className="text-xs min-h-[34px] rounded-xl font-medium"
                >
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAll}
                  className="text-xs min-h-[34px] rounded-xl font-medium"
                >
                  Collapse All
                </Button>
              </div>
            </div>

            {/* Accordion Topics List */}
            <div className="space-y-3">
              {displayModules.map((module: any) => {
                const isExpanded = !!expandedUnits[module.id];
                const totalTopicLessons = module.subModules.reduce(
                  (acc: number, sm: any) => acc + (sm.lessons || []).length,
                  0
                );

                return (
                  <Card
                    key={module.id}
                    className="rounded-2xl border border-border/80 overflow-hidden shadow-xs transition-all"
                  >
                    {/* Topic Accordion Header */}
                    <button
                      onClick={() => toggleUnit(module.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-mono text-xs font-semibold shrink-0 mt-0.5 shadow-2xs">
                          {module.unitNumber}
                        </span>
                        <div className="space-y-0.5 min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                            {(() => {
                            const clean = module.title.replace(/^(Unit|Module)\s+(\d+)[:\s]*/i, "Topic $2: ");
                            if (!/^Topic\s+/i.test(clean)) return `Topic ${module.unitNumber}: ${clean}`;
                            return clean;
                          })()}
                          </h3>
                          <p className="text-[11px] text-muted-foreground font-normal">
                            {module.subModules.length > 1 ? `${module.subModules.length} Components • ` : ""}{totalTopicLessons} Lessons
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 ml-3">
                        <span className="text-[11px] text-muted-foreground hidden sm:inline font-normal">
                          {isExpanded ? "Collapse" : "Expand"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Topic Accordion Body */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 border-t border-border space-y-3 animate-in fade-in">
                        {/* Lessons List (Tutor LMS Item Rows) */}
                        <div className="space-y-3">
                          {(module.subModules || []).map((subMod: any) => (
                            <div key={subMod.id} className="space-y-2">
                              {(module.subModules?.length || 0) > 1 && (
                                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block px-1">
                                  {subMod.title.replace(/^Sub-Module\s+/i, "Component ")}
                                </span>
                              )}

                              <div className="space-y-1.5">
                                {(subMod.lessons || []).map((lesson: any) => (
                                  <div
                                    key={lesson.id}
                                    className="p-3 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                                  >
                                    <div className="flex items-center space-x-2.5 min-w-0">
                                      <BookOpen className="h-4 w-4 text-primary shrink-0" />
                                      <span className="font-medium text-foreground truncate">
                                        {lesson.title}
                                      </span>
                                    </div>

                                    <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-center">
                                      <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted/60">
                                        {lesson.duration}
                                      </span>
                                      {isManagementRole && (
                                        <Link
                                          href={`/student/study-center?subject=${encodeURIComponent(course.code)}&mode=builder&tab=content`}
                                          title="Edit this lesson in Course Builder"
                                        >
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs px-2 text-muted-foreground hover:text-primary font-medium rounded-lg border-border/80 cursor-pointer"
                                          >
                                            <Edit2 className="h-3 w-3 mr-1" />
                                            Edit
                                          </Button>
                                        </Link>
                                      )}

                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {isManagementRole && (
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs sm:text-sm">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {isBuilt ? "Update Interactive Course Materials" : "Build Interactive Course Content in Study Center"}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {isBuilt
                      ? "Add or modify lecture notes, upload resource files up to 5MB, attach clinical SOPs, and author multi-type interactive quizzes or viva Q/A."
                      : "This subject's curriculum outline is defined. Click below to launch the Course Builder and create lessons, lecture notes, SOPs, quizzes, and viva voce for students."}
                  </p>
                </div>
                <Link
                  href={`/student/study-center?subject=${encodeURIComponent(course.code)}&mode=builder`}
                  className="inline-flex items-center justify-center min-h-[36px] px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shrink-0 shadow-xs hover:opacity-95 transition-opacity active:scale-95 cursor-pointer"
                >
                  {isBuilt ? <Edit3 className="h-3.5 w-3.5 mr-1.5" /> : <Hammer className="h-3.5 w-3.5 mr-1.5" />}
                  <span>{isBuilt ? "Edit in Course Builder" : "Build Course Content"}</span>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Examination & Assessment Scheme */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              Examination & Assessment Scheme
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Card className="p-4 rounded-2xl border border-border/80 bg-card space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    Written Examination
                  </span>
                  <Badge variant="blue" className="text-[10px] font-medium">
                    {course.assessment.writtenExamMarks} Marks
                  </Badge>
                </div>
                <p className="text-muted-foreground font-normal leading-relaxed">
                  {course.assessment.writtenExamStructure}
                </p>
              </Card>

              <Card className="p-4 rounded-2xl border border-border/80 bg-card space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Practical OSPE Stations
                  </span>
                  <Badge variant="filled" className="text-[10px] font-medium">
                    {course.assessment.practicalMarks} Marks
                  </Badge>
                </div>
                <p className="text-muted-foreground font-normal leading-relaxed">
                  {course.assessment.practicalOSPEStructure}
                </p>
              </Card>

              <Card className="p-4 rounded-2xl border border-border/80 bg-card space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    Oral Board Viva Voce
                  </span>
                  <Badge variant="outline" className="text-[10px] font-medium">
                    {course.assessment.vivaMarks} Marks
                  </Badge>
                </div>
                <p className="text-muted-foreground font-normal leading-relaxed">
                  {course.assessment.vivaStructure}
                </p>
              </Card>

              <Card className="p-4 rounded-2xl border border-border/80 bg-card space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    Continuous Internal Assessment
                  </span>
                  <Badge variant="outline" className="text-[10px] font-medium">
                    {course.assessment.continuousAssessmentMarks} Marks
                  </Badge>
                </div>
                <p className="text-muted-foreground font-normal leading-relaxed">
                  {course.assessment.continuousStructure}
                </p>
              </Card>
            </div>
          </div>

          {/* 5. Course Prerequisites & Requirements */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              Requirements & Clinical Prerequisites
            </h2>
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start space-x-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-normal">
                  Active student enrollment in {programLabel} ({yearLabel}).
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-normal">
                  Standard clinical laboratory coat, protective eye wear, and nitrile gloves for bench OSPE sessions.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-normal">
                  Completion of introductory Biosafety Level 2 (BSL-2) decontamination protocols.
                </span>
              </div>
            </div>
          </div>

          {/* 6. Prescribed Textbooks & Reference Manuals */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              Prescribed Textbooks & Manuals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.textbooks.map((book, bIdx) => (
                <Card
                  key={bIdx}
                  className="rounded-2xl border border-border/80 bg-card p-4 space-y-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="filled" className="text-[10px] font-medium">
                      {book.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {book.edition}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground">
                    {book.title}
                  </h3>
                  <p className="text-xs text-primary font-medium">
                    Author: {book.author}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-normal leading-relaxed">
                    {book.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
