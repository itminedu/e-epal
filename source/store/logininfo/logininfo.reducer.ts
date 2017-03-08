import { ILoginInfo, ILoginInfoToken } from './logininfo.types';
import { INITIAL_STATE } from './logininfo.initial-state';
import { Seq } from 'immutable';

import {
  LOGININFO_SAVE,
  LOGININFO_INIT
} from '../../constants';

export function loginInfoReducer(state: ILoginInfo = INITIAL_STATE, action): ILoginInfo {
  switch (action.type) {
    case LOGININFO_SAVE:
        let loginInfoTokens = Array<ILoginInfoToken>();
        loginInfoTokens.push(<ILoginInfoToken>{auth_token: action.payload.loginInfo.auth_token, auth_role: action.payload.loginInfo.auth_role});
        return Seq(loginInfoTokens).map(n => n).toList();
    case LOGININFO_INIT:
        return INITIAL_STATE;
    default:
        return state;
  }
};
