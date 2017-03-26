"use strict";
function deimmutifyStudentDataFields(state) {
    let fetchedStudentDataFields = new Array();
    /*
    state.forEach(studentdataField => {
        fetchedStudentDataFields.push(<IStudentDataField>{studentSurname: studentdataField.studentFirstname,
          studentFirstname: studentdataField.studentSurname, guardianSurname: studentdataField.guardianFirstname,
          guardianFirstname: studentdataField.guardianSurname,
          studentAmka: studentdataField.studentAmka, regionAddress: studentdataField.regionAddress,
          regionTK: studentdataField.regionTK,regionArea: studentdataField.regionArea,
          certificateType: studentdataField.certificateType, relationToStudent: studentdataField.relationToStudent

        });
    */
    state.forEach(studentdataField => {
        fetchedStudentDataFields.push({ epaluser_id: studentdataField.epaluser_id,
            name: studentdataField.name, studentsurname: studentdataField.studentsurname,
            studentamka: studentdataField.studentamka, regionaddress: studentdataField.regionaddress,
            regiontk: studentdataField.regiontk, regionarea: studentdataField.regionarea,
            certificatetype: studentdataField.certificatetype, relationtostudent: studentdataField.relationtostudent,
            currentclass: studentdataField.currentclass
        });
    });
    return fetchedStudentDataFields;
}
exports.deimmutifyStudentDataFields = deimmutifyStudentDataFields;
;
/* export function reimmutifyCourseFields(plain): ICourseFields {
  return List<ICourseField>(plain ? plain.map(CourseFieldRecord) : []);
} */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudGRhdGFmaWVsZHMudHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3R1ZGVudGRhdGFmaWVsZHMudHJhbnNmb3JtZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxxQ0FBNEMsS0FBeUI7SUFDakUsSUFBSSx3QkFBd0IsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQzNDOzs7Ozs7Ozs7O01BVUU7SUFDRixLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtRQUMxQix3QkFBd0IsQ0FBQyxJQUFJLENBQW9CLEVBQUMsV0FBVyxFQUFDLGdCQUFnQixDQUFDLFdBQVc7WUFDeEYsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLENBQUMsY0FBYztZQUM1RSxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxhQUFhO1lBQ3hGLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLFVBQVU7WUFDM0UsZUFBZSxFQUFFLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQyxpQkFBaUI7WUFDeEcsWUFBWSxFQUFFLGdCQUFnQixDQUFDLFlBQVk7U0FDNUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsd0JBQXdCLENBQUM7QUFDcEMsQ0FBQztBQXZCRCxrRUF1QkM7QUFBQSxDQUFDO0FBRUY7O0lBRUkifQ==