import { STUDENTDATAFIELDS_SAVE, STUDENTDATAFIELDS_RECEIVED } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
//import { UserDataService } from '../services/user-data-service';


@Injectable()
export class StudentDataFieldsActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>) {}

  saveStudentDataFields = (studentDataFields) => {

      return this._ngRedux.dispatch({
        type: STUDENTDATAFIELDS_SAVE,
        payload: {
          studentDataFields
        }

      });

  };

}
