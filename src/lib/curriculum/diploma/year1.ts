// Official State Medical Faculty of Bangladesh (SMFB) Diploma in Medical Laboratory Technology (DMLT)
// 1st Year Curriculum: ENG-101, ANAT-102, PHYS-103, COMM-104, COMP-105

import type { StudyModuleItem } from "../diploma-curriculum-data";
import type { CourseCurriculumDetail } from "../course-details-data";

export const DIPLOMA_YEAR1_STUDY_DATA: Record<string, StudyModuleItem[]> = {
  "ENG-101": [
    {
      id: "eng-mod-1",
      unitNumber: 1,
      title: "Topic 1: Foundation English Grammar, Syntax & Nomenclature",
      description: "Sentence structure, subjects and predicate, parts of speech classification, tenses, conjugation, prepositions, punctuation, spelling, and scientific idioms.",
      learningOutcomes: [
        "Identify subjects and predicates in medical and scientific sentences.",
        "Classify nouns, pronouns, adjectives, verbs, and adverbs accurately.",
        "Apply correct verb conjugation and tense agreement in diagnostic protocols.",
        "Master punctuation rules: capitalization, comma, semicolon, colon, hyphen, and underlining.",
        "Correct spelling errors and use scientific medical terminology appropriately."
      ],
      subModules: [
        {
          id: "eng-sub-1-1",
          title: "Sub-Module 1.1: Sentence Anatomy & Parts of Speech",
          lessons: [
            {
              id: "eng-les-1",
              title: "Lesson 1: Subjects, Predicates & Medical Sentence Structure",
              duration: "25 min",
              notes: [
                "Every complete sentence consists of a Subject and a Predicate.",
                "In medical laboratory reporting, declarative sentences follow strict Subject-Verb-Object (S-V-O) syntax.",
                "Sentence fragments and run-on sentences must be avoided in diagnostic laboratory documentation.",
                "Compound sentences use coordinating conjunctions while complex sentences use subordinating clauses."
              ],
              benchAlert: "In diagnostic reporting, never omit the subject. Clear phrasing prevents critical diagnostic ambiguity.",
              quizzes: [
                {
                  question: "In the sentence 'The medical technologist calibrated the spectrophotometer,' what is the complete predicate?",
                  options: ["The medical technologist", "calibrated", "calibrated the spectrophotometer", "the spectrophotometer"],
                  correctIndex: 2,
                  explanation: "The complete predicate includes the finite verb and its object: 'calibrated the spectrophotometer'."
                }
              ],
              vivaQAs: [
                {
                  question: "Why is precise sentence structure essential in clinical laboratory reports?",
                  answer: "Ambiguous phrasing can cause clinical misinterpretation of patient results, leading to inappropriate medical management.",
                  frequentlyAskedIn: "SMFB Board English Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Define Subject and Predicate with two clinical examples. (Marks: 6)",
                  modelAnswer: "Subject: the entity performing or experiencing action. Predicate: the assertion made about the subject.",
                  marks: 6
                }
              ]
            },
            {
              id: "eng-les-2",
              title: "Lesson 2: Nouns, Pronouns, Adjectives & Prepositions in Pathology",
              duration: "30 min",
              notes: [
                "Proper nouns in pathology include named methods and stains (e.g. Gram stain, Leishman stain, Jaffe reaction).",
                "Countable vs. mass nouns: milliliters, tubes (countable); blood, urine, serum (uncountable).",
                "Prepositions of position and movement (in, on, into, onto, between, among) govern accurate laboratory instructions."
              ],
              quizzes: [
                {
                  question: "Which of the following is an uncountable mass noun in clinical science?",
                  options: ["Pipette", "Serum", "Erythrocyte", "Cuvette"],
                  correctIndex: 1,
                  explanation: "Serum is a mass/uncountable noun and does not take a plural 's'."
                }
              ],
              vivaQAs: [
                {
                  question: "Give examples of anatomical prepositions used in laboratory manuals.",
                  answer: "Examples include 'superior to', 'adjacent to', 'within', 'distal from'.",
                  frequentlyAskedIn: "SMFB English Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Fill in appropriate prepositions in laboratory procedural sentences. (Marks: 5)",
                  modelAnswer: "Aspirate 5 ml of serum INTO the clean tube. Centrifuge AT 3000 RPM FOR 10 minutes.",
                  marks: 5
                }
              ]
            }
          ]
        },
        {
          id: "eng-sub-1-2",
          title: "Sub-Module 1.2: Verb Tenses, Voice & Technical Translation",
          lessons: [
            {
              id: "eng-les-3",
              title: "Lesson 3: Tenses & Passive Voice in Clinical Documentation",
              duration: "30 min",
              notes: [
                "Scientific methodologies are preferentially written in the past passive voice: e.g. 'The specimen was centrifuged at 3000 RPM.'",
                "Present simple tense is used for universal scientific facts and laboratory SOP definitions.",
                "Avoid first-person pronouns ('I', 'we') in formal laboratory diagnostic findings."
              ],
              benchAlert: "Use passive voice in incident logs: 'The reagent bottle was broken during transfer,' not 'I broke the bottle.'",
              quizzes: [
                {
                  question: "Convert 'The technologist stained the smear' into passive voice.",
                  options: ["The smear stained the technologist", "The smear was stained by the technologist", "The technologist was staining the smear", "The smear has stained"],
                  correctIndex: 1,
                  explanation: "Past passive voice: 'The smear was stained by the technologist'."
                }
              ],
              vivaQAs: [
                {
                  question: "Why is the passive voice preferred in scientific SOPs?",
                  answer: "It emphasizes the analytical procedure and the specimen rather than the individual performing it.",
                  frequentlyAskedIn: "SMFB Board English Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Change the voice of five laboratory procedure sentences into passive voice. (Marks: 5)",
                  modelAnswer: "Passive transformation focuses on the direct object receiving the action.",
                  marks: 5
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "eng-mod-2",
      unitNumber: 2,
      title: "Topic 2: Our Environment, Ecosystems & Biomedical Waste",
      description: "Ecosystem dynamics, environmental pollution, global warming, conservation of forests, and waste management in medical healthcare facilities.",
      learningOutcomes: [
        "Explain environmental ecosystems and biological food chains in scientific English.",
        "Discuss air, water, and soil pollution causes and prevention.",
        "Demonstrate fluency in writing essays on global warming and hospital waste management."
      ],
      subModules: [
        {
          id: "eng-sub-2-1",
          title: "Sub-Module 2.1: Environmental Health & Biomedical Waste Writing",
          lessons: [
            {
              id: "eng-les-4",
              title: "Lesson 4: Hospital Waste Management & Pollution Control Composition",
              duration: "30 min",
              notes: [
                "Biomedical waste segregation involves color-coded categories: red for sharps, yellow for infectious anatomical waste, blue for glass.",
                "Technical descriptions of hospital incinerators and effluent treatment plants (ETP) require structured technical terminology.",
                "Composing essays on environmental sanitation and health risks in Bangladesh."
              ],
              benchAlert: "Sharps must be disposed of immediately in puncture-resistant containers to prevent accidental needle-stick injury.",
              quizzes: [
                {
                  question: "Which color bin is designated for infectious anatomical and pathological waste?",
                  options: ["Yellow", "Red", "Black", "Green"],
                  correctIndex: 0,
                  explanation: "Yellow bins are internationally standardized for infectious pathological and human anatomical waste."
                }
              ],
              vivaQAs: [
                {
                  question: "Define the term 'biodegradable waste' in healthcare contexts.",
                  answer: "Waste matter that can be decomposed naturally by micro-organisms such as bacteria and fungi.",
                  frequentlyAskedIn: "SMFB English Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Write a short composition on 'Hospital Waste Management in Bangladesh'. (Marks: 10)",
                  modelAnswer: "Structured composition detailing sources of hospital waste, hazards of improper disposal, segregation at source, and eco-friendly treatment.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "eng-mod-3",
      unitNumber: 3,
      title: "Topic 3: Applied Technical Writing, Letters & Laboratory Reports",
      description: "Official letters, leave applications, formal incident reports, equipment breakdown notices, telegrams, and official email correspondence.",
      learningOutcomes: [
        "Draft formal clinical laboratory reports and observation summaries.",
        "Write official applications for equipment repair, reagent procurement, and administrative leave.",
        "Compose professional emails following international conventions."
      ],
      subModules: [
        {
          id: "eng-sub-3-1",
          title: "Sub-Module 3.1: Professional Letters & Incident Reporting",
          lessons: [
            {
              id: "eng-les-5",
              title: "Lesson 5: Drafting Laboratory Equipment Breakdown & Procurement Letters",
              duration: "35 min",
              notes: [
                "Formal letters contain: sender address, date, recipient designation, subject line, salutation, body paragraphs, and complimentary close.",
                "Equipment breakdown notices must specify the instrument model, serial number, nature of fault, and impact on patient turnaround times.",
                "Procurement indents require itemized tables of reagent lot numbers, quantity, and urgency."
              ],
              quizzes: [
                {
                  question: "In an official letter to a Hospital Superintendent, what is the most appropriate salutation?",
                  options: ["Dear Friend,", "Sir / Madam,", "Hi Doctor,", "Hey,"],
                  correctIndex: 1,
                  explanation: "'Sir / Madam,' is standard formal business and administrative correspondence protocol."
                }
              ],
              vivaQAs: [
                {
                  question: "What essential information must be included in a critical panic laboratory report?",
                  answer: "Patient name, registration ID, test name, panic value, date/time, caller name, and recipient clinician confirmation.",
                  frequentlyAskedIn: "SMFB English Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Write an application to the Principal requesting repair of the laboratory compound microscope. (Marks: 8)",
                  modelAnswer: "Formal application detailing optical misalignment, affected practical classes, and request for bio-medical engineer inspection.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "eng-mod-4",
      unitNumber: 4,
      title: "Topic 4: Communicative English, Listening, Speaking & Board Viva Voce",
      description: "Reading comprehension of medical scientific literature, oral communication with patients and colleagues, listening comprehension, and viva voce mastery.",
      learningOutcomes: [
        "Demonstrate active listening skills in understanding patient clinical histories.",
        "Conduct clear, empathetic phlebotomy and diagnostic instructions in English.",
        "Answer oral board viva voce questions with grammatical accuracy and confidence."
      ],
      subModules: [
        {
          id: "eng-sub-4-1",
          title: "Sub-Module 4.1: Oral Communication & Viva Voce Techniques",
          lessons: [
            {
              id: "eng-les-6",
              title: "Lesson 6: Oral Communication Skills & Clinical Patient Instructions",
              duration: "25 min",
              notes: [
                "Effective verbal communication requires clear pronunciation, moderate pacing, and avoidance of intimidating medical jargon when addressing patients.",
                "Instructions for fasting blood glucose (FBS) or clean-catch midstream urine (MSU) must be conveyed step-by-step.",
                "Techniques for oral examination: maintain eye contact, answer directly, and explain underlying mechanisms logically."
              ],
              benchAlert: "Always verify patient identity verbally using two identifiers (Full name and Hospital Registration Number) before drawing blood.",
              quizzes: [
                {
                  question: "Which instructions are critical when instructing a patient for an Oral Glucose Tolerance Test (OGTT)?",
                  options: [
                    "Eat a heavy meal immediately before the test",
                    "Maintain an 8-10 hour overnight fast and avoid smoking or strenuous exertion",
                    "Drink 2 liters of sugary soda prior to arrival",
                    "Take morning insulin before giving fasting blood"
                  ],
                  correctIndex: 1,
                  explanation: "An 8-10 hour fast and resting metabolic state are mandatory for valid glucose tolerance testing."
                }
              ],
              vivaQAs: [
                {
                  question: "How do you explain the mid-stream urine collection procedure to a patient in English?",
                  answer: "Explain to clean the external genitalia, void the first portion into the toilet, collect the middle portion in the sterile container without touching inside, and discard the rest.",
                  frequentlyAskedIn: "SMFB Oral English Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Write a dialogue between a Medical Technologist and a patient instructing on proper 24-hour urine collection. (Marks: 8)",
                  modelAnswer: "Structured dialogue explaining discard of morning sample on day 1, collection of all urine including day 2 morning, and refrigeration.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "ANAT-102": [
    {
      id: "anat-mod-1",
      unitNumber: 1,
      title: "Topic 1: Introductory Anatomy, Cellular Architecture & Tissue Histology",
      description: "Anatomical terminology, planes of the body, organization of body systems, cell structure, cell division (mitosis phases), and classification of the 4 primary tissues.",
      learningOutcomes: [
        "Define anatomical terminologies and spatial planes (median, sagittal, coronal, transverse).",
        "Describe human cell ultrastructure and the clinical importance of organelles.",
        "Classify epithelial, connective, muscular, and nervous tissues under light microscopy."
      ],
      subModules: [
        {
          id: "anat-sub-1-1",
          title: "Sub-Module 1.1: Anatomical Planes, Body Organization & Cell Ultrastructure",
          lessons: [
            {
              id: "anat-les-1",
              title: "Lesson 1: Anatomical Terminologies, Body Planes & Cell Organelles",
              duration: "30 min",
              notes: [
                "Anatomical position: Body standing erect, eyes looking forward, arms at sides, palms facing forward.",
                "Planes: Median/Sagittal divides into right and left; Coronal/Frontal into anterior and posterior; Transverse/Horizontal into superior and inferior.",
                "Cell organelles of diagnostic significance: Nucleus (chromatin), Mitochondria (ATP & mtDNA), Endoplasmic reticulum, Golgi apparatus, Lysosomes."
              ],
              benchAlert: "In histological sectioning, recognize plane of section: transverse sections of blood vessels appear circular; longitudinal sections appear tubular.",
              quizzes: [
                {
                  question: "Which anatomical plane divides the human body into equal right and left halves?",
                  options: ["Coronal plane", "Median sagittal plane", "Horizontal plane", "Oblique plane"],
                  correctIndex: 1,
                  explanation: "The median plane passes vertically through the midline, dividing the body into symmetrical right and left halves."
                }
              ],
              vivaQAs: [
                {
                  question: "Define the anatomical position.",
                  answer: "The living body standing erect, face looking forward, feet parallel, arms by the sides with palms facing forward.",
                  frequentlyAskedIn: "SMFB Anatomy Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Define Anatomy. Describe the anatomical planes with diagrams. (Marks: 8)",
                  modelAnswer: "Anatomy is the science of the structure and relationships of the human body. Detail median, sagittal, coronal, and transverse planes.",
                  marks: 8
                }
              ]
            },
            {
              id: "anat-les-2",
              title: "Lesson 2: Classification & Microscopic Identification of the Four Basic Tissues",
              duration: "35 min",
              notes: [
                "Four primary tissues: Epithelial tissue (covers surfaces, lines cavities), Connective tissue (supports, binds), Muscle tissue (contracts), Nervous tissue (conducts impulses).",
                "Epithelial classification: Simple (squamous, cuboidal, columnar) and Stratified (keratinized, non-keratinized, transitional/urothelium).",
                "Connective tissue components: Ground substance, fibers (collagen, elastin, reticulin), and cells (fibroblasts, macrophages, mast cells, plasma cells)."
              ],
              benchAlert: "Transitional epithelium (urothelium) in bladder histology accommodates stretching without cellular detachment.",
              quizzes: [
                {
                  question: "Which type of epithelium lines the urinary bladder and ureter?",
                  options: ["Simple squamous", "Stratified squamous", "Transitional epithelium (urothelium)", "Pseudostratified ciliated"],
                  correctIndex: 2,
                  explanation: "Transitional epithelium lines the urinary tract and exhibits elasticity."
                }
              ],
              vivaQAs: [
                {
                  question: "What are the hallmarks of non-keratinized stratified squamous epithelium under microscope?",
                  answer: "Multiple cell layers; basal cells are cuboidal/columnar, intermediate cells polyhedral, and surface cells flattened with preserved nuclei.",
                  frequentlyAskedIn: "SMFB Histology OSPE"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Classify epithelial tissue with examples of their locations in the human body. (Marks: 10)",
                  modelAnswer: "Classification into simple (squamous, cuboidal, columnar, pseudostratified) and stratified (squamous, cuboidal, transitional) with specific anatomical sites.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "anat-mod-2",
      unitNumber: 2,
      title: "Topic 2: Musculoskeletal System: Osteology & Arthrology",
      description: "Classification of bones, microscopic structure of compact and spongy bone, major bones of the axial and appendicular skeleton, types and mechanics of joints.",
      learningOutcomes: [
        "Classify human bones morphologically (long, short, flat, irregular, sesamoid).",
        "Describe Haversian systems and osteon architecture.",
        "Identify anatomical landmarks of femur, humerus, skull, vertebrae, and pelvis."
      ],
      subModules: [
        {
          id: "anat-sub-2-1",
          title: "Sub-Module 2.1: Osteology, Haversian Architecture & Joint Classification",
          lessons: [
            {
              id: "anat-les-3",
              title: "Lesson 3: Gross Anatomy of Major Bones & Microscopic Haversian Systems",
              duration: "30 min",
              notes: [
                "Axial skeleton (80 bones: skull, vertebrae, ribs, sternum) and Appendicular skeleton (126 bones: limbs and girdles).",
                "Compact bone histology: Osteons/Haversian systems with central Haversian canal, concentric lamellae, lacunae containing osteocytes, and radiating canaliculi.",
                "Bone marrow sites for diagnostic aspiration: Posterior superior iliac spine (PSIS) in adults, anterior tibial plateau in infants under 1 year."
              ],
              benchAlert: "In decalcified bone histology, ensure complete calcium removal with EDTA or nitric acid before microtome sectioning to prevent blade nicking.",
              quizzes: [
                {
                  question: "What connects adjacent Haversian canals in compact bone histology?",
                  options: ["Volkmann's canals", "Canaliculi", "Lacunae", "Trabeculae"],
                  correctIndex: 0,
                  explanation: "Volkmann's (perforating) canals run perpendicularly to connect Haversian canals with the periosteum and medullary cavity."
                }
              ],
              vivaQAs: [
                {
                  question: "Which site is preferred for diagnostic bone marrow aspiration in adults?",
                  answer: "The posterior superior iliac crest (PSIS) of the pelvis due to high cellularity and absence of adjacent vital structures.",
                  frequentlyAskedIn: "SMFB Anatomy & Haematology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Draw and label the microscopic structure of compact bone (Haversian system). (Marks: 8)",
                  modelAnswer: "Diagram showing Haversian canal, concentric lamellae, lacunae with osteocytes, canaliculi, and interstitial lamellae.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "anat-mod-3",
      unitNumber: 3,
      title: "Topic 3: Cardiovascular & Respiratory Systems Anatomy",
      description: "Gross anatomy of the heart, cardiac chambers, valves, coronary vasculature, major arteries and veins, histology of blood vessels, respiratory tract, larynx, trachea, lungs, and alveoli.",
      learningOutcomes: [
        "Describe the external and internal features of the heart and its conducting system.",
        "Distinguish between elastic arteries, muscular arteries, veins, and capillaries under light microscopy.",
        "Trace the respiratory tree from nasal cavity to pulmonary alveoli."
      ],
      subModules: [
        {
          id: "anat-sub-3-1",
          title: "Sub-Module 3.1: Heart, Vascular Tree & Pulmonary Architecture",
          lessons: [
            {
              id: "anat-les-4",
              title: "Lesson 4: Cardiac Anatomy, Coronary Circulation & Vascular Histology",
              duration: "35 min",
              notes: [
                "Heart: Located in middle mediastinum. 4 chambers: Right atrium (receives SVC, IVC, coronary sinus), Right ventricle (pumps to pulmonary trunk), Left atrium (4 pulmonary veins), Left ventricle (pumps to ascending aorta).",
                "Heart wall layers: Endocardium, Myocardium (striated involuntary cardiac muscle with intercalated discs), Epicardium (visceral serous pericardium).",
                "Vascular histology: Tunica intima (endothelium), Tunica media (smooth muscle & elastic fibers), Tunica adventitia (collagen connective tissue & vasa vasorum)."
              ],
              benchAlert: "In vascular venipuncture, locate the median cubital vein in the antecubital fossa; it is anchored and less prone to rolling.",
              quizzes: [
                {
                  question: "Which cardiac chamber possesses the thickest myocardial wall?",
                  options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
                  correctIndex: 3,
                  explanation: "The left ventricle wall is approximately 3 times thicker than the right ventricle to generate systemic arterial pressure."
                }
              ],
              vivaQAs: [
                {
                  question: "Name the valves of the heart and their locations.",
                  answer: "Tricuspid valve (right AV), Mitral/Bicuspid valve (left AV), Aortic semilunar valve (aortic orifice), Pulmonary semilunar valve (pulmonary orifice).",
                  frequentlyAskedIn: "SMFB Anatomy Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Describe the gross anatomy and blood supply of the human heart with a labeled diagram. (Marks: 10)",
                  modelAnswer: "Chambers, valves, fibrous skeleton, right and left coronary artery branches, and coronary sinus drainage.",
                  marks: 10
                }
              ]
            },
            {
              id: "anat-les-5",
              title: "Lesson 5: Respiratory Tract, Tracheobronchial Tree & Pulmonary Alveoli",
              duration: "30 min",
              notes: [
                "Upper respiratory tract: Nasal cavity, pharynx, larynx. Lower respiratory tract: Trachea, bronchi, bronchioles, terminal bronchioles, respiratory bronchioles, alveolar ducts, alveoli.",
                "Trachea: Fibrocartilaginous tube with 16-20 C-shaped hyaline cartilage rings, lined by pseudostratified ciliated columnar epithelium with goblet cells (respiratory epithelium).",
                "Blood-air barrier (respiratory membrane): Type I pneumocyte, capillary endothelial cell, and their fused basement membranes (~0.5 µm thick)."
              ],
              quizzes: [
                {
                  question: "What is the characteristic lining epithelium of the trachea and bronchus?",
                  options: ["Simple columnar", "Stratified squamous", "Pseudostratified ciliated columnar with goblet cells", "Transitional"],
                  correctIndex: 2,
                  explanation: "Respiratory epithelium is pseudostratified ciliated columnar with mucus-secreting goblet cells."
                }
              ],
              vivaQAs: [
                {
                  question: "What cells secrete pulmonary surfactant, and what is their clinical importance?",
                  answer: "Type II alveolar cells (pneumocytes) secrete surfactant, which reduces alveolar surface tension and prevents alveolar collapse at end-expiration.",
                  frequentlyAskedIn: "SMFB Anatomy & Physiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2022",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Describe the gross and microscopic anatomy of the human lung. (Marks: 10)",
                  modelAnswer: "Right lung (3 lobes, 2 fissures), Left lung (2 lobes, 1 fissure, cardiac notch), bronchopulmonary segments, and alveolar ultrastructure.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "anat-mod-4",
      unitNumber: 4,
      title: "Topic 4: Gastrointestinal, Hepatobiliary & Genitourinary Systems Anatomy",
      description: "Anatomy of the alimentary tract (mouth to anal canal), liver, pancreas, gall bladder, kidneys, nephron, urinary bladder, and male and female reproductive systems.",
      learningOutcomes: [
        "Trace the digestive tract and describe the microscopic layers of the gut wall.",
        "Explain the anatomy of the liver lobule, portal triad, and pancreatic acini/islets.",
        "Describe the macroscopic and microscopic anatomy of the kidney and nephron."
      ],
      subModules: [
        {
          id: "anat-sub-4-1",
          title: "Sub-Module 4.1: Alimentary Tract, Hepatobiliary Architecture & Renal Anatomy",
          lessons: [
            {
              id: "anat-les-6",
              title: "Lesson 6: Stomach, Intestinal Mucosa & Hepatic Portal Architecture",
              duration: "35 min",
              notes: [
                "Gut wall layers: Mucosa (epithelium, lamina propria, muscularis mucosae), Submucosa (Meissner's plexus), Muscularis externa (inner circular, outer longitudinal, Auerbach's plexus), Serosa/Adventitia.",
                "Stomach: Cardia, fundus, body, pylorus. Gastric glands contain Parietal cells (HCl & Intrinsic Factor) and Chief cells (Pepsinogen).",
                "Liver: Classic lobule is hexagonal with central vein in the middle and Portal Triads (portal vein branch, hepatic artery branch, bile ductule) at vertices."
              ],
              benchAlert: "In gastric biopsies, recognize Helicobacter pylori in mucosal mucus layer using Giemsa or Warthin-Starry silver staining.",
              quizzes: [
                {
                  question: "Which cell in the gastric mucosa secretes Hydrochloric acid (HCl) and Intrinsic Factor?",
                  options: ["Chief cell", "Parietal (oxyntic) cell", "Mucous neck cell", "G cell"],
                  correctIndex: 1,
                  explanation: "Parietal (oxyntic) cells produce HCl and Castle's intrinsic factor essential for vitamin B12 absorption."
                }
              ],
              vivaQAs: [
                {
                  question: "What structures constitute the Portal Triad in liver histology?",
                  answer: "A branch of the Hepatic Portal Vein, a branch of the Hepatic Artery, and an interlobular Bile Duct.",
                  frequentlyAskedIn: "SMFB Histology OSPE & Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Describe the gross anatomy of the liver and the microscopic structure of a hepatic lobule. (Marks: 10)",
                  modelAnswer: "Lobar anatomy, peritoneal reflections, portal circulation, hepatocytes, sinusoids, Kupffer cells, and bile canaliculi.",
                  marks: 10
                }
              ]
            },
            {
              id: "anat-les-7",
              title: "Lesson 7: Renal Macroscopic Anatomy, Nephron Architecture & Urinary Tract",
              duration: "35 min",
              notes: [
                "Kidney: Outer cortex and inner medulla (8-18 renal pyramids). Renal hilum transmits renal vein, renal artery, and renal pelvis.",
                "Nephron (functional unit, ~1-1.2 million per kidney): Renal corpuscle (Glomerulus + Bowman's capsule), Proximal Convoluted Tubule (PCT with dense brush border), Loop of Henle, Distal Convoluted Tubule (DCT), Collecting duct.",
                "Juxtaglomerular Apparatus (JGA): Macula densa in DCT, Juxtaglomerular (JG) cells in afferent arteriole, and extraglomerular mesangial cells."
              ],
              benchAlert: "PCT epithelial cells have abundant microvilli (brush border) which stain intensely with PAS due to glycocalyx.",
              quizzes: [
                {
                  question: "Where is the Macula Densa located in the nephron?",
                  options: ["Proximal convoluted tubule", "Thick ascending limb / Distal convoluted tubule", "Bowman's capsule", "Loop of Henle descending limb"],
                  correctIndex: 1,
                  explanation: "The macula densa is a specialized group of closely packed epithelial cells in the terminal thick ascending limb / early DCT abutting the afferent arteriole."
                }
              ],
              vivaQAs: [
                {
                  question: "Differentiate between cortical and juxtamedullary nephrons.",
                  answer: "Cortical nephrons (85%) have glomeruli in outer cortex and short loops of Henle. Juxtamedullary nephrons (15%) have glomeruli near corticomedullary junction, long loops reaching deep medulla, and vasa recta for urine concentration.",
                  frequentlyAskedIn: "SMFB Anatomy & Physiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Describe the microscopic anatomy of a nephron with a detailed labeled diagram. (Marks: 10)",
                  modelAnswer: "Detailed diagram of Malpighian corpuscle, filtration barrier, PCT, Henle loop, DCT, and collecting duct.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "anat-mod-5",
      unitNumber: 5,
      title: "Topic 5: Nervous, Endocrine & Lymphatic Systems Anatomy",
      description: "Brain, spinal cord, meninges, cranial nerves, peripheral nerves, autonomic nervous system, sense organs, major endocrine glands, and lymphatic organs.",
      learningOutcomes: [
        "Describe the gross anatomy of the cerebrum, cerebellum, brainstem, and ventricular system.",
        "List the 12 pairs of cranial nerves and describe CSF circulation.",
        "Explain the anatomy of the pituitary, thyroid, adrenal glands, spleen, and lymph nodes."
      ],
      subModules: [
        {
          id: "anat-sub-5-1",
          title: "Sub-Module 5.1: Central Nervous System, Endocrine Glands & Lymphoid Organs",
          lessons: [
            {
              id: "anat-les-8",
              title: "Lesson 8: Brain, Ventricles, Meninges & CSF Pathway Anatomy",
              duration: "30 min",
              notes: [
                "Brain: Forebrain (Cerebrum & Diencephalon), Midbrain, Hindbrain (Pons, Medulla oblongata, Cerebellum).",
                "Meninges: Dura mater, Arachnoid mater, Pia mater. Subarachnoid space contains Cerebrospinal Fluid (CSF).",
                "CSF pathway: Choroid plexus of lateral ventricles -> Foramen of Monro -> Third ventricle -> Aqueduct of Sylvius -> Fourth ventricle -> Foramina of Luschka & Magendie -> Subarachnoid space -> Arachnoid villi/granulations into superior sagittal sinus."
              ],
              benchAlert: "In lumbar puncture (LP), the needle enters the subarachnoid space at L3-L4 or L4-L5 intervertebral space below the termination of the conus medullaris (L1-L2).",
              quizzes: [
                {
                  question: "At what vertebral level does the adult spinal cord terminate?",
                  options: ["C7-T1", "T12-L1", "Lower border of L1 or upper border of L2", "L4-L5"],
                  correctIndex: 2,
                  explanation: "The adult spinal cord ends as the conus medullaris at the lower border of L1 (or upper L2)."
                }
              ],
              vivaQAs: [
                {
                  question: "Trace the flow of Cerebrospinal Fluid (CSF) from formation to absorption.",
                  answer: "Produced by choroid plexuses -> Lateral ventricles -> Foramen of Monro -> 3rd ventricle -> Aqueduct -> 4th ventricle -> Foramina of Luschka/Magendie -> Subarachnoid space -> Arachnoid granulations into dural venous sinuses.",
                  frequentlyAskedIn: "SMFB Board Anatomy Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Trace the formation, circulation, and drainage of CSF. Mention the anatomical landmarks for lumbar puncture. (Marks: 10)",
                  modelAnswer: "Step-by-step pathway of CSF flow and anatomical relationship of supracristal plane (L4 level) for safe lumbar puncture.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "PHYS-103": [
    {
      id: "phys-mod-1",
      unitNumber: 1,
      title: "Topic 1: Introductory Physiology & Cellular Homeostasis",
      description: "Physiological terminologies, organization of fluid compartments, cell physiology, membrane transport mechanisms, and negative and positive feedback homeostatic control.",
      learningOutcomes: [
        "Explain physiological homeostasis and the composition of body fluid compartments.",
        "Differentiate passive diffusion, facilitated diffusion, active transport, and osmosis.",
        "State the physiological role of the Na+/K+ ATPase pump."
      ],
      subModules: [
        {
          id: "phys-sub-1-1",
          title: "Sub-Module 1.1: Body Fluid Compartments & Membrane Transport Kinetics",
          lessons: [
            {
              id: "phys-les-1",
              title: "Lesson 1: Fluid Compartments, Osmolarity & Membrane Transport",
              duration: "30 min",
              notes: [
                "Total Body Water (TBW) constitutes ~60% of body weight (42 L in a 70 kg adult).",
                "Intracellular Fluid (ICF) is ~2/3 of TBW (28 L), high in K+, Mg2+, and phosphates.",
                "Extracellular Fluid (ECF) is ~1/3 of TBW (14 L: Interstitial fluid 10.5 L, Plasma 3.5 L), high in Na+, Cl-, and HCO3-.",
                "Transport: Primary active transport (Na+/K+ pump moves 3 Na+ out, 2 K+ in against electrochemical gradients, utilizing 1 ATP)."
              ],
              benchAlert: "Hemolysis releases large amounts of intracellular potassium into serum, causing clinically invalid pseudohyperkalemia.",
              quizzes: [
                {
                  question: "What is the predominant cation in the intracellular fluid (ICF)?",
                  options: ["Sodium (Na+)", "Potassium (K+)", "Calcium (Ca2+)", "Magnesium (Mg2+)"],
                  correctIndex: 1,
                  explanation: "Potassium is the chief intracellular cation (~140-150 mmol/L) maintained by the Na+/K+ ATPase pump."
                }
              ],
              vivaQAs: [
                {
                  question: "Explain the physiological consequences of in vitro hemolysis on electrolyte estimation.",
                  answer: "Intracellular potassium is 30 times higher than in plasma. Even mild hemolysis causes massive leakage of K+ into serum, yielding falsely elevated values.",
                  frequentlyAskedIn: "SMFB Physiology & Biochemistry Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Describe the distribution and electrolyte composition of body fluid compartments. (Marks: 8)",
                  modelAnswer: "Diagram and tabular comparison of ICF vs ECF volume, osmolarity (~290 mOsm/L), and cation/anion distributions.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "phys-mod-2",
      unitNumber: 2,
      title: "Topic 2: Cardiovascular & Haematological Physiology",
      description: "Composition and functions of blood, erythropoiesis, leukocytes, platelets, hemostasis, conductive system of the heart, cardiac cycle, and arterial blood pressure regulation.",
      learningOutcomes: [
        "State the physiological functions of erythrocytes, hemoglobin, and plasma proteins.",
        "Explain the stages of erythropoiesis and nutritional factors required (Iron, B12, Folate).",
        "Describe the cardiac cycle phases and the physiological determinants of blood pressure."
      ],
      subModules: [
        {
          id: "phys-sub-2-1",
          title: "Sub-Module 2.1: Blood Physiology, Cardiac Cycle & Blood Pressure Control",
          lessons: [
            {
              id: "phys-les-2",
              title: "Lesson 2: Erythropoiesis, Plasma Proteins & Hemostasis Cascade",
              duration: "35 min",
              notes: [
                "Erythropoiesis: Pluripotent stem cell -> CFU-E -> Proerythroblast -> Basophilic -> Polychromatic -> Orthochromatic normoblast -> Reticulocyte -> Mature Erythrocyte.",
                "Regulation: Erythropoietin (EPO) secreted by renal peritubular interstitial cells in response to tissue hypoxia.",
                "Hemostasis: 1. Vasoconstriction, 2. Primary hemostasis (platelet adhesion, activation, aggregation to form platelet plug), 3. Secondary hemostasis (coagulation cascade yielding fibrin clot), 4. Fibrinolysis (plasmin degrades clot into D-Dimers)."
              ],
              benchAlert: "In prothrombin time (PT) assays, accurate blood-to-anticoagulant ratio (9:1 of blood to 3.2% trisodium citrate) is critical for valid results.",
              quizzes: [
                {
                  question: "Where is erythropoietin (EPO) predominantly synthesized?",
                  options: ["Liver hepatocytes", "Peritubular capillary interstitial cells of kidneys", "Bone marrow stroma", "Spleen red pulp"],
                  correctIndex: 1,
                  explanation: "About 85-90% of erythropoietin is produced by renal interstitial cells in response to reduced oxygen delivery."
                }
              ],
              vivaQAs: [
                {
                  question: "What are the essential functions of plasma albumin?",
                  answer: "1. Generates ~75-80% of plasma colloid osmotic (oncotic) pressure (~25 mmHg) preventing edema; 2. Transports bilirubin, fatty acids, hormones, calcium, and drugs.",
                  frequentlyAskedIn: "SMFB Board Physiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Define and describe the stages of erythropoiesis. Mention the factors necessary for red cell maturation. (Marks: 10)",
                  modelAnswer: "Cellular lineage from stem cell to reticulocyte, role of erythropoietin, vitamin B12, folic acid, and iron metabolism.",
                  marks: 10
                }
              ]
            },
            {
              id: "phys-les-3",
              title: "Lesson 3: Conductive System of Heart, Cardiac Output & Blood Pressure Regulation",
              duration: "30 min",
              notes: [
                "Conductive system: SA node (pacemaker, 60-100 bpm) -> Internodal tracts -> AV node (0.09s delay) -> Bundle of His -> Right & Left bundle branches -> Purkinje fibers.",
                "Cardiac Output (CO) = Stroke Volume (SV, ~70 ml) × Heart Rate (HR, ~72 bpm) ≈ 5.0 L/min.",
                "Blood Pressure (BP) = CO × Total Peripheral Resistance (TPR). Short-term regulation: Arterial baroreceptor reflex (carotid sinus & aortic arch). Long-term regulation: Renin-Angiotensin-Aldosterone System (RAAS)."
              ],
              quizzes: [
                {
                  question: "Why does the AV node exhibit an intrinsic physiological conduction delay?",
                  options: [
                    "To allow complete ventricular contraction before atrial filling",
                    "To allow atria to finish contracting and emptying blood into ventricles before ventricular systole begins",
                    "To generate pacemaker impulses faster than the SA node",
                    "To prevent coronary blood flow"
                  ],
                  correctIndex: 1,
                  explanation: "The 0.09-0.12 second AV nodal delay ensures complete atrial emptying and ventricular filling prior to ventricular contraction."
                }
              ],
              vivaQAs: [
                {
                  question: "What is the normal resting blood pressure and how is mean arterial pressure (MAP) calculated?",
                  answer: "Normal BP: 120/80 mmHg. MAP = Diastolic BP + 1/3 (Pulse Pressure) = 80 + 1/3(40) ≈ 93 mmHg.",
                  frequentlyAskedIn: "SMFB Physiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Describe the conductive system of the human heart and explain how arterial blood pressure is regulated. (Marks: 10)",
                  modelAnswer: "Pathway of electrical impulses from SA node to Purkinje fibers and baroreceptor / RAAS regulatory mechanisms.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "phys-mod-3",
      unitNumber: 3,
      title: "Topic 3: Respiratory, Digestive & Renal Physiology",
      description: "Pulmonary ventilation mechanics, lung volumes, gas exchange, digestive enzyme actions, liver/bile functions, glomerular filtration, tubular reabsorption, and urine concentration.",
      learningOutcomes: [
        "Define spirometric lung volumes (Tidal volume, Vital capacity, FEV1).",
        "Describe carbohydrate, protein, and lipid digestion and absorption.",
        "Explain the countercurrent mechanism in renal medullary concentration of urine."
      ],
      subModules: [
        {
          id: "phys-sub-3-1",
          title: "Sub-Module 3.1: Respiration, Digestion & Glomerular Filtration Mechanics",
          lessons: [
            {
              id: "phys-les-4",
              title: "Lesson 4: Glomerular Filtration Rate (GFR), Tubular Reabsorption & Urinalysis Physiology",
              duration: "35 min",
              notes: [
                "Glomerular Filtration Rate (GFR): Volume of fluid filtered by glomeruli per minute (~125 ml/min or 180 L/day).",
                "Glomerular filtration barrier: Fenestrated endothelium, glomerular basement membrane (rich in negatively charged heparan sulfate), and podocyte slit diaphragms.",
                "PCT reabsorption: Reabsorbs 100% of filtered glucose and amino acids (via Na+-glucose cotransporters SGLT2/1), 65% of Na+, Cl-, and water.",
                "Renal threshold for glucose: Blood glucose level (~180 mg/dL or 10 mmol/L) above which glucosuria occurs."
              ],
              benchAlert: "In dipstick urinalysis, glucose appears positive only when plasma glucose exceeds the renal threshold (~180 mg/dL).",
              quizzes: [
                {
                  question: "What is the normal Glomerular Filtration Rate (GFR) in a healthy young adult?",
                  options: ["50 ml/min", "75 ml/min", "125 ml/min", "250 ml/min"],
                  correctIndex: 2,
                  explanation: "Normal GFR is ~125 ml/min in males and ~110 ml/min in females (approx 180 L/day)."
                }
              ],
              vivaQAs: [
                {
                  question: "Explain the concept of 'Renal Threshold for Glucose'.",
                  answer: "It is the plasma concentration of glucose (~180 mg/dL) at which tubular transport maximum (TmG) is exceeded, leading to glucose appearing in urine.",
                  frequentlyAskedIn: "SMFB Physiology Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Define GFR. Describe the factors governing Glomerular Filtration Rate and how urine is formed. (Marks: 10)",
                  modelAnswer: "Starling forces (glomerular hydrostatic pressure, capsular hydrostatic, and oncotic pressures) and filtration fraction.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "COMM-104": [
    {
      id: "comm-mod-1",
      unitNumber: 1,
      title: "Topic 1: Community Medicine, Health Promotion & Primary Health Care (PHC)",
      description: "Concepts of health, spectrum and determinants, Alma-Ata declaration, 8 essential elements of PHC, principles, Bangladesh healthcare delivery tiers, and health organizations (WHO, UNICEF, ICDDR,B).",
      learningOutcomes: [
        "Define health according to WHO and explain physical, mental, social, and spiritual dimensions.",
        "List the 8 essential elements and 4 operational principles of Primary Health Care.",
        "Describe the administrative hierarchy of Bangladesh health services from community clinics to tertiary institutes."
      ],
      subModules: [
        {
          id: "comm-sub-1-1",
          title: "Sub-Module 1.1: Health Concepts, PHC Principles & Bangladesh Health Structure",
          lessons: [
            {
              id: "comm-les-1",
              title: "Lesson 1: Health Dimensions, Determinants & Primary Health Care Architecture",
              duration: "30 min",
              notes: [
                "WHO Definition of Health: 'A state of complete physical, mental and social well-being and not merely the absence of disease or infirmity.'",
                "Four Core Principles of PHC: 1. Equitable distribution, 2. Community participation, 3. Inter-sectoral coordination, 4. Appropriate technology.",
                "8 Essential Elements of PHC (ELEMENTS): Education, Locally endemic disease control, Expanded Programme on Immunization (EPI), Maternal and child health, Essential drugs, Nutrition and food supply, Treatment of common ailments, Sanitation and safe water.",
                "Bangladesh Health Tiers: Community Clinic (6000 population) -> Union Health & Family Welfare Centre (UHFWC) -> Upazila Health Complex (UHC/THC, 50-bed secondary base) -> District Sadar Hospital (100-250 beds) -> Medical College Hospitals & Specialized Institutes (Tertiary)."
              ],
              benchAlert: "Medical technologists at Upazila Health Complex (THC) manage the primary diagnostic laboratory hub serving rural community referrals.",
              quizzes: [
                {
                  question: "Which of the following is NOT one of the 4 core principles of Primary Health Care (PHC)?",
                  options: ["Equitable distribution", "Community participation", "Hospital-centric high-cost technology", "Inter-sectoral coordination"],
                  correctIndex: 2,
                  explanation: "PHC emphasizes 'Appropriate technology' that is scientifically sound, adaptable, and affordable, not high-cost hospital-centric tech."
                }
              ],
              vivaQAs: [
                {
                  question: "Name the 8 essential components of Primary Health Care declared at Alma-Ata.",
                  answer: "E-Education on health, L-Locally endemic disease control, E-EPI immunization, M-Maternal & child health/family planning, E-Essential drugs supply, N-Nutrition & food, T-Treatment of minor ailments, S-Safe water & sanitation.",
                  frequentlyAskedIn: "SMFB Community Medicine Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Define Primary Health Care. State the principles and elements of PHC with reference to Bangladesh. (Marks: 10)",
                  modelAnswer: "Alma-Ata declaration definition, 4 principles, 8 elements, and role of Community Clinics and UHCs.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "comm-mod-2",
      unitNumber: 2,
      title: "Topic 2: Basic Epidemiology & Biostatistics in Healthcare",
      description: "Epidemiological triad, incubation period, epidemic, endemic, pandemic, zoonosis, notification, disease surveillance, data collection methods, and morbidity/mortality statistics.",
      learningOutcomes: [
        "Define epidemiological terms: Epidemic, Endemic, Pandemic, Sporadic, Zoonotic.",
        "Construct and analyze the Epidemiological Triad (Agent, Host, Environment).",
        "Calculate elementary health statistics: Crude Death Rate, Infant Mortality Rate (IMR), Maternal Mortality Ratio (MMR)."
      ],
      subModules: [
        {
          id: "comm-sub-2-1",
          title: "Sub-Module 2.1: Disease Dynamics, Epidemiological Triad & Vital Statistics",
          lessons: [
            {
              id: "comm-les-2",
              title: "Lesson 2: Epidemiological Triad, Outbreak Investigation & Vital Statistics",
              duration: "35 min",
              notes: [
                "Epidemiological Triad: Disease occurs from the interaction of an Agent (biological, chemical, physical), Host factors (age, genetic, immunity, nutrition), and Environmental reservoirs.",
                "Disease occurrences: Endemic (constant presence in a geographic area, e.g. malaria in hilly tracts), Epidemic (unusual occurrence in excess of normal expectancy), Pandemic (epidemic affecting multiple continents, e.g. COVID-19).",
                "Vital statistics formulae: Infant Mortality Rate (IMR) = (Deaths of children < 1 year / Total live births in that year) × 1000. Maternal Mortality Ratio (MMR) = (Maternal deaths from puerperal causes / Total live births) × 100,000."
              ],
              benchAlert: "In outbreak surveillance (e.g. Cholera, Dengue, Nipah), technologists must notify public health authorities immediately upon identifying index laboratory cases.",
              quizzes: [
                {
                  question: "A disease that is constantly present in a given geographical population at baseline level is termed:",
                  options: ["Epidemic", "Endemic", "Pandemic", "Sporadic"],
                  correctIndex: 1,
                  explanation: "An endemic disease maintains a continuous, predictable baseline incidence in a population."
                }
              ],
              vivaQAs: [
                {
                  question: "Define the term 'Incubation Period' and state its clinical importance.",
                  answer: "The time interval between invasion by an infectious agent and the appearance of the first sign or symptom of the disease. Used for quarantine duration and identifying infection source.",
                  frequentlyAskedIn: "SMFB Community Medicine Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Define Epidemiology. Describe the Epidemiological Triad with a suitable infectious disease example. (Marks: 10)",
                  modelAnswer: "Definition of epidemiology, diagram of Agent-Host-Environment balance, and application to Cholera or Tuberculosis.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "comm-mod-3",
      unitNumber: 3,
      title: "Topic 3: Demography, Family Planning & Maternal-Child Health (MCH)",
      description: "Demographic cycle stages, census methodology, contraceptive methods (hormonal, barrier, IUD, permanent), antenatal care (ANC), intranatal and postnatal care (PNC), and Expanded Programme on Immunization (EPI).",
      learningOutcomes: [
        "Explain demographic cycle stages and population dynamics in Bangladesh.",
        "Classify family planning methods, indications, and side effects.",
        "List the EPI vaccines, target diseases, schedules, and cold chain maintenance."
      ],
      subModules: [
        {
          id: "comm-sub-3-1",
          title: "Sub-Module 3.1: Contraceptive Technologies, MCH Care & EPI Cold Chain",
          lessons: [
            {
              id: "comm-les-3",
              title: "Lesson 3: Contraception, ANC Protocol & EPI Immunization Schedule",
              duration: "35 min",
              notes: [
                "Contraceptive methods: Temporary (Barrier: condoms; Hormonal: OCPs, injectable DMPA; Intrauterine Devices: Copper-T 380A; Implants: Norplant/Jadelle) and Permanent (Vasectomy, Tubectomy).",
                "Antenatal Care (ANC): Minimum 4 visits recommended by WHO/DGHS (Visit 1: <16 wks, Visit 2: 24-28 wks, Visit 3: 32 wks, Visit 4: 36 wks). Essential lab tests: Hb%, Blood grouping & Rh typing, Urine routine for albumin and sugar, VDRL, HBsAg, Blood glucose.",
                "EPI Schedule Bangladesh: Protects against 10 diseases: Tuberculosis (BCG at birth), Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib (Pentavalent at 6, 10, 14 wks), Polio (bOPV & fIPV), Pneumococcal disease (PCV), Measles & Rubella (MR at 9 & 15 months)."
              ],
              benchAlert: "Maintain EPI vaccine cold chain between +2°C to +8°C in Ice-Lined Refrigerators (ILR); never freeze OPV or Pentavalent vaccines.",
              quizzes: [
                {
                  question: "At what temperature range must the vaccine cold chain be maintained in an Ice-Lined Refrigerator (ILR)?",
                  options: ["-20°C to -10°C", "+2°C to +8°C", "+10°C to +15°C", "Room temperature"],
                  correctIndex: 1,
                  explanation: "The standard cold chain storage temperature for routine EPI vaccines is strictly between +2°C and +8°C."
                }
              ],
              vivaQAs: [
                {
                  question: "What laboratory screening tests are mandatory during an antenatal visit?",
                  answer: "Hemoglobin (Hb%), ABO & Rh blood grouping, urine albumin and sugar, screening for Syphilis (VDRL), Hepatitis B (HBsAg), and blood glucose.",
                  frequentlyAskedIn: "SMFB Board Community Medicine Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Describe the Expanded Programme on Immunization (EPI) schedule of Bangladesh. How is the cold chain maintained? (Marks: 10)",
                  modelAnswer: "Detailed table of vaccines, ages, doses, route of administration, and cold chain equipment (ILR, deep freezer, vaccine carriers).",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "comm-mod-4",
      unitNumber: 4,
      title: "Topic 4: Environmental Sanitation, Water Purification & First Aid",
      description: "Water sources, waterborne diseases, large and small scale water purification, air and noise pollution, solid waste disposal methods, sanitary latrines, and first aid for medical emergencies.",
      learningOutcomes: [
        "Describe water purification methods: coagulation, rapid sand filtration, and chlorination.",
        "Explain sanitary disposal of solid waste (sanitary landfill, incineration) and human excreta.",
        "Demonstrate first aid principles for hemorrhage, burns, shock, fractures, and snake bites."
      ],
      subModules: [
        {
          id: "comm-sub-4-1",
          title: "Sub-Module 4.1: Water Purification, Sanitary Waste Engineering & First Aid",
          lessons: [
            {
              id: "comm-les-4",
              title: "Lesson 4: Water Treatment, Solid Waste Disposal & Emergency First Aid",
              duration: "35 min",
              notes: [
                "Water Purification: Large-scale (Storage -> Coagulation with alum -> Rapid Sand Filtration -> Chlorination to maintain 0.5 mg/L free residual chlorine after 1 hour contact). Small-scale (Boiling 20 min, chlorine tablets/Halazone, bleaching powder).",
                "Waste Disposal: Controlled tipping/sanitary landfill, composting, and high-temperature incineration for biohazard hospital waste.",
                "First Aid for Hemorrhage: Direct pressure over wound with sterile dressing, elevation of limb, and tourniquet application only as a last resort.",
                "First Aid for Snake Bite: Keep victim calm, immobilize bitten limb with splint, do NOT incise or suck wound, transport immediately to hospital for Anti-Snake Venom (ASV)."
              ],
              benchAlert: "In laboratory acid burns, flush immediately with copious running tap water for at least 15 minutes before applying neutralizers.",
              quizzes: [
                {
                  question: "What is the recommended free residual chlorine concentration in drinking water after 1 hour of contact time?",
                  options: ["0.05 mg/L", "0.5 mg/L", "5.0 mg/L", "10 mg/L"],
                  correctIndex: 1,
                  explanation: "A free residual chlorine level of ~0.5 mg/L provides a safety margin against post-filtration microbial contamination."
                }
              ],
              vivaQAs: [
                {
                  question: "What immediate action should be taken for a chemical splash into the eyes in the laboratory?",
                  answer: "Immediately irrigate eyes at the eye-wash station with continuous water for 15-20 minutes holding eyelids open, then seek emergency medical care.",
                  frequentlyAskedIn: "SMFB Community Medicine & Lab Safety Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Describe the steps of large-scale water purification. What is the role of chlorination? (Marks: 10)",
                  modelAnswer: "Storage/sedimentation, coagulation, rapid sand filtration, and chlorination mechanism (hypochlorous acid formation).",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "COMP-105": [
    {
      id: "comp-mod-1",
      unitNumber: 1,
      title: "Topic 1: Computer Hardware Architecture & Operating Systems (DOS/Windows)",
      description: "Computer hardware components, CPU, memory (RAM, ROM, PROM), input/output peripherals, storage devices, system bus, DOS commands, and Windows navigation.",
      learningOutcomes: [
        "Explain the von Neumann computer architecture and block diagram.",
        "Distinguish between system software, operating systems, and application software.",
        "Execute fundamental DOS and Windows file management commands."
      ],
      subModules: [
        {
          id: "comp-sub-1-1",
          title: "Sub-Module 1.1: Hardware Peripherals, Memory Hierarchy & OS Fundamentals",
          lessons: [
            {
              id: "comp-les-1",
              title: "Lesson 1: Computer Organization, Processing Units & Peripherals",
              duration: "25 min",
              notes: [
                "Computer Block Diagram: Input Unit -> Central Processing Unit (ALU + Control Unit + Registers) <-> Memory Unit (Primary: RAM, ROM; Secondary: Hard Drive, SSD) -> Output Unit.",
                "Primary vs. Secondary Memory: RAM is volatile read/write memory; ROM is non-volatile holding firmware BIOS; SSD/HDD provide permanent non-volatile storage.",
                "Peripherals in Hospital Laboratories: Barcode scanners for sample tubes, thermal label printers, automated analyzer serial RS-232/Ethernet interfaces."
              ],
              benchAlert: "Connect automated clinical chemistry analyzers and computers to an Online Uninterruptible Power Supply (UPS) with voltage stabilizer to prevent data corruption during power outages.",
              quizzes: [
                {
                  question: "Which component of the Central Processing Unit (CPU) performs arithmetic calculations and logical comparisons?",
                  options: ["Control Unit (CU)", "Arithmetic Logic Unit (ALU)", "Memory Data Register", "BIOS chip"],
                  correctIndex: 1,
                  explanation: "The Arithmetic Logic Unit (ALU) performs all arithmetic (+, -, *, /) and logical comparisons (<, >, =)."
                }
              ],
              vivaQAs: [
                {
                  question: "Differentiate between RAM and ROM.",
                  answer: "RAM is volatile primary memory used by the operating system and running programs. ROM is non-volatile read-only memory holding permanent bootstrap instructions (BIOS).",
                  frequentlyAskedIn: "SMFB Computer Science Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Draw and explain the block diagram of a computer system. Mention the functions of CPU, RAM, and ROM. (Marks: 8)",
                  modelAnswer: "Block diagram with Input, CPU (ALU, CU, Registers), Memory, and Output units with functional descriptions.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "comp-mod-2",
      unitNumber: 2,
      title: "Topic 2: Word Processing & Technical Document Production (MS Word)",
      description: "MS Word interface, file management, document formatting, fonts, tables, borders, headers, footers, mail merge, macros, and hospital report template design.",
      learningOutcomes: [
        "Create and format clinical laboratory report templates in MS Word.",
        "Construct multi-column diagnostic tables with custom borders and cell shading.",
        "Utilize find, replace, spell check, and mail merge for bulk notification issuance."
      ],
      subModules: [
        {
          id: "comp-sub-2-1",
          title: "Sub-Module 2.1: Formatting, Tabulation & Clinical Template Authoring",
          lessons: [
            {
              id: "comp-les-2",
              title: "Lesson 2: Authoring Standard Diagnostic Pathology Reports in MS Word",
              duration: "30 min",
              notes: [
                "Document Structure: Header (Hospital logo, laboratory accreditation, contact), Patient demographic table (Name, Age, Sex, Ref By, Date, Sample ID), Test results table (Test Name, Observed Value, Unit, Reference Interval), and Footer (Signatures of Medical Technologist & Pathologist).",
                "Table design: Merging and splitting cells, custom border formatting, cell padding, and alignment.",
                "Shortcuts: Ctrl+S (Save), Ctrl+P (Print), Ctrl+Z (Undo), Ctrl+F (Find), Ctrl+H (Replace)."
              ],
              quizzes: [
                {
                  question: "Which feature in MS Word is utilized to send customized bulk letters or certificates to multiple recipients simultaneously?",
                  options: ["Macros", "Mail Merge", "Track Changes", "AutoText"],
                  correctIndex: 1,
                  explanation: "Mail Merge combines a master document with a data source (e.g. Excel spreadsheet) to generate personalized documents in batch."
                }
              ],
              vivaQAs: [
                {
                  question: "What essential sections must be included in a clinical laboratory report template in MS Word?",
                  answer: "1. Laboratory header/banner, 2. Patient demographics & specimen tracking data, 3. Results table with reference ranges, 4. Interpretive remarks, 5. Verification signatures.",
                  frequentlyAskedIn: "SMFB Computer Practical Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Explain the procedure of creating a table in MS Word and formatting cells for a complete blood count report. (Marks: 8)",
                  modelAnswer: "Insert table dialog, column selection (Parameter, Value, Unit, Normal Range), header shading, and alignment.",
                  marks: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "comp-mod-3",
      unitNumber: 3,
      title: "Topic 3: Spreadsheet Applications & Statistical Quality Control (MS Excel)",
      description: "Worksheet navigation, data entry, mathematical formulas, statistical functions (SUM, AVERAGE, STDEV), chart generation, Levey-Jennings QC plotting, sorting, and filtering.",
      learningOutcomes: [
        "Enter and manipulate quantitative laboratory test data in MS Excel.",
        "Apply formulas for Mean, Standard Deviation (SD), and Coefficient of Variation (CV%).",
        "Construct Levey-Jennings quality control charts and scatter plots for method validation."
      ],
      subModules: [
        {
          id: "comp-sub-3-1",
          title: "Sub-Module 3.1: Excel Formulas, Statistical Functions & Quality Control Charts",
          lessons: [
            {
              id: "comp-les-3",
              title: "Lesson 3: Statistical Functions (Mean, SD, CV%) & Levey-Jennings Charts",
              duration: "35 min",
              notes: [
                "Formulas in Excel always begin with an equal sign (=). E.g. =SUM(B2:B31), =AVERAGE(B2:B31).",
                "Standard Deviation formula: =STDEV.S(B2:B31). Coefficient of Variation: =(STDEV/AVERAGE)*100.",
                "Quality Control Chart: Plotting daily control runs against Mean, ±1 SD, ±2 SD (warning limit), and ±3 SD (action/rejection limit) to detect analytical shift or trend."
              ],
              benchAlert: "In laboratory quality assurance, a Coefficient of Variation (CV%) under 5% indicates high analytical precision.",
              quizzes: [
                {
                  question: "What is the correct Excel formula to calculate the arithmetic mean of values in cells C2 through C21?",
                  options: ["=MEAN(C2:C21)", "=AVERAGE(C2:C21)", "=SUM(C2:C21)/20", "=TOTAL(C2:C21)"],
                  correctIndex: 1,
                  explanation: "The standard Excel function for calculating arithmetic mean is =AVERAGE(range)."
                }
              ],
              vivaQAs: [
                {
                  question: "How do you plot a Levey-Jennings Quality Control chart in MS Excel?",
                  answer: "Calculate Mean and SD from 20 control runs, create reference lines for Mean, ±1 SD, ±2 SD, ±3 SD, and insert a line chart plotting daily observed values.",
                  frequentlyAskedIn: "SMFB Computer & QC Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2024",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "Describe the steps in MS Excel to calculate Mean, Standard Deviation, and plot a line chart for 30 daily quality control results. (Marks: 10)",
                  modelAnswer: "Data input in columns, formula syntax =AVERAGE() and =STDEV(), and line chart insertion with target control limits.",
                  marks: 10
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "comp-mod-4",
      unitNumber: 4,
      title: "Topic 4: Presentations, Networking & Laboratory Information Systems (LIS)",
      description: "MS PowerPoint slide design, animations, slide projection, local area networks (LAN), TCP/IP protocols, internet search, email, and Laboratory Information Systems (LIS).",
      learningOutcomes: [
        "Design clear scientific presentation slides in MS PowerPoint.",
        "Explain LAN, WAN, and client-server network architecture in hospital laboratories.",
        "Describe bidirectional LIS interfacing between automated analyzers and medical databases."
      ],
      subModules: [
        {
          id: "comp-sub-4-1",
          title: "Sub-Module 4.1: Scientific Presentation Design & Hospital LIS Integration",
          lessons: [
            {
              id: "comp-les-4",
              title: "Lesson 4: PowerPoint Design, Networking & LIS Interfacing Architecture",
              duration: "30 min",
              notes: [
                "Slide Design: 6x6 rule (no more than 6 bullet points per slide, 6 words per line), high contrast text against background, embedded high-resolution microscopy images.",
                "Networking: Local Area Network (LAN) connects hospital wards, phlebotomy, and analyzers; Wide Area Network (WAN) enables national disease reporting.",
                "Laboratory Information System (LIS): Software managing test orders, sample tracking, bidirectional analyzer communication, result validation, and electronic medical record (EMR) archival."
              ],
              benchAlert: "Bidirectional LIS interfacing eliminates manual transcription errors by transferring test results directly from analyzer photometers to the electronic patient chart.",
              quizzes: [
                {
                  question: "What is the primary operational advantage of a bidirectional Laboratory Information System (LIS)?",
                  options: [
                    "Decreases the electrical consumption of analyzers",
                    "Transfers test orders and downloads verified patient results automatically, eliminating manual transcription errors",
                    "Eliminates the need for chemical reagents",
                    "Allows computers to run without an operating system"
                  ],
                  correctIndex: 1,
                  explanation: "Bidirectional interfacing automates barcode order reading and result transmission directly into database records."
                }
              ],
              vivaQAs: [
                {
                  question: "What is a Laboratory Information System (LIS) and why is it vital in modern pathology?",
                  answer: "LIS is a computer software system managing patient registration, specimen barcodes, automated instrument interfacing, delta checks, and electronic report delivery.",
                  frequentlyAskedIn: "SMFB Computer Science Viva"
                }
              ],
              previousQuestions: [
                {
                  year: "2023",
                  exam: "SMFB 1st Year Annual Examination",
                  questionText: "What is LIS? Describe the role of computer networking and database management in a diagnostic hospital laboratory. (Marks: 8)",
                  modelAnswer: "Definition of LIS, LAN architecture, bidirectional instrument interfacing, and digital archival.",
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
