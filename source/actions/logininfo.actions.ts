import { LOGININFO_SAVE, PROFILE_SAVE, LOGININFO_RECEIVED, STATEMENTAGREE_SAVE } from '../constants';
import { LOGININFO_INIT } from '../constants';
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';
import { HelperDataService } from '../services/helper-data-service';

@Injectable()
export class LoginInfoActions {
  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private _hds: HelperDataService) {}


 getloginInfo = (loginInfo) => {
 return this._hds.getCurrentUser(loginInfo.auth_token, loginInfo.auth_role).then (loginInfos => {
      return this._ngRedux.dispatch({
        type: LOGININFO_SAVE,
        payload: {
          loginInfos
        }
      });
  });
}

 saveMinEduloginInfo = (loginInfos) => {
   return this._ngRedux.dispatch({
    type: LOGININFO_SAVE,
    payload: {
      loginInfos
    }
  });
};

saveProfile = (profile) => {
  return this._ngRedux.dispatch({
   type: PROFILE_SAVE,
   payload: {
     profile
   }
 });
};

saveStatementAgree = (disclaimer_checked) => {
  return this._ngRedux.dispatch({
   type: STATEMENTAGREE_SAVE,
   payload: {
     disclaimer_checked
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
