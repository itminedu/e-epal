import { combineReducers } from 'redux';
import * as courseFields from './coursefields';

/*
 * This is where we 'assemble' the full store out of its modules.
 */

export interface IAppState {
    courseFields?: courseFields.ICourseFields;
};

export const rootReducer = combineReducers<IAppState>({
   courseFields: courseFields.courseFieldsReducer,
});

export function deimmutify(state: IAppState): Object {
  return {
    courseFields: courseFields.deimmutifyCourseFields(state.courseFields),
  };
}

/* export function reimmutify(plain): IAppState {
  return plain ? {
    courseFields: courseFields.reimmutifyCourseFields(plain.courseFields),
    courseFieldsSelected: courseFieldsSelected.reimmutifyCourseFieldsSelected(plain.courseFieldsSelected),
  } : {};
} */
