import { COURSEFIELDS_RECEIVED, COURSEFIELDS_SELECTED_SAVE } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import { HelperDataService } from '../services/helper-data-service';

@Injectable()
export class CourseFieldsActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private _hds: HelperDataService) {}

  getCourseFields = () => {
    const { courseFields } = this._ngRedux.getState();
    if (courseFields.size === 0) {
        return this._hds.getCourseFields().then(courseFields => {
            return this._ngRedux.dispatch({
                type: COURSEFIELDS_RECEIVED,
                payload: {
                    courseFields
                }
            });
        });
    }
  };

  saveCourseFieldsSelected = (courseFieldsSelected) => {
      return this._ngRedux.dispatch({
        type: COURSEFIELDS_SELECTED_SAVE,
        payload: {
          courseFieldsSelected
        }
      });
  };

}
