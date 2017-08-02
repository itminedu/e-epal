import { NgRedux } from "@angular-redux/store";
import { Injectable } from "@angular/core";

import { STUDENTDATAFIELDS_INIT, STUDENTDATAFIELDS_SAVE } from "../constants";
import { IAppState } from "../store";

@Injectable()
export class StudentDataFieldsActions {
    constructor(
        private _ngRedux: NgRedux<IAppState>) { }

    saveStudentDataFields = (studentDataFields) => {

        return this._ngRedux.dispatch({
            type: STUDENTDATAFIELDS_SAVE,
            payload: {
                studentDataFields
            }
        });

    };

    initStudentDataFields = () => {
        return this._ngRedux.dispatch({
            type: STUDENTDATAFIELDS_INIT,
            payload: {
            }
        });
    };

}
