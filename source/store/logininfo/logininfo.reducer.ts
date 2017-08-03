import { List } from "immutable";
import { recordify } from "typed-immutable-record";

import { LOGININFO_INIT, LOGININFO_SAVE, PROFILE_SAVE, STATEMENTAGREE_SAVE } from "../../constants";
import { LOGININFO_INITIAL_STATE } from "./logininfo.initial-state";
import { ILoginInfoObj, ILoginInfoRecord, ILoginInfoRecords } from "./logininfo.types";

export function loginInfoReducer(state: ILoginInfoRecords = LOGININFO_INITIAL_STATE, action): ILoginInfoRecords {
    switch (action.type) {
        case LOGININFO_SAVE:

            let loginInfoArray = Array<ILoginInfoRecord>();

            action.payload.loginInfos.forEach(loginInfo => {
                loginInfoArray.push(recordify<ILoginInfoObj, ILoginInfoRecord>({
                    auth_token: loginInfo.auth_token,
                    auth_role: loginInfo.auth_role,
                    cu_name: loginInfo.cu_name,
                    cu_surname: loginInfo.cu_surname,
                    cu_fathername: loginInfo.cu_fathername,
                    cu_mothername: loginInfo.cu_mothername,
                    cu_email: loginInfo.cu_email,
                    minedu_username: loginInfo.minedu_username,
                    minedu_userpassword: loginInfo.minedu_userpassword,
                    lock_capacity: loginInfo.lock_capacity,
                    lock_students: loginInfo.lock_students,
                    lock_application: loginInfo.lock_application,
                    disclaimer_checked: loginInfo.disclaimer_checked
                }));
        });

        return List(loginInfoArray);

        case PROFILE_SAVE:
            return state.withMutations(function(list) {
                list.setIn([0, "cu_name"], action.payload.profile.userName);
                list.setIn([0, "cu_surname"], action.payload.profile.userSurname);
                list.setIn([0, "cu_fathername"], action.payload.profile.userFathername);
                list.setIn([0, "cu_mothername"], action.payload.profile.userMothername);
            });

        case STATEMENTAGREE_SAVE:
            return state.withMutations(function(list) {
                list.setIn([0, "disclaimer_checked"], action.payload.disclaimer_checked);
            });

        case LOGININFO_INIT:
            return LOGININFO_INITIAL_STATE;
        default:
            return state;
    }
};
