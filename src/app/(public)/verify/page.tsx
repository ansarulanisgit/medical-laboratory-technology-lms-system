"use client";

import * as React from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Search, CheckCircle2, AlertCircle } from "lucide-react";

export default function VerifyCertificatePage() {
  const [certCode, setCertCode] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "valid" | "not_found">("idle");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCode.trim()) return;

    setStatus("loading");
    setTimeout(() => {
      // In Phase 1 foundation, simulate verification check
      if (certCode.trim().toUpperCase() === "LAB-DEMO-2026") {
        setStatus("valid");
      } else {
        setStatus("not_found");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 max-w-xl">
        <div className="text-center space-y-3 mb-8">
          <Badge variant="outline" className="text-primary">
            Verification Portal
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Verify Issued Certificate
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter the unique Certificate Verification Code or scan the QR code to confirm credentials and competency mastery.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Certificate Credential Lookup</span>
            </CardTitle>
            <CardDescription>
              Example demo code: <span className="font-mono font-semibold text-primary">LAB-DEMO-2026</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  placeholder="e.g. LAB-2026-X892-DMT"
                  value={certCode}
                  onChange={(e) => setCertCode(e.target.value)}
                  className="font-mono uppercase text-sm"
                  required
                />
                <Button type="submit" disabled={status === "loading"} className="min-h-[44px]">
                  <Search className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </form>

            {/* Status Feedback */}
            {status === "loading" && (
              <div className="mt-6 p-4 rounded-lg border border-border bg-muted/40 text-center animate-pulse text-xs text-muted-foreground">
                Querying cryptographic certificate registry...
              </div>
            )}

            {status === "valid" && (
              <div className="mt-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Verified Authentic Certificate</span>
                </div>
                <div className="space-y-1 pt-1 text-muted-foreground border-t border-emerald-500/20">
                  <p><strong>Student:</strong> Md. Ansarul Islam</p>
                  <p><strong>Program:</strong> Diploma in Medical Laboratory Technology</p>
                  <p><strong>Competency:</strong> Automated Hematology & Peripheral Blood Smear</p>
                  <p><strong>Issued:</strong> January 15, 2026</p>
                  <p><strong>Status:</strong> ACTIVE / VERIFIED</p>
                </div>
              </div>
            )}

            {status === "not_found" && (
              <div className="mt-6 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive space-y-1 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 font-semibold">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>Certificate Not Found</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  No active certificate matches this code. Please verify the code printed on the physical credential or scan the QR code.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <PublicFooter />
    </div>
  );
}
