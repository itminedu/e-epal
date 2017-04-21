import { ILoginInfo, ILoginInfoToken } from './logininfo.types';

export function deimmutifyLoginInfo(state: ILoginInfo): ILoginInfoToken[] {
    let fetchedLoginInfoTokens = new Array();
    state.forEach(loginInfoToken => {
        fetchedLoginInfoTokens.push(<ILoginInfoToken>{auth_token: loginInfoToken.auth_token, auth_role: loginInfoToken.auth_role, cu_name: loginInfoToken.cu_name,
                                                      minedu_username: loginInfoToken.minedu_username, minedu_userpassword: loginInfoToken.minedu_userpassword});
    });
    return fetchedLoginInfoTokens;
};
