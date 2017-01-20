import { IStudentDataFields, IStudentDataField } from './studentdatafields.types';

export function deimmutifyStudentDataFields(state: IStudentDataFields): IStudentDataField[] {
    let fetchedStudentDataFields = new Array();
    state.forEach(studentdataField => {
        fetchedStudentDataFields.push(<IStudentDataField>{studentSurname: studentdataField.studentFirstname,
          studentFirstname: studentdataField.studentSurname, guardianSurname: studentdataField.guardianFirstname,
          guardianFirstname: studentdataField.guardianSurname,
          studentAmka: studentdataField.studentAmka, regionAddress: studentdataField.regionAddress,
          regionTK: studentdataField.regionTK,regionArea: studentdataField.regionArea,
          certificateType: studentdataField.certificateType, relationToStudent: studentdataField.relationToStudent

        });
    });
    return fetchedStudentDataFields;
};

/* export function reimmutifyCourseFields(plain): ICourseFields {
  return List<ICourseField>(plain ? plain.map(CourseFieldRecord) : []);
} */
