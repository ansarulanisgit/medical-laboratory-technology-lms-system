"use client";

import * as React from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Have questions about courses, certifications, or technical support? Send us a message and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Information (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Get in Touch</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Reach out through any of our official support channels.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <a
                  href="mailto:labtutor.academy@gmail.com"
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Email Support</div>
                    <div className="font-medium text-foreground text-xs sm:text-sm break-all">
                      labtutor.academy@gmail.com
                    </div>
                  </div>
                </a>

                <a
                  href="tel:+8801712345678"
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Telephone Helpline</div>
                    <div className="font-medium text-foreground text-xs sm:text-sm font-mono">
                      +880 1712-345678
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Operating Hours</div>
                    <div className="font-medium text-foreground text-xs sm:text-sm">
                      Sun – Thu: 8:00 AM – 6:00 PM BST
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Academic Campus</div>
                    <div className="font-medium text-foreground text-xs sm:text-sm">
                      Mohakhali Health Complex, Dhaka-1212, Bangladesh
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Simple Contact Form (7 cols) */}
          <Card className="md:col-span-7 rounded-2xl border-border bg-card shadow-xs overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-border bg-muted/20">
              <CardTitle className="text-lg font-bold text-foreground">
                Send a Message
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {isSubmitted ? (
                <div className="p-8 text-center space-y-4 animate-in fade-in">
                  <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">Message Sent!</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                      Thank you for reaching out. We have received your message and will reply to your email shortly.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    <span>Send Another Message</span>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Your Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-xl text-xs sm:text-sm h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-xl text-xs sm:text-sm h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="rounded-xl text-xs sm:text-sm h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full rounded-xl border border-input bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs leading-relaxed"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm shadow-sm cursor-pointer transition-all"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
