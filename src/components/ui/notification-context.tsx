"use client";

import * as React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: NotificationAction;
  createdAt?: number;
}

export interface ShowNotificationOptions extends Omit<NotificationItem, "id"> {
  autoRefresh?: boolean;
}

interface NotificationContextType {
  notify: (item: ShowNotificationOptions) => void;
  showNotification: (item: ShowNotificationOptions) => void;
  success: (title: string, message?: string, autoRefresh?: boolean, action?: NotificationAction) => void;
  error: (title: string, message?: string, action?: NotificationAction) => void;
  info: (title: string, message?: string, action?: NotificationAction) => void;
  warning: (title: string, message?: string, action?: NotificationAction) => void;
  clearAll: () => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

const TYPE_CONFIG = {
  success: {
    badge: "Saved",
    Icon: CheckCircle2,
    iconBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    barBg: "bg-emerald-500",
    borderColor: "border-emerald-500/30 dark:border-emerald-500/20",
    glow: "shadow-[0_10px_35px_-4px_rgba(16,185,129,0.18)] dark:shadow-[0_10px_35px_-4px_rgba(16,185,129,0.10)]",
  },
  error: {
    badge: "Error",
    Icon: AlertCircle,
    iconBg: "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400",
    barBg: "bg-rose-500",
    borderColor: "border-rose-500/30 dark:border-rose-500/20",
    glow: "shadow-[0_10px_35px_-4px_rgba(244,63,94,0.18)] dark:shadow-[0_10px_35px_-4px_rgba(244,63,94,0.10)]",
  },
  warning: {
    badge: "Notice",
    Icon: AlertTriangle,
    iconBg: "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400",
    barBg: "bg-amber-500",
    borderColor: "border-amber-500/30 dark:border-amber-500/20",
    glow: "shadow-[0_10px_35px_-4px_rgba(245,158,11,0.18)] dark:shadow-[0_10px_35px_-4px_rgba(245,158,11,0.10)]",
  },
  info: {
    badge: "Update",
    Icon: Sparkles,
    iconBg: "bg-primary/15 border-primary/30 text-primary",
    barBg: "bg-primary",
    borderColor: "border-primary/30 dark:border-primary/20",
    glow: "shadow-[0_10px_35px_-4px_rgba(16,185,129,0.18)]",
  },
};

/**
 * Interactive Single Toast Card
 */
function ToastCard({
  item,
  onDismiss,
}: {
  item: NotificationItem;
  onDismiss: (id: string) => void;
}) {
  const duration = item.duration ?? 4500;
  const [progress, setProgress] = React.useState(100);
  const [isHovered, setIsHovered] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const remainingTimeRef = React.useRef(duration);
  const lastTickRef = React.useRef(Date.now());

  React.useEffect(() => {
    if (duration <= 0) return;

    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      if (isHovered) {
        lastTickRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - delta);
      const pct = (remainingTimeRef.current / duration) * 100;
      setProgress(pct);

      if (remainingTimeRef.current <= 0) {
        clearInterval(interval);
        onDismiss(item.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, isHovered, item.id, onDismiss]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = item.message ? `${item.title}: ${item.message}` : item.title;
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.info;
  const Icon = cfg.Icon;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 transition-all duration-300",
        "bg-card/95 dark:bg-card/90 backdrop-blur-xl",
        "shadow-lg ring-1 ring-black/5 dark:ring-white/5",
        cfg.borderColor,
        cfg.glow,
        "animate-in fade-in slide-in-from-top-3 ease-out"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Glowing Badge Icon */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-2xs transition-transform",
            cfg.iconBg,
            isHovered && "scale-105"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        {/* Text Details & Interactive Action */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[9.5px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-md border leading-none shrink-0",
                cfg.iconBg
              )}
            >
              {cfg.badge}
            </span>
            <h5 className="text-xs font-semibold text-foreground tracking-tight truncate">
              {item.title}
            </h5>
          </div>

          {item.message && (
            <p className="text-[11.5px] text-muted-foreground font-normal leading-relaxed">
              {item.message}
            </p>
          )}

          {/* Interactive Action CTA Button */}
          {item.action && (
            <div className="pt-2 flex items-center gap-2">
              {item.action.href ? (
                <Link
                  href={item.action.href}
                  onClick={() => onDismiss(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xs active:scale-95"
                >
                  <span>{item.action.label}</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    item.action?.onClick?.();
                    onDismiss(item.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <span>{item.action.label}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Tools: Copy & Close */}
        <div className="flex items-center space-x-1 shrink-0 -mt-0.5 -mr-1">
          {item.message && (
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy details"}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onDismiss(item.id)}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Hover Pause Badge */}
      {isHovered && duration > 0 && (
        <div className="absolute top-2 right-14 text-[9px] font-medium text-muted-foreground bg-muted/90 px-1.5 py-0.5 rounded-md pointer-events-none animate-in fade-in">
          Paused
        </div>
      )}

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-muted/40 overflow-hidden">
          <div
            className={cn("h-full transition-all duration-75 ease-linear", cfg.barBg)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const router = useRouter();

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const notify = React.useCallback(
    ({
      type = "info",
      title,
      message,
      duration = 4500,
      action,
      autoRefresh = false,
    }: ShowNotificationOptions) => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newItem: NotificationItem = {
        id,
        type,
        title,
        message,
        duration,
        action,
        createdAt: Date.now(),
      };

      setNotifications((prev) => {
        // Keep at most 4 recent notifications to prevent clutter
        const next = [newItem, ...prev];
        return next.slice(0, 4);
      });

      if (autoRefresh) {
        try {
          router.refresh();
        } catch {
          // ignore
        }
      }
    },
    [router]
  );

  const success = React.useCallback(
    (title: string, message?: string, autoRefresh = false, action?: NotificationAction) => {
      notify({ type: "success", title, message, autoRefresh, action });
    },
    [notify]
  );

  const error = React.useCallback(
    (title: string, message?: string, action?: NotificationAction) => {
      notify({ type: "error", title, message, action });
    },
    [notify]
  );

  const info = React.useCallback(
    (title: string, message?: string, action?: NotificationAction) => {
      notify({ type: "info", title, message, action });
    },
    [notify]
  );

  const warning = React.useCallback(
    (title: string, message?: string, action?: NotificationAction) => {
      notify({ type: "warning", title, message, action });
    },
    [notify]
  );

  return (
    <NotificationContext.Provider
      value={{
        notify,
        showNotification: notify,
        success,
        error,
        info,
        warning,
        clearAll,
      }}
    >
      {children}

      {/* Floating Interactive Toast Container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-3 sm:px-0 print:hidden"
      >
        {/* Stacking Header: Clear All button when multiple notifications exist */}
        {notifications.length > 1 && (
          <div className="flex items-center justify-end pointer-events-auto pr-1">
            <button
              type="button"
              onClick={clearAll}
              className="text-[10.5px] font-medium text-muted-foreground hover:text-foreground bg-card/85 dark:bg-card/75 hover:bg-card border border-border/80 px-2.5 py-1 rounded-full backdrop-blur-md transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Clear all ({notifications.length})</span>
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {notifications.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={removeNotification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
