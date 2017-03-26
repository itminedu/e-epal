"use strict";
const regionschools_initial_state_1 = require("./regionschools.initial-state");
const immutable_1 = require("immutable");
const constants_1 = require("../../constants");
function regionSchoolsReducer(state = regionschools_initial_state_1.REGION_SCHOOLS_INITIAL_STATE, action) {
    switch (action.type) {
        case constants_1.REGIONSCHOOLS_RECEIVED:
            let newRegions = Array();
            let i = 0;
            action.payload.regions.forEach(region => {
                newRegions.push({ region_id: region.region_id, region_name: region.region_name, epals: Array() });
                region.epals.forEach(epal => {
                    newRegions[i].epals.push({ epal_id: epal.epal_id, epal_name: epal.epal_name, globalIndex: epal.globalIndex, selected: epal.selected, order_id: epal.order_id });
                });
                i++;
            });
            return immutable_1.Seq(newRegions).map(n => n).toList();
        case constants_1.REGIONSCHOOLS_SELECTED_SAVE:
            let ind = 0;
            state.forEach(region => {
                if (ind === action.payload.rIndex) {
                    region.epals[action.payload.sIndex].selected = action.payload.checked;
                    return state.withMutations(function (list) {
                        list.set(ind++, region);
                    });
                }
                ind++;
            });
            return state;
        case constants_1.REGIONSCHOOLS_ORDER_SAVE:
            let regionsWithOrders = Array();
            let idx = 0, k = 0;
            state.forEach(region => {
                regionsWithOrders.push({ region_id: region.region_id, region_name: region.region_name, epals: Array() });
                region.epals.forEach(epal => {
                    regionsWithOrders[idx].epals.push({ epal_id: epal.epal_id, epal_name: epal.epal_name, globalIndex: epal.globalIndex, selected: epal.selected, order_id: action.payload.regionSchoolsOrder[k] });
                    k++;
                });
                idx++;
            });
            return immutable_1.Seq(regionsWithOrders).map(n => n).toList();
        case constants_1.REGIONSCHOOLS_INIT:
            return regionschools_initial_state_1.REGION_SCHOOLS_INITIAL_STATE;
        default: return state;
    }
}
exports.regionSchoolsReducer = regionSchoolsReducer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9uc2Nob29scy5yZWR1Y2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVnaW9uc2Nob29scy5yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSwrRUFBNkU7QUFDN0UseUNBQWdDO0FBRWhDLCtDQUt5QjtBQUV6Qiw4QkFBcUMsUUFBa0IsMERBQTRCLEVBQUUsTUFBTTtJQUN6RixNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixLQUFLLGtDQUFzQjtZQUN2QixJQUFJLFVBQVUsR0FBRyxLQUFLLEVBQVcsQ0FBQztZQUNsQyxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUM7WUFDUixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFDakMsVUFBVSxDQUFDLElBQUksQ0FBVSxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQWlCLEVBQUUsQ0FBQyxDQUFDO2dCQUN6SCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJO29CQUNyQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBZ0IsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ2xMLENBQUMsQ0FBQyxDQUFBO2dCQUNGLENBQUMsRUFBRSxDQUFDO1lBQ1IsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsZUFBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEQsS0FBSyx1Q0FBMkI7WUFDNUIsSUFBSSxHQUFHLEdBQUMsQ0FBQyxDQUFDO1lBQ1YsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO29CQUN0RSxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLElBQUk7d0JBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQzVCLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBQ0QsR0FBRyxFQUFFLENBQUM7WUFDVixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFFYixLQUFLLG9DQUF3QjtZQUN6QixJQUFJLGlCQUFpQixHQUFHLEtBQUssRUFBVyxDQUFDO1lBQ3pDLElBQUksR0FBRyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFDaEIsaUJBQWlCLENBQUMsSUFBSSxDQUFVLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBaUIsRUFBQyxDQUFDLENBQUM7Z0JBQy9ILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUk7b0JBQ3JCLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQWdCLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUM3TSxDQUFDLEVBQUUsQ0FBQztnQkFDUixDQUFDLENBQUMsQ0FBQTtnQkFDRixHQUFHLEVBQUUsQ0FBQztZQUNWLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLGVBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdkQsS0FBSyw4QkFBa0I7WUFDbkIsTUFBTSxDQUFDLDBEQUE0QixDQUFDO1FBQzVDLFNBQVMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN4QixDQUFDO0FBQ0gsQ0FBQztBQTNDRCxvREEyQ0M7QUFBQSxDQUFDIn0=