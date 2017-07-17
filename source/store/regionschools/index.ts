import { IRegions, IRegion, IRegionM, RegionSchool } from './regionschools.types';
import { regionSchoolsReducer } from './regionschools.reducer';
import { deimmutifyRegionSchools } from './regionschools.transformers';

export {
  IRegion,
  IRegionM,
  IRegions,
  RegionSchool,
  regionSchoolsReducer,
  deimmutifyRegionSchools,
};
