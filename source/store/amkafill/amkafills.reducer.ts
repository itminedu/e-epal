import { IAmkaFills, IAmkaFill } from './amkafills.types';
import { INITIAL_STATE } from './amkafills.initial-state';
import { Seq } from 'immutable';

import {  AMKAFILL_SAVE} from '../../constants';

export function amkafillReducer(state: IAmkaFills = INITIAL_STATE, action): IAmkaFills {


  switch (action.type) {


    case AMKAFILL_SAVE:
        let selectedAmkaFills = Array<IAmkaFill>();
        
        selectedAmkaFills.push(<IAmkaFill>{ name: action.payload.amkaFills.name});
      
  
        return Seq(selectedAmkaFills).map(n => n).toList();
    default: return state;
  }
};
