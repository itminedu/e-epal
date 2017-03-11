import { List } from 'immutable';

export interface ILoginInfoToken {
    auth_token: string;
    auth_role: string;
    cu_name: string;
    xcsrftoken:string;
}

export type ILoginInfo = List<ILoginInfoToken>;
