import { ISectorFields, ISectorField } from './sectorfields.types';
import { INITIAL_STATE } from './sectorfields.initial-state';
import { Seq } from 'immutable';

import {
  SECTORFIELDS_RECEIVED,
  SECTORFIELDS_SELECTED_SAVE
} from '../../constants';

export function sectorFieldsReducer(state: ISectorFields = INITIAL_STATE, action): ISectorFields {
  switch (action.type) {
    case SECTORFIELDS_RECEIVED:
        let newSectorFields = Array<ISectorField>();
        let i=0;
        action.payload.sectorFields.forEach(sectorField => {
            newSectorFields.push(<ISectorField>{id: sectorField.id, name: sectorField.name, selected: false});
            i++;
        });
        return Seq(newSectorFields).map(n => n).toList();
    case SECTORFIELDS_SELECTED_SAVE:
        let selectedSectorFields = Array<ISectorField>();
        let ind=0;
        state.forEach(sectorField => {
            selectedSectorFields.push(<ISectorField>{id: sectorField.id, name: sectorField.name, selected: action.payload.sectorFieldsSelected[ind]});
            ind++;
        });
        return Seq(selectedSectorFields).map(n => n).toList();
    default: return state;
  }
};
