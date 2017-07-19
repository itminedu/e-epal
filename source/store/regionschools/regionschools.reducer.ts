import { IRegions, Region, IRegion, IRRegion, IRegionM, RegionSchool, IRRegionSchool, IRegionSchools, IRegionSchoolRecord, IRegionSchoolRecords, IRegionRecord } from './regionschools.types';
import { REGION_SCHOOLS_INITIAL_STATE } from './regionschools.initial-state';
import { Seq, Map, fromJS } from 'immutable';
import {recordify} from 'typed-immutable-record';

import {
  REGIONSCHOOLS_RECEIVED,
  REGIONSCHOOLS_SELECTED_SAVE,
  REGIONSCHOOLS_ORDER_SAVE,
  REGIONSCHOOLS_INIT
} from '../../constants';

export function regionSchoolsReducer(state: IRegionRecord[] = REGION_SCHOOLS_INITIAL_STATE, action): IRegionRecord[] {
  switch (action.type) {
    case REGIONSCHOOLS_RECEIVED:
        let newRegions = Array<IRegionRecord>();
        let i=0, j=0;
        let ii=0;

        action.payload.regions.forEach(region => {
            region.epals.forEach(epal => {
                if (j !== i || (i === 0 && ii===0)) {
                    newRegions.push(recordify<IRRegion, IRegionRecord>({region_id: region.region_id, region_name: region.region_name, epals: new Array(recordify<IRRegionSchool, IRegionSchoolRecord>({epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: epal.selected, order_id: epal.order_id })) }));
                    j = i;
                } else
                    newRegions[i].epals.push(recordify<IRRegionSchool, IRegionSchoolRecord>({epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: epal.selected, order_id: epal.order_id }));
                ii++;
            })
            i++;
        });
        return newRegions;
    case REGIONSCHOOLS_SELECTED_SAVE:
//        let ind=0;
        let region: IRegionRecord;

        region = state[action.payload.rIndex];
        let newState = Array<IRegionRecord>();

        i=0, j=0;
        ii=0;
        state.forEach(region => {
            let epals: IRegionSchoolRecords;
            epals = region.get("epals");
            ii=0;
            epals.forEach(epal => {
                if (j !== i || (i === 0 && ii===0)) {
                    if (i===action.payload.rIndex && ii===action.payload.sIndex)
                        newState.push(recordify<IRRegion, IRegionRecord>({region_id: region.region_id, region_name: region.region_name, epals: new Array(recordify<IRRegionSchool, IRegionSchoolRecord>({epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: action.payload.checked, order_id: epal.order_id })) }));
                    else
                        newState.push(recordify<IRRegion, IRegionRecord>({region_id: region.region_id, region_name: region.region_name, epals: new Array(recordify<IRRegionSchool, IRegionSchoolRecord>({epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: epal.selected, order_id: epal.order_id })) }));
                    j = i;
                } else {
                    if (i===action.payload.rIndex && ii===action.payload.sIndex)
                        newState[i].epals.push(recordify<IRRegionSchool, IRegionSchoolRecord>({epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: action.payload.checked, order_id: epal.order_id }));
                    else
                        newState[i].epals.push(recordify<IRRegionSchool, IRegionSchoolRecord>({epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: epal.selected, order_id: epal.order_id }));
                }
                ii++;
            })
            i++;

        })

        return newState;

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
        region = state[action.payload.rIndex];
        let newState2 = Array<IRegionRecord>();

        i=0, j=0;
        let ind2=0;
        state.forEach(region => {
            let epals: IRegionSchoolRecords;
            epals = region.get("epals");
            epals.forEach(epal => {
                let newOrderId = epal.order_id;
                for (let jjj=0; jjj<3; jjj++) {
                    if (typeof action.payload.selectedSchools[jjj] !== 'undefined' &&
                            epal.globalIndex === action.payload.selectedSchools[jjj].globalIndex) {
                        newOrderId = action.payload.selectedSchools[jjj].order_id;
                        break;
                    }
                }
                if (j !== i || i === 0) {
                    newState2.push(recordify<IRRegion, IRegionRecord>({region_id: region.region_id, region_name: region.region_name, epals: new Array(recordify<IRRegionSchool, IRegionSchoolRecord>({epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: epal.selected, order_id: newOrderId })) }));
                    j = i;
                } else {
                    newState2[i].epals.push(recordify<IRRegionSchool, IRegionSchoolRecord>({epal_id: epal.epal_id, epal_name: epal.epal_name, epal_special_case: epal.epal_special_case, globalIndex: epal.globalIndex, selected: epal.selected, order_id: newOrderId }));
                }
            });
            i++;

        });

        return newState2;
    case REGIONSCHOOLS_INIT:
        return REGION_SCHOOLS_INITIAL_STATE;
    default: return state;
  }
};
