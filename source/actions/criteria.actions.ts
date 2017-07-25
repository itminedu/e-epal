import { CRITERIA_RECEIVED, CRITERIA_SAVE, CRITERIA_INIT } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';
import { HelperDataService } from '../services/helper-data-service';

@Injectable()
export class CriteriaActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private _hds: HelperDataService) {}

    getCriteria = (reload) => {
        const { criter } = this._ngRedux.getState();
        //if (sectorFields.size === 0) {
        if (reload === true || (reload === false && criter.size === 0)) {
            return this._hds.getCriteria().then(criteria => {
                return this._ngRedux.dispatch({
                    type: CRITERIA_RECEIVED,
                    payload: {
                        criteria
                    }
                });
            });
        }
    };

  saveCriteria = (criter) => {
      return this._ngRedux.dispatch({
        type: CRITERIA_SAVE,
        payload: {
          criter
        }
      });
  };

  initCriteria = () => {
        return this._ngRedux.dispatch({
            type: CRITERIA_INIT,
            payload: {
            }
        });
    };

}
