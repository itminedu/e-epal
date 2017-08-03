import { List } from "immutable";
import { recordify } from "typed-immutable-record";

import { EPALCLASSES_INIT, EPALCLASSES_SAVE } from "../../constants";
import { EPALCLASSES_INITIAL_STATE } from "./epalclasses.initial-state";
import { IEpalClass, IEpalClassRecord, IEpalClassRecords } from "./epalclasses.types";

export function epalclassesReducer(state: IEpalClassRecords = EPALCLASSES_INITIAL_STATE, action): IEpalClassRecords {

    switch (action.type) {
        case EPALCLASSES_SAVE:
            let newEpalClasses = Array<IEpalClassRecord>();
            newEpalClasses.push(recordify<IEpalClass, IEpalClassRecord>({ name: action.payload.epalClasses.name }));
            return List(newEpalClasses);

        case EPALCLASSES_INIT:
            return EPALCLASSES_INITIAL_STATE;
        default: return state;
    }
};
