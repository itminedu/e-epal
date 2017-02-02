import { CLASSFIELDS_RECEIVED, CLASSFIELDS_SELECTED_SAVE } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import { HelperDataService } from '../services/helper-data-service';

@Injectable()
export class ClassFieldsActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private _hds: HelperDataService) {}

  getClassFields = () => {
    const { classFields } = this._ngRedux.getState();
    if (classFields.size === 0) {
        return this._hds.getClassFields().then(classFields => {
            return this._ngRedux.dispatch({
                type: CLASSFIELDS_RECEIVED,
                payload: {
                    classFields
                }
            });
        });
    }
  };

  saveClassFieldsSelected = (classFieldsSelected) => {
      return this._ngRedux.dispatch({
        type: CLASSFIELDS_SELECTED_SAVE,
        payload: {
          classFieldsSelected
        }
      });
  };

}
