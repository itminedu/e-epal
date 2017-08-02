import { List } from "immutable";
import { recordify } from "typed-immutable-record";

import { STUDENTDATAFIELDS_INIT, STUDENTDATAFIELDS_SAVE } from "../../constants";
import { STUDENT_DATA_FIELDS_INITIAL_STATE } from "./studentdatafields.initial-state";
import { IStudentDataField, IStudentDataFieldRecord, IStudentDataFieldRecords } from "./studentdatafields.types";

export function studentDataFieldsReducer(state: IStudentDataFieldRecords = STUDENT_DATA_FIELDS_INITIAL_STATE, action): IStudentDataFieldRecords {
    switch (action.type) {
        case STUDENTDATAFIELDS_SAVE:
            let studentDataFields = Array<IStudentDataFieldRecord>();

            action.payload.studentDataFields.forEach(studentDataField => {
                let transformedDate = "";
                if (studentDataField.studentbirthdate && studentDataField.studentbirthdate.date) {
                    transformedDate = studentDataField.studentbirthdate.date.year + "-";
                    transformedDate += studentDataField.studentbirthdate.date.month < 10 ? "0" + studentDataField.studentbirthdate.date.month + "-" : studentDataField.studentbirthdate.date.month + "-";
                    transformedDate += studentDataField.studentbirthdate.date.day < 10 ? "0" + studentDataField.studentbirthdate.date.day : studentDataField.studentbirthdate.date.day;
                }

                studentDataField.studentbirthdate = transformedDate;
                studentDataFields.push(recordify<IStudentDataField, IStudentDataFieldRecord>(studentDataField));
            });

            return List(studentDataFields);
        case STUDENTDATAFIELDS_INIT:
            return STUDENT_DATA_FIELDS_INITIAL_STATE;
        default: return state;
    }
};
