import { List } from "immutable";
import { TypedRecord } from "typed-immutable-record";

export interface ILoginInfoObj {
    auth_token: string;
    auth_role: string;
    cu_name: string;
    cu_surname: string;
    cu_fathername: string;
    cu_mothername: string;
    cu_email: string;
    minedu_username: string;
    minedu_userpassword: string;
    lock_capacity: number;
    lock_students: number;
    lock_application: number;
    disclaimer_checked: number;
}

export interface ILoginInfoRecord extends TypedRecord<ILoginInfoRecord>, ILoginInfoObj { };
export type ILoginInfoRecords = List<ILoginInfoRecord>;
