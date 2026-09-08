"use client";

import * as React from "react";

export interface PracticalComment {
  id: string;
  userName: string;
  userRole: string;
  comment: string;
  createdAt: string;
}

export interface PracticalProcedure {
  id: string;
  title: string;
  department: "Hematology" | "Biochemistry" | "Microbiology" | "Blood Banking" | "Histopathology" | "Clinical Pathology";
  specimen: string;
  whyPerform: string; // Clinical indication
  whenPerform: string; // Timing / Clinical presentation
  reagentsAndEquipment: string[];
  steps: string[]; // How to perform
  qualityControl: string;
  normalValues: string;
  criticalAlerts: string;
  rejectionCriteria: string;
  videoUrl?: string;
  comments?: PracticalComment[];
  createdBy?: string;
  createdAt?: string;
}

const INITIAL_PRACTICALS: PracticalProcedure[] = [
  {
    id: "prac-001",
    title: "Peripheral Blood Film Preparation & Leishman Staining Technique",
    department: "Hematology",
    specimen: "EDTA Anticoagulated Whole Blood (Tube with lavender top)",
    whyPerform: "Evaluate morphological abnormalities of RBCs (microcytes, target cells), WBC differential counts (blast cells in acute leukemia), and platelet adequacy.",
    whenPerform: "Indicated in unexplained fever, severe anemia, leukocytosis (>15,000/µL), thrombocytopenia, suspected malaria, or flagging on automated cell analyzer.",
    reagentsAndEquipment: [
      "Clean grease-free glass slides",
      "Smooth-edged spreader slide",
      "Leishman Stain working solution",
      "Phosphate Buffer pH 6.8",
      "Distilled water",
      "Staining rack & timer",
      "Immersion oil & Binocular microscope (100x objective)",
    ],
    steps: [
      "Place a small drop of well-mixed EDTA blood (approx 5 µL) near the frosted end of a clean glass slide.",
      "Place the spreader slide at a 30°–45° angle in front of the drop, pull back until it touches the blood and allows it to spread along the contact edge.",
      "Push the spreader forward smoothly with moderate speed to produce a thin film with a well-defined feathered edge.",
      "Air-dry the film immediately by waving in air (never heat-fix).",
      "Cover the air-dried film with 8–10 drops of Leishman stain for 2 minutes (undiluted for methanol fixation).",
      "Add double volume (16–20 drops) of pH 6.8 buffered water. Gently blow air to mix until a metallic greenish scum forms on the surface.",
      "Allow staining for 8–10 minutes.",
      "Wash off gently with buffered water under slow running stream. Wipe the back of the slide and stand vertically to dry.",
      "Examine the monolayer region under oil immersion (100x).",
    ],
    qualityControl: "Stain quality is confirmed when RBCs appear bright salmon pink, neutrophil nuclei are deep purple with lilac granules, and eosinophil granules are bright orange-red.",
    normalValues: "Neutrophils: 40–75%, Lymphocytes: 20–45%, Monocytes: 2–10%, Eosinophils: 1–6%, Basophils: 0–1%. Platelets: 7–21 per oil immersion field.",
    criticalAlerts: "Presence of circulating myeloblasts, promyelocytes, Auer rods, intracellular ring-form Plasmodium falciparum, or extreme thrombocytopenia (<20,000/µL) mandates immediate critical verbal alert to treating physician.",
    rejectionCriteria: "Clotted blood specimen, over-filled or under-filled EDTA tubes, gross hemolysis, slides with drying artifacts or ridges.",
    videoUrl: "https://www.youtube.com/watch?v=0kFh_1311bY",
    comments: [
      {
        id: "c-1",
        userName: "Md. Ansarul Islam",
        userRole: "STUDENT",
        comment: "Sir, what should we do if the staining appears excessively blue throughout the slide?",
        createdAt: "2025-02-10",
      },
      {
        id: "c-2",
        userName: "Dr. Sabrina Parvin",
        userRole: "MENTOR",
        comment: "Excessive blue tint indicates alkaline pH buffer (>7.0), prolonged staining time, or inadequate washing. Always verify buffer pH is 6.8.",
        createdAt: "2025-02-11",
      },
    ],
  },
  {
    id: "prac-002",
    title: "Serum Glucose Quantification by Enzymatic GOD-POD Method",
    department: "Biochemistry",
    specimen: "Fluoride-Oxalate Plasma or Fresh Serum (centrifuged within 30 min)",
    whyPerform: "Diagnose Diabetes Mellitus, screen for Impaired Glucose Tolerance (IGT), monitor insulin therapy, and identify life-threatening hypoglycemic episodes.",
    whenPerform: "Fasting plasma glucose (FPG) after 8–10 hours overnight fast, 2-hour postprandial (2hPP), or random emergency in altered mental state / diabetic ketoacidosis.",
    reagentsAndEquipment: [
      "Glucose Reagent (Glucose Oxidase >15,000 U/L, Peroxidase >1,000 U/L, 4-Aminoantipyrine, Phenol buffer pH 7.5)",
      "Glucose Standard (100 mg/dL or 5.55 mmol/L)",
      "Micropipettes (10 µL, 1000 µL) and tips",
      "Semi-automated Clinical Chemistry Spectrophotometer at 505 nm",
      "Water bath / Incubator at 37°C",
    ],
    steps: [
      "Label three test tubes: Blank (B), Standard (S), and Test (T).",
      "Pipette 1000 µL (1.0 mL) of working Glucose Reagent into each tube.",
      "Add 10 µL of distilled water to Blank, 10 µL of Standard (100 mg/dL) to Standard, and 10 µL of patient sample to Test.",
      "Mix thoroughly by gentle vortexing and incubate at 37°C for 10 minutes (or 20 min at room temperature 20–25°C).",
      "Zero the spectrophotometer with the Reagent Blank at 505 nm.",
      "Measure absorbance of Standard (Abs S) and patient Test (Abs T) within 30 minutes.",
      "Calculation: Serum Glucose (mg/dL) = (Abs Test / Abs Standard) × 100.",
    ],
    qualityControl: "Run normal (level 1) and abnormal (level 2) commercial assayed controls with every analytical batch. Results must fall within ±2 SD of target on Levey-Jennings chart.",
    normalValues: "Fasting Plasma Glucose: 70–99 mg/dL (3.9–5.5 mmol/L). Impaired (Prediabetes): 100–125 mg/dL. Diabetes: ≥126 mg/dL. 2h Post-Glucose: <140 mg/dL.",
    criticalAlerts: "Critical Low: <45 mg/dL (<2.5 mmol/L) (Risk of hypoglycemic coma/brain damage). Critical High: >450 mg/dL (>25.0 mmol/L) (Risk of Hyperosmolar Hyperglycemic State / DKA).",
    rejectionCriteria: "Hemolyzed serum (causes false negative due to catalase consumption of H2O2), unpreserved whole blood standing >1 hour (glycolysis causes 5–7% hourly decrease).",
    comments: [],
  },
  {
    id: "prac-003",
    title: "ABO & Rh(D) Blood Grouping by Tube Method (Forward & Reverse)",
    department: "Blood Banking",
    specimen: "Fresh EDTA or Clotted Whole Blood without hemolysis",
    whyPerform: "Determine patient and donor blood group antigens and reciprocal isohemagglutinins to prevent fatal acute hemolytic transfusion reactions (AHTR).",
    whenPerform: "Mandatory prior to blood transfusion, surgical pre-operative workup, antenatal screening for hemolytic disease of fetus/newborn (HDFN), and blood donor drives.",
    reagentsAndEquipment: [
      "Anti-A, Anti-B, Anti-AB, and Anti-D (IgM/IgG blend) monoclonal antisera",
      "Known reagent red cell pools: A-cells, B-cells, O-cells (3–5% suspension)",
      "Normal Saline (0.9% NaCl)",
      "Test tubes (10 × 75 mm), test tube rack",
      "Serological Centrifuge (3400 rpm for 15 sec)",
      "Pasteur pipettes, viewing lamp / concave mirror",
    ],
    steps: [
      "Prepare a 3–5% red cell suspension of patient cells in isotonic saline.",
      "Forward Grouping: Label 4 tubes (Anti-A, Anti-B, Anti-AB, Anti-D). Add 1 drop of respective antiserum, then 1 drop of 3–5% patient red cell suspension to each.",
      "Reverse Grouping: Label 3 tubes (A-cells, B-cells, O-cells). Add 2 drops of patient serum/plasma to each, then 1 drop of respective known reagent red cells.",
      "Gently mix and centrifuge all tubes at 3400 rpm for 15 seconds (or 1000 rpm for 1 min).",
      "Gently dislodge the red cell button by tilting and shaking. Grade agglutination (0 to 4+) macroscopically over a white background or viewing lamp.",
      "Confirm concordance between forward and reverse grouping. If discrepant, perform duplicate check and antibody screen.",
    ],
    qualityControl: "Daily QC of antisera against known positive (heterozygous) and negative control red blood cells. Anti-D tube must include negative Rh control (albumin/saline).",
    normalValues: "A+: Anti-A+, Anti-D+, B-cells agglutinated. B+: Anti-B+, Anti-D+, A-cells agglutinated. AB+: Anti-A+, Anti-B+, Anti-D+, no reverse agglutination. O+: Anti-D+, A & B cells agglutinated.",
    criticalAlerts: "Any ABO discrepancy MUST be resolved before releasing blood components. In emergency, uncrossmatched O-negative PRBCs are issued upon medical director sign-off.",
    rejectionCriteria: "Severely hemolyzed or lipemic specimen, unlabeled or mislabeled collection tube, cold agglutinins in patient plasma without pre-warming.",
    comments: [],
  },
  {
    id: "prac-004",
    title: "Differential Gram Stain Technique for Bacterial Morphology",
    department: "Microbiology",
    specimen: "Clinical purulent exudate, CSF sediment, sputum, or overnight bacterial colony",
    whyPerform: "Rapid preliminary identification of bacteria into Gram-positive (purple) or Gram-negative (pink) to guide empiric antimicrobial therapy.",
    whenPerform: "Urgent diagnostic workup in suspected bacterial meningitis, sepsis, pneumonia, wound infection, and blood culture bottle flagging.",
    reagentsAndEquipment: [
      "Crystal Violet (Primary stain)",
      "Gram's Iodine (Mordant)",
      "Acetone-Alcohol 95% (Decolorizer)",
      "Safranin or Dilute Carbol Fuchsin (Counterstain)",
      "Inoculating loop & Bunsen burner / micro-incinerator",
      "Microscope with 100x oil immersion objective",
    ],
    steps: [
      "Prepare a thin smear of clinical material or colony emulsified in a drop of sterile saline on a clean glass slide.",
      "Air-dry thoroughly and heat-fix by passing through the flame 2–3 times (do not overheat).",
      "Flood smear with Crystal Violet for 1 minute. Rinse gently with tap water.",
      "Flood with Gram's Iodine for 1 minute. Rinse gently with water.",
      "Decolorize with Acetone-Alcohol dropwise for 5–10 seconds until runoff is clear. Immediately rinse with water.",
      "Counterstain with Safranin for 30–60 seconds. Rinse with water and blot dry with bibulous paper.",
      "Examine under oil immersion (100x) for color, morphology (cocci, bacilli), and arrangement (clusters, chains, pairs).",
    ],
    qualityControl: "Stain a control slide containing known mixture of S. aureus (Gram-positive cocci) and E. coli (Gram-negative bacilli) alongside patient smears.",
    normalValues: "Sterile fluids (CSF, blood, synovial fluid) should show NO organisms. Normal flora varies by anatomical site.",
    criticalAlerts: "Gram-negative intracellular diplococci in CSF (suspected Neisseria meningitidis) or Gram-positive lancet-shaped diplococci in blood (S. pneumoniae) require STAT telephone notification.",
    rejectionCriteria: "Unfixed smear, thick opaque smear that prevents light transmission, over-decolorized slide.",
    comments: [],
  },
];

const STORAGE_KEY = "labtutor_practicals_v1";

interface PracticalContextType {
  practicals: PracticalProcedure[];
  addPractical: (procedure: Omit<PracticalProcedure, "id" | "createdAt" | "comments">) => { success: boolean; error?: string };
  updatePractical: (id: string, updates: Partial<PracticalProcedure>) => { success: boolean; error?: string };
  deletePractical: (id: string) => { success: boolean; error?: string };
  addComment: (practicalId: string, comment: string, userName: string, userRole: string) => void;
}

const PracticalContext = React.createContext<PracticalContextType | undefined>(undefined);

export function PracticalProvider({ children }: { children: React.ReactNode }) {
  const [practicals, setPracticals] = React.useState<PracticalProcedure[]>(INITIAL_PRACTICALS);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPracticals(parsed);
          return;
        }
      }
    } catch {}
    setPracticals(INITIAL_PRACTICALS);
  }, []);

  const persistPracticals = (newPracticals: PracticalProcedure[]) => {
    setPracticals(newPracticals);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPracticals));
    } catch {}
  };

  const addPractical = React.useCallback(
    (procedure: Omit<PracticalProcedure, "id" | "createdAt" | "comments">): { success: boolean; error?: string } => {
      if (!procedure.title.trim()) return { success: false, error: "Procedure title is required." };

      const newProc: PracticalProcedure = {
        ...procedure,
        id: `prac-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString().split("T")[0],
        comments: [],
      };

      const updated = [newProc, ...practicals];
      persistPracticals(updated);
      return { success: true };
    },
    [practicals]
  );

  const updatePractical = React.useCallback(
    (id: string, updates: Partial<PracticalProcedure>): { success: boolean; error?: string } => {
      const idx = practicals.findIndex((p) => p.id === id);
      if (idx === -1) return { success: false, error: "Procedure not found." };

      const updated = [...practicals];
      updated[idx] = { ...updated[idx], ...updates };
      persistPracticals(updated);
      return { success: true };
    },
    [practicals]
  );

  const deletePractical = React.useCallback(
    (id: string): { success: boolean; error?: string } => {
      const updated = practicals.filter((p) => p.id !== id);
      persistPracticals(updated);
      return { success: true };
    },
    [practicals]
  );

  const addComment = React.useCallback(
    (practicalId: string, comment: string, userName: string, userRole: string) => {
      if (!comment.trim()) return;
      const newComment: PracticalComment = {
        id: `c-${Date.now()}`,
        userName,
        userRole,
        comment: comment.trim(),
        createdAt: new Date().toISOString().split("T")[0],
      };

      const updated = practicals.map((p) =>
        p.id === practicalId ? { ...p, comments: [...(p.comments || []), newComment] } : p
      );
      persistPracticals(updated);
    },
    [practicals]
  );

  return (
    <PracticalContext.Provider
      value={{
        practicals,
        addPractical,
        updatePractical,
        deletePractical,
        addComment,
      }}
    >
      {children}
    </PracticalContext.Provider>
  );
}

export function usePracticals() {
  const context = React.useContext(PracticalContext);
  if (!context) {
    throw new Error("usePracticals must be used within PracticalProvider");
  }
  return context;
}
