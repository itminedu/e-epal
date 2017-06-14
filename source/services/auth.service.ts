import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import { AppSettings } from '../app.settings';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../store/store';
import { ILoginInfo, ILoginInfoToken } from '../store/logininfo/logininfo.types';
import { LOGININFO_INITIAL_STATE } from '../store/logininfo/logininfo.initial-state';
import { MINISTRY_ROLE } from '../constants';

@Injectable()
export class AuthService {

    constructor(
        private _ngRedux: NgRedux<IAppState>) {

    };

    isLoggedIn(role) {
        return new Promise((resolve, reject) => {
            this._ngRedux.select(state => {
                return state.loginInfo;
            }).subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoToken) => {
                        if ((loginInfoToken.auth_token && loginInfoToken.auth_token.length > 0 && loginInfoToken.auth_role === role) ||
                        (loginInfoToken.minedu_username && loginInfoToken.minedu_username.length > 0 && loginInfoToken.auth_role === MINISTRY_ROLE && role === MINISTRY_ROLE)
                    ) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                        return loginInfoToken;
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

    isLoggedInForReports(role1,role2,role3) {
        return new Promise((resolve, reject) => {
            this._ngRedux.select(state => {
                return state.loginInfo;
            }).subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoToken) => {
                        if ((loginInfoToken.auth_token && loginInfoToken.auth_token.length > 0 && (loginInfoToken.auth_role === role1 || loginInfoToken.auth_role === role2)) ||
                        (loginInfoToken.minedu_username && loginInfoToken.minedu_username.length > 0 && loginInfoToken.auth_role === MINISTRY_ROLE && role3 === MINISTRY_ROLE)
                    ) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                        return loginInfoToken;
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
        return new Promise((resolve, reject) => {
            this._ngRedux.select(state => {
                return state.loginInfo;
            }).subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoToken) => {
                        if ((loginInfoToken.lock_application && loginInfoToken.lock_application === 1 && loginInfoToken.auth_role === role)) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                        return loginInfoToken;
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
        return new Promise((resolve, reject) => {
            this._ngRedux.select(state => {
                return state.loginInfo;
            }).subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoToken) => {
                        if ((loginInfoToken.lock_students && loginInfoToken.lock_students === 1 && loginInfoToken.auth_role === role)) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                        return loginInfoToken;
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
        return new Promise((resolve, reject) => {
            this._ngRedux.select(state => {
                return state.loginInfo;
            }).subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoToken) => {
                        if ((loginInfoToken.lock_capacity && loginInfoToken.lock_capacity === 1 && loginInfoToken.auth_role === role)) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                        return loginInfoToken;
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
