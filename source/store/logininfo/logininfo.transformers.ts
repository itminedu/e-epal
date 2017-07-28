import { ILoginInfo, ILoginInfoToken } from "./logininfo.types";

export function deimmutifyLoginInfo(state: ILoginInfo): ILoginInfoToken[] {
    let fetchedLoginInfoTokens = new Array();
    state.forEach(loginInfoToken => {
        fetchedLoginInfoTokens.push(<ILoginInfoToken>{
            auth_token: loginInfoToken.auth_token,
            auth_role: loginInfoToken.auth_role,
            cu_name: loginInfoToken.cu_name,
            cu_surname: loginInfoToken.cu_surname,
            cu_fathername: loginInfoToken.cu_fathername,
            cu_mothername: loginInfoToken.cu_mothername,
            cu_email: loginInfoToken.cu_email,
            minedu_username: loginInfoToken.minedu_username,
            minedu_userpassword: loginInfoToken.minedu_userpassword,
            lock_capacity: loginInfoToken.lock_capacity,
            lock_students: loginInfoToken.lock_students,
            lock_application: loginInfoToken.lock_application,
            disclaimer_checked: loginInfoToken.disclaimer_checked
        });
    });
    return fetchedLoginInfoTokens;
};
