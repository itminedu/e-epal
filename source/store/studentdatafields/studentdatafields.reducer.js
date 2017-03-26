"use strict";
const studentdatafields_initial_state_1 = require("./studentdatafields.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function studentDataFieldsReducer(state = studentdatafields_initial_state_1.STUDENT_DATA_FIELDS_INITIAL_STATE, action) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudGRhdGFmaWVsZHMucmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0dWRlbnRkYXRhZmllbGRzLnJlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHVGQUFzRjtBQUN0Rix5Q0FBZ0M7QUFFaEMsK0NBR3lCO0FBRXpCLGtDQUF5QyxRQUE0QixtRUFBaUMsRUFBRSxNQUFNO0lBQzVHLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssa0NBQXNCO1lBQ3ZCLElBQUksaUJBQWlCLEdBQUcsS0FBSyxFQUFxQixDQUFDO1lBQ25ELElBQUksR0FBRyxHQUFDLENBQUMsQ0FBQztZQUVWLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtnQkFDckQsaUJBQWlCLENBQUMsSUFBSSxDQUFvQixnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM1RCxHQUFHLEVBQUUsQ0FBQztZQUNWLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGVBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdkQsU0FBUyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3hCLENBQUM7QUFDSCxDQUFDO0FBZEQsNERBY0M7QUFBQSxDQUFDIn0=