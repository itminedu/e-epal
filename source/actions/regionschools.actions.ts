import { REGIONSCHOOLS_RECEIVED, REGIONSCHOOLS_SELECTED_SAVE } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import { HelperDataService } from '../services/helper-data-service';

@Injectable()
export class RegionSchoolsActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private _hds: HelperDataService) {}

  getRegionSchools = () => {
    const { regions } = this._ngRedux.getState();
    if (regions.size === 0) {
        return this._hds.getRegionsWithSchools().then(regions => {
            return this._ngRedux.dispatch({
                type: REGIONSCHOOLS_RECEIVED,
                payload: {
                    regions
                }
            });
        });
    }
  };

  saveRegionSchoolsSelected = (regionSchoolsSelected) => {
      return this._ngRedux.dispatch({
        type: REGIONSCHOOLS_SELECTED_SAVE,
        payload: {
          regionSchoolsSelected
        }
      });
  };

}
