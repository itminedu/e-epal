"use strict";
const redux_1 = require("redux");
const courseFields = require("./coursefields");
const sectorFields = require("./sectorfields");
const regions = require("./regionschools");
const sectors = require("./sectorcourses");
const studentDataFields = require("./studentdatafields");
const epalclasses = require("./epalclasses");
const loginInfo = require("./logininfo");
const criter = require("./criteria");
;
exports.rootReducer = redux_1.combineReducers({
    courseFields: courseFields.courseFieldsReducer,
    sectorFields: sectorFields.sectorFieldsReducer,
    regions: regions.regionSchoolsReducer,
    sectors: sectors.sectorCoursesReducer,
    studentDataFields: studentDataFields.studentDataFieldsReducer,
    epalclasses: epalclasses.epalclassesReducer,
    loginInfo: loginInfo.loginInfoReducer,
    criter: criter.criteriaReducer,
});
function deimmutify(state) {
    return {
        courseFields: courseFields.deimmutifyCourseFields(state.courseFields),
        sectorFields: sectorFields.deimmutifySectorFields(state.sectorFields),
        regions: regions.deimmutifyRegionSchools(state.regions),
        sectors: sectors.deimmutifySectorCourses(state.sectors),
        studentdataFields: studentDataFields.deimmutifyStudentDataFields(state.studentDataFields),
        epalclasses: epalclasses.deimmutifyEpalClasses(state.epalclasses),
        loginInfo: loginInfo.deimmutifyLoginInfo(state.loginInfo),
        criter: criter.deimmutifyCriteria(state.criter)
    };
}
exports.deimmutify = deimmutify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUNBQXdDO0FBQ3hDLCtDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyx5REFBeUQ7QUFDekQsNkNBQTZDO0FBQzdDLHlDQUF5QztBQUN6QyxxQ0FBcUM7QUFlcEMsQ0FBQztBQUVXLFFBQUEsV0FBVyxHQUFHLHVCQUFlLENBQVk7SUFDbkQsWUFBWSxFQUFFLFlBQVksQ0FBQyxtQkFBbUI7SUFDOUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxtQkFBbUI7SUFDOUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxvQkFBb0I7SUFDckMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxvQkFBb0I7SUFDckMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsd0JBQXdCO0lBQzdELFdBQVcsRUFBRSxXQUFXLENBQUMsa0JBQWtCO0lBQzNDLFNBQVMsRUFBRSxTQUFTLENBQUMsZ0JBQWdCO0lBQ3JDLE1BQU0sRUFBRSxNQUFNLENBQUMsZUFBZTtDQUVoQyxDQUFDLENBQUM7QUFFSCxvQkFBMkIsS0FBZ0I7SUFDekMsTUFBTSxDQUFDO1FBQ0wsWUFBWSxFQUFFLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ3JFLFlBQVksRUFBRSxZQUFZLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNyRSxPQUFPLEVBQUUsT0FBTyxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDdkQsT0FBTyxFQUFFLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3ZELGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztRQUN6RixXQUFXLEVBQUUsV0FBVyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDakUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ3pELE1BQU0sRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztLQUNoRCxDQUFDO0FBQ0osQ0FBQztBQVhELGdDQVdDIn0=