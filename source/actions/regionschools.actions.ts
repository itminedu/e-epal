import { REGIONSCHOOLS_RECEIVED, REGIONSCHOOLS_SELECTED_SAVE,  REGIONSCHOOLS_ORDER_SAVE, REGIONSCHOOLS_INIT } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import { HelperDataService } from '../services/helper-data-service';

@Injectable()
export class RegionSchoolsActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private _hds: HelperDataService) {}

  getRegionSchools = (classActive,courseActive, reload) => {
    const { regions } = this._ngRedux.getState();
    if (reload === true || (reload === false && regions.size === 0)) {
        return this._hds.getRegionsWithSchools(classActive,courseActive).then(regions => {
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

  /*
  getRegionSchools_Reload = (courseActive) => {
    const { regions } = this._ngRedux.getState();
    //if (regions.size === 0) {
        return this._hds.getRegionsWithSchools(courseActive).then(regions => {
            return this._ngRedux.dispatch({
                type: REGIONSCHOOLS_RECEIVED,
                payload: {
                    regions
                }
            });
        });
    //}
  };
  */

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

  saveRegionSchoolsOrder = (regionSchoolsOrder) => {
      return this._ngRedux.dispatch({
        type: REGIONSCHOOLS_ORDER_SAVE,
        payload: {
          regionSchoolsOrder
        }
      });
  };

}
