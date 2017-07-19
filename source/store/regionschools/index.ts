import { IRegionRecord, IRRegion, IRRegionSchool, IRegionSchoolRecord } from './regionschools.types';
import { regionSchoolsReducer } from './regionschools.reducer';
import { deimmutifyRegionSchools } from './regionschools.transformers';

export {
  IRRegion,
  IRegionRecord,
  IRegionSchoolRecord,
  IRRegionSchool,
  regionSchoolsReducer,
  deimmutifyRegionSchools,
};
