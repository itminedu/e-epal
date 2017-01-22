import { combineReducers } from 'redux';
import * as courseFields from './coursefields';
import * as studentDataFields from './studentdatafields';

/*
 * This is where we 'assemble' the full store out of its modules.
 */

export interface IAppState {
    courseFields?: courseFields.ICourseFields;
    studentDataFields?: studentDataFields.IStudentDataFields;
};

export const rootReducer = combineReducers<IAppState>({
   courseFields: courseFields.courseFieldsReducer,
   studentDataFields: studentDataFields.studentDataFieldsReducer,
});

export function deimmutify(state: IAppState): Object {
  return {
    courseFields: courseFields.deimmutifyCourseFields(state.courseFields),
    studentdataFields: studentDataFields.deimmutifyStudentDataFields(state.studentDataFields),
  };
}

/* export function reimmutify(plain): IAppState {
  return plain ? {
    courseFields: courseFields.reimmutifyCourseFields(plain.courseFields),
    courseFieldsSelected: courseFieldsSelected.reimmutifyCourseFieldsSelected(plain.courseFieldsSelected),
  } : {};
} */
