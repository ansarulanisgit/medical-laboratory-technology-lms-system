"use client";

import * as React from "react";
import {
  Users,
  UserPlus,
  Building2,
  GraduationCap,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  X,
  Upload,
  Image as ImageIcon,
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
  DEFAULT_CONTRIBUTOR_AVATAR,
} from "@/lib/stores/contributor-store";

interface ContributorsSectionProps {
  isAdmin?: boolean;
}

function formatFacebookUrl(urlOrUser?: string): string | null {
  if (!urlOrUser?.trim()) return null;
  const val = urlOrUser.trim();
  if (val.startsWith("http://") || val.startsWith("https://")) return val;
  if (val.startsWith("facebook.com/")) return `https://${val}`;
  return `https://www.facebook.com/${val.replace(/^@/, "")}`;
}

function formatWhatsappUrl(numOrUrl?: string): string | null {
  if (!numOrUrl?.trim()) return null;
  const val = numOrUrl.trim();
  if (val.startsWith("http://") || val.startsWith("https://")) return val;
  const digits = val.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("01")) return `https://wa.me/88${digits}`;
  if (digits.startsWith("8801")) return `https://wa.me/${digits}`;
  return `https://wa.me/${digits}`;
}

export function DefaultUserAvatar({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={`rounded-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-label="Default user avatar"
    >
      <defs>
        <clipPath id="defaultUserAvatarClip">
          <circle cx="128" cy="128" r="128" />
        </clipPath>
        <linearGradient id="userAvatarBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="userAvatarFigure" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <radialGradient id="userAvatarChinShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#334155" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g clipPath="url(#defaultUserAvatarClip)">
        <rect width="256" height="256" fill="url(#userAvatarBg)" />
        {/* Torso / Shoulders */}
        <path
          d="M42 246 C42 186 82 164 128 164 C174 164 214 186 214 246 C214 256 204 256 190 256 L66 256 C52 256 42 256 42 246 Z"
          fill="url(#userAvatarFigure)"
        />
        {/* Neck / Chin Shadow */}
        <ellipse cx="128" cy="150" rx="24" ry="8" fill="url(#userAvatarChinShadow)" />
        {/* Head */}
        <circle cx="128" cy="98" r="46" fill="url(#userAvatarFigure)" />
      </g>
      <circle cx="128" cy="128" r="126" stroke="#CBD5E1" strokeWidth="2.5" />
    </svg>
  );
}

function ContributorAvatar({
  src,
  alt,
  className = "h-full w-full rounded-full object-cover",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = React.useState(false);
  const trimmedSrc = src?.trim();

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  // If no source is provided, or image has error, show the clean inline SVG immediately
  if (!trimmedSrc || hasError) {
    return <DefaultUserAvatar className={className} />;
  }

  return (
    <img
      src={trimmedSrc}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
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

  // Close modals on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isAddModalOpen || editingContributor) {
          setIsAddModalOpen(false);
          setEditingContributor(null);
        }
        if (deletingContributor) {
          setDeletingContributor(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAddModalOpen, editingContributor, deletingContributor]);

  // Form states
  const [formData, setFormData] = React.useState({
    name: "",
    avatarUrl: "",
    institute: "",
    course: "Diploma in Medical Laboratory Technology (DMLT)",
    yearOfContribution: new Date().getFullYear().toString(),
    whatsapp: "",
    facebook: "",
    status: "ACTIVE" as ContributorStatus,
    role: "",
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      avatarUrl: "",
      institute: "",
      course: "Diploma in Medical Laboratory Technology (DMLT)",
      yearOfContribution: new Date().getFullYear().toString(),
      whatsapp: "",
      facebook: "",
      status: "ACTIVE",
      role: "",
    });
    setPhotoPreview("");
    setFormError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      whatsapp: c.whatsapp || c.phone || "",
      facebook: c.facebook || "",
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

    if (file.size > 2 * 1024 * 1024) {
      setFormError("Photo file size exceeds 2MB limit. Please upload an image under 2MB.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormError("Please upload a valid image file (JPG, PNG, or WebP).");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        whatsapp: formData.whatsapp.trim(),
        facebook: formData.facebook.trim(),
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
        whatsapp: formData.whatsapp.trim(),
        facebook: formData.facebook.trim(),
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

      {/* ADD / EDIT CONTRIBUTOR MODAL (Spacious, Wide & Modern) */}
      {(isAddModalOpen || editingContributor) && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false);
              setEditingContributor(null);
              resetForm();
            }
          }}
        >
          <div
            className="relative w-full max-w-3xl lg:max-w-4xl my-auto bg-card border border-border/80 rounded-2xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header (Sticky Top) */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border/80 bg-card">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  {editingContributor ? <Edit2 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    {editingContributor ? "Edit Contributor Profile" : "Add New Contributor"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {editingContributor
                      ? "Update contributor profile photo, institute affiliation, and social contact links."
                      : "Add dedicated laboratory professionals, student researchers, and academic faculty."}
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
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable with Comfortable Spacing & Guaranteed No Clipping) */}
            <form
              onSubmit={handleSubmit}
              id="contributor-form"
              className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-6 overscroll-contain"
            >
              {formError && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-destructive/10 border border-destructive/25 text-destructive text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{formError}</span>
                </div>
              )}

              {/* 1. Profile Photo (File Upload Only - Max 2MB) */}
              <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Profile Photo (Max Size: 2MB)</span>
                  </label>
                  {photoPreview ? (
                    <Badge
                      variant="outline"
                      className="text-[11px] border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 gap-1 font-semibold"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Custom Photo
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[11px] border-border bg-muted/60 text-muted-foreground gap-1 font-medium"
                    >
                      Default Avatar Active
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                  {/* Circular Preview with Light Border */}
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-border p-0.5 bg-background shadow-xs ring-4 ring-primary/10 shrink-0 flex items-center justify-center">
                    <ContributorAvatar
                      src={photoPreview}
                      alt="Preview"
                    />
                  </div>

                  {/* Upload Actions & Instructions */}
                  <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm font-semibold shadow-xs transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>{photoPreview ? "Change Photo File" : "Choose Photo File"}</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handlePhotoUpload}
                          className="sr-only"
                        />
                      </label>

                      {photoPreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemovePhoto}
                          className="h-10 px-3.5 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Remove Photo
                        </Button>
                      )}
                    </div>
                    <p className="text-[11.5px] text-muted-foreground">
                      Upload from your device (JPG, PNG, or WebP). Maximum file size: <strong>2MB</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Row: Full Name & Contribution Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-foreground flex items-center gap-1">
                    <span>Full Name</span>
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Dr. Sabrina Parvin / Md. Arif Hossain"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="rounded-xl h-11 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-foreground flex items-center justify-between">
                    <span>Contribution Area / Specialty</span>
                    <span className="text-[11px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Clinical Hematology SOP Contributor"
                    value={formData.role}
                    onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                    className="rounded-xl h-11 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* 3. Row: Institute & Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-foreground flex items-center gap-1">
                    <span>Institute / College</span>
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Dhaka Institute of Health Technology (DIHT)"
                    value={formData.institute}
                    onChange={(e) => setFormData((prev) => ({ ...prev, institute: e.target.value }))}
                    required
                    className="rounded-xl h-11 text-xs sm:text-sm"
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
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors border border-border/50"
                      >
                        + {inst}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-foreground flex items-center gap-1">
                    <span>Course / Program</span>
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Diploma in Medical Laboratory Technology (DMLT)"
                    value={formData.course}
                    onChange={(e) => setFormData((prev) => ({ ...prev, course: e.target.value }))}
                    required
                    className="rounded-xl h-11 text-xs sm:text-sm"
                  />
                  {/* Course Quick Suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      "Diploma in Medical Laboratory Technology (DMLT)",
                      "B.Sc. in Health Technology (Laboratory)",
                      "Faculty / Subject Specialist",
                    ].map((crs) => (
                      <button
                        key={crs}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, course: crs }))}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors border border-border/50"
                      >
                        + {crs.includes("(") ? crs.split("(")[1].replace(")", "") : crs}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Row: Year of Contribution & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-foreground flex items-center gap-1">
                    <span>Year of Contribution</span>
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 2025 - Present or 2026"
                    value={formData.yearOfContribution}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, yearOfContribution: e.target.value }))
                    }
                    required
                    className="rounded-xl h-11 text-xs sm:text-sm"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["2026 - Present", "2025 - Present", "2025", "2024 - 2025"].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, yearOfContribution: yr }))}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors border border-border/50"
                      >
                        + {yr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-foreground block">
                    Contribution Status
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, status: "ACTIVE" }))}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                        formData.status === "ACTIVE"
                          ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                          : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Active Contributor</span>
                      </div>
                      <span className="text-[10.5px] opacity-75 mt-0.5 font-normal">
                        Shows in Current section
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, status: "PAST" }))}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                        formData.status === "PAST"
                          ? "bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20 shadow-xs"
                          : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className="h-3 w-3" />
                        <span>Past / Alumni</span>
                      </div>
                      <span className="text-[10.5px] opacity-75 mt-0.5 font-normal">
                        Shows in Archive section
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Row: WhatsApp & Facebook Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#25D366] text-white">
                      <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                    </span>
                    <span className="text-[#25D366] font-bold">WhatsApp</span>
                    <span className="text-muted-foreground font-normal text-xs">(Number or Link)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 017XXXXXXXX or https://wa.me/..."
                    value={formData.whatsapp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                    className="rounded-xl h-11 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#1877F2] text-white">
                      <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </span>
                    <span className="text-[#1877F2] font-bold">Facebook</span>
                    <span className="text-muted-foreground font-normal text-xs">(Profile Link)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. https://facebook.com/username"
                    value={formData.facebook}
                    onChange={(e) => setFormData((prev) => ({ ...prev, facebook: e.target.value }))}
                    className="rounded-xl h-11 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer (Sticky Bottom) */}
            <div className="shrink-0 px-6 py-4 sm:py-5 border-t border-border/80 flex items-center justify-between gap-3 bg-muted/20">
              <p className="text-[11.5px] text-muted-foreground hidden sm:block">
                <span className="text-destructive font-bold">*</span> Mandatory fields
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingContributor(null);
                    resetForm();
                  }}
                  className="rounded-xl text-xs sm:text-sm h-10 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="contributor-form"
                  size="sm"
                  className="rounded-xl text-xs sm:text-sm h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-xs"
                >
                  {editingContributor ? "Save Changes" : "Add Contributor"}
                </Button>
              </div>
            </div>
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
  const facebookUrl = formatFacebookUrl(contributor.facebook);
  const whatsappUrl = formatWhatsappUrl(contributor.whatsapp || contributor.phone);

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
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-border/80 p-0.5 bg-muted/20 shadow-xs ring-2 ring-primary/10 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
            <ContributorAvatar
              src={contributor.avatarUrl}
              alt={contributor.name}
            />
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

        {/* 5. Contact Info: Facebook & WhatsApp Styled Exactly Like Developer */}
        {(facebookUrl || whatsappUrl) && (
          <div className="pt-3 w-full border-t border-border/60 flex flex-wrap items-center justify-center gap-2.5">
            {/* Facebook Button */}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border border-[#1877F2]/30 transition-all shadow-2xs group"
              >
                <svg
                  className="h-3.5 w-3.5 fill-current group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
                <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
              </a>
            )}

            {/* WhatsApp Button */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 transition-all shadow-2xs group"
              >
                <svg
                  className="h-3.5 w-3.5 fill-current group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
                <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
