"use strict";
const studentdatafields_initial_state_1 = require("./studentdatafields.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function studentDataFieldsReducer(state = studentdatafields_initial_state_1.INITIAL_STATE, action) {
    switch (action.type) {
        case constants_1.STUDENTDATAFIELDS_SAVE:
            let studentDataFields = Array();
            let ind = 0;
            action.payload.studentDataFields.forEach(studentDataField => {
                studentDataFields.push(studentDataField);
                ind++;
            });
            return immutable_1.Seq(studentDataFields).map(n => n).toList();
        default: return state;
    }
}
exports.studentDataFieldsReducer = studentDataFieldsReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudGRhdGFmaWVsZHMucmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0dWRlbnRkYXRhZmllbGRzLnJlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHVGQUFrRTtBQUNsRSx5Q0FBZ0M7QUFFaEMsK0NBR3lCO0FBRXpCLGtDQUF5QyxRQUE0QiwrQ0FBYSxFQUFFLE1BQU07SUFDeEYsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsS0FBSyxrQ0FBc0I7WUFDdkIsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLEVBQXFCLENBQUM7WUFDbkQsSUFBSSxHQUFHLEdBQUMsQ0FBQyxDQUFDO1lBRVYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCO2dCQUNyRCxpQkFBaUIsQ0FBQyxJQUFJLENBQW9CLGdCQUFnQixDQUFDLENBQUM7Z0JBQzVELEdBQUcsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsZUFBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN2RCxTQUFTLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDeEIsQ0FBQztBQUNILENBQUM7QUFkRCw0REFjQztBQUFBLENBQUMifQ==