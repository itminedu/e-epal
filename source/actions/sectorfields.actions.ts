import { NgRedux } from "@angular-redux/store";
import { Injectable } from "@angular/core";

import { SECTORFIELDS_INIT, SECTORFIELDS_RECEIVED, SECTORFIELDS_SELECTED_SAVE } from "../constants";
import { HelperDataService } from "../services/helper-data-service";
import { IAppState } from "../store";

@Injectable()
export class SectorFieldsActions {
    constructor(
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService) { }

    getSectorFields = (reload) => {
        const { sectorFields } = this._ngRedux.getState();
        // if (sectorFields.size === 0) {
        if (reload === true || (reload === false && sectorFields.size === 0)) {
            return this._hds.getSectorFields().then(sectorFields => {
                return this._ngRedux.dispatch({
                    type: SECTORFIELDS_RECEIVED,
                    payload: {
                        sectorFields
                    }
                });
            });
        }
    };

    initSectorFields = () => {
        return this._ngRedux.dispatch({
            type: SECTORFIELDS_INIT,
            payload: {
            }
        });
    };


    saveSectorFieldsSelected = (prevChoice: number, newChoice: number) => {
        return this._ngRedux.dispatch({
            type: SECTORFIELDS_SELECTED_SAVE,
            payload: {
                prevChoice: prevChoice,
                newChoice: newChoice
            }
        });
    };

}
