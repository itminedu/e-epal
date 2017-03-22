import { IEpalClasses, IEpalClass } from './epalclasses.types';
import { EPALCLASSES_INITIAL_STATE } from './epalclasses.initial-state';
import { Seq } from 'immutable';

import {  EPALCLASSES_SAVE} from '../../constants';

export function epalclassesReducer(state: IEpalClasses = EPALCLASSES_INITIAL_STATE, action): IEpalClasses {


  switch (action.type) {


    case EPALCLASSES_SAVE:
        let selectedEpalClasses = Array<IEpalClass>();

        selectedEpalClasses.push(<IEpalClass>{ name: action.payload.epalClasses.name});


        return Seq(selectedEpalClasses).map(n => n).toList();
    default: return state;
  }
};
