import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import { Injectable } from "@angular/core";

import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { NgRedux, select } from '@angular-redux/store';
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
    private lockCapacity: BehaviorSubject<boolean>;
    private lockStudents: BehaviorSubject<boolean>;
    private cuName: string;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
 	public cuser :any;
    private loginInfoSub: Subscription;

    constructor( private _ngRedux: NgRedux<IAppState>
                ) {

                        this.authToken = '';
                        this.authRole = '';
                        this.lockCapacity = new BehaviorSubject(true);
                        this.lockStudents = new BehaviorSubject(true);
                        this.cuName = '';
                        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);

        };

    ngOnInit() {
        this.loginInfoSub = this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    this.authToken = loginInfoToken.auth_token;
                    this.authRole = loginInfoToken.auth_role;
                    if (loginInfoToken.lock_capacity === 1)
                        this.lockCapacity.next(true);
                    else
                        this.lockCapacity.next(false);
                    if (loginInfoToken.lock_students === 1)
                        this.lockStudents.next(true);
                    else
                        this.lockStudents.next(false);
                    this.cuName = loginInfoToken.cu_name;
                    return loginInfoToken;
                }, {})
            }

            return state.loginInfo;
        }).subscribe(this.loginInfo$);

    }

    ngOnDestroy() {
        if (this.loginInfoSub)
            this.loginInfoSub.unsubscribe();

    }

}
