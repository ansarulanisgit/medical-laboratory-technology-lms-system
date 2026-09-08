"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Layers,
  Lock
} from "lucide-react";
import { useModuleManagement, NavModuleItem } from "@/lib/stores/module-management-store";
import { useAcademic } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";
import { UserRole } from "@/types/roles";

const ALL_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "MENTOR", "STUDENT"];

export default function ModuleManagementPage() {
  const { modules, toggleModuleVisibility, updateModule, reorderModules, resetModules } = useModuleManagement();
  const { role } = useAcademic();
  const { logActivity } = useActivityLog();

  const isSuperAdmin = role === "SUPER_ADMIN";

  const handleToggle = (mod: NavModuleItem) => {
    if (!isSuperAdmin) return;
    toggleModuleVisibility(mod.id);
    logActivity({
      action: "SETTINGS",
      module: "Module Management",
      details: `${mod.visible ? "Disabled" : "Enabled"} module: "${mod.label}"`,
    });
  };

  const handleReorder = (idx: number, dir: "UP" | "DOWN", name: string) => {
    if (!isSuperAdmin) return;
    const targetIdx = dir === "UP" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= modules.length) return;
    reorderModules(idx, targetIdx);
    logActivity({
      action: "SETTINGS",
      module: "Module Management",
      details: `Moved module "${name}" ${dir}`,
    });
  };

  const handleRoleToggle = (mod: NavModuleItem, targetRole: UserRole) => {
    if (!isSuperAdmin) return;
    const exists = mod.allowedRoles.includes(targetRole);
    const updatedRoles = exists
      ? mod.allowedRoles.filter((r: UserRole) => r !== targetRole)
      : [...mod.allowedRoles, targetRole];

    updateModule(mod.id, { allowedRoles: updatedRoles });
    logActivity({
      action: "SETTINGS",
      module: "Module Management",
      details: `Updated role access for "${mod.label}"`,
    });
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center space-y-3">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-xs text-muted-foreground">
          Only the Super Administrator has authority to modify platform module visibility and arrangement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Module & Navigation Management
            </h1>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              Super Admin Control
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Dynamically toggle visibility, adjust navigation display order, and configure role-based access for every LMS section.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm("Reset all platform navigation modules to system defaults?")) {
              resetModules();
              logActivity({
                action: "SETTINGS",
                module: "Module Management",
                details: "Reset modules to factory defaults",
              });
            }
          }}
          className="text-xs gap-1.5 h-9"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </Button>
      </div>

      {/* Notice Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-primary shrink-0" />
        <div>
          <strong className="text-foreground">Real-time Architecture:</strong> Toggling a module immediately affects the sidebar and navigation routing for corresponding roles across the entire application without needing server reboots.
        </div>
      </div>

      {/* Modules Table List */}
      <div className="space-y-3">
        {modules.map((mod, idx) => (
          <Card
            key={mod.id}
            className={`border transition-all ${
              mod.visible
                ? "border-border bg-card shadow-sm"
                : "border-dashed border-border/60 bg-muted/20 opacity-70"
            }`}
          >
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Module Info */}
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === 0}
                    onClick={() => handleReorder(idx, "UP", mod.label)}
                    className="h-6 w-6 p-0"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">
                    #{mod.order}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === modules.length - 1}
                    onClick={() => handleReorder(idx, "DOWN", mod.label)}
                    className="h-6 w-6 p-0"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{mod.label}</h3>
                    <code className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {mod.href}
                    </code>
                    {mod.visible ? (
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                        Disabled
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Roles & Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Role access checkboxes */}
                <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-lg border border-border">
                  <span className="text-[10px] font-semibold text-muted-foreground mr-1">Access:</span>
                  {ALL_ROLES.map((r) => {
                    const hasAccess = mod.allowedRoles.includes(r);
                    return (
                      <button
                        key={r}
                        onClick={() => handleRoleToggle(mod, r)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                          hasAccess
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {r.replace("_", " ")}
                      </button>
                    );
                  })}
                </div>

                {/* Enable/Disable Button */}
                <Button
                  variant={mod.visible ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggle(mod)}
                  className="text-xs h-8 gap-1.5"
                >
                  {mod.visible ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Disable</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      <span>Enable</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
