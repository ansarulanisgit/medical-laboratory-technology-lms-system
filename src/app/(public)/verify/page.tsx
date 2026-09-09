"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import jsQR from "jsqr";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useCertificates,
  CertificateRecord,
  getProgramLabel,
  getYearLabel,
  findCertificateByQuery,
  INITIAL_CERTIFICATES,
} from "@/lib/stores/certificate-store";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Copy,
  Check,
  Award,
  GraduationCap,
  Building2,
  Calendar,
  FileBadge,
  KeyRound,
  FileCheck2,
  UserCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Mail,
  QrCode,
  Camera,
  Upload,
  X,
  FlipHorizontal,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { QRCodeView } from "@/components/ui/qr-code-view";

function CertificateVerificationContent() {
  const searchParams = useSearchParams();
  const { certificates, findCertificate, templateConfig } = useCertificates();

  const [certCode, setCertCode] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "valid" | "not_found">("idle");
  const [verifiedCert, setVerifiedCert] = React.useState<CertificateRecord | null>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [showDocPreview, setShowDocPreview] = React.useState(false);
  const [verifiedAt, setVerifiedAt] = React.useState<string>("");

  // Scanner modal state
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  const [scannerMode, setScannerMode] = React.useState<"camera" | "upload">("camera");
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [facingMode, setFacingMode] = React.useState<"environment" | "user">("environment");
  const [isProcessingImage, setIsProcessingImage] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = React.useRef<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const verifyCode = React.useCallback(
    async (codeToVerify: string) => {
      const trimmed = codeToVerify.trim();
      if (!trimmed) return;

      setStatus("loading");
      setVerifiedCert(null);

      // 1. Check local store first
      let found = findCertificate ? findCertificate(trimmed) : undefined;
      if (!found) {
        found = findCertificateByQuery(trimmed, certificates || INITIAL_CERTIFICATES);
      }

      if (found) {
        setVerifiedCert(found);
        setStatus("valid");
        setVerifiedAt(
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          })
        );
      }

      // 2. Query central database live in real time
      try {
        const res = await fetch(`/api/certificates?query=${encodeURIComponent(trimmed)}`);
        const json = await res.json();
        if (json.success && json.certificate) {
          setVerifiedCert(json.certificate);
          setStatus("valid");
          setVerifiedAt(
            new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
            })
          );
          return;
        }
      } catch (err) {
        console.warn("Central database live query error:", err);
      }

      if (!found) {
        setStatus("not_found");
      }
    },
    [findCertificate, certificates]
  );

  // Real-time live synchronization for public verification view
  React.useEffect(() => {
    let channel: any = null;
    try {
      const supabase = createClient();
      channel = supabase.channel("verify_page_realtime");
      channel
        .on("broadcast", { event: "CERTIFICATES_SYNCED" }, ({ payload }: any) => {
          if (payload?.certificates && Array.isArray(payload.certificates) && certCode) {
            const currentCode = certCode.trim().toUpperCase();
            const updated = payload.certificates.find((c: CertificateRecord) => {
              const cNum = (c.certificateNumber || "").toUpperCase();
              const cCode = (c.code || "").toUpperCase();
              const cVer = (c.verificationCode || "").toUpperCase();
              return cNum === currentCode || cCode === currentCode || cVer === currentCode;
            });
            if (updated) {
              setVerifiedCert(updated);
              setStatus("valid");
            }
          }
        })
        .subscribe();
    } catch {}

    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch {}
      }
    };
  }, [certCode]);

  // Auto-verify if query parameter is in the URL on mount
  React.useEffect(() => {
    const urlCode =
      searchParams.get("code") ||
      searchParams.get("id") ||
      searchParams.get("cert") ||
      searchParams.get("verificationCode");
    if (urlCode && urlCode.trim()) {
      setCertCode(urlCode.trim());
      verifyCode(urlCode.trim());
    }
  }, [searchParams, verifyCode]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCode.trim()) return;

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("code", certCode.trim());
      window.history.replaceState({}, "", url.toString());
    }

    verifyCode(certCode.trim());
  };

  const handlePresetSelect = (code: string) => {
    setCertCode(code);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("code", code);
      window.history.replaceState({}, "", url.toString());
    }
    verifyCode(code);
  };

  const handleCopyVerificationLink = () => {
    if (!verifiedCert) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://labtutor.academy";
    const shareUrl = `${origin}/verify?code=${encodeURIComponent(verifiedCert.certificateNumber || verifiedCert.code)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handlePrintRecord = () => {
    window.print();
  };

  // Helper to extract clean code from scanned QR URL or raw text
  const extractCodeFromScannedData = (rawText: string): string => {
    try {
      if (rawText.includes("http://") || rawText.includes("https://")) {
        const parsed = new URL(rawText);
        const codeParam =
          parsed.searchParams.get("code") ||
          parsed.searchParams.get("id") ||
          parsed.searchParams.get("cert") ||
          parsed.searchParams.get("verificationCode");
        if (codeParam) return codeParam.trim();
      }
    } catch {}

    const match = rawText.match(/[?&](?:code|id|cert)=([^&]+)/i);
    if (match && match[1]) {
      return decodeURIComponent(match[1]).trim();
    }

    return rawText.trim();
  };

  // Stop active camera stream
  const stopCamera = React.useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Continuous frame scanner via requestAnimationFrame
  const scanFrame = React.useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          const detected = extractCodeFromScannedData(code.data);
          if (detected) {
            stopCamera();
            setIsScannerOpen(false);
            setCertCode(detected);
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.set("code", detected);
              window.history.replaceState({}, "", url.toString());
            }
            verifyCode(detected);
            return;
          }
        }
      }
    }

    animationFrameIdRef.current = requestAnimationFrame(scanFrame);
  }, [stopCamera, verifyCode]);

  // Start live camera stream
  const startCamera = React.useCallback(async () => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera access is not supported by your browser or environment. Please upload a certificate photo instead.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setIsCameraActive(true);
        animationFrameIdRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera permission was denied. Please allow camera access in browser permissions or use the photo upload option."
          : "Unable to start camera. Please verify device permissions or upload an image."
      );
      setIsCameraActive(false);
    }
  }, [facingMode, stopCamera, scanFrame]);

  // Handle scanner modal open/close
  React.useEffect(() => {
    if (isScannerOpen && scannerMode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isScannerOpen, scannerMode, startCamera, stopCamera]);

  // Process uploaded image file for QR code
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setCameraError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          setIsProcessingImage(false);
          setCameraError("Unable to initialize image parser canvas.");
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        setIsProcessingImage(false);

        if (code && code.data) {
          const detected = extractCodeFromScannedData(code.data);
          setIsScannerOpen(false);
          setCertCode(detected);
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("code", detected);
            window.history.replaceState({}, "", url.toString());
          }
          verifyCode(detected);
        } else {
          setCameraError("No QR code detected in the uploaded image. Please ensure the code is clear, well-lit, and not cropped.");
        }
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        setCameraError("Failed to load image file. Please try another image.");
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessingImage(false);
      setCameraError("Error reading image file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Banner Section */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1 font-semibold">
              Institutional Credential Registry
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Verify Issued Certificate
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Enter the official <strong>Certificate Number</strong> or <strong>Authentication Code</strong> to confirm candidate competency, institutional conferral, and academic benchmark records.
          </p>
        </div>

        {/* Credential Lookup Card */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span>Credential Verification Search</span>
              </div>
            </CardTitle>
            <CardDescription className="text-xs">
              Supports official Certificate Numbers (e.g. <span className="font-mono font-bold text-primary">LTA-DIP-2025-48201</span>), verification hashes, or QR code camera scanning.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleVerify} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="e.g. LTA-DIP-2025-48201 or VER-9201-ENG101"
                    value={certCode}
                    onChange={(e) => setCertCode(e.target.value)}
                    className="pl-11 font-mono uppercase text-sm h-11 rounded-xl"
                    required
                  />
                  {certCode && (
                    <button
                      type="button"
                      onClick={() => {
                        setCertCode("");
                        setStatus("idle");
                        setVerifiedCert(null);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Scan Code Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsScannerOpen(true);
                    setScannerMode("camera");
                  }}
                  className="min-h-[44px] px-4 rounded-xl font-semibold gap-2 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
                  title="Scan certificate QR code with device camera or upload image"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Scan Code</span>
                </Button>

                {/* Verify Submit Button */}
                <Button
                  type="submit"
                  disabled={status === "loading" || !certCode.trim()}
                  className="min-h-[44px] px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 cursor-pointer shadow-xs"
                >
                  {status === "loading" ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Verify Credential</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Demo Test Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  <span>Quick Test:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("LTA-DIP-2025-48201")}
                  className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all font-mono text-[11px] border border-border/60 cursor-pointer"
                >
                  LTA-DIP-2025-48201 (Diploma)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("LTA-BSC-2025-19934")}
                  className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all font-mono text-[11px] border border-border/60 cursor-pointer"
                >
                  LTA-BSC-2025-19934 (B.Sc.)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("LTA-DIP-2026-88412")}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all font-mono text-[11px] border border-amber-500/20 cursor-pointer"
                >
                  LTA-DIP-2026-88412 (Pending)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("LAB-DEMO-2026")}
                  className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all font-mono text-[11px] border border-border/60 cursor-pointer"
                >
                  LAB-DEMO-2026 (Demo)
                </button>
              </div>
            </form>

            {/* Loading Feedback */}
            {status === "loading" && (
              <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 text-center space-y-2 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-primary font-bold text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Querying Official Cryptographic Registry...</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Validating digital serial number, student identity, and academic council conferral records.
                </p>
              </div>
            )}

            {/* NOT FOUND FEEDBACK */}
            {status === "not_found" && (
              <div className="p-5 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3 animate-in fade-in">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-destructive">
                      Certificate Not Found in Official Registry
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      No active or pending certificate matches the code <strong className="font-mono text-foreground font-bold">&quot;{certCode}&quot;</strong>.
                    </p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside pt-1 space-y-0.5">
                      <li>Check that the Certificate Number is typed exactly as printed (e.g. <span className="font-mono">LTA-DIP-2025-48201</span>).</li>
                      <li>Verify the official authentication code stamped on the physical credential.</li>
                      <li>Try testing one of the official sample credentials above.</li>
                      <li>Need help? Contact support at <a href="mailto:labtutor.academy@gmail.com" className="text-primary hover:underline font-mono">labtutor.academy@gmail.com</a>.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* VERIFIED SUCCESSFUL RECORD CARD */}
            {status === "valid" && verifiedCert && (
              <div className="mt-4 space-y-6 animate-in fade-in duration-200">
                {/* Status Callout Banner */}
                <div
                  className={cn(
                    "p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                    verifiedCert.status === "APPROVED"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                      : verifiedCert.status === "PENDING"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
                        verifiedCert.status === "APPROVED"
                          ? "bg-emerald-600 text-white"
                          : verifiedCert.status === "PENDING"
                          ? "bg-amber-600 text-white"
                          : "bg-destructive text-white"
                      )}
                    >
                      {verifiedCert.status === "APPROVED" ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : verifiedCert.status === "PENDING" ? (
                        <Clock className="h-6 w-6 animate-pulse" />
                      ) : (
                        <AlertCircle className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm sm:text-base">
                          {verifiedCert.status === "APPROVED"
                            ? "Officially Conferred & Verified Authentic"
                            : verifiedCert.status === "PENDING"
                            ? "Record Found — Application Pending Review"
                            : "Application Record Inactive / Declined"}
                        </span>
                        <Badge
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide",
                            verifiedCert.status === "APPROVED"
                              ? "bg-emerald-600 text-white"
                              : verifiedCert.status === "PENDING"
                              ? "bg-amber-600 text-white"
                              : "bg-destructive text-white"
                          )}
                        >
                          {verifiedCert.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {verifiedCert.status === "APPROVED"
                          ? "This credential has been validated against the central LabTutor Academy registry."
                          : verifiedCert.status === "PENDING"
                          ? "Application is awaiting final benchmark audit and signature approval by the Super Administrator."
                          : "This application was not conferred by the academic examination council."}
                      </p>
                      {verifiedAt && (
                        <p className="text-[11px] text-muted-foreground/80 font-mono mt-1">
                          Verified Query Timestamp: {verifiedAt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyVerificationLink}
                      className="gap-1.5 text-xs h-9 rounded-xl border-border bg-card cursor-pointer hover:bg-muted"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePrintRecord}
                      className="gap-1.5 text-xs h-9 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Record</span>
                    </Button>
                  </div>
                </div>

                {/* Comprehensive Certificate Details Card (The exact breakdown requested by user) */}
                <div id="printable-verification-dossier" className="border border-border rounded-2xl p-5 sm:p-7 bg-card shadow-sm space-y-6">
                  {/* Card Section 1: Certificate Identity Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-border gap-4">
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-mono font-bold tracking-widest text-primary">
                        Official Credential Dossier
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        {verifiedCert.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Governed by State Medical Faculty of Bangladesh (SMFB) &amp; DGHS Medical Technology Directorate
                      </p>
                    </div>

                    {/* Official Registry Authenticated Seal Badge */}
                    <div className="flex items-center gap-3 shrink-0 bg-primary/5 p-3 rounded-xl border border-primary/20">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div className="text-[11px] space-y-0.5">
                        <span className="font-bold text-foreground block">Registry Authenticated</span>
                        <span className="font-mono text-primary font-bold text-[11px] block">
                          {verifiedCert.certificateNumber}
                        </span>
                        <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                          Auth: {verifiedCert.verificationCode || "VERIFIED"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Card Section 2: Core Details Grid (Name, Institute, Course Type, Year, Date, Grade etc.) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    {/* 1. Student / Candidate Name */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-primary" />
                        <span>Candidate / Student Name</span>
                      </span>
                      <p className="font-bold text-base text-foreground">
                        {verifiedCert.studentName}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Student ID: {verifiedCert.studentId}
                      </p>
                    </div>

                    {/* 2. Institute / Affiliated College */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span>Affiliated Institute / Institution</span>
                      </span>
                      <p className="font-bold text-foreground">
                        {verifiedCert.institution}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Accredited Clinical Training Center
                      </p>
                    </div>

                    {/* 3. Course Type & Program */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                        <span>Course Type / Program</span>
                      </span>
                      <p className="font-bold text-foreground">
                        {getProgramLabel(verifiedCert.program)}
                      </p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                          {verifiedCert.program === "BSC" ? "Bachelor of Science" : "Diploma Program"}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">4-Year Curriculum</span>
                      </div>
                    </div>

                    {/* 4. Academic Year & Curriculum Phase */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>Academic Curriculum Year</span>
                      </span>
                      <p className="font-bold text-foreground">
                        {getYearLabel(verifiedCert.year)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Year {verifiedCert.year} Clinical Benchmark Syllabus
                      </p>
                    </div>

                    {/* 5. Conferred Grade & Standing */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Assessment Grade &amp; Competency</span>
                      </span>
                      <p className="font-bold text-base text-emerald-600 dark:text-emerald-400">
                        {verifiedCert.grade}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Verified via Diagnostic Practical Tasks &amp; Case Scenarios
                      </p>
                    </div>

                    {/* 6. Dates (Issued & Applied) */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>Date of Conferral &amp; Application</span>
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground">
                          {verifiedCert.issuedDate
                            ? `Issued Date: ${verifiedCert.issuedDate}`
                            : `Conferral: Pending Final Approval`}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          Application Date: {verifiedCert.applicationDate}
                        </p>
                      </div>
                    </div>

                    {/* 7. Official Serial & Authentication Codes */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <FileBadge className="h-3.5 w-3.5 text-primary" />
                        <span>Certificate Serial &amp; Code</span>
                      </span>
                      <p className="font-mono font-bold text-foreground text-sm">
                        {verifiedCert.certificateNumber}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        Registry Ref: {verifiedCert.code}
                      </p>
                    </div>

                    {/* 8. Verification Security Hash / Authority */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        <span>Authentication Key &amp; Reviewer</span>
                      </span>
                      <p className="font-mono font-bold text-primary text-sm">
                        {verifiedCert.verificationCode || "PENDING-ISSUANCE"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Signatory: {verifiedCert.reviewedBy || "Academic Examination Council"} ({verifiedCert.reviewedRole || "SUPER_ADMIN"})
                      </p>
                    </div>
                  </div>

                  {/* Feedback or Notes (If declined or specific feedback) */}
                  {verifiedCert.feedback && (
                    <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                      <span className="font-bold text-foreground block">
                        Academic Directorate Notes:
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {verifiedCert.feedback}
                      </p>
                    </div>
                  )}

                  {/* Toggle Full Visual Digital Certificate Parchment Preview */}
                  <div className="pt-2 border-t border-border/80 flex items-center justify-between flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDocPreview(!showDocPreview)}
                      className="gap-2 text-xs font-semibold rounded-xl h-9 cursor-pointer"
                    >
                      {showDocPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>{showDocPreview ? "Hide Digital Certificate Parchment" : "View Full Certificate Document Preview"}</span>
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <Link href="/contact" className="hover:text-primary transition-colors underline flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>Support: labtutor.academy@gmail.com</span>
                      </Link>
                    </div>
                  </div>

                  {/* Visual Digital Certificate Preview Accordion */}
                  {showDocPreview && (
                    <div className="pt-4 border-t border-border/80 animate-in fade-in duration-200">
                      <div className="text-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Authentic Conferred Certificate Document Preview
                        </span>
                      </div>

                      {/* Render realistic parchment certificate view */}
                      <div
                        className={cn(
                          "rounded-2xl p-6 sm:p-9 pb-8 sm:pb-9 relative overflow-hidden shadow-xl transition-all flex flex-col justify-between mx-auto border-8 border-emerald-700 ring-4 ring-emerald-500/20 bg-[#fdfbf7] text-slate-900 font-serif w-full max-w-[880px] min-h-[580px]"
                        )}
                      >
                        {/* Watermark Logo */}
                        <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden p-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={templateConfig.watermarkLogoUrl || "/images/certificate-watermark-logo.png"}
                            alt="Watermark Logo"
                            className="w-56 h-56 sm:w-72 sm:h-72 object-contain"
                            style={{ opacity: templateConfig.watermarkLogoOpacity || 0.05 }}
                          />
                        </div>

                        <div className="text-center relative z-10 flex-1 flex flex-col justify-between h-full space-y-5 sm:space-y-6">
                          {/* Upper Body */}
                          <div className="space-y-2 sm:space-y-2.5">
                            <div className="flex justify-center">
                              <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-white bg-emerald-700 shadow-md">
                                <Award className="h-6 w-6" />
                              </div>
                            </div>
                            <div>
                              <h2 className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-slate-900">
                                {templateConfig.institutionName}
                              </h2>
                              <p className="text-xs text-slate-600 uppercase tracking-widest mt-0.5">
                                {templateConfig.subHeader}
                              </p>
                            </div>

                            <div className="py-0.5">
                              <span className="text-xs sm:text-sm tracking-widest font-semibold uppercase pb-1 border-b-2 border-emerald-700 text-emerald-700">
                                Certificate of Competency &amp; Academic Achievement
                              </span>
                            </div>

                            <p className="text-xs italic text-slate-600">This is to officially certify that</p>

                            <h3 className="text-xl sm:text-3xl font-bold underline underline-offset-8 decoration-emerald-700">
                              {verifiedCert.studentName}
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed px-2">
                              having completed clinical laboratory training at <strong>{verifiedCert.institution}</strong>, has fulfilled all diagnostic benchmark requirements for{" "}
                              <strong>{verifiedCert.title}</strong> in the curriculum of{" "}
                              <strong>{verifiedCert.program} (Year {verifiedCert.year})</strong> with an assessment grade of{" "}
                              <strong className="text-emerald-700">{verifiedCert.grade}</strong>.
                            </p>
                          </div>

                          {/* Lower Body: Signatories and Footer (Generous breathing room and zero clipping) */}
                          <div className="space-y-3 pt-2 sm:pt-4">
                            {/* Signatories and Seal */}
                            <div className="grid grid-cols-3 items-end gap-3 sm:gap-6 text-slate-700">
                              <div className="text-center flex flex-col items-center">
                                <div className="w-full border-t border-slate-400/80 pt-1.5 flex flex-col items-center">
                                  {templateConfig.signatorySignature1 ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={templateConfig.signatorySignature1}
                                      alt="Signature 1"
                                      className="h-7 max-w-[100px] object-contain mb-1"
                                    />
                                  ) : (
                                    <span className="font-serif italic text-xs text-slate-800 mb-1">
                                      {templateConfig.signatoryName1.split(",")[0]}
                                    </span>
                                  )}
                                  <p className="font-bold text-slate-900 text-xs sm:text-[13px]">{templateConfig.signatoryName1}</p>
                                  <p className="text-[9px] sm:text-[10px] text-slate-600 leading-snug font-medium mt-0.5">{templateConfig.signatoryTitle1}</p>
                                </div>
                              </div>

                              <div className="flex flex-col items-center justify-center pb-0.5">
                                <QRCodeView
                                  value={
                                    typeof window !== "undefined"
                                      ? `${window.location.origin}/verify?code=${encodeURIComponent(verifiedCert.certificateNumber)}`
                                      : `https://labtutor.academy/verify?code=${encodeURIComponent(verifiedCert.certificateNumber)}`
                                  }
                                  size={52}
                                />
                                <span className="text-[8px] sm:text-[8.5px] font-bold tracking-wider text-slate-700 uppercase mt-1">
                                  Scan to Verify
                                </span>
                              </div>

                              <div className="text-center flex flex-col items-center">
                                <div className="w-full border-t border-slate-400/80 pt-1.5 flex flex-col items-center">
                                  {templateConfig.signatorySignature2 ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={templateConfig.signatorySignature2}
                                      alt="Signature 2"
                                      className="h-7 max-w-[100px] object-contain mb-1"
                                    />
                                  ) : (
                                    <span className="font-serif italic text-xs text-slate-800 mb-1">
                                      {templateConfig.signatoryName2.split(",")[0]}
                                    </span>
                                  )}
                                  <p className="font-bold text-slate-900 text-xs sm:text-[13px]">{templateConfig.signatoryName2}</p>
                                  <p className="text-[9px] sm:text-[10px] text-slate-600 leading-snug font-medium mt-0.5">{templateConfig.signatoryTitle2}</p>
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono flex-wrap gap-2">
                              <span>Issued: {verifiedCert.issuedDate || verifiedCert.applicationDate}</span>
                              <span>Certificate ID: {verifiedCert.certificateNumber}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Verification Footer Notice with primary support email */}
                <div className="text-center text-xs text-muted-foreground space-y-1 pt-2">
                  <p>
                    Official Public Verification Query ID: <span className="font-mono font-semibold">{verifiedCert.verificationCode || verifiedCert.certificateNumber}</span>
                  </p>
                  <p>
                    For institutional credential inquiries or verification support, contact <a href="mailto:labtutor.academy@gmail.com" className="text-primary hover:underline font-mono font-bold">labtutor.academy@gmail.com</a>.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* SCAN CODE MODAL (Camera Scanner & Photo Upload) */}
      {isScannerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              stopCamera();
              setIsScannerOpen(false);
            }
          }}
        >
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Scan Certificate Code</h3>
                  <p className="text-[11px] text-muted-foreground">Scan physical certificate QR code</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  stopCamera();
                  setIsScannerOpen(false);
                }}
                className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setScannerMode("camera")}
                className={cn(
                  "py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  scannerMode === "camera"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Live Camera</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setScannerMode("upload");
                }}
                className={cn(
                  "py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  scannerMode === "upload"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Photo</span>
              </button>
            </div>

            {/* Camera Scanner View */}
            {scannerMode === "camera" && (
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-primary/30 shadow-inner">
                  {/* Video Stream Element */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    playsInline
                  />
                  {/* Hidden Canvas for Frame Processing */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Scanning Overlay Reticle */}
                  {isCameraActive && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                      <div className="w-56 h-56 border-2 border-dashed border-emerald-400/90 rounded-2xl relative flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        {/* Laser Scan Animation Line */}
                        <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                        <span className="text-[10px] font-mono text-emerald-300 font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                          Align QR code here
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Starting / Loading Spinner */}
                  {!isCameraActive && !cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/80 text-white space-y-2">
                      <RefreshCw className="h-7 w-7 animate-spin text-primary" />
                      <p className="text-xs font-semibold">Requesting camera access...</p>
                    </div>
                  )}

                  {/* Camera Error Display */}
                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/90 text-white space-y-3">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {cameraError}
                      </p>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={startCamera}
                        className="text-xs rounded-xl h-8"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>

                {/* Camera Action Controls */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">
                    Point your camera at the certificate QR code.
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
                    }}
                    className="gap-1.5 h-8 text-[11px] rounded-lg cursor-pointer"
                  >
                    <FlipHorizontal className="h-3.5 w-3.5" />
                    <span>Flip Camera</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Photo Upload Scanner View */}
            {scannerMode === "upload" && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-8 text-center space-y-3 cursor-pointer bg-muted/20"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    {isProcessingImage ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                      <ImageIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      {isProcessingImage ? "Scanning Photo..." : "Select or Drop Certificate Photo"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Supports PNG, JPG, JPEG, and WebP photos containing a certificate QR code
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isProcessingImage}
                    className="text-xs rounded-xl pointer-events-none"
                  >
                    Browse Files
                  </Button>
                </div>

                {cameraError && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <p className="font-bold">Scan Error</p>
                    <p className="text-[11px]">{cameraError}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <PublicFooter />

      {/* Print Styles for Verification Report */}
      <style>{`
        @media print {
          header, footer, nav, button, form, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          #printable-verification-dossier {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin: 0 !important;
            padding: 1cm !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-background">
          <PublicNavbar />
          <main className="flex-1 container mx-auto px-4 py-16 text-center space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground">
              Loading Certificate Verification Portal...
            </p>
          </main>
          <PublicFooter />
        </div>
      }
    >
      <CertificateVerificationContent />
    </React.Suspense>
  );
}
