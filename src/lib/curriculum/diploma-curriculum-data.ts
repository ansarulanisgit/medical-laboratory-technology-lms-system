import { DIPLOMA_ALL_STUDY_DATA } from "./diploma";
import type { CourseCurriculumDetail, CurriculumModule } from "./course-details-data";

export interface StudyQuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyVivaItem {
  question: string;
  answer: string;
  frequentlyAskedIn?: string;
}

export interface StudyPreviousQuestionItem {
  year: string;
  exam: string;
  questionText: string;
  modelAnswer: string;
  marks: number;
}

export interface StudyLessonItem {
  id: string;
  title: string;
  duration: string;
  notes: string[];
  benchAlert?: string;
  attachments?: {
    id: string;
    name: string;
    fileType: string;
    fileSize?: string;
    url: string;
  }[];
  quizzes: StudyQuizItem[];
  vivaQAs: StudyVivaItem[];
  previousQuestions: StudyPreviousQuestionItem[];
}

export interface StudySubModuleItem {
  id: string;
  title: string;
  lessons: StudyLessonItem[];
}

export interface StudyModuleItem {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  learningOutcomes?: string[];
  subModules: StudySubModuleItem[];
}

// ============================================================================
// 16 OFFICIAL DIPLOMA SUBJECTS: COMPREHENSIVE STUDY CENTER MODULES & LESSONS
// ============================================================================
const BASE_DIPLOMA_STUDY_CENTER_DATA: Record<string, StudyModuleItem[]> = {
  // --------------------------------------------------------------------------
  // 1. ENG-101: English
  // --------------------------------------------------------------------------
  "ENG-101": 
[
    {
        "id": "eng-mod-1",
        "unitNumber": 1,
        "title": "Topic 1: Foundation English Grammar, Syntax & Scientific Nomenclature (Part-I a, b)",
        "description": "Subjects and predicate, parts of speech classification, tenses, conjugation, prepositions, punctuation rules, spelling improvement, idioms, and sentence correction.",
        "learningOutcomes": [
            "Identify subjects and predicates in complex medical sentences.",
            "Classify nouns, pronouns, adjectives, verbs, and adverbs accurately.",
            "Apply correct verb conjugation and tense agreement in laboratory protocols.",
            "Master punctuation rules: capitalization, comma, semicolon, colon, hyphen, and underlining.",
            "Correct wrong words, spelling errors, and use scientific nomenclature and idioms properly."
        ],
        "subModules": [
            {
                "id": "eng-sub-1-1",
                "title": "Sub-Module 1.1: Sentence Structure & Parts of Speech Classification",
                "lessons": [
                    {
                        "id": "eng-les-1",
                        "title": "Lesson 1: Subjects & Predicate, Sentence Anatomy & Word Order",
                        "duration": "25 min",
                        "notes": [
                            "Every complete English sentence consists of two fundamental constituents: the Subject (the entity performing or experiencing the action) and the Predicate (containing the verb and describing the action or state).",
                            "In clinical diagnostic writing, declarative sentences follow strict Subject-Verb-Object (S-V-O) syntax: e.g., 'The automated analyzer (Subject) aspirates (Verb) 10 microliters of patient serum (Object).'",
                            "Compound and complex sentences in laboratory manuals use coordinating conjunctions (FANBOYS: for, and, nor, but, or, yet, so) and subordinating conjunctions (because, although, since, whereas).",
                            "Sentence fragments and run-on sentences must be rigorously avoided in clinical documentation to prevent diagnostic ambiguity or patient record misinterpretation."
                        ],
                        "benchAlert": "Never omit the subject in critical panic alert records. Ambiguous entries like 'Found severely hemolyzed' are unacceptable; write 'The specimen for serum potassium (Sample ID #4092) was found severely hemolyzed upon centrifuge inspection.'",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-1",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "In the sentence 'The medical technologist carefully calibrated the spectrophotometer before assaying patient controls,' what is the complete predicate?",
                                "options": [
                                    "The medical technologist",
                                    "carefully calibrated",
                                    "carefully calibrated the spectrophotometer before assaying patient controls",
                                    "the spectrophotometer before assaying patient controls"
                                ],
                                "correctIndex": 2,
                                "explanation": "The complete predicate includes the main verb, its auxiliary/adverbs, and all modifying objects: 'carefully calibrated the spectrophotometer before assaying patient controls'."
                            },
                            {
                                "question": "Which of the following examples represents a grammatically complete sentence suitable for clinical reporting?",
                                "options": [
                                    "While inspecting the peripheral blood smear under oil immersion.",
                                    "Centrifuged at 3000 RPM for 10 minutes.",
                                    "The cerebrospinal fluid specimen demonstrated marked pleocytosis.",
                                    "Because the reagent blank exceeded the optical density limit."
                                ],
                                "correctIndex": 2,
                                "explanation": "'The cerebrospinal fluid specimen demonstrated marked pleocytosis' contains both an explicit subject and a complete finite verb predicate."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "What is the difference between a simple, compound, and complex sentence in medical documentation?",
                                "answer": "A simple sentence contains one independent clause. A compound sentence joins two independent clauses with a coordinator (e.g. 'The sample was hemolyzed, so a redraw was requested'). A complex sentence joins an independent clause with one or more dependent clauses (e.g. 'When the incubator temperature fluctuated, the bacterial culture was compromised').",
                                "frequentlyAskedIn": "SMFB Board English Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2023",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Define Subject and Predicate with two clinical examples. Identify the subject and predicate in: 'The automated hematology analyzer flagged five samples for immature granulocytes.' (Marks: 6)",
                                "modelAnswer": "Subject: 'The automated hematology analyzer'. Predicate: 'flagged five samples for immature granulocytes'. A subject indicates who or what performs the action; the predicate expresses the action or state.",
                                "marks": 6
                            }
                        ]
                    },
                    {
                        "id": "eng-les-2",
                        "title": "Lesson 2: Nouns, Pronouns, Adjectives & Clinical Descriptions",
                        "duration": "30 min",
                        "notes": [
                            "Nouns in pathology are classified into Proper nouns (e.g., Leishman stain, Gram stain, Jaffe method), Common nouns (reagent, microscope, pipette), Collective nouns (panel, cluster, batch), and Abstract nouns (turbidity, virulence, sensitivity).",
                            "Countable vs. Uncountable Nouns: Blood, plasma, and urine are mass/uncountable nouns (do not take plural 's'); milliliters, test tubes, and erythrocyte counts are countable.",
                            "Pronoun Antecedent Agreement: Pronouns (it, they, this, these) must agree in number and gender with their noun antecedents to prevent confusion during patient result handovers.",
                            "Descriptive Adjectives in Diagnostic Reporting: Crucial for describing specimen appearance: macroscopic (turbid, icteric, hemolyzed, xanthochromic, purulent) and microscopic (normocytic, hypochromic, anisopoikilocytic)."
                        ],
                        "benchAlert": "Always capitalize proper adjectives named after discoverers (e.g., Romanowsky stain, Ziehl-Neelsen staining, Petri dish), but do not capitalize common equipment names (centrifuge, incubator).",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-2",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "Which term is an uncountable (mass) noun in clinical pathology?",
                                "options": [
                                    "Erythrocyte",
                                    "Pipette",
                                    "Serum",
                                    "Test tube"
                                ],
                                "correctIndex": 2,
                                "explanation": "'Serum' is an uncountable noun. We say '5 mL of serum' or 'serum samples', not 'two serums'."
                            },
                            {
                                "question": "In the clinical report 'The CSF appeared xanthochromic and turbid', the words 'xanthochromic' and 'turbid' function as:",
                                "options": [
                                    "Predicate nouns",
                                    "Descriptive adjectives",
                                    "Adverbs of manner",
                                    "Relative pronouns"
                                ],
                                "correctIndex": 1,
                                "explanation": "They are descriptive adjectives modifying the noun 'CSF' and characterizing its visual diagnostic attributes."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "How do adjectives help in describing clinical macroscopic specimens?",
                                "answer": "Adjectives provide precise descriptive diagnostic details regarding specimen color, consistency, clarity, and volume, such as 'grossly lipemic serum', 'tarry stool', or 'straw-colored peritoneal fluid'.",
                                "frequentlyAskedIn": "SMFB Oral Examination"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2022",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Classify nouns with examples from a medical laboratory environment. (Marks: 6)",
                                "modelAnswer": "1. Proper: Widal test, Giemsa stain; 2. Common: microscope, autoclave; 3. Collective: panel of tests, colony of bacteria; 4. Abstract: accuracy, sterility; 5. Uncountable: whole blood, sputum.",
                                "marks": 6
                            }
                        ]
                    },
                    {
                        "id": "eng-les-3",
                        "title": "Lesson 3: Verbs, Adverbs, Articles & Essential Prepositions",
                        "duration": "30 min",
                        "notes": [
                            "Verbs represent actions (centrifuge, incubate, aspirate, titrate) or states (appear, remain, indicate). Transitive verbs require direct objects ('Pipette 100 microliters of buffer').",
                            "Adverbs of Manner, Degree, and Frequency: Describe how diagnostic procedures are performed: 'mix gently by inversion', 'vortex vigorously', 'centrifuge immediately', 'read absorbance precisely'.",
                            "Articles (A, An, The): Use 'an' before vowel sounds ('an ESR tube', 'an erythrocyte'); use 'the' for definite, specific instruments or specimens ('the automated analyzer').",
                            "Prepositions in Clinical Protocols: Spatial and temporal prepositions (in, on, at, by, for, under, across) govern sample storage and incubation conditions ('incubate at 37°C for 30 minutes in a water bath')."
                        ],
                        "benchAlert": "In standard operating procedures, imperative verb forms ('Invert the tube gently 8 to 10 times') are mandatory for clear, unambiguous technician instructions.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-3",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "Choose the correct preposition: 'The bacterial culture was incubated _____ 37°C _____ 24 hours.'",
                                "options": [
                                    "in; by",
                                    "at; for",
                                    "on; during",
                                    "with; to"
                                ],
                                "correctIndex": 1,
                                "explanation": "Temperatures take 'at' ('at 37°C') and durations of incubation take 'for' ('for 24 hours')."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Why are imperative action verbs standard in laboratory Standard Operating Procedures?",
                                "answer": "Imperative verbs directly instruct the technologist on exact procedural steps without unnecessary grammatical padding, minimizing operational errors during testing.",
                                "frequentlyAskedIn": "SMFB Board Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2021",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Fill in the blanks with appropriate prepositions: (a) Keep reagents _____ 2-8°C. (b) Centrifuge blood _____ 3000 RPM _____ 10 minutes. (Marks: 4)",
                                "modelAnswer": "(a) at (or between); (b) at; for.",
                                "marks": 4
                            }
                        ]
                    }
                ]
            },
            {
                "id": "eng-sub-1-2",
                "title": "Sub-Module 1.2: Tenses, Conjugation, Punctuation & Orthography",
                "lessons": [
                    {
                        "id": "eng-les-4",
                        "title": "Lesson 4: Tense Concordance & Conjugation of Regular & Irregular Verbs",
                        "duration": "30 min",
                        "notes": [
                            "Tense concordance is essential for maintaining scientific credibility: Use Past Tense for completed patient testing and experimental assays ('The specimen was centrifuged at 3000 RPM').",
                            "Use Simple Present Tense for established scientific laws, biological reference intervals, and chemical reactions ('Hemoglobin binds reversibly to oxygen in pulmonary alveoli').",
                            "Regular vs. Irregular Verbs: Regular verbs add -ed (incubated, aspirated, titrated). Irregular verbs change stems: bind/bound/bound, bleed/bled/bled, draw/drew/drawn, freeze/froze/frozen.",
                            "Subject-Verb Agreement: Singular subjects require singular verbs: 'The presence of ketone bodies indicates ketoacidosis.' Plural subjects take plural verbs: 'Elevated leukocyte counts indicate infection.'"
                        ],
                        "benchAlert": "Beware of deceptive subjects: in 'A panel of cardiac biomarkers was tested', the subject is 'panel' (singular), not 'biomarkers'.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-4",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "Identify the correct subject-verb agreement: 'A cluster of Gram-positive cocci _____ observed under the microscope.'",
                                "options": [
                                    "were",
                                    "was",
                                    "are",
                                    "have been"
                                ],
                                "correctIndex": 1,
                                "explanation": "'A cluster' is a singular collective noun, requiring the singular past verb 'was'."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Which grammatical tense must be employed when writing clinical laboratory diagnostic reports?",
                                "answer": "Simple Past Tense (passive voice) is standard for completed patient procedures and observed test outcomes, while Simple Present Tense is reserved for diagnostic reference intervals and interpretations.",
                                "frequentlyAskedIn": "SMFB English Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2023",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Conjugate the following verbs in Past and Past Participle forms: Draw, Freeze, Bind, Spin, Shake. (Marks: 5)",
                                "modelAnswer": "Draw - Drew - Drawn; Freeze - Froze - Frozen; Bind - Bound - Bound; Spin - Spun - Spun; Shake - Shook - Shaken.",
                                "marks": 5
                            }
                        ]
                    },
                    {
                        "id": "eng-les-5",
                        "title": "Lesson 5: Punctuation Rules: Capitalization, Commas, Colons, Semicolons & Hyphens",
                        "duration": "25 min",
                        "notes": [
                            "Capitalization: Capitalize the first word of a sentence, proper names (Staphylococcus aureus, Leishman stain), acronyms (ELISA, PCR, CBC), and abbreviations of units (mL, mg/dL, IU/L).",
                            "Comma Rules: Use commas to separate items in a series ('sodium, potassium, and chloride'), after introductory prepositional phrases, and to set off non-restrictive clauses.",
                            "Colons and Semicolons: Use a colon to introduce a list or diagnostic summary ('Differential WBC count: Neutrophils 65%, Lymphocytes 28%'). Use a semicolon to link closely related independent clauses.",
                            "Hyphenation in Medical Nomenclature: Use hyphens in compound adjectives preceding nouns ('Gram-negative bacilli', 'high-yield notes', 'well-calibrated micropipette')."
                        ],
                        "benchAlert": "In diagnostic numerical reporting, a misplaced decimal point or ambiguous comma can lead to a tenfold dosage error: write '1.5 mg/dL', never '.5 mg/dL' (always precede with a zero: '0.5 mg/dL').",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-5",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "Which of the following sentences utilizes punctuation and capitalization correctly according to scientific conventions?",
                                "options": [
                                    "The patient was screened with elisa, and pcr tests.",
                                    "The technologist examined the Gram-negative bacilli; no spore formation was observed.",
                                    "incubate at 37c for 24 hours: then read the results.",
                                    "Serum electrolytes; sodium potassium and chloride were normal."
                                ],
                                "correctIndex": 1,
                                "explanation": "'Gram-negative' is properly capitalized and hyphenated, and the semicolon correctly joins two closely related independent clauses."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Why is hyphenation critical in medical terminology like 'Gram-negative' or 'iron-deficiency anemia'?",
                                "answer": "Hyphenation creates a compound adjective indicating that both words jointly modify the noun, preventing ambiguity in clinical pathology reports.",
                                "frequentlyAskedIn": "SMFB Board Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2020",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Punctuate and capitalize: 'blood was collected in an edta vial then mixed gently to prevent clotting' (Marks: 4)",
                                "modelAnswer": "Blood was collected in an EDTA vial, then mixed gently to prevent clotting.",
                                "marks": 4
                            }
                        ]
                    },
                    {
                        "id": "eng-les-6",
                        "title": "Lesson 6: Spelling Rules, Idiomatic Expressions & Correction of Wrong Words",
                        "duration": "30 min",
                        "notes": [
                            "Common Orthographic Traps in Laboratory Medicine: Hemoglobin (British: Haemoglobin), Leishman, Wright-Giemsa, Centrifuge, Erythrocyte, Thrombocytopenia, Microscopic, Calibration, Absorbance.",
                            "Scientific Binomial Nomenclature: Genus is capitalized and species is lowercase; both must be italicized in print or underlined in handwritten examinations (e.g., Entamoeba histolytica).",
                            "Correction of Wrong Words: Avoid confusing homophones and near-homophones: Affect (verb) vs. Effect (noun); Discrete (separate) vs. Discreet (confidential); Principle (fundamental law) vs. Principal (head of institute).",
                            "Medical Idioms & Phrasing: Idiomatic clinical phrases like 'within normal limits (WNL)', 'ruled out', 'in tandem', and 'gold standard' must be used with precision."
                        ],
                        "benchAlert": "In clinical viva examinations, spelling errors in microorganism names or diagnostic tests (e.g. spelling 'Typhoid' as 'Tipoid') result in immediate mark deductions.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-6",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "Choose the correct sentence regarding scientific binomial nomenclature formatting:",
                                "options": [
                                    "The patient was infected with staphylococcus Aureus.",
                                    "The patient was infected with Staphylococcus aureus.",
                                    "The patient was infected with STAPHYLOCOCCUS AUREUS.",
                                    "The patient was infected with staphylococcus aureus."
                                ],
                                "correctIndex": 1,
                                "explanation": "Genus is capitalized, species is lowercase, and the name is italicized (or underlined when handwritten)."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Differentiate between 'Principle' and 'Principal' in a laboratory medicine context.",
                                "answer": "'Principle' refers to the underlying scientific or chemical mechanism of an assay (e.g., 'the principle of the Jaffe reaction'). 'Principal' refers to the chief administrative authority (e.g., 'Principal of the Medical Technology Institute') or the primary component.",
                                "frequentlyAskedIn": "SMFB English Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2022",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Correct the misspelled clinical words: 1. Hemoglogin, 2. Erithrocyte, 3. Centryfuge, 4. Colesterole, 5. Bilirubene. (Marks: 5)",
                                "modelAnswer": "1. Hemoglobin (or Haemoglobin); 2. Erythrocyte; 3. Centrifuge; 4. Cholesterol; 5. Bilirubin.",
                                "marks": 5
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "eng-mod-2",
        "unitNumber": 2,
        "title": "Topic 2: Translation, Comprehension & Thematic Group Discussion (Part-I c, e)",
        "description": "Bilingual translation (Bengali to English & English to Bengali), technical description, reading comprehension of scientific manuals, and guided group discussions on national health priorities.",
        "learningOutcomes": [
            "Translate clinical case notes and instructions accurately between Bengali and English.",
            "Write short stories and objective technical descriptions of laboratory equipment.",
            "Comprehend and extract crucial diagnostic data from scientific publications and lecture sheets.",
            "Participate actively in English group discussions on population, nutrition, and environmental pollution."
        ],
        "subModules": [
            {
                "id": "eng-sub-2-1",
                "title": "Sub-Module 2.1: Bilingual Translation & Technical Descriptions",
                "lessons": [
                    {
                        "id": "eng-les-7",
                        "title": "Lesson 7: Bengali to English Translation for Diagnostic Medicine",
                        "duration": "35 min",
                        "notes": [
                            "Translation in medical laboratory practice bridges patient native language complaints with standardized English medical records and international diagnostic terminology.",
                            "Core Grammar Shifts: Bengali sentences typically follow Subject-Object-Verb (SOV) order, whereas English strictly follows Subject-Verb-Object (SVO) order. Maintain tense concordance during translation.",
                            "Translating Phlebotomy Directives: 'রক্ত পরীক্ষার জন্য খালি পেটে ১২ ঘণ্টা থাকতে হবে' -> 'A fasting period of 12 hours is mandatory for blood examination.'",
                            "Translating Critical Findings: 'রোগীর প্রস্রাবে প্রচুর পরিমাণে পুঁজ কোষ পাওয়া গেছে' -> 'The patient's urine examination demonstrated numerous pus cells (pyuria).'"
                        ],
                        "benchAlert": "Avoid literal word-for-word translation (transliteration). Translate the clinical intent and terminology into standardized English medical syntax.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-7",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "What is the best English translation for 'সংগৃহীত রক্ত নমুনাটি জমাট বাঁধা যাবে না'?",
                                "options": [
                                    "The collected blood sample must not be clotted.",
                                    "Collected blood don't make clot.",
                                    "Blood sample taken without any clotting.",
                                    "Blood was taken not to clot."
                                ],
                                "correctIndex": 0,
                                "explanation": "'The collected blood sample must not be clotted' accurately conveys the clinical requirement using professional medical passive syntax."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Translate orally: 'ল্যাবরেটরি থেকে রিপোর্ট নেওয়ার সময় মানি রিসিট সঙ্গে আনবেন।'",
                                "answer": "'Please bring your money receipt while collecting the test report from the laboratory.'",
                                "frequentlyAskedIn": "SMFB Viva Voce"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2023",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Translate into English: (a) ডেঙ্গু জ্বরে রক্তে প্লাটিলেটের সংখ্যা দ্রুত হ্রাস পায়। (b) জীবাণুমুক্ত সুঁই দিয়ে রক্ত নেওয়া উচিত। (Marks: 6)",
                                "modelAnswer": "(a) In dengue fever, the platelet count decreases rapidly in the blood. (b) Blood should be drawn using a sterile disposable needle.",
                                "marks": 6
                            }
                        ]
                    },
                    {
                        "id": "eng-les-8",
                        "title": "Lesson 8: English to Bengali Translation & Instrument Technical Descriptions",
                        "duration": "35 min",
                        "notes": [
                            "English-to-Bengali translation is critical when communicating reagent kit warnings, manufacturer safety labels, and operating procedures to nursing and auxiliary healthcare personnel.",
                            "Technical Descriptions: A technical description provides an objective breakdown of an instrument's Purpose, Physical Construction, Working Principle, Operating Controls, and Maintenance Guidelines.",
                            "Describing a Compound Light Microscope: 1. Heavy U-shaped cast base and supporting limb; 2. Optical system: objective lenses (10x, 40x, 100x oil immersion) and ocular eyepiece (10x); 3. Illumination: sub-stage Abbe condenser and iris diaphragm; 4. Mechanical stage with coaxial fine and coarse adjustment knobs.",
                            "Describing a Benchtop Centrifuge: Rotor assembly, safety lid interlock, speed governor (RPM tachometer), electronic timer, and paired balanced bucket carriers."
                        ],
                        "benchAlert": "In technical descriptions of laboratory equipment, never express subjective opinions; focus exclusively on verifiable mechanical specifications, safety interlocks, and operational parameters.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-8",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "Which component of a compound light microscope regulates the angle and intensity of the illumination beam hitting the specimen slide?",
                                "options": [
                                    "Revolving nosepiece",
                                    "Coarse adjustment knob",
                                    "Sub-stage Abbe condenser with iris diaphragm",
                                    "Mechanical stage clip"
                                ],
                                "correctIndex": 2,
                                "explanation": "The sub-stage condenser focuses the light beam onto the slide plane, while the iris diaphragm adjusts the aperture and contrast."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Give a 1-minute technical description of a laboratory centrifuge.",
                                "answer": "A centrifuge is an electro-mechanical diagnostic instrument that utilizes centrifugal force to accelerate the sedimentation of suspended particulate matter from liquids based on particle density. Key components include an electric motor, a rotary head with balanced tube buckets, speed tachometer, digital timer, and a protective safety lid lock.",
                                "frequentlyAskedIn": "SMFB Board Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2022",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Write a technical description of a Compound Microscope used in a clinical pathology laboratory. (Marks: 10)",
                                "modelAnswer": "Include introduction, labeled diagram components (base, body tube, arm, stage, condenser, objectives, oculars), working principle, magnification formula (Total = Ocular x Objective), and cleaning/maintenance precautions.",
                                "marks": 10
                            }
                        ]
                    }
                ]
            },
            {
                "id": "eng-sub-2-2",
                "title": "Sub-Module 2.2: Scientific Comprehension & Public Health Group Discussions",
                "lessons": [
                    {
                        "id": "eng-les-9",
                        "title": "Lesson 9: Comprehension of Scientific Manuals, Reports & Lecture Sheets",
                        "duration": "30 min",
                        "notes": [
                            "Scientific Reading Strategies: Skimming (rapidly reading title, abstract, and headings for overall context) and Scanning (searching for specific parameters, numbers, wavelengths, or reference ranges).",
                            "Analyzing Reagent Package Inserts: Locate vital operational parameters: 1. Assay Principle, 2. Storage Temperature (2-8°C or -20°C), 3. Reconstitution instructions, 4. Linear Range (e.g., 0-500 mg/dL), 5. Interfering Substances (hemolysis, icterus).",
                            "Synthesizing Clinical Pathologist Notes: Technologists must accurately interpret diagnostic comments, reflex testing orders, and diagnostic flags.",
                            "Answering Comprehension Questions: Formulate concise, grammatically complete answers extracting evidence directly from the text without outside conjecture."
                        ],
                        "benchAlert": "When reading manufacturer kit inserts, always locate the 'Limitations of Procedure' section first to identify known interfering drugs or physiological variants.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-9",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "What reading strategy is used to locate the specific incubation temperature in a 5-page reagent manual?",
                                "options": [
                                    "Critical evaluation",
                                    "Scanning",
                                    "Extensive reading",
                                    "Skimming"
                                ],
                                "correctIndex": 1,
                                "explanation": "Scanning involves rapidly moving eyes across text to locate a specific keyword or data point (such as '37°C' or 'Temperature')."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "What information must a technologist extract from a reagent kit package insert prior to running a new batch?",
                                "answer": "Principle of the test, storage conditions, reagent stability after reconstitution, calibration instructions, quality control requirements, linearity limits, and interfering factors.",
                                "frequentlyAskedIn": "SMFB Board Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2021",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Read the provided clinical passage on Hepatitis B transmission and answer five comprehension questions. (Marks: 10)",
                                "modelAnswer": "Demonstrate accurate text-based answers using proper grammar and complete sentences.",
                                "marks": 10
                            }
                        ]
                    },
                    {
                        "id": "eng-les-10",
                        "title": "Lesson 10: Group Discussion: Population, Family Planning, Food & Pollution",
                        "duration": "40 min",
                        "notes": [
                            "Group Discussion (GD) Dynamics: Developing oral argumentation, active listening, respectful turn-taking, and professional consensus building in clinical team meetings.",
                            "Topic A: Population & Family Planning: Population growth pressure on healthcare facilities in Bangladesh; clinical role of medical technology in maternal health and family planning clinics.",
                            "Topic B: Food Hygiene & Adulteration: Chemical food contaminants (formalin, urea, synthetic dyes) and their impact on liver and kidney function; role of food safety testing.",
                            "Topic C: Environmental Pollution & Biomedical Waste: Segregation of hospital waste (red, yellow, black bins), sharps disposal, preventing nosocomial infections and groundwater contamination."
                        ],
                        "benchAlert": "In group discussions, avoid aggressive interruptions. Use polite conversational phrases: 'I agree with that point, and I would like to add...', or 'May I respectfully point out that...' ",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-10",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "Which color-coded receptacle is internationally designated for contaminated sharps (needles, scalpels) in hospital waste management?",
                                "options": [
                                    "Black bag",
                                    "Puncture-proof yellow container with biohazard symbol",
                                    "Green bucket",
                                    "Clear plastic box"
                                ],
                                "correctIndex": 1,
                                "explanation": "Sharps waste must be deposited into rigid, puncture-proof yellow containers labeled with the international biohazard symbol."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Speak for 1 minute on: 'Why is medical waste segregation critical for hospital safety?'",
                                "answer": "Medical waste segregation prevents the mixing of infectious biohazardous waste with general domestic refuse. Contaminated sharps and infectious body fluids transmit HIV, Hepatitis B, and drug-resistant pathogens if disposed of carelessly. Segregating waste at the point of generation protects healthcare workers, waste handlers, and the public.",
                                "frequentlyAskedIn": "SMFB Communicative English Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2023",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Write a short composition on 'Biomedical Waste Management in Clinical Laboratories'. (Marks: 8)",
                                "modelAnswer": "Discuss definition of clinical waste, color-coded segregation, autoclaving, incineration, sharps management, and environmental protection.",
                                "marks": 8
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "eng-mod-3",
        "unitNumber": 3,
        "title": "Topic 3: Professional, Academic & Clinical Observation Report Writing (Part-I d & Part-II)",
        "description": "Academic paragraphs, summaries, formal applications, official correspondence, and comprehensive reports of observation in the laboratory, ward, clinic, and community field.",
        "learningOutcomes": [
            "Draft structured paragraphs and essays on basic medical and scientific subjects.",
            "Compose formal applications for leave, equipment requisitions, and job placements.",
            "Draft professional letters to healthcare administrators and suppliers.",
            "Write detailed, objective observation reports for laboratory, ward, clinic, and field visits.",
            "Synthesize complex diagnostic articles into concise summaries."
        ],
        "subModules": [
            {
                "id": "eng-sub-3-1",
                "title": "Sub-Module 3.1: Medical Paragraphs, Essays & Summary Composition",
                "lessons": [
                    {
                        "id": "eng-les-11",
                        "title": "Lesson 11: Paragraph Writing on Core Medical & Diagnostic Topics",
                        "duration": "30 min",
                        "notes": [
                            "Paragraph Anatomy: 1. Topic Sentence (states the controlling idea), 2. Supporting Sentences (provide clinical evidence, statistics, mechanisms), 3. Concluding Sentence (summarizes and provides diagnostic closure).",
                            "Cohesive Devices: Transition words that ensure logical flow: 'Furthermore', 'Consequently', 'In contrast', 'Similarly', 'As a result'.",
                            "Standard Diagnostic Essay Topics: 'Role of Blood Transfusion in Emergency Medicine', 'Early Laboratory Detection of Dengue Fever', 'Antimicrobial Resistance: A Global Health Threat', 'Immunization and Public Health'.",
                            "Stylistic Rules: Maintain formal academic register, third-person objective voice, and avoid informal slang or contractions (write 'do not' instead of 'don't')."
                        ],
                        "benchAlert": "In examination paragraph writing, avoid rambling. Keep paragraph length between 120 to 180 words, strictly structured around a single cohesive topic.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-11",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "What is the primary function of the topic sentence in a scientific paragraph?",
                                "options": [
                                    "To state the author's personal feelings",
                                    "To announce the central theme and scope of the paragraph",
                                    "To list references and bibliography",
                                    "To conclude the essay"
                                ],
                                "correctIndex": 1,
                                "explanation": "The topic sentence articulates the main controlling idea that all subsequent supporting sentences develop."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "What are the three essential components of a well-written paragraph?",
                                "answer": "A topic sentence stating the central idea, supporting sentences developing the idea with evidence and explanations, and a concluding sentence summarizing the main point.",
                                "frequentlyAskedIn": "SMFB Board Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2023",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Write a paragraph on 'Dengue Fever and the Importance of Platelet Monitoring'. (Marks: 8)",
                                "modelAnswer": "Include etiology (Aedes mosquito, Flavivirus), clinical manifestations, thrombocytopenia mechanism, daily CBC platelet tracking, and hematocrit monitoring for plasma leakage.",
                                "marks": 8
                            }
                        ]
                    },
                    {
                        "id": "eng-les-12",
                        "title": "Lesson 12: Summary Writing & Précis Construction from Scientific Text",
                        "duration": "30 min",
                        "notes": [
                            "Précis & Summary Writing: Condensing an extended scientific passage to approximately one-third of its original length while faithfully preserving its core meaning, key facts, and tone.",
                            "Step-by-Step Précis Protocol: 1. Read carefully twice to identify the thesis; 2. Underline essential data points and omit illustrative anecdotes; 3. Paraphrase in your own words; 4. Count words and provide a title.",
                            "What to Exclude: Omit redundant examples, rhetorical questions, personal interpretations, and tangential metaphors.",
                            "Maintaining Neutrality: Never introduce outside knowledge or opinions that were not present in the original source passage."
                        ],
                        "benchAlert": "Never copy complete sentences directly from the original passage during a précis; rewriting in your own words demonstrates true comprehension.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-12",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "What is the ideal target length of a précis relative to the original source passage?",
                                "options": [
                                    "Equal length",
                                    "Two-thirds",
                                    "One-third",
                                    "One-tenth"
                                ],
                                "correctIndex": 2,
                                "explanation": "A standard academic précis should be approximately one-third the word count of the original passage."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "What is the key rule regarding personal opinions in summary writing?",
                                "answer": "A summary must remain entirely objective and neutral; the writer must never add personal opinions, outside facts, or critical judgments.",
                                "frequentlyAskedIn": "SMFB Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2022",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Write a précis of the provided 300-word passage on 'Tuberculosis Control in Bangladesh' with a suitable title. (Marks: 8)",
                                "modelAnswer": "Title: DOTS Strategy and Tuberculosis Control. Condense to ~100 words covering diagnosis (GeneXpert/AFB), DOTS compliance, and prevention.",
                                "marks": 8
                            }
                        ]
                    }
                ]
            },
            {
                "id": "eng-sub-3-2",
                "title": "Sub-Module 3.2: Formal Applications, Correspondence & Clinical Observation Reports",
                "lessons": [
                    {
                        "id": "eng-les-13",
                        "title": "Lesson 13: Formal Application & Official Administrative Letter Writing",
                        "duration": "35 min",
                        "notes": [
                            "Standard Formal Application Format: 1. Date, 2. Addressee designation and address (e.g. 'To The Superintendent, District Hospital'), 3. Subject line (e.g. 'Subject: Application for leave of absence'), 4. Formal Salutation ('Sir/Madam'), 5. Body paragraphs, 6. Complimentary close ('Yours obediently' or 'Yours faithfully'), 7. Signature and designation.",
                            "Common Clinical Applications: Application for exam leave, application for replacement of defective laboratory equipment, application for internship placement.",
                            "Official Correspondence with Vendors: Drafting inquiries regarding reagent lot expiry, requests for annual maintenance contracts (AMC), and warranty claims.",
                            "Tone and Register: Maintain polite, respectful, and authoritative professional tone with no casual greetings."
                        ],
                        "benchAlert": "In official letters, always reference previous correspondence or invoice numbers: 'With reference to Purchase Order #PO-2024-88, we wish to notify you...'",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-13",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "Which of the following complimentary closes is most appropriate when writing to an official institutional authority?",
                                "options": [
                                    "Best regards,",
                                    "Warmest wishes,",
                                    "Yours faithfully,",
                                    "Cheers,"
                                ],
                                "correctIndex": 2,
                                "explanation": "'Yours faithfully' (or 'Yours obediently' for students to principals) is the recognized formal close when addressing institutional heads."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "What are the six structural elements of a formal administrative letter?",
                                "answer": "Sender/Date heading, recipient address, subject line, formal salutation, body text (context, request, action), and formal sign-off with designation.",
                                "frequentlyAskedIn": "SMFB Board Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2023",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Write an application to the Director of your Institute requesting repair and recalibration of the electronic analytical balance. (Marks: 8)",
                                "modelAnswer": "Include formal header, subject line, detailed breakdown of balance drift impacting reagent preparation, request for authorized service engineer, and polite closing.",
                                "marks": 8
                            }
                        ]
                    },
                    {
                        "id": "eng-les-14",
                        "title": "Lesson 14: Clinical Observation Reports in Laboratory, Ward & Clinic",
                        "duration": "35 min",
                        "notes": [
                            "Purpose of an Observation Report: To provide a factual, objective, chronologically documented account of an educational visit, clinical laboratory bench rotation, hospital ward round, or field outreach program.",
                            "Mandatory Sections: 1. Title & Location of Observation, 2. Date and Time, 3. Observer Name and Role, 4. Scope and Objectives, 5. Methodological Observations (equipment used, workflow, biosafety), 6. Case/Specimen Data, 7. Key Findings & Lessons Learned, 8. Recommendations and Observer Signature.",
                            "Observation Report Example (Clinical Biochemistry Ward Rotation): Documenting specimen transport in cold chain boxes, barcode scanning at central accessioning, centrifuge balancing, and automated chemistry analyzer operation.",
                            "Incident & Non-Conformance Reporting: Documenting pre-analytical errors (e.g. mislabeled tubes, clotted EDTA blood) and corrective actions taken."
                        ],
                        "benchAlert": "Never document assumptions in observation reports; record only directly observed physical phenomena, timestamps, instrument error codes, and factual interventions.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-14",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "In a clinical observation report, where do technician recommendations and reflections belong?",
                                "options": [
                                    "In the title line",
                                    "In the Concluding Recommendations section",
                                    "Within the raw accessioning log",
                                    "They should never be included"
                                ],
                                "correctIndex": 1,
                                "explanation": "Recommendations and analytical reflections follow the factual observation findings in the concluding section of the report."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Why are observation reports required following hospital laboratory rotations?",
                                "answer": "Observation reports evaluate a student's ability to critically analyze clinical workflows, identify biosafety compliance, observe diagnostic methodology, and communicate findings in structured professional English.",
                                "frequentlyAskedIn": "SMFB Board Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2022",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Draft an Observation Report based on your visit to the Central Blood Transfusion Center of a Medical College Hospital. (Marks: 10)",
                                "modelAnswer": "Include header, objective (blood banking workflow), donor screening, phlebotomy, component separation (PRBC, FFP, Platelets), TTI testing (HIV, HBV, HCV, Syphilis, Malaria), crossmatching, storage, and conclusions.",
                                "marks": 10
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "eng-mod-4",
        "unitNumber": 4,
        "title": "Topic 4: Communicative English Four Dimensions (Part-II Reading, Writing, Listening, Speaking)",
        "description": "Reading comprehension of medical manuals, listening comprehension of clinical audio dialogues, spoken fluency with clinicians and patients, and external board oral viva voce mastery.",
        "learningOutcomes": [
            "Read and critically interpret scientific literature, research papers, and technical bulletins.",
            "Listen and accurately transcribe spoken dialogues, clinical consultations, and audio lectures.",
            "Demonstrate oral fluency, accurate pronunciation, and confidence in clinical presentations.",
            "Perform with distinction in oral board viva voce examinations and professional interviews."
        ],
        "subModules": [
            {
                "id": "eng-sub-4-1",
                "title": "Sub-Module 4.1: Reading & Listening Comprehension",
                "lessons": [
                    {
                        "id": "eng-les-15",
                        "title": "Lesson 15: Critical Reading of Clinical Case Reports & Equipment Manuals",
                        "duration": "30 min",
                        "notes": [
                            "Critical reading requires decoding specialized terminology, assessing evidence credibility, and interpreting multi-parameter laboratory printouts.",
                            "Interpreting Histopathology & Hematology Reports: Distinguishing between normal reference limits, borderline flags, and panic/critical alert thresholds requiring immediate clinician notification.",
                            "Reading Equipment Troubleshooting Flowcharts: Interpreting error codes, diagnostic flags (e.g. 'WBC Clump', 'Fibrin clot detected', 'Lamp failure'), and step-by-step resolution trees in analyzer user guides.",
                            "Note-Taking from Scientific Literature: Using Cornell notes and linear outlining to record definitions, reference values, and diagnostic principles."
                        ],
                        "benchAlert": "When encountering an unfamiliar abbreviation in a laboratory manual, consult the official glossary; never guess abbreviations as 'PT' can mean Prothrombin Time, Patient, or Physical Therapy.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-15",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "What is the primary objective of troubleshooting flowcharts in diagnostic instrument manuals?",
                                "options": [
                                    "To explain biochemical principles",
                                    "To guide the operator step-by-step from error code to corrective action",
                                    "To advertise accessory parts",
                                    "To list warranty terms"
                                ],
                                "correctIndex": 1,
                                "explanation": "Troubleshooting flowcharts systematically diagnose and resolve operational errors (e.g. clot detection, probe failure) to minimize laboratory downtime."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "How do you systematically approach a new equipment working manual?",
                                "answer": "Review the safety warnings, examine the operational specifications and installation requirements, master the calibration and testing protocol, and study the routine maintenance and troubleshooting section.",
                                "frequentlyAskedIn": "SMFB Practical Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2023",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Read the provided analyzer troubleshooting guide and answer questions on error code E-104 (Aspiration Pressure Low). (Marks: 6)",
                                "modelAnswer": "Demonstrate step-by-step resolution: check probe for clot, inspect vacuum tubing, verify rinse solution, perform fluidics prime.",
                                "marks": 6
                            }
                        ]
                    },
                    {
                        "id": "eng-les-16",
                        "title": "Lesson 16: Listening to Medical Dialogues & Audio Recorded Consultations",
                        "duration": "30 min",
                        "notes": [
                            "Listening Comprehension in Clinical Settings: Listening to verbal doctor instructions, telephone panic value notifications, and recorded medical lectures.",
                            "Verbal Read-Back Protocol: In clinical medicine, critical telephone results must be read back word-for-word: 'This is the laboratory reporting a critical potassium of 6.8 mmol/L for patient Jane Doe, MRN #1024. Please confirm read-back.'",
                            "Phonetic Nuance & Pronunciation: Distinguishing easily confused diagnostic numbers and sounds: fifteen (15) vs. fifty (50); hypo- vs. hyper-; micro- vs. macro-.",
                            "Active Listening Skills: Maintaining eye contact, nodding, transcribing immediately into the laboratory phone logbook, and requesting clarification when audio is unclear."
                        ],
                        "benchAlert": "In telephone panic reporting, failure to complete an explicit verbal read-back is a severe regulatory violation under hospital accreditation standards.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-16",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "What is the mandatory clinical communication protocol when reporting a critical panic laboratory value over the telephone?",
                                "options": [
                                    "Speak as quickly as possible",
                                    "Require the recipient to repeat/read back the patient name, ID, test, and value",
                                    "Send a text message without speaking",
                                    "Leave a voicemail"
                                ],
                                "correctIndex": 1,
                                "explanation": "The verbal read-back protocol confirms that the recipient has heard, transcribed, and understood the critical diagnostic value accurately."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Demonstrate how you would verbally report a critical panic blood sugar of 25 mg/dL to a ward nurse.",
                                "answer": "'Hello, this is Medical Technologist Rahim from Central Biochemistry. I am reporting a critical panic value: Patient Mohammad Ali, Bed 14, Ward 5, MRN #7842. Random Blood Glucose is 25 mg/dL (severe hypoglycemia). Please read back the patient name and value.'",
                                "frequentlyAskedIn": "SMFB Oral Board Viva"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2021",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Explain the importance of verbal read-back protocol in hospital clinical laboratories. (Marks: 5)",
                                "modelAnswer": "Discuss preventing transcription errors, patient safety, documentation standards, and mutual legal accountability.",
                                "marks": 5
                            }
                        ]
                    }
                ]
            },
            {
                "id": "eng-sub-4-2",
                "title": "Sub-Module 4.2: Spoken Clinical Communication & Viva Preparation",
                "lessons": [
                    {
                        "id": "eng-les-17",
                        "title": "Lesson 17: Interactive Clinical Dialogue & Patient Communication",
                        "duration": "35 min",
                        "notes": [
                            "Patient Phlebotomy Dialogue: Professional greetings, verifying identity using two identifiers (name and date of birth), explaining the procedure gently, and obtaining informed consent.",
                            "Sample Dialogue: 'Good morning, Mr. Rahman. I am your medical technologist today. I need to collect a small blood sample for your routine tests. Have you been fasting for 10 hours?'",
                            "De-escalating Patient Anxiety: Managing patients who fear needles (trypanophobia) or feel faint (vasovagal syncope): 'Take deep breaths through your nose. It will just be a quick pinch. You are doing very well.'",
                            "Giving Clear Specimen Collection Instructions: Providing unambiguous instructions for midstream clean-catch urine, 24-hour urine with preservative, or stool specimens."
                        ],
                        "benchAlert": "Never say 'This will not hurt at all' to a patient; honesty ('You will feel a small prick, please hold very still') builds patient trust and prevents sudden arm withdrawal.",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-17",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "What two patient identifiers must always be verbally confirmed prior to performing phlebotomy?",
                                "options": [
                                    "Patient full name and date of birth (or hospital MRN)",
                                    "Room number and doctor name",
                                    "Diagnosis and marital status",
                                    "Religion and phone number"
                                ],
                                "correctIndex": 0,
                                "explanation": "Patient full name and date of birth/MRN are the universal two-factor identifiers required before any invasive procedure."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "What verbal instructions do you give a patient for collecting a Midstream Clean-Catch Urine specimen?",
                                "answer": "'Wash hands and clean the external genitalia with provided sterile wipes. Begin urinating into the toilet for a couple of seconds, then position the sterile container into the middle stream without stopping to collect 30-50 mL. Void the rest into the toilet. Cap the container securely without touching the inside.'",
                                "frequentlyAskedIn": "SMFB Oral Board Examination"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2022",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Write a short dialogue between a Medical Technologist and an anxious patient undergoing blood collection. (Marks: 8)",
                                "modelAnswer": "Draft 8-10 conversational exchanges covering greeting, ID verification, calming anxiety, gentle instruction, and post-phlebotomy care.",
                                "marks": 8
                            }
                        ]
                    },
                    {
                        "id": "eng-les-18",
                        "title": "Lesson 18: Oral Viva Voce Simulation & External Examiner Presentation",
                        "duration": "35 min",
                        "notes": [
                            "Mastering the SMFB Viva Voce: The oral board examination (25 marks) evaluates not only technical diagnostic competence, but also composure, clear English articulation, and confidence.",
                            "Viva Etiquette: Knock before entering, greet examiners politely ('Good morning, Respected Examiners'), stand or sit upright with professional posture, and maintain respectful eye contact.",
                            "Structuring Oral Responses: Follow the rule of Definition -> Principle -> Normal Range -> Clinical Significance: E.g., 'What is ESR?' -> 'ESR stands for Erythrocyte Sedimentation Rate. It is a non-specific indicator of inflammation based on the rate at which red cells settle in anticoagulated blood over one hour.'",
                            "Handling Difficult Questions: If you do not know an answer, avoid silence or guessing wildly; say professionally: 'I am not completely certain of this specific value, Sir, but I know it is monitored during acute inflammatory states.'"
                        ],
                        "benchAlert": "In oral viva examinations, never argue with examiners. If corrected, acknowledge courteously: 'Thank you for correcting me, Sir; I will note that.'",
                        "attachments": [
                            {
                                "id": "att-eng-official-pdf-18",
                                "name": "SMFB Official Basic English Language Course Syllabus PDF",
                                "fileType": "Official Syllabus PDF",
                                "fileSize": "320 KB",
                                "url": "/curriculum/Basic_English_Language_Course_Syllabus.pdf"
                            }
                        ],
                        "quizzes": [
                            {
                                "question": "What is the most effective sequence when answering an oral viva question defining a clinical test?",
                                "options": [
                                    "Normal range first, then test cost",
                                    "Definition, Principle, Reference Range, and Diagnostic Significance",
                                    "Personal laboratory anecdotes",
                                    "Criticism of the test methodology"
                                ],
                                "correctIndex": 1,
                                "explanation": "The structured sequence of Definition -> Principle -> Reference Values -> Clinical Utility shows clear logical organization and mastery to board examiners."
                            }
                        ],
                        "vivaQAs": [
                            {
                                "question": "Introduce yourself in English to the State Medical Faculty Board of Examiners.",
                                "answer": "'Good morning, Respected Examiners. My name is [Name], and I am a 1st Year student of Diploma in Medical Laboratory Technology at [Institute]. It is an honor to present for my annual board viva voce examination.'",
                                "frequentlyAskedIn": "SMFB Board Opening Question"
                            }
                        ],
                        "previousQuestions": [
                            {
                                "year": "2023",
                                "exam": "SMFB 1st Year Annual Examination",
                                "questionText": "Discuss the essential strategies for securing high marks in the Annual Medical Technology Viva Voce Examination. (Marks: 6)",
                                "modelAnswer": "Cover attire/grooming, formal greeting, active listening, structured answers, clear English pronunciation, acknowledging limitations, and confidence.",
                                "marks": 6
                            }
                        ]
                    }
                ]
            }
        ]
    }
],

    // --------------------------------------------------------------------------
  // 2. ANAT-102: Basic Anatomy
  // --------------------------------------------------------------------------
  "ANAT-102": [
    {
      id: "anat-mod-1",
      unitNumber: 1,
      title: "Topic 1: Human Cell, Basic Histology & Anatomical Planes",
      description: "Cellular organelles, microscopic anatomy of 4 basic tissues, and spatial terminology essential for pathology biopsy grossing.",
      subModules: [
        {
          id: "anat-sub-1-1",
          title: "Sub-Module 1.1: Cellular Microstructure & Basic Tissue Histology",
          lessons: [
            {
              id: "anat-les-1",
              title: "Cell Architecture & Histology of Epithelial and Connective Tissues",
              duration: "30 min",
              notes: [
                "The human body consists of four primary basic tissue types: Epithelial tissue (covers surfaces, lines cavities), Connective tissue (supports and binds structures), Muscular tissue (contractility), and Nervous tissue (signal conduction).",
                "Epithelial Classification: Simple squamous (vascular endothelium, pulmonary alveoli), Simple cuboidal (renal tubules, thyroid follicles), Simple columnar (gastric and intestinal mucosa), Stratified squamous non-keratinized (esophagus, cervix), and Stratified squamous keratinized (epidermis).",
                "Connective Tissue Components: Extracellular matrix (collagen fibers, elastic fibers, reticular fibers, proteoglycan ground substance) and cells (fibroblasts, macrophages, mast cells, plasma cells).",
                "Pathological Significance: Epithelial tissue gives rise to carcinomas; connective tissue gives rise to sarcomas. Histological identification forms the core of biopsy microtomy."
              ],
              benchAlert: "In histotechnology, identifying tissue orientation (epithelial surface facing up) is mandatory before paraffin embedding; inverted embedding causes microtomy cutting artifacts.",
              quizzes: [
                {
                  question: "Which type of epithelium lines the lumen of human blood vessels and lymphatic capillaries?",
                  options: [
                    "Stratified squamous epithelium",
                    "Simple squamous epithelium (Endothelium)",
                    "Transitional epithelium",
                    "Pseudostratified ciliated columnar epithelium"
                  ],
                  correctIndex: 1,
                  explanation: "Simple squamous epithelium lining the vascular lumen is specifically designated as endothelium, providing a smooth, anti-thrombogenic barrier."
                }
              ],
              vivaQAs: [
                {
                  question: "What are the four primary basic tissues of the human body and their histological markers?",
                  answer: "Epithelium (cytokeratin positive, covers surfaces), Connective tissue (vimentin positive, collagen matrix), Muscular tissue (desmin/actin, contractile fibers), and Nervous tissue (neurofilament/S100, conducts electrical impulses).",
                  frequentlyAskedIn: "SMFB Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Classify epithelial tissues with histological diagrams and give one anatomical location for each type. (Marks: 10)",
                  modelAnswer: "Classified into Simple (squamous, cuboidal, columnar, pseudostratified) and Stratified (squamous keratinized/non-keratinized, cuboidal, transitional/urothelium). Examples: Endothelium, kidney tubule, stomach lining, trachea, skin epidermis, and urinary bladder.",
                  marks: 10
                }
              ]
            }
          ]
        },
        {
          id: "anat-sub-1-2",
          title: "Sub-Module 1.2: Cardiovascular & Vascular Anatomy for Phlebotomy",
          lessons: [
            {
              id: "anat-les-2",
              title: "Heart Chambers, Circulatory Circuits & Veins of the Antecubital Fossa",
              duration: "30 min",
              notes: [
                "The cardiovascular system comprises systemic and pulmonary circulations powered by the four-chambered heart (right and left atria, right and left ventricles).",
                "Antecubital Fossa Venous Anatomy for Blood Collection: The primary veins utilized for standardized venipuncture are: 1. Median Cubital Vein (first choice: large, stable, least painful, anchored over bicipital aponeurosis), 2. Cephalic Vein (lateral aspect, second choice), 3. Basilic Vein (medial aspect, close to brachial artery and median nerve; requires caution).",
                "Arterial vs. Venous Architecture: Arteries possess thick tunica media with elastic laminae to withstand high systolic pressures; veins have thinner walls, wider lumens, and semilunar valves to prevent retrograde flow.",
                "Lymphatic System Anatomy: Lymph nodes contain outer cortex (B-cell follicles with germinal centers), paracortex (T-cells), and medulla (plasma cells and cords). The spleen filters aging erythrocytes in red pulp and mounts immune responses in white pulp."
              ],
              benchAlert: "During phlebotomy on the basilic vein, inadvertent arterial puncture of the brachial artery presents as rapid pulsatile bright red blood flow; immediate firm pressure for at least 5 minutes is mandatory.",
              quizzes: [
                {
                  question: "Which vein in the antecubital fossa is the preferred first choice for routine diagnostic venipuncture?",
                  options: [
                    "Basilic vein",
                    "Cephalic vein",
                    "Median cubital vein",
                    "Brachial vein"
                  ],
                  correctIndex: 2,
                  explanation: "The median cubital vein is the premier phlebotomy site because it is well-anchored, large, well-supported by the bicipital aponeurosis, and distant from major nerves."
                }
              ],
              vivaQAs: [
                {
                  question: "Describe the boundaries and contents of the antecubital fossa relevant to medical technologists.",
                  answer: "Boundaries: Superiorly by interepicondylar line, medially by pronator teres, laterally by brachioradialis. Crucial contents: Brachial artery, median nerve, biceps tendon, and superficial median cubital, cephalic, and basilic veins.",
                  frequentlyAskedIn: "SMFB Anatomy Practical OSPE"
                }
              ],
              previousQuestions: [
                {
                  year: "2021",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Draw and label the venous anatomy of the antecubital fossa. Discuss the anatomical reasons for selecting specific veins for phlebotomy. (Marks: 8)",
                  modelAnswer: "Diagram showing cephalic, basilic, and median cubital veins forming H or M patterns. Median cubital is preferred due to anchor stability and lower nerve injury risk compared to the basilic vein.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 3. PHYS-103: Basic Physiology
  // --------------------------------------------------------------------------
  "PHYS-103": [
    {
      id: "phys-mod-1",
      unitNumber: 1,
      title: "Topic 1: Cellular Homeostasis, Body Fluid Compartments & Blood Physiology",
      description: "Internal environment regulation, fluid partitions, erythropoiesis, hemoglobin kinetics, and hemostasis.",
      subModules: [
        {
          id: "phys-sub-1-1",
          title: "Sub-Module 1.1: Homeostasis & Fluid Compartments",
          lessons: [
            {
              id: "phys-les-1",
              title: "Homeostatic Feedback Loops & Body Fluid Dynamics",
              duration: "25 min",
              notes: [
                "Homeostasis is the maintenance of a constant internal environment (milieu intérieur) across extracellular fluid (ECF) parameters: pH (7.35-7.45), temperature (37°C), osmolarity (285-295 mOsm/kg), and electrolyte concentrations.",
                "Body Fluid Compartments: Total body water constitutes approximately 60% of adult body weight. Two-thirds (40% body weight) is Intracellular Fluid (ICF); one-third (20% body weight) is Extracellular Fluid (ECF, partitioned into 15% interstitial fluid and 5% intravascular plasma).",
                "Electrolyte Disparity: ICF major cation is Potassium (K+ ~140 mmol/L) and major anions are organic phosphates and proteins. ECF major cation is Sodium (Na+ ~140 mmol/L) and major anions are Chloride (Cl- ~100 mmol/L) and Bicarbonate (HCO3- ~24 mmol/L).",
                "Clinical Impact: Hemolysis causes massive leakage of intracellular K+ into serum, creating artifactually high potassium results that mimic life-threatening hyperkalemia."
              ],
              benchAlert: "Gross hemolysis in serum specimens falsely elevates potassium, LDH, AST, and magnesium due to rich intracellular red cell concentrations.",
              quizzes: [
                {
                  question: "What is the predominant intracellular cation responsible for resting membrane potentials?",
                  options: ["Sodium (Na+)", "Potassium (K+)", "Calcium (Ca2+)", "Magnesium (Mg2+)"],
                  correctIndex: 1,
                  explanation: "Potassium (K+) is the primary intracellular cation (~140-150 mmol/L), maintained by the Na+/K+ ATPase pump."
                }
              ],
              vivaQAs: [
                {
                  question: "Define homeostasis and explain why serum electrolyte concentrations must remain within narrow physiological limits.",
                  answer: "Homeostasis is the dynamic equilibrium of the internal environment. Electrolyte balance is crucial because deviations alter neuromuscular excitability, cardiac rhythmicity (hyper/hypokalemia), and osmotic water distribution across cell membranes.",
                  frequentlyAskedIn: "SMFB Physiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Discuss the distribution of total body water in various body fluid compartments with normal ionic compositions. (Marks: 8)",
                  modelAnswer: "Total body water = 60% of body weight (42L in 70kg male). ICF = 28L (40%), ECF = 14L (20% = 10.5L interstitial + 3.5L plasma). Na+ high in ECF (140 mEq/L), K+ high in ICF (140 mEq/L).",
                  marks: 8
                }
              ]
            }
          ]
        },
        {
          id: "phys-sub-1-2",
          title: "Sub-Module 1.2: Blood Physiology & Coagulation Cascade",
          lessons: [
            {
              id: "phys-les-2",
              title: "Erythropoiesis, Hemoglobin Function & the Coagulation Cascade",
              duration: "35 min",
              notes: [
                "Erythropoiesis is the production of erythrocytes originating from pluripotent hematopoietic stem cells (PHSC), regulated by renal erythropoietin (EPO) in response to tissue hypoxia.",
                "Stages: Proerythroblast -> Basophilic erythroblast -> Polychromatophilic erythroblast -> Normoblast (orthochromatophilic, nucleated) -> Reticulocyte (contains residual ribosomal RNA, matures in 24-48 hours) -> Mature Erythrocyte (biconcave disc, 120-day lifespan).",
                "Hemoglobin Physiology: Adult HbA contains 2 alpha and 2 beta globin chains with 4 heme iron moieties (Fe2+ ferrous state). Carries oxygen cooperatively via oxy-deoxy conformational changes.",
                "Hemostasis & Coagulation Cascade: Divided into Primary Hemostasis (platelet adhesion, activation, and reversible aggregation forming platelet plug) and Secondary Hemostasis (fibrin clot formation via Extrinsic, Intrinsic, and Common Pathways). Common pathway culminates in Thrombin activating Fibrinogen (Factor I) into insoluble Fibrin polymer (Factor Ia)."
              ],
              benchAlert: "Never underfill blue-top sodium citrate tubes for coagulation testing (PT/APTT); the strict 9:1 blood-to-anticoagulant ratio is essential to avoid artificial prolongation of clotting times.",
              quizzes: [
                {
                  question: "Which coagulation factor is converted into its active enzymatic form to cleave fibrinogen into fibrin polymers?",
                  options: ["Factor VII", "Factor X (Stuart-Prower)", "Prothrombin (Factor II)", "Factor XIII"],
                  correctIndex: 2,
                  explanation: "Prothrombin (Factor II) is cleaved by the prothrombinase complex into active Thrombin (Factor IIa), which directly converts soluble fibrinogen into insoluble fibrin strands."
                }
              ],
              vivaQAs: [
                {
                  question: "Differentiate between serum and plasma from a physiological and laboratory standpoint.",
                  answer: "Plasma is the liquid portion of anticoagulated whole blood containing all clotting factors including fibrinogen. Serum is the liquid remaining after whole blood has clotted naturally; it lacks fibrinogen and consumable factors (II, V, VIII, XIII).",
                  frequentlyAskedIn: "SMFB Board Examination Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Outline the intrinsic and extrinsic pathways of blood coagulation. List the factors dependent on Vitamin K. (Marks: 10)",
                  modelAnswer: "Extrinsic pathway triggered by tissue factor (Factor III + VIIa); Intrinsic pathway initiated by Factor XII contact activation (XII -> XI -> IX + VIIIa). Both converge on Factor X activation into common pathway (X -> II -> I). Vitamin K dependent factors: II, VII, IX, X and proteins C & S.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 4. COMM-104: Basic Community Medicine & Behavioural Science
  // --------------------------------------------------------------------------
  "COMM-104": [
    {
      id: "comm-mod-1",
      unitNumber: 1,
      title: "Topic 1: Primary Health Care, Epidemiology & Bangladesh Health System",
      description: "Alma-Ata declaration principles, disease transmission patterns, Community Clinics, and medical ethics.",
      subModules: [
        {
          id: "comm-sub-1-1",
          title: "Sub-Module 1.1: Primary Health Care (PHC) & Bangladesh Healthcare Delivery",
          lessons: [
            {
              id: "comm-les-1",
              title: "PHC Principles & Healthcare Delivery Tiers in Bangladesh",
              duration: "25 min",
              notes: [
                "Primary Health Care (PHC) was defined in the 1978 Alma-Ata Declaration as essential healthcare made universally accessible to individuals and families in the community by acceptable means at an affordable cost.",
                "Key Principles of PHC: 1. Equitable distribution, 2. Community participation, 3. Intersectoral coordination, 4. Appropriate technology (reliable, affordable diagnostic tools such as RDTs, glucometers, binocular microscopes).",
                "Healthcare Delivery Tiers in Bangladesh: 1. Primary Level: Community Clinics (1 per 6,000 rural population for basic health, family planning), Union Health & Family Welfare Centers (UHFWC), Upazila Health Complexes (UHC - 31 to 50 bedded hospital with basic pathology lab); 2. Secondary Level: District Sadar Hospitals (100-250 beds); 3. Tertiary Level: Government Medical College Hospitals and Specialized Institutes (e.g., DMCH, SSMC, NIDCH, NICVD, BSMMU).",
                "Laboratory Role in PHC: Early detection of endemic communicable diseases (Malaria, Tuberculosis, Dengue, Kalazar, Enteric fever) and maternal antenatal screening (Hb%, Blood grouping, Urine protein/glucose)."
              ],
              benchAlert: "In rural Community Clinics, test expired diagnostic strips (urine/glucose/malaria) before reporting; tropical humidity rapidly invalidates enzymatic dry reagents.",
              quizzes: [
                {
                  question: "What is the primary operational rural healthcare facility established in Bangladesh serving approximately 6,000 population?",
                  options: [
                    "District Sadar Hospital",
                    "Community Clinic (CC)",
                    "Upazila Health Complex (UHC)",
                    "Division Tertiary Hospital"
                  ],
                  correctIndex: 1,
                  explanation: "Community Clinics are Bangladesh's grassroots primary healthcare units, serving rural clusters of ~6,000 citizens with basic essential service packages."
                }
              ],
              vivaQAs: [
                {
                  question: "What are the core components of the Primary Health Care (PHC) essential package in Bangladesh?",
                  answer: "EPI immunizations, maternal and child healthcare, family planning, provision of essential drugs, health education, nutritional surveillance, safe water/sanitation, and endemic disease control (TB, malaria, dengue).",
                  frequentlyAskedIn: "SMFB Community Medicine Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Discuss the organizational hierarchy of the healthcare delivery system in Bangladesh from grassroots to tertiary levels. (Marks: 8)",
                  modelAnswer: "Grassroots: Community Clinics; Union: UHFWC; Upazila: Upazila Health Complex (UHC); District: 100-250 bed District Hospital; Division/National: Medical College Hospitals, Specialized Tertiary Centers (DMCH, NICVD, BSMMU).",
                  marks: 8
                }
              ]
            }
          ]
        },
        {
          id: "comm-sub-1-2",
          title: "Sub-Module 1.2: Epidemiology, Infectious Disease Surveillance & Medical Ethics",
          lessons: [
            {
              id: "comm-les-2",
              title: "Epidemiological Triad, Disease Outbreaks & Technologist Code of Ethics",
              duration: "25 min",
              notes: [
                "Epidemiology is the study of the distribution and determinants of health-related states or events in specified populations, and the application of this study to the control of health problems.",
                "The Epidemiological Triad consists of: Agent (biological pathogen, chemical), Host (human factors: age, immunity, genetics), and Environment (external factors: sanitation, climate, vector breeding sites).",
                "Chain of Infection: Infectious Agent -> Reservoir -> Portal of Exit -> Mode of Transmission (direct, droplet, vector-borne, airborne) -> Portal of Entry -> Susceptible Host.",
                "Medical Laboratory Ethics: 1. Confidentiality (safeguarding patient identity and sensitive results like HIV, malignancies), 2. Integrity (never fabricate or 'dry-lab' test results), 3. Non-maleficence (do no harm during phlebotomy), 4. Competence (continuous quality assurance and adherence to national DGHS standards)."
              ],
              benchAlert: "Falsifying or guessing laboratory results ('dry-labbing') is an immediate criminal violation of medical ethics and grounds for permanent revocation of technologist credentials.",
              quizzes: [
                {
                  question: "Which pillar of biomedical ethics prohibits unauthorized disclosure of a patient's diagnostic test results to third parties?",
                  options: [
                    "Beneficence",
                    "Patient Confidentiality",
                    "Intersectoral coordination",
                    "Appropriate technology"
                  ],
                  correctIndex: 1,
                  explanation: "Patient confidentiality mandates that all laboratory results remain strictly private and accessible only to the patient and authorized clinical providers."
                }
              ],
              vivaQAs: [
                {
                  question: "What is an epidemiological triad and how does it relate to laboratory disease surveillance?",
                  answer: "The triad consists of Agent, Host, and Environment. Laboratory technologists identify the biological agent (strain, resistance profile) and detect host immunological responses, providing critical data to public health epidemiologists for outbreak containment.",
                  frequentlyAskedIn: "SMFB Community Medicine Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2021",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Define epidemiology. Explain the epidemiological triad with reference to Dengue viral transmission in Bangladesh. (Marks: 8)",
                  modelAnswer: "Epidemiology is the study of health distributions and determinants in populations. For Dengue: Agent = Dengue virus (Flavivirus serotypes 1-4); Vector/Environment = Aedes aegypti breeding in stagnant clean water during monsoon; Host = Susceptible humans.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 5. COMP-105: Basic Computer Science
  // --------------------------------------------------------------------------
  "COMP-105": [
    {
      id: "comp-mod-1",
      unitNumber: 1,
      title: "Topic 1: Computer Hardware, MS Office & Laboratory Information Systems (LIS)",
      description: "Computer architecture, Excel data analysis for QC statistics, networking, and bidirectional analyzer interfacing.",
      subModules: [
        {
          id: "comp-sub-1-1",
          title: "Sub-Module 1.1: Computer Fundamentals & MS Excel for Laboratory Statistics",
          lessons: [
            {
              id: "comp-les-1",
              title: "Hardware, Operating Systems & Statistical QC Calculations in Excel",
              duration: "25 min",
              notes: [
                "Modern medical laboratories rely fundamentally on digital computing for patient data management, automated analyzer control, electronic medical records (EMR), and quality assurance.",
                "Computer Architecture: Central Processing Unit (CPU: ALU, Control Unit, Registers), Primary Memory (RAM for volatile temporary processing, ROM for BIOS firmware), Secondary Storage (SSDs, Hard Drives for archival databases), and Input/Output devices (keyboards, thermal barcode scanners, optical monitors).",
                "MS Excel for Quality Control Statistics: Technologists use Excel formulas to calculate: 1. Mean =AVERAGE(range), 2. Standard Deviation =STDEV.S(range), 3. Coefficient of Variation (CV%) = (SD / Mean) * 100.",
                "Levy-Jennings Charts: Plotting daily control run values against Mean, ±1 SD, ±2 SD, and ±3 SD control limits to detect systematic drift and random analytical errors."
              ],
              benchAlert: "Always double-check data entry ranges in Excel; calculating SD on misaligned cells leads to incorrect Levy-Jennings limits and failure to catch analyzer drift.",
              quizzes: [
                {
                  question: "In statistical laboratory quality control, what formula represents the Coefficient of Variation (CV%)?",
                  options: [
                    "CV% = (Mean / SD) * 100",
                    "CV% = (Standard Deviation / Mean) * 100",
                    "CV% = Mean + 2 SD",
                    "CV% = Variance / Mean"
                  ],
                  correctIndex: 1,
                  explanation: "Coefficient of Variation (CV%) expresses analytical imprecision as a percentage: (Standard Deviation / Mean) * 100."
                }
              ],
              vivaQAs: [
                {
                  question: "Why is MS Excel an essential tool for medical laboratory quality assurance?",
                  answer: "MS Excel enables automated computation of daily QC statistics (Mean, SD, CV%), generation of Levy-Jennings charts, patient test volume trends, and validation of reference interval data.",
                  frequentlyAskedIn: "SMFB Computer Science Practical Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Explain how to calculate Mean, Standard Deviation (SD), and Coefficient of Variation (CV%) using MS Excel for a 20-day control run. (Marks: 8)",
                  modelAnswer: "Input control data in column A1:A20. Calculate Mean using =AVERAGE(A1:A20). Calculate SD using =STDEV.S(A1:A20). Calculate CV% using =(Cell_SD / Cell_Mean) * 100. Generate line chart with mean and ±2SD target lines.",
                  marks: 8
                }
              ]
            }
          ]
        },
        {
          id: "comp-sub-1-2",
          title: "Sub-Module 1.2: Laboratory Information Systems (LIS) & Analyzer Interfacing",
          lessons: [
            {
              id: "comp-les-2",
              title: "LIS Architecture, Barcode Automation & Bidirectional Communication",
              duration: "30 min",
              notes: [
                "A Laboratory Information System (LIS) is specialized software that manages the flow of diagnostic specimens, workflow queues, instrument integration, quality control, and clinical reporting.",
                "Specimen Lifecycle in LIS: 1. Order Entry / Test Request -> 2. Unique Barcode Generation (containing Patient ID, Specimen Type, Requisite Tube) -> 3. Phlebotomy Check-in -> 4. Analytical Processing -> 5. Technical Verification & QC Check -> 6. Pathologist Electronic Authorization -> 7. Final Report Printing or Electronic Delivery.",
                "Bidirectional Interfacing: Modern hematology and biochemistry analyzers communicate directly with the LIS using standard communication protocols (ASTM, HL7, RS232 serial, or TCP/IP Ethernet). The analyzer reads the tube's 2D barcode, queries the LIS for requested tests (order download), performs the assays, and automatically transmits results back to the LIS (result upload).",
                "Data Security & HIPAA/DGHS Compliance: Daily automated database backups, password security protocols, role-based access limits, and immutable audit logs preventing retroactive tampering with verified medical reports."
              ],
              benchAlert: "Verify that the barcode label is applied vertically and wrinkle-free on the sample tube; skewed barcodes cause automated instrument sampling errors and misidentification.",
              quizzes: [
                {
                  question: "In a computerized clinical laboratory, what communication standard allows automated analyzers to transmit test results directly to the LIS?",
                  options: [
                    "HTTP Post Only",
                    "Health Level 7 (HL7) and ASTM protocols",
                    "Simple Mail Transfer Protocol (SMTP)",
                    "Bluetooth Low Energy"
                  ],
                  correctIndex: 1,
                  explanation: "HL7 (Health Level 7) and ASTM protocols are the global biomedical standards for bidirectional communication between diagnostic instruments and LIS systems."
                }
              ],
              vivaQAs: [
                {
                  question: "What are the advantages of a bidirectional LIS interface compared to manual result transcription?",
                  answer: "Bidirectional interfacing eliminates manual transcription errors (which account for major clinical errors), drastically reduces turnaround time (TAT), automatically checks panic alert values, and tracks specimen audit trails in real time.",
                  frequentlyAskedIn: "SMFB Computer Science Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Define Laboratory Information System (LIS). Outline the complete lifecycle of a blood sample from registration to final report delivery. (Marks: 10)",
                  modelAnswer: "LIS is specialized healthcare software managing laboratory workflows. Lifecycle: Order entry -> Barcode label printing -> Phlebotomy collection -> Specimen reception & triaging -> Instrument barcode scan & analysis -> QC validation -> Medical verification -> Multi-channel report dispatch.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 6. PHY-201: Physics
  // --------------------------------------------------------------------------
  "PHY-201": [
    {
      id: "phy-mod-1",
      unitNumber: 1,
      title: "Topic 1: Optics, Microscopy Physics & Spectrophotometric Principles",
      description: "Light behavior, refractive index, numerical aperture, resolution, Beer-Lambert law, and photometer design.",
      subModules: [
        {
          id: "phy-sub-1-1",
          title: "Sub-Module 1.1: Geometrical Optics & Compound Microscope Physics",
          lessons: [
            {
              id: "phy-les-1",
              title: "Refraction, Numerical Aperture & Microscope Resolving Power",
              duration: "30 min",
              notes: [
                "Refraction is the bending of light waves as they pass obliquely from one optical medium into another of different optical density, governed by Snell's Law: n1 * sin(theta1) = n2 * sin(theta2).",
                "Numerical Aperture (NA): Measure of the light-gathering capacity and resolving power of an objective lens: NA = n * sin(alpha), where n is the refractive index of the medium between cover glass and objective, and alpha is the half-angle of the maximum light cone.",
                "Limit of Resolution (d): The minimum distance between two distinct points at which they can still be distinguished as separate entities, calculated using Abbe's Equation: d = (0.61 * lambda) / NA. Lower d represents superior resolving power.",
                "Immersion Oil Principle: Dry air has a refractive index of n = 1.00; glass coverslips have n = 1.515. Light rays passing from glass into air undergo total internal reflection and refraction away from the lens. Type A/B immersion oil has n = 1.515, matching glass exactly, preventing light scattering and maximizing NA up to 1.25-1.40."
              ],
              benchAlert: "Never use commercial grade oil or xylene substitutes on microscope objectives; use only standardized synthetic immersion oil with refractive index n = 1.515, and clean immediately after use.",
              quizzes: [
                {
                  question: "Why does synthetic immersion oil increase the resolving power of a 100x microscope objective?",
                  options: [
                    "It magnifies the specimen by an additional 10x factor",
                    "Its refractive index matches glass (n=1.515), preventing light refraction and increasing Numerical Aperture",
                    "It stains the bacterial cell walls directly",
                    "It cools the microscope halogen bulb"
                  ],
                  correctIndex: 1,
                  explanation: "By matching the refractive index of glass coverslips (1.515), immersion oil eliminates refraction at the air-glass boundary, channeling more light into the lens and boosting NA."
                }
              ],
              vivaQAs: [
                {
                  question: "State Abbe's equation for microscope resolution and explain each term.",
                  answer: "d = (0.61 * lambda) / NA. d is the limit of resolution (distance between 2 resolvable points), lambda is the wavelength of illuminating light (~550 nm for visible green-yellow light), and NA is the Numerical Aperture of the objective lens.",
                  frequentlyAskedIn: "SMFB Physics Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Define Numerical Aperture and Resolving Power of a microscope. Why is oil immersion used with 100x objective? (Marks: 8)",
                  modelAnswer: "NA = n * sin(alpha). Resolving power is inverse of resolution limit: R = NA / (0.61 * lambda). Oil immersion matches glass refractive index (n=1.515), preventing ray loss from total reflection and achieving high resolution required to visualize bacteria.",
                  marks: 8
                }
              ]
            }
          ]
        },
        {
          id: "phy-sub-1-2",
          title: "Sub-Module 1.2: Photometry & the Beer-Lambert Law",
          lessons: [
            {
              id: "phy-les-2",
              title: "Spectrophotometry, Beer-Lambert Law & Photometric Components",
              duration: "30 min",
              notes: [
                "Photometry is the measurement of radiant light energy absorbed, transmitted, or reflected by chemical substances in solution.",
                "Beer's Law: The intensity of a transmitted monochromatic light beam decreases exponentially as the concentration of the absorbing substance increases.",
                "Lambert's (Bouguer's) Law: The intensity of transmitted monochromatic light decreases exponentially as the path length (cuvette thickness) increases.",
                "Combined Beer-Lambert Equation: Absorbance (A) = epsilon * c * l = log10(100 / %T) = 2 - log10(%T), where epsilon is the molar absorptivity, c is concentration, and l is optical path length (standard 1.0 cm).",
                "Spectrophotometer Optical Components: Light source (Tungsten halogen for visible 340-700 nm, Deuterium for UV 190-380 nm) -> Collimating lens -> Monochromator (Prism or Diffraction Grating) -> Adjustable exit slit -> Cuvette compartment -> Photodetector (Photodiode or Photomultiplier tube) -> Digital readout."
              ],
              benchAlert: "Dirty, scratched, or fingerprint-marked optical cuvettes absorb light directly, creating false high absorbance readings; always wipe optical surfaces with lint-free lens tissue.",
              quizzes: [
                {
                  question: "According to the Beer-Lambert law, what is the mathematical relationship between Absorbance (A) and Percentage Transmittance (%T)?",
                  options: [
                    "A = %T / 100",
                    "A = 2 - log10(%T)",
                    "A = log10(%T) + 100",
                    "A = 100 - %T"
                  ],
                  correctIndex: 1,
                  explanation: "Absorbance equals 2 minus the common logarithm of percentage transmittance: A = -log(T) = log(100/%T) = 2 - log(%T)."
                }
              ],
              vivaQAs: [
                {
                  question: "State Beer-Lambert law and list two common causes of deviation from linearity.",
                  answer: "Absorbance is directly proportional to solute concentration and optical path length. Deviations occur at high concentrations (solute-solvent interactions, stray light), dirty/turbid solutions, or when non-monochromatic light is used.",
                  frequentlyAskedIn: "SMFB Physics & Biochemistry Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "State and derive Beer-Lambert's law. Draw a neat schematic diagram of a single-beam clinical spectrophotometer. (Marks: 10)",
                  modelAnswer: "Mathematical derivation showing A = epsilon * c * l. Schematic diagram including light source, entrance slit, diffraction grating, exit slit, cuvette, photodetector, amplifier, and digital display.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 7. CHEM-202: Chemistry
  // --------------------------------------------------------------------------
  "CHEM-202": [
    {
      id: "chem-mod-1",
      unitNumber: 1,
      title: "Topic 1: Solutions, Acids, Bases, pH & Physiological Buffer Systems",
      description: "Molarity, normality, buffer mechanisms, Henderson-Hasselbalch equation, and volumetric chemical titrations.",
      subModules: [
        {
          id: "chem-sub-1-1",
          title: "Sub-Module 1.1: Solution Preparation & Concentration Units",
          lessons: [
            {
              id: "chem-les-1",
              title: "Molarity, Normality, Percent Solutions & Primary Standards",
              duration: "25 min",
              notes: [
                "Accurate reagent preparation is the cornerstone of clinical biochemistry. A solute is dissolved in a solvent to form a homogeneous solution.",
                "Molarity (M): Number of moles of solute dissolved in 1 liter (1000 mL) of solution. M = (Weight in grams / Molecular Weight) * (1000 / Volume in mL).",
                "Normality (N): Number of gram equivalent weights of solute per liter of solution. N = (Weight in grams / Equivalent Weight) * (1000 / Volume in mL), where Equivalent Weight = Molecular Weight / Valency.",
                "Percent Solutions: 1. Weight/Volume (% w/v) = grams of solute in 100 mL solution; 2. Volume/Volume (% v/v) = mL of liquid solute in 100 mL solution.",
                "Dilution Formula: C1 * V1 = C2 * V2, where C represents concentration and V represents volume."
              ],
              benchAlert: "Always add concentrated acid slowly to water down the side of the flask ('Acid to Water - Do as you oughta'); adding water directly to concentrated acid produces violent exothermic boiling and splattering.",
              quizzes: [
                {
                  question: "How many grams of Sodium Hydroxide (NaOH, MW = 40.0 g/mol) are required to prepare 500 mL of a 1.0 M solution?",
                  options: ["40 g", "20 g", "80 g", "10 g"],
                  correctIndex: 1,
                  explanation: "Weight = Molarity * MW * (Volume / 1000) = 1.0 * 40 * (500 / 1000) = 20 grams."
                }
              ],
              vivaQAs: [
                {
                  question: "Differentiate between Molarity and Normality with an example.",
                  answer: "Molarity is moles of solute per liter of solution. Normality is gram equivalents per liter. For monoprotic HCl (valency 1), 1 M = 1 N. For diprotic H2SO4 (valency 2), a 1 M solution equals a 2 N solution.",
                  frequentlyAskedIn: "SMFB Chemistry Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Define Molarity, Normality, and Molality. Calculate the amount of anhydrous Na2CO3 required to prepare 250 mL of 0.1 N solution. (Marks: 8)",
                  modelAnswer: "Definitions provided. Na2CO3 MW = 106 g/mol, Equivalent Weight = 106 / 2 = 53 g/eq. Weight = N * Eq.wt * (V / 1000) = 0.1 * 53 * (250 / 1000) = 1.325 grams.",
                  marks: 8
                }
              ]
            }
          ]
        },
        {
          id: "chem-sub-1-2",
          title: "Sub-Module 1.2: pH, Buffer Action & Acid-Base Physiology",
          lessons: [
            {
              id: "chem-les-2",
              title: "The pH Scale, Henderson-Hasselbalch Equation & Blood Buffers",
              duration: "30 min",
              notes: [
                "pH is defined as the negative logarithm of the hydrogen ion concentration: pH = -log10[H+]. Neutral pH at 25°C is 7.00. Normal arterial blood pH is tightly regulated between 7.35 and 7.45.",
                "Buffer Definition: A solution that resists changes in pH upon the addition of small amounts of strong acid or base, composed of a weak acid and its conjugate base (or weak base and conjugate acid).",
                "Henderson-Hasselbalch Equation: pH = pKa + log10([Conjugate Base] / [Weak Acid]). For the bicarbonate buffer system: pH = 6.1 + log10([HCO3-] / [0.03 * PaCO2]).",
                "Major Physiological Buffer Systems: 1. Carbonic acid-Bicarbonate buffer (primary ECF buffer), 2. Phosphate buffer (intracellular and renal tubular fluid), 3. Protein buffer (hemoglobin and plasma albumin)."
              ],
              benchAlert: "In blood gas analysis, anaerobic collection in heparinized syringes and immediate analysis within 15 minutes on ice is critical; room temperature exposure causes cellular glycolysis, dropping pH and pO2.",
              quizzes: [
                {
                  question: "What is the normal physiological ratio of Bicarbonate (HCO3-) to Carbonic Acid (H2CO3) required to maintain arterial blood pH at 7.40?",
                  options: ["1 : 1", "10 : 1", "20 : 1", "100 : 1"],
                  correctIndex: 2,
                  explanation: "At pH 7.40, applying the Henderson-Hasselbalch equation yields log([HCO3-]/[H2CO3]) = 1.3, which corresponds exactly to a 20:1 ratio."
                }
              ],
              vivaQAs: [
                {
                  question: "What are the primary physiological buffer systems in human blood and which has the highest immediate buffering capacity?",
                  answer: "The Bicarbonate-Carbonic acid buffer (ECF, high capacity due to respiratory CO2 excretion), Hemoglobin buffer (erythrocytes, imidazole groups), Phosphate buffer (ICF/urine), and Plasma proteins.",
                  frequentlyAskedIn: "SMFB Board Examination Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2021",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Define buffer solution and explain its mechanism of action. State and derive the Henderson-Hasselbalch equation. (Marks: 10)",
                  modelAnswer: "Buffer definition and mechanism of neutralizing added H+ and OH- ions. Derivation from Ka = [H+][A-]/[HA], taking negative logs on both sides to yield pH = pKa + log([A-]/[HA]).",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 8. MIC-203: Basic Microbiology & Parasitology
  // --------------------------------------------------------------------------
  "MIC-203": [
    {
      id: "mic2-mod-1",
      unitNumber: 1,
      title: "Topic 1: Bacterial Morphology, Sterilization & Medical Parasitology",
      description: "Bacterial anatomy, Gram staining principles, autoclaving kinetics, protozoal life cycles, and diagnostic helminthology.",
      subModules: [
        {
          id: "mic2-sub-1-1",
          title: "Sub-Module 1.1: Bacterial Cell Anatomy & Sterilization Techniques",
          lessons: [
            {
              id: "mic2-les-1",
              title: "Bacterial Architecture, Gram Staining & Autoclave Operation",
              duration: "35 min",
              notes: [
                "Bacterial Cell Wall Architecture: Gram-positive bacteria possess a thick peptidoglycan layer (20-80 nm) cross-linked with teichoic acids. Gram-negative bacteria have a thin peptidoglycan layer (2-7 nm) surrounded by an outer membrane containing Lipopolysaccharide (LPS endotoxin, Lipid A).",
                "Gram Stain Mechanism: Crystal violet stains all cells purple; Gram's iodine acts as a mordant forming CV-I complexes. Acetone-alcohol dissolves the lipid-rich outer membrane of Gram-negatives and washes out CV-I (decolorization). Safranin counterstain turns decolorized Gram-negatives pink/red, while thick Gram-positive peptidoglycan retains purple.",
                "Sterilization vs. Disinfection: Sterilization kills all viable microorganisms including bacterial endospores. Disinfection eliminates pathogenic vegetative microbes on inanimate surfaces.",
                "Autoclaving (Moist Heat under Pressure): Operates at 121°C at 15 lbs/sq inch (psi) steam pressure for 15-20 minutes. Denatures structural proteins and enzymes. Biological indicator: Geobacillus stearothermophilus spores."
              ],
              benchAlert: "Do not over-decolorize Gram stain smears with acetone-alcohol; excessive exposure (beyond 10-15 seconds) decolorizes Gram-positive cocci, causing false Gram-negative readings.",
              quizzes: [
                {
                  question: "What is the biological indicator spore used to validate the sterilization efficacy of a laboratory autoclave?",
                  options: [
                    "Bacillus subtilis",
                    "Geobacillus stearothermophilus",
                    "Clostridium tetani",
                    "Staphylococcus aureus"
                  ],
                  correctIndex: 1,
                  explanation: "Geobacillus stearothermophilus spores are exceptionally heat-resistant and serve as the worldwide benchmark biological indicator for moist heat autoclaves."
                }
              ],
              vivaQAs: [
                {
                  question: "Explain the biochemical basis of Gram differentiation between bacterial cell walls.",
                  answer: "Gram-positives have thick peptidoglycan and low lipids (1-4%), retaining the crystal violet-iodine complex. Gram-negatives have high lipids in the outer membrane (10-20%) which dissolve in alcohol, allowing the dye to leach out and take up pink safranin counterstain.",
                  frequentlyAskedIn: "SMFB Microbiology Practical Examination"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Discuss the principles, operating conditions, and sterilization control of an autoclave. Differentiate moist heat from dry heat sterilization. (Marks: 10)",
                  modelAnswer: "Autoclave: Saturated steam at 121°C, 15 psi for 15-20 min. Moist heat kills by protein coagulation; dry heat (hot air oven, 160°C for 2h) kills by oxidative destruction. Moist heat is more penetrative and effective at lower temperatures.",
                  marks: 10
                }
              ]
            }
          ]
        },
        {
          id: "mic2-sub-1-2",
          title: "Sub-Module 1.2: Medical Parasitology (Protozoa & Helminths)",
          lessons: [
            {
              id: "mic2-les-2",
              title: "Diagnostic Parasitology: Malaria, Amoebiasis & Intestinal Helminths",
              duration: "35 min",
              notes: [
                "Medical Parasitology encompasses Protozoa (single-celled eukaryotic parasites) and Helminths (multicellular metazoan parasitic worms).",
                "Plasmodium Species (Malaria): Four human species in Bangladesh: P. falciparum (malignant tertian, ring forms and crescent/banana gametocytes), P. vivax (benign tertian, enlarged RBCs with Schüffner's dots), P. malariae, and P. ovale. Transmitted by female Anopheles mosquito.",
                "Diagnostic Smears: Thick blood smear (lysed RBCs with water, concentrated 20-fold for rapid screening sensitivity) and Thin blood smear (methanol-fixed for species identification and parasitemia counting).",
                "Entamoeba histolytica vs. E. coli: E. histolytica trophozoite has ingested RBCs (erythrophagocytosis, diagnostic of invasiveness) and a spherical cyst with 1-4 nuclei and blunt chromatoid bars. E. coli cyst has 1-8 nuclei with splintered ends.",
                "Intestinal Helminths: Ascaris lumbricoides (fertilized bile-stained mamillated eggs), Hookworm (Ancylostoma duodenale - oval, thin transparent shell with 4-8 blastomeres), Trichuris trichiura (barrel-shaped with bipolar plugs), Enterobius vermicularis (planoconvex eggs on Scotch-tape prep)."
              ],
              benchAlert: "Never fix a thick blood film with methanol; methanol fixes erythrocyte membranes and prevents osmotic dehemoglobinization, making parasite detection impossible.",
              quizzes: [
                {
                  question: "Which microscopic characteristic unequivocally identifies Entamoeba histolytica trophozoites over non-pathogenic commensal amoebae?",
                  options: [
                    "Presence of ingested red blood cells (erythrophagocytosis)",
                    "Multiple vacuoles containing bacteria",
                    "Sluggish non-directional motility",
                    "Eight distinct nuclei in the cytoplasm"
                  ],
                  correctIndex: 0,
                  explanation: "Erythrophagocytosis (ingested RBCs inside the trophozoite) is the definitive diagnostic hallmark of invasive pathogenic Entamoeba histolytica."
                }
              ],
              vivaQAs: [
                {
                  question: "Why are both thick and thin blood films prepared for malaria diagnosis?",
                  answer: "The thick film concentrates blood 20-30 times, making it the most sensitive screen for detecting low-density parasitemia. The thin film fixes RBC morphology intact, allowing accurate differentiation of Plasmodium species (P. falciparum vs. P. vivax).",
                  frequentlyAskedIn: "SMFB Parasitology Viva & OSPE"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Describe the morphological differences between Plasmodium falciparum and Plasmodium vivax in peripheral blood films. (Marks: 8)",
                  modelAnswer: "P. falciparum: Normal sized RBCs, multiple delicate ring forms per cell, applique/accolé forms, Maurer's clefts, crescent/banana gametocytes. P. vivax: Enlarged pale RBCs, Schüffner's dots, ameboid trophozoites, round/oval large gametocytes.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 9. MLS-204: Medical Laboratory Science
  // --------------------------------------------------------------------------
  "MLS-204": [
    {
      id: "mls-mod-1",
      unitNumber: 1,
      title: "Topic 1: Laboratory Safety, Phlebotomy, Specimen Chain of Custody & Waste Management",
      description: "Biosafety levels (BSL 1-4), order of draw in venipuncture, cold chain preservation, and biomedical color-coded disposal.",
      subModules: [
        {
          id: "mls-sub-1-1",
          title: "Sub-Module 1.1: Biosafety, Phlebotomy Order of Draw & Specimen Integrity",
          lessons: [
            {
              id: "mls-les-1",
              title: "Laboratory Biosafety, Venipuncture Order of Draw & Pre-Analytical Quality",
              duration: "30 min",
              notes: [
                "Biosafety Levels: BSL-1 (well-characterized agents, minimal risk, open bench), BSL-2 (moderate risk human pathogens like HBV, HIV, Salmonella; requires biosafety cabinet class II), BSL-3 (aerosol transmission, severe diseases like M. tuberculosis; negative pressure), BSL-4 (lethal viral hemorrhagic fevers like Ebola; full positive pressure suits).",
                "CLSI Standard Order of Draw for Phlebotomy: 1. Blood Culture bottles (yellow/broth), 2. Sodium Citrate tube (light blue - coagulation), 3. Serum tubes with/without clot activator or gel separator (red / gold SST), 4. Heparin tube (green - plasma electrolytes), 5. EDTA tube (lavender/purple - routine hematology), 6. Sodium Fluoride / Potassium Oxalate tube (gray - glucose).",
                "Rationale for Order of Draw: Prevents additive cross-contamination. For example, EDTA carries high potassium (K2-EDTA); if drawn before a serum chemistry tube, it creates severe artificial hyperkalemia and hypocalcemia (EDTA chelates calcium).",
                "Biomedical Waste Segregation (DGHS Guidelines): Yellow (infectious anatomical and pathological waste, incinirated), Red (contaminated plastics, catheters, gloves; autoclaved/shredded), Blue (glassware, ampoules, slides), Black (general domestic non-infectious waste), Puncture-Proof Sharp Box (needles, scalpels, lancets; sharp disposal pit)."
              ],
              benchAlert: "Never recap needles after phlebotomy; discard directly into a rigid puncture-proof sharp disposal container to prevent accidental needle-stick injuries and HIV/HBV transmission.",
              quizzes: [
                {
                  question: "What is the correct CLSI order of draw when collecting blood culture, EDTA hematology, and sodium citrate coagulation tubes?",
                  options: [
                    "EDTA -> Citrate -> Blood Culture",
                    "Blood Culture -> Sodium Citrate -> EDTA",
                    "Sodium Citrate -> EDTA -> Blood Culture",
                    "EDTA -> Blood Culture -> Sodium Citrate"
                  ],
                  correctIndex: 1,
                  explanation: "Blood cultures must always be drawn first under sterile conditions to avoid contamination, followed by light blue sodium citrate, and finally lavender EDTA."
                }
              ],
              vivaQAs: [
                {
                  question: "Why is Sodium Fluoride specifically selected as the anticoagulant/preservative for blood glucose estimation?",
                  answer: "Sodium fluoride acts as a potent inhibitor of the glycolytic enzyme enolase, preventing in vitro cellular metabolism of glucose by RBCs and WBCs which otherwise decreases glucose at a rate of 5-7% per hour at room temperature.",
                  frequentlyAskedIn: "SMFB Board Examination Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Enumerate the CLSI order of blood collection tubes with scientific justifications. Describe the biomedical waste segregation protocol in a clinical laboratory. (Marks: 10)",
                  modelAnswer: "Order: Blood cultures -> Citrate -> Serum -> Heparin -> EDTA -> Fluoride. Justifications: Prevent cross-contamination of anticoagulants. Waste segregation: Yellow (infectious tissue), Red (plastics), Blue (glass), Black (general), Sharp container (needles).",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 10. CPH-205: Clinical Pathology & Haematology
  // --------------------------------------------------------------------------
  "CPH-205": [
    {
      id: "cph-mod-1",
      unitNumber: 1,
      title: "Topic 1: Routine Urine & Stool Examination, Hemoglobinometry & Blood Film",
      description: "Physical, chemical, and microscopic examination of urine/stool, Sahli vs. Cyanmethemoglobin methods, ESR, and peripheral blood morphology.",
      subModules: [
        {
          id: "cph-sub-1-1",
          title: "Sub-Module 1.1: Routine Urine & Stool Clinical Pathology",
          lessons: [
            {
              id: "cph-les-1",
              title: "Physical, Chemical & Microscopic Examination of Urine and Stool",
              duration: "35 min",
              notes: [
                "Routine Urine Examination (R/M/E): 1. Physical: Volume, color (straw, amber, smoky in hematuria), transparency (clear vs. turbid), specific gravity (1.003-1.030, refractometer), pH (4.5-8.0); 2. Chemical: Protein (Heat and Acetic acid test, sulfosalicylic acid), Glucose (Benedict's qualitative test), Ketone bodies (Rothera's test), Bile salts (Hay's sulfur test), Bile pigments (Fouchet's test); 3. Microscopic Sediments: Centrifuged at 2000 rpm for 5 min; inspect under 10x and 40x for Pus cells (leukocytes), RBCs, Epithelial cells, Casts (hyaline, granular, cellular, waxy), and Crystals (calcium oxalate, uric acid, triple phosphate).",
                "Clinical Cast Significance: Hyaline casts (physiological post-exercise or fever), Granular casts (acute tubular necrosis), Red cell casts (pathognomonic of glomerulonephritis), White cell casts (hallmark of acute pyelonephritis).",
                "Stool Routine Examination: Physical: Consistency (formed, semi-solid, watery), color, presence of visible mucus or fresh blood; Chemical: Occult Blood Test (OBT by Benzidine or Gum Guaiac); Microscopic: Wet mounts in 0.9% normal saline (trophozoites, ova, cysts, motility) and 1% Lugol's iodine (internal nuclear details of protozoal cysts)."
              ],
              benchAlert: "In Benedict's test for urine reducing sugars, boil for exactly 2 minutes; under-boiling causes false-negative results, while over-boiling can cause explosive spurting of alkaline reagent.",
              quizzes: [
                {
                  question: "The presence of White Blood Cell (WBC) casts in microscopic urine sediment is pathognomonic of which renal condition?",
                  options: [
                    "Acute Pyelonephritis (upper urinary tract infection)",
                    "Lower Urinary Tract Infection (Cystitis)",
                    "Renal Amyloidosis",
                    "Prerenal Dehydration"
                  ],
                  correctIndex: 0,
                  explanation: "WBC casts form inside the renal tubules when leukocytes are trapped in Tamm-Horsfall mucoprotein, definitively indicating renal parenchymal infection (acute pyelonephritis)."
                }
              ],
              vivaQAs: [
                {
                  question: "Describe the principle and procedure of the Heat and Acetic Acid test for urine protein detection.",
                  answer: "Fill a test tube two-thirds with clear urine. Heat the upper one-third over a flame until boiling. If turbidity appears, add 2-3 drops of 3% acetic acid and boil again. If turbidity disappears, it is due to phosphates; if turbidity persists or intensifies, it confirms albumin/protein.",
                  frequentlyAskedIn: "SMFB Clinical Pathology Practical OSPE"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Describe the chemical and microscopic examination of urine in a patient suspected of Acute Glomerulonephritis. (Marks: 8)",
                  modelAnswer: "Physical: Smoky red appearance. Chemical: Significant proteinuria (2+ to 3+ by sulfosalicylic acid/heat test), positive blood dipstick. Microscopic: Abundant dysmorphic RBCs, RBC casts (diagnostic hallmark), granular casts, and mild pus cells.",
                  marks: 8
                }
              ]
            }
          ]
        },
        {
          id: "cph-sub-1-2",
          title: "Sub-Module 1.2: Routine Haematology, ESR & Peripheral Blood Film (PBF)",
          lessons: [
            {
              id: "cph-les-2",
              title: "Hemoglobinometry, ESR Kinetics, Leishman Staining & Differential Count",
              duration: "40 min",
              notes: [
                "Hemoglobin Estimation Methods: 1. Sahli's Acid Hematin Method (blood mixed with 0.1 N HCl, converted to brown acid hematin, diluted with distilled water until color matches comparator block; subjective visual error ±10%); 2. Cyanmethemoglobin (HiCN) Reference Method (Drabkin's reagent: potassium ferricyanide oxidizes hemoglobin Fe2+ to methemoglobin Fe3+, which reacts with potassium cyanide to form stable cyanmethemoglobin measured at 540 nm).",
                "Erythrocyte Sedimentation Rate (ESR): Westergren Method is the gold standard (sodium citrate diluted blood in 200 mm tube, vertical rack for 1 hour). Phases: 1. Rouleaux formation (first 10 min), 2. Rapid settling (next 40 min), 3. Packing of cells (final 10 min). Normal: Male <15 mm/hr, Female <20 mm/hr.",
                "Peripheral Blood Film Preparation: Wedge smear technique with smooth feathered edge. Stained with Leishman stain (methanol fixative, methylene blue basic dye for nuclei, eosin acidic dye for cytoplasm and granules).",
                "Differential Leukocyte Count (DLC): Counting 100 consecutive WBCs in the battlement track. Normal: Neutrophils 40-75%, Lymphocytes 20-45%, Monocytes 2-10%, Eosinophils 1-6%, Basophils 0-1%."
              ],
              benchAlert: "Never blow on wet blood smears to accelerate drying; moisture in human breath causes water artifact (refractory artifactual ring halos inside RBCs that mimic target cells).",
              quizzes: [
                {
                  question: "What is the active reagent in the international reference Cyanmethemoglobin (HiCN) method for hemoglobin measurement?",
                  options: [
                    "0.1 N Hydrochloric Acid",
                    "Drabkin's Reagent (Potassium Ferricyanide + Potassium Cyanide)",
                    "Alkaline Copper Tartrate",
                    "0.85% Isotonic Saline"
                  ],
                  correctIndex: 1,
                  explanation: "Drabkin's reagent oxidizes all forms of hemoglobin (except sulfhemoglobin) into cyanmethemoglobin, measured spectrophotometrically at 540 nm."
                }
              ],
              vivaQAs: [
                {
                  question: "What factors cause marked elevation of the Erythrocyte Sedimentation Rate (ESR > 100 mm/hr)?",
                  answer: "Multiple myeloma, acute and chronic infections (tuberculosis), collagen vascular diseases (rheumatoid arthritis, SLE), severe anemia, and advanced malignancies.",
                  frequentlyAskedIn: "SMFB Haematology Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 2nd Year Annual Examination",
                  questionText: "Discuss the principle, procedure, advantages, and sources of error in the Cyanmethemoglobin method. (Marks: 8)",
                  modelAnswer: "Principle: Blood diluted with Drabkin's reagent converts Hb to HiCN; absorbance read at 540 nm against standard. Advantages: All Hb forms measured, stable standard. Errors: Turbidity from hyperlipidemia, elevated WBC count (>50,000/uL), high carboxyhemoglobin.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 11. CC-301: Clinical Chemistry
  // --------------------------------------------------------------------------
  "CC-301": [
    {
      id: "cc-mod-1",
      unitNumber: 1,
      title: "Topic 1: Blood Glucose, Renal Function Tests (RFT) & Liver Function Tests (LFT)",
      description: "GOD-POD methodology, Jaffe creatinine kinetics, enzymatic ALT/AST, bilirubin fractions, and lipid profiles.",
      subModules: [
        {
          id: "cc-sub-1-1",
          title: "Sub-Module 1.1: Glucose Metabolism & Renal Biomarkers",
          lessons: [
            {
              id: "cc-les-1",
              title: "Blood Glucose (GOD-POD), Urea (Berthelot) & Creatinine (Jaffe)",
              duration: "35 min",
              notes: [
                "Blood Glucose Estimation (GOD-POD Enzymatic Method): Glucose Oxidase (GOD) oxidizes beta-D-glucose into D-glucono-1,5-lactone and Hydrogen Peroxide (H2O2). Peroxidase (POD) couples H2O2 with 4-aminoantipyrine and phenol to form a pink quinoneimine dye measured at 505 nm.",
                "Diagnostic Criteria for Diabetes Mellitus (WHO/ADA): Fasting Plasma Glucose (FPG) >= 7.0 mmol/L (126 mg/dL); 2-hour Post-load Glucose in OGTT >= 11.1 mmol/L (200 mg/dL); Random Glucose >= 11.1 mmol/L with classic symptoms; HbA1c >= 6.5%.",
                "Renal Function Tests: 1. Serum Urea (Berthelot reaction / Urease-GLDH method, reference 15-45 mg/dL); 2. Serum Creatinine (Kinetic Alkaline Picrate / Jaffe Reaction: creatinine reacts with picric acid in alkaline medium forming orange-red complex measured at 505 nm, reference 0.6-1.2 mg/dL); 3. Serum Uric Acid (Uricase method).",
                "Glomerular Filtration Rate (eGFR): Creatinine clearance = (Urine Creatinine * Urine Volume in mL) / (Serum Creatinine * Time in min * 1440). Normal GFR > 90 mL/min/1.73 m2."
              ],
              benchAlert: "In the Jaffe kinetic assay for creatinine, read absorbance changes strictly between 20 and 80 seconds; reading beyond 2 minutes introduces non-specific chromogen interference (protein, cephalosporins, ketoacids).",
              quizzes: [
                {
                  question: "According to WHO diagnostic thresholds, what fasting plasma glucose value confirms the diagnosis of Diabetes Mellitus?",
                  options: [
                    ">= 5.6 mmol/L (100 mg/dL)",
                    ">= 6.1 mmol/L (110 mg/dL)",
                    ">= 7.0 mmol/L (126 mg/dL)",
                    ">= 11.1 mmol/L (200 mg/dL)"
                  ],
                  correctIndex: 2,
                  explanation: "A fasting plasma glucose of >= 7.0 mmol/L (126 mg/dL) on two separate occasions meets the established WHO/ADA criteria for diabetes mellitus."
                }
              ],
              vivaQAs: [
                {
                  question: "Why is Serum Creatinine a more reliable marker of renal function than Blood Urea?",
                  answer: "Creatinine is produced endogenously at a constant rate from muscle creatine and is freely filtered by glomeruli without significant tubular reabsorption. Urea is influenced by dietary protein intake, hepatic function, hydration status, and undergoes substantial tubular reabsorption.",
                  frequentlyAskedIn: "SMFB Clinical Chemistry Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Explain the biochemical principle and clinical interpretation of the GOD-POD method for glucose and Jaffe method for creatinine. (Marks: 10)",
                  modelAnswer: "GOD-POD: Glucose oxidized by GOD to gluconic acid + H2O2; POD couples H2O2 with 4-AAP and phenol producing pink quinoneimine (505 nm). Jaffe: Creatinine reacts with alkaline picrate forming orange-red Janovsky complex; read kinetically to avoid non-creatinine chromogen interference.",
                  marks: 10
                }
              ]
            }
          ]
        },
        {
          id: "cc-sub-1-2",
          title: "Sub-Module 1.2: Liver Function Tests (LFT) & Lipid Profile",
          lessons: [
            {
              id: "cc-les-2",
              title: "Bilirubin Fractions (Malloy-Evelyn), ALT, AST, ALP & Lipid Profile",
              duration: "35 min",
              notes: [
                "Serum Bilirubin Fractions: Total Bilirubin (normal 0.2 - 1.0 mg/dL) = Direct (Conjugated) + Indirect (Unconjugated). Measured by Malloy-Evelyn / Jendrassik-Grof diazo reaction. Conjugated bilirubin reacts rapidly with diazotized sulfanilic acid in aqueous medium (direct diazo). Unconjugated bilirubin is albumin-bound and requires an accelerator (caffeine-benzoate or methanol) to react (total diazo).",
                "Diagnostic Jaundice Patterns: 1. Pre-hepatic (Hemolytic): High unconjugated bilirubin, normal ALT/AST, normal ALP, dark urobilinogen in urine, negative urinary bilirubin; 2. Hepatic (Hepatocellular): Marked elevation of ALT (>10-20x ULN) and AST, moderate bilirubin elevation; 3. Post-hepatic (Obstructive): Marked elevation of Alkaline Phosphatase (ALP) and GGT, high conjugated bilirubin, clay-colored stool, bilirubinuria.",
                "Serum Lipid Profile: 1. Total Cholesterol (CHOD-PAP method, <200 mg/dL desirable); 2. Triglycerides (GPO-PAP method, <150 mg/dL); 3. HDL Cholesterol ('good' anti-atherogenic, >40 mg/dL male, >50 mg/dL female); 4. LDL Cholesterol ('bad' atherogenic, calculated by Friedewald equation: LDL = Total Cholesterol - HDL - [Triglycerides / 5], valid only when TG < 400 mg/dL)."
              ],
              benchAlert: "Protect bilirubin serum samples from direct light; sunlight and fluorescent bench light break down bilirubin into biliverdin by photo-oxidation, falsely reducing measured levels by 30-50% per hour.",
              quizzes: [
                {
                  question: "Under the Friedewald formula, when is the calculation of LDL-C considered invalid and requiring direct enzymatic measurement?",
                  options: [
                    "When Total Cholesterol exceeds 200 mg/dL",
                    "When Serum Triglycerides exceed 400 mg/dL",
                    "When HDL Cholesterol is below 35 mg/dL",
                    "When patient is non-fasting"
                  ],
                  correctIndex: 1,
                  explanation: "The Friedewald equation (LDL = TC - HDL - TG/5) assumes a constant VLDL-to-TG ratio of 1:5; at TG levels > 400 mg/dL, chylomicrons distort this ratio and direct measurement is required."
                }
              ],
              vivaQAs: [
                {
                  question: "Differentiate between ALT and AST regarding tissue specificity and diagnostic value.",
                  answer: "ALT (SGPT) is primarily cytosolic and localized to hepatocytes, making it highly specific for acute hepatocellular injury (viral hepatitis). AST (SGOT) is present in both cytoplasm and mitochondria across liver, myocardium, skeletal muscle, and kidneys; marked AST > ALT (De Ritis ratio > 2:1) indicates alcoholic hepatitis or myocardial injury.",
                  frequentlyAskedIn: "SMFB Board Examination Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Classify Jaundice into pre-hepatic, hepatic, and post-hepatic types. Tabulate their diagnostic biochemical profiles. (Marks: 10)",
                  modelAnswer: "Table with columns for Hemolytic, Hepatocellular, and Obstructive Jaundice evaluating: Total Bilirubin, Direct/Indirect ratio, ALT/AST, ALP, Urine Bilirubin, and Urine Urobilinogen.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 12. MIC-302: Microbiology & Parasitology
  // --------------------------------------------------------------------------
  "MIC-302": [
    {
      id: "mic3-mod-1",
      unitNumber: 1,
      title: "Topic 1: Diagnostic Bacteriology, Culture Media & Antibiotic Susceptibility Testing",
      description: "Pathogen identification (Staph, Strep, Enteric pathogens, M. tuberculosis), selective media, and Kirby-Bauer AST.",
      subModules: [
        {
          id: "mic3-sub-1-1",
          title: "Sub-Module 1.1: Culture Media Inoculation & Biochemical Identification",
          lessons: [
            {
              id: "mic3-les-1",
              title: "Culture Media, Biochemical Tests (Catalase, Coagulase, Oxidase, TSI)",
              duration: "35 min",
              notes: [
                "Classification of Culture Media: 1. Basal Media (Nutrient broth/agar); 2. Enriched Media (Blood agar - 5% sheep/horse blood for fastidious organisms and hemolysis patterns: alpha green partial, beta clear complete, gamma none; Chocolate agar - heat-lysed blood for Neisseria and Haemophilus); 3. Selective & Differential Media: MacConkey Agar (contains bile salts and crystal violet inhibiting Gram-positives; lactose + neutral red differentiates Lactose Fermenters [pink colonies: E. coli, Klebsiella] from Non-Lactose Fermenters [colorless: Salmonella, Shigella, Pseudomonas]).",
                "Identification of Gram-Positive Cocci: 1. Catalase Test: 3% H2O2 + colony -> immediate effervescence confirms Staphylococci (catalase positive); absence confirms Streptococci (catalase negative); 2. Coagulase Test: Slide coagulase (clumping factor) and Tube coagulase (free coagulase forming plasma clot) differentiate Staphylococcus aureus (coagulase positive) from Coagulase-Negative Staphylococci (CoNS: S. epidermidis, S. saprophyticus).",
                "Identification of Enterobacteriaceae: 1. Triple Sugar Iron (TSI) agar (Glucose, Lactose, Sucrose, Phenol red, Ferrous sulfate); 2. IMViC Battery: Indole, Methyl Red, Voges-Proskauer, Citrate.",
                "Acid-Fast Staining (Ziehl-Neelsen for Mycobacterium tuberculosis): Mycolic acid in cell wall resists standard staining. 1. Strong Carbol Fuchsin heated to steaming (5 min), 2. 20% H2SO4 decolorizer (acid-alcohol), 3. 0.1% Methylene Blue counterstain. AFB appear as thin, bright red/pink slightly curved beaded bacilli against light blue background."
              ],
              benchAlert: "In Ziehl-Neelsen staining, never allow carbol fuchsin to boil to dryness on the slide; flaming must produce gentle intermittent steam, otherwise the slide cracks and crystal artifacts mimic AFB.",
              quizzes: [
                {
                  question: "Which biochemical test unequivocally differentiates Staphylococcus aureus from Staphylococcus epidermidis?",
                  options: [
                    "Catalase test",
                    "Coagulase test (Tube & Slide)",
                    "Oxidase test",
                    "Bile solubility test"
                  ],
                  correctIndex: 1,
                  explanation: "The Coagulase test (producing fibrin clots from rabbit/human plasma) is the definitive diagnostic test distinguishing pathogenic Staphylococcus aureus from other Staphylococci."
                }
              ],
              vivaQAs: [
                {
                  question: "Describe the colony morphology and lactose fermentation characteristics of Escherichia coli on MacConkey agar.",
                  answer: "E. coli forms flat, dry, circular colonies with a dark pink/magenta color and a surrounding precipitate of precipitated bile salts due to rapid lactose fermentation.",
                  frequentlyAskedIn: "SMFB Microbiology Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Write down the principle, reagents, step-by-step procedure, and clinical interpretation of the Ziehl-Neelsen (AFB) stain. (Marks: 10)",
                  modelAnswer: "Principle: Acid-fastness due to mycolic acid. Reagents: Carbol fuchsin, 20% H2SO4, methylene blue. Procedure: Heat carbol fuchsin 5 min -> wash -> decolorize 1-2 min -> wash -> counterstain 30 sec. Result: AFB = bright red beaded rods; background = pale blue.",
                  marks: 10
                }
              ]
            }
          ]
        },
        {
          id: "mic3-sub-1-2",
          title: "Sub-Module 1.2: Antibiotic Susceptibility Testing (AST) by Kirby-Bauer Method",
          lessons: [
            {
              id: "mic3-les-2",
              title: "Kirby-Bauer Disk Diffusion, McFarland Turbidity & CLSI Interpretation",
              duration: "30 min",
              notes: [
                "The Kirby-Bauer disk diffusion method is the international standardized assay for evaluating bacterial susceptibility to therapeutic antimicrobial agents.",
                "Standard Medium & Conditions: Mueller-Hinton Agar (MHA, poured at exactly 4 mm depth in 90 mm Petri dishes, pH 7.2-7.4).",
                "Inoculum Standardization: Bacterial suspension prepared in sterile saline matched visually or spectrophotometrically to 0.5 McFarland Turbidity Standard (equivalent to ~1.5 x 10^8 CFU/mL).",
                "Swabbing Protocol: Sterile cotton swab dipped in standardized suspension, rotated firmly against tube wall to remove excess liquid, and swabbed in three directions across the entire agar surface (carpet lawn growth).",
                "Incubation & Measurement: Apply antimicrobial disks within 15 minutes. Invert and incubate at 35°C ± 2°C for 16-18 hours. Measure zones of complete inhibition in millimeters using a vernier caliper or millimeter ruler. Compare zone diameters against official CLSI / EUCAST interpretive tables (Susceptible [S], Intermediate [I], Resistant [R])."
              ],
              benchAlert: "Agar depth in MHA plates must be exactly 4 mm. If agar is too thin (<3 mm), antibiotic diffuses excessively yielding false-large sensitive zones; if too thick (>5 mm), false resistance occurs.",
              quizzes: [
                {
                  question: "What is the standard McFarland turbidity standard utilized when preparing bacterial inocula for the Kirby-Bauer disk diffusion assay?",
                  options: ["0.1 McFarland", "0.5 McFarland", "1.0 McFarland", "2.0 McFarland"],
                  correctIndex: 1,
                  explanation: "The 0.5 McFarland standard (~1.5 x 10^8 CFU/mL) is the globally mandated standard for disk diffusion antibiotic susceptibility testing."
                }
              ],
              vivaQAs: [
                {
                  question: "What factors can cause false antibiotic resistance zones during Kirby-Bauer disk diffusion testing?",
                  answer: "Inoculum density too heavy (>0.5 McFarland), agar layer too thick (>4 mm), expired or improperly stored antibiotic disks (loss of potency), uncalibrated incubation temperatures, or prolonged delay before disk application.",
                  frequentlyAskedIn: "SMFB Microbiology Practical Examination"
                }
              ],
              previousQuestions: [
                {
                  year: "2021",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Discuss the standardized protocol for Antibiotic Susceptibility Testing (AST) by Kirby-Bauer method according to CLSI guidelines. (Marks: 8)",
                  modelAnswer: "Include: MHA medium (4 mm depth), 0.5 McFarland inoculum, lawn culture swabbing technique, disk application rules, 35°C 16-18h incubation, zone caliper measurement, and CLSI S/I/R table interpretation.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 13. HBT-303: Histopathology & Blood Transfusion
  // --------------------------------------------------------------------------
  "HBT-303": [
    {
      id: "hbt-mod-1",
      unitNumber: 1,
      title: "Topic 1: Tissue Processing, H&E Staining, ABO Grouping & Crossmatching",
      description: "Formalin fixation, paraffin wax embedding, rotary microtomy, H&E staining, forward/reverse grouping, and major crossmatching.",
      subModules: [
        {
          id: "hbt-sub-1-1",
          title: "Sub-Module 1.1: Histotechnology & Tissue Processing",
          lessons: [
            {
              id: "hbt-les-1",
              title: "Fixation (10% NBF), Dehydration, Clearing, Embedding & H&E Staining",
              duration: "35 min",
              notes: [
                "Histotechnology converts gross surgical biopsy specimens into microscopic histological sections mounted on glass slides for pathologist evaluation.",
                "Tissue Fixation: Halts autolysis, prevents bacterial decomposition, and cross-links cellular proteins. Gold Standard: 10% Neutral Buffered Formalin (NBF, pH 6.8-7.2). Fixative volume must be at least 15-20 times the volume of the tissue specimen. Penetration rate: ~1 mm per hour.",
                "Sequential Tissue Processing Steps: 1. Dehydration (ascending grades of ethyl alcohol: 70%, 80%, 95%, absolute 100% to remove water); 2. Clearing (Xylene miscible with alcohol and paraffin, renders tissue translucent); 3. Infiltration & Embedding (molten paraffin wax at 56-58°C); 4. Block Casting (Leuckhart L-molds or modern embedding center).",
                "Microtomy: Rotary microtome cuts sections at 4-5 microns thickness. Ribbon floated on warm water bath (45°C) to remove wrinkles and picked up on albuminized glass slide.",
                "Routine Hematoxylin and Eosin (H&E) Staining: Deparaffinize in xylene -> rehydrate through descending alcohols -> Harris Hematoxylin (stains nuclei blue/purple) -> 1% acid alcohol differentiator -> Scott's tap water bluing -> Eosin counterstain (stains cytoplasm, collagen, RBCs pink/red) -> dehydrate, clear, and mount in DPX."
              ],
              benchAlert: "Never allow paraffin blocks to overheat above 60°C during embedding; excessive heat cooks cellular proteins, producing brittle tissue that crumbles under the microtome blade.",
              quizzes: [
                {
                  question: "What is the recommended minimum ratio of fixative volume (10% NBF) to tissue volume for optimal biopsy fixation?",
                  options: ["1 : 1", "5 : 1", "15 to 20 : 1", "50 : 1"],
                  correctIndex: 2,
                  explanation: "Standard histopathology guidelines require fixative volume to be at least 15-20 times greater than the tissue volume to ensure complete penetration."
                }
              ],
              vivaQAs: [
                {
                  question: "Why is Xylene used as a clearing agent in tissue processing?",
                  answer: "Alcohol and paraffin wax are immiscible. Xylene acts as an intermediate clearing agent because it is miscible with both absolute alcohol and molten paraffin wax, facilitating wax infiltration.",
                  frequentlyAskedIn: "SMFB Histopathology Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Describe the complete tissue processing cycle from specimen reception to block preparation. (Marks: 10)",
                  modelAnswer: "Detail grossing -> 10% NBF fixation -> dehydration in ascending alcohols (70%, 80%, 95%, 100%) -> clearing in xylene -> paraffin wax infiltration (56-58°C) -> mold embedding and chilling.",
                  marks: 10
                }
              ]
            }
          ]
        },
        {
          id: "hbt-sub-1-2",
          title: "Sub-Module 1.2: Blood Banking, ABO/Rh Grouping & Crossmatching",
          lessons: [
            {
              id: "hbt-les-2",
              title: "Forward & Reverse Blood Grouping, Du Testing & Crossmatch Compatibility",
              duration: "35 min",
              notes: [
                "ABO Blood Group System: Discovered by Karl Landsteiner. Governed by Landsteiner's Rule: Individuals possess antibodies against the ABO antigens absent on their own erythrocytes.",
                "Forward (Front) Grouping: Testing patient red cells with known Anti-A, Anti-B, and Anti-AB antisera to determine RBC antigens.",
                "Reverse (Back) Grouping: Testing patient serum/plasma with known reagent A1 cells and B cells to determine expected isohemagglutinins (Anti-A and Anti-B). Forward and reverse grouping must match completely.",
                "Rh(D) Typing: Tested with Anti-D reagent. If negative, perform Weak D (Du) test by incubating at 37°C followed by Direct Antiglobulin Test (DAT) using Coombs serum.",
                "Compatibility Crossmatching: 1. Major Crossmatch (Patient Serum + Donor Red Cells: checks for recipient antibodies capable of destroying donor transfused cells; mandatory); 2. Minor Crossmatch (Donor Plasma + Patient Red Cells)."
              ],
              benchAlert: "In blood bank tube crossmatching, any macroscopic or microscopic agglutination or hemolysis in the major crossmatch tube signifies INCOMPATIBILITY; the unit must never be issued.",
              quizzes: [
                {
                  question: "In blood transfusion medicine, what constitutes a Major Crossmatch?",
                  options: [
                    "Donor Serum + Recipient Red Cells",
                    "Recipient Serum + Donor Red Cells",
                    "Recipient Serum + Reagent A Cells",
                    "Donor Plasma + Donor Red Cells"
                  ],
                  correctIndex: 1,
                  explanation: "The Major Crossmatch combines Recipient Serum with Donor Red Cells to detect pre-existing recipient antibodies that could cause fatal acute hemolytic transfusion reactions."
                }
              ],
              vivaQAs: [
                {
                  question: "What is an ABO blood grouping discrepancy and list two technical causes?",
                  answer: "An ABO discrepancy occurs when results of forward and reverse grouping do not agree. Technical causes: Dirty tubes, mislabeled tubes, cold autoantibodies, under-centrifugation, or failure to add reagent antisera.",
                  frequentlyAskedIn: "SMFB Blood Transfusion Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 3rd Year Annual Examination",
                  questionText: "Discuss the procedure of tube method for ABO and Rh blood grouping. Explain the significance of the Major Crossmatch. (Marks: 10)",
                  modelAnswer: "Include preparation of 5% red cell suspension, forward grouping (anti-A, anti-B, anti-D), reverse grouping (A cells, B cells), centrifugation at 1000 rpm for 1 min, agglutination reading, and major crossmatch principle.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 14. CBI-401: Clinical Biochemistry & Immunology
  // --------------------------------------------------------------------------
  "CBI-401": [
    {
      id: "cbi-mod-1",
      unitNumber: 1,
      title: "Topic 1: Advanced Organ Panels, Westgard Quality Rules & ELISA Immunology",
      description: "HbA1c cation-exchange HPLC, cardiac troponins, thyroid panel, Westgard multirules, and sandwich ELISA.",
      subModules: [
        {
          id: "cbi-sub-1-1",
          title: "Sub-Module 1.1: Advanced Clinical Biochemistry & Quality Control",
          lessons: [
            {
              id: "cbi-les-1",
              title: "Cardiac Troponin, Thyroid Hormones & Westgard Multirule Analysis",
              duration: "35 min",
              notes: [
                "Cardiac Biomarkers in Acute Coronary Syndrome: Cardiac Troponin I (cTnI) and Troponin T (cTnT) are gold-standard biomarkers of myocardial necrosis (high-sensitivity hs-cTn detects within 1-3 hours, peaks at 24 hours, remains elevated for 7-14 days). CK-MB is useful for diagnosing re-infarction.",
                "Endocrine Investigations (Thyroid Profile): Free T3 (FT3), Free T4 (FT4), and Thyroid Stimulating Hormone (TSH, chemiluminescent immunoassay). Primary hypothyroidism: High TSH, low FT4. Primary hyperthyroidism: Undetectable TSH (<0.01 uIU/mL), high FT4/FT3.",
                "Westgard Multirule Quality Control Evaluation: 1. 1(2s) Warning rule: One control exceeds ±2 SD (review run); 2. 1(3s) Rejection rule: One control exceeds ±3 SD (random error, reject run); 3. 2(2s) Rejection rule: Two consecutive controls exceed ±2 SD on the same side of the mean (systematic error, reject run); 4. R(4s) Rejection rule: One control exceeds +2 SD and another exceeds -2 SD in the same run (range difference >= 4 SD, random error, reject run); 5. 4(1s) Rejection rule: Four consecutive controls exceed ±1 SD on same side (systematic drift); 6. 10(x) Rule: Ten consecutive controls on one side of mean (systematic shift)."
              ],
              benchAlert: "When a Westgard 1(3s) or 2(2s) violation occurs, never repeat the control repeatedly until it passes; stop testing, inspect calibration, check reagent lot, and identify root cause before reporting.",
              quizzes: [
                {
                  question: "Which Westgard rule violation indicates random error when one control measurement exceeds the mean +2 SD and another exceeds the mean -2 SD in the same analytical run?",
                  options: ["1(2s)", "2(2s)", "R(4s)", "10(x)"],
                  correctIndex: 2,
                  explanation: "The R(4s) rule is violated when the difference between two controls within a run exceeds 4 standard deviations, diagnosing significant random analytical error."
                }
              ],
              vivaQAs: [
                {
                  question: "Explain the difference between a systematic shift and a systematic drift on a Levy-Jennings QC chart.",
                  answer: "A shift is an abrupt, persistent change in control values on one side of the mean, typically caused by a new reagent lot, lamp replacement, or recalibration. A drift is a gradual progressive trend away from the mean over time, caused by reagent deterioration or lamp aging.",
                  frequentlyAskedIn: "SMFB Biochemistry Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Explain the Westgard Multirule algorithm for automated clinical biochemistry analyzers. Illustrate with a Levy-Jennings chart. (Marks: 10)",
                  modelAnswer: "Detailed explanation of 1(2s), 1(3s), 2(2s), R(4s), 4(1s), 10(x) rules. Draw L-J chart showing mean, ±1SD, ±2SD, ±3SD lines with flagged runs and troubleshooting flowcharts.",
                  marks: 10
                }
              ]
            }
          ]
        },
        {
          id: "cbi-sub-1-2",
          title: "Sub-Module 1.2: Diagnostic Immunology & ELISA Methodology",
          lessons: [
            {
              id: "cbi-les-2",
              title: "Antigen-Antibody Reactions, Agglutination, Precipitation & ELISA Principles",
              duration: "35 min",
              notes: [
                "Primary vs. Secondary Antigen-Antibody Reactions: Primary binding (non-covalent hydrophobic, hydrogen bonds, van der Waals forces); Secondary reactions include Precipitation (soluble antigen + soluble antibody forming visible lattice in equivalence zone) and Agglutination (particulate antigen + antibody forming clumping).",
                "Serological Screening Tests: 1. Widal test (tube agglutination for Salmonella enterica serovars Typhi and Paratyphi O and H antigens, significant titer >= 1:160 in endemic Bangladesh); 2. VDRL / RPR (non-treponemal flocculation tests using cardiolipin-lecithin-cholesterol antigen for syphilis screening); 3. ASO titer (latex agglutination for antistreptolysin O).",
                "Enzyme-Linked Immunosorbent Assay (ELISA) Principles: 1. Direct ELISA (detects antigen with enzyme-conjugated primary antibody); 2. Indirect ELISA (detects serum antibodies, e.g. anti-HIV); 3. Sandwich ELISA (antigen captured between solid-phase capture antibody and enzyme-conjugated detection antibody, e.g., HBsAg, Dengue NS1); 4. Competitive ELISA.",
                "Substrate & Chromogen Reaction: Horseradish peroxidase (HRP) enzyme cleaves TMB (tetramethylbenzidine) substrate, developing blue color, stopped with 1N sulfuric acid turning yellow, measured at 450 nm."
              ],
              benchAlert: "In manual ELISA processing, incomplete plate washing leads to high non-specific background absorbance and false-positive results; always perform at least 5 thorough wash cycles with verified soak time.",
              quizzes: [
                {
                  question: "Which ELISA format is the industry standard for quantitative measurement of macromolecular antigens like HBsAg and Dengue NS1?",
                  options: [
                    "Direct competitive ELISA",
                    "Sandwich (Capture) ELISA",
                    "Ouchterlony double diffusion",
                    "Rocket immunoelectrophoresis"
                  ],
                  correctIndex: 1,
                  explanation: "Sandwich ELISA provides highest sensitivity and specificity by capturing the target antigen between two distinct monoclonal antibodies."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the zone phenomenon (prozone and postzone) in antigen-antibody agglutination reactions?",
                  answer: "Prozone occurs in antibody excess and postzone in antigen excess, preventing maximal cross-linking lattice formation and causing false-negative agglutination. Equivalence zone is where optimal visible agglutination occurs.",
                  frequentlyAskedIn: "SMFB Immunology Board Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Describe the principle, procedure, and clinical applications of Sandwich ELISA for Hepatitis B surface antigen (HBsAg) screening. (Marks: 10)",
                  modelAnswer: "Include: Solid phase anti-HBs coat -> add patient serum -> wash -> add HRP-conjugated anti-HBs -> wash -> add TMB substrate -> stop reaction with H2SO4 -> read OD at 450 nm against cutoff control.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 15. SMIC-402: Special Microbiology
  // --------------------------------------------------------------------------
  "SMIC-402": [
    {
      id: "smic-mod-1",
      unitNumber: 1,
      title: "Topic 1: Advanced Diagnostic Bacteriology, Clinical Virology & Medical Mycology",
      description: "Blood cultures, anaerobic methods, viral serology (Hepatitis, HIV, Dengue), fungal KOH preparations, and biosafety management.",
      subModules: [
        {
          id: "smic-sub-1-1",
          title: "Sub-Module 1.1: Automated Blood Cultures, Anaerobes & Medical Mycology",
          lessons: [
            {
              id: "smic-les-1",
              title: "Blood Culture Systems, Anaerobic Jars & Fungal 10% KOH / SDA Examination",
              duration: "35 min",
              notes: [
                "Blood Culture Diagnostics in Sepsis: Automated continuous monitoring systems (BACTEC, BacT/ALERT) detect bacterial growth via colorimetric or fluorescent CO2 sensors. Two blood culture sets (aerobic and anaerobic bottles) collected from separate venipuncture sites before antimicrobial therapy.",
                "Anaerobic Bacteriology: Obligate anaerobes (Clostridium, Bacteroides fragilis) lack catalase and superoxide dismutase, making oxygen toxic. Cultivated in McIntosh-Fildes anaerobic jars or GasPak system (chemical packet generating H2 and CO2, with palladium catalyst and methylene blue redox indicator: blue in O2, colorless in anaerobiosis).",
                "Medical Mycology: Fungi possess ergosterol in cell membranes and chitin cell walls. 1. Direct 10% Potassium Hydroxide (KOH) preparation: Digests human cellular keratin in skin/hair/nail scrapings, leaving fungal hyphae and budding yeast cells visible; 2. Sabouraud Dextrose Agar (SDA, low pH 5.6 and chloramphenicol to suppress bacteria); 3. Lactophenol Cotton Blue (LPCB) mount (lactic acid clears tissue, phenol kills organism, cotton blue stains chitin).",
                "Common Fungi: Dermatophytes (Trichophyton, Microsporum), Candida albicans (pseudohyphae, germ tube positive in human serum in 2-3 hours), Aspergillus fumigatus (dichotomous 45-degree branching septate hyphae)."
              ],
              benchAlert: "Never shake blood culture bottles prior to loading into automated incubators; violent agitation dislodges the internal chemical sensor and generates false instrument alarms.",
              quizzes: [
                {
                  question: "What rapid screening test provides presumptive identification of Candida albicans within 2 to 3 hours when incubated in human serum at 37°C?",
                  options: [
                    "Germ Tube Test",
                    "Urease test",
                    "Bile esculin hydrolysis",
                    "Optochin susceptibility"
                  ],
                  correctIndex: 0,
                  explanation: "The Germ Tube Test demonstrates true hyphal outgrowth without constriction from yeast cells within 2-3 hours, characteristic of Candida albicans."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the function of 10% KOH in the direct microscopic examination of dermatological fungal scrapings?",
                  answer: "10% KOH acts as a clearing agent by dissolving human keratin and cellular debris without destroying the fungal chitinous cell wall, allowing clear visualization of hyphae and arthrospores.",
                  frequentlyAskedIn: "SMFB Special Microbiology Practical Examination"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Discuss the laboratory diagnosis of fungal infections. Describe the preparation and clinical significance of 10% KOH mount. (Marks: 8)",
                  modelAnswer: "Include: Specimen collection (scrapings/swabs), direct 10% KOH microscopy, Calcofluor white, SDA culture incubation at 25°C and 37°C, LPCB slide culture, and germ tube test.",
                  marks: 8
                }
              ]
            }
          ]
        },
        {
          id: "smic-sub-1-2",
          title: "Sub-Module 1.2: Clinical Virology & Diagnostic Viral Serology",
          lessons: [
            {
              id: "smic-les-2",
              title: "Viral Hepatitis Seromarkers, HIV Rapid Testing & Dengue Diagnostics",
              duration: "35 min",
              notes: [
                "Clinical Virology operates primarily via serological antigen/antibody detection and real-time reverse transcriptase PCR (RT-PCR).",
                "Hepatitis B Virus (HBV) Serological Markers: 1. HBsAg (first marker to appear, indicates acute or chronic active infection); 2. Anti-HBs (antibodies indicating immunity from past infection or vaccination); 3. HBeAg (marker of active viral replication and high infectivity); 4. Anti-HBe (seroconversion, reduced infectivity); 5. IgM anti-HBc (hallmark of acute recent HBV infection); 6. IgG anti-HBc (indicates past exposure or chronic carriage).",
                "Dengue Virus Diagnostic Algorithm: Transmitted by Aedes aegypti. Days 1-5 of fever: Dengue NS1 Antigen (non-structural protein 1, positive via rapid ICT or ELISA); Days 5+: Dengue IgM and IgG antibodies (IgM indicates acute primary infection; high IgG in acute phase indicates secondary dengue infection with higher risk of Dengue Hemorrhagic Fever).",
                "HIV Screening Protocol (WHO Strategy): Rapid Immunochromatographic Tests (ICT) using 3-test algorithm (screening test of highest sensitivity, followed by two discriminatory tests with different antigens/principles) before reporting reactive results."
              ],
              benchAlert: "In viral serology ICT cassettes, reading results after the manufacturer's specified reading window (e.g. beyond 20 minutes) causes false-positive band formation from non-specific drying.",
              quizzes: [
                {
                  question: "Which Hepatitis B serological marker confirms immunity following successful immunization with recombinant Hepatitis B vaccine?",
                  options: [
                    "HBsAg",
                    "IgM anti-HBc",
                    "Anti-HBs only (without anti-HBc)",
                    "HBeAg"
                  ],
                  correctIndex: 2,
                  explanation: "Recombinant Hepatitis B vaccine contains only HBsAg; successful vaccination induces Anti-HBs antibodies alone, in the absence of core antibodies (Anti-HBc)."
                }
              ],
              vivaQAs: [
                {
                  question: "Interpret the following HBV serology: HBsAg negative, Anti-HBs positive (>100 mIU/mL), Anti-HBc negative.",
                  answer: "This profile represents successful immunity resulting from Hepatitis B vaccination without previous natural infection.",
                  frequentlyAskedIn: "SMFB Special Microbiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2021",
                  exam: "SMFB 4th Year Annual Examination",
                  questionText: "Tabulate the serological markers of Hepatitis B virus infection in acute, chronic, and post-vaccinated states. (Marks: 10)",
                  modelAnswer: "Comprehensive table detailing HBsAg, Anti-HBs, HBeAg, Anti-HBe, IgM anti-HBc, and Total anti-HBc across acute HBV, chronic active carrier, chronic inactive, resolved natural infection, and vaccinated states.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 16. SFA-403: Special Field Attachment
  // --------------------------------------------------------------------------
  "SFA-403": [
    {
      id: "sfa-mod-1",
      unitNumber: 1,
      title: "Topic 1: Hospital Laboratory Rotations, Emergency On-Call & Quality Accreditation",
      description: "Clinical departmental rotations, night emergency duty, turnaround time (TAT), panic value reporting, and clinical logbook defense.",
      subModules: [
        {
          id: "sfa-sub-1-1",
          title: "Sub-Module 1.1: Departmental Rotations & Emergency Night Duty",
          lessons: [
            {
              id: "sfa-les-1",
              title: "Hospital Clinical Internship Rotations & Emergency Duty Protocols",
              duration: "40 min",
              notes: [
                "The Special Field Attachment provides hands-on practical clinical hospital internship across accredited tertiary hospitals (e.g. DMCH, SSMC, NIDCH, NICVD, Division/District Hospitals).",
                "Rotational Schedule: 1. Core Clinical Pathology & Parasitology (4 weeks); 2. Routine & Automated Haematology (6 weeks); 3. Clinical Biochemistry & Enzymology (6 weeks); 4. Diagnostic Microbiology & Serology (6 weeks); 5. Histopathology & Cytopathology (4 weeks); 6. Blood Bank & Transfusion Medicine (4 weeks); 7. Emergency 24/7 Laboratory Night Duty (2 weeks).",
                "Emergency Laboratory Protocols: Managing STAT samples within designated Turnaround Times (TAT): Blood Gas / Electrolytes (<15 min), Cardiac Troponin (<30 min), Crossmatch in severe hemorrhage (<15 min uncrossmatched O-negative or 30 min rapid saline match).",
                "Critical Panic Value Reporting: Immediate telephonic notification to treating physician with read-back verification for life-threatening levels: Glucose < 2.5 or > 25.0 mmol/L; Potassium < 2.8 or > 6.2 mmol/L; Platelets < 20,000/uL; Hemoglobin < 6.0 g/dL; Positive blood culture Gram stain.",
                "Clinical Logbook & OSPE Defense: Every intern must maintain an authorized daily clinical procedure logbook signed by faculty supervisors, documenting at least 1,500 patient procedures across all diagnostic disciplines."
              ],
              benchAlert: "When reporting a critical panic value, always enforce the 'read-back' protocol: make the receiving doctor or nurse repeat the patient name, hospital bed number, and numerical value verbatim before logging.",
              quizzes: [
                {
                  question: "In hospital emergency laboratory services, what protocol is legally required when communicating life-threatening critical panic values?",
                  options: [
                    "Wait until regular morning shift rounds",
                    "Immediate telephonic notification with verbal read-back confirmation",
                    "Send an unverified automated SMS",
                    "Discard the result until re-tested twice"
                  ],
                  correctIndex: 1,
                  explanation: "Immediate telephonic communication with explicit verbal read-back confirmation from the clinical provider is required by national and international accreditation standards."
                }
              ],
              vivaQAs: [
                {
                  question: "What are the critical panic value thresholds for serum potassium and why are they life-threatening?",
                  answer: "Potassium < 2.8 mmol/L (hypokalemia) causes fatal ventricular arrhythmias and muscle paralysis; potassium > 6.2 mmol/L (hyperkalemia) leads to peaked T-waves, ventricular fibrillation, and sudden cardiac arrest.",
                  frequentlyAskedIn: "SMFB Final Board OSPE / Viva Voce"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 4th Year Annual Final Examination",
                  questionText: "Define Turnaround Time (TAT) and Critical Panic Values. List five laboratory panic values and discuss the protocol for their emergency reporting. (Marks: 10)",
                  modelAnswer: "TAT definition (time from specimen receipt to report dispatch). Five panic values: K+ (<2.8 or >6.2 mEq/L), Glucose (<45 or >450 mg/dL), Platelets (<20,000/uL), Hb (<6 g/dL), pH (<7.20 or >7.60). Reporting protocol: verify result, telephone doctor immediately, request read-back, document timestamp, caller, and recipient.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};


export const DIPLOMA_STUDY_CENTER_DATA: Record<string, StudyModuleItem[]> = {
  ...BASE_DIPLOMA_STUDY_CENTER_DATA,
  ...DIPLOMA_ALL_STUDY_DATA,
};
