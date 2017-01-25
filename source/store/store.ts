import { combineReducers } from 'redux';
import * as courseFields from './coursefields';
import * as regions from './regionschools';
import * as studentDataFields from './studentdatafields';

/*
 * This is where we 'assemble' the full store out of its modules.
 */

export interface IAppState {
    courseFields?: courseFields.ICourseFields;
    regions?: regions.IRegions;
    studentDataFields?: studentDataFields.IStudentDataFields;
};

export const rootReducer = combineReducers<IAppState>({
   courseFields: courseFields.courseFieldsReducer,
   regions: regions.regionSchoolsReducer,
   studentDataFields: studentDataFields.studentDataFieldsReducer,
});

export function deimmutify(state: IAppState): Object {
  return {
    courseFields: courseFields.deimmutifyCourseFields(state.courseFields),
    regions: regions.deimmutifyRegionSchools(state.regions),
    studentdataFields: studentDataFields.deimmutifyStudentDataFields(state.studentDataFields),
  };
}
