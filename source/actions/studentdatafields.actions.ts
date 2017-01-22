import { STUDENTDATAFIELDS_SAVE, STUDENTDATAFIELDS_RECEIVED } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
//import { HelperDataService } from '../services/helper-data-service';
import { UserDataService } from '../services/user-data-service';


@Injectable()
export class StudentDataFieldsActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private _hds: UserDataService) {}


    getStudentDataFields = () => {
      const { studentDataFields } = this._ngRedux.getState();
      //console.log(studentdataFields);
      if (studentDataFields.size === 0) {
          return this._hds.getStudentDataFields().then(studentdataFields => {
              return this._ngRedux.dispatch({
                  type: STUDENTDATAFIELDS_RECEIVED,
                  payload: {
                      studentdataFields
                  }
              });
          });
        }
    };
  /*
  getStudentDataFields = () => {
      return this._hds.getStudentDataFields().then(studentdataFields => {
        return this._ngRedux.dispatch({
          type: STUDENTDATAFIELDS_RECEIVED,
          payload: {
            studentdataFields
          }
        });
      });
    };
  */

  saveStudentDataFields = (studentDataFields) => {

      return this._ngRedux.dispatch({
        type: STUDENTDATAFIELDS_SAVE,
        payload: {
          studentDataFields
        }

      });

  };

}
