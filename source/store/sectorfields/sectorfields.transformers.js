"use strict";
function deimmutifySectorFields(state) {
    let fetchedSectorFields = new Array();
    state.forEach(sectorField => {
        fetchedSectorFields.push({ id: sectorField.id, name: sectorField.name, selected: sectorField.selected });
    });
    return fetchedSectorFields;
}
exports.deimmutifySectorFields = deimmutifySectorFields;
;
/* export function reimmutifyCourseFields(plain): ICourseFields {
  return List<ICourseField>(plain ? plain.map(CourseFieldRecord) : []);
} */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdG9yZmllbGRzLnRyYW5zZm9ybWVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlY3RvcmZpZWxkcy50cmFuc2Zvcm1lcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLGdDQUF1QyxLQUFvQjtJQUN2RCxJQUFJLG1CQUFtQixHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7SUFDdEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXO1FBQ3JCLG1CQUFtQixDQUFDLElBQUksQ0FBZSxFQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUN6SCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztBQUMvQixDQUFDO0FBTkQsd0RBTUM7QUFBQSxDQUFDO0FBRUY7O0lBRUkifQ==