"use strict";
const epalclasses_initial_state_1 = require("./epalclasses.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function epalclassesReducer(state = epalclasses_initial_state_1.EPALCLASSES_INITIAL_STATE, action) {
    switch (action.type) {
        case constants_1.EPALCLASSES_SAVE:
            let selectedEpalClasses = Array();
            selectedEpalClasses.push({ name: action.payload.epalClasses.name });
            return immutable_1.Seq(selectedEpalClasses).map(n => n).toList();
        default: return state;
    }
}
exports.epalclassesReducer = epalclassesReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBhbGNsYXNzZXMucmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVwYWxjbGFzc2VzLnJlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDJFQUF3RTtBQUN4RSx5Q0FBZ0M7QUFFaEMsK0NBQW1EO0FBRW5ELDRCQUFtQyxRQUFzQixxREFBeUIsRUFBRSxNQUFNO0lBR3hGLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBR3BCLEtBQUssNEJBQWdCO1lBQ2pCLElBQUksbUJBQW1CLEdBQUcsS0FBSyxFQUFjLENBQUM7WUFFOUMsbUJBQW1CLENBQUMsSUFBSSxDQUFhLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7WUFHL0UsTUFBTSxDQUFDLGVBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekQsU0FBUyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3hCLENBQUM7QUFDSCxDQUFDO0FBZkQsZ0RBZUM7QUFBQSxDQUFDIn0=