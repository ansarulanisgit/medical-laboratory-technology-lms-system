// Official State Medical Faculty of Bangladesh (SMFB) Diploma in Medical Laboratory Technology (DMLT)
// 3rd Year Curriculum: CC-301, MIC-302, HBT-303

import type { StudyModuleItem } from "../diploma-curriculum-data";

export const DIPLOMA_YEAR3_STUDY_DATA: Record<string, StudyModuleItem[]> = {
  "CC-301": [
    {
      id: "cc-mod-1",
      unitNumber: 1,
      title: "Topic 1: Carbohydrate Metabolism, Blood Glucose & Diabetes Biomarkers",
      description: "Glucose homeostasis, enzymatic glucose oxidase (GOD-POD) method, fasting and 2-hour postprandial blood glucose, Oral Glucose Tolerance Test (OGTT), and Glycated Hemoglobin (HbA1c).",
      learningOutcomes: [
        "Explain the biochemical hormonal regulation of blood glucose by insulin, glucagon, and counter-regulatory hormones.",
        "Perform enzymatic glucose estimation using GOD-POD method and construct standard calibration curves.",
        "Conduct a standardized WHO Oral Glucose Tolerance Test (OGTT) with 75g anhydrous glucose load.",
        "Explain the principle and clinical significance of HbA1c estimation using ion-exchange HPLC and immunoturbidimetry.",
        "Interpret diagnostic blood glucose thresholds for normal, impaired fasting glucose (IFG), impaired glucose tolerance (IGT), and diabetes mellitus."
      ],
      subModules: [
        {
          id: "cc-sub-1-1",
          title: "Sub-Module 1.1: Glucose Kinetics & Glycemic Monitoring",
          lessons: [
            {
              id: "cc-les-1",
              title: "Lesson 1: Enzymatic Glucose Estimation (GOD-POD) & OGTT Protocols",
              duration: "35 min",
              notes: [
                "GOD-POD Reaction:",
                "  Step 1: Glucose + O2 + H2O --(Glucose Oxidase, GOD)--> Gluconic acid + H2O2.",
                "  Step 2: 2 H2O2 + 4-Aminophenazone + Phenol --(Peroxidase, POD)--> Quinoneimine dye (pink-red) + 4 H2O.",
                "Quinoneimine absorbance is measured at 505 nm (green filter) and is directly proportional to glucose concentration.",
                "WHO OGTT Protocol: Patient fasts 8-12 hours; draw fasting blood; administer 75g anhydrous glucose dissolved in 250-300 mL water consumed within 5 min; draw venous blood at 2 hours.",
                "Diagnostic criteria (Venous plasma glucose): Fasting ≥7.0 mmol/L (126 mg/dL) or 2h-post-glucose ≥11.1 mmol/L (200 mg/dL) indicates Diabetes Mellitus."
              ],
              benchAlert: "In OGTT, keep the patient seated and strictly prohibit smoking, caffeine, and physical exertion during the entire 2-hour test interval.",
              quizzes: [
                {
                  question: "What is the chromogen formed in the second step of the GOD-POD glucose assay that absorbs light at 505 nm?",
                  options: ["Acid hematin", "Quinoneimine red-pink dye", "Ruhemann's purple", "Prussian blue"],
                  correctIndex: 1,
                  explanation: "Peroxidase couples hydrogen peroxide with phenol and 4-aminophenazone to form the red-violet quinoneimine chromogen."
                }
              ],
              vivaQAs: [
                {
                  question: "State the principle and reaction mechanism of the GOD-POD method for blood glucose estimation.",
                  answer: "Glucose oxidase converts glucose to gluconic acid and H2O2. Peroxidase then catalyzes the reaction of H2O2 with phenol and 4-aminophenazone to form a pink quinoneimine complex read at 505 nm.",
                  frequentlyAskedIn: "SMFB Clinical Chemistry Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Explain the biochemical principle and procedure of the GOD-POD method. Write the WHO diagnostic criteria for diabetes mellitus. (Marks: 8)",
                  modelAnswer: "Enzymatic reaction equations, reagent composition, incubation parameters (37°C for 10 min), and fasting/OGTT diagnostic reference cutoffs.",
                  marks: 8
                }
              ]
            },
            {
              id: "cc-les-2",
              title: "Lesson 2: Glycated Hemoglobin (HbA1c) & Long-Term Glycemic Control",
              duration: "30 min",
              notes: [
                "HbA1c is formed by non-enzymatic glycation (Maillard reaction) of the N-terminal valine of the hemoglobin beta chain by circulating glucose.",
                "Reflects mean blood glucose concentration over the prior 8 to 12 weeks (erythrocyte lifespan 120 days).",
                "Measurement methodologies: Cation-exchange High Performance Liquid Chromatography (HPLC - gold standard reference) and Latex-enhanced Immunoturbidimetry.",
                "Clinical interpretation (NGSP / DCCT aligned):",
                "  - Normal healthy: <5.7%",
                "  - Prediabetes: 5.7% to 6.4%",
                "  - Diabetes Mellitus: ≥6.5%",
                "  - Good therapeutic glycemic control target in diabetics: <7.0%."
              ],
              benchAlert: "Hemoglobinopathies (HbE, HbS traits) and conditions with shortened RBC lifespan (hemolytic anemias) cause falsely low HbA1c values.",
              quizzes: [
                {
                  question: "What diagnostic threshold of HbA1c meets the criteria for diagnosing Diabetes Mellitus?",
                  options: ["≥5.7%", "≥6.0%", "≥6.5%", "≥7.5%"],
                  correctIndex: 2,
                  explanation: "According to WHO and ADA clinical guidelines, an HbA1c level of ≥6.5% confirms the diagnosis of diabetes mellitus."
                }
              ],
              vivaQAs: [
                {
                  question: "Why does HbA1c reflect blood glucose levels over the preceding 2-3 months rather than daily fluctuations?",
                  answer: "Non-enzymatic glycation of hemoglobin is an irreversible covalent reaction that persists for the entire 120-day lifespan of the red blood cell.",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "What is HbA1c? Describe the principle of HPLC method for its estimation and clinical significance in diabetes management. (Marks: 8)",
                  modelAnswer: "Biochemical formation mechanism, chromatographic separation based on charge differences, NGSP reference targets, and interference factors.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "cc-mod-2",
      unitNumber: 2,
      title: "Topic 2: Renal & Liver Function Tests, Serum Enzymes & Lipid Profiles",
      description: "Serum creatinine (Jaffe's kinetic reaction), blood urea, uric acid, total and direct bilirubin (Jendrassik-Grof), transaminases (ALT/AST), alkaline phosphatase (ALP), total cholesterol, triglycerides, and HDL.",
      learningOutcomes: [
        "Perform kinetic serum creatinine estimation by Jaffe's alkaline picrate method and calculate creatinine clearance.",
        "Estimate blood urea nitrogen (BUN) using enzymatic Berthelot urease method.",
        "Perform serum bilirubin (total and conjugated) estimation by Jendrassik-Grof diazo method and distinguish jaundice types.",
        "Determine catalytic activity of serum enzymes (ALT, AST, ALP) using kinetic rate assays at 340 nm and 405 nm.",
        "Estimate serum total cholesterol and triglycerides enzymatically (CHOD-PAP and GPO-PAP) and calculate LDL cholesterol."
      ],
      subModules: [
        {
          id: "cc-sub-2-1",
          title: "Sub-Module 2.1: Organ Function Panels & Kinetic Enzymology",
          lessons: [
            {
              id: "cc-les-3",
              title: "Lesson 3: Renal Panel: Serum Creatinine (Jaffe's Kinetic) & Urea Urease Assay",
              duration: "35 min",
              notes: [
                "Creatinine: end product of muscle creatine phosphate metabolism; excreted entirely by glomerular filtration without tubular reabsorption.",
                "Jaffe's Kinetic Method: Creatinine reacts with alkaline picrate to form a red-orange Janovski creatinine-picrate complex measured at 492-510 nm.",
                "Kinetic reading (fixed time 20s and 80s) eliminates interference from slow-reacting pseudo-chromogens (proteins, acetoacetate, ascorbic acid).",
                "Normal adult serum creatinine: 0.7 - 1.3 mg/dL (62-115 µmol/L) in males, 0.6 - 1.1 mg/dL in females.",
                "Urea (Berthelot Urease Method): Urease hydrolyzes urea to ammonia and CO2; ammonia reacts with salicylate and hypochlorite to form green indophenol (read at 578 nm)."
              ],
              benchAlert: "In Jaffe's kinetic creatinine assay, strictly control incubation temperature at 37°C; rate of picrate complex development is highly temperature sensitive.",
              quizzes: [
                {
                  question: "Why is a two-point kinetic (fixed time) measurement used instead of an endpoint method in Jaffe's alkaline picrate creatinine assay?",
                  options: [
                    "To speed up the total reaction time to less than 10 seconds",
                    "To eliminate non-specific color interference from slow-reacting non-creatinine chromogens",
                    "Because creatinine picrate is unstable and degrades within 1 minute",
                    "To allow manual visual color matching without a photometer"
                  ],
                  correctIndex: 1,
                  explanation: "Pseudo-chromogens (glucose, ketones, proteins) react slowly with alkaline picrate, while creatinine reacts rapidly between 20 and 80 seconds."
                }
              ],
              vivaQAs: [
                {
                  question: "Explain the biochemical principle of Jaffe's reaction for serum creatinine estimation.",
                  answer: "Creatinine reacts with alkaline picrate in an alkaline medium (NaOH) to produce a yellow-orange/red Janovski complex whose rate of color development is read at 492-510 nm.",
                  frequentlyAskedIn: "SMFB Clinical Chemistry Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Describe the principle and procedure of serum creatinine estimation by Jaffe's kinetic method. What is its clinical significance? (Marks: 8)",
                  modelAnswer: "Reagent components (picric acid + NaOH), timing windows, calculation formula, and clinical correlation with acute kidney injury and chronic kidney disease.",
                  marks: 8
                }
              ]
            },
            {
              id: "cc-les-4",
              title: "Lesson 4: Liver Panel: Bilirubin (Jendrassik-Grof) & Clinical Enzymes (ALT, AST, ALP)",
              duration: "35 min",
              notes: [
                "Bilirubin Fractions: Unconjugated (indirect, water-insoluble, bound to albumin) and Conjugated (direct, water-soluble, glucuronide conjugate).",
                "Jendrassik-Grof Method: Diazotized sulfanilic acid reacts with direct bilirubin to form red azobilirubin. Caffeine-sodium benzoate accelerator dissolves indirect bilirubin to measure Total Bilirubin.",
                "Normal Reference Intervals: Total Bilirubin 0.2 - 1.2 mg/dL, Direct Bilirubin <0.3 mg/dL.",
                "Alanine Aminotransferase (ALT / SGPT): Liver-specific intracellular enzyme; catalyzes alanine + α-ketoglutarate <-> pyruvate + glutamate; pyruvate reduced by NADH/LDH to lactate (ΔA/min at 340 nm).",
                "Alkaline Phosphatase (ALP): Membrane-bound enzyme hydrolyzing p-nitrophenylphosphate (pNPP) to yellow p-nitrophenol at alkaline pH 10.4 (measured at 405 nm)."
              ],
              benchAlert: "Serum samples for bilirubin estimation must be protected from light; direct sunlight or fluorescent light degrades bilirubin via photo-oxidation by up to 50% per hour.",
              quizzes: [
                {
                  question: "In the Jendrassik-Grof method for total bilirubin estimation, what is the chemical role of the caffeine-sodium benzoate reagent?",
                  options: [
                    "Acts as the primary diazo dye chromogen",
                    "Dissociates unconjugated bilirubin from albumin to allow reaction with diazotized sulfanilic acid",
                    "Maintains the pH strictly below 2.0",
                    "Precipitates total serum proteins to clarify the solution"
                  ],
                  correctIndex: 1,
                  explanation: "Caffeine-sodium benzoate accelerates the reaction by displacing unconjugated bilirubin from albumin, enabling it to react with the diazo reagent."
                }
              ],
              vivaQAs: [
                {
                  question: "Differentiate between pre-hepatic, hepatic, and post-hepatic jaundice based on laboratory findings.",
                  answer: "Pre-hepatic (hemolytic): high unconjugated bilirubin, normal AST/ALT, absent urine bilirubin. Hepatic: both unconjugated and conjugated elevated, markedly high AST/ALT. Post-hepatic (obstructive): markedly high conjugated bilirubin, elevated ALP and GGT, positive urine bilirubin.",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Explain the laboratory differentiation of jaundice. Describe the principle of Jendrassik and Grof's method for bilirubin estimation. (Marks: 8)",
                  modelAnswer: "Comparative diagnostic matrix (Bilirubin, ALT, AST, ALP, Urine urobilinogen/bilirubin) and biochemical diazo coupling reactions.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "MIC-302": [
    {
      id: "mic3-mod-1",
      unitNumber: 1,
      title: "Topic 1: Systematic Bacteriology: Gram-Positive & Gram-Negative Pathogens",
      description: "Pathogenic cocci (Staphylococcus aureus, Streptococcus pneumoniae), Enterobacteriaceae (E. coli, Salmonella, Shigella, Proteus), Vibrio cholerae, biochemical identification panels (IMViC, TSI), and Widal agglutination test.",
      learningOutcomes: [
        "Perform catalase, coagulase (slide and tube), and novobiocin susceptibility tests to identify Staphylococci.",
        "Differentiate Streptococci based on hemolysis (alpha, beta, gamma), bacitracin sensitivity, and optochin sensitivity.",
        "Perform and interpret IMViC biochemical tests (Indole, Methyl Red, Voges-Proskauer, Citrate) for Enterobacteriaceae.",
        "Interpret Triple Sugar Iron (TSI) agar slant/butt reactions, gas production, and hydrogen sulfide (H2S) blackening.",
        "Perform the Widal slide and tube agglutination test for typhoid fever and interpret TO and TH antibody titers."
      ],
      subModules: [
        {
          id: "mic3-sub-1-1",
          title: "Sub-Module 1.1: Clinical Bacteriology & Biochemical Identification",
          lessons: [
            {
              id: "mic3-les-1",
              title: "Lesson 1: Staphylococci, Streptococci & Phenotypic Differentiation",
              duration: "35 min",
              notes: [
                "Staphylococcus aureus: Gram-positive cocci in clusters; golden yellow colonies on nutrient agar, beta-hemolytic on blood agar; catalase positive, coagulase positive, mannitol fermenter.",
                "Coagulase Test: Slide coagulase detects bound coagulase (clumping factor); Tube coagulase (rabbit plasma at 37°C for 4 hours) detects free coagulase (gold standard).",
                "Streptococcus: Gram-positive cocci in chains; catalase negative.",
                "  - Streptococcus pyogenes (Group A): beta-hemolytic, sensitive to Bacitracin (0.04 U disc).",
                "  - Streptococcus agalactiae (Group B): CAMP test positive.",
                "  - Streptococcus pneumoniae: alpha-hemolytic (greenish halo), optochin sensitive (disc diameter ≥14 mm), bile soluble."
              ],
              benchAlert: "In the slide coagulase test, always include a saline control on the same slide to rule out autoagglutination.",
              quizzes: [
                {
                  question: "Which microbiological test decisively distinguishes Staphylococcus species (catalase positive) from Streptococcus species (catalase negative)?",
                  options: ["Coagulase test", "Catalase test using 3% hydrogen peroxide", "Gram staining morphology alone", "Oxidase test"],
                  correctIndex: 1,
                  explanation: "The catalase test with 3% H2O2 produces immediate vigorous bubbling (O2 gas) with Staphylococci but no bubbles with Streptococci."
                }
              ],
              vivaQAs: [
                {
                  question: "How do you distinguish Streptococcus pneumoniae from Streptococcus viridans in the laboratory?",
                  answer: "Both produce alpha-hemolysis on blood agar. Streptococcus pneumoniae is sensitive to optochin (ethylhydrocupreine) and soluble in 10% sodium deoxycholate (bile soluble), whereas S. viridans is optochin resistant and bile insoluble.",
                  frequentlyAskedIn: "SMFB Microbiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Discuss laboratory identification of Staphylococcus aureus. How do you differentiate it from other Staphylococci? (Marks: 8)",
                  modelAnswer: "Morphology, colony characters, catalase, tube/slide coagulase tests, mannitol salt agar fermentation, and DNase test.",
                  marks: 8
                }
              ]
            },
            {
              id: "mic3-les-2",
              title: "Lesson 2: Enterobacteriaceae, IMViC Panels & TSI Agar Interpretation",
              duration: "35 min",
              notes: [
                "Enterobacteriaceae: Gram-negative non-sporing bacilli, facultative anaerobes, glucose fermenters, oxidase negative, nitrate reducers.",
                "IMViC Biochemical Profile:",
                "  - Indole (peptone water + Kovac's reagent): Red ring = Positive (E. coli +, Klebsiella -).",
                "  - Methyl Red (mixed acid fermentation, pH <4.4): Red = Positive (E. coli +, Klebsiella -).",
                "  - Voges-Proskauer (acetoin detection via α-naphthol + 40% KOH): Pink/Red = Positive (E. coli -, Klebsiella +).",
                "  - Citrate (Simmons Citrate Agar): Bromothymol blue turns Blue = Positive (E. coli -, Klebsiella +).",
                "  - Summary: E. coli = ++--, Klebsiella pneumoniae = --++.",
                "TSI Agar Reactions (Glucose 0.1%, Lactose 1%, Sucrose 1%, Ferrous sulfate):",
                "  - Yellow butt / Red slant (Alk/Acid): Non-lactose fermenter (Salmonella, Shigella).",
                "  - Yellow butt / Yellow slant (Acid/Acid): Lactose fermenter (E. coli, Klebsiella).",
                "  - Black precipitate in butt: H2S production (Salmonella, Proteus)."
              ],
              benchAlert: "Read TSI slants after 18-24 hours of incubation; prolonged incubation beyond 24 hours can cause false reversion of lactose fermentation to alkaline.",
              quizzes: [
                {
                  question: "What is the characteristic IMViC biochemical reaction pattern of Escherichia coli?",
                  options: ["--++", "++--", "+-+-", "-+-+"],
                  correctIndex: 1,
                  explanation: "E. coli is Indole positive (+), Methyl Red positive (+), Voges-Proskauer negative (-), and Citrate negative (-), giving ++--."
                }
              ],
              vivaQAs: [
                {
                  question: "What sugars are present in Triple Sugar Iron (TSI) agar and in what concentrations?",
                  answer: "Glucose 0.1% (1 part), Lactose 1.0% (10 parts), and Sucrose 1.0% (10 parts). Phenol red serves as pH indicator and ferrous sulfate detects H2S.",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "What are the components of TSI agar? Interpret TSI reactions for E. coli, Salmonella Typhi, and Shigella dysenteriae. (Marks: 8)",
                  modelAnswer: "Component list and concentration rationale, followed by slant/butt, gas, and H2S reaction breakdown for each pathogen.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mic3-mod-2",
      unitNumber: 2,
      title: "Topic 2: Mycobacteriology, Blood & Tissue Parasites",
      description: "Mycobacterium tuberculosis, Acid-Fast Staining (Ziehl-Neelsen), Lowenstein-Jensen (LJ) medium, GeneXpert MTB/RIF, Malaria parasites (Plasmodium spp.), Leishmania donovani, and Wuchereria bancrofti.",
      learningOutcomes: [
        "Perform Ziehl-Neelsen (ZN) acid-fast staining and interpret AFB grading according to WHO/RNTCP guidelines.",
        "Describe the composition, decontamination (Petroff's method), and colony appearance of M. tuberculosis on LJ medium.",
        "Explain the molecular diagnostic principle and operational workflow of GeneXpert MTB/RIF assay.",
        "Prepare thick and thin Giemsa blood smears and identify Plasmodium falciparum and P. vivax stages.",
        "Describe laboratory diagnosis of visceral leishmaniasis (Kala-azar) including bone marrow LD bodies and rK39 strip testing."
      ],
      subModules: [
        {
          id: "mic3-sub-2-1",
          title: "Sub-Module 2.1: Acid-Fast Staining & Vector-Borne Parasites",
          lessons: [
            {
              id: "mic3-les-3",
              title: "Lesson 3: Mycobacterium tuberculosis, ZN Staining & GeneXpert MTB/RIF",
              duration: "35 min",
              notes: [
                "M. tuberculosis cell wall contains high lipid content (60%), primarily mycolic acids, conferring acid-fastness.",
                "Ziehl-Neelsen Staining Technique:",
                "  1. Primary stain: Strong Carbol Fuchsin heated to steaming for 5 min (do not boil).",
                "  2. Decolorization: 20% Sulfuric Acid (H2SO4) or 3% acid-alcohol until smear is faint pink.",
                "  3. Counterstain: 0.3% Methylene Blue or Malachite Green for 1-2 min.",
                "Result: Acid-Fast Bacilli (AFB) stain bright red/pink slender, slightly curved rods; background stains blue/green.",
                "WHO AFB Microscopic Grading: 1+ (10-99 AFB in 100 oil immersion fields), 2+ (1-10 AFB per field in 50 fields), 3+ (>10 AFB per field in 20 fields).",
                "GeneXpert MTB/RIF: Cartridge-based nested real-time PCR targeting rpoB gene; detects M. tuberculosis and rifampicin resistance within 2 hours."
              ],
              benchAlert: "Never allow Carbol Fuchsin to boil or dry out on the slide during steaming; boiling creates dye crystal artifacts that mimic AFB.",
              quizzes: [
                {
                  question: "What concentration of sulfuric acid (H2SO4) is used as the decolorizer in the standard Ziehl-Neelsen staining protocol for M. tuberculosis?",
                  options: ["1%", "5%", "20%", "50%"],
                  correctIndex: 2,
                  explanation: "20% H2SO4 is the standard decolorizer for M. tuberculosis (M. leprae uses 5% H2SO4 and Nocardia uses 1% H2SO4)."
                }
              ],
              vivaQAs: [
                {
                  question: "What causes acid-fastness in Mycobacterium tuberculosis?",
                  answer: "The high content of unsaponifiable mycolic acids in the bacterial cell wall binds carbol fuchsin strongly and resists decolorization by 20% sulfuric acid and alcohol.",
                  frequentlyAskedIn: "SMFB Mycobacteriology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Describe the principle, reagents, procedure, and interpretation of Ziehl-Neelsen staining for AFB. (Marks: 8)",
                  modelAnswer: "Chemical mechanism, heating rationale, decolorization dynamics, RNTCP reporting scale, and morphological features of tubercle bacilli.",
                  marks: 8
                }
              ]
            },
            {
              id: "mic3-les-4",
              title: "Lesson 4: Malaria (Plasmodium spp.) Blood Film Diagnosis & Leishmania donovani",
              duration: "35 min",
              notes: [
                "Malaria blood films: Thick smear for parasite detection/screening (higher sensitivity; lyses RBCs); Thin smear for species identification (fixes RBCs with methanol).",
                "Plasmodium falciparum: delicate small ring forms, multiple rings in single RBC, accole/appliqué forms, double chromatin dots, crescent/banana-shaped gametocytes.",
                "Plasmodium vivax: enlarged amoeboid trophozoites, Schüffner's dots in infected erythrocytes, round/oval gametocytes.",
                "Leishmania donovani: Visceral leishmaniasis (Kala-azar). Amastigote form (LD body) found intracellularly in macrophages of bone marrow, spleen, and liver.",
                "LD Body Morphology: Round to oval, 2-4 µm, contains a large spherical nucleus and a rod-shaped kinetoplast.",
                "rK39 Immunochromatographic Dipstick: recombinant kinesin-related antigen of L. donovani; rapid bedside antibody detection with >98% sensitivity in Bangladesh."
              ],
              benchAlert: "Do not fix the thick blood smear with methanol; fixing preserves the RBC membrane and prevents the mandatory dehemoglobinization required to see parasites.",
              quizzes: [
                {
                  question: "Which morphological feature on a thin peripheral blood film is pathognomonic for Plasmodium falciparum?",
                  options: [
                    "Schüffner's dots in enlarged red cells",
                    "Crescent or banana-shaped gametocytes",
                    "Band-shaped mature trophozoites",
                    "Ziemann's stippling"
                  ],
                  correctIndex: 1,
                  explanation: "Banana or crescent-shaped gametocytes with central pigment and chromatin are unique to Plasmodium falciparum."
                }
              ],
              vivaQAs: [
                {
                  question: "Why do we make both thick and thin blood smears for suspected malaria patients?",
                  answer: "Thick film concentrates 20-30 layers of dehemoglobinized red cells, increasing detection sensitivity 20-fold. Thin film preserves erythrocyte morphology for accurate species differentiation.",
                  frequentlyAskedIn: "SMFB Parasitology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Compare morphological features of Plasmodium vivax and Plasmodium falciparum on peripheral blood films. Describe the rK39 test. (Marks: 8)",
                  modelAnswer: "Comparative table (RBC size, trophozoite ring shape, stippling, gametocyte shape), and rK39 recombinant antigen immunochromatography mechanism.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "HBT-303": [
    {
      id: "hbt-mod-1",
      unitNumber: 1,
      title: "Topic 1: Histotechnology, Tissue Processing & H&E Staining",
      description: "Biopsy receipt, fixatives (10% neutral buffered formalin), tissue processing stages (dehydration, clearing, impregnation, embedding), rotary microtomy, and Hematoxylin & Eosin (H&E) staining.",
      learningOutcomes: [
        "Explain the mechanisms of tissue fixation and prepare 10% Neutral Buffered Formalin (NBF).",
        "Describe the automatic tissue processor stages: dehydration (graded alcohols), clearing (xylene), and wax impregnation.",
        "Demonstrate tissue block casting, embedding orientation, and rotary microtome section cutting at 3-5 µm.",
        "Perform Hematoxylin and Eosin (H&E) regressive staining and explain nuclear vs cytoplasmic dyeing mechanisms.",
        "Identify and troubleshoot histopathology processing artifacts (chatter, tearing, poor clearing, over-staining)."
      ],
      subModules: [
        {
          id: "hbt-sub-1-1",
          title: "Sub-Module 1.1: Histological Workflow & Microtomy",
          lessons: [
            {
              id: "hbt-les-1",
              title: "Lesson 1: Tissue Fixation, Processing Cycle & Paraffin Embedding",
              duration: "35 min",
              notes: [
                "Fixation: prevents autolysis and bacterial putrefaction, hardens soft tissue, and coagulates proteins for staining.",
                "10% Neutral Buffered Formalin (NBF): 4% formaldehyde buffered with sodium phosphates to pH 6.8-7.0 (ideal fixative-to-tissue ratio is 20:1; penetrates at 1 mm/hour).",
                "Tissue Processing Workflow:",
                "  1. Dehydration: ascending grades of ethanol (70%, 80%, 95%, 100% absolute) to remove water without cell shrinkage.",
                "  2. Clearing: Xylene (miscible with alcohol and paraffin wax; makes tissue translucent).",
                "  3. Impregnation: molten paraffin wax (melting point 56-58°C) in three changes under vacuum.",
                "  4. Embedding: casting tissue in metal Leuckhart molds / plastic cassettes with precise anatomical orientation.",
                "Section Cutting: Rotary microtome with disposable steel blade set at 3-5 µm thickness; ribbons floated on warm water bath (45-48°C) and mounted on egg albumin coated slides."
              ],
              benchAlert: "Never allow paraffin wax bath temperatures to exceed 60°C; excessive heat causes brittle tissue that crumbles and tears during sectioning.",
              quizzes: [
                {
                  question: "What is the recommended volume ratio of fixative (10% NBF) to tissue specimen for optimal histological preservation?",
                  options: ["1 : 1", "5 : 1", "20 : 1", "50 : 1"],
                  correctIndex: 2,
                  explanation: "A fixative-to-tissue volume ratio of at least 20:1 ensures adequate chemical penetration and prevents reagent exhaustion."
                }
              ],
              vivaQAs: [
                {
                  question: "Why is xylene called a 'clearing agent' in tissue processing?",
                  answer: "Xylene raises the refractive index of dehydrated tissue, rendering it translucent (clear), and acts as a mutual solvent miscible with both alcohol and paraffin wax.",
                  frequentlyAskedIn: "SMFB Histopathology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Discuss the step-by-step processing of tissue from surgical biopsy to paraffin block. (Marks: 8)",
                  modelAnswer: "Detailed timeline and chemical actions of fixation, graded alcohol dehydration, xylene clearing, paraffin impregnation, and orientation during casting.",
                  marks: 8
                }
              ]
            },
            {
              id: "hbt-les-2",
              title: "Lesson 2: Hematoxylin & Eosin (H&E) Staining & Microtome Troubleshooting",
              duration: "35 min",
              notes: [
                "Hematoxylin: natural dye extracted from logwood (Haematoxylum campechianum); oxidized to hematein and mordanted with aluminum ions (Harris hematoxylin) to stain acidic chromatin/DNA blue-purple.",
                "Differentiation: brief dip in 1% acid-alcohol (0.5-1% HCl in 70% alcohol) to remove excess background hematoxylin (regressive method).",
                "Bluing: alkaline wash with running tap water or Scott's tap water substitute (converts red-purple soluble lake to insoluble blue lake).",
                "Counterstain: 1% alcoholic or aqueous Eosin Y; acidic dye staining basic cytoplasm, collagen, and RBCs shades of pink and red.",
                "Dehydration, Clearing & Mounting: ascending alcohols, xylene, and DPX (Dibutylphthalate Polystyrene Xylene) synthetic resin mountant.",
                "Microtome faults: Chatter/venetian blinds (loose blade or specimen block; knife tilt angle too large); Scoring/scratches (nicked knife blade or hard calcified tissue)."
              ],
              benchAlert: "Ensure complete removal of xylene before placing slides in hematoxylin (deparaffinize through xylene then descending alcohols to water); residual wax prevents aqueous staining.",
              quizzes: [
                {
                  question: "What chemical solution is routinely used for 'bluing' hematoxylin-stained tissue sections?",
                  options: ["1% Acid alcohol", "Scott's tap water substitute or mild alkaline water", "Absolute xylene", "Pure acetone"],
                  correctIndex: 1,
                  explanation: "Alkaline pH (from tap water or Scott's substitute containing sodium bicarbonate and magnesium sulfate) converts soluble red hematein-aluminum lake into insoluble deep blue lake."
                }
              ],
              vivaQAs: [
                {
                  question: "State the color results of different tissue structures stained by routine Hematoxylin and Eosin (H&E).",
                  answer: "Nuclei: deep blue/purple; Cytoplasm: pink; Muscle fibers: deep pink; Collagen: pale pink; Red blood cells: bright orange/red.",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Write down the step-by-step procedure of Hematoxylin and Eosin (H&E) staining. What is differentiation and bluing? (Marks: 8)",
                  modelAnswer: "Complete deparaffinization, hydration, staining, differentiation, bluing, dehydration, clearing, and DPX coverslipping protocol.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "hbt-mod-2",
      unitNumber: 2,
      title: "Topic 2: Immunohematology, Blood Grouping & Transfusion Safety",
      description: "ABO and Rh(D) systems, Landsteiner's law, forward and reverse grouping, Coombs (Antiglobulin) test, compatibility cross-matching, transfusion-transmitted infections (TTI), and component therapy.",
      learningOutcomes: [
        "Explain Landsteiner's Law and perform forward (front) and reverse (back) ABO blood grouping using tube and tile methods.",
        "Determine Rh(D) status, identify weak D (Du) variant, and explain the mechanism of Hemolytic Disease of the Fetus and Newborn (HDFN).",
        "Perform Direct Antiglobulin Test (DAT) and Indirect Antiglobulin Test (IAT) using Coombs reagent.",
        "Execute major and minor cross-matching (saline, albumin, and AHG phases) prior to blood transfusion.",
        "Screen donor units for mandatory Transfusion Transmitted Infections (HIV, HBV, HCV, Syphilis, Malaria) and manage transfusion reactions."
      ],
      subModules: [
        {
          id: "hbt-sub-2-1",
          title: "Sub-Module 2.1: Blood Bank Serology & Cross-Matching",
          lessons: [
            {
              id: "hbt-les-3",
              title: "Lesson 3: ABO & Rh(D) Typing, Landsteiner's Rule & Coombs Test",
              duration: "35 min",
              notes: [
                "Landsteiner's Law: If an agglutinogen (antigen) is present on RBCs, corresponding agglutinin (antibody) must be absent from plasma; if antigen is absent, corresponding antibody is present.",
                "Forward Grouping (Front): Patient's 2-5% red cell suspension tested with known monoclonal Anti-A, Anti-B, Anti-D antisera.",
                "Reverse Grouping (Back): Patient's serum tested with known pooled standard A-cells, B-cells, and O-cells (mandatory confirmation).",
                "Direct Coombs Test (DAT): detects in vivo sensitization of RBCs by IgG antibodies or C3 complement (e.g., HDN, AIHA, acute hemolytic reaction).",
                "Indirect Coombs Test (IAT): detects in vitro unexpected irregular antibodies in patient serum (used in antibody screening and donor cross-match)."
              ],
              benchAlert: "Never perform ABO grouping on serum or cells alone; forward and reverse grouping results must match 100% before releasing patient blood group.",
              quizzes: [
                {
                  question: "Which test is used to detect in vivo coating of fetal red blood cells by maternal anti-D IgG antibodies in Hemolytic Disease of the Newborn (HDN)?",
                  options: ["Indirect Antiglobulin Test (IAT)", "Direct Antiglobulin Test (DAT / Direct Coombs)", "Reverse blood grouping", "Widal agglutination test"],
                  correctIndex: 1,
                  explanation: "The Direct Coombs Test detects antibodies already bound to circulating infant RBCs in vivo."
                }
              ],
              vivaQAs: [
                {
                  question: "State Landsteiner's Rule and describe why forward and reverse grouping are both necessary.",
                  answer: "Landsteiner's rule governs reciprocal presence of antigens on red cells and antibodies in serum. Performing both front and back typing eliminates ABO discrepancy errors caused by missing antibodies, cold agglutinins, or subgroup variants.",
                  frequentlyAskedIn: "SMFB Immunohematology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Discuss ABO and Rh blood grouping methods. Describe the principle and technique of the Direct and Indirect Coombs test. (Marks: 8)",
                  modelAnswer: "Tube method protocol, monoclonal reagent interpretation, DAT vs IAT indication matrix, and AHG bridging mechanism.",
                  marks: 8
                }
              ]
            },
            {
              id: "hbt-les-4",
              title: "Lesson 4: Cross-Matching Protocols, TTI Screening & Transfusion Reactions",
              duration: "35 min",
              notes: [
                "Major Cross-Match: Donor 5% red cells + Recipient serum (detects recipient antibodies against donor cells; most critical compatibility test).",
                "Minor Cross-Match: Recipient red cells + Donor serum (detects donor antibodies against recipient cells).",
                "Compatibility Phases: Saline room temperature (detects IgM complete cold antibodies), 37°C incubation (detects warm antibodies), AHG Coombs phase (detects incomplete IgG non-agglutinating antibodies).",
                "Mandatory TTI Screening: HIV 1 & 2 antibodies/p24, Hepatitis B surface antigen (HBsAg), Hepatitis C virus (HCV), Treponema pallidum (Syphilis - VDRL/TPHA), Malaria parasites (blood film/RDT).",
                "Acute Hemolytic Transfusion Reaction: Caused by ABO incompatibility; sudden onset fever, chills, flank pain, dyspnea, hemoglobinuria, hypotension; immediately stop transfusion, maintain IV line with saline, and send donor unit and post-transfusion patient blood to blood bank for repeat testing."
              ],
              benchAlert: "If a patient exhibits fever, chills, or tachycardia during blood transfusion, stop the transfusion immediately; never slow down the rate or wait.",
              quizzes: [
                {
                  question: "What components are combined in the Major Compatibility Cross-Match?",
                  options: [
                    "Donor serum + Recipient red cells",
                    "Donor red cells + Recipient serum",
                    "Donor serum + Recipient serum",
                    "Donor red cells + Anti-D serum"
                  ],
                  correctIndex: 1,
                  explanation: "The major cross-match combines donor red cells with recipient serum to verify that recipient circulating antibodies will not lyse transfused donor erythrocytes."
                }
              ],
              vivaQAs: [
                {
                  question: "What immediate steps must a medical technologist take when an acute transfusion reaction is reported from the hospital ward?",
                  answer: "1. Confirm transfusion is stopped immediately. 2. Verify patient identification and unit barcode labels. 3. Collect post-transfusion EDTA and clotted blood from patient. 4. Perform visual check for plasma hemoglobin/hemolysis. 5. Repeat ABO/Rh and cross-match on pre- and post-transfusion samples.",
                  frequentlyAskedIn: "SMFB Blood Bank Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Explain Major and Minor cross-matching techniques. What are the mandatory screening tests performed on donor blood in Bangladesh? (Marks: 8)",
                  modelAnswer: "Full cross-match protocol across saline, 37°C, and AHG phases, and the 5 statutory TTI screening assays under National Safe Blood Transfusion Program.",
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
