"use strict";
const sectorcourses_initial_state_1 = require("./sectorcourses.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function sectorCoursesReducer(state = sectorcourses_initial_state_1.INITIAL_STATE, action) {
    switch (action.type) {
        case constants_1.SECTORCOURSES_RECEIVED:
            let newSectors = Array();
            let i = 0;
            action.payload.sectors.forEach(sector => {
                newSectors.push({ sector_id: sector.sector_id, sector_name: sector.sector_name, sector_selected: sector.sector_selected, courses: Array() });
                sector.courses.forEach(course => {
                    newSectors[i].courses.push({ course_id: course.course_id, course_name: course.course_name, globalIndex: course.globalIndex, selected: course.selected });
                });
                i++;
            });
            return immutable_1.Seq(newSectors).map(n => n).toList();
        case constants_1.SECTORCOURSES_SELECTED_SAVE:
            let sectorsWithSelections = Array();
            let ind = 0, j = 0;
            state.forEach(sector => {
                sectorsWithSelections.push({ sector_id: sector.sector_id, sector_name: sector.sector_name, sector_selected: sector.sector_selected, courses: Array() });
                sector.courses.forEach(course => {
                    sectorsWithSelections[ind].courses.push({ course_id: course.course_id, course_name: course.course_name, globalIndex: course.globalIndex, selected: action.payload.sectorCoursesSelected[j] });
                    j++;
                });
                ind++;
            });
            return immutable_1.Seq(sectorsWithSelections).map(n => n).toList();
        default: return state;
    }
}
exports.sectorCoursesReducer = sectorCoursesReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdG9yY291cnNlcy5yZWR1Y2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjdG9yY291cnNlcy5yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSwrRUFBOEQ7QUFDOUQseUNBQWdDO0FBRWhDLCtDQUd5QjtBQUV6Qiw4QkFBcUMsUUFBa0IsMkNBQWEsRUFBRSxNQUFNO0lBQzFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssa0NBQXNCO1lBQ3ZCLElBQUksVUFBVSxHQUFHLEtBQUssRUFBVyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQztZQUNSLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNO2dCQUNqQyxVQUFVLENBQUMsSUFBSSxDQUFVLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxlQUFlLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBaUIsRUFBRSxDQUFDLENBQUM7Z0JBQ3BLLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU07b0JBQ3pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFnQixFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDM0ssQ0FBQyxDQUFDLENBQUE7Z0JBQ0YsQ0FBQyxFQUFFLENBQUM7WUFDUixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxlQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVoRCxLQUFLLHVDQUEyQjtZQUM1QixJQUFJLHFCQUFxQixHQUFHLEtBQUssRUFBVyxDQUFDO1lBQzdDLElBQUksR0FBRyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFDaEIscUJBQXFCLENBQUMsSUFBSSxDQUFVLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxlQUFlLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBaUIsRUFBQyxDQUFDLENBQUM7Z0JBQzlLLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU07b0JBQ3pCLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQWdCLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUMzTSxDQUFDLEVBQUUsQ0FBQztnQkFDUixDQUFDLENBQUMsQ0FBQTtnQkFDRixHQUFHLEVBQUUsQ0FBQztZQUNWLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLGVBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDM0QsU0FBUyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3hCLENBQUM7QUFDSCxDQUFDO0FBNUJELG9EQTRCQztBQUFBLENBQUMifQ==