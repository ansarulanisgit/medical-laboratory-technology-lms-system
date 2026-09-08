"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Clock, Award, ShieldCheck } from "lucide-react";

interface CompetencyItem {
  id: string;
  skill: string;
  department: string;
  theory: "COMPETENT" | "IN_PROGRESS" | "NOT_STARTED";
  specimenHandling: "COMPETENT" | "IN_PROGRESS" | "NOT_STARTED";
  instrumentation: "COMPETENT" | "IN_PROGRESS" | "NOT_STARTED";
  qc: "COMPETENT" | "NEEDS_IMPROVEMENT" | "NOT_STARTED";
  interpretation: "COMPETENT" | "NEEDS_IMPROVEMENT" | "NOT_STARTED";
  reporting: "COMPETENT" | "NOT_STARTED";
}

const competencies: CompetencyItem[] = [
  {
    id: "comp-1",
    skill: "Automated Complete Blood Count (CBC) & Differentials",
    department: "Hematology",
    theory: "COMPETENT",
    specimenHandling: "COMPETENT",
    instrumentation: "COMPETENT",
    qc: "COMPETENT",
    interpretation: "COMPETENT",
    reporting: "COMPETENT",
  },
  {
    id: "comp-2",
    skill: "Blood Grouping & Crossmatch Compatibility",
    department: "Transfusion Medicine",
    theory: "COMPETENT",
    specimenHandling: "COMPETENT",
    instrumentation: "COMPETENT",
    qc: "NEEDS_IMPROVEMENT",
    interpretation: "NEEDS_IMPROVEMENT",
    reporting: "NOT_STARTED",
  },
  {
    id: "comp-3",
    skill: "Acid-Fast Bacilli (AFB) Sputum Microscopy",
    department: "Microbiology",
    theory: "COMPETENT",
    specimenHandling: "COMPETENT",
    instrumentation: "COMPETENT",
    qc: "COMPETENT",
    interpretation: "COMPETENT",
    reporting: "COMPETENT",
  },
  {
    id: "comp-4",
    skill: "Electrolyte Analyzer & Calibration (ISE Method)",
    department: "Clinical Biochemistry",
    theory: "COMPETENT",
    specimenHandling: "IN_PROGRESS",
    instrumentation: "IN_PROGRESS",
    qc: "NEEDS_IMPROVEMENT",
    interpretation: "NOT_STARTED",
    reporting: "NOT_STARTED",
  },
];

export default function StudentCompetenciesPage() {
  const getBadge = (status: string) => {
    if (status === "COMPETENT") {
      return (
        <Badge variant="success" className="text-[10px]">
          Competent
        </Badge>
      );
    }
    if (status === "NEEDS_IMPROVEMENT") {
      return (
        <Badge variant="warning" className="text-[10px]">
          Needs Practice
        </Badge>
      );
    }
    if (status === "IN_PROGRESS") {
      return (
        <Badge variant="secondary" className="text-[10px]">
          In Training
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] text-muted-foreground">
        Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Clinical Competency Framework
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Competency is distinct from course completion. Track your mastery across theory, hands-on instrumentation, QC, and clinical interpretation.
        </p>
      </div>

      <div className="space-y-4">
        {competencies.map((comp) => (
          <Card key={comp.id} className="p-4 sm:p-5 border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <Badge variant="outline" className="text-[10px] mb-1">
                  {comp.department}
                </Badge>
                <CardTitle className="text-base sm:text-lg">{comp.skill}</CardTitle>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-border/60">
              <div className="p-2 rounded-lg bg-muted/40 text-center space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block">
                  1. Theory
                </span>
                {getBadge(comp.theory)}
              </div>
              <div className="p-2 rounded-lg bg-muted/40 text-center space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block">
                  2. Specimen
                </span>
                {getBadge(comp.specimenHandling)}
              </div>
              <div className="p-2 rounded-lg bg-muted/40 text-center space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block">
                  3. Instrument
                </span>
                {getBadge(comp.instrumentation)}
              </div>
              <div className="p-2 rounded-lg bg-muted/40 text-center space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block">
                  4. Quality Control
                </span>
                {getBadge(comp.qc)}
              </div>
              <div className="p-2 rounded-lg bg-muted/40 text-center space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block">
                  5. Interpretation
                </span>
                {getBadge(comp.interpretation)}
              </div>
              <div className="p-2 rounded-lg bg-muted/40 text-center space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block">
                  6. Reporting
                </span>
                {getBadge(comp.reporting)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
