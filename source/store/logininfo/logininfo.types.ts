import { List } from 'immutable';

export interface ILoginInfoToken {
    auth_token: string;
    auth_role: string;
    cu_name: string;
    minedu_username: string;
    minedu_userpassword: string;
}

export type ILoginInfo = List<ILoginInfoToken>;
