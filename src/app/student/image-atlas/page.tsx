"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Images, Search, Filter, Microscope, Eye, CheckCircle2, AlertCircle } from "lucide-react";

const departments = [
  "ALL",
  "HEMATOLOGY",
  "MICROBIOLOGY",
  "PARASITOLOGY",
  "HISTOPATHOLOGY",
  "CYTOLOGY",
];

const atlasItems = [
  {
    id: "a1",
    title: "Plasmodium falciparum Ring Forms (Trophozoites)",
    department: "PARASITOLOGY",
    stain: "Giemsa 100x Oil",
    pointers: "Delicate ring forms, double chromatin dots, applique/accolé forms on red cell margin.",
    quizQuestion: "Which plasmodium species typically presents with headphone-shaped double chromatin dots in erythrocytes?",
    quizAnswer: "Plasmodium falciparum",
  },
  {
    id: "a2",
    title: "Hypersegmented Neutrophil (Megaloblastic Anemia)",
    department: "HEMATOLOGY",
    stain: "Leishman 100x",
    pointers: "Six or more distinct nuclear lobes. Indicative of Vitamin B12 or Folate deficiency.",
    quizQuestion: "A neutrophil possessing 6 or more nuclear lobes is pathognomonic for what clinical condition?",
    quizAnswer: "Megaloblastic Anemia (B12 / Folate deficiency)",
  },
  {
    id: "a3",
    title: "Gram-Negative Diplococci (Neisseria gonorrhoeae)",
    department: "MICROBIOLOGY",
    stain: "Gram Stain 100x",
    pointers: "Intracellular and extracellular kidney-bean shaped pink/red diplococci within polymorphonuclear leukocytes.",
    quizQuestion: "Identify the bacterial morphology and Gram reaction shown in this urethral discharge smear.",
    quizAnswer: "Gram-Negative Intracellular Diplococci (Neisseria)",
  },
  {
    id: "a4",
    title: "Ascaris lumbricoides Fertilized Corticated Egg",
    department: "PARASITOLOGY",
    stain: "Iodine Wet Mount 40x",
    pointers: "Thick shell with rough, golden-brown mammillated albuminous coat containing unsegmented ovum.",
    quizQuestion: "Identify the characteristic outer rough coating of this nematode ovum.",
    quizAnswer: "Mammillated albuminous coat of Ascaris lumbricoides",
  },
];

export default function StudentImageAtlasPage() {
  const [selectedDept, setSelectedDept] = React.useState("ALL");
  const [revealedQuiz, setRevealedQuiz] = React.useState<Record<string, boolean>>({});

  const filteredItems = selectedDept === "ALL"
    ? atlasItems
    : atlasItems.filter((i) => i.department === selectedDept);

  const toggleQuiz = (id: string) => {
    setRevealedQuiz((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Microscopy Image Atlas
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          High-definition microscopy slides, diagnostic pointers, and image identification practice.
        </p>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap min-h-[44px] transition-colors ${
              selectedDept === dept
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Grid of Atlas Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const isRevealed = !!revealedQuiz[item.id];
          return (
            <Card key={item.id} className="overflow-hidden border-border flex flex-col justify-between">
              <div>
                {/* Simulated Microscopy Viewport */}
                <div className="h-48 bg-slate-950 relative flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-radial-gradient from-slate-800/40 to-slate-950/90 pointer-events-none" />
                  <div className="flex flex-col items-center space-y-2 text-sky-400">
                    <Microscope className="h-10 w-10 opacity-70 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-mono text-slate-300">
                      High-Power Field • {item.stain}
                    </span>
                  </div>
                  <Badge variant="secondary" className="absolute top-3 left-3 text-[10px]">
                    {item.department}
                  </Badge>
                </div>

                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base sm:text-lg">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-medium">
                    Stain & Optics: {item.stain}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-1 space-y-3">
                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
                    <strong className="text-foreground">Diagnostic Pointers: </strong>
                    {item.pointers}
                  </div>

                  {/* Identification Practice Accordion */}
                  <div className="border border-border/80 rounded-lg p-3 space-y-2 bg-card">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Identification Quiz Challenge:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleQuiz(item.id)}
                        className="text-xs h-7 px-2"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        {isRevealed ? "Hide Answer" : "Reveal Answer"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      &quot;{item.quizQuestion}&quot;
                    </p>
                    {isRevealed && (
                      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center space-x-1.5 animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span><strong>Answer:</strong> {item.quizAnswer}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
