"use strict";
const sectorcourses_initial_state_1 = require("./sectorcourses.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function sectorCoursesReducer(state = sectorcourses_initial_state_1.SECTOR_COURSES_INITIAL_STATE, action) {
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
                sectorsWithSelections.push({ sector_id: sector.sector_id, sector_name: sector.sector_name, sector_selected: action.payload.sectorSelected[ind], courses: Array() });
                sector.courses.forEach(course => {
                    sectorsWithSelections[ind].courses.push({ course_id: course.course_id, course_name: course.course_name, globalIndex: course.globalIndex, selected: action.payload.sectorCoursesSelected[j] });
                    j++;
                });
                ind++;
            });
            return immutable_1.Seq(sectorsWithSelections).map(n => n).toList();
        case constants_1.SECTORCOURSES_INIT:
            return sectorcourses_initial_state_1.SECTOR_COURSES_INITIAL_STATE;
        default: return state;
    }
}
exports.sectorCoursesReducer = sectorCoursesReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdG9yY291cnNlcy5yZWR1Y2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjdG9yY291cnNlcy5yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSwrRUFBNkU7QUFDN0UseUNBQWdDO0FBRWhDLCtDQUl5QjtBQUV6Qiw4QkFBcUMsUUFBa0IsMERBQTRCLEVBQUUsTUFBTTtJQUN6RixNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixLQUFLLGtDQUFzQjtZQUN2QixJQUFJLFVBQVUsR0FBRyxLQUFLLEVBQVcsQ0FBQztZQUNsQyxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUM7WUFDUixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFDakMsVUFBVSxDQUFDLElBQUksQ0FBVSxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQWlCLEVBQUUsQ0FBQyxDQUFDO2dCQUNwSyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNO29CQUN6QixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBZ0IsRUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQzNLLENBQUMsQ0FBQyxDQUFBO2dCQUNGLENBQUMsRUFBRSxDQUFDO1lBQ1IsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsZUFBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFaEQsS0FBSyx1Q0FBMkI7WUFDNUIsSUFBSSxxQkFBcUIsR0FBRyxLQUFLLEVBQVcsQ0FBQztZQUM3QyxJQUFJLEdBQUcsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU07Z0JBQ2hCLHFCQUFxQixDQUFDLElBQUksQ0FBVSxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFpQixFQUFDLENBQUMsQ0FBQztnQkFDMUwsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTTtvQkFDekIscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBZ0IsRUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7b0JBQzNNLENBQUMsRUFBRSxDQUFDO2dCQUNSLENBQUMsQ0FBQyxDQUFBO2dCQUNGLEdBQUcsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsZUFBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMzRCxLQUFLLDhCQUFrQjtZQUNuQixNQUFNLENBQUMsMERBQTRCLENBQUM7UUFDeEMsU0FBUyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3hCLENBQUM7QUFDSCxDQUFDO0FBOUJELG9EQThCQztBQUFBLENBQUMifQ==