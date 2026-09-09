"use client";

import * as React from "react";
import {
  Users,
  UserPlus,
  Building2,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  Edit2,
  Trash2,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useContributors,
  Contributor,
  ContributorStatus,
} from "@/lib/stores/contributor-store";

interface ContributorsSectionProps {
  isAdmin?: boolean;
}

export function ContributorsSection({ isAdmin: propIsAdmin }: ContributorsSectionProps) {
  const {
    activeContributors,
    pastContributors,
    addContributor,
    updateContributor,
    deleteContributor,
    toggleStatus,
    isLoaded,
  } = useContributors();

  // Dynamic admin detection for public & protected pages
  const [isAdmin, setIsAdmin] = React.useState(propIsAdmin ?? false);

  React.useEffect(() => {
    if (propIsAdmin !== undefined) {
      setIsAdmin(propIsAdmin);
      return;
    }

    const checkRole = () => {
      try {
        const raw =
          localStorage.getItem("labtutor_academic_profile_v3") ||
          localStorage.getItem("labtutor_academic_profile_v2");
        if (raw) {
          const parsed = JSON.parse(raw);
          const role = parsed.role || parsed.baseRole;
          if (role === "SUPER_ADMIN" || role === "ADMIN") {
            setIsAdmin(true);
            return;
          }
        }

        const userRaw = localStorage.getItem("labtutor_current_user_v1");
        if (userRaw) {
          const parsedUser = JSON.parse(userRaw);
          if (parsedUser.role === "SUPER_ADMIN" || parsedUser.role === "ADMIN") {
            setIsAdmin(true);
            return;
          }
        }
      } catch {
        // ignore
      }
      setIsAdmin(false);
    };

    checkRole();
    window.addEventListener("storage", checkRole);
    return () => window.removeEventListener("storage", checkRole);
  }, [propIsAdmin]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingContributor, setEditingContributor] = React.useState<Contributor | null>(null);
  const [deletingContributor, setDeletingContributor] = React.useState<Contributor | null>(null);

  // Form states
  const [formData, setFormData] = React.useState({
    name: "",
    avatarUrl: "",
    institute: "",
    course: "Diploma in Medical Laboratory Technology (DMLT)",
    yearOfContribution: new Date().getFullYear().toString(),
    phone: "",
    email: "",
    status: "ACTIVE" as ContributorStatus,
    role: "",
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string>("");

  const resetForm = () => {
    setFormData({
      name: "",
      avatarUrl: "",
      institute: "",
      course: "Diploma in Medical Laboratory Technology (DMLT)",
      yearOfContribution: new Date().getFullYear().toString(),
      phone: "",
      email: "",
      status: "ACTIVE",
      role: "",
    });
    setPhotoPreview("");
    setFormError(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (c: Contributor) => {
    setFormData({
      name: c.name,
      avatarUrl: c.avatarUrl || "",
      institute: c.institute,
      course: c.course,
      yearOfContribution: c.yearOfContribution,
      phone: c.phone || "",
      email: c.email || "",
      status: c.status,
      role: c.role || "",
    });
    setPhotoPreview(c.avatarUrl || "");
    setFormError(null);
    setEditingContributor(c);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setFormError("Photo size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setFormData((prev) => ({ ...prev, avatarUrl: result }));
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Contributor name is required");
      return;
    }
    if (!formData.institute.trim()) {
      setFormError("Institute name is required");
      return;
    }
    if (!formData.course.trim()) {
      setFormError("Course name is required");
      return;
    }

    if (editingContributor) {
      const res = updateContributor(editingContributor.id, {
        name: formData.name.trim(),
        avatarUrl: formData.avatarUrl,
        institute: formData.institute.trim(),
        course: formData.course.trim(),
        yearOfContribution: formData.yearOfContribution.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        status: formData.status,
        role: formData.role.trim(),
      });
      if (!res.success) {
        setFormError(res.error || "Failed to update contributor");
        return;
      }
      setEditingContributor(null);
    } else {
      const res = addContributor({
        name: formData.name.trim(),
        avatarUrl: formData.avatarUrl,
        institute: formData.institute.trim(),
        course: formData.course.trim(),
        yearOfContribution: formData.yearOfContribution.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        status: formData.status,
        role: formData.role.trim(),
      });
      if (!res.success) {
        setFormError(res.error || "Failed to add contributor");
        return;
      }
      setIsAddModalOpen(false);
    }

    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (deletingContributor) {
      deleteContributor(deletingContributor.id);
      setDeletingContributor(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading contributors...
      </div>
    );
  }

  return (
    <div className="space-y-10 pt-4">
      {/* Top Header & Admin Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Contributors &amp; Academic Panel
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Dedicated laboratory professionals, student researchers, and faculty members enriching LabTutor Academy.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenAddModal}
              size="sm"
              className="rounded-xl h-9 sm:h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-xs gap-1.5 transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Contributor</span>
            </Button>
          </div>
        )}
      </div>

      {/* 1. CURRENT CONTRIBUTORS SECTION */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Current Contributors
            </h3>
            <Badge
              variant="outline"
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            >
              {activeContributors.length} Active
            </Badge>
          </div>
        </div>

        {activeContributors.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-border/80 p-8 text-center bg-muted/10">
            <Users className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              No current contributors listed at the moment.
            </p>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAddModal}
                className="mt-3 rounded-xl gap-1.5 text-xs"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Add First Contributor
              </Button>
            )}
          </Card>
        ) : (
          /* Archive 3-row responsive grid (3 columns) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {activeContributors.map((contributor) => (
              <ContributorCard
                key={contributor.id}
                contributor={contributor}
                isAdmin={isAdmin}
                onEdit={() => handleOpenEditModal(contributor)}
                onDelete={() => setDeletingContributor(contributor)}
                onToggleStatus={() => toggleStatus(contributor.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. PAST CONTRIBUTORS SECTION */}
      <div className="space-y-5 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Past Contributors &amp; Alumni
            </h3>
            <Badge
              variant="outline"
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full border-muted-foreground/30 bg-muted/40 text-muted-foreground"
            >
              {pastContributors.length} Archived
            </Badge>
          </div>
        </div>

        {pastContributors.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-border/80 p-8 text-center bg-muted/10">
            <Users className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              No past contributors recorded.
            </p>
          </Card>
        ) : (
          /* Archive 3-row responsive grid (3 columns) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {pastContributors.map((contributor) => (
              <ContributorCard
                key={contributor.id}
                contributor={contributor}
                isAdmin={isAdmin}
                onEdit={() => handleOpenEditModal(contributor)}
                onDelete={() => setDeletingContributor(contributor)}
                onToggleStatus={() => toggleStatus(contributor.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ADD / EDIT CONTRIBUTOR MODAL */}
      {(isAddModalOpen || editingContributor) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl shadow-xl w-full max-w-lg overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border/80">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-primary/10 text-primary">
                  {editingContributor ? <Edit2 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {editingContributor ? "Edit Contributor" : "Add New Contributor"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Provide credentials, institute affiliation, and contact details.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingContributor(null);
                  resetForm();
                }}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Profile Photo (Circular with Light Border) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {/* Photo Preview: Circular with Light Border */}
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-border/80 p-0.5 bg-muted/40 shadow-xs shrink-0 flex items-center justify-center">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 hover:bg-muted/50 text-xs font-medium transition-colors">
                        <Upload className="h-3.5 w-3.5 text-primary" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="sr-only"
                        />
                      </label>
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview("");
                            setFormData((prev) => ({ ...prev, avatarUrl: "" }));
                          }}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <Input
                      type="text"
                      placeholder="Or paste photo URL (https://...)"
                      value={formData.avatarUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({ ...prev, avatarUrl: val }));
                        setPhotoPreview(val);
                      }}
                      className="h-8 text-xs rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Dr. Sabrina Parvin / Md. Arif Hossain"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>

              {/* Institute */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Institute <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Dhaka Institute of Health Technology (DIHT)"
                  value={formData.institute}
                  onChange={(e) => setFormData((prev) => ({ ...prev, institute: e.target.value }))}
                  required
                  className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                />
                {/* Institute Quick Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    "DIHT, Dhaka",
                    "IHT, Rajshahi",
                    "IHT, Chittagong",
                    "IHT, Sylhet",
                    "IHT, Rangpur",
                    "SSMC, Dhaka",
                  ].map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, institute: inst }))}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                    >
                      + {inst}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course & Year of Contribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Course <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Diploma in DMLT"
                    value={formData.course}
                    onChange={(e) => setFormData((prev) => ({ ...prev, course: e.target.value }))}
                    required
                    className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Year of Contribution
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 2025 - Present or 2024"
                    value={formData.yearOfContribution}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, yearOfContribution: e.target.value }))
                    }
                    className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Contact Info: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="e.g. 017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Status Toggle: Active vs Past */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Contribution Status
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: "ACTIVE" }))}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      formData.status === "ACTIVE"
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        formData.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                      }`}
                    />
                    <span>Active Contributor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: "PAST" }))}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      formData.status === "PAST"
                        ? "bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 shadow-2xs"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Past Contributor</span>
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Active contributors display in Current Contributors; inactive or alumni display in Past Contributors.
                </p>
              </div>

              {/* Role / Focus (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Contribution Area / Role (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Clinical Hematology SOP Contributor"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingContributor(null);
                    resetForm();
                  }}
                  className="rounded-xl text-xs sm:text-sm h-9 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl text-xs sm:text-sm h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                >
                  {editingContributor ? "Save Changes" : "Add Contributor"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingContributor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl shadow-xl w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Delete Contributor?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Are you sure you want to remove <strong>{deletingContributor.name}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeletingContributor(null)}
                className="rounded-xl text-xs h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeleteConfirm}
                className="rounded-xl text-xs h-9 px-4 font-medium"
              >
                Yes, Delete Contributor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ContributorCardProps {
  contributor: Contributor;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

function ContributorCard({
  contributor,
  isAdmin,
  onEdit,
  onDelete,
  onToggleStatus,
}: ContributorCardProps) {
  const isCurrent = contributor.status === "ACTIVE";

  return (
    <Card className="rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden bg-card group relative">
      <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center space-y-3.5 flex-1">
        {/* Admin Quick Action Controls (Top-Right) */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={onToggleStatus}
              title={`Switch to ${isCurrent ? "Past Contributor" : "Active Contributor"}`}
              className="p-1.5 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onEdit}
              title="Edit Contributor"
              className="p-1.5 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              title="Delete Contributor"
              className="p-1.5 rounded-lg bg-muted/60 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* 1. Profile Photo (Circular with light border) */}
        <div className="relative">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-border/80 p-0.5 bg-muted/20 shadow-xs ring-2 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
            {contributor.avatarUrl ? (
              <img
                src={contributor.avatarUrl}
                alt={contributor.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center font-bold text-xl text-primary">
                {contributor.name
                  .split(" ")
                  .map((w) => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          {/* Status Indicator Icon Badge */}
          <div
            className={`absolute bottom-0 right-0 p-1 rounded-full text-white shadow-xs ring-2 ring-card ${
              isCurrent ? "bg-emerald-600" : "bg-muted-foreground"
            }`}
            title={isCurrent ? "Active Contributor" : "Past Contributor"}
          >
            {isCurrent ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Clock className="h-3.5 w-3.5" />
            )}
          </div>
        </div>

        {/* 2. Name & Role */}
        <div className="space-y-1 w-full">
          <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight line-clamp-1">
            {contributor.name}
          </h4>
          {contributor.role && (
            <p className="text-xs text-primary font-medium line-clamp-1">
              {contributor.role}
            </p>
          )}
        </div>

        {/* 3. Institute */}
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-[13px] text-muted-foreground w-full">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
          <span className="truncate">{contributor.institute}</span>
        </div>

        {/* 4. Course & Year of Contribution */}
        <div className="space-y-1.5 w-full pt-1">
          <div className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 max-w-full truncate">
            <GraduationCap className="h-3 w-3 shrink-0" />
            <span className="truncate">{contributor.course}</span>
          </div>

          <div className="flex items-center justify-center gap-1 text-[11.5px] text-muted-foreground font-mono">
            <Calendar className="h-3 w-3 shrink-0 opacity-70" />
            <span>{contributor.yearOfContribution}</span>
          </div>
        </div>

        {/* 5. Contact Info (Phone & Email) */}
        {(contributor.phone || contributor.email) && (
          <div className="pt-2 w-full border-t border-border/60 flex items-center justify-center gap-2">
            {contributor.phone && (
              <a
                href={`tel:${contributor.phone}`}
                title={`Call ${contributor.phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-muted/50 hover:bg-muted text-foreground border border-border/60 transition-colors"
              >
                <Phone className="h-3 w-3 text-primary shrink-0" />
                <span className="text-[11.5px] font-mono">{contributor.phone}</span>
              </a>
            )}

            {contributor.email && (
              <a
                href={`mailto:${contributor.email}`}
                title={`Email ${contributor.email}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-muted/50 hover:bg-muted text-foreground border border-border/60 transition-colors"
              >
                <Mail className="h-3 w-3 text-primary shrink-0" />
                <span className="text-[11.5px] truncate max-w-[130px]">
                  {contributor.email}
                </span>
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
