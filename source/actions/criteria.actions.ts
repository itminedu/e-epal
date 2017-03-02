import { CRITERIA_SAVE} from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';

@Injectable()
export class CriteriaActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>) {}

  saveCriteria = (criter) => {
      return this._ngRedux.dispatch({
        type: CRITERIA_SAVE,
        payload: {
          criter
        }
      });
  };

}
