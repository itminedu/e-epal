import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import { Injectable } from "@angular/core";

import { BehaviorSubject } from 'rxjs/Rx';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { ILoginInfo, ILoginInfoToken } from '../../store/logininfo/logininfo.types';
import { LoginInfoActions } from '../../actions/logininfo.actions';
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';

@Component({
  selector: 'reg-navbar',
  templateUrl: 'navbar.component.html',
})

@Injectable() export default class NavbarComponent implements OnInit, OnDestroy{
    private authToken: string;
    private authRole: string;
    private cuName: string;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
 	public cuser :any;

    constructor( private _ngRedux: NgRedux<IAppState>
                ) {

                        this.authToken = '';
                        this.authRole = '';
                        this.cuName = '';
                        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);

        };

    ngOnInit() {
        this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    this.authToken = loginInfoToken.auth_token;
                    this.authRole = loginInfoToken.auth_role;
                    this.cuName = loginInfoToken.cu_name;
                    return loginInfoToken;
                }, {})
            }

            return state.loginInfo;
        }).subscribe(this.loginInfo$);

    }

    ngOnDestroy() {
        this.loginInfo$.unsubscribe();

    }

}
