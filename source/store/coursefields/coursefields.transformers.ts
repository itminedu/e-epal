import { List, Map } from 'immutable';
import { ICourseFields, ICourseField, CourseFieldRecord } from './coursefields.types';

export function deimmutifyCourseFields(state: ICourseFields): Object[] {
  return state.toJS();
}

export function reimmutifyCourseFields(plain): ICourseFields {
  return List<ICourseField>(plain ? plain.map(CourseFieldRecord) : []);
}
