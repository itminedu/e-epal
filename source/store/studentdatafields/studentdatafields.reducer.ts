import { IStudentDataFields, IStudentDataField } from './studentdatafields.types';
import { STUDENT_DATA_FIELDS_INITIAL_STATE } from './studentdatafields.initial-state';
import { Seq } from 'immutable';

import {
  STUDENTDATAFIELDS_RECEIVED,
  STUDENTDATAFIELDS_SAVE
} from '../../constants';

export function studentDataFieldsReducer(state: IStudentDataFields = STUDENT_DATA_FIELDS_INITIAL_STATE, action): IStudentDataFields {
  switch (action.type) {
    case STUDENTDATAFIELDS_SAVE:
        let studentDataFields = Array<IStudentDataField>();
        let ind=0;

        action.payload.studentDataFields.forEach(studentDataField => {
            studentDataFields.push(<IStudentDataField>studentDataField);
            ind++;
        });

        return Seq(studentDataFields).map(n => n).toList();
    default: return state;
  }
};
