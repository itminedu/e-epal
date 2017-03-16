import { ISectorFields, ISectorField } from './sectorfields.types';
import { SECTOR_FIELDS_INITIAL_STATE } from './sectorfields.initial-state';
import { Seq } from 'immutable';

import {
  SECTORFIELDS_RECEIVED,
  SECTORFIELDS_SELECTED_SAVE,
  SECTORFIELDS_INIT
} from '../../constants';

export function sectorFieldsReducer(state: ISectorFields = SECTOR_FIELDS_INITIAL_STATE, action): ISectorFields {
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
    case SECTORFIELDS_INIT:
        return SECTOR_FIELDS_INITIAL_STATE;
    default: return state;
  }
};
