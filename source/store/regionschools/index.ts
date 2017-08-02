import { IRegionRecord, IRegionRecords, IRRegion, IRRegionSchool, IRegionSchoolRecord, IRegionSchoolRecords } from "./regionschools.types";
import { regionSchoolsReducer } from "./regionschools.reducer";
import { deimmutifyRegionSchools } from "./regionschools.transformers";

export {
    IRRegion,
    IRegionRecord,
    IRegionRecords,
    IRegionSchoolRecord,
    IRegionSchoolRecords,
    IRRegionSchool,
    regionSchoolsReducer,
    deimmutifyRegionSchools,
};
