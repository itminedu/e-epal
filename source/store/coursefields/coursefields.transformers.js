"use strict";
function deimmutifyCourseFields(state) {
    let fetchedCourseFields = new Array();
    state.forEach(courseField => {
        fetchedCourseFields.push({ id: courseField.id, name: courseField.name, selected: courseField.selected });
    });
    return fetchedCourseFields;
}
exports.deimmutifyCourseFields = deimmutifyCourseFields;
;
/* export function reimmutifyCourseFields(plain): ICourseFields {
  return List<ICourseField>(plain ? plain.map(CourseFieldRecord) : []);
} */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291cnNlZmllbGRzLnRyYW5zZm9ybWVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvdXJzZWZpZWxkcy50cmFuc2Zvcm1lcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLGdDQUF1QyxLQUFvQjtJQUN2RCxJQUFJLG1CQUFtQixHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7SUFDdEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXO1FBQ3JCLG1CQUFtQixDQUFDLElBQUksQ0FBZSxFQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUN6SCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztBQUMvQixDQUFDO0FBTkQsd0RBTUM7QUFBQSxDQUFDO0FBRUY7O0lBRUkifQ==