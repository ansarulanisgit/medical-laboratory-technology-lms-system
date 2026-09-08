// Official State Medical Faculty of Bangladesh (SMFB) Diploma in Medical Laboratory Technology (DMLT)
// 2nd Year Curriculum: PHY-201, CHEM-202, MIC-203, MLS-204, CPH-205

import type { StudyModuleItem } from "../diploma-curriculum-data";

export const DIPLOMA_YEAR2_STUDY_DATA: Record<string, StudyModuleItem[]> = {
  "PHY-201": [
    {
      id: "phy-mod-1",
      unitNumber: 1,
      title: "Topic 1: General Physics, Mechanics & Laboratory Fluid Dynamics",
      description: "Fundamental and derived physical units, dimensions, vectors, force, motion, work, energy, power, gravity, surface tension, and liquid viscosity in diagnostic medical technology.",
      learningOutcomes: [
        "Distinguish between fundamental SI units and derived physical units used in clinical pathology.",
        "Explain the physical principles of surface tension, capillary action, and meniscus formation in pipettes and tubes.",
        "Determine the viscosity of fluids using Ostwald viscometer and relate it to clinical blood rheology.",
        "Perform precision physical measurements using Vernier Callipers and Screw Gauge on laboratory equipment.",
        "Apply principles of centripetal force and sedimentation dynamics in centrifugation protocols."
      ],
      subModules: [
        {
          id: "phy-sub-1-1",
          title: "Sub-Module 1.1: Physical Measurements & Fluid Rheology",
          lessons: [
            {
              id: "phy-les-1",
              title: "Lesson 1: Precision Measurements & Vernier Instruments",
              duration: "25 min",
              notes: [
                "Vernier Constant (least count) is the smallest measurement obtainable with a vernier scale.",
                "Zero error correction is mandatory before recording optical slit width or mechanical dimensions.",
                "Screw Gauge (micrometer) measures microscopic wire gauge and optical lens thicknesses.",
                "Accurate dimensional verification ensures proper fit of centrifuge buckets and spectrophotometer cuvettes."
              ],
              benchAlert: "Always check zero error on calipers before measuring cuvette optical path lengths or mechanical apertures.",
              quizzes: [
                {
                  question: "What is the least count of a standard Vernier caliper where 10 vernier scale divisions equal 9 main scale divisions (1 MSD = 1 mm)?",
                  options: ["0.1 mm", "0.01 mm", "0.05 mm", "1.0 mm"],
                  correctIndex: 0,
                  explanation: "Least Count = 1 MSD - 1 VSD = 1 mm - 0.9 mm = 0.1 mm."
                }
              ],
              vivaQAs: [
                {
                  question: "Define surface tension and its relevance to pipetting clinical fluids.",
                  answer: "Surface tension is the elastic tendency of a fluid surface. It causes meniscus formation and dictates proper eye-level meniscus alignment when calibrating volumetric pipettes.",
                  frequentlyAskedIn: "SMFB Physics Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Define surface tension and viscosity. Describe the Ostwald viscometer method. (Marks: 8)",
                  modelAnswer: "Definitions of surface tension and viscosity coefficient, working principle of Ostwald viscometer with Poiseuille formula.",
                  marks: 8
                }
              ]
            },
            {
              id: "phy-les-2",
              title: "Lesson 2: Viscosity, Capillary Action & Centrifugal Sedimentation",
              duration: "30 min",
              notes: [
                "Viscosity is internal fluid friction resisting laminar flow, defined by Newton's law of viscosity.",
                "Blood viscosity is influenced by hematocrit (PCV), plasma proteins (fibrinogen, immunoglobulins), and temperature.",
                "Capillary action enables micro-hematocrit tube filling without mechanical aspiration.",
                "Centrifugal force (Relative Centrifugal Force - RCF) depends on rotational speed (RPM) and radius: RCF = 1.118 * 10^-5 * r * (RPM)^2."
              ],
              benchAlert: "Centrifuge protocols require matching RCF (g), not just RPM, when transferring protocols between different centrifuge rotor models.",
              quizzes: [
                {
                  question: "Which factor increases whole blood viscosity most significantly?",
                  options: ["Decreased plasma albumin", "Elevated packed cell volume (polycythemia)", "Hypothermia during sampling", "Elevated platelet count alone"],
                  correctIndex: 1,
                  explanation: "Hematocrit (PCV) is the primary physiological determinant of whole blood viscosity."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the difference between RPM and RCF (g) in a laboratory centrifuge?",
                  answer: "RPM is revolutions per minute; RCF is relative centrifugal force exerted on particles relative to Earth's gravity, calculated using rotor radius and RPM squared.",
                  frequentlyAskedIn: "SMFB Practical Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "State the mathematical relationship between RCF and RPM. Why is RCF critical in serum separation? (Marks: 6)",
                  modelAnswer: "RCF = 1.118 * 10^-5 * r * RPM^2. Ensures standardized centrifugal force independent of rotor geometry.",
                  marks: 6
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "phy-mod-2",
      unitNumber: 2,
      title: "Topic 2: Heat, Temperature & Diagnostic Optics",
      description: "Heat transfer, thermal expansion, liquid thermometers, principles of reflection, refraction, lenses, numerical aperture, and light microscopy optics.",
      learningOutcomes: [
        "Explain heat transfer mechanisms (conduction, convection, radiation) in laboratory incubators and water baths.",
        "Calibrate mercury-in-glass and digital thermistor temperature probes for diagnostic incubators.",
        "State Snell's Law of refraction and calculate the refractive index of clinical fluids.",
        "Differentiate between focal length, magnification power, resolving power, and numerical aperture in compound microscopes.",
        "Understand the optical path of brightfield, darkfield, phase-contrast, and fluorescence microscopy."
      ],
      subModules: [
        {
          id: "phy-sub-2-1",
          title: "Sub-Module 2.1: Optical Physics & Microscopy Mechanics",
          lessons: [
            {
              id: "phy-les-3",
              title: "Lesson 3: Lenses, Refraction & Compound Microscope Optics",
              duration: "30 min",
              notes: [
                "Refraction: bending of light passing from one optical medium to another (n1*sin(θ1) = n2*sin(θ2)).",
                "Total magnification = Eyepiece Magnification (10x) * Objective Lens Magnification (10x, 40x, 100x).",
                "Resolving power: minimum distance between two distinguishable points (d = 0.61 * λ / NA).",
                "Numerical Aperture (NA = n * sin(α)): determines light-gathering capacity and resolution.",
                "Cedarwood immersion oil has a refractive index (n = 1.515) identical to crown glass, eliminating light refraction at the coverslip interface."
              ],
              benchAlert: "Never use immersion oil on 40x dry objective lenses; oil seepage damages non-sealed lens cementing compounds.",
              quizzes: [
                {
                  question: "Why is immersion oil required when examining specimens under the 100x oil-immersion objective lens?",
                  options: [
                    "To lubricate the glass coverslip against scratching",
                    "To match the refractive index of glass and prevent loss of light rays by refraction",
                    "To kill any viable bacteria on the glass slide",
                    "To magnify the specimen by an additional 50%"
                  ],
                  correctIndex: 1,
                  explanation: "Immersion oil has a refractive index (n = 1.515) matching glass, preventing total internal reflection and spherical aberration."
                }
              ],
              vivaQAs: [
                {
                  question: "Define resolving power and state Abbe's equation.",
                  answer: "Resolving power is the ability of an optical system to distinguish two adjacent points as distinct entities. Abbe's equation: Limit of resolution d = 0.61 * λ / NA.",
                  frequentlyAskedIn: "SMFB Physics Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Explain the optical construction and path of light in a compound light microscope. Define Numerical Aperture. (Marks: 8)",
                  modelAnswer: "Ray diagram from light source through collector lens, iris diaphragm, Abbe condenser, slide, objective lens, and ocular prism/eyepiece.",
                  marks: 8
                }
              ]
            },
            {
              id: "phy-les-4",
              title: "Lesson 4: Spectrophotometry Optics & Beer-Lambert Principles",
              duration: "30 min",
              notes: [
                "Light spectrum: Ultraviolet (200-400 nm), Visible (400-700 nm), Infrared (>700 nm).",
                "Tungsten halogen lamp provides visible light; Deuterium discharge lamp provides UV light.",
                "Monochromators: prisms or diffraction gratings that isolate narrow wavelength bands (spectral bandwidth).",
                "Beer-Lambert Law: Absorbance A = ε * c * l (where ε = molar absorptivity, c = concentration, l = path length).",
                "Transmittance T = I/I0; Absorbance A = -log10(T) = 2 - log10(%T)."
              ],
              benchAlert: "Dirty, scratched, or fingerprint-smudged cuvettes cause false high absorbance readings due to stray light scattering.",
              quizzes: [
                {
                  question: "If a colored solution allows 10% of incident light to transmit (%T = 10), what is its optical absorbance (OD)?",
                  options: ["0.1", "1.0", "2.0", "0.5"],
                  correctIndex: 1,
                  explanation: "Absorbance A = 2 - log10(%T) = 2 - log10(10) = 2 - 1 = 1.0."
                }
              ],
              vivaQAs: [
                {
                  question: "State the Beer-Lambert Law and its two primary limitations.",
                  answer: "A = ε * c * l. Limitations occur at high solute concentrations (molecular interactions deviate from linearity) and with non-monochromatic light or particulate turbidity.",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2021",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "State Beer-Lambert's Law. Draw a labeled optical diagram of a single-beam spectrophotometer. (Marks: 8)",
                  modelAnswer: "Mathematical derivation, definition of variables, diagram showing light source, entrance slit, monochromator, exit slit, cuvette, and photodetector.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "phy-mod-3",
      unitNumber: 3,
      title: "Topic 3: Electricity, Magnetism & Diagnostic Radiation Safety",
      description: "Electric charge, potential difference, Ohm's law, resistance networks, DC vs AC power, earthing, atomic structure, X-rays, radioactivity, and radiation protection in clinical laboratories.",
      learningOutcomes: [
        "Explain Ohm's Law and calculate voltage, current, and resistance in laboratory equipment circuits.",
        "Describe the protective role of electrical grounding (earthing), circuit breakers, and UPS systems in diagnostic labs.",
        "State the properties of alpha, beta, and gamma radiation.",
        "Describe the production and diagnostic properties of X-rays.",
        "Implement radiation protection principles (Time, Distance, Shielding) and use personal dosimeter badges (TLD)."
      ],
      subModules: [
        {
          id: "phy-sub-3-1",
          title: "Sub-Module 3.1: Electrical Safety & Ionizing Radiation",
          lessons: [
            {
              id: "phy-les-5",
              title: "Lesson 5: Laboratory Electrical Safety, Grounding & Power Regulation",
              duration: "25 min",
              notes: [
                "Ohm's Law: V = I * R. Current is proportional to voltage and inversely proportional to circuit resistance.",
                "Electrical shock hazards occur when human skin contact completes an electrical circuit to ground.",
                "Three-pin plugs: Live (Brown/Red), Neutral (Blue/Black), Earth (Green/Yellow).",
                "Earth grounding diverts stray fault currents safely to Earth, preventing instrument chassis electrocution.",
                "Uninterruptible Power Supply (UPS) prevents data corruption and optical sensor damage during power fluctuations."
              ],
              benchAlert: "Never bypass the third grounding prong on automated clinical analyzers; ungrounded instruments produce electronic noise and shock hazards.",
              quizzes: [
                {
                  question: "What is the primary function of the third (green/yellow) earthing wire in laboratory electrical equipment?",
                  options: [
                    "To increase the voltage supply to sensitive motors",
                    "To ground any stray leakage current and prevent electrical shock to operators",
                    "To complete the primary DC operating circuit",
                    "To cool down the internal transformer during prolonged runs"
                  ],
                  correctIndex: 1,
                  explanation: "Grounding channels hazardous fault current directly to the earth, tripping safety breakers and preventing lethal chassis shocks."
                }
              ],
              vivaQAs: [
                {
                  question: "Why is a stabilized online UPS mandatory for automated chemistry analyzers?",
                  answer: "Power surges, spikes, and brownouts corrupt photometric baselines, damage delicate microcontrollers, and disrupt ongoing sample batches.",
                  frequentlyAskedIn: "SMFB Physics Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Explain Ohm's Law. Describe the importance of earthing and electrical safety in a clinical pathology laboratory. (Marks: 8)",
                  modelAnswer: "Ohm's law statement, mathematical formula, three-pin plug functions, and earthing mechanisms for shock prevention.",
                  marks: 8
                }
              ]
            },
            {
              id: "phy-les-6",
              title: "Lesson 6: Radioactivity, Ionizing Radiation & Radiation Protection",
              duration: "30 min",
              notes: [
                "Radioactivity: spontaneous nuclear decay of unstable isotopes emitting alpha, beta, or gamma rays.",
                "Alpha particles (He nucleus): high ionization, stopped by a sheet of paper.",
                "Beta particles (high-speed electrons): moderate penetration, stopped by thin aluminum sheet.",
                "Gamma rays & X-rays (electromagnetic waves): high penetration, attenuated by thick lead shielding.",
                "Cardinal rules of radiation protection: Time (minimize exposure), Distance (maximize distance - inverse square law), Shielding (lead aprons, lead glass)."
              ],
              benchAlert: "In radioimmunoassay (RIA) and diagnostic imaging environments, always wear a Thermo-Luminescent Dosimeter (TLD) badge at chest level.",
              quizzes: [
                {
                  question: "According to the Inverse Square Law of radiation, doubling your distance from a radioactive source reduces your radiation exposure to:",
                  options: ["One-half (1/2)", "One-fourth (1/4)", "One-eighth (1/8)", "Zero"],
                  correctIndex: 1,
                  explanation: "Radiation intensity follows I = 1/d^2. Doubling distance reduces radiation exposure to (1/2)^2 = 1/4 of the initial dose."
                }
              ],
              vivaQAs: [
                {
                  question: "State the three cardinal principles of radiation protection.",
                  answer: "Time (minimize exposure duration), Distance (maximize distance from source), and Shielding (use lead aprons, barriers, and lead-lined containers).",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Compare alpha, beta, and gamma radiation regarding penetrating power and ionizing ability. State radiation safety rules. (Marks: 8)",
                  modelAnswer: "Comparative table of mass, charge, penetrating power, ionization capacity, and detailed ALARA/time-distance-shielding safety protocols.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "CHEM-202": [
    {
      id: "chem-mod-1",
      unitNumber: 1,
      title: "Topic 1: Inorganic Chemistry, Solutions, Buffers & pH Regulation",
      description: "Atomic structure, chemical bonds, molarity, normality, molality, percent solutions, dilution calculations, acids, bases, buffer systems, and Henderson-Hasselbalch equation.",
      learningOutcomes: [
        "Perform exact chemical calculations for molarity (M), normality (N), and percentage solutions (w/v, v/v).",
        "Prepare primary and secondary standard solutions and perform acid-base titrations.",
        "Explain the Brønsted-Lowry and Arrhenius theories of acids and bases.",
        "Calculate pH and pOH of aqueous solutions using pH = -log[H+].",
        "Explain the physiological importance of buffer systems and prepare clinical phosphate and bicarbonate buffers."
      ],
      subModules: [
        {
          id: "chem-sub-1-1",
          title: "Sub-Module 1.1: Chemical Calculations & Solution Preparation",
          lessons: [
            {
              id: "chem-les-1",
              title: "Lesson 1: Molarity, Normality, Dilutions & Standard Solutions",
              duration: "30 min",
              notes: [
                "Molarity (M) = moles of solute per liter of solution (mol/L) = (mass in grams) / (molecular weight * volume in L).",
                "Normality (N) = gram equivalents of solute per liter of solution = Molarity * valency (n-factor).",
                "For monovalent acids/bases (HCl, NaOH): Normality = Molarity. For divalent (H2SO4, Ca(OH)2): Normality = 2 * Molarity.",
                "Dilution formula: C1 * V1 = C2 * V2.",
                "Primary standard: high purity, stable, non-hygroscopic substance (e.g., anhydrous sodium carbonate, potassium hydrogen phthalate)."
              ],
              benchAlert: "Always add concentrated acid to water slowly with stirring, NEVER add water to concentrated acid (prevents exothermic splashing).",
              quizzes: [
                {
                  question: "How many grams of sodium hydroxide (NaOH, MW = 40 g/mol) are required to prepare 500 mL of a 0.1 M solution?",
                  options: ["4.0 g", "2.0 g", "0.2 g", "20.0 g"],
                  correctIndex: 1,
                  explanation: "Mass = M * MW * V(L) = 0.1 mol/L * 40 g/mol * 0.5 L = 2.0 grams."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the difference between a primary standard and a secondary standard solution?",
                  answer: "A primary standard has high purity (>99.9%), definite composition, and high stability (e.g., Na2CO3). A secondary standard (e.g., NaOH, KMnO4) is unstable or hygroscopic and must be standardized against a primary standard.",
                  frequentlyAskedIn: "SMFB Chemistry Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Define Molarity and Normality. Calculate the amount of H2SO4 (MW=98) required to make 1 liter of 0.1 N solution. (Marks: 6)",
                  modelAnswer: "Definitions, equivalent weight formula (98/2 = 49), and step-by-step calculation: 0.1 * 49 = 4.9 grams.",
                  marks: 6
                }
              ]
            },
            {
              id: "chem-les-2",
              title: "Lesson 2: pH Theory, Buffer Solutions & Henderson-Hasselbalch Equation",
              duration: "30 min",
              notes: [
                "pH = -log10[H+]; neutral pH at 25°C is 7.0 ([H+] = 10^-7 mol/L).",
                "Buffer: solution that resists changes in pH upon addition of small quantities of acid or base.",
                "Composed of a weak acid and its conjugate base (e.g., acetic acid / sodium acetate, carbonic acid / bicarbonate).",
                "Henderson-Hasselbalch equation: pH = pKa + log([Conjugate Base] / [Weak Acid]).",
                "Physiological blood pH is tightly regulated at 7.35 - 7.45 by the bicarbonate-carbonic acid buffer system."
              ],
              benchAlert: "Before measuring specimen or reagent pH, always perform a two-point calibration on the pH meter using pH 4.0 and pH 7.0 (or 10.0) standard buffers.",
              quizzes: [
                {
                  question: "What is the blood plasma ratio of [HCO3-] to dissolved [H2CO3] required to maintain normal physiological pH (7.40)?",
                  options: ["1 : 1", "10 : 1", "20 : 1", "1 : 20"],
                  correctIndex: 2,
                  explanation: "At pH 7.40 with pKa of carbonic acid 6.1: pH = 6.1 + log(20) = 6.1 + 1.3 = 7.40. Ratio is 20:1."
                }
              ],
              vivaQAs: [
                {
                  question: "State the Henderson-Hasselbalch equation and explain its clinical utility.",
                  answer: "pH = pKa + log([A-]/[HA]). It calculates the pH of buffer systems and assesses metabolic acid-base disorders in arterial blood gas analysis.",
                  frequentlyAskedIn: "SMFB Chemistry Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "What is a buffer solution? Derive the Henderson-Hasselbalch equation and describe the bicarbonate buffer of blood. (Marks: 8)",
                  modelAnswer: "Buffer definition, mathematical derivation from acid dissociation constant Ka, and biological equilibrium in erythrocytes and plasma.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "chem-mod-2",
      unitNumber: 2,
      title: "Topic 2: Organic Chemistry Fundamentals & Biomolecules",
      description: "Functional groups, IUPAC nomenclature, structure, properties, and qualitative diagnostic tests for carbohydrates, lipids, amino acids, proteins, and enzymes.",
      learningOutcomes: [
        "Classify organic compounds by functional groups (hydroxyl, carbonyl, carboxyl, amino).",
        "Classify carbohydrates and perform qualitative tests (Benedict's, Molisch, Barfoed's, Iodine).",
        "Classify lipids into simple, compound, and derived lipids; explain saponification and rancidity.",
        "Describe amino acid structure, peptide bonds, and primary/secondary/tertiary/quaternary protein architecture.",
        "Perform protein qualitative reactions (Biuret, Ninhydrin, Heat coagulation) and explain enzyme catalytic kinetics."
      ],
      subModules: [
        {
          id: "chem-sub-2-1",
          title: "Sub-Module 2.1: Carbohydrates, Proteins & Diagnostic Reactions",
          lessons: [
            {
              id: "chem-les-3",
              title: "Lesson 3: Carbohydrate Chemistry & Diagnostic Reduction Tests",
              duration: "30 min",
              notes: [
                "Classification: Monosaccharides (glucose, fructose, galactose), Disaccharides (maltose, lactose, sucrose), Polysaccharides (starch, glycogen, cellulose).",
                "Reducing sugars contain a free or potentially free aldehyde or ketone group (glucose, lactose, maltose; sucrose is non-reducing).",
                "Benedict's test principle: alkaline cupric ions (Cu2+, blue) are reduced by reducing sugars to cuprous oxide (Cu2O, red precipitate).",
                "Molisch test: general test for all carbohydrates using alpha-naphthol and concentrated H2SO4 (purple ring).",
                "Barfoed's test distinguishes reducing monosaccharides (fast reaction <3 min) from reducing disaccharides."
              ],
              benchAlert: "In Benedict's qualitative test, boil for exactly 2 minutes; underheating gives false negatives, and boiling beyond 5 minutes may hydrolyze sucrose.",
              quizzes: [
                {
                  question: "Which of the following carbohydrates is a non-reducing sugar and gives a negative Benedict's test?",
                  options: ["Glucose", "Lactose", "Sucrose", "Maltose"],
                  correctIndex: 2,
                  explanation: "Sucrose has its anomeric carbons involved in glycosidic linkage (α-1,2-glycosidic bond), leaving no free aldehyde or ketone group."
                }
              ],
              vivaQAs: [
                {
                  question: "Explain the biochemical principle of Benedict's test for reducing sugar.",
                  answer: "In mild alkaline conditions with sodium citrate, reducing sugars enolize and reduce blue cupric sulfate (Cu2+) to an insoluble yellow-red cuprous oxide (Cu2O) precipitate.",
                  frequentlyAskedIn: "SMFB Board Chemistry Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Classify carbohydrates with examples. Describe the principle and procedure of Benedict's test. (Marks: 8)",
                  modelAnswer: "Classification tree (mono-, di-, oligo-, polysaccharides), reagent composition (CuSO4, Na2CO3, sodium citrate), and color interpretation chart.",
                  marks: 8
                }
              ]
            },
            {
              id: "chem-les-4",
              title: "Lesson 4: Amino Acids, Protein Structure & Biochemical Color Tests",
              duration: "30 min",
              notes: [
                "Amino acids: α-carbon bonded to amino group (-NH2), carboxyl group (-COOH), hydrogen (-H), and variable side chain (-R).",
                "Peptide bond: covalent amide linkage between α-carboxyl of one amino acid and α-amino of another with loss of water.",
                "Biuret test: copper ions in alkaline medium react with compounds containing two or more peptide bonds to form a violet/purple chelate complex.",
                "Ninhydrin reaction: reacts with free α-amino groups to produce Ruhemann's purple (proline produces yellow color).",
                "Protein denaturation: disruption of secondary, tertiary, and quaternary structure by heat, strong acid, or heavy metals without breaking peptide bonds."
              ],
              benchAlert: "Biuret test requires at least two peptide bonds; free amino acids and dipeptides give a negative Biuret test.",
              quizzes: [
                {
                  question: "What is the minimum number of peptide bonds required in a molecule to give a positive violet Biuret reaction?",
                  options: ["One", "Two", "Four", "Ten"],
                  correctIndex: 1,
                  explanation: "Biuret reagent requires at least two peptide bonds (-CONH-) to coordinate with Cu2+ ions and form the characteristic purple-violet complex."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the principle of the Biuret test used for total protein estimation?",
                  answer: "In an alkaline medium, cupric ions (Cu2+) coordinate with peptide nitrogen atoms of proteins (minimum 2 peptide bonds) to produce a violet-colored chelate complex whose absorbance is read at 540 nm.",
                  frequentlyAskedIn: "SMFB Chemistry Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Describe the four levels of protein structure. Explain the principle and clinical significance of the Biuret test. (Marks: 8)",
                  modelAnswer: "Primary, secondary (α-helix, β-sheet), tertiary, quaternary structures; Biuret reagent mechanism and serum total protein calibration.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "MIC-203": [
    {
      id: "mic2-mod-1",
      unitNumber: 1,
      title: "Topic 1: Bacterial Morphology, Growth Physiology & Culture Media",
      description: "Historical landmarks, bacterial cellular anatomy, Gram-positive vs Gram-negative cell walls, bacterial growth curve, nutritional requirements, and classification of microbiological culture media.",
      learningOutcomes: [
        "Draw and label bacterial cellular ultrastructure (cell wall, plasma membrane, capsule, flagella, pili, endospores).",
        "Explain the structural and chemical differences between Gram-positive and Gram-negative cell walls.",
        "Plot and interpret the four phases of the bacterial growth curve (lag, log/exponential, stationary, decline).",
        "Classify bacteriological culture media into basic, enriched, selective, differential, and transport media.",
        "Prepare, sterilize, and quality-check standard agar plates (Nutrient Agar, Blood Agar, MacConkey Agar)."
      ],
      subModules: [
        {
          id: "mic2-sub-1-1",
          title: "Sub-Module 1.1: Bacterial Architecture & Culture Foundations",
          lessons: [
            {
              id: "mic2-les-1",
              title: "Lesson 1: Bacterial Anatomy & Gram Cell Wall Ultrastructure",
              duration: "30 min",
              notes: [
                "Bacterial cell wall: rigid peptidoglycan (murein) polymer providing osmotic protection and shape.",
                "Gram-positive cell wall: thick multilayered peptidoglycan (20-80 nm) rich in teichoic and lipoteichoic acids.",
                "Gram-negative cell wall: thin peptidoglycan layer (2-7 nm) surrounded by outer membrane with lipopolysaccharide (LPS / endotoxin) and periplasmic space.",
                "Bacterial capsules: antiphagocytic polysaccharide layer (e.g., Streptococcus pneumoniae, Klebsiella pneumoniae).",
                "Endospores: highly resistant dormant survival structures produced by Bacillus and Clostridium species."
              ],
              benchAlert: "Gram-variable staining results occur from using old cultures (>24 hours), over-decolorization with acetone-alcohol, or heavy smear thickness.",
              quizzes: [
                {
                  question: "Which component is exclusively present in the outer membrane of Gram-negative bacteria and functions as an endotoxin?",
                  options: ["Lipoteichoic acid", "Lipopolysaccharide (LPS / Lipid A)", "Peptidoglycan monomer", "Dipicolinic acid"],
                  correctIndex: 1,
                  explanation: "LPS (specifically the Lipid A moiety) is an integral component of the Gram-negative outer membrane and acts as endotoxin."
                }
              ],
              vivaQAs: [
                {
                  question: "Differentiate between Gram-positive and Gram-negative bacterial cell walls.",
                  answer: "Gram-positive walls have a thick peptidoglycan layer and teichoic acid without an outer membrane. Gram-negative walls have thin peptidoglycan, an outer lipid membrane with LPS, and a periplasmic space.",
                  frequentlyAskedIn: "SMFB Microbiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Draw and describe the bacterial cell wall of Gram-positive and Gram-negative bacteria. (Marks: 8)",
                  modelAnswer: "Detailed structural diagrams, chemical composition (peptidoglycan thickness, teichoic acid vs LPS, outer membrane), and Gram reaction mechanism.",
                  marks: 8
                }
              ]
            },
            {
              id: "mic2-les-2",
              title: "Lesson 2: Microbiological Culture Media Classification & Preparation",
              duration: "30 min",
              notes: [
                "Simple/Basal Media: supports non-fastidious organisms (Nutrient Broth, Nutrient Agar, Peptone Water).",
                "Enriched Media: fortified with blood, serum, or egg for fastidious bacteria (Blood Agar, Chocolate Agar, Lowenstein-Jensen).",
                "Selective Media: contains inhibitory substances that suppress unwanted flora (MacConkey Agar contains bile salts and crystal violet; TCBS for Vibrio cholerae).",
                "Differential Media: distinguishes bacterial species via biochemical indicators (MacConkey differentiates lactose fermenters [pink] from non-lactose fermenters [pale]).",
                "Transport Media: maintains pathogen viability without allowing proliferation during specimen transit (Stuart's, Cary-Blair media)."
              ],
              benchAlert: "Allow freshly poured agar plates to solidify and dry inverted in an incubator (37°C for 30 min) to eliminate surface condensation before inoculation.",
              quizzes: [
                {
                  question: "MacConkey Agar functions as which category of microbiological culture medium?",
                  options: ["Enriched only", "Selective and differential medium", "Transport medium", "Strictly anaerobic medium"],
                  correctIndex: 1,
                  explanation: "MacConkey agar selects for Gram-negative bacilli (inhibits Gram-positive via bile salts/crystal violet) and differentiates lactose fermenters (pink) from non-fermenters (pale)."
                }
              ],
              vivaQAs: [
                {
                  question: "What makes MacConkey Agar both selective and differential?",
                  answer: "Selective: Bile salts and crystal violet inhibit Gram-positive organisms. Differential: Lactose and neutral red indicator distinguish lactose fermenters (pink colonies) from non-fermenters (pale colonies).",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Classify culture media with suitable examples. Describe the preparation and utility of Blood Agar. (Marks: 8)",
                  modelAnswer: "Complete classification matrix, Blood Agar formulation (5-10% defibrinated sheep/horse blood added to sterile nutrient agar base at 45-50°C), and hemolytic pattern reading.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mic2-mod-2",
      unitNumber: 2,
      title: "Topic 2: Sterilization, Disinfection & Medical Parasitology",
      description: "Physical and chemical sterilization methods, autoclave thermodynamics, biological indicators, introduction to parasitology, protozoa, and intestinal helminths.",
      learningOutcomes: [
        "Explain the working principles, operating parameters (121°C, 15 psi, 15 min), and monitoring of an autoclave.",
        "Compare dry heat (hot air oven) versus moist heat (steam under pressure) sterilization.",
        "Differentiate between sterilization, disinfection, antisepsis, and asepsis.",
        "Classify medical parasites into Protozoa (amoebae, flagellates, ciliates, sporozoa) and Helminths (nematodes, cestodes, trematodes).",
        "Perform routine stool microscopic examination (saline and iodine wet mounts) and identify common parasites."
      ],
      subModules: [
        {
          id: "mic2-sub-2-1",
          title: "Sub-Module 2.1: Sterilization Protocols & Intestinal Parasites",
          lessons: [
            {
              id: "mic2-les-3",
              title: "Lesson 3: Autoclave Principles, Dry Heat & Sterilization Monitoring",
              duration: "30 min",
              notes: [
                "Autoclave: moist heat under pressure. Standard cycle: 121°C (250°F) at 15 pounds per square inch (psi) gauge pressure for 15 minutes.",
                "Mechanism: steam condenses on cooler items, releasing latent heat of vaporization that denatures and coagulates bacterial enzymes and structural proteins.",
                "Hot Air Oven (dry heat): 160°C for 2 hours or 170°C for 1 hour; used for glassware, dry powders, and anhydrous oils.",
                "Biological indicators: Geobacillus stearothermophilus spores monitor autoclaves; Bacillus atrophaeus (B. subtilis) monitors hot air ovens and ethylene oxide.",
                "Chemical indicators: Browne's tubes, Bowie-Dick tape, and temperature-sensitive autoclave indicator stripes."
              ],
              benchAlert: "Never open the autoclave door until the pressure gauge has completely returned to zero; rapid pressure release causes boiling liquids to violently explode.",
              quizzes: [
                {
                  question: "What is the biological indicator spore organism used to validate the operational efficacy of an autoclave?",
                  options: ["Bacillus anthracis", "Geobacillus stearothermophilus", "Clostridium tetani", "Bacillus atrophaeus"],
                  correctIndex: 1,
                  explanation: "Geobacillus stearothermophilus spores possess high heat resistance (decimal reduction D121°C = 1.5-3 min) and serve as standard autoclave indicators."
                }
              ],
              vivaQAs: [
                {
                  question: "State the standard temperature, pressure, and time parameters of a laboratory autoclave.",
                  answer: "121°C (250°F) at 15 psi (1.05 kg/cm2) pressure for 15 minutes of holding time after complete air evacuation.",
                  frequentlyAskedIn: "SMFB Microbiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Describe the principle, working procedure, and controls of an autoclave. How does it differ from a hot air oven? (Marks: 8)",
                  modelAnswer: "Steam under pressure mechanics, latent heat release, mechanical air discharge cycle, biological/chemical indicators, and comparative table with hot air oven.",
                  marks: 8
                }
              ]
            },
            {
              id: "mic2-les-4",
              title: "Lesson 4: Intestinal Protozoa & Helminths Microscopic Identification",
              duration: "35 min",
              notes: [
                "Entamoeba histolytica: pathogenic amoeba causing amoebic dysentery and liver abscess; trophozoite shows directional pseudopodia with ingested RBCs; mature cyst has 4 nuclei with chromatoid bodies.",
                "Giardia lamblia: flagellate causing malabsorption; trophozoite is pear-shaped with 2 nuclei ('falling leaf' motility); cyst is oval with 4 nuclei and axostyle.",
                "Ascaris lumbricoides: giant roundworm; fertile ovum is round/oval with thick bile-stained mamillated albuminous coat.",
                "Ancylostoma duodenale (Hookworm): oval, colorless, thin transparent shell with 4-8 blastomeres.",
                "Stool wet mount: Saline mount detects motile trophozoites and helminth larvae; Lugol's iodine mount demonstrates nuclear structure of cysts and glycogen masses."
              ],
              benchAlert: "Never use Lugol's iodine for fresh motile trophozoite search; iodine kills amoebic trophozoites instantly and paralyzes motility.",
              quizzes: [
                {
                  question: "Which microscopic feature decisively differentiates pathogenic Entamoeba histolytica from non-pathogenic Entamoeba coli trophozoites?",
                  options: [
                    "Presence of ingested red blood cells (erythrophagocytosis) in trophozoites",
                    "Presence of four flagella",
                    "Ability to produce Gram-positive staining",
                    "Sluggish multi-directional pseudopodia"
                  ],
                  correctIndex: 0,
                  explanation: "Ingested red blood cells inside the trophozoite cytoplasm is diagnostic of invasive Entamoeba histolytica."
                }
              ],
              vivaQAs: [
                {
                  question: "Why do we prepare both saline and iodine wet mounts for stool microscopic examination?",
                  answer: "Saline mount preserves physiological motility of living trophozoites and larvae. Lugol's iodine stains nuclear chromatin, karyosomes, and glycogen vacuoles to confirm cyst identification.",
                  frequentlyAskedIn: "SMFB Parasitology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Draw and describe the microscopic appearance of Entamoeba histolytica cyst and Ascaris lumbricoides fertilized ovum. (Marks: 8)",
                  modelAnswer: "Labeled drawings showing size, nuclear morphology, chromatoid bars in E. histolytica cyst, and thick mamillated bile-stained shell of Ascaris ovum.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "MLS-204": [
    {
      id: "mls-mod-1",
      unitNumber: 1,
      title: "Topic 1: Laboratory Safety, Biosafety Levels & Biomedical Waste Segregation",
      description: "Biosafety levels (BSL-1 to BSL-4), personal protective equipment (PPE), chemical and biohazard spill response, sharps safety, and national color-coded biomedical waste segregation.",
      learningOutcomes: [
        "Classify clinical diagnostic laboratories into Biosafety Levels (BSL-1, BSL-2, BSL-3, BSL-4) based on risk groups.",
        "Demonstrate proper donning and doffing sequences of Personal Protective Equipment (PPE).",
        "Manage a major biological spill using the standard 10% sodium hypochlorite (0.5% available chlorine) protocol.",
        "Segregate biomedical laboratory waste according to national color-coded bins (Yellow, Red, Blue, Black).",
        "Maintain chemical safety, material safety data sheets (MSDS/SDS), and sharps disposal container protocols."
      ],
      subModules: [
        {
          id: "mls-sub-1-1",
          title: "Sub-Module 1.1: Biosafety Standards & Waste Management",
          lessons: [
            {
              id: "mls-les-1",
              title: "Lesson 1: Biosafety Levels, Spill Protocols & PPE Management",
              duration: "30 min",
              notes: [
                "BSL-1: well-characterized agents not causing disease in healthy adults (e.g., non-pathogenic E. coli).",
                "BSL-2: moderate-risk agents causing human disease via percutaneous injury or ingestion (e.g., HBV, HIV, Salmonella); standard diagnostic hospital lab level.",
                "BSL-3: indigenous or exotic agents with potential for aerosol transmission causing serious disease (e.g., Mycobacterium tuberculosis, SARS-CoV-2).",
                "BSL-4: dangerous/exotic agents with high fatality risk and no treatment (e.g., Ebola, Marburg).",
                "Biological Spill Protocol: alert others, don PPE, cover spill with absorbent paper towels, pour freshly prepared 10% sodium hypochlorite (0.5% available chlorine) from outside inward, leave 20-30 min contact time, discard as biohazard waste."
              ],
              benchAlert: "Never recap used needles by hand; use the single-handed scoop technique or immediately drop into a puncture-proof sharps container.",
              quizzes: [
                {
                  question: "What is the recommended contact time for sodium hypochlorite disinfectant during a clinical laboratory biohazard blood spill cleanup?",
                  options: ["1 minute", "5 minutes", "20 to 30 minutes", "2 hours"],
                  correctIndex: 2,
                  explanation: "A minimum contact time of 20-30 minutes ensures inactivation of bloodborne pathogens including Hepatitis B virus and HIV."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the biosafety level of a routine diagnostic hospital laboratory and what primary containment equipment is required?",
                  answer: "Routine diagnostic labs operate at BSL-2. Primary containment requires Class II Biosafety Cabinets (BSC), PPE (gloves, lab coats, eye protection), and autoclave facilities.",
                  frequentlyAskedIn: "SMFB Laboratory Science Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Classify Biosafety Levels (BSL 1-4). Describe the step-by-step management of an infectious blood spill on a laboratory workbench. (Marks: 8)",
                  modelAnswer: "BSL characteristics table, risk group alignment, and the complete paper towel-hypochlorite-contact time-disposal protocol.",
                  marks: 8
                }
              ]
            },
            {
              id: "mls-les-2",
              title: "Lesson 2: Color-Coded Biomedical Waste Segregation & Sharps Disposal",
              duration: "25 min",
              notes: [
                "Yellow Bin (Infectious Anatomical & Pathological): human tissues, organs, body parts, soiled cotton, dressings, gauze.",
                "Red Bin (Infectious Plastic): disposable plastic syringes (without needles), vacutainer plastic sleeves, IV sets, catheters, gloves.",
                "Blue / White Translucent Container (Puncture-proof Sharps): needles, scalpels, lancets, broken contaminated ampoules.",
                "Black Bin (General Non-Infectious): paper packaging, administrative waste, food scraps, clean wrappers.",
                "Sharps container protocol: fill only up to 3/4 capacity; seal permanently and incinerate or autoclave before final disposal."
              ],
              benchAlert: "Never overfill sharps containers beyond the 3/4 full fill line; overfilled containers cause needlestick punctures during routine disposal.",
              quizzes: [
                {
                  question: "In which color-coded biomedical waste bin should blood-soaked cotton swabs and contaminated agar culture plates be discarded?",
                  options: ["Black Bin", "Yellow Bin", "Red Bin", "Blue Bin"],
                  correctIndex: 1,
                  explanation: "Yellow bins are designated for anatomical, pathological, and highly infectious absorbent biohazard waste."
                }
              ],
              vivaQAs: [
                {
                  question: "Explain the national color-coded segregation scheme for hospital laboratory waste.",
                  answer: "Yellow: infectious anatomical and pathological waste; Red: contaminated plastics; Blue/White puncture-proof: sharps and needles; Black: non-infectious general municipal waste.",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Discuss hospital biomedical waste segregation with color codes, waste categories, and final treatment methods. (Marks: 8)",
                  modelAnswer: "Waste category breakdown by Yellow, Red, Blue/White, Black bins, incineration, autoclaving, and shredding methods.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mls-mod-2",
      unitNumber: 2,
      title: "Topic 2: Instrumentation, Phlebotomy & Quality Assurance",
      description: "Spectrophotometers, analytical balances, automated pipettes, centrifuges, venipuncture technique, vacutainer color codes, pre-analytical error control, and Levey-Jennings QC charts.",
      learningOutcomes: [
        "Operate, clean, balance, and maintain laboratory centrifuges and analytical balances.",
        "Calibrate variable volume micropipettes using the gravimetric deionized water weighing method.",
        "Demonstrate standard phlebotomy (venipuncture) procedure and identify correct order of draw for vacutainer tubes.",
        "Identify anticoagulants (EDTA, Sodium Citrate, Heparin, Fluoride-Oxalate) and their modes of action.",
        "Construct Levey-Jennings quality control charts and detect Westgard multirule violations (12s, 13s, 22s, R4s, 10x)."
      ],
      subModules: [
        {
          id: "mls-sub-2-1",
          title: "Sub-Module 2.1: Phlebotomy Protocols & Analytical Quality Assurance",
          lessons: [
            {
              id: "mls-les-3",
              title: "Lesson 3: Phlebotomy Techniques, Vacutainers & Order of Draw",
              duration: "35 min",
              notes: [
                "Venipuncture sites: median cubital vein (primary choice), cephalic vein, basilic vein in antecubital fossa.",
                "Tourniquet application: apply 3-4 inches above venipuncture site; release within 60 seconds to avoid hemoconcentration.",
                "Vacutainer Color Codes & Additives:",
                "  - Light Blue: 3.2% Buffered Sodium Citrate (coagulation tests: PT/INR, APTT; 9:1 blood-to-anticoagulant ratio).",
                "  - Red / Gold (SST): Plain clot activator / Gel separator (serum for biochemistry and serology).",
                "  - Green: Lithium or Sodium Heparin (plasma for emergency chemistry, blood gases).",
                "  - Lavender / Purple: K2/K3 EDTA (chelates calcium; complete blood count CBC, blood grouping).",
                "  - Gray: Sodium Fluoride & Potassium Oxalate (inhibits enolase to stop glycolysis; blood glucose estimation).",
                "Order of Draw: Blood Culture -> Light Blue -> Red/Gold -> Green -> Lavender -> Gray."
              ],
              benchAlert: "Never collect coagulation tubes (Light Blue) after EDTA (Lavender) tubes; EDTA contamination falsely prolongs prothrombin time and depletes calcium.",
              quizzes: [
                {
                  question: "Why is Sodium Fluoride combined with Potassium Oxalate in gray-top vacutainer tubes for blood glucose testing?",
                  options: [
                    "To prevent blood clotting only",
                    "To inhibit the glycolytic enzyme enolase and stabilize blood glucose levels",
                    "To lyse red blood cells and release intracellular glucose",
                    "To preserve platelets for functional assays"
                  ],
                  correctIndex: 1,
                  explanation: "Sodium fluoride inhibits enolase, preventing red blood cells from metabolizing glucose in vitro (which decreases at 5-7% per hour without inhibitor)."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the recommended Order of Draw for evacuated blood collection tubes and why is it critical?",
                  answer: "Blood culture -> Light blue (citrate) -> Red/Gold (clot activator) -> Green (heparin) -> Lavender (EDTA) -> Gray (fluoride). Prevents cross-contamination of additives that distort test results.",
                  frequentlyAskedIn: "SMFB Phlebotomy Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "List common anticoagulants with their mode of action and tube color codes. State the CLSI Order of Draw. (Marks: 8)",
                  modelAnswer: "Table of EDTA, Citrate, Heparin, Fluoride-Oxalate mechanisms, respective tube caps, and clinical justifications for the order of draw.",
                  marks: 8
                }
              ]
            },
            {
              id: "mls-les-4",
              title: "Lesson 4: Quality Control Charts, Westgard Multirules & Micropipette Calibration",
              duration: "30 min",
              notes: [
                "Internal Quality Control (IQC): analyzes control sera with known mean and standard deviation (SD) parallel to patient samples.",
                "Gaussian distribution: Mean ± 1SD contains 68.2% of values, Mean ± 2SD contains 95.5%, Mean ± 3SD contains 99.7%.",
                "Westgard Multirules:",
                "  - 12s (Warning rule): 1 control value exceeds Mean ± 2SD.",
                "  - 13s (Rejection rule): 1 control value exceeds Mean ± 3SD (detects random error).",
                "  - 22s (Rejection rule): 2 consecutive controls exceed Mean + 2SD or Mean - 2SD (detects systematic error).",
                "  - R4s (Rejection rule): 1 control is +2SD and another is -2SD in the same run (range = 4SD; random error).",
                "  - 10x (Rejection rule): 10 consecutive control values fall on one side of the Mean (systematic error / drift).",
                "Gravimetric Pipette Calibration: Weigh 10 aliquots of deionized water on an analytical balance; calculate volume using water density at ambient temperature."
              ],
              benchAlert: "When a Westgard 13s or 22s rejection rule is triggered, halt patient sample testing immediately; investigate calibration, reagents, and instrument optics.",
              quizzes: [
                {
                  question: "Which Westgard quality control rule violation indicates an acute random analytical error?",
                  options: ["10x rule", "22s rule", "13s rule", "41s rule"],
                  correctIndex: 2,
                  explanation: "The 13s rule (a single control measurement exceeding ±3 standard deviations) is a sensitive indicator of random analytical error."
                }
              ],
              vivaQAs: [
                {
                  question: "What is a Levey-Jennings chart and how do you interpret a systematic error (shift vs drift)?",
                  answer: "A Levey-Jennings chart plots daily control results against the mean and ±1SD, ±2SD, ±3SD limits. A 'shift' is an abrupt change of values on one side of the mean; a 'drift' or trend is a gradual continuous movement in one direction.",
                  frequentlyAskedIn: "SMFB Quality Control Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Explain Westgard Multirules (12s, 13s, 22s, R4s). How do you distinguish random error from systematic error? (Marks: 8)",
                  modelAnswer: "Definitions, diagrammatic representations of Levey-Jennings plots with violations, and corrective action protocols.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "CPH-205": [
    {
      id: "cph-mod-1",
      unitNumber: 1,
      title: "Topic 1: Haematopoiesis, Complete Blood Count & Routine Haematology",
      description: "Origin and development of blood cells, erythropoiesis, leukopoiesis, thrombopoiesis, hemoglobin estimation methods, manual hemocytometer cell counts (TLC, RBC), hematocrit (PCV), and ESR.",
      learningOutcomes: [
        "Describe haematopoiesis in bone marrow and trace stages of erythroid, myeloid, and megakaryocytic cell maturation.",
        "Perform hemoglobin estimation by Sahli's acid hematin and Drabkin's Cyanmethemoglobin reference methods.",
        "Perform manual Total Leukocyte Count (TLC) using Improved Neubauer Counting Chamber and Turk's diluting fluid.",
        "Determine Erythrocyte Sedimentation Rate (ESR) using Westergren and Wintrobe methods and discuss clinical significance.",
        "Calculate and interpret Red Cell Indices: Mean Corpuscular Volume (MCV), MCH, and MCHC."
      ],
      subModules: [
        {
          id: "cph-sub-1-1",
          title: "Sub-Module 1.1: Basic Haematological Parameters & Chamber Counting",
          lessons: [
            {
              id: "cph-les-1",
              title: "Lesson 1: Hemoglobin Estimation & Cyanmethemoglobin Reference Method",
              duration: "30 min",
              notes: [
                "Sahli's Acid Hematin Method: blood mixed with 0.1 N HCl forms brown acid hematin; diluted with distilled water until color matches comparator block.",
                "Limitations of Sahli's: carboxyhemoglobin, methemoglobin, and sulfhemoglobin are not converted; subjective visual color matching error (±10%).",
                "Cyanmethemoglobin (HiCN) International Reference Method: Drabkin's solution contains potassium ferricyanide and potassium cyanide.",
                "Reaction: Ferricyanide oxidizes hemoglobin iron (Fe2+ -> Fe3+) to methemoglobin; potassium cyanide converts methemoglobin to stable cyanmethemoglobin.",
                "Absorbance is measured spectrophotometrically at 540 nm against Drabkin's blank; directly proportional to Hb concentration."
              ],
              benchAlert: "Drabkin's reagent contains cyanide; handle with care, never mouth pipette, and store in an amber bottle away from direct sunlight.",
              quizzes: [
                {
                  question: "Why is the Cyanmethemoglobin method preferred over Sahli's acid hematin method for hemoglobin determination?",
                  options: [
                    "It requires no chemical reagents",
                    "It converts all forms of hemoglobin (except sulfhemoglobin) to a stable compound and uses objective spectrophotometric measurement",
                    "It can be completed in less than 5 seconds without dilution",
                    "It is unaffected by severe lipemia or leukocytosis"
                  ],
                  correctIndex: 1,
                  explanation: "The HiCN method is the international standard because it oxidizes nearly all physiological hemoglobins into stable cyanmethemoglobin and is read spectrophotometrically at 540 nm."
                }
              ],
              vivaQAs: [
                {
                  question: "State the composition and principle of Drabkin's reagent for hemoglobin estimation.",
                  answer: "Composition: Potassium ferricyanide (oxidizes Hb to methemoglobin), Potassium cyanide (converts methemoglobin to cyanmethemoglobin), Sodium bicarbonate (maintains pH 7.0-7.4). Absorbance read at 540 nm.",
                  frequentlyAskedIn: "SMFB Haematology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Compare Sahli's and Cyanmethemoglobin methods for Hb estimation. Write the principle and chemical reactions of Drabkin's method. (Marks: 8)",
                  modelAnswer: "Comparative table (accuracy, wavelength, limitations), reaction steps, and clinical reference ranges for adult males and females.",
                  marks: 8
                }
              ]
            },
            {
              id: "cph-les-2",
              title: "Lesson 2: Improved Neubauer Chamber Cell Counting (TLC, RBC) & Red Cell Indices",
              duration: "35 min",
              notes: [
                "Improved Neubauer Chamber: counting grid dimensions 3 mm * 3 mm (9 mm2); depth 0.1 mm; total chamber volume = 0.9 mm3 (0.9 µL).",
                "Total Leukocyte Count (TLC): 20 µL blood + 380 µL Turk's fluid (1:20 dilution); count in 4 large corner squares (each 1 mm2).",
                "Turk's fluid: 1% Glacial Acetic Acid (lyses RBCs) + 1% Gentian Violet (stains WBC nuclei).",
                "TLC formula: Cells/µL = (Counted Cells * Dilution factor 20) / (Area 4 mm2 * Depth 0.1 mm) = Count * 50.",
                "Red Cell Indices formulas:",
                "  - MCV (fL) = (PCV % * 10) / RBC count (millions/µL) [Normal: 80-100 fL].",
                "  - MCH (pg) = (Hb g/dL * 10) / RBC count (millions/µL) [Normal: 27-32 pg].",
                "  - MCHC (g/dL) = (Hb g/dL * 100) / PCV % [Normal: 32-36 g/dL]."
              ],
              benchAlert: "When charging the Neubauer hemocytometer, allow capillary action to fill the chamber; never allow fluid to overflow into the side moats.",
              quizzes: [
                {
                  question: "If 160 white blood cells are counted in the 4 corner squares of an Improved Neubauer chamber using Turk's fluid (1:20 dilution), what is the Total Leukocyte Count (TLC)?",
                  options: ["4,000 /µL", "8,000 /µL", "16,000 /µL", "3,200 /µL"],
                  correctIndex: 1,
                  explanation: "TLC = (160 * 20) / (4 * 0.1) = 160 * 50 = 8,000 /µL (within normal adult reference range 4,000-11,000 /µL)."
                }
              ],
              vivaQAs: [
                {
                  question: "What is Turk's fluid and what is the function of each constituent?",
                  answer: "Turk's fluid contains glacial acetic acid (lyses non-nucleated RBCs), gentian violet or methylene blue (stains leukocyte nuclei), and distilled water.",
                  frequentlyAskedIn: "SMFB Practical Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Draw and label an Improved Neubauer counting chamber. Calculate the mathematical formula for manual TLC. (Marks: 8)",
                  modelAnswer: "Dimensions diagram (3x3 mm grid, 9 large squares, corner square divisions, central square 25 groups of 16 small squares), and complete mathematical derivation.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "cph-mod-2",
      unitNumber: 2,
      title: "Topic 2: Blood Smears, Staining, DLC & Clinical Urine Examination",
      description: "Preparation of peripheral blood films (thin & thick), Romanowsky staining (Leishman, Giemsa), 100-cell Differential Leukocyte Count (DLC), morphological abnormalities of blood cells, and clinical urine examination (routine physical, chemical dipstick, and deposit microscopy).",
      learningOutcomes: [
        "Prepare uniform, feather-edged peripheral blood smears and understand criteria of an ideal thin blood film.",
        "Perform Leishman and Giemsa staining with optimal buffer dilution (pH 6.8).",
        "Perform a 100-cell Differential Leukocyte Count (DLC) and identify neutrophils, lymphocytes, monocytes, eosinophils, and basophils.",
        "Recognize red cell morphological abnormalities (microcytes, macrocytes, hypochromia, spherocytes, sickle cells, target cells).",
        "Perform complete routine and microscopic urine examination (color, clarity, specific gravity, dipstick chemical testing, and urinary sediment microscopy under 10x and 40x)."
      ],
      subModules: [
        {
          id: "cph-sub-2-1",
          title: "Sub-Module 2.1: Blood Smears, DLC & Urine Microscopy",
          lessons: [
            {
              id: "cph-les-3",
              title: "Lesson 3: Blood Smear Staining (Leishman) & Differential Leukocyte Count (DLC)",
              duration: "35 min",
              notes: [
                "Romanowsky stain: neutral stain mixture of oxidized methylene blue (basic stain, azure dyes) and eosin (acidic stain).",
                "Basic components stain acidic cellular structures (nuclei, DNA, RNA blue-purple); acidic components stain basic structures (hemoglobin, eosinophil granules orange-red).",
                "Leishman stain protocol: Flood smear with neat stain for 2 min (fixation by methanol), add equal volume of buffered water (pH 6.8), mix gently, stain for 8-10 min, wash gently with water, dry.",
                "Ideal blood smear: 2/3 length of slide, lateral borders clear, smooth gradient terminating in a single-cell thickness 'feather edge'.",
                "Normal adult DLC: Neutrophils 40-75%, Lymphocytes 20-45%, Monocytes 2-10%, Eosinophils 1-6%, Basophils 0-1%."
              ],
              benchAlert: "Never wash blood films with tap water that has acidic pH; acidic wash water causes over-pink staining where leukocyte nuclei appear pale or washed out.",
              quizzes: [
                {
                  question: "What is the optimal pH of the buffer water used for diluting and washing Leishman stain on peripheral blood films?",
                  options: ["pH 5.4", "pH 6.8", "pH 7.8", "pH 8.5"],
                  correctIndex: 1,
                  explanation: "Buffer pH 6.8 provides optimal differential ionization of eosin and methylene blue, rendering leukocyte nuclei purple and erythrocytes pink."
                }
              ],
              vivaQAs: [
                {
                  question: "What are the characteristics of an ideal peripheral blood film for DLC?",
                  answer: "Covers two-thirds length of the slide, margins visible on all sides, no ridges or air holes, smooth progressive thinning terminating in a uniform feathered edge of monolayer cells.",
                  frequentlyAskedIn: "SMFB Board Haematology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Explain the principle and technique of Leishman staining. Describe the morphology and normal reference values of blood leukocytes. (Marks: 8)",
                  modelAnswer: "Fixation/staining steps, Romanowsky reaction mechanism, detailed morphology (size, nucleus, granules) and DLC reference ranges.",
                  marks: 8
                }
              ]
            },
            {
              id: "cph-les-4",
              title: "Lesson 4: Clinical Urine Analysis: Physical, Chemical & Microscopic Deposits",
              duration: "35 min",
              notes: [
                "Physical Examination: Color (straw/amber; red in hematuria, brown in bilirubinuria), Appearance (clear, turbid), Specific Gravity (1.005-1.030 by refractometer).",
                "Chemical Examination (Reagent Dipstick): pH, protein (protein error of indicators), glucose (glucose oxidase/peroxidase), ketones (nitroprusside reaction), bilirubin (diazo coupling), urobilinogen, nitrite (Gram-negative bacteriuria), leukocyte esterase.",
                "Confirmation tests: Heat and Acetic Acid test / Sulfosalicylic acid (SSA) test for urine protein; Benedict's test for reducing sugar.",
                "Microscopic Examination: Centrifuge 10-12 mL urine at 1,500-2,000 RPM for 5 min; decant supernatant, resuspend deposit, examine under 10x and 40x.",
                "Sediment elements: RBCs (<3/HPF), WBCs (<5/HPF), epithelial cells, Casts (Hyaline, Granular, Cellular, Waxy), Crystals (Calcium oxalate, Uric acid, Triple phosphate)."
              ],
              benchAlert: "Examine fresh urine deposits within 1 hour of voiding; delayed examination leads to RBC lysis, bacterial overgrowth, cast dissolution, and false alkaline pH shift.",
              quizzes: [
                {
                  question: "The presence of red blood cell casts (RBC casts) in urine sediment microscopy is virtually diagnostic of:",
                  options: [
                    "Acute cystitis / bladder infection",
                    "Glomerulonephritis / glomerular bleeding",
                    "Benign prostatic hyperplasia",
                    "Renal stone in the lower ureter"
                  ],
                  correctIndex: 1,
                  explanation: "RBC casts form when red cells entering renal tubules are trapped within Tamm-Horsfall mucoprotein matrix, indicating active glomerulonephritis."
                }
              ],
              vivaQAs: [
                {
                  question: "Describe the principle and procedure of the Heat and Acetic Acid test for proteinuria.",
                  answer: "Fill test tube 2/3 with clear urine. Heat top 1/3 to boiling. Cloudiness indicates protein or phosphates. Add 1-3 drops of 3-5% acetic acid: if cloudiness persists or intensifies, protein is confirmed (phosphates dissolve).",
                  frequentlyAskedIn: "SMFB Clinical Pathology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Discuss complete routine and microscopic examination of urine. Enumerate different casts and crystals found in urine sediment. (Marks: 8)",
                  modelAnswer: "Physical, chemical strip, Heat & Acetic acid test, centrifugation protocol, and detailed microscopic classification of casts and crystals.",
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
