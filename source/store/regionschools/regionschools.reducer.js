"use strict";
const regionschools_initial_state_1 = require("./regionschools.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function regionSchoolsReducer(state = regionschools_initial_state_1.INITIAL_STATE, action) {
    switch (action.type) {
        case constants_1.REGIONSCHOOLS_RECEIVED:
            let newRegions = Array();
            let i = 0;
            action.payload.regions.forEach(region => {
                newRegions.push({ region_id: region.region_id, region_name: region.region_name, epals: Array() });
                region.epals.forEach(epal => {
                    newRegions[i].epals.push({ epal_id: epal.epal_id, epal_name: epal.epal_name, globalIndex: epal.globalIndex, selected: epal.selected });
                });
                i++;
            });
            return immutable_1.Seq(newRegions).map(n => n).toList();
        case constants_1.REGIONSCHOOLS_SELECTED_SAVE:
            let regionsWithSelections = Array();
            let ind = 0, j = 0;
            state.forEach(region => {
                regionsWithSelections.push({ region_id: region.region_id, region_name: region.region_name, epals: Array() });
                region.epals.forEach(epal => {
                    regionsWithSelections[ind].epals.push({ epal_id: epal.epal_id, epal_name: epal.epal_name, globalIndex: epal.globalIndex, selected: action.payload.regionSchoolsSelected[j] });
                    j++;
                });
                ind++;
            });
            return immutable_1.Seq(regionsWithSelections).map(n => n).toList();
        default: return state;
    }
}
exports.regionSchoolsReducer = regionSchoolsReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9uc2Nob29scy5yZWR1Y2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVnaW9uc2Nob29scy5yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSwrRUFBOEQ7QUFDOUQseUNBQWdDO0FBRWhDLCtDQUd5QjtBQUV6Qiw4QkFBcUMsUUFBa0IsMkNBQWEsRUFBRSxNQUFNO0lBQzFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssa0NBQXNCO1lBQ3ZCLElBQUksVUFBVSxHQUFHLEtBQUssRUFBVyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQztZQUNSLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNO2dCQUNqQyxVQUFVLENBQUMsSUFBSSxDQUFVLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBaUIsRUFBRSxDQUFDLENBQUM7Z0JBQ3pILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUk7b0JBQ3JCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFnQixFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDekosQ0FBQyxDQUFDLENBQUE7Z0JBQ0YsQ0FBQyxFQUFFLENBQUM7WUFDUixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxlQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoRCxLQUFLLHVDQUEyQjtZQUM1QixJQUFJLHFCQUFxQixHQUFHLEtBQUssRUFBVyxDQUFDO1lBQzdDLElBQUksR0FBRyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFDaEIscUJBQXFCLENBQUMsSUFBSSxDQUFVLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBaUIsRUFBQyxDQUFDLENBQUM7Z0JBQ25JLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUk7b0JBQ3JCLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQWdCLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUMzTCxDQUFDLEVBQUUsQ0FBQztnQkFDUixDQUFDLENBQUMsQ0FBQTtnQkFDRixHQUFHLEVBQUUsQ0FBQztZQUNWLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLGVBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDM0QsU0FBUyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3hCLENBQUM7QUFDSCxDQUFDO0FBM0JELG9EQTJCQztBQUFBLENBQUMifQ==