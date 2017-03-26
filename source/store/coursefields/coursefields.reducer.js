"use strict";
const coursefields_initial_state_1 = require("./coursefields.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function courseFieldsReducer(state = coursefields_initial_state_1.INITIAL_STATE, action) {
    switch (action.type) {
        case constants_1.COURSEFIELDS_RECEIVED:
            let newCourseFields = Array();
            let i = 0;
            action.payload.courseFields.forEach(courseField => {
                newCourseFields.push({ id: courseField.id, name: courseField.name, selected: false });
                i++;
            });
            return immutable_1.Seq(newCourseFields).map(n => n).toList();
        case constants_1.COURSEFIELDS_SELECTED_SAVE:
            let selectedCourseFields = Array();
            let ind = 0;
            state.forEach(courseField => {
                selectedCourseFields.push({ id: courseField.id, name: courseField.name, selected: action.payload.courseFieldsSelected[ind] });
                ind++;
            });
            return immutable_1.Seq(selectedCourseFields).map(n => n).toList();
        default: return state;
    }
}
exports.courseFieldsReducer = courseFieldsReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291cnNlZmllbGRzLnJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb3Vyc2VmaWVsZHMucmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsNkVBQTZEO0FBQzdELHlDQUFnQztBQUVoQywrQ0FHeUI7QUFFekIsNkJBQW9DLFFBQXVCLDBDQUFhLEVBQUUsTUFBTTtJQUM5RSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixLQUFLLGlDQUFxQjtZQUN0QixJQUFJLGVBQWUsR0FBRyxLQUFLLEVBQWdCLENBQUM7WUFDNUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDO1lBQ1IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQzNDLGVBQWUsQ0FBQyxJQUFJLENBQWUsRUFBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztnQkFDbEcsQ0FBQyxFQUFFLENBQUM7WUFDUixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxlQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyRCxLQUFLLHNDQUEwQjtZQUMzQixJQUFJLG9CQUFvQixHQUFHLEtBQUssRUFBZ0IsQ0FBQztZQUNqRCxJQUFJLEdBQUcsR0FBQyxDQUFDLENBQUM7WUFDVixLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ3JCLG9CQUFvQixDQUFDLElBQUksQ0FBZSxFQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDMUksR0FBRyxFQUFFLENBQUM7WUFDVixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxlQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFELFNBQVMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN4QixDQUFDO0FBQ0gsQ0FBQztBQXBCRCxrREFvQkM7QUFBQSxDQUFDIn0=