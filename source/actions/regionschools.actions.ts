import { NgRedux } from "@angular-redux/store";
import { Injectable } from "@angular/core";

import {
    REGIONSCHOOLS_INIT,
    REGIONSCHOOLS_ORDER_SAVE,
    REGIONSCHOOLS_RECEIVED,
    REGIONSCHOOLS_SELECTED_SAVE,
} from "../constants";
import { HelperDataService } from "../services/helper-data-service";
import { IAppState } from "../store";

@Injectable()
export class RegionSchoolsActions {
    constructor(
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService) { }

    getRegionSchools = (classActive, courseActive, reload) => {
        const { regions } = this._ngRedux.getState();
        if (reload === true || (reload === false && regions.size === 0)) {
            return this._hds.getRegionsWithSchools(classActive, courseActive).then(regions => {
                return this._ngRedux.dispatch({
                    type: REGIONSCHOOLS_RECEIVED,
                    payload: {
                        regions
                    }
                });
            });
        }
    };

    initRegionSchools = () => {
        return this._ngRedux.dispatch({
            type: REGIONSCHOOLS_INIT,
            payload: {
            }
        });
    };

    saveRegionSchoolsSelected = (checked, i, j) => {
        return this._ngRedux.dispatch({
            type: REGIONSCHOOLS_SELECTED_SAVE,
            payload: {
                checked: checked,
                rIndex: i,
                sIndex: j
            }
        });
    };

    saveRegionSchoolsOrder = (selectedSchools) => {
        return this._ngRedux.dispatch({
            type: REGIONSCHOOLS_ORDER_SAVE,
            payload: {
                selectedSchools
            }
        });
    };

}
