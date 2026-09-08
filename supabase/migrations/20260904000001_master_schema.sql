-- =====================================================================
-- Medical Laboratory Technology LMS (LabTutor Academy)
-- Master Relational Database Schema & Row Level Security (RLS)
-- Roles: Strictly SUPER_ADMIN, ADMIN, STUDENT
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM & CHECK TYPES
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STUDENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE program_level_enum AS ENUM ('DIPLOMA', 'BSC');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lesson_status_enum AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_type_enum AS ENUM ('PDF', 'VIDEO', 'IMAGE', 'DOCUMENT', 'LINK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE progress_status_enum AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE clinical_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CORE IDENTITY & INSTITUTION TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role_enum NOT NULL DEFAULT 'STUDENT',
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, institution_id)
);

CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    permission_key TEXT NOT NULL, -- e.g. 'students.manage', 'clinical.review'
    scope JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, institution_id, permission_key)
);

-- 4. ACADEMIC STRUCTURE & VERSIONING
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL, -- 'DMT-LAB', 'BSC-LT'
    level program_level_enum NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.curriculum_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    version_code TEXT NOT NULL, -- e.g. 'DMT-2023-V1'
    title TEXT NOT NULL,
    effective_from DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(program_id, version_code)
);

CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- '1st Year', '2nd Year', '3rd Year', '4th Year'
    sequence INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(program_id, sequence)
);

CREATE TABLE IF NOT EXISTS public.semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- '1st Semester' (Nullable for annual Diploma structure)
    sequence INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(program_id, sequence)
);

CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
    curriculum_version_id UUID NOT NULL REFERENCES public.curriculum_versions(id) ON DELETE RESTRICT,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE RESTRICT,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE RESTRICT,
    enrollment_year INT NOT NULL,
    student_id_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.academic_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.programs(id),
    curriculum_version_id UUID NOT NULL REFERENCES public.curriculum_versions(id),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    semester_id UUID REFERENCES public.semesters(id),
    transition_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason TEXT NOT NULL
);

-- 5. CURRICULUM, SUBJECTS & LESSONS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL, -- 'HEM-201', 'MIC-202'
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.curriculum_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curriculum_version_id UUID NOT NULL REFERENCES public.curriculum_versions(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 1,
    UNIQUE(curriculum_version_id, subject_id)
);

CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.learning_objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    objective_text TEXT NOT NULL,
    bloom_level TEXT
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    video_url TEXT,
    duration_minutes INT NOT NULL DEFAULT 15,
    is_free BOOLEAN NOT NULL DEFAULT false,
    status lesson_status_enum NOT NULL DEFAULT 'DRAFT',
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type resource_type_enum NOT NULL,
    file_url TEXT,
    external_url TEXT,
    display_order INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    status progress_status_enum NOT NULL DEFAULT 'NOT_STARTED',
    progress_percent INT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 6. PRACTICAL LABORATORY & IMAGE ATLAS
CREATE TABLE IF NOT EXISTS public.practical_procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    objective TEXT NOT NULL,
    principle TEXT NOT NULL,
    specimen TEXT NOT NULL,
    equipment TEXT NOT NULL,
    reagents TEXT NOT NULL,
    procedure_text TEXT NOT NULL,
    calculations TEXT,
    reference_range TEXT,
    qc_notes TEXT,
    safety_notes TEXT,
    clinical_significance TEXT,
    training_disclaimer TEXT DEFAULT 'Educational training procedure. Follow approved clinical SOPs for hospital testing.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.practical_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procedure_id UUID NOT NULL REFERENCES public.practical_procedures(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    instruction TEXT NOT NULL,
    image_url TEXT,
    warning_note TEXT,
    UNIQUE(procedure_id, step_number)
);

CREATE TABLE IF NOT EXISTS public.image_atlas_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    department TEXT NOT NULL, -- 'HEMATOLOGY', 'MICROBIOLOGY', 'PARASITOLOGY', etc.
    stain_used TEXT NOT NULL,
    magnification TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    diagnostic_pointers TEXT,
    quiz_question TEXT,
    quiz_answer TEXT,
    related_subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CLINICAL TRAINING & LOGBOOK
CREATE TABLE IF NOT EXISTS public.clinical_rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    department TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.clinical_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rotation_id UUID REFERENCES public.clinical_rotations(id) ON DELETE SET NULL,
    test_performed TEXT NOT NULL,
    department TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    specimen_type TEXT NOT NULL,
    instrument_used TEXT NOT NULL,
    role_description TEXT,
    supervisor_name TEXT,
    status clinical_status_enum NOT NULL DEFAULT 'PENDING',
    admin_remarks TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. COMPETENCY TRACKING
CREATE TABLE IF NOT EXISTS public.competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    domain TEXT NOT NULL, -- 'THEORY', 'SPECIMEN', 'INSTRUMENT', 'QC', 'INTERPRETATION', 'REPORTING'
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.student_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'NOT_STARTED', -- 'NOT_STARTED', 'NEEDS_IMPROVEMENT', 'COMPETENT'
    assessed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, competency_id)
);

-- 9. CERTIFICATES, NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_code TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    issuer_institution TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    qr_payload TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN NOT NULL DEFAULT false,
    link_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    before_data JSONB,
    after_data JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practical_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practical_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_atlas_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role_enum AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: Users can see own profile; Admins & Super Admins can see scoped/all
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR current_user_role() IN ('SUPER_ADMIN', 'ADMIN'));

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Super admin unrestricted policies
CREATE POLICY "Super Admin all access profiles" ON public.profiles
    FOR ALL USING (current_user_role() = 'SUPER_ADMIN');

-- Student Profiles
CREATE POLICY "Students read own academic profile" ON public.student_profiles
    FOR SELECT USING (auth.uid() = user_id OR current_user_role() IN ('SUPER_ADMIN', 'ADMIN'));

CREATE POLICY "Students read own academic history" ON public.academic_history
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.student_profiles
        WHERE student_profiles.id = academic_history.student_profile_id
        AND student_profiles.user_id = auth.uid()
    ) OR current_user_role() IN ('SUPER_ADMIN', 'ADMIN'));

-- Public/Student read curriculum data
CREATE POLICY "All authenticated read programs" ON public.programs
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read curriculum versions" ON public.curriculum_versions
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read academic years" ON public.academic_years
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read semesters" ON public.semesters
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read subjects" ON public.subjects
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read curriculum subjects" ON public.curriculum_subjects
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read units" ON public.units
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read topics" ON public.topics
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read published lessons" ON public.lessons
    FOR SELECT USING (status = 'PUBLISHED' OR current_user_role() IN ('SUPER_ADMIN', 'ADMIN'));

CREATE POLICY "All authenticated read practical procedures" ON public.practical_procedures
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read practical steps" ON public.practical_steps
    FOR SELECT USING (true);

CREATE POLICY "All authenticated read atlas items" ON public.image_atlas_items
    FOR SELECT USING (true);

-- Progress: Student strictly owns own progress
CREATE POLICY "Students manage own lesson progress" ON public.lesson_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins read student lesson progress" ON public.lesson_progress
    FOR SELECT USING (current_user_role() IN ('SUPER_ADMIN', 'ADMIN'));

-- Clinical Logs: Students manage own logs; Admins review
CREATE POLICY "Students manage own clinical logs" ON public.clinical_logs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins review clinical logs" ON public.clinical_logs
    FOR ALL USING (current_user_role() IN ('SUPER_ADMIN', 'ADMIN'));

-- Certificates: Public read for verification
CREATE POLICY "Public verify certificates" ON public.certificates
    FOR SELECT USING (true);

-- Notifications: User read own
CREATE POLICY "Users read own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Audit Logs: Super Admin read only
CREATE POLICY "Super Admin read audit logs" ON public.audit_logs
    FOR SELECT USING (current_user_role() = 'SUPER_ADMIN');
