import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Microscope, HeartPulse, Dna, FlaskConical, Stethoscope } from "lucide-react";

const sampleSubjects = [
  {
    code: "HEM-201",
    name: "Hematology & Hemostasis",
    department: "Hematology",
    description: "Blood cell morphology, automated cell counters, coagulation cascades, and anemia differentials.",
    icon: Microscope,
  },
  {
    code: "MIC-202",
    name: "Medical Microbiology & Mycology",
    department: "Microbiology",
    description: "Bacterial culture, biochemical identification, antibiotic sensitivity testing (AST), and fungal diagnostics.",
    icon: FlaskConical,
  },
  {
    code: "BIO-301",
    name: "Clinical Biochemistry",
    department: "Biochemistry",
    description: "Photometry, automated chemistry analyzers, renal panels, liver function tests, and electrolyte balance.",
    icon: HeartPulse,
  },
  {
    code: "PAR-302",
    name: "Medical Parasitology & Entomology",
    department: "Parasitology",
    description: "Protozoal and helminthic infections, stool concentration methods, and malaria smear microscopy.",
    icon: Layers,
  },
  {
    code: "HIS-401",
    name: "Histotechnology & Cytopathology",
    department: "Histopathology",
    description: "Tissue fixation, paraffin processing, microtomy, H&E staining, and Pap smear cytology screening.",
    icon: Stethoscope,
  },
  {
    code: "IMM-303",
    name: "Immunology & Immunohematology",
    department: "Blood Banking",
    description: "ABO/Rh grouping, cross-matching, Coombs test, ELISA, and safe transfusion medicine protocols.",
    icon: Dna,
  },
];

export default function SubjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-2 text-primary">
            Curriculum Structure
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Laboratory Subjects & Disciplines
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Each subject is structured into syllabus units, learning objectives, practical procedures, and question banks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleSubjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <Card key={sub.code} className="hover:border-primary/50 transition-colors flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {sub.code}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {sub.department}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <span className="truncate">{sub.name}</span>
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed line-clamp-3">
                    {sub.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Subject Syllabus
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
