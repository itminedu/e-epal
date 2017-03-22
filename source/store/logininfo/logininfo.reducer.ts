import { ILoginInfo, ILoginInfoToken } from './logininfo.types';
import { LOGININFO_INITIAL_STATE } from './logininfo.initial-state';
import { Seq } from 'immutable';

import {
  LOGININFO_SAVE,
  LOGININFO_INIT
} from '../../constants';

export function loginInfoReducer(state: ILoginInfo = LOGININFO_INITIAL_STATE, action): ILoginInfo {
  switch (action.type) {
    case LOGININFO_SAVE:
		let loginInfoTokens = Array<ILoginInfoToken>();
        let i=0;
        action.payload.loginInfos.forEach(loginInfo => {
            loginInfoTokens.push(<ILoginInfoToken>{auth_token: loginInfo.auth_token, auth_role: loginInfo.auth_role, cu_name: loginInfo.cu_name});
            i++;
        });
        return Seq(loginInfoTokens).map(n => n).toList();

    case LOGININFO_INIT:
        return LOGININFO_INITIAL_STATE;
    default:
        return state;
  }
};
