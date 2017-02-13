import { EPALCLASSES_SAVE } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';


@Injectable()
export class EpalClassesActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>) {}


  saveEpalClassesSelected = (epalClasses) => {
      return this._ngRedux.dispatch({
        type: EPALCLASSES_SAVE,
        payload: {
          epalClasses
        }
      });
  };

}





