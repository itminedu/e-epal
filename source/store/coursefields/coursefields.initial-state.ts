import { List } from 'immutable';
import { ICourseField, CourseFieldRecord } from './coursefields.types';

export const INITIAL_STATE = List<ICourseField>([{id: 1, name: '-'}]);
