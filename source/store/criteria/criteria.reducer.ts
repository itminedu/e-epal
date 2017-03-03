import { ICriteria, ICriter } from './criteria.types';
import { INITIAL_STATE } from './criteria.initial-state';
import { Seq } from 'immutable';

import {
  CRITERIA_SAVE
} from '../../constants';

export function criteriaReducer(state: ICriter = INITIAL_STATE, action): ICriter {
  switch (action.type) {
    case CRITERIA_SAVE:
        let criter = Array<ICriteria>();
        let ind=0;

        action.payload.criter.forEach(criteria => {
            criter.push(<ICriteria>criteria);
            ind++;
        });

        return Seq(criter).map(n => n).toList();
    default: return state;
  }
};
