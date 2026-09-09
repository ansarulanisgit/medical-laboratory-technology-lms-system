"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Microscope, Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/student/profile`,
      });
      if (error) {
        if (!error.message.includes("fetch")) {
          setErrorMsg(error.message);
          return;
        }
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/30 px-4 py-8 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Microscope className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              LabTutor <span className="text-primary">Academy</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Account recovery & password reset
          </p>
        </div>

        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Reset Your Password</CardTitle>
            <CardDescription className="text-xs">
              Enter your registered email address to receive a secure recovery link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submitted ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-2 text-xs sm:text-sm text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-600 dark:text-emerald-400" />
                <div className="font-semibold">Reset Link Sent</div>
                <p className="text-muted-foreground text-xs">
                  If an account exists with <strong>{email}</strong>, we have sent instructions to reset your password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Email Address</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-semibold min-h-[44px]"
                >
                  {loading ? "Sending..." : "Send Recovery Link"}
                </Button>
                <p className="text-[11px] text-center text-muted-foreground">
                  Need assistance? Contact support at{" "}
                  <a href="mailto:labtutor.academy@gmail.com" className="text-primary hover:underline font-medium">
                    labtutor.academy@gmail.com
                  </a>
                </p>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/60 py-3 text-xs text-muted-foreground">
            <Link href="/login" className="inline-flex items-center text-primary font-semibold hover:underline">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
