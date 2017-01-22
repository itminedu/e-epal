import { IStudentDataFields, IStudentDataField } from './studentdatafields.types';
import { INITIAL_STATE } from './studentdatafields.initial-state';
import { Seq } from 'immutable';

import {
  STUDENTDATAFIELDS_RECEIVED,
  STUDENTDATAFIELDS_SAVE
} from '../../constants';


export function studentDataFieldsReducer(state: IStudentDataFields = INITIAL_STATE, action): IStudentDataFields {
  switch (action.type) {
    case STUDENTDATAFIELDS_RECEIVED:
        let newStudentDataFields = Array<IStudentDataField>();
        let i=0;
        action.payload.studentdataFields.forEach(studentdataField => {
            newStudentDataFields.push(<IStudentDataField>{studentFirstname: studentdataField.studentFirstname, studentSurname: studentdataField.studentSurname,
              guardianFirstname: studentdataField.guardianFirstname, guardianSurname: studentdataField.guardianSurname,
              studentAmka: studentdataField.studentAmka,
              regionAddress: studentdataField.regionAddress, regionTK: studentdataField.regionTK, regionArea: studentdataField.regionArea,
              certificateType: studentdataField.certificateType, relationToStudent: studentdataField.relationToStudent});
            i++;
        });
        return Seq(newStudentDataFields).map(n => n).toList();

    case STUDENTDATAFIELDS_SAVE:
        let studentDataFields = Array<IStudentDataField>();
        let ind=0;

        //let testvar = "nikos";

        action.payload.studentDataFields.forEach(studentDataField => {
            studentDataFields.push(<IStudentDataField>studentDataField);
            ind++;
            //console.log(action.payload.studentdataFieldsFirstname);
        });

        return Seq(studentDataFields).map(n => n).toList();
    default: return state;
  }
};
