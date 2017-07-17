import { IRegions, Region, IRegion, IRegionM, RegionSchool, IRegionSchools } from './regionschools.types';
import { REGION_SCHOOLS_INITIAL_STATE } from './regionschools.initial-state';
import { Seq, Map, fromJS } from 'immutable';

import {
  REGIONSCHOOLS_RECEIVED,
  REGIONSCHOOLS_SELECTED_SAVE,
  REGIONSCHOOLS_ORDER_SAVE,
  REGIONSCHOOLS_INIT
} from '../../constants';

export function regionSchoolsReducer(state: IRegions = REGION_SCHOOLS_INITIAL_STATE, action): IRegions {
  switch (action.type) {
    case REGIONSCHOOLS_RECEIVED:
        let newRegions = Array<Region>();
        let i=0;
        action.payload.regions.forEach(region => {
            newRegions.push(<any>{region_id: region.region_id, region_name: region.region_name, epals: <any>[] });
            region.epals.forEach(epal => {
                newRegions[i].epals.push(<any>{epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: epal.selected, order_id: epal.order_id });
            })
            i++;
        });
        return fromJS(newRegions);
    case REGIONSCHOOLS_SELECTED_SAVE:
//        let ind=0;
        let region: IRegionM;
        let epals: IRegionSchools;
        region = state.get(action.payload.rIndex);
        console.log(region);

        epals = region.get("epals").epals;
        let epal = epals.get(action.payload.sIndex);
        epal.set("selected", action.payload.checked);
        region = region.set("epals", epals.set(action.payload.sIndex,
            epal.set("selected", action.payload.checked)));
        return state
            .set(action.payload.rIndex, region);

/*        state.forEach(region => {
            if (ind === action.payload.rIndex) {
                let regionCopy = state.get(ind);
                regionCopy.epals[action.payload.sIndex].selected = action.payload.checked;
                return state.withMutations(function (list) {
                    list.set(ind++, regionCopy);
                });
            }
            ind++;
        }); */
//        return state;

    case REGIONSCHOOLS_ORDER_SAVE:
        let ind2=0;
        state.forEach(region => {
            for(let i=0; i<region.epals.length; i++){
                if (region.epals[i].globalIndex === action.payload.selectedSchools[0].globalIndex) {
                    region.epals[i].order_id = action.payload.selectedSchools[0].order_id
                    return state.withMutations(function (list) {
                        list.set(ind2++, region);
                    });
                }
                if (typeof action.payload.selectedSchools[1] !== 'undefined' &&
                  region.epals[i].globalIndex === action.payload.selectedSchools[1].globalIndex) {
                    region.epals[i].order_id = action.payload.selectedSchools[1].order_id
                    return state.withMutations(function (list) {
                        list.set(ind2++, region);
                    });
                }
                if (typeof action.payload.selectedSchools[2] !== 'undefined' &&
                    region.epals[i].globalIndex === action.payload.selectedSchools[2].globalIndex) {
                      region.epals[i].order_id = action.payload.selectedSchools[2].order_id
                      return state.withMutations(function (list) {
                          list.set(ind2++, region);
                      });
                  }
                //}


            }
            ind2++;
        });
        return state;

        case REGIONSCHOOLS_INIT:
            return REGION_SCHOOLS_INITIAL_STATE;
    default: return state;
  }
};
