import { combineReducers } from 'redux';
import * as courseFields from './coursefields';
import * as sectorFields from './sectorfields';
import * as regions from './regionschools';
import * as sectors from './sectorcourses';
import * as studentDataFields from './studentdatafields';
import * as epalclasses from './epalclasses';
import * as loginInfo from './logininfo';
import * as criter from './criteria';

/*
 * This is where we 'assemble' the full store out of its modules.
 */

export interface IAppState {
    courseFields?: courseFields.ICourseFields;
    sectorFields?: sectorFields.ISectorFields;
    regions?: regions.IRegions;
    sectors?: sectors.ISectors;
    studentDataFields?: studentDataFields.IStudentDataFields;
    epalclasses?: epalclasses.IEpalClasses;
    loginInfo?: loginInfo.ILoginInfo;
    criter?: criter.ICriter;
};

export const rootReducer = combineReducers<IAppState>({
   courseFields: courseFields.courseFieldsReducer,
   sectorFields: sectorFields.sectorFieldsReducer,
   regions: regions.regionSchoolsReducer,
   sectors: sectors.sectorCoursesReducer,
   studentDataFields: studentDataFields.studentDataFieldsReducer,
   epalclasses: epalclasses.epalclassesReducer,
   loginInfo: loginInfo.loginInfoReducer,
   criter: criter.criteriaReducer,

});

export function deimmutify(state: IAppState): Object {
  return {
    courseFields: courseFields.deimmutifyCourseFields(state.courseFields),
    sectorFields: sectorFields.deimmutifySectorFields(state.sectorFields),
    regions: regions.deimmutifyRegionSchools(state.regions),
    sectors: sectors.deimmutifySectorCourses(state.sectors),
    studentdataFields: studentDataFields.deimmutifyStudentDataFields(state.studentDataFields),
    epalclasses: epalclasses.deimmutifyEpalClasses(state.epalclasses),
    loginInfo: loginInfo.deimmutifyLoginInfo(state.loginInfo),
    criter: criter.deimmutifyCriteria(state.criter)
  };
}
