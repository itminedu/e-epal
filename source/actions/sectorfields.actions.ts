import { SECTORFIELDS_RECEIVED, SECTORFIELDS_SELECTED_SAVE, SECTORFIELDS_INIT } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import { HelperDataService } from '../services/helper-data-service';

@Injectable()
export class SectorFieldsActions {
    constructor(
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService) { }

    getSectorFields = (reload) => {
        const { sectorFields } = this._ngRedux.getState();
        //if (sectorFields.size === 0) {
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


    saveSectorFieldsSelected = (sectorFieldsSelected) => {
        return this._ngRedux.dispatch({
            type: SECTORFIELDS_SELECTED_SAVE,
            payload: {
                sectorFieldsSelected
            }
        });
    };

}
