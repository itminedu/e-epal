import { SECTORCOURSES_RECEIVED, SECTORCOURSES_SECTOR_SELECTED_SAVE, SECTORCOURSES_SELECTED_SAVE, SECTORCOURSES_INIT } from "../constants";
import { Injectable } from "@angular/core";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../store";
import { HelperDataService } from "../services/helper-data-service";

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

    selectSector = (prevChoice, newChoice) => {
        return this._ngRedux.dispatch({
            type: SECTORCOURSES_SECTOR_SELECTED_SAVE,
            payload: {
                prevChoice: prevChoice,
                newChoice: newChoice
//                sectorCoursesSelected,
//                sectorSelected
            }
        });
    }

    saveSectorCoursesSelected = (oldSIndex, oldCIndex, checked, i, j) => {
        return this._ngRedux.dispatch({
            type: SECTORCOURSES_SELECTED_SAVE,
            payload: {
                oldSIndex: oldSIndex,
                oldCIndex: oldCIndex,
                checked: checked,
                sIndex: i,
                cIndex: j
//                sectorCoursesSelected,
//                sectorSelected
            }
        });
    };

}
