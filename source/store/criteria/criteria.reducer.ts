import { ICriteria, ICriter } from './criteria.types';
import { CRITERIA_INITIAL_STATE } from './criteria.initial-state';
import { Seq } from 'immutable';

import {
  CRITERIA_RECEIVED,
  CRITERIA_SAVE
} from '../../constants';

export function criteriaReducer(state: ICriter = CRITERIA_INITIAL_STATE, action): ICriter {
  switch (action.type) {
    case CRITERIA_RECEIVED:
        let newCriter = Array<ICriteria>();
        let i=0;
        action.payload.criteria.forEach(criteria => {
            newCriter.push(<ICriteria>{id: criteria.id, name: criteria.name, mutual_disabled_id: criteria.mutual_disabled_id, selected:  false});
            i++;
        });
        return Seq(newCriter).map(n => n).toList();

    case CRITERIA_SAVE:
        let criter = Array<ICriteria>();
        let ind=0;
        state.forEach(criteria => {
            criter.push(<ICriteria>{id: criteria.id, name: criteria.name, mutual_disabled_id: criteria.mutual_disabled_id, selected: action.payload.criter[0][ind]});
            ind++;
        });

        return Seq(criter).map(n => n).toList();
    default: return state;
  }
};
/*
case COURSEFIELDS_SELECTED_SAVE:
    let selectedCourseFields = Array<ICourseField>();
    let ind=0;
    state.forEach(courseField => {
        selectedCourseFields.push(<ICourseField>{id: courseField.id, name: courseField.name, selected: action.payload.courseFieldsSelected[ind]});
        ind++;
    });
    return Seq(selectedCourseFields).map(n => n).toList();
default: return state;
*/
