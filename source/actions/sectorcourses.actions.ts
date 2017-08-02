import { NgRedux } from "@angular-redux/store";
import { Injectable } from "@angular/core";

import { SECTORCOURSES_INIT, SECTORCOURSES_RECEIVED, SECTORCOURSES_SELECTED_SAVE } from "../constants";
import { HelperDataService } from "../services/helper-data-service";
import { IAppState } from "../store";

@Injectable()
export class SectorCoursesActions {
    constructor(
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService) { }

    getSectorCourses = (reload) => {
        const { sectors } = this._ngRedux.getState();
        // if (sectors.size === 0) {
        if (reload === true || (reload === false && sectors.size === 0)) {
            return this._hds.getSectorsWithCourses().then(sectors => {
                return this._ngRedux.dispatch({
                    type: SECTORCOURSES_RECEIVED,
                    payload: {
                        sectors
                    }
                });
            });
        }
    };

    initSectorCourses = () => {
        return this._ngRedux.dispatch({
            type: SECTORCOURSES_INIT,
            payload: {
            }
        });
    };

    saveSectorCoursesSelected = (oldSIndex, oldCIndex, checked, i, j) => {
        return this._ngRedux.dispatch({
            type: SECTORCOURSES_SELECTED_SAVE,
            payload: {
                oldSIndex: oldSIndex,
                oldCIndex: oldCIndex,
                checked: checked,
                sIndex: i,
                cIndex: j
            }
        });
    };

}
