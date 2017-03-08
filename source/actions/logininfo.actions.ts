import { LOGININFO_SAVE, LOGININFO_INIT } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import { HelperDataService } from '../services/helper-data-service';

@Injectable()
export class LoginInfoActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private _hds: HelperDataService) {}

  saveLoginInfo = (loginInfo) => {
      return this._ngRedux.dispatch({
        type: LOGININFO_SAVE,
        payload: {
          loginInfo
        }
      });
  };

  initLoginInfo = () => {
      return this._ngRedux.dispatch({
          type: LOGININFO_INIT,
          payload: {
          }
      });
  };

}
