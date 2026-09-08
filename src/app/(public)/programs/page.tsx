import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";

export default function ProgramsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-2 text-primary">
            Academic Pathways
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Medical Laboratory Technology Programs
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Structured curriculum mapping aligned with Bangladesh technical and health education boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Diploma Program */}
          <Card className="border-primary/20 hover:border-primary/50 transition-all flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">Diploma Level</Badge>
                <span className="text-xs text-muted-foreground font-semibold">4-Year Track</span>
              </div>
              <CardTitle className="text-xl">
                Diploma in Medical Laboratory Technology
              </CardTitle>
              <CardDescription>
                Comprehensive 4-year technical program covering foundational laboratory techniques, routine diagnostics, and clinical hospital rotations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span><strong>1st Year:</strong> Basic Anatomy, Physiology, Basic Chemistry & Lab Hazards</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span><strong>2nd Year:</strong> Clinical Pathology, Hematology I & Medical Microbiology I</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span><strong>3rd Year:</strong> Clinical Biochemistry, Parasitology & Blood Transfusion</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span><strong>4th Year:</strong> Histopathology, Cytology & Hospital Clinical Internship</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Link href="/register?program=diploma">
                  <Button className="w-full bg-primary text-primary-foreground font-medium">
                    Register for Diploma Track
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* B.Sc. Program */}
          <Card className="border-secondary/20 hover:border-secondary/50 transition-all flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="default">Undergraduate Degree</Badge>
                <span className="text-xs text-muted-foreground font-semibold">4-Year Degree</span>
              </div>
              <CardTitle className="text-xl">
                B.Sc. in Health Technology (Laboratory)
              </CardTitle>
              <CardDescription>
                Advanced undergraduate degree focusing on diagnostic reasoning, molecular diagnostics, quality assurance, automation, and clinical research.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Year 1 (Sem 1-2):</strong> Cellular Biology, Biophysics, General Pathology</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Year 2 (Sem 3-4):</strong> Advanced Hematology, Systemic Bacteriology & Virology</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Year 3 (Sem 5-6):</strong> Clinical Enzymology, Immunology, Transfusion Medicine</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Year 4 (Sem 7-8):</strong> Molecular Biology, Lab Management & Dissertation</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Link href="/register?program=bsc">
                  <Button variant="secondary" className="w-full text-secondary-foreground font-medium">
                    Register for B.Sc. Track
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
