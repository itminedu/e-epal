import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import { AppSettings } from '../app.settings';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../store/store';
import { ILoginInfo, ILoginInfoToken } from '../store/logininfo/logininfo.types';
import { LOGININFO_INITIAL_STATE } from '../store/logininfo/logininfo.initial-state';

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
                        if (loginInfoToken.auth_token && loginInfoToken.auth_token.length > 0 && loginInfoToken.auth_role === role) {
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
                },
                () => console.log("Getting Auth Data"));
        });
    }

}
