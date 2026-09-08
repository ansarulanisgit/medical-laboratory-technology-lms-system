// Official State Medical Faculty of Bangladesh (SMFB) Diploma in Medical Laboratory Technology (DMLT)
// Aggregated 4-Year Curriculum Registry: Years 1-4

import { DIPLOMA_YEAR1_STUDY_DATA } from "./year1";
import { DIPLOMA_YEAR2_STUDY_DATA } from "./year2";
import { DIPLOMA_YEAR3_STUDY_DATA } from "./year3";
import { DIPLOMA_YEAR4_STUDY_DATA } from "./year4";
import type { StudyModuleItem } from "../diploma-curriculum-data";

export const DIPLOMA_ALL_STUDY_DATA: Record<string, StudyModuleItem[]> = {
  ...DIPLOMA_YEAR1_STUDY_DATA,
  ...DIPLOMA_YEAR2_STUDY_DATA,
  ...DIPLOMA_YEAR3_STUDY_DATA,
  ...DIPLOMA_YEAR4_STUDY_DATA,
};

export {
  DIPLOMA_YEAR1_STUDY_DATA,
  DIPLOMA_YEAR2_STUDY_DATA,
  DIPLOMA_YEAR3_STUDY_DATA,
  DIPLOMA_YEAR4_STUDY_DATA,
};
