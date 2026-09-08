"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ClipboardList,
  PlusCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  Trash2,
} from "lucide-react";
import { useNotification } from "@/components/ui/notification-context";

interface ClinicalEntry {
  id: string;
  testName: string;
  department: string;
  hospital: string;
  specimen: string;
  instrument: string;
  date: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  remarks?: string;
}

const STORAGE_KEY = "labtutor_clinical_entries_v1";

const initialEntries: ClinicalEntry[] = [
  {
    id: "c1",
    testName: "Automated 5-Part Differential CBC (Mindray BC-6800)",
    department: "Hematology Lab",
    hospital: "Dhaka Medical College Hospital",
    specimen: "EDTA Whole Blood (25 specimens)",
    instrument: "Mindray BC-6800 Analyzer",
    date: "2026-09-02",
    status: "APPROVED",
    remarks: "Good understanding of flag review and background counts.",
  },
  {
    id: "c2",
    testName: "ABO & Rh Blood Grouping (Forward & Reverse)",
    department: "Transfusion Medicine",
    hospital: "Sir Salimullah Medical College Hospital",
    specimen: "Donor Whole Blood (12 donors)",
    instrument: "Centrifuge & Agglutination Viewer",
    date: "2026-09-03",
    status: "APPROVED",
    remarks: "Accurate tube technique verified.",
  },
  {
    id: "c3",
    testName: "Sputum AFB Smear (Ziehl-Neelsen Staining)",
    department: "Microbiology Lab",
    hospital: "National Institute of Diseases of the Chest and Hospital",
    specimen: "Purulent Sputum (6 specimens)",
    instrument: "Binocular Microscope (100x Oil)",
    date: "2026-09-04",
    status: "PENDING",
  },
];

export default function StudentClinicalPage() {
  const [entries, setEntries] = React.useState<ClinicalEntry[]>(initialEntries);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const notify = useNotification();

  // Load from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const persistEntries = (updated: ClinicalEntry[]) => {
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // New entry form state
  const [testName, setTestName] = React.useState("");
  const [department, setDepartment] = React.useState("Hematology Lab");
  const [hospital, setHospital] = React.useState("Dhaka Medical College Hospital");
  const [specimen, setSpecimen] = React.useState("");
  const [instrument, setInstrument] = React.useState("");

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) {
      notify.error("Test Name Required", "Please enter the clinical procedure or test performed.");
      return;
    }

    const newLog: ClinicalEntry = {
      id: `c-${Date.now()}`,
      testName: testName.trim(),
      department,
      hospital,
      specimen: specimen.trim() || "Standard Clinical Specimen",
      instrument: instrument.trim() || "Standard Lab Analyzer",
      date: new Date().toISOString().split("T")[0],
      status: "PENDING",
    };

    const updated = [newLog, ...entries];
    persistEntries(updated);
    notify.success("Procedure Logged", `${testName} added to your clinical logbook.`, true);

    setTestName("");
    setSpecimen("");
    setInstrument("");
    setShowAddForm(false);
  };

  const handleDeleteLog = (id: string, name: string) => {
    const updated = entries.filter((item) => item.id !== id);
    persistEntries(updated);
    notify.info("Entry Removed", `${name} has been removed from your logbook.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Electronic Clinical Logbook
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Record clinical rotation tests, specimens handled, and analyzer operations for supervisor approval.
          </p>
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-primary-foreground font-semibold min-h-[44px] shrink-0"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {showAddForm ? "Cancel Entry" : "Log New Procedure"}
        </Button>
      </div>

      {/* Add New Entry Form Drawer/Card */}
      {showAddForm && (
        <Card className="border-primary/40 shadow-sm animate-in fade-in">
          <CardHeader className="p-4 sm:p-5 pb-2">
            <CardTitle className="text-base sm:text-lg">Add Clinical Log Entry</CardTitle>
            <CardDescription className="text-xs">
              Fill out procedure details performed during your hospital rotation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0">
            <form onSubmit={handleAddLog} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Test / Procedure Performed</label>
                  <Input
                    type="text"
                    placeholder="e.g. Serum Creatinine by Jaffe Method"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Department / Laboratory</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="flex min-h-[44px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Hematology Lab">Hematology Lab</option>
                    <option value="Microbiology Lab">Microbiology Lab</option>
                    <option value="Clinical Biochemistry">Clinical Biochemistry</option>
                    <option value="Transfusion Medicine (Blood Bank)">Transfusion Medicine (Blood Bank)</option>
                    <option value="Histopathology & Cytology">Histopathology & Cytology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Hospital / Diagnostic Center</label>
                  <Input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Specimen Details</label>
                  <Input
                    type="text"
                    placeholder="e.g. Non-hemolyzed Serum (10 samples)"
                    value={specimen}
                    onChange={(e) => setSpecimen(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Analyzer / Equipment Used</label>
                  <Input
                    type="text"
                    placeholder="e.g. Semi-auto Spectrophotometer"
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" className="bg-primary text-primary-foreground min-h-[44px]">
                  Submit for Admin / Supervisor Verification
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Logbook Entries List */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-4 border-border space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm sm:text-base text-foreground">
                    {entry.testName}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Building2 className="h-3.5 w-3.5 mr-1 text-primary" />
                    {entry.hospital}
                  </span>
                  <span>•</span>
                  <span>{entry.department}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {entry.date}
                  </span>
                </div>
              </div>

              {/* Status Badge & Delete Action */}
              <div className="flex items-center space-x-2 shrink-0">
                {entry.status === "APPROVED" && (
                  <Badge variant="success" className="text-xs py-1 px-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Verified by Admin
                  </Badge>
                )}
                {entry.status === "PENDING" && (
                  <Badge variant="secondary" className="text-xs py-1 px-2.5">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Pending Review
                  </Badge>
                )}
                {entry.status === "REJECTED" && (
                  <Badge variant="destructive" className="text-xs py-1 px-2.5">
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Action Required
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteLog(entry.id, entry.testName)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                  aria-label="Delete entry"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground">Specimen: </strong>
                {entry.specimen}
              </div>
              <div>
                <strong className="text-foreground">Equipment: </strong>
                {entry.instrument}
              </div>
            </div>

            {entry.remarks && (
              <div className="mt-2 p-2 rounded-lg bg-secondary/10 text-secondary text-xs font-medium">
                <strong>Supervisor Remarks:</strong> {entry.remarks}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
