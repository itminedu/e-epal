import { ILoginInfo, ILoginInfoToken } from './logininfo.types';
import { INITIAL_STATE } from './logininfo.initial-state';
import { Seq } from 'immutable';

import {
  LOGININFO_SAVE
} from '../../constants';

export function loginInfoReducer(state: ILoginInfo = INITIAL_STATE, action): ILoginInfo {
  switch (action.type) {
    case LOGININFO_SAVE:
        let loginInfoTokens = Array<ILoginInfoToken>();
        let ind=0;
        state.forEach(loginInfoToken => {
            loginInfoTokens.push(<ILoginInfoToken>{auth_token: action.payload.loginInfo.auth_token, auth_role: action.payload.loginInfo.auth_role});
            ind++;
        });
        return Seq(loginInfoTokens).map(n => n).toList();
    default: return state;
  }
};
