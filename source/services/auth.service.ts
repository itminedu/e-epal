import "rxjs/add/operator/map";

import { NgRedux } from "@angular-redux/store";
import { Injectable } from "@angular/core";

import { MINISTRY_ROLE } from "../constants";
import { ILoginInfoRecords } from "../store/logininfo/logininfo.types";
import { IAppState } from "../store/store";

@Injectable()
export class AuthService {
    constructor(
        private _ngRedux: NgRedux<IAppState>) {
    };

    isLoggedIn(role) {
        return new Promise<boolean>((resolve, reject) => {
            this._ngRedux.select("loginInfo")
                .map(loginInfo => <ILoginInfoRecords>loginInfo)
                .subscribe(linfo => {

                    if (linfo.size > 0) {
                        linfo.reduce(({}, loginInfoObj) => {
                            if ((loginInfoObj.auth_token && loginInfoObj.auth_token.length > 0 && loginInfoObj.auth_role === role) ||
                                (loginInfoObj.minedu_username && loginInfoObj.minedu_username.length > 0 && loginInfoObj.auth_role === MINISTRY_ROLE && role === MINISTRY_ROLE)
                            ) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                            return loginInfoObj;
                        }, {});
                    } else
                        resolve(false);
                },
                error => {
                    console.log("Error Getting Auth Data");
                    reject(false);
                });
        });
    }

    isLoggedInForReports(role1, role2, role3) {
        return new Promise<boolean>((resolve, reject) => {
            this._ngRedux.select("loginInfo")
                .map(loginInfo => <ILoginInfoRecords>loginInfo)
                .subscribe(loginInfo => {
                    if (loginInfo.size > 0) {
                        loginInfo.reduce(({}, loginInfoObj) => {
                            if ((loginInfoObj.auth_token && loginInfoObj.auth_token.length > 0 && (loginInfoObj.auth_role === role1 || loginInfoObj.auth_role === role2)) ||
                                (loginInfoObj.minedu_username && loginInfoObj.minedu_username.length > 0 && loginInfoObj.auth_role === MINISTRY_ROLE && role3 === MINISTRY_ROLE)
                            ) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                            return loginInfoObj;
                        }, {});
                    } else
                        resolve(false);
                },
                error => {
                    console.log("Error Getting Auth Data");
                    reject("Error Getting Auth Data");
                });
        });
    }

    isApplicationLocked(role) {
        return new Promise<boolean>((resolve, reject) => {
            this._ngRedux.select("loginInfo")
                .map(loginInfo => <ILoginInfoRecords>loginInfo)
                .subscribe(linfo => {
                    if (linfo.size > 0) {
                        linfo.reduce(({}, loginInfoObj) => {
                            if ((loginInfoObj.lock_application && loginInfoObj.lock_application === 1 && loginInfoObj.auth_role === role)) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                            return loginInfoObj;
                        }, {});
                    } else
                        resolve(false);
                },
                error => {
                    console.log("Error Getting Auth Data");
                    reject("Error Getting Auth Data");
                });
        });
    }

    isStudentsLocked(role) {
        return new Promise<boolean>((resolve, reject) => {
            this._ngRedux.select("loginInfo")
                .map(loginInfo => <ILoginInfoRecords>loginInfo)
                .subscribe(loginInfo => {
                    if (loginInfo.size > 0) {
                        loginInfo.reduce(({}, loginInfoObj) => {
                            if ((loginInfoObj.lock_students && loginInfoObj.lock_students === 1 && loginInfoObj.auth_role === role)) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                            return loginInfoObj;
                        }, {});
                    } else
                        resolve(false);
                },
                error => {
                    console.log("Error Getting Auth Data");
                    reject("Error Getting Auth Data");
                });
        });
    }

    isCapacityLocked(role) {
        return new Promise<boolean>((resolve, reject) => {
            this._ngRedux.select("loginInfo")
                .map(loginInfo => <ILoginInfoRecords>loginInfo)
                .subscribe(loginInfo => {
                    if (loginInfo.size > 0) {
                        loginInfo.reduce(({}, loginInfoObj) => {
                            if ((loginInfoObj.lock_capacity && loginInfoObj.lock_capacity === 1 && loginInfoObj.auth_role === role)) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                            return loginInfoObj;
                        }, {});
                    } else
                        resolve(false);
                },
                error => {
                    console.log("Error Getting Auth Data");
                    reject("Error Getting Auth Data");
                });
        });
    }

}
