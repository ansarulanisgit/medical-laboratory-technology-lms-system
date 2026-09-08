"use client";

import { DIPLOMA_STUDY_CENTER_DATA } from "./diploma-curriculum-data";

export interface LessonAttachment {
  id: string;
  name: string;
  fileType: string;
  fileSize?: string;
  url: string;
}

export interface LessonImage {
  id: string;
  title: string;
  caption?: string;
  url: string;
}

export interface LessonVideo {
  id: string;
  title: string;
  duration?: string;
  url: string;
  description?: string;
}

export interface LessonQA {
  id: string;
  question: string;
  answer: string;
  askedBy?: string;
  category?: string;
}

export type QuizQuestionType = "mcq" | "multi_select" | "true_false" | "short_answer" | "case_scenario";

export interface LessonQuiz {
  id?: string;
  type?: QuizQuestionType;
  scenario?: string;
  question: string;
  options: string[];
  correctIndex: number;
  correctIndices?: number[];
  correctText?: string;
  explanation: string;
}

export interface LessonVivaQA {
  question: string;
  answer: string;
  frequentlyAskedIn?: string;
}

export interface LessonPreviousQuestion {
  year: string;
  exam: string;
  questionText: string;
  modelAnswer: string;
  marks: number;
}

export interface LessonContent {
  id: string;
  title: string;
  duration: string;
  lectureText?: string;
  notes: string[];
  benchAlert?: string;
  attachments?: LessonAttachment[];
  images?: LessonImage[];
  videos?: LessonVideo[];
  qas?: LessonQA[];
  quizzes: LessonQuiz[];
  vivaQAs: LessonVivaQA[];
  previousQuestions: LessonPreviousQuestion[];
}

export type Component = SubModule;

export interface SubModule {
  id: string;
  title: string;
  lessons: LessonContent[];
}

export interface Module {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  learningOutcomes?: string[];
  subModules: SubModule[];
}

export interface StudySubjectInfo {
  code: string;
  name: string;
  program: "DIPLOMA" | "BSC";
  year: string;
  semester?: string;
  description: string;
}

const STUDY_CENTER_STORAGE_KEY = "labtutor_study_center_data_v4";

// Default Bangladesh MLT Course Modules
export const INITIAL_STUDY_CENTER_DATA: Record<string, Module[]> = {
  ...(DIPLOMA_STUDY_CENTER_DATA as unknown as Record<string, Module[]>),
  "ANAT-101": [
    {
      id: "anat-mod-1",
      unitNumber: 1,
      title: "Module 1: Human Cell Biology, Epithelial & Connective Histology",
      description: "Cellular organelles, membrane transport, histology of primary tissues for biopsy preparation.",
      subModules: [
        {
          id: "anat-sub-1",
          title: "Component 1.1: Eukaryotic Cell Structure & Osmotic Dynamics",
          lessons: [
            {
              id: "anat-les-1",
              title: "Cellular Architecture, Organelles & Membrane Permeability",
              duration: "25 min",
              lectureText: `## Core Lecture Overview: Cellular Anatomy in Diagnostic Laboratory Practice\n\nThe human eukaryotic cell is fundamentally partitioned by semipermeable phospholipid bilayers into functionally distinct subcellular microenvironments. In medical diagnostic pathology, understanding organelle physiology is crucial because cellular injury immediately manifests as biochemical and morphological alterations detectable in clinical assays.\n\n### 1. Membrane Architecture and Transport Kinetics\nThe plasma membrane follows the Singer-Nicolson Fluid Mosaic model. The hydrophobic lipid core restricts passive diffusion of polar solutes, maintaining steep electrochemical gradients via the ATP-dependent Na+/K+ pump. When cell integrity is disrupted through ischemic hypoxia or toxic insult, this pump fails, leading to sodium influx, hydropic cell swelling, and early cloudy degeneration visible under light microscopy.\n\n### 2. Organelles of Clinical Diagnostic Value\n* **Mitochondria:** Sites of oxidative phosphorylation and circular maternally-inherited mtDNA. Critical for forensic analysis and mitochondrial myopathy investigations.\n* **Rough Endoplasmic Reticulum & Golgi Apparatus:** Coordinate post-translational glycosylation and packaging of diagnostic plasma proteins (e.g. Albumin, Immunoglobulins, Clotting factors).\n* **Lysosomes:** Contain ~50 acid hydrolases (pH ~4.8). Primary inherited deficiencies manifest as Lysosomal Storage Diseases (Gaucher's, Tay-Sachs) with distinctive histiocyte inclusions in bone marrow aspirates.`,
              notes: [
                "Eukaryotic cells are partitioned into specialized membrane-bound organelles. The plasma membrane consists of an amphipathic phospholipid bilayer with embedded integral transport proteins.",
                "Mitochondria generate ATP via oxidative phosphorylation and possess maternal circular mitochondrial DNA (mtDNA), crucial in forensic and genetic diagnostics.",
                "The endoplasmic reticulum (rough ER for protein synthesis, smooth ER for lipid synthesis and drug detoxification) coordinates directly with the Golgi apparatus for post-translational modification.",
                "Clinical Correlation: Lysosomal enzyme deficiencies lead to accumulation disorders (e.g. Gaucher disease, Tay-Sachs), identifiable in laboratory bone marrow and enzymatic assays."
              ],
              benchAlert: "Never use hypotonic saline when washing red cells for osmotic fragility testing; isotonic 0.85% NaCl preserves cellular integrity.",
              images: [
                {
                  id: "anat-img-1",
                  title: "Eukaryotic Cell Ultrastructure & Organelles",
                  caption: "High-resolution diagram illustrating plasma membrane phospholipid bilayer, rough ER, and mitochondria.",
                  url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"
                },
                {
                  id: "anat-img-2",
                  title: "Erythrocyte Osmotic Dynamics",
                  caption: "Morphological behavior of erythrocytes in hypotonic (hemolysis), isotonic (biconcave), and hypertonic (crenation) media.",
                  url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80"
                }
              ],
              videos: [
                {
                  id: "anat-vid-1",
                  title: "Cell Membrane Transport & Osmotic Fragility Demonstration",
                  duration: "12 min",
                  url: "https://www.youtube.com/embed/fR3NxCR9z2U",
                  description: "Standard laboratory procedure explaining fluid movement across cell membranes and erythrocyte fragility testing."
                }
              ],
              attachments: [
                {
                  id: "anat-att-1",
                  name: "SOP-ANAT-01: Erythrocyte Osmotic Fragility Standard Protocol.pdf",
                  fileType: "PDF",
                  fileSize: "1.4 MB",
                  url: "#"
                },
                {
                  id: "anat-att-2",
                  name: "Cell_Histology_Reference_Atlas_SMFB.pdf",
                  fileType: "PDF",
                  fileSize: "3.2 MB",
                  url: "#"
                }
              ],
              qas: [
                {
                  id: "anat-qa-1",
                  question: "Why do red blood cells lyse at higher NaCl concentrations in hereditary spherocytosis?",
                  answer: "In hereditary spherocytosis, a defect in membrane proteins (spectrin/ankyrin) reduces cell surface area relative to intracellular volume. As a result, the spherocyte cannot tolerate influx of water and ruptures prematurely at higher saline concentrations (e.g. 0.50% NaCl) than normal biconcave discs.",
                  askedBy: "Trainee Question",
                  category: "Pathophysiology"
                }
              ],
              quizzes: [
                {
                  question: "Which organelle is responsible for post-translational packaging and sorting of secretory enzymes?",
                  options: ["Rough Endoplasmic Reticulum", "Golgi Complex", "Peroxisome", "Nucleolus"],
                  correctIndex: 1,
                  explanation: "The Golgi apparatus accepts vesicles from the rough ER, glycosylates proteins, and targets them to lysosomes or secretes them via exocytosis."
                },
                {
                  question: "In osmotic fragility assays, red cells placed in a 0.3% NaCl solution will undergo:",
                  options: ["Crenation", "No morphological change", "Hemolysis due to water influx", "Agglutination"],
                  correctIndex: 2,
                  explanation: "0.3% NaCl is markedly hypotonic relative to intracellular osmolarity (~0.85-0.9%), causing rapid water influx and osmotic lysis."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the clinical and diagnostic significance of the phospholipid bilayer in laboratory medicine?",
                  answer: "The phospholipid bilayer acts as a semipermeable barrier maintaining ion gradients (Na+/K+ ATPase). In pathology, damage to membrane phospholipids by lipid peroxidation releases intracellular enzymes (AST, ALT, Troponin, LDH) into the circulation, serving as definitive biomarkers of cell necrosis.",
                  frequentlyAskedIn: "SMFB Annual Board Viva 2021, 2023"
                },
                {
                  question: "Differentiate between apoptosis and necrosis under microscopy.",
                  answer: "Apoptosis is programmed cell death characterized by cell shrinkage, intact membrane, pyknosis, and absence of inflammation. Necrosis is pathological lysis with cell swelling, membrane disruption, karyolysis, and marked neutrophilic inflammation.",
                  frequentlyAskedIn: "Dhaka University Allied Health Viva 2022"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "State Medical Faculty 1st Year Annual Examination",
                  questionText: "Describe the structure of a typical animal cell with a neat labeled diagram. Enumerate the functions of mitochondria and lysosomes.",
                  modelAnswer: "Cell consists of plasma membrane, cytoplasm, and nucleus. Diagram must show double nuclear membrane, chromatin, ER, Golgi, and mitochondria. Mitochondria: ATP synthesis, citric acid cycle, beta-oxidation. Lysosomes: Autophagy, phagocytosis of engulfed bacteria, degradation of cellular debris.",
                  marks: 10
                },
                {
                  year: "2021",
                  exam: "State Medical Faculty Supplementary Board",
                  questionText: "Write short notes on: (a) Active transport across cell membrane, (b) Lysosomal storage diseases.",
                  modelAnswer: "Active transport requires carrier proteins and direct/indirect ATP hydrolysis against concentration gradients (e.g. Na+-K+ pump). Lysosomal diseases result from inborn metabolic errors in acid hydrolases.",
                  marks: 5
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export function getStoredStudyData(): Record<string, Module[]> {
  if (typeof window === "undefined") return INITIAL_STUDY_CENTER_DATA;
  try {
    const saved = localStorage.getItem(STUDY_CENTER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        const result = { ...INITIAL_STUDY_CENTER_DATA, ...parsed };
        if (!result["ENG-101"] || result["ENG-101"].length < 4) {
          result["ENG-101"] = INITIAL_STUDY_CENTER_DATA["ENG-101"];
        }
        return result;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_STUDY_CENTER_DATA;
}

export function saveStoredStudyData(data: Record<string, Module[]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STUDY_CENTER_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function deleteStoredStudySubject(code: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredStudyData();
    delete current[code];
    localStorage.setItem(STUDY_CENTER_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

export function generateCourseModulesFromCurriculum(
  code: string,
  name: string = "Medical Laboratory Course",
  program: "DIPLOMA" | "BSC" = "DIPLOMA",
  year: string = "1"
): Module[] {
  const stageDesc = `Year ${year}`;
  const accreditationBody =
    program === "BSC"
      ? "Faculty of Allied Health Sciences, University Curriculum"
      : "State Medical Faculty of Bangladesh";

  return [
    {
      id: `${code.toLowerCase()}-mod-1`,
      unitNumber: 1,
      title: `Topic 1: Foundations, Principles & Specimen Governance of ${name}`,
      description: `Fundamental theoretical concepts, specimen reception guidelines, and biosafety protocols for ${name} (${stageDesc}).`,
      subModules: [
        {
          id: `${code.toLowerCase()}-sub-1-1`,
          title: `Component 1.1: Core Methodological Principles & Bench Setup`,
          lessons: [
            {
              id: `${code.toLowerCase()}-les-1-1`,
              title: `Lesson 1: Introduction to ${name} & Diagnostic Workflow`,
              duration: "30 min",
              lectureText: `## Comprehensive Syllabus Lecture: ${name}\n\nThis foundational lecture establishes standard operating principles, pre-analytical sample requirements, and core diagnostic workflows according to the official ${accreditationBody} syllabus.\n\n### 1. Diagnostic Clinical Significance\n${name} serves as a critical diagnostic pillar in modern medical laboratory science. Trainees must understand specimen integrity, correct patient preparation, anti-coagulation or preservative selection, and chain of custody.\n\n### 2. Analytical Fundamentals\nStrict adherence to standardized calibration curves, internal quality control (IQC) procedures, and diagnostic verification ensures reproducibility and clinical reliability of patient test reports.`,
              notes: [
                `Foundational clinical laboratory protocol for ${name} under ${accreditationBody}.`,
                "Specimen collection criteria: proper container selection, minimum volume requirements, and anticoagulant ratios.",
                "Pre-analytical controls: preventing hemolyzed, icteric, or lipemic specimen interferences.",
                "Daily instrument calibration, baseline reagent blanking, and standard curve validation."
              ],
              benchAlert: `Ensure patient identification is double-verified and personal protective equipment (PPE Level 2) is worn before specimen processing.`,
              attachments: [
                {
                  id: `att-${Date.now()}-1`,
                  name: `SOP-${code}-01_Standard_Operating_Procedure.pdf`,
                  fileType: "SOP",
                  fileSize: "1.6 MB",
                  url: "#"
                },
                {
                  id: `att-${Date.now()}-2`,
                  name: `${code}_Clinical_Competency_Manual.pdf`,
                  fileType: "PDF",
                  fileSize: "2.4 MB",
                  url: "#"
                }
              ],
              images: [
                {
                  id: `img-${Date.now()}-1`,
                  title: `${name} Standard Analytical Bench Setup`,
                  caption: "Clinical diagnostic workstation setup with calibrated micropipettes, controls, and biosafety waste segregation.",
                  url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                }
              ],
              videos: [
                {
                  id: `vid-${Date.now()}-1`,
                  title: `Clinical Practical Bench Demonstration: ${name}`,
                  duration: "15 min",
                  url: "https://www.youtube.com/embed/fR3NxCR9z2U",
                  description: `Standard bench tutorial demonstrating test setup and quality control verification for ${name}.`
                }
              ],
              qas: [
                {
                  id: `qa-${Date.now()}-1`,
                  question: `What are the most frequent pre-analytical pitfalls encountered in ${name}?`,
                  answer: `Over 65% of all laboratory discrepancies stem from improper patient fasting state, wrong collection tubes, inadequate mixing causing microclots, and transport delays at unmonitored temperatures.`,
                  askedBy: "Laboratory Trainee Query",
                  category: "Pre-Analytical"
                }
              ],
              quizzes: [
                {
                  question: `What is the primary objective of running daily Quality Control samples in ${name}?`,
                  options: [
                    "To detect analytical bias and random precision errors before analyzing patient specimens",
                    "To speed up chemical turnaround time",
                    "To replace monthly equipment preventive maintenance",
                    "To eliminate the need for trained laboratory technologists"
                  ],
                  correctIndex: 0,
                  explanation: "Running assayed controls verifies that reagents, instrumentation, and environmental conditions meet predefined precision and accuracy benchmarks."
                },
                {
                  question: `Which factor is considered a critical pre-analytical variable in ${name}?`,
                  options: [
                    "Selecting the printer font for the test report",
                    "Patient preparation, fasting status, and specimen collection timing",
                    "The color of the laboratory bench countertop",
                    "The brand of office stationery used"
                  ],
                  correctIndex: 1,
                  explanation: "Patient fasting, posture, tourniquet application time, and collection tubes are primary pre-analytical variables that directly impact test accuracy."
                }
              ],
              vivaQAs: [
                {
                  question: `What are the fundamental principles underlying the diagnostic evaluation of ${name}?`,
                  answer: `The evaluation rests on specific analytical methodology (spectrophotometry, enzymatic assays, immunochemistry, or microscopy), validated reference intervals, and correlation with clinical signs and patient symptoms.`,
                  frequentlyAskedIn: `${accreditationBody} Annual Board Viva`
                },
                {
                  question: `How do you troubleshoot when a daily control value falls outside 2 Standard Deviations?`,
                  answer: `1. Re-inspect reagent lot numbers and expiration. 2. Verify calibration standards. 3. Re-run fresh control aliquot. 4. If violation persists (Westgard 1:3s), suspend patient testing and examine instrument optical/fluidic subsystems.`,
                  frequentlyAskedIn: "External Examiner Clinical Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: `${accreditationBody} Annual Examination`,
                  questionText: `Discuss the clinical significance, analytical methodology, and quality assurance protocols for ${name}. (Marks: 10)`,
                  modelAnswer: `1. Clinical Significance: Diagnostic utility in patient management. 2. Principle: Chemical/immunological reaction mechanism. 3. Specimen: Collection, handling, and storage. 4. Quality Assurance: Levy-Jennings charting and multi-rule verification. 5. Reference Intervals & Diagnostic interpretation.`,
                  marks: 10
                },
                {
                  year: "2022",
                  exam: `${accreditationBody} Supplementary Board`,
                  questionText: `Write short notes on: (a) Internal Quality Control in ${name}, (b) Pre-analytical specimen rejection criteria. (Marks: 6)`,
                  modelAnswer: `(a) IQC monitors daily precision using normal and pathological controls. (b) Rejection criteria include hemolysis, clotted anticoagulated blood, unlabelled specimens, and improper volume ratios.`,
                  marks: 6
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: `${code.toLowerCase()}-mod-2`,
      unitNumber: 2,
      title: `Module 2: Analytical Procedures, Instrumentation & Clinical Diagnostics`,
      description: `Detailed practical testing protocols, automated and semi-automated analyzers, and standard operating procedures for ${name}.`,
      subModules: [
        {
          id: `${code.toLowerCase()}-sub-2-1`,
          title: `Component 2.1: Bench Protocols & Standard Operating Procedures`,
          lessons: [
            {
              id: `${code.toLowerCase()}-les-2-1`,
              title: `Lesson 2: Step-by-Step Analytical Bench Procedure`,
              duration: "35 min",
              lectureText: `## Practical Bench Procedure: ${name}\n\nThis lesson details the hands-on diagnostic procedure, reagent reconstitution, pipetting precision, and analytical measurement required for ${name}.\n\n### 1. Reagent Preparation and Storage\nReagents must be brought to ambient room temperature (20-25°C) before testing unless specifically contraindicated. Inspect for turbidity, particulate precipitation, or color change indicative of degradation.\n\n### 2. Analytical Execution\nCalibrated precision micropipettes (positive displacement or air displacement) must be used. Aspirate without air bubbles, wipe pipette tips externally with lint-free wipes, and deliver at specified angles.`,
              notes: [
                "Strict pipetting technique: forward pipetting for aqueous solutions, reverse pipetting for viscous or volatile liquids.",
                "Incubation requirements: precise temperature control (37°C water bath or heating block) with timing verified by digital timers.",
                "Absorbance measurement against reagent blanks at designated spectrophotometric wavelengths.",
                "Diagnostic calculation formulas, calibration factor verification, and linear dynamic range."
              ],
              benchAlert: "Always check the linear range of the assay; specimens with values exceeding the analytical measurement range (AMR) must be diluted with recommended diluent and re-assayed.",
              quizzes: [
                {
                  question: "What should be done when a patient specimen result exceeds the upper linearity limit of the assay?",
                  options: [
                    "Report the maximum limit value as final result",
                    "Dilute specimen with recommended diluent, re-assay, and multiply by dilution factor",
                    "Discard the specimen and request a new draw",
                    "Divide the result by 2 without re-testing"
                  ],
                  correctIndex: 1,
                  explanation: "When absorbance exceeds linearity, the Lambert-Beer law no longer applies linearly. Specimen must be diluted, measured within linear range, and multiplied by dilution factor."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the Beer-Lambert Law and how is it applied in clinical chemistry and hematology?",
                  answer: "Beer-Lambert law states that absorbance is directly proportional to solute concentration and path length: A = ε · c · l. In laboratory analyzers, optical absorbance is converted to patient analyte concentration using standard calibration factors.",
                  frequentlyAskedIn: "SMFB Written & Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: `${accreditationBody} Final Examination`,
                  questionText: `Describe the principle, procedure, and clinical interpretation of analytical testing in ${name}. (Marks: 8)`,
                  modelAnswer: `Clear delineation of test principle, step-by-step reagent and specimen additions, incubation timings, optical detection, and mathematical calculations with units.`,
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

/**
 * Determines whether a course has interactive learning materials built in the Study Center.
 * Returns true only if the subject has active modules with lessons in the Study Center store.
 */
export function isSubjectBuiltInStudyCenter(
  code: string,
  studyMap?: Record<string, Module[]>
): boolean {
  if (!code) return false;
  const upperCode = code.trim().toUpperCase();

  const data = studyMap || getStoredStudyData();
  const subjectModules = data[upperCode];

  if (subjectModules && Array.isArray(subjectModules) && subjectModules.length > 0) {
    const hasLessons = subjectModules.some(
      (m) => m.subModules && m.subModules.some((sm) => sm.lessons && sm.lessons.length > 0)
    );
    if (hasLessons) return true;
  }

  // Check initial pre-built study center subjects (ANAT-101, ENG-101, etc.)
  const initialModules = INITIAL_STUDY_CENTER_DATA[upperCode];
  if (initialModules && Array.isArray(initialModules) && initialModules.length > 0) {
    const hasLessons = initialModules.some(
      (m) => m.subModules && m.subModules.some((sm) => sm.lessons && sm.lessons.length > 0)
    );
    if (hasLessons) return true;
  }

  return false;
}

/**
 * Formats a unit/module title so it is consistently displayed as "Topic X: ..."
 */
export function formatTopicTitle(title?: string, unitNumber?: number): string {
  if (!title) return unitNumber ? `Topic ${unitNumber}` : "Topic";
  let clean = title.replace(/^(Unit|Module)\s+(\d+)[:\s]*/i, "Topic $2: ");
  if (!/^Topic\s+/i.test(clean) && unitNumber) {
    clean = `Topic ${unitNumber}: ${clean}`;
  }
  return clean;
}
