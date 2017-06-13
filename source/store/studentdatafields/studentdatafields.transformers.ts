import { IStudentDataFields, IStudentDataField } from './studentdatafields.types';

export function deimmutifyStudentDataFields(state: IStudentDataFields): IStudentDataField[] {
    let fetchedStudentDataFields = new Array();
    state.forEach(studentdataField => {
        fetchedStudentDataFields.push(<IStudentDataField>{epaluser_id:studentdataField.epaluser_id,
          name: studentdataField.name, studentsurname: studentdataField.studentsurname, studentbirthdate: studentdataField.studentbirthdate,
          fatherfirstname: studentdataField.fatherfirstname, fathersurname: studentdataField.fathersurname,
          motherfirstname: studentdataField.motherfirstname, mothersurname: studentdataField.mothersurname,
          studentamka: studentdataField.studentamka, regionaddress: studentdataField.regionaddress,
          regiontk: studentdataField.regiontk,regionarea: studentdataField.regionarea,
          lastschool_schoolname: studentdataField.lastschool_schoolname,
          lastschool_schoolyear: studentdataField.lastschool_schoolyear,
          lastschool_class: studentdataField.lastschool_class,
          relationtostudent: studentdataField.relationtostudent,
          currentclass: studentdataField.currentclass, points: studentdataField.points
        });
    });
    return fetchedStudentDataFields;
};
