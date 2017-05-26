import { IRegions, IRegion, IRegionSchool } from './regionschools.types';
import { regionSchoolsReducer } from './regionschools.reducer';
import { deimmutifyRegionSchools } from './regionschools.transformers';

export {
  IRegion,
  IRegions,
  IRegionSchool,
  regionSchoolsReducer,
  deimmutifyRegionSchools,
};
