"use strict";
const criteria_initial_state_1 = require("./criteria.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function criteriaReducer(state = criteria_initial_state_1.CRITERIA_INITIAL_STATE, action) {
    switch (action.type) {
        case constants_1.CRITERIA_RECEIVED:
            let newCriter = Array();
            let i = 0;
            action.payload.criteria.forEach(criteria => {
                newCriter.push({ id: criteria.id, name: criteria.name, mutual_disabled_id: criteria.mutual_disabled_id, selected: false });
                i++;
            });
            return immutable_1.Seq(newCriter).map(n => n).toList();
        case constants_1.CRITERIA_SAVE:
            let criter = Array();
            let ind = 0;
            state.forEach(criteria => {
                criter.push({ id: criteria.id, name: criteria.name, mutual_disabled_id: criteria.mutual_disabled_id, selected: action.payload.criter[0][ind] });
                ind++;
            });
            return immutable_1.Seq(criter).map(n => n).toList();
        default: return state;
    }
}
exports.criteriaReducer = criteriaReducer;
;
/*
case COURSEFIELDS_SELECTED_SAVE:
    let selectedCourseFields = Array<ICourseField>();
    let ind=0;
    state.forEach(courseField => {
        selectedCourseFields.push(<ICourseField>{id: courseField.id, name: courseField.name, selected: action.payload.courseFieldsSelected[ind]});
        ind++;
    });
    return Seq(selectedCourseFields).map(n => n).toList();
default: return state;
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JpdGVyaWEucmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyaXRlcmlhLnJlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHFFQUFrRTtBQUNsRSx5Q0FBZ0M7QUFFaEMsK0NBR3lCO0FBRXpCLHlCQUFnQyxRQUFpQiwrQ0FBc0IsRUFBRSxNQUFNO0lBQzdFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssNkJBQWlCO1lBQ2xCLElBQUksU0FBUyxHQUFHLEtBQUssRUFBYSxDQUFDO1lBQ25DLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQztZQUNSLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUNwQyxTQUFTLENBQUMsSUFBSSxDQUFZLEVBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsRUFBRyxLQUFLLEVBQUMsQ0FBQyxDQUFDO2dCQUNySSxDQUFDLEVBQUUsQ0FBQztZQUNSLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLGVBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRS9DLEtBQUsseUJBQWE7WUFDZCxJQUFJLE1BQU0sR0FBRyxLQUFLLEVBQWEsQ0FBQztZQUNoQyxJQUFJLEdBQUcsR0FBQyxDQUFDLENBQUM7WUFDVixLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVE7Z0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQVksRUFBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxRQUFRLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDekosR0FBRyxFQUFFLENBQUM7WUFDVixDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxlQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM1QyxTQUFTLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDeEIsQ0FBQztBQUNILENBQUM7QUF0QkQsMENBc0JDO0FBQUEsQ0FBQztBQUNGOzs7Ozs7Ozs7O0VBVUUifQ==