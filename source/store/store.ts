import { combineReducers } from 'redux';
import * as courseFields from './coursefields';
import * as studentdataFields from './studentdatafields';

/*
 * This is where we 'assemble' the full store out of its modules.
 */

export interface IAppState {
    courseFields?: courseFields.ICourseFields;
    studentdataFields?: studentdataFields.IStudentDataFields;
};

export const rootReducer = combineReducers<IAppState>({
   courseFields: courseFields.courseFieldsReducer,
   studentdataFields: studentdataFields.studentdataFieldsReducer,
});

export function deimmutify(state: IAppState): Object {
  return {
    courseFields: courseFields.deimmutifyCourseFields(state.courseFields),
    studentdataFields: studentdataFields.deimmutifyStudentDataFields(state.studentdataFields),
  };
}

/* export function reimmutify(plain): IAppState {
  return plain ? {
    courseFields: courseFields.reimmutifyCourseFields(plain.courseFields),
    courseFieldsSelected: courseFieldsSelected.reimmutifyCourseFieldsSelected(plain.courseFieldsSelected),
  } : {};
} */
