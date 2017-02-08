"use strict";
const redux_1 = require("redux");
const courseFields = require("./coursefields");
const sectorFields = require("./sectorfields");
const regions = require("./regionschools");
const sectors = require("./sectorcourses");
const studentDataFields = require("./studentdatafields");
const classFields = require("./classfields");
;
exports.rootReducer = redux_1.combineReducers({
    courseFields: courseFields.courseFieldsReducer,
    sectorFields: sectorFields.sectorFieldsReducer,
    regions: regions.regionSchoolsReducer,
    sectors: sectors.sectorCoursesReducer,
    studentDataFields: studentDataFields.studentDataFieldsReducer,
    classFields: classFields.classFieldsReducer,
});
function deimmutify(state) {
    return {
        courseFields: courseFields.deimmutifyCourseFields(state.courseFields),
        sectorFields: sectorFields.deimmutifySectorFields(state.sectorFields),
        regions: regions.deimmutifyRegionSchools(state.regions),
        sectors: sectors.deimmutifySectorCourses(state.sectors),
        studentdataFields: studentDataFields.deimmutifyStudentDataFields(state.studentDataFields),
        classFields: classFields.deimmutifyClassFields(state.classFields),
    };
}
exports.deimmutify = deimmutify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUNBQXdDO0FBQ3hDLCtDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyx5REFBeUQ7QUFDekQsNkNBQTZDO0FBYTVDLENBQUM7QUFFVyxRQUFBLFdBQVcsR0FBRyx1QkFBZSxDQUFZO0lBQ25ELFlBQVksRUFBRSxZQUFZLENBQUMsbUJBQW1CO0lBQzlDLFlBQVksRUFBRSxZQUFZLENBQUMsbUJBQW1CO0lBQzlDLE9BQU8sRUFBRSxPQUFPLENBQUMsb0JBQW9CO0lBQ3JDLE9BQU8sRUFBRSxPQUFPLENBQUMsb0JBQW9CO0lBQ3JDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLHdCQUF3QjtJQUM3RCxXQUFXLEVBQUUsV0FBVyxDQUFDLGtCQUFrQjtDQUM3QyxDQUFDLENBQUM7QUFFSCxvQkFBMkIsS0FBZ0I7SUFDekMsTUFBTSxDQUFDO1FBQ0wsWUFBWSxFQUFFLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ3JFLFlBQVksRUFBRSxZQUFZLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNyRSxPQUFPLEVBQUUsT0FBTyxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDdkQsT0FBTyxFQUFFLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3ZELGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztRQUN6RixXQUFXLEVBQUUsV0FBVyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7S0FDbEUsQ0FBQztBQUNKLENBQUM7QUFURCxnQ0FTQyJ9