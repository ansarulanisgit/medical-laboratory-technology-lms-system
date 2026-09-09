"use client";

import * as React from "react";
import { UserRole } from "@/types/roles";

export interface ColorPreset {
  id: string;
  name: string;
  primaryLight: string; // HSL e.g. "158 84% 34%"
  primaryDark: string;  // HSL e.g. "158 75% 42%"
  primaryHex: string;   // For UI preview
  accentHex: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "emerald",
    name: "DGHS Medical Emerald",
    primaryLight: "158 84% 34%",
    primaryDark: "158 75% 42%",
    primaryHex: "#00875a",
    accentHex: "#059669",
  },
  {
    id: "sapphire",
    name: "Clinical Sapphire Blue",
    primaryLight: "221 83% 53%",
    primaryDark: "217 91% 60%",
    primaryHex: "#2563eb",
    accentHex: "#3b82f6",
  },
  {
    id: "amethyst",
    name: "Royal Amethyst Purple",
    primaryLight: "262 83% 58%",
    primaryDark: "263 70% 50%",
    primaryHex: "#7c3aed",
    accentHex: "#8b5cf6",
  },
  {
    id: "crimson",
    name: "Diagnostic Crimson Ruby",
    primaryLight: "0 84% 60%",
    primaryDark: "0 72% 51%",
    primaryHex: "#dc2626",
    accentHex: "#ef4444",
  },
  {
    id: "amber",
    name: "Amber Sunset",
    primaryLight: "38 92% 50%",
    primaryDark: "38 92% 50%",
    primaryHex: "#d97706",
    accentHex: "#f59e0b",
  },
  {
    id: "teal",
    name: "Teal Diagnostic",
    primaryLight: "173 80% 40%",
    primaryDark: "173 70% 45%",
    primaryHex: "#0d9488",
    accentHex: "#14b8a6",
  },
  {
    id: "slate",
    name: "Clinical Slate",
    primaryLight: "215 25% 27%",
    primaryDark: "215 20% 65%",
    primaryHex: "#334155",
    accentHex: "#64748b",
  },
];

export interface FontFamilyOption {
  id: string;
  name: string;
  fontFamily: string;
  category: "sans" | "serif" | "mono";
}

export const FONT_FAMILY_OPTIONS: FontFamilyOption[] = [
  {
    id: "plus-jakarta-sans",
    name: "Plus Jakarta Sans (Default)",
    fontFamily: "'Plus Jakarta Sans', var(--font-plus-jakarta-sans), sans-serif",
    category: "sans",
  },
  {
    id: "inter",
    name: "Inter",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    category: "sans",
  },
  {
    id: "jetbrains-mono",
    name: "JetBrains Mono (Technical)",
    fontFamily: "'JetBrains Mono', monospace",
    category: "mono",
  },
  {
    id: "merriweather",
    name: "Merriweather (Editorial)",
    fontFamily: "'Merriweather', Georgia, serif",
    category: "serif",
  },
  {
    id: "playfair",
    name: "Playfair Display (Academic)",
    fontFamily: "'Playfair Display', Georgia, serif",
    category: "serif",
  },
  {
    id: "system",
    name: "System UI (Native OS)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    category: "sans",
  },
];

export interface SystemStringItem {
  key: string;
  value: string;
  category: "GENERAL" | "DASHBOARD" | "CURRICULUM" | "STUDY_CENTER" | "FOOTER" | "BUTTONS";
  description: string;
}

export const DEFAULT_STRINGS: SystemStringItem[] = [
  {
    key: "app.brandName",
    value: "LabTutor Academy",
    category: "GENERAL",
    description: "Main application branding name in navigation and headers.",
  },
  {
    key: "app.tagline",
    value: "Medical Technology Learning & Clinical Diagnostic Governance Platform",
    category: "GENERAL",
    description: "Brand subtitle used across banners and metadata.",
  },
  {
    key: "app.institution",
    value: "State Medical Faculty of Bangladesh (SMFB) & DGHS",
    category: "GENERAL",
    description: "Accreditation and clinical authority label.",
  },
  {
    key: "dashboard.superAdmin.title",
    value: "System Governance & Multi-Role Analytics",
    category: "DASHBOARD",
    description: "Super Admin dashboard header banner title.",
  },
  {
    key: "dashboard.admin.title",
    value: "Academic Oversight & Institutional Analytics",
    category: "DASHBOARD",
    description: "Admin dashboard header banner title.",
  },
  {
    key: "dashboard.mentor.title",
    value: "Diagnostic Case Reviews & Trainee Mentorship",
    category: "DASHBOARD",
    description: "Mentor dashboard header banner title.",
  },
  {
    key: "dashboard.student.subtitle",
    value: "Real-time study progress, syllabus coverage, competency tracking and more.",
    category: "DASHBOARD",
    description: "Student personalized dashboard subtitle.",
  },
  {
    key: "dashboard.studyButton",
    value: "Continue Study",
    category: "BUTTONS",
    description: "Label for the primary study action button on subject cards.",
  },
  {
    key: "curriculum.disclaimer",
    value: "Official curriculum guidelines adhering to State Medical Faculty of Bangladesh (SMFB) & DGHS directives.",
    category: "CURRICULUM",
    description: "Accreditation and curriculum compliance notice.",
  },
  {
    key: "practical.warning",
    value: "Standard Operating Procedures (SOPs) are calibrated for competency verification. Adhere to institutional biosafety guidelines.",
    category: "GENERAL",
    description: "Laboratory bench biosafety advisory note.",
  },
  {
    key: "footer.copyright",
    value: "All Rights Reserved. Clinical Diagnostic & Allied Health Training System.",
    category: "FOOTER",
    description: "Footer accreditation and copyright text.",
  },
];

export interface SystemSettingsState {
  // 1. Branding & Assets
  brandName: string;
  brandTagline: string;
  customLogoUrl: string | null; // Data URL or Image URL
  logoEmblemIcon: "Microscope" | "Shield" | "Award" | "FlaskConical" | "Dna" | "Activity";
  customFaviconUrl: string | null; // Data URL or Image URL
  faviconType: "default" | "custom";

  // 2. Theme & Color Schemes
  colorPresetId: string;
  customPrimaryHex: string | null;
  borderRadius: "0px" | "8px" | "14px" | "18px" | "9999px";
  highContrastMode: boolean;

  // 3. Typography & Sizing
  fontFamilyId: string;
  desktopParagraphFontSize: number; // in px, e.g. 16
  mobileParagraphFontSize: number;  // in px, e.g. 14
  lineHeightScale: number;          // e.g. 1.6
  letterSpacing: "-0.02em" | "0em" | "0.02em";
  headingH1Size: number;            // in px, e.g. 28
  headingH2Size: number;            // in px, e.g. 20
  headingH3Size: number;            // in px, e.g. 16
  headingWeight: "600" | "700" | "800";

  // 4. Strings Dictionary
  strings: SystemStringItem[];

  // 5. Platform Operations
  maintenanceMode: boolean;
  maintenanceMessage: string;
  selfRegistrationEnabled: boolean;
  autoCertificateGeneration: boolean;
  soundEffectsEnabled: boolean;
  toastDurationMs: number;
}

export const DEFAULT_SYSTEM_SETTINGS: SystemSettingsState = {
  brandName: "LabTutor Academy",
  brandTagline: "Medical Technology Learning & Clinical Diagnostic Governance Platform",
  customLogoUrl: null,
  logoEmblemIcon: "Microscope",
  customFaviconUrl: null,
  faviconType: "default",

  colorPresetId: "emerald",
  customPrimaryHex: null,
  borderRadius: "14px",
  highContrastMode: false,

  fontFamilyId: "plus-jakarta-sans",
  desktopParagraphFontSize: 16,
  mobileParagraphFontSize: 14,
  lineHeightScale: 1.6,
  letterSpacing: "0em",
  headingH1Size: 28,
  headingH2Size: 20,
  headingH3Size: 16,
  headingWeight: "700",

  strings: DEFAULT_STRINGS,

  maintenanceMode: false,
  maintenanceMessage: "Scheduled platform maintenance is currently underway. Academic records remain intact.",
  selfRegistrationEnabled: true,
  autoCertificateGeneration: true,
  soundEffectsEnabled: true,
  toastDurationMs: 4000,
};

const STORAGE_KEY = "labtutor_system_settings_v1";

interface SystemSettingsContextType {
  settings: SystemSettingsState;
  updateSetting: <K extends keyof SystemSettingsState>(key: K, value: SystemSettingsState[K]) => void;
  updateSettingsBatch: (updates: Partial<SystemSettingsState>) => void;
  resetSettings: () => void;
  getString: (key: string, defaultValue?: string) => string;
  updateString: (key: string, value: string) => void;
  resetStrings: () => void;
  exportSettingsJSON: () => string;
  importSettingsJSON: (jsonString: string) => boolean;
}

const SystemSettingsContext = React.createContext<SystemSettingsContextType | undefined>(undefined);

// Helper to convert hex to HSL string: "H S% L%"
function hexToHslString(hex: string): string | null {
  const sanitized = hex.replace("#", "");
  if (sanitized.length !== 6) return null;

  const r = parseInt(sanitized.substring(0, 2), 16) / 255;
  const g = parseInt(sanitized.substring(2, 4), 16) / 255;
  const b = parseInt(sanitized.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  return `${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<SystemSettingsState>(DEFAULT_SYSTEM_SETTINGS);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Hydrate from localStorage on client mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setSettings((prev) => ({
            ...prev,
            ...parsed,
            strings: Array.isArray(parsed.strings) ? parsed.strings : DEFAULT_STRINGS,
          }));
        }
      }
    } catch (e) {
      console.error("Failed to load system settings:", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage
  const persistSettings = React.useCallback((newSettings: SystemSettingsState) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error("Failed to persist system settings:", e);
    }
  }, []);

  // Apply real-time dynamic CSS properties and document DOM updates
  React.useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;

    const root = document.documentElement;

    // 1. Color Palette / Primary
    let primaryHsl: string | null = null;
    if (settings.customPrimaryHex) {
      primaryHsl = hexToHslString(settings.customPrimaryHex);
    } else {
      const preset = COLOR_PRESETS.find((p) => p.id === settings.colorPresetId) || COLOR_PRESETS[0];
      const isDark = root.classList.contains("dark");
      primaryHsl = isDark ? preset.primaryDark : preset.primaryLight;
    }

    if (primaryHsl) {
      root.style.setProperty("--primary", primaryHsl);
      root.style.setProperty("--ring", primaryHsl);
    }

    // 2. Border Radius
    root.style.setProperty("--radius", settings.borderRadius);

    // 3. Font Family
    const fontOption = FONT_FAMILY_OPTIONS.find((f) => f.id === settings.fontFamilyId);
    if (fontOption) {
      root.style.setProperty("--font-family-current", fontOption.fontFamily);
    }

    // 4. Typography font sizes & line-heights
    root.style.setProperty("--body-font-size-desktop", `${settings.desktopParagraphFontSize}px`);
    root.style.setProperty("--body-font-size-mobile", `${settings.mobileParagraphFontSize}px`);
    root.style.setProperty("--body-line-height", `${settings.lineHeightScale}`);
    root.style.setProperty("--app-h1-size", `${settings.headingH1Size}px`);
    root.style.setProperty("--app-h2-size", `${settings.headingH2Size}px`);
    root.style.setProperty("--app-h3-size", `${settings.headingH3Size}px`);
    root.style.setProperty("--app-heading-weight", settings.headingWeight);

    // 5. Dynamic Favicon Update
    const defaultFavicon = "/favicon-32x32.png?v=2";
    const targetFavicon = settings.customFaviconUrl || defaultFavicon;
    const links = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    if (links.length > 0) {
      links.forEach((link) => {
        if (link.getAttribute("href") !== targetFavicon) {
          link.href = targetFavicon;
        }
      });
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = targetFavicon;
      document.head.appendChild(link);
    }
  }, [settings, isHydrated]);

  const updateSetting = React.useCallback(
    <K extends keyof SystemSettingsState>(key: K, value: SystemSettingsState[K]) => {
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    []
  );

  const updateSettingsBatch = React.useCallback((updates: Partial<SystemSettingsState>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const resetSettings = React.useCallback(() => {
    persistSettings(DEFAULT_SYSTEM_SETTINGS);
  }, [persistSettings]);

  const getString = React.useCallback(
    (key: string, defaultValue?: string): string => {
      const item = settings.strings.find((s) => s.key === key);
      return item ? item.value : defaultValue || key;
    },
    [settings.strings]
  );

  const updateString = React.useCallback(
    (key: string, value: string) => {
      setSettings((prev) => {
        const existing = prev.strings.some((s) => s.key === key);
        let updatedStrings: SystemStringItem[];
        if (existing) {
          updatedStrings = prev.strings.map((s) => (s.key === key ? { ...s, value } : s));
        } else {
          updatedStrings = [
            ...prev.strings,
            {
              key,
              value,
              category: "GENERAL",
              description: "Custom user-defined text string.",
            },
          ];
        }
        const updated = { ...prev, strings: updatedStrings };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    []
  );

  const resetStrings = React.useCallback(() => {
    updateSetting("strings", DEFAULT_STRINGS);
  }, [updateSetting]);

  const exportSettingsJSON = React.useCallback((): string => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettingsJSON = React.useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed && typeof parsed === "object") {
          const merged: SystemSettingsState = {
            ...DEFAULT_SYSTEM_SETTINGS,
            ...parsed,
            strings: Array.isArray(parsed.strings) ? parsed.strings : DEFAULT_STRINGS,
          };
          persistSettings(merged);
          return true;
        }
      } catch (e) {
        console.error("Failed to import settings JSON:", e);
      }
      return false;
    },
    [persistSettings]
  );

  return (
    <SystemSettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettingsBatch,
        resetSettings,
        getString,
        updateString,
        resetStrings,
        exportSettingsJSON,
        importSettingsJSON,
      }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = React.useContext(SystemSettingsContext);
  if (!context) {
    throw new Error("useSystemSettings must be used within SystemSettingsProvider");
  }
  return context;
}
