import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Microscope,
  FileText,
  GraduationCap,
  Building2,
  Code2,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 max-w-4xl space-y-12">
        {/* 1. Page Header */}
        <div className="text-center space-y-3">
          <Badge variant="outline" className="text-primary font-semibold">
            Mission &amp; Academic Vision
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            About LabTutor Academy
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pioneering digital competency, verified procedural SOPs, and curriculum-aligned education for Medical Laboratory Technology students in Bangladesh.
          </p>
        </div>

        {/* 2. DEVELOPER PROFILE & BRIEF (From Dashboard About Page) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Code2 className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              About the Developer
            </h2>
          </div>

          <Card className="rounded-3xl border-border/80 shadow-sm overflow-hidden bg-gradient-to-br from-card via-card to-primary/[0.03]">
            {/* Top Colored Accent Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
                {/* Avatar with Glow Ring & Healthcare Badge */}
                <div className="flex flex-col items-center shrink-0 gap-3">
                  <div className="relative group">
                    <div className="p-1 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 shadow-md">
                      <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden ring-2 ring-card bg-card">
                        <img
                          src="/developer.jpg"
                          alt="Ansarul Anis"
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div
                      className="absolute bottom-1 right-1 p-1.5 rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-card"
                      title="Verified Healthcare Professional"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                      Medical Technologist (Lab)
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-center">
                      <Code2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      Lead Web Developer
                    </span>
                  </div>
                </div>

                {/* Developer Narrative & Bio */}
                <div className="space-y-4 text-center md:text-left flex-1 min-w-0">
                  <div>
                    <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                      Ansarul Anis
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Medical Technologist (Lab) under DGHS &amp; Creator of LabTutor Academy
                    </p>
                  </div>

                  {/* 2 Quick Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <div className="p-3.5 rounded-2xl bg-blue-500/[0.06] border border-blue-500/20 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>Academic Background</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Diploma in Medical Laboratory Technology (DMLT) from <strong>IHT, Rajshahi (2015)</strong>.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Current Service</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Serving as a <strong>Medical Technologist (Lab)</strong> under the <strong>Directorate General of Health Services (DGHS)</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Narrative Bio */}
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 text-xs sm:text-[13px] text-foreground/90 leading-relaxed space-y-2 text-left">
                    <p>
                      Alongside active clinical diagnostic practice in hospital pathology and hematology, Ansarul works as a passionate full-stack software and web developer.
                    </p>
                    <p>
                      He architected and built <strong>LabTutor Academy</strong> to bridge the gap between classroom textbook theory and frontline hospital laboratory practice—empowering medical laboratory students across Bangladesh with digital SOPs, microscopy identification, viva drills, and clinical resume tools.
                    </p>
                  </div>

                  {/* Contact Links */}
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 shrink-0">
                      <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      <span>Contact:</span>
                    </span>

                    <a
                      href="https://www.facebook.com/ansarulanis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border border-[#1877F2]/30 transition-all shadow-2xs group"
                    >
                      <svg className="h-3.5 w-3.5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                      <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
                    </a>

                    <a
                      href="https://wa.me/8801709260934"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 transition-all shadow-2xs group"
                    >
                      <svg className="h-3.5 w-3.5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>WhatsApp</span>
                      <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Purpose & Accreditation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-border/80">
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Microscope className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Our Purpose</CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Medical Laboratory Technology requires both rigorous theoretical mastery and hands-on clinical precision. LabTutor Academy bridges the gap between textbook knowledge and practical diagnostic application through step-by-step procedure guides, microscopy image identification, and structured clinical logbooks.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80">
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Accreditation &amp; Standards</CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Content is designed to support students adhering to the curricula of the State Medical Faculty of Bangladesh (SMFB), BTEB, and university-affiliated B.Sc. in Health Technology programs across all 4 academic years.
            </CardContent>
          </Card>
        </div>

        {/* 4. Clinical Disclaimer Alert */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 sm:p-6 text-foreground space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-amber-700 dark:text-amber-400">
            <FileText className="h-5 w-5 shrink-0" />
            <span className="text-sm sm:text-base">Important Clinical Practice Disclaimer</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            All procedures, reference intervals, simulation guides, and materials provided on LabTutor Academy are intended strictly for educational, preparation, and competency tracking purposes. When performing clinical testing on real patient specimens in hospital or diagnostic laboratories, students and practitioners must always adhere strictly to their institution&apos;s current authorized Standard Operating Procedures (SOPs), safety protocols, and quality control guidelines.
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
