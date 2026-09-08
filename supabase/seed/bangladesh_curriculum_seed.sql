-- =====================================================================
-- Bangladesh Medical Laboratory Technology Curriculum Master Seed
-- Programs: Diploma in Medical Technology (Lab) & B.Sc. Health Tech (Lab)
-- =====================================================================

-- 1. SEED DEGREE PROGRAMS
INSERT INTO public.programs (id, name, code, level, description, is_active)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Diploma in Medical Technology (Laboratory)', 'DMT-LAB', 'DIPLOMA', '4-year annual diploma governed by the State Medical Faculty of Bangladesh.', true),
    ('a0000000-0000-0000-0000-000000000002', 'B.Sc. in Health Technology (Laboratory)', 'BSC-LT', 'BSC', '4-year undergraduate degree program with 8 semester modules.', true)
ON CONFLICT (code) DO NOTHING;

-- 2. SEED CURRICULUM VERSIONS
INSERT INTO public.curriculum_versions (id, program_id, version_code, title, effective_from, is_active)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'DMT-2023-V1', 'State Medical Faculty Diploma Laboratory Syllabus 2023', '2023-01-01', true),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'BSC-LT-2024-V2', 'Undergraduate Health Technology (Laboratory) Curriculum 2024', '2024-01-01', true)
ON CONFLICT (program_id, version_code) DO NOTHING;

-- 3. SEED ACADEMIC YEARS (DIPLOMA: 1st to 4th Year)
INSERT INTO public.academic_years (id, program_id, name, sequence, is_active)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '1st Year', 1, true),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', '2nd Year', 2, true),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', '3rd Year', 3, true),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', '4th Year', 4, true),

    -- B.Sc. Parts (Years 1 to 4)
    ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'Part I (1st Year)', 1, true),
    ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'Part II (2nd Year)', 2, true),
    ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'Part III (3rd Year)', 3, true),
    ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', 'Part IV (4th Year)', 4, true)
ON CONFLICT (program_id, sequence) DO NOTHING;

-- 4. SEED SEMESTERS (FOR B.SC. TRACK)
INSERT INTO public.semesters (id, program_id, academic_year_id, name, sequence, is_active)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', '1st Semester', 1, true),
    ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', '2nd Semester', 2, true),
    ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', '3rd Semester', 3, true),
    ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', '4th Semester', 4, true),
    ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000007', '5th Semester', 5, true),
    ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000007', '6th Semester', 6, true),
    ('d0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000008', '7th Semester', 7, true),
    ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000008', '8th Semester', 8, true)
ON CONFLICT (program_id, sequence) DO NOTHING;

-- 5. SEED CORE SUBJECTS
INSERT INTO public.subjects (id, name, code, description, is_active)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Hematology & Hemostasis', 'HEM-201', 'Blood cytology, automated cell counters, coagulation cascades, and anemia differentials.', true),
    ('e0000000-0000-0000-0000-000000000002', 'Medical Microbiology & Mycology', 'MIC-202', 'Bacterial culture, biochemical identification, antimicrobial susceptibility testing (AST).', true),
    ('e0000000-0000-0000-0000-000000000003', 'Clinical Biochemistry I', 'BIO-203', 'Enzymology, spectrophotometry, carbohydrate metabolism, and serum lipid profiles.', true),
    ('e0000000-0000-0000-0000-000000000004', 'Medical Parasitology', 'PAR-204', 'Protozoal and helminthic infections, stool concentration methods, and malaria smear microscopy.', true)
ON CONFLICT (code) DO NOTHING;
