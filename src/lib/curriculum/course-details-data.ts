import { CURRICULUM_SUBJECTS_CATALOG, SubjectModule } from "./academic-context";
import { DIPLOMA_STUDY_CENTER_DATA } from "./diploma-curriculum-data";

export interface CurriculumLessonItem {
  id: string;
  title: string;
  duration: string;
  practicalComponent?: string;
  keyCompetencies: string[];
}

export interface CurriculumSubModule {
  id: string;
  title: string;
  topics: string[];
  lessons: CurriculumLessonItem[];
}

export interface CurriculumModule {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  learningOutcomes: string[];
  subModules: CurriculumSubModule[];
}

export interface AssessmentScheme {
  totalMarks: number;
  passPercentage: number;
  writtenExamMarks: number;
  writtenExamStructure: string;
  practicalMarks: number;
  practicalOSPEStructure: string;
  vivaMarks: number;
  vivaStructure: string;
  continuousAssessmentMarks: number;
  continuousStructure: string;
}

export interface TextbookReference {
  title: string;
  author: string;
  edition: string;
  type: "Primary Textbook" | "Reference Manual" | "Laboratory Guide";
  description: string;
}

export interface CourseCurriculumDetail {
  code: string;
  name: string;
  program: "DIPLOMA" | "BSC";
  year: string;
  semester?: string;
  curriculumVersion: string;
  accreditationBody: string;
  shortBrief: string;
  detailedOverview: string;
  courseAims: string[];
  totalUnits: number;
  totalLessons: number;
  progress: number;
  assessment: AssessmentScheme;
  modules: CurriculumModule[];
  textbooks: TextbookReference[];
  pdfUrl?: string;
  totalHours?: number;
  lectureHours?: number;
  practicalHours?: number;
  teachingMethods?: string[];
  teachingAids?: string[];
}

// Detailed course curriculums with realistic Bangladesh MLT syllabi
const DETAILED_COURSE_DATA: Record<string, Partial<CourseCurriculumDetail>> = {
  "ENG-101": {
    code: "ENG-101",
    name: "Basic English Language Course",
    program: "DIPLOMA",
    year: "1",
    curriculumVersion: "DMT-2023-V1",
    accreditationBody: "State Medical Faculty of Bangladesh",
    shortBrief: "Official SMFB curriculum covering Grammar, Translation, Technical Descriptions, Reports of Observation, and Communicative English (Reading, Writing, Listening, Speaking).",
    detailedOverview: "The Basic English Language Course is a core foundation curriculum mandated by the State Medical Faculty of Bangladesh (SMFB) for 1st Year Diploma in Medical Laboratory Technology students. Spanning 220 total hours (60 hours lecture, 160 hours tutorial/practical), this course develops linguistic mastery across the four key communicative dimensions: Reading, Writing, Listening, and Speaking. Trainees learn to construct grammatically sound scientific sentences, translate accurately between Bengali and English, interpret equipment working manuals and diagnostic publications, author structured observation reports in hospital wards, clinics, and laboratories, and communicate fluently with clinicians, colleagues, and examination boards.",
    pdfUrl: "/curriculum/Basic_English_Language_Course_Syllabus.pdf",
    totalHours: 220,
    lectureHours: 60,
    practicalHours: 160,
    teachingMethods: [
      "Lectures with visual illustrations",
      "Tutorials & communicative practice sessions",
      "Group discussions on public health & environment",
      "Practical listening to audio recorded dialogues",
      "Drafting clinical observation & incident reports",
    ],
    teachingAids: [
      "Blackboard / Chalk & Whiteboard / Marker",
      "Multimedia projector & laptop",
      "Overhead projector (OHP) & transparencies",
      "Wall charts & educational paper handouts",
      "Audio recorder & authentic reading materials / scientific manuals",
    ],
    courseAims: [
      "Read, write and listen effectively across clinical laboratory and academic medical environments.",
      "Improve handwriting and spelling of specialized diagnostic terminology and general English vocabulary.",
      "Use idioms, scientific names etc. properly including elementary knowledge of conjugation, punctuation, and sentence correction.",
      "Do conversation in English fluently with patients, clinical pathologists, healthcare staff, and examiners.",
      "Read, understand and interpret any diagnostic reports, scientific instrument working manuals, lecture sheets, and medical publications.",
      "Write essays, summaries & paragraphs on basic medical subjects and contemporary public health issues.",
      "Write comprehensive reports of observation in the laboratory, hospital ward, clinic, or community field.",
    ],
    assessment: {
      totalMarks: 100,
      passPercentage: 50,
      writtenExamMarks: 75,
      writtenExamStructure: "Written Examination Paper (75 Marks): Part-I Grammar (Subjects & Predicate, Parts of Speech, Tenses, Prepositions, Punctuation, Spelling, Correction), Translation (Bengali-English), Short Story & Technical Description, Paragraph & Report Writing, and Part-II Communicative SAQs (Reading & Writing).",
      practicalMarks: 0,
      practicalOSPEStructure: "Integrated into Communicative Practical & Oral Viva Voce Examination.",
      vivaMarks: 25,
      vivaStructure: "Communicative Oral / Practical & Board Viva (25 Marks): Spoken conversation fluency, reading aloud and interpreting scientific manuals, listening comprehension, and oral viva voce.",
      continuousAssessmentMarks: 0,
      continuousStructure: "Continuous tutorial participation, handwriting log, and classroom group discussions.",
    },
    textbooks: [
      {
        title: "High School English Grammar and Composition",
        author: "P. C. Wren & H. Martin",
        edition: "Revised Edition, S. Chand Publishing",
        type: "Primary Textbook",
        description: "Standard foundation reference for parts of speech, syntax, conjugation, punctuation, and structural sentence correction.",
      },
      {
        title: "Basic English Language Course Official Curriculum Manual",
        author: "State Medical Faculty of Bangladesh (SMFB)",
        edition: "Official Curriculum Publication (Pages 10-12)",
        type: "Reference Manual",
        description: "Prescribed national curriculum guidelines for medical technologists covering grammar, translation, and communication.",
      },
      {
        title: "English for Medical and Laboratory Professionals",
        author: "Ros Wright & Marie McCullagh",
        edition: "Cambridge Professional English",
        type: "Reference Manual",
        description: "Technical descriptions, patient communication dialogues, and clinical observation report templates.",
      },
    ],
    modules: [
      {
        id: "eng-mod-1",
        unitNumber: 1,
        title: "Module 1: Foundation English Grammar, Syntax & Scientific Nomenclature (Part-I a, b)",
        description: "Subjects and predicate, parts of speech classification, tenses, conjugation, prepositions, punctuation rules, spelling improvement, idioms, and sentence correction.",
        learningOutcomes: [
          "Identify subjects and predicates in complex medical sentences.",
          "Classify nouns, pronouns, adjectives, verbs, and adverbs accurately.",
          "Apply correct verb conjugation and tense agreement in laboratory protocols.",
          "Master punctuation rules: capitalization, comma, semicolon, colon, hyphen, and underlining.",
          "Correct wrong words, spelling errors, and use scientific nomenclature and idioms properly.",
        ],
        subModules: [
          {
            id: "eng-sub-1-1",
            title: "Component 1.1: Sentence Structure & Parts of Speech Classification",
            topics: [
              "Subjects & Predicate: Sentence anatomy, clauses, and sentence types",
              "Nouns & Their Classification: Proper, common, collective, abstract, countable and uncountable nouns in pathology",
              "Pronouns & Their Classification: Personal, demonstrative, relative, interrogative, and reflexive pronouns",
              "Adjectives & Their Classification: Descriptive, quantitative, demonstrative, and comparative adjectives",
              "Verbs & Adverbs: Transitive, intransitive, auxiliary, and modal verbs; adverbs of manner, time, and degree",
            ],
            lessons: [
              {
                id: "eng-les-1-1-1",
                title: "Lesson 1: Subjects & Predicate, Sentence Anatomy & Word Order",
                duration: "25 min",
                practicalComponent: "Sentence dissection worksheet and clinical sentence re-ordering drills.",
                keyCompetencies: ["Sentence structure analysis", "Word order mastery", "Grammatical subject identification"],
              },
              {
                id: "eng-les-1-1-2",
                title: "Lesson 2: Nouns, Pronouns, Adjectives & Clinical Descriptions",
                duration: "30 min",
                practicalComponent: "Classifying laboratory reagents, specimens, and patient pronouns in clinical notes.",
                keyCompetencies: ["Parts of speech categorization", "Descriptive adjective application", "Pronoun antecedent clarity"],
              },
              {
                id: "eng-les-1-1-3",
                title: "Lesson 3: Verbs, Adverbs, Articles & Essential Prepositions",
                duration: "30 min",
                practicalComponent: "Action verb drills in laboratory SOP instructions and preposition accuracy exercises.",
                keyCompetencies: ["Active and passive verb mastery", "Definite/indefinite articles", "Directional and temporal prepositions"],
              },
            ],
          },
          {
            id: "eng-sub-1-2",
            title: "Component 1.2: Tenses, Conjugation, Punctuation & Orthography",
            topics: [
              "Tenses & Verb Conjugation: Present, past, future tenses; regular and irregular verb forms",
              "Preposition Usage: In, on, at, by, for, with, under, across in clinical directions",
              "Punctuation & Mechanics: Capitalization, sentence fragments, end punctuation, comma, semicolon, colon, hyphen, and underlining",
              "Spelling & Orthography: Phonetic rules, silent letters, medical prefixes, and suffixes",
              "Idioms, Scientific Names & Wrong Words: Common errors, scientific binomial nomenclature, and sentence correction",
            ],
            lessons: [
              {
                id: "eng-les-1-2-1",
                title: "Lesson 4: Tense Concordance & Conjugation of Regular & Irregular Verbs",
                duration: "30 min",
                practicalComponent: "Transforming present continuous procedures into past simple completed test reports.",
                keyCompetencies: ["Tense concordance", "Irregular verb conjugation", "Laboratory test reporting syntax"],
              },
              {
                id: "eng-les-1-2-2",
                title: "Lesson 5: Punctuation Rules: Capitalization, Commas, Colons, Semicolons & Hyphens",
                duration: "25 min",
                practicalComponent: "Punctuating unformatted diagnostic laboratory text and capitalizing scientific terminology.",
                keyCompetencies: ["Standard punctuation mechanics", "Scientific text capitalization", "Preventing ambiguous sentence fragments"],
              },
              {
                id: "eng-les-1-2-3",
                title: "Lesson 6: Spelling Rules, Idiomatic Expressions & Correction of Wrong Words",
                duration: "30 min",
                practicalComponent: "Spelling bee drills on medical terminology and error-detection exercises.",
                keyCompetencies: ["Spelling accuracy", "Idiomatic phrasing", "Scientific name formatting (italics/underlining)"],
              },
            ],
          },
        ],
      },
      {
        id: "eng-mod-2",
        unitNumber: 2,
        title: "Module 2: Translation, Comprehension & Thematic Group Discussion (Part-I c, e)",
        description: "Bilingual translation (Bengali to English & English to Bengali), technical description, reading comprehension of scientific manuals, and guided group discussions on national health priorities.",
        learningOutcomes: [
          "Translate clinical case notes and instructions accurately between Bengali and English.",
          "Write short stories and objective technical descriptions of laboratory equipment.",
          "Comprehend and extract crucial diagnostic data from scientific publications and lecture sheets.",
          "Participate actively in English group discussions on population, nutrition, and environmental pollution.",
        ],
        subModules: [
          {
            id: "eng-sub-2-1",
            title: "Component 2.1: Bilingual Translation & Technical Descriptions",
            topics: [
              "Translation (Bengali to English): Patient symptoms, doctor's prescriptions, and lab instructions",
              "Translation (English to Bengali): International laboratory safety notices, SOP excerpts, and equipment warnings",
              "Short Story Writing: Narrative flow, setting, character, and chronological events",
              "Technical Description: Describing diagnostic instruments (microscope, centrifuge, spectrophotometer, incubator)",
            ],
            lessons: [
              {
                id: "eng-les-2-1-1",
                title: "Lesson 7: Bengali to English Translation for Diagnostic Medicine",
                duration: "35 min",
                practicalComponent: "Translating patient intake complaints and phlebotomy instructions into clear English.",
                keyCompetencies: ["Cross-language syntax conversion", "Bilingual medical glossary application", "Clarity in instruction"],
              },
              {
                id: "eng-les-2-1-2",
                title: "Lesson 8: English to Bengali Translation & Instrument Technical Descriptions",
                duration: "35 min",
                practicalComponent: "Writing a 150-word technical description of a compound binocular microscope and centrifuge.",
                keyCompetencies: ["Instrument feature description", "Technical terminology translation", "Operational clarity"],
              },
            ],
          },
          {
            id: "eng-sub-2-2",
            title: "Component 2.2: Scientific Comprehension & Public Health Group Discussions",
            topics: [
              "Reading Comprehension: Unseen scientific passages, lecture handouts, and WHO technical bulletins",
              "Group Discussion: Population dynamics, family planning methods, and demographic challenges in Bangladesh",
              "Group Discussion: Food hygiene, balanced nutrition, malnutrition, and food adulteration",
              "Group Discussion: Environmental sanitation, waterborne diseases, air pollution, and biomedical waste disposal",
            ],
            lessons: [
              {
                id: "eng-les-2-2-1",
                title: "Lesson 9: Comprehension of Scientific Manuals, Reports & Lecture Sheets",
                duration: "30 min",
                practicalComponent: "Reading an authentic reagent kit insert and answering analytical comprehension questions.",
                keyCompetencies: ["Skimming for main ideas", "Scanning for critical values", "Interpreting technical warnings"],
              },
              {
                id: "eng-les-2-2-2",
                title: "Lesson 10: Group Discussion: Population, Family Planning, Food & Pollution",
                duration: "40 min",
                practicalComponent: "Roundtable group discussion simulation: 5-minute English presentation on biomedical waste pollution.",
                keyCompetencies: ["Oral argument formulation", "Turn-taking in discussion", "Public health English vocabulary"],
              },
            ],
          },
        ],
      },
      {
        id: "eng-mod-3",
        unitNumber: 3,
        title: "Module 3: Professional, Academic & Clinical Observation Report Writing (Part-I d & Part-II)",
        description: "Academic paragraphs, summaries, formal applications, official correspondence, and comprehensive reports of observation in the laboratory, ward, clinic, and community field.",
        learningOutcomes: [
          "Draft structured paragraphs and essays on basic medical and scientific subjects.",
          "Compose formal applications for leave, equipment requisitions, and job placements.",
          "Draft professional letters to healthcare administrators and suppliers.",
          "Write detailed, objective observation reports for laboratory, ward, clinic, and field visits.",
          "Synthesize complex diagnostic articles into concise summaries.",
        ],
        subModules: [
          {
            id: "eng-sub-3-1",
            title: "Component 3.1: Medical Paragraphs, Essays & Summary Composition",
            topics: [
              "Paragraph Writing: Topic sentence, supporting details, transitions, and concluding sentence",
              "Medical Essay Topics: Blood Transfusion Safety, Dengue Fever Diagnosis, Antibiotic Resistance, Vaccination",
              "Summary & Précis Writing: Condensing long medical articles to one-third length while retaining core facts",
            ],
            lessons: [
              {
                id: "eng-les-3-1-1",
                title: "Lesson 11: Paragraph Writing on Core Medical & Diagnostic Topics",
                duration: "30 min",
                practicalComponent: "Writing a 120-word structured paragraph on 'The Role of Medical Technologist in Disease Diagnosis'.",
                keyCompetencies: ["Topic sentence drafting", "Cohesive transition words", "Clinical focus maintenance"],
              },
              {
                id: "eng-les-3-1-2",
                title: "Lesson 12: Summary Writing & Précis Construction from Scientific Text",
                duration: "30 min",
                practicalComponent: "Summarizing a 300-word excerpt on tuberculosis diagnosis into an accurate 100-word summary.",
                keyCompetencies: ["Information condensation", "Key fact retention", "Objective tone without opinion"],
              },
            ],
          },
          {
            id: "eng-sub-3-2",
            title: "Component 3.2: Formal Applications, Correspondence & Clinical Observation Reports",
            topics: [
              "Application Writing: Applications to Principal, Hospital Superintendent, leave applications, and job applications with resume",
              "Official Letter Writing: Formal letters to diagnostic equipment vendors, inquiry letters, and incident notifications",
              "Observation Reports: Structure of observation reports in laboratory, hospital ward, outpatient clinic, and community field programs",
              "Documentation Standards: Timestamps, specimen ID, methodology, findings, observer comments, and signatures",
            ],
            lessons: [
              {
                id: "eng-les-3-2-1",
                title: "Lesson 13: Formal Application & Official Administrative Letter Writing",
                duration: "35 min",
                practicalComponent: "Drafting an application to the Hospital Superintendent requesting emergency repair of the automated hematology analyzer.",
                keyCompetencies: ["Formal salutation and layout", "Professional tone", "Administrative clarity"],
              },
              {
                id: "eng-les-3-2-2",
                title: "Lesson 14: Writing Structured Observation Reports in Laboratory, Ward & Field",
                duration: "40 min",
                practicalComponent: "Authoring a complete 'Report of Observation' on biosafety adherence in the clinical microbiology ward.",
                keyCompetencies: ["Observational report structure", "Factual diagnostic documentation", "Quality assurance reporting"],
              },
            ],
          },
        ],
      },
      {
        id: "eng-mod-4",
        unitNumber: 4,
        title: "Module 4: Communicative English - Four Language Skills & Viva Voce (Part-II)",
        description: "Development of the four communicative language skills: Reading competently, Writing correctly, Listening appropriately, and Doing conversation fluently for patient care and oral board examination.",
        learningOutcomes: [
          "Read and comprehend working manuals of scientific instruments and equipment competently.",
          "Listen appropriately to guest lectures, audio recordings, and medical instructions.",
          "Speak fluently and professionally during clinical patient interactions and colleague discussions.",
          "Excel in the Communicative Oral/Practical Examination and Board Viva Voce.",
        ],
        subModules: [
          {
            id: "eng-sub-4-1",
            title: "Component 4.1: Competent Reading & Active Listening Skills",
            topics: [
              "Reading Competency: Reading scientific manuals, technical bulletins, and reagent package inserts with speed and accuracy",
              "Listening Appropriately: Active listening strategies for lectures by guest lecturers and audio-recorded dialogues",
              "Note-Taking from Spoken English: Capturing clinical instructions, lab test orders, and critical telephone panic alerts",
            ],
            lessons: [
              {
                id: "eng-les-4-1-1",
                title: "Lesson 15: Competent Reading of Working Manuals & Diagnostic Protocols",
                duration: "30 min",
                practicalComponent: "Reading instrument maintenance guides and highlighting troubleshooting steps under timed conditions.",
                keyCompetencies: ["Technical reading speed", "Troubleshooting comprehension", "Manual navigation"],
              },
              {
                id: "eng-les-4-1-2",
                title: "Lesson 16: Active Listening to Guest Lectures & Audio Recorded Dialogue",
                duration: "35 min",
                practicalComponent: "Listening to a recorded lecture on Quality Control in Hematology and filling in a 10-point checklist.",
                keyCompetencies: ["Aural comprehension", "Real-time note taking", "Identification of key data points"],
              },
            ],
          },
          {
            id: "eng-sub-4-2",
            title: "Component 4.2: Fluent Conversation & Viva Voce Oral Defense",
            topics: [
              "Doing Conversation Fluently: Everyday English conversation in the laboratory, greeting patients, explaining procedures, and answering telephone inquiries",
              "Professional Ward Interaction: Communicating diagnostic turnaround times and critical panic values to nurses and physicians",
              "Oral Board Examination (Viva Voce): Self-introduction, answering conceptual questions, defending clinical reports, and discussing public health issues",
              "Body Language & Pronunciation: Clear phonetics, confident eye contact, polite discourse markers, and stress patterns",
            ],
            lessons: [
              {
                id: "eng-les-4-2-1",
                title: "Lesson 17: Fluent Conversational English in Clinical Laboratory & Ward",
                duration: "35 min",
                practicalComponent: "Role-play dialogue: A technologist explaining fasting guidelines to an anxious diabetic patient.",
                keyCompetencies: ["Conversational fluency", "Empathetic communication", "Clinical instruction delivery"],
              },
              {
                id: "eng-les-4-2-2",
                title: "Lesson 18: Oral Viva Voce Preparation & Communicative Practical Defense",
                duration: "40 min",
                practicalComponent: "Mock board viva: 5-minute oral examination covering English grammar, translation, and technical reading aloud.",
                keyCompetencies: ["Spoken oral confidence", "Grammatical accuracy under pressure", "Board viva defense mastery"],
              },
            ],
          },
        ],
      },
    ],
  },
  "ANAT-101": {
    code: "ANAT-101",
    name: "Basic Anatomy & Physiology",
    program: "DIPLOMA",
    year: "1",
    curriculumVersion: "DMT-2023-V1",
    accreditationBody: "State Medical Faculty of Bangladesh",
    shortBrief: "Structure of human cells, tissues, circulatory system, and internal organ systems relevant to clinical diagnostic pathology.",
    detailedOverview: "This course establishes the foundational anatomical and physiological understanding required for laboratory medical technologists. Students study human cellular morphology, histology of basic tissues, cardiovascular and circulatory dynamics, respiratory gas exchange, renal filtration mechanisms, and digestive physiology, with direct emphasis on specimen origin and organ function tests.",
    courseAims: [
      "Understand histological characteristics of epithelial, connective, muscular, and nervous tissues for biopsy processing.",
      "Comprehend vascular anatomy for safe, standardized venipuncture and arterial blood sampling.",
      "Correlate physiological organ functions with diagnostic biochemical and hematological parameters.",
      "Master anatomical terminology and body quadrant systems utilized in clinical pathology reports.",
    ],
    assessment: {
      totalMarks: 100,
      passPercentage: 50,
      writtenExamMarks: 50,
      writtenExamStructure: "Paper I: 20 MCQs (20 marks) + 6 Short Answer Questions (30 marks)",
      practicalMarks: 30,
      practicalOSPEStructure: "OSPE: 5 Stations (Histology slide identification, Organ anatomy models, Surface markings, Blood smear examination)",
      vivaMarks: 15,
      vivaStructure: "Oral board viva voce with external faculty examiner covering organ systems and lab correlations",
      continuousAssessmentMarks: 5,
      continuousStructure: "Attendance (2 marks) + Class tests & practical notebooks (3 marks)",
    },
    textbooks: [
      {
        title: "Ross & Wilson Anatomy and Physiology in Health and Illness",
        author: "Anne Waugh & Allison Grant",
        edition: "14th Edition",
        type: "Primary Textbook",
        description: "Standard foundation textbook detailing organ system structures with medical terminology.",
      },
      {
        title: "Textbook of Medical Physiology",
        author: "Guyton and Hall (Pocket Companion)",
        edition: "14th Edition",
        type: "Reference Manual",
        description: "Essential physiological mechanisms: circulatory hemodynamics, renal clearance, and blood buffering.",
      },
      {
        title: "Medical Laboratory Technology: Methods and Interpretations",
        author: "Ramnik Sood",
        edition: "6th Edition",
        type: "Laboratory Guide",
        description: "Practical anatomical landmarks and physiology review tailored for clinical lab technologists.",
      },
    ],
    modules: [
      {
        id: "anat-mod-1",
        unitNumber: 1,
        title: "Module 1: Human Cell Biology, Epithelial & Connective Histology",
        description: "Cellular organelles, membrane transport, classification of epithelial surfaces, basement membrane architecture, and fibrous connective tissues.",
        learningOutcomes: [
          "Differentiate cellular organelles and cytoplasmic inclusions under brightfield microscopy.",
          "Identify simple and stratified epithelial tissue specimens under 10x and 40x objectives.",
          "Distinguish loose vs. dense collagenous connective tissue in histological sections.",
        ],
        subModules: [
          {
            id: "anat-sub-1-1",
            title: "Component 1.1: Cellular Architecture & Cell Membrane",
            topics: [
              "Cell membrane lipid bilayer & selective permeability",
              "Mitochondria, Endoplasmic Reticulum, and Golgi apparatus in protein synthesis",
              "Nucleus, chromatin organization, and nucleolus morphology",
              "Cell division: Mitosis phases and diagnostic relevance in cytogenetics",
            ],
            lessons: [
              {
                id: "anat-les-1",
                title: "Eukaryotic Cell Structure & Organelle Functions",
                duration: "25 min",
                practicalComponent: "Microscopic demonstration of buccal epithelial cell smear stained with methylene blue.",
                keyCompetencies: ["Buccal swab preparation", "Cellular boundary identification", "Nuclear-cytoplasmic ratio assessment"],
              },
              {
                id: "anat-les-2",
                title: "Cellular Transport Mechanisms: Diffusion, Osmosis & Active Transport",
                duration: "20 min",
                practicalComponent: "Erythrocyte fragility in hypotonic vs. hypertonic saline solutions.",
                keyCompetencies: ["Osmotic fragility observation", "Hemolysis endpoint detection"],
              },
            ],
          },
          {
            id: "anat-sub-1-2",
            title: "Component 1.2: Primary Tissues Histology (Epithelium & Connective)",
            topics: [
              "Simple squamous, cuboidal, and columnar epithelium",
              "Stratified squamous keratinized vs. non-keratinized epithelium",
              "Connective tissue cells: Fibroblasts, mast cells, and macrophages",
              "Cartilage types: Hyaline, elastic, and fibrocartilage",
            ],
            lessons: [
              {
                id: "anat-les-3",
                title: "Epithelial Tissue Classification & Identification",
                duration: "30 min",
                practicalComponent: "Microscopic examination of kidney cortex (cuboidal) and intestine (columnar).",
                keyCompetencies: ["Slide focusing", "Basement membrane recognition", "Cilia/microvilli differentiation"],
              },
              {
                id: "anat-les-4",
                title: "Histology of Bone & Cartilage Matrix",
                duration: "25 min",
                practicalComponent: "Decalcified compact bone ground section under polarized light.",
                keyCompetencies: ["Haversian system identification", "Osteocyte lacunae recognition"],
              },
            ],
          },
        ],
      },
      {
        id: "anat-mod-2",
        unitNumber: 2,
        title: "Module 2: Cardiovascular System, Vascular Anatomy & Blood Dynamics",
        description: "Cardiac chambers, heart valves, major systemic blood vessels, coronary circulation, blood pressure regulation, and peripheral vascular anatomy for phlebotomy.",
        learningOutcomes: [
          "Map the superficial veins of the antecubital fossa for venipuncture (median cubital, cephalic, basilic).",
          "Trace systemic and pulmonary circulatory routes.",
          "Explain the cardiac cycle and hemodynamics influencing venous return and arterial blood gas sampling.",
        ],
        subModules: [
          {
            id: "anat-sub-2-1",
            title: "Component 2.1: Heart Anatomy & Cardiac Hemodynamics",
            topics: [
              "Gross anatomy of heart chambers, myocardium, and pericardium",
              "Atrioventricular and semilunar valves",
              "Cardiac conduction system: SA node, AV node, Bundle of His, Purkinje fibers",
              "Systemic vs. pulmonary blood circulation cycles",
            ],
            lessons: [
              {
                id: "anat-les-5",
                title: "Heart Chambers, Great Vessels & Valve Architecture",
                duration: "30 min",
                practicalComponent: "Anatomical dissection model of human heart and coronary vessel mapping.",
                keyCompetencies: ["Cardiac anatomical orientation", "Great vessel identification (Aorta, Vena Cava, Pulmonary Trunk)"],
              },
              {
                id: "anat-les-6",
                title: "Blood Flow & Pressure Regulation in Systemic Arteries & Veins",
                duration: "25 min",
                practicalComponent: "Auscultatory blood pressure measurement using sphygmomanometer and stethoscope.",
                keyCompetencies: ["Korotkoff sounds identification", "Systolic and diastolic recording"],
              },
            ],
          },
          {
            id: "anat-sub-2-2",
            title: "Component 2.2: Vascular Anatomy for Clinical Phlebotomy",
            topics: [
              "Antecubital fossa venous anatomy: H-shaped vs. M-shaped configurations",
              "Radial and brachial artery anatomy for arterial blood gas (ABG) puncture",
              "Microvascular capillary beds of fingertips and heel pads for capillary collection",
              "Nerve proximity: Median nerve and brachial artery injury prevention",
            ],
            lessons: [
              {
                id: "anat-les-7",
                title: "Upper Extremity Venous Pathways & Venipuncture Site Selection",
                duration: "35 min",
                practicalComponent: "Palpation and vein selection on phantom training arms.",
                keyCompetencies: ["Median cubital vein palpation", "Tourniquet application timing", "Hematoma prevention"],
              },
            ],
          },
        ],
      },
      {
        id: "anat-mod-3",
        unitNumber: 3,
        title: "Module 3: Respiratory, Renal & Excretory System Anatomy & Physiology",
        description: "Upper and lower respiratory tracts, alveolar gas diffusion, nephron microscopic anatomy, glomerular filtration rate (GFR), and urine formation dynamics.",
        learningOutcomes: [
          "Describe nephron structural segments (glomerulus, Bowman's capsule, proximal/distal tubules, loop of Henle).",
          "Correlate respiratory alveoli architecture with sputum specimen quality in diagnostic microbiology.",
          "Explain renal countercurrent mechanisms and urine concentration parameters (specific gravity, osmolality).",
        ],
        subModules: [
          {
            id: "anat-sub-3-1",
            title: "Component 3.1: Respiratory Tract Anatomy & Alveolar Exchange",
            topics: [
              "Nasal cavity, pharynx, larynx, trachea, and bronchial tree branching",
              "Respiratory membrane histology: Type I and Type II pneumocytes and surfactant",
              "Sputum production vs. salivary contamination in clinical specimens",
              "Ventilation mechanics and acid-base respiratory regulation",
            ],
            lessons: [
              {
                id: "anat-les-8",
                title: "Tracheobronchial Tree & Alveolar Capillary Membrane",
                duration: "25 min",
                practicalComponent: "Histology of trachea (pseudostratified ciliated epithelium) and lung parenchyma.",
                keyCompetencies: ["Respiratory histology identification", "Adequacy criteria for sputum vs. saliva"],
              },
            ],
          },
          {
            id: "anat-sub-3-2",
            title: "Component 3.2: Kidney Anatomy, Nephron Microstructure & Urine Formation",
            topics: [
              "Gross anatomy of kidneys, renal cortex, medulla, pyramids, and calyces",
              "Nephron architecture: Glomerular filtration barrier and podocytes",
              "Tubular reabsorption, secretion, and concentration of urine",
              "Renal blood flow (RBF) and creatinine clearance physiological basis",
            ],
            lessons: [
              {
                id: "anat-les-9",
                title: "Functional Anatomy of the Nephron & Glomerular Barrier",
                duration: "30 min",
                practicalComponent: "Microscopic examination of renal cortex showing glomeruli and convoluted tubules.",
                keyCompetencies: ["Glomerulus vs. tubule discrimination", "Physiological basis of proteinuria"],
              },
              {
                id: "anat-les-10",
                title: "Mechanisms of Urine Formation & Physicochemical Properties",
                duration: "25 min",
                practicalComponent: "Urinalysis physical properties (color, turbidity, specific gravity refractometry).",
                keyCompetencies: ["Specific gravity refractometer calibration", "Urine pH strip evaluation"],
              },
            ],
          },
        ],
      },
      {
        id: "anat-mod-4",
        unitNumber: 4,
        title: "Module 4: Digestive, Endocrine & Hematopoietic Anatomy",
        description: "Gastrointestinal tract, liver and biliary system, pancreas, endocrine glands (pituitary, thyroid, adrenal), and bone marrow hematopoietic sites.",
        learningOutcomes: [
          "Describe hepatic lobule microarchitecture (portal triads, central vein, hepatocytes, sinusoids).",
          "Identify anatomical locations of active hematopoietic red bone marrow across age groups.",
          "Relate endocrine gland hormone secretions to clinical diagnostic blood immunoassay testing.",
        ],
        subModules: [
          {
            id: "anat-sub-4-1",
            title: "Component 4.1: Liver, Biliary Apparatus & Pancreas",
            topics: [
              "Hepatic lobule, Kupffer cells, and sinusoids",
              "Biliary tree: Hepatic ducts, gallbladder, common bile duct",
              "Endocrine and exocrine pancreas: Islets of Langerhans vs. acini",
              "Physiological synthesis of albumin, clotting factors, and bilirubin metabolism",
            ],
            lessons: [
              {
                id: "anat-les-11",
                title: "Functional Microanatomy of Liver & Biliary System",
                duration: "30 min",
                practicalComponent: "Histology of liver lobule showing portal tract (hepatic artery, portal vein, bile duct).",
                keyCompetencies: ["Portal triad identification", "Correlating jaundice etiology with biliary anatomy"],
              },
              {
                id: "anat-les-12",
                title: "Pancreatic Islets & Glucose Regulating Hormones",
                duration: "20 min",
                practicalComponent: "Histological identification of Islets of Langerhans in pancreatic tissue section.",
                keyCompetencies: ["Endocrine vs. exocrine pancreas differentiation", "Insulin vs. Glucagon feedback"],
              },
            ],
          },
          {
            id: "anat-sub-4-2",
            title: "Component 4.2: Endocrine Axis & Bone Marrow Sites",
            topics: [
              "Pituitary-Thyroid-Adrenal axis anatomical locations and hormone production",
              "Anatomical sites of red bone marrow: Iliac crest, sternum, and long bone epiphyseal ends",
              "Bone marrow aspiration biopsy anatomical landmarks (posterior superior iliac spine - PSIS)",
              "Lymphoid organs: Spleen, lymph nodes, and thymus histology",
            ],
            lessons: [
              {
                id: "anat-les-13",
                title: "Thyroid & Adrenal Gland Anatomy in Lab Diagnostics",
                duration: "25 min",
                practicalComponent: "Thyroid colloid follicle histological slide identification.",
                keyCompetencies: ["Thyroid follicle recognition", "Endocrine sampling requirements"],
              },
              {
                id: "anat-les-14",
                title: "Bone Marrow & Lymphoid Organ Topography for Diagnostic Biopsy",
                duration: "30 min",
                practicalComponent: "Spleen and lymph node histology showing germinal centers and splenic cords.",
                keyCompetencies: ["Bone marrow biopsy site localization", "Splenic pulp identification"],
              },
            ],
          },
        ],
      },
    ],
  },

  "CHEM-102": {
    code: "CHEM-102",
    name: "Clinical Chemistry Fundamentals & Lab Safety",
    program: "DIPLOMA",
    year: "1",
    curriculumVersion: "DMT-2023-V1",
    accreditationBody: "State Medical Faculty of Bangladesh",
    shortBrief: "Laboratory glassware, standard solutions, pH buffers, safety symbols, chemical hazard handling, and bio-waste management.",
    detailedOverview: "This course trains students in fundamental chemical laboratory skills essential for clinical chemistry and diagnostic analysis. Topics include SI units, volumetric measurement, preparation of molar and normal standard solutions, acid-base equilibria, buffer chemistry, spectrophotometric principles, laboratory safety symbols, biohazard disposal protocols, and SDS (Safety Data Sheet) interpretation.",
    courseAims: [
      "Prepare standard molar, normal, and percentage solutions with high volumetric precision.",
      "Calibrate analytical balances, micropipettes, and pH meters according to standard SOPs.",
      "Understand biohazard risk groups, PPE requirements, and chemical spill mitigation.",
      "Implement biomedical waste segregation according to national environmental and hospital regulations.",
    ],
    assessment: {
      totalMarks: 100,
      passPercentage: 50,
      writtenExamMarks: 50,
      writtenExamStructure: "Paper II: 20 MCQs (20 marks) + 5 Structured Essay Questions (30 marks)",
      practicalMarks: 30,
      practicalOSPEStructure: "OSPE: Solution calculation, Micropipette accuracy calibration, Acid-base titration, Hazard identification",
      vivaMarks: 15,
      vivaStructure: "Viva voce examination with external examiner on laboratory calculations, buffers, and biosafety protocols",
      continuousAssessmentMarks: 5,
      continuousStructure: "Attendance (2 marks) + Class tests & lab notebooks (3 marks)",
    },
    textbooks: [
      {
        title: "Tietz Fundamentals of Clinical Chemistry and Molecular Diagnostics",
        author: "Nader Rifai & Carl A. Burtis",
        edition: "8th Edition",
        type: "Primary Textbook",
        description: "Gold standard reference for laboratory calculations, reagent preparation, and analytical instrumentation.",
      },
      {
        title: "Medical Laboratory Technology: Methods and Interpretations",
        author: "Kanai L. Mukherjee",
        edition: "Vol. 1, 2nd Edition",
        type: "Laboratory Guide",
        description: "Standard practical guide for chemical calculations, glassware calibration, and bench reagents in Bangladesh.",
      },
    ],
    modules: [
      {
        id: "chem-mod-1",
        unitNumber: 1,
        title: "Module 1: Laboratory Glassware, Plasticware & Volumetric Equipment",
        description: "Volumetric flasks, graduated cylinders, pipettes (volumetric, serological, micropipettes), burettes, care, washing, drying, and calibration.",
        learningOutcomes: [
          "Distinguish Class A volumetric glassware from student-grade glassware.",
          "Operate variable volume air-displacement micropipettes without cross-contamination.",
          "Formulate standard chromic acid and neutral detergent washing solutions for laboratory glassware.",
        ],
        subModules: [
          {
            id: "chem-sub-1-1",
            title: "Component 1.1: Glassware Types & Volumetric Measurement",
            topics: ["Borosilicate vs. soda-lime glass", "Volumetric flasks, pipettes, and burettes", "Meniscus reading techniques"],
            lessons: [
              {
                id: "chem-les-1",
                title: "Glassware Specifications, Thermal Resistance & Class A Tolerance",
                duration: "25 min",
                practicalComponent: "Calibration of a 10 mL volumetric pipette using analytical balance gravimetric method.",
                keyCompetencies: ["Meniscus alignment", "Gravimetric water weighing", "Temperature density correction"],
              },
              {
                id: "chem-les-2",
                title: "Micropipette Handling, Calibration & Forward vs. Reverse Pipetting",
                duration: "30 min",
                practicalComponent: "Pipetting 10 µL, 50 µL, and 100 µL aqueous and viscous solutions; gravimetric verification.",
                keyCompetencies: ["Forward pipetting technique", "Reverse pipetting for viscous serum", "Two-stop plunger feel"],
              },
            ],
          },
        ],
      },
      {
        id: "chem-mod-2",
        unitNumber: 2,
        title: "Module 2: Standard Solutions, Molarity, Normality & Chemical Math",
        description: "Molecular weight calculations, equivalent weight, primary and secondary chemical standards, percentage solutions (w/w, w/v, v/v), and serial dilutions.",
        learningOutcomes: [
          "Calculate and prepare standard solutions from solids and concentrated liquid acids.",
          "Execute 2-fold, 5-fold, and 10-fold serial dilutions with precision.",
          "Standardize sodium hydroxide solutions using primary potassium hydrogen phthalate (KHP).",
        ],
        subModules: [
          {
            id: "chem-sub-2-1",
            title: "Component 2.1: Molar & Normal Solutions Calculations",
            topics: ["Molarity (M), Molality (m), and Normality (N)", "Equivalent weight calculations for acids, bases, and salts", "Primary standard criteria"],
            lessons: [
              {
                id: "chem-les-3",
                title: "Preparation of 0.1 M & 0.1 N Sodium Hydroxide and Hydrochloric Acid",
                duration: "35 min",
                practicalComponent: "Preparation of 250 mL 0.1 N NaOH and acid-base neutralization titration.",
                keyCompetencies: ["Chemical balance weighing", "Safe acid-to-water dilution", "Phenolphthalein endpoint detection"],
              },
            ],
          },
        ],
      },
      {
        id: "chem-mod-3",
        unitNumber: 3,
        title: "Module 3: Acid-Base Equilibria, pH Concept & Buffer Solutions",
        description: "Ionization of water, pH scale, Henderson-Hasselbalch equation, buffer mechanism, phosphate buffers, and pH meter electronic calibration.",
        learningOutcomes: [
          "Calibrate glass-electrode pH meters using standard pH 4.0, 7.0, and 10.0 reference buffers.",
          "Formulate Sorensen's phosphate buffer pH 7.2 for hematological staining and biochemical assays.",
        ],
        subModules: [
          {
            id: "chem-sub-3-1",
            title: "Component 3.1: pH & Laboratory Buffer Preparation",
            topics: ["Dissociation constants (Ka/Kb)", "Buffer capacity", "pH meter electrode maintenance and storage in 3M KCl"],
            lessons: [
              {
                id: "chem-les-4",
                title: "Formulation and pH Adjustment of Sorensen's Phosphate Buffer (pH 6.8 & 7.2)",
                duration: "30 min",
                practicalComponent: "Preparation of 500 mL phosphate buffer; measuring pH drift with temperature.",
                keyCompetencies: ["pH meter two-point calibration", "Dropwise acid/base adjustment"],
              },
            ],
          },
        ],
      },
      {
        id: "chem-mod-4",
        unitNumber: 4,
        title: "Module 4: Laboratory Safety, Biohazard Waste & Chemical Spills",
        description: "GHS hazard symbols, Safety Data Sheets (SDS), personal protective equipment (PPE), biosafety levels (BSL 1-4), color-coded hospital waste disposal, and eyewash protocols.",
        learningOutcomes: [
          "Demonstrate immediate response protocols for concentrated acid/alkali skin contact and eye exposure.",
          "Segregate sharps, infectious waste, chemical waste, and general waste into standard colored bins.",
          "Interpret GHS pictograms, NFPA diamond ratings, and chemical incompatibility charts.",
        ],
        subModules: [
          {
            id: "chem-sub-4-1",
            title: "Component 4.1: Biosafety & Chemical Hazard Protocol",
            topics: ["GHS hazard pictograms", "Flammable, corrosive, toxic, and carcinogenic chemicals", "Color-coded waste bags: Red, Yellow, Blue, Black"],
            lessons: [
              {
                id: "chem-les-5",
                title: "Biomedical Laboratory Waste Segregation & Autoclave Decontamination Protocols",
                duration: "30 min",
                practicalComponent: "Hands-on waste segregation drill using color-coded bins and sharps containers.",
                keyCompetencies: ["Sharps bin safety lid operation", "1% sodium hypochlorite spill disinfection", "PPE donning & doffing order"],
              },
            ],
          },
        ],
      },
    ],
  },

  "LAB-103": {
    code: "LAB-103",
    name: "Clinical Laboratory Techniques & Sterilization",
    program: "DIPLOMA",
    year: "1",
    curriculumVersion: "DMT-2023-V1",
    accreditationBody: "State Medical Faculty of Bangladesh",
    shortBrief: "Autoclaving, dry heat ovens, filtration, centrifugation, optical microscopy care, and water purification systems.",
    detailedOverview: "This course provides comprehensive practical training in physical and chemical sterilization, disinfection, laboratory water purification (distillation, deionization, reverse osmosis), centrifuge theory and relative centrifugal force (RCF) calculation, and optical compound microscope adjustment and maintenance.",
    courseAims: [
      "Master autoclave operation at 121°C / 15 psi and hot air oven sterilization cycles.",
      "Calculate relative centrifugal force (RCF/g) from RPM and rotor radius.",
      "Perform Kohler illumination alignment on binocular clinical microscopes.",
      "Operate water stills and deionizer columns with quality control conductivity monitoring.",
    ],
    assessment: {
      totalMarks: 100,
      passPercentage: 50,
      writtenExamMarks: 50,
      writtenExamStructure: "Paper III: 20 MCQs (20 marks) + 5 Structured Essay Questions (30 marks)",
      practicalMarks: 30,
      practicalOSPEStructure: "OSPE: Autoclave loading/spore strip check, Centrifuge balance, Microscope Kohler alignment, Disinfectant dilution",
      vivaMarks: 15,
      vivaStructure: "Oral board examination with external faculty on sterilization indicators, centrifugation physics, and microscope optical aberrations",
      continuousAssessmentMarks: 5,
      continuousStructure: "Attendance (2 marks) + Class tests & practical notebooks (3 marks)",
    },
    textbooks: [
      {
        title: "District Laboratory Practice in Tropical Countries (Part 1)",
        author: "Monica Cheesbrough",
        edition: "2nd Edition, Cambridge University Press",
        type: "Primary Textbook",
        description: "Benchmark international handbook for clinical laboratory equipment, sterilization, microscopy, and water purification.",
      },
      {
        title: "Clinical Laboratory Management and Techniques",
        author: "Baker and Silverton",
        edition: "7th Edition",
        type: "Reference Manual",
        description: "Authoritative reference for autoclave physical validation, centrifuges, and optical microscopy physics.",
      },
    ],
    modules: [
      {
        id: "lab-mod-1",
        unitNumber: 1,
        title: "Module 1: Sterilization & Disinfection Principles",
        description: "Physical methods: Moist heat (autoclave), dry heat (hot air oven), red heat, flaming, incineration. Chemical disinfectants: Halogens, phenolics, aldehydes, alcohols, and ethylene oxide gas.",
        learningOutcomes: [
          "Differentiate sterilization from disinfection and antisepsis.",
          "Operate a vertical medical autoclave, verifying cycle completion with Bowie-Dick and biological spore indicators (Geobacillus stearothermophilus).",
        ],
        subModules: [
          {
            id: "lab-sub-1-1",
            title: "Component 1.1: Thermal Sterilization Equipment",
            topics: ["Autoclave steam under pressure principles (121°C for 15-20 min)", "Hot air oven holding times (160°C for 2h, 170°C for 1h)", "Chemical and biological sterilization indicators"],
            lessons: [
              {
                id: "lab-les-1",
                title: "Autoclave Physics, Packing, Operation & Indicator Verification",
                duration: "30 min",
                practicalComponent: "Sterilization of culture media flasks and surgical instruments in benchtop autoclave.",
                keyCompetencies: ["Air purge verification", "Chamber pressure gauge reading", "Autoclave tape color change review"],
              },
            ],
          },
        ],
      },
      {
        id: "lab-mod-2",
        unitNumber: 2,
        title: "Module 2: Laboratory Water Systems & Purification",
        description: "Distillation, double distillation, deionization (ion-exchange resins), reverse osmosis (RO), Type I, II, and III reagent water specifications according to CLSI guidelines.",
        learningOutcomes: [
          "Measure electrical conductivity and resistivity of purified laboratory water.",
          "Identify appropriate water grades for clinical chemistry analyzers vs. routine glassware rinsing.",
        ],
        subModules: [
          {
            id: "lab-sub-2-1",
            title: "Component 2.1: Water Purification Technologies",
            topics: ["Distilled water vs. deionized water", "Resin regeneration", "Microbial filtration using 0.22 µm membrane filters"],
            lessons: [
              {
                id: "lab-les-2",
                title: "Operation of Water Stills & Conductivity Quality Control",
                duration: "25 min",
                practicalComponent: "Testing distilled vs. tap water with conductivity meter and silver nitrate chloride test.",
                keyCompetencies: ["Conductivity meter usage", "Chloride ion turbidity test"],
              },
            ],
          },
        ],
      },
      {
        id: "lab-mod-3",
        unitNumber: 3,
        title: "Module 3: Centrifugation Theory, Rotor Types & Maintenance",
        description: "Centrifugal acceleration physics, Relative Centrifugal Force (RCF = 1.118 x 10^-5 x r x RPM^2), fixed angle vs. swing-out buckets, sample balancing, aerosol containment, and emergency rotor braking.",
        learningOutcomes: [
          "Calculate exact RCF in 'g' for given laboratory centrifuge rotors and revolutions per minute.",
          "Balance centrifuge tube pairs on analytical balances to within 0.05 grams.",
        ],
        subModules: [
          {
            id: "lab-sub-3-1",
            title: "Component 3.1: Centrifuge Dynamics & Safety",
            topics: ["RCF vs. RPM mathematical conversion", "Swing-out bucket vs. fixed angle rotors", "Centrifuge tube breakage & aerosol decontamination"],
            lessons: [
              {
                id: "lab-les-3",
                title: "Centrifuge Balancing, Speed Control & Blood Separation Protocol",
                duration: "30 min",
                practicalComponent: "Serum separation centrifugation at 2500 RPM (1200 g) for 10 minutes with balanced counterweights.",
                keyCompetencies: ["Symmetric bucket loading", "Balance weight matching", "Serum pipetting without buffy coat disturbance"],
              },
            ],
          },
        ],
      },
      {
        id: "lab-mod-4",
        unitNumber: 4,
        title: "Module 4: Optical Compound Microscopy & Alignment",
        description: "Brightfield binocular microscope optical components: Condenser, iris diaphragm, objective lenses (4x, 10x, 40x, 100x oil immersion), eyepieces, numerical aperture (NA), resolution formula, and Kohler illumination.",
        learningOutcomes: [
          "Perform complete Kohler illumination centering and condenser height optimization.",
          "Safely apply and clean synthetic immersion oil from 100x objectives using lens tissue.",
        ],
        subModules: [
          {
            id: "lab-sub-4-1",
            title: "Component 4.1: Microscope Optics & Kohler Alignment",
            topics: ["Numerical aperture and limit of resolution (d = 0.61 lambda / NA)", "Chromatic and spherical aberrations", "Daily cleaning and storage in desiccator"],
            lessons: [
              {
                id: "lab-les-4",
                title: "Kohler Illumination Alignment & Oil Immersion Microscopy",
                duration: "35 min",
                practicalComponent: "Step-by-step field diaphragm closing, condenser centering, and focus on stained blood smear under 100x.",
                keyCompetencies: ["Field diaphragm focusing", "Condenser centration screws adjustment", "Oil immersion cleanup with lens paper"],
              },
            ],
          },
        ],
      },
    ],
  },
};

// Robust generator providing realistic, complete curriculum data for any subject code in catalog
export function getCourseCurriculum(code: string): CourseCurriculumDetail {
  const upperCode = code.trim().toUpperCase();

  // 1. Check custom stored details in localStorage
  let customStoreData: Partial<CourseCurriculumDetail> | undefined;
  let customCatalogItem: SubjectModule | undefined;
  try {
    if (typeof window !== "undefined") {
      const storedDetails = localStorage.getItem("labtutor_curriculum_details_v2");
      if (storedDetails) {
        const parsed = JSON.parse(storedDetails);
        if (parsed && parsed[upperCode]) {
          customStoreData = parsed[upperCode];
        }
      }
      const storedCatalog = localStorage.getItem("labtutor_courses_catalog_v2");
      if (storedCatalog) {
        const parsedCat = JSON.parse(storedCatalog);
        if (Array.isArray(parsedCat)) {
          const match = parsedCat.find((c: any) => c.code?.toUpperCase() === upperCode);
          if (match) customCatalogItem = match;
        }
      }
    }
  } catch {
    // fallback
  }

  const base =
    customCatalogItem ||
    CURRICULUM_SUBJECTS_CATALOG.find((s) => s.code.toUpperCase() === upperCode) || {
      code: upperCode,
      name: customStoreData?.name || upperCode,
      program: customStoreData?.program || "DIPLOMA",
      year: customStoreData?.year || "1",
      semester: customStoreData?.semester,
      units: customStoreData?.totalUnits || 4,
      lessons: customStoreData?.totalLessons || 16,
      progress: customStoreData?.progress || 0,
      description: customStoreData?.shortBrief || "Medical Laboratory Technology academic curriculum course.",
    };

  // 2. Check if predefined or custom stored detailed curriculum is recorded
  const custom = customStoreData || DETAILED_COURSE_DATA[upperCode] || DETAILED_COURSE_DATA[code];
  if (custom) {
    return {
      code: base.code,
      name: custom.name || base.name,
      program: custom.program || base.program,
      year: custom.year || base.year,
      semester: custom.semester || (base as any).semester || undefined,
      curriculumVersion: custom.curriculumVersion || (base.program === "BSC" ? "BSC-LT-2024-V2" : "DMT-2023-V1"),
      accreditationBody:
        custom.accreditationBody ||
        (base.program === "BSC"
          ? "Faculty of Medicine & Allied Health Sciences, University Curriculum"
          : "State Medical Faculty of Bangladesh"),
      shortBrief: custom.shortBrief || base.description || "Comprehensive accredited syllabus for medical laboratory science.",
      detailedOverview:
        custom.detailedOverview ||
        `${base.name} (${base.code}) provides comprehensive training in theoretical foundations, clinical methodology, instrumentation, and diagnostic evaluation according to the official curriculum guidelines.`,
      courseAims: custom.courseAims || [
        `Understand core principles, biochemical pathways, and pathophysiological mechanisms of ${base.name}.`,
        "Master bench procedures, reagent formulations, calibration, and equipment maintenance.",
        "Implement quality control standards, Westgard rule evaluations, and reference range correlations.",
        "Demonstrate diagnostic competency in written board examinations, OSPE stations, and viva voce defenses.",
      ],
      totalUnits: custom.totalUnits || base.units || 4,
      totalLessons: custom.totalLessons || base.lessons || 16,
      progress: custom.progress ?? base.progress ?? 0,
      assessment: custom.assessment || {
        totalMarks: 100,
        passPercentage: 50,
        writtenExamMarks: 50,
        writtenExamStructure: "Written Paper: 20 MCQs (20 marks) + 5 Short & Broad Questions (30 marks)",
        practicalMarks: 30,
        practicalOSPEStructure: "OSPE: 5 Structured Stations (Spotting, Slide preparation, Reagent preparation, Clinical calculation)",
        vivaMarks: 15,
        vivaStructure: "Oral board viva voce with external examiners covering syllabus topics and laboratory troubleshooting",
        continuousAssessmentMarks: 5,
        continuousStructure: "Attendance, terminal assessments, and practical logbook evaluation",
      },
      modules: custom.modules || generateFallbackModules(base),
      textbooks: custom.textbooks || [
        {
          title: "District Laboratory Practice in Tropical Countries",
          author: "Monica Cheesbrough",
          edition: "2nd Edition, Cambridge University Press",
          type: "Primary Textbook",
          description: "Essential standard practical reference for diagnostic laboratory technology in developing nations.",
        },
        {
          title: "Medical Laboratory Technology: Methods and Interpretations",
          author: "Kanai L. Mukherjee",
          edition: "3-Volume Set",
          type: "Reference Manual",
          description: "Comprehensive medical technology curriculum handbook widely adopted across South Asian medical faculties.",
        },
      ],
      pdfUrl: custom.pdfUrl || (base.code === "ENG-101" ? "/curriculum/Basic_English_Language_Course_Syllabus.pdf" : undefined),
      totalHours: custom.totalHours || (base.code === "ENG-101" ? 220 : 120),
      lectureHours: custom.lectureHours || (base.code === "ENG-101" ? 60 : 40),
      practicalHours: custom.practicalHours || (base.code === "ENG-101" ? 160 : 80),
      teachingMethods: custom.teachingMethods,
      teachingAids: custom.teachingAids,
    };
  }

  return {
    code: base.code,
    name: base.name,
    program: base.program,
    year: base.year,
    semester: (base as any).semester || undefined,
    curriculumVersion: base.program === "BSC" ? "BSC-LT-2024-V2" : "DMT-2023-V1",
    accreditationBody:
      base.program === "BSC"
        ? "Faculty of Medicine & Allied Health Sciences, University Curriculum"
        : "State Medical Faculty of Bangladesh",
    shortBrief: base.description,
    detailedOverview: `${base.name} (${base.code}) provides comprehensive training in theoretical foundations, clinical methodology, instrumentation, and diagnostic evaluation according to the official curriculum guidelines.`,
    courseAims: [
      `Develop strong theoretical foundations in ${base.name}.`,
      "Master standardized laboratory procedures, reagent preparation, and analytical techniques.",
      "Execute quality assurance protocols, standard operating procedures (SOPs), and diagnostic reporting.",
      "Prepare for annual faculty written examinations, practical OSPE stations, and board viva voce.",
    ],
    totalUnits: base.units,
    totalLessons: base.lessons,
    progress: base.progress,
    assessment: {
      totalMarks: 100,
      passPercentage: 50,
      writtenExamMarks: 50,
      writtenExamStructure: "Written Paper: 20 Multiple Choice Questions (20 marks) + 5 Structured Essay Questions (30 marks)",
      practicalMarks: 30,
      practicalOSPEStructure: "Objective Structured Practical Examination (OSPE): 5 active laboratory stations (30 marks)",
      vivaMarks: 15,
      vivaStructure: "Board Viva Voce conducted by internal and external examiners (15 marks)",
      continuousAssessmentMarks: 5,
      continuousStructure: "Continuous class tests, seminar participation, and practical logbook records (5 marks)",
    },
    modules: generateFallbackModules(base),
    textbooks: [
      {
        title: "Medical Laboratory Technology: Procedure & Interpretation",
        author: "Ramnik Sood",
        edition: "Latest Edition",
        type: "Primary Textbook",
        description: "Standard course text covering theoretical pathology, biochemical tests, and bench techniques.",
      },
      {
        title: "District Laboratory Practice in Tropical Countries",
        author: "Monica Cheesbrough",
        edition: "Cambridge University Press",
        type: "Reference Manual",
        description: "Benchmark international practical reference for laboratory science.",
      },
    ],
    pdfUrl: base.code === "ENG-101" ? "/curriculum/Basic_English_Language_Course_Syllabus.pdf" : undefined,
    totalHours: base.code === "ENG-101" ? 220 : 120,
    lectureHours: base.code === "ENG-101" ? 60 : 40,
    practicalHours: base.code === "ENG-101" ? 160 : 80,
  };
}

function generateFallbackModules(base: SubjectModule): CurriculumModule[] {
  if (DIPLOMA_STUDY_CENTER_DATA[base.code]) {
    const studyMods = DIPLOMA_STUDY_CENTER_DATA[base.code];
    return studyMods.map((m) => ({
      id: m.id,
      unitNumber: m.unitNumber,
      title: m.title,
      description: m.description,
      learningOutcomes: [
        `Master fundamental principles and diagnostic theory of ${m.title}.`,
        "Adhere to laboratory biosafety protocols and standardized laboratory procedures.",
        "Demonstrate analytical proficiency in diagnostic execution, quality control, and result reporting.",
      ],
      subModules: m.subModules.map((sm) => ({
        id: sm.id,
        title: sm.title,
        topics: sm.lessons.flatMap((l) => l.notes.slice(0, 2)),
        lessons: sm.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          duration: l.duration,
          practicalComponent: l.benchAlert ? `Clinical Bench Focus: ${l.benchAlert}` : "Practical laboratory procedure compliance.",
          keyCompetencies: ["Technical protocol compliance", "Result documentation", "Quality assurance validation"],
        })),
      })),
    }));
  }

  const unitsCount = Math.max(3, base.units || 4);
  const units: CurriculumModule[] = [];

  const unitTopics = [
    {
      title: "Foundational Principles, Terminology & Biological Concepts",
      desc: "Fundamental science, biological pathways, classification frameworks, and safety guidelines.",
    },
    {
      title: "Analytical Techniques, Instrumentation & Reagent Protocols",
      desc: "Instrumentation operating principles, calibration procedures, standard curve preparation, and reagent stability.",
    },
    {
      title: "Diagnostic Methods, Specimen Handling & Quality Control",
      desc: "Pre-analytical specimen integrity, analytical assay procedures, Westgard QC validation, and troubleshooting.",
    },
    {
      title: "Clinical Interpretation, Disease Correlation & Viva Preparation",
      desc: "Pathophysiological correlation, reference intervals, critical panic values, and oral board viva voce practice.",
    },
    {
      title: "Advanced Diagnostics, Automation & Research Methodology",
      desc: "Automated platforms, molecular diagnostics, bioethics, and emerging laboratory technologies.",
    },
  ];

  for (let i = 0; i < unitsCount; i++) {
    const topic = unitTopics[i % unitTopics.length];
    units.push({
      id: `${base.code.toLowerCase()}-unit-${i + 1}`,
      unitNumber: i + 1,
      title: `Module ${i + 1}: ${topic.title}`,
      description: topic.desc,
      learningOutcomes: [
        `Understand core theoretical and clinical fundamentals of Module ${i + 1}.`,
        "Perform associated practical laboratory procedures with precision and adherence to biosafety.",
        "Evaluate laboratory results against clinical reference ranges and identify pre-analytical errors.",
      ],
      subModules: [
        {
          id: `${base.code.toLowerCase()}-sub-${i + 1}-1`,
          title: `Component ${i + 1}.1: Theoretical Principles & Scientific Framework`,
          topics: [
            "Historical milestones and modern diagnostic significance",
            "Biochemical and physiological mechanisms",
            "Classification systems and nomenclature standards",
          ],
          lessons: [
            {
              id: `${base.code.toLowerCase()}-les-${i + 1}-1`,
              title: `Lesson 1: Fundamental Concepts & Theoretical Background`,
              duration: "25 min",
              practicalComponent: "Demonstration of standard laboratory bench setup and safety measures.",
              keyCompetencies: ["Terminology mastery", "Safety adherence", "Basic principle explanation"],
            },
            {
              id: `${base.code.toLowerCase()}-les-${i + 1}-2`,
              title: `Lesson 2: Methodological Protocols & Assay Kinetics`,
              duration: "30 min",
              practicalComponent: "Preparation of reagents and calibration standard curves.",
              keyCompetencies: ["Reagent preparation", "Spectrophotometric calibration", "SOP compliance"],
            },
          ],
        },
        {
          id: `${base.code.toLowerCase()}-sub-${i + 1}-2`,
          title: `Component ${i + 1}.2: Clinical Application & Quality Control`,
          topics: [
            "Internal quality control (IQC) and Levy-Jennings charting",
            "Common interfering substances and hemolyzed/lipemic specimen handling",
            "Bangladesh State Medical Faculty board exam question patterns",
          ],
          lessons: [
            {
              id: `${base.code.toLowerCase()}-les-${i + 1}-3`,
              title: `Lesson 3: Specimen Processing & Bench Protocol Execution`,
              duration: "30 min",
              practicalComponent: "Processing patient specimen with parallel running of normal and abnormal controls.",
              keyCompetencies: ["Control run evaluation", "Discrepancy resolution", "Result documentation"],
            },
            {
              id: `${base.code.toLowerCase()}-les-${i + 1}-4`,
              title: `Lesson 4: Diagnostic Interpretation & Viva Voce Case Scenarios`,
              duration: "25 min",
              practicalComponent: "Case study analysis and mock oral viva examination.",
              keyCompetencies: ["Clinical correlation", "Oral presentation", "Panic value notification"],
            },
          ],
        },
      ],
    });
  }

  return units;
}
