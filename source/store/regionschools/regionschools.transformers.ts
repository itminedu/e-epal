import { IRegions, IRegion } from './regionschools.types';

export function deimmutifyRegionSchools(state: IRegions): IRegions {
//    let fetchedRegions =  new Array<IRegion>();
//    let i = 0;

/*    state.forEach(region => {
        fetchedRegions.push(<IRegion>{region_id: region.region_id, region_name: region.region_name, epals: Array<IRegionSchool>()});
        region.epals.forEach(epal => {
            fetchedRegions[i].epals.push(<IRegionSchool>{epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: epal.selected, order_id: epal.order_id })
        });
        i++;
    }); */
    // return state.toJS();
    return state;
//    return fetchedRegions;
};
