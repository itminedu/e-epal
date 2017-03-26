"use strict";
function deimmutifyRegionSchools(state) {
    let fetchedRegions = new Array();
    let i = 0;
    state.forEach(region => {
        fetchedRegions.push({ region_id: region.region_id, region_name: region.region_name, epals: Array() });
        region.epals.forEach(epal => {
            fetchedRegions[i].epals.push({ epal_id: epal.epal_id, epal_name: epal.epal_name, globalIndex: epal.globalIndex, selected: epal.selected, order_id: epal.order_id });
        });
        i++;
    });
    return fetchedRegions;
}
exports.deimmutifyRegionSchools = deimmutifyRegionSchools;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9uc2Nob29scy50cmFuc2Zvcm1lcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWdpb25zY2hvb2xzLnRyYW5zZm9ybWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsaUNBQXdDLEtBQWU7SUFDbkQsSUFBSSxjQUFjLEdBQUksSUFBSSxLQUFLLEVBQVcsQ0FBQztJQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDVixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU07UUFDaEIsY0FBYyxDQUFDLElBQUksQ0FBVSxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQWlCLEVBQUMsQ0FBQyxDQUFDO1FBQzVILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUk7WUFDckIsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQWdCLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQ3JMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQyxFQUFFLENBQUM7SUFDUixDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxjQUFjLENBQUM7QUFDMUIsQ0FBQztBQVhELDBEQVdDO0FBQUEsQ0FBQyJ9