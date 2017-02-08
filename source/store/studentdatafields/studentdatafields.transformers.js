"use strict";
function deimmutifyStudentDataFields(state) {
    let fetchedStudentDataFields = new Array();
    state.forEach(studentdataField => {
        fetchedStudentDataFields.push({ studentSurname: studentdataField.studentFirstname,
            studentFirstname: studentdataField.studentSurname, guardianSurname: studentdataField.guardianFirstname,
            guardianFirstname: studentdataField.guardianSurname,
            studentAmka: studentdataField.studentAmka, regionAddress: studentdataField.regionAddress,
            regionTK: studentdataField.regionTK, regionArea: studentdataField.regionArea,
            certificateType: studentdataField.certificateType, relationToStudent: studentdataField.relationToStudent
        });
    });
    return fetchedStudentDataFields;
}
exports.deimmutifyStudentDataFields = deimmutifyStudentDataFields;
;
/* export function reimmutifyCourseFields(plain): ICourseFields {
  return List<ICourseField>(plain ? plain.map(CourseFieldRecord) : []);
} */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudGRhdGFmaWVsZHMudHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3R1ZGVudGRhdGFmaWVsZHMudHJhbnNmb3JtZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxxQ0FBNEMsS0FBeUI7SUFDakUsSUFBSSx3QkFBd0IsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQzNDLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCO1FBQzFCLHdCQUF3QixDQUFDLElBQUksQ0FBb0IsRUFBQyxjQUFjLEVBQUUsZ0JBQWdCLENBQUMsZ0JBQWdCO1lBQ2pHLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsaUJBQWlCO1lBQ3RHLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLGVBQWU7WUFDbkQsV0FBVyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsYUFBYTtZQUN4RixRQUFRLEVBQUUsZ0JBQWdCLENBQUMsUUFBUSxFQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxVQUFVO1lBQzNFLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLENBQUMsaUJBQWlCO1NBRXpHLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLHdCQUF3QixDQUFDO0FBQ3BDLENBQUM7QUFiRCxrRUFhQztBQUFBLENBQUM7QUFFRjs7SUFFSSJ9