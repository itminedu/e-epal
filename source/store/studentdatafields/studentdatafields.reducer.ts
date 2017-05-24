import { IStudentDataFields, IStudentDataField } from './studentdatafields.types';
import { STUDENT_DATA_FIELDS_INITIAL_STATE } from './studentdatafields.initial-state';
import { Seq } from 'immutable';
import { STUDENTDATAFIELDS_SAVE, STUDENTDATAFIELDS_INIT } from '../../constants';

export function studentDataFieldsReducer(state: IStudentDataFields = STUDENT_DATA_FIELDS_INITIAL_STATE, action): IStudentDataFields {
  switch (action.type) {
    case STUDENTDATAFIELDS_SAVE:
        let studentDataFields = Array<IStudentDataField>();
        let ind=0;

        action.payload.studentDataFields.forEach(studentDataField => {
            let transformedDate = studentDataField.studentbirthdate.date.year + "-";
            transformedDate += studentDataField.studentbirthdate.date.month < 10 ? "0" + studentDataField.studentbirthdate.date.month + "-" : studentDataField.studentbirthdate.date.month + "-";
            transformedDate += studentDataField.studentbirthdate.date.day < 10 ? "0" + studentDataField.studentbirthdate.date.day : studentDataField.studentbirthdate.date.day;
            // transformedDate = studentDataField.studentbirthdate.jsDate;

            studentDataField.studentbirthdate = transformedDate;


            studentDataFields.push(<IStudentDataField>studentDataField);
            ind++;
        });

        return Seq(studentDataFields).map(n => n).toList();
    case STUDENTDATAFIELDS_INIT:
        return STUDENT_DATA_FIELDS_INITIAL_STATE;
    default: return state;
  }
};
