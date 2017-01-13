import { ICourseFields, ICourseField } from './coursefields.types';
import { INITIAL_STATE } from './coursefields.initial-state';
import { Seq } from 'immutable';

import {
  COURSEFIELDS_RECEIVED,
  COURSEFIELDS_SELECTED_SAVE
} from '../../constants';

export function courseFieldsReducer(state: ICourseFields = INITIAL_STATE, action): ICourseFields {
  switch (action.type) {
    case COURSEFIELDS_RECEIVED:
        let newCourseFields = Array<ICourseField>();
        let i=0;
        action.payload.courseFields.forEach(courseField => {
            newCourseFields.push(<ICourseField>{id: courseField.id, name: courseField.name, selected: false});
            i++;
        });
        return Seq(newCourseFields).map(n => n).toList();
    case COURSEFIELDS_SELECTED_SAVE:
        let selectedCourseFields = Array<ICourseField>();
        let ind=0;
        state.forEach(courseField => {
            selectedCourseFields.push(<ICourseField>{id: courseField.id, name: courseField.name, selected: action.payload.courseFieldsSelected[ind]});
            ind++;
        });
        return Seq(selectedCourseFields).map(n => n).toList();
    default: return state;
  }
};
