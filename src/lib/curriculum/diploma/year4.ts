// Official State Medical Faculty of Bangladesh (SMFB) Diploma in Medical Laboratory Technology (DMLT)
// 4th Year Curriculum: CBI-401, SMIC-402, SFA-403

import type { StudyModuleItem } from "../diploma-curriculum-data";

export const DIPLOMA_YEAR4_STUDY_DATA: Record<string, StudyModuleItem[]> = {
  "CBI-401": [
    {
      id: "cbi-mod-1",
      unitNumber: 1,
      title: "Topic 1: Advanced Clinical Biochemistry, Electrolytes & Automated Analyzers",
      description: "Serum electrolytes (Na+, K+, Cl- by ISE), arterial blood gases (ABG), acid-base disorders, calcium/phosphorus kinetics, and fully automated random-access biochemistry analyzers.",
      learningOutcomes: [
        "Explain the operating principles of Ion Selective Electrodes (ISE) for direct and indirect electrolyte measurement.",
        "Interpret arterial blood gas (ABG) parameters: pH, pCO2, pO2, HCO3-, and base excess (BE).",
        "Diagnose metabolic acidosis/alkalosis and respiratory acidosis/alkalosis from laboratory ABG panels.",
        "Describe the architectural components of fully automated clinical chemistry analyzers (reagent carousel, sample probe, wash stations, photometer).",
        "Implement calibration verification, carryover elimination, and maintenance protocols on automated analyzers."
      ],
      subModules: [
        {
          id: "cbi-sub-1-1",
          title: "Sub-Module 1.1: Electrolytes, Blood Gases & Analyzer Automation",
          lessons: [
            {
              id: "cbi-les-1",
              title: "Lesson 1: Serum Electrolytes (ISE) & Arterial Blood Gas (ABG) Analysis",
              duration: "35 min",
              notes: [
                "Ion Selective Electrodes (ISE): Potentiometric measurement based on the Nernst equation (E = E0 + (RT/nF) * ln[ion activity]).",
                "Sodium (Na+): glass membrane electrode; Potassium (K+): valinomycin antibiotic liquid membrane electrode; Chloride (Cl-): silver/silver chloride solid-state electrode.",
                "Normal Serum Reference Ranges: Na+ 135-145 mmol/L, K+ 3.5-5.0 mmol/L, Cl- 98-106 mmol/L.",
                "Arterial Blood Gas (ABG) reference values: pH 7.35-7.45, pCO2 35-45 mmHg, pO2 80-100 mmHg, HCO3- 22-26 mmol/L.",
                "Diagnostic Matrix: Acidosis (pH <7.35) - if pCO2 >45 mmHg = Respiratory Acidosis; if HCO3- <22 mmol/L = Metabolic Acidosis.",
                "Anion Gap = (Na+ + K+) - (Cl- + HCO3-) [Normal: 12-16 mmol/L]; elevated in ketoacidosis and lactic acidosis."
              ],
              benchAlert: "Never run hemolyzed blood for potassium estimation; erythrocyte lysis releases intracellular K+ (intracellular K+ is 150 mmol/L), causing severe pseudohyperkalemia.",
              quizzes: [
                {
                  question: "What membrane carrier molecule is incorporated into the potassium-selective electrode in automated ISE analyzers?",
                  options: ["Gramicidin", "Valinomycin", "Crown ether 12", "Monensin"],
                  correctIndex: 1,
                  explanation: "Valinomycin is a cyclic ionophore antibiotic that specifically coordinates potassium ions with high selectivity over sodium."
                }
              ],
              vivaQAs: [
                {
                  question: "Why does gross in vitro hemolysis distort potassium and LDH results?",
                  answer: "Potassium and Lactate Dehydrogenase have exceptionally high intracellular concentrations in red blood cells compared to plasma. Hemolysis causes false elevations (pseudohyperkalemia).",
                  frequentlyAskedIn: "SMFB Biochemistry Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Describe the principle of Ion Selective Electrodes (ISE). How do you interpret an ABG panel in metabolic acidosis? (Marks: 8)",
                  modelAnswer: "Potentiometric Nernstian response, membrane composition, Henderson-Hasselbalch calculation, and compensatory respiratory response.",
                  marks: 8
                }
              ]
            },
            {
              id: "cbi-les-2",
              title: "Lesson 2: Automated Chemistry Analyzers & Robotic Architecture",
              duration: "30 min",
              notes: [
                "Continuous Flow vs Discrete Analyzers: Modern labs use Discrete Random-Access Automated Analyzers where each sample reaction occurs in an individual cuvette.",
                "Subsystems: Reagent rotor (refrigerated at 2-8°C), Sample rotor with barcode scanner, Precision pipetting probe with liquid level detection (capacitance sensor), Mixing stirrers, Incubation bath (37.0°C ± 0.1°C), Polychromatic photometer with diffraction grating.",
                "Measurement Modes: Endpoint (with sample blanking), Two-point kinetic (fixed time), Multi-point rate kinetic (e.g., enzymes), Turbidimetric/Immunoturbidimetric.",
                "Sample Carryover Prevention: Teflon-coated probes, high-pressure internal/external deionized water washing, and dedicated wash solutions between samples.",
                "Maintenance: Daily probe alignment check, optical cuvette blank calibration, water bath temperature verification, and weekly tubing decontamination."
              ],
              benchAlert: "Always inspect automated analyzer reagent onboard expiration and perform a water blank run before initiating daily patient runs.",
              quizzes: [
                {
                  question: "How do modern automated analyzer sample probes detect that they have touched the liquid meniscus of patient serum?",
                  options: [
                    "Manual visual camera inspection",
                    "Capacitance-based electrical liquid level sensing",
                    "Ultrasonic sound waves only",
                    "Thermal heat sensors"
                  ],
                  correctIndex: 1,
                  explanation: "Modern probes utilize capacitance liquid level detection to measure changes in electrical capacitance upon contacting the conductive serum surface."
                }
              ],
              vivaQAs: [
                {
                  question: "What is sample carryover in automated analyzers and how is it minimized?",
                  answer: "Carryover is the unintended transfer of analyte or reagent from one reaction mixture to another via the sampling probe. It is minimized by teflon coating, extensive internal/external washing, and air gaps.",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Discuss the construction and operational principles of an automated clinical chemistry analyzer. (Marks: 8)",
                  modelAnswer: "Detailed block diagram showing sample/reagent handling, incubation, photometric detection, washing cycles, and microprocessor data processing.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "cbi-mod-2",
      unitNumber: 2,
      title: "Topic 2: Clinical Immunology, ELISA, Chemiluminescence & Hormone Assays",
      description: "Antigen-antibody reactions, ELISA (Sandwich, Competitive, Indirect), Chemiluminescence Immunoassay (CLIA), Thyroid function panel (T3, T4, TSH), fertility hormones, and autoimmune markers.",
      learningOutcomes: [
        "Explain the kinetic mechanisms of antigen-antibody interactions (affinity, avidity, prozone and postzone phenomena).",
        "Perform Enzyme-Linked Immunosorbent Assay (ELISA) protocols using manual washer and microplate reader.",
        "Compare the analytical sensitivity of ELISA versus Chemiluminescence Immunoassay (CLIA).",
        "Interpret thyroid hormone panels (TSH, Free T3, Free T4) in hyperthyroidism and hypothyroidism.",
        "Describe laboratory testing for autoimmune markers: Antinuclear Antibodies (ANA), Rheumatoid Factor (RF), and Anti-CCP."
      ],
      subModules: [
        {
          id: "cbi-sub-2-1",
          title: "Sub-Module 2.1: Immunoassays & Endocrine Diagnostics",
          lessons: [
            {
              id: "cbi-les-3",
              title: "Lesson 3: ELISA Formats, CLIA Principles & Microplate Washing",
              duration: "35 min",
              notes: [
                "ELISA Formats:",
                "  1. Indirect ELISA: Microplate coated with antigen -> patient antibody binds -> enzyme-conjugated anti-human IgG added -> substrate -> color (detects antibodies, e.g., HIV, HCV).",
                "  2. Sandwich ELISA: Microplate coated with capture antibody -> patient antigen binds -> enzyme-conjugated secondary antibody added -> substrate -> color (detects high-MW antigens, e.g., HBsAg, TSH).",
                "  3. Competitive ELISA: Labeled and unlabeled antigen compete for limited antibody binding sites; absorbance inversely proportional to analyte concentration (low-MW hormones, e.g., T3, T4).",
                "Enzyme-Substrate Systems: Horseradish Peroxidase (HRP) + TMB (Tetramethylbenzidine) -> blue, stopped with H2SO4 to yellow (read at 450 nm); Alkaline Phosphatase (ALP) + pNPP (read at 405 nm).",
                "CLIA (Chemiluminescence): Uses acridinium esters or luminol/isoluminol; emits flash or glow light read by photomultiplier tube (PMT) with 10-100x higher sensitivity than ELISA."
              ],
              benchAlert: "Incomplete washing in ELISA causes severe false-positive results due to residual unbound enzyme conjugate in microplate wells.",
              quizzes: [
                {
                  question: "In a Sandwich ELISA assay, what is the mathematical relationship between optical absorbance and the concentration of antigen in patient serum?",
                  options: [
                    "Inversely proportional",
                    "Directly proportional",
                    "Exponentially decaying",
                    "Independent of each other"
                  ],
                  correctIndex: 1,
                  explanation: "In sandwich ELISA, more patient antigen captures more enzyme conjugate, producing higher color intensity directly proportional to concentration."
                }
              ],
              vivaQAs: [
                {
                  question: "Explain the hook effect (prozone phenomenon) in sandwich immunoassays.",
                  answer: "Extremely high antigen concentrations saturate both capture and detection antibodies independently, preventing sandwich formation and causing falsely low test results.",
                  frequentlyAskedIn: "SMFB Immunology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Classify ELISA methods. Describe the principle and protocol of Sandwich ELISA for HBsAg detection. (Marks: 8)",
                  modelAnswer: "Detailed comparison of indirect, sandwich, and competitive formats, wash cycles, cutoff value calculations, and optical density interpretation.",
                  marks: 8
                }
              ]
            },
            {
              id: "cbi-les-4",
              title: "Lesson 4: Thyroid Hormones (T3, T4, TSH) & Autoimmune Serology",
              duration: "35 min",
              notes: [
                "Thyroid-Stimulating Hormone (TSH): Pituitary glycoprotein; primary and most sensitive screening marker for thyroid dysfunction (Normal: 0.4 - 4.2 µIU/mL).",
                "Free T4 (FT4) and Free T3 (FT3): Biologically active unbound fractions; unaffected by changes in thyroxine-binding globulin (TBG).",
                "Diagnostic Patterns:",
                "  - Primary Hypothyroidism: High TSH, Low FT4.",
                "  - Primary Hyperthyroidism (Graves' disease): Suppressed low TSH (<0.01 µIU/mL), High FT4 and FT3.",
                "  - Subclinical Hypothyroidism: Elevated TSH with normal FT4.",
                "Autoimmune Markers: Antinuclear Antibodies (ANA) by indirect immunofluorescence (gold standard, Hep-2 cells) or ELISA; Rheumatoid Factor (RF, IgM against Fc of IgG); Anti-Cyclic Citrullinated Peptide (Anti-CCP, high specificity for Rheumatoid Arthritis)."
              ],
              benchAlert: "Biotin (vitamin B7) supplements interfere with streptavidin-biotin based immunoassays, causing falsely high FT4/FT3 and falsely low TSH.",
              quizzes: [
                {
                  question: "Which laboratory finding is characteristic of primary overt hyperthyroidism (Graves' disease)?",
                  options: [
                    "Elevated TSH and low Free T4",
                    "Undetectable / suppressed TSH (<0.01 µIU/mL) with elevated Free T4 and Free T3",
                    "Elevated TSH and elevated Free T4",
                    "Normal TSH and low Free T3"
                  ],
                  correctIndex: 1,
                  explanation: "Negative feedback from excess circulating free thyroid hormones completely suppresses pituitary TSH secretion below the detection limit."
                }
              ],
              vivaQAs: [
                {
                  question: "Why is Free T4 clinically superior to Total T4 in evaluating thyroid function in pregnant patients?",
                  answer: "Pregnancy increases estrogen, doubling thyroxine-binding globulin (TBG) and artificially elevating Total T4, whereas Free T4 remains within physiological equilibrium.",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Discuss thyroid function tests (TFT). Explain the laboratory interpretation of primary hypothyroidism versus hyperthyroidism. (Marks: 8)",
                  modelAnswer: "Physiological hypothalamic-pituitary-thyroid axis, TSH and Free T4 reference ranges, and comprehensive differential diagnostic flowchart.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "SMIC-402": [
    {
      id: "smic-mod-1",
      unitNumber: 1,
      title: "Topic 1: Diagnostic Virology, Hepatitis Markers & Molecular Biology",
      description: "Viral biology, hepatitis viral panel (HAV, HBV, HCV, HEV seromarkers), Arboviruses (Dengue NS1, Chikungunya), SARS-CoV-2, Polymerase Chain Reaction (PCR), and Real-Time RT-PCR.",
      learningOutcomes: [
        "Interpret the complete Hepatitis B serological profile (HBsAg, Anti-HBs, HBeAg, Anti-HBe, Anti-HBc IgM/IgG).",
        "Perform rapid immunochromatographic and ELISA testing for Dengue NS1 antigen and IgM/IgG antibodies.",
        "Explain the molecular mechanisms of Polymerase Chain Reaction (PCR): denaturation, annealing, and extension.",
        "Describe the operating workflow of Real-Time Reverse Transcription PCR (RT-PCR) and interpret Ct (threshold cycle) values.",
        "Demonstrate biosafety protocols in a molecular diagnostic laboratory (unidirectional workflow to prevent amplicon contamination)."
      ],
      subModules: [
        {
          id: "smic-sub-1-1",
          title: "Sub-Module 1.1: Viral Diagnostics & Molecular Amplification",
          lessons: [
            {
              id: "smic-les-1",
              title: "Lesson 1: Hepatitis B Seromarkers & Dengue Diagnostics",
              duration: "35 min",
              notes: [
                "Hepatitis B Virus (HBV) Serological Markers:",
                "  - HBsAg: First marker to appear; indicates active infection (acute or chronic if persistent >6 months).",
                "  - Anti-HBs: Protective neutralizing antibody; indicates immunity (post-vaccination or resolved infection).",
                "  - HBeAg: Correlates with high viral replication and maximum infectivity.",
                "  - Anti-HBe: Indicates reduced viral replication and low infectivity.",
                "  - Anti-HBc IgM: First antibody; indicates acute HBV infection (present during window period when HBsAg and Anti-HBs are negative).",
                "  - Anti-HBc Total (IgG): Indicates past or chronic exposure.",
                "Dengue Virus (DENV 1-4): Flavivirus transmitted by Aedes aegypti.",
                "  - NS1 Antigen: Detectable from Day 1 to Day 5 of fever onset.",
                "  - IgM Antibodies: Appear from Day 5 onward; indicate acute/primary infection.",
                "  - IgG Antibodies: Rise rapidly in secondary dengue (risk of Dengue Hemorrhagic Fever / Shock Syndrome)."
              ],
              benchAlert: "The 'window period' in acute Hepatitis B occurs when HBsAg has disappeared but Anti-HBs has not yet reached detectable levels; Anti-HBc IgM is the sole diagnostic marker.",
              quizzes: [
                {
                  question: "Which serological marker is positive in an individual who has been successfully vaccinated against Hepatitis B without prior infection?",
                  options: [
                    "HBsAg positive only",
                    "Anti-HBs positive only (with negative Anti-HBc)",
                    "Anti-HBc IgM positive",
                    "HBeAg positive"
                  ],
                  correctIndex: 1,
                  explanation: "Recombinant Hepatitis B vaccine contains only HBsAg; successful immunization produces isolated Anti-HBs without Anti-HBc antibodies."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the clinical significance of the Hepatitis B 'window period' and which test confirms acute infection?",
                  answer: "The window period is the gap between the disappearance of HBsAg and appearance of Anti-HBs. Anti-HBc IgM is the only detectable seromarker during this phase.",
                  frequentlyAskedIn: "SMFB Virology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Interpret the serological markers of Hepatitis B virus in acute infection, chronic infection, and post-vaccination state. (Marks: 8)",
                  modelAnswer: "Diagnostic matrix table for HBsAg, Anti-HBs, HBeAg, Anti-HBe, Anti-HBc IgM/IgG across all clinical infection stages.",
                  marks: 8
                }
              ]
            },
            {
              id: "smic-les-2",
              title: "Lesson 2: Molecular Diagnostics: PCR, RT-PCR & Real-Time Quantification",
              duration: "35 min",
              notes: [
                "PCR Cycle Stages (Thermal Cycler):",
                "  1. Denaturation: 94-95°C (melts double-stranded DNA into single strands by breaking hydrogen bonds).",
                "  2. Annealing: 50-65°C (sequence-specific oligonucleotide primers bind complementary target DNA).",
                "  3. Extension/Elongation: 72°C (thermostable Taq DNA Polymerase synthesizes new strand using dNTPs).",
                "Reverse Transcription PCR (RT-PCR): Uses Reverse Transcriptase to convert viral RNA into complementary DNA (cDNA) prior to PCR amplification (e.g., SARS-CoV-2, HCV, HIV RNA).",
                "Real-Time qPCR: Fluorescent probes (TaqMan) or intercalating dye (SYBR Green); Ct (Cycle threshold) is the cycle number at which fluorescence crosses the background threshold.",
                "Inverse relationship: Lower Ct value = Higher target viral load (e.g., Ct 18 = high viral load; Ct 34 = very low viral load).",
                "Molecular Lab Architecture: Strictly 3 separated rooms with negative pressure: Reagent Pre-PCR Room -> Sample Extraction Room -> Amplification & Post-PCR Room."
              ],
              benchAlert: "Never bring amplified PCR products (amplicons) back into the pre-PCR or extraction rooms; aerosol amplicon contamination causes massive false positives.",
              quizzes: [
                {
                  question: "In real-time RT-PCR, what does a low Cycle Threshold (Ct value) of 16 indicate compared to a Ct value of 35?",
                  options: [
                    "A significantly higher viral load in the patient specimen",
                    "A significantly lower viral load",
                    "A failed PCR reaction",
                    "The presence of bacterial contamination only"
                  ],
                  correctIndex: 0,
                  explanation: "Because PCR doubles target DNA each cycle, a low Ct value means the fluorescent signal crossed the threshold much earlier due to a very high starting target copy number."
                }
              ],
              vivaQAs: [
                {
                  question: "Explain the unidirectional workflow in a clinical molecular diagnostic (PCR) laboratory.",
                  answer: "Workflow must strictly move in one direction: Clean reagent prep room -> Extraction room -> Amplification/detection room. Staff and equipment never move backwards to prevent amplicon contamination.",
                  frequentlyAskedIn: "SMFB Molecular Biology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "State the principle and steps of PCR. What are the advantages of Real-Time PCR over conventional PCR? (Marks: 8)",
                  modelAnswer: "Thermal cycling steps, reaction components (Taq, dNTPs, primers, MgCl2), real-time fluorophores, closed-tube format preventing contamination, and quantification capability.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "smic-mod-2",
      unitNumber: 2,
      title: "Topic 2: Medical Mycology, Antimicrobial Susceptibility Testing & AST Resistance",
      description: "Fungal morphology, dermatophytes, Candida albicans, Cryptococcus neoformans, Kirby-Bauer disc diffusion method on Mueller-Hinton agar, McFarland standards, MIC, and multidrug-resistant pathogens (MRSA, ESBL, CRE).",
      learningOutcomes: [
        "Perform 10-20% KOH wet mount preparation for fungal hyphae and spores in skin, hair, and nail scrapings.",
        "Differentiate Candida albicans using Germ Tube Test (Reynolds-Braude phenomenon) and chlamydospore culture on cornmeal agar.",
        "Demonstrate India ink negative staining for Cryptococcus neoformans capsular halo in cerebrospinal fluid (CSF).",
        "Perform standardized Kirby-Bauer disc diffusion Antimicrobial Susceptibility Testing (AST) following CLSI guidelines.",
        "Detect multidrug-resistant strains: Methicillin-Resistant Staphylococcus aureus (MRSA) and Extended-Spectrum Beta-Lactamases (ESBL)."
      ],
      subModules: [
        {
          id: "smic-sub-2-1",
          title: "Sub-Module 2.1: Mycology & Antibiotic Resistance Mechanisms",
          lessons: [
            {
              id: "smic-les-3",
              title: "Lesson 3: Medical Mycology: KOH Mounts, Germ Tube Test & Cryptococcal Capsule",
              duration: "35 min",
              notes: [
                "KOH Mount: 10-20% Potassium Hydroxide digests keratin in skin, hair, and nails while leaving fungal chitin walls intact.",
                "Dermatophytes (Microsporum, Trichophyton, Epidermophyton): cause tinea/ringworm; show septate branching hyphae and arthrospores.",
                "Candida albicans: Oval budding yeast cells (pseudohyphae); Germ Tube Test positive (inoculate yeast in human serum at 37°C for 2-3 hours; germ tubes appear as parallel-sided tubular projections without constriction at base).",
                "Cryptococcus neoformans: Encapsulated yeast causing opportunistic cryptococcal meningitis in immunocompromised patients.",
                "India Ink Negative Staining: Ink particles cannot penetrate the thick mucopolysaccharide capsule; yeast appears as a bright refractile halo against a dark jet-black background."
              ],
              benchAlert: "Read the Germ Tube Test at strictly 2 to 3 hours; reading after 4 hours causes true pseudohyphae to form, yielding false-positive identification for non-albicans species.",
              quizzes: [
                {
                  question: "What diagnostic laboratory test provides rapid microscopic demonstration of the prominent polysaccharide capsule of Cryptococcus neoformans in CSF?",
                  options: ["Gram stain", "India ink negative stain preparation", "Acid-fast ZN stain", "Albert's stain"],
                  correctIndex: 1,
                  explanation: "India ink particles are excluded by the large gelatinous capsule, creating a distinct transparent halo around the budding spherical yeast cell."
                }
              ],
              vivaQAs: [
                {
                  question: "Describe the principle and interpretation of the Germ Tube Test for Candida albicans.",
                  answer: "Candida albicans yeast cells form early germ tube outgrowths within 2-3 hours when incubated in human or horse serum at 37°C. A true germ tube has no constriction at its junction with the parent yeast cell.",
                  frequentlyAskedIn: "SMFB Mycology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Classify fungi of medical importance. Describe the laboratory identification of Candida albicans and Cryptococcus neoformans. (Marks: 8)",
                  modelAnswer: "Morphological classification (yeasts, yeast-like, molds, dimorphic), Germ tube protocol, cornmeal agar, and India ink CSF preparation.",
                  marks: 8
                }
              ]
            },
            {
              id: "smic-les-4",
              title: "Lesson 4: Antimicrobial Susceptibility Testing (AST), CLSI & Superbugs (MRSA, ESBL)",
              duration: "35 min",
              notes: [
                "Kirby-Bauer Disc Diffusion Method: Inoculate Mueller-Hinton Agar (MHA, depth exactly 4 mm, pH 7.2-7.4) with bacterial suspension adjusted to 0.5 McFarland turbidity standard (approx 1.5 * 10^8 CFU/mL).",
                "Apply antibiotic discs with sterile forceps; incubate inverted at 35°C for 16-18 hours; measure zone of inhibition in millimeters using a vernier caliper or ruler.",
                "Interpret zone diameters as Susceptible (S), Intermediate (I), or Resistant (R) according to annual CLSI M100 breakpoint tables.",
                "Minimum Inhibitory Concentration (MIC): lowest antimicrobial concentration that prevents visible in vitro bacterial growth (determined by broth microdilution or E-test strip).",
                "Multidrug-Resistant Superbugs:",
                "  - MRSA: Mediated by mecA gene encoding low-affinity PBP2a; detected using Cefoxitin 30 µg disc (zone ≤21 mm).",
                "  - ESBL (Extended-Spectrum Beta-Lactamases): Hydrolyze penicillins, 3rd gen cephalosporins, and monobactams; inhibited by clavulanic acid; confirmed by Double Disc Synergy Test (DDST)."
              ],
              benchAlert: "Mueller-Hinton agar depth must be exactly 4 mm; agar that is too thin gives falsely large inhibition zones, while excessively deep agar produces falsely narrow zones.",
              quizzes: [
                {
                  question: "What is the surrogate antibiotic disc recommended by CLSI for phenotypic detection of Methicillin-Resistant Staphylococcus aureus (MRSA)?",
                  options: ["Penicillin G (10 U)", "Cefoxitin (30 µg)", "Erythromycin (15 µg)", "Gentamicin (10 µg)"],
                  correctIndex: 1,
                  explanation: "Cefoxitin is a potent inducer of the mecA gene and provides superior sensitivity and specificity compared to oxacillin for detecting MRSA."
                }
              ],
              vivaQAs: [
                {
                  question: "What is 0.5 McFarland standard and why is standardizing inoculum density essential in AST?",
                  answer: "0.5 McFarland barium sulfate suspension corresponds to 1.5 * 10^8 CFU/mL. Over-inoculation results in falsely small zones of inhibition (false resistance), while under-inoculation yields falsely large zones.",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Describe the Kirby-Bauer disc diffusion method for antibiotic susceptibility testing. What are MRSA and ESBL? (Marks: 8)",
                  modelAnswer: "MHA preparation, inoculum standardization, disc spacing, CLSI zone interpretation, and resistance mechanisms of mecA and beta-lactamases.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "SFA-403": [
    {
      id: "sfa-mod-1",
      unitNumber: 1,
      title: "Topic 1: Primary & Secondary Healthcare Diagnostic Rotations (UHC & District Hospitals)",
      description: "Clinical diagnostic attachments across Upazila Health Complexes (UHC) and 250-bed District Sadar Hospitals: emergency pathology, peripheral blood film triage, clinical chemistry automation, blood bank transfusion safety, and local disease surveillance.",
      learningOutcomes: [
        "Manage decentralized laboratory operations at Upazila Health Complex (UHC) primary care level.",
        "Perform rapid diagnostic tests (RDTs) for malaria, dengue, Kala-azar, and emergency biochemistry.",
        "Operate automated 3-part/5-part hematology and automated chemistry analyzers in a 250-bed District Hospital.",
        "Execute voluntary blood donor screening, blood component separation, and cross-matching in hospital blood banks.",
        "Compile and submit daily and monthly epidemiological diagnostic surveillance reports to DGHS."
      ],
      subModules: [
        {
          id: "sfa-sub-1-1",
          title: "Sub-Module 1.1: Primary & Secondary Clinical Postings",
          lessons: [
            {
              id: "sfa-les-1",
              title: "Lesson 1: Upazila Health Complex (UHC) Primary Healthcare Diagnostic Workflow",
              duration: "30 min",
              notes: [
                "UHC Diagnostic Scope: Rapid turnaround emergency diagnostic services serving rural and semi-urban populations.",
                "Routine Primary Test Menu: Complete Blood Count (CBC), Routine urine analysis, Blood grouping & cross-matching, Malaria RDT and blood film microscopy, Dengue NS1/IgM, Blood glucose (fasting/2hPP), Sputum AFB staining for national TB control (NTP).",
                "Reagent Cold Chain: Maintenance of 2-8°C refrigerator with digital temperature logging; backup power generator protocols.",
                "Diagnostic Referral SOP: Criteria for transferring complex pathology specimens (histopathology, bone marrow, hormonal panels) to tertiary medical colleges.",
                "Biohazard Waste Disposal: Decentralized autoclave treatment and secure deep burial / sharp pit disposal at primary health facilities."
              ],
              benchAlert: "In primary care emergency shifts, always verify critical panic values (e.g., blood glucose <2.2 mmol/L, Hb <5 g/dL) with an immediate repeat test before calling the medical officer on duty.",
              quizzes: [
                {
                  question: "What is the primary diagnostic priority for sputum examination in a primary Upazila Health Complex (UHC) under national health guidelines?",
                  options: [
                    "Routine bacterial culture and sensitivity",
                    "Ziehl-Neelsen (ZN) staining for Acid-Fast Bacilli (AFB) detection in tuberculosis screening",
                    "Fungal culture on Sabouraud dextrose agar",
                    "Electrophoretic protein fractionation"
                  ],
                  correctIndex: 1,
                  explanation: "Under the National Tuberculosis Control Program (NTP), UHC laboratories serve as primary Designated Microscopy Centers (DMC) for ZN AFB sputum smear examination."
                }
              ],
              vivaQAs: [
                {
                  question: "What are 'critical panic values' in a hospital laboratory and what is the reporting protocol?",
                  answer: "Panic values are test results indicating immediate life-threatening pathophysiology (e.g., K+ >6.5 mmol/L, glucose <40 mg/dL, platelet <20,000/µL). The technologist must verify the result and telephone the treating clinician immediately with read-back confirmation.",
                  frequentlyAskedIn: "SMFB Clinical Internship Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Outline the organizational layout, test menu, and biosafety protocols of an Upazila Health Complex laboratory. (Marks: 8)",
                  modelAnswer: "Primary care diagnostic functions, equipment inventory, cold chain protocols, and emergency on-call workflow.",
                  marks: 8
                }
              ]
            },
            {
              id: "sfa-les-2",
              title: "Lesson 2: District Hospital Pathology Operations & Quality Audits",
              duration: "30 min",
              notes: [
                "Secondary Care Infrastructure: 250-bed District Hospital with dedicated departments: Hematology, Clinical Biochemistry, Medical Microbiology, and Blood Transfusion Center.",
                "Automated Platforms: 5-part differential hematology analyzers, fully automated random-access biochemistry analyzers, and semi-automated coagulation analyzers.",
                "Transfusion Center Operations: Voluntary blood donation drives, component preparation (packed RBCs, FFP, platelet concentrates), mandatory TTI testing, and 24/7 compatibility cross-matching.",
                "Quality Audits: Daily Levey-Jennings QC plotting, Westgard rules implementation, technician competency reviews, and turnaround time (TAT) monitoring.",
                "Infection Control Committee Liaison: Surveillance of surgical site infections (SSI) and antimicrobial resistance monitoring in surgical and ICU wards."
              ],
              benchAlert: "Never release donor blood units if any TTI screening assay shows reactive or indeterminate results; immediately quarantine and discard the unit according to biohazard protocols.",
              quizzes: [
                {
                  question: "At what temperature must Fresh Frozen Plasma (FFP) be stored in a hospital blood bank to preserve labile coagulation factors (Factor V and VIII)?",
                  options: ["2°C to 6°C", "-18°C or colder", "20°C to 24°C with agitation", "Room temperature (25°C)"],
                  correctIndex: 1,
                  explanation: "FFP must be frozen within 8 hours of collection and stored at -18°C or colder (shelf life 1 year) to maintain coagulation factor potency."
                }
              ],
              vivaQAs: [
                {
                  question: "What are the storage temperature and shelf-life requirements of Packed Red Blood Cells (PRBC)?",
                  answer: "Packed red blood cells are stored at 2°C to 6°C in monitored blood bank refrigerators. In CPDA-1 preservative, their shelf-life is 35 days from collection.",
                  frequentlyAskedIn: "SMFB Blood Bank Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Discuss the management and operational workflow of a District Hospital Blood Transfusion Center. (Marks: 8)",
                  modelAnswer: "Donor selection criteria, blood collection protocols, TTI screening, component preparation, cold chain preservation, and cross-matching.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "sfa-mod-2",
      unitNumber: 2,
      title: "Topic 2: Tertiary Healthcare Specialized Attachments & Clinical Logbook Defense",
      description: "Specialized clinical rotations at Medical College Hospitals and National Diagnostic Institutes: surgical histopathology, molecular PCR, therapeutic drug monitoring, clinical logbook certification, and oral board portfolio defense.",
      learningOutcomes: [
        "Rotate through specialized tertiary clinical laboratories (Histopathology, Cytopathology, Immunology, Molecular Diagnostics).",
        "Perform tissue grossing assistance, automated tissue processing, microtome sectioning, and frozen section preparation.",
        "Demonstrate practical proficiency in Real-Time PCR setup, gel electrophoresis, and ELISA immunoassay platforms.",
        "Complete and authenticate all clinical case logs, competency checklists, and faculty mentor signatures in the official SMFB Logbook.",
        "Successfully defend clinical case presentations and practical skills in the final comprehensive SMFB Board Oral Viva."
      ],
      subModules: [
        {
          id: "sfa-sub-2-1",
          title: "Sub-Module 2.1: Tertiary Rotations & Portfolio Verification",
          lessons: [
            {
              id: "sfa-les-3",
              title: "Lesson 3: Tertiary Diagnostic Rotations: Histopathology & Molecular Units",
              duration: "35 min",
              notes: [
                "Tertiary Medical College Hospital: Highest echelon of diagnostic pathology, receiving complex biopsy specimens, specialized bone marrow aspirates, and molecular referrals.",
                "Surgical Histopathology: Assistance in gross room specimen examination, recording surgical dimensions, cassette labeling, vacuum-assisted tissue processing, microtomy, special stains (PAS, Masson's Trichrome, Congo Red, ZN for tissue AFB), and immunohistochemistry (IHC) markers (ER, PR, HER2).",
                "Intraoperative Frozen Section: Tissue freezing at -20°C in cryostat, sectioning at 5-7 µm, rapid H&E staining (under 15 minutes) for surgical tumor margins.",
                "Molecular Pathology: Real-time quantitative PCR for viral loads (HBV DNA, HCV RNA viral loads by TaqMan), GeneXpert MTB/RIF multi-cartridge running, and oncological genetic markers.",
                "Inter-Departmental Clinical Meetings: Correlation of clinicopathological laboratory findings with radiologists, oncologists, surgeons, and internists."
              ],
              benchAlert: "In frozen sections, never allow cryostat temperature to fluctuate above -15°C; warm chucks cause soft tissue compression and severe ice crystal freezing artifacts.",
              quizzes: [
                {
                  question: "What is the primary clinical objective of performing an intraoperative frozen section examination in a tertiary surgical hospital?",
                  options: [
                    "To determine long-term bacterial antibiotic sensitivity",
                    "To assess surgical resection margins and malignancy status rapidly while the patient remains under anesthesia",
                    "To perform routine complete blood count",
                    "To measure serum electrolyte balance"
                  ],
                  correctIndex: 1,
                  explanation: "Frozen section provides rapid (15-20 min) microscopic diagnosis regarding tumor margins and malignancy while surgical resection is in progress."
                }
              ],
              vivaQAs: [
                {
                  question: "What special stain is used in histopathology to demonstrate glycogen, fungi, and basement membranes?",
                  answer: "Periodic Acid-Schiff (PAS) stain. Periodic acid oxidizes glycols to aldehydes, which react with Schiff's reagent to produce a deep magenta-pink color.",
                  frequentlyAskedIn: "SMFB Histopathology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Explain the principle and clinical utility of cryostat frozen sections in tertiary surgical pathology. (Marks: 8)",
                  modelAnswer: "Cryostat mechanics, freezing temperatures (-20°C to -25°C), embedding media (OCT compound), rapid staining protocol, and diagnostic limitations.",
                  marks: 8
                }
              ]
            },
            {
              id: "sfa-les-4",
              title: "Lesson 4: Clinical Logbook Authentication, Portfolio Defense & Board Viva",
              duration: "35 min",
              notes: [
                "SMFB Official Clinical Logbook Structure: Documentation of minimum required clinical procedures performed across 1st to 4th year rotations.",
                "Mandatory Minimum Practical Quotas:",
                "  - Phlebotomy venipunctures performed: ≥100 cases.",
                "  - Complete Blood Counts (CBC) with DLC: ≥200 cases.",
                "  - Routine & microscopic urine examinations: ≥150 cases.",
                "  - Routine stool saline & iodine wet mounts: ≥100 cases.",
                "  - Clinical chemistry assays (Glucose, Creatinine, Bilirubin, Enzymes): ≥250 tests.",
                "  - Gram stains and AFB ZN stains: ≥100 smears each.",
                "  - Blood grouping and compatibility cross-matches: ≥150 units.",
                "  - Histopathology tissue processing and microtomy sections: ≥75 blocks.",
                "Logbook Attestation: Every procedure entry must be authenticated by the respective Senior Medical Technologist and Head of Pathology Department.",
                "Board Viva Voce Defense: Comprehensive defense before external examiners appointed by the State Medical Faculty of Bangladesh (SMFB) and DGHS, covering instrument troubleshooting, clinical correlations, OSPE spotters, and diagnostic ethics."
              ],
              benchAlert: "In the SMFB practical and viva examination, candidate must present the completely signed and attested original logbook; uncertified logbooks disqualify the candidate.",
              quizzes: [
                {
                  question: "What is the consequence of failing to present an authenticated official clinical logbook signed by department heads at the SMFB 4th Year Practical/Viva Examination?",
                  options: [
                    "Candidate is awarded full practical marks automatically",
                    "Candidate is disqualified from appearing in the practical and viva examination",
                    "Candidate is given a 1-year grace period with no consequences",
                    "Only written examination marks are considered"
                  ],
                  correctIndex: 1,
                  explanation: "Under SMFB regulations, the authenticated clinical logbook is mandatory proof of practical training completion required for eligibility."
                }
              ],
              vivaQAs: [
                {
                  question: "How do you defend a high-risk pre-analytical error in blood specimen handling before a clinical audit board?",
                  answer: "Demonstrate knowledge of root-cause analysis, adherence to standard operating procedures (SOPs), immediate recollection protocol, specimen rejection criteria documentation, and preventative training.",
                  frequentlyAskedIn: "SMFB Final Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Discuss the essential professional ethics, legal responsibilities, and quality governance required of a Medical Technologist under DGHS. (Marks: 8)",
                  modelAnswer: "Patient confidentiality, result integrity, biosafety compliance, equipment calibration logs, and adherence to national healthcare guidelines.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
