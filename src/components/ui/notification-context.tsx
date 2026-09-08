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
    Icon: CheckCircle2,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-500/20",
  },
  error: {
    Icon: AlertCircle,
    iconColor: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-500/20",
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-500/20",
  },
  info: {
    Icon: Sparkles,
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
};

/**
 * Clean & Compact Single Toast
 */
function ToastCard({
  item,
  onDismiss,
}: {
  item: NotificationItem;
  onDismiss: (id: string) => void;
}) {
  const duration = item.duration ?? 2800;

  React.useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, item.id, onDismiss]);

  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.info;
  const Icon = cfg.Icon;

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-2.5 rounded-xl border px-3.5 py-2 shadow-md transition-all",
        "bg-card/95 dark:bg-card/90 backdrop-blur-md",
        "border-border/80 ring-1 ring-black/5 dark:ring-white/5",
        cfg.borderColor,
        "animate-in fade-in slide-in-from-top-2 duration-150 ease-out"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", cfg.iconColor)} />

      <div className="flex-1 min-w-0 flex items-center gap-1.5 text-xs">
        <span className="font-semibold text-foreground truncate">{item.title}</span>
        {item.message && item.message !== item.title && (
          <>
            <span className="text-muted-foreground/40 shrink-0">•</span>
            <span className="text-muted-foreground truncate font-normal">{item.message}</span>
          </>
        )}
      </div>

      {item.action && (
        <div className="shrink-0 ml-1">
          {item.action.href ? (
            <Link
              href={item.action.href}
              onClick={() => onDismiss(item.id)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {item.action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                item.action?.onClick?.();
                onDismiss(item.id);
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              {item.action.label}
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer shrink-0 -mr-1"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
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
