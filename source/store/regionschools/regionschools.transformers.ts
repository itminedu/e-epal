import { IRegions, IRegion, IRegionSchool } from './regionschools.types';

export function deimmutifyRegionSchools(state: IRegions): IRegion[] {
    let fetchedRegions =  new Array<IRegion>();
    let i = 0;
    state.forEach(region => {
        fetchedRegions.push(<IRegion>{region_id: region.region_id, region_name: region.region_name, epals: Array<IRegionSchool>()});
        region.epals.forEach(epal => {
            fetchedRegions[i].epals.push(<IRegionSchool>{epal_id: epal.epal_id, epal_name: epal.epal_name, globalIndex: epal.globalIndex, selected: epal.selected, order_id: epal.order_id })
        });
        i++;
    });
    return fetchedRegions;
};
