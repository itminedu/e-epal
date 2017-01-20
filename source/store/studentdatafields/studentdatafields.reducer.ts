import { IStudentDataFields, IStudentDataField } from './studentdatafields.types';
import { INITIAL_STATE } from './studentdatafields.initial-state';
import { Seq } from 'immutable';

import {
  STUDENTDATAFIELDS_RECEIVED,
  STUDENTDATAFIELDS_SAVE
} from '../../constants';

export function studentdataFieldsReducer(state: IStudentDataFields = INITIAL_STATE, action): IStudentDataFields {
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
        let selectedStudentDataFields = Array<IStudentDataField>();
        let ind=0;

        //let testvar = "nikos";

        state.forEach(studentdataField => {
            selectedStudentDataFields.push(<IStudentDataField>{studentFirstname: action.payload.studentdataFieldsFirstname, studentSurname: action.payload.studentdataFieldsSurname,
              guardianFirstname: action.payload.studentdataFieldsGuardianFirstname, guardianSurname: action.payload.studentdataFieldsGuardianSurname,
              studentAmka: studentdataField.studentAmka, regionAddress: action.payload.studentdataFieldsRegionAddress,
              regionTK: action.payload.studentdataFieldsRegionTK, regionArea: action.payload.studentdataFieldsRegionArea,
              certificateType: action.payload.studentdataFieldsCertificateType, relationToStudent: action.payload.studentdataFieldsRelationToStudent});

            ind++;
            //console.log(action.payload.studentdataFieldsFirstname);
        });

        return Seq(selectedStudentDataFields).map(n => n).toList();
    default: return state;
  }
};
