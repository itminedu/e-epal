import { AMKAFILL_SAVE } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';

@Injectable()
export class AmkaFillsActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>) {}


  saveAmkaFills = (amkaFills) => {
      return this._ngRedux.dispatch({
        type: AMKAFILL_SAVE,
        payload: {
          amkaFills
        }
      });
  };

}