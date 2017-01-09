import { List, Record, fromJS } from 'immutable';
import { ICourseField, ICourseFields, CourseFieldRecord } from './coursefields.types';
import { INITIAL_STATE } from './coursefields.initial-state';

import {
  COURSEFIELDS_RECEIVED,
  COURSEFIELDS_SELECTED
} from '../../constants';

export function courseFieldsReducer(state: ICourseFields = INITIAL_STATE, action): ICourseFields {
  switch (action.type) {
    case COURSEFIELDS_RECEIVED:
        return action.payload.courseFields;
    case COURSEFIELDS_SELECTED: return action.payload.courseFields;
    default: return state;
  }
};
