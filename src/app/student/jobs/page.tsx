"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useJobs, JobOfferItem } from "@/lib/stores/jobs-store";
import { useAcademic } from "@/lib/curriculum/academic-context";
import { useActivityLog } from "@/lib/stores/activity-log-store";

const ORG_TYPES = [
  "All Types",
  "Hospital",
  "Diagnostic Center",
  "Research Institute",
  "Blood Bank",
  "Corporate Health",
] as const;

export default function StudentJobsPage() {
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const { role, userProfile } = useAcademic();
  const { logActivity } = useActivityLog();

  const canManage = role === "SUPER_ADMIN" || role === "ADMIN" || role === "MENTOR";

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedOrgType, setSelectedOrgType] = React.useState<string>("All Types");
  const [selectedJobType, setSelectedJobType] = React.useState<string>("All");
  const [selectedJob, setSelectedJob] = React.useState<JobOfferItem | null>(null);

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    organization: "",
    organizationType: "Hospital" as JobOfferItem["organizationType"],
    location: "Dhaka, Bangladesh",
    jobType: "Full-Time" as JobOfferItem["jobType"],
    salaryRange: "BDT 30,000 – 40,000 / month",
    experienceLevel: "Entry Level (Fresh Graduates)" as JobOfferItem["experienceLevel"],
    requiredQualifications: "",
    responsibilities: "",
    deadline: "2026-11-30",
    contactEmailOrUrl: "jobs@diagnosticlab.com",
    isActive: true,
  });

  const filteredJobs = React.useMemo(() => {
    return jobs.filter((job) => {
      const matchOrg = selectedOrgType === "All Types" || job.organizationType === selectedOrgType;
      const matchJobType = selectedJobType === "All" || job.jobType === selectedJobType;
      const matchSearch =
        !searchQuery.trim() ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchOrg && matchJobType && matchSearch;
    });
  }, [jobs, selectedOrgType, selectedJobType, searchQuery]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      organization: "",
      organizationType: "Hospital",
      location: "Dhaka, Bangladesh",
      jobType: "Full-Time",
      salaryRange: "BDT 30,000 – 40,000 / month",
      experienceLevel: "Entry Level (Fresh Graduates)",
      requiredQualifications: "Diploma in Medical Laboratory Technology (DMT) or B.Sc.\nValid registration\nHands-on experience with automated analyzers",
      responsibilities: "Perform daily clinical tests and internal quality controls\nMaintain analyzer calibrations and logbooks\nReport critical alerts promptly",
      deadline: "2026-11-30",
      contactEmailOrUrl: "career@hospital.com",
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (job: JobOfferItem) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      organization: job.organization,
      organizationType: job.organizationType,
      location: job.location,
      jobType: job.jobType,
      salaryRange: job.salaryRange,
      experienceLevel: job.experienceLevel,
      requiredQualifications: job.requiredQualifications.join("\n"),
      responsibilities: job.responsibilities.join("\n"),
      deadline: job.deadline,
      contactEmailOrUrl: job.contactEmailOrUrl,
      isActive: job.isActive,
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim()) {
      alert("Please fill in Title and Organization.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      organization: formData.organization.trim(),
      organizationType: formData.organizationType,
      location: formData.location.trim(),
      jobType: formData.jobType,
      salaryRange: formData.salaryRange.trim(),
      experienceLevel: formData.experienceLevel,
      requiredQualifications: formData.requiredQualifications.split("\n").filter(Boolean),
      responsibilities: formData.responsibilities.split("\n").filter(Boolean),
      deadline: formData.deadline.trim(),
      contactEmailOrUrl: formData.contactEmailOrUrl.trim(),
      postedBy: userProfile?.name || role,
      postedRole: role,
      isActive: formData.isActive,
    };

    if (editingId) {
      updateJob(editingId, payload);
      logActivity({
        action: "UPDATE",
        module: "Jobs Board",
        details: `Updated job circular "${payload.title}" at ${payload.organization}`,
      });
    } else {
      addJob(payload);
      logActivity({
        action: "CREATE",
        module: "Jobs Board",
        details: `Published new job circular "${payload.title}" at ${payload.organization}`,
      });
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteJob(id);
      logActivity({
        action: "DELETE",
        module: "Jobs Board",
        details: `Deleted job circular "${title}"`,
      });
      if (selectedJob?.id === id) setSelectedJob(null);
    }
  };

  const handleApply = (job: JobOfferItem) => {
    logActivity({
      action: "DOWNLOAD",
      module: "Jobs Board",
      details: `Clicked apply for "${job.title}" at ${job.organization}`,
    });
    if (job.contactEmailOrUrl.includes("@")) {
      window.location.href = `mailto:${job.contactEmailOrUrl}?subject=Application for ${encodeURIComponent(job.title)}&body=Dear Hiring Team,%0D%0A%0D%0AI am applying for the position of ${encodeURIComponent(job.title)} at ${encodeURIComponent(job.organization)}. Please find my qualifications attached.%0D%0A%0D%0ASincerely,%0D%0A${encodeURIComponent(userProfile?.name || "Applicant")}`;
    } else {
      window.open(job.contactEmailOrUrl.startsWith("http") ? job.contactEmailOrUrl : `https://${job.contactEmailOrUrl}`, "_blank");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Clinical & Laboratory Careers
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              Direct Openings
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Verified hospital, clinical pathology, and diagnostic center career vacancies for medical technology graduates.
          </p>
        </div>

        {canManage && (
          <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Post Job Circular</span>
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {ORG_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedOrgType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedOrgType === type
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground"
          >
            <option value="All">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title, hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground text-xs space-y-2">
          <Briefcase className="h-10 w-10 mx-auto opacity-40 text-muted-foreground" />
          <p className="font-semibold text-foreground text-sm">No Openings Match Your Filters</p>
          <p>Try resetting the organization filter or searching with different keywords.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="border-border hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                      {job.organizationType}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {job.jobType}
                    </Badge>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(job)}
                        className="h-7 w-7 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(job.id, job.title)}
                        className="h-7 w-7 p-0 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <CardTitle className="text-base font-bold leading-snug">
                  {job.title}
                </CardTitle>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    {job.organization}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-medium text-foreground truncate">{job.salaryRange}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">{job.experienceLevel}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Key Responsibilities:
                  </span>
                  <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                    {job.responsibilities.slice(0, 2).map((r, i) => (
                      <li key={i} className="line-clamp-1">{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500" />
                    Deadline: {job.deadline}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedJob(job)}
                      className="text-xs h-8"
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApply(job)}
                      className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground"
                    >
                      <Send className="h-3 w-3" />
                      <span>Apply</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                    {selectedJob.organizationType}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedJob.jobType}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg">{selectedJob.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedJob.organization} • {selectedJob.location}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                <div>
                  <span className="font-semibold text-foreground block">Salary & Compensation:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{selectedJob.salaryRange}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Experience Level:</span>
                  <span>{selectedJob.experienceLevel}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Application Deadline:</span>
                  <span className="text-amber-600 font-medium">{selectedJob.deadline}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Posted By:</span>
                  <span>{selectedJob.postedBy} ({selectedJob.postedRole})</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground mb-2">Required Qualifications & Skills</h4>
                <ul className="space-y-1.5 list-disc list-inside text-muted-foreground leading-relaxed">
                  {selectedJob.requiredQualifications.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground mb-2">Job Responsibilities</h4>
                <ul className="space-y-1.5 list-disc list-inside text-muted-foreground leading-relaxed">
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground block mb-1">Direct Submission Contact:</span>
                Submit your updated CV, SMFB registration credentials, and academic transcripts to:{" "}
                <strong className="text-primary font-mono">{selectedJob.contactEmailOrUrl}</strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
                <Button onClick={() => handleApply(selectedJob)} className="bg-primary text-primary-foreground gap-1.5">
                  <Send className="h-4 w-4" />
                  <span>Send Application</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Job Circular Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base">
                {editingId ? "Edit Job Circular" : "Post New Job Circular"}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Position / Job Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Hematology Technologist"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Organization / Hospital Name *</label>
                  <Input
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Square Hospitals Ltd."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Facility Type</label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => setFormData({ ...formData, organizationType: e.target.value as any })}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                  >
                    <option value="Hospital">Hospital</option>
                    <option value="Diagnostic Center">Diagnostic Center</option>
                    <option value="Research Institute">Research Institute</option>
                    <option value="Blood Bank">Blood Bank</option>
                    <option value="Corporate Health">Corporate Health</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Job Type</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value as any })}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                  >
                    <option value="Entry Level (Fresh Graduates)">Entry Level (Fresh)</option>
                    <option value="1-2 Years Experience">1-2 Years Exp</option>
                    <option value="3+ Years Senior Technologist">3+ Years Senior</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Location (City/Area)</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Salary / Compensation</label>
                  <Input
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Required Qualifications (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.requiredQualifications}
                  onChange={(e) => setFormData({ ...formData, requiredQualifications: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Responsibilities (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Application Deadline</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Application Email or Portal URL</label>
                  <Input
                    value={formData.contactEmailOrUrl}
                    onChange={(e) => setFormData({ ...formData, contactEmailOrUrl: e.target.value })}
                    placeholder="career@hospital.com"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Save Changes" : "Publish Opening"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
