"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Type,
  Search,
  Save,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  FileCode
} from "lucide-react";
import { useStrings, StringItem } from "@/lib/stores/string-store";
import { useAcademic } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";

export default function StringManagementPage() {
  const { strings, updateString, resetStrings } = useStrings();
  const { role } = useAcademic();
  const { logActivity } = useActivityLog();

  const isSuperAdmin = role === "SUPER_ADMIN";

  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingStrings, setEditingStrings] = React.useState<Record<string, string>>({});
  const [savedKey, setSavedKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    const map: Record<string, string> = {};
    strings.forEach((s) => {
      map[s.key] = s.value;
    });
    setEditingStrings(map);
  }, [strings]);

  const stringEntries = React.useMemo(() => {
    return strings.filter((item) => {
      if (!searchQuery.trim()) return true;
      const currentVal = editingStrings[item.key] || item.value;
      return (
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currentVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [strings, editingStrings, searchQuery]);

  const handleSave = (key: string) => {
    if (!isSuperAdmin) return;
    const value = editingStrings[key];
    if (value !== undefined) {
      updateString(key, value);
      logActivity({
        action: "SETTINGS",
        module: "String Management",
        details: `Updated UI text dictionary key "${key}"`,
      });
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center space-y-3">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-xs text-muted-foreground">
          Only the Super Administrator has authority to modify UI text labels, headings, and system messages.
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
              UI String & Dictionary Management
            </h1>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              Super Admin Control
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Modify any interface label, headline, button caption, or instructional banner in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Reset all UI text strings to system defaults?")) {
                resetStrings();
                logActivity({
                  action: "SETTINGS",
                  module: "String Management",
                  details: "Reset UI dictionary to default strings",
                });
              }
            }}
            className="text-xs gap-1.5 h-9"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search string keys or text content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Strings List */}
      <div className="space-y-3">
        {stringEntries.map((item) => {
          const isRecentlySaved = savedKey === item.key;
          const currentVal = editingStrings[item.key] !== undefined ? editingStrings[item.key] : item.value;
          const isMultiline = currentVal.length > 60 || currentVal.includes("\n");
          return (
            <Card key={item.key} className="border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-primary" />
                  <code className="text-xs font-mono font-bold text-foreground">{item.key}</code>
                  <Badge variant="outline" className="text-[10px]">
                    {item.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {isRecentlySaved && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved
                    </span>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleSave(item.key)}
                    className="h-7 text-xs gap-1 bg-primary text-primary-foreground"
                  >
                    <Save className="h-3 w-3" />
                    <span>Save</span>
                  </Button>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground">{item.description}</p>

              {isMultiline ? (
                <textarea
                  rows={2}
                  value={currentVal}
                  onChange={(e) =>
                    setEditingStrings((prev) => ({ ...prev, [item.key]: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background p-2 text-xs leading-relaxed"
                />
              ) : (
                <Input
                  value={currentVal}
                  onChange={(e) =>
                    setEditingStrings((prev) => ({ ...prev, [item.key]: e.target.value }))
                  }
                  className="text-xs h-8"
                />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
