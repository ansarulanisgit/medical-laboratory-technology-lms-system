"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sliders,
  Palette,
  Type,
  Image as ImageIcon,
  FileText,
  ShieldAlert,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  AlertTriangle,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Eye,
  Microscope,
  CheckCircle2,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import {
  useSystemSettings,
  COLOR_PRESETS,
  FONT_FAMILY_OPTIONS,
  DEFAULT_SYSTEM_SETTINGS,
  DEFAULT_STRINGS,
  SystemStringItem,
} from "@/lib/stores/system-settings-store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SettingsTab = "THEME" | "TYPOGRAPHY" | "ASSETS" | "STRINGS" | "PLATFORM" | "BACKUP";

export default function SystemSettingsPage() {
  const { profile } = useAcademicProfile();
  const {
    settings,
    updateSetting,
    updateSettingsBatch,
    resetSettings,
    updateString,
    resetStrings,
    exportSettingsJSON,
    importSettingsJSON,
  } = useSystemSettings();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = React.useState<SettingsTab>("THEME");
  const [saveSuccessMessage, setSaveSuccessMessage] = React.useState<string | null>(null);
  const [stringSearch, setStringSearch] = React.useState("");
  const [selectedStringCategory, setSelectedStringCategory] = React.useState<string>("ALL");
  const [newStringKey, setNewStringKey] = React.useState("");
  const [newStringValue, setNewStringValue] = React.useState("");
  const [newStringDesc, setNewStringDesc] = React.useState("");
  const [importJsonText, setImportJsonText] = React.useState("");
  const [importError, setImportError] = React.useState<string | null>(null);

  const fileInputLogoRef = React.useRef<HTMLInputElement>(null);
  const fileInputFaviconRef = React.useRef<HTMLInputElement>(null);

  const isSuperAdmin =
    profile?.role === "SUPER_ADMIN" ||
    profile?.baseRole === "SUPER_ADMIN" ||
    profile?.username === "ansarulanis" ||
    profile?.email?.includes("ansarul.contact");

  const notifySuccess = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  // Handle Logo Upload (converts to base64 Data URL)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateSetting("customLogoUrl", reader.result);
        notifySuccess("Custom logo uploaded and applied globally!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Favicon Upload (converts to base64 Data URL)
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Favicon file should be under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateSetting("customFaviconUrl", reader.result);
        updateSetting("faviconType", "custom");
        notifySuccess("Custom favicon uploaded and applied to browser tab!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Export Download
  const handleDownloadBackup = () => {
    const json = exportSettingsJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `labtutor-system-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notifySuccess("System settings backup JSON downloaded.");
  };

  // Handle Import JSON
  const handleApplyImport = () => {
    setImportError(null);
    if (!importJsonText.trim()) return;

    const ok = importSettingsJSON(importJsonText.trim());
    if (ok) {
      setImportJsonText("");
      notifySuccess("Settings successfully restored from backup!");
    } else {
      setImportError("Invalid JSON structure. Please verify the backup file format.");
    }
  };

  // Filtered strings dictionary
  const filteredStrings = React.useMemo(() => {
    return settings.strings.filter((s) => {
      const matchesCat =
        selectedStringCategory === "ALL" || s.category === selectedStringCategory;
      const matchesSearch =
        !stringSearch.trim() ||
        s.key.toLowerCase().includes(stringSearch.toLowerCase()) ||
        s.value.toLowerCase().includes(stringSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(stringSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [settings.strings, selectedStringCategory, stringSearch]);

  // Access Control Barrier
  if (!isSuperAdmin) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center space-y-4 pt-16">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Access Restricted</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          The System Settings Hub is exclusively restricted to authorized Super Administrators.
          Your current account does not have sufficient administrative clearance to modify global parameters.
        </p>
        <div className="pt-2">
          <Link href="/student">
            <Button className="rounded-xl px-5 bg-primary text-primary-foreground font-semibold">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="filled" className="text-xs uppercase tracking-wider font-bold px-2.5 py-0.5">
              Super Admin Privilege
            </Badge>
            {settings.maintenanceMode && (
              <Badge variant="destructive" className="text-xs uppercase tracking-wider font-bold animate-pulse">
                Maintenance Mode Active
              </Badge>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sliders className="h-6 w-6 text-primary" />
            Global System Settings & Customization Hub
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Configure global themes, color schemes, typography, logos, favicons, and application text in real-time.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadBackup}
            className="rounded-xl text-xs sm:text-sm font-medium border-border/80 hover:border-primary/50"
          >
            <Download className="h-4 w-4 mr-1.5 text-primary" />
            Export Backup
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to reset all settings to system factory defaults?")) {
                resetSettings();
                notifySuccess("All system settings restored to factory defaults!");
              }
            }}
            className="rounded-xl text-xs sm:text-sm font-medium text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Factory Reset
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/80">
        <button
          type="button"
          onClick={() => setActiveTab("THEME")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer",
            activeTab === "THEME"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <Palette className="h-4 w-4" />
          <span>Theme & Colors</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("TYPOGRAPHY")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer",
            activeTab === "TYPOGRAPHY"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <Type className="h-4 w-4" />
          <span>Typography & Fonts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ASSETS")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer",
            activeTab === "ASSETS"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Logo & Favicon</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("STRINGS")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer",
            activeTab === "STRINGS"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Text Strings Dictionary</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
            {settings.strings.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PLATFORM")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer",
            activeTab === "PLATFORM"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <Sliders className="h-4 w-4" />
          <span>Platform Controls</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("BACKUP")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer",
            activeTab === "BACKUP"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <Download className="h-4 w-4" />
          <span>Backup & Reset</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: THEME & COLOR SCHEMES
         ========================================================================= */}
      {activeTab === "THEME" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Light / Dark Mode Controls */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Sun className="h-4 w-4 text-primary" />
                Color Appearance Mode
              </CardTitle>
              <CardDescription>
                Select the baseline luminescence mode across the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex items-center gap-3 flex-wrap">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="rounded-xl text-xs sm:text-sm font-semibold gap-2 min-h-[40px] px-4"
              >
                <Sun className="h-4 w-4" />
                Light Mode
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="rounded-xl text-xs sm:text-sm font-semibold gap-2 min-h-[40px] px-4"
              >
                <Moon className="h-4 w-4" />
                Dark Mode
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="rounded-xl text-xs sm:text-sm font-semibold gap-2 min-h-[40px] px-4"
              >
                <Laptop className="h-4 w-4" />
                System Preference
              </Button>
            </CardContent>
          </Card>

          {/* Color Palette Presets */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Primary Brand Color Scheme Presets
              </CardTitle>
              <CardDescription>
                Pick a pre-calibrated medical diagnostic palette or enter a custom hex color below.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected =
                    settings.colorPresetId === preset.id && !settings.customPrimaryHex;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        updateSettingsBatch({
                          colorPresetId: preset.id,
                          customPrimaryHex: null,
                        });
                        notifySuccess(`Applied ${preset.name} color scheme!`);
                      }}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 group",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border hover:border-primary/40 bg-card"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-9 w-9 rounded-xl shadow-xs border border-white/20 shrink-0 flex items-center justify-center text-white"
                          style={{ backgroundColor: preset.primaryHex }}
                        >
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {preset.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {preset.primaryHex}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Color Input */}
              <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-foreground">Custom Primary Color</p>
                  <p className="text-xs text-muted-foreground">
                    Define an exact hex color code for your clinical institution.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.customPrimaryHex || "#00875a"}
                    onChange={(e) => {
                      updateSetting("customPrimaryHex", e.target.value);
                    }}
                    className="h-9 w-10 p-0 rounded-lg border border-border cursor-pointer bg-transparent"
                    title="Choose custom color"
                  />
                  <Input
                    type="text"
                    value={settings.customPrimaryHex || ""}
                    placeholder="#00875a"
                    onChange={(e) => {
                      const val = e.target.value;
                      updateSetting("customPrimaryHex", val ? val : null);
                    }}
                    className="w-28 font-mono text-xs uppercase rounded-xl"
                  />
                  {settings.customPrimaryHex && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateSetting("customPrimaryHex", null);
                        notifySuccess("Reset to default preset scheme.");
                      }}
                      className="rounded-xl text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Border Radius Controls */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                UI Corner Roundness (Border Radius)
              </CardTitle>
              <CardDescription>
                Customize rounded corners across buttons, cards, modals, and input fields.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Sharp", value: "0px" as const },
                  { label: "Compact", value: "8px" as const },
                  { label: "Modern Soft", value: "14px" as const },
                  { label: "Curved", value: "18px" as const },
                  { label: "Pill", value: "9999px" as const },
                ].map((rad) => {
                  const isSelected = settings.borderRadius === rad.value;
                  return (
                    <button
                      key={rad.value}
                      type="button"
                      onClick={() => {
                        updateSetting("borderRadius", rad.value);
                        notifySuccess(`Border radius set to ${rad.label} (${rad.value})`);
                      }}
                      className={cn(
                        "p-3.5 border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2",
                        isSelected
                          ? "border-primary bg-primary/5 font-bold text-foreground shadow-xs"
                          : "border-border hover:border-primary/40 bg-card text-muted-foreground font-medium"
                      )}
                      style={{ borderRadius: rad.value }}
                    >
                      <div
                        className="h-6 w-12 border-2 border-primary/50 bg-primary/20"
                        style={{ borderRadius: rad.value }}
                      />
                      <span className="text-xs sm:text-sm">{rad.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Live Preview Card */}
          <Card className="rounded-2xl border-border/80 bg-muted/20">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Eye className="h-4 w-4 text-primary" />
                Live Theme Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button className="rounded-xl text-xs sm:text-sm font-semibold">Primary Button</Button>
                <Button variant="outline" className="rounded-xl text-xs sm:text-sm">Outline Button</Button>
                <Badge variant="filled" className="text-xs px-2.5 py-1 font-bold">Filled Badge</Badge>
                <Badge variant="outline" className="text-xs px-2.5 py-1 font-bold border-primary text-primary">Accent Badge</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 2: TYPOGRAPHY & FONTS
         ========================================================================= */}
      {activeTab === "TYPOGRAPHY" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Font Family Selection */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                Global Application Font Family
              </CardTitle>
              <CardDescription>
                Select the overarching typography family applied to UI elements, headers, and content.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {FONT_FAMILY_OPTIONS.map((f) => {
                  const isSelected = settings.fontFamilyId === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => {
                        updateSetting("fontFamilyId", f.id);
                        notifySuccess(`Font family updated to ${f.name}!`);
                      }}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 group",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border hover:border-primary/40 bg-card"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-muted font-bold text-muted-foreground">
                          {f.category}
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground" style={{ fontFamily: f.fontFamily }}>
                          {f.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1" style={{ fontFamily: f.fontFamily }}>
                          The quick brown fox jumps over the lazy dog.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Paragraph Font Size Controls */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                Paragraph Text Sizes (Desktop vs Mobile)
              </CardTitle>
              <CardDescription>
                Tune paragraph readability across devices. Default standard: 16px on desktop, 14px on mobile.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Desktop Slider */}
              <div className="space-y-2.5 p-4 rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Desktop Paragraph Size</span>
                  <Badge variant="filled" className="font-mono text-xs px-2.5 py-0.5">
                    {settings.desktopParagraphFontSize}px
                  </Badge>
                </div>
                <input
                  type="range"
                  min="13"
                  max="20"
                  step="1"
                  value={settings.desktopParagraphFontSize}
                  onChange={(e) => updateSetting("desktopParagraphFontSize", Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Compact (13px)</span>
                  <span>Standard (16px)</span>
                  <span>Large (20px)</span>
                </div>
              </div>

              {/* Mobile Slider */}
              <div className="space-y-2.5 p-4 rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Mobile Paragraph Size</span>
                  <Badge variant="filled" className="font-mono text-xs px-2.5 py-0.5">
                    {settings.mobileParagraphFontSize}px
                  </Badge>
                </div>
                <input
                  type="range"
                  min="12"
                  max="18"
                  step="1"
                  value={settings.mobileParagraphFontSize}
                  onChange={(e) => updateSetting("mobileParagraphFontSize", Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Small (12px)</span>
                  <span>Standard (14px)</span>
                  <span>Large (18px)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heading Scales & Weights */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                Heading Sizing & Font Weight
              </CardTitle>
              <CardDescription>
                Configure hierarchy dimensions for H1 (Main headers), H2 (Section titles), and H3 (Card headers).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* H1 */}
                <div className="space-y-2 p-3.5 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase">H1 Main Title</span>
                    <span className="text-xs font-mono text-primary font-bold">{settings.headingH1Size}px</span>
                  </div>
                  <input
                    type="range"
                    min="22"
                    max="36"
                    value={settings.headingH1Size}
                    onChange={(e) => updateSetting("headingH1Size", Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                {/* H2 */}
                <div className="space-y-2 p-3.5 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase">H2 Section Header</span>
                    <span className="text-xs font-mono text-primary font-bold">{settings.headingH2Size}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="28"
                    value={settings.headingH2Size}
                    onChange={(e) => updateSetting("headingH2Size", Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                {/* H3 */}
                <div className="space-y-2 p-3.5 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase">H3 Card Header</span>
                    <span className="text-xs font-mono text-primary font-bold">{settings.headingH3Size}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="22"
                    value={settings.headingH3Size}
                    onChange={(e) => updateSetting("headingH3Size", Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Heading Weight */}
              <div className="flex items-center justify-between pt-3 border-t border-border flex-wrap gap-3">
                <div>
                  <p className="text-sm font-bold text-foreground">Heading Font Weight</p>
                  <p className="text-xs text-muted-foreground">Thickness of all headings across cards and banners.</p>
                </div>
                <div className="flex items-center gap-2">
                  {(["600", "700", "800"] as const).map((wt) => (
                    <Button
                      key={wt}
                      size="sm"
                      variant={settings.headingWeight === wt ? "default" : "outline"}
                      onClick={() => updateSetting("headingWeight", wt)}
                      className="rounded-xl text-xs font-bold min-h-[36px]"
                    >
                      {wt === "600" ? "Semibold (600)" : wt === "700" ? "Bold (700)" : "Extrabold (800)"}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Typography Specimen Card */}
          <Card className="rounded-2xl border-border/80 bg-muted/20">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Eye className="h-4 w-4 text-primary" />
                Live Typography Specimen
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <h1 className="text-foreground tracking-tight" style={{ fontSize: `${settings.headingH1Size}px` }}>
                H1 Clinical Diagnostic Excellence (Sample Header)
              </h1>
              <h2 className="text-foreground tracking-tight" style={{ fontSize: `${settings.headingH2Size}px` }}>
                H2 Medical Laboratory Technology & Quality Control
              </h2>
              <h3 className="text-foreground tracking-tight" style={{ fontSize: `${settings.headingH3Size}px` }}>
                H3 Automated Hematology & Flow Cytometry SOP
              </h3>
              <p className="text-muted-foreground">
                Paragraph Preview: Standard Operating Procedures (SOPs) ensure strict biosafety compliance and diagnostic consistency across public hospitals and clinical laboratories.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LOGO & FAVICON CUSTOMIZER
         ========================================================================= */}
      {activeTab === "ASSETS" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Logo Customizer */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Application Brand Logo
              </CardTitle>
              <CardDescription>
                Upload an official institution emblem or enter an image URL to replace the default microscope badge in the sidebar and headers.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Current Logo Preview */}
                <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-border flex items-center justify-center p-2 bg-muted/30 shrink-0 overflow-hidden shadow-xs">
                  {settings.customLogoUrl ? (
                    <img
                      src={settings.customLogoUrl}
                      alt="Custom Logo"
                      className="h-full w-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                      <Microscope className="h-7 w-7" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputLogoRef}
                      onChange={handleLogoUpload}
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      onClick={() => fileInputLogoRef.current?.click()}
                      className="rounded-xl text-xs sm:text-sm font-semibold gap-1.5"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo Image
                    </Button>

                    {settings.customLogoUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateSetting("customLogoUrl", null);
                          notifySuccess("Reset logo to default microscope emblem.");
                        }}
                        className="rounded-xl text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Reset to Default Emblem
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supports PNG, SVG, JPG, or WebP (square aspect ratio recommended, max 2MB).
                  </p>
                </div>
              </div>

              {/* URL Input Fallback */}
              <div className="space-y-1 pt-2 border-t border-border">
                <label className="text-xs font-bold text-foreground">Or Enter Public Image URL</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="url"
                    value={settings.customLogoUrl || ""}
                    placeholder="https://your-hospital.edu/logo.png"
                    onChange={(e) => updateSetting("customLogoUrl", e.target.value || null)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favicon Customizer */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Browser Tab Favicon
              </CardTitle>
              <CardDescription>
                Customize the browser tab icon. Changes dynamically update the active browser tab in real time.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Current Favicon Preview */}
                <div className="h-16 w-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center p-2 bg-muted/30 shrink-0 shadow-xs">
                  {settings.customFaviconUrl ? (
                    <img
                      src={settings.customFaviconUrl}
                      alt="Favicon"
                      className="h-9 w-9 object-contain"
                    />
                  ) : (
                    <img
                      src="/favicon-32x32.png"
                      alt="Default Favicon"
                      className="h-9 w-9 object-contain"
                    />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputFaviconRef}
                      onChange={handleFaviconUpload}
                      accept="image/x-icon,image/png,image/svg+xml"
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      onClick={() => fileInputFaviconRef.current?.click()}
                      className="rounded-xl text-xs sm:text-sm font-semibold gap-1.5"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Favicon File (.ico, .png, .svg)
                    </Button>

                    {settings.customFaviconUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateSetting("customFaviconUrl", null);
                          updateSetting("faviconType", "default");
                          notifySuccess("Favicon restored to default LabTutor emblem.");
                        }}
                        className="rounded-xl text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Reset Favicon
                      </Button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Recommended dimensions: 32x32px or 48x48px (.ico, .png, or .svg, max 1MB).
                  </p>
                </div>
              </div>

              {/* Simulated Browser Tab Preview */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2.5">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Browser Tab Live Simulation
                </span>
                <div className="max-w-xs flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-card border border-border shadow-xs">
                  <div className="h-4.5 w-4.5 shrink-0 overflow-hidden flex items-center justify-center">
                    {settings.customFaviconUrl ? (
                      <img src={settings.customFaviconUrl} alt="Tab icon" className="h-4.5 w-4.5 object-contain" />
                    ) : (
                      <img src="/favicon-32x32.png" alt="Tab icon" className="h-4.5 w-4.5 rounded-[3px] object-contain" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                    {settings.brandName} | LMS Portal
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TEXT STRINGS DICTIONARY
         ========================================================================= */}
      {activeTab === "STRINGS" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Global UI Text & Translations Dictionary
                  </CardTitle>
                  <CardDescription>
                    Modify any text string across the application in real-time. Changes propagate instantly.
                  </CardDescription>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm("Reset all text strings to system default dictionary?")) {
                      resetStrings();
                      notifySuccess("All text strings reset to defaults!");
                    }
                  }}
                  className="rounded-xl text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Reset Strings
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              {/* Filter Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by key, text content, or description..."
                    value={stringSearch}
                    onChange={(e) => setStringSearch(e.target.value)}
                    className="pl-9 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                  {["ALL", "GENERAL", "DASHBOARD", "CURRICULUM", "BUTTONS", "FOOTER"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedStringCategory(cat)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer",
                        selectedStringCategory === cat
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strings List */}
              <div className="divide-y divide-border/60 rounded-2xl border border-border/80 overflow-hidden bg-card">
                {filteredStrings.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm font-semibold">No text strings match your search</p>
                  </div>
                ) : (
                  filteredStrings.map((item) => (
                    <div key={item.key} className="p-4 space-y-2 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                          {item.key}
                        </span>
                        <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                          {item.category}
                        </Badge>
                      </div>
                      <Input
                        type="text"
                        value={item.value}
                        onChange={(e) => updateString(item.key, e.target.value)}
                        className="rounded-xl text-sm font-medium"
                      />
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Custom String Section */}
              <div className="p-4 rounded-2xl border border-dashed border-border bg-muted/20 space-y-3">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-primary" />
                  Add Custom Global Text String
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Input
                    type="text"
                    placeholder="String Key (e.g. auth.welcomeNotice)"
                    value={newStringKey}
                    onChange={(e) => setNewStringKey(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                  <Input
                    type="text"
                    placeholder="Text Value..."
                    value={newStringValue}
                    onChange={(e) => setNewStringValue(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Optional brief description..."
                  value={newStringDesc}
                  onChange={(e) => setNewStringDesc(e.target.value)}
                  className="rounded-xl text-xs"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!newStringKey.trim() || !newStringValue.trim()) {
                      alert("Please provide both key and text value.");
                      return;
                    }
                    updateString(newStringKey.trim(), newStringValue.trim());
                    setNewStringKey("");
                    setNewStringValue("");
                    setNewStringDesc("");
                    notifySuccess(`Added new string "${newStringKey}" to dictionary!`);
                  }}
                  className="rounded-xl text-xs font-semibold"
                >
                  Save to Global Dictionary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 5: PLATFORM & OPERATIONAL CONTROLS
         ========================================================================= */}
      {activeTab === "PLATFORM" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Maintenance Mode */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Platform Maintenance Mode
              </CardTitle>
              <CardDescription>
                When active, displays a visible system advisory banner to all learners and faculty.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
                <div>
                  <p className="text-sm font-bold text-foreground">Enable Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Broadcast an active maintenance advisory banner.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => updateSetting("maintenanceMode", e.target.checked)}
                  className="h-5 w-5 accent-primary cursor-pointer"
                />
              </div>

              {settings.maintenanceMode && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-xs font-bold text-foreground">Maintenance Message</label>
                  <Input
                    type="text"
                    value={settings.maintenanceMessage}
                    onChange={(e) => updateSetting("maintenanceMessage", e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration & Security Controls */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                Security & Academic Policies
              </CardTitle>
              <CardDescription>
                Configure self-service registration, automated certificates, and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3.5">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
                <div>
                  <p className="text-sm font-bold text-foreground">Self-Registration (Sign Up)</p>
                  <p className="text-xs text-muted-foreground">Allow new trainees to register without admin pre-invitation.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.selfRegistrationEnabled}
                  onChange={(e) => updateSetting("selfRegistrationEnabled", e.target.checked)}
                  className="h-5 w-5 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
                <div>
                  <p className="text-sm font-bold text-foreground">Automated Certificate Issuance</p>
                  <p className="text-xs text-muted-foreground">Generate digital certificate when student covers 100% curriculum.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoCertificateGeneration}
                  onChange={(e) => updateSetting("autoCertificateGeneration", e.target.checked)}
                  className="h-5 w-5 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
                <div>
                  <p className="text-sm font-bold text-foreground">Audio & Sound Feedback</p>
                  <p className="text-xs text-muted-foreground">Play soft audio clicks on test submissions and quiz scoring.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEffectsEnabled}
                  onChange={(e) => updateSetting("soundEffectsEnabled", e.target.checked)}
                  className="h-5 w-5 accent-primary cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 6: BACKUP & FACTORY RESET
         ========================================================================= */}
      {activeTab === "BACKUP" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                Backup System Configuration (JSON)
              </CardTitle>
              <CardDescription>
                Export all current settings, strings, themes, and branding parameters to a JSON file.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <Button
                onClick={handleDownloadBackup}
                className="rounded-xl text-xs sm:text-sm font-semibold gap-2"
              >
                <Download className="h-4 w-4" />
                Download System Settings (.json)
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                Restore Configuration from Backup
              </CardTitle>
              <CardDescription>
                Paste your configuration JSON below to restore system settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <textarea
                rows={6}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='Paste {"brandName": "...", "colorPresetId": "...", ...} here'
                className="w-full rounded-xl border border-input bg-background p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />

              {importError && (
                <p className="text-xs text-destructive font-semibold">{importError}</p>
              )}

              <Button
                size="sm"
                onClick={handleApplyImport}
                className="rounded-xl text-xs sm:text-sm font-semibold gap-1.5"
              >
                <Save className="h-4 w-4" />
                Restore & Apply Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
