import { List } from "immutable";
import { recordify } from "typed-immutable-record";

import { SECTORFIELDS_INIT, SECTORFIELDS_RECEIVED, SECTORFIELDS_SELECTED_SAVE } from "../../constants";
import { SECTOR_FIELDS_INITIAL_STATE } from "./sectorfields.initial-state";
import { ISectorField, ISectorFieldRecord, ISectorFieldRecords } from "./sectorfields.types";

export function sectorFieldsReducer(state: ISectorFieldRecords = SECTOR_FIELDS_INITIAL_STATE, action): ISectorFieldRecords {
    switch (action.type) {
        case SECTORFIELDS_RECEIVED:
            let newSectorFields = Array<ISectorFieldRecord>();
            let i = 0;
            action.payload.sectorFields.forEach(sectorField => {
                newSectorFields.push(recordify<ISectorField, ISectorFieldRecord>({ id: sectorField.id, name: sectorField.name, selected: false }));
                i++;
            });
            return List(newSectorFields);
        case SECTORFIELDS_SELECTED_SAVE:
            return state.withMutations(function(list) {
                if (action.payload.prevChoice >= 0)
                    list.setIn([action.payload.prevChoice, "selected"], false);
                if (action.payload.newChoice >= 0)
                    list.setIn([action.payload.newChoice, "selected"], true);
            });

        case SECTORFIELDS_INIT:
            return SECTOR_FIELDS_INITIAL_STATE;
        default: return state;
    }
};
