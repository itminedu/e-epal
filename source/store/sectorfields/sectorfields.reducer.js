"use strict";
const sectorfields_initial_state_1 = require("./sectorfields.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function sectorFieldsReducer(state = sectorfields_initial_state_1.INITIAL_STATE, action) {
    switch (action.type) {
        case constants_1.SECTORFIELDS_RECEIVED:
            let newSectorFields = Array();
            let i = 0;
            action.payload.sectorFields.forEach(sectorField => {
                newSectorFields.push({ id: sectorField.id, name: sectorField.name, selected: false });
                i++;
            });
            return immutable_1.Seq(newSectorFields).map(n => n).toList();
        case constants_1.SECTORFIELDS_SELECTED_SAVE:
            let selectedSectorFields = Array();
            let ind = 0;
            state.forEach(sectorField => {
                selectedSectorFields.push({ id: sectorField.id, name: sectorField.name, selected: action.payload.sectorFieldsSelected[ind] });
                ind++;
            });
            return immutable_1.Seq(selectedSectorFields).map(n => n).toList();
        default: return state;
    }
}
exports.sectorFieldsReducer = sectorFieldsReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdG9yZmllbGRzLnJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWN0b3JmaWVsZHMucmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsNkVBQTZEO0FBQzdELHlDQUFnQztBQUVoQywrQ0FHeUI7QUFFekIsNkJBQW9DLFFBQXVCLDBDQUFhLEVBQUUsTUFBTTtJQUM5RSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixLQUFLLGlDQUFxQjtZQUN0QixJQUFJLGVBQWUsR0FBRyxLQUFLLEVBQWdCLENBQUM7WUFDNUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDO1lBQ1IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQzNDLGVBQWUsQ0FBQyxJQUFJLENBQWUsRUFBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztnQkFDbEcsQ0FBQyxFQUFFLENBQUM7WUFDUixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxlQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyRCxLQUFLLHNDQUEwQjtZQUMzQixJQUFJLG9CQUFvQixHQUFHLEtBQUssRUFBZ0IsQ0FBQztZQUNqRCxJQUFJLEdBQUcsR0FBQyxDQUFDLENBQUM7WUFDVixLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ3JCLG9CQUFvQixDQUFDLElBQUksQ0FBZSxFQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDMUksR0FBRyxFQUFFLENBQUM7WUFDVixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxlQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFELFNBQVMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN4QixDQUFDO0FBQ0gsQ0FBQztBQXBCRCxrREFvQkM7QUFBQSxDQUFDIn0=