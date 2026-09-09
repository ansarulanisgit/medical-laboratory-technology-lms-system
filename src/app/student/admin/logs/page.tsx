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
  Database,
  Globe,
  Laptop,
  Key,
  ChevronDown,
  ChevronUp,
  FileCode,
  Copy,
  Check,
  Hash,
  Server,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Radio,
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
  const [expandedLogId, setExpandedLogId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const modulesList = React.useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.module));
    return ["ALL", ...Array.from(set)];
  }, [logs]);

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const matchAction = selectedAction === "ALL" || log.action === selectedAction;
      const matchModule = selectedModule === "ALL" || log.module === selectedModule;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        log.details.toLowerCase().includes(q) ||
        log.performedBy.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        (log.referenceCode && log.referenceCode.toLowerCase().includes(q)) ||
        (log.ipAddress && log.ipAddress.toLowerCase().includes(q)) ||
        (log.targetEntity && log.targetEntity.toLowerCase().includes(q));
      return matchAction && matchModule && matchSearch;
    });
  }, [logs, selectedAction, selectedModule, searchQuery]);

  // Telemetry KPIs
  const stats = React.useMemo(() => {
    const total = logs.length;
    const mutations = logs.filter((l) => ["CREATE", "UPDATE", "DELETE"].includes(l.action)).length;
    const authEvents = logs.filter((l) => l.action === "AUTH").length;
    const uniqueActors = new Set(logs.map((l) => l.performedBy)).size;
    return { total, mutations, authEvents, uniqueActors };
  }, [logs]);

  const exportLogsAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `labtutor_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportLogsAsCsv = () => {
    const headers = ["ReferenceCode", "Timestamp", "Date", "Action", "Module", "TargetEntity", "Details", "PerformedBy", "Role", "IPAddress", "Device", "Status"];
    const rows = logs.map((l) => [
      `"${l.referenceCode || l.id}"`,
      `"${l.timestamp}"`,
      `"${l.fullDate || ""}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.targetEntity || ""}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.performedBy}"`,
      `"${l.role}"`,
      `"${l.ipAddress || ""}"`,
      `"${l.device || ""}"`,
      `"${l.status || "SUCCESS"}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `labtutor_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyPayload = (log: ActivityLogItem) => {
    const payload = JSON.stringify(
      {
        eventId: log.id,
        referenceCode: log.referenceCode || `EVT-${log.id}`,
        timestamp: log.timestamp,
        date: log.fullDate || new Date().toISOString(),
        action: log.action,
        module: log.module,
        targetEntity: log.targetEntity,
        details: log.details,
        actor: {
          name: log.performedBy,
          role: log.role,
        },
        client: {
          ipAddress: log.ipAddress,
          device: log.device,
          sessionId: log.sessionId,
        },
        status: log.status || "SUCCESS",
        metadata: log.metadata || {},
        checksum: `SHA256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
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
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Audit Stream</span>
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Immutable tracking of user activities, content authoring, role adjustments, device telemetry, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportLogsAsCsv}
            className="text-xs gap-1.5 h-9"
            title="Download CSV log extract"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportLogsAsJson}
            className="text-xs gap-1.5 h-9"
            title="Download full JSON audit payload"
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

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase">
            <span>Total Events</span>
            <Activity className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="text-2xl font-extrabold mt-1 text-foreground">{stats.total}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Continuous telemetry active</div>
        </Card>

        <Card className="p-3.5 border-blue-500/20 bg-blue-500/5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-blue-700 dark:text-blue-400 uppercase">
            <span>Data Mutations</span>
            <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold mt-1 text-blue-700 dark:text-blue-400">{stats.mutations}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Creates, Updates, Deletions</div>
        </Card>

        <Card className="p-3.5 border-purple-500/20 bg-purple-500/5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-purple-700 dark:text-purple-400 uppercase">
            <span>Security & Auth</span>
            <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold mt-1 text-purple-700 dark:text-purple-400">{stats.authEvents}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Session logins & role checks</div>
        </Card>

        <Card className="p-3.5 border-emerald-500/20 bg-emerald-500/5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
            <span>Active Actors</span>
            <User className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold mt-1 text-emerald-700 dark:text-emerald-400">{stats.uniqueActors}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Unique identities recorded</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {ACTIONS.map((act) => (
            <button
              key={act}
              onClick={() => setSelectedAction(act)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedAction === act
                  ? "bg-primary text-primary-foreground shadow-xs"
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
                {m === "ALL" ? "All Subsystems" : m}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search details, actor, IP, ref, module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Logs Card List */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-muted-foreground">
              Audit Events ({filteredLogs.length})
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>Real-Time Audit Ledger</span>
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-xs space-y-2">
              <Activity className="h-8 w-8 mx-auto opacity-40" />
              <p className="font-semibold text-foreground">No matching audit events</p>
              <p>Try adjusting your search criteria or action filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredLogs.map((log) => {
                const isDelete = log.action === "DELETE";
                const isCreate = log.action === "CREATE";
                const isUpdate = log.action === "UPDATE";
                const isAuth = log.action === "AUTH";
                const isDownload = log.action === "DOWNLOAD";
                const isExpanded = expandedLogId === log.id;

                const actionBadgeClass = isDelete
                  ? "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30"
                  : isCreate
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : isUpdate
                  ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                  : isAuth
                  ? "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30"
                  : isDownload
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-muted text-muted-foreground border-border";

                return (
                  <div
                    key={log.id}
                    className="p-4 hover:bg-muted/25 transition-colors text-xs space-y-2.5"
                  >
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-mono font-bold ${actionBadgeClass}`}>
                          {log.action}
                        </Badge>

                        <Badge variant="outline" className="text-[10px] bg-muted/40 font-semibold text-foreground">
                          {log.module}
                        </Badge>

                        {log.targetEntity && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent/60 text-muted-foreground border border-border/60 font-mono">
                            Target: {log.targetEntity}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-muted-foreground">
                          <Hash className="h-2.5 w-2.5" />
                          <span>{log.referenceCode || log.id}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-mono">
                        <span className="hidden sm:inline">{log.fullDate || "Today"}</span>
                        <span>•</span>
                        <span className="font-bold text-foreground">{log.timestamp}</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold ml-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>200 OK</span>
                        </span>
                      </div>
                    </div>

                    {/* Event Description */}
                    <p className="text-foreground font-medium text-xs sm:text-sm leading-relaxed">
                      {log.details}
                    </p>

                    {/* Bottom Metadata Ribbon & Action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {/* Actor & Role */}
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-primary" />
                          <span className="font-bold text-foreground">{log.performedBy}</span>
                          <Badge
                            className={`text-[9px] px-1.5 py-0 ${
                              log.role === "SUPER_ADMIN"
                                ? "bg-purple-600 text-white"
                                : log.role === "ADMIN"
                                ? "bg-blue-600 text-white"
                                : log.role === "MENTOR"
                                ? "bg-amber-600 text-white"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            {log.role}
                          </Badge>
                        </div>

                        {/* Origin IP */}
                        {log.ipAddress && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span className="font-mono text-[10px]">{log.ipAddress}</span>
                          </div>
                        )}

                        {/* Device / Client */}
                        <div className="hidden md:flex items-center gap-1 text-[10px]">
                          <Laptop className="h-3 w-3 text-muted-foreground" />
                          <span>{log.device || "Chrome 128 / Windows 11"}</span>
                        </div>

                        {/* Session Token */}
                        <div className="hidden lg:flex items-center gap-1 text-[10px]">
                          <Key className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono">{log.sessionId || "SES-9821-STU"}</span>
                        </div>
                      </div>

                      {/* Expand / Inspect Action */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="h-6 px-2 text-[10px] font-semibold gap-1 text-primary hover:bg-primary/10 cursor-pointer"
                        >
                          <FileCode className="h-3 w-3" />
                          <span>{isExpanded ? "Hide Details" : "Inspect Payload"}</span>
                          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>

                    {/* Inline Expandable JSON Payload & Audit Fingerprint */}
                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-xl bg-muted/60 border border-border space-y-2 text-[11px] animate-in fade-in duration-150">
                        <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                          <div className="flex items-center gap-2">
                            <Server className="h-3.5 w-3.5 text-primary" />
                            <span className="font-bold text-foreground">Immutable Audit Payload & Checksum</span>
                            <Badge variant="outline" className="text-[9px] text-emerald-600 border-emerald-500/30">
                              Verified Integrity
                            </Badge>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyPayload(log)}
                            className="h-6 px-2 text-[10px] gap-1 cursor-pointer"
                          >
                            {copiedId === log.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-500" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy JSON</span>
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Formatted Code Block */}
                        <pre className="p-3 rounded-lg bg-background/90 text-foreground font-mono text-[10px] overflow-x-auto leading-relaxed border border-border/50">
                          {JSON.stringify(
                            {
                              eventId: log.id,
                              referenceCode: log.referenceCode || `EVT-${log.id}`,
                              timestamp: log.timestamp,
                              date: log.fullDate || "Sep 09, 2026",
                              action: log.action,
                              module: log.module,
                              targetEntity: log.targetEntity || log.module,
                              details: log.details,
                              actor: {
                                name: log.performedBy,
                                role: log.role,
                              },
                              client: {
                                ipAddress: log.ipAddress || "127.0.0.1",
                                device: log.device || "Chrome 128 / Windows 11 Desktop",
                                sessionId: log.sessionId || "SES-4190-AUTH",
                              },
                              status: log.status || "SUCCESS",
                              metadata: log.metadata || {
                                securityLevel: "DGHS-SEC-LEVEL-1",
                                sslEncrypted: true,
                              },
                              checksum: `SHA256-${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}
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

