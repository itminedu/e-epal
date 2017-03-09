import { SECTORCOURSES_RECEIVED, SECTORCOURSES_SELECTED_SAVE, SECTORCOURSES_INIT } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import { HelperDataService } from '../services/helper-data-service';

@Injectable()
export class SectorCoursesActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private _hds: HelperDataService) {}

  getSectorCourses = (reload) => {
    const { sectors } = this._ngRedux.getState();
    //if (sectors.size === 0) {
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

 /*
  getSectorCourses_Reload = () => {
    const { sectors } = this._ngRedux.getState();
    //if (sectors.size === 0) {
        return this._hds.getSectorsWithCourses().then(sectors => {
            return this._ngRedux.dispatch({
                type: SECTORCOURSES_RECEIVED,
                payload: {
                    sectors
                }
            });
        });
    //}
  };
  */

  saveSectorCoursesSelected = (sectorCoursesSelected,sectorSelected) => {
      return this._ngRedux.dispatch({
        type: SECTORCOURSES_SELECTED_SAVE,
        payload: {
          sectorCoursesSelected,
          sectorSelected
        }
      });
  };

}
