"use strict";
const sectorfields_initial_state_1 = require("./sectorfields.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function sectorFieldsReducer(state = sectorfields_initial_state_1.SECTOR_FIELDS_INITIAL_STATE, action) {
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
        case constants_1.SECTORFIELDS_INIT:
            return sectorfields_initial_state_1.SECTOR_FIELDS_INITIAL_STATE;
        default: return state;
    }
}
exports.sectorFieldsReducer = sectorFieldsReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdG9yZmllbGRzLnJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWN0b3JmaWVsZHMucmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsNkVBQTJFO0FBQzNFLHlDQUFnQztBQUVoQywrQ0FJeUI7QUFFekIsNkJBQW9DLFFBQXVCLHdEQUEyQixFQUFFLE1BQU07SUFDNUYsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsS0FBSyxpQ0FBcUI7WUFDdEIsSUFBSSxlQUFlLEdBQUcsS0FBSyxFQUFnQixDQUFDO1lBQzVDLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQztZQUNSLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2dCQUMzQyxlQUFlLENBQUMsSUFBSSxDQUFlLEVBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7Z0JBQ2xHLENBQUMsRUFBRSxDQUFDO1lBQ1IsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsZUFBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckQsS0FBSyxzQ0FBMEI7WUFDM0IsSUFBSSxvQkFBb0IsR0FBRyxLQUFLLEVBQWdCLENBQUM7WUFDakQsSUFBSSxHQUFHLEdBQUMsQ0FBQyxDQUFDO1lBQ1YsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXO2dCQUNyQixvQkFBb0IsQ0FBQyxJQUFJLENBQWUsRUFBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQzFJLEdBQUcsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsZUFBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMxRCxLQUFLLDZCQUFpQjtZQUNsQixNQUFNLENBQUMsd0RBQTJCLENBQUM7UUFDdkMsU0FBUyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3hCLENBQUM7QUFDSCxDQUFDO0FBdEJELGtEQXNCQztBQUFBLENBQUMifQ==