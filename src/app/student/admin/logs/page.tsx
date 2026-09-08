"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Search,
  Trash2,
  Download,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  Layers,
  Database
} from "lucide-react";
import { useActivityLog, ActivityLogItem } from "@/lib/stores/activity-log-store";
import { useAcademic } from "@/lib/curriculum/academic-context";

const ACTIONS = ["ALL", "CREATE", "UPDATE", "DELETE", "DOWNLOAD", "SETTINGS", "COMMENT", "AUTH"] as const;

export default function RealTimeLogsPage() {
  const { logs, clearLogs } = useActivityLog();
  const { role } = useAcademic();

  const isSuperAdmin = role === "SUPER_ADMIN";

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedAction, setSelectedAction] = React.useState<string>("ALL");
  const [selectedModule, setSelectedModule] = React.useState<string>("ALL");

  const modulesList = React.useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.module));
    return ["ALL", ...Array.from(set)];
  }, [logs]);

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const matchAction = selectedAction === "ALL" || log.action === selectedAction;
      const matchModule = selectedModule === "ALL" || log.module === selectedModule;
      const matchSearch =
        !searchQuery.trim() ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAction && matchModule && matchSearch;
    });
  }, [logs, selectedAction, selectedModule, searchQuery]);

  const exportLogsAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `labtutor_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center space-y-3">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-xs text-muted-foreground">
          Only the Super Administrator has authority to inspect live audit logs and system telemetry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Real-time System Audit Log
            </h1>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              Live Audit Trail
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Immutable tracking of user activities, content authoring, role adjustments, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportLogsAsJson}
            className="text-xs gap-1.5 h-9"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Clear live activity logs? This action cannot be reversed.")) {
                clearLogs();
              }
            }}
            className="text-xs gap-1.5 h-9 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Logs</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {ACTIONS.map((act) => (
            <button
              key={act}
              onClick={() => setSelectedAction(act)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedAction === act
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground"
          >
            {modulesList.map((m) => (
              <option key={m} value={m}>
                {m === "ALL" ? "All Modules" : m}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search details, user, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-muted-foreground">
              Audit Events ({filteredLogs.length})
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Live Event Stream
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No audit events matched your filters.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredLogs.map((log) => {
                const isDelete = log.action === "DELETE";
                const isCreate = log.action === "CREATE";
                const isUpdate = log.action === "UPDATE";
                return (
                  <div
                    key={log.id}
                    className="p-3.5 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={isDelete ? "destructive" : isCreate ? "default" : isUpdate ? "outline" : "secondary"}
                          className="text-[10px] px-1.5 py-0 font-mono"
                        >
                          {log.action}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] bg-muted/40">
                          {log.module}
                        </Badge>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-foreground font-medium leading-relaxed">
                        {log.details}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground text-[11px] shrink-0">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <User className="h-3 w-3 text-primary" />
                        {log.performedBy} ({log.role})
                      </span>
                      {log.ipAddress && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {log.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
